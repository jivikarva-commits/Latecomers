"""Subscription plans, Razorpay helpers, and feature-limit enforcement."""
import hmac
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Dict, Optional

from fastapi import HTTPException, Request


PLAN_CONFIG: Dict[str, Dict] = {
    "starter_offer": {
        "key": "starter_offer",
        "name": "Starter Offer",
        "originalPrice": 99,
        "amount": 9,
        "currency": "INR",
        "durationDays": 365,
        "features": {
            "aiQuestionsLimit": 0,
            "mockInterviewLimit": 3,
            "instituteSearchLimit": 5,
            "roadmapUnlimited": True,
            "quizResultAccess": True,
        },
    },
    "standard_99": {
        "key": "standard_99",
        "name": "\u20B999 Plan",
        "originalPrice": 99,
        "amount": 99,
        "currency": "INR",
        "durationDays": 365,
        "features": {
            "aiQuestionsLimit": 10,
            "mockInterviewLimit": 10,
            "instituteSearchLimit": 10,
            "roadmapUnlimited": True,
            "quizResultAccess": True,
        },
    },
    "premium_299": {
        "key": "premium_299",
        "name": "\u20B9299 Plan",
        "originalPrice": 299,
        "amount": 299,
        "currency": "INR",
        "durationDays": 365,
        "features": {
            "aiQuestionsLimit": 40,
            "mockInterviewLimit": 30,
            "instituteSearchLimit": 30,
            "roadmapUnlimited": True,
            "quizResultAccess": True,
        },
    },
}

FEATURE_FIELDS = {
    "ai_chat": ("aiQuestionsLimit", "aiQuestionsUsed", "AI chat questions"),
    "mock_interview": ("mockInterviewLimit", "mockInterviewUsed", "Mock interviews"),
    "institute_search": ("instituteSearchLimit", "instituteSearchUsed", "Institute searches"),
}


def db(request: Request):
    return request.app.state.db


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def iso_now() -> str:
    return utc_now().isoformat()


def parse_dt(value):
    if not value:
        return None
    if isinstance(value, datetime):
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)
    if isinstance(value, str):
        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError:
            return None
    return None


def public_plan_list():
    return [
        {
            "key": plan["key"],
            "name": plan["name"],
            "originalPrice": plan["originalPrice"],
            "amount": plan["amount"],
            "currency": plan["currency"],
            "durationDays": plan["durationDays"],
            "features": plan["features"],
        }
        for plan in PLAN_CONFIG.values()
    ]


def active_subscription(user: Dict) -> Optional[Dict]:
    sub = user.get("subscription") or {}
    if sub.get("status") != "active":
        return None
    expiry = parse_dt(sub.get("expiresAt"))
    if expiry and expiry < utc_now():
        return None
    return sub


def current_usage(user: Dict) -> Dict:
    usage = user.get("usage") or {}
    return {
        "aiQuestionsUsed": int(usage.get("aiQuestionsUsed") or usage.get("used", {}).get("aiChats") or 0),
        "mockInterviewUsed": int(usage.get("mockInterviewUsed") or usage.get("used", {}).get("mockInterviews") or 0),
        "instituteSearchUsed": int(usage.get("instituteSearchUsed") or usage.get("used", {}).get("instituteSearches") or 0),
    }


def subscription_features(user: Dict) -> Dict:
    sub = active_subscription(user)
    if not sub:
        return {}
    features = sub.get("featureLimits") or {}
    if not features and sub.get("plan") in PLAN_CONFIG:
        features = PLAN_CONFIG[sub["plan"]]["features"]
    return {**features, **current_usage(user)}


def upgrade_error(message: str, feature: str = "") -> HTTPException:
    return HTTPException(
        status_code=402,
        detail={
            "code": "SUBSCRIPTION_REQUIRED",
            "feature": feature,
            "message": message,
        },
    )


def ensure_quiz_result_access(user: Dict):
    features = subscription_features(user)
    if not features.get("quizResultAccess"):
        raise upgrade_error("Please choose a plan to unlock your quiz result.", "quiz_result")


def ensure_feature_available(user: Dict, feature: str):
    features = subscription_features(user)
    if not features:
        raise upgrade_error("Please choose a plan to use this feature.", feature)
    limit_field, used_field, label = FEATURE_FIELDS[feature]
    limit = int(features.get(limit_field) or 0)
    used = int(features.get(used_field) or 0)
    if limit <= 0:
        raise upgrade_error(f"{label} are not included in your current plan. Please upgrade.", feature)
    if used >= limit:
        raise upgrade_error(f"You have used all {limit} {label.lower()} in your plan. Please upgrade.", feature)


async def consume_feature(request: Request, user: Dict, feature: str):
    ensure_feature_available(user, feature)
    _, used_field, _ = FEATURE_FIELDS[feature]
    await db(request).users.update_one(
        {"user_id": user["user_id"]},
        {
            "$inc": {f"usage.{used_field}": 1},
            "$set": {"updated_at": iso_now()},
        },
    )


def build_subscription_record(user: Dict, plan_key: str, order_id: str, payment_id: str, status: str = "active") -> Dict:
    plan = PLAN_CONFIG[plan_key]
    purchased = utc_now()
    expires = purchased + timedelta(days=plan["durationDays"])
    feature_limits = {
        **plan["features"],
        "aiQuestionsUsed": 0,
        "mockInterviewUsed": 0,
        "instituteSearchUsed": 0,
    }
    return {
        "userId": user["user_id"],
        "userEmail": user.get("email"),
        "selectedPlanName": plan["name"],
        "plan": plan_key,
        "originalPrice": plan["originalPrice"],
        "paidAmount": plan["amount"],
        "currency": plan["currency"],
        "razorpayOrderId": order_id,
        "razorpayPaymentId": payment_id,
        "paymentStatus": status,
        "purchaseDate": purchased.isoformat(),
        "planExpiryDate": expires.isoformat(),
        **feature_limits,
        "featureLimits": feature_limits,
    }


def verify_razorpay_signature(order_id: str, payment_id: str, signature: str, secret: str) -> bool:
    payload = f"{order_id}|{payment_id}".encode("utf-8")
    expected = hmac.new(secret.encode("utf-8"), payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature or "")


def verify_webhook_signature(body: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(secret.encode("utf-8"), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature or "")
