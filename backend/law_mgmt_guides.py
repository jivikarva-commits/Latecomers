"""Law & Management — beginner guides for law careers and MBA tracks.

Facts checked on 2026-10-13 against official sources: Consortium of NLUs (CLAT 2027 UG/PG eligibility and paper format),
All India Bar Examination website (AIBE eligibility incl. final-semester students), Supreme Court judgment in
All India Judges Association v. Union of India (20 May 2025, directions on 3 years' practice for Civil Judge Jr. Division),
Constitution of India Article 233 (District Judge), IIM Ahmedabad PGP 2027-29 admission policy (CAT eligibility),
XAT (XLRI), CMAT (NTA), TISS admissions, SHRM eligibility, ASCM CSCP and ASQ CSSGB pages.
No salary figures are given because there is no official source for them.
"""
from copy import deepcopy

from career_catalog import slugify
from finance_guides import CFA
from gov_guide_kit import fact, institute, paper, related, source, stage, step

from tech_guides import _guide

BACK = ["/careers-explore?field=law-mgmt", "← All Law & Management careers"]
LAW, MBA = "Law", "MBA Tracks"
LABELS = {"nav": {"role": "What you do", "steps": "Start to end", "eligibility": "Education & eligibility", "exam": "Exams & selection",
                  "passing": "Ready checklist", "calendar": "Timeline", "prepare": "How to prepare", "salary": "Career growth", "faqs": "FAQs",
                  "institutes": "Top institutes", "government-sources": "Sources"},
          "passing": "Ready checklist"}
ELIG = [
    "Entrance exams (CLAT, CAT, XAT, CMAT) and bar/judicial exams have their own rules — always read the latest official notification.",
    "There is no upper age limit for CLAT or CAT; judicial service age limits differ by state.",
]


def _lm(slug, title, short, headline, summary, group, *, authority, icon, color, exam_heading, **kw):
    return _guide(slug, title, short, headline, summary, group=group, scope_prefix="Law & Management", back=BACK, icon=icon, color=color,
                  category="Law & Management", authority=authority, eligibility=ELIG, labels=LABELS, exam_heading=exam_heading,
                  test_topics="", interview_topics="", assignment="", **kw)


def _extra(tools, day, questions):
    return [
        {"id": "tools", "nav": "Tools", "heading": "Tools and resources you will use", "columns": ["Tool / resource", "Used for"], "rows": tools},
        {"id": "typical-day", "nav": "A typical day", "heading": "A typical day in this job", "items": day},
        {"id": "interview-questions", "nav": "Interview questions", "heading": "Interview / viva questions to practise", "items": questions},
    ]


# ---------- Institutes / official resources ----------
CLAT = institute("National Law Universities through CLAT", "Consortium of NLUs (26 NLUs)", "https://consortiumofnlus.ac.in/clat-2027/ug-eligibility.html",
                 "5-year integrated LL.B. (UG) and 1-year LL.M. (PG). CLAT UG: 120 MCQs, 2 hours, 0.25 negative marking; English, Current Affairs, "
                 "Legal Reasoning, Logical Reasoning, Quantitative Techniques.",
                 "12th students aiming for top law schools.", mode="Full-time, campus",
                 eligibility="UG: 10+2 with 45% (40% SC/ST/PwD), no upper age limit; PG: LL.B. with 50% (45% SC/ST/PwD)")
NLSIU = institute("National Law School of India University (NLSIU), Bengaluru", "National Law University", "https://www.nls.ac.in/",
                  "BA LL.B. (Hons.) through CLAT, LL.M. and other law programmes.", "Students aiming for top-tier legal careers.", mode="Full-time, campus")
NLUD = institute("National Law University Delhi", "National Law University (admission through AILET)", "https://nludelhi.ac.in/",
                 "BA LL.B. (Hons.), LL.M. and PhD; admission through its own AILET test.", "Students aiming for top law schools in Delhi.", mode="Full-time, campus")
NALSAR = institute("NALSAR University of Law, Hyderabad", "National Law University", "https://www.nalsar.ac.in/",
                   "BA LL.B. (Hons.) through CLAT, LL.M. and specialised programmes.", "Students aiming for top law schools.", mode="Full-time, campus")
BCI = institute("Bar Council of India", "Statutory regulator under the Advocates Act, 1961", "https://www.barcouncilofindia.org/",
                "Recognises law colleges and LL.B. courses, sets Legal Education Rules and conducts the All India Bar Examination.",
                "Every law student — check if your college is BCI-approved.", mode="Online information")
AIBE = institute("All India Bar Examination (AIBE)", "Conducted by the Bar Council of India", "https://www.allindiabarexamination.com/",
                 "Exam for enrolled advocates (and final-semester LL.B. students without backlogs) to get the Certificate of Practice.",
                 "New law graduates starting practice.", mode="Offline exam")
INDIACODE = institute("India Code (Ministry of Law & Justice)", "Official database of Central Acts", "https://www.indiacode.nic.in/",
                      "Free official bare acts and amendments — the main study source for law exams.", "Law students, advocates and judiciary aspirants.",
                      mode="Online", fee="Free")
SCI = institute("Supreme Court of India", "Official website", "https://www.sci.gov.in/",
                "Judgments and orders, including the 2025 directions on eligibility for Civil Judge (Junior Division).",
                "Judiciary aspirants and advocates.", mode="Online", fee="Free")
IIMA = institute("IIM Ahmedabad (and other IIMs) through CAT", "Institute of National Importance", "https://www.iima.ac.in/academics/mba/admissions",
                 "Two-year MBA (PGP) with electives in marketing, finance, HR/OB and operations; selection by CAT, then AWT and interview.",
                 "Graduates aiming for top management roles.", mode="Full-time, residential", duration="2 years",
                 eligibility="Bachelor's (3+ years after 10+2) with 50% (45% SC/ST/PwD); final-year students can apply")
IIMB = institute("IIM Bangalore", "Institute of National Importance", "https://www.iimb.ac.in/",
                 "Two-year MBA (PGP) through CAT with specialisation electives.", "Graduates aiming for top management roles.", mode="Full-time, residential", duration="2 years")
FMS = institute("Faculty of Management Studies (FMS), University of Delhi", "Central university department", "https://www.fms.edu/",
                "Two-year MBA through CAT, known for low fees and strong placements.", "Graduates who want a top MBA at a public university.", mode="Full-time", duration="2 years")
XLRI = institute("XLRI Jamshedpur through XAT", "Private management institute", "https://www.xlri.ac.in/",
                 "PGDM in Business Management and Human Resource Management; XAT is the entrance test.", "Graduates targeting HR and general management.",
                 mode="Full-time, residential", duration="2 years")
CMAT = institute("CMAT (National Testing Agency)", "National entrance for AICTE-approved management institutes", "https://cmat.nta.nic.in/",
                 "Common Management Admission Test accepted by many AICTE-approved MBA/PGDM colleges.", "Graduates applying to a wide range of B-schools.",
                 mode="Computer-based test", eligibility="Bachelor's degree; final-year students can apply")
TISS = institute("Tata Institute of Social Sciences (TISS), Mumbai", "Deemed university", "https://admissions.tiss.ac.in/",
                 "MA in Human Resources Management & Labour Relations and related programmes — check the current admission notice for the entrance test used.",
                 "Students targeting HR and labour relations.", mode="Full-time", duration="2 years")
SHRM = institute("SHRM Certified Professional (SHRM-CP)", "Global HR certification", "https://www.shrm.org/credentials/certification/eligibility-criteria",
                 "HR knowledge and behavioural competencies; no HR degree or title required to apply (see SHRM's current eligibility).",
                 "HR professionals who want a global credential.", mode="Computer-based exam")
ASCM = institute("ASCM — Certified Supply Chain Professional (CSCP)", "Global supply chain certification", "https://www.ascm.org/learning-development/certifications-credentials/cscp/",
                 "End-to-end supply chain management: planning, sourcing, logistics and customer relationships.", "Operations and supply chain managers.",
                 mode="Computer-based exam", eligibility="Check ASCM's current eligibility page")
NPTEL = institute("NPTEL / SWAYAM (IITs and IISc)", "Government of India online courses", "https://nptel.ac.in/",
                  "Free online courses in operations management, supply chain, marketing, finance and HR from IIT/IIM faculty.",
                  "Students and professionals building management skills.", mode="Online", fee="Free to learn (exam fee for certificate)")


def _mba_hiring(focus):
    return [
        stage("Stage 1 — Entrance test", "CAT (Nov), XAT (Jan), CMAT and others", "Aptitude tests for MBA admission.",
              [paper("CAT: VARC, DILR, Quantitative Aptitude", "Section-wise", "About 2 hours (sectional time limits)", "Practise mocks under time"),
               paper("XAT: Decision Making, VA&LR, QA&DI, GK", "Section-wise", "About 3 hours", "Decision Making is unique to XAT")],
              "Score above the cut-off of the institutes you apply to."),
        stage("Stage 2 — WAT / GD and personal interview", "After results (Jan–Apr)", "Institutes shortlist and interview.",
              [paper("Written ability test / group discussion", "Essay or discussion", "20–40 min", "Structure your argument"),
               paper("Personal interview", "Panel", "20–30 min", "Know your profile and why MBA")],
              "Combined score of test, academics, work experience and interview."),
        stage("Stage 3 — MBA and specialisation", "2 years", f"Core courses in year 1, {focus} electives and a summer internship.",
              [], "Clear all courses; perform in the internship."),
        stage("Stage 4 — Campus placements", "Final year", "Companies hire through the B-school's placement process.",
              [paper("Company tests, GDs and interviews", "Varies", "—", "Prepare domain cases")], "Offer from a recruiter."),
    ]


# ---------- Law ----------
LAWYER = _lm(
    "lawyer-advocate", "Lawyer / Advocate", "Advocate", "How to become a Lawyer / Advocate",
    "An advocate represents clients in courts and tribunals, drafts legal documents and gives legal advice. To practise, you need an LL.B. from a BCI-recognised institution, enrolment with a State Bar Council and a pass in the AIBE. Most new advocates first work as juniors with senior advocates to learn drafting and court procedure.", LAW,
    authority="Practise in courts and tribunals, or join law firms and chambers", icon="Scale", color="#7C3AED",
    exam_heading="Entrance, bar exam and enrolment",
    duties=["Advise clients and explain legal options", "Draft notices, petitions, agreements and replies", "Research case law and statutes",
            "Appear and argue in courts and tribunals", "Negotiate settlements", "Follow the Bar Council's professional rules"],
    postings=["Independent practice, senior advocates' chambers, law firms, legal aid, PSUs and companies"],
    facts=[fact("Education", "LL.B."), fact("Routes", "5-year LL.B. after 12th or 3-year LL.B. after graduation"), fact("Entrance", "CLAT, AILET or state/university tests"),
           fact("To practise", "State Bar Council enrolment + AIBE"), fact("Regulator", "Bar Council of India"), fact("Core skills", "Research, drafting, argument, ethics")],
    levels=[["Law student", "Core subjects, moots and internships"], ["Junior advocate", "Drafting, filing and appearing with seniors"], ["Independent", "Own clients and arguments"]],
    steps=[step("Choose your LL.B. route", "After 12th or after graduation", "Choose the 5-year integrated LL.B. after 12th (through CLAT, AILET or state tests) or the 3-year LL.B. after graduation. Make sure the college and course are recognised by the Bar Council of India. Only BCI-recognised LL.B. degrees allow enrolment as an advocate."),
           step("Study and intern", "During LL.B.", "Intern with advocates, courts, firms and NGOs every vacation, and join moot courts. Internships show you how law works in practice and help you choose an area to specialise in. Keep a record of what you did at each internship for your resume."),
           step("Pass the AIBE", "Final semester or after LL.B.", "Final-semester students without backlogs can appear, and passing leads to the Certificate of Practice. The exam is conducted by the Bar Council of India. Check the latest notice for the qualifying marks and the bare acts allowed in the exam."),
           step("Enrol with a State Bar Council", "After LL.B.", "Apply to your State Bar Council with your degree and documents. Once enrolled, you are an advocate and must follow the Bar Council's professional rules. These rules include limits on advertising your services."),
           step("Junior with a senior advocate", "First 2–5 years", "Spend your first 2–5 years learning drafting, court procedure and client handling under a senior advocate. Daily court work teaches you things textbooks cannot. Ignoring drafting skills is a common mistake, so practise them every day."),
           step("Build your own practice", "Later", "Later, choose an area such as civil, criminal, family, tax or consumer law. Focusing on one area helps clients and other lawyers know what you are good at. A practice grows slowly through good work and a strong reputation.")],
    hiring=[stage("Stage 1 — Law entrance", "CLAT (December), AILET and others", "Admission to the 5-year LL.B.",
                  [paper("CLAT UG", "120 marks", "2 hours", "0.25 negative marking per wrong answer")], "Rank high enough for your preferred NLU."),
            stage("Stage 2 — LL.B. degree", "3 or 5 years", "Must be from a BCI-recognised college/university.", [], "Pass all semesters."),
            stage("Stage 3 — AIBE", "Notified by BCI", "Bar exam for the Certificate of Practice.",
                  [paper("AIBE", "100 questions", "Offline", "Check the latest notice for the qualifying marks and allowed bare acts")], "Qualifying marks as notified by BCI."),
            stage("Stage 4 — Enrolment", "State Bar Council", "Get enrolled as an advocate.", [], "Documents verified and enrolment granted.")],
    checklist=["Your LL.B. is from a BCI-recognised institution.", "You are enrolled with a State Bar Council.", "You have passed the AIBE.",
               "You can draft basic pleadings and agreements.", "You know court procedure from internships."],
    timeline=[("LL.B.", "3 or 5 years"), ("AIBE", "Final semester or after"), ("Enrolment", "After LL.B."), ("Junior practice", "2–5 years")],
    prep=[{"phase": "Entrance", "duration": "6–12 months", "focus": ["CLAT mocks", "Reading and current affairs"]},
          {"phase": "LL.B.", "duration": "3–5 years", "focus": ["Core law", "Moots", "Internships"]},
          {"phase": "Practice", "duration": "Years 1–5", "focus": ["Drafting", "Court work"]}],
    resources=[{"label": "India Code", "url": "https://www.indiacode.nic.in/", "note": "Official bare acts."},
               {"label": "CLAT UG eligibility", "url": "https://consortiumofnlus.ac.in/clat-2027/ug-eligibility.html", "note": "Official criteria."}],
    ladder=[["Start", "Junior Advocate / Associate", "0–3 years", "Drafting and appearances"], ["Mid", "Independent Advocate", "3–10 years", "Own clients"],
            ["Senior", "Senior Advocate (designated by courts)", "Long practice", "Major cases"], ["Other paths", "Judiciary, legal officer, academia", "Any time", "Varied"]],
    special=["Only BCI-recognised LL.B. degrees allow enrolment as an advocate.", "Advocates must follow the Bar Council's rules, including limits on advertising."],
    mistakes=["Joining an unrecognised law college.", "Skipping internships.", "Ignoring drafting skills."],
    faqs=[{"q": "Can I do LL.B. after any graduation?", "a": "Yes, the 3-year LL.B. accepts graduates of any stream who meet BCI's minimum marks (45% General, 40% SC/ST). Check the exact marks rule of each college you apply to. Make sure the college is recognised by the Bar Council of India."},
          {"q": "Can I appear for AIBE in the final semester?", "a": "Yes, final-semester LL.B. students without backlogs are eligible, per the AIBE website. Passing it leads to the Certificate of Practice. Check the latest AIBE notice for dates and rules."},
          {"q": "Is CLAT compulsory?", "a": "Only for NLUs and colleges that use it; many universities have their own tests. For example, NLU Delhi admits students through its own AILET. Check the admission process of every college on your list."}],
    related_items=[related("corporate-lawyer", "Corporate Lawyer", "Law firm career"), related("judge-judiciary", "Judge (Judiciary)", "Judicial service"), related("mba-hr-manager", "MBA — HR Manager", "Labour law + HR")],
    institutes=[CLAT, NLSIU, NLUD, BCI, AIBE],
    sources=[source("CLAT 2027 — UG eligibility", "https://consortiumofnlus.ac.in/clat-2027/ug-eligibility.html", "10+2 marks and age."),
             source("CLAT 2027 — UG question paper format", "https://consortiumofnlus.ac.in/clat-2027/ug-question-format.html", "Pattern and marking."),
             source("All India Bar Examination", "https://www.allindiabarexamination.com/", "Eligibility incl. final-semester students.")],
    extra_sections=_extra([["India Code bare acts", "Statutes"], ["Court websites", "Case status and judgments"], ["Legal research databases", "Case law"], ["Word processor", "Drafting"]],
                          ["Morning court appearances", "Client meetings", "Drafting petitions and replies", "Legal research", "Prepare for tomorrow's matters"],
                          ["Why law?", "Explain a recent landmark judgment.", "What is the difference between a bail and anticipatory bail?", "How do you draft a legal notice?"]),
)

CORP = _lm(
    "corporate-lawyer", "Corporate Lawyer", "Corporate Law", "How to become a Corporate Lawyer",
    "A corporate lawyer advises companies on deals, contracts, compliance, funding, mergers and disputes, usually at law firms or in in-house legal teams. Top firms recruit heavily from NLUs and leading law schools, often through internships. Long working hours are common at large firms, especially during deals.", LAW,
    authority="Hired by law firms, companies' legal teams, banks and startups", icon="Scale", color="#7C3AED",
    exam_heading="Entrance, degree and law-firm hiring",
    duties=["Draft and review contracts", "Advise on company law and SEBI compliance", "Work on mergers, acquisitions and funding", "Do legal due diligence",
            "Negotiate with other side's lawyers", "Manage disputes with litigators"],
    postings=["Tier-1 and mid-size law firms, in-house legal teams, banks, consulting firms, startups"],
    facts=[fact("Education", "LL.B."), fact("Best route", "5-year LL.B. at an NLU via CLAT"), fact("Hiring", "Internships → pre-placement offers / campus"),
           fact("Core skills", "Contracts, company law, research, drafting"), fact("Helpful extras", "CS qualification, LL.M., finance basics")],
    levels=[["Student", "Contract and company law, internships"], ["Associate", "Due diligence, drafting, research"], ["Senior", "Lead transactions and clients"]],
    steps=[step("Get into a good law school", "After 12th", "Take CLAT or AILET to get into an NLU, because corporate firms recruit heavily from them. CLAT UG has 120 questions in 2 hours with 0.25 negative marking, so practise mocks and regular reading. A strong law school gives you better internships and placement chances."),
           step("Focus on corporate subjects", "LL.B. years 2–5", "Focus on contracts, company law, securities, competition and tax during LL.B. years 2–5. These subjects form the base of corporate legal work. Read the Companies Act and other statutes directly on India Code."),
           step("Intern at law firms", "Every vacation", "Intern at law firms every vacation, because internships often lead to pre-placement offers. Firms judge you by the quality of your work as an intern. Ask for feedback and keep improving your research and drafting."),
           step("Pass AIBE and enrol", "Final semester / after", "You need this to practise as an advocate. Final-semester students without backlogs can appear for the AIBE. After your LL.B., enrol with your State Bar Council."),
           step("Join as an associate", "After LL.B.", "After your LL.B., join a law firm or an in-house legal team as an associate. Firms give fast learning on deals, while in-house roles give business exposure. Your early years focus on due diligence, drafting and research."), step("Specialise", "Years 2–5", "In years 2–5, specialise in an area such as M&A, banking, capital markets, disputes or tech. Specialising makes you more valuable to clients and firms. Keep learning business and finance basics, since corporate work depends on them.")],
    hiring=[stage("Stage 1 — Law school admission", "CLAT/AILET", "Top firms recruit mainly from NLUs and top law schools.",
                  [paper("CLAT UG", "120 marks", "2 hours", "0.25 negative marking")], "Admission to a strong law school."),
            stage("Stage 2 — Internships", "During LL.B.", "Firms judge your work as an intern.", [], "Good intern reviews; possible pre-placement offer."),
            stage("Stage 3 — Recruitment interviews", "Final year", "Campus or direct hiring.",
                  [paper("Interviews / written tests", "Discussion", "30–60 min", "Know contract and company law basics")], "Offer as an associate.")],
    checklist=["You understand contract and company law.", "You can do due diligence and draft clauses.", "You have law-firm internships.", "You have passed AIBE and enrolled."],
    timeline=[("LL.B.", "5 years (or 3 after graduation)"), ("Internships", "Every year"), ("Associate", "After LL.B.")],
    prep=[{"phase": "Law school", "duration": "5 years", "focus": ["Corporate subjects", "Internships", "Moots"]}],
    resources=[{"label": "India Code", "url": "https://www.indiacode.nic.in/", "note": "Companies Act and other statutes."}],
    ladder=[["Start", "Associate", "0–3 years", "Drafting and diligence"], ["Mid", "Senior Associate", "3–6 years", "Run workstreams"],
            ["Senior", "Principal Associate / Counsel", "6–10 years", "Client handling"], ["Top", "Partner / General Counsel", "10+ years", "Practice leadership"]],
    special=["Long working hours are common at large firms, especially during deals."],
    mistakes=["No internships at firms.", "Weak drafting.", "Ignoring business and finance basics."],
    faqs=[{"q": "Is an NLU required?", "a": "Not legally, but top firms recruit heavily from NLUs and leading law schools. Students from other colleges can still enter through strong internships and skills. Good drafting and research matter wherever you study."},
          {"q": "Does CS help?", "a": "Yes, company-law knowledge from the CS course helps in corporate and compliance work. It is a helpful extra, not a requirement. Some lawyers take it up alongside or after their LL.B."},
          {"q": "In-house or law firm?", "a": "Firms give fast learning on deals, while in-house roles give business exposure and often better hours. Many lawyers start at a firm and move in-house later. Choose based on the type of work and lifestyle you want."}],
    related_items=[related("lawyer-advocate", "Lawyer / Advocate", "Litigation"), related("mba-finance-manager", "MBA — Finance Manager", "Deals and finance"), related("judge-judiciary", "Judge (Judiciary)", "Judicial service")],
    institutes=[CLAT, NLSIU, NLUD, NALSAR, BCI],
    sources=[source("CLAT 2027 — UG eligibility", "https://consortiumofnlus.ac.in/clat-2027/ug-eligibility.html", "10+2 marks and age."),
             source("CLAT 2027 — PG eligibility", "https://consortiumofnlus.ac.in/clat-2027/pg-eligibility.html", "LL.M. eligibility.")],
    extra_sections=_extra([["Word + redlining", "Contracts"], ["Legal databases", "Research"], ["Data rooms", "Due diligence"], ["MCA/SEBI websites", "Filings and regulations"]],
                          ["Review contracts", "Calls with clients and opposing counsel", "Due diligence checklists", "Research a regulatory question", "Late-night deal work (sometimes)"],
                          ["What are representations and warranties?", "Explain a share purchase agreement.", "What is due diligence?", "Why corporate law?"]),
)

JUDGE = _lm(
    "judge-judiciary", "Judge (Judiciary)", "Judiciary", "How to become a Judge (Judicial Services)",
    "Judges decide cases in courts. Most people enter as a Civil Judge (Junior Division) through a state judicial service exam conducted by the High Court or State PSC, and rise to District Judge and beyond.", LAW,
    authority="Recruited by High Courts / State Public Service Commissions", icon="Gavel", color="#7C3AED",
    exam_heading="Judicial service exam — typical stages",
    duties=["Hear civil and criminal cases", "Record evidence and arguments", "Write judgments and orders", "Manage court proceedings and case flow",
            "Uphold procedure and fairness", "Take part in judicial training"],
    postings=["District and subordinate courts across the state"],
    facts=[fact("Education", "LL.B. + practice"), fact("Entry post", "Civil Judge (Junior Division)"), fact("Practice rule", "Minimum 3 years (SC directions, 20 May 2025)"),
           fact("Exam conducted by", "High Court or State PSC"), fact("Typical stages", "Prelims → Mains → Interview/Viva"), fact("Training", "At least 1 year before presiding"),
           fact("District Judge (direct)", "7+ years as advocate, or 7 years combined Bar + judicial service; minimum age 35"), fact("Age limits", "Differ by state")],
    levels=[["Aspirant", "Bare acts, procedure, local laws"], ["Mains-ready", "Answer writing and judgment writing"], ["Interview-ready", "Legal reasoning and personality"]],
    steps=[step("Complete LL.B.", "3 or 5 years", "Complete a 3-year or 5-year LL.B. from a BCI-recognised institution. This is the basic qualification for judicial service exams. Study procedural laws and the Constitution carefully during your degree."), step("Enrol and practise", "Minimum 3 years", "Under the Supreme Court's 2025 directions, you need at least 3 years of practice for Civil Judge (Junior Division). Practice is counted from provisional enrolment, and law-clerk experience also counts. Use these years to learn court procedure well."),
           step("Track your state's notification", "Ongoing", "Each High Court or State PSC notifies the posts, age limit, language and exam pattern. Rules differ by state, so read the full notification for every state you plan to apply in. Also check your state's amended rules on the practice requirement."),
           step("Prepare", "12–24 months", "Study CPC, CrPC/BNSS, Evidence/BSA, IPC/BNS, the Constitution, Contract law and local laws, and practise judgment writing. Preparation usually takes 12–24 months. The new criminal laws (BNS, BNSS, BSA) replaced IPC, CrPC and the Evidence Act from 1 July 2024, so study the current law."),
           step("Clear prelims, mains and interview", "As notified", "Prelims is a screening test, and in most states your mains and interview marks decide the merit list prepared by the High Court or PSC. Practise answer writing and judgment writing for the mains. For the interview, be ready to show legal reasoning and a calm personality."), step("Training", "At least 1 year", "Complete at least 1 year of training at the state judicial academy before presiding over a court. The Supreme Court's directions require this training. It prepares you for running a courtroom and writing judgments.")],
    hiring=[stage("Preliminary exam", "As notified by the state", "Objective screening test.", [paper("Law + general knowledge", "Objective", "Varies by state", "Bare-act accuracy matters")], "Qualify for mains."),
            stage("Main exam", "As notified", "Descriptive papers.", [paper("Civil law, criminal law, language, judgment writing", "Descriptive", "Several papers", "Practise answer and judgment writing")], "Marks count for merit."),
            stage("Interview / viva voce", "After mains", "Personality and legal reasoning.", [], "Final merit = mains + interview (as per state rules)."),
            stage("Appointment and training", "After selection", "Training at the state judicial academy.", [], "At least 1 year of training before presiding (SC directions).")],
    checklist=["You meet the practice requirement in your state's rules.", "You know the major procedural laws well.", "You can write judgments.", "You meet the state's age and language rules."],
    timeline=[("LL.B.", "3–5 years"), ("Practice", "3+ years"), ("Exam cycle", "About 1 year"), ("Training", "1+ year")],
    prep=[{"phase": "Foundation", "duration": "During practice", "focus": ["Bare acts", "Procedure"]}, {"phase": "Exam", "duration": "12–24 months", "focus": ["Prelims", "Mains writing", "Interview"]}],
    resources=[{"label": "Supreme Court judgment (20 May 2025)", "url": "https://images.assettype.com/barandbench/2025-05-20/wjfs9hid/All_India_Judges_Association_and_ors_v__Union_of_India.pdf", "note": "3-year practice directions."},
               {"label": "India Code", "url": "https://www.indiacode.nic.in/", "note": "Official bare acts."}],
    ladder=[["Entry", "Civil Judge (Junior Division)", "Start", "Civil and criminal trials"], ["Mid", "Civil Judge (Senior Division)", "After promotion", "Higher value cases"],
            ["Senior", "District Judge", "Promotion or direct (7+ years at Bar, or Bar + judicial service)", "District courts"], ["Top", "High Court Judge", "Long service", "Constitutional courts"]],
    special=["The Supreme Court directed all High Courts to require 3 years' practice for Civil Judge (Junior Division) from the next recruitment after 20 May 2025; check your state's amended rules.",
             "New criminal laws (BNS, BNSS, BSA) replaced IPC, CrPC and the Evidence Act from 1 July 2024 — study the current law.",
             "A Supreme Court Constitution Bench (Rejanish K.V. v. K. Deepa, 9 October 2025) held that serving judicial officers with 7 years' combined experience as advocate and judicial officer can also apply for direct recruitment as District Judge, with a minimum age of 35 for this route; check your High Court's amended rules."],
    mistakes=["Preparing from old syllabus.", "Ignoring local/state laws and language papers.", "No judgment-writing practice."],
    faqs=[{"q": "Can fresh LL.B. graduates apply?", "a": "Under the Supreme Court's 2025 directions, Civil Judge (Junior Division) candidates need at least 3 years' practice as per the amended state rules. Fresh graduates should first enrol and practise. Check your state's notification to see how it applies this rule."},
          {"q": "Does law-clerk work count?", "a": "Yes, the Supreme Court said experience as a law clerk with judges counts towards practice. A clerkship is also a good way to learn how courts work from the inside. Keep proper records of your clerkship for verification."},
          {"q": "Who conducts the exam?", "a": "The High Court or the State Public Service Commission, depending on the state. Each state also sets its own age limit and language rules. Read your state's notification carefully before applying."}],
    related_items=[related("lawyer-advocate", "Lawyer / Advocate", "Required practice"), related("corporate-lawyer", "Corporate Lawyer", "Other law career"), related("mba-hr-manager", "MBA — HR Manager", "Labour law")],
    institutes=[SCI, CLAT, BCI, INDIACODE],
    sources=[source("All India Judges Association v. Union of India (20 May 2025)", "https://images.assettype.com/barandbench/2025-05-20/wjfs9hid/All_India_Judges_Association_and_ors_v__Union_of_India.pdf", "Directions (vii)–(x) on practice and training."),
             source("Supreme Court of India", "https://www.sci.gov.in/", "Judgments and orders."),
             source("Supreme Court Observer — Rejanish K.V. v. K. Deepa (2025)", "https://www.scobserver.in/cases/direct-recruitment-of-judicial-officers-as-district-judges-rejanish-k-v-v-k-deepa/",
                    "Constitution Bench ruling on District Judge direct recruitment (7 years combined experience, minimum age 35).", "institute")],
    extra_sections=_extra([["Bare acts (India Code)", "Statutes"], ["Previous papers of your state", "Exam pattern"], ["Judgment-writing practice", "Mains"], ["Court practice", "Procedure"]],
                          ["Hear matters listed for the day", "Record evidence", "Hear arguments", "Write orders and judgments", "Administrative work"],
                          ["Why judiciary?", "Explain the difference between a decree and an order.", "What changed with BNSS?", "How would you handle an adjournment request?"]),
)

# ---------- MBA Tracks ----------
MKT = _lm(
    "mba-marketing-manager", "MBA — Marketing Manager", "Marketing Manager", "How to become a Marketing Manager (MBA track)",
    "A marketing manager plans how a brand grows, covering market research, positioning, campaigns, pricing, channels and budgets, and leads teams and agencies. The usual route is a graduation followed by an MBA through CAT, XAT or CMAT. Many FMCG marketing roles start with field sales exposure.", MBA,
    authority="Hired by FMCG, consumer, tech, telecom, BFSI and consulting companies", icon="Briefcase", color="#0EA5E9", exam_heading="Admission and placement process",
    duties=["Research customers and markets", "Set brand positioning and plans", "Run campaigns with agencies", "Manage budgets and P&L", "Track sales and brand metrics", "Launch new products"],
    postings=["FMCG, consumer durables, tech, BFSI, telecom, retail, consulting"],
    facts=[fact("Education", "Graduation + MBA"), fact("Main entrance", "CAT; also XAT, CMAT"), fact("Typical entry roles", "Management trainee, brand/product executive, sales manager"),
           fact("Core skills", "Consumer insight, analytics, communication"), fact("Helpful", "Digital marketing skills")],
    levels=[["MBA student", "Marketing core + electives + internship"], ["Entry", "Sales/brand role with targets"], ["Manager", "Own a brand/category P&L"]],
    steps=[step("Graduate with good marks", "3–4 years", "IIMs need 50% in graduation (45% for SC/ST/PwD). Good academics also help when other B-schools shortlist candidates. Final-year students can apply for CAT."), step("Prepare for CAT/XAT/CMAT", "6–12 months", "Spend 6–12 months on mock tests and sectional practice. CAT tests VARC, DILR and Quantitative Aptitude with sectional time limits, while XAT adds Decision Making. Review every mock to find and fix your weak areas."),
           step("Clear WAT/GD and interviews", "Jan–Apr", "After the entrance results, institutes shortlist candidates for written tests, group discussions and interviews. Know your profile and current affairs well. Be clear about why you want an MBA and a marketing career."), step("Choose marketing electives", "MBA year 2", "In the second year of the MBA, choose electives such as brand management, consumer behaviour and digital marketing. Electives build depth in the area you want to work in. Pick them based on your career goal, not only on what friends choose."),
           step("Do a marketing internship", "Summer", "Do a marketing internship in the summer between the two years. Live projects matter because recruiters ask about them during placements. Choose a project where you can show clear results."), step("Get placed and grow", "After MBA", "After the MBA, you join a company through campus placements. Many marketing roles, especially in FMCG, start with sales exposure. Over time you can grow into brand manager and marketing head roles.")],
    hiring=_mba_hiring("marketing"),
    checklist=["You have a strong entrance score.", "You understand consumer behaviour and brand strategy.", "You did a marketing internship.", "You can read data and P&L."],
    timeline=[("Graduation", "3–4 years"), ("Entrance prep", "6–12 months"), ("MBA", "2 years"), ("Placement", "Final year")],
    prep=[{"phase": "Entrance", "duration": "6–12 months", "focus": ["CAT/XAT mocks", "Reading"]}, {"phase": "MBA", "duration": "2 years", "focus": ["Marketing electives", "Internship", "Live projects"]}],
    resources=[{"label": "IIM Ahmedabad admissions", "url": "https://www.iima.ac.in/academics/mba/admissions", "note": "Eligibility and process."},
               {"label": "NPTEL marketing courses", "url": "https://nptel.ac.in/", "note": "Free courses."}],
    ladder=[["Start", "Management Trainee / Assistant Brand Manager", "0–3 years", "Execution"], ["Mid", "Brand / Marketing Manager", "3–7 years", "Brand P&L"],
            ["Senior", "Senior Manager / Marketing Head", "7–12 years", "Portfolio"], ["Top", "CMO", "12+ years", "Strategy"]],
    special=["Many FMCG marketing roles start with field sales exposure."],
    mistakes=["Choosing MBA without a career goal.", "Ignoring quant and data skills.", "No internship focus."],
    faqs=[{"q": "Is work experience needed?", "a": "Not required for CAT, though some B-schools value it in selection. Freshers can get into good B-schools with strong scores and academics. Check each institute's selection criteria before applying."},
          {"q": "Can I do marketing without MBA?", "a": "Yes, digital marketing roles hire graduates. Brand manager roles at large firms usually prefer an MBA. Decide based on the kind of marketing role you want."},
          {"q": "CAT, XAT or CMAT?", "a": "CAT for IIMs and many top schools, XAT for XLRI and others, and CMAT for many AICTE-approved institutes. Many students take more than one test to widen their options. Check which tests your target institutes accept."}],
    related_items=[related("mba-finance-manager", "MBA — Finance Manager", "Other track"), related("mba-operations-manager", "MBA — Operations Manager", "Other track"), related("mba-hr-manager", "MBA — HR Manager", "Other track")],
    institutes=[IIMA, IIMB, FMS, XLRI, CMAT],
    sources=[source("IIM Ahmedabad — PGP 2027-29 admission policy", "https://www.iima.ac.in/sites/default/files/2026-09/AdmissionProcedure_PGP_1109_2026.pdf", "Eligibility and process.")],
    extra_sections=_extra([["Excel / dashboards", "Sales and brand data"], ["Research tools", "Consumer insight"], ["Presentation tools", "Plans and reviews"], ["Digital ad platforms", "Campaigns"]],
                          ["Review sales and share data", "Agency briefing", "Campaign review", "Cross-team meeting with sales and supply", "Plan the next launch"],
                          ["Why marketing?", "How would you launch a product in a tier-2 city?", "Explain the 4 Ps with an example.", "How do you measure a campaign?"]),
)

FIN = _lm(
    "mba-finance-manager", "MBA — Finance Manager", "Finance Manager", "How to become a Finance Manager (MBA track)",
    "A finance manager plans and controls a company's money (budgets, funding, investments, risk and reporting) or works in banking, investment and advisory roles. The usual route is a graduation followed by an MBA in Finance through CAT, XAT or CMAT. CA and CFA are strong alternatives or add-ons to the MBA.", MBA,
    authority="Hired by corporates, banks, investment firms and consulting", icon="Briefcase", color="#0EA5E9", exam_heading="Admission and placement process",
    duties=["Budgeting and forecasting", "Financial analysis and reporting", "Working capital and treasury", "Investment and funding decisions", "Risk management", "Work with auditors and leadership"],
    postings=["Corporates (FP&A, treasury), banks, NBFCs, investment banking, consulting"],
    facts=[fact("Education", "Graduation + MBA (Finance)"), fact("Main entrance", "CAT; also XAT, CMAT"), fact("Core skills", "Accounting, valuation, Excel, markets"),
           fact("Helpful extras", "CFA, NISM certifications"), fact("Typical entry", "Analyst / management trainee")],
    levels=[["MBA student", "Finance core + electives + internship"], ["Entry", "Analyst roles"], ["Manager", "Own budgets, funding or portfolios"]],
    steps=[step("Graduate with good marks", "3–4 years", "BCom, BBA, Economics and engineering are common backgrounds. IIMs need 50% in graduation (45% for SC/ST/PwD). Strong accounting basics from your degree make the MBA much easier."), step("Prepare for CAT/XAT/CMAT", "6–12 months", "Spend 6–12 months on mock tests and sectional practice. Focus extra time on your weakest section. Review each mock carefully to understand your mistakes."),
           step("Clear WAT/GD and interviews", "Jan–Apr", "Know finance basics and your own profile well. Interviewers often ask why you want finance and test simple concepts. Read business news regularly so you can discuss current topics."), step("Finance electives", "MBA year 2", "Choose corporate finance, valuation, markets and risk electives in the second year. These build the skills used in analyst and finance manager roles. Practise Excel modelling alongside your courses."),
           step("Finance internship", "Summer", "Intern at a bank, corporate or advisory firm in the summer. Internships give real experience and can lead to job offers. Ignoring internships is a common mistake."), step("Add CFA/NISM", "Optional", "This step is optional, but it strengthens your profile for investment roles. CFA builds deep valuation and portfolio knowledge, and NISM certifications are needed for certain securities-market roles. Choose based on the role you are targeting.")],
    hiring=_mba_hiring("finance"),
    checklist=["Strong accounting and Excel.", "You can value a company.", "You did a finance internship.", "You follow markets and the economy."],
    timeline=[("Graduation", "3–4 years"), ("Entrance prep", "6–12 months"), ("MBA", "2 years"), ("Placement", "Final year")],
    prep=[{"phase": "Entrance", "duration": "6–12 months", "focus": ["CAT/XAT mocks"]}, {"phase": "MBA", "duration": "2 years", "focus": ["Valuation", "Internship", "CFA Level I (optional)"]}],
    resources=[{"label": "IIM Ahmedabad admissions", "url": "https://www.iima.ac.in/academics/mba/admissions", "note": "Eligibility and process."}],
    ladder=[["Start", "Analyst / Management Trainee", "0–3 years", "Analysis"], ["Mid", "Finance Manager", "3–7 years", "Budgets and teams"],
            ["Senior", "Finance Controller / Head of FP&A", "7–12 years", "Function"], ["Top", "CFO", "12+ years", "Strategy"]],
    special=["CA and CFA are strong alternatives or add-ons to an MBA in finance."],
    mistakes=["Weak accounting base.", "No Excel modelling practice.", "Ignoring internships."],
    faqs=[{"q": "MBA Finance or CA?", "a": "CA is deep in accounting/audit/tax; MBA Finance is broader with management. Many do both."},
          {"q": "Is CFA useful with MBA?", "a": "Yes, especially for investment and research roles. You can take CFA Level I during your MBA if you have the time. It shows a deep commitment to finance."},
          {"q": "Do engineers do MBA Finance?", "a": "Yes, many do, but they should strengthen accounting basics first. Engineers often bring strong quantitative skills. Practise financial statements and Excel before the MBA starts."}],
    related_items=[related("mba-marketing-manager", "MBA — Marketing Manager", "Other track"), related("corporate-lawyer", "Corporate Lawyer", "Deals"), related("mba-operations-manager", "MBA — Operations Manager", "Other track")],
    institutes=[IIMA, FMS, XLRI, CMAT, CFA],
    sources=[source("IIM Ahmedabad — PGP 2027-29 admission policy", "https://www.iima.ac.in/sites/default/files/2026-09/AdmissionProcedure_PGP_1109_2026.pdf", "Eligibility and process.")],
    extra_sections=_extra([["Excel", "Models and budgets"], ["ERP (SAP/Oracle)", "Data"], ["Bloomberg/market data (firm-provided)", "Markets"], ["PowerPoint", "Board packs"]],
                          ["Review cash and budgets", "Variance analysis", "Funding/bank discussions", "Prepare management reports"],
                          ["Walk me through a DCF.", "How do you manage working capital?", "Explain WACC.", "What drives a company's valuation?"]),
)

HR = _lm(
    "mba-hr-manager", "MBA — HR Manager", "HR Manager", "How to become an HR Manager (MBA track)",
    "An HR manager hires, develops and retains people, covering recruitment, performance, pay, policies, labour law compliance and employee relations. Common routes are an MBA in HR through CAT or XAT, or the MA in HRM & LR at TISS. HR is not only hiring; it also needs labour law knowledge and data skills.", MBA,
    authority="Hired by companies across industries, consulting firms and HR-tech", icon="Briefcase", color="#0EA5E9", exam_heading="Admission and placement process",
    duties=["Workforce planning and recruitment", "Onboarding and training", "Performance and rewards", "HR policies and labour-law compliance", "Employee relations", "HR analytics"],
    postings=["Manufacturing, IT, BFSI, FMCG, consulting and HR-tech"],
    facts=[fact("Education", "Graduation + MBA (HR)"), fact("Entrances", "CAT, XAT (XLRI HRM), TISS route for MA HRM&LR"), fact("Core skills", "People skills, labour law, analytics"),
           fact("Certification", "SHRM-CP (optional)"), fact("Typical entry", "HR executive / management trainee")],
    levels=[["MBA student", "HR core + labour law + internship"], ["Entry", "Recruitment, HR operations"], ["Manager", "HR business partner for a unit"]],
    steps=[step("Graduate", "3–4 years", "Any stream works, though psychology and social sciences help. Keep good marks, since B-schools check academics. Build people and communication skills through college activities."), step("Prepare for CAT/XAT", "6–12 months", "Spend 6–12 months on mock tests and sectional practice. XAT is the entrance for XLRI's HRM programme, while CAT is used by IIMs and many other schools. Review every mock to fix your weak areas."),
           step("Clear interviews", "Jan–Apr", "Show people skills and clarity about why you want HR. Give real examples of working with people, such as leading a team or resolving a conflict. Read about current workplace and labour topics before interviews."), step("HR electives", "MBA year 2", "Choose labour law, compensation, organisational behaviour (OB) and analytics electives. India's four Labour Codes consolidated older labour laws, so learn the current framework. Do not skip analytics, because HR teams use data for most decisions."),
           step("HR internship", "Summer", "Do an HR internship in recruitment, L&D or HR analytics. Real projects give you examples to discuss during placements. Aim for a project with a clear, measurable outcome."), step("Get placed", "After MBA", "Join an HR role through campus placements after the MBA. Early roles usually involve recruitment and HR operations. You can add the SHRM-CP certification later for global HR roles.")],
    hiring=_mba_hiring("HR"),
    checklist=["You understand labour codes and HR basics.", "You can run a recruitment process.", "You did an HR internship.", "You use Excel/HR analytics."],
    timeline=[("Graduation", "3–4 years"), ("Entrance prep", "6–12 months"), ("MBA", "2 years"), ("Placement", "Final year")],
    prep=[{"phase": "Entrance", "duration": "6–12 months", "focus": ["CAT/XAT mocks"]}, {"phase": "MBA", "duration": "2 years", "focus": ["Labour law", "Internship", "Analytics"]}],
    resources=[{"label": "SHRM eligibility", "url": "https://www.shrm.org/credentials/certification/eligibility-criteria", "note": "Global HR certification."}],
    ladder=[["Start", "HR Executive / Management Trainee", "0–3 years", "Operations"], ["Mid", "HR Manager / HRBP", "3–7 years", "Business unit"],
            ["Senior", "Senior HRBP / HR Head", "7–12 years", "Function"], ["Top", "CHRO", "12+ years", "People strategy"]],
    special=["India's four Labour Codes consolidated older labour laws — learn the current framework."],
    mistakes=["Thinking HR is only hiring.", "Ignoring labour law.", "No data skills."],
    faqs=[{"q": "Which entrance for HR?", "a": "CAT for IIMs and many schools, XAT for XLRI's HRM, and TISS's current notice for the MA HRM&LR. Each institute has its own selection process after the test. Applying to more than one widens your options."},
          {"q": "Is SHRM needed?", "a": "It is optional, but it helps for global HR roles. SHRM says no HR degree or title is required to apply. Check SHRM's current eligibility page before you register."},
          {"q": "Can freshers get HR jobs?", "a": "Yes, through campus placements and HR executive roles. Freshers usually start in recruitment and HR operations. An HR internship makes your profile much stronger."}],
    related_items=[related("mba-operations-manager", "MBA — Operations Manager", "Other track"), related("lawyer-advocate", "Lawyer / Advocate", "Labour law"), related("mba-marketing-manager", "MBA — Marketing Manager", "Other track")],
    institutes=[XLRI, TISS, IIMA, SHRM],
    sources=[source("TISS admissions", "https://admissions.tiss.ac.in/", "MA HRM&LR admission."), source("XAT", "https://xatonline.in/", "XLRI entrance.")],
    extra_sections=_extra([["HRMS software", "Employee records"], ["Applicant tracking system", "Hiring"], ["Excel / HR analytics", "Reports"], ["Labour code texts", "Compliance"]],
                          ["Interviews and offers", "Employee queries", "Performance/rewards work", "Policy and compliance checks", "Manager meetings"],
                          ["Why HR?", "How do you handle a conflict between employees?", "What is attrition and how do you reduce it?", "Explain a labour code you know."]),
)

OPS = _lm(
    "mba-operations-manager", "MBA — Operations Manager", "Operations Manager", "How to become an Operations Manager (MBA track)",
    "An operations manager makes sure products and services are delivered efficiently, covering planning, supply chain, quality, processes and costs. Many come from engineering, but any graduate can enter through an MBA via CAT, XAT or CMAT. Operations roles can involve plant or warehouse postings and shift work.", MBA,
    authority="Hired by manufacturing, e-commerce, logistics, consulting and services companies", icon="Briefcase", color="#0EA5E9", exam_heading="Admission and placement process",
    duties=["Plan production or service capacity", "Manage supply chain and inventory", "Improve processes (lean, Six Sigma)", "Track quality and costs", "Work with vendors", "Lead operations teams"],
    postings=["Manufacturing, e-commerce, logistics, quick commerce, consulting, healthcare"],
    facts=[fact("Education", "Graduation + MBA (Operations)"), fact("Main entrance", "CAT; also XAT, CMAT"), fact("Core skills", "Process thinking, data, supply chain"),
           fact("Certifications", "ASCM CSCP, Six Sigma (optional)"), fact("Common background", "Engineering")],
    levels=[["MBA student", "Ops core + supply chain + internship"], ["Entry", "Supply chain / ops analyst"], ["Manager", "Own a plant, warehouse or process"]],
    steps=[step("Graduate", "3–4 years", "Engineering is common, but any stream works for MBA entry. Good marks help with B-school shortlisting. Learn Excel and basic data skills during college."), step("Prepare for CAT/XAT/CMAT", "6–12 months", "Spend 6–12 months on mock tests and sectional practice. Analyse each mock to find patterns in your mistakes. Steady practice works better than last-minute cramming."),
           step("Clear interviews", "Jan–Apr", "Show process and problem-solving thinking. Use examples from college projects or work where you improved something. Interviewers like structured, practical answers."), step("Ops electives", "MBA year 2", "Choose supply chain, analytics, quality and project management electives in the second year. These cover the core tools operations managers use every day. Practise process mapping and inventory problems."),
           step("Ops internship", "Summer", "Do a plant, warehouse or supply-chain project during your summer internship. Avoiding shop-floor exposure is a common mistake, so take it when you can. Measure the impact of your project with clear numbers."), step("Get placed; add certifications", "After MBA", "Join an operations role through placements after the MBA. Later, you can add certifications such as ASCM CSCP or Six Sigma. These help as you move into senior supply chain roles.")],
    hiring=_mba_hiring("operations"),
    checklist=["You can map and improve a process.", "You understand inventory and supply chain.", "You use Excel/analytics.", "You did an ops internship."],
    timeline=[("Graduation", "3–4 years"), ("Entrance prep", "6–12 months"), ("MBA", "2 years"), ("Placement", "Final year")],
    prep=[{"phase": "Entrance", "duration": "6–12 months", "focus": ["CAT mocks"]}, {"phase": "MBA", "duration": "2 years", "focus": ["Supply chain", "Analytics", "Internship"]}],
    resources=[{"label": "NPTEL operations courses", "url": "https://nptel.ac.in/", "note": "Free IIT courses."},
               {"label": "ASCM CSCP", "url": "https://www.ascm.org/learning-development/certifications-credentials/cscp/", "note": "Supply chain certification."}],
    ladder=[["Start", "Operations / Supply Chain Analyst", "0–3 years", "Analysis"], ["Mid", "Operations Manager", "3–7 years", "Sites and teams"],
            ["Senior", "Head of Operations / Supply Chain", "7–12 years", "Network"], ["Top", "COO", "12+ years", "Strategy"]],
    special=["Operations roles can involve plant/warehouse postings and shift work."],
    mistakes=["Ignoring data skills.", "Avoiding shop-floor exposure.", "Weak communication with vendors and teams."],
    faqs=[{"q": "Is engineering required?", "a": "No, but many operations MBAs are engineers; any graduate can enter through CAT, XAT or CMAT. Non-engineers should build comfort with numbers and processes. Excel and analytics skills help everyone."},
          {"q": "Are certifications needed?", "a": "They are optional; ASCM CSCP or Six Sigma help later in your career. You do not need them for your first operations job. Focus first on experience and data skills."},
          {"q": "Which industries hire most?", "a": "Manufacturing, e-commerce, logistics and consulting hire the most. Quick commerce and healthcare also hire operations managers. Each industry has its own pace and type of work."}],
    related_items=[related("mba-finance-manager", "MBA — Finance Manager", "Other track"), related("mba-marketing-manager", "MBA — Marketing Manager", "Other track"), related("mba-hr-manager", "MBA — HR Manager", "Other track")],
    institutes=[IIMA, IIMB, CMAT, ASCM, NPTEL],
    sources=[source("IIM Ahmedabad — PGP 2027-29 admission policy", "https://www.iima.ac.in/sites/default/files/2026-09/AdmissionProcedure_PGP_1109_2026.pdf", "Eligibility and process.")],
    extra_sections=_extra([["Excel / analytics", "Planning"], ["ERP (SAP/Oracle)", "Inventory and orders"], ["WMS/TMS", "Warehouse and transport"], ["Lean/Six Sigma tools", "Process improvement"]],
                          ["Daily production/dispatch review", "Fix bottlenecks", "Vendor follow-ups", "Quality checks", "Cost review"],
                          ["How would you reduce delivery time?", "What is safety stock?", "Explain a process you improved.", "How do you handle a supplier delay?"]),
)

GUIDES = [LAWYER, CORP, JUDGE, MKT, FIN, HR, OPS]
_BY_KEY = {slugify(k): g for g in GUIDES for k in (g["slug"], g["title"])}


def law_mgmt_guide(value):
    g = _BY_KEY.get(slugify(value or ""))
    return deepcopy(g) if g else None
