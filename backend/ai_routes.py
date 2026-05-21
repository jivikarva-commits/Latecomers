"""AI routes: onboarding analysis, career test scoring, chat, roadmap generation, mock interview, scholarship matcher."""
import json
import logging
import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Union

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel

from auth_routes import current_user
from llm_client import ask_claude, extract_json, llm_status

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai", tags=["ai"])


def db(request: Request):
    return request.app.state.db


CAREER_MATCH_SCORING_GUIDANCE = """
Career match scoring rules (apply ALL these rules to score each career):

STREAM MATCHING (highest weight):
- Commerce stream → strongly prioritize: CA, CMA, CS, ACCA, CFA, GST Practitioner, Income Tax Consultant, Tally Accountant, SAP FICO, Financial Modeler, Investment Banker, Stock Market Trader, Mutual Fund Advisor, Business Analyst, Financial Analyst, MBA Manager. Also good: Digital Marketing, SEO, Social Media Manager, Business Development, Entrepreneur, Copywriter.
- Science PCM → strongly prioritize: Full Stack Dev, Python Dev, Java Dev, Data Scientist, AI ML Engineer, DevOps, AWS Architect, Cybersecurity Analyst, Ethical Hacker, Robotics Engineer, IoT Engineer, EV Technology Engineer, Software Developer, Cloud Engineer. Also good: Data Analytics, Business Analytics, Game Developer, Drone Technology.
- Science PCB → strongly prioritize: Nurse, Physiotherapist, Pharmacist, Medical Coder, Lab Technician, Nutritionist Dietitian, Radiologist Technician. Also good: Yoga Instructor, Fitness Trainer, Spa Therapist.
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
            ("PCB Focus", "Which biology-linked path should we narrow toward?", ["Doctor or clinical care", "Pharmacy and medicines", "Biotech and research", "Nutrition and wellness", "Medical coding or health tech"]),
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
    creative = any(word in text for word in ["design", "creative", "animation", "gaming", "editing"])
    quick_income = any(word in text for word in ["3-6 months", "quick job-ready", "fast income"])
    freelance = any(word in text for word in ["freelance", "entrepreneurship", "own business", "startup"])

    if "commerce" in text:
        groups = [
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
        groups = [
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
        groups = [
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
        groups = [
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
        groups = [
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
    return groups


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
        if len(picked) >= 8:
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
    }

    def add_ai_career(item: dict, target: list, default_percent: int, include_why: bool):
        slug = item.get("slug") or item.get("careerSlug")
        career = careers_by_slug.get(slug)
        if not career or slug in used_slugs:
            return
        used_slugs.add(slug)
        match = int(item.get("matchPercent") or default_percent)
        match = max(81, match) if include_why else min(79, max(60, match))
        why = item.get("whyMatch") if include_why and isinstance(item.get("whyMatch"), list) else None
        normalized_item = _career_public_fields(career, match, why)
        if item.get("title"):
            normalized_item["title"] = item["title"]
        if item.get("tags"):
            normalized_item["tags"] = item["tags"][:3]
        if item.get("shortDescription"):
            normalized_item["shortDescription"] = item["shortDescription"]
        target.append(normalized_item)

    for item in data.get("topCareers") or []:
        if len(normalized["topCareers"]) >= 3:
            break
        if isinstance(item, dict):
            add_ai_career(item, normalized["topCareers"], 86, True)

    for item in data.get("additionalCareers") or []:
        if len(normalized["additionalCareers"]) >= 5:
            break
        if isinstance(item, dict):
            add_ai_career(item, normalized["additionalCareers"], 72, False)

    fallbacks = _pick_fallback_careers(careers, answers, used_slugs)
    for career in fallbacks:
        if len(normalized["topCareers"]) < 3:
            percent = [92, 88, 84][len(normalized["topCareers"])]
            normalized["topCareers"].append(_career_public_fields(career, percent))
            used_slugs.add(career["slug"])
        elif len(normalized["additionalCareers"]) < 5:
            percent = [78, 75, 72, 69, 66][len(normalized["additionalCareers"])]
            normalized["additionalCareers"].append(_career_public_fields(career, percent))
            used_slugs.add(career["slug"])
        if len(normalized["topCareers"]) == 3 and len(normalized["additionalCareers"]) == 5:
            break

    if not normalized["overallScore"]:
        top_scores = [c["matchPercent"] for c in normalized["topCareers"]]
        normalized["overallScore"] = int(sum(top_scores) / len(top_scores)) if top_scores else 75
    for key, value in list(normalized["scores"].items()):
        if not value:
            normalized["scores"][key] = max(60, min(95, normalized["overallScore"] + (len(key) % 7) - 3))

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


@router.post("/onboarding/analyze")
async def analyze_onboarding(
    payload: OnboardingRequest,
    request: Request,
    user=Depends(current_user),
):
    """Analyze 15 onboarding answers via Claude and save career match results."""

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

A student has completed a 15-question career assessment quiz. Analyze ALL their answers holistically and provide personalized career recommendations.

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

    try:
        text = await ask_claude(prompt, max_tokens=3200, json_only=True)
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
    if _ans("q1"):  profile_extra["educationLevel"]     = _ans("q1")
    if _ans("q2"):  profile_extra["stream"]              = _ans("q2")
    if _ans("q3"):  profile_extra["currentSituation"]    = _ans("q3")
    if _ans("q4"):  profile_extra["subjects"]            = _ans("q4") if isinstance(_ans("q4"), list) else [_ans("q4")]
    if _ans("q5"):  profile_extra["activities"]          = _ans("q5") if isinstance(_ans("q5"), list) else [_ans("q5")]
    if _ans("q6"):  profile_extra["workType"]            = _ans("q6")
    if _ans("q7"):  profile_extra["personality"]         = _ans("q7")
    if _ans("q8"):  profile_extra["careerGoal"]          = _ans("q8")
    if _ans("q9"):  profile_extra["incomeTimeline"]      = _ans("q9")
    if _ans("q10"): profile_extra["fieldInterest"]       = _ans("q10")
    if _ans("q11"): profile_extra["govtExamInterest"]    = _ans("q11")
    if _ans("q12"): profile_extra["budget"]              = _ans("q12")
    if _ans("q13"): profile_extra["learningPreference"]  = _ans("q13")
    if _ans("q14"): profile_extra["biggestChallenge"]    = _ans("q14")
    if _ans("q15"): profile_extra["careerIdentity"]      = _ans("q15")
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
    rec = await db(request).test_results.find_one(
        {"user_id": user["user_id"]}, {"_id": 0}, sort=[("completed_at", -1)]
    )
    return rec or {}


# ---------- Roadmap generation ----------
class RoadmapGenRequest(BaseModel):
    career_slug: str


@router.post("/roadmap/generate")
async def generate_roadmap(payload: RoadmapGenRequest, request: Request, user=Depends(current_user)):
    career = await db(request).careers.find_one({"slug": payload.career_slug}, {"_id": 0})
    if not career:
        raise HTTPException(404, "Career not found")

    profile = user.get("profile", {})
    prompt = f"""Generate a personalized career roadmap for an Indian student pursuing {career['title']}.

Student profile: {json.dumps(profile)}

Return STRICT JSON:
{{
  "stages": [
    {{"stageNum": 1, "title": "Explore", "duration": "1-2 months", "description": "...", "skills": ["..."], "resources": [{{"label": "...", "type": "course|book|video"}}]}}
  ]
}}
Provide exactly 4 stages: Explore, Learn, Prepare, Achieve. India-specific resources where possible.
"""

    try:
        text = await ask_claude(prompt, max_tokens=2000, json_only=True)
        data = extract_json(text)
    except Exception as e:
        logger.error(f"roadmap LLM error: {e}")
        raise HTTPException(500, f"AI roadmap failed: {e}")

    # Save under user
    await db(request).users.update_one(
        {"user_id": user["user_id"]},
        {
            "$set": {
                f"personalized_roadmaps.{payload.career_slug}": data,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
        },
    )
    return data


@router.get("/roadmap/{career_slug}")
async def get_user_roadmap(career_slug: str, request: Request, user=Depends(current_user)):
    rmap = (user.get("personalized_roadmaps") or {}).get(career_slug)
    if rmap:
        return rmap
    # Fallback to career-default roadmap
    career = await db(request).careers.find_one({"slug": career_slug}, {"_id": 0})
    if career and career.get("roadmap"):
        return {"stages": career["roadmap"]}
    raise HTTPException(404, "No roadmap available; generate one first.")


# ---------- AI Chat ----------
class ChatRequest(BaseModel):
    message: str
    chat_id: Optional[str] = None
    career_slug: Optional[str] = None


@router.post("/chat")
async def chat(payload: ChatRequest, request: Request, user=Depends(current_user)):
    chat_id = payload.chat_id or str(uuid.uuid4())
    chat_doc = await db(request).chats.find_one({"chat_id": chat_id, "user_id": user["user_id"]}, {"_id": 0})

    history = chat_doc["messages"] if chat_doc else []

    system = (
        "You are Late Comers AI, a friendly, India-specific career counselor for students. "
        "Help with career guidance, skill advice, college selection, scholarship tips, interview prep. "
        "Be concise, encouraging, and practical. "
        "Use clean plain text only: no markdown headings, no # symbols, no **bold** markers, no code fences. "
        "Use short section titles on their own line and simple hyphen bullets where useful."
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
