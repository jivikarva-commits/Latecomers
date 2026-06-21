"""Anonymous visitor tracking for admin analytics."""
import hashlib
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Request
from pydantic import BaseModel, Field

router = APIRouter(tags=["visitors"])


class VisitIn(BaseModel):
    visitorId: str = Field(..., min_length=8, max_length=120)
    path: str = Field("/", max_length=300)
    referrer: Optional[str] = Field(None, max_length=500)


def db(request: Request):
    return request.app.state.db


def iso_now():
    return datetime.now(timezone.utc).isoformat()


def ip_hash(request: Request):
    forwarded = request.headers.get("x-forwarded-for", "")
    ip = (forwarded.split(",")[0].strip() if forwarded else request.client.host if request.client else "")
    if not ip:
        return ""
    return hashlib.sha256(ip.encode("utf-8")).hexdigest()


@router.post("/track/visit")
async def track_visit(payload: VisitIn, request: Request):
    now = iso_now()
    agent = (request.headers.get("user-agent") or "")[:500]
    event = {
        "visitorId": payload.visitorId,
        "path": payload.path,
        "referrer": payload.referrer or "",
        "userAgent": agent,
        "ipHash": ip_hash(request),
        "createdAt": now,
    }
    await db(request).visitor_events.insert_one(event)
    await db(request).visitors.update_one(
        {"visitorId": payload.visitorId},
        {
            "$set": {
                "lastSeenAt": now,
                "lastPath": payload.path,
                "userAgent": agent,
                "ipHash": event["ipHash"],
            },
            "$setOnInsert": {
                "visitorId": payload.visitorId,
                "firstSeenAt": now,
            },
            "$inc": {"visitCount": 1},
        },
        upsert=True,
    )
    return {"ok": True}
