"""
Google OAuth 2.0 authentication for LATE COMERS AI.
Uses direct Google OAuth with our own client credentials.
"""
import os
import uuid
import secrets
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional

import httpx
import asyncio
from fastapi import APIRouter, HTTPException, Response, Request, Cookie, Depends
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")
SESSION_DAYS = 7


class GoogleAuthRequest(BaseModel):
    id_token: str


class UserOut(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None


def get_db(request: Request):
    return request.app.state.db


def _cookie_settings():
    secure = os.environ.get("SECURE_COOKIES", "false").lower() == "true"
    return dict(
        httponly=True,
        secure=secure,
        samesite="none" if secure else "lax",
        path="/",
    )


async def _upsert_user(db, email: str, name: str, picture: Optional[str]) -> dict:
    """Create or update a user record and return the user doc."""
    existing = await db.users.find_one({"email": email}, {"_id": 0})
    if existing:
        user_id = existing["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {
                "name": name,
                "picture": picture,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }},
        )
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "auth_provider": "google",
            "profile": {},
            "top_career_matches": [],
            "roadmap_progress": {},
            "saved_items": {"careers": [], "colleges": [], "scholarships": []},
            "onboarded": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        })

    return await db.users.find_one({"user_id": user_id}, {"_id": 0})


async def _create_session(db, user_id: str) -> str:
    """Create a new session and return the session token."""
    session_token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(days=SESSION_DAYS)
    await db.user_sessions.insert_one({
        "session_token": session_token,
        "user_id": user_id,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return session_token


@router.post("/google")
async def google_auth(payload: GoogleAuthRequest, response: Response, request: Request):
    """
    Verify a Google Sign-In ID token (credential JWT from google.accounts.id.renderButton)
    using Google's official python library, then issue a session cookie.
    """
    # Read env vars inside function — avoids any module-load timing issues
    client_id = os.environ.get("GOOGLE_CLIENT_ID", "").strip().strip('"').strip("'")
    if not client_id:
        raise HTTPException(status_code=500, detail="GOOGLE_CLIENT_ID is not configured on the server.")

    db = get_db(request)

    # ── 1. Verify the ID token ──────────────────────────────────────────────────
    idinfo = None
    lib_error = None

    # Primary: google-auth library (full JWT signature + expiry verification)
    # Run in a thread because google_requests.Request() is synchronous
    try:
        from google.oauth2 import id_token as google_id_token
        from google.auth.transport import requests as google_requests

        def _verify_sync():
            return google_id_token.verify_oauth2_token(
                payload.id_token,
                google_requests.Request(),
                client_id,
            )

        idinfo = await asyncio.get_event_loop().run_in_executor(None, _verify_sync)
        logger.info(f"Google token verified via google-auth: email={idinfo.get('email')}")
    except Exception as e:
        lib_error = e
        logger.warning(f"google-auth verification failed ({type(e).__name__}): {e}")

    # Fallback: Google's tokeninfo endpoint (no local crypto — always network round-trip)
    if idinfo is None:
        logger.info("Falling back to Google tokeninfo endpoint…")
        try:
            async with httpx.AsyncClient(timeout=15.0) as hx:
                ti = await hx.get(
                    "https://oauth2.googleapis.com/tokeninfo",
                    params={"id_token": payload.id_token},
                )
        except Exception as net_err:
            logger.error(f"Network error reaching tokeninfo: {net_err}")
            raise HTTPException(
                status_code=503,
                detail="Could not reach Google to verify sign-in. Check your internet connection.",
            )

        if ti.status_code != 200:
            logger.error(f"Tokeninfo failed ({ti.status_code}): {ti.text[:200]}")
            raise HTTPException(
                status_code=401,
                detail="Google sign-in failed — token rejected. Please try again.",
            )

        idinfo = ti.json()
        # tokeninfo doesn't raise on audience mismatch — check manually
        aud = idinfo.get("aud") or idinfo.get("azp", "")
        if client_id and aud and aud != client_id:
            logger.error(f"Audience mismatch: got={aud}, expected={client_id}")
            raise HTTPException(status_code=401, detail="Token audience mismatch. Please sign in again.")
        logger.info(f"Tokeninfo fallback succeeded: email={idinfo.get('email')}")

    email = idinfo.get("email")
    if not email:
        raise HTTPException(status_code=502, detail="Google did not return an email address.")
    if not idinfo.get("email_verified", True):
        raise HTTPException(status_code=401, detail="Google email is not verified.")

    name    = idinfo.get("name") or email.split("@")[0]
    picture = idinfo.get("picture")

    # ── 2. Upsert user in MongoDB ──
    user_doc = await _upsert_user(db, email, name, picture)

    # ── 3. Create session ──
    session_token = await _create_session(db, user_doc["user_id"])

    # ── 4. Set cookie ──
    settings = _cookie_settings()
    response.set_cookie(
        key="session_token",
        value=session_token,
        max_age=SESSION_DAYS * 24 * 60 * 60,
        **settings,
    )

    logger.info(f"✅ Signed in: user_id={user_doc['user_id']} email={email}")
    return {"user": user_doc}


# ── Session helpers (kept for compatibility) ─────────────────────────────────

async def _resolve_user(request: Request, session_token: Optional[str], authorization: Optional[str]):
    db = get_db(request)
    token = session_token
    if not token and authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1].strip()

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")

    expires_at = session["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")

    user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


async def current_user(
    request: Request,
    session_token: Optional[str] = Cookie(None),
    authorization: Optional[str] = None,
):
    auth_header = request.headers.get("authorization")
    return await _resolve_user(request, session_token, auth_header)


@router.get("/me")
async def me(user=Depends(current_user)):
    return user


@router.post("/logout")
async def logout(response: Response, request: Request, session_token: Optional[str] = Cookie(None)):
    db = get_db(request)
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    response.delete_cookie("session_token", path="/")
    return {"ok": True}
