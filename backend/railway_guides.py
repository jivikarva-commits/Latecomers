"""Railway NTPC (CEN 06/2025 graduate + CEN 07/2025 undergraduate) and Level 1 (CEN 09/2025) guides.

Verified on 2026-10-12. The NTPC notices are scanned PDFs; their text was read with OCR and
cross-checked page by page. CEN 09/2025 (Level 1) is a text PDF.
"""
from gov_guide_kit import details, fact, paper, related, source, stage, step

GRAD_URL = "https://rrbsecunderabad.gov.in/wp-content/uploads/2025/10/Final-CEN-06-2025-21-10-2025-Publish.pdf"
UG_URL = "https://rrbsecunderabad.gov.in/wp-content/uploads/2025/10/CEN-07-2025-NTPC-Under-Graduate-English.pdf"
L1_URL = "https://rrbsecunderabad.gov.in/wp-content/uploads/2026/01/Final-Detailed-CEN-09-2025-Level-1-updated-on-30.01.2026.pdf"
APPLY_URL = "https://www.rrbapply.gov.in"

RAIL_RELAX = [["OBC (non-creamy layer)", "3 years"], ["SC / ST", "5 years"], ["PwBD (UR/EWS · OBC · SC/ST)", "10 · 13 · 15 years"],
              ["Ex-servicemen (6+ months service)", "3 / 6 / 8 years after deducting service (UR-EWS / OBC / SC-ST)"]]

RAIL_FEE = ("Fee ₹500 (₹400 refunded after you appear in the first CBT). ₹250 for SC, ST, ex-servicemen, PwBD, women, transgender, "
            "minorities and Economically Backward Class (EBC) — fully refunded after appearing (minus bank charges).")

RAIL_RESOURCES = [
    {"label": "RRB application portal", "url": APPLY_URL, "note": "Apply only here. You can choose only ONE RRB per notice."},
    {"label": "NCERT Science (Class 9–10) and Maths", "url": "https://ncert.nic.in/textbook.php", "note": "General Science and maths in RRB papers are 10th level."},
    {"label": "Press Information Bureau (PIB)", "url": "https://pib.gov.in", "note": "Current affairs and government schemes."},
]

RAIL_PREP = [
    {"phase": "Basics", "duration": "Months 1–2", "focus": ["Arithmetic and 10th-level maths", "Reasoning: series, coding, puzzles", "10th-level Physics, Chemistry and Biology"]},
    {"phase": "Practice", "duration": "Months 3–4", "focus": ["Static GK + 6–8 months of current affairs", "Typing practice daily if you want clerk posts", "Topic tests with negative marking in mind"]},
    {"phase": "Mock tests", "duration": "Last 6 weeks", "focus": ["Full-length CBT mocks (90 minutes)", "Mock tests on the RRB website before the exam", "Revise weak topics from mock analysis"]},
]

RAIL_MISTAKES = [
    "Applying with a pending result — RRB needs the qualification on the closing date of the notice.",
    "Applying to more than one RRB — all your applications get rejected.",
    "Choosing posts without checking the medical (eyesight) standard — you will not get another post if you fail it.",
    "Ignoring negative marking (1/3 mark per wrong answer).",
]

NTPC = details(
    service={"short": "Railway NTPC", "full": "Non-Technical Popular Categories (Undergraduate and Graduate posts)", "headline": "How to get a Railway NTPC job (Clerk, Station Master and more)",
             "seoTitle": "Railway NTPC Guide", "authority": "Railway Recruitment Boards (RRBs), Ministry of Railways"},
    quick_facts=[
        fact("Conducted by", "Railway Recruitment Boards (RRBs)"),
        fact("12th-pass posts (CEN 07/2025)", "3,058 vacancies — clerks and trains clerk"),
        fact("Graduate posts (CEN 06/2025)", "5,810 vacancies — Station Master, Goods Train Manager and more"),
        fact("Age (on 1 Jan 2026)", "12th posts 18–30 · graduate posts 18–33"),
        fact("Stages", "CBT 1 → CBT 2 → Typing test / CBAT → DV → Medical"),
        fact("Negative marking", "1/3 mark per wrong answer"),
        fact("Starting basic pay", "₹19,900 (Level 2) to ₹35,400 (Level 6)"),
        fact("Fee", "₹500 (₹400 back) · ₹250 for reserved groups (fully back)"),
    ],
    role={"heading": "What jobs are in Railway NTPC?",
          "intro": "NTPC posts run the commercial, accounts and operations side of Indian Railways.",
          "duties": ["Commercial cum Ticket Clerk / Chief Commercial cum Ticket Supervisor: ticketing, reservations and passenger services",
                     "Junior Clerk / Accounts Clerk / Senior Clerk / Junior Accounts Assistant (typist posts): office and accounts work",
                     "Trains Clerk / Traffic Assistant: train operation records and traffic control support",
                     "Station Master: runs a station and controls train movement safely",
                     "Goods Train Manager: in charge of freight trains on the move"],
          "postings": ["You choose one RRB; posting is in the railway zones you opt for", "Shift duty is common in operations posts"]},
    eligibility=["Indian citizen (or other categories allowed in the CEN).",
                 "Undergraduate posts (CEN 07/2025): 12th pass (or equivalent). Typist posts need typing skill. Your result must be out by the closing date.",
                 "Graduate posts (CEN 06/2025): a degree from a recognised university by the closing date. Pending results are not allowed.",
                 "Age on 1 January 2026: 18–30 for 12th-level posts, 18–33 for graduate posts, plus category relaxation.",
                 "Medical standard depends on the post: Station Master and Goods Train Manager need A-2 (6/9, 6/9 without glasses); clerk posts mostly C-2."],
    category_table={"title": "Upper age relaxation by category", "columns": ["Category", "Extra years allowed"], "rows": RAIL_RELAX,
                    "note": "Other relaxations (e.g. serving railway employees, widows) are listed in the CEN."},
    attempt_rules=["RRBs do not limit attempts — only age and qualification matter."], attempt_heading="How many attempts?",
    exam_stages=[
        stage("1st Stage CBT (screening)", "As announced by RRBs", "Common for all posts in the notice.",
              [paper("General Awareness (40 Q)", "40", "90 min total", "Shortlisting"), paper("Mathematics (30 Q)", "30", "", "Shortlisting"),
               paper("General Intelligence & Reasoning (30 Q)", "30", "", "Shortlisting")],
              "1/3 mark cut per wrong answer. Minimum: UR/EWS 40%, OBC-NCL 30%, SC 30%, ST 25%. About 15 times the vacancies go to CBT 2."),
        stage("2nd Stage CBT (merit)", "After CBT 1 result", "Decides your merit.",
              [paper("General Awareness (50 Q)", "50", "90 min total", "Merit"), paper("Mathematics (35 Q)", "35", "", "Merit"),
               paper("General Intelligence & Reasoning (35 Q)", "35", "", "Merit")],
              "1/3 mark cut per wrong answer. Same minimum percentages as CBT 1."),
        stage("Skill test (only some posts)", "After CBT 2", "Typing test or aptitude test, depending on post.",
              [paper("Typing Skill Test — typist/clerk posts: 30 wpm English or 25 wpm Hindi on computer", "—", "—", "Qualifying"),
               paper("Computer Based Aptitude Test (CBAT) — Station Master / Traffic Assistant", "—", "—", "Min T-score 42 in each battery")],
              "Typing marks are not added to merit. CBAT has no negative marking; Station Master/Traffic Assistant merit is drawn only from CBAT-qualified candidates (8× vacancies called)."),
        stage("Document verification and medical examination", "After the final stage", "Shortlisting is 1:1 with vacancies.",
              [], "Original certificates are checked and the railway medical test (eyesight etc.) must be passed for the post."),
    ],
    passing_rules=["CBT 1 only shortlists; CBT 2 decides merit (plus CBAT for Station Master / Traffic Assistant).",
                   "Typing test is qualifying only.",
                   "Minimum marks: UR/EWS 40%, OBC-NCL and SC 30%, ST 25% (2 marks relaxation possible for PwBD).",
                   "Posts are allotted by merit + the post/zone preferences you gave in your form."],
    steps=[
        step("Pick your level", "Before applying", "12th pass → undergraduate posts. Graduate → graduate posts (you can apply to both notices if eligible)."),
        step("Check post requirements", "Before applying", "Typing for typist posts; eyesight A-2 for Station Master/Goods Train Manager."),
        step("Apply on rrbapply.gov.in", "Graduate: 21 Oct – 20 Nov 2025 · Undergraduate: 28 Oct – 27 Nov 2025", "Choose ONE RRB, fill post/zone preferences, upload live photo and pay the fee. A paid modification window follows."),
        step("Write CBT 1", "As per RRB schedule", "Download the city slip and e-call letter from your RRB website."),
        step("Write CBT 2", "After CBT 1 result", "Merit exam."),
        step("Typing test or CBAT if your post needs it", "After CBT 2", "Carry a vision certificate for CBAT (Station Master/Traffic Assistant)."),
        step("Document verification and medical", "After final stage", "Shortlisted 1:1 with vacancies."),
        step("Empanelment, appointment and training", "After medical", "Railway training before posting; rules depend on the post."),
    ],
    calendar={"label": "Current NTPC notices (CEN 06/2025 graduate and 07/2025 undergraduate)",
              "rows": [{"event": "Graduate applications", "date": "21 October – 20 November 2025"},
                       {"event": "Undergraduate applications", "date": "28 October – 27 November 2025"},
                       {"event": "CBTs, typing test, CBAT", "date": "Announced on your RRB website — check it for call letters and results"}],
              "note": "The next NTPC notice will be announced through the RRB annual calendar and Employment News."},
    prep_plan=RAIL_PREP,
    free_resources=[{"label": "CEN 06/2025 — NTPC Graduate (PDF)", "url": GRAD_URL, "note": "Posts, pay, medical standards and CBAT rules."},
                    {"label": "CEN 07/2025 — NTPC Undergraduate (PDF)", "url": UG_URL, "note": "Clerk posts, typing test and CBT pattern."}, *RAIL_RESOURCES],
    career_ladder={"heading": "Posts and starting pay", "columns": ["Post", "Level", "Starting basic", "Vacancies"],
                   "rows": [["Station Master", "6", "₹35,400", "615"], ["Chief Commercial cum Ticket Supervisor", "6", "₹35,400", "161"],
                            ["Goods Train Manager", "5", "₹29,200", "3,416"], ["Junior Accounts Assistant cum Typist", "5", "₹29,200", "921"],
                            ["Senior Clerk cum Typist", "5", "₹29,200", "638"], ["Traffic Assistant", "4", "₹25,500", "59"],
                            ["Commercial cum Ticket Clerk (12th)", "3", "₹21,700", "2,424"], ["Accounts Clerk cum Typist (12th)", "2", "₹19,900", "394"],
                            ["Junior Clerk cum Typist (12th)", "2", "₹19,900", "163"], ["Trains Clerk (12th)", "2", "₹19,900", "77"]],
                   "note": "From CEN 06/2025 and 07/2025. Basic pay only — DA, HRA, night duty and other railway allowances are extra."},
    special={"title": "Good to know",
             "items": ["You can apply to only one RRB per notice; multiple applications are rejected.",
                       "Fee is mostly refunded after you attend CBT 1.",
                       "If you fail the medical standard for your post, you are not given another post."]},
    mistakes=RAIL_MISTAKES,
    faqs=[{"q": "Can a 12th pass become Station Master?", "a": "No. Station Master is a graduate post. 12th-pass candidates can apply for clerk and trains clerk posts."},
          {"q": "Is there an interview?", "a": "No. Selection is through CBTs, skill test (if any), document verification and medical."},
          {"q": "Do I need glasses-free eyesight?", "a": "For A-2 posts like Station Master and Goods Train Manager, yes (6/9, 6/9 without glasses). Clerk posts have easier standards."}],
    related_items=[related("track-maintainer-helper", "Railway Level 1", "10th/ITI railway posts"),
                   related("ldc-deo-postal-assistant", "SSC CHSL", "12th-pass central government clerk posts"),
                   related("inspector-auditor-examiner", "SSC CGL", "Graduate central government posts")],
)

LEVEL1 = details(
    service={"short": "Railway Level 1", "full": "Track Maintainer, Pointsman, Assistant and other Level 1 posts (CEN 09/2025)", "headline": "How to get a Railway Level 1 (Group D) job",
             "seoTitle": "Railway Level 1 (Group D) Guide", "authority": "Railway Recruitment Boards on behalf of Railway Recruitment Cells"},
    quick_facts=[
        fact("Conducted by", "Railway Recruitment Boards (RRBs)"),
        fact("Vacancies (CEN 09/2025)", "22,195"),
        fact("Education", "10th pass or ITI or NCVT apprenticeship certificate"),
        fact("Age", "18–33 years on 1 January 2026"),
        fact("Stages", "CBT → PET → DV → Medical"),
        fact("Exam", "100 questions in 90 minutes"),
        fact("Starting basic pay", "₹18,000 (Level 1)"),
        fact("Fee", "₹500 (₹400 back) · ₹250 for reserved groups (fully back)"),
    ],
    role={"heading": "What does a Railway Level 1 employee do?",
          "intro": "Level 1 staff keep tracks, signals, trains and workshops running.",
          "duties": ["Track Maintainer: inspect and repair railway track", "Pointsman: operate points and help train movement at stations",
                     "Assistants in Electrical, Signal & Telecom, Carriage & Wagon, Loco Shed, Bridge and Workshop departments"],
          "postings": ["Posted in the railway zone you opted for", "Outdoor, shift-based work is common"]},
    eligibility=["Indian citizen (or other categories allowed in the CEN).",
                 "10th pass, OR ITI from NCVT/SCVT, OR National Apprenticeship Certificate (NAC) from NCVT — as listed for each post in Annexure A. A diploma or degree is NOT accepted in place of ITI/apprenticeship unless stated.",
                 "Qualification must be complete by 2 March 2026 (closing date). Pending results cannot apply.",
                 "Age 18–33 on 1 January 2026, with category relaxation."],
    category_table={"title": "Upper age relaxation by category", "columns": ["Category", "Extra years allowed"], "rows": RAIL_RELAX,
                    "note": "From CEN 09/2025. Serving railway staff and some others have higher limits listed in the CEN."},
    attempt_rules=["No attempt limit — only age and qualification."], attempt_heading="How many attempts?",
    exam_stages=[
        stage("Computer Based Test", "As announced by RRBs", "One objective test.",
              [paper("General Science (10th level)", "25", "90 min total", "Merit"), paper("Mathematics", "25", "", "Merit"),
               paper("General Intelligence & Reasoning", "30", "", "Merit"), paper("General Awareness & Current Affairs", "20", "", "Merit")],
              "1/3 mark cut per wrong answer. Minimum: UR/EWS 40%, OBC-NCL, SC and ST 30%."),
        stage("Physical Efficiency Test (PET)", "After CBT", "About 3 times the vacancies are called. Qualifying only.",
              [paper("Men: carry 35 kg for 100 m in 2 min + run 1,000 m in 4 min 15 s", "—", "One chance each", "Qualifying"),
               paper("Women: carry 20 kg for 100 m in 2 min + run 1,000 m in 5 min 40 s", "—", "One chance each", "Qualifying")],
              "Weight carrying comes first — fail it and you do not run. PwBD, ex-servicemen and course-completed Act apprentices are exempt from PET."),
        stage("Document verification and medical", "After PET", "Shortlisting by CBT merit.",
              [], "Medical standard depends on the post (A-2, A-3, B-1, C-1 etc. in Annexure A)."),
    ],
    passing_rules=["Merit is based on CBT marks (normalised if multiple shifts).",
                   "PET is pass/fail and compulsory unless exempted.",
                   "You must meet the medical standard of the post you are allotted."],
    steps=[
        step("Check qualification and post", "Before applying", "See Annexure A: some posts need ITI/NAC, and each has a medical standard."),
        step("Apply on rrbapply.gov.in", "CEN 09/2025: 31 January – 2 March 2026", "Choose ONE RRB/railway, fill post preferences, upload live photo, pay the fee."),
        step("Prepare and write the CBT", "As announced", "10th-level maths and science, reasoning, current affairs."),
        step("Train for PET", "From the day you apply", "Practise carrying weight and running 1 km."),
        step("PET, DV and medical", "After CBT result", "Carry originals; medical as per post."),
        step("Appointment", "After empanelment", "Joining in the allotted railway unit."),
    ],
    calendar={"label": "CEN 09/2025 (Level 1)",
              "rows": [{"event": "Online applications", "date": "31 January – 2 March 2026"},
                       {"event": "Last date for fee payment", "date": "4 March 2026"},
                       {"event": "Modification window", "date": "5 – 14 March 2026"},
                       {"event": "CBT / PET dates", "date": "Announced on RRB websites"}],
              "note": "Follow your chosen RRB's website for city slips and call letters."},
    prep_plan=RAIL_PREP[:2] + [{"phase": "Mocks + fitness", "duration": "Last 6 weeks", "focus": ["Full CBT mocks", "Run 1 km under the PET time 3–4 times a week", "Practise carrying a sandbag/weight safely"]}],
    free_resources=[{"label": "CEN 09/2025 — Level 1 (PDF)", "url": L1_URL, "note": "Post table, qualifications, CBT, PET and medical standards."}, *RAIL_RESOURCES],
    career_ladder={"heading": "Pay", "columns": ["Post", "Level", "Starting basic"],
                   "rows": [["All posts in CEN 09/2025", "Level 1", "₹18,000/month"]],
                   "note": "Basic pay only — DA, HRA and railway allowances are extra. Promotion follows railway departmental rules."},
    special={"title": "Good to know",
             "items": ["Mock/practice tests are put on RRB websites before the CBT.",
                       "A diploma or engineering degree does not replace a required ITI/apprenticeship certificate.",
                       "Course-completed Act apprentices have reserved vacancies and are exempt from PET."]},
    mistakes=RAIL_MISTAKES + ["Not practising the PET — fail the weight carry and you are out."],
    faqs=[{"q": "Is Railway Level 1 the same as Group D?", "a": "Yes — 'Group D' posts are now notified as posts in Level 1 of the 7th CPC pay matrix."},
          {"q": "Can a graduate apply?", "a": "Yes, if they also meet the 10th/ITI requirement of the post; a higher degree does not replace a required ITI."}],
    related_items=[related("junior-clerk-station-master", "Railway NTPC", "12th and graduate railway posts"),
                   related("multi-tasking-staff", "SSC MTS", "10th-pass central government jobs"),
                   related("police-constable", "Police Constable", "State police route")],
)

GUIDE_DETAILS = {"junior-clerk-station-master": NTPC, "track-maintainer-helper": LEVEL1}
GUIDE_SOURCES = {
    "junior-clerk-station-master": [source("RRB CEN 06/2025 — NTPC Graduate", GRAD_URL, "Posts, vacancies, pay, age, CBT 1/2, CBAT, typing test, minimum marks (scanned PDF read with OCR)."),
                                    source("RRB CEN 07/2025 — NTPC Undergraduate", UG_URL, "Clerk posts, vacancies, pay, fee, CBT pattern and typing test (scanned PDF read with OCR).")],
    "track-maintainer-helper": [source("RRB CEN 09/2025 — Level 1", L1_URL, "Vacancies, age, relaxations, qualifications, fee, CBT, PET and medical standards.")],
}
