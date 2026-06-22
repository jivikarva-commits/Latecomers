"""Masterclass listings - admin-managed listings shown publicly when approved."""
import uuid
from datetime import datetime, timezone, date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field

from auth_routes import current_user
from payment_routes import require_admin

router = APIRouter(tags=["masterclasses"])


def db(request: Request):
    return request.app.state.db


def iso_now():
    return datetime.now(timezone.utc).isoformat()


VALID_MODES = {"Online", "Offline", "Hybrid"}
# Thumbnail may be a hosted URL or a compressed base64 data URL. Cap to ~300KB to
# avoid bloating Mongo documents (client compresses before sending).
MAX_THUMB_LEN = 320_000


class MasterclassIn(BaseModel):
    instituteName: str = Field(..., min_length=2, max_length=120)
    title: str = Field(..., min_length=3, max_length=140)
    description: str = Field(..., min_length=10, max_length=2000)
    thumbnail: Optional[str] = Field(None, max_length=MAX_THUMB_LEN)
    date: str = Field(..., max_length=20)            # YYYY-MM-DD
    time: Optional[str] = Field(None, max_length=40)  # e.g. "6:00 PM IST"
    mode: str = Field("Online", max_length=20)
    locationOrLink: Optional[str] = Field(None, max_length=400)
    price: Optional[str] = Field("Free", max_length=40)
    instructor: Optional[str] = Field(None, max_length=120)
    contactEmail: Optional[str] = Field(None, max_length=160)
    contactPhone: Optional[str] = Field(None, max_length=20)
    registrationLink: Optional[str] = Field(None, max_length=400)


def _public_view(doc: dict) -> dict:
    """Fields safe to expose publicly."""
    return {
        "id": doc.get("id"),
        "instituteName": doc.get("instituteName"),
        "title": doc.get("title"),
        "description": doc.get("description"),
        "thumbnail": doc.get("thumbnail"),
        "date": doc.get("date"),
        "time": doc.get("time"),
        "mode": doc.get("mode"),
        "locationOrLink": doc.get("locationOrLink"),
        "price": doc.get("price"),
        "instructor": doc.get("instructor"),
        "registrationLink": doc.get("registrationLink"),
        "contactEmail": doc.get("contactEmail"),
        "contactPhone": doc.get("contactPhone"),
    }


def _make_masterclass_doc(payload: MasterclassIn, *, status: str, user: Optional[dict] = None) -> dict:
    mode = payload.mode if payload.mode in VALID_MODES else "Online"
    if not (payload.contactEmail or payload.contactPhone or payload.registrationLink):
        raise HTTPException(400, "Provide at least one of: contact email, phone, or registration link.")

    # Basic date sanity (must be a parseable date, not far in the past).
    try:
        d = datetime.strptime(payload.date.strip(), "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(400, "Date must be in YYYY-MM-DD format.")

    now = iso_now()
    return {
        "id": uuid.uuid4().hex,
        "instituteName": payload.instituteName.strip(),
        "title": payload.title.strip(),
        "description": payload.description.strip(),
        "thumbnail": (payload.thumbnail or "").strip() or None,
        "date": d.isoformat(),
        "time": (payload.time or "").strip() or None,
        "mode": mode,
        "locationOrLink": (payload.locationOrLink or "").strip() or None,
        "price": (payload.price or "Free").strip() or "Free",
        "instructor": (payload.instructor or "").strip() or None,
        "contactEmail": (payload.contactEmail or "").strip() or None,
        "contactPhone": (payload.contactPhone or "").strip() or None,
        "registrationLink": (payload.registrationLink or "").strip() or None,
        "status": status,
        "createdByAdmin": bool(user),
        "createdByUserId": user.get("id") if user else None,
        "createdByEmail": user.get("email") if user else None,
        "createdAt": now,
        "updatedAt": now,
    }


@router.post("/masterclasses")
async def submit_masterclass():
    """Public submissions are disabled; only admins can create masterclasses."""
    raise HTTPException(403, "Only admins can add masterclasses.")


@router.post("/admin/masterclasses")
async def admin_create_masterclass(payload: MasterclassIn, request: Request, user=Depends(current_user)):
    """Admin-only creation. Newly added masterclasses are published immediately."""
    require_admin(user)
    doc = _make_masterclass_doc(payload, status="approved", user=user)
    await db(request).masterclasses.insert_one(doc)
    return {"ok": True, "item": _public_view(doc), "message": "Masterclass published."}


@router.get("/masterclasses")
async def list_public_masterclasses(request: Request):
    """Public list — only approved and upcoming (date today or later), soonest first."""
    today = date.today().isoformat()
    cursor = db(request).masterclasses.find(
        {"status": "approved", "date": {"$gte": today}}, {"_id": 0}
    ).sort("date", 1).limit(60)
    items = await cursor.to_list(60)
    return [_public_view(d) for d in items]


# ---------- Admin moderation ----------
@router.get("/admin/masterclasses")
async def admin_list_masterclasses(request: Request, user=Depends(current_user)):
    require_admin(user)
    cursor = db(request).masterclasses.find({}, {"_id": 0}).sort("createdAt", -1).limit(300)
    items = await cursor.to_list(300)
    counts = {"pending": 0, "approved": 0, "rejected": 0}
    for it in items:
        counts[it.get("status", "pending")] = counts.get(it.get("status", "pending"), 0) + 1
    return {"items": items, "counts": counts}


class ModerateIn(BaseModel):
    status: str  # "approved" | "rejected"


@router.post("/admin/masterclasses/{mc_id}/moderate")
async def moderate_masterclass(mc_id: str, payload: ModerateIn, request: Request, user=Depends(current_user)):
    require_admin(user)
    status = payload.status if payload.status in {"approved", "rejected"} else None
    if not status:
        raise HTTPException(400, "status must be 'approved' or 'rejected'.")
    res = await db(request).masterclasses.update_one(
        {"id": mc_id}, {"$set": {"status": status, "updatedAt": iso_now()}}
    )
    if res.matched_count == 0:
        raise HTTPException(404, "Masterclass not found.")
    return {"ok": True, "status": status}


@router.delete("/admin/masterclasses/{mc_id}")
async def delete_masterclass(mc_id: str, request: Request, user=Depends(current_user)):
    require_admin(user)
    res = await db(request).masterclasses.delete_one({"id": mc_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Masterclass not found.")
    return {"ok": True}
