"""Sync Mongo careers to the approved catalog and print a short verification."""
import asyncio
import os
from pathlib import Path

import certifi
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

from career_catalog import ALLOWED_CAREER_SLUGS
from seed_data import seed


CHECK_SLUGS = [
    "lab-technician",
    "radiology-technician",
    "medical-coder",
    "medical-coding",
    "nutritionist-and-dietitian",
    "nutritionist",
    "biotechnologist",
    "research-scientist",
    "environmental-scientist",
    "forensic-scientist",
    "geologist",
    "astronomer",
    "physics-teacher",
]


async def main():
    load_dotenv(Path(__file__).parent / ".env")
    mongo_url = os.environ.get("MONGO_URL") or os.environ.get("MONGODB_URI") or "mongodb://localhost:27017"
    is_atlas = "mongodb+srv://" in mongo_url or ".mongodb.net" in mongo_url
    client = AsyncIOMotorClient(mongo_url, tlsCAFile=certifi.where() if is_atlas else None)
    db = client[os.environ.get("DB_NAME", "career_compass")]

    await seed(db)

    total = await db.careers.count_documents({})
    non_catalog = await db.careers.find(
        {"slug": {"$nin": list(ALLOWED_CAREER_SLUGS)}},
        {"_id": 0, "title": 1, "slug": 1},
    ).to_list(20)
    checks = await db.careers.find(
        {"slug": {"$in": CHECK_SLUGS}},
        {"_id": 0, "title": 1, "slug": 1},
    ).sort("title", 1).to_list(50)

    print(f"career_count={total}")
    print(f"non_catalog_count_sample={len(non_catalog)} {non_catalog}")
    print(f"checked_titles={checks}")
    client.close()


if __name__ == "__main__":
    asyncio.run(main())
