"""AI routes: onboarding analysis, career test scoring, chat, roadmap generation, mock interview, scholarship matcher."""
import json
import logging
import re
import uuid
from datetime import datetime, timezone
from typing import Any, List, Optional, Dict, Union

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel

from auth_routes import current_user
from llm_client import ask_claude, extract_json, llm_status
from subscription_utils import consume_feature, ensure_quiz_result_access, ensure_feature_available

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai", tags=["ai"])


def db(request: Request):
    return request.app.state.db


CAREER_MATCH_SCORING_GUIDANCE = """
Career match scoring rules (apply ALL these rules to score each career):

STREAM MATCHING (highest weight):
- Commerce stream → strongly prioritize: CA, CMA, CS, ACCA, CFA, GST Practitioner, Income Tax Consultant, Tally Accountant, SAP FICO, Financial Modeler, Investment Banker, Stock Market Trader, Mutual Fund Advisor, Business Analyst, Financial Analyst, MBA Manager. Also good: Digital Marketing, SEO, Social Media Manager, Business Development, Entrepreneur, Copywriter.
- Science PCM → strongly prioritize: Full Stack Dev, Python Dev, Java Dev, Data Scientist, AI ML Engineer, DevOps, AWS Architect, Cybersecurity Analyst, Ethical Hacker, Robotics Engineer, IoT Engineer, EV Technology Engineer, Software Developer, Cloud Engineer. Also good: Data Analytics, Business Analytics, Game Developer, Drone Technology.
- Science PCB → strongly prioritize switcher-friendly paths: Medical Representative MR, Medical Coder, Healthcare Data Analyst, Clinical Research Associate, Lab Technician, Nutritionist Dietitian, Radiologist Technician. Also good: Yoga Instructor, Fitness Trainer, Spa Therapist.
- Arts/Humanities → strongly prioritize: Lawyer, Judiciary Officer, UPSC IAS, MPSC Officer, HR Manager, Translator, Interpreter, Content Writer, Copywriter, Social Worker, Teacher. Also good: Graphic Designer, Video Editor, Photographer, Social Media Manager.

FIELD INTEREST MATCHING (Q10):
- IT/Software → boost all IT/Software careers
- Data Science/AI → boost Data/AI careers
- Cybersecurity/Cloud → boost Cybersecurity + Cloud careers
- Design/Media/UX → boost Design/Creative careers
- Digital Marketing → boost Marketing/Sales careers
- Finance/Accounting → boost Finance careers
- Government → boost Government careers
- Law/Management → boost Law + Management careers
- Healthcare → boost Healthcare careers
- Creative Arts/Animation → boost Animation/Gaming/VFX careers
- Vocational → boost Vocational/Trade careers
- Freelance/Entrepreneurship → boost Freelance careers

ACTIVITY & PERSONALITY MATCHING (Q5, Q6, Q7):
- Technical problem solving → boost IT, Cyber, Data careers
- Designing/creating → boost Design, Media careers
- Talking to people/sales → boost Sales, Marketing, HR, Law
- Managing/leadership → boost MBA, Management, BDE
- Gaming/animation → boost Game Dev, Animation, VFX
- Helping people/social → boost Healthcare, Social Work, Teaching
- Government service → boost all Government careers

INCOME TIMELINE (Q9):
- Within 3-6 months → boost Freelance, Digital Marketing, Graphic Design, Video Editing, Vocational, Tally, GST Practitioner
- Within 1 year → boost mid-level tech courses
- 1-3 years → boost degree-level careers
- Long term 3-5 years → boost CA, UPSC, MBA, Engineering

GOVERNMENT EXAM (Q11):
- Banking → boost Bank PO, RBI Grade B
- UPSC/MPSC → boost IAS, IPS, MPSC Officer
- SSC/Railways → boost SSC CGL, Railway Officer
- Defense/Police → boost NDA, CDS, PSI
- CA/CMA/CS → boost those specific careers
- MBA entrance → boost MBA Manager, Product Manager
- CLAT/Law → boost Lawyer, Judiciary

IMPORTANT: Dynamically calculate all match percentages from the student's actual answers. Never use fixed or hardcoded percentages. Top matches should be 80-95%, additional matches 60-79%.
"""


@router.get("/status")
async def status():
    return llm_status()


# ─────────────────────────────────────────────────────────────────────────────
# Onboarding — 15-question career profiling quiz → AI analysis → save results
# ─────────────────────────────────────────────────────────────────────────────

class OnboardingAnswer(BaseModel):
    questionId: str
    question: str
    answer: Union[str, List[str]]


class OnboardingRequest(BaseModel):
    answers: List[OnboardingAnswer]


class AdaptiveQuestionRequest(BaseModel):
    answeredQuestions: List[Dict]


def _career_salary_min(career: dict) -> int:
    salary = career.get("avgSalary") or {}
    return int(career.get("avgSalaryMin") or salary.get("min") or 0)


def _career_salary_max(career: dict) -> int:
    salary = career.get("avgSalary") or {}
    return int(career.get("avgSalaryMax") or salary.get("max") or 0)


def _career_growth(career: dict) -> int:
    return int(career.get("jobGrowth") or career.get("jobGrowth5Y") or 0)


def _stream_from_answers(answers: List[Dict]) -> str:
    text = json.dumps(answers, ensure_ascii=False).lower()
    if "commerce" in text:
        return "commerce"
    if "pcb" in text or "biology" in text or "medical" in text or "healthcare" in text:
        return "pcb"
    if "pcm" in text or "physics" in text or "engineering" in text:
        return "pcm"
    if "arts" in text or "humanities" in text:
        return "arts"
    return "general"


def _adaptive_fallback_question(answered_questions: List[Dict], next_number: int) -> dict:
    stream = _stream_from_answers(answered_questions)
    by_stream = {
        "commerce": [
            ("Commerce Focus", "Which commerce direction feels most exciting right now?", ["Auditing and taxation", "Stock markets and investing", "Business operations", "Marketing and brand growth", "Starting my own venture"]),
            ("Finance Depth", "What kind of finance work would you enjoy doing repeatedly?", ["Preparing accounts carefully", "Analyzing companies and markets", "Advising people on money", "Managing business budgets", "Learning tax and compliance"]),
            ("Business Style", "Which business environment sounds like a strong fit?", ["Corporate finance team", "Startup or entrepreneurship", "Banking or investment firm", "Marketing agency or brand team", "Accounting or CA practice"]),
        ],
        "pcm": [
            ("PCM Focus", "Which PCM path should we explore more deeply?", ["Core engineering", "Software development", "Data science and AI", "Cloud or cybersecurity", "Research and innovation"]),
            ("Tech Direction", "What kind of technical problem attracts you most?", ["Building apps or websites", "Working with data and AI models", "Securing systems", "Designing machines or infrastructure", "Solving math-heavy problems"]),
            ("Engineering Style", "Which project would you pick first?", ["A mobile app", "A robot or IoT device", "A data dashboard", "A secure cloud system", "A bridge or product design"]),
        ],
        "pcb": [
            ("PCB Focus", "Which biology-linked path should we narrow toward?", ["Healthcare sales", "Medical coding", "Biotech and research", "Nutrition and wellness", "Health data or operations"]),
            ("Healthcare Style", "How would you prefer to contribute in healthcare?", ["Treat patients directly", "Work in labs and research", "Advise on diet and wellness", "Manage healthcare data", "Support medicines and pharmacy"]),
            ("Medical Readiness", "What kind of medical journey feels realistic for you?", ["Long MBBS route", "Allied healthcare degree", "Biotech or life-science degree", "Shorter job-oriented certification", "Still comparing options"]),
        ],
        "arts": [
            ("Arts Focus", "Which arts/humanities direction feels most natural?", ["Law and public policy", "Media and journalism", "Design and content", "Psychology or counseling", "Teaching or social work"]),
            ("Communication Style", "How do you prefer to use your communication skills?", ["Arguing and persuading", "Writing and reporting", "Teaching and explaining", "Creating content", "Helping people one-on-one"]),
            ("Impact Area", "Where would you like your work to create impact?", ["Justice and rights", "Education", "Mental health", "Media awareness", "Community development"]),
        ],
        "general": [
            ("Career Direction", "Which area should we explore more deeply?", ["Business and management", "Technology", "Creative work", "Healthcare", "Government or public service"]),
            ("Work Style", "What kind of work would keep you engaged?", ["Analyzing information", "Building practical things", "Helping people", "Leading projects", "Creating content or designs"]),
            ("Goal Fit", "What matters most in your next career step?", ["High income", "Job stability", "Creative freedom", "Fast skill-based earning", "Long-term prestige"]),
        ],
    }
    pool = by_stream.get(stream, by_stream["general"])
    category, question, options = pool[(max(next_number, 3) - 3) % len(pool)]
    return {
        "question": question,
        "category": category,
        "options": options,
        "multiSelect": next_number in {4, 7, 9},
        "maxSelections": 3 if next_number in {4, 9} else 1,
    }


def _normalize_adaptive_question(data: dict, answered_questions: List[Dict]) -> dict:
    next_number = len(answered_questions) + 1
    fallback = _adaptive_fallback_question(answered_questions, next_number)
    options = data.get("options") if isinstance(data.get("options"), list) else fallback["options"]
    options = [str(o).strip() for o in options if str(o).strip()][:5]
    if len(options) < 3:
        options = fallback["options"]
    multi_select = bool(data.get("multiSelect", fallback["multiSelect"]))
    max_selections = int(data.get("maxSelections") or fallback["maxSelections"] or 1)
    if not multi_select:
        max_selections = 1
    return {
        "question": str(data.get("question") or fallback["question"]).strip(),
        "category": str(data.get("category") or fallback["category"]).strip(),
        "options": options,
        "multiSelect": multi_select,
        "maxSelections": min(max(max_selections, 1), 3),
    }


@router.post("/onboarding/next-question")
async def next_onboarding_question(
    payload: AdaptiveQuestionRequest,
    request: Request,
    user=Depends(current_user),
):
    """Generate the next adaptive onboarding question after static Q1/Q2."""
    answered_questions = payload.answeredQuestions or []
    next_number = len(answered_questions) + 1
    if next_number < 3 or next_number > 12:
        raise HTTPException(400, "Adaptive questions are only available for questions 3 to 12.")

    prompt = f"""User has answered the following questions so far:
{json.dumps(answered_questions, ensure_ascii=False)}

Based on these answers, generate the next question 
for a career guidance quiz for Indian students.

Rules:
- If user selected Commerce stream, next questions 
  must explore finance, business, accounting, 
  marketing angles deeply
- If user selected Science PCM, explore engineering, 
  tech, data science angles
- If user selected Science PCB, explore medical, 
  healthcare, biotech angles  
- If user selected Arts, explore law, media, 
  design, social work angles
- If user selected IT or Tech interest, go deeper 
  into which tech field specifically
- Never show irrelevant options — a commerce student 
  should never see "Do you enjoy coding?" as primary
- Make options feel personalized and specific to 
  their previous answers
- Questions should progressively narrow down to 
  specific career paths

Return ONLY a JSON object:
{{
  "question": "question text here",
  "category": "category name",
  "options": ["option1", "option2", "option3", 
              "option4", "option5"],
  "multiSelect": true or false,
  "maxSelections": 1, 2, or 3
}}"""

    try:
        text = await ask_claude(prompt, max_tokens=900, json_only=True)
        data = extract_json(text)
    except Exception as e:
        logger.error(f"Adaptive onboarding question LLM error: {e}")
        data = _adaptive_fallback_question(answered_questions, next_number)

    return _normalize_adaptive_question(data, answered_questions)


def _career_matches_keywords(career: dict, keywords: List[str]) -> bool:
    haystack = " ".join(
        str(career.get(k, "")) for k in ("slug", "title", "category", "field", "description", "shortDescription")
    ).lower()
    haystack += " " + " ".join(career.get("tags") or []).lower()
    return any(keyword in haystack for keyword in keywords)


def _preferred_career_keywords(answers: List[dict]) -> List[List[str]]:
    text = json.dumps(answers, ensure_ascii=False).lower()
    tech = any(word in text for word in ["tech", "coding", "software", "data", "ai", "cloud", "cyber", "it/software"])
    govt = any(word in text for word in ["government", "upsc", "mpsc", "ssc", "railway", "defense", "defence", "banking", "civil services"])
    creative = any(word in text for word in ["design", "creative", "animation", "gaming", "editing", "photography", "film"])
    quick_income = any(word in text for word in ["3-6 months", "quick job-ready", "fast income", "quick income"])
    freelance = any(word in text for word in ["freelance", "entrepreneurship", "own business", "startup"])
    language = any(word in text for word in ["foreign language", "languages/international", "international career", "outside india", "tourism"])
    beauty = any(word in text for word in ["beauty", "wellness", "fitness", "makeup", "fashion"])
    aviation = any(word in text for word in ["aviation", "hospitality", "travelling", "travel", "hosting", "cabin crew"])
    emerging = any(word in text for word in ["emerging tech", "blockchain", "robotics", "iot", "drone", "ev technology"])
    vocational = any(word in text for word in ["vocational", "tools", "machines", "electronics", "repair", "hands-on", "on-the-job"])

    field_category = _primary_category_from_answers(answers)
    if field_category:
        groups = [_keywords_for_category(field_category)]
    else:
        groups = []

    if "commerce" in text:
        groups += [
            ["chartered accountant", "ca", "accountant"],
            ["business analyst"],
            ["financial analyst", "finance"],
            ["investment banker"],
            ["stock market trader"],
            ["gst practitioner", "tally"],
            ["mba", "manager"],
            ["digital marketing", "marketing manager"],
            ["entrepreneur", "startup founder"],
        ]
    elif "pcb" in text or "biology" in text or "medical" in text or "healthcare" in text:
        groups += [
            ["doctor", "mbbs"],
            ["pharmacist"],
            ["nurse"],
            ["physiotherapist"],
            ["medical coder"],
            ["nutritionist", "dietitian"],
            ["lab technician"],
            ["biotech", "biotechnologist"],
        ]
    elif "pcm" in text or "science" in text or "engineering" in text:
        groups += [
            ["software developer", "full stack"],
            ["data scientist"],
            ["ai ml", "machine learning"],
            ["cloud engineer", "cloud architect", "aws"],
            ["cybersecurity", "ethical hacker"],
            ["devops"],
            ["robotics"],
            ["iot engineer"],
        ]
    elif "arts" in text or "humanities" in text:
        groups += [
            ["lawyer"],
            ["upsc", "ias"],
            ["hr manager"],
            ["journalist", "content writer"],
            ["teacher", "professor"],
            ["psychologist", "counselor"],
            ["social worker"],
            ["translator", "interpreter"],
        ]
    else:
        groups += [
            ["business analyst"],
            ["data scientist"],
            ["software developer"],
            ["digital marketing"],
            ["designer"],
            ["financial analyst"],
            ["entrepreneur"],
            ["content creator"],
        ]

    if tech:
        groups.insert(0, ["software developer", "full stack", "data scientist", "ai ml", "cloud", "cybersecurity"])
    if govt:
        groups.insert(1, ["upsc", "mpsc", "bank po", "ssc", "railway", "defence", "defense"])
    if creative:
        groups.insert(2, ["graphic designer", "video editor", "animator", "game designer", "ui ux"])
    if quick_income:
        groups.insert(0, ["freelance", "digital marketing", "video editor", "graphic designer", "tally"])
    if freelance:
        groups.insert(0, ["freelance", "entrepreneur", "shopify", "wordpress", "saas"])
    if language:
        groups.insert(0, ["translator", "interpreter", "german", "japanese", "french", "tourism", "embassy"])
    if beauty:
        groups.insert(0, ["makeup", "yoga", "fitness", "hair", "nail", "spa"])
    if aviation:
        groups.insert(0, ["cabin crew", "airport", "aviation", "hotel", "cruise"])
    if emerging:
        groups.insert(0, ["blockchain", "crypto", "web3", "drone", "ev", "robotics", "iot"])
    if vocational:
        groups.insert(0, ["electrician", "repair", "technician", "cctv", "cnc", "interior"])
    return groups


FIELD_INTEREST_TO_CATEGORY = {
    "Building an app or website": "IT / Software / Tech",
    "Working with numbers and spreadsheets": "Finance / Commerce",
    "Designing something that looks great": "Design / Creative / Media",
    "Maths or Accounts": "Finance / Commerce",
    "English or Communication": "Language",
    "Computer Science": "IT / Software / Tech",
    "Business Studies or Economics": "Law & Management",
    "Arts or Drawing": "Design / Creative / Media",
    "Learning to code": "IT / Software / Tech",
    "Starting a small business": "High-Income Freelance",
    "Creating videos, writing, or design": "Design / Creative / Media",
    "Studying for a government exam": "Government Exam",
    "Improving English or communication": "Language",
    "Technical problems": "IT / Software / Tech",
    "People problems": "Aviation & Hospitality",
    "Business problems": "Law & Management",
    "Creative problems": "Design / Creative / Media",
    "MS Excel": "Data & AI",
    "Customer service communication": "Aviation & Hospitality",
    "Data entry typing": "Finance / Commerce",
    "Social media basics": "Digital Marketing",
    "Basic coding knowledge": "IT / Software / Tech",
    "Writing content creation": "Digital Marketing",
    "Solving code or data at a laptop": "Data & AI",
    "Presenting strategy in meetings": "Law & Management",
    "Creating content design or videos": "Design / Creative / Media",
    "Meeting clients and selling": "Digital Marketing",
    "Preparing reports and spreadsheets": "Finance / Commerce",
    "IT/Software/Coding": "IT / Software / Tech",
    "Data Science/AI/Analytics": "Data & AI",
    "Cybersecurity": "Cybersecurity",
    "Cloud/DevOps/Infrastructure": "Cloud & Infrastructure",
    "Design/UI-UX/Graphics": "Design / Creative / Media",
    "Animation/Gaming/VFX": "Animation / VFX / Gaming",
    "Photography/Film/Cinema": "Photography & Film Making",
    "Digital Marketing/Content": "Digital Marketing",
    "Finance/Accounting/Stocks": "Finance / Commerce",
    "Healthcare/Medical": "Healthcare & Medical Allied",
    "Beauty/Fashion/Wellness": "Beauty / Wellness",
    "Languages/International": "Language",
    "Aviation/Hospitality/Travel": "Aviation & Hospitality",
    "Government/Civil Services": "Government Exam",
    "Law/MBA/Management": "Law & Management",
    "Vocational/Trades/Repair": "Vocational / Skill",
    "Emerging Tech": "Emerging Technology",
    "Freelance/Entrepreneurship": "High-Income Freelance",
}


def _answer_map(answers: List[dict]) -> Dict[str, Any]:
    return {item.get("questionId"): item.get("answer") for item in answers if item.get("questionId")}


def _primary_category_from_answers(answers: List[dict]) -> Optional[str]:
    answer_map = _answer_map(answers)
    for qid in ("q2", "q4", "q5", "q6", "q24", "q28", "q10"):
        value = answer_map.get(qid)
        values = value if isinstance(value, list) else [value]
        for item in values:
            category = FIELD_INTEREST_TO_CATEGORY.get(item)
            if category:
                return category
    return None


def _keywords_for_category(category: str) -> List[str]:
    return {
        "IT / Software / Tech": ["full stack", "frontend", "backend", "python", "java", "mobile app", "software"],
        "Data & AI": ["data", "analytics", "ai", "machine learning", "power bi", "tableau", "sql", "excel"],
        "Cybersecurity": ["security", "hacking", "penetration", "soc", "forensics", "malware", "kali"],
        "Cloud & Infrastructure": ["aws", "azure", "google cloud", "devops", "docker", "kubernetes", "linux", "networking"],
        "Design / Creative / Media": ["graphic", "ui", "ux", "product design", "video", "motion"],
        "Animation / VFX / Gaming": ["animation", "vfx", "game", "unity", "unreal", "character", "ar", "vr"],
        "Photography & Film Making": ["photography", "cinematography", "film", "direction", "drone photography"],
        "Digital Marketing": ["digital marketing"],
        "Finance / Commerce": ["tally", "gst", "income tax", "sap", "financial", "investment", "stock", "ca", "cma", "cseet", "acca", "cfa"],
        "Healthcare & Medical Allied": ["lab", "nutrition", "nursing", "physiotherapy", "pharmacy", "medical", "radiology"],
        "Beauty / Wellness": ["makeup", "yoga", "fitness", "hair", "nail", "spa"],
        "Language": ["translator", "interpreter", "language", "german", "japanese", "french", "spanish", "korean", "mandarin", "arabic", "embassy", "tourism", "teaching"],
        "Aviation & Hospitality": ["cabin", "airport", "aviation", "hotel", "cruise"],
        "Government Exam": ["upsc", "mpsc", "banking", "ssc", "railways", "defense", "police"],
        "Law & Management": ["clat", "judiciary", "llb", "cat", "mba", "xat", "snap", "nmat"],
        "Vocational / Skill": ["electrician", "technician", "repair", "cctv", "cnc", "interior"],
        "Emerging Technology": ["blockchain", "crypto", "web3", "drone", "ev", "robotics", "iot"],
        "High-Income Freelance": ["web design", "wordpress", "shopify", "freelance", "copywriting", "seo"],
    }.get(category, [category.lower()])


def _career_public_fields(career: dict, match_percent: int, why_match: Optional[List[str]] = None) -> dict:
    return {
        "title": career.get("title") or career.get("slug", "").replace("-", " ").title(),
        "matchPercent": int(match_percent),
        "slug": career.get("slug"),
        "tags": (career.get("tags") or [])[:3],
        "shortDescription": career.get("shortDescription") or career.get("description") or "Strong fit based on your quiz answers.",
        "avgSalaryMin": _career_salary_min(career),
        "avgSalaryMax": _career_salary_max(career),
        "jobGrowth": _career_growth(career),
        "demand": career.get("demand") or "High",
        "whyMatch": why_match or [
            "Matches your stream and career interests.",
            "Fits your preferred work style.",
            "Aligns with your long-term goals.",
        ],
    }


def _pick_fallback_careers(careers: List[dict], answers: List[dict], used_slugs: Optional[set] = None) -> List[dict]:
    used_slugs = used_slugs or set()
    picked = []
    primary_category = _primary_category_from_answers(answers)
    if primary_category:
        for career in careers:
            slug = career.get("slug")
            category = career.get("category") or career.get("field")
            if slug and slug not in used_slugs and category == primary_category:
                picked.append(career)
                used_slugs.add(slug)
                if len(picked) >= 5:
                    break

    for keywords in _preferred_career_keywords(answers):
        for career in careers:
            slug = career.get("slug")
            if slug and slug not in used_slugs and _career_matches_keywords(career, keywords):
                picked.append(career)
                used_slugs.add(slug)
                break
    for career in careers:
        slug = career.get("slug")
        if slug and slug not in used_slugs:
            picked.append(career)
            used_slugs.add(slug)
        if len(picked) >= 9:
            break
    return picked


def _normalize_career_analysis(data: dict, careers: List[dict], answers: List[dict]) -> dict:
    careers_by_slug = {c.get("slug"): c for c in careers if c.get("slug")}
    used_slugs = set()

    scores = data.get("scores") or {}
    normalized = {
        "overallScore": int(data.get("overallScore") or data.get("overall") or 0),
        "scores": {
            "skills": int(scores.get("skills") or 0),
            "interests": int(scores.get("interests") or 0),
            "goals": int(scores.get("goals") or 0),
            "values": int(scores.get("values") or 0),
            "personality": int(scores.get("personality") or 0),
        },
        "summary": data.get("summary") or "Your recommendations are personalized from your education stream, interests, and goals.",
        "topCareers": [],
        "additionalCareers": [],
        "secondaryCareers": [],
    }

    def add_ai_career(item: dict, target: list, default_percent: int, include_why: bool):
        slug = item.get("slug") or item.get("careerSlug")
        career = careers_by_slug.get(slug)
        if not career or slug in used_slugs:
            return
        used_slugs.add(slug)
        match = int(item.get("matchPercent") or default_percent)
        match = max(80, min(95, match)) if include_why else min(79, max(60, match))
        why = None
        if include_why:
            if isinstance(item.get("whyMatch"), list):
                why = item.get("whyMatch")
            elif isinstance(item.get("reasons"), list):
                why = item.get("reasons")
        normalized_item = _career_public_fields(career, match, why)
        if item.get("title"):
            normalized_item["title"] = item["title"]
        if item.get("tags"):
            normalized_item["tags"] = item["tags"][:3]
        if item.get("shortDescription"):
            normalized_item["shortDescription"] = item["shortDescription"]
        target.append(normalized_item)

    for item in data.get("topCareers") or []:
        if len(normalized["topCareers"]) >= 5:
            break
        if isinstance(item, dict):
            add_ai_career(item, normalized["topCareers"], 86, True)

    secondary_source = data.get("secondaryCareers") or data.get("additionalCareers") or []
    for item in secondary_source:
        if len(normalized["additionalCareers"]) >= 4:
            break
        if isinstance(item, dict):
            add_ai_career(item, normalized["additionalCareers"], 72, False)

    fallbacks = _pick_fallback_careers(careers, answers, used_slugs)
    for career in fallbacks:
        if len(normalized["topCareers"]) < 5:
            percent = [92, 89, 86, 84, 82][len(normalized["topCareers"])]
            normalized["topCareers"].append(_career_public_fields(career, percent))
            used_slugs.add(career["slug"])
        elif len(normalized["additionalCareers"]) < 4:
            percent = [78, 75, 72, 69][len(normalized["additionalCareers"])]
            normalized["additionalCareers"].append(_career_public_fields(career, percent))
            used_slugs.add(career["slug"])
        if len(normalized["topCareers"]) == 5 and len(normalized["additionalCareers"]) == 4:
            break

    if not normalized["overallScore"]:
        top_scores = [c["matchPercent"] for c in normalized["topCareers"]]
        normalized["overallScore"] = int(sum(top_scores) / len(top_scores)) if top_scores else 75
    for key, value in list(normalized["scores"].items()):
        if not value:
            normalized["scores"][key] = max(60, min(95, normalized["overallScore"] + (len(key) % 7) - 3))

    normalized["secondaryCareers"] = normalized["additionalCareers"]
    return normalized


async def _update_user_matches(request: Request, user_id: str, data: dict):
    scores = data.get("scores", {}) or {}
    overall = data.get("overall", 0)
    top = data.get("topCareers", data.get("topMatches", [])) or []
    await db(request).users.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "profile.careerMatchScore": {
                    "overall": overall,
                    "skills": scores.get("skills", 0),
                    "interests": scores.get("interests", 0),
                    "goals": scores.get("goals", 0),
                    "values": scores.get("values", 0),
                    "personality": scores.get("personality", 0),
                },
                "profile.summary": data.get("summary", ""),
                "top_career_matches": top[:5],
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
        },
    )


ONBOARDING_SYSTEM_PROMPT = """You are a career guidance AI for Indian students and late starters.
Analyze quiz answers and return career recommendations as structured JSON.
Rules:
- Only use career slugs from the approved catalog provided.
- Always return minimum 5 topCareers and minimum 4 secondaryCareers.
- Match scores: topCareers = 80-95%, secondaryCareers = 60-79%.
- Never return markdown, never add text outside the JSON object.
- Personalize whyMatch reasons using the user's actual answer values."""


def _career_catalog_by_category(careers: List[dict]) -> Dict[str, List[str]]:
    grouped: Dict[str, List[str]] = {}
    for career in careers:
        category = career.get("category") or career.get("field") or "Other"
        slug = career.get("slug")
        if slug:
            grouped.setdefault(category, []).append(slug)
    return {category: sorted(slugs) for category, slugs in sorted(grouped.items())}


def _build_onboarding_user_prompt(answers: List[dict], careers: List[dict]) -> str:
    ans = _answer_map(answers)

    def a(qid: str) -> str:
        value = ans.get(qid, "")
        return ", ".join(value) if isinstance(value, list) else str(value or "")

    catalog_json = json.dumps(_career_catalog_by_category(careers), ensure_ascii=False, indent=2)
    return f"""Analyze this Indian student/professional's quiz answers and return career matches.

=== USER PROFILE ===
Natural interest: {a("q1")}
Satisfying activity: {a("q2")}
Technical comfort: {a("q3")}
Favorite subject: {a("q4")}
Side project choice: {a("q5")}
Problem style: {a("q6")}
Work environment: {a("q7")}
Deadline style: {a("q8")}
Computer comfort: {a("q9")}
Team response: {a("q10")}
Learning preference: {a("q11")}
Personality: {a("q12")}
Decision style: {a("q13")}
Speaking comfort: {a("q14")}
Repetition style: {a("q15")}
Career identity: {a("q16")}
Career priority: {a("q17")}
Security need: {a("q18")}
Business preference: {a("q19")}
Purpose need: {a("q20")}
English level: {a("q21")}
Numbers comfort: {a("q22")}
Software exposure: {a("q23")}
Existing skills: {a("q24")}
Problem-solving ability: {a("q25")}
Current situation: {a("q26")}
Biggest blocker: {a("q27")}
Ideal workday (PRIMARY SIGNAL): {a("q28")}
Target monthly salary: {a("q29")}
Career timeline: {a("q30")}

=== APPROVED CAREER CATALOG (use ONLY these slugs) ===
{catalog_json}

=== SCORING RULES ===
RULE 1 - PRIMARY FIELD TRIGGER:
Use q2, q4, q5, q6, q24, and especially q28 to identify the primary career category.
Careers in that primary category should get 85-95% scores when skills and timeline also fit.

RULE 2 - SECONDARY PERSONALITY AND ACTIVITY TRIGGERS:
- Technical/building answers boost IT, Data, Cybersecurity, Cloud, and Emerging Tech.
- Numbers/spreadsheet answers boost Finance, Accounting, Data, and Business Analytics.
- Creative/content/design answers boost Design, Digital Marketing, Animation, Photography, and Film.
- People/customer/speaking answers boost Aviation, Hospitality, Sales, Language, and Marketing.
- Government exam answers boost Government, Banking, SSC, Railway, Defence, and Police paths.
- Business/leadership answers boost Management, MBA, Operations, and Entrepreneurship.

RULE 3 - PRACTICAL FILTERS:
- Weak English should prefer roles with a clear communication-improvement roadmap, not reject people-facing careers automatically.
- Fast 3-6 month timeline prefers skill-based and short-certification careers.
- Target salary should affect roadmap ambition but must not force only elite careers.
- Existing skills should be referenced directly in whyMatch.

Return ONLY this valid JSON shape:
{{
  "overallScore": 85,
  "scores": {{
    "skills": 87,
    "interests": 91,
    "goals": 88,
    "values": 82,
    "personality": 85
  }},
  "summary": "2-3 sentence personalized summary mentioning specific answers and direction",
  "topCareers": [
    {{
      "title": "Career Title",
      "matchPercent": 92,
      "slug": "exact-approved-slug",
      "tags": ["tag1", "tag2", "tag3"],
      "shortDescription": "one line description",
      "avgSalaryMin": 7,
      "avgSalaryMax": 16,
      "jobGrowth": 18,
      "demand": "High",
      "whyMatch": [
        "Specific reason based on their answers",
        "Specific reason based on their interests",
        "Specific reason based on their goals"
      ]
    }}
  ],
  "secondaryCareers": [
    {{
      "title": "Career Title",
      "matchPercent": 72,
      "slug": "exact-approved-slug",
      "tags": ["tag1", "tag2", "tag3"],
      "shortDescription": "one line description",
      "avgSalaryMin": 3,
      "avgSalaryMax": 10,
      "jobGrowth": 12,
      "demand": "High"
    }}
  ]
}}

Output requirements:
- topCareers must contain at least 5 careers sorted by matchPercent descending.
- secondaryCareers must contain at least 4 careers with 60-79% match.
- Use ONLY slugs from the approved catalog above.
- Never invent slugs, categories, or unavailable careers."""


@router.post("/onboarding/analyze")
async def analyze_onboarding(
    payload: OnboardingRequest,
    request: Request,
    user=Depends(current_user),
):
    """Analyze onboarding answers via Claude and save career match results."""
    ensure_quiz_result_access(user)

    # Fetch available careers to ground the model
    careers = await db(request).careers.find({}, {"_id": 0}).to_list(300)
    career_list = ", ".join(f"{c['title']} ({c['slug']})" for c in careers)

    # Build readable answer block
    answers_text = "\n".join(
        f"Q{i + 1} ({a.questionId}) — {a.question}\n"
        f"Answer: {a.answer if isinstance(a.answer, str) else ', '.join(a.answer)}"
        for i, a in enumerate(payload.answers)
    )

    prompt = f"""You are Late Comers AI, an expert Indian career counselor.

A student has answered 15 career profiling questions. Analyze their responses and return a personalized career assessment tailored for the Indian job market.

── Student Answers ──
{answers_text}

── Available Careers (use ONLY these exact slugs) ──
{career_list}

Evaluate the student across 5 dimensions:
• Skills      — Natural abilities matching career demands
• Interests   — Alignment between stated interests and careers
• Goals       — Clarity and realism of career goals in Indian context
• Values      — Fit with career culture, growth, and lifestyle
• Personality — How their personality type maps to career requirements

Return STRICT JSON (no markdown, no extra text):
{{
  "overall": <integer 0-100>,
  "scores": {{
    "skills": <integer 0-100>,
    "interests": <integer 0-100>,
    "goals": <integer 0-100>,
    "values": <integer 0-100>,
    "personality": <integer 0-100>
  }},
  "topCareers": [
    {{
      "careerSlug": "<exact slug from available careers>",
      "matchPercent": <integer 0-100>,
      "reasons": ["<reason 1 in 6-8 words>", "<reason 2 in 6-8 words>"],
      "tags": ["<tag1>", "<tag2>", "<tag3>"]
    }}
  ],
  "summary": "<2-3 sentence India-specific career guidance summary for this student>"
}}

Rules:
- Provide exactly 5 topCareers sorted by matchPercent descending.
- Use ONLY slugs from the available careers list above.
- Be realistic — scores should vary meaningfully based on the answers.
- Tailor recommendations to India's job market and the student's budget/timeline.
{CAREER_MATCH_SCORING_GUIDANCE}
"""

    all_quiz_answers = [a.model_dump() for a in payload.answers]
    prompt = f"""You are an expert Indian career counselor with deep knowledge of the Indian education system, job market, and career paths.

A student has completed a 30-question career assessment quiz. Analyze ALL their answers holistically and provide personalized career recommendations.

Student Quiz Answers:
{json.dumps(all_quiz_answers, ensure_ascii=False)}

Available careers with exact slugs (use ONLY these slugs):
{career_list}

{CAREER_MATCH_SCORING_GUIDANCE}

RADAR CHART SCORING (calculate each from their answers):
- Skills: based on stream background + subjects enjoyed + field interest
- Interests: based on field interest + activities they enjoy
- Goals: based on career goal + income timeline + career identity statement
- Values: based on personality type + work type preference + challenges
- Personality: based on activities + personality type + current situation

Return ONLY this exact valid JSON, no extra text:
{{
  "overallScore": 85,
  "scores": {{
    "skills": 87,
    "interests": 91,
    "goals": 88,
    "values": 82,
    "personality": 85
  }},
  "summary": "2-3 sentence personalized summary mentioning their specific stream, interests, and recommended direction",
  "topCareers": [
    {{
      "title": "Career Title",
      "matchPercent": 92,
      "slug": "career-slug",
      "tags": ["tag1", "tag2", "tag3"],
      "shortDescription": "one line description",
      "avgSalaryMin": 7,
      "avgSalaryMax": 16,
      "jobGrowth": 18,
      "demand": "High",
      "whyMatch": [
        "Specific reason based on their stream/answers",
        "Specific reason based on their interests",
        "Specific reason based on their goals"
      ]
    }}
  ],
  "additionalCareers": [
    {{
      "title": "",
      "matchPercent": 0,
      "slug": "",
      "tags": [],
      "avgSalaryMin": 0,
      "avgSalaryMax": 0,
      "jobGrowth": 0,
      "demand": ""
    }}
  ]
}}

topCareers must have exactly 3 careers with highest match (above 80%).
additionalCareers must have exactly 5 more careers (60-79% match).
Total 8 career recommendations always.
Slugs MUST match existing career slugs from the available careers list exactly."""

    prompt = _build_onboarding_user_prompt(all_quiz_answers, careers)

    try:
        text = await ask_claude(
            prompt,
            system_prompt=ONBOARDING_SYSTEM_PROMPT,
            max_tokens=4000,
            json_only=True,
        )
        data = _normalize_career_analysis(extract_json(text), careers, all_quiz_answers)
    except Exception as e:
        logger.error(f"Onboarding analysis LLM error: {e}")
        data = _normalize_career_analysis({}, careers, all_quiz_answers)

    scores = data.get("scores", {})
    overall = data.get("overallScore", 0)
    top_careers = data.get("topCareers", [])

    # ── Extract profile fields directly from answers ─────────────────────────
    ans_map = {a.questionId: a.answer for a in payload.answers}

    def _ans(qid):
        """Return answer value for a question (str or list)."""
        return ans_map.get(qid, "")

    profile_extra = {}
    if _ans("q1"):  profile_extra["naturalInterest"]     = _ans("q1")
    if _ans("q2"):  profile_extra["activityInterest"]    = _ans("q2")
    if _ans("q3"):  profile_extra["technicalComfort"]    = _ans("q3")
    if _ans("q4"):  profile_extra["subjectBackground"]   = _ans("q4")
    if _ans("q4"):  profile_extra["stream"]              = _ans("q4")
    if _ans("q5"):  profile_extra["sideProject"]         = _ans("q5")
    if _ans("q6"):  profile_extra["problemStyle"]        = _ans("q6")
    if _ans("q7"):  profile_extra["workEnvironment"]     = _ans("q7")
    if _ans("q8"):  profile_extra["deadlineStyle"]       = _ans("q8")
    if _ans("q9"):  profile_extra["computerComfort"]     = _ans("q9")
    if _ans("q10"): profile_extra["teamResponse"]        = _ans("q10")
    if _ans("q11"): profile_extra["learningPreference"]  = _ans("q11")
    if _ans("q12"): profile_extra["personality"]         = _ans("q12")
    if _ans("q13"): profile_extra["decisionStyle"]       = _ans("q13")
    if _ans("q14"): profile_extra["speakingComfort"]     = _ans("q14")
    if _ans("q15"): profile_extra["repetitionStyle"]     = _ans("q15")
    if _ans("q16"): profile_extra["careerIdentity"]      = _ans("q16")
    if _ans("q17"): profile_extra["careerGoal"]          = _ans("q17")
    if _ans("q17"): profile_extra["careerPriority"]      = _ans("q17")
    if _ans("q18"): profile_extra["securityNeed"]        = _ans("q18")
    if _ans("q19"): profile_extra["businessPreference"]  = _ans("q19")
    if _ans("q20"): profile_extra["purposeNeed"]         = _ans("q20")
    if _ans("q21"): profile_extra["englishLevel"]        = _ans("q21")
    if _ans("q22"): profile_extra["numbersComfort"]      = _ans("q22")
    if _ans("q23"): profile_extra["softwareExposure"]    = _ans("q23")
    if _ans("q24"): profile_extra["existingSkills"]      = _ans("q24") if isinstance(_ans("q24"), list) else [_ans("q24")]
    if _ans("q25"): profile_extra["problemSolving"]      = _ans("q25")
    if _ans("q26"): profile_extra["currentSituation"]    = _ans("q26")
    if _ans("q27"): profile_extra["biggestChallenge"]    = _ans("q27")
    if _ans("q28"): profile_extra["fieldInterest"]       = _ans("q28")
    if _ans("q28"): profile_extra["idealWorkday"]        = _ans("q28")
    if _ans("q29"): profile_extra["targetSalary"]        = _ans("q29")
    if _ans("q30"): profile_extra["incomeTimeline"]      = _ans("q30")
    profile_extra["onboardingSummary"] = data.get("summary", "")

    # Build the $set dict
    set_fields = {
        "onboarded": True,
        "onboardingCompleted": True,
        "onboarding_answers": [a.model_dump() for a in payload.answers],
        "careerAnalysis": data,
        "profile.careerMatchScore": {
            "overall": overall,
            "skills": scores.get("skills", 0),
            "interests": scores.get("interests", 0),
            "goals": scores.get("goals", 0),
            "values": scores.get("values", 0),
            "personality": scores.get("personality", 0),
        },
        "profile.summary": data.get("summary", ""),
        "top_career_matches": [
            {
                "careerSlug": c["slug"],
                "matchPercent": c["matchPercent"],
                "reasons": c.get("whyMatch", []),
                "tags": c.get("tags", []),
            }
            for c in top_careers[:3]
        ],
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    # Merge extracted profile fields
    for k, v in profile_extra.items():
        set_fields[f"profile.{k}"] = v

    # Persist everything to the user document
    await db(request).users.update_one(
        {"user_id": user["user_id"]},
        {"$set": set_fields},
    )

    logger.info(
        f"Onboarding complete for user {user['user_id']} — overall={overall}%, "
        f"top={[c['slug'] for c in top_careers[:3]]}"
    )
    return {
        "overallScore": overall,
        "scores": scores,
        "topCareers": top_careers,
        "additionalCareers": data.get("additionalCareers", []),
        "summary": data.get("summary", ""),
    }


@router.post("/onboarding/retake")
async def retake_onboarding(request: Request, user=Depends(current_user)):
    await db(request).users.update_one(
        {"user_id": user["user_id"]},
        {
            "$set": {
                "onboarded": False,
                "onboardingCompleted": False,
                "top_career_matches": [],
                "updated_at": datetime.now(timezone.utc).isoformat(),
            },
            "$unset": {
                "careerAnalysis": "",
                "onboarding_answers": "",
                "profile.careerMatchScore": "",
                "profile.summary": "",
                "profile.adaptiveOnboardingSummary": "",
            },
        },
    )
    return {"ok": True}


@router.post("/profile/rematch")
async def rematch_profile(request: Request, user=Depends(current_user)):
    careers = await db(request).careers.find({}, {"_id": 0, "slug": 1, "title": 1}).to_list(300)
    profile = user.get("profile", {}) or {}

    if not profile:
        return {
            "overall": 0,
            "scores": {"skills": 0, "interests": 0, "goals": 0, "values": 0, "personality": 0},
            "topCareers": [],
            "summary": "Complete your profile to get refreshed AI career matches.",
        }

    career_list = ", ".join(f"{c['title']} ({c['slug']})" for c in careers)
    prompt = f"""You are Late Comers AI, an expert Indian career counselor.

Recompute top career matches using this latest student profile:
{json.dumps(profile)}

Available careers (use ONLY these exact slugs):
{career_list}

Return STRICT JSON (no markdown):
{{
  "overall": <integer 0-100>,
  "scores": {{
    "skills": <integer 0-100>,
    "interests": <integer 0-100>,
    "goals": <integer 0-100>,
    "values": <integer 0-100>,
    "personality": <integer 0-100>
  }},
  "topCareers": [
    {{
      "careerSlug": "<exact slug from available careers>",
      "matchPercent": <integer 0-100>,
      "reasons": ["<reason 1 in 6-8 words>", "<reason 2 in 6-8 words>"],
      "tags": ["<tag1>", "<tag2>", "<tag3>"]
    }}
  ],
  "summary": "<2-3 sentence India-specific guidance summary>"
}}

Rules:
- Return exactly 5 topCareers sorted by matchPercent descending.
- Use only slugs from the list.
{CAREER_MATCH_SCORING_GUIDANCE}
"""
    try:
        text = await ask_claude(prompt, max_tokens=1600, json_only=True)
        data = extract_json(text)
    except Exception as e:
        logger.error(f"profile rematch LLM error: {e}")
        raise HTTPException(500, f"AI rematch failed: {e}")

    await _update_user_matches(request, user["user_id"], data)
    return {
        "overall": data.get("overall", 0),
        "scores": data.get("scores", {}),
        "topCareers": data.get("topCareers", [])[:5],
        "summary": data.get("summary", ""),
    }


# ---------- Career Test scoring ----------
class TestAnswer(BaseModel):
    questionId: str
    answer: str  # "A"|"B"|"C"|"D"
    category: Optional[str] = None


class ScoreRequest(BaseModel):
    answers: List[TestAnswer]


@router.post("/career-test/score")
async def score_test(payload: ScoreRequest, request: Request, user=Depends(current_user)):
    ensure_quiz_result_access(user)

    # Fetch career titles to ground the model
    careers = await db(request).careers.find({}, {"_id": 0, "slug": 1, "title": 1}).to_list(300)
    career_list = ", ".join([f"{c['title']} ({c['slug']})" for c in careers])

    prompt = f"""Analyze these career assessment answers from an Indian student.
Available careers (use exact slugs): {career_list}

Student answers (60 questions across 4 categories — interests, skills, personality, workStyle):
{json.dumps([a.model_dump() for a in payload.answers])}

Return STRICT JSON in this shape:
{{
  "scores": {{ "interests": 0-100, "skills": 0-100, "personality": 0-100, "workStyle": 0-100, "values": 0-100, "goals": 0-100 }},
  "overall": 0-100,
  "topMatches": [
    {{"careerSlug": "<one of the slugs above>", "matchPercent": 0-100, "reasons": ["...", "..."]}}
  ],
  "summary": "2-3 sentence India-specific summary"
}}
Provide exactly 5 topMatches sorted by matchPercent desc.
{CAREER_MATCH_SCORING_GUIDANCE}
"""

    try:
        text = await ask_claude(prompt, max_tokens=1800, json_only=True)
        data = extract_json(text)
    except Exception as e:
        logger.error(f"score_test LLM error: {e}")
        raise HTTPException(500, f"AI scoring failed: {e}")

    # Persist
    result_id = str(uuid.uuid4())
    record = {
        "result_id": result_id,
        "user_id": user["user_id"],
        "answers": [a.model_dump() for a in payload.answers],
        "scores": data.get("scores", {}),
        "overall": data.get("overall", 0),
        "topMatches": data.get("topMatches", []),
        "summary": data.get("summary", ""),
        "completed_at": datetime.now(timezone.utc).isoformat(),
    }
    await db(request).test_results.insert_one(record)

    # Update user
    scores = data.get("scores", {}) or {}
    overall = data.get("overall", 0)
    await db(request).users.update_one(
        {"user_id": user["user_id"]},
        {
            "$set": {
                "profile.careerMatchScore": {
                    "overall": overall,
                    "skills": scores.get("skills", 0),
                    "interests": scores.get("interests", 0),
                    "goals": scores.get("goals", 0),
                    "values": scores.get("values", 0),
                    "personality": scores.get("personality", 0),
                },
                "top_career_matches": data.get("topMatches", [])[:5],
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
        },
    )

    record.pop("_id", None)
    return record


@router.get("/career-test/latest")
async def latest_result(request: Request, user=Depends(current_user)):
    ensure_quiz_result_access(user)
    rec = await db(request).test_results.find_one(
        {"user_id": user["user_id"]}, {"_id": 0}, sort=[("completed_at", -1)]
    )
    return rec or {}


# ---------- Roadmap generation ----------

def _repair_truncated_json(text: str):
    """Try to repair truncated JSON from LLM by closing open brackets."""
    import re
    raw = (text or "").strip()
    # Extract JSON portion
    fenced = re.search(r"```(?:json)?\s*(.*?)```", raw, re.DOTALL | re.IGNORECASE)
    if fenced:
        raw = fenced.group(1).strip()
    # Find first {
    start = raw.find("{")
    if start < 0:
        return None
    raw = raw[start:]
    # Try progressively closing brackets
    suffixes = [
        "",
        '"}]}}]}}',
        '"]}}]}}',
        "]}}]}}",
        '"]}}]}}',
        "]}}",
        "]}",
        "}}",
        "]}}",
    ]
    for suffix in suffixes:
        try:
            candidate = raw + suffix
            data = json.loads(candidate)
            if isinstance(data, dict) and data.get("stages"):
                return data
        except json.JSONDecodeError:
            continue
    return None


def _career_cached_roadmap(career: Dict):
    details = career.get("aiGeneratedDetails") or {}
    roadmap = details.get("roadmap") if isinstance(details, dict) else None
    if isinstance(roadmap, dict) and len(roadmap.get("stages") or []) >= 6 and not _roadmap_has_generic_items(roadmap):
        return roadmap
    if len(career.get("roadmap") or []) >= 6:
        fallback = {"stages": career["roadmap"]}
        if not _roadmap_has_generic_items(fallback):
            return fallback
    return None


def _roadmap_has_generic_items(roadmap: Dict) -> bool:
    generic_markers = (
        "item1",
        "item2",
        "item3",
        "project1",
        "project2",
        "role1",
        "role2",
        "tip1",
        "course specialization",
        "tool certification course",
        "mentor-led practical course",
        "recommended paid courses",
        "check minimum eligibility",
        "compare degree or diploma options",
        "shortlist institutes or online programs",
        "specific education step",
        "specific skill item",
        "specific course",
        "specific portfolio project",
        "specific role",
        "specific placement tip",
        "tool with use case",
        "provider - cost",
        "paid course",
        "free course",
        "₹",
        " inr ",
    )
    for stage in roadmap.get("stages") or []:
      for section in stage.get("sections") or []:
        for item in section.get("items") or []:
          text = str(item).lower()
          if any(marker in text for marker in generic_markers):
            return True
    return False


def _strip_roadmap_course_costs(roadmap: Dict) -> Dict:
    if not isinstance(roadmap, dict):
        return roadmap
    for stage in roadmap.get("stages") or []:
        for section in stage.get("sections") or []:
            section_key = str(section.get("type") or section.get("label") or "").lower()
            if "course" not in section_key:
                continue
            section["label"] = "Courses"
            cleaned = []
            for item in section.get("items") or []:
                text = re.sub(r"\s*[-–—]\s*(Coursera|Udemy|edX|Google|Microsoft|NSE Academy|CFI|Domestika|LinkedIn Learning|Skillshare|upGrad|Simplilearn|Great Learning|Elearnmarkets|BSE Institute).*$", "", str(item), flags=re.I)
                text = re.sub(r"\b(paid|free|cost|fee|fees|inr|rs\.?|₹)\b.*$", "", text, flags=re.I).strip(" -–—,")
                text = re.sub(r"\s+", " ", text).strip()
                if text:
                    cleaned.append(text)
            section["items"] = cleaned[:5]
    return roadmap


class RoadmapGenRequest(BaseModel):
    career_slug: str


ROADMAP_SLUG_ALIASES = {
    "business-development-executive": "digital-marketing",
    "business-development-manager": "digital-marketing",
    "business-development": "digital-marketing",
    "sales-executive": "digital-marketing",
    "sales-manager": "digital-marketing",
    "financial-analyst": "financial-modeling",
    "finance-analyst": "financial-modeling",
    "finance-manager": "financial-modeling",
    "mba-manager": "mba-entrance",
    "business-manager": "mba-entrance",
    "management-trainee": "mba-entrance",
    "graphic-designer": "graphic-and-visual-design",
    "ui-ux-designer": "ui-ux-and-product-design",
    "ux-designer": "ui-ux-and-product-design",
    "video-editor": "video-and-motion",
    "animator-3d": "3d-animation",
    "3d-animator": "3d-animation",
    "animator-2d": "2d-animation",
    "2d-animator": "2d-animation",
    "game-designer": "game-design",
    "game-developer": "game-development",
}


@router.post("/roadmap/generate")
async def generate_roadmap(payload: RoadmapGenRequest, request: Request, user=Depends(current_user)):
    resolved_slug = ROADMAP_SLUG_ALIASES.get(payload.career_slug, payload.career_slug)
    career = await db(request).careers.find_one({"slug": resolved_slug}, {"_id": 0})
    if not career:
        raise HTTPException(404, "Career not found")

    cached = _career_cached_roadmap(career)
    if cached:
        await db(request).users.update_one(
            {"user_id": user["user_id"]},
            {
                "$set": {
                    f"personalized_roadmaps.{payload.career_slug}": cached,
                    f"personalized_roadmaps.{resolved_slug}": cached,
                    "lastRoadmapCareerSlug": resolved_slug,
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                }
            },
        )
        return cached

    prompt = f"""Generate one reusable career roadmap for **{career['title']}** in India.

Rules:
- Do not give generic items like item1, project1, role1, check eligibility, compare options, or shortlist programs.
- Use real course/topic names, real tools, real portfolio/project ideas, real job roles, and India-specific application channels.
- Courses section must contain only course/topic names. Do not mention paid/free, platforms, providers, prices, costs, INR, fees, or duration in course items.
- Keep each item specific and actionable.
- This roadmap must be reusable for all students interested in {career['title']}; do not personalize it to one user.
- Mention common entry routes for different backgrounds where useful.

Return ONLY valid JSON (no markdown, no commentary):
{{"totalDuration":"12 Months","stages":[
  {{"stageNum":1,"title":"Education","duration":"0-2 Months","description":"education and eligibility path for {career['title']}","preview":"education route","skills":["career foundation"],"sections":[{{"type":"education","label":"Education Path","items":["specific education route 1","specific education route 2","specific education route 3"]}}]}},
  {{"stageNum":2,"title":"Skills To Master","duration":"2-6 Months","description":"core skills needed for {career['title']}","preview":"master core skills","skills":["specific skill 1","specific skill 2","specific skill 3","specific skill 4"],"sections":[{{"type":"skills","label":"Skills To Master","items":["specific skill 1","specific skill 2","specific skill 3","specific skill 4"]}}]}},
  {{"stageNum":3,"title":"Courses","duration":"6-9 Months","description":"courses and certifications to study","preview":"complete courses","skills":["course selection"],"sections":[{{"type":"courses","label":"Courses","items":["Specific course name","Specific course name","Specific course name"]}}]}},
  {{"stageNum":4,"title":"AI Tools","duration":"9-10 Months","description":"AI tools for this career workflow","preview":"learn AI tools","skills":["AI workflow"],"sections":[{{"type":"tools","label":"AI Tools","items":["tool with use case 1","tool with use case 2","tool with use case 3","tool with use case 4"]}}]}},
  {{"stageNum":5,"title":"Portfolio & Projects","duration":"10-11 Months","description":"portfolio proof to build","preview":"build portfolio","skills":["project building"],"sections":[{{"type":"projects","label":"Portfolio Projects","items":["specific portfolio project 1","specific portfolio project 2","specific portfolio project 3"]}}]}},
  {{"stageNum":6,"title":"Placement & Jobs","duration":"11-12 Months","description":"job roles and application plan","preview":"apply and interview","skills":["interview prep"],"sections":[{{"type":"jobs","label":"Common Job Roles","items":["specific role 1","specific role 2","specific role 3"]}},{{"type":"placement","label":"Placement Suggestions","items":["specific placement tip 1","specific placement tip 2","specific placement tip 3"]}}]}}
]}}

Exactly 6 stages with these exact titles: Education, Skills To Master, Courses, AI Tools, Portfolio & Projects, Placement & Jobs. Keep items SHORT (under 95 chars each). India-specific."""

    text = None
    try:
        text = await ask_claude(prompt, max_tokens=4000, json_only=True)
        data = extract_json(text)
        if not data or not data.get("stages"):
            raise ValueError("AI returned empty or invalid roadmap structure")
        data = _strip_roadmap_course_costs(data)
        if _roadmap_has_generic_items(data):
            raise ValueError("AI returned generic roadmap items")
    except (json.JSONDecodeError, ValueError) as e:
        logger.error(f"roadmap JSON error: {e} | response length: {len(text) if text else 0}")
        # Try to repair truncated JSON by closing open brackets
        if text:
            repaired = _repair_truncated_json(text)
            if repaired:
                data = _strip_roadmap_course_costs(repaired)
                logger.info("roadmap JSON repaired successfully")
            else:
                raise HTTPException(500, "Roadmap generation returned incomplete data. Please try again.")
        else:
            raise HTTPException(500, "Roadmap generation returned no data. Please try again.")
    except Exception as e:
        logger.error(f"roadmap LLM error: {e}")
        raise HTTPException(500, "AI roadmap failed. Please try again.")

    # Save under user
    await db(request).users.update_one(
        {"user_id": user["user_id"]},
        {
            "$set": {
                f"personalized_roadmaps.{payload.career_slug}": data,
                f"personalized_roadmaps.{resolved_slug}": data,
                "lastRoadmapCareerSlug": resolved_slug,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
        },
    )
    await db(request).careers.update_one(
        {"slug": resolved_slug},
        {
            "$set": {
                "aiGeneratedDetails.roadmap": data,
                "roadmap": data.get("stages", []),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
        },
    )
    return data


@router.get("/roadmap/{career_slug}")
async def get_user_roadmap(career_slug: str, request: Request, user=Depends(current_user)):
    resolved_slug = ROADMAP_SLUG_ALIASES.get(career_slug, career_slug)
    rmap = (user.get("personalized_roadmaps") or {}).get(resolved_slug) or (user.get("personalized_roadmaps") or {}).get(career_slug)
    if rmap and len(rmap.get("stages") or []) >= 6 and not _roadmap_has_generic_items(rmap):
        return rmap
    career = await db(request).careers.find_one({"slug": resolved_slug}, {"_id": 0})
    if career:
        cached = _career_cached_roadmap(career)
        if cached:
            return cached
    raise HTTPException(404, "No roadmap available; generate one first.")


# ---------- Career Insights (AI-generated, cached on career doc) ----------
def _is_valid_insights(data: Any) -> bool:
    if not isinstance(data, dict):
        return False
    req = ["overview", "activities", "topIndustries", "topAITools", "topCountries", "marketDemand"]
    if not all(k in data for k in req):
        return False
    if not isinstance(data["activities"], list) or len(data["activities"]) < 3:
        return False
    if not isinstance(data["topIndustries"], list) or len(data["topIndustries"]) < 3:
        return False
    if not isinstance(data["topAITools"], list) or len(data["topAITools"]) < 3:
        return False
    return True


@router.get("/insights/{career_slug}")
async def get_career_insights(career_slug: str, request: Request, user=Depends(current_user)):
    """Return AI-generated insights for a career. Cached on the career doc.

    Response shape: { overview, activities[], topIndustries[], topAITools[{name,category}],
                      topCountries[], marketDemand, growthPct, openPositions }
    """
    resolved_slug = ROADMAP_SLUG_ALIASES.get(career_slug, career_slug)
    career = await db(request).careers.find_one({"slug": resolved_slug}, {"_id": 0})
    if not career:
        raise HTTPException(404, "Career not found")

    # Cached?
    cached = (career.get("aiGeneratedDetails") or {}).get("insights")
    if _is_valid_insights(cached):
        return cached

    title = career.get("title") or career_slug.replace("-", " ").title()
    description = career.get("description") or career.get("overview") or ""
    prompt = f"""Generate detailed career insights for **{title}** in India.

Context: {description}

Return ONLY valid JSON (no markdown, no commentary). Be SPECIFIC to {title} — do not give generic answers.

{{
  "overview": "2-3 sentence plain-English explanation of what a {title} actually does day-to-day in India",
  "activities": ["specific activity 1 a {title} does", "specific activity 2", "specific activity 3", "specific activity 4"],
  "topIndustries": ["industry 1 that hires {title}", "industry 2", "industry 3", "industry 4", "industry 5", "industry 6"],
  "topAITools": [
    {{"name": "Real tool 1 used by {title}", "category": "what it's used for"}},
    {{"name": "Real tool 2", "category": "category"}},
    {{"name": "Real tool 3", "category": "category"}},
    {{"name": "Real tool 4", "category": "category"}},
    {{"name": "Real tool 5", "category": "category"}},
    {{"name": "Real tool 6", "category": "category"}}
  ],
  "topCountries": ["IN", "US", "GB", "AE"],
  "marketDemand": "High / Moderate-to-High / Booming etc. (one short phrase)",
  "growthPct": 15,
  "openPositions": "10,000+ on Naukri/LinkedIn (or a realistic India-specific estimate)"
}}

Rules:
- Tools must be REAL software/platforms actually used by {title} professionals (not "Industry Tools" or generic names).
- Industries must be specific verticals where {title} are actually hired (not vague terms like "Government" or "Healthcare" unless that career truly fits).
- Activities must describe concrete daily tasks, not abstract phrases.
- Use India-relevant context (salary, hiring platforms, company examples)."""

    text = None
    try:
        text = await ask_claude(prompt, max_tokens=1200, json_only=True)
        data = extract_json(text)
        if not _is_valid_insights(data):
            raise ValueError("AI insights validation failed")
    except Exception as e:
        logger.error(f"insights LLM error for {resolved_slug}: {e} | response length: {len(text) if text else 0}")
        raise HTTPException(500, "AI insights generation failed. Please try again.")

    # Cache on the career doc (shared across all users)
    await db(request).careers.update_one(
        {"slug": resolved_slug},
        {"$set": {
            "aiGeneratedDetails.insights": data,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }},
    )
    return data


@router.post("/insights/{career_slug}/refresh")
async def refresh_career_insights(career_slug: str, request: Request, user=Depends(current_user)):
    """Force-regenerate insights (clears cache then calls get_career_insights logic)."""
    resolved_slug = ROADMAP_SLUG_ALIASES.get(career_slug, career_slug)
    await db(request).careers.update_one(
        {"slug": resolved_slug},
        {"$unset": {"aiGeneratedDetails.insights": ""}},
    )
    return await get_career_insights(career_slug, request, user)


# ---------- AI Chat ----------
def _small_list(values: Any, limit: int = 6):
    if not isinstance(values, list):
        return values
    return values[:limit]


def _compact_match(match: Dict[str, Any]) -> Dict[str, Any]:
    if not isinstance(match, dict):
        return {}
    return {
        "title": match.get("title") or match.get("careerTitle"),
        "careerSlug": match.get("careerSlug") or match.get("slug"),
        "matchPercent": match.get("matchPercent"),
        "tags": _small_list(match.get("tags") or [], 5),
        "reasons": _small_list(match.get("reasons") or match.get("whyMatch") or [], 3),
        "salaryRangeLPA": {
            "min": match.get("avgSalaryMin"),
            "max": match.get("avgSalaryMax"),
        } if match.get("avgSalaryMin") or match.get("avgSalaryMax") else None,
        "demand": match.get("demand"),
    }


def _compact_student_context(user: Dict[str, Any], latest_test: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    profile = user.get("profile") or {}
    career_analysis = user.get("careerAnalysis") or {}
    top_matches = career_analysis.get("topCareers") or user.get("top_career_matches") or []
    additional_matches = career_analysis.get("additionalCareers") or []

    context = {
        "name": user.get("name") or user.get("full_name"),
        "profile": {
            "educationLevel": profile.get("educationLevel") or profile.get("education"),
            "stream": profile.get("stream"),
            "currentSituation": profile.get("currentSituation"),
            "subjects": _small_list(profile.get("subjects") or [], 8),
            "activities": _small_list(profile.get("activities") or [], 8),
            "workType": profile.get("workType"),
            "personality": profile.get("personality"),
            "careerGoal": profile.get("careerGoal"),
            "incomeTimeline": profile.get("incomeTimeline"),
            "fieldInterest": profile.get("fieldInterest"),
            "govtExamInterest": profile.get("govtExamInterest"),
            "budget": profile.get("budget"),
            "learningPreference": profile.get("learningPreference") or profile.get("learningStyle"),
            "biggestChallenge": profile.get("biggestChallenge"),
            "careerIdentity": profile.get("careerIdentity"),
            "location": profile.get("location"),
            "summary": profile.get("summary") or profile.get("onboardingSummary"),
            "careerMatchScore": profile.get("careerMatchScore"),
        },
        "quizAnalysis": {
            "overallScore": career_analysis.get("overallScore"),
            "scores": career_analysis.get("scores"),
            "summary": career_analysis.get("summary"),
            "topCareers": [_compact_match(m) for m in top_matches[:5]],
            "additionalCareers": [_compact_match(m) for m in additional_matches[:5]],
        },
        "latestCareerTest": {
            "overall": (latest_test or {}).get("overall"),
            "scores": (latest_test or {}).get("scores"),
            "summary": (latest_test or {}).get("summary"),
            "topMatches": [_compact_match(m) for m in ((latest_test or {}).get("topMatches") or [])[:5]],
            "completed_at": (latest_test or {}).get("completed_at"),
        } if latest_test else None,
    }

    def _strip_empty(value):
        if isinstance(value, dict):
            cleaned = {k: _strip_empty(v) for k, v in value.items()}
            return {k: v for k, v in cleaned.items() if v not in (None, "", [], {}, {"min": None, "max": None})}
        if isinstance(value, list):
            return [v for v in (_strip_empty(x) for x in value) if v not in (None, "", [], {})]
        return value

    return _strip_empty(context)


class ChatRequest(BaseModel):
    message: str
    chat_id: Optional[str] = None
    career_slug: Optional[str] = None


@router.post("/chat")
async def chat(payload: ChatRequest, request: Request, user=Depends(current_user)):
    ensure_feature_available(user, "ai_chat")
    chat_id = payload.chat_id or str(uuid.uuid4())
    chat_doc = await db(request).chats.find_one({"chat_id": chat_id, "user_id": user["user_id"]}, {"_id": 0})
    latest_test = await db(request).test_results.find_one(
        {"user_id": user["user_id"]}, {"_id": 0}, sort=[("completed_at", -1)]
    )
    student_context = _compact_student_context(user, latest_test)

    history = chat_doc["messages"] if chat_doc else []

    system = (
        "You are Late Comers AI, a friendly, India-specific career counselor for students. "
        "Help with career guidance, skill advice, college selection, scholarship tips, interview prep. "
        "Always personalize answers using the student's quiz/profile context below. "
        "When the user asks about any career, guide them according to their education level, stream, skills, interests, age/current situation if present, budget, income timeline, learning preference, location, and career requirements. "
        "Compare a requested career with their top matches when useful, and explain fit, gaps, next steps, and realistic India-specific path. "
        "If a needed detail is missing, say what is missing and ask at most one clarifying question. Do not invent unknown facts. "
        "Be concise, encouraging, and practical. "
        "Use clean plain text only: no markdown headings, no # symbols, no **bold** markers, no code fences. "
        "Use short section titles on their own line and simple hyphen bullets where useful.\n\n"
        "Student quiz/profile context:\n"
        f"{json.dumps(student_context, ensure_ascii=False)[:7000]}"
    )
    if payload.career_slug:
        career = await db(request).careers.find_one({"slug": payload.career_slug}, {"_id": 0})
        if career:
            details = career.get("aiGeneratedDetails") or {}
            compact_context = {
                "title": career.get("title"),
                "category": career.get("category"),
                "field": career.get("field"),
                "tags": career.get("tags", []),
                "salary": career.get("avgSalary") or {
                    "min": career.get("avgSalaryMin"),
                    "max": career.get("avgSalaryMax"),
                },
                "jobGrowth5Y": career.get("jobGrowth5Y"),
                "overview": (details.get("overview") or {}).get("description") or career.get("overview"),
                "skills": details.get("skills"),
                "roadmap": details.get("roadmap"),
                "jobs": details.get("jobs"),
                "insights": details.get("insights"),
            }
            system += (
                "\n\nCurrent career context. The user is asking about this exact career only. "
                "Do not answer with generic career advice when specific context is available:\n"
                f"{json.dumps(compact_context, ensure_ascii=False)[:6000]}"
            )

    try:
        reply = await ask_claude(payload.message, system_prompt=system, history=history, max_tokens=1200)
    except Exception as e:
        logger.error(f"chat LLM error: {e}")
        raise HTTPException(500, f"AI chat failed: {e}")

    # Generate quick replies
    quick_prompt = f"""Given this user message: "{payload.message}"
And this assistant reply: "{reply[:400]}"
Suggest exactly 4 short follow-up questions a student might ask next, India-context.
Return STRICT JSON: {{"suggestions": ["...","...","...","..."]}}
Each suggestion max 8 words."""
    try:
        qtext = await ask_claude(quick_prompt, max_tokens=300, json_only=True)
        quick = extract_json(qtext).get("suggestions", [])[:4]
    except Exception:
        quick = []

    now = datetime.now(timezone.utc).isoformat()
    new_messages = history + [
        {"role": "user", "content": payload.message, "timestamp": now},
        {"role": "assistant", "content": reply, "timestamp": now, "suggestions": quick},
    ]

    if chat_doc:
        await db(request).chats.update_one(
            {"chat_id": chat_id}, {"$set": {"messages": new_messages, "updated_at": now}}
        )
    else:
        await db(request).chats.insert_one(
            {
                "chat_id": chat_id,
                "user_id": user["user_id"],
                "career_slug": payload.career_slug,
                "messages": new_messages,
                "created_at": now,
                "updated_at": now,
            }
        )

    await consume_feature(request, user, "ai_chat")
    return {"chat_id": chat_id, "reply": reply, "suggestions": quick}


@router.get("/chats")
async def list_chats(request: Request, user=Depends(current_user)):
    chats = (
        await db(request)
        .chats.find({"user_id": user["user_id"]}, {"_id": 0, "chat_id": 1, "messages": {"$slice": -1}, "updated_at": 1})
        .sort("updated_at", -1)
        .limit(50)
        .to_list(50)
    )
    return chats


@router.get("/chats/{chat_id}")
async def get_chat(chat_id: str, request: Request, user=Depends(current_user)):
    chat_doc = await db(request).chats.find_one(
        {"chat_id": chat_id, "user_id": user["user_id"]}, {"_id": 0}
    )
    if not chat_doc:
        raise HTTPException(404, "Chat not found")
    return chat_doc


# ---------- Mock Interview ----------
class MockSetup(BaseModel):
    role: str
    interview_type: str  # behavioral | technical | case
    difficulty: str  # easy | medium | hard


@router.post("/mock-interview/start")
async def mock_start(payload: MockSetup, request: Request, user=Depends(current_user)):
    ensure_feature_available(user, "mock_interview")
    prompt = f"""Generate 5 mock interview questions for an Indian student.
Role: {payload.role}
Type: {payload.interview_type}
Difficulty: {payload.difficulty}

Return STRICT JSON: {{"questions": [{{"q": "...", "hint": "..."}}]}}
"""
    try:
        text = await ask_claude(prompt, max_tokens=900, json_only=True)
        data = extract_json(text)
    except Exception as e:
        raise HTTPException(500, f"AI failed: {e}")

    session_id = str(uuid.uuid4())
    await db(request).interview_sessions.insert_one(
        {
            "session_id": session_id,
            "user_id": user["user_id"],
            "setup": payload.model_dump(),
            "questions": data.get("questions", []),
            "answers": [],
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
    )
    await consume_feature(request, user, "mock_interview")
    return {
        "session_id": session_id,
        "setup": payload.model_dump(),
        "questions": data.get("questions", []),
    }


class MockAnswer(BaseModel):
    session_id: str
    question_index: int
    answer: str


@router.post("/mock-interview/answer")
async def mock_answer(payload: MockAnswer, request: Request, user=Depends(current_user)):
    sess = await db(request).interview_sessions.find_one(
        {"session_id": payload.session_id, "user_id": user["user_id"]}, {"_id": 0}
    )
    if not sess:
        raise HTTPException(404, "Interview not found")
    if payload.question_index >= len(sess["questions"]):
        raise HTTPException(400, "Invalid question index")

    q = sess["questions"][payload.question_index]
    prompt = f"""Evaluate this mock interview answer for an Indian student.
Role: {sess['setup']['role']} | Type: {sess['setup']['interview_type']}
Question: {q['q']}
Student answer: {payload.answer}

Return STRICT JSON: {{"score": 1-10, "feedback": "...", "improvements": ["...", "..."]}}
"""
    try:
        text = await ask_claude(prompt, max_tokens=600, json_only=True)
        eval_data = extract_json(text)
    except Exception as e:
        raise HTTPException(500, f"AI failed: {e}")

    answer_record = {
        "question_index": payload.question_index,
        "question": q["q"],
        "answer": payload.answer,
        **eval_data,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    await db(request).interview_sessions.update_one(
        {"session_id": payload.session_id},
        {"$push": {"answers": answer_record}},
    )
    return eval_data


@router.get("/mock-interview/history")
async def mock_history(request: Request, user=Depends(current_user)):
    sessions = (
        await db(request)
        .interview_sessions.find(
            {"user_id": user["user_id"]},
            {"_id": 0, "session_id": 1, "setup": 1, "answers": 1, "questions": 1, "created_at": 1},
        )
        .sort("created_at", -1)
        .limit(25)
        .to_list(25)
    )

    def _avg_score(answers):
        scores = [a.get("score", 0) for a in answers if isinstance(a.get("score"), (int, float))]
        return round(sum(scores) / len(scores), 1) if scores else 0

    return [
        {
            "session_id": s["session_id"],
            "setup": s.get("setup", {}),
            "created_at": s.get("created_at"),
            "answered_count": len(s.get("answers", [])),
            "question_count": len(s.get("questions", [])),
            "overall_score": _avg_score(s.get("answers", [])),
        }
        for s in sessions
    ]


class CollegeSuggestionRequest(BaseModel):
    location: str
    results: List[Dict]


@router.post("/colleges/suggest")
async def suggest_colleges(payload: CollegeSuggestionRequest, request: Request, user=Depends(current_user)):
    if not payload.results:
        return {"suggestion": "Try another nearby location to see stronger college options."}

    compact_results = [
        {
            "name": r.get("name"),
            "address": r.get("address"),
            "rating": r.get("rating"),
            "reviews": r.get("user_ratings_total"),
        }
        for r in payload.results[:8]
    ]
    profile = user.get("profile", {}) or {}
    prompt = f"""You are a career guidance assistant helping an Indian student choose colleges.

Student profile: {json.dumps(profile)}
Search location: {payload.location}
Google Maps nearby colleges: {json.dumps(compact_results)}

Return STRICT JSON:
{{"suggestion": "<max 70 words, specific and actionable. Mention 2-3 best-fit colleges and why briefly>"}}
"""
    try:
        text = await ask_claude(prompt, max_tokens=350, json_only=True)
        data = extract_json(text)
        suggestion = (data.get("suggestion") or "").strip()
        if suggestion:
            return {"suggestion": suggestion}
    except Exception:
        pass

    top_names = ", ".join(r.get("name", "") for r in compact_results[:3] if r.get("name"))
    return {
        "suggestion": f"Based on ratings and student preference fit, start with {top_names}. Compare course outcomes, placement quality, and commute before finalizing."
    }


# ---------- Scholarship Matcher ----------
@router.post("/scholarships/match")
async def match_scholarships(request: Request, user=Depends(current_user)):
    scholarships = await db(request).scholarships.find({}, {"_id": 0}).to_list(50)
    profile = user.get("profile", {})

    prompt = f"""Match scholarships to this Indian student profile.
Profile: {json.dumps(profile)}
Scholarships: {json.dumps([{'id': s['scholarship_id'], 'name': s['name'], 'eligibility': s.get('eligibility', ''), 'category': s.get('category', [])} for s in scholarships])}

Return STRICT JSON: {{"matches": [{{"scholarship_id": "...", "fit_percent": 0-100, "why": "1 sentence"}}]}}
Return top 8 matches sorted desc.
"""
    try:
        text = await ask_claude(prompt, max_tokens=1200, json_only=True)
        data = extract_json(text)
    except Exception as e:
        raise HTTPException(500, f"AI failed: {e}")
    return data
