"""LATE COMERS AI — FastAPI server entry."""
import os
import logging
import asyncio
from pathlib import Path
from datetime import datetime, timedelta, timezone

from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from auth_routes import router as auth_router  # noqa: E402
from data_routes import router as data_router  # noqa: E402
from ai_routes import router as ai_router  # noqa: E402
from payment_routes import router as payment_router  # noqa: E402
from visitor_routes import router as visitor_router  # noqa: E402
from seed_data import seed  # noqa: E402
from llm_client import llm_status  # noqa: E402
from data_routes import CAREER_DETAILS_PROMPT_VERSION  # noqa: E402

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

import certifi

mongo_url = os.environ.get("MONGO_URL") or os.environ.get("MONGODB_URI")
if not mongo_url or mongo_url == "use local later we will migrate it":
    mongo_url = "mongodb://localhost:27017"

# Use certifi CA bundle to fix SSL/TLS issues on Python 3.13 + Atlas
_is_atlas = "mongodb+srv://" in mongo_url or ".mongodb.net" in mongo_url
client = AsyncIOMotorClient(
    mongo_url,
    tlsCAFile=certifi.where() if _is_atlas else None,
)
db = client[os.environ.get("DB_NAME", "career_compass")]

app = FastAPI(title="Latecomers")
app.state.db = db
app.state.career_cache_task = None

api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"service": "Latecomers", "status": "ok", "llm": llm_status()}


@api_router.get("/health")
async def health():
    return {"ok": True, "llm": llm_status()}


api_router.include_router(auth_router)
api_router.include_router(data_router)
api_router.include_router(ai_router)
api_router.include_router(payment_router)
api_router.include_router(visitor_router)

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    # Run heavy DB tasks in background so server starts instantly
    async def _bg():
        try:
            await seed(db)
        except Exception as e:
            logger.warning("Seed error (non-fatal): %s", e)
        try:
            await reset_stale_career_detail_cache_once()
        except Exception as e:
            logger.warning("Cache reset error (non-fatal): %s", e)

    asyncio.create_task(_bg())
    app.state.career_cache_task = asyncio.create_task(career_cache_expiry_worker())
    logger.info("Latecomers started. LLM: %s", llm_status())


@app.on_event("shutdown")
async def on_shutdown():
    if app.state.career_cache_task:
        app.state.career_cache_task.cancel()
    client.close()


async def reset_stale_career_detail_cache_once():
    migration_id = f"clear-career-details-cache-{CAREER_DETAILS_PROMPT_VERSION}"
    existing = await db.app_meta.find_one({"_id": migration_id})
    if existing:
        return
    result = await db.careers.update_many(
        {},
        {
            "$set": {
                "aiGeneratedDetails": None,
                "detailsGeneratedByAI": False,
                "detailsCachedAt": None,
                "careerDetailsPromptVersion": None,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
        },
    )
    await db.app_meta.insert_one(
        {
            "_id": migration_id,
            "ranAt": datetime.now(timezone.utc).isoformat(),
            "clearedCareers": result.modified_count,
        }
    )
    logger.info("Cleared stale career detail cache for %s careers", result.modified_count)


async def career_cache_expiry_worker():
    while True:
        try:
            cutoff = datetime.now(timezone.utc) - timedelta(days=90)
            result = await db.careers.update_many(
                {"detailsCachedAt": {"$lt": cutoff}},
                {
                    "$set": {
                        "aiGeneratedDetails": None,
                        "detailsGeneratedByAI": False,
                        "detailsCachedAt": None,
                    }
                },
            )
            if result.modified_count:
                logger.info("Expired AI career details for %s careers", result.modified_count)
        except Exception as e:
            logger.error("Career cache expiry worker failed: %s", e)
        await asyncio.sleep(24 * 60 * 60)
