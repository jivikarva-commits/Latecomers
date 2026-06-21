"""Razorpay subscription and payment routes."""
import json
import os
import uuid
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import Dict

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel

from auth_routes import current_user
from subscription_utils import (
    PLAN_CONFIG,
    active_subscription,
    build_subscription_record,
    current_usage,
    db,
    ensure_quiz_result_access,
    iso_now,
    public_plan_list,
    subscription_features,
    verify_razorpay_signature,
    verify_webhook_signature,
)

router = APIRouter(tags=["payments"])


class OrderIn(BaseModel):
    plan: str


class VerifyIn(BaseModel):
    plan: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


def razorpay_keys():
    key_id = os.environ.get("RAZORPAY_KEY_ID", "").strip()
    key_secret = os.environ.get("RAZORPAY_KEY_SECRET", "").strip()
    if not key_id or not key_secret:
        raise HTTPException(503, "Razorpay is not configured on the server.")
    return key_id, key_secret


def admin_emails():
    raw = os.environ.get("ADMIN_EMAILS", "").strip() or "latecomers.in@gmail.com"
    allowed = {email.strip().lower() for email in raw.split(",") if email.strip()}
    allowed.add("latecomers.in@gmail.com")
    return allowed


def require_admin(user: Dict):
    allowed = admin_emails()
    if not allowed or (user.get("email") or "").lower() not in allowed:
        raise HTTPException(403, "Admin access required.")


def _parse_dt(value):
    if isinstance(value, datetime):
        dt = value
    elif isinstance(value, str) and value:
        try:
            dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError:
            return None
    else:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt


def _date_key(value):
    dt = _parse_dt(value)
    return dt.date().isoformat() if dt else "unknown"


def _month_key(value):
    dt = _parse_dt(value)
    return dt.strftime("%Y-%m") if dt else "unknown"


def _phone_from_user(user: Dict):
    profile = user.get("profile") or {}
    return (
        user.get("phoneNumber")
        or user.get("phone")
        or user.get("mobile")
        or profile.get("phoneNumber")
        or profile.get("phone")
        or profile.get("mobile")
        or ""
    )


def _count_since(items, field, since):
    count = 0
    for item in items:
        dt = _parse_dt(item.get(field))
        if dt and dt >= since:
            count += 1
    return count


@router.get("/subscriptions/plans")
async def list_subscription_plans():
    return {"plans": public_plan_list()}


@router.get("/subscriptions/me")
async def my_subscription(user=Depends(current_user)):
    return {
        "subscription": active_subscription(user),
        "features": subscription_features(user),
        "usage": current_usage(user),
        "hasQuizResultAccess": bool(subscription_features(user).get("quizResultAccess")),
    }


@router.get("/subscriptions/quiz-access")
async def quiz_access(user=Depends(current_user)):
    ensure_quiz_result_access(user)
    return {"ok": True}


@router.post("/payments/razorpay/order")
async def create_razorpay_order(payload: OrderIn, request: Request, user=Depends(current_user)):
    if payload.plan not in PLAN_CONFIG:
        raise HTTPException(400, "Invalid plan selected.")
    key_id, key_secret = razorpay_keys()
    plan = PLAN_CONFIG[payload.plan]
    receipt = f"latecomers_{user['user_id']}_{uuid.uuid4().hex[:8]}"
    order_payload = {
        "amount": int(plan["amount"] * 100),
        "currency": plan["currency"],
        "receipt": receipt,
        "notes": {
            "userId": user["user_id"],
            "email": user.get("email", ""),
            "plan": payload.plan,
        },
    }
    async with httpx.AsyncClient(timeout=20.0, auth=(key_id, key_secret)) as client:
        response = await client.post("https://api.razorpay.com/v1/orders", json=order_payload)
    if response.status_code >= 400:
        await db(request).payments.insert_one(
            {
                "userId": user["user_id"],
                "userEmail": user.get("email"),
                "selectedPlanName": plan["name"],
                "plan": payload.plan,
                "originalPrice": plan["originalPrice"],
                "paidAmount": plan["amount"],
                "paymentStatus": "order_failed",
                "error": response.text[:500],
                "createdAt": iso_now(),
            }
        )
        raise HTTPException(502, "Could not create Razorpay order. Please try again.")
    order = response.json()
    await db(request).payments.insert_one(
        {
            "userId": user["user_id"],
            "userEmail": user.get("email"),
            "selectedPlanName": plan["name"],
            "plan": payload.plan,
            "originalPrice": plan["originalPrice"],
            "paidAmount": plan["amount"],
            "currency": plan["currency"],
            "razorpayOrderId": order.get("id"),
            "paymentStatus": "created",
            "createdAt": iso_now(),
        }
    )
    return {
        "keyId": key_id,
        "orderId": order.get("id"),
        "amount": order.get("amount"),
        "currency": order.get("currency"),
        "plan": {
            "key": plan["key"],
            "name": plan["name"],
            "amount": plan["amount"],
            "originalPrice": plan["originalPrice"],
        },
        "user": {"name": user.get("name"), "email": user.get("email")},
    }


@router.post("/payments/razorpay/verify")
async def verify_payment(payload: VerifyIn, request: Request, user=Depends(current_user)):
    if payload.plan not in PLAN_CONFIG:
        raise HTTPException(400, "Invalid plan selected.")
    order_doc = await db(request).payments.find_one(
        {
            "razorpayOrderId": payload.razorpay_order_id,
            "userId": user["user_id"],
            "plan": payload.plan,
        },
        {"_id": 0},
    )
    if not order_doc:
        raise HTTPException(404, "Payment order was not found for this user.")
    _, key_secret = razorpay_keys()
    if not verify_razorpay_signature(
        payload.razorpay_order_id,
        payload.razorpay_payment_id,
        payload.razorpay_signature,
        key_secret,
    ):
        await db(request).payments.update_one(
            {"razorpayOrderId": payload.razorpay_order_id},
            {"$set": {"paymentStatus": "signature_failed", "updatedAt": iso_now()}},
            upsert=True,
        )
        raise HTTPException(400, "Payment verification failed.")

    sub_record = build_subscription_record(
        user,
        payload.plan,
        payload.razorpay_order_id,
        payload.razorpay_payment_id,
        "paid",
    )
    subscription_doc = {**sub_record, "status": "active", "createdAt": iso_now()}
    await db(request).subscriptions.insert_one(subscription_doc)
    await db(request).payments.update_one(
        {"razorpayOrderId": payload.razorpay_order_id},
        {
            "$set": {
                **sub_record,
                "paymentStatus": "paid",
                "updatedAt": iso_now(),
            }
        },
        upsert=True,
    )
    await db(request).users.update_one(
        {"user_id": user["user_id"]},
        {
            "$set": {
                "subscription": {
                    "provider": "razorpay",
                    "status": "active",
                    "plan": payload.plan,
                    "planName": PLAN_CONFIG[payload.plan]["name"],
                    "originalPrice": PLAN_CONFIG[payload.plan]["originalPrice"],
                    "paidAmount": PLAN_CONFIG[payload.plan]["amount"],
                    "currency": PLAN_CONFIG[payload.plan]["currency"],
                    "razorpayOrderId": payload.razorpay_order_id,
                    "razorpayPaymentId": payload.razorpay_payment_id,
                    "featureLimits": PLAN_CONFIG[payload.plan]["features"],
                    "startedAt": sub_record["purchaseDate"],
                    "expiresAt": sub_record["planExpiryDate"],
                },
                "usage": {
                    **sub_record["featureLimits"],
                    "periodStartedAt": sub_record["purchaseDate"],
                },
                "updated_at": iso_now(),
            }
        },
    )
    updated_user = await db(request).users.find_one({"user_id": user["user_id"]}, {"_id": 0})
    return {"ok": True, "subscription": updated_user.get("subscription"), "usage": updated_user.get("usage"), "user": updated_user}


@router.post("/payments/razorpay/webhook")
async def razorpay_webhook(request: Request):
    secret = os.environ.get("RAZORPAY_WEBHOOK_SECRET", "").strip()
    body = await request.body()
    if secret:
        signature = request.headers.get("X-Razorpay-Signature", "")
        if not verify_webhook_signature(body, signature, secret):
            raise HTTPException(400, "Invalid webhook signature.")
    event = json.loads(body.decode("utf-8") or "{}")
    payment = ((event.get("payload") or {}).get("payment") or {}).get("entity") or {}
    order_id = payment.get("order_id")
    if order_id:
        await db(request).payments.update_one(
            {"razorpayOrderId": order_id},
            {
                "$set": {
                    "webhookEvent": event.get("event"),
                    "webhookPaymentStatus": payment.get("status"),
                    "webhookAt": iso_now(),
                }
            },
            upsert=True,
        )
    return {"ok": True}


@router.get("/admin/revenue")
async def revenue_dashboard(request: Request, user=Depends(current_user)):
    require_admin(user)
    payments = await db(request).payments.find({}, {"_id": 0}).sort("createdAt", -1).to_list(5000)
    all_users = await db(request).users.find({}, {"_id": 0}).sort("created_at", -1).to_list(5000)
    sessions = await db(request).user_sessions.find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
    users = [item for item in all_users if (item.get("subscription") or {}).get("status") == "active"]
    now = datetime.now(timezone.utc)

    successful = [p for p in payments if p.get("paymentStatus") == "paid"]
    failed = [p for p in payments if p.get("paymentStatus") in {"failed", "order_failed", "signature_failed"}]
    total_money = sum(int(p.get("paidAmount") or 0) for p in successful)
    by_plan = defaultdict(lambda: {"amount": 0, "count": 0})
    daily = defaultdict(int)
    monthly = defaultdict(int)
    active_by_plan = defaultdict(int)

    for p in successful:
        plan = p.get("selectedPlanName") or p.get("plan") or "Unknown"
        by_plan[plan]["amount"] += int(p.get("paidAmount") or 0)
        by_plan[plan]["count"] += 1
        dt = p.get("purchaseDate") or p.get("updatedAt") or p.get("createdAt") or ""
        day = dt[:10] or "unknown"
        month = dt[:7] or "unknown"
        daily[day] += int(p.get("paidAmount") or 0)
        monthly[month] += int(p.get("paidAmount") or 0)

    user_by_id = {item.get("user_id"): item for item in all_users if item.get("user_id")}
    login_counts = defaultdict(int)
    last_login = {}
    active_session_users = set()
    for session in sessions:
        uid = session.get("user_id")
        if not uid:
            continue
        login_counts[uid] += 1
        created = session.get("created_at") or session.get("createdAt")
        created_dt = _parse_dt(created)
        if created_dt and (uid not in last_login or created_dt > last_login[uid]):
            last_login[uid] = created_dt
        expires_dt = _parse_dt(session.get("expires_at"))
        if expires_dt and expires_dt >= now:
            active_session_users.add(uid)

    login_users = []
    for uid, count in sorted(login_counts.items(), key=lambda item: last_login.get(item[0]) or datetime.min.replace(tzinfo=timezone.utc), reverse=True):
        item = user_by_id.get(uid) or {}
        login_users.append(
            {
                "userId": uid,
                "name": item.get("name"),
                "email": item.get("email"),
                "mobile": _phone_from_user(item),
                "loginCount": count,
                "lastLoginAt": last_login.get(uid).isoformat() if uid in last_login else "",
                "isActiveSession": uid in active_session_users,
                "createdAt": item.get("created_at"),
            }
        )

    paid_by_user = {}
    for payment in successful:
        uid = payment.get("userId") or payment.get("user_id")
        email = (payment.get("userEmail") or "").lower()
        key = uid or email
        if not key:
            continue
        current_dt = _parse_dt(payment.get("purchaseDate") or payment.get("updatedAt") or payment.get("createdAt")) or datetime.min.replace(tzinfo=timezone.utc)
        previous = paid_by_user.get(key)
        previous_dt = _parse_dt((previous or {}).get("purchaseDate") or (previous or {}).get("updatedAt") or (previous or {}).get("createdAt")) if previous else None
        if previous is None or current_dt > (previous_dt or datetime.min.replace(tzinfo=timezone.utc)):
            paid_by_user[key] = payment

    subscribed_users = []
    for key, payment in sorted(
        paid_by_user.items(),
        key=lambda item: _parse_dt(item[1].get("purchaseDate") or item[1].get("updatedAt") or item[1].get("createdAt")) or datetime.min.replace(tzinfo=timezone.utc),
        reverse=True,
    ):
        item = user_by_id.get(payment.get("userId")) or next(
            (u for u in all_users if (u.get("email") or "").lower() == (payment.get("userEmail") or "").lower()),
            {},
        )
        subscribed_users.append(
            {
                "userId": payment.get("userId") or item.get("user_id"),
                "name": item.get("name"),
                "email": item.get("email") or payment.get("userEmail"),
                "mobile": _phone_from_user(item),
                "plan": payment.get("plan"),
                "planName": payment.get("selectedPlanName") or (item.get("subscription") or {}).get("planName"),
                "paidAmount": payment.get("paidAmount"),
                "originalPrice": payment.get("originalPrice"),
                "paymentStatus": payment.get("paymentStatus"),
                "purchaseDate": payment.get("purchaseDate") or payment.get("updatedAt") or payment.get("createdAt"),
                "subscription": item.get("subscription"),
                "usage": item.get("usage"),
            }
        )

    for item in users:
        active_by_plan[item.get("subscription", {}).get("planName") or "Unknown"] += 1

    user_details = [
        {
            "userId": item.get("user_id"),
            "email": item.get("email"),
            "mobile": _phone_from_user(item),
            "name": item.get("name"),
            "subscription": item.get("subscription"),
            "usage": item.get("usage"),
        }
        for item in users
    ]

    user_daily = defaultdict(int)
    user_monthly = defaultdict(int)
    login_daily = defaultdict(int)
    login_monthly = defaultdict(int)
    for item in all_users:
        user_daily[_date_key(item.get("created_at"))] += 1
        user_monthly[_month_key(item.get("created_at"))] += 1
    for session in sessions:
        created = session.get("created_at") or session.get("createdAt")
        login_daily[_date_key(created)] += 1
        login_monthly[_month_key(created)] += 1

    return {
        "totalMoneyEarned": total_money,
        "totalPayments": len(payments),
        "successfulPayments": len(successful),
        "failedPayments": len(failed),
        "fullySubscribedUsers": len(paid_by_user),
        "revenueByPlan": dict(by_plan),
        "dailyRevenue": dict(sorted(daily.items())),
        "monthlyRevenue": dict(sorted(monthly.items())),
        "activeUsersByPlan": dict(active_by_plan),
        "platformStats": {
            "totalUsers": len(all_users),
            "usersToday": _count_since(all_users, "created_at", now - timedelta(days=1)),
            "usersThisWeek": _count_since(all_users, "created_at", now - timedelta(days=7)),
            "usersThisMonth": _count_since(all_users, "created_at", now - timedelta(days=30)),
            "totalLoginSessions": len(sessions),
            "distinctLoggedInUsers": len(login_counts),
            "activeSessions": len(active_session_users),
            "loginsToday": _count_since(sessions, "created_at", now - timedelta(days=1)),
            "loginsThisWeek": _count_since(sessions, "created_at", now - timedelta(days=7)),
            "loginsThisMonth": _count_since(sessions, "created_at", now - timedelta(days=30)),
            "dailyUsers": dict(sorted(user_daily.items())),
            "monthlyUsers": dict(sorted(user_monthly.items())),
            "dailyLogins": dict(sorted(login_daily.items())),
            "monthlyLogins": dict(sorted(login_monthly.items())),
        },
        "subscribedUsers": subscribed_users,
        "loginUsers": login_users,
        "users": user_details,
        "paymentHistory": payments[:100],
        "generatedAt": datetime.now(timezone.utc).isoformat(),
    }
