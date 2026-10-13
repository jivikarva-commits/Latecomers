"""Healthcare — beginner guides for medical and allied careers.

Facts checked on 2026-10-13 against official sources: Indian Nursing Council eligibility criteria; NCAHP curricula
(Physiotherapy, DMLT, Medical Laboratory Sciences, Diploma and BSc MRIT, Nutrition and Dietetics, Health Information
Management) on ncahp.abdm.gov.in; AIIMS NORCET eligibility as reported for NORCET-10; Pharmacy Council of India
(Pharmacy Act registration, D.Pharm/B.Pharm regulations, D.Pharm exit-exam circulars); AAPC CPC and CPB exam pages;
Indian Dietetic Association RD documents. No salary figures are given because there is no official source for them.
"""
from copy import deepcopy

from career_catalog import slugify
from gov_guide_kit import fact, institute, paper, related, source, stage, step
from tech_guides import _guide

BACK = ["/careers-explore?field=healthcare", "← All Healthcare careers"]
GROUP = "Medical & Allied"
AUTHORITY = "Hired by hospitals, clinics, diagnostic labs, pharmacies and healthcare companies"
LABELS = {"nav": {"role": "What you do", "steps": "Start to end", "eligibility": "Education & eligibility", "exam": "Admission, registration & hiring",
                  "passing": "Ready checklist", "calendar": "Timeline", "prepare": "How to prepare", "salary": "Career growth", "faqs": "FAQs",
                  "institutes": "Top institutes", "government-sources": "Sources"},
          "passing": "Ready checklist"}
ELIG = [
    "Healthcare courses must be from institutions recognised by the relevant council (INC, PCI or NCAHP/state councils) — check before taking admission.",
    "Most clinical courses need 10+2 with Physics, Chemistry and Biology, a minimum age of 17 and medical fitness.",
    "Council registration rules are changing under the NCAHP Act, 2021 — follow official notices from NCAHP and your state.",
]


def _hc(slug, title, short, headline, summary, **kw):
    return _guide(slug, title, short, headline, summary, group=GROUP, scope_prefix="Healthcare", back=BACK, icon="Stethoscope", color="#DC2626",
                  category="Healthcare", authority=AUTHORITY, eligibility=ELIG, labels=LABELS, exam_heading="Admission, registration and hiring",
                  test_topics="", interview_topics="", assignment="", **kw)


def _extra(tools, day, questions, earn):
    return [
        {"id": "tools", "nav": "Tools", "heading": "Tools and equipment you will use", "columns": ["Tool / equipment", "Used for"], "rows": tools},
        {"id": "typical-day", "nav": "A typical day", "heading": "A typical day in this job", "items": day},
        {"id": "interview-questions", "nav": "Interview questions", "heading": "Interview questions to practise", "items": questions},
        {"id": "ways-to-earn", "nav": "Where you can work", "heading": "Where you can work", "columns": ["Setting", "What it's like"], "rows": earn},
    ]


def _stages(admission, course, register, hire):
    return [stage("Stage 1 — Admission", admission[0], admission[1], admission[2], admission[3]),
            stage("Stage 2 — Course and internship", course[0], course[1], [], course[2]),
            stage("Stage 3 — Registration / certification", register[0], register[1], [], register[2]),
            stage("Stage 4 — Getting hired", hire[0], hire[1], hire[2], hire[3])]


# ---------- Institutes / official resources ----------
INC = institute("Indian Nursing Council (INC)", "Statutory body (Ministry of Health & Family Welfare)", "https://indiannursingcouncil.org/eligibility-criteria",
                "Recognises nursing institutions and sets eligibility for ANM, GNM, B.Sc., Post Basic B.Sc. and M.Sc. Nursing.",
                "Every nursing aspirant — check that your college is recognised.", mode="Online information")
AIIMS = institute("AIIMS (All India Institutes of Medical Sciences)", "Institutes of National Importance", "https://www.aiimsexams.ac.in/",
                  "B.Sc. Nursing and paramedical courses through AIIMS entrances, and Nursing Officer recruitment through NORCET.",
                  "Students and nurses aiming for central government institutes.", mode="Full-time")
JIPMER = institute("JIPMER, Puducherry", "Institute of National Importance", "https://jipmer.edu.in/",
                   "B.Sc. Nursing and allied health sciences programmes with hospital training.", "Students aiming for central institutes.", mode="Full-time")
PGIMER = institute("PGIMER, Chandigarh", "Institute of National Importance", "https://www.pgimer.edu.in/",
                   "Nursing and allied health/paramedical programmes in a large teaching hospital.", "Students wanting strong clinical exposure.", mode="Full-time")
IGNOU = institute("IGNOU — health and nutrition programmes", "Central open university", "https://www.ignou.ac.in/",
                  "Distance programmes in nursing (for registered nurses), nutrition and health-related subjects.", "Working learners upgrading qualifications.", mode="Distance")
NCAHP = institute("National Commission for Allied and Healthcare Professions (NCAHP)", "Statutory commission under the NCAHP Act, 2021", "https://ncahp.abdm.gov.in/curriculum",
                  "National curricula and standards for allied health professions such as Physiotherapy, MLT, Radiology, Nutrition and Health Information Management.",
                  "Allied-health students — check the official curriculum and duration.", mode="Online information")
SVNIRTAR = institute("SVNIRTAR, Cuttack", "Government national institute (Ministry of Social Justice & Empowerment)", "https://svnirtar.nic.in/",
                     "Bachelor and Master programmes in Physiotherapy, Occupational Therapy and Prosthetics & Orthotics with rehabilitation training.",
                     "Students aiming for rehabilitation-focused physiotherapy.", mode="Full-time")
NILD = institute("NILD, Kolkata", "Government national institute for locomotor disabilities", "https://nild.nic.in/",
                 "Physiotherapy, Occupational Therapy and Prosthetics & Orthotics programmes.", "Students interested in rehabilitation.", mode="Full-time")
HSSC = institute("Healthcare Sector Skill Council", "Sector Skill Council (MSDE)", "https://healthcare-ssc.in/",
                 "NSQF-aligned short courses and certifications for healthcare job roles such as lab, radiology and medical records assistants.",
                 "Learners who want job-oriented skill certificates.", mode="Through affiliated training partners")
AAPC_CPC = institute("AAPC — Certified Professional Coder (CPC)", "Global medical coding certification", "https://www.aapc.com/certifications/cpc",
                     "100 multiple-choice questions in 4 hours; 70% to pass; approved CPT, ICD-10-CM and HCPCS code books. Without 2 years' experience you get CPC-A (Apprentice).",
                     "Medical coders in Indian RCM/coding companies serving US healthcare.", mode="Online or test centre")
AAPC_CPB = institute("AAPC — Certified Professional Biller (CPB)", "Global medical billing certification", "https://www.aapc.com/certifications/cpb",
                     "135 multiple-choice questions in 4 hours covering the revenue cycle, payer billing and collections.", "Medical billers and RCM staff.", mode="Online or test centre")
AHIMA = institute("AHIMA certifications", "Health information management body (USA)", "https://www.ahima.org/certification-careers/certifications-overview/",
                  "Coding and health-information credentials such as CCA and CCS.", "Coders working on US health records.", mode="Test centre / online")
PCI = institute("Pharmacy Council of India (PCI)", "Statutory body under the Pharmacy Act, 1948", "https://www.pci.nic.in/",
                "Approves pharmacy institutions and courses (D.Pharm, B.Pharm, Pharm.D, M.Pharm) and issues circulars on registration and the D.Pharm exit exam.",
                "Pharmacy students — check the approved-institution list.", mode="Online information")
NIPER = institute("NIPER, Mohali (and other NIPERs)", "Institute of National Importance (Department of Pharmaceuticals)", "https://www.niper.gov.in/",
                  "M.S.(Pharm), M.Pharm, MBA (Pharm) and PhD through the NIPER joint entrance.", "B.Pharm graduates aiming for industry and research.", mode="Full-time")
NIN = institute("ICMR — National Institute of Nutrition, Hyderabad", "Government research institute", "https://www.nin.res.in/",
                "Nutrition research, dietary guidelines and training programmes.", "Nutrition students and professionals.", mode="Varies")
LADY_IRWIN = institute("Lady Irwin College, University of Delhi", "Public college", "https://ladyirwin.edu.in/",
                       "Undergraduate and postgraduate programmes in Food and Nutrition and allied home-science fields.", "Students (women's college) aiming for nutrition careers.",
                       mode="Full-time")
IDA = institute("Indian Dietetic Association — Registered Dietitian (RD)", "Professional association", "https://idaindia.com/",
                "RD examination and registration for dietitians with a nutrition degree, PG qualification and hospital training.", "Clinical dietitians.", mode="Exam as notified")

# ---------- Guides ----------
NURSE = _hc(
    "nursing-officer-staff-nurse", "Nursing Officer / Staff Nurse", "Nursing", "How to become a Nursing Officer / Staff Nurse",
    "A nurse cares for patients — giving medicines, monitoring health, assisting doctors, educating families — in hospitals, clinics and communities. "
    "Government hospitals call the post Nursing Officer.",
    duties=["Assess and monitor patients", "Give medicines and treatments as prescribed", "Assist in procedures and emergencies", "Maintain records and handover",
            "Infection control and patient safety", "Educate patients and families"],
    postings=["Government and private hospitals, AIIMS and central institutes, armed forces, community health, abroad"],
    facts=[fact("Education", "B.Sc. Nursing / GNM"), fact("Regulator", "Indian Nursing Council + State Nursing Councils"), fact("B.Sc. Nursing", "4 years; 10+2 PCB + English, 45%"),
           fact("Registration", "Registered Nurse & Midwife with State Nursing Council"), fact("Central govt jobs", "AIIMS NORCET (Nursing Officer)"), fact("Shifts", "Day/night rotations")],
    levels=[["Student", "Anatomy, nursing foundations, clinical postings"], ["New nurse", "Ward care, documentation, medication safety"], ["Experienced", "Speciality units (ICU, OT, NICU)"]],
    steps=[step("Choose the course", "After 12th (PCB + English)", "B.Sc. Nursing (4 years) is the main route to become a registered nurse, and GNM is still offered in some states. "
                                                                   "INC requires 10+2 with Physics, Chemistry, Biology and English, with 45% aggregate, for B.Sc. Nursing. "
                                                                   "Check that the college is recognised by INC and your State Nursing Council before you take admission."),
           step("Take the entrance", "Before admission", "Admission is through state or institute entrance exams, and some central institutes use NEET. "
                                                         "Read each institute's prospectus for its exam, dates and seat rules. "
                                                         "Revise your Class 12 Physics, Chemistry and Biology well while you prepare."),
           step("Complete course and clinicals", "4 years", "The course has hospital clinical postings in every year along with theory classes. "
                                                            "Use these postings to practise procedures, documentation and patient communication under supervision. "
                                                            "Clinical confidence helps you in interviews and in your first job."),
           step("Register with the State Nursing Council", "After passing", "After passing, register with your State Nursing Council as a Registered Nurse and Registered Midwife. "
                                                                            "Registration is needed to work as a nurse and to apply for exams such as AIIMS NORCET. "
                                                                            "Keep your registration certificate safe and renew it as your state council requires."),
           step("Apply for jobs", "After registration", "Apply to private hospitals, or prepare for government exams such as AIIMS NORCET for Nursing Officer posts. "
                                                        "NORCET has Prelims and Mains computer-based tests, so start practising in your final year. "
                                                        "Check each notification for the current age limit and eligibility."),
           step("Specialise / study further", "Later", "Later, you can do post-basic diplomas in specialities or an M.Sc. Nursing. "
                                                       "INC requires 55% in your B.Sc. Nursing and 1 year of work experience for M.Sc. Nursing. "
                                                       "Specialising helps you move into units such as ICU, OT or NICU, or into teaching.")],
    hiring=_stages(("Entrance", "Admission to B.Sc. Nursing.", [paper("State/institute entrance or NEET (as applicable)", "Varies", "Varies", "Check the institute's prospectus")], "Merit for a seat."),
                   ("4 years", "Theory + clinical postings.", "Pass all years."), ("After passing", "State Nursing Council registration.", "Registered Nurse & Midwife."),
                   ("Recruitment", "Hospitals and NORCET.", [paper("AIIMS NORCET (for AIIMS Nursing Officer)", "Prelims + Mains (CBT)", "As notified", "GNM needs 2 years' experience in a 50+ bed hospital")], "Selection by merit.")),
    checklist=["Your college is INC/State Council recognised.", "You are registered with the State Nursing Council.", "You are confident with clinical procedures and documentation.", "You meet the age rule for govt exams (NORCET has used 18–30 with relaxations)."],
    timeline=[("B.Sc. Nursing", "4 years"), ("Registration", "After passing"), ("Job / NORCET", "Year 5+")],
    prep=[{"phase": "Course", "duration": "4 years", "focus": ["Clinical skills", "Pharmacology"]}, {"phase": "Jobs", "duration": "Final year+", "focus": ["NORCET practice", "Interviews"]}],
    resources=[{"label": "INC eligibility criteria", "url": "https://indiannursingcouncil.org/eligibility-criteria", "note": "Official eligibility for all nursing courses."}],
    ladder=[["Start", "Staff Nurse / Nursing Officer", "0–5 years", "Ward care"], ["Mid", "Senior Nursing Officer / Charge Nurse", "5–10 years", "Unit lead"],
            ["Senior", "Assistant/Deputy Nursing Superintendent", "10+ years", "Administration"], ["Other", "Nurse educator, specialist nurse, abroad", "Any time", "Varied"]],
    special=["INC has planned to replace GNM with B.Sc. Nursing; GNM admissions still run in some states — check your state before choosing.",
             "Working abroad needs that country's nursing licence exam in addition to Indian registration."],
    mistakes=["Joining an unrecognised college.", "Not registering after passing.", "Ignoring documentation and medication safety."],
    faqs=[{"q": "Can arts/commerce students do B.Sc. Nursing?", "a": "No, INC requires 10+2 with Physics, Chemistry, Biology and English for B.Sc. Nursing. "
                                                                     "GNM, where it is still offered, accepts 10+2 with English and prefers science, as per INC's eligibility criteria. "
                                                                     "Check the INC eligibility page and your state's current rules before choosing."},
          {"q": "What is the minimum age?", "a": "INC sets the minimum age at 17 years on or before 31 December of the admission year. "
                                                 "INC's eligibility criteria give no upper age limit for B.Sc. Nursing. "
                                                 "Government job exams such as NORCET set their own age limits."},
          {"q": "Can GNM nurses apply for AIIMS?", "a": "Yes, NORCET accepts GNM nurses with 2 years' experience in a hospital of at least 50 beds, along with registration. "
                                                        "B.Sc. Nursing graduates do not need this experience to apply. "
                                                        "Always confirm the rules in the current NORCET notification."}],
    related_items=[related("physiotherapist", "Physiotherapist", "Allied health"), related("lab-technician-dmlt", "Lab Technician", "Diagnostics"), related("pharmacist", "Pharmacist", "Medicines")],
    institutes=[INC, AIIMS, JIPMER, PGIMER, IGNOU],
    sources=[source("Indian Nursing Council — eligibility criteria", "https://indiannursingcouncil.org/eligibility-criteria", "B.Sc., GNM, Post Basic and M.Sc. Nursing."),
             source("AIIMS exams", "https://www.aiimsexams.ac.in/", "NORCET notices.")],
    extra_sections=_extra([["Vital-signs monitors", "Patient monitoring"], ["Infusion pumps", "IV medicines"], ["Hospital information system", "Records"], ["PPE", "Infection control"]],
                          ["Handover from previous shift", "Medicine rounds", "Assist doctors' rounds and procedures", "Update charts", "Patient and family education"],
                          ["How do you prevent medication errors?", "What do you do if a patient's oxygen drops?", "Explain infection-control steps.", "How do you handle a difficult family?"],
                          [["Government hospital", "Stable job via recruitment exams"], ["Private hospital", "Faster hiring, varied units"], ["Community health", "Public health programmes"], ["Abroad", "Needs foreign licensing exam"]]),
)

PHYSIO = _hc(
    "physiotherapist", "Physiotherapist", "Physiotherapy", "How to become a Physiotherapist",
    "A physiotherapist helps people move better and recover from injury, surgery, stroke or chronic pain using exercise, manual therapy and electrotherapy. "
    "They assess how a person moves, plan treatment and track progress over many sessions. "
    "Physiotherapists work in hospitals, rehab centres, sports teams, clinics, home care and their own practice.",
    duties=["Assess movement and function", "Plan exercise and treatment programmes", "Use manual therapy and electrotherapy", "Rehabilitate after surgery, injury or stroke",
            "Educate patients on posture and prevention", "Track progress"],
    postings=["Hospitals, rehab centres, sports teams, clinics, home care, own practice"],
    facts=[fact("Education", "BPT"), fact("Course (NCAHP curriculum)", "4 years + 1-year internship"), fact("Eligibility", "10+2 PCB, 50% aggregate, NEET appeared, age 17+"),
           fact("Regulator", "NCAHP (Act 2021)"), fact("Specialise", "MPT — ortho, neuro, sports, cardio"), fact("Own clinic", "Possible after experience")],
    levels=[["Student", "Anatomy, physiology, exercise therapy"], ["Intern", "Supervised patient care"], ["Practitioner", "Independent assessment and treatment plans"]],
    steps=[step("10+2 with PCB (50%)", "School", "Take Physics, Chemistry and Biology in Class 11 and 12. "
                                                 "The NCAHP physiotherapy curriculum requires 50% aggregate in PCB. "
                                                 "Strong Biology also makes anatomy and physiology easier during the course."),
           step("Take NEET and counselling", "After 12th", "The NCAHP curriculum lists appearing in NEET as a condition for BPT admission. "
                                                           "Seats are filled through state or university counselling, so check your state's notice for the current year. "
                                                           "Apply on time and keep your documents ready for counselling."),
           step("Complete BPT", "4 years", "BPT has 4 years of theory and clinical training in subjects such as anatomy, physiology and exercise therapy. "
                                           "Practise assessment skills carefully, because every treatment plan starts with a good assessment. "
                                           "Choose a college that follows the NCAHP curriculum."),
           step("1-year internship", "After 4 years", "After 4 years of study, you complete a 1-year internship with rotations in ortho, neuro, cardio and paediatrics. "
                                                      "You treat real patients under supervision and learn how hospital departments work. "
                                                      "Use this year to find the area you want to specialise in."),
           step("Register", "As per NCAHP/state rules", "Register as a physiotherapist as per NCAHP or your state's rules. "
                                                        "Registration rules are changing under the NCAHP Act, 2021, so follow official notices closely. "
                                                        "Keep your degree, internship and registration documents ready for jobs."),
           step("Work or do MPT", "After BPT", "Work in hospitals, sports teams, rehab centres or home care, or do an MPT to specialise. "
                                               "MPT options include ortho, neuro, sports and cardio physiotherapy. "
                                               "Many physiotherapists open their own clinic after gaining experience.")],
    hiring=_stages(("NEET + counselling", "Admission to BPT.", [paper("NEET (UG)", "As per NTA", "As per NTA", "Check your state's BPT counselling")], "Seat by merit."),
                   ("5 years", "4 years study + 1-year internship.", "Pass all exams and internship."), ("After BPT", "Registration under NCAHP/state rules.", "Registered physiotherapist."),
                   ("Recruitment", "Hospitals, clinics, sports bodies.", [paper("Interview + practical assessment", "Practical", "—", "Show assessment skills")], "Offer.")),
    checklist=["Your BPT college follows the NCAHP curriculum.", "You completed the internship.", "You can assess and plan treatment.", "You follow registration rules."],
    timeline=[("BPT", "4 years"), ("Internship", "1 year"), ("Job / MPT", "After")],
    prep=[{"phase": "Admission", "duration": "Class 12", "focus": ["PCB 50%", "NEET"]}, {"phase": "Course", "duration": "5 years", "focus": ["Clinical skills", "Internship"]}],
    resources=[{"label": "NCAHP curricula", "url": "https://ncahp.abdm.gov.in/curriculum", "note": "Official physiotherapy curriculum."}],
    ladder=[["Start", "Physiotherapist", "0–3 years", "Patient care"], ["Mid", "Senior / Specialist Physiotherapist", "3–8 years", "Speciality"],
            ["Senior", "Head of Physiotherapy / clinic owner", "8+ years", "Department or practice"]],
    special=["Some older college pages still show BPT as 4.5 years; NCAHP's curriculum lists 4 years plus a 1-year internship — confirm with your college."],
    mistakes=["Choosing a college not following NCAHP standards.", "Skipping internship learning.", "Weak communication with patients."],
    faqs=[{"q": "Is NEET needed for BPT?", "a": "NCAHP's physiotherapy curriculum lists appearing in NEET as a condition for admission. "
                                                "Rules can differ by state and university, so check the official notice for the current admission year. "
                                                "Do not assume last year's rules still apply."},
          {"q": "How long is BPT?", "a": "Under the NCAHP curriculum, BPT is 4 years of study plus a 1-year internship. "
                                         "Some older college pages still show 4.5 years, so confirm with your college. "
                                         "Plan for five years in total before you start working."},
          {"q": "Can I open my own clinic?", "a": "Many physiotherapists open their own clinic after gaining experience. "
                                                  "You must follow the registration rules that apply in your state. "
                                                  "Working in hospitals first helps you build skills, contacts and patient trust."}],
    related_items=[related("nursing-officer-staff-nurse", "Nursing Officer", "Patient care"), related("nutritionist-dietitian", "Nutritionist / Dietitian", "Wellness"), related("radiology-technician", "Radiology Technician", "Allied health")],
    institutes=[NCAHP, SVNIRTAR, NILD, JIPMER],
    sources=[source("NCAHP — Physiotherapy curriculum", "https://ncahp.abdm.gov.in/curriculum", "Eligibility (10+2 PCB 50%, NEET) and duration (4 years + 1-year internship).")],
    extra_sections=_extra([["Exercise equipment", "Rehab"], ["Electrotherapy units (TENS, ultrasound)", "Pain management"], ["Goniometer", "Range of motion"], ["Treatment notes", "Records"]],
                          ["Assess new patients", "Run treatment sessions", "Group exercise classes", "Update notes and plans"],
                          ["How do you assess low back pain?", "Rehab plan after ACL surgery?", "When is electrotherapy contraindicated?", "How do you motivate patients?"],
                          [["Hospital", "Post-surgery and ICU rehab"], ["Sports", "Teams and academies"], ["Clinic / home care", "Outpatient and home visits"], ["Own practice", "After experience"]]),
)

CODER = _hc(
    "medical-coder", "Medical Coder", "Medical Coding", "How to become a Medical Coder",
    "A medical coder converts doctors' notes into standard codes (ICD-10-CM, CPT, HCPCS) used for insurance claims — a large job market in India serving US healthcare. "
    "It is a desk job that needs anatomy knowledge, accuracy and strict data privacy. "
    "Most companies hire life-science or health graduates, and the AAPC CPC certificate strengthens your profile.",
    duties=["Read medical records", "Assign ICD-10-CM, CPT and HCPCS codes", "Follow coding guidelines and payer rules", "Meet accuracy and productivity targets",
            "Query physicians when notes are unclear", "Protect patient data"],
    postings=["Medical coding and RCM companies, hospitals, health-tech"],
    facts=[fact("Education", "Life-science/health graduation"), fact("Certification", "AAPC CPC (100 Qs, 4 hrs, 70%)"), fact("Without 2 yrs experience", "CPC-A (Apprentice)"),
           fact("Core skills", "Anatomy, terminology, guidelines, accuracy"), fact("Work", "Desk job; often night/US shifts"), fact("Data", "Strict privacy rules")],
    levels=[["Beginner", "Anatomy, terminology, code-book navigation"], ["Certified", "CPC passed; accurate coding"], ["Specialist", "Speciality coding, audit, QA"]],
    steps=[step("Learn anatomy and terminology", "Months 1–2", "Learn the body systems and the common medical terms used in doctors' notes. "
                                                               "You cannot code correctly if you do not understand what the doctor wrote. "
                                                               "Make your own glossary of terms and revise it daily."),
           step("Learn code sets", "Months 2–4", "Learn how ICD-10-CM, CPT and HCPCS codes work, along with the official coding guidelines. "
                                                 "Focus on understanding the guidelines instead of memorising codes. "
                                                 "The guidelines tell you which code is correct in each situation."),
           step("Practise real charts", "Months 3–5", "Practise coding sample medical charts under timed conditions. "
                                                      "This builds the speed and accuracy that coding companies measure every day. "
                                                      "Review every mistake and find the guideline that explains the right answer."),
           step("Pass the CPC", "Months 4–6", "The AAPC CPC exam has 100 questions in 4 hours, and you need 70% to pass. "
                                              "Practise with mock tests and learn to find codes quickly in the approved code books. "
                                              "If you do not have 2 years' experience, you will first get the CPC-A (Apprentice) designation."),
           step("Join a coding company", "After CPC", "Apply for trainee or coder roles at medical coding and RCM companies, hospitals and health-tech firms. "
                                                      "Expect a coding test and an interview that check your speed and accuracy. "
                                                      "Many coding jobs have US-time shifts, so be ready for night work."),
           step("Specialise", "Later", "With experience, you can specialise in areas such as surgery, E/M, risk adjustment or audit. "
                                       "Specialists and auditors handle more complex charts and quality checks. "
                                       "Keep your code books current, because coding standards update every year.")],
    hiring=_stages(("Graduation", "A life-science/health degree is preferred by most companies.", [], "Degree completed."),
                   ("Months 1–5", "Anatomy, terminology, code sets.", "Coding accuracy in practice."), ("CPC exam", "AAPC certification.", "Pass with 70% (CPC-A until experience requirement is met)."),
                   ("Recruitment", "Coding/RCM companies.", [paper("Coding test + interview", "MCQ/charts", "30–90 min", "Speed and accuracy")], "Offer as coder/trainee.")),
    checklist=["You know anatomy and terminology.", "You can navigate code books fast.", "You passed or are preparing for CPC.", "You understand data privacy."],
    timeline=[("Basics", "Months 1–2"), ("Code sets", "Months 2–4"), ("CPC", "Months 4–6"), ("Job", "Month 6+")],
    prep=[{"phase": "Learn", "duration": "Months 1–4", "focus": ["Anatomy", "Guidelines"]}, {"phase": "Certify", "duration": "Months 4–6", "focus": ["CPC mocks"]}],
    resources=[{"label": "AAPC CPC", "url": "https://www.aapc.com/certifications/cpc", "note": "Official exam details."}],
    ladder=[["Start", "Trainee / Medical Coder", "0–2 years", "Coding"], ["Mid", "Senior Coder / QA Analyst", "2–5 years", "Quality"], ["Senior", "Team Lead / Coding Auditor / Manager", "5+ years", "Teams and audits"]],
    special=["Many coding jobs have US-time shifts.", "Coding standards update every year — keep current code books."],
    mistakes=["Skipping anatomy.", "Memorising codes instead of learning guidelines.", "Ignoring data privacy."],
    faqs=[{"q": "Is a degree needed?", "a": "Most companies ask for a life-science or health graduation for coding jobs. "
                                            "CPC certification strengthens your profile and helps you grow faster. "
                                            "Check each company's job post for its exact education rule."},
          {"q": "What is CPC-A?", "a": "CPC-A is the apprentice designation given to people who pass the CPC exam without the required 2 years' experience. "
                                       "You can work as a coder with it while you gain experience. "
                                       "Once you meet AAPC's experience rules, you can apply to have the apprentice status removed."},
          {"q": "Can freshers join?", "a": "Yes, many companies hire trainee coders and train them. "
                                           "You still need good anatomy knowledge and must clear the company's coding test. "
                                           "Starting CPC preparation early improves your chances."}],
    related_items=[related("medical-biller", "Medical Biller", "Revenue cycle"), related("pharmacist", "Pharmacist", "Life-science route"), related("lab-technician-dmlt", "Lab Technician", "Allied health")],
    institutes=[AAPC_CPC, AHIMA, NCAHP, HSSC],
    sources=[source("AAPC — Taking the CPC exam", "https://aapc.com/certifications/cpc/taking-the-cpc-exam", "100 questions, 4 hours, 70% pass."),
             source("NCAHP — Health Information Management curriculum", "https://ncahp.abdm.gov.in/curriculum", "Diploma 2.5 years / BSc 4 years.")],
    extra_sections=_extra([["CPT / ICD-10-CM / HCPCS books", "Coding"], ["Encoder software", "Code lookup"], ["EHR access", "Charts"], ["QA tools", "Audit"]],
                          ["Log in for the shift", "Code assigned charts", "Check edits and queries", "QA feedback", "Meet daily targets"],
                          ["What is ICD-10-CM vs CPT?", "Explain a modifier.", "How do you code an unclear note?", "What is HIPAA-style data privacy?"],
                          [["Coding company", "Large teams, US projects"], ["Hospital", "Medical records/coding department"], ["Remote", "Possible after experience"]]),
)

BILLER = _hc(
    "medical-biller", "Medical Biller", "Medical Billing", "How to become a Medical Biller",
    "A medical biller prepares and submits insurance claims, follows up on denials and collects payments — the revenue cycle (RCM) of hospitals and US healthcare providers. "
    "It is a desk job that needs clear communication, Excel skills and attention to detail. "
    "Many roles serve US processes, so night shifts are common.",
    duties=["Create and submit claims", "Check eligibility and authorisation", "Post payments", "Work on denials and appeals", "Follow up with insurers", "Report on collections"],
    postings=["RCM companies, hospitals, health-tech, TPAs and insurance desks"],
    facts=[fact("Education", "Graduation"), fact("Certification", "AAPC CPB (135 Qs, 4 hrs)"), fact("Core skills", "Claims, insurance, communication, Excel"),
           fact("Work", "Desk job; often US shifts"), fact("Indian hospitals", "Also need TPA/insurance billing")],
    levels=[["Beginner", "Billing basics and terminology"], ["Intermediate", "Claims, denials, AR follow-up"], ["Senior", "Process improvement and team lead"]],
    steps=[step("Graduate", "3 years", "Complete a graduation, since most billing jobs ask for a degree. "
                                       "Commerce and life-science degrees are common, but most companies accept any graduation. "
                                       "Work on your English communication during college, because many roles involve calls with US insurers."),
           step("Learn RCM basics", "Months 1–2", "Learn how the revenue cycle works, from eligibility checks to claims, payments and denials. "
                                                  "Understand why a claim gets paid, delayed or denied. "
                                                  "This big picture helps you fix problems instead of just following steps."),
           step("Learn codes at a basic level", "Months 2–3", "Learn enough about medical codes to read and check claims. "
                                                              "You do not need to code like a medical coder, but you must be able to spot obvious errors. "
                                                              "This also helps you understand many denial reasons."),
           step("Optional CPB", "Months 3–5", "You can take the AAPC Certified Professional Biller (CPB) exam, which has 135 questions in 4 hours. "
                                              "It is optional, but it proves your knowledge and helps you grow. "
                                              "Practise with mock tests before you book the exam."),
           step("Join an RCM company", "After training", "Apply for AR caller or billing executive roles at RCM companies and hospitals. "
                                                         "Expect a communication test and an interview, often focused on clear English for US calls. "
                                                         "Be ready for night shifts if the process serves US clients."),
           step("Grow", "Later", "With experience, you can move into senior executive, QA, team lead or process roles. "
                                 "Understanding denial patterns and making clear reports in Excel helps you get promoted. "
                                 "Keep learning payer rules, because they change over time.")],
    hiring=_stages(("Graduation", "Most billing jobs ask for a degree.", [], "Degree done."), ("Months 1–3", "RCM training.", "Understand the claim cycle."),
                   ("Optional", "AAPC CPB.", "Pass the CPB exam."), ("Recruitment", "RCM companies and hospitals.", [paper("Communication test + interview", "Voice/written", "30–60 min", "Clear English for US calls")], "Offer.")),
    checklist=["You understand the revenue cycle.", "You can read claims and denials.", "You communicate clearly.", "You can use Excel and billing software."],
    timeline=[("Graduation", "3 years"), ("RCM training", "Months 1–3"), ("CPB (optional)", "Months 3–5"), ("Job", "After")],
    prep=[{"phase": "Learn", "duration": "Months 1–3", "focus": ["RCM", "Communication"]}],
    resources=[{"label": "AAPC CPB", "url": "https://www.aapc.com/certifications/cpb", "note": "Official exam details."}],
    ladder=[["Start", "AR Caller / Billing Executive", "0–2 years", "Claims"], ["Mid", "Senior Executive / QA", "2–5 years", "Quality"], ["Senior", "Team Lead / RCM Manager", "5+ years", "Operations"]],
    special=["Night shifts are common for US-process billing."],
    mistakes=["Weak communication skills.", "Not learning denial reasons.", "Ignoring data privacy."],
    faqs=[{"q": "Coder vs biller?", "a": "Coders read medical records and assign codes, while billers submit claims and follow up on payments. "
                                         "Both work in the revenue cycle and are often in the same company. "
                                         "Coding needs more anatomy knowledge, while billing needs more communication skills."},
          {"q": "Is CPB required?", "a": "CPB is not always required for billing jobs. "
                                         "It helps for growth because it proves your knowledge of the revenue cycle. "
                                         "You can start working first and take the exam later."},
          {"q": "Which degree?", "a": "Most companies accept any graduation for billing roles. "
                                      "Commerce or life-science degrees help because they cover accounts or medical basics. "
                                      "Good English communication matters as much as the degree."}],
    related_items=[related("medical-coder", "Medical Coder", "Coding"), related("pharmacist", "Pharmacist", "Healthcare"), related("nursing-officer-staff-nurse", "Nursing Officer", "Clinical")],
    institutes=[AAPC_CPB, AAPC_CPC, AHIMA, HSSC],
    sources=[source("AAPC — Taking the CPC and CPB exams", "https://aapc.com/certifications/cpc-and-cpb/taking-the-cpc-and-cpb-exams", "CPB format.")],
    extra_sections=_extra([["Billing/practice software", "Claims"], ["Clearinghouse portals", "Submission"], ["Excel", "AR reports"], ["Payer portals", "Status checks"]],
                          ["Review AR list", "Call insurers", "Correct and resubmit denied claims", "Post payments", "Update reports"],
                          ["What is a denial?", "Explain the revenue cycle.", "How do you handle a rude caller?", "What is AR ageing?"],
                          [["RCM company", "Large US processes"], ["Hospital billing", "Insurance/TPA desks"], ["Health-tech", "Billing products"]]),
)

LAB = _hc(
    "lab-technician-dmlt", "Lab Technician / DMLT", "Medical Lab Technology", "How to become a Medical Lab Technician (DMLT / BMLS)",
    "A medical lab technician tests blood, urine and other samples so doctors can diagnose disease — in hospital labs, diagnostic chains and blood banks. "
    "The job needs accuracy, quality control and strict biosafety. "
    "You can enter through a DMLT diploma or a BMLS degree after 10+2 with PCB.",
    duties=["Collect and process samples", "Run tests on analysers", "Follow quality control", "Record and report results", "Maintain equipment", "Follow biosafety rules"],
    postings=["Hospital labs, diagnostic chains, blood banks, research labs"],
    facts=[fact("Education", "DMLT or BMLS"), fact("DMLT (NCAHP)", "2 years incl. 6 months lab posting"), fact("BMLS (NCAHP)", "4 years incl. 1-year internship"),
           fact("Eligibility", "10+2 with PCB"), fact("Core skills", "Accuracy, biosafety, analysers"), fact("Skill route", "Healthcare SSC certificates")],
    levels=[["Student", "Biochemistry, pathology, microbiology basics"], ["Technician", "Run tests with QC"], ["Senior", "Supervise lab sections"]],
    steps=[step("10+2 with PCB", "School", "Take Physics, Chemistry and Biology in Class 11 and 12. "
                                           "NCAHP curricula require 10+2 with PCB for both DMLT and BMLS. "
                                           "Biology and Chemistry are the base of the lab subjects you will study."),
           step("Choose DMLT or BMLS", "After 12th", "DMLT is a 2-year diploma, while BMLS is a 4-year degree that includes a 1-year internship. "
                                                     "DMLT gets you working faster, while BMLS opens more senior and government roles. "
                                                     "Check that the course follows NCAHP standards before taking admission."),
           step("Complete training", "During course", "Your course includes a clinical lab posting or internship, where you work with real samples. "
                                                      "Learn sample handling, analysers, quality control and biosafety carefully. "
                                                      "Mistakes in the lab can affect a patient's diagnosis, so build careful habits early."),
           step("Register as per rules", "After course", "After the course, register as per NCAHP or state rules wherever registration applies. "
                                                         "Registration rules are changing under the NCAHP Act, 2021, so follow official notices. "
                                                         "Keep your certificates ready for job applications."),
           step("Join a lab", "After", "Apply to hospital labs, diagnostic chains, blood banks or research labs. "
                                       "Expect a practical test and an interview on quality control and biosafety. "
                                       "Hospital labs run 24x7, so be ready for shift work."),
           step("Upgrade", "Later", "DMLT holders can upgrade through a BMLS or other degree programmes as per university rules. "
                                    "An MSc can lead to senior, quality or lab manager roles. "
                                    "Keep learning new analysers and quality systems as you grow.")],
    hiring=_stages(("Admission", "DMLT/BMLS admission.", [paper("Merit / entrance", "Varies", "Varies", "BMLS can use NEET-appeared candidates with 50% in 10+2 science")], "Seat."),
                   ("2–4 years", "Course + lab posting.", "Pass all exams."), ("After course", "Registration as per NCAHP/state rules.", "Registered where applicable."),
                   ("Recruitment", "Labs and hospitals.", [paper("Practical + interview", "Practical", "—", "Know QC and biosafety")], "Offer.")),
    checklist=["Your course follows NCAHP standards.", "You can run common tests with QC.", "You follow biosafety.", "You document results accurately."],
    timeline=[("DMLT", "2 years"), ("or BMLS", "4 years"), ("Job", "After")],
    prep=[{"phase": "Course", "duration": "2–4 years", "focus": ["Practical skills", "QC"]}],
    resources=[{"label": "NCAHP curricula", "url": "https://ncahp.abdm.gov.in/curriculum", "note": "DMLT and MLS curricula."}],
    ladder=[["Start", "Lab Technician", "0–3 years", "Testing"], ["Mid", "Senior Technician / Section in-charge", "3–8 years", "Supervision"], ["Senior", "Lab Manager / Quality Manager", "8+ years", "Lab operations"]],
    special=["Biosafety and quality control are core — accredited labs follow strict procedures."],
    mistakes=["Sample labelling errors.", "Skipping QC.", "Poor biosafety."],
    faqs=[{"q": "DMLT or BMLS?", "a": "DMLT is faster at 2 years, while BMLS takes 4 years. "
                                      "BMLS opens more senior and government roles. "
                                      "Choose DMLT if you need to start working sooner, and upgrade later if you want."},
          {"q": "Is PCB required?", "a": "Yes, NCAHP curricula require 10+2 with Physics, Chemistry and Biology. "
                                         "Students from other streams cannot join these courses directly. "
                                         "Check the college's admission notice for any minimum marks rules."},
          {"q": "Can DMLT holders upgrade?", "a": "Yes, DMLT holders can upgrade through degree programmes as per university rules. "
                                                  "A degree helps you move into senior and government roles. "
                                                  "Check the admission rules of the university you want to join."}],
    related_items=[related("radiology-technician", "Radiology Technician", "Diagnostics"), related("nursing-officer-staff-nurse", "Nursing Officer", "Clinical"), related("pharmacist", "Pharmacist", "Healthcare")],
    institutes=[NCAHP, AIIMS, PGIMER, HSSC],
    sources=[source("NCAHP — DMLT and MLS curricula", "https://ncahp.abdm.gov.in/curriculum", "Eligibility and duration.")],
    extra_sections=_extra([["Haematology/biochemistry analysers", "Testing"], ["Microscope", "Smears and cultures"], ["Centrifuge", "Sample prep"], ["LIS software", "Reports"]],
                          ["Collect/receive samples", "Run QC", "Process tests", "Validate and report", "Clean and maintain equipment"],
                          ["What is quality control?", "How do you handle a haemolysed sample?", "Explain biosafety levels.", "What is a critical value?"],
                          [["Hospital lab", "24x7 testing"], ["Diagnostic chain", "High volume"], ["Blood bank", "Transfusion services"], ["Research lab", "Projects"]]),
)

RADIO = _hc(
    "radiology-technician", "Radiology Technician", "Radiology", "How to become a Radiology Technician (Radiographer)",
    "A radiology technician operates X-ray, CT and MRI equipment to take medical images safely, positioning patients and following radiation protection rules. "
    "They work closely with radiologists, who read and report the images. "
    "Radiation safety rules are set by the Atomic Energy Regulatory Board (AERB).",
    duties=["Position patients for scans", "Operate X-ray, CT and MRI machines", "Follow radiation safety", "Ensure image quality", "Maintain equipment logs", "Assist radiologists"],
    postings=["Hospitals, diagnostic centres, imaging chains"],
    facts=[fact("Education", "DMRIT or BSc MRIT"), fact("Diploma (NCAHP)", "2.5 years incl. 6 months internship"), fact("Degree (NCAHP)", "4 years incl. 1-year internship"),
           fact("Eligibility", "10+2 PCB; age 17+"), fact("Safety", "Radiation protection (AERB rules)"), fact("Specialise", "CT, MRI, mammography")],
    levels=[["Student", "Anatomy, physics, positioning"], ["Technician", "Routine X-ray/CT"], ["Specialist", "MRI/CT/interventional imaging"]],
    steps=[step("10+2 with PCB", "School", "Take Physics, Chemistry and Biology in Class 11 and 12, as the NCAHP curricula require. "
                                           "Physics helps you understand how imaging machines and radiation work. "
                                           "You must also be at least 17 years old for admission."),
           step("Choose DMRIT or BSc MRIT", "After 12th", "The diploma (DMRIT) admits students on 10+2 merit, while the BSc MRIT uses NEET-based selection as per the NCAHP curriculum. "
                                                          "The diploma takes 2.5 years and the degree takes 4 years, both including an internship. "
                                                          "Check your state's admission notice for the current year."),
           step("Complete course + internship", "2.5–4 years", "Complete your course and internship with plenty of hands-on imaging practice. "
                                                               "Learn patient positioning for common studies, image quality checks and how to work with radiologists. "
                                                               "The internship is where you build the confidence employers look for."),
           step("Learn radiation safety", "During course", "Learn how to protect patients and staff from radiation using shielding, dose limits and safe distances. "
                                                           "AERB rules set these safety standards, and every centre has its own protocols. "
                                                           "Following them strictly is a core part of the job."),
           step("Join a hospital/diagnostic centre", "After", "Apply for radiographer or X-ray technician roles at hospitals, diagnostic centres and imaging chains. "
                                                              "Expect a practical test on positioning and safety, plus an interview. "
                                                              "Hospitals need imaging for emergencies and inpatients, so be ready for shift work."),
           step("Specialise", "Later", "With experience, you can specialise in CT, MRI or mammography. "
                                       "Advanced imaging roles need more training in equipment and safety checks. "
                                       "A BSc MRIT makes it easier to move into these roles.")],
    hiring=_stages(("Admission", "DMRIT/BSc MRIT.", [paper("10+2 merit (diploma) / NEET (BSc MRIT, per NCAHP)", "Varies", "Varies", "Check your state")], "Seat."),
                   ("2.5–4 years", "Course + internship.", "Pass all exams."), ("After course", "Registration as per NCAHP/state rules.", "Registered where applicable."),
                   ("Recruitment", "Hospitals and imaging centres.", [paper("Practical + interview", "Practical", "—", "Positioning and safety")], "Offer.")),
    checklist=["You know positioning for common studies.", "You follow radiation safety.", "You can operate X-ray/CT basics.", "You maintain image quality."],
    timeline=[("DMRIT", "2.5 years"), ("or BSc MRIT", "4 years"), ("Job", "After")],
    prep=[{"phase": "Course", "duration": "2.5–4 years", "focus": ["Positioning", "Physics", "Safety"]}],
    resources=[{"label": "NCAHP curricula", "url": "https://ncahp.abdm.gov.in/curriculum", "note": "Diploma and BSc MRIT."},
               {"label": "AERB", "url": "https://www.aerb.gov.in/", "note": "Radiation safety regulator."}],
    ladder=[["Start", "Radiographer / X-ray Technician", "0–3 years", "Routine imaging"], ["Mid", "CT/MRI Technologist", "3–8 years", "Advanced imaging"], ["Senior", "Chief Technologist", "8+ years", "Department"]],
    special=["Radiation safety rules are set by the Atomic Energy Regulatory Board (AERB) — follow your centre's protocols strictly."],
    mistakes=["Ignoring shielding and dose limits.", "Poor positioning.", "Not checking implants before MRI."],
    faqs=[{"q": "Diploma or degree?", "a": "The diploma (2.5 years) is faster, while the BSc MRIT (4 years) opens CT, MRI and senior roles. "
                                           "Choose the diploma if you want to start working sooner. "
                                           "You can study further later to move into advanced imaging."},
          {"q": "Is NEET needed?", "a": "NCAHP's BSc MRIT curriculum uses NEET-based selection, while diploma admissions are on 10+2 merit. "
                                        "Rules can differ by state and institute. "
                                        "Check the official admission notice for the current year."},
          {"q": "Is radiation dangerous?", "a": "Radiation risks are controlled by following safety rules, shielding and dose monitoring. "
                                                "AERB sets these rules, and your centre's protocols must be followed strictly. "
                                                "These rules exist to keep both patients and staff safe."}],
    related_items=[related("lab-technician-dmlt", "Lab Technician", "Diagnostics"), related("nursing-officer-staff-nurse", "Nursing Officer", "Clinical"), related("physiotherapist", "Physiotherapist", "Allied health")],
    institutes=[NCAHP, AIIMS, PGIMER, JIPMER],
    sources=[source("NCAHP — Diploma and BSc MRIT curricula", "https://ncahp.abdm.gov.in/curriculum", "Eligibility and duration."),
             source("Atomic Energy Regulatory Board", "https://www.aerb.gov.in/", "Radiation safety.")],
    extra_sections=_extra([["X-ray machine", "Radiographs"], ["CT scanner", "Cross-sectional imaging"], ["MRI scanner", "MR imaging"], ["PACS", "Image storage"]],
                          ["Check the day's schedule", "Prepare and position patients", "Acquire images", "Quality check and send to radiologist", "Equipment logs"],
                          ["How do you protect patients from radiation?", "MRI safety checks?", "Positioning for chest X-ray?", "What is PACS?"],
                          [["Hospital", "Emergency and inpatient imaging"], ["Diagnostic centre", "Outpatient scans"], ["Imaging chain", "High volume, CT/MRI"]]),
)

NUTRI = _hc(
    "nutritionist-dietitian", "Nutritionist / Dietitian", "Nutrition", "How to become a Nutritionist / Dietitian",
    "A nutritionist or dietitian plans diets for health and disease — in hospitals (clinical dietitian), wellness, sports, food industry and public health. "
    "Clinical dietitians usually need a master's degree, hospital training and often the Registered Dietitian (RD) credential. "
    "Qualified professionals are different from social-media 'nutritionists', and employers check degrees.",
    duties=["Assess patients' nutrition", "Plan therapeutic diets", "Counsel clients", "Work with doctors and kitchens", "Run community nutrition programmes", "Track progress"],
    postings=["Hospitals, clinics, wellness and fitness, food industry, public health, own practice"],
    facts=[fact("Education", "BND/BSc Nutrition; MSc for dietitians"), fact("BND (NCAHP)", "4 years incl. 6 months clinical training"), fact("Entry", "10+2 science, 50%"),
           fact("Credential", "Registered Dietitian (Indian Dietetic Association)"), fact("Core skills", "Clinical nutrition, counselling")],
    levels=[["Student", "Nutrition science, biochemistry"], ["Nutritionist", "Diet plans and counselling"], ["Clinical Dietitian", "Hospital therapeutic diets (MSc + RD)"]],
    steps=[step("10+2 science", "School", "Take science with Chemistry and Biology in Class 11 and 12. "
                                          "The NCAHP Nutrition and Dietetics curriculum asks for 50% in 10+2 science for the BND. "
                                          "Chemistry and Biology are the base of nutrition science."),
           step("Bachelor's in Nutrition", "3–4 years", "Do a BND (Hons) or a BSc in Food & Nutrition. "
                                                        "The NCAHP BND runs for 4 years, including 6 months of clinical training. "
                                                        "Choose a recognised college with good lab and hospital exposure."),
           step("Master's", "2 years", "Do an MSc in Nutrition & Dietetics if you want clinical hospital roles. "
                                       "The master's goes deeper into therapeutic diets for diseases. "
                                       "Hospitals often prefer dietitians with this qualification."),
           step("Hospital internship", "During/after", "Complete a hospital internship to work with doctors and real patients. "
                                                       "You will learn to plan diets for conditions such as diabetes and kidney disease. "
                                                       "This clinical exposure is needed for dietitian roles and for the RD credential."),
           step("RD credential (optional)", "After", "After your PG and hospital training, you can take the Indian Dietetic Association's Registered Dietitian (RD) exam. "
                                                     "It is not legally required, but many hospitals prefer RDs. "
                                                     "Check IDA's latest notice for eligibility and exam dates."),
           step("Work or practise", "After", "Work in hospitals, wellness and fitness companies, sports, the food industry or public health programmes. "
                                             "With experience, many dietitians start their own practice. "
                                             "Always base your advice on evidence, not food fads.")],
    hiring=_stages(("Admission", "Nutrition degree.", [paper("Merit / university entrance", "Varies", "Varies", "Check science subject rules")], "Seat."),
                   ("3–6 years", "Bachelor's + Master's + internship.", "Pass and complete training."), ("After MSc", "IDA RD exam (optional but valued).", "Registered Dietitian."),
                   ("Recruitment", "Hospitals and wellness companies.", [paper("Interview + case study", "Discussion", "—", "Plan a diet for a case")], "Offer.")),
    checklist=["You have a nutrition degree.", "You can plan therapeutic diets.", "You did a hospital internship.", "You counsel clearly."],
    timeline=[("Bachelor's", "3–4 years"), ("MSc", "2 years"), ("RD", "Optional"), ("Job", "After")],
    prep=[{"phase": "Study", "duration": "5–6 years", "focus": ["Clinical nutrition", "Internship"]}],
    resources=[{"label": "NCAHP — Nutrition and Dietetics curriculum", "url": "https://ncahp.abdm.gov.in/curriculum", "note": "Official curriculum."},
               {"label": "ICMR-NIN", "url": "https://www.nin.res.in/", "note": "Dietary guidelines."}],
    ladder=[["Start", "Nutritionist / Dietitian", "0–3 years", "Counselling"], ["Mid", "Senior / Clinical Dietitian", "3–8 years", "Hospital diets"], ["Senior", "Chief Dietitian / practice owner", "8+ years", "Department"]],
    special=["Social-media 'nutritionist' titles are not the same as a qualified dietitian — clients and hospitals check degrees and RD status."],
    mistakes=["Giving medical diet advice without proper training.", "No clinical internship.", "Following fads instead of evidence."],
    faqs=[{"q": "Nutritionist vs dietitian?", "a": "Dietitians usually have clinical training, such as an MSc and a hospital internship, and often the RD credential. "
                                                   "Nutritionists work more in wellness, fitness and community programmes. "
                                                   "Hospitals usually hire dietitians to plan patient diets."},
          {"q": "Can commerce students become dietitians?", "a": "Nutrition degrees usually need 10+2 science with Chemistry and Biology. "
                                                                 "So commerce students generally cannot join these degrees directly. "
                                                                 "Check each university's admission rules, since subject requirements can vary."},
          {"q": "Is RD compulsory?", "a": "RD is not legally compulsory. "
                                          "However, many hospitals prefer Registered Dietitians for clinical roles. "
                                          "If you want a hospital career, plan to take the RD exam after your PG and training."}],
    related_items=[related("physiotherapist", "Physiotherapist", "Wellness"), related("nursing-officer-staff-nurse", "Nursing Officer", "Clinical"), related("pharmacist", "Pharmacist", "Healthcare")],
    institutes=[NCAHP, NIN, LADY_IRWIN, IDA, IGNOU],
    sources=[source("NCAHP — Nutrition and Dietetics curriculum", "https://ncahp.abdm.gov.in/curriculum", "Entry and duration."), source("Indian Dietetic Association", "https://idaindia.com/", "RD credential.")],
    extra_sections=_extra([["Body composition tools", "Assessment"], ["Diet planning software", "Meal plans"], ["Food composition tables", "Nutrient values"], ["Counselling aids", "Education"]],
                          ["Ward rounds with doctors", "Plan diets for admitted patients", "Kitchen coordination", "Outpatient counselling", "Documentation"],
                          ["Diet for a diabetic patient?", "How do you counsel a non-compliant client?", "Explain BMI limits.", "Nutrition for kidney disease?"],
                          [["Hospital", "Clinical diets"], ["Wellness/fitness", "Coaching"], ["Food industry", "Product and labelling"], ["Own practice", "After experience"]]),
)

PHARMA = _hc(
    "pharmacist", "Pharmacist", "Pharmacy", "How to become a Pharmacist",
    "A pharmacist dispenses medicines, checks prescriptions, advises patients and manages drug stocks — in hospitals, retail pharmacies and the pharma industry. "
    "You need a D.Pharm or B.Pharm from a PCI-approved institution and registration with your State Pharmacy Council. "
    "Under the Pharmacy Act, only registered pharmacists can dispense medicines in pharmacies.",
    duties=["Check and dispense prescriptions", "Counsel patients on correct use", "Manage stock and storage", "Report adverse drug reactions", "Follow drug laws", "Work in industry roles (QA, production, regulatory)"],
    postings=["Hospitals, retail pharmacy chains, pharma companies, government health services"],
    facts=[fact("Education", "D.Pharm / B.Pharm"), fact("Regulator", "Pharmacy Council of India"), fact("Registration", "State Pharmacy Council (Pharmacy Act, 1948)"),
           fact("D.Pharm", "2 years"), fact("B.Pharm", "4 years"), fact("Eligibility", "10+2 with PCB or PCM"), fact("D.Pharm exit exam", "Regulations 2022; check PCI circulars for status")],
    levels=[["Student", "Pharmaceutics, pharmacology, chemistry"], ["Registered pharmacist", "Dispensing and counselling"], ["Senior", "Hospital/industry specialist roles"]],
    steps=[step("10+2 with PCB or PCM", "School", "Take Physics and Chemistry with either Biology or Maths in Class 11 and 12. "
                                                  "Both PCB and PCM students can join pharmacy courses. "
                                                  "Strong Chemistry helps a lot in pharmacy subjects."),
           step("Choose D.Pharm or B.Pharm", "After 12th", "Choose D.Pharm (2 years) for faster entry into dispensing, or B.Pharm (4 years) for industry and higher study. "
                                                           "Join only a PCI-approved institution, because registration depends on it. "
                                                           "Check the approved list on the PCI website before paying any fee."),
           step("Complete course and training", "2–4 years", "Complete the course along with the practical or hospital training set by PCI regulations. "
                                                             "Learn dispensing, drug storage and patient counselling carefully. "
                                                             "These are the skills you will use every day at work."),
           step("Register with the State Pharmacy Council", "After passing", "Register with your State Pharmacy Council after passing, because registration is required to practise as a pharmacist. "
                                                                             "D.Pharm exit-exam rules have changed several times, so check the latest PCI circular. "
                                                                             "Keep copies of your certificates and registration ready."),
           step("Work", "After registration", "Work in a hospital pharmacy, a retail chain, the pharma industry or government health services. "
                                              "Hospital and retail roles focus on dispensing and counselling, while industry roles include QA, production and regulatory work. "
                                              "Choose based on whether you prefer working with patients or with manufacturing."),
           step("Higher study", "Optional", "You can do an M.Pharm, for example at NIPER through its joint entrance, or a Pharm.D. Higher study opens research, industry and specialist roles. "
                                            "Decide based on the career you want in the long run.")],
    hiring=_stages(("Admission", "D.Pharm/B.Pharm admission.", [paper("State/university entrance or merit", "Varies", "Varies", "Check PCI approval")], "Seat."),
                   ("2–4 years", "Course + practical training.", "Pass all exams."), ("After passing", "State Pharmacy Council registration (and D.Pharm exit exam as notified).", "Registered pharmacist."),
                   ("Recruitment", "Hospitals, chains, industry.", [paper("Interview / written test", "Varies", "—", "Know drugs and dosage")], "Offer.")),
    checklist=["Your college is PCI-approved.", "You are registered with the State Pharmacy Council.", "You know common drugs, doses and interactions.", "You follow storage and record rules."],
    timeline=[("D.Pharm", "2 years"), ("or B.Pharm", "4 years"), ("Registration", "After passing"), ("Job", "After")],
    prep=[{"phase": "Course", "duration": "2–4 years", "focus": ["Pharmacology", "Dispensing"]}, {"phase": "Career", "duration": "After", "focus": ["Registration", "NIPER JEE (optional)"]}],
    resources=[{"label": "Pharmacy Council of India", "url": "https://www.pci.nic.in/", "note": "Approved institutions and circulars."}],
    ladder=[["Start", "Pharmacist", "0–3 years", "Dispensing"], ["Mid", "Senior / Hospital Pharmacist", "3–8 years", "Department"], ["Senior", "Chief Pharmacist / industry manager", "8+ years", "Leadership"]],
    special=["Only registered pharmacists can dispense in pharmacies under the Pharmacy Act — registration is essential.",
             "PCI's D.Pharm exit-exam rules have changed several times; in February 2026 PCI asked state councils to register passed-out D.Pharm candidates — check the latest circular."],
    mistakes=["Joining a non-approved college.", "Not registering.", "Dispensing without checking prescriptions."],
    faqs=[{"q": "Can PCM students do pharmacy?", "a": "Yes, 10+2 with Physics and Chemistry plus Biology or Mathematics is accepted. "
                                                      "So both PCB and PCM students can join D.Pharm and B.Pharm. Check each college's admission rules for minimum marks."},
          {"q": "D.Pharm or B.Pharm?", "a": "D.Pharm is faster and suits retail and hospital dispensing. "
                                            "B.Pharm opens industry jobs and higher study such as M.Pharm. Choose based on how soon you want to work and where you want to grow."},
          {"q": "Can I open a medical store?", "a": "Drug licences need a registered pharmacist, along with state drug-control approvals. "
                                                    "You can run the store yourself if you are registered, or employ a registered pharmacist. "
                                                    "Check your state drug control department's rules before you start."}],
    related_items=[related("nursing-officer-staff-nurse", "Nursing Officer", "Clinical"), related("medical-coder", "Medical Coder", "Life-science route"), related("lab-technician-dmlt", "Lab Technician", "Diagnostics")],
    institutes=[PCI, NIPER, AIIMS, JIPMER],
    sources=[source("Pharmacy Council of India", "https://www.pci.nic.in/", "Regulations, approvals and circulars.")],
    extra_sections=_extra([["Pharmacy software", "Billing and stock"], ["Drug references", "Doses and interactions"], ["Cold-chain storage", "Vaccines/insulin"], ["Registers", "Scheduled drugs"]],
                          ["Check prescriptions", "Dispense and counsel", "Manage stock and expiry", "Coordinate with doctors", "Update records"],
                          ["What is a drug interaction?", "How do you store insulin?", "What is a Schedule H drug?", "How do you handle a wrong prescription?"],
                          [["Hospital pharmacy", "Inpatient and OPD"], ["Retail chain", "Customer-facing"], ["Pharma industry", "QA, production, regulatory"], ["Government", "Health department posts"]]),
)

GUIDES = [NURSE, PHYSIO, CODER, BILLER, LAB, RADIO, NUTRI, PHARMA]
_BY_KEY = {slugify(k): g for g in GUIDES for k in (g["slug"], g["title"])}


def healthcare_guide(value):
    g = _BY_KEY.get(slugify(value or ""))
    return deepcopy(g) if g else None
