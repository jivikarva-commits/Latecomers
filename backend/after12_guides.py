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
def _beauty(slug, title, short, summary, tools, faqs_extra, related_items):
    return _a12(slug, title, short, f"How to become a {title}", summary, QUICK, icon="Sparkles",
                duties=["Consult clients and understand the look they want", "Prepare skin/hair/nails hygienically", "Apply techniques and products safely",
                        "Do patch tests and avoid allergic reactions", "Maintain tools and hygiene", "Build a portfolio and repeat clients"],
                postings=["Salons, bridal studios, film/TV, fashion shoots, freelance home service"],
                facts=[fact("Education", "10th/12th + recognised course"), fact("Training", "ITI Cosmetology (1 yr) or B&WSSC certificate"),
                       fact("Key skills", "Hygiene, technique, customer handling"), fact("Portfolio", "Before/after photos (with consent)"), fact("Work", "Weekends and wedding seasons are busy")],
                steps=[step("Choose a recognised course", "Month 1", "ITI Cosmetology or a B&WSSC-aligned course."), step("Learn hygiene and basics", "Months 1–2", "Sanitisation, skin/hair types, patch tests."),
                       step("Practise daily", "Months 2–4", "Friends and family models; build a portfolio."), step("Assist a professional", "Months 3–6", "Learn real client handling."),
                       step("Start working", "Month 4+", "Salon job or freelance with a portfolio.")],
                hiring=_hire(("1–12 months", "Recognised beauty course.", "Course completed."), "Do a full look/service on a model",
                             ("After course", "Salon job or assistant to a senior artist.", "Regular clients.")),
                checklist=["You follow hygiene and patch-test rules.", "You have a portfolio.", "You can handle clients politely.", "You hold a recognised certificate."],
                resources=[{"label": "B&WSSC", "url": "https://www.bwssc.in/", "note": "Recognised beauty qualifications."}],
                special=["Use good-quality, in-date products and always patch-test to avoid allergic reactions.", "Take client consent before posting their photos."],
                mistakes=["Poor hygiene.", "No portfolio.", "Overcharging without experience."],
                faqs=[{"q": "Do I need a degree?", "a": "No — a recognised course and a strong portfolio matter most."}, *faqs_extra,
                      {"q": "Can I work from home?", "a": "Yes, many artists offer home/bridal services after building a client base."}],
                related_items=related_items, institutes=[BWSSC, DGT, SID],
                sources=[source("DGT — Cosmetology (CTS)", "https://dgt.gov.in/sites/default/files/Cosmetology_CTS2.0_NSQF-3.pdf", "1 year, Class 10 pass."),
                         source("Beauty & Wellness Sector Skill Council", "https://www.bwssc.in/", "Qualification packs.")],
                extra_sections=_extra(tools, ["Prepare kit and sanitise", "Client consultation", "Service", "Photos for portfolio (with consent)", "Follow-up and bookings"],
                                      [["Salon job", "Steady clients and training"], ["Freelance", "Weddings and events"], ["Own studio", "After experience"]]),
                **_simple(["Basic techniques and hygiene", "Full services for clients", "Bridal/fashion or advanced work"], [("Course", "1–12 months"), ("Practice + portfolio", "3–6 months")],
                          ["Daily practice", "Portfolio"], ["Assistant / Junior", "Artist / Stylist", "Senior artist / studio owner"]))


MAKEUP = _beauty("makeup-artist", "Makeup Artist", "Makeup", "A makeup artist creates looks for brides, events, photo shoots, film and fashion using professional makeup techniques.",
                 [["Brush and sponge kit", "Application"], ["Makeup products", "Looks"], ["Ring light / mirror", "Lighting"], ["Sanitiser and disposables", "Hygiene"]],
                 [{"q": "Which certificate is recognised?", "a": "B&WSSC qualifications such as Professional Make-up Artist, or ITI Cosmetology."}],
                 [related("hair-stylist", "Hair Stylist", "Beauty"), related("mehendi-artist", "Mehendi Artist", "Bridal services"), related("nail-art-technician", "Nail Art Technician", "Beauty")])
MEHENDI = _beauty("mehendi-artist", "Mehendi Artist", "Mehendi", "A mehendi artist designs henna patterns for weddings, festivals and events.",
                  [["Henna cones", "Designs"], ["Design books/app", "Patterns"], ["Lemon-sugar mix", "Colour"], ["Gloves and wipes", "Hygiene"]],
                  [{"q": "Is chemical 'black henna' safe?", "a": "No — avoid products with harmful additives; use natural henna and do a patch test."}],
                  [related("makeup-artist", "Makeup Artist", "Bridal services"), related("nail-art-technician", "Nail Art Technician", "Beauty"), related("hair-stylist", "Hair Stylist", "Beauty")])
HAIR = _beauty("hair-stylist", "Hair Stylist", "Hair Styling", "A hair stylist cuts, colours, treats and styles hair in salons, studios and for events.",
               [["Scissors and clippers", "Cutting"], ["Dryers and irons", "Styling"], ["Colour kit", "Colouring"], ["Sterilisation tools", "Hygiene"]],
               [{"q": "Which certificate?", "a": "ITI Cosmetology or B&WSSC Hair Dresser & Stylist."}],
               [related("makeup-artist", "Makeup Artist", "Beauty"), related("nail-art-technician", "Nail Art Technician", "Beauty"), related("mehendi-artist", "Mehendi Artist", "Bridal services")])
NAILS = _beauty("nail-art-technician", "Nail Art Technician", "Nail Art", "A nail technician does manicures, pedicures, nail extensions and nail art safely and hygienically.",
                [["Nail kit", "Manicure/pedicure"], ["Gel and UV/LED lamp", "Extensions"], ["Nail art tools", "Designs"], ["Sterilisation", "Hygiene"]],
                [{"q": "Which certificate?", "a": "B&WSSC Nail Technician or a recognised cosmetology course."}],
                [related("makeup-artist", "Makeup Artist", "Beauty"), related("hair-stylist", "Hair Stylist", "Beauty"), related("mehendi-artist", "Mehendi Artist", "Beauty")])

DEO = _a12(
    "data-entry-operator", "Data Entry Operator", "Data Entry", "How to become a Data Entry Operator",
    "A data entry operator types and updates information in computers — forms, records, invoices and databases — accurately and fast.", QUICK, icon="Keyboard",
    duties=["Enter data from documents into systems", "Check and correct errors", "Maintain records and files", "Prepare simple reports in Excel", "Follow data privacy rules"],
    postings=["Offices, banks (contract), hospitals, government offices (contract/exam-based), BPOs"],
    facts=[fact("Education", "10th (ITI) / 12th or graduation (jobs)"), fact("ITI course", "Data Entry Operator — 6 months (DGT)"), fact("Key skill", "Typing speed + accuracy"),
           fact("Certificate", "NIELIT CCC helps"), fact("Govt route", "SSC CHSL (DEO) needs 12th — see that guide")],
    steps=[step("Learn computer basics", "Month 1", "Windows, MS Office/Excel, internet."), step("Build typing speed", "Months 1–3", "English and Hindi typing practice daily."),
           step("Get a certificate", "Months 1–6", "ITI Data Entry Operator (6 months) or NIELIT CCC."), step("Apply for jobs", "After", "Offices, BPOs, hospitals; government DEO via SSC CHSL.")],
    hiring=_hire(("6 months", "ITI Data Entry Operator or a computer course.", "Certificate earned."), "Typing and Excel test", ("After course", "Office/BPO job.", "Confirmed role.")),
    checklist=["You type fast with high accuracy.", "You know Excel basics.", "You have a computer certificate.", "You keep data confidential."],
    resources=[{"label": "NIELIT", "url": "https://www.nielit.gov.in/", "note": "CCC and computer courses."}],
    special=["For government DEO posts, see the SSC CHSL guide — it requires 12th pass and a typing/skill test."],
    mistakes=["Low accuracy.", "Ignoring Excel.", "Sharing data carelessly."],
    faqs=[{"q": "What typing speed is needed?", "a": "It depends on the employer; government skill tests set their own speed standards."},
          {"q": "Is 10th enough?", "a": "For ITI DEO, yes; most office jobs prefer 12th or graduation."}, {"q": "Can I work from home?", "a": "Some genuine jobs exist, but beware of fee-based 'work from home' scams."}],
    related_items=[related("accounts-executive-tally-gst", "Tally Accountant", "Office accounts"), related("ldc-deo-postal-assistant", "SSC CHSL — DEO", "Government route"), related("cctv-installer", "CCTV Installer", "Other quick-entry")],
    institutes=[DGT, NIELIT, SID, BHARATSKILLS],
    sources=[source("DGT — Data Entry Operator (CTS)", "https://dgt.gov.in/sites/default/files/2024-01/Data%20Entry%20Operator_CTS2.0%20NSQF-3.pdf", "6 months, Class 10 pass, age 14.")],
    extra_sections=_extra([["Computer + keyboard", "Typing"], ["MS Excel", "Records"], ["Office software", "Documents"], ["Scanner", "Digitising"]],
                          ["Collect documents", "Enter and verify data", "Fix errors", "Daily report"],
                          [["Office job", "Fixed hours"], ["BPO/back office", "Shift work"], ["Government contract/SSC", "Exam-based route"]]),
    **_simple(["Typing and computer basics", "Accurate fast entry", "Supervising data teams"], [("Basics", "Month 1"), ("Course + typing", "Months 1–6")], ["Typing", "Excel"],
              ["Data Entry Operator", "Senior Operator / MIS Executive", "Supervisor / Office Assistant"]))


def _trade(slug, title, short, summary, iti, src_label, src_url, duties, tools, faqs, related_items, extra_inst, special, icon="Wrench", group=QUICK):
    return _a12(slug, title, short, f"How to become a {title}", summary, group, icon=icon,
                duties=duties, postings=["Service companies, dealers, builders, factories, maintenance teams, self-employment"],
                facts=[fact("Education", iti), fact("Training", "ITI (DGT) or diploma + apprenticeship"), fact("Key skills", "Safety, diagnosis, hands-on work"),
                       fact("Certificate", "National Trade Certificate (NCVT)"), fact("Growth", "Supervisor, contractor or own shop")],
                steps=[step("Join a recognised course", "After 10th/12th", iti), step("Learn safety first", "From day 1", "PPE, tools and safe working practices."),
                       step("Practise in workshops", "During course", "Real tasks under supervision."), step("Do an apprenticeship", "After ITI", "Paid on-the-job training with a company."),
                       step("Get a job or licence", "After", "Join a company; take any licence your state requires."), step("Grow", "Later", "Supervisor, contractor or own service business.")],
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


ELECTRICIAN = _trade("electrician", "Electrician", "Electrician", "An electrician installs, maintains and repairs wiring, switchboards, motors and electrical equipment in homes, buildings and factories.",
                     "ITI Electrician — 2 years; Class 10 with Science and Maths; age 14+", "DGT — Electrician (CTS)", "https://dgt.gov.in/sites/default/files/2024-01/Electrician_CTS2.0_NSQF-4.pdf",
                     ["House and building wiring", "Install and repair switchboards and fittings", "Maintain motors and panels", "Test with meters and fix faults", "Follow electrical safety rules"],
                     [["Multimeter / tester", "Measurements"], ["Insulated tools", "Safe work"], ["Megger", "Insulation tests"], ["PPE", "Safety"]],
                     [{"q": "Do I need a licence?", "a": "To work on installations independently, states require an electrical worker/wireman licence or permit from the state licensing board."},
                      {"q": "Can I join after 12th?", "a": "Yes, ITI Electrician needs Class 10 with Science and Maths; 12th students can join too."},
                      {"q": "Is there government work?", "a": "Railways, state electricity boards and PSUs recruit ITI electricians through their exams."}],
                     [related("ac-repair-technician", "AC Repair Technician", "Related trade"), related("cctv-installer", "CCTV Installer", "Related trade"), related("automobile-technician", "Automobile Technician", "Technical trade")],
                     [CEA], ["Never work on live circuits without isolation and proper PPE.", "State licences are required for independent electrical work — check your state's licensing board."], icon="Zap")
MOBILE = _trade("mobile-repair-technician", "Mobile Repair Technician", "Mobile Repair", "A mobile repair technician diagnoses and fixes smartphones — screens, batteries, charging ports, boards and software issues.",
                "10th + ITI Electronics Mechanic (2 yrs) or ESSCI smartphone repair course", "DGT — Electronics Mechanic (CTS)", "https://dgt.gov.in/sites/default/files/2024-01/Electronics%20Mechanic_CTS2.0_NSQF-4.pdf",
                ["Diagnose hardware and software faults", "Replace screens, batteries, ports", "Board-level soldering (advanced)", "Flash/update software", "Advise customers on data backup"],
                [["Soldering station / hot air", "Board repair"], ["Multimeter", "Testing"], ["Screwdriver and opening kit", "Disassembly"], ["Software tools", "Flashing"]],
                [{"q": "Can I start without ITI?", "a": "Short ESSCI-aligned courses exist, but ITI Electronics Mechanic gives stronger fundamentals."},
                 {"q": "Is this a good business?", "a": "Many technicians run their own shops after gaining experience."},
                 {"q": "What about customer data?", "a": "Never copy or misuse customer data; ask them to back up before repairs."}],
                [related("cctv-installer", "CCTV Installer", "Electronics"), related("electrician", "Electrician", "Electrical"), related("ac-repair-technician", "AC Repair Technician", "Service trade")],
                [ESSCI], ["Respect customer privacy — never access or copy personal data on phones you repair."], icon="Smartphone")
AC = _trade("ac-repair-technician", "AC Repair Technician", "AC Repair", "An AC and refrigeration technician installs, services and repairs air conditioners, refrigerators and cold-storage systems.",
            "ITI Refrigeration & AC Technician — 2 years; Class 10 with Science and Maths", "DGT — Refrigeration and Air Conditioning Technician (CTS)",
            "https://dgt.gov.in/sites/default/files/2024-01/Ref.%20_%20Air%20Conditioning%20Tech._CTS2.0_NSQF-4.pdf",
            ["Install split/window ACs", "Service and gas charging", "Diagnose compressor and electrical faults", "Repair fridges and cold rooms", "Follow refrigerant safety"],
            [["Gauge manifold", "Gas pressure"], ["Vacuum pump", "Evacuation"], ["Brazing kit", "Pipe joints"], ["Clamp meter", "Electrical checks"]],
            [{"q": "Is summer the only busy season?", "a": "Summer is peak, but servicing, installation and commercial refrigeration run all year."},
             {"q": "Do brands hire ITI technicians?", "a": "Yes, through service partners and apprenticeships."},
             {"q": "Is refrigerant handling risky?", "a": "It needs training — follow safety and environmental handling rules."}],
            [related("electrician", "Electrician", "Electrical"), related("automobile-technician", "Automobile Technician", "Technical trade"), related("mobile-repair-technician", "Mobile Repair Technician", "Service trade")],
            [ESSCI], ["Refrigerants must be handled and recovered safely — never vent them carelessly."], icon="AirVent")
CCTV = _trade("cctv-installer", "CCTV Installer", "CCTV", "A CCTV installer sets up and maintains security cameras, recorders and networks for homes, shops and offices.",
              "ITI Electronics/Electrician or diploma; ESSCI CCTV Installation Technician course", "DGT — Electronics Mechanic (CTS)", "https://dgt.gov.in/sites/default/files/2024-01/Electronics%20Mechanic_CTS2.0_NSQF-4.pdf",
              ["Plan camera positions", "Install cameras, cabling and DVR/NVR", "Configure network and mobile viewing", "Maintain and troubleshoot", "Explain privacy and usage to clients"],
              [["Drill and cable tools", "Installation"], ["Crimping tools", "Network cables"], ["Laptop", "Configuration"], ["Ladder and PPE", "Safety"]],
              [{"q": "Which course?", "a": "ESSCI's CCTV Installation Technician qualification; an electronics/electrical ITI or diploma is the usual base."},
               {"q": "Do I need networking skills?", "a": "Yes — IP cameras need basic networking."},
               {"q": "Any privacy rules?", "a": "Advise clients to avoid recording private spaces of others and to display notices where needed."}],
              [related("electrician", "Electrician", "Electrical"), related("mobile-repair-technician", "Mobile Repair Technician", "Electronics"), related("data-entry-operator", "Data Entry Operator", "Other quick-entry")],
              [ESSCI], ["Respect privacy — position cameras so they don't record neighbours' private spaces."], icon="Cctv")
AUTO = _trade("automobile-technician", "Automobile Technician", "Automobile", "An automobile technician services and repairs cars and bikes — engines, brakes, electrical systems and diagnostics.",
              "ITI Mechanic Motor Vehicle — 2 years; Class 10 with Science and Maths", "DGT — Mechanic Motor Vehicle (CTS)", "https://dgt.gov.in/sites/default/files/2023-12/Mechanic%20Motor%20Vehicle_CTS2.0_NSQF-4_0.pdf",
              ["Periodic servicing", "Diagnose engine and electrical faults", "Repair brakes, suspension and clutch", "Use scanners for diagnostics", "Road-test and hand over"],
              [["Hand and power tools", "Repairs"], ["OBD scanner", "Diagnostics"], ["Lift/jack", "Access"], ["Torque wrench", "Correct fitting"]],
              [{"q": "Should I learn EV too?", "a": "Yes — the ITI 'Mechanic Electric Vehicle' trade or EV training keeps you future-ready."},
               {"q": "Do dealerships hire ITI holders?", "a": "Yes, often through apprenticeships."},
               {"q": "Can I open a garage?", "a": "Many do after experience; follow local trade licence rules."}],
              [related("ev-technician-engineer", "EV Technician", "Electric vehicles"), related("electrician", "Electrician", "Electrical"), related("ac-repair-technician", "AC Repair Technician", "Technical trade")],
              [SID], ["Learn EV basics — electric vehicles are a fast-growing part of the service market."], icon="Car")
INTERIOR = _trade("interior-design-assistant", "Interior Design Assistant", "Interior Design", "An interior design assistant helps designers with measurements, drawings, 3D views, material selection and site coordination.",
                  "ITI Interior Design & Decoration — 1 year; Class 10 with Science and Maths; or a diploma", "DGT — Interior Design & Decoration (CTS)",
                  "https://dgt.gov.in/sites/default/files/Interior%20Design%20_%20Decoration_CTS2.0_NSQF-3.pdf",
                  ["Take site measurements", "Prepare 2D drawings and 3D views", "Select materials and finishes", "Coordinate with vendors and site workers", "Track budgets and timelines"],
                  [["AutoCAD", "Drawings"], ["SketchUp", "3D models"], ["Measuring tape/laser", "Site measurement"], ["Material catalogues", "Selection"]],
                  [{"q": "Is ITI enough?", "a": "ITI is a good start; a diploma/degree helps you grow into a designer."},
                   {"q": "Which software?", "a": "AutoCAD and SketchUp are most common; rendering tools help."},
                   {"q": "Can I freelance?", "a": "Possible after experience and a portfolio."}],
                  [related("graphic-designer", "Graphic Designer", "Design"), related("cnc-machine-operator", "CNC Machine Operator", "Short certification"), related("electrician", "Electrician", "Site work")],
                  [SID], ["Site safety and accurate measurements prevent costly mistakes."], icon="Ruler", group=SHORT)
CNC = _trade("cnc-machine-operator", "CNC Machine Operator", "CNC", "A CNC operator runs computer-controlled machines that cut and shape metal parts precisely in factories and tool rooms.",
             "ITI Machinist/Turner or Operator Advanced Machine Tool; diploma for programming roles", "Bharat Skills — ITI curricula", "https://bharatskills.gov.in/",
             ["Set up machines and tools", "Load programs and run jobs", "Measure parts with instruments", "Adjust offsets and maintain quality", "Basic G-code programming (advanced)"],
             [["CNC lathe/VMC", "Machining"], ["Vernier/micrometer", "Measurement"], ["G-code/CAM software", "Programs"], ["PPE", "Safety"]],
             [{"q": "Where can I learn CNC programming?", "a": "MSME Technology Centres (Tool Rooms) run CNC courses; many ITIs also teach CNC."},
              {"q": "Is math needed?", "a": "Basic maths and measurement skills are important."},
              {"q": "Which industries hire?", "a": "Auto components, engineering, aerospace and tool rooms."}],
             [related("automobile-technician", "Automobile Technician", "Technical trade"), related("interior-design-assistant", "Interior Design Assistant", "Short certification"), related("electrician", "Electrician", "Technical trade")],
             [DCMSME], ["Machine guarding and PPE are essential — never bypass safety interlocks."], icon="Cog", group=SHORT)

YOGA = _a12(
    "yoga-instructor", "Yoga Instructor", "Yoga", "How to become a Yoga Instructor",
    "A yoga instructor teaches asanas, breathing and relaxation safely to groups or individuals in studios, schools, corporates and online.", QUICK, icon="HeartPulse",
    duties=["Plan and lead yoga sessions", "Correct posture safely", "Adapt practice for beginners and health conditions", "Teach breathing and relaxation", "Maintain safety and records"],
    postings=["Yoga studios, gyms, schools, corporates, wellness resorts, online classes, own classes"],
    facts=[fact("Education", "Yoga Certification Board certificate"), fact("YCB levels", "L1 Protocol Instructor, L2 Wellness Instructor, L3 Teacher & Evaluator"),
           fact("Certificate validity", "Level 1: 5 years; others: 3 years (YCB guidelines)"), fact("Degrees", "BSc/MSc Yoga for institutional posts"), fact("Key skills", "Safety, teaching, communication")],
    steps=[step("Practise regularly", "Months 1–3", "Build your own practice."), step("Take a structured course", "Months 2–6", "Course aligned to YCB levels."),
           step("Clear YCB certification", "After course", "Start with Level 1 Yoga Protocol Instructor."), step("Teach small groups", "Months 4–8", "Community and online classes."),
           step("Upgrade levels / degree", "Later", "Level 2/3 or BSc/MSc Yoga.")],
    hiring=_hire(("2–6 months", "YCB-aligned course.", "Course done."), "YCB practical and theory assessment", ("After certificate", "Studio/gym/corporate classes.", "Regular batches.")),
    checklist=["You hold a YCB certificate.", "You teach safely with modifications.", "You know contraindications.", "You can plan sessions for different groups."],
    resources=[{"label": "Yoga Certification Board", "url": "https://yogacertificationboard.nic.in/", "note": "Official certification."}],
    special=["Don't give 'therapy' for medical conditions without the right training — refer to doctors when needed."],
    mistakes=["Pushing students into unsafe poses.", "Teaching without certification.", "Ignoring medical history."],
    faqs=[{"q": "Which certificate is official?", "a": "The Yoga Certification Board under the Ministry of Ayush certifies yoga professionals."},
          {"q": "Can I teach online?", "a": "Yes, many instructors run online batches."}, {"q": "Is a degree needed?", "a": "Not for most studios; schools and institutions may ask for BSc/MSc Yoga."}],
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
    "A fitness trainer designs and coaches workouts — strength, cardio and mobility — helping clients get fitter safely in gyms, homes and online.", QUICK, icon="Dumbbell",
    duties=["Assess clients' fitness", "Plan workout programmes", "Teach correct technique", "Motivate and track progress", "Ensure safety and first aid readiness"],
    postings=["Gyms, fitness studios, corporate wellness, sports academies, personal training, online coaching"],
    facts=[fact("Education", "12th + recognised fitness certification"), fact("Degree route", "B.P.Ed / BSc Sports Science (e.g. LNIPE)"), fact("Must-have", "CPR/first aid"),
           fact("Key skills", "Exercise science, coaching, communication"), fact("Income", "Salary + personal training")],
    steps=[step("Build your own fitness", "Ongoing", "Practise what you teach."), step("Learn exercise science", "Months 1–3", "Anatomy, physiology, programming."),
           step("Get certified", "Months 2–6", "A recognised fitness-trainer certification + CPR/first aid."), step("Intern at a gym", "Months 3–6", "Floor training under seniors."),
           step("Build clients", "Later", "Personal training, specialisations (strength, rehab support, nutrition basics).")],
    hiring=_hire(("2–6 months", "Fitness certification.", "Certified."), "Practical coaching assessment", ("After certificate", "Gym floor trainer.", "Personal-training clients.")),
    checklist=["You hold a recognised certification.", "You have CPR/first aid.", "You coach correct technique.", "You plan safe, progressive programmes."],
    resources=[{"label": "Fit India", "url": "https://fitindia.gov.in/", "note": "Government fitness initiative."}],
    special=["Never give medical or extreme diet advice; refer clients with health issues to doctors/dietitians."],
    mistakes=["Copying influencers instead of learning basics.", "No first-aid training.", "Ignoring client health history."],
    faqs=[{"q": "Is a degree required?", "a": "Not for most gyms; a recognised certification is expected, and degrees help for senior or institutional roles."},
          {"q": "Can I train clients online?", "a": "Yes, many trainers do after building experience."}, {"q": "Do I need nutrition knowledge?", "a": "Basics help; detailed diet plans are a dietitian's job."}],
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
    "Under the Agnipath scheme, young people join the Indian Army as Agniveers for four years in General Duty, Technical, Clerk/Store Keeper and Tradesman roles.", GOVT, icon="Shield",
    duties=["Military training and duties", "Operate and maintain equipment (Technical)", "Office and stores work (Clerk/SKT)", "Serve wherever posted", "Follow discipline and regulations"],
    postings=["Indian Army units across India"],
    facts=[fact("Education", "GD: 10th 45%; Tech: 12th PCM 50%; Clerk: 12th 60%"), fact("Age", "17.5–21 in most recent notifications (check current)"),
           fact("Tenure", "4 years; up to 25% retained as regular soldiers"), fact("Selection", "Online CEE → physical tests → medical"), fact("Apply", "joinindianarmy.nic.in only")],
    steps=[step("Check the notification", "When released", "Category-wise education, age and physical standards."), step("Register online", "Application window", "Only on joinindianarmy.nic.in."),
           step("Online Common Entrance Exam", "As scheduled", "Written test for your category."), step("Physical fitness and measurement tests", "After CEE", "Running, pull-ups and physical standards."),
           step("Medical examination", "After PFT", "Army medical standards."), step("Training and service", "4 years", "Merit decides retention.")],
    hiring=[stage("Online CEE", "As notified", "Category-wise written exam.", [paper("Common Entrance Exam", "MCQ (online)", "As notified", "Practise previous papers")], "Merit."),
            stage("Physical Fitness Test", "After CEE", "Run, pull-ups and other tests.", [], "Qualify as per notification."),
            stage("Medical", "After PFT", "Army medical standards.", [], "Fit."),
            stage("Merit list and joining", "Final", "Category-wise merit.", [], "Training begins.")],
    checklist=["You meet the category's education rule.", "You are within the age limit.", "You can clear the running and physical tests.", "You will apply only on the official site."],
    resources=[{"label": "Join Indian Army", "url": "https://joinindianarmy.nic.in/", "note": "Official notifications and registration."}],
    special=["Recruitment is free and only through joinindianarmy.nic.in — beware of agents promising selection.",
             "Criteria here follow recent Agniveer notifications; always confirm in the current notification."],
    mistakes=["Ignoring physical training until the last month.", "Paying agents.", "Not checking category-wise marks rules."],
    faqs=[{"q": "What are the education rules?", "a": "GD: Class 10 with 45% aggregate and 33% in each subject; Technical: 10+2 PCM + English with 50% aggregate and 40% each; Clerk/SKT: 10+2 with 60% aggregate and 50% in each subject (recent notifications)."},
          {"q": "What happens after 4 years?", "a": "Up to 25% are retained as regular soldiers based on merit; others exit with the scheme's benefits."},
          {"q": "What about officer entry?", "a": "Officers join through NDA/CDS — see the NDA guide."}],
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
