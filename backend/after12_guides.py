"""After 12th — quick-entry, short-certification and government-exam roles.

New guides use official sources checked on 2026-10-13: DGT CTS curricula (Cosmetology 1 yr; Data Entry Operator 6 months;
Electrician, Mechanic Motor Vehicle, Refrigeration & AC Technician and Electronics Mechanic 2 yrs with Class 10 Science +
Maths; Interior Design & Decoration 1 yr), Beauty & Wellness Sector Skill Council and ESSCI qualification packs, Yoga
Certification Board (Ministry of Ayush) levels, and Agniveer criteria from recent Indian Army notifications.
Menu titles that already have a full guide elsewhere are mapped through ALIASES.
No salary figures are given because there is no official source for them.
"""
from copy import deepcopy

from career_catalog import slugify
from gov_guide_kit import fact, institute, paper, related, source, stage, step
from tech_guides import _guide

BACK = ["/careers-explore?field=after12", "← All After 12th careers"]
QUICK, SHORT, GOVT = "Immediate Entry (under 6 months)", "Short Certification (6-12 months)", "Government Exams"
LABELS = {"nav": {"role": "What you do", "steps": "Start to end", "eligibility": "Education & eligibility", "exam": "How you get hired",
                  "passing": "Ready checklist", "calendar": "Timeline", "prepare": "How to learn", "salary": "Career growth", "faqs": "FAQs",
                  "institutes": "Where to train", "government-sources": "Sources"}}
ELIG = [
    "Choose courses from recognised bodies (ITI/DGT, Sector Skill Councils, government institutes) — certificates from unrecognised centres carry little value.",
    "Hands-on practice and a portfolio or work record matter as much as the certificate.",
]

# Menu titles that should open an existing, more detailed guide.
ALIASES = {
    "reels-video-editor": "reels-short-form-editor", "tally-accountant": "accounts-executive-tally-gst", "seo-executive": "seo-specialist",
    "social-media-executive": "social-media-manager", "cabin-crew": "cabin-crew-air-hostess", "hotel-front-desk-staff": "hotel-front-office-executive",
    "lab-technician": "lab-technician-dmlt", "junior-android-developer": "android-developer", "photo-video-editor": "video-editor",
    "drone-pilot": "drone-pilot-operator",
}


def _a12(slug, title, short, headline, summary, group, *, icon="Wrench", hiring, **kw):
    return _guide(slug, title, short, headline, summary, group=group, scope_prefix="After 12th", back=BACK, icon=icon, color="#16A34A",
                  category="After 12th", authority="Jobs, apprenticeships and self-employment", eligibility=ELIG, labels=LABELS,
                  exam_heading="How you get hired — step by step", hiring=hiring, test_topics="", interview_topics="", assignment="", **kw)


def _hire(course, practical, start):
    return [stage("Step 1 — Recognised training", course[0], course[1], [], course[2]),
            stage("Step 2 — Practical test / trade test", "End of course", "Hands-on assessment of real tasks.",
                  [paper(practical, "Practical", "Varies", "Practise the full task end to end")], "Pass the practical."),
            stage("Step 3 — Apprenticeship or first job", start[0], start[1], [], start[2]),
            stage("Step 4 — Grow or start your own work", "After experience", "Build clients, licences and reputation.", [], "Steady income and repeat customers.")]


def _extra(tools, day, earn):
    return [
        {"id": "tools", "nav": "Tools", "heading": "Tools you will use", "columns": ["Tool", "Used for"], "rows": tools},
        {"id": "typical-day", "nav": "A typical day", "heading": "A typical day in this work", "items": day},
        {"id": "ways-to-earn", "nav": "Ways to earn", "heading": "Ways to work and earn", "columns": ["Path", "What it's like"], "rows": earn},
    ]


def _simple(levels3, timeline, prep_focus, ladder3):
    return dict(levels=[["Beginner", levels3[0]], ["Trained", levels3[1]], ["Experienced", levels3[2]]],
                timeline=timeline, prep=[{"phase": "Train and practise", "duration": timeline[-1][1], "focus": prep_focus}],
                ladder=[["Start", ladder3[0], "0–2 years", "Learn on the job"], ["Mid", ladder3[1], "2–5 years", "Independent work"],
                        ["Senior", ladder3[2], "5+ years", "Lead or own business"]])


# ---------- Institutes / official resources ----------
DGT = institute("ITIs — Craftsmen Training Scheme (DGT)", "Directorate General of Training (MSDE)", "https://dgt.gov.in/",
                "Government and private ITIs offering NCVT trades with practical training and the National Trade Certificate.",
                "10th/12th pass students who want job-ready technical trades.", mode="Full-time at ITIs")
BHARATSKILLS = institute("Bharat Skills (DGT)", "Official ITI learning portal", "https://bharatskills.gov.in/",
                         "Free curricula, question banks and e-learning for ITI trades.", "ITI students and self-learners.", mode="Online", fee="Free")
SID = institute("Skill India Digital Hub", "Government of India skilling portal", "https://www.skillindiadigital.gov.in/home",
                "Short courses and Sector Skill Council certifications for hundreds of job roles.", "Anyone looking for recognised short courses.", mode="Online + training centres")
BWSSC = institute("Beauty & Wellness Sector Skill Council (B&WSSC)", "Sector Skill Council (MSDE)", "https://www.bwssc.in/",
                  "NSQF qualifications such as Professional Make-up Artist, Bridal/Fashion Make-up Artist, Hair Dresser & Stylist and Nail Technician through training partners.",
                  "Beauty learners who want recognised certificates.", mode="Through accredited training partners")
ESSCI = institute("Electronics Sector Skills Council of India (ESSCI)", "Sector Skill Council (MSDE)", "https://essc-india.org/",
                  "NSQF courses such as CCTV Installation Technician and smartphone repair through training partners.",
                  "Learners who want electronics service certificates.", mode="Through training partners")
NIELIT = institute("NIELIT — CCC and computer courses", "Government (MeitY) institute", "https://www.nielit.gov.in/",
                   "Course on Computer Concepts (CCC) and other basic computer courses widely accepted for office jobs.", "Data entry and office job seekers.", mode="Online/centres")
YCB = institute("Yoga Certification Board (Ministry of Ayush)", "Government certification body", "https://yogacertificationboard.nic.in/",
                "Certification levels: Yoga Protocol Instructor (Level 1), Yoga Wellness Instructor (Level 2), Yoga Teacher & Evaluator (Level 3), plus volunteer and therapy tracks.",
                "Anyone who wants an official yoga certificate.", mode="Assessment through YCB")
LNIPE = institute("Lakshmibai National Institute of Physical Education (LNIPE), Gwalior", "Deemed university (Ministry of Youth Affairs & Sports)", "https://lnipe.edu.in/",
                  "B.P.Ed, BSc/MSc in physical education and sports sciences.", "Students aiming for degree-level fitness and sports careers.", mode="Full-time")
NSNIS = institute("NSNIS Patiala (Sports Authority of India)", "Government sports institute", "https://nsnis.org/",
                  "Coaching and sports-science certificate and diploma courses.", "Coaches and fitness professionals.", mode="Full-time / short courses")
CEA = institute("Central Electricity Authority — safety regulations", "Government regulator", "https://cea.nic.in/",
                "Electrical safety regulations; state licensing boards issue electrical worker/contractor licences under these rules.", "Electricians.", mode="Online information")
DCMSME = institute("MSME Technology Centres / Tool Rooms (Ministry of MSME)", "Government training centres", "https://www.dcmsme.gov.in/",
                   "Long and short courses in CNC programming, tool & die making and machining at MSME Technology Centres across India.", "ITI/diploma holders moving to CNC.", mode="Classroom + workshop")
ARMY = institute("Join Indian Army — Agniveer recruitment", "Indian Army official portal", "https://joinindianarmy.nic.in/",
                 "Agniveer registration, notifications, admit cards and results.", "10th/12th pass candidates for Army GD, Technical and Clerk roles.", mode="Online (official portal)")


# ---------- Guides ----------
def _beauty(slug, title, short, summary, tools, faqs_extra, related_items, *, course, basics):
    """course: one sentence naming the recognised course(s); basics: role-specific basics such as 'skin types and colour matching'."""
    return _a12(slug, title, short, f"How to become a {title}", summary, QUICK, icon="Sparkles",
                duties=["Consult clients and understand the look they want", "Prepare skin/hair/nails hygienically", "Apply techniques and products safely",
                        "Do patch tests and avoid allergic reactions", "Maintain tools and hygiene", "Build a portfolio and repeat clients"],
                postings=["Salons, bridal studios, film/TV, fashion shoots, freelance home service"],
                facts=[fact("Education", "10th/12th + recognised course"), fact("Training", "ITI Cosmetology (1 yr) or B&WSSC certificate"),
                       fact("Key skills", "Hygiene, technique, customer handling"), fact("Portfolio", "Before/after photos (with consent)"), fact("Work", "Weekends and wedding seasons are busy")],
                steps=[step("Choose a recognised course", "Month 1", f"{course} Recognised certificates carry more weight with salons and clients than certificates from unknown centres. "
                                                                      "Check that the centre is an ITI or an accredited training partner before you pay any fee."),
                       step("Learn hygiene and basics", "Months 1–2", f"Learn sanitisation and patch tests, along with {basics}, before you work on anyone. "
                                                                      "Good hygiene protects clients from infections and allergic reactions. "
                                                                      "Clients come back to artists they trust to be clean and safe."),
                       step("Practise daily", "Months 2–4", "Practise every day on friends and family who agree to be your models. "
                                                            "Take photos of your work, with their consent, to build your portfolio. "
                                                            "Daily practice improves your speed and neatness faster than anything else."),
                       step("Assist a professional", "Months 3–6", "Work as an assistant to a senior artist or in a salon to learn real client handling. "
                                                                  "You will see how professionals consult clients, manage time and deal with problems. "
                                                                  "This experience also builds contacts for future work."),
                       step("Start working", "Month 4+", "Join a salon or start freelancing once you have a portfolio and a recognised certificate. "
                                                         "Charge fair prices while you build experience and repeat clients. Weekends and wedding seasons are busy, so plan your bookings early.")],
                hiring=_hire(("1–12 months", "Recognised beauty course.", "Course completed."), "Do a full look/service on a model",
                             ("After course", "Salon job or assistant to a senior artist.", "Regular clients.")),
                checklist=["You follow hygiene and patch-test rules.", "You have a portfolio.", "You can handle clients politely.", "You hold a recognised certificate."],
                resources=[{"label": "B&WSSC", "url": "https://www.bwssc.in/", "note": "Recognised beauty qualifications."}],
                special=["Use good-quality, in-date products and always patch-test to avoid allergic reactions.", "Take client consent before posting their photos."],
                mistakes=["Poor hygiene.", "No portfolio.", "Overcharging without experience."],
                faqs=[{"q": "Do I need a degree?", "a": "No, you do not need a degree for this work. A recognised course and a strong portfolio matter most to salons and clients. "
                                                         "Keep adding new work to your portfolio as you improve."}, *faqs_extra,
                      {"q": "Can I work from home?", "a": "Yes, many artists offer home or bridal services after building a client base. "
                                                          "Start with people you know and grow through referrals and social media. Keep the same strict hygiene at home as you would in a salon."}],
                related_items=related_items, institutes=[BWSSC, DGT, SID],
                sources=[source("DGT — Cosmetology (CTS)", "https://dgt.gov.in/sites/default/files/Cosmetology_CTS2.0_NSQF-3.pdf", "1 year, Class 10 pass."),
                         source("Beauty & Wellness Sector Skill Council", "https://www.bwssc.in/", "Qualification packs.")],
                extra_sections=_extra(tools, ["Prepare kit and sanitise", "Client consultation", "Service", "Photos for portfolio (with consent)", "Follow-up and bookings"],
                                      [["Salon job", "Steady clients and training"], ["Freelance", "Weddings and events"], ["Own studio", "After experience"]]),
                **_simple(["Basic techniques and hygiene", "Full services for clients", "Bridal/fashion or advanced work"], [("Course", "1–12 months"), ("Practice + portfolio", "3–6 months")],
                          ["Daily practice", "Portfolio"], ["Assistant / Junior", "Artist / Stylist", "Senior artist / studio owner"]))


MAKEUP = _beauty("makeup-artist", "Makeup Artist", "Makeup",
                 "A makeup artist creates looks for brides, events, photo shoots, film and fashion using professional makeup techniques. "
                 "The work needs strict hygiene, good knowledge of skin and products, and polite client handling. "
                 "Most artists start in a salon or as an assistant, then build a portfolio and take bridal and event bookings.",
                 [["Brush and sponge kit", "Application"], ["Makeup products", "Looks"], ["Ring light / mirror", "Lighting"], ["Sanitiser and disposables", "Hygiene"]],
                 [{"q": "Which certificate is recognised?", "a": "B&WSSC qualifications such as Professional Make-up Artist, or ITI Cosmetology, are recognised. "
                                                                 "Take the course at an ITI or an accredited B&WSSC training partner. Your portfolio still decides whether clients book you."}],
                 [related("hair-stylist", "Hair Stylist", "Beauty"), related("mehendi-artist", "Mehendi Artist", "Bridal services"), related("nail-art-technician", "Nail Art Technician", "Beauty")],
                 course="Join ITI Cosmetology or a B&WSSC course such as Professional Make-up Artist or Bridal/Fashion Make-up Artist.",
                 basics="skin types and colour matching")
MEHENDI = _beauty("mehendi-artist", "Mehendi Artist", "Mehendi",
                  "A mehendi artist designs henna patterns for weddings, festivals and events. "
                  "The work needs steady hands, a good sense of design and safe, natural henna. "
                  "Weddings and festivals are the busiest times, and most artists grow through referrals and a strong portfolio.",
                  [["Henna cones", "Designs"], ["Design books/app", "Patterns"], ["Lemon-sugar mix", "Colour"], ["Gloves and wipes", "Hygiene"]],
                  [{"q": "Is chemical 'black henna' safe?", "a": "No, avoid 'black henna' and other products with harmful additives. "
                                                                 "Use natural henna and do a patch test before applying a full design. A skin reaction can harm the client and your reputation."}],
                  [related("makeup-artist", "Makeup Artist", "Bridal services"), related("nail-art-technician", "Nail Art Technician", "Beauty"), related("hair-stylist", "Hair Stylist", "Beauty")],
                  course="Join ITI Cosmetology or a B&WSSC-aligned beauty course, and pick one with plenty of hands-on mehendi practice.",
                  basics="cone making and steady line work")
HAIR = _beauty("hair-stylist", "Hair Stylist", "Hair Styling",
               "A hair stylist cuts, colours, treats and styles hair in salons, studios and for events. "
               "The work needs good technique, hygiene and the skill to understand what each client wants. "
               "Most stylists start as salon assistants and grow into senior stylists or studio owners.",
               [["Scissors and clippers", "Cutting"], ["Dryers and irons", "Styling"], ["Colour kit", "Colouring"], ["Sterilisation tools", "Hygiene"]],
               [{"q": "Which certificate?", "a": "ITI Cosmetology or the B&WSSC Hair Dresser & Stylist qualification are good recognised options. "
                                                 "Choose a centre with plenty of practical sessions on real clients or models. "
                                                 "Salons also check your cutting and styling skills in a practical test."}],
               [related("makeup-artist", "Makeup Artist", "Beauty"), related("nail-art-technician", "Nail Art Technician", "Beauty"), related("mehendi-artist", "Mehendi Artist", "Bridal services")],
               course="Join ITI Cosmetology or the B&WSSC Hair Dresser & Stylist course.",
               basics="hair and scalp types")
NAILS = _beauty("nail-art-technician", "Nail Art Technician", "Nail Art",
                "A nail technician does manicures, pedicures, nail extensions and nail art safely and hygienically. "
                "Clean tools and correct use of products are important to avoid infections and damage to nails. "
                "Most technicians start in salons and later offer home services or open their own studio.",
                [["Nail kit", "Manicure/pedicure"], ["Gel and UV/LED lamp", "Extensions"], ["Nail art tools", "Designs"], ["Sterilisation", "Hygiene"]],
                [{"q": "Which certificate?", "a": "The B&WSSC Nail Technician qualification or a recognised cosmetology course are good options. "
                                                  "Choose a centre that teaches hygiene and the safe use of gel and UV/LED lamps. A portfolio of your nail designs helps you get clients."}],
                [related("makeup-artist", "Makeup Artist", "Beauty"), related("hair-stylist", "Hair Stylist", "Beauty"), related("mehendi-artist", "Mehendi Artist", "Beauty")],
                course="Join a B&WSSC Nail Technician course or a recognised cosmetology course such as ITI Cosmetology.",
                basics="nail and skin health")

DEO = _a12(
    "data-entry-operator", "Data Entry Operator", "Data Entry", "How to become a Data Entry Operator",
    "A data entry operator types and updates information in computers — forms, records, invoices and databases — accurately and fast. "
    "Offices, banks, hospitals, BPOs and government offices hire operators, often on contract. "
    "Typing speed, accuracy and basic Excel are the key skills.", QUICK, icon="Keyboard",
    duties=["Enter data from documents into systems", "Check and correct errors", "Maintain records and files", "Prepare simple reports in Excel", "Follow data privacy rules"],
    postings=["Offices, banks (contract), hospitals, government offices (contract/exam-based), BPOs"],
    facts=[fact("Education", "10th (ITI) / 12th or graduation (jobs)"), fact("ITI course", "Data Entry Operator — 6 months (DGT)"), fact("Key skill", "Typing speed + accuracy"),
           fact("Certificate", "NIELIT CCC helps"), fact("Govt route", "SSC CHSL (DEO) needs 12th — see that guide")],
    steps=[step("Learn computer basics", "Month 1", "Learn to use Windows, MS Office, Excel and the internet confidently. "
                                                    "Practise creating files, saving them in folders and making simple Excel sheets. "
                                                    "These basics are needed for every office job."),
           step("Build typing speed", "Months 1–3", "Practise English and Hindi typing every day. "
                                                    "Focus on accuracy first, then slowly increase your speed. "
                                                    "Employers and government skill tests check both."),
           step("Get a certificate", "Months 1–6", "Earn a certificate such as the ITI Data Entry Operator course (6 months) or NIELIT CCC. "
                                                   "A recognised certificate shows employers that you have proper computer training. "
                                                   "Choose a government or recognised centre so your certificate is accepted."),
           step("Apply for jobs", "After", "Apply to offices, BPOs and hospitals, where you will usually face a typing and Excel test. "
                                           "For government DEO posts, prepare for SSC CHSL, which needs 12th pass and a skill test. "
                                           "Avoid 'work from home' offers that ask you to pay a fee.")],
    hiring=_hire(("6 months", "ITI Data Entry Operator or a computer course.", "Certificate earned."), "Typing and Excel test", ("After course", "Office/BPO job.", "Confirmed role.")),
    checklist=["You type fast with high accuracy.", "You know Excel basics.", "You have a computer certificate.", "You keep data confidential."],
    resources=[{"label": "NIELIT", "url": "https://www.nielit.gov.in/", "note": "CCC and computer courses."}],
    special=["For government DEO posts, see the SSC CHSL guide — it requires 12th pass and a typing/skill test."],
    mistakes=["Low accuracy.", "Ignoring Excel.", "Sharing data carelessly."],
    faqs=[{"q": "What typing speed is needed?", "a": "It depends on the employer, and government skill tests set their own speed standards. "
                                                     "Check the official notice or the job post for the exact speed required. "
                                                     "Aim for high accuracy too, because mistakes usually count against you."},
          {"q": "Is 10th enough?", "a": "For the ITI Data Entry Operator course, Class 10 is enough. "
                                        "Most office jobs prefer 12th or graduation. "
                                        "Keep studying alongside your course to open more job options."},
          {"q": "Can I work from home?", "a": "Some genuine work-from-home data entry jobs exist. "
                                              "Beware of fee-based 'work from home' scams that ask you to pay before giving you work. "
                                              "Genuine employers do not charge you money to start a job."}],
    related_items=[related("accounts-executive-tally-gst", "Tally Accountant", "Office accounts"), related("ldc-deo-postal-assistant", "SSC CHSL — DEO", "Government route"), related("cctv-installer", "CCTV Installer", "Other quick-entry")],
    institutes=[DGT, NIELIT, SID, BHARATSKILLS],
    sources=[source("DGT — Data Entry Operator (CTS)", "https://dgt.gov.in/sites/default/files/2024-01/Data%20Entry%20Operator_CTS2.0%20NSQF-3.pdf", "6 months, Class 10 pass, age 14.")],
    extra_sections=_extra([["Computer + keyboard", "Typing"], ["MS Excel", "Records"], ["Office software", "Documents"], ["Scanner", "Digitising"]],
                          ["Collect documents", "Enter and verify data", "Fix errors", "Daily report"],
                          [["Office job", "Fixed hours"], ["BPO/back office", "Shift work"], ["Government contract/SSC", "Exam-based route"]]),
    **_simple(["Typing and computer basics", "Accurate fast entry", "Supervising data teams"], [("Basics", "Month 1"), ("Course + typing", "Months 1–6")], ["Typing", "Excel"],
              ["Data Entry Operator", "Senior Operator / MIS Executive", "Supervisor / Office Assistant"]))


def _trade(slug, title, short, summary, iti, src_label, src_url, duties, tools, faqs, related_items, extra_inst, special, icon="Wrench", group=QUICK, *, course):
    """iti: short entry-route text for the Education fact; course: 2-3 sentence detail for the first step."""
    return _a12(slug, title, short, f"How to become a {title}", summary, group, icon=icon,
                duties=duties, postings=["Service companies, dealers, builders, factories, maintenance teams, self-employment"],
                facts=[fact("Education", iti), fact("Training", "ITI (DGT) or diploma + apprenticeship"), fact("Key skills", "Safety, diagnosis, hands-on work"),
                       fact("Certificate", "National Trade Certificate (NCVT)"), fact("Growth", "Supervisor, contractor or own shop")],
                steps=[step("Join a recognised course", "After 10th/12th", course),
                       step("Learn safety first", "From day 1", "Learn to use PPE, handle tools correctly and follow safe working practices from the first day. "
                                                                "Skipping safety steps can cause injuries and costly damage. Make safety checks a habit before every job."),
                       step("Practise in workshops", "During course", "Practise real tasks in the workshop under your instructor's supervision. "
                                                                     "Repeat each task until you can do it correctly without help. "
                                                                     "Your practical skill is what the trade test checks at the end of the course."),
                       step("Do an apprenticeship", "After ITI", "Do an apprenticeship, which is paid on-the-job training with a company. "
                                                                 "You learn how real customers, sites and deadlines work. A good apprenticeship record also helps you get hired."),
                       step("Get a job or licence", "After", "Look for jobs with companies, service centres, dealers, factories or firms that need your trade. "
                                                             "If your work needs a state licence, apply for it as per your state's rules. Keep your certificates and work record ready for employers."),
                       step("Grow", "Later", "With experience, you can become a supervisor or contractor, or start your own business. "
                                             "Repeat customers and good reviews help you grow. Keep learning new tools and methods in your trade.")],
                hiring=_hire(("As per course", "ITI trade or diploma.", "National Trade Certificate."), "Trade practical test", ("After ITI", "Apprenticeship/service job.", "Hired.")),
                checklist=["You follow safety rules every time.", "You can diagnose and fix common faults.", "You completed an apprenticeship or real jobs.", "You have the certificate/licence your work needs."],
                resources=[{"label": src_label, "url": src_url, "note": "Official trade curriculum."}, {"label": "Bharat Skills", "url": "https://bharatskills.gov.in/", "note": "Free ITI resources."}],
                special=special, mistakes=["Skipping safety.", "No practical experience.", "Using cheap, unsafe parts."],
                faqs=faqs, related_items=related_items, institutes=[DGT, BHARATSKILLS, *extra_inst],
                sources=[source(src_label, src_url, "Duration, entry qualification and syllabus.")],
                extra_sections=_extra(tools, ["Check job list", "Travel to site/workshop", "Diagnose and repair", "Test and hand over", "Collect payment/update records"],
                                      [["Company job", "Steady salary, training"], ["Service centre/dealer", "Brand-specific work"], ["Own business", "After experience and licences"]]),
                **_simple(["Tools and safety", "Independent repairs", "Complex jobs and supervision"], [("ITI/diploma", "1–2 years"), ("Apprenticeship", "6–12 months")],
                          ["Safety", "Practical work"], ["Technician / Apprentice", "Senior Technician", "Supervisor / own business"]))


ELECTRICIAN = _trade("electrician", "Electrician", "Electrician", "An electrician installs, maintains and repairs wiring, switchboards, motors and electrical equipment in homes, buildings and factories. "
                                                                  "The work needs strong safety habits, because mistakes can cause shocks or fires. "
                                                                  "Independent electrical work also needs a licence or permit from your state's licensing board.",
                     "ITI Electrician — 2 years; Class 10 with Science and Maths; age 14+", "DGT — Electrician (CTS)", "https://dgt.gov.in/sites/default/files/2024-01/Electrician_CTS2.0_NSQF-4.pdf",
                     ["House and building wiring", "Install and repair switchboards and fittings", "Maintain motors and panels", "Test with meters and fix faults", "Follow electrical safety rules"],
                     [["Multimeter / tester", "Measurements"], ["Insulated tools", "Safe work"], ["Megger", "Insulation tests"], ["PPE", "Safety"]],
                     [{"q": "Do I need a licence?", "a": "To work on installations independently, states require an electrical worker or wireman licence or permit from the state licensing board. "
                                                         "The rules and names of licences differ from state to state. "
                                                         "Check with your state's licensing board before you take contract work."},
                      {"q": "Can I join after 12th?", "a": "Yes, ITI Electrician needs Class 10 with Science and Maths, so 12th pass students can also join. "
                                                           "Your extra schooling helps with the theory subjects. "
                                                           "Check the admission dates of government ITIs in your state."},
                      {"q": "Is there government work?", "a": "Railways, state electricity boards and PSUs recruit ITI electricians through their own exams. "
                                                              "Watch their official notifications for eligibility and dates. "
                                                              "Keep your National Trade Certificate and apprenticeship documents ready to apply."}],
                     [related("ac-repair-technician", "AC Repair Technician", "Related trade"), related("cctv-installer", "CCTV Installer", "Related trade"), related("automobile-technician", "Automobile Technician", "Technical trade")],
                     [CEA], ["Never work on live circuits without isolation and proper PPE.", "State licences are required for independent electrical work — check your state's licensing board."], icon="Zap",
              course="Join the ITI Electrician trade, which takes 2 years and needs Class 10 with Science and Maths; the minimum age is 14. "
                     "You learn wiring, motors, testing and electrical safety through workshop practice. "
                     "When you pass, you receive the National Trade Certificate (NCVT).")
MOBILE = _trade("mobile-repair-technician", "Mobile Repair Technician", "Mobile Repair", "A mobile repair technician diagnoses and fixes smartphones — screens, batteries, charging ports, boards and software issues. "
                                                                                         "The work needs careful hands, electronics knowledge and honesty with customer data. "
                                                                                         "Many technicians work in service centres first and later run their own shops.",
                "10th + ITI Electronics Mechanic (2 yrs) or ESSCI smartphone repair course", "DGT — Electronics Mechanic (CTS)", "https://dgt.gov.in/sites/default/files/2024-01/Electronics%20Mechanic_CTS2.0_NSQF-4.pdf",
                ["Diagnose hardware and software faults", "Replace screens, batteries, ports", "Board-level soldering (advanced)", "Flash/update software", "Advise customers on data backup"],
                [["Soldering station / hot air", "Board repair"], ["Multimeter", "Testing"], ["Screwdriver and opening kit", "Disassembly"], ["Software tools", "Flashing"]],
                [{"q": "Can I start without ITI?", "a": "Yes, short ESSCI-aligned courses exist for smartphone repair. "
                                                        "However, ITI Electronics Mechanic gives stronger fundamentals for board-level work. "
                                                        "You can start with a short course and learn deeper electronics later."},
                 {"q": "Is this a good business?", "a": "Many technicians run their own shops after gaining experience. "
                                                        "Success depends on skill, honest pricing and good customer service. "
                                                        "Work in a service centre first to learn repairs and how the business runs."},
                 {"q": "What about customer data?", "a": "Never copy or misuse customer data on phones you repair. "
                                                         "Ask customers to back up their data before the repair. "
                                                         "Respecting privacy builds trust and brings repeat customers."}],
                [related("cctv-installer", "CCTV Installer", "Electronics"), related("electrician", "Electrician", "Electrical"), related("ac-repair-technician", "AC Repair Technician", "Service trade")],
                [ESSCI], ["Respect customer privacy — never access or copy personal data on phones you repair."], icon="Smartphone",
              course="Join ITI Electronics Mechanic (2 years after Class 10) or an ESSCI smartphone repair course. "
                     "The ITI gives stronger electronics fundamentals, while short ESSCI courses focus directly on phone repair. "
                     "Choose a centre with plenty of hands-on practice on real phones.")
AC = _trade("ac-repair-technician", "AC Repair Technician", "AC Repair", "An AC and refrigeration technician installs, services and repairs air conditioners, refrigerators and cold-storage systems. "
                                                                         "The work combines electrical skills with refrigerant handling, which needs proper training. "
                                                                         "Summer is the peak season, but servicing and commercial refrigeration work continue all year.",
            "ITI Refrigeration & AC Technician — 2 years; Class 10 with Science and Maths", "DGT — Refrigeration and Air Conditioning Technician (CTS)",
            "https://dgt.gov.in/sites/default/files/2024-01/Ref.%20_%20Air%20Conditioning%20Tech._CTS2.0_NSQF-4.pdf",
            ["Install split/window ACs", "Service and gas charging", "Diagnose compressor and electrical faults", "Repair fridges and cold rooms", "Follow refrigerant safety"],
            [["Gauge manifold", "Gas pressure"], ["Vacuum pump", "Evacuation"], ["Brazing kit", "Pipe joints"], ["Clamp meter", "Electrical checks"]],
            [{"q": "Is summer the only busy season?", "a": "Summer is the peak season for AC work. "
                                                           "However, servicing, installation and commercial refrigeration run all year. "
                                                           "Building commercial clients helps you earn steadily outside summer."},
             {"q": "Do brands hire ITI technicians?", "a": "Yes, brands hire ITI technicians through their service partners and apprenticeships. "
                                                           "Brand training teaches you their models and service process. "
                                                           "This experience helps if you later start your own service business."},
             {"q": "Is refrigerant handling risky?", "a": "It needs proper training, because refrigerants are under pressure and must be recovered safely. "
                                                          "Follow safety and environmental handling rules on every job. "
                                                          "Never vent refrigerants carelessly into the air."}],
            [related("electrician", "Electrician", "Electrical"), related("automobile-technician", "Automobile Technician", "Technical trade"), related("mobile-repair-technician", "Mobile Repair Technician", "Service trade")],
            [ESSCI], ["Refrigerants must be handled and recovered safely — never vent them carelessly."], icon="AirVent",
              course="Join the ITI Refrigeration & AC Technician trade, which takes 2 years and needs Class 10 with Science and Maths. "
                     "You learn installation, gas charging, brazing and electrical fault-finding in the workshop. "
                     "When you pass, you receive the National Trade Certificate (NCVT).")
CCTV = _trade("cctv-installer", "CCTV Installer", "CCTV", "A CCTV installer sets up and maintains security cameras, recorders and networks for homes, shops and offices. "
                                                          "The work combines electrical wiring with basic networking for IP cameras and mobile viewing. "
                                                          "Installers must also respect privacy when choosing where cameras point.",
              "ITI Electronics/Electrician or diploma; ESSCI CCTV Installation Technician course", "DGT — Electronics Mechanic (CTS)", "https://dgt.gov.in/sites/default/files/2024-01/Electronics%20Mechanic_CTS2.0_NSQF-4.pdf",
              ["Plan camera positions", "Install cameras, cabling and DVR/NVR", "Configure network and mobile viewing", "Maintain and troubleshoot", "Explain privacy and usage to clients"],
              [["Drill and cable tools", "Installation"], ["Crimping tools", "Network cables"], ["Laptop", "Configuration"], ["Ladder and PPE", "Safety"]],
              [{"q": "Which course?", "a": "ESSCI's CCTV Installation Technician qualification is a recognised course for this work. "
                                           "An electronics or electrical ITI or diploma is the usual base before it. "
                                           "Hands-on practice with real cameras and recorders matters most."},
               {"q": "Do I need networking skills?", "a": "Yes, IP cameras need basic networking to connect and to allow mobile viewing. "
                                                          "Learn IP addresses, routers and how to set up remote access safely. "
                                                          "Networking skills also help you take on bigger office installations."},
               {"q": "Any privacy rules?", "a": "Advise clients not to record the private spaces of others, such as neighbours' homes. "
                                                "Ask them to display notices where needed so people know cameras are in use. "
                                                "Respecting privacy protects your clients and your business from complaints."}],
              [related("electrician", "Electrician", "Electrical"), related("mobile-repair-technician", "Mobile Repair Technician", "Electronics"), related("data-entry-operator", "Data Entry Operator", "Other quick-entry")],
              [ESSCI], ["Respect privacy — position cameras so they don't record neighbours' private spaces."], icon="Cctv",
              course="Start with an electronics or electrical ITI or diploma, and add ESSCI's CCTV Installation Technician course. "
                     "The ITI gives you wiring and electronics basics, while the ESSCI course focuses on cameras, recorders and setup. "
                     "Choose a centre where you install and configure real systems.")
AUTO = _trade("automobile-technician", "Automobile Technician", "Automobile", "An automobile technician services and repairs cars and bikes — engines, brakes, electrical systems and diagnostics. "
                                                                              "Modern vehicles use scanners and electronics, so technicians need both mechanical and diagnostic skills. "
                                                                              "Electric vehicles are a fast-growing part of the service market.",
              "ITI Mechanic Motor Vehicle — 2 years; Class 10 with Science and Maths", "DGT — Mechanic Motor Vehicle (CTS)", "https://dgt.gov.in/sites/default/files/2023-12/Mechanic%20Motor%20Vehicle_CTS2.0_NSQF-4_0.pdf",
              ["Periodic servicing", "Diagnose engine and electrical faults", "Repair brakes, suspension and clutch", "Use scanners for diagnostics", "Road-test and hand over"],
              [["Hand and power tools", "Repairs"], ["OBD scanner", "Diagnostics"], ["Lift/jack", "Access"], ["Torque wrench", "Correct fitting"]],
              [{"q": "Should I learn EV too?", "a": "Yes, learning EV basics keeps you ready for the future. "
                                                    "The ITI 'Mechanic Electric Vehicle' trade or other EV training can help you move into this area. "
                                                    "Electric vehicles are a fast-growing part of the service market."},
               {"q": "Do dealerships hire ITI holders?", "a": "Yes, dealerships hire ITI holders, often through apprenticeships. "
                                                              "Dealership training teaches you the brand's models and diagnostic tools. "
                                                              "Good work during the apprenticeship can lead to a regular job."},
               {"q": "Can I open a garage?", "a": "Many technicians open a garage after gaining experience. "
                                                  "Follow your local trade licence rules before you start. "
                                                  "Good tools and a diagnostic scanner help you handle modern vehicles."}],
              [related("ev-technician-engineer", "EV Technician", "Electric vehicles"), related("electrician", "Electrician", "Electrical"), related("ac-repair-technician", "AC Repair Technician", "Technical trade")],
              [SID], ["Learn EV basics — electric vehicles are a fast-growing part of the service market."], icon="Car",
              course="Join the ITI Mechanic Motor Vehicle trade, which takes 2 years and needs Class 10 with Science and Maths. "
                     "You learn engines, brakes, suspension and vehicle electrical systems in the workshop. "
                     "When you pass, you receive the National Trade Certificate (NCVT).")
INTERIOR = _trade("interior-design-assistant", "Interior Design Assistant", "Interior Design", "An interior design assistant helps designers with measurements, drawings, 3D views, material selection and site coordination. "
                                                                                               "The role is a practical entry point into interior design. "
                                                                                               "With a diploma or degree and a portfolio, assistants can grow into designers.",
                  "ITI Interior Design & Decoration — 1 year; Class 10 with Science and Maths; or a diploma", "DGT — Interior Design & Decoration (CTS)",
                  "https://dgt.gov.in/sites/default/files/Interior%20Design%20_%20Decoration_CTS2.0_NSQF-3.pdf",
                  ["Take site measurements", "Prepare 2D drawings and 3D views", "Select materials and finishes", "Coordinate with vendors and site workers", "Track budgets and timelines"],
                  [["AutoCAD", "Drawings"], ["SketchUp", "3D models"], ["Measuring tape/laser", "Site measurement"], ["Material catalogues", "Selection"]],
                  [{"q": "Is ITI enough?", "a": "ITI is a good start for assistant roles. "
                                                "A diploma or degree helps you grow into a designer who handles projects on your own. "
                                                "Keep building a portfolio of drawings and 3D views as you learn."},
                   {"q": "Which software?", "a": "AutoCAD and SketchUp are the most common tools for drawings and 3D models. "
                                                 "Rendering tools help you show realistic views to clients. "
                                                 "Learn AutoCAD first and then SketchUp, so you can handle both 2D and 3D work."},
                   {"q": "Can I freelance?", "a": "Freelancing is possible after you gain experience and build a portfolio. "
                                                  "Start with small projects, such as a single room or a shop. "
                                                  "Be careful with measurements and budgets, because mistakes are costly for clients."}],
                  [related("graphic-designer", "Graphic Designer", "Design"), related("cnc-machine-operator", "CNC Machine Operator", "Short certification"), related("electrician", "Electrician", "Site work")],
                  [SID], ["Site safety and accurate measurements prevent costly mistakes."], icon="Ruler", group=SHORT,
              course="Join the ITI Interior Design & Decoration trade (1 year, Class 10 with Science and Maths) or a diploma in interior design. "
                     "You learn measurement, drawing, materials and basic design. "
                     "A diploma or degree later helps you grow into a full designer.")
CNC = _trade("cnc-machine-operator", "CNC Machine Operator", "CNC", "A CNC operator runs computer-controlled machines that cut and shape metal parts precisely in factories and tool rooms. "
                                                                    "The job needs measurement skills, attention to quality and strict machine safety. "
                                                                    "With programming skills, operators can grow into CNC programmers and supervisors.",
             "ITI Machinist/Turner or Operator Advanced Machine Tool; diploma for programming roles", "Bharat Skills — ITI curricula", "https://bharatskills.gov.in/",
             ["Set up machines and tools", "Load programs and run jobs", "Measure parts with instruments", "Adjust offsets and maintain quality", "Basic G-code programming (advanced)"],
             [["CNC lathe/VMC", "Machining"], ["Vernier/micrometer", "Measurement"], ["G-code/CAM software", "Programs"], ["PPE", "Safety"]],
             [{"q": "Where can I learn CNC programming?", "a": "MSME Technology Centres (Tool Rooms) run CNC courses, and many ITIs also teach CNC. "
                                                               "Look for courses with hands-on time on real CNC machines. "
                                                               "Basic G-code knowledge helps you move from operator to programmer."},
              {"q": "Is math needed?", "a": "Yes, basic maths and measurement skills are important. "
                                            "You use them to read drawings, adjust offsets and check parts with instruments. "
                                            "Practise using a vernier and a micrometer until your readings are accurate."},
              {"q": "Which industries hire?", "a": "Auto component makers, engineering and aerospace companies and tool rooms hire CNC operators. "
                                                   "Most of these jobs are in factories and industrial areas. "
                                                   "An apprenticeship is a good way to get your first job."}],
             [related("automobile-technician", "Automobile Technician", "Technical trade"), related("interior-design-assistant", "Interior Design Assistant", "Short certification"), related("electrician", "Electrician", "Technical trade")],
             [DCMSME], ["Machine guarding and PPE are essential — never bypass safety interlocks."], icon="Cog", group=SHORT,
              course="Join an ITI trade such as Machinist, Turner or Operator Advanced Machine Tool, or a diploma if you want programming roles. "
                     "These courses teach machining, measurement and machine safety. "
                     "Add CNC training at an ITI or an MSME Technology Centre to work on modern machines.")

YOGA = _a12(
    "yoga-instructor", "Yoga Instructor", "Yoga", "How to become a Yoga Instructor",
    "A yoga instructor teaches asanas, breathing and relaxation safely to groups or individuals in studios, schools, corporates and online. "
    "The Yoga Certification Board under the Ministry of Ayush certifies yoga professionals at different levels. "
    "Safe teaching, with changes for beginners and health conditions, is the most important skill.", QUICK, icon="HeartPulse",
    duties=["Plan and lead yoga sessions", "Correct posture safely", "Adapt practice for beginners and health conditions", "Teach breathing and relaxation", "Maintain safety and records"],
    postings=["Yoga studios, gyms, schools, corporates, wellness resorts, online classes, own classes"],
    facts=[fact("Education", "Yoga Certification Board certificate"), fact("YCB levels", "L1 Protocol Instructor, L2 Wellness Instructor, L3 Teacher & Evaluator"),
           fact("Certificate validity", "Level 1: 5 years; others: 3 years (YCB guidelines)"), fact("Degrees", "BSc/MSc Yoga for institutional posts"), fact("Key skills", "Safety, teaching, communication")],
    steps=[step("Practise regularly", "Months 1–3", "Build a regular personal practice of asanas, breathing and relaxation. "
                                                    "You need to understand each practice in your own body before you can teach it. "
                                                    "Note what feels difficult, because your students will face the same challenges."),
           step("Take a structured course", "Months 2–6", "Join a structured course aligned to the Yoga Certification Board (YCB) levels. "
                                                          "Learn safe alignment, contraindications and how to plan a class. "
                                                          "A good course also prepares you for the YCB theory and practical assessment."),
           step("Clear YCB certification", "After course", "Start with the Level 1 Yoga Protocol Instructor certification from YCB. "
                                                           "The assessment checks both theory and practical skills. "
                                                           "Level 1 certificates are valid for 5 years and other levels for 3 years, so plan your renewal on time."),
           step("Teach small groups", "Months 4–8", "Start teaching small community or online groups to gain confidence. "
                                                    "Ask students about their health before class and offer safe changes to poses. "
                                                    "Collect feedback and keep improving your teaching."),
           step("Upgrade levels / degree", "Later", "Move up to Level 2 Yoga Wellness Instructor or Level 3 Yoga Teacher & Evaluator as you gain experience. "
                                                    "A BSc or MSc in Yoga helps for school and institutional posts. "
                                                    "Higher qualifications open more teaching roles.")],
    hiring=_hire(("2–6 months", "YCB-aligned course.", "Course done."), "YCB practical and theory assessment", ("After certificate", "Studio/gym/corporate classes.", "Regular batches.")),
    checklist=["You hold a YCB certificate.", "You teach safely with modifications.", "You know contraindications.", "You can plan sessions for different groups."],
    resources=[{"label": "Yoga Certification Board", "url": "https://yogacertificationboard.nic.in/", "note": "Official certification."}],
    special=["Don't give 'therapy' for medical conditions without the right training — refer to doctors when needed."],
    mistakes=["Pushing students into unsafe poses.", "Teaching without certification.", "Ignoring medical history."],
    faqs=[{"q": "Which certificate is official?", "a": "The Yoga Certification Board under the Ministry of Ayush certifies yoga professionals. "
                                                       "Its levels include Yoga Protocol Instructor, Yoga Wellness Instructor and Yoga Teacher & Evaluator. "
                                                       "Check the YCB website for current schemes and assessment details."},
          {"q": "Can I teach online?", "a": "Yes, many instructors run online batches. "
                                            "Make sure students have enough space, and watch their posture carefully on camera. "
                                            "Ask about health conditions before the first class, just as you would in person."},
          {"q": "Is a degree needed?", "a": "A degree is not needed for most studios. "
                                            "Schools and institutions may ask for a BSc or MSc in Yoga. "
                                            "A YCB certificate and good teaching experience matter most for studio jobs."}],
    related_items=[related("fitness-trainer", "Fitness Trainer", "Fitness"), related("makeup-artist", "Makeup Artist", "Wellness/beauty"), related("hair-stylist", "Hair Stylist", "Wellness/beauty")],
    institutes=[YCB, LNIPE, SID],
    sources=[source("Yoga Certification Board", "https://yogacertificationboard.nic.in/", "Certification levels and guidelines.")],
    extra_sections=_extra([["Yoga mat and props", "Practice"], ["Music/sound system", "Sessions"], ["Video tools", "Online classes"], ["Attendance app", "Batches"]],
                          ["Morning batch", "Private sessions", "Plan next classes", "Evening/online batch"],
                          [["Studio/gym", "Regular batches"], ["Corporate", "Workplace wellness"], ["Online/own classes", "Independent income"]]),
    **_simple(["Personal practice", "Certified instruction", "Advanced levels/teacher training"], [("Practice", "Months 1–3"), ("Course + YCB", "Months 2–6")], ["Practice", "Teaching"],
              ["Yoga Instructor", "Senior Instructor", "Studio owner / teacher trainer"]))

FITNESS = _a12(
    "fitness-trainer", "Fitness Trainer", "Fitness", "How to become a Fitness Trainer",
    "A fitness trainer designs and coaches workouts — strength, cardio and mobility — helping clients get fitter safely in gyms, homes and online. "
    "Gyms expect a recognised fitness certification and CPR/first aid training. "
    "Trainers grow by building personal-training clients and specialising.", QUICK, icon="Dumbbell",
    duties=["Assess clients' fitness", "Plan workout programmes", "Teach correct technique", "Motivate and track progress", "Ensure safety and first aid readiness"],
    postings=["Gyms, fitness studios, corporate wellness, sports academies, personal training, online coaching"],
    facts=[fact("Education", "12th + recognised fitness certification"), fact("Degree route", "B.P.Ed / BSc Sports Science (e.g. LNIPE)"), fact("Must-have", "CPR/first aid"),
           fact("Key skills", "Exercise science, coaching, communication"), fact("Income", "Salary + personal training")],
    steps=[step("Build your own fitness", "Ongoing", "Train regularly and practise every exercise you plan to teach. "
                                                     "Your own experience helps you explain technique and spot mistakes in others. "
                                                     "Clients also trust trainers who follow what they teach."),
           step("Learn exercise science", "Months 1–3", "Learn basic anatomy, physiology and how to plan workout programmes. "
                                                        "This helps you understand why an exercise works and how to progress it safely. "
                                                        "Learn from reliable courses and books rather than copying influencers."),
           step("Get certified", "Months 2–6", "Earn a recognised fitness-trainer certification along with CPR and first aid training. "
                                               "Gyms expect both before they let you train clients. "
                                               "First aid skills help you act quickly if a client gets injured or unwell."),
           step("Intern at a gym", "Months 3–6", "Work on the gym floor under senior trainers to learn real coaching. "
                                                 "You will practise correcting form, handling different clients and keeping the gym safe. "
                                                 "A good internship can lead to a floor trainer job."),
           step("Build clients", "Later", "Build personal-training clients and choose a specialisation such as strength or rehab support. "
                                          "Learn nutrition basics, but leave detailed diet plans to a dietitian. "
                                          "Track each client's progress so they can see their results.")],
    hiring=_hire(("2–6 months", "Fitness certification.", "Certified."), "Practical coaching assessment", ("After certificate", "Gym floor trainer.", "Personal-training clients.")),
    checklist=["You hold a recognised certification.", "You have CPR/first aid.", "You coach correct technique.", "You plan safe, progressive programmes."],
    resources=[{"label": "Fit India", "url": "https://fitindia.gov.in/", "note": "Government fitness initiative."}],
    special=["Never give medical or extreme diet advice; refer clients with health issues to doctors/dietitians."],
    mistakes=["Copying influencers instead of learning basics.", "No first-aid training.", "Ignoring client health history."],
    faqs=[{"q": "Is a degree required?", "a": "A degree is not required for most gym jobs, but a recognised certification is expected. "
                                              "Degrees such as B.P.Ed or BSc Sports Science help for senior or institutional roles. "
                                              "Choose the degree route if you want to work in schools, colleges or sports institutes."},
          {"q": "Can I train clients online?", "a": "Yes, many trainers coach clients online after building experience. "
                                                    "Online coaching needs clear video instructions and regular check-ins. "
                                                    "Start with in-person training first so you learn to correct form properly."},
          {"q": "Do I need nutrition knowledge?", "a": "Nutrition basics help you guide clients better. "
                                                       "Detailed diet plans are a dietitian's job, so refer clients with health issues to one. "
                                                       "Never give medical or extreme diet advice."}],
    related_items=[related("yoga-instructor", "Yoga Instructor", "Wellness"), related("makeup-artist", "Makeup Artist", "Other quick-entry"), related("automobile-technician", "Automobile Technician", "Other quick-entry")],
    institutes=[LNIPE, NSNIS, SID],
    sources=[source("LNIPE", "https://lnipe.edu.in/", "Physical education degrees."), source("NSNIS Patiala", "https://nsnis.org/", "Coaching courses.")],
    extra_sections=_extra([["Weights and machines", "Training"], ["Heart-rate monitor", "Intensity"], ["Fitness app/sheet", "Tracking"], ["First-aid kit", "Safety"]],
                          ["Early-morning clients", "Floor duty", "Programme planning", "Evening personal training"],
                          [["Gym job", "Salary + PT"], ["Personal trainer", "Home/online clients"], ["Corporate wellness", "Group sessions"]]),
    **_simple(["Personal fitness basics", "Certified coaching", "Specialist/PT business"], [("Learn", "Months 1–3"), ("Certify + intern", "Months 2–6")], ["Coaching", "Safety"],
              ["Floor Trainer", "Personal Trainer", "Head Trainer / gym owner"]))

AGNIVEER = _a12(
    "army-soldier-gd-technical-clerk", "Army Soldier (GD / Technical / Clerk)", "Agniveer", "How to become an Army Soldier (Agniveer)",
    "Under the Agnipath scheme, young people join the Indian Army as Agniveers for four years in General Duty, Technical, Clerk/Store Keeper and Tradesman roles. "
    "Selection is through an online Common Entrance Exam, physical tests and a medical examination. "
    "Up to 25% of Agniveers are retained as regular soldiers based on merit.", GOVT, icon="Shield",
    duties=["Military training and duties", "Operate and maintain equipment (Technical)", "Office and stores work (Clerk/SKT)", "Serve wherever posted", "Follow discipline and regulations"],
    postings=["Indian Army units across India"],
    facts=[fact("Education", "GD: 10th 45%; Tech: 12th PCM 50%; Clerk: 12th 60%"), fact("Age", "17.5–22 in the latest notification (check current)"),
           fact("Tenure", "4 years; up to 25% retained as regular soldiers"), fact("Selection", "Online CEE → physical tests → medical"), fact("Apply", "joinindianarmy.nic.in only")],
    steps=[step("Check the notification", "When released", "Read the latest Agniveer notification on joinindianarmy.nic.in for category-wise education, age and physical standards. "
                                                           "Rules can change between recruitment years, so do not rely on old notices. "
                                                           "Choose the category that matches your education and marks."),
           step("Register online", "Application window", "Register and apply only on joinindianarmy.nic.in during the application window. "
                                                         "Recruitment is free, so never pay agents who promise selection. "
                                                         "Keep your documents ready and save your login details safely."),
           step("Online Common Entrance Exam", "As scheduled", "Take the online Common Entrance Exam (CEE), a written test for your category. "
                                                               "Practise previous papers and the syllabus given in the notification. "
                                                               "Your CEE merit decides whether you are called for the physical tests."),
           step("Physical fitness and measurement tests", "After CEE", "Clear the physical fitness test, which includes running and pull-ups, and meet the physical measurement standards. "
                                                                       "Start training months in advance instead of in the last few weeks. "
                                                                       "Check the exact standards for your category in the notification."),
           step("Medical examination", "After PFT", "Pass the Army medical examination to show that you meet the medical standards. "
                                                    "Treat any minor health problems early and read the medical guidelines in the notification. "
                                                    "Candidates found medically unfit cannot join, even after clearing the earlier tests."),
           step("Training and service", "4 years", "Selected candidates train and serve as Agniveers for four years. "
                                                   "Up to 25% are retained as regular soldiers based on merit. "
                                                   "Others exit with the scheme's benefits and can move on to further jobs and education.")],
    hiring=[stage("Online CEE", "As notified", "Category-wise written exam.", [paper("Common Entrance Exam", "MCQ (online)", "As notified", "Practise previous papers")], "Merit."),
            stage("Physical Fitness Test", "After CEE", "Run, pull-ups and other tests.", [], "Qualify as per notification."),
            stage("Medical", "After PFT", "Army medical standards.", [], "Fit."),
            stage("Merit list and joining", "Final", "Category-wise merit.", [], "Training begins.")],
    checklist=["You meet the category's education rule.", "You are within the age limit.", "You can clear the running and physical tests.", "You will apply only on the official site."],
    resources=[{"label": "Join Indian Army", "url": "https://joinindianarmy.nic.in/", "note": "Official notifications and registration."}],
    special=["Recruitment is free and only through joinindianarmy.nic.in — beware of agents promising selection.",
             "Criteria here follow recent Agniveer notifications; always confirm in the current notification."],
    mistakes=["Ignoring physical training until the last month.", "Paying agents.", "Not checking category-wise marks rules."],
    faqs=[{"q": "What are the education rules?", "a": "GD needs Class 10 with 45% aggregate and 33% in each subject. "
                                                      "Technical needs 10+2 with Physics, Chemistry, Maths and English with 50% aggregate and 40% in each, and Clerk/SKT needs 10+2 with 60% aggregate and 50% in each subject. "
                                                      "These follow recent notifications, so confirm them in the current notice."},
          {"q": "What happens after 4 years?", "a": "Up to 25% are retained as regular soldiers based on merit. "
                                                    "Others exit with the scheme's benefits and can move on to further jobs and education. "
                                                    "Plan for both outcomes while you serve."},
          {"q": "What about officer entry?", "a": "Officers join through NDA or CDS, not through Agniveer recruitment. "
                                                  "See the NDA guide for eligibility, exams and selection. "
                                                  "Choose the route that matches your age and education."}],
    related_items=[related("army-navy-air-force-officer-nda-cds", "NDA Officer", "Officer route"), related("police-constable", "Police Constable", "Uniformed service"), related("multi-tasking-staff", "SSC MTS", "Government exam")],
    institutes=[ARMY, SID],
    sources=[source("Join Indian Army", "https://joinindianarmy.nic.in/", "Agniveer notifications and registration.")],
    extra_sections=_extra([["Running shoes", "Physical prep"], ["Previous papers", "CEE prep"], ["Documents folder", "Verification"]],
                          ["Morning run and exercises", "Study for CEE", "Evening physical practice"],
                          [["Agniveer (4 years)", "Service with training and benefits"], ["Regular soldier (if retained)", "Long-term career"], ["After service", "Further jobs and education"]]),
    **_simple(["Fitness and basics", "CEE-ready", "Selected/serving"], [("Prep", "3–6 months"), ("Selection", "As notified")], ["Running", "CEE practice"],
              ["Agniveer", "Regular soldier (if retained)", "Junior Commissioned Officer path"]))

GUIDES = [MAKEUP, MEHENDI, HAIR, NAILS, DEO, ELECTRICIAN, MOBILE, AC, CCTV, AUTO, YOGA, FITNESS, INTERIOR, CNC, AGNIVEER]
_BY_KEY = {slugify(k): g for g in GUIDES for k in (g["slug"], g["title"])}


def after12_guide(value):
    g = _BY_KEY.get(slugify(value or ""))
    return deepcopy(g) if g else None


def after12_alias(value):
    """Canonical slug for After 12th menu titles that reuse an existing guide (or None)."""
    return ALIASES.get(slugify(value or ""))
