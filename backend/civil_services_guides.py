"""Beginner start-to-end guides for IAS, IPS and Indian Foreign Service.

All three services are filled through one UPSC Civil Services Examination (CSE), so the
exam facts live in shared blocks below and each service adds its own role, training,
career ladder and service-specific rules.

Verified on 2026-10-06 against:
- UPSC CSE 2026 notification (Examination Notice 05/2026-CSE, 04.02.2026)
- UPSC Programme of Examinations 2027 (as on 20.05.2026)
- IAS (Pay) Rules 2016 and IPS (Pay) Rules 2016, Gazette of India
- MEA (Indian Foreign Service page), LBSNAA and SVPNPA official pages
"""

CSE_NOTICE_URL = "https://www.upsc.gov.in/sites/default/files/Notif-CSP-2026-Engl-060226Rev.pdf"

# ---------- Shared exam facts (identical for IAS, IPS and IFS) ----------

CATEGORY_TABLE = {
    "columns": ["Category", "Age on 1 August of exam year", "Attempts allowed"],
    "rows": [
        ["General / EWS", "21 to under 32", "6"],
        ["OBC (non-creamy layer)", "21 to under 35 (3 years relaxation)", "9"],
        ["SC / ST", "21 to under 37 (5 years relaxation)", "Unlimited (within the age limit)"],
        ["PwBD", "Up to 10 years extra relaxation", "9 for General/EWS/OBC; unlimited for SC/ST"],
    ],
    "note": "For CSE 2026 the general rule meant being born between 2 August 1994 and 1 August 2005. "
            "Ex-servicemen and some defence personnel get separate relaxations. EWS has no age relaxation. "
            "SC/ST/OBC candidates who are also PwBD or ex-servicemen get both relaxations together.",
}

ATTEMPT_RULES = [
    "Sitting in even one paper of the Preliminary exam counts as one attempt.",
    "Only applying (and not appearing) does not use an attempt.",
    "Disqualification after appearing still counts as an attempt.",
]

EXAM_STAGES = [
    {
        "name": "Stage 1 — Preliminary Examination (Prelims)",
        "when": "Late May",
        "purpose": "Screening test only. These marks are NOT added to your final rank.",
        "papers": [
            {"paper": "Paper I — General Studies (GS)", "marks": "200", "duration": "2 hours", "counts": "Decides the Mains cut-off"},
            {"paper": "Paper II — CSAT (aptitude)", "marks": "200", "duration": "2 hours", "counts": "Qualifying: need 33%"},
        ],
        "passRule": "Score at least 33% (66/200) in CSAT AND cross the GS Paper I cut-off fixed by UPSC. "
                    "Both papers are compulsory. Objective (MCQ) questions with 1/3 negative marking for each wrong answer; blanks get no penalty. "
                    "Roughly 12–13 candidates per vacancy are sent to Mains.",
    },
    {
        "name": "Stage 2 — Main Examination (Mains)",
        "when": "August–September (about 5 days)",
        "purpose": "Written, descriptive exam. 1,750 marks count for your final rank.",
        "papers": [
            {"paper": "Paper A — One Indian language", "marks": "300", "duration": "3 hours", "counts": "Qualifying: need 25%"},
            {"paper": "Paper B — English", "marks": "300", "duration": "3 hours", "counts": "Qualifying: need 25%"},
            {"paper": "Paper I — Essay", "marks": "250", "duration": "3 hours", "counts": "Merit"},
            {"paper": "Paper II — GS I (Heritage, Culture, History, Geography, Society)", "marks": "250", "duration": "3 hours", "counts": "Merit"},
            {"paper": "Paper III — GS II (Constitution, Polity, Governance, Social Justice, International Relations)", "marks": "250", "duration": "3 hours", "counts": "Merit"},
            {"paper": "Paper IV — GS III (Economy, Technology, Environment, Security, Disaster Management)", "marks": "250", "duration": "3 hours", "counts": "Merit"},
            {"paper": "Paper V — GS IV (Ethics, Integrity and Aptitude)", "marks": "250", "duration": "3 hours", "counts": "Merit"},
            {"paper": "Paper VI — Optional subject, Paper 1", "marks": "250", "duration": "3 hours", "counts": "Merit"},
            {"paper": "Paper VII — Optional subject, Paper 2", "marks": "250", "duration": "3 hours", "counts": "Merit"},
        ],
        "passRule": "Your Essay, GS and Optional papers are counted only if you score at least 25% in BOTH language papers. "
                    "Then UPSC sets a written cut-off; about 2 candidates per vacancy are called for the interview. "
                    "Paper A is not compulsory for candidates from Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland and Sikkim "
                    "(and for eligible hearing-impaired PwBD candidates).",
    },
    {
        "name": "Stage 3 — Personality Test (Interview)",
        "when": "Usually January–April of the next year",
        "purpose": "A conversation with a UPSC board in New Delhi to judge suitability for public service.",
        "papers": [
            {"paper": "Interview / Personality Test", "marks": "275", "duration": "Not fixed", "counts": "Merit"},
        ],
        "passRule": "No minimum pass mark in the interview. It tests mental alertness, judgement, leadership, integrity and interest in current events — not memorised facts.",
    },
]

PASSING_RULES = [
    "Final rank = Mains written marks (out of 1,750) + Interview marks (out of 275) = total out of 2,025.",
    "Prelims marks never count in the final rank — Prelims only gets you into Mains.",
    "Qualifying papers (CSAT, Paper A, Paper B) must be cleared, but their marks are not added to your rank.",
    "Service is decided by your rank + the order of services you preferred + your category + vacancies + medical fitness.",
    "If total marks tie, UPSC first compares Essay + GS + Interview, then Essay + GS, then the older candidate ranks higher.",
]

OPTIONAL_SUBJECTS = (
    "Choose ONE optional (two papers) from: Agriculture, Animal Husbandry & Veterinary Science, Anthropology, Botany, "
    "Chemistry, Civil Engineering, Commerce & Accountancy, Economics, Electrical Engineering, Geography, Geology, History, "
    "Law, Management, Mathematics, Mechanical Engineering, Medical Science, Philosophy, Physics, Political Science & "
    "International Relations, Psychology, Public Administration, Sociology, Statistics, Zoology, or Literature of one of "
    "23 languages (including English). You do not need a degree in your optional subject."
)

def _steps(service_specific):
    return [
        {"title": "Check your eligibility", "when": "Before anything else",
         "detail": "Indian citizen (compulsory for IAS, IPS and IFS) · Graduate in any subject from a recognised university (final-year students may apply) · "
                   "At least 21 and under the upper age limit on 1 August of the exam year · Attempts left for your category."},
        {"title": "Understand the exam and choose your optional", "when": "Month 1",
         "detail": "Download the latest UPSC CSE notification and syllabus. Solve one previous-year Prelims paper to see the level. "
                   "Pick an optional you can enjoy for 1–2 years and that has a clear syllabus — not just what is popular."},
        {"title": "Prepare: build the base, then practise", "when": "10–14 months before Prelims (typical)",
         "detail": "Start with NCERT basics, read a daily newspaper, then move to standard books, Mains answer writing and Prelims mock tests. "
                   "Coaching is optional; many candidates prepare with free official material and test series."},
        {"title": "Register and apply online", "when": "January–February (notification window ~3 weeks)",
         "detail": "On upsconline.nic.in: create an account → Universal Registration Number (URN, one time in life) → Common Application Form "
                   "(photo, live photo, signature, ID) → CSE exam form (optional subject, Mains medium, compulsory Indian language, centres) → pay fee. "
                   "Fee: ₹100 (Prelims) + ₹200 later for Mains. Women, SC, ST and PwBD candidates pay no fee. No changes are allowed after submission."},
        {"title": "Write Prelims", "when": "Late May",
         "detail": "Download the e-admit card from the UPSC site (sent ~1 week before). Reach 30 minutes early; face authentication is done at the venue. "
                   "Clear CSAT (33%) and the GS cut-off."},
        {"title": "Confirm Mains form and pay ₹200", "when": "Within 10 days of the Prelims result",
         "detail": "Logging in during this window is mandatory — if you miss it you cannot write Mains."},
        {"title": "Write Mains", "when": "August–September",
         "detail": "Nine 3-hour descriptive papers over about five days. Clear both language papers (25%) and the written cut-off."},
        {"title": "Fill details and upload degree proof", "when": "Within 15 days of the Mains result",
         "detail": "Upload proof of graduation (if you applied in final year), update education, work, achievements and category documents. "
                   "Service preferences and, for IAS/IPS, home-cadre preferences are filled when UPSC asks — choose carefully, they cannot be changed later."},
        {"title": "Face the Interview", "when": "January–April",
         "detail": "Board interview of 275 marks at UPSC, New Delhi. Original documents are verified at this stage."},
        {"title": "Final result and service allocation", "when": "Usually April–May",
         "detail": "UPSC publishes the final merit list. The Government (DoPT) then allocates services and cadres based on rank, preferences, category, vacancies and medical fitness."},
        *service_specific,
    ]

PREP_PLAN = [
    {"phase": "Foundation", "duration": "Months 1–4",
     "focus": ["NCERT books Class 6–12: History, Geography, Polity, Economy, Science", "Read one national newspaper daily and make short notes",
               "Read the full syllabus and last 5 years' question papers"]},
    {"phase": "Core GS + Optional", "duration": "Months 4–9",
     "focus": ["Standard reference books for each GS subject", "Finish the optional syllabus once", "Start writing 2–3 Mains answers daily and get them reviewed"]},
    {"phase": "Prelims focus", "duration": "Last 3–4 months before Prelims",
     "focus": ["Revise, do not start new books", "Full-length GS and CSAT mock tests weekly", "Practise CSAT even if you are good at maths — 33% is compulsory"]},
    {"phase": "Mains focus", "duration": "Between Prelims and Mains (~3 months)",
     "focus": ["Timed answer writing for GS I–IV", "Weekly essay practice", "Ethics case studies and optional revision"]},
    {"phase": "Interview", "duration": "After the Mains result",
     "focus": ["Prepare from your own application details: home state, degree, hobbies, job", "Mock interviews and current affairs discussion"]},
]

FREE_RESOURCES = [
    {"label": "UPSC — official notification & syllabus", "url": CSE_NOTICE_URL, "note": "Read sections 3 (eligibility) and Appendix I (exam plan & syllabus)."},
    {"label": "UPSC — previous question papers", "url": "https://upsc.gov.in/examinations/previous-question-papers", "note": "The best guide to the real level of the exam."},
    {"label": "NCERT textbooks (free PDF)", "url": "https://ncert.nic.in/textbook.php", "note": "Class 6–12 basics for every GS subject."},
    {"label": "Press Information Bureau (PIB)", "url": "https://pib.gov.in", "note": "Official government news for current affairs."},
    {"label": "Union Budget & Economic Survey", "url": "https://www.indiabudget.gov.in", "note": "Key source for Economy (GS III)."},
    {"label": "UPSC online application portal", "url": "https://upsconline.nic.in", "note": "The only place to apply. Beware of fake sites."},
]

CALENDAR = {
    "label": "Next cycle: CSE 2027 (UPSC Programme of Examinations 2027)",
    "rows": [
        {"event": "Notification released", "date": "13 January 2027"},
        {"event": "Last date to apply", "date": "2 February 2027"},
        {"event": "Prelims", "date": "23 May 2027 (Sunday)"},
        {"event": "Mains begins", "date": "20 August 2027 (5 days)"},
        {"event": "Interview & final result", "date": "Not in the calendar — usually early to mid 2028"},
    ],
    "note": "UPSC can change dates. Always check the CSE 2027 notification when it is released.",
}

COMMON_MISTAKES = [
    "Ignoring CSAT — many good GS scorers fail Prelims because they score below 33% in CSAT.",
    "Reading too many books instead of revising a few good sources many times.",
    "Starting answer writing only after Prelims — Mains needs months of practice.",
    "Choosing an optional only because toppers took it.",
    "Filling service and cadre preferences without thinking — the allocation is binding.",
    "Not reading the latest notification: rules on attempts, documents and service restrictions change.",
]

SHARED_SOURCES = [
    {"label": "UPSC CSE 2026 notification (Notice 05/2026-CSE)", "url": CSE_NOTICE_URL, "kind": "official",
     "scope": "Eligibility, age, attempts, fee, application steps, restrictions, exam plan, papers, marks, qualifying rules and syllabus."},
    {"label": "UPSC Programme of Examinations 2027", "url": "https://www.upsc.gov.in/sites/default/files/Calendar-Year-2027-Engl-200526.pdf", "kind": "official",
     "scope": "CSE 2027 notification, last date, Prelims and Mains dates (as on 20.05.2026)."},
]


def _related(current):
    services = [
        {"slug": "ias-officer", "title": "IAS — Indian Administrative Service", "why": "District administration and policy making"},
        {"slug": "ips-officer", "title": "IPS — Indian Police Service", "why": "Policing, law and order and internal security"},
        {"slug": "indian-foreign-service-officer", "title": "IFS — Indian Foreign Service", "why": "Diplomacy and India's missions abroad"},
    ]
    return [s for s in services if s["slug"] != current]


def _details(slug, service, role, quick_facts, service_steps, training, ladder, special, faqs, extra_mistakes=()):
    return {
        "service": service,
        "quickFacts": quick_facts,
        "role": role,
        "categoryTable": CATEGORY_TABLE,
        "attemptRules": ATTEMPT_RULES,
        "examStages": EXAM_STAGES,
        "passingRules": PASSING_RULES,
        "optionalSubjects": OPTIONAL_SUBJECTS,
        "steps": _steps(service_specific=service_steps),
        "calendar": CALENDAR,
        "prepPlan": PREP_PLAN,
        "freeResources": FREE_RESOURCES,
        "training": training,
        "careerLadder": ladder,
        "special": special,
        "mistakes": [*extra_mistakes, *COMMON_MISTAKES],
        "faqs": faqs,
        "related": _related(slug),
    }


COMMON_FAQS = [
    {"q": "Can I apply while in the final year of graduation?",
     "a": "Yes. You can write Prelims and Mains in your final year. You must upload proof of passing your degree when you qualify for the interview."},
    {"q": "Do I need a minimum percentage in graduation?", "a": "No. Any recognised graduate degree is enough; marks do not matter."},
    {"q": "Can I write the exam in Hindi or another Indian language?",
     "a": "Yes. Prelims papers are in Hindi and English. Mains answers (except Paper A and Paper B) can be written in English or any language in the Eighth Schedule of the Constitution."},
    {"q": "Is coaching compulsory?",
     "a": "No. UPSC does not require coaching. Many candidates use NCERTs, standard books, official sources and test series. Coaching can help with structure but does not guarantee selection."},
]

# ---------- Service-specific blocks ----------

IAS = _details(
    "ias-officer",
    {"short": "IAS", "full": "Indian Administrative Service", "authority": "Cadre controlled by DoPT, Government of India"},
    {"intro": "IAS officers run the administration of districts and states and help make and implement policy in the Central Government.",
     "duties": ["Run a sub-division (SDM) and later a whole district (District Collector / District Magistrate)",
                "Collect land revenue, maintain law and order with the police, and manage elections and disasters",
                "Implement Central and State government schemes on the ground",
                "Head departments as Secretary in the State Government and work as Joint Secretary / Secretary in Union ministries",
                "Advise ministers and draft policy"],
     "postings": ["Allocated to a State cadre (may not be your home state)", "District postings first, then State Secretariat and Central deputation"]},
    [
        {"label": "Conducted by", "value": "UPSC — Civil Services Exam (CSE)"},
        {"label": "Minimum education", "value": "Graduate in any subject"},
        {"label": "Age (General)", "value": "21 to under 32 on 1 August"},
        {"label": "Attempts (General)", "value": "6"},
        {"label": "Exam stages", "value": "Prelims → Mains → Interview"},
        {"label": "Training", "value": "LBSNAA, Mussoorie (about 2 years incl. district training)"},
        {"label": "Starting basic pay", "value": "₹56,100/month (Level 10)"},
        {"label": "Total vacancies CSE 2026", "value": "About 933 across all ~23 services (not IAS alone)"},
    ],
    [
        {"title": "Medical exam and appointment", "when": "After the final result",
         "detail": "Medical examination by the government medical board, police/character verification, then appointment as IAS probationer and State cadre allocation."},
        {"title": "Training at LBSNAA, then first posting", "when": "From about August–September",
         "detail": "Foundation Course with all services, IAS Professional Course, one year of district training, then the first posting as Assistant Collector / SDM."},
    ],
    {"intro": "All training is at the Lal Bahadur Shastri National Academy of Administration (LBSNAA), Mussoorie, except the district phase.",
     "phases": [
         {"name": "Foundation Course (with all civil services)", "place": "LBSNAA, Mussoorie", "duration": "14 weeks"},
         {"name": "IAS Professional Course — Phase I", "place": "LBSNAA", "duration": "20 weeks"},
         {"name": "District Training", "place": "District of your allotted State cadre", "duration": "52 weeks"},
         {"name": "IAS Professional Course — Phase II", "place": "LBSNAA", "duration": "8 weeks"},
     ],
     "note": "Durations are as published by LBSNAA and can change batch to batch."},
    {"note": "Pay level and minimum service years are from the IAS (Pay) Rules 2016; post names are typical and vary by State. Amount shown is the first step of each level — "
             "basic pay only. DA, HRA/government housing, vehicle and other allowances are extra. Higher grades depend on selection and vacancies.",
     "rows": [
         {"stage": "Junior Scale (start)", "typicalPost": "Assistant Collector / SDM", "level": "Level 10", "entryBasic": "₹56,100", "after": "On joining"},
         {"stage": "Senior Time Scale", "typicalPost": "ADM / CDO / Collector of a smaller district", "level": "Level 11", "entryBasic": "₹67,700", "after": "4 years"},
         {"stage": "Junior Administrative Grade", "typicalPost": "District Collector / Deputy Secretary (GoI)", "level": "Level 12", "entryBasic": "₹78,800", "after": "9 years"},
         {"stage": "Selection Grade", "typicalPost": "Collector of a large district / Director (GoI)", "level": "Level 13", "entryBasic": "₹1,18,500", "after": "13 years"},
         {"stage": "Super Time Scale", "typicalPost": "Divisional Commissioner / Secretary (State) / Joint Secretary (GoI)", "level": "Level 14", "entryBasic": "₹1,44,200", "after": "16 years"},
         {"stage": "Higher Administrative Grade", "typicalPost": "Principal Secretary (State) / Additional Secretary (GoI)", "level": "Level 15", "entryBasic": "₹1,82,200", "after": "By selection"},
         {"stage": "Apex Scale", "typicalPost": "Chief Secretary / Secretary (GoI)", "level": "Level 17", "entryBasic": "₹2,25,000", "after": "By selection"},
         {"stage": "Cabinet Secretary Grade", "typicalPost": "Cabinet Secretary of India", "level": "Level 18", "entryBasic": "₹2,50,000", "after": "One post"},
     ]},
    {"title": "IAS-specific rules",
     "items": ["You cannot sit for CSE again once you are appointed to the IAS and remain in it.",
               "IAS is listed by UPSC as suitable for candidates with certain benchmark disabilities (locomotor, visual, hearing and multiple — see the notification table).",
               "To get IAS you must mark it in your service preferences and fill your home-cadre preference when UPSC asks."]},
    [*COMMON_FAQS,
     {"q": "What rank is needed for IAS?",
      "a": "There is no fixed rank. IAS seats are fewest and most preferred, so usually only the top ranks in each category get it. The cut-off changes every year with vacancies and preferences."},
     {"q": "Will I get my home state?",
      "a": "Not necessarily. Cadre is allocated by DoPT under its Cadre Allocation Policy using rank, category, preferences and vacancies in each State."}],
)

IPS = _details(
    "ips-officer",
    {"short": "IPS", "full": "Indian Police Service", "authority": "Cadre controlled by the Ministry of Home Affairs (MHA)"},
    {"intro": "IPS officers lead the police forces of States and Union Territories and many Central police and intelligence organisations.",
     "duties": ["Lead police in a sub-division (ASP) and then a whole district (Superintendent of Police)",
                "Maintain law and order, prevent and investigate crime, and manage traffic, VIP security and public events",
                "Lead counter-terrorism, cyber-crime and anti-narcotics work",
                "Serve on deputation in CBI, IB, NIA and Central Armed Police Forces such as CRPF and BSF",
                "Rise to Inspector General and Director General of Police of a State"],
     "postings": ["Allocated to a State cadre", "Field policing first, then range, zone and headquarters; Central deputation possible"]},
    [
        {"label": "Conducted by", "value": "UPSC — Civil Services Exam (CSE)"},
        {"label": "Minimum education", "value": "Graduate in any subject"},
        {"label": "Age (General)", "value": "21 to under 32 on 1 August"},
        {"label": "Attempts (General)", "value": "6"},
        {"label": "Physical standards", "value": "Yes — height, chest, eyesight (see below)"},
        {"label": "Training", "value": "SVPNPA, Hyderabad (about 105 weeks in total)"},
        {"label": "Starting basic pay", "value": "₹56,100/month (Level 10)"},
        {"label": "Exam stages", "value": "Prelims → Mains → Interview → Medical"},
    ],
    [
        {"title": "Medical and physical standards check", "when": "After the final result",
         "detail": "The medical board checks the IPS physical standards (height, chest, eyesight and fitness). You must meet them to be allocated IPS."},
        {"title": "Training at LBSNAA and SVPNPA, then first posting", "when": "From about August–September",
         "detail": "Foundation Course at LBSNAA, then Basic Course at SVPNPA Hyderabad with district practical training, then posting as Assistant Superintendent of Police (ASP)."},
    ],
    {"intro": "After the common Foundation Course, IPS probationers train at Sardar Vallabhbhai Patel National Police Academy (SVPNPA), Hyderabad. "
              "Outdoor training includes physical fitness, drill, weapons, horse riding and field craft.",
     "phases": [
         {"name": "Foundation Course (with all civil services)", "place": "LBSNAA, Mussoorie", "duration": "15 weeks"},
         {"name": "Basic Course — Phase I", "place": "SVPNPA, Hyderabad", "duration": "49 weeks"},
         {"name": "District Practical Training / attachments", "place": "Allotted State cadre", "duration": "29 weeks"},
         {"name": "Basic Course — Phase II", "place": "SVPNPA, Hyderabad", "duration": "9 weeks"},
     ],
     "note": "SVPNPA lists the total schedule as 105 weeks including 3 weeks of breaks. Durations can change batch to batch."},
    {"note": "Pay level and minimum service years are from the IPS (Pay) Rules 2016. Amount shown is the first step of each level — "
             "basic pay only. DA, HRA/housing and police allowances are extra. Higher ranks depend on selection and vacancies.",
     "rows": [
         {"stage": "Junior Scale (start)", "typicalPost": "Assistant Superintendent of Police (ASP)", "level": "Level 10", "entryBasic": "₹56,100", "after": "On joining"},
         {"stage": "Senior Time Scale", "typicalPost": "Superintendent of Police (SP)", "level": "Level 11", "entryBasic": "₹67,700", "after": "4 years"},
         {"stage": "Junior Administrative Grade", "typicalPost": "SP / Commandant", "level": "Level 12", "entryBasic": "₹78,800", "after": "9 years"},
         {"stage": "Selection Grade", "typicalPost": "Senior SP (SSP)", "level": "Level 13", "entryBasic": "₹1,18,500", "after": "13 years"},
         {"stage": "Super Time Scale (I)", "typicalPost": "Deputy Inspector General (DIG)", "level": "Level 13A", "entryBasic": "₹1,31,100", "after": "14 years"},
         {"stage": "Super Time Scale (II)", "typicalPost": "Inspector General (IG)", "level": "Level 14", "entryBasic": "₹1,44,200", "after": "18 years"},
         {"stage": "Above Super Time Scale", "typicalPost": "Additional Director General (ADGP)", "level": "Level 15", "entryBasic": "₹1,82,200", "after": "By selection"},
         {"stage": "HAG+", "typicalPost": "Director General of Police (DGP)", "level": "Level 16", "entryBasic": "₹2,05,400", "after": "By selection"},
         {"stage": "Apex Scale", "typicalPost": "DGP — Head of Police Force of a State", "level": "Level 17", "entryBasic": "₹2,25,000", "after": "By selection"},
     ]},
    {"title": "IPS physical standards & special rules",
     "items": ["Height: at least 165 cm (men) and 150 cm (women). Relaxed to 160 cm / 145 cm for Scheduled Tribes and for races such as Gorkhas, Garhwalis, Assamese, Kumaonis and Nagaland tribals.",
               "Chest (men): at least 84 cm with 5 cm expansion. Women: at least 79 cm with 5 cm expansion.",
               "Stricter eyesight and medical standards apply (including colour vision). Check Appendix III of the CSE Rules for your year before you choose IPS.",
               "IPS is not in UPSC's list of services identified for benchmark-disability candidates in the CSE 2026 notification.",
               "Someone already selected or appointed to IPS through an earlier exam cannot opt for IPS again.",
               "A CSE 2026 IPS allottee gets a one-time chance to write CSE 2027 by taking exemption from training (joining only the Foundation Course)."]},
    [*COMMON_FAQS,
     {"q": "Do I need to be physically very strong to apply?",
      "a": "Anyone eligible can apply for CSE. Physical standards (height, chest, eyesight) are checked only after the final result, and only for IPS and other police-type services. Training at SVPNPA is physically demanding, so start building fitness early."},
     {"q": "Is IPS lower than IAS?",
      "a": "Both are All India Services with the same starting pay level. Their work is different: IAS handles general administration, IPS leads the police. Choose by the work you want to do."}],
    extra_mistakes=["Choosing IPS without first checking that you meet the height, chest and eyesight standards."],
)

IFS = _details(
    "indian-foreign-service-officer",
    {"short": "IFS", "full": "Indian Foreign Service", "authority": "Ministry of External Affairs (MEA)"},
    {"intro": "Indian Foreign Service officers are India's career diplomats. They represent India in Embassies, High Commissions, Consulates and Permanent Missions to bodies such as the UN.",
     "duties": ["Protect India's national interests in the country of posting",
                "Promote trade, investment, culture and people-to-people ties",
                "Negotiate agreements and report on political and economic developments",
                "Provide consular help to Indians abroad (passports, emergencies) and visas to foreigners",
                "Work on policy for specific countries and regions at MEA headquarters in New Delhi"],
     "postings": ["No State cadre — you serve the Ministry of External Affairs", "Alternate between missions abroad and MEA headquarters in New Delhi"]},
    [
        {"label": "Conducted by", "value": "UPSC — Civil Services Exam (CSE)"},
        {"label": "Minimum education", "value": "Graduate in any subject"},
        {"label": "Age (General)", "value": "21 to under 32 on 1 August"},
        {"label": "Attempts (General)", "value": "6"},
        {"label": "Training", "value": "LBSNAA, then Sushma Swaraj Institute of Foreign Service, New Delhi"},
        {"label": "Foreign language", "value": "Compulsory foreign language assigned after training"},
        {"label": "Starting basic pay", "value": "₹56,100/month (Level 10, in India)"},
        {"label": "Not the same as", "value": "IFoS — Indian Forest Service (separate exam)"},
    ],
    [
        {"title": "Medical exam and appointment", "when": "After the final result",
         "detail": "Medical examination and verification, then appointment as an IFS officer trainee in the Ministry of External Affairs."},
        {"title": "Training and language posting", "when": "From about August–September",
         "detail": "Foundation Course at LBSNAA, diplomatic training at SSIFS New Delhi, then posting to a mission abroad where your compulsory foreign language is spoken. You must pass the language exam to be confirmed in service."},
    ],
    {"intro": "IFS officers first train with other services, then at the Sushma Swaraj Institute of Foreign Service (SSIFS, earlier called the Foreign Service Institute), New Delhi.",
     "phases": [
         {"name": "Foundation Course (with all civil services)", "place": "LBSNAA, Mussoorie", "duration": "About 14–15 weeks"},
         {"name": "Professional diplomatic training", "place": "SSIFS, New Delhi", "duration": "Set by MEA each batch"},
         {"name": "Compulsory Foreign Language (CFL) posting", "place": "An Indian mission where the language is spoken", "duration": "Until you pass the CFL exam"},
     ],
     "note": "MEA does not publish fixed durations for the IFS-specific phases; they are decided batch-wise."},
    {"note": "Ranks are from the Ministry of External Affairs. Starting basic pay in India is Level 10 (₹56,100). Abroad, officers get Foreign Allowance, "
             "housing and other entitlements under MEA rules instead of normal Indian allowances — amounts vary by country. "
             "At MEA headquarters the ladder is Under Secretary → Deputy Secretary → Director → Joint Secretary → Additional Secretary → Secretary.",
     "rows": [
         {"stage": "Entry", "typicalPost": "Third Secretary", "level": "Level 10", "entryBasic": "₹56,100", "after": "On joining"},
         {"stage": "Abroad", "typicalPost": "Second Secretary", "level": "—", "entryBasic": "—", "after": "After confirmation in service"},
         {"stage": "Abroad", "typicalPost": "First Secretary", "level": "—", "entryBasic": "—", "after": "By promotion"},
         {"stage": "Abroad", "typicalPost": "Counsellor", "level": "—", "entryBasic": "—", "after": "By promotion"},
         {"stage": "Abroad", "typicalPost": "Minister", "level": "—", "entryBasic": "—", "after": "By promotion"},
         {"stage": "Top", "typicalPost": "Ambassador / High Commissioner / Permanent Representative", "level": "—", "entryBasic": "—", "after": "By selection"},
     ]},
    {"title": "IFS-specific rules",
     "items": ["Indian citizenship is compulsory (same as IAS and IPS).",
               "Once appointed to IFS (and continuing in it) you cannot sit for CSE again.",
               "IFS is listed by UPSC as suitable for candidates with certain benchmark disabilities (see the notification table).",
               "IFS here means Indian Foreign Service. The Indian Forest Service (IFoS) shares the Prelims but has its own Mains and needs a science/engineering/agriculture degree."]},
    [*COMMON_FAQS,
     {"q": "Do I need to know a foreign language before joining?",
      "a": "No. Foreign language is not part of the exam. MEA assigns you a compulsory foreign language after joining and you learn it during training and your first posting."},
     {"q": "How many IFS seats are there?",
      "a": "Very few compared to other services — IFS is one of the smallest services each year, so it usually needs a high rank. Check the service-wise vacancy list in each final result."}],
    extra_mistakes=["Confusing the Indian Foreign Service with the Indian Forest Service (IFoS) — they have different Mains and eligibility."],
)

SERVICE_SOURCES = {
    "ias": [
        {"label": "IAS (Pay) Rules 2016 — Gazette of India", "url": "https://ga.odisha.gov.in/sites/default/files/2022-11/IAS%20(PAY)%20RULES,%202016_compressed.pdf", "kind": "official",
         "scope": "Pay levels (Level 10 to 18) and minimum service years for senior scales (copy hosted by Odisha GA department)."},
        {"label": "LBSNAA — courses and durations", "url": "https://www.lbsnaa.gov.in/menu/function-and-duties-of-organisation", "kind": "official",
         "scope": "Foundation Course, IAS Professional Course Phase I/II and District Training durations."},
    ],
    "ips": [
        {"label": "IPS (Pay) Rules 2016 — Gazette of India", "url": "https://ips.gov.in/otherscirculars/IPS%20(Pay)%20Rules,%202016.pdf", "kind": "official",
         "scope": "IPS ranks with pay levels (Level 10 to 17) and minimum service years for DIG and IG."},
        {"label": "SVPNPA — functions and IPS training schedule", "url": "https://www.svpnpa.gov.in/static/gallery/docs/8bee453ac41143d890b98cf5654b47ac.pdf", "kind": "official",
         "scope": "105-week IPS training schedule: Foundation Course, Phase I, attachments and Phase II."},
        {"label": "Vajiram & Ravi — IPS physical eligibility", "url": "https://vajiramandravi.com/upsc-exam/upsc-physical-eligibility-criteria/", "kind": "institute",
         "scope": "Cross-check of IPS height and chest standards from Appendix III of the CSE Rules."},
    ],
    "ifs": [
        {"label": "MEA — Indian Foreign Service", "url": "https://www.mea.gov.in/indian-foreign-service.htm", "kind": "official",
         "scope": "Role of IFS officers, training sequence, compulsory foreign language and career ranks."},
        {"label": "Sushma Swaraj Institute of Foreign Service (MEA)", "url": "https://ssifs.mea.gov.in/brief-on-ssifs", "kind": "official",
         "scope": "Training institute for IFS officer trainees (formerly the Foreign Service Institute)."},
    ],
}
