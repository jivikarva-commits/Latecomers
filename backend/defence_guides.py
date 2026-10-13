"""NDA / CDS and AFCAT beginner guides.

Verified on 2026-10-12 against:
- UPSC NDA & NA Examination (II) 2026 notice (No. 10/2026-NDA-II, 20-05-2026)
- UPSC CDS Examination (II) 2026 notice (No. 11/2026-CDS-II, 20-05-2026)
- IAF AFCAT 02/2026 notification (afcat.edcil.co.in, courses commencing July 2027)
"""
from gov_guide_kit import details, fact, paper, related, source, stage, step

NDA_URL = "https://www.upsc.gov.in/sites/default/files/Notif-NDA-II-2026-Engl-200526.pdf"
CDS_URL = "https://www.upsc.gov.in/sites/default/files/Notif-CDS-II-2026-Engl-200526.pdf"
AFCAT_URL = "https://afcat.edcil.co.in/assets/images/news/AFCAT_02_2026/Notification%20for%20AFCAT%20Cycle%2002-2026.pdf"
AFCAT_SITE = "https://afcat.edcil.co.in"

SSB_STAGE = ("Stage I: Officer Intelligence Rating test + Picture Perception & Description Test (screening, same day). "
             "Stage II (about 4 days): interview, group tasks, psychology tests and conference. IO, GTO and psychologist marks carry equal weight.")

DEFENCE_PREP = [
    {"phase": "Written exam base", "duration": "Months 1–3",
     "focus": ["NDA: Class 11–12 Maths daily; CDS: Class 10 level maths", "English grammar, vocabulary and comprehension", "NCERT Science, History, Geography and Polity for GK"]},
    {"phase": "Practice", "duration": "Months 3–5",
     "focus": ["Previous UPSC papers in timed conditions", "Current affairs and defence news", "Start running (2.4 km), push-ups and sit-ups 5 days a week"]},
    {"phase": "SSB preparation", "duration": "After the written result",
     "focus": ["Practise OIR tests and picture story writing (PP&DT)", "Group discussion and speaking confidently", "Know your own form (PIQ) well — the interview is based on it"]},
]

DEFENCE_RESOURCES = [
    {"label": "UPSC — previous question papers", "url": "https://upsc.gov.in/examinations/previous-question-papers", "note": "NDA and CDS papers for practice."},
    {"label": "Join Indian Army — SSB procedure", "url": "https://joinindianarmy.nic.in", "note": "Official description of SSB tests (mentioned in the UPSC notice)."},
    {"label": "NCERT textbooks (free PDF)", "url": "https://ncert.nic.in/textbook.php", "note": "Maths and General Science basics."},
]

DEFENCE_MISTAKES = [
    "Ignoring the date-of-birth window — it is different for each academy and course.",
    "Getting married before or during training — candidates are discharged and must refund training costs.",
    "Preparing only for the written exam; SSB has more marks than the written test in NDA.",
    "Not checking medical standards (eyesight, BMI, tattoos, etc.) before preparing for months.",
]

NDA_CDS = details(
    service={"short": "NDA / CDS", "full": "Officer entry into the Army, Navy and Air Force through UPSC", "headline": "How to become an Armed Forces Officer through NDA or CDS",
             "seoTitle": "NDA & CDS Officer Guide", "authority": "UPSC conducts the written exam; Services Selection Boards (SSB) of the Ministry of Defence do the interview"},
    quick_facts=[
        fact("NDA — who", "Unmarried boys and girls after 12th (age about 16½–19½)"),
        fact("CDS — who", "Unmarried graduates (age about 19–25 by academy)"),
        fact("NDA II 2026 seats", "394 (Army 208, Navy 42, Air Force 120, Naval Academy 24)"),
        fact("CDS II 2026 seats", "451 (IMA 100, INA 26, AFA 32, OTA men 275, OTA women 18)"),
        fact("Written exam", "UPSC, held twice a year (I and II)"),
        fact("Interview", "SSB — 5-day selection process, 900 marks"),
        fact("Starting pay as Lieutenant", "₹56,100 basic (Level 10) + ₹15,500 MSP"),
        fact("Fee", "NDA ₹100, CDS ₹200 (free for SC/ST, women and some JCO/NCO wards)"),
    ],
    role={"heading": "What does an Armed Forces officer do?",
          "intro": "Officers lead soldiers, sailors or airmen and are responsible for training, discipline, operations and the welfare of their unit.",
          "duties": ["Army: lead a platoon/company; serve in infantry, artillery, armoured, engineers, signals and other arms",
                     "Navy: serve on ships and submarines, in naval aviation or engineering branches",
                     "Air Force: fly aircraft (Flying branch) or manage technical and ground-duty operations",
                     "Plan and carry out operations, disaster relief and peace-keeping missions"],
          "postings": ["Posting anywhere in India, including border and field areas", "Training first at NDA/IMA/INA/AFA/OTA, then commissioning"]},
    eligibility=["NDA: unmarried male/female; Indian citizen (or Nepal subject / specified migrants with a certificate). NDA II 2026: born between 1 January 2008 and 1 January 2011.",
                 "NDA education: Army wing — 12th pass (any stream). Air Force and Navy wings and Naval Academy 10+2 entry — 12th with Physics, Chemistry and Maths. Students in 12th can apply.",
                 "CDS education: IMA and OTA — any graduation. Indian Naval Academy — B.E./B.Tech or B.Sc. with Physics (and Physics & Maths in 12th). Air Force Academy — graduation with Physics & Maths in 12th, or B.E./B.Tech. Final-year students can apply.",
                 "CDS II 2026 age: IMA and INA 19–24 (born 1 July 2003 – 1 July 2008); AFA 20–24 (up to 26 with a DGCA CPL); OTA men and women 19–25 (born 1 July 2002 – 1 July 2008). Unmarried, except AFA candidates 25+ as per notice.",
                 "You must not marry until training is complete."],
    category_table=None,
    attempt_rules=["There is no attempt limit for NDA or CDS — you can try every cycle while you fit the age window.",
                   "NDA and CDS are each held twice a year (I and II)."],
    attempt_heading="How many attempts?",
    exam_stages=[
        stage("NDA written exam (UPSC)", "NDA II 2026: 13 September 2026", "Two objective papers. Questions in Hindi and English (except the English part).",
              [paper("Mathematics", "300", "2½ hours", "Merit"), paper("General Ability Test: English (200) + General Knowledge (400)", "600", "2½ hours", "Merit")],
              "UPSC fixes qualifying marks for each paper and in total. Negative marking applies to wrong answers."),
        stage("CDS written exam (UPSC)", "CDS II 2026: 13 September 2026", "IMA, INA and AFA: three papers. OTA: two papers (no maths).",
              [paper("English", "100", "2 hours", "Merit"), paper("General Knowledge", "100", "2 hours", "Merit"),
               paper("Elementary Mathematics (not for OTA)", "100", "2 hours", "Merit")],
              "Written total 300 (IMA/INA/AFA) or 200 (OTA). The SSB interview carries the same maximum marks as the written exam for each course."),
        stage("SSB interview", "A few months after the written result", "Five-day personality and officer-like-qualities assessment.",
              [paper("SSB Test / Interview (NDA)", "900", "About 5 days", "Merit")],
              SSB_STAGE + " Air Force flying candidates must also pass the once-in-a-lifetime CPSS pilot aptitude test."),
        stage("Medical examination and final merit", "After SSB", "Service medical board checks fitness.",
              [], "Final merit = written + SSB marks, filled against vacancies separately for men and women. You must be medically fit."),
    ],
    passing_rules=["NDA final merit = written (900) + SSB (900) = 1,800 marks.",
                   "CDS final merit = written + SSB, where both have equal maximum marks for each course.",
                   "Clearing the written exam only gets you an SSB call — the SSB is a separate pass/fail.",
                   "You must be medically fit to be admitted."],
    steps=[
        step("Check your route", "Before applying", "After 12th → NDA. After graduation → CDS (or AFCAT for the Air Force)."),
        step("Check age window and marital status", "Before applying",
             "Each academy has a fixed date-of-birth range in the notice, so check the exact dates for the academy you want rather than one common age range. "
             "You must also be unmarried as the notice requires, and you must not marry until training is complete. "
             "If you fall outside the window by even one day, you cannot apply for that course."),
        step("Apply on upsconline.nic.in", "NDA/CDS II 2026: 20 May – 9 June 2026", "Create your URN (one-time), Common Application Form, then the exam form. Fee: NDA ₹100, CDS ₹200; SC/ST, women and eligible wards pay nothing."),
        step("Write the UPSC exam", "NDA/CDS II 2026: 13 September 2026",
             "Download the e-admit card from the UPSC site; it is issued in the week before the exam. "
             "Entry to the venue closes 30 minutes before each session, and face authentication is done at the venue, so reach early. "
             "Negative marking applies, so answer only when you are reasonably sure."),
        step("Attend the SSB", "A few months after the result", "Carry original documents (10th/12th or degree). Stage I screening, then Stage II over about 4 days."),
        step("Medical examination", "After SSB recommendation",
             "A service medical board checks your eyesight, height-weight, overall fitness and other medical standards. "
             "You must be medically fit to be admitted, even if your written and SSB marks are high. "
             "Read the medical standards in the notice before you start preparing, so you are not surprised at this stage."),
        step("Final merit and joining", "Before course starts",
             "Final merit is your written marks plus your SSB marks, filled against vacancies separately for men and women. "
             "For the II 2026 cycle, the NDA 158th course and the Naval Academy (10+2) course start on 1 July 2027; IMA, INA and AFA also start in July 2027, and OTA starts in October 2027. "
             "Watch for your joining instructions and keep your original documents ready."),
        step("Training and commission", "Joining onwards", "NDA: 3 years (JNU degree) then 1 year at IMA/INA/AFA; CDS: directly at IMA/INA/AFA/OTA. Commissioned as Lieutenant / Sub-Lieutenant / Flying Officer."),
    ],
    calendar={"label": "NDA II and CDS II 2026 (UPSC notices dated 20-05-2026)",
              "rows": [{"event": "Online applications", "date": "20 May – 9 June 2026"},
                       {"event": "Written exam (both)", "date": "13 September 2026"},
                       {"event": "Courses start", "date": "NDA/IMA/INA/AFA: July 2027; OTA: October 2027"},
                       {"event": "NDA I / CDS I 2027 (UPSC calendar)", "date": "Apply 2 – 22 December 2026; exam 11 April 2027"}],
              "note": "Check the UPSC calendar and notices for the next cycle."},
    prep_plan=DEFENCE_PREP,
    free_resources=[{"label": "UPSC NDA & NA II 2026 notice (PDF)", "url": NDA_URL, "note": "Eligibility, syllabus, SSB, training and pay."},
                    {"label": "UPSC CDS II 2026 notice (PDF)", "url": CDS_URL, "note": "Academy-wise eligibility, papers and training."}, *DEFENCE_RESOURCES],
    training={"heading": "Training after selection",
              "intro": "NDA cadets get a JNU degree during training. CDS candidates go straight to their service academy.",
              "phases": [{"name": "NDA (Army, Navy, Air Force cadets)", "place": "NDA, Khadakwasla, Pune", "duration": "3 years"},
                         {"name": "Army cadets after NDA / CDS (IMA)", "place": "Indian Military Academy, Dehradun", "duration": "1 year after NDA; about 18 months for CDS entry"},
                         {"name": "Naval Academy 10+2 cadet entry", "place": "Indian Naval Academy, Ezhimala", "duration": "4 years (B.Tech)"},
                         {"name": "Air Force flying cadets", "place": "Air Force Academy, Hyderabad", "duration": "About 1½ years of flying training"},
                         {"name": "CDS Air Force Academy entry", "place": "Air Force Academy, Hyderabad", "duration": "About 74 weeks"},
                         {"name": "CDS OTA (Short Service Commission)", "place": "Officers' Training Academy, Chennai", "duration": "About 49 weeks"}],
              "note": "From the UPSC notices; durations can change. A fixed stipend of ₹56,100/month is paid during academy training such as IMA."},
    career_ladder={"heading": "Pay & rank growth (Army ranks; Navy and Air Force have equivalents)",
                   "columns": ["Rank", "Pay level", "Pay range"],
                   "rows": [["Lieutenant", "Level 10", "₹56,100 – ₹1,77,500"], ["Captain", "Level 10B", "₹61,300 – ₹1,93,900"],
                            ["Major", "Level 11", "₹69,400 – ₹2,07,200"], ["Lieutenant Colonel", "Level 12A", "₹1,21,200 – ₹2,12,400"],
                            ["Colonel", "Level 13", "₹1,30,600 – ₹2,15,900"], ["Brigadier", "Level 13A", "₹1,39,600 – ₹2,17,600"],
                            ["Major General", "Level 14", "₹1,44,200 – ₹2,18,200"], ["Lieutenant General", "Level 15–17", "₹1,82,200 – ₹2,25,000"],
                            ["Chief of Army Staff", "Level 18", "₹2,50,000 (fixed)"]],
                   "note": "From the NDA II 2026 notice. Military Service Pay ₹15,500/month (Lt to Brig) plus field-area and other allowances are extra."},
    special={"title": "Good to know",
             "items": ["NDA and CDS select officers. Agniveer (soldier/sailor/airman) recruitment is a different route.",
                       "CDS OTA gives Short Service Commission; IMA, INA and AFA give Permanent Commission (as per the notice).",
                       "Women can join NDA and the OTA (SSC women) course through these exams.",
                       "Flying candidates who have ever failed CPSS/PABT cannot apply for the flying branch again."]},
    mistakes=DEFENCE_MISTAKES,
    faqs=[{"q": "Can girls apply for NDA?", "a": "Yes. Unmarried female candidates are eligible for NDA; vacancies and merit lists are separate for men and women."},
          {"q": "Can I apply for NDA while in 12th?", "a": "Yes. You must show the 12th pass certificate as per the deadline in the notice."},
          {"q": "Is there an attempt limit?", "a": "No, there is no attempt limit for NDA or CDS. Only the age window and marital status limit you. "
                                                 "Both exams are held twice a year, so you can try in every cycle while you are eligible."},
          {"q": "Do I need coaching for SSB?", "a": "Not compulsory. SSB checks personality and officer-like qualities; honest practice, fitness and clear communication matter most."}],
    related_items=[related("short-service-commission-afcat", "Air Force Officer — AFCAT", "Graduate route into the Air Force"),
                   related("ips-officer", "IPS", "Uniformed leadership through UPSC CSE"),
                   related("police-sub-inspector", "Police Sub-Inspector", "State police officer route")],
)

AFCAT = details(
    service={"short": "AFCAT", "full": "Air Force Common Admission Test — Flying and Ground Duty officers", "headline": "How to become an Air Force Officer through AFCAT",
             "seoTitle": "AFCAT Air Force Officer Guide", "authority": "Indian Air Force (Air HQ) — applications on afcat.edcil.co.in"},
    quick_facts=[
        fact("Conducted by", "Indian Air Force"),
        fact("Who can apply", "Unmarried Indian citizens (men and women) with a degree"),
        fact("Age", "Flying 20–24; Ground Duty 20–26 (on 1 July of course year)"),
        fact("Exam", "100 questions, 300 marks, 2 hours (+3 / −1)"),
        fact("Interview", "AFSB — 5-day selection process"),
        fact("Commission", "Permanent or Short Service (depends on branch)"),
        fact("Pay as Flying Officer", "₹56,100 basic (Level 10) + ₹15,500 MSP"),
        fact("Fee", "₹550 + GST (not for NCC special entry)"),
    ],
    role={"heading": "What does an Air Force officer do?",
          "intro": "AFCAT recruits Group 'A' gazetted officers into the Indian Air Force.",
          "duties": ["Flying branch: fly fighter, transport or helicopter aircraft",
                     "Ground Duty (Technical): maintain aircraft, avionics and weapons systems — Aeronautical Engineer (Electronics / Mechanical)",
                     "Ground Duty (Non-Technical): Weapon Systems, Administration, Logistics, Accounts, Education and Meteorology branches",
                     "Lead airmen and manage operations at air bases"],
          "postings": ["Air Force stations across India", "Training at Air Force training establishments before commissioning"]},
    eligibility=["Indian citizen; unmarried at the start of the course (no marriage during training).",
                 "Flying: Physics and Maths in 12th AND a 3-year degree in any subject, or B.E./B.Tech, or AMIE/ASI Sections A & B.",
                 "Ground Duty (Technical): Physics and Maths in 12th AND a 4-year engineering degree (or listed equivalents) in the disciplines named in the notice.",
                 "Administration & Logistics: 12th + any degree. Accounts: B.Com, BBA/BMS/BBS (Finance), B.Sc (Finance) or CA/CMA/CS/CFA. Education: PG in any discipline. Meteorology: science degree as listed.",
                 "AFCAT 02/2026 age (on 1 July 2027): Flying 20–24 (born 2 July 2003 – 1 July 2007; up to 26 with a DGCA CPL); Ground Duty 20–26 (born 2 July 2001 – 1 July 2007)."],
    attempt_rules=["The notification sets no attempt limit for AFCAT itself.",
                   "Computerised Pilot Selection System (CPSS) is once in a lifetime — if you fail it, you can never apply for the Flying branch again."],
    attempt_heading="Attempts and CPSS",
    exam_stages=[
        stage("AFCAT online exam", "AFCAT 02/2026: 8 August 2026", "Objective test in English only.",
              [paper("General Awareness, Verbal Ability in English, Numerical Ability, Reasoning and Military Aptitude (100 Q)", "300", "2 hours", "Shortlisting")],
              "+3 for each correct answer, −1 for each wrong answer, 0 for unattempted. Marks are normalised if there is more than one shift."),
        stage("AFSB testing", "After the AFCAT result", "Air Force Selection Board assessment.",
              [], "Stage I (day 1): Officer Intelligence Rating + Picture Perception & Discussion test — screening; documents checked. "
                  "Stage II: psychology tests (day 1 evening), then group tests and interview over the next days. Flying candidates also take CPSS."),
        stage("Medical examination and merit list", "After AFSB recommendation", "Medical fitness at an IAF medical establishment.",
              [], "Selection for training strictly by merit, medical fitness and available vacancies."),
    ],
    passing_rules=["Clear the AFCAT cut-off to get an AFSB call.",
                   "Pass AFSB Stage I and Stage II (and CPSS for flying).",
                   "Be medically fit, then make it to the merit list for your branch."],
    steps=[
        step("Choose your branch", "Before applying",
             "Choose between Flying, Ground Duty (Technical) and Ground Duty (Non-Technical), because each has its own degree and subject rules. "
             "Flying and Technical need Physics and Maths in 12th, and the normal upper age limit is lower for Flying (24) than for Ground Duty (26). "
             "Read the branch table in the notice and confirm you meet the exact degree rule before you apply."),
        step("Apply on afcat.edcil.co.in", "AFCAT 02/2026: 20 May – 19 June 2026",
             "Fill the online form on afcat.edcil.co.in, choose your branch preferences and pay ₹550 + GST. "
             "Use only this official portal, because the older AFCAT site no longer takes applications. "
             "Save your login details and a copy of the submitted form, because you will need them at later stages."),
        step("Write AFCAT", "AFCAT 02/2026: 8 August 2026",
             "Reach the centre by 0800 hours, because the gates close at 0930 hours and nobody is let in after that. "
             "The test has 100 questions in 2 hours, with 3 marks for each correct answer and 1 mark cut for each wrong one. "
             "Answer the questions you are sure of first and skip wild guesses."),
        step("AFSB", "After the result",
             "Carry your original documents, because they are checked on day 1 along with the Stage I screening tests. "
             "If you clear Stage I, you take psychology tests, group tests and an interview over the next days, and Flying candidates also take CPSS. "
             "Practise speaking clearly in groups and know your own application details well."),
        step("Medical and merit list", "After AFSB",
             "After AFSB recommendation, you have a medical examination at an IAF medical establishment. "
             "Final selection depends on merit, medical fitness and the vacancies in your branch. "
             "Keep yourself fit and follow the medical standards in the notice, so a small problem does not stop you at this stage."),
        step("Training and commission", "July 2027 for the 02/2026 cycle",
             "Training lasts about 62 weeks (Flying and Technical) or 50 weeks (Non-Technical) at Air Force training establishments, then you are commissioned as a Flying Officer. "
             "Your commission is Permanent or Short Service depending on your branch and the notice. "
             "You must stay unmarried during training, and physical training includes running, swimming and rope climbing."),
    ],
    calendar={"label": "AFCAT 02/2026 (courses commencing July 2027)",
              "rows": [{"event": "Online applications", "date": "20 May – 19 June 2026"},
                       {"event": "AFCAT online exam", "date": "8 August 2026"},
                       {"event": "Training starts", "date": "First week of July 2027"},
                       {"event": "AFCAT 01/2027", "date": "Not released when we checked (12 October 2026)"}],
              "note": "AFCAT is held twice a year. Watch afcat.edcil.co.in for the next notification."},
    prep_plan=[{"phase": "Base", "duration": "Months 1–2", "focus": ["Arithmetic and reasoning basics", "English vocabulary and grammar", "Static GK and defence current affairs"]},
               {"phase": "Practice", "duration": "Months 2–3", "focus": ["Military aptitude (spatial and mechanical reasoning) questions", "Timed mocks: 100 questions in 2 hours", "Start fitness: running, push-ups, swimming if possible"]},
               {"phase": "AFSB", "duration": "After the result", "focus": ["OIR and picture-story practice", "Group discussion and interview practice"]}],
    free_resources=[{"label": "AFCAT 02/2026 notification (PDF)", "url": AFCAT_URL, "note": "Branch-wise eligibility, exam, AFSB, training and pay."},
                    {"label": "AFCAT application portal", "url": AFCAT_SITE, "note": "Apply and download admit cards only here."}],
    training={"heading": "Training after selection", "intro": "Training starts in the first week of July for the 02 cycle.",
              "phases": [{"name": "Flying and Ground Duty (Technical)", "place": "Air Force training establishments", "duration": "About 62 weeks"},
                         {"name": "Ground Duty (Non-Technical)", "place": "Air Force training establishments", "duration": "About 50 weeks"}],
              "note": "Flight cadets get a fixed stipend of ₹56,100/month during one year of training. Physical training includes running, swimming and rope climbing."},
    career_ladder={"heading": "Pay & commission", "columns": ["Item", "Details"],
                   "rows": [["Flying Officer pay", "Level 10: ₹56,100 – ₹1,77,500 + MSP ₹15,500"],
                            ["Permanent Commission", "Serve till superannuation as per rank"],
                            ["Short Service Commission — Flying", "14 years from commissioning"],
                            ["Short Service Commission — Ground Duty", "10 years, extendable by 4 years"],
                            ["Pension", "Not available for SSC officers (as per notice)"]],
                   "note": "From the AFCAT 02/2026 notification. Permanent Commission for SSC officers later depends on vacancies and merit."},
    special={"title": "Good to know",
             "items": ["Technical branch candidates can apply through AFCAT, the GATE score entry, or both.",
                       "NCC Air Wing 'C' certificate holders have a special entry for the Flying branch.",
                       "Applications moved to afcat.edcil.co.in; the older AFCAT site no longer takes applications."]},
    mistakes=DEFENCE_MISTAKES[1:] + ["Guessing blindly — each wrong answer costs 1 mark."],
    faqs=[{"q": "Can women apply through AFCAT?", "a": "Yes. Men and women can apply for Flying and Ground Duty branches."},
          {"q": "Is AFCAT the same as CDS for the Air Force?", "a": "No, they are two different exams. CDS (UPSC) gives Air Force Academy entry for the Flying branch; AFCAT is the Air Force's own exam for Flying and Ground Duty branches. "
                                                                  "If you want a Ground Duty branch, prepare for AFCAT rather than CDS."}],
    related_items=[related("army-navy-air-force-officer-nda-cds", "NDA / CDS", "UPSC officer entry for all three services"),
                   related("ips-officer", "IPS", "Uniformed leadership through UPSC CSE")],
)

GUIDE_DETAILS = {"army-navy-air-force-officer-nda-cds": NDA_CDS, "short-service-commission-afcat": AFCAT}
GUIDE_SOURCES = {
    "army-navy-air-force-officer-nda-cds": [source("UPSC NDA & NA II 2026 notice", NDA_URL, "Vacancies, eligibility, fee, scheme, SSB, training and pay table."),
                                             source("UPSC CDS II 2026 notice", CDS_URL, "Academy-wise vacancies, age, education, papers and marks.")],
    "short-service-commission-afcat": [source("IAF AFCAT 02/2026 notification", AFCAT_URL, "Commission types, age, branch-wise education, exam marking, AFSB stages, training and pay."),
                                       source("AFCAT portal (EdCIL)", AFCAT_SITE, "Current notices and applications.")],
}
