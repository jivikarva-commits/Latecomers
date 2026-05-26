"""CRUD + listing routes for careers, colleges, scholarships, user profile, saved items."""
import asyncio
import json
import logging
import os
import re
from datetime import datetime, timedelta, timezone
from typing import Optional, List, Dict
from urllib.parse import quote_plus

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request, Query
from pydantic import BaseModel

from auth_routes import current_user
from career_catalog import ALLOWED_CAREER_SLUGS, FIELD_META, slugify
from llm_client import ask_claude, extract_json

router = APIRouter(tags=["data"])
logger = logging.getLogger(__name__)
GOOGLE_PLACES_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"
GOOGLE_PLACES_DETAILS_URL = "https://places.googleapis.com/v1/places/{place_id}"
GOOGLE_TEXT_SEARCH_FIELDS = ",".join(
    [
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.rating",
        "places.userRatingCount",
        "places.businessStatus",
    ]
)
GOOGLE_DETAILS_FIELDS = ",".join(
    [
        "id",
        "nationalPhoneNumber",
        "internationalPhoneNumber",
        "websiteUri",
        "regularOpeningHours",
        "currentOpeningHours",
    ]
)
CAREER_DETAILS_TTL_DAYS = 90
CAREER_DETAILS_PROMPT_VERSION = "career-details-specific-v4-2026-05-15"


def db(request: Request):
    return request.app.state.db


def _location_key(location: str) -> str:
    return re.sub(r"\s+", " ", location.strip().lower())


def _log_college_error(location: str, context: str, error: Exception) -> None:
    logger.error(
        "College search error context=%s location=%s timestamp=%s error=%s",
        context,
        location,
        datetime.now(timezone.utc).isoformat(),
        error,
    )


def _extract_json_array(text: str) -> list:
    cleaned = (text or "").strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```", 2)[1]
        if cleaned.lstrip().startswith("json"):
            cleaned = cleaned.lstrip()[4:]
        cleaned = cleaned.rsplit("```", 1)[0]
    start = cleaned.find("[")
    end = cleaned.rfind("]")
    if start == -1 or end == -1:
        raise ValueError("No JSON array found in Claude response")
    data = json.loads(cleaned[start : end + 1])
    if not isinstance(data, list):
        raise ValueError("Claude response was not a JSON array")
    return data


def _normalize_category(category: Optional[str], fallback: str = "Skill Development") -> str:
    allowed = {"Engineering", "Medical", "Management", "Commerce", "Law", "Coaching", "Skill Development", "Arts"}
    if category == "Skill":
        return "Skill Development"
    return category if category in allowed else fallback


def _infer_category_from_place(place: Dict) -> str:
    text = f"{place.get('name', '')} {place.get('address', '')}".lower()
    if any(term in text for term in ("medical", "mbbs", "hospital", "nursing", "pharmacy", "dental")):
        return "Medical"
    if any(term in text for term in ("engineer", "technology", "polytechnic", "technical")):
        return "Engineering"
    if any(term in text for term in ("management", "business school", "mba", "bba")):
        return "Management"
    if any(term in text for term in ("commerce", "economics", "account")):
        return "Commerce"
    if any(term in text for term in ("law", "legal", "llb")):
        return "Law"
    if any(term in text for term in ("coaching", "academy", "tutorial", "classes", "neet", "jee", "upsc")):
        return "Coaching"
    if any(term in text for term in ("skill", "training", "development", "vocational")):
        return "Skill Development"
    if any(term in text for term in ("arts", "fine art", "liberal")):
        return "Arts"
    return "Skill Development"


def _maps_link(name: str, address: str) -> str:
    return f"https://maps.google.com/?q={quote_plus(f'{name} {address}'.strip())}"


def _place_display_name(place: Dict) -> str:
    display_name = place.get("displayName") or {}
    if isinstance(display_name, dict):
        return display_name.get("text") or ""
    return str(display_name or "")


def _google_places_headers(maps_key: str, field_mask: str, content_type: bool = False) -> Dict[str, str]:
    referer = os.environ.get("GOOGLE_MAPS_REFERER") or os.environ.get("CORS_ORIGINS", "").split(",")[0].strip()
    headers = {
        "X-Goog-Api-Key": maps_key,
        "X-Goog-FieldMask": field_mask,
    }
    if content_type:
        headers["Content-Type"] = "application/json"
    if referer:
        headers["Referer"] = referer if referer.endswith("/") else f"{referer}/"
    return headers


def _normalize_google_place(place: Dict, details: Optional[Dict] = None) -> Dict:
    details = details or {}
    name = _place_display_name(place) or place.get("name") or "Unnamed institute"
    address = place.get("formattedAddress") or place.get("address") or ""
    phone = (
        details.get("formattedPhoneNumber")
        or details.get("nationalPhoneNumber")
        or details.get("internationalPhoneNumber")
        or place.get("formatted_phone_number")
    )
    website = details.get("websiteUri") or place.get("website")
    result = {
        "id": place.get("id") or place.get("place_id") or re.sub(r"\W+", "-", name.lower()).strip("-"),
        "placeId": place.get("id") or place.get("place_id"),
        "name": name,
        "address": address,
        "phone": phone,
        "website": website,
        "rating": place.get("rating"),
        "reviewCount": place.get("userRatingCount") or place.get("user_ratings_total") or 0,
        "courses": [],
        "category": "Skill Development",
        "businessStatus": place.get("businessStatus") or place.get("business_status"),
        "googleMapsLink": _maps_link(name, address),
    }
    result["category"] = _infer_category_from_place(result)
    return result


def _normalize_college_item(item: Dict, idx: int, fallback: Optional[Dict] = None) -> Dict:
    fallback = fallback or {}
    name = item.get("name") or fallback.get("name") or "Unnamed institute"
    address = item.get("address") or fallback.get("address") or item.get("formatted_address") or ""
    courses = item.get("courses")
    if not isinstance(courses, list):
        courses = item.get("coursesOffered") if isinstance(item.get("coursesOffered"), list) else fallback.get("courses", [])
    category = _normalize_category(item.get("category"), fallback.get("category") or "Skill Development")
    google_maps_link = item.get("googleMapsLink") or fallback.get("googleMapsLink") or _maps_link(name, address)
    return {
        "id": item.get("id") or fallback.get("id") or f"google-{idx}",
        "placeId": item.get("placeId") or item.get("place_id") or fallback.get("placeId"),
        "name": name,
        "address": address,
        "phone": item.get("phone") or fallback.get("phone"),
        "website": item.get("website") or fallback.get("website"),
        "rating": item.get("rating") if item.get("rating") is not None else fallback.get("rating"),
        "reviewCount": item.get("reviewCount") if item.get("reviewCount") is not None else fallback.get("reviewCount", 0),
        "courses": [str(c) for c in courses if c],
        "category": category,
        "businessStatus": item.get("businessStatus") or fallback.get("businessStatus"),
        "googleMapsLink": google_maps_link,
    }


async def _google_text_search(client: httpx.AsyncClient, maps_key: str, text_query: str) -> List[Dict]:
    response = await client.post(
        GOOGLE_PLACES_TEXT_SEARCH_URL,
        headers=_google_places_headers(maps_key, GOOGLE_TEXT_SEARCH_FIELDS, content_type=True),
        json={"textQuery": text_query, "languageCode": "en", "regionCode": "IN"},
    )
    if response.status_code >= 400:
        raise RuntimeError(f"Google Text Search failed status={response.status_code} body={response.text[:300]}")
    return response.json().get("places", [])


async def _google_place_details(client: httpx.AsyncClient, maps_key: str, place_id: str) -> Dict:
    response = await client.get(
        GOOGLE_PLACES_DETAILS_URL.format(place_id=place_id),
        headers=_google_places_headers(maps_key, GOOGLE_DETAILS_FIELDS),
    )
    if response.status_code >= 400:
        raise RuntimeError(f"Google Place Details failed place_id={place_id} status={response.status_code}")
    return response.json()


def _fallback_by_name(results: List[Dict]) -> Dict[str, Dict]:
    return {f"{item.get('name', '').strip().lower()}|{item.get('address', '').strip().lower()}": item for item in results}


def _find_fallback(item: Dict, fallback_lookup: Dict[str, Dict]) -> Dict:
    key = f"{item.get('name', '').strip().lower()}|{item.get('address', '').strip().lower()}"
    if key in fallback_lookup:
        return fallback_lookup[key]
    name = item.get("name", "").strip().lower()
    for fallback in fallback_lookup.values():
        if name and name == fallback.get("name", "").strip().lower():
            return fallback
    return {}


class CollegeSearchRequest(BaseModel):
    location: str
    course: Optional[str] = None


class CollegeRecommendRequest(BaseModel):
    location: Optional[str] = None
    results: List[Dict]


class CareerGenerateRequest(BaseModel):
    title: str


def _parse_dt(value):
    if not value:
        return None
    if isinstance(value, datetime):
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)
    if isinstance(value, str):
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    return None


def _career_details_fresh(career: Dict) -> bool:
    cached_at = _parse_dt(career.get("detailsCachedAt"))
    if not career.get("aiGeneratedDetails") or not cached_at:
        return False
    if career.get("detailsGeneratedByAI") is not True:
        return False
    if career.get("careerDetailsPromptVersion") != CAREER_DETAILS_PROMPT_VERSION:
        return False
    return datetime.now(timezone.utc) - cached_at < timedelta(days=CAREER_DETAILS_TTL_DAYS)


def _normalize_public_career(career: Dict) -> Dict:
    item = dict(career)
    item.pop("_id", None)
    item.setdefault("description", item.get("shortDescription", "Explore this career path."))
    item.setdefault("shortDescription", item.get("description", "Explore this career path."))
    if "avgSalary" not in item:
        item["avgSalary"] = {
            "min": item.get("avgSalaryMin", 4),
            "max": item.get("avgSalaryMax", 12),
        }
    item.setdefault("avgSalaryMin", item.get("avgSalary", {}).get("min"))
    item.setdefault("avgSalaryMax", item.get("avgSalary", {}).get("max"))
    item.setdefault("jobRoles", f"{item.get('totalJobRoles', 8)}+")
    return item


def _flatten_ai_skills(details: Dict) -> List[Dict]:
    skills = details.get("skills", {}) or {}
    flattened = []
    for group in ("technical", "analytical", "tools", "softSkills"):
        for skill in skills.get(group, []) or []:
            if isinstance(skill, dict) and skill.get("name"):
                flattened.append(
                    {
                        "name": skill.get("name"),
                        "importance": skill.get("importance", 70),
                        "description": skill.get("description", ""),
                        "status": skill.get("priority") or skill.get("status") or "Good to have",
                        "type": skill.get("type") or group,
                        "group": group,
                    }
                )
    return flattened


def _flatten_ai_jobs(details: Dict) -> List[Dict]:
    jobs = details.get("jobs", {}) or {}
    flattened = []
    if isinstance(jobs.get("levels"), list):
        for level_group in jobs.get("levels", []) or []:
            if not isinstance(level_group, dict):
                continue
            level = level_group.get("level") or "Role"
            experience = level_group.get("yearsExp") or level_group.get("experience") or "Flexible"
            for role in level_group.get("roles", []) or []:
                if not isinstance(role, dict):
                    continue
                flattened.append(
                    {
                        "level": level,
                        "experience": experience,
                        "title": role.get("title", level),
                        "desc": role.get("description") or role.get("salaryNote") or "",
                        "salaryMin": role.get("salaryMin", 0),
                        "salaryMax": role.get("salaryMax", role.get("salaryMin", 0)),
                        "salaryNote": role.get("salaryNote"),
                        "companies": role.get("companies", []),
                    }
                )
        if flattened:
            return flattened

    groups = [
        ("entryLevel", "Entry", "0 - 2 Years"),
        ("midLevel", "Mid", "2 - 5 Years"),
        ("seniorLevel", "Senior", "5+ Years"),
        ("freelance", "Freelance", "Flexible"),
    ]
    for key, level, experience in groups:
        for job in jobs.get(key, []) or []:
            if not isinstance(job, dict):
                continue
            flattened.append(
                {
                    "level": level,
                    "experience": experience,
                    "title": job.get("title", level),
                    "desc": job.get("description") or job.get("earningPotential") or "",
                    "salaryMin": job.get("salaryMin", 0),
                    "salaryMax": job.get("salaryMax", job.get("salaryMin", 0)),
                    "companies": job.get("companies", []),
                }
            )
    return flattened


def _merge_ai_details(career: Dict) -> Dict:
    item = _normalize_public_career(career)
    details = item.get("aiGeneratedDetails")
    if not isinstance(details, dict):
        return item

    overview = details.get("overview", {}) or {}
    insights = details.get("insights", {}) or {}
    roadmap = details.get("roadmap", {}) or {}
    tool_items = insights.get("aiTools")
    if not isinstance(tool_items, list):
        tool_items = []
    ai_tool_names = [
        tool.get("name") if isinstance(tool, dict) else str(tool)
        for tool in tool_items
        if (tool.get("name") if isinstance(tool, dict) else tool)
    ]
    skill_tool_names = [
        s.get("name")
        for s in (details.get("skills", {}) or {}).get("tools", [])
        if isinstance(s, dict) and s.get("name")
    ]
    item["overview"] = overview.get("description") or item.get("overview") or item.get("description")
    item["overviewDetails"] = overview
    item["skills"] = _flatten_ai_skills(details) or item.get("skills", [])
    item["roadmap"] = roadmap.get("stages") or item.get("roadmap", [])
    item["roadmapTotalDuration"] = roadmap.get("totalDuration")
    item["jobs"] = _flatten_ai_jobs(details) or item.get("jobs", [])
    item["salaryProgression"] = details.get("salaryProgression", [])
    top_countries = insights.get("topHiringCountries") or insights.get("topCountries") or (item.get("insights") or {}).get("topCountries")
    if not isinstance(top_countries, list):
        top_countries = [top_countries] if top_countries else []
    normalized_countries = ["India", *[str(country) for country in top_countries if str(country).strip().lower() not in ("india", "in")]]

    item["insights"] = {
        **(item.get("insights") or {}),
        **insights,
        "openPositions": insights.get("openPositionsIndia") or (item.get("insights") or {}).get("openPositions"),
        "topIndustries": insights.get("topIndustriesHiring") or insights.get("topIndustries") or (item.get("insights") or {}).get("topIndustries", []),
        "topCountries": normalized_countries[:5],
        "aiTools": ai_tool_names or skill_tool_names,
        "aiToolsDetails": tool_items,
    }
    return item


def _career_details_prompt(career: Dict) -> str:
    tags = career.get("tags") or []
    if not isinstance(tags, list):
        tags = [str(tags)]
    title = career.get("title") or "This Career"
    category = career.get("category") or "General"
    field = career.get("field") or category
    salary_min = career.get("avgSalaryMin") or (career.get("avgSalary") or {}).get("min") or 0
    salary_max = career.get("avgSalaryMax") or (career.get("avgSalary") or {}).get("max") or 0
    growth = career.get("jobGrowth5Y") or 0
    tag_text = ", ".join(str(tag) for tag in tags if tag) or "None"

    return f"""Create one compact valid JSON object for this Indian student career page.

Career title: {title}
Category: {category}
Field: {field}
Tags: {tag_text}
Known salary: Rs {salary_min}-{salary_max} LPA
Known 5-year growth: {growth}%

Rules:
- Be specific only to {title}; never use generic skills like "Domain Fundamentals".
- overview.description must contain the exact phrase "{title}".
- Use real India-relevant roles, companies, tools, exams/degrees/certifications.
- insights.topHiringCountries must always include "India" as the first country, followed by relevant global markets.
- For CA, government, medical, law, creative, and technical paths, use the correct education/exam/portfolio/project roadmap.
- Return JSON only. No markdown fences. No comments. No trailing commas. Keep every string on one line.
- Keep output concise: 4 skills per skill group, 4 roadmap stages, 5 job levels with 1 role each, 4 AI tools, 4 certifications.

Schema:
{{
  "overview": {{
    "description": "2 concise paragraphs specific to {title} in India",
    "whyChooseThis": "specific reasons",
    "indianMarketDemand": "2025 India demand",
    "globalScope": "global scope",
    "typicalDay": "typical day",
    "whyGreatFit": ["specific reason 1", "specific reason 2", "specific reason 3", "specific reason 4"],
    "workAreas": [{{"title": "specific work area", "icon": "emoji"}}]
  }},
  "skills": {{
    "technical": [{{"name": "specific skill", "type": "Core", "importance": 95, "description": "why it matters", "priority": "Essential"}}],
    "analytical": [{{"name": "specific analytical skill", "type": "Analytical", "importance": 85, "description": "why it matters", "priority": "Essential"}}],
    "tools": [{{"name": "actual tool", "type": "Tool", "importance": 80, "description": "how used", "priority": "Important"}}],
    "softSkills": [{{"name": "specific soft skill", "type": "Soft Skill", "importance": 75, "description": "why it matters", "priority": "Good to have"}}]
  }},
  "roadmap": {{
    "totalDuration": "career-specific duration",
    "stages": [{{"stageNum": 1, "title": "specific stage", "duration": "duration", "description": "what to do", "skills": ["skill1", "skill2"], "milestone": "outcome", "estimatedTimeline": "timeline"}}]
  }},
  "jobs": {{
    "levels": [{{"level": "Entry", "yearsExp": "0-2 Years", "roles": [{{"title": "actual role", "description": "specific duties", "salaryMin": 0, "salaryMax": 0, "salaryNote": "Indicative CTC range", "companies": ["Indian company 1", "Indian company 2"]}}]}}]
  }},
  "insights": {{
    "globalDemand": "specific demand",
    "jobGrowthGlobal": "{growth}%",
    "openPositionsIndia": "approximate number",
    "topHiringCountries": ["India", "country2", "country3", "country4"],
    "topIndustriesHiring": ["industry1", "industry2", "industry3", "industry4", "industry5"],
    "topCompaniesIndia": ["company1", "company2", "company3", "company4"],
    "aiImpact": "specific AI impact",
    "futureScope": "5-10 year outlook",
    "aiTools": [{{"name": "actual AI tool", "category": "Core", "description": "how used"}}],
    "certifications": [{{"name": "real certification", "provider": "provider", "cost": "INR cost", "duration": "duration"}}]
  }},
  "salaryProgression": [{{"level": "Fresher", "minLPA": 0, "maxLPA": 0}}, {{"level": "2-3 Years", "minLPA": 0, "maxLPA": 0}}, {{"level": "5+ Years", "minLPA": 0, "maxLPA": 0}}, {{"level": "10+ Years", "minLPA": 0, "maxLPA": 0}}]
}}"""


def _career_title_present(career_title: str, details: Dict) -> bool:
    description = str((details.get("overview") or {}).get("description") or "").lower()
    title = re.sub(r"\s+", " ", career_title).strip().lower()
    if title and title in description:
        return True
    title_without_parens = re.sub(r"\([^)]*\)", "", title).strip()
    return bool(title_without_parens and title_without_parens in description)


def _fallback_ai_details(career_title: str) -> Dict:
    clean_title = re.sub(r"\s+", " ", career_title).strip() or "This career"
    return {
        "overview": {
            "description": (
                f"{clean_title} is a practical career path with opportunities across Indian cities, "
                "private companies, public sector organizations, startups, and service businesses. "
                "Students should focus on building strong fundamentals, communication, hands-on projects, "
                "and industry awareness before applying for entry-level roles."
            ),
            "whyChooseThis": f"Choose {clean_title} if you enjoy structured learning, problem solving, and steady skill growth.",
            "indianMarketDemand": "Demand varies by city and specialization, but skilled candidates with practical experience are preferred.",
            "globalScope": "International opportunities are possible after building strong credentials, portfolio work, and domain experience.",
        },
        "skills": {
            "technical": [
                {"name": f"{clean_title} Fundamentals", "importance": 90, "description": f"Core concepts required for {clean_title}.", "status": "Essential"},
                {"name": f"{clean_title} Practical Work", "importance": 84, "description": f"Ability to apply {clean_title} learning in real scenarios.", "status": "Essential"},
            ],
            "analytical": [
                {"name": f"{clean_title} Problem Solving", "importance": 86, "description": f"Break down {clean_title} tasks and make evidence-based decisions.", "status": "Essential"},
                {"name": f"{clean_title} Research", "importance": 76, "description": f"Find, compare, and validate {clean_title}-relevant information.", "status": "Important"},
            ],
            "tools": [
                {"name": f"{clean_title} Industry Tools", "importance": 68, "description": f"Tools commonly used for {clean_title} planning, tracking, and reporting.", "status": "Good to have"},
                {"name": f"{clean_title} Collaboration Tools", "importance": 64, "description": f"Email, docs, presentations, and team tools for {clean_title} work.", "status": "Good to have"},
            ],
            "softSkills": [
                {"name": f"{clean_title} Communication", "importance": 88, "description": f"Explain {clean_title} ideas clearly to peers, clients, and teams.", "status": "Essential"},
                {"name": f"{clean_title} Discipline", "importance": 82, "description": f"Consistent {clean_title} study and practice over time.", "status": "Essential"},
            ],
        },
        "roadmap": {
            "totalDuration": "12 - 24 months",
            "stages": [
                {
                    "stageNum": 1,
                    "title": f"Understand {clean_title}",
                    "duration": "0 - 2 Months",
                    "description": f"Learn what {clean_title} professionals do, required qualifications, and common job paths.",
                    "skills": [f"{clean_title} Fundamentals", f"{clean_title} Career Research"],
                    "resources": ["Introductory courses", "Career videos", "College/program websites"],
                    "milestone": "Create a clear career checklist.",
                },
                {
                    "stageNum": 2,
                    "title": f"Build {clean_title} Core Skills",
                    "duration": "2 - 8 Months",
                    "description": "Study the core syllabus, practice regularly, and track progress with small projects or assignments.",
                    "skills": [f"{clean_title} Problem Solving", f"{clean_title} Communication", f"{clean_title} Practical Work"],
                    "resources": ["Free online courses", "Textbooks", "Mentor guidance"],
                    "milestone": "Complete 2-3 practical learning outputs.",
                },
                {
                    "stageNum": 3,
                    "title": f"Prepare for {clean_title} Entry Roles",
                    "duration": "8 - 18 Months",
                    "description": "Build a resume, prepare for interviews, apply to internships, and speak with professionals.",
                    "skills": ["Interview Prep", "Resume Writing", "Industry Awareness"],
                    "resources": ["Internship portals", "LinkedIn", "Mock interviews"],
                    "milestone": "Apply to relevant internships or beginner roles.",
                },
            ],
        },
        "jobs": {
            "entryLevel": [
                {"title": f"{clean_title} Trainee", "description": "Learn under supervision and handle basic tasks.", "salaryMin": 2.5, "salaryMax": 5, "companies": []}
            ],
            "midLevel": [
                {"title": f"{clean_title} Associate", "description": "Own routine responsibilities and support client or team outcomes.", "salaryMin": 5, "salaryMax": 10, "companies": []}
            ],
            "seniorLevel": [
                {"title": f"Senior {clean_title}", "description": "Handle complex work, mentor juniors, and improve processes.", "salaryMin": 10, "salaryMax": 20, "companies": []}
            ],
            "freelance": [
                {"title": f"Independent {clean_title} Consultant", "description": "Project-based work after building credibility.", "earningPotential": "Varies by specialization and client base"}
            ],
        },
        "insights": {
            "globalDemand": "Moderate to high for skilled candidates",
            "openPositionsIndia": "Varies by region and specialization",
            "topHiringCountries": ["India", "United States", "United Kingdom", "Canada"],
            "topIndustries": ["Education", "Healthcare", "Technology", "Consulting", "Government"],
            "topCompaniesIndia": [],
            "topCompaniesGlobal": [],
            "aiImpact": "AI can automate repetitive research and documentation, but human judgment and communication remain important.",
            "futureScope": "Students who combine fundamentals with digital skills will have stronger long-term prospects.",
            "certifications": [],
            "topCollegesIndia": [],
        },
        "salaryProgression": [
            {"level": "Fresher", "minLPA": 2.5, "maxLPA": 5},
            {"level": "2-3 Years", "minLPA": 5, "maxLPA": 10},
            {"level": "5+ Years", "minLPA": 10, "maxLPA": 20},
            {"level": "10+ Years", "minLPA": 18, "maxLPA": 35},
        ],
    }


async def _generate_and_cache_career_details(request: Request, career: Dict) -> Dict:
    prompt = _career_details_prompt(career)
    try:
        details = None
        last_error = None
        for attempt in range(1, 3):
            try:
                text = await ask_claude(
                    prompt,
                    system_prompt=(
                        "You are a career guidance expert for Indian students. "
                        "Return only valid JSON. Every field must match the requested career exactly."
                    ),
                    max_tokens=5000,
                    json_only=True,
                )
            except Exception as call_exc:
                last_error = call_exc
                logger.warning(
                    "Career detail Bedrock call failed slug=%s attempt=%s: %s",
                    career.get("slug"),
                    attempt,
                    call_exc,
                )
                continue
            try:
                candidate = extract_json(text)
            except Exception as parse_exc:
                last_error = parse_exc
                logger.warning(
                    "Career detail JSON parse failed slug=%s attempt=%s: %s",
                    career.get("slug"),
                    attempt,
                    parse_exc,
                )
                repair_prompt = f"""Repair this malformed JSON response for career "{career['title']}".
Return ONLY a valid JSON object. Do not add markdown. Preserve career-specific content.

Malformed response:
{text[:28000]}"""
                repair_text = await ask_claude(
                    repair_prompt,
                    system_prompt="You repair malformed JSON. Return only valid JSON, no markdown.",
                    max_tokens=5000,
                    json_only=True,
                )
                candidate = extract_json(repair_text)
            if _career_title_present(career["title"], candidate):
                details = candidate
                break
            logger.warning(
                "Career detail response failed title check slug=%s attempt=%s",
                career.get("slug"),
                attempt,
            )
        if details is None:
            raise last_error or ValueError(f"Claude response did not mention career title in overview: {career['title']}")
    except Exception as exc:
        logger.exception("Career detail AI generation failed for slug=%s: %s", career.get("slug"), exc)
        details = _fallback_ai_details(career["title"])
        fallback = {
            **career,
            "aiGeneratedDetails": details,
            "detailsCachedAt": None,
            "detailsGeneratedByAI": False,
        }
        return _merge_ai_details(fallback)
    now = datetime.now(timezone.utc)
    update_filter = {"_id": career["_id"]} if career.get("_id") is not None else {"slug": career["slug"]}
    await db(request).careers.update_one(
        update_filter,
        {
            "$set": {
                "aiGeneratedDetails": details,
                "detailsCachedAt": now,
                "detailsGeneratedByAI": True,
                "careerDetailsPromptVersion": CAREER_DETAILS_PROMPT_VERSION,
                "updated_at": now.isoformat(),
            }
        },
    )
    updated = {
        **career,
        "aiGeneratedDetails": details,
        "detailsCachedAt": now,
        "detailsGeneratedByAI": True,
        "careerDetailsPromptVersion": CAREER_DETAILS_PROMPT_VERSION,
    }
    return _merge_ai_details(updated)


def _basic_generated_career(title: str) -> Dict:
    clean_title = re.sub(r"\s+", " ", title).strip()
    slug = slugify(clean_title)
    meta = FIELD_META["Emerging Technology"]
    return {
        "career_id": f"career-{slug}",
        "slug": slug,
        "title": clean_title,
        "icon": meta["icon"],
        "iconColor": meta["color"],
        "category": "AI Generated",
        "field": "AI Generated",
        "tags": ["AI Generated", "Career", "India"],
        "shortDescription": f"AI-generated career profile for {clean_title}.",
        "description": f"AI-generated career profile for {clean_title}.",
        "avgSalaryMin": 4,
        "avgSalaryMax": 18,
        "avgSalary": {"min": 4, "max": 18},
        "jobGrowth5Y": 18,
        "demand": "High",
        "totalJobRoles": 8,
        "jobRoles": "8+",
        "detailsGeneratedByAI": False,
        "detailsCachedAt": None,
        "aiGeneratedDetails": None,
        "overview": f"{clean_title} is an AI-generated career path.",
        "skills": [],
        "roadmap": [],
        "jobs": [],
        "insights": {},
    }


# ---------- Careers ----------
@router.get("/careers")
async def list_careers(request: Request, q: Optional[str] = None, limit: int = 200):
    flt = {}
    if q:
        flt = {"$or": [{"title": {"$regex": q, "$options": "i"}}, {"tags": {"$regex": q, "$options": "i"}}]}
    items = await db(request).careers.find(flt, {"_id": 0}).limit(limit).to_list(limit)
    return [_normalize_public_career(item) for item in items]


@router.get("/careers/{slug}/details")
async def get_career_details(slug: str, request: Request):
    return await _get_career_detail_by_slug(slug, request)


@router.get("/careers/{slug}")
async def get_career(slug: str, request: Request):
    return await _get_career_detail_by_slug(slug, request)


async def _get_career_detail_by_slug(slug: str, request: Request):
    if slug not in ALLOWED_CAREER_SLUGS:
        raise HTTPException(404, "Career is not in the approved catalog.")
    item = await db(request).careers.find_one({"slug": slug})
    if not item:
        raise HTTPException(404, "Career is not available yet. Please restart the server to sync the approved catalog.")
    if _career_details_fresh(item):
        return _merge_ai_details(item)
    return await _generate_and_cache_career_details(request, item)


@router.post("/careers/generate")
async def generate_career(payload: CareerGenerateRequest, request: Request):
    title = re.sub(r"\s+", " ", payload.title).strip()
    if len(title) < 2:
        raise HTTPException(400, "Enter a valid career title.")
    slug = slugify(title)
    if slug not in ALLOWED_CAREER_SLUGS:
        raise HTTPException(400, "This career is not in the approved catalog.")
    item = await db(request).careers.find_one({"slug": slug})
    if not item:
        raise HTTPException(404, "Career is not available yet. Please restart the server to sync the approved catalog.")
    if _career_details_fresh(item):
        return _merge_ai_details(item)
    return await _generate_and_cache_career_details(request, item)


# ---------- Colleges ----------
@router.get("/colleges")
async def list_colleges(
    request: Request,
    q: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = 100,
):
    flt = {}
    if q:
        flt["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"city": {"$regex": q, "$options": "i"}},
            {"state": {"$regex": q, "$options": "i"}},
        ]
    if category and category.lower() != "all":
        flt["category"] = {"$in": [category]}
    items = await db(request).colleges.find(flt, {"_id": 0}).limit(limit).to_list(limit)
    return items


@router.post("/colleges/search")
async def search_colleges_from_web(payload: CollegeSearchRequest, request: Request):
    location = payload.location.strip()
    if len(location) < 2:
        raise HTTPException(400, "Enter a valid location.")

    course = (payload.course or "").strip()
    # Cache key includes both course and location for distinct results
    cache_key = _location_key(f"{course}_{location}" if course else location)
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(hours=6)

    cache = await db(request).colleges_cache.find_one(
        {"location": cache_key, "cachedAt": {"$gte": cutoff}},
        {"_id": 0},
    )
    if not cache:
        legacy_cache = await db(request).colleges_cache.find_one({"location_key": cache_key}, {"_id": 0})
        legacy_cached_at = legacy_cache.get("timestamp") if legacy_cache else None
        if legacy_cached_at:
            if isinstance(legacy_cached_at, str):
                legacy_cached_at = datetime.fromisoformat(legacy_cached_at.replace("Z", "+00:00"))
            if legacy_cached_at.tzinfo is None:
                legacy_cached_at = legacy_cached_at.replace(tzinfo=timezone.utc)
            if legacy_cached_at >= cutoff:
                cache = legacy_cache

    if cache:
        return {
            "location": cache.get("searchedLocation") or location,
            "course": course,
            "results": cache.get("results", []),
            "cached": True,
            "enriched": cache.get("enriched", True),
        }

    maps_key = os.environ.get("GOOGLE_MAPS_API_KEY", "").strip()
    if not maps_key:
        error = RuntimeError("GOOGLE_MAPS_API_KEY is not configured")
        _log_college_error(location, "google_places_config", error)
        raise HTTPException(503, "Search temporarily unavailable. Please try again.")

    if course:
        queries = [
            f"{course} colleges in {location}",
            f"{course} institutes in {location}",
            f"{course} coaching center {location}",
        ]
    else:
        queries = [
            f"{location} engineering medical colleges",
            f"{location} commerce arts law colleges",
            f"{location} coaching institute skill development center",
        ]

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            search_batches = await asyncio.gather(
                *[_google_text_search(client, maps_key, query) for query in queries]
            )
            places_by_id = {}
            for place in [item for batch in search_batches for item in batch]:
                place_id = place.get("id")
                if place_id and place_id not in places_by_id:
                    places_by_id[place_id] = place

            top_places = sorted(
                places_by_id.values(),
                key=lambda item: (item.get("rating") or 0, item.get("userRatingCount") or 0),
                reverse=True,
            )[:10]

            if not top_places:
                await db(request).colleges_cache.update_one(
                    {"location": cache_key},
                    {
                        "$set": {
                            "location": cache_key,
                            "searchedLocation": location,
                            "course": course,
                            "results": [],
                            "cachedAt": now,
                            "enriched": False,
                        }
                    },
                    upsert=True,
                )
                return {
                    "location": location,
                    "course": course,
                    "results": [],
                    "cached": False,
                    "message": f"No institutes found for{(' ' + course + ' in') if course else ''} {location}. Try a nearby major city.",
                }

            detail_responses = await asyncio.gather(
                *[_google_place_details(client, maps_key, place["id"]) for place in top_places],
                return_exceptions=True,
            )
    except Exception as e:
        _log_college_error(location, "google_places", e)
        raise HTTPException(503, "Search temporarily unavailable. Please try again.")

    raw_results = []
    for idx, place in enumerate(top_places):
        details = detail_responses[idx] if idx < len(detail_responses) else {}
        if isinstance(details, Exception):
            _log_college_error(location, f"google_place_details:{place.get('id')}", details)
            details = {}
        raw_results.append(_normalize_google_place(place, details))

    course_context = f" for '{course}' programs" if course else ""
    prompt = f"""You are an Indian college/institute research assistant. Here are institutes
found near {location}{course_context} via Google Places API:

{json.dumps(raw_results, ensure_ascii=False)}

For each institute enrich the data by identifying:
- What courses they likely offer based on their name{f' (prioritize {course}-related courses)' if course else ''}
- Category: Engineering / Medical / Management / Commerce /
  Law / Coaching / Skill Development / Arts
- Any additional context useful for an Indian student

Return ONLY a JSON array with fields:
name, address, phone, website, rating,
reviewCount, courses[], category, businessStatus,
googleMapsLink (construct as https://maps.google.com/?q={{name}}+{{address}})
"""

    enriched = True
    results = raw_results
    try:
        text = await ask_claude(
            prompt,
            system_prompt="You are a college research assistant. Return only valid JSON.",
            max_tokens=4000,
            json_only=True,
        )
        parsed = _extract_json_array(text)
        fallback_lookup = _fallback_by_name(raw_results)
        normalized = [
            _normalize_college_item(item, idx, _find_fallback(item, fallback_lookup))
            for idx, item in enumerate(parsed[:10])
            if isinstance(item, dict)
        ]
        if normalized:
            results = normalized
        else:
            enriched = False
    except Exception as e:
        enriched = False
        _log_college_error(location, "bedrock_enrichment", e)

    await db(request).colleges_cache.update_one(
        {"location": cache_key},
        {
            "$set": {
                "location": cache_key,
                "searchedLocation": location,
                "course": course,
                "results": results,
                "cachedAt": now,
                "enriched": enriched,
            }
        },
        upsert=True,
    )
    return {
        "location": location,
        "course": course,
        "results": results,
        "cached": False,
        "enriched": enriched,
        "message": None if enriched else "Showing raw Google Places results because enrichment is temporarily unavailable.",
    }


@router.post("/colleges/recommend")
async def recommend_colleges_from_results(
    payload: CollegeRecommendRequest,
    request: Request,
    user=Depends(current_user),
):
    results = payload.results[:12]
    if not results:
        raise HTTPException(400, "Search for colleges before requesting recommendations.")

    profile = user.get("profile", {}) or {}
    onboarding = user.get("onboarding_answers", []) or []
    prompt = f"""You are Late Comers AI, an Indian college recommendation counselor.

User profile:
{json.dumps(profile, ensure_ascii=False)}

Onboarding quiz answers:
{json.dumps(onboarding, ensure_ascii=False)}

Current searched location: {payload.location or "Not provided"}

Current Google Places search results:
{json.dumps(results, ensure_ascii=False)}

Recommend the top 3 most suitable colleges or institutes from the provided results only, with clear reasoning. Consider the student's career goals, budget, stream, education level, strengths, onboarding answers, and location. Do not recommend anything outside the provided results.

Return STRICT JSON only:
{{
  "summary": "<2 sentence personalized recommendation summary>",
  "recommendations": [
    {{
      "name": "<exact institute name from results>",
      "fit": "<High|Medium|Low>",
      "reason": "<specific reason in 1-2 sentences>",
      "nextStep": "<practical next step>"
    }}
  ]
}}
"""

    try:
        text = await ask_claude(prompt, max_tokens=1200, json_only=True)
        return extract_json(text)
    except Exception as e:
        logger.exception(
            "College recommendation failed location=%s timestamp=%s error=%s",
            payload.location,
            datetime.now(timezone.utc).isoformat(),
            e,
        )
        raise HTTPException(503, "Recommendations are temporarily unavailable. Please try again in a moment")


@router.get("/colleges/location-search")
async def search_colleges_by_location(
    request: Request,
    location: str = Query(..., min_length=2),
    radius_km: int = Query(15, ge=1, le=50),
):
    maps_key = os.environ.get("GOOGLE_MAPS_API_KEY", "").strip()
    if not maps_key:
        return {
            "status": "MAPS_API_KEY_MISSING",
            "message": "Feature coming soon",
            "results": [],
        }

    async with httpx.AsyncClient(timeout=20.0) as client:
        geo_resp = await client.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            params={"address": location, "key": maps_key},
        )
        if geo_resp.status_code != 200:
            logger.warning("Geocode failed with status=%s", geo_resp.status_code)
            raise HTTPException(502, "Failed to fetch location data from Google Maps")

        geo_data = geo_resp.json()
        geo_results = geo_data.get("results", [])
        if not geo_results:
            return {
                "status": "LOCATION_NOT_FOUND",
                "message": "We couldn't find that location. Try a major city name.",
                "results": [],
            }

        geo_result = geo_results[0]
        lat = geo_result["geometry"]["location"]["lat"]
        lng = geo_result["geometry"]["location"]["lng"]

        places_resp = await client.get(
            "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
            params={
                "location": f"{lat},{lng}",
                "radius": radius_km * 1000,
                "type": "university",
                "keyword": "college",
                "key": maps_key,
            },
        )
        if places_resp.status_code != 200:
            logger.warning("Places failed with status=%s", places_resp.status_code)
            raise HTTPException(502, "Failed to fetch colleges from Google Maps")

        places_data = places_resp.json()
        raw_results = places_data.get("results", [])
        mapped_results = [
            {
                "place_id": item.get("place_id"),
                "name": item.get("name"),
                "address": item.get("vicinity", ""),
                "rating": item.get("rating"),
                "user_ratings_total": item.get("user_ratings_total"),
                "location": item.get("geometry", {}).get("location", {}),
            }
            for item in raw_results
            if item.get("name")
        ]

    if not mapped_results:
        return {
            "status": "NO_COLLEGES_FOUND",
            "message": "No colleges found within 15km. Try a broader location.",
            "results": [],
        }

    return {
        "status": "OK",
        "message": "Results loaded",
        "searched_location": location,
        "resolved_location": geo_result.get("formatted_address", location),
        "center": {"lat": lat, "lng": lng},
        "results": mapped_results,
    }


# ---------- Scholarships ----------
@router.get("/scholarships")
async def list_scholarships(
    request: Request, q: Optional[str] = None, type: Optional[str] = None, limit: int = 100
):
    flt = {}
    if q:
        flt["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
        ]
    if type and type.lower() != "all":
        flt["type"] = type
    items = await db(request).scholarships.find(flt, {"_id": 0}).limit(limit).to_list(limit)
    return items


# ---------- Career test questions ----------
@router.get("/career-test/questions")
async def get_test_questions(request: Request):
    items = await db(request).test_questions.find({}, {"_id": 0}).to_list(200)
    items.sort(key=lambda x: x.get("order", 0))
    return items


# ---------- User profile + onboarding ----------
class ProfileIn(BaseModel):
    educationLevel: Optional[str] = None
    stream: Optional[str] = None
    subjects: Optional[List[str]] = None
    hobbies: Optional[str] = None
    strengths: Optional[List[str]] = None
    workPreference: Optional[List[str]] = None
    careerGoal: Optional[str] = None
    location: Optional[str] = None
    onboarded: Optional[bool] = None


@router.put("/me/profile")
async def update_profile(payload: ProfileIn, request: Request, user=Depends(current_user)):
    update = {f"profile.{k}": v for k, v in payload.model_dump(exclude_none=True).items() if k != "onboarded"}
    if payload.onboarded is not None:
        update["onboarded"] = payload.onboarded
    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db(request).users.update_one({"user_id": user["user_id"]}, {"$set": update})
    return await db(request).users.find_one({"user_id": user["user_id"]}, {"_id": 0})


class SaveItem(BaseModel):
    kind: str  # "careers" | "colleges" | "scholarships"
    item_id: str


PLAN_LIMITS = {
    "basic": {
        "name": "Basic",
        "price": 9,
        "aiChats": 0,
        "mockInterviews": 0,
        "instituteSearches": 0,
        "roadmaps": 0,
    },
    "standard": {
        "name": "Standard",
        "price": 99,
        "aiChats": 15,
        "mockInterviews": 5,
        "instituteSearches": 10,
        "roadmaps": 10,
    },
    "premium": {
        "name": "Premium",
        "price": 299,
        "aiChats": 30,
        "mockInterviews": 15,
        "instituteSearches": 20,
        "roadmaps": 20,
    },
}


class MockSubscribeIn(BaseModel):
    plan: str


@router.post("/me/mock-subscribe")
async def mock_subscribe(payload: MockSubscribeIn, request: Request, user=Depends(current_user)):
    plan_key = payload.plan.lower().strip()
    if plan_key not in PLAN_LIMITS:
        raise HTTPException(400, "Invalid plan")
    now = datetime.now(timezone.utc).isoformat()
    subscription = {
        "provider": "mock",
        "status": "active",
        "plan": plan_key,
        "planName": PLAN_LIMITS[plan_key]["name"],
        "price": PLAN_LIMITS[plan_key]["price"],
        "currency": "INR",
        "startedAt": now,
        "note": "Mock subscription. Replace with Razorpay verification later.",
    }
    usage = {
        "limits": {
            "aiChats": PLAN_LIMITS[plan_key]["aiChats"],
            "mockInterviews": PLAN_LIMITS[plan_key]["mockInterviews"],
            "instituteSearches": PLAN_LIMITS[plan_key]["instituteSearches"],
            "roadmaps": PLAN_LIMITS[plan_key]["roadmaps"],
        },
        "used": {
            "aiChats": 0,
            "mockInterviews": 0,
            "instituteSearches": 0,
            "roadmaps": 0,
        },
        "periodStartedAt": now,
    }
    await db(request).users.update_one(
        {"user_id": user["user_id"]},
        {
            "$set": {
                "subscription": subscription,
                "usage": usage,
                "updated_at": now,
            }
        },
    )
    updated = await db(request).users.find_one({"user_id": user["user_id"]}, {"_id": 0})
    return {"ok": True, "user": updated, "subscription": subscription, "usage": usage}


@router.post("/me/save")
async def save_item(payload: SaveItem, request: Request, user=Depends(current_user)):
    if payload.kind not in ("careers", "colleges", "scholarships"):
        raise HTTPException(400, "Invalid kind")
    await db(request).users.update_one(
        {"user_id": user["user_id"]},
        {"$addToSet": {f"saved_items.{payload.kind}": payload.item_id}},
    )
    return {"ok": True}


@router.post("/me/unsave")
async def unsave_item(payload: SaveItem, request: Request, user=Depends(current_user)):
    if payload.kind not in ("careers", "colleges", "scholarships"):
        raise HTTPException(400, "Invalid kind")
    await db(request).users.update_one(
        {"user_id": user["user_id"]},
        {"$pull": {f"saved_items.{payload.kind}": payload.item_id}},
    )
    return {"ok": True}


class RoadmapProgressIn(BaseModel):
    career_slug: str
    stage_num: int
    progress: int  # 0..100


@router.post("/me/roadmap/progress")
async def update_roadmap_progress(payload: RoadmapProgressIn, request: Request, user=Depends(current_user)):
    key_career = f"roadmap_progress.{payload.career_slug}"
    await db(request).users.update_one(
        {"user_id": user["user_id"]},
        {
            "$set": {
                f"{key_career}.stage_{payload.stage_num}": payload.progress,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
        },
    )
    return {"ok": True}
