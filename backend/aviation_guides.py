"""Aviation & Hospitality — beginner guides.

Facts checked on 2026-10-13 against official sources: IndiGo Inflight Services careers page (cabin attendant eligibility),
NCHMCT admission pages (B.Sc. HHA: no age bar, 10+2 with English, NCHM JEE by NTA, JNU degree; IHM diplomas),
RGNAU (BBA/MBA Aviation Management eligibility), Airports Authority of India recruitment, BCAS, DG Shipping
(STCW/CDC for cruise hospitality crew), FSSAI FoSTaC. No salary figures are given because there is no official source.
"""
from copy import deepcopy

from career_catalog import slugify
from gov_guide_kit import fact, institute, paper, related, source, stage, step
from tech_guides import _guide

BACK = ["/careers-explore?field=aviation", "← All Aviation & Hospitality careers"]
GROUP = "Aviation & Hospitality"
LABELS = {"nav": {"role": "What you do", "steps": "Start to end", "eligibility": "Education & eligibility", "exam": "Selection process",
                  "passing": "Ready checklist", "calendar": "Timeline", "prepare": "How to prepare", "salary": "Career growth", "faqs": "FAQs",
                  "institutes": "Top institutes", "government-sources": "Sources"},
          "passing": "Ready checklist"}
ELIG = [
    "Airlines, hotels and cruise lines set their own eligibility (age, height, appearance, language) in each recruitment notice.",
    "Apply only through official careers portals — airlines and hotels do not charge fees for selection.",
    "Good spoken English (and Hindi/regional language) and customer-service attitude matter in every role.",
]


def _av(slug, title, short, headline, summary, *, authority, icon="Plane", **kw):
    return _guide(slug, title, short, headline, summary, group=GROUP, scope_prefix="Aviation & Hospitality", back=BACK, icon=icon, color="#0284C7",
                  category="Aviation & Hospitality", authority=authority, eligibility=ELIG, labels=LABELS, exam_heading="Selection process — step by step",
                  test_topics="", interview_topics="", assignment="", **kw)


def _extra(tools, day, questions, earn):
    return [
        {"id": "tools", "nav": "Tools", "heading": "Tools and systems you will use", "columns": ["Tool / system", "Used for"], "rows": tools},
        {"id": "typical-day", "nav": "A typical day", "heading": "A typical day in this job", "items": day},
        {"id": "interview-questions", "nav": "Interview questions", "heading": "Interview questions to practise", "items": questions},
        {"id": "ways-to-earn", "nav": "Where you can work", "heading": "Where you can work", "columns": ["Employer type", "What it's like"], "rows": earn},
    ]


def _hire(first, second, third, fourth):
    return [stage(*first), stage(*second), stage(*third), stage(*fourth)]


# ---------- Institutes / official resources ----------
NCHM = institute("NCHMCT / Institutes of Hotel Management (IHMs)", "Ministry of Tourism", "https://nchm.gov.in/admission/bsc-hospitality-and-hotel-administration-generic",
                 "3-year B.Sc. Hospitality & Hotel Administration (JNU degree, optional 4th year Honours) through NCHM JEE (NTA); 1.5-year diplomas in Front Office, F&B Service, Food Production and Housekeeping.",
                 "12th students aiming for hotels, airlines and cruise hospitality.", mode="Full-time at IHMs", duration="3 years (degree) / 1.5 years (diploma)",
                 eligibility="10+2 with English; no age bar (B.Sc. HHA)")
IHM_PUSA = institute("IHM Pusa, New Delhi", "Central Institute of Hotel Management (Ministry of Tourism)", "https://ihmpusa.net/",
                     "B.Sc. HHA through NCHM JEE and diploma/craft courses.", "Students aiming for top hospitality training.", mode="Full-time")
RGNAU = institute("Rajiv Gandhi National Aviation University (RGNAU)", "Central university (Ministry of Civil Aviation)", "https://rgnau.ac.in/",
                  "BBA (Aviation Management) and MBA (Aviation Management).", "Students aiming for airline and airport management.", mode="Full-time",
                  eligibility="BBA: 50% in 10+2; MBA: bachelor's with 50% (5% relaxation SC/ST/PwD) and CAT/XAT/CMAT/GMAT/CUET-PG or RGNAU test")
AAI = institute("Airports Authority of India — recruitment", "Government PSU (Ministry of Civil Aviation)", "https://www.aai.aero/en/careers/recruitment",
                "Recruitment for airport operations, ATC, fire services, junior executives and assistants — each notice lists qualifications.",
                "Candidates wanting government airport jobs.", mode="Online application")
INDIGO = institute("IndiGo — Inflight Services careers", "Airline careers portal", "https://www.goindigo.in/careers/departments/inflightservices.html",
                   "Trainee cabin attendant drives: online assessment, then document/height checks, group discussion and interview; selected crew train before flying.",
                   "Freshers applying for cabin crew.", mode="Official online application", fee="No fee charged by the airline")
AIR_INDIA = institute("Air India — careers", "Airline careers portal", "https://careers.airindia.com/",
                      "Cabin crew, ground and corporate openings with eligibility in each posting.", "Freshers and experienced aviation staff.", mode="Official online application")
IATA = institute("IATA Training", "International Air Transport Association", "https://www.iata.org/en/training/",
                 "Courses in airline customer service, ground operations, cargo, airport operations and aviation management.", "Aviation staff upgrading skills.",
                 mode="Online and classroom")
IITTM = institute("Indian Institute of Tourism and Travel Management (IITTM)", "Ministry of Tourism", "https://www.iittm.ac.in/",
                  "BBA and MBA programmes in tourism and travel, including events and hospitality-related electives.", "Students targeting tourism and event careers.", mode="Full-time")
THSC = institute("Tourism & Hospitality Skill Council (THSC)", "Sector Skill Council (MSDE)", "https://www.thsc.in/",
                 "NSQF job-role courses such as front office associate, F&B steward and event coordinator through training partners.",
                 "Learners who want short, job-ready hospitality certificates.", mode="Through training partners")
FOSTAC = institute("FSSAI — FoSTaC (Food Safety Training & Certification)", "Food Safety and Standards Authority of India", "https://fostac.fssai.gov.in/",
                   "Food safety supervisor and handler training for restaurants, hotels and caterers.", "F&B staff and managers.", mode="Through FSSAI training partners")
DGS = institute("Directorate General of Shipping (DG Shipping)", "Ministry of Ports, Shipping & Waterways", "https://www.dgshipping.gov.in/",
                "INDoS number, Continuous Discharge Certificate (CDC) and approved STCW courses for seafarers, including cruise hospitality crew.",
                "Anyone joining a ship or cruise line from India.", mode="Online + approved training institutes")
BCAS = institute("Bureau of Civil Aviation Security (BCAS)", "Aviation security regulator", "https://www.bcasindia.gov.in/",
                 "Aviation security rules and training required for airport staff and entry permits.", "Airport and airline ground staff.", mode="Online information")

# ---------- Guides ----------
CREW = _av(
    "cabin-crew-air-hostess", "Cabin Crew / Air Hostess", "Cabin Crew", "How to become Cabin Crew / Air Hostess",
    "Cabin crew keep passengers safe and comfortable on flights — safety demonstrations, emergency procedures, service and first aid — and represent the airline.",
    authority="Hired by airlines through official recruitment drives",
    duties=["Pre-flight safety checks", "Safety demonstrations and briefings", "Handle emergencies and first aid", "Serve food and beverages", "Assist passengers with special needs", "Follow airline and DGCA rules"],
    postings=["Domestic and international airlines"],
    facts=[fact("Education", "12th pass + airline criteria"), fact("Example (IndiGo trainee)", "Female, 18–27, 10+2, 155 cm+, BMI-proportionate weight"),
           fact("Languages", "English + Hindi"), fact("Selection", "Online assessment → GD → interview → medical"), fact("Training", "Airline training before flying"),
           fact("Work", "Rotating rosters, overnight stays")],
    levels=[["Applicant", "Grooming, communication, fitness"], ["Trainee", "Safety and service training"], ["Crew", "Line flying and leadership later"]],
    steps=[step("Check airline eligibility", "Before applying", "Age, height, education and language rules differ by airline."),
           step("Build communication and grooming", "Months 1–3", "Clear English/Hindi, confident body language, customer service."),
           step("Apply on official portals", "When drives open", "IndiGo, Air India and other airline careers pages."),
           step("Clear selection", "Drive day", "Assessment, GD, interview, document and height checks."),
           step("Medical and training", "After selection", "Medical fitness and airline safety/service training."),
           step("Fly", "After training", "Start as trainee crew; grow to senior roles.")],
    hiring=_hire(("Stage 1 — Online application/assessment", "When drives open", "Basic screening.", [paper("Online assessment", "Aptitude/English", "Varies", "Apply only on the official portal")], "Shortlist."),
                 ("Stage 2 — Walk-in checks", "Assessment day", "Documents, height, grooming.", [], "Meet the criteria."),
                 ("Stage 3 — Group discussion and interview", "Same/next day", "Communication and attitude.", [paper("GD + personal interview", "Discussion", "—", "Smile, listen, be clear")], "Selection."),
                 ("Stage 4 — Medical and training", "After offer", "Medical fitness and airline training.", [], "Pass training to fly.")),
    checklist=["You meet the airline's age/height/education rules.", "You speak English and Hindi clearly.", "You are fit and well groomed.", "You understand safety is the main job."],
    timeline=[("Preparation", "1–3 months"), ("Selection", "As per drive"), ("Training", "As per airline"), ("Flying", "After training")],
    prep=[{"phase": "Prepare", "duration": "1–3 months", "focus": ["Communication", "Grooming", "Fitness"]}],
    resources=[{"label": "IndiGo Inflight Services careers", "url": "https://www.goindigo.in/careers/departments/inflightservices.html", "note": "Official eligibility."}],
    ladder=[["Start", "Cabin Crew", "0–3 years", "Line flying"], ["Mid", "Senior Crew / Purser", "3–7 years", "Cabin lead"], ["Senior", "Cabin Manager / Trainer", "7+ years", "Training and leadership"]],
    special=["Beware of agents promising 'guaranteed airline jobs' for money — airlines recruit only through official portals."],
    mistakes=["Paying agents.", "Ignoring height/BMI rules.", "Weak spoken English."],
    faqs=[{"q": "Is an aviation course compulsory?", "a": "No — airlines like IndiGo ask for 10+2; airlines train you after selection."},
          {"q": "Do airlines hire men as cabin crew?", "a": "Some do; check each airline's current posting (IndiGo's trainee posting is for female candidates)."},
          {"q": "What is the age limit?", "a": "It differs by airline; IndiGo's trainee posting says 18–27 years."}],
    related_items=[related("airport-ground-staff", "Airport Ground Staff", "Airport roles"), related("hotel-front-office-executive", "Hotel Front Office", "Hospitality"), related("cruise-line-hospitality-staff", "Cruise Line Staff", "Travel hospitality")],
    institutes=[INDIGO, AIR_INDIA, NCHM, IATA],
    sources=[source("IndiGo — Inflight Services careers", "https://www.goindigo.in/careers/departments/inflightservices.html", "Trainee cabin attendant eligibility.")],
    extra_sections=_extra([["Safety equipment", "Emergencies"], ["Service trolleys", "In-flight service"], ["Crew rostering app", "Schedules"], ["First-aid kit", "Medical help"]],
                          ["Report and briefing", "Pre-flight checks", "Boarding and safety demo", "In-flight service", "Post-flight report"],
                          ["Why cabin crew?", "How do you handle an angry passenger?", "What would you do in a medical emergency?", "Describe teamwork."],
                          [["Low-cost airline", "Short sectors, many flights"], ["Full-service airline", "Longer flights, premium service"], ["International carrier", "Long-haul layovers"]]),
)

GROUND = _av(
    "airport-ground-staff", "Airport Ground Staff", "Ground Staff", "How to become Airport Ground Staff",
    "Ground staff run passenger and aircraft operations on the ground — check-in, boarding, baggage, ramp, customer service and airport operations.",
    authority="Hired by airlines, ground-handling companies and the Airports Authority of India",
    duties=["Check-in and boarding", "Handle baggage issues", "Customer service and announcements", "Coordinate flights with operations", "Follow security procedures", "Help special-assistance passengers"],
    postings=["Airlines, ground-handling companies, airport operators, AAI"],
    facts=[fact("Education", "12th/graduation (as per post)"), fact("Government jobs", "AAI recruitment notices"), fact("Security", "BCAS rules and airport entry passes"),
           fact("Core skills", "Customer service, calm under pressure"), fact("Work", "Shifts, including nights")],
    levels=[["Fresher", "Check-in and customer service"], ["Experienced", "Supervisor of a counter or gate"], ["Senior", "Station/duty manager"]],
    steps=[step("Finish 12th / graduation", "Before applying", "Many airline posts ask for graduation."), step("Build customer-service skills", "Ongoing", "English, Hindi, computer basics."),
           step("Apply", "Openings", "Airline careers pages, ground-handling companies or AAI notices."), step("Clear selection", "As per employer", "Tests, interviews and background checks."),
           step("Training and airport pass", "After selection", "Company training and BCAS-required security procedures."), step("Grow", "Later", "Supervisor and manager roles.")],
    hiring=_hire(("Stage 1 — Application", "Openings", "Airline/handler/AAI.", [], "Shortlist."),
                 ("Stage 2 — Test (if any)", "As notified", "AAI posts often have a computer-based test.", [paper("CBT / aptitude", "MCQ", "As notified", "Read the AAI notice")], "Qualify."),
                 ("Stage 3 — Interview / skill test", "After test", "Communication and attitude.", [], "Selection."),
                 ("Stage 4 — Verification and training", "After offer", "Background check, security clearance and training.", [], "Join.")),
    checklist=["You meet the post's education rule.", "You communicate clearly.", "You are comfortable with shifts.", "You can pass background verification."],
    timeline=[("Education", "12th/graduation"), ("Applications", "Ongoing"), ("Training", "After selection")],
    prep=[{"phase": "Prepare", "duration": "1–3 months", "focus": ["Communication", "Computer basics", "Aptitude for AAI tests"]}],
    resources=[{"label": "AAI recruitment", "url": "https://www.aai.aero/en/careers/recruitment", "note": "Official notices."}],
    ladder=[["Start", "Customer Service Agent", "0–3 years", "Check-in/boarding"], ["Mid", "Supervisor", "3–6 years", "Shift lead"], ["Senior", "Duty / Station Manager", "6+ years", "Station operations"]],
    special=["Airport jobs require security background checks and passes under BCAS rules."],
    mistakes=["Paying agents.", "Poor communication.", "Not reading AAI eligibility carefully."],
    faqs=[{"q": "Is an aviation diploma required?", "a": "Not usually; employers ask for 12th or graduation depending on the post."},
          {"q": "How do I get a government airport job?", "a": "Watch AAI recruitment notices and clear their selection process."},
          {"q": "Are there night shifts?", "a": "Yes, airports run around the clock."}],
    related_items=[related("cabin-crew-air-hostess", "Cabin Crew", "In-flight"), related("aviation-operations-manager", "Aviation Operations Manager", "Next step"), related("hotel-front-office-executive", "Hotel Front Office", "Customer service")],
    institutes=[AAI, RGNAU, IATA, BCAS],
    sources=[source("AAI — recruitment", "https://www.aai.aero/en/careers/recruitment", "Government airport posts."), source("BCAS", "https://www.bcasindia.gov.in/", "Aviation security.")],
    extra_sections=_extra([["Departure control system", "Check-in and boarding"], ["Baggage tracing system", "Lost bags"], ["PA system", "Announcements"], ["Radios", "Coordination"]],
                          ["Shift briefing", "Check-in counters", "Gate boarding", "Handle delays and complaints", "Hand over to next shift"],
                          ["How do you handle a delayed flight's angry passengers?", "What if a passenger's bag is lost?", "Why aviation?", "How do you work under pressure?"],
                          [["Airline", "Passenger services"], ["Ground handler", "Ramp and passenger handling for many airlines"], ["AAI", "Government airport operations"]]),
)

OPS = _av(
    "aviation-operations-manager", "Aviation Operations Manager", "Aviation Operations", "How to become an Aviation Operations Manager",
    "An aviation operations manager keeps airline or airport operations running on time — scheduling, ground operations, safety compliance, vendors and teams.",
    authority="Hired by airlines, airports, ground handlers and cargo companies",
    duties=["Plan daily operations", "Coordinate ground handling, crew and maintenance", "Manage delays and disruptions", "Ensure safety and regulatory compliance", "Manage vendors and costs", "Report performance"],
    postings=["Airlines, airport operators, ground handlers, cargo and MRO companies"],
    facts=[fact("Education", "Graduation + aviation management"), fact("Programmes", "BBA/MBA Aviation Management (e.g. RGNAU)"), fact("Usual path", "Ground/airline roles → supervisor → manager"),
           fact("Regulators", "DGCA, BCAS, AAI"), fact("Core skills", "Planning, leadership, problem-solving")],
    levels=[["Entry", "Operations executive"], ["Mid", "Duty/shift manager"], ["Senior", "Station/operations head"]],
    steps=[step("Graduate", "3 years", "BBA (Aviation Management) or any degree."), step("Aviation MBA (optional)", "2 years", "RGNAU or other B-schools via CAT/XAT/CMAT/CUET-PG."),
           step("Start in operations", "Years 1–3", "Ground ops, OCC or airport roles."), step("Learn regulations", "Ongoing", "DGCA and BCAS rules relevant to your role."),
           step("Take IATA courses", "Optional", "Operations and safety training."), step("Move to management", "Years 3–7", "Duty and station manager roles.")],
    hiring=_hire(("Stage 1 — Education", "Degree/MBA", "Aviation or management degree.", [], "Degree done."),
                 ("Stage 2 — Entry role", "Campus or direct", "Operations executive/trainee.", [paper("Interview / case", "Discussion", "—", "Show planning and calm decision-making")], "Offer."),
                 ("Stage 3 — Experience", "Years", "Shift and station experience.", [], "Promotion."),
                 ("Stage 4 — Manager role", "Later", "Lead operations.", [], "Appointment.")),
    checklist=["You understand airline/airport operations.", "You know key regulations for your area.", "You can manage disruptions.", "You lead teams calmly."],
    timeline=[("Degree", "3 years"), ("MBA (optional)", "2 years"), ("Experience", "3–7 years")],
    prep=[{"phase": "Study", "duration": "3–5 years", "focus": ["Aviation management", "Internships"]}, {"phase": "Work", "duration": "Years", "focus": ["Operations experience", "IATA courses"]}],
    resources=[{"label": "RGNAU", "url": "https://rgnau.ac.in/", "note": "Aviation management programmes."}, {"label": "DGCA", "url": "https://www.dgca.gov.in/", "note": "Civil aviation regulator."}],
    ladder=[["Start", "Operations Executive", "0–3 years", "Coordination"], ["Mid", "Duty / Operations Manager", "3–7 years", "Shifts and teams"], ["Senior", "Head of Operations", "7+ years", "Network"]],
    special=["Operations roles involve shifts and disruption handling, especially during bad weather and peak seasons."],
    mistakes=["Ignoring regulations.", "No on-ground experience.", "Poor communication during disruptions."],
    faqs=[{"q": "Is an aviation MBA required?", "a": "Not strictly; experience matters a lot, but an aviation/management degree helps."},
          {"q": "What does RGNAU require for MBA?", "a": "A bachelor's with 50% (5% relaxation SC/ST/PwD) and an accepted entrance score or RGNAU's test."},
          {"q": "Which companies hire?", "a": "Airlines, airport operators, ground handlers and cargo firms."}],
    related_items=[related("airport-ground-staff", "Airport Ground Staff", "Entry route"), related("cabin-crew-air-hostess", "Cabin Crew", "Airline roles"), related("event-manager", "Event Manager", "Operations skills")],
    institutes=[RGNAU, IATA, AAI, BCAS],
    sources=[source("RGNAU", "https://rgnau.ac.in/", "BBA/MBA Aviation Management eligibility."), source("DGCA", "https://www.dgca.gov.in/", "Regulator.")],
    extra_sections=_extra([["Operations control systems", "Flight status"], ["Rostering tools", "Staff and crew"], ["Excel/dashboards", "Performance"], ["Radios", "Coordination"]],
                          ["Morning operations brief", "Monitor on-time performance", "Handle disruptions", "Vendor meetings", "Daily report"],
                          ["How do you handle a fog-related disruption?", "What is turnaround time?", "How do you ensure safety compliance?", "Describe managing a difficult team member."],
                          [["Airline", "Station and OCC roles"], ["Airport operator", "Terminal and airside ops"], ["Cargo/MRO", "Specialised operations"]]),
)

FRONT = _av(
    "hotel-front-office-executive", "Hotel Front Office Executive", "Front Office", "How to become a Hotel Front Office Executive",
    "A front office executive welcomes guests, handles check-in/check-out, reservations, billing and requests — the face of the hotel.",
    authority="Hired by hotels, resorts and hospitality chains", icon="Building2",
    duties=["Check-in and check-out guests", "Handle reservations and room allocation", "Billing and payments", "Resolve complaints and requests", "Coordinate with housekeeping", "Upsell rooms and services"],
    postings=["Hotels, resorts, service apartments, hospitals' guest services, cruise lines"],
    facts=[fact("Education", "12th + IHM degree/diploma preferred"), fact("Main route", "B.Sc. HHA via NCHM JEE (no age bar)"), fact("Diploma", "IHM Front Office diploma"),
           fact("Core skills", "Communication, grooming, PMS software"), fact("Work", "Rotational shifts")],
    levels=[["Trainee", "Guest handling basics"], ["Associate", "Check-ins, reservations, billing"], ["Supervisor", "Shift lead and guest relations"]],
    steps=[step("12th with English", "School", "Needed for IHM courses."), step("Take NCHM JEE or a diploma", "After 12th", "B.Sc. HHA (3 years) or a front-office diploma."),
           step("Industrial training", "During course", "Hotel internship."), step("Join a hotel", "After course", "Front office associate."),
           step("Learn PMS and upselling", "Year 1", "Property management systems."), step("Grow", "Later", "Supervisor → Front Office Manager.")],
    hiring=_hire(("Stage 1 — Admission", "NCHM JEE (NTA)", "IHM admission.", [paper("NCHM JEE", "CBT", "As per NTA", "No age bar; 10+2 with English")], "Seat."),
                 ("Stage 2 — Course + industrial training", "1.5–3 years", "Hotel training.", [], "Complete course."),
                 ("Stage 3 — Hotel recruitment", "Campus/direct", "Interview and grooming check.", [paper("Interview", "Discussion", "—", "Smile and clear English")], "Offer."),
                 ("Stage 4 — On-the-job training", "First months", "Hotel standards and PMS.", [], "Confirmed.")),
    checklist=["You speak clearly and politely.", "You can use hotel software.", "You handle complaints calmly.", "You are well groomed."],
    timeline=[("IHM course", "1.5–3 years"), ("Job", "After"), ("Supervisor", "2–4 years")],
    prep=[{"phase": "Admission", "duration": "Class 12", "focus": ["NCHM JEE prep", "English"]}, {"phase": "Course", "duration": "1.5–3 years", "focus": ["Industrial training"]}],
    resources=[{"label": "NCHMCT admissions", "url": "https://nchm.gov.in/admission/bsc-hospitality-and-hotel-administration-generic", "note": "Official eligibility."}],
    ladder=[["Start", "Front Office Associate", "0–2 years", "Desk"], ["Mid", "Supervisor / Guest Relations", "2–5 years", "Shift lead"], ["Senior", "Front Office Manager", "5–8 years", "Department"], ["Top", "Rooms Division Manager / GM", "8+ years", "Hotel"]],
    special=["Hotel careers often need relocation and shift work, especially at the start."],
    mistakes=["Weak English.", "Poor grooming.", "Arguing with guests."],
    faqs=[{"q": "Is there an age limit for B.Sc. HHA?", "a": "NCHMCT lists no age bar; you need 10+2 with English."},
          {"q": "Can commerce/arts students apply?", "a": "Yes — any stream with English."},
          {"q": "Degree or diploma?", "a": "Diploma is faster; the degree helps for supervisory and management roles."}],
    related_items=[related("f-and-b-manager", "F&B Manager", "Hotel career"), related("event-manager", "Event Manager", "Events"), related("cruise-line-hospitality-staff", "Cruise Line Staff", "Cruise hospitality")],
    institutes=[NCHM, IHM_PUSA, THSC, IITTM],
    sources=[source("NCHMCT — B.Sc. HHA admission", "https://nchm.gov.in/admission/bsc-hospitality-and-hotel-administration-generic", "No age bar, 10+2 with English, NCHM JEE.")],
    extra_sections=_extra([["Property management system (PMS)", "Bookings and billing"], ["Key-card system", "Rooms"], ["Payment terminals", "Billing"], ["Phone/PBX", "Guest calls"]],
                          ["Shift handover", "Check-outs and billing", "Check-ins and room allocation", "Handle requests/complaints", "Night audit (night shift)"],
                          ["How do you handle an overbooking?", "A guest complains about a dirty room — what do you do?", "How do you upsell?", "Why hospitality?"],
                          [["Hotel chain", "Structured training and growth"], ["Resort", "Leisure guests"], ["Cruise line", "International exposure"]]),
)

FNB = _av(
    "f-and-b-manager", "F&B Manager", "Food & Beverage", "How to become an F&B (Food & Beverage) Manager",
    "An F&B manager runs a hotel's or restaurant's food and beverage operations — outlets, banquets, menus, staff, costs, quality and food safety.",
    authority="Hired by hotels, restaurants, clubs, airlines' catering and cruise lines", icon="UtensilsCrossed",
    duties=["Run restaurants, bars and banquets", "Plan menus with chefs", "Control food and beverage costs", "Train and schedule staff", "Ensure food safety and hygiene", "Handle guest feedback"],
    postings=["Hotels, restaurant chains, clubs, caterers, cruise lines"],
    facts=[fact("Education", "Hotel-management degree + F&B experience"), fact("Route", "IHM B.Sc. HHA / F&B diploma → associate → supervisor → manager"),
           fact("Food safety", "FSSAI FoSTaC training"), fact("Core skills", "Service, cost control, leadership"), fact("Work", "Long hours, weekends")],
    levels=[["Associate", "Service standards"], ["Supervisor", "Outlet shift lead"], ["Manager", "Outlets, costs and teams"]],
    steps=[step("IHM degree or diploma", "1.5–3 years", "Via NCHM JEE or IHM diploma admission."), step("Start in F&B service", "Years 1–2", "Steward/associate."),
           step("Learn cost control and menus", "Years 2–4", "Food cost, beverage control, inventory."), step("Get food-safety training", "Early", "FSSAI FoSTaC supervisor training."),
           step("Supervise an outlet", "Years 3–5", "Shift lead/captain."), step("Become F&B Manager", "Years 6–10", "Run multiple outlets.")],
    hiring=_hire(("Stage 1 — Hospitality education", "1.5–3 years", "IHM course.", [paper("NCHM JEE (for B.Sc. HHA)", "CBT", "As per NTA", "10+2 with English")], "Seat."),
                 ("Stage 2 — Entry job", "After course", "F&B associate.", [], "Offer."),
                 ("Stage 3 — Growth", "Years", "Supervisor and assistant manager.", [], "Promotion."),
                 ("Stage 4 — Manager", "Later", "Interview for F&B Manager.", [paper("Interview + case", "Discussion", "—", "Show cost and team results")], "Appointment.")),
    checklist=["You know service standards.", "You can control costs.", "You lead and train teams.", "You follow food-safety rules."],
    timeline=[("IHM course", "1.5–3 years"), ("Associate → supervisor", "3–5 years"), ("Manager", "6–10 years")],
    prep=[{"phase": "Study", "duration": "1.5–3 years", "focus": ["F&B service", "Industrial training"]}, {"phase": "Work", "duration": "Years", "focus": ["Cost control", "Leadership"]}],
    resources=[{"label": "FSSAI FoSTaC", "url": "https://fostac.fssai.gov.in/", "note": "Food safety training."}],
    ladder=[["Start", "F&B Associate", "0–2 years", "Service"], ["Mid", "Captain / Supervisor / Outlet Manager", "2–6 years", "Outlet"], ["Senior", "F&B Manager", "6–10 years", "All outlets"], ["Top", "Director of F&B / GM", "10+ years", "Hotel"]],
    special=["Food businesses need FSSAI licence/registration and trained food-safety supervisors."],
    mistakes=["Ignoring costs.", "Weak hygiene.", "Not developing staff."],
    faqs=[{"q": "Can I start directly as F&B manager?", "a": "Rarely — most managers grow from associate and supervisor roles."},
          {"q": "Which course is best?", "a": "IHM B.Sc. HHA or an F&B service diploma, plus food-safety training."},
          {"q": "Is bar knowledge needed?", "a": "Basic beverage knowledge helps in hotels and restaurants with bars, following local liquor laws."}],
    related_items=[related("hotel-front-office-executive", "Hotel Front Office", "Hotel career"), related("event-manager", "Event Manager", "Banquets"), related("cruise-line-hospitality-staff", "Cruise Line Staff", "Cruise F&B")],
    institutes=[NCHM, IHM_PUSA, FOSTAC, THSC],
    sources=[source("NCHMCT — F&B Service diploma", "https://nchm.gov.in/admission/diploma-food-beverage-service", "Diploma details."), source("FSSAI FoSTaC", "https://fostac.fssai.gov.in/", "Food safety training.")],
    extra_sections=_extra([["POS system", "Orders and billing"], ["Inventory software", "Stock and costs"], ["Banquet planning tools", "Events"], ["Food safety logs", "Compliance"]],
                          ["Briefing with outlet teams", "Check bookings and banquets", "Monitor service", "Review costs", "Guest feedback"],
                          ["How do you reduce food cost?", "Handle a guest who found a hair in food?", "How do you train new staff?", "Plan a 300-guest banquet."],
                          [["Hotel", "Multiple outlets and banquets"], ["Restaurant chain", "Multi-unit operations"], ["Cruise line", "Large-scale F&B"]]),
)

EVENT = _av(
    "event-manager", "Event Manager", "Event Management", "How to become an Event Manager",
    "An event manager plans and runs events — weddings, corporate conferences, concerts, exhibitions and launches — handling budgets, vendors, venues, permissions and on-ground execution.",
    authority="Hired by event agencies, hotels, corporates and wedding planners", icon="CalendarDays",
    duties=["Understand client goals and budget", "Plan venues, vendors and timelines", "Coordinate production, catering and logistics", "Get permissions and manage safety", "Run the event on the day", "Review and report"],
    postings=["Event agencies, wedding planners, hotels/banquets, corporates, sports and entertainment"],
    facts=[fact("Education", "Graduation"), fact("Helpful courses", "BBA/BMS, hotel management, tourism, MBA/PG in events"), fact("Core skills", "Planning, negotiation, crisis handling"),
           fact("Work", "Weekends, travel, long event days"), fact("Freelance", "Common after experience")],
    levels=[["Assistant", "Vendor coordination and logistics"], ["Executive", "Run small events"], ["Manager", "Own large events and budgets"]],
    steps=[step("Graduate", "3 years", "BBA/BMS, hotel management, tourism or mass media."), step("Volunteer and intern", "During college", "College fests and agency internships."),
           step("Join an agency", "After graduation", "Event executive/coordinator."), step("Learn budgets and vendors", "Years 1–3", "Contracts and negotiation."),
           step("Learn permissions and safety", "Ongoing", "Local licences, fire safety, crowd management."), step("Lead events", "Years 3+", "Manager or own business.")],
    hiring=_hire(("Stage 1 — Graduation", "3 years", "Relevant degree.", [], "Degree done."),
                 ("Stage 2 — Portfolio of events", "During college", "Fests, internships.", [], "Show events you worked on."),
                 ("Stage 3 — Interview", "Agency/hotel", "Planning and people skills.", [paper("Interview + mini event plan", "Discussion", "—", "Show a budget and timeline")], "Offer."),
                 ("Stage 4 — On-ground trial", "First events", "Performance on event days.", [], "Confirmation.")),
    checklist=["You can make a timeline and budget.", "You manage vendors well.", "You stay calm in crises.", "You know safety and permission basics."],
    timeline=[("Graduation", "3 years"), ("Assistant", "0–2 years"), ("Manager", "3–6 years")],
    prep=[{"phase": "College", "duration": "3 years", "focus": ["Volunteering", "Internships"]}, {"phase": "Work", "duration": "Years", "focus": ["Budgets", "Vendors", "Safety"]}],
    resources=[{"label": "IITTM", "url": "https://www.iittm.ac.in/", "note": "Tourism and travel programmes."}, {"label": "THSC", "url": "https://www.thsc.in/", "note": "Skill courses."}],
    ladder=[["Start", "Event Assistant / Coordinator", "0–2 years", "Logistics"], ["Mid", "Event Executive / Manager", "2–6 years", "Own events"], ["Senior", "Senior Manager / Head", "6+ years", "Large events"], ["Business", "Own agency", "Any time", "Clients"]],
    special=["Large public events need police, fire and local permissions — plan these early."],
    mistakes=["No written contracts.", "No backup plans.", "Ignoring safety and permissions."],
    faqs=[{"q": "Is an event management course needed?", "a": "Not mandatory; experience and a strong portfolio matter most."},
          {"q": "Can I start freelancing?", "a": "Yes, after gaining experience and vendor contacts."},
          {"q": "Which degree helps most?", "a": "BBA/BMS, hotel management or tourism are common."}],
    related_items=[related("f-and-b-manager", "F&B Manager", "Banquets"), related("hotel-front-office-executive", "Hotel Front Office", "Hospitality"), related("aviation-operations-manager", "Aviation Operations Manager", "Operations")],
    institutes=[IITTM, NCHM, THSC, IHM_PUSA],
    sources=[source("IITTM", "https://www.iittm.ac.in/", "Tourism and travel programmes."), source("THSC", "https://www.thsc.in/", "Hospitality skill courses.")],
    extra_sections=_extra([["Project planning sheets", "Timelines"], ["Budget tracker", "Costs"], ["Vendor contracts", "Agreements"], ["Walkie-talkies", "On-ground coordination"]],
                          ["Client calls", "Vendor follow-ups", "Site visits", "Run-of-show planning", "Event-day execution"],
                          ["Plan a 200-guest corporate event in 2 weeks.", "What if the sound system fails?", "How do you negotiate with vendors?", "Show an event you managed."],
                          [["Event agency", "Variety of clients"], ["Hotel banquets", "Weddings and conferences"], ["Corporate", "In-house events"], ["Own business", "After experience"]]),
)

CRUISE = _av(
    "cruise-line-hospitality-staff", "Cruise Line Hospitality Staff", "Cruise Hospitality", "How to become Cruise Line Hospitality Staff",
    "Cruise hospitality staff work on ships in hotel roles — front desk, F&B, housekeeping, galley and guest services — on contracts that last several months.",
    authority="Hired by cruise lines through approved recruitment agencies", icon="Ship",
    duties=["Guest services and front desk", "Restaurant and bar service", "Cabin housekeeping", "Galley/kitchen work", "Safety drills as crew", "Work in multicultural teams"],
    postings=["International and Indian cruise lines, river cruises"],
    facts=[fact("Education", "Hospitality training + STCW + CDC"), fact("Mandatory", "DG Shipping-approved STCW basic safety training, INDoS, CDC"),
           fact("Medical", "DG Shipping-approved doctor"), fact("Contracts", "Several months on board"), fact("Language", "Good English")],
    levels=[["Fresher", "Hotel experience on land"], ["Crew", "First contract on board"], ["Senior", "Supervisor/manager on ship"]],
    steps=[step("Get hospitality training", "1.5–3 years", "IHM diploma/degree or equivalent."), step("Gain hotel experience", "1–2 years", "Cruise lines prefer experienced staff."),
           step("Get INDoS and STCW courses", "Weeks", "At DG Shipping-approved institutes."), step("Apply via approved recruiters", "When ready", "Use DG Shipping-approved cruise recruitment agencies."),
           step("Medical, CDC and visa", "After selection", "DG Shipping medical, CDC and required visas."), step("Join the ship", "Contract", "Grow to senior roles over contracts.")],
    hiring=_hire(("Stage 1 — Hospitality training", "1.5–3 years", "IHM or equivalent.", [], "Course done."),
                 ("Stage 2 — Selection", "Recruiter/cruise line", "Interview and skills check.", [paper("Interview (often video)", "English and role skills", "—", "Show hotel experience")], "Offer letter."),
                 ("Stage 3 — STCW, CDC and medical", "Before joining", "DG Shipping requirements.", [], "Documents complete."),
                 ("Stage 4 — Join the ship", "Contract", "Onboard training and safety drills.", [], "Complete contract.")),
    checklist=["You have hospitality training and experience.", "You have INDoS, STCW courses and a CDC.", "You passed the DG Shipping medical.", "You speak good English."],
    timeline=[("Hospitality course", "1.5–3 years"), ("Hotel experience", "1–2 years"), ("STCW + CDC", "Weeks"), ("First contract", "Months")],
    prep=[{"phase": "Training", "duration": "2–5 years", "focus": ["IHM course", "Hotel experience"]}, {"phase": "Documents", "duration": "Weeks", "focus": ["INDoS", "STCW", "CDC", "Medical"]}],
    resources=[{"label": "DG Shipping", "url": "https://www.dgshipping.gov.in/", "note": "CDC, INDoS and approved courses."}],
    ladder=[["Start", "Assistant / Steward", "First contracts", "Service"], ["Mid", "Supervisor", "Several contracts", "Team lead"], ["Senior", "Department Manager", "Years", "Ship department"]],
    special=["Use only DG Shipping-approved recruitment agencies — fraud is common in cruise job offers.",
             "STCW courses must be from DG Shipping-approved institutes, and you need an INDoS number first."],
    mistakes=["Paying unapproved agents.", "Fake STCW certificates.", "Joining without hotel experience."],
    faqs=[{"q": "What documents do I need?", "a": "Passport, INDoS, STCW basic safety courses, CDC, DG Shipping medical and visas as required."},
          {"q": "Is hotel experience needed?", "a": "Most cruise lines prefer 1–2 years of hotel experience."},
          {"q": "How long are contracts?", "a": "Usually several months on board, followed by leave."}],
    related_items=[related("f-and-b-manager", "F&B Manager", "F&B career"), related("hotel-front-office-executive", "Hotel Front Office", "Guest services"), related("cabin-crew-air-hostess", "Cabin Crew", "Travel hospitality")],
    institutes=[DGS, NCHM, IHM_PUSA, THSC],
    sources=[source("DG Shipping", "https://www.dgshipping.gov.in/", "INDoS, CDC and STCW courses.")],
    extra_sections=_extra([["Ship PMS / POS", "Guest billing"], ["Safety equipment", "Drills"], ["Housekeeping tools", "Cabins"], ["Crew apps", "Schedules"]],
                          ["Morning safety/department brief", "Guest service shift", "Break", "Evening service", "Safety drills as scheduled"],
                          ["Why cruise jobs?", "How do you handle homesickness on long contracts?", "Describe teamwork with other cultures.", "A guest is seasick — what do you do?"],
                          [["International cruise line", "Global guests"], ["Indian/river cruises", "Domestic itineraries"], ["Luxury lines", "High service standards"]]),
)

GUIDES = [CREW, GROUND, OPS, FRONT, FNB, EVENT, CRUISE]
_BY_KEY = {slugify(k): g for g in GUIDES for k in (g["slug"], g["title"])}


def aviation_guide(value):
    g = _BY_KEY.get(slugify(value or ""))
    return deepcopy(g) if g else None
