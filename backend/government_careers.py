"""Editorial government guides. Never replaced by generated or cached AI reports.

Each guide names its source cycle; these are career guides, not live vacancy notices.
Recruitment authorities take precedence over supplementary institute material.
"""
from copy import deepcopy
from career_catalog import slugify
from civil_services_guides import IAS, IPS, IFS, SHARED_SOURCES, SERVICE_SOURCES

REVIEWED = "2026-10-06"
NOTICE = (
    "Career guide, not an open-vacancy announcement. Rules below refer to the named "
    "source cycles, not a guarantee for the next recruitment. Read the current official "
    "notification and corrigenda before applying: dates, vacancies, fees, age cut-off, "
    "category relaxations, nationality, documents and medical standards can change."
)
PAY_NOTE = "Basic pay is not take-home salary. Allowances, posting, deductions and the applicable pay rules determine actual earnings."


def source(label, url, scope, kind="official"):
    return {"label": label, "url": url, "scope": scope, "kind": kind}


SOURCES = {
    "upsc": source("UPSC CSE 2026 notification", "https://www.upsc.gov.in/sites/default/files/Notif-CSP-2026-Engl-060226Rev.pdf", "Eligibility, age, attempts, services and examination scheme; sections 3 and examination plan."),
    "drishti": source("Drishti IAS — Civil Services exam guide", "https://www.drishtiias.com/pdf/1604189318-about-civil-services.pdf", "Supplementary cross-check of CSE eligibility and stages; not an endorsement.", "institute"),
    "mpsc": source("MPSC — examination syllabi", "https://mpsc.gov.in/examination_syllabus/18", "Choose the syllabus and scheme applicable to your examination year."),
    "mpsc-scheme": source("MPSC State Services revised syllabus", "https://mpsc.gov.in/web/api/v1/downloadFileImage/english/5313", "State Services prelims, mains and interview scheme; use subsequent amendments for your cycle."),
    "mpsc-institute": source("Testbook — State Services eligibility", "https://testbook.com/mpsc-state-service/eligibility-criteria", "Supplementary degree and post-specific eligibility cross-check.", "institute"),
    "po": source("IBPS PO/MT XVI detailed notification (2026)", "https://www.ibps.in/wp-content/uploads/Detailed-Notification_CRP-PO-XVI_Final_V1_30.06.2026.pdf", "2027–28 vacancy cycle: eligibility section B, pay scale and examination/personality-test/interview scheme; check corrigenda too."),
    "po-iit": source("IIT Kanpur SATHEE — IBPS PO eligibility", "https://sathee.iitk.ac.in/sathee-bank-exam/bank-exams/ibps-po/ibps-details/eligibility-criteria/", "Published cross-check explicitly based on CRP PO/MT XV (2026–27 vacancies).", "institute"),
    "ibps": source("IBPS — current recruitment updates", "https://www.ibps.in/index.php/crp-updates/", "Current PO/MT and CSA notices, corrigenda and application links; SBI recruitment is separate."),
    "csa": source("IBPS CSA XVI notification (2026)", "https://www.ibps.in/wp-content/uploads/Notification_CRP_CSA_XVI-Final.pdf", "2027–28 vacancy cycle: age, education, computer literacy, pay and LLPT section H; read subsequent corrigenda."),
    "csa-institute": source("Oliveboard — Clerk eligibility reference", "https://www.oliveboard.in/blog/ibps-clerk-eligibility-check-tool/", "Cross-check of age and graduation; this article explicitly uses the previous notification.", "institute"),
    "rbi": source("RBI Grade B direct recruitment — panel year 2025", "https://opportunities.rbi.org.in/scripts/bs_viewcontent.aspx?Id=4713", "General, DEPR and DSIM are distinct streams; age and educational qualification tables."),
    "rbi-institute": source("EduTap — RBI Grade B eligibility", "https://edutap.in/rbi-grade-b/eligibility/", "Cross-check of General-stream marks, age and category conditions.", "institute"),
    "cgl": source("SSC CGL 2026 notice (official legacy filename)", "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2025.pdf", "Downloaded document is headed CGL 2026, uploaded 21 May 2026; post table and qualification section. Filename still says 2025."),
    "cgl-institute": source("Testbook — SSC CGL eligibility", "https://testbook.com/ssc-cgl-exam/eligibility-criteria", "Cross-check of post-specific age and degree requirements.", "institute"),
    "chsl": source("SSC CHSL 2025 notification", "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_chsl_2025.pdf", "Sections 1, 5, 8 and examination scheme: LDC/JSA, DEO, age, qualifications and skill tests."),
    "chsl-institute": source("Testbook — SSC CHSL eligibility", "https://testbook.com/ssc-chsl/eligibility-criteria", "Supplementary qualification cross-check; use the named official cycle for exact rules.", "institute"),
    "mts": source("SSC MTS and Havaldar 2025 notification", "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_mts_2025.pdf", "Age section 6, qualification section 9 and examination/PET scheme."),
    "mts-institute": source("Testbook — SSC MTS preparation and eligibility", "https://testbook.com/ssc-mts/coaching", "Class 10 qualification cross-check; commercial coaching is optional.", "institute"),
    "ssc": source("Staff Selection Commission", "https://ssc.gov.in", "Current notices, corrections, post preferences and results; no live vacancy count is asserted here."),
    "rrb-g": source("RRB NTPC Graduate CEN 06/2025", "https://rrbsecunderabad.gov.in/wp-content/uploads/2025/10/Final-CEN-06-2025-21-10-2025-Publish.pdf", "Graduate post table, qualifications, CBAT/typing and medical standards."),
    "rrb-ug": source("RRB NTPC Undergraduate CEN 07/2025", "https://rrbsecunderabad.gov.in/wp-content/uploads/2025/10/CEN-07-2025-NTPC-Under-Graduate-English.pdf", "Undergraduate clerk qualifications, pay, typing and medical standards."),
    "rrb-institute": source("Testbook — NTPC eligibility", "https://testbook.com/rrb-ntpc/eligibility-criteria", "Cross-check of the distinction between undergraduate and graduate posts.", "institute"),
    "rrb-d": source("RRB Level 1 CEN 09/2025 (January 2026)", "https://rrbsecunderabad.gov.in/wp-content/uploads/2026/01/Final-Detailed-CEN-09-2025-Level-1-updated-on-30.01.2026.pdf", "Age section 5, qualification section 6/Annexure A, pay and selection scheme; read corrigenda too."),
    "rrb-d-institute": source("IIT Kanpur SATHEE — RRB Group D eligibility", "https://sathee.iitk.ac.in/sathee-railway-exams/rrb-exams/rrb-group-d/rrb-details/eligibility-criteria/", "Supplementary eligibility reference based on the 2026 notification.", "institute"),
    "rrb": source("RRB — notices and corrigenda", "https://rrbsecunderabad.gov.in/employment-notice/", "Follow the board's migration notice to the current recruitment portal; verify the CEN number."),
    "nda": source("UPSC NDA/NA II 2026 notification", "https://www.upsc.gov.in/sites/default/files/Notif-NDA-II-2026-Engl-200526.pdf", "Wing-specific education, date-of-birth window, marital status, written/SSB and medical requirements."),
    "cds": source("UPSC CDS II 2026 notification", "https://www.upsc.gov.in/sites/default/files/Notif-CDS-II-2026-Engl-200526.pdf", "Academy-specific education, age/date-of-birth windows, written papers, SSB and medical requirements."),
    "defence-institute": source("Adda247 — defence exam preparation", "https://www.adda247.com/defence-jobs/", "Supplementary NDA/CDS preparation material; commission and eligibility are governed by UPSC notices.", "institute"),
    "afcat": source("Indian Air Force AFCAT 01/2026 notification", "https://www.careerairforce.gov.in/sites/default/files/inline-files/Notification-for-AFCAT-01-2026.pdf", "Branch-specific education, commission types, age at 1 January 2027, selection and pay."),
    "iaf": source("Indian Air Force — AFCAT entry", "https://www.careerairforce.gov.in/afcat-entry", "Flying, technical and non-technical entry routes; consult current advertisement for commission availability."),
    "afcat-institute": source("Adda247 — AFCAT eligibility", "https://www.adda247.com/defence-jobs/afcat-eligibility-criteria/", "Published cross-check for AFCAT 1/2026 branch-specific requirements.", "institute"),
    "police": source("Maharashtra Police — joining routes", "https://www.mahapolice.gov.in/join-mpd/", "Distinguishes UPSC IPS, state service DySP, MPSC PSI and constabulary recruitment."),
    "police-notices": source("Maharashtra Police — recruitment", "https://www.mahapolice.gov.in/police-recru.php/", "Current unit advertisements, service rules, physical tests, category exceptions and recruitment updates."),
    "psi-institute": source("Testbook — Maharashtra PSI eligibility (2024 reference)", "https://testbook.com/mpsc-psi/eligibility-criteria", "Historical degree/language cross-check only; not a current age or attempt-limit authority.", "institute"),
    "constable-institute": source("Testbook — Maharashtra Constable eligibility", "https://testbook.com/amp/maharashtra-police-constable/eligibility-criteria", "Supplementary Class 12 and physical-test cross-check.", "institute"),
    "talathi": source("Maharashtra Talathi recruitment 2023 notification", "https://mahabhumi.gov.in/Mahabhumilink/Downloads/TalathiExam/तलाठी%20पदभरती%20-2023.pdf", "Historical Maharashtra qualification, examination and S-8 pay reference; not a 2026 vacancy notification."),
    "talathi-institute": source("Testbook — Maharashtra Talathi eligibility", "https://testbook.com/maharashtra-talathi/eligibility-criteria", "Degree requirement cross-check only; current vacancies and recruitment route not independently confirmed here.", "institute"),
}


def guide(title, old_title, scope, cycle, summary, eligibility, selection, pay, subjects, caution, refs, aliases=(),
          slug=None, details=None, extra_sources=()):
    g = {
        "title": title, "slug": slug or slugify(old_title), "aliases": [old_title, title, *aliases],
        "scope": scope, "sourceCycle": cycle, "reviewedAt": REVIEWED,
        "summary": summary, "eligibility": eligibility, "selection": selection,
        "pay": pay, "subjects": subjects, "caution": caution,
        "sources": [*extra_sources, *(SOURCES[r] for r in refs)],
    }
    if details:
        g["details"] = details
    return g


CSE_SELECTION = ["Preliminary exam: GS Paper I (merit for Mains cut-off) and CSAT Paper II (qualifying, 33%).",
                 "Main exam: 2 qualifying language papers (25% each) + 7 merit papers of 250 marks = 1,750.",
                 "Personality Test of 275 marks, then service allocation by rank, preference, category, vacancies and medical fitness."]
CSE_ELIGIBILITY = ["Indian citizen (compulsory for IAS, IPS and Indian Foreign Service).",
                   "Graduate degree in any subject from a recognised university; final-year students may apply.",
                   "Age 21 to under 32 on 1 August of the exam year (OBC +3, SC/ST +5, PwBD +10 years).",
                   "Attempts: General/EWS 6, OBC 9, SC/ST unlimited within age; PwBD 9 (General/EWS/OBC)."]
CSE_SUBJECTS = ["Prelims: current affairs, history, geography, polity, economy, environment, science and CSAT",
                "Mains: essay, GS I–IV including ethics, one optional subject and answer writing"]


GUIDES = [
    guide("IAS — Indian Administrative Service", "IAS Officer", "UPSC Civil Services Exam • All India Service", "CSE 2026 rules • CSE 2027 calendar",
          "Run districts as SDM and Collector, lead State departments and make policy in Union ministries. Selected through the UPSC Civil Services Examination.",
          CSE_ELIGIBILITY, CSE_SELECTION,
          "Starts at Level 10 (₹56,100 basic/month) and rises to Level 17–18 (₹2,25,000–₹2,50,000) under the IAS (Pay) Rules 2016.",
          CSE_SUBJECTS,
          "IAS, IPS and Indian Foreign Service share one exam. Your service depends on rank and the preferences you fill — compare all three before filling the form.",
          ["drishti"], ["IAS / IPS / IFS Officer", "IAS / IPS / Indian Foreign Service", "UPSC Civil Services Exam",
                        "Union Public Service Commission (UPSC) Civil Services Exam", "Indian Administrative Service"],
          slug="ias-officer", details=IAS, extra_sources=[*SHARED_SOURCES, *SERVICE_SOURCES["ias"]]),
    guide("IPS — Indian Police Service", "IPS Officer", "UPSC Civil Services Exam • All India Service", "CSE 2026 rules • CSE 2027 calendar",
          "Lead police as ASP and SP, handle law and order and crime investigation, and rise to DGP. Selected through the UPSC Civil Services Examination with extra physical standards.",
          [*CSE_ELIGIBILITY, "IPS physical standards: height 165 cm (men) / 150 cm (women), chest and eyesight standards — checked after the final result."],
          CSE_SELECTION,
          "Starts at Level 10 (₹56,100 basic/month); DIG at Level 13A and DGP at Level 16–17 under the IPS (Pay) Rules 2016.",
          CSE_SUBJECTS,
          "Meeting the IPS physical and eyesight standards is required for IPS allocation. State police SI/DSP recruitment is a separate State exam.",
          [], ["Indian Police Service"],
          slug="ips-officer", details=IPS, extra_sources=[*SHARED_SOURCES, *SERVICE_SOURCES["ips"]]),
    guide("IFS — Indian Foreign Service", "Indian Foreign Service Officer", "UPSC Civil Services Exam • Ministry of External Affairs", "CSE 2026 rules • CSE 2027 calendar",
          "Become a career diplomat in India's embassies, high commissions and missions to the UN. Selected through the UPSC Civil Services Examination.",
          CSE_ELIGIBILITY, CSE_SELECTION,
          "Starts at Level 10 (₹56,100 basic/month) in India; Foreign Allowance and housing abroad under MEA rules.",
          CSE_SUBJECTS,
          "IFS here means Indian Foreign Service. Indian Forest Service (IFoS) shares the Prelims but has a separate Mains and subject-specific degree eligibility.",
          ["drishti"], ["IFS Officer", "Indian Foreign Service", "Diplomat"],
          slug="indian-foreign-service-officer", details=IFS, extra_sources=[*SHARED_SOURCES, *SERVICE_SOURCES["ifs"]]),
    guide("State Services — DSP / BDO / Tahsildar", "State Service Officer (DSP, BDO, Tahsildar)", "State-specific • Maharashtra example", "MPSC State Services syllabus; eligibility must be checked for the chosen advertisement",
          "State commissions recruit administrative, revenue and police officers. A combined exam does not guarantee that every named post is advertised each year.",
          ["A recognised bachelor's degree is the usual general-service route; certain posts require specific subjects or additional qualifications.",
           "Choose your state and exact post first. Age, cut-off date, language, domicile/category benefits and qualification deadlines are advertisement-specific.",
           "Police service posts can require additional physical and medical standards. Do not apply a general civil-service age limit to DSP automatically."],
          ["Maharashtra reference: preliminary examination, main examination and interview.", "Post allocation and verification follow the applicable service rules; other states may use different schemes."],
          "State and post pay matrices apply. DSP, BDO and Tahsildar are not one pay scale; verify the advertised post's basic pay.",
          ["State history, geography, economy and governance", "General studies, language and the current mains syllabus"],
          "There is no single all-India State Services eligibility rule. The linked MPSC syllabus is a reference; later amendments and your recruitment-year notice control.",
          ["mpsc", "mpsc-scheme", "police", "mpsc-institute"], ["Maharashtra Public Service Commission (MPSC) Exam"]),
    guide("Bank Probationary Officer (IBPS PO)", "Probationary Officer (PO)", "Participating public-sector banks • IBPS", "CRP PO/MT XVI (2026 notification; 2027–28 vacancies)",
          "Entry to an officer role in participating banks, with probation and bank-specific service conditions. SBI PO is a separate recruitment.",
          ["Recognised graduation in any discipline; obtain the required result/proof by the cycle's deadline.", "XVI general age: 20–30 as on 1 July 2026. SC/ST: 5 years, OBC non-creamy layer: 3 years and PwBD: 10 years upper-age relaxation; other provisions have separate conditions.", "Nationality/eligibility certificates and the participating bank's document and appointment requirements also apply."],
          ["Preliminary and main examinations.", "XVI includes a personality test and interview; consult the notice for the complete sequence and weightages.", "Provisional allotment is followed by the bank's verification and joining requirements."],
          "XVI notified officer basic-pay scale starts at ₹48,480/month and reaches ₹85,920 through specified increments. Bank allowances, probation and bond terms are separate.",
          ["Reasoning, quantitative aptitude and English", "Banking/economic awareness, data interpretation and descriptive writing"],
          "Public-sector bank employment is not the same as a central civil-service post. A coaching certificate does not replace graduation or guarantee appointment.",
          ["po", "ibps", "po-iit"], ["Banking Exam"]),
    guide("RBI Grade B Officer — General", "RBI Grade B Officer", "Reserve Bank of India", "Direct recruitment, panel year 2025",
          "Officer recruitment at India's central bank. The General, DEPR and DSIM streams have different educational and examination requirements.",
          ["General stream: graduation with at least 60% (50% for SC/ST/PwBD), or post-graduation with at least 55% (pass marks for SC/ST/PwBD), subject to equivalent-qualification rules.",
           "2025 reference: 21 to under 30 on 1 September 2025; notified category, higher-qualification and experience relaxations may apply.",
           "Check the notice's attempt limit and category conditions. General-stream eligibility does not establish DEPR/DSIM eligibility."],
          ["General stream: Phase I, Phase II and interview, followed by prescribed verification and medical requirements."],
          "Use RBI's current advertised pay scale and allowances. No estimated in-hand salary is shown because housing and deductions differ.",
          ["Phase I: general awareness, reasoning, English and quantitative aptitude", "Phase II: economic/social issues, finance/management and English writing"],
          "This guide uses the 2025 official rules. Do not treat its age cut-off or marks rules as a verified later recruitment notification.",
          ["rbi", "rbi-institute"]),
    guide("Bank Clerk / Customer Service Associate", "Bank Clerk", "Participating public-sector banks • IBPS", "CRP CSA XVI (2026 notification; 2027–28 vacancies)",
          "Customer service and clerical work in participating banks. IBPS now uses Customer Service Associate (CSA) for this recruitment.",
          ["A recognised graduate degree is the general requirement: Class 12 alone is not sufficient for IBPS CSA. The notice has a specific equivalence provision for eligible ex-servicemen.", "XVI general age: 20–28 as on 1 August 2026. SC/ST: 5 years, OBC non-creamy layer: 3 years and PwBD: 10 years upper-age relaxation; other provisions are conditional.", "Computer literacy and the specified state/UT local-language proficiency requirements apply; satisfy the notice's documentary or testing provisions."],
          ["Online preliminary and main examinations.", "Local-language proficiency requirements, document checks and bank joining formalities apply; this is not the PO interview route."],
          "CSA XVI basic pay starts at ₹24,050/month and reaches ₹64,480 through specified increments. Bank allowances and deductions vary; this is not an in-hand salary range.",
          ["English, numerical ability and reasoning", "Financial/general awareness and computer-related topics in the applicable syllabus"],
          "SBI Junior Associate, insurance recruitment and postal recruitment are separate processes, not interchangeable IBPS Clerk jobs.",
          ["csa", "ibps", "csa-institute"], ["Postal / LIC / Bank Clerk"]),
    guide("SSC CGL — Inspector / Auditor / Examiner", "Inspector / Auditor / Examiner", "Staff Selection Commission • central departments", "CGL 2026 official document",
          "CGL recruits multiple graduate-level posts. Duties, age, pay and physical requirements depend on the exact post code.",
          ["Recognised bachelor's degree for the listed general posts; statistical and other specialist posts have additional requirements.", "Auditor reference age: 18–27; many Inspector/Examiner posts: 18–30. Other CGL posts have different age bands. Apply the 2026 cut-off and category relaxations.", "Some Inspector posts require specified physical/medical standards; verify these before filling post preferences."],
          ["Tier I and Tier II computer-based examinations.", "Post-dependent papers/modules and computer/DEST requirements; document verification by the designated department."],
          "2026 basic pay: Auditor, Level 5, ₹29,200–92,300; listed Level 7 Inspector/Examiner posts, ₹44,900–1,42,400. These are pay-matrix ranges, not monthly take-home.",
          ["Quantitative ability, reasoning, English and general awareness", "Computer knowledge, data-entry practice and any post-specific paper"],
          "Postal Assistant/Sorting Assistant appears under CGL in the reviewed notice, not the CHSL 2025 post list. Post preference and physical suitability matter.",
          ["cgl", "ssc", "cgl-institute"], ["SSC Exam"]),
    guide("SSC CHSL — LDC / JSA / DEO", "LDC / DEO / Postal Assistant", "Staff Selection Commission • central departments", "CHSL 2025 notification",
          "Higher-secondary entry for clerical and data-entry posts. LDC/JSA and DEO have different skill tests and pay levels.",
          ["Class 12 or equivalent for LDC/JSA and most DEO posts. Specified DEO posts require Class 12 Science with Mathematics; check the department list.", "2025 notice: general age 18–27 as on 1 January 2026, with notified category relaxations."],
          ["Tier I and Tier II examinations, including prescribed computer knowledge and post-specific typing/skill tests.", "Document verification and any department-specific conditions; BRO posts have additional standards."],
          "LDC/JSA: Level 2, ₹19,900–63,200. DEO: Level 4, ₹25,500–81,100, or Level 5, ₹29,200–92,300 depending on post. Monthly basic-pay ranges.",
          ["English, reasoning, quantitative ability and general awareness", "Computer knowledge; LDC/JSA typing or DEO data-entry practice"],
          "Postal Assistant is deliberately removed from this CHSL label: it is not in the reviewed CHSL 2025 recruitment post list.",
          ["chsl", "ssc", "chsl-institute"]),
    guide("SSC Multi-Tasking Staff (MTS)", "Multi-Tasking Staff", "SSC • central departments", "MTS/Havaldar 2025 notification",
          "Non-technical support posts recruited through SSC. MTS and Havaldar are distinct posts even when included in the same notice.",
          ["Matriculation/Class 10 or equivalent by the notification's qualification cut-off.", "2025 reference: 18–25 for MTS; 18–27 for Havaldar and some MTS posts, measured on 1 August 2025. Category relaxations apply."],
          ["Computer-based examination in two sessions; both sessions must be attempted.", "Havaldar additionally requires PET/PST. Do not describe this physical test as mandatory for every MTS post.", "Document verification and department appointment checks."],
          "Pay Level 1 under the central pay matrix; starting basic ₹18,000 per month under the reviewed scale. Allowances and deductions are separate.",
          ["Numerical ability and reasoning/problem solving", "General awareness and English comprehension"],
          "This is not a graduate-only exam, and passing the minimum qualification alone does not guarantee selection.",
          ["mts", "ssc", "mts-institute"], ["SSC MTS"]),
    guide("Railway NTPC — Junior Clerk / Station Master", "Junior Clerk / Station Master", "Railway Recruitment Boards", "CEN 07/2025 undergraduate and CEN 06/2025 graduate",
          "Two different entry routes are shown together for comparison; a Class 12 applicant is not automatically eligible for Station Master.",
          ["Junior Clerk cum Typist: Class 12/equivalent with 50% aggregate and computer typing proficiency. The 50% condition is waived for SC/ST, PwBD, ex-servicemen and candidates with higher qualifications under CEN 07/2025.", "Station Master: recognised university degree; prescribed aptitude and A2 medical/vision standards apply.", "Referenced general age at 1 January 2026: undergraduate 18–30; graduate 18–33. Check the relevant CEN's category relaxation and qualification cut-offs."],
          ["Both routes: CBT 1 and CBT 2, then post-specific tests.", "Junior Clerk: typing skill test. Station Master: Computer Based Aptitude Test (CBAT).", "Document verification and the post's railway medical examination."],
          "Junior Clerk: Level 2, initial basic ₹19,900/month. Station Master: Level 6, initial basic ₹35,400/month in the referenced CENs.",
          ["Mathematics, general intelligence/reasoning and general awareness", "Typing for clerical posts; aptitude practice for Station Master"],
          "Do not treat all NTPC posts as 12th-pass jobs or assume all use the same skill/medical test. Confirm vision standards before choosing safety-related posts.",
          ["rrb-g", "rrb-ug", "rrb", "rrb-institute"]),
    guide("Railway Level 1 — Track Maintainer / Assistants", "Track Maintainer / Helper", "Railway Recruitment Boards", "CEN 09/2025, published January 2026",
          "Track maintenance and other Level 1 operational support roles. The actual post names and medical categories are listed in Annexure A.",
          ["The reviewed Annexure A permits Class 10, ITI/equivalent or an NCVT National Apprenticeship Certificate for the listed posts; check the exact post and amendments.", "General age 18–33 as on 1 January 2026 in this CEN. Category and other notified relaxations have separate conditions.", "Physical and post-specific medical suitability are required, subject to notified exemptions."],
          ["Computer-based examination, Physical Efficiency Test where applicable, document verification and railway medical examination."],
          "Level 1 initial basic pay ₹18,000/month in CEN 09/2025. This is not a fixed take-home amount.",
          ["Mathematics, reasoning, general science and general awareness/current affairs", "Progressive fitness preparation matched to the official PET standards"],
          "Technician recruitment is a separate CEN with different qualifications. A higher engineering qualification does not automatically substitute for a specifically required trade certificate.",
          ["rrb-d", "rrb", "rrb-d-institute"], ["Railway Helper / Technician", "Railways Exam"]),
    guide("Armed Forces Officer — NDA / CDS", "Army / Navy / Air Force Officer (NDA/CDS)", "UPSC • academy-specific defence entry", "NDA/NA II 2026 and CDS II 2026",
          "NDA is the school-leaver officer route; CDS is the graduate route. Academy, sex, marital-status and medical conditions must be checked separately.",
          ["NDA Army wing: Class 12/equivalent; Air Force/Naval wings and Naval Academy 10+2 entry require Physics, Chemistry and Mathematics.", "CDS IMA/OTA: recognised degree. Naval Academy in CDS II 2026: engineering degree OR BSc with Physics as core/elective and Physics/Mathematics at 10+2. Air Force Academy: degree with Physics/Mathematics at 10+2, or engineering degree.", "Use the exact date-of-birth window for your academy and cycle, not one shared age range. Final-year/result deadlines and marital-status rules are entry-specific."],
          ["UPSC written examination, Services Selection Board assessment and medical examination.", "Final merit and vacancies govern admission; training precedes commissioning."],
          "Training stipend and commissioned-officer pay are different. Refer to the academy/service terms in the UPSC notice; neither exam is a short job-placement course.",
          ["NDA: Mathematics and General Ability Test", "CDS: English and General Knowledge; Mathematics for IMA/INA/AFA, not OTA", "SSB readiness, communication and physical fitness"],
          "NDA/CDS recruit officers. Agniveer/soldier/sailor/airman recruitment is a different route; these qualifications cannot be reused interchangeably.",
          ["nda", "cds", "defence-institute"], ["NDA Officer", "Defense Exam"]),
    guide("Air Force Officer — AFCAT", "Short Service Commission (AFCAT)", "Indian Air Force • branch-specific", "AFCAT 01/2026 reference",
          "AFCAT covers Flying and Ground Duty branches. Commission type depends on branch and advertisement; it is not universally Short Service Commission.",
          ["Flying: at least 50% each in Mathematics and Physics at 10+2, plus the specified degree route with at least 60% or equivalent.", "Administration/Logistics: 10+2 and a qualifying graduate degree with at least 60%. Technical and other non-technical branches have their own degree/subject rules.", "01/2026 reference: Flying 20–24; Ground Duty 20–26 at 1 January 2027. Valid DGCA CPL holders have the specified Flying-age concession. Marital and medical rules apply."],
          ["AFCAT written examination followed by AFSB testing, medical examination and merit-based selection.", "Flying candidates must satisfy the prescribed pilot-aptitude/CPSS conditions."],
          "Flying Officer pay is under Level 10 in the reviewed notification; military service pay and other allowances have separate rules. Training stipend differs from commissioned pay.",
          ["English, general awareness, numerical ability, reasoning and military aptitude", "AFSB preparation and branch-specific medical readiness"],
          "The 01/2026 notification includes Permanent Commission in the technical branch as well as SSC entries. Check current branch vacancies, tenure and degree-equivalence lists.",
          ["afcat", "iaf", "afcat-institute"]),
    guide("Police Sub-Inspector — State Recruitment", "Police Sub Inspector", "State-specific • Maharashtra PSI example", "Official Maharashtra joining routes; current advertisement required",
          "State police SI recruitment is separate from UPSC IPS and from SSC recruitment of Delhi Police/CAPF sub-inspectors.",
          ["Maharashtra PSI reference: recognised graduate degree and required Marathi knowledge. The current MPSC advertisement determines proof and result deadlines.", "Age, category relaxation, physical measurements, endurance and medical rules vary by state, category and recruitment route.", "Direct recruitment and departmental promotion/limited competitive routes have different eligibility; choose the correct advertisement."],
          ["Maharashtra uses the MPSC recruitment route for direct PSI entry.", "Follow the applicable written stages, physical assessment, interview where prescribed, document verification and medical checks in that scheme."],
          "Pay is set by the state and post's notified matrix. No all-India SI salary, fixed take-home amount or common age limit is asserted.",
          ["State general knowledge, language, reasoning and the notified written syllabus", "Fitness and physical-test preparation under the relevant state standards"],
          "Select your state before deciding eligibility. An MPSC PSI rule must not be applied automatically to UP, Rajasthan, other states or SSC CPO.",
          ["police", "mpsc", "psi-institute"], ["Police & State Exams"]),
    guide("Talathi — Maharashtra Revenue Service", "Village Revenue Officer (Talathi)", "Maharashtra • not a universal VRO rule", "2023 official recruitment baseline; later cycle not verified",
          "Village-level revenue and land-records work. Talathi, Patwari and Village Revenue Officer titles in different states do not imply identical eligibility.",
          ["The Maharashtra 2023 reference requires a recognised graduate degree; it is not a Class 12-only route.", "Marathi knowledge and the prescribed computer-qualification/compliance requirements apply.", "Use the current Maharashtra advertisement for age cut-off, relaxations, qualification deadlines and district/category conditions; historical concessions are not permanent rules."],
          ["2023 baseline: computer-based examination and document verification/merit process.", "Confirm the recruiting authority and exam scheme in the next applicable notification; do not assume the 2023 route is unchanged."],
          "2023 reference: S-8 basic-pay range ₹25,500–81,100 per month, plus applicable allowances. Not a 2026 in-hand salary claim.",
          ["2023 baseline: Marathi, English, general knowledge and intellectual/quantitative aptitude", "Use the current official syllabus before buying preparation material"],
          "2026 vacancy and recruitment-route claims in coaching/news pages are not confirmed here. This historical guide must not be used as an open application notice.",
          ["talathi", "mpsc", "talathi-institute"], ["Talathi / Revenue Clerk"]),
    guide("Police Constable — State Recruitment", "Police Constable", "State-specific • Maharashtra example", "Maharashtra Police joining/recruitment guidance",
          "Constabulary recruitment is organised under state or force-specific rules. A Maharashtra qualification is not an all-India constable rule.",
          ["Maharashtra general constable entry uses Class 12/equivalent, subject to the qualifications and exceptions in the current unit advertisement.", "Age, reservation, domicile/language conditions, physical measurements, endurance and medical requirements must be checked in the selected state's notice.", "Driver, armed-police and other specialised posts can have extra licences or distinct requirements. SSC GD and RPF are separate recruitments."],
          ["Maharashtra reference: physical assessment and written examination, then prescribed document, medical and character checks.", "Order, marks and qualifying standards are controlled by the current recruitment rules."],
          "Use the state/force and exact post's advertised basic-pay matrix. There is no single national constable take-home salary.",
          ["Language, arithmetic, reasoning and state/general knowledge per the notice", "Fitness practice based on the relevant running and physical-test standards"],
          "Do not copy one state's age, height or running requirements to another state, sex or category. Read applicable exceptions before ruling yourself eligible or ineligible.",
          ["police", "police-notices", "constable-institute"]),
]

_BY_ALIAS = {slugify(alias): g for g in GUIDES for alias in [g["slug"], *g["aliases"]]}


def government_career(value):
    """Return a fresh response, without stale AI fields or manufactured market data."""
    g = _BY_ALIAS.get(slugify(value or ""))
    if not g:
        return None
    profile = deepcopy(g)
    profile.pop("aliases", None)
    profile["notice"] = NOTICE
    profile["payNote"] = PAY_NOTE
    return {
        "career_id": f"career-{g['slug']}", "slug": g["slug"], "title": g["title"],
        "category": "Government Exam", "field": "Government Exam", "icon": "Landmark",
        "iconColor": "#475569", "description": g["summary"], "shortDescription": g["summary"],
        "tags": ["Government", g["scope"]], "avgSalary": {}, "roadmap": [], "jobs": [],
        "skills": [], "governmentProfile": profile, "detailsGeneratedByAI": False,
        "dataSource": "editorial-government-v1", "salaryLabel": "See official pay rules",
    }


def government_careers(query=None):
    q = (query or "").strip().casefold()
    return [government_career(g["slug"]) for g in GUIDES
            if not q or q in " ".join([g["title"], g["scope"], *g["aliases"]]).casefold()]
