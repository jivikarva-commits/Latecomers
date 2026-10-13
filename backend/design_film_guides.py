"""Design — Photography & Film guides, plus the Design catalog lookup (sources listed in design_guides.py)."""
from copy import deepcopy

import design_guides as dg
import design_media_guides as dm
from career_catalog import slugify
from design_guides import ADOBE, DRONE, EARN, FTII, MESC, NID, RESOLVE, SRFTI, _des, _extra, _hiring, _timeline
from gov_guide_kit import fact, related, source, stage, paper, step

PF = "Photography & Film"

PHOTOGRAPHER = _des(
    "commercial-photographer", "Commercial Photographer", "Commercial Photography", "How to become a Commercial Photographer",
    "A commercial photographer shoots images that sell — products, food, fashion, interiors, corporate portraits and ad campaigns — for brands, e-commerce and agencies.", PF,
    duties=["Plan shoots from a brief and mood board", "Set up lighting and camera", "Direct models, stylists and assistants", "Shoot products, people or spaces",
            "Retouch and deliver images", "Handle usage rights, quotes and invoices"],
    postings=["Studios, e-commerce companies, ad agencies, brands and freelance"],
    facts=[fact("Education", "Photography/fine-arts/design degree or diploma"), fact("Core skills", "Lighting, composition, retouching, client handling"),
           fact("Tools", "Camera, lenses, studio lights, Lightroom, Photoshop"), fact("Hiring rounds", "Portfolio → test shoot → interview"),
           fact("Common entry", "Assistant to a working photographer"), fact("Top programme", "NID M.Des Photography Design")],
    levels=[["Beginner", "Exposure, composition, natural light"], ["Intermediate", "Studio lighting, product and portrait shoots, retouching"],
            ["Job-ready", "Consistent commercial-quality work, client workflow and usage rights"]],
    steps=[step("Camera basics", "Months 1–2", "Exposure triangle, focus, lenses and composition."), step("Learn lighting", "Months 2–5", "Strobes, softboxes, light shaping for products and people."),
           step("Editing and retouching", "Months 3–6", "Lightroom and Photoshop."), step("Assist professionals", "Months 4–12", "Learn sets, clients and workflow."),
           step("Build a niche portfolio", "Months 6–12", "Product, food, fashion or interiors."), step("Get clients / studio job", "After portfolio", "E-commerce studios, agencies, brands.")],
    hiring=_hiring("Test shoot of a product or portrait", "Lighting setups, workflow, retouching and your portfolio"),
    checklist=["You control light confidently.", "You can retouch to commercial standards.", "You have a focused portfolio.", "You understand quotes, contracts and image usage rights."],
    timeline=_timeline(("Camera basics", "Months 1–2"), ("Lighting", "Months 2–5"), ("Retouching", "Months 3–6"), ("Assisting + portfolio", "Months 4–12")),
    prep=[{"phase": "Craft", "duration": "Months 1–6", "focus": ["Lighting", "Retouching"]}, {"phase": "Business", "duration": "Months 6–12", "focus": ["Portfolio", "Clients"]}],
    resources=[{"label": "Adobe Certified Professional", "url": "https://certifiedprofessional.adobe.com/en/get-started", "note": "Photoshop exam."}],
    ladder=[["Start", "Photography Assistant", "0–2 years", "Sets and lighting"], ["Mid", "Photographer", "2–5 years", "Own shoots"],
            ["Senior", "Senior / Studio Photographer", "5+ years", "Campaigns"], ["Top", "Studio owner / Creative Director", "Long term", "Business"]],
    special=["Use written agreements for image usage, model releases and payment terms."],
    mistakes=["Buying gear before learning light.", "Unfocused portfolio.", "No contracts."],
    faqs=[{"q": "Do I need an expensive camera?", "a": "Lighting and skill matter more; many start with an entry-level camera and one good lens."},
          {"q": "Is a degree required?", "a": "Studios and agencies often ask for a photography/design degree or diploma; freelance clients judge your portfolio."},
          {"q": "Which niche pays best?", "a": "It varies — product/e-commerce gives steady volume; advertising campaigns pay more per shoot."}],
    related_items=[related("drone-photographer-videographer", "Drone Photographer", "Aerial"), related("cinematographer-dop", "Cinematographer / DOP", "Moving image"),
                   related("packaging-designer", "Packaging Designer", "Product visuals")],
    institutes=[NID, ADOBE, MESC],
    sources=[source("NID M.Des Admissions Handbook 2027-28", "https://admissions.nid.edu/", "Photography Design programme.")],
    extra_sections=_extra(
        [["Camera + lenses", "Shooting", "Paid"], ["Studio lights", "Lighting", "Paid / rent"], ["Lightroom", "Editing", "Paid"], ["Photoshop", "Retouching", "Paid"]],
        ["Prep gear and mood board", "Set up lights", "Shoot with client feedback", "Select and retouch", "Deliver and invoice"],
        [["E-commerce product set (white background)", "Technical lighting"], ["Food shoot for a café", "Styling"], ["Corporate portraits", "Directing people"]],
        ["Explain your lighting for this image.", "How do you shoot reflective products?", "How do you price a shoot?", "What's in a model release?"], EARN),
)

DOP = _des(
    "cinematographer-dop", "Cinematographer / DOP", "Cinematography", "How to become a Cinematographer / Director of Photography (DOP)",
    "A cinematographer (DOP) designs how a film, ad or show looks — camera, lenses, framing, movement and lighting — and leads the camera and lighting team.", PF,
    duties=["Plan the visual style with the director", "Choose camera, lenses and lighting", "Design shots and camera movement", "Lead camera, grip and lighting crews",
            "Work with the colourist on the final look", "Manage schedules on set"],
    postings=["Film, OTT, ads, music videos, documentaries"],
    facts=[fact("Education", "Film degree/diploma; FTII MFA needs graduation"), fact("Film school", "FTII MFA Cinematography — 3 years, 11 seats"),
           fact("Core skills", "Lighting, composition, camera, leadership"), fact("Usual path", "Camera assistant → operator → DOP"), fact("Hiring", "Showreel and references")],
    levels=[["Beginner", "Camera basics and composition"], ["Intermediate", "Lighting scenes, lenses and movement"], ["Professional", "Consistent visual storytelling and crew leadership"]],
    steps=[step("Learn camera and lenses", "Months 1–3", "Exposure, focal length, sensor size, frame rates."), step("Learn lighting", "Months 2–8", "Three-point, motivated light, night and day exteriors."),
           step("Shoot short films", "Months 4–12", "Collaborate with student directors."), step("Film school (optional)", "After graduation", "FTII MFA via FTII-ET or SRFTI."),
           step("Assist on sets", "Year 1+", "Camera assistant/focus puller to learn professional workflow."), step("Build a showreel", "Ongoing", "Your best-lit scenes.")],
    hiring=_hiring("Shoot or light a short scene", "Your visual choices, lighting plans and how you work with directors", "Your showreel and references are checked first."),
    checklist=["You can light scenes with intention.", "You know lenses and camera systems.", "You have shot several short films.", "You have a strong showreel."],
    timeline=_timeline(("Camera + lighting", "Months 1–8"), ("Short films", "Months 4–12"), ("Film school / assisting", "Years 1–3"), ("Showreel", "Ongoing")),
    prep=[{"phase": "Craft", "duration": "Year 1", "focus": ["Lighting", "Shooting shorts"]}, {"phase": "Industry", "duration": "Years 1–3+", "focus": ["Assisting", "Film school"]}],
    resources=[{"label": "FTII prospectus", "url": "https://ftii.ac.in/ftii-prospectus-et-2025-26", "note": "MFA Cinematography details."}],
    ladder=[["Start", "Camera Assistant / Focus Puller", "0–3 years", "Camera dept"], ["Mid", "Camera Operator / DOP for shorts & ads", "3–6 years", "Own projects"],
            ["Senior", "DOP for features/OTT", "6+ years", "Large crews"]],
    special=["FTII admission is through its own entrance test (FTII-ET); seats per specialisation are limited (11 for Cinematography)."],
    mistakes=["Focusing on gear over light.", "Not collaborating with directors.", "Weak showreel."],
    faqs=[{"q": "Is film school necessary?", "a": "Not mandatory, but FTII/SRFTI training and networks help; many DOPs also rise by assisting."},
          {"q": "What's needed for FTII?", "a": "A bachelor's degree in any discipline and clearing FTII-ET."},
          {"q": "How long to become a DOP?", "a": "Often several years of assisting and shooting smaller projects."}],
    related_items=[related("film-director", "Film Director", "Works closely"), related("color-grading-artist", "Color Grading Artist", "Final look"), related("drone-photographer-videographer", "Drone Videographer", "Aerial shots")],
    institutes=[FTII, SRFTI, NID, MESC],
    sources=[source("FTII Admission Prospectus FTII-ET-2025-26", "https://ftii.ac.in/ftii-prospectus-et-2025-26", "MFA Cinematography eligibility and seats.")],
    extra_sections=_extra(
        [["Cinema cameras", "Shooting", "Rent"], ["Lenses", "Look", "Rent"], ["Lighting kits", "Lighting", "Rent"], ["Light meter / monitors", "Exposure", "Paid"]],
        ["Tech recce and shot list", "Lighting setup", "Shoot with the director", "Review rushes", "Plan next day"],
        [["Short film you shot", "Storytelling"], ["Music video", "Style"], ["Lighting study scenes", "Craft"]],
        ["How would you light a night interior?", "Choose lenses for a close-up and why.", "How do you work with a director?", "Show a scene and explain the lighting."],
        [["Film/OTT crew", "Hired per project", "Long-form work"], ["Ads and music videos", "Per-shoot fees", "Higher day rates"], ["Documentary/corporate", "Steady projects", "Variety"]]),
)

DIRECTOR = _des(
    "film-director", "Film Director", "Film Direction", "How to become a Film Director",
    "A film director turns a script into a film — guiding actors, camera, sound and editing — and is responsible for the creative vision of films, series, ads and documentaries.", PF,
    duties=["Develop the script and vision", "Cast and rehearse actors", "Plan shots with the DOP", "Lead the crew on set", "Supervise editing and sound", "Present to producers and platforms"],
    postings=["Films, OTT series, ads, music videos, documentaries"],
    facts=[fact("Education", "Graduation + film school"), fact("Film school", "FTII MFA Direction & Screenplay Writing — 3 years, 11 seats"),
           fact("Core skills", "Storytelling, working with actors, visual language, leadership"), fact("Usual path", "Assistant director → shorts/ads → features"),
           fact("Hiring", "Short films and references; producers fund projects")],
    levels=[["Beginner", "Write and shoot micro-shorts"], ["Intermediate", "Direct actors and complete short films"], ["Professional", "Lead full crews and deliver ads/series/films"]],
    steps=[step("Watch and analyse films", "Ongoing", "Study scenes, structure and performance."), step("Write and make short films", "Months 1–12", "Finish small films with friends."),
           step("Learn screenwriting", "Months 3–12", "Structure, scenes, dialogue."), step("Film school (optional)", "After graduation", "FTII MFA via FTII-ET or SRFTI."),
           step("Work as an assistant director", "Years 1–3", "Learn sets, scheduling and production."), step("Make your calling-card film", "Ongoing", "Festivals and platforms.")],
    hiring=[stage("Step 1 — Short films and showreel", "Ongoing", "Your films are your portfolio.", [paper("2–3 completed short films", "Links", "—", "Finish films; quality over length")], "Clear voice and craft."),
            stage("Step 2 — Assistant director work", "Years 1–3", "Most directors learn on professional sets.", [], "Reliable, organised work on set."),
            stage("Step 3 — Pitch and get funded", "When ready", "Pitch scripts to producers, platforms or brands.", [paper("Pitch deck + script", "Document", "—", "Know your budget and audience")], "A producer or platform backs the project.")],
    checklist=["You have completed short films.", "You can work with actors.", "You understand shot design and editing.", "You have on-set experience as an AD."],
    timeline=_timeline(("Short films", "Year 1"), ("Screenwriting", "Year 1"), ("Film school / AD work", "Years 1–3"), ("Calling-card film", "Ongoing")),
    prep=[{"phase": "Make", "duration": "Year 1", "focus": ["Shorts", "Writing"]}, {"phase": "Industry", "duration": "Years 1–3+", "focus": ["AD work", "Film school", "Festivals"]}],
    resources=[{"label": "FTII prospectus", "url": "https://ftii.ac.in/ftii-prospectus-et-2025-26", "note": "MFA Direction & Screenplay Writing."}],
    ladder=[["Start", "Assistant Director", "0–3 years", "Set coordination"], ["Mid", "Director (shorts/ads/music videos)", "3–6 years", "Own projects"],
            ["Senior", "Feature/Series Director", "6+ years", "Long-form"]],
    special=["Directing is project-based and uncertain — many directors also work in ads, writing or editing."],
    mistakes=["Never finishing films.", "Ignoring sound.", "Writing without feedback."],
    faqs=[{"q": "Do I need film school?", "a": "Not required, but FTII/SRFTI give training and networks; many directors start as ADs."},
          {"q": "What's needed for FTII Direction?", "a": "A bachelor's degree in any discipline and clearing FTII-ET."},
          {"q": "Can I start with a phone?", "a": "Yes — focus on story, performance and sound."}],
    related_items=[related("cinematographer-dop", "Cinematographer / DOP", "Visual partner"), related("video-editor", "Video Editor", "Post-production"), related("color-grading-artist", "Color Grading Artist", "Final look")],
    institutes=[FTII, SRFTI, NID, MESC],
    sources=[source("FTII Admission Prospectus FTII-ET-2025-26", "https://ftii.ac.in/ftii-prospectus-et-2025-26", "MFA Direction & Screenplay Writing eligibility and seats.")],
    extra_sections=_extra(
        [["Screenwriting software", "Scripts", "Free options"], ["Storyboard tools", "Planning", "Free/paid"], ["Camera + sound kit", "Shooting", "Rent"], ["Editing software", "Post", "Free options"]],
        ["Script and prep meetings", "Rehearse with actors", "Shoot with the DOP", "Review edits", "Pitch new projects"],
        [["3-minute short film", "Storytelling"], ["Music video", "Visual style"], ["Documentary short", "Real stories"]],
        ["What is your film about in one line?", "How do you work with actors?", "Describe a scene's shot plan.", "Why this story now?"],
        [["Films/OTT", "Project fees", "Long-form storytellers"], ["Ads and brand films", "Per-project fees", "Steady income"], ["Writing + directing", "Develop your own scripts", "Independent voices"]]),
)

DRONE_PILOT = _des(
    "drone-photographer-videographer", "Drone Photographer / Videographer", "Drone", "How to become a Drone Photographer / Videographer",
    "A drone photographer/videographer shoots aerial images and video for real estate, weddings, films, events, surveys and tourism — flying safely and legally under India's Drone Rules.", PF,
    duties=["Plan flights and check airspace zones", "Fly safely and capture aerial shots", "Follow the Drone Rules and permissions", "Edit and grade footage",
            "Maintain drone and batteries", "Deliver images and video to clients"],
    postings=["Real estate, weddings/events, film/ads, tourism, infrastructure and survey companies"],
    facts=[fact("Education", "DGCA Remote Pilot Certificate (18–65, Class 10)"), fact("Law", "Drone Rules, 2021 (as amended)"), fact("Training", "DGCA-authorised RPTO"),
           fact("Platform", "Digital Sky (registration, airspace map)"), fact("Core skills", "Safe flying, composition, editing"), fact("Airspace", "Green / yellow / red zones")],
    levels=[["Beginner", "Simulator and basic flying"], ["Certified", "Remote Pilot Certificate and safe operations"], ["Professional", "Cinematic aerials, planning and client work"]],
    steps=[step("Learn the rules", "Week 1", "Drone categories, registration, airspace zones and where flying is prohibited."),
           step("Train at a DGCA-authorised RPTO", "About 1–2 weeks (varies)", "Training plus proficiency test; the Remote Pilot Certificate is issued through Digital Sky."),
           step("Register your drone", "Before commercial use", "Unique identification number on Digital Sky, as per rules."),
           step("Practise aerial cinematography", "Months 1–3", "Smooth moves, reveals, orbits, composition."), step("Learn editing", "Months 1–3", "Edit and grade aerial footage."),
           step("Get clients", "After portfolio", "Real estate, events, tourism, production houses.")],
    hiring=_hiring("Fly and shoot a short aerial sequence", "Safety, rules, flight planning and your reel", "Your certificate and aerial reel are checked first."),
    checklist=["You hold a Remote Pilot Certificate where required.", "Your drone is registered.", "You check airspace zones before every flight.", "You have a smooth aerial reel."],
    timeline=_timeline(("Rules", "Week 1"), ("RPTO training", "1–2 weeks"), ("Practice", "Months 1–3"), ("Clients", "Month 3+")),
    prep=[{"phase": "Certify", "duration": "Weeks 1–3", "focus": ["Rules", "RPTO training"]}, {"phase": "Create", "duration": "Months 1–3", "focus": ["Aerial shots", "Editing"]}],
    resources=[{"label": "Ministry of Civil Aviation", "url": "https://www.civilaviation.gov.in/", "note": "Drone Rules and policy."},
               {"label": "DaVinci Resolve training", "url": "https://www.blackmagicdesign.com/products/davinciresolve/training", "note": "Edit and grade footage."}],
    ladder=[["Start", "Drone Operator", "0–2 years", "Events and real estate"], ["Mid", "Aerial Cinematographer", "2–5 years", "Ads and films"],
            ["Senior", "Aerial unit owner / survey specialist", "5+ years", "Business"]],
    special=["Never fly in red zones or without required permission; check the Digital Sky airspace map before every flight.",
             "Nano drones and micro drones for non-commercial use have exemptions — commercial work generally needs a certified pilot."],
    mistakes=["Flying without checking zones.", "No insurance or backups.", "Shaky, fast movements."],
    faqs=[{"q": "Who can get a Remote Pilot Certificate?", "a": "Persons aged 18–65 who have passed Class 10, after training and a test at a DGCA-authorised RPTO."},
          {"q": "Do I need permission for every flight?", "a": "Green zones generally need no permission; yellow and red zones need permission as per the rules — always check the airspace map."},
          {"q": "Is a degree needed?", "a": "Not for the certificate; media/photography training helps for agency jobs."}],
    related_items=[related("commercial-photographer", "Commercial Photographer", "Photography"), related("cinematographer-dop", "Cinematographer / DOP", "Film"), related("video-editor", "Video Editor", "Editing")],
    institutes=[DRONE, RESOLVE, ADOBE, MESC],
    sources=[source("Ministry of Civil Aviation — Drone Rules, 2021", "https://www.civilaviation.gov.in/", "Remote Pilot Certificate, registration and airspace rules.")],
    extra_sections=_extra(
        [["Camera drone", "Aerial shots", "Paid"], ["Digital Sky", "Registration and airspace map", "Free"], ["Flight simulator", "Practice", "Free/paid"], ["Editing software", "Post", "Free options"]],
        ["Check weather and airspace", "Pre-flight checklist", "Fly and shoot", "Back up footage", "Edit and deliver"],
        [["Real estate aerial tour", "Smooth moves"], ["Wedding/event aerials", "Timing"], ["Travel/tourism reel", "Storytelling"]],
        ["What are green, yellow and red zones?", "What is your pre-flight checklist?", "How do you get smooth shots?", "What do you do if signal is lost?"], EARN),
)

GUIDES = [*dg.GUIDES_GV_UX, *dm.GUIDES, PHOTOGRAPHER, DOP, DIRECTOR, DRONE_PILOT]
_BY_KEY = {slugify(k): g for g in GUIDES for k in (g["slug"], g["title"])}


def design_guide(value):
    g = _BY_KEY.get(slugify(value or ""))
    return deepcopy(g) if g else None
