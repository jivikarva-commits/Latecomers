"""Design — beginner guides for graphic, UI/UX, video, animation/gaming and photography/film careers.

Facts checked on 2026-10-13 against official sources: NID Admissions Handbooks 2027-28 (B.Des/Integrated M.Des and
M.Des), UCEED 2027 and CEED 2027 information brochures (IIT Bombay), FTII Admission Prospectus FTII-ET-2025-26,
Google UX Design Professional Certificate (Coursera), Adobe Certified Professional, Blackmagic Design DaVinci Resolve
training, Unity certifications, Epic Developer Community learning, MESC qualification packs and the Drone Rules, 2021.
No salary figures are given because there is no official source for them.
"""
from gov_guide_kit import fact, institute, paper, related, source, stage, step
from tech_guides import _guide

BACK = ["/careers-explore?field=design", "← All Design careers"]
AUTHORITY = "Hired by design studios, agencies, brands, startups and production houses"

DES_ELIGIBILITY = [
    "There is no age limit or licence for most design jobs — after the education check, selection is by portfolio, a design test and interviews.",
    "Design entrance exams (NID DAT, UCEED, CEED, FTII-ET) have their own age and qualification rules — see the Education step.",
    "You need a computer that can run design software, and practice every day.",
]


def _des(slug, title, short, headline, summary, group, **kw):
    return _guide(slug, title, short, headline, summary, group=group, scope_prefix="Design", back=BACK, icon="Palette", color="#DB2777",
                  category="Design", authority=AUTHORITY, eligibility=DES_ELIGIBILITY, test_topics="", interview_topics="", assignment="", **kw)


def _hiring(task, interview, screen="Recruiters look at your portfolio/reel first — quality matters more than quantity."):
    return [
        stage("Round 1 — Portfolio / reel review", "Before any interview", screen,
              [paper("Portfolio website, Behance/Dribbble or a showreel", "Link / PDF", "—", "Show 4–6 best pieces with your process")],
              "Work that matches the studio's style and level."),
        stage("Round 2 — Design test or assignment", "Common", "A practical task to see how you think and execute.",
              [paper(task, "Take-home or live", "2 hours – 3 days", "Explain your decisions, not just the output")], "Clear idea, clean execution, on time."),
        stage("Round 3 — Interview / portfolio walkthrough", "1–2 rounds", "You present your work and answer craft questions.",
              [paper(interview, "Discussion", "30–60 min", "Talk about problem → process → result")], "Good reasoning and openness to feedback."),
        stage("Round 4 — HR / offer", "Final", "Expectations, notice period and salary.", [], "Read the offer and any IP/bond clauses."),
    ]


def _extra(tools, day, projects, questions, earn):
    return [
        {"id": "tools", "nav": "Tools", "heading": "Tools you will use", "columns": ["Tool", "Used for", "Cost to start"], "rows": tools},
        {"id": "typical-day", "nav": "A typical day", "heading": "A typical day in this job", "items": day},
        {"id": "projects", "nav": "Portfolio projects", "heading": "Portfolio projects to build",
         "intro": "Write each one as a short case study: brief → process → final work.", "columns": ["Project", "What it proves"], "rows": projects},
        {"id": "interview-questions", "nav": "Interview questions", "heading": "Interview questions to practise", "items": questions},
        {"id": "ways-to-earn", "nav": "Ways to earn", "heading": "Ways to work and earn", "columns": ["Path", "How it works", "Good for"], "rows": earn},
    ]


EARN = [["Studio / agency job", "Work on many client projects with a team", "Fast learning and mentorship"],
        ["In-house job", "Design for one brand or product", "Depth and stability"],
        ["Freelance", "Find clients directly or on platforms; charge per project", "Flexibility once you have a portfolio"]]


def _timeline(*rows):
    return list(rows)


# ---------- Institutes / official resources ----------
NID = institute("National Institute of Design (NID)", "Institute of National Importance (Ministry of Commerce & Industry)", "https://admissions.nid.edu/",
                "4-year B.Des (NID AP, Haryana, MP, Assam), 5.5-year Integrated M.Des (Ahmedabad, Bengaluru, Gandhinagar) and 2-year M.Des in "
                "Graphic, Animation, Film & Video, Photography, Interaction, Game, Product and more. Admission through DAT Prelims + Mains.",
                "Students aiming for a top design education in India.", mode="Full-time, campus",
                eligibility="B.Des: Class 12 any stream, born on/after 1 July 2006 (General/EWS; relaxations for others). M.Des: bachelor's in any discipline")
UCEED = institute("IIT B.Des through UCEED", "IIT Bombay, Delhi, Guwahati, Hyderabad, Indore, Roorkee + IIITDM Jabalpur", "https://www.uceed.iitb.ac.in/",
                  "4-year B.Des at the participating institutes; UCEED has Part A (computer-based) and Part B (drawing and design aptitude).",
                  "12th students who want an IIT design degree.", mode="Full-time, campus",
                  eligibility="Class 12 (any stream) passed in 2026 or appearing 2027; born on/after 1 Oct 2002 (Open/EWS/OBC-NCL); max 2 attempts. "
                              "IIT Guwahati/Roorkee need PCM")
CEED = institute("M.Des through CEED (IISc, IITs, IIITDM Jabalpur)", "IIT Bombay-run entrance for M.Des/PhD", "https://www.ceed.iitb.ac.in/",
                 "M.Des programmes in interaction, communication, product and other design areas at IISc and several IITs.",
                 "Graduates (any discipline) moving into design.", mode="Full-time, campus",
                 eligibility="Degree/diploma of at least 3 years after 10+2 (final-year can apply); no age limit; score valid one year")
FTII = institute("Film and Television Institute of India (FTII), Pune", "Ministry of Information & Broadcasting", "https://ftii.ac.in/",
                 "3-year MFA in Cinema (Direction & Screenplay Writing, Cinematography, Editing, Sound, Art Direction, Screenwriting, Screen Acting) "
                 "and 1-year PG Certificates in TV (Direction, Electronic Cinematography, Video Editing, Sound).",
                 "Graduates who want serious film training.", mode="Full-time, campus", duration="3 years (MFA) / 1 year (TV certificates)",
                 eligibility="Bachelor's degree (any discipline for most specialisations); admission via FTII-ET")
SRFTI = institute("Satyajit Ray Film & Television Institute (SRFTI), Kolkata", "Ministry of Information & Broadcasting", "https://srfti.ac.in/",
                  "Postgraduate programmes in film and electronic & digital media (direction, cinematography, editing, sound and more).",
                  "Graduates who want film-school training in eastern India.", mode="Full-time, campus", eligibility="As per SRFTI admission notice")
GOOGLE_UX = institute("Google UX Design Professional Certificate (Coursera)", "Industry certificate · online", "https://www.coursera.org/professional-certificates/google-ux-design",
                      "8-course series: user research, wireframing, prototyping in Figma, usability testing and portfolio projects.",
                      "Beginners who want a structured UX course.", mode="Online, self-paced", duration="About 6 months at 10 hours/week",
                      eligibility="Beginner — no experience needed")
ADOBE = institute("Adobe Certified Professional", "Official Adobe certification (delivered by Certiport)", "https://certifiedprofessional.adobe.com/en/get-started",
                  "Exams for Photoshop, Illustrator, InDesign, Premiere Pro, After Effects and more: 30–45 questions + live tasks in 50 minutes.",
                  "Designers and editors who want proof of software skills.", mode="Test centre or online proctored",
                  eligibility="Adobe recommends about 150 hours of app experience")
RESOLVE = institute("Blackmagic Design — DaVinci Resolve training & certification", "Official software training", "https://www.blackmagicdesign.com/products/davinciresolve/training",
                    "Official books, lesson files and online certification exams for editing, colour, Fusion VFX and Fairlight audio.",
                    "Editors and colourists.", mode="Online, self-paced", fee="Free DaVinci Resolve version available")
UNITY = institute("Unity Learn + Unity Certifications", "Official Unity training", "https://unity.com/products/unity-certifications",
                  "Free Unity Learn pathways; certifications from Certified User to Associate (Game Developer, Programmer, Artist) and Professional.",
                  "Game and XR developers using Unity.", mode="Online learning; Certiport/Pearson exams")
UNREAL = institute("Epic Developer Community — Unreal Engine learning", "Official Epic Games training", "https://dev.epicgames.com/community/unreal-engine/learning",
                   "Free courses on UE5 foundations, Blueprints, animation, materials, lighting, game development and C++.",
                   "Game, VFX and virtual-production artists and developers.", mode="Online, free")
MESC = institute("Media & Entertainment Skills Council (MESC)", "Sector Skill Council under MSDE", "https://www.mescindia.org/",
                 "NSQF qualification packs and model curricula for roles such as Animator, Graphic Designer and Editor, delivered at affiliated training centres.",
                 "Learners who want a government-recognised skill certificate.", mode="Through MESC-affiliated centres")
FIGMA = institute("Figma Learn (Help Center)", "Official Figma learning", "https://help.figma.com/hc/en-us",
                  "Official tutorials on frames, auto layout, components, variables, prototyping and Dev Mode.", "UI/UX designers.", mode="Online", fee="Free")
APPLE_HIG = institute("Apple Human Interface Guidelines", "Official platform design guide", "https://developer.apple.com/design/human-interface-guidelines/",
                      "Design patterns and rules for iOS, macOS and visionOS apps.", "UI and product designers.", mode="Online", fee="Free")
MATERIAL = institute("Material Design 3 (Google)", "Official design system", "https://m3.material.io/",
                     "Components, layout, colour and accessibility guidance for Android and web.", "UI and product designers.", mode="Online", fee="Free")
WAI = institute("W3C Web Accessibility Initiative (WAI)", "Official accessibility standards body", "https://www.w3.org/WAI/fundamentals/",
                "Accessibility fundamentals and WCAG guidance for designing usable products for everyone.", "UX/UI designers and researchers.", mode="Online", fee="Free")
VISIONOS = institute("Apple visionOS developer resources", "Official Apple developer platform", "https://developer.apple.com/visionos/",
                     "Documentation, sample code and design guidance for spatial computing apps.", "AR/VR developers.", mode="Online", fee="Free")
DRONE = institute("Ministry of Civil Aviation — Drone Rules & Digital Sky", "Government of India", "https://www.civilaviation.gov.in/",
                  "Drone Rules 2021 (as amended): drone categories, registration and Remote Pilot Certificates issued after training at DGCA-authorised RPTOs.",
                  "Anyone flying drones commercially.", mode="Online + authorised RPTO training")

# ---------- Graphic & Visual ----------
GV = "Graphic & Visual"

GRAPHIC = _des(
    "graphic-designer", "Graphic Designer", "Graphic Design", "How to become a Graphic Designer",
    "A graphic designer communicates ideas visually — social posts, ads, brochures, logos, presentations and packaging — using typography, colour, layout and images.", GV,
    duties=["Understand the brief and audience", "Create layouts for social media, ads, print and presentations", "Choose typography, colour and images",
            "Follow and build brand guidelines", "Prepare files correctly for print and digital", "Revise designs from feedback"],
    postings=["Advertising and design agencies, in-house brand teams, startups, publishing and print houses", "Freelance work is common"],
    facts=[fact("Education", "B.Des/BFA"), fact("Time to job-ready", "About 6–12 months of steady practice"), fact("Core skills", "Typography, layout, colour, concept"),
           fact("Tools", "Photoshop, Illustrator, InDesign, Figma, Canva"), fact("Hiring rounds", "Portfolio → design test → interview → HR"),
           fact("Portfolio", "8–12 strong pieces across formats"), fact("Work mode", "Office, hybrid or freelance")],
    levels=[["Beginner", "Basic layouts using grids, two fonts and a clear colour palette"], ["Intermediate", "Campaign sets, print-ready files, brand-consistent work"],
            ["Job-ready", "Concept-driven work you can explain, delivered fast and print/digital ready"]],
    steps=[step("Learn design basics", "Months 1–2", "Typography, grids, hierarchy, colour theory and composition."),
           step("Learn the core tools", "Months 1–4", "Photoshop (images), Illustrator (vectors), InDesign (print), Figma (digital)."),
           step("Copy and study great work", "Months 2–4", "Recreate posters and ads to learn spacing and type pairing."),
           step("Do real briefs", "Months 3–8", "Design for a local business, NGO or college fest."),
           step("Build a portfolio site", "Months 6–9", "Show process, not just final images."),
           step("Apply for internships and jobs", "After 8–10 pieces", "Agencies and in-house teams; keep improving with feedback.")],
    hiring=_hiring("Design a social post set or a poster from a brief", "Your design choices, typography, brand guidelines, feedback handling and favourite work"),
    checklist=["You can design clear layouts with good typography.", "You can work in Photoshop, Illustrator and InDesign/Figma.", "You can prepare print and digital files correctly.",
               "You have 8–12 portfolio pieces with process.", "You can take feedback and revise quickly."],
    timeline=_timeline(("Basics", "Months 1–2"), ("Tools", "Months 1–4"), ("Real briefs", "Months 3–8"), ("Portfolio + applications", "Months 6–10")),
    prep=[{"phase": "Fundamentals", "duration": "Months 1–3", "focus": ["Typography", "Layout", "Colour"]},
          {"phase": "Practice", "duration": "Months 3–8", "focus": ["Daily design", "Real briefs", "Feedback"]},
          {"phase": "Get hired", "duration": "Months 8–10", "focus": ["Portfolio", "Applications"]}],
    resources=[{"label": "Adobe Certified Professional", "url": "https://certifiedprofessional.adobe.com/en/get-started", "note": "Exam guides and prep."},
               {"label": "Figma Learn", "url": "https://help.figma.com/hc/en-us", "note": "Free official tutorials."}],
    ladder=[["Start", "Junior Graphic Designer", "0–2 years", "Execute layouts"], ["Mid", "Graphic Designer", "2–4 years", "Own projects"],
            ["Senior", "Senior Designer / Art Director", "4–8 years", "Concepts and team"], ["Top", "Creative Director", "8+ years", "Creative vision"]],
    special=["Portfolio quality decides most hiring — 8 great pieces beat 30 average ones.", "Use licensed fonts and images; don't copy other designers' work."],
    mistakes=["Too many fonts and colours.", "Showing only final images without the thinking.", "Ignoring print specs (bleed, CMYK, resolution)."],
    faqs=[{"q": "Is Canva enough?", "a": "Canva is useful, but agencies expect Photoshop, Illustrator and InDesign/Figma."},
          {"q": "Do I need to draw well?", "a": "Basic sketching helps; graphic design is more about layout, type and ideas."},
          {"q": "Which degree is best?", "a": "B.Des (Communication/Graphic) or BFA Applied Art; diplomas also work with a strong portfolio."}],
    related_items=[related("brand-identity-designer", "Brand Identity Designer", "Specialise in branding"), related("packaging-designer", "Packaging Designer", "Design for products"),
                   related("motion-graphics-designer", "Motion Graphics Designer", "Add motion")],
    institutes=[NID, UCEED, ADOBE, MESC],
    sources=[source("NID B.Des / Integrated M.Des Admissions Handbook 2027-28", "https://admissions.nid.edu/", "Eligibility and programmes."),
             source("UCEED 2027 Information Brochure", "https://www.uceed.iitb.ac.in/", "IIT B.Des eligibility.")],
    extra_sections=_extra(
        [["Adobe Photoshop", "Photo editing and compositing", "Paid (trial)"], ["Adobe Illustrator", "Logos, icons, vectors", "Paid (trial)"],
         ["Adobe InDesign", "Brochures and print layouts", "Paid (trial)"], ["Figma", "Digital layouts and collaboration", "Free plan"], ["Canva", "Quick social designs", "Free plan"]],
        ["Read the brief and collect references", "Sketch layout ideas", "Design 2–3 options", "Review with the art director", "Revise and export final files"],
        [["Poster series for an event", "Typography and hierarchy"], ["Social campaign (6 posts) for a brand", "Consistency"],
         ["Brochure / magazine spread", "Print layout skills"], ["Redesign of a local brand's menu or flyer", "Real-world problem solving"]],
        ["Walk us through your best project.", "How do you choose fonts?", "What is bleed and why does it matter?", "How do you handle a client who wants 'more pop'?"],
        EARN),
)

BRAND = _des(
    "brand-identity-designer", "Brand Identity Designer", "Brand Identity", "How to become a Brand Identity Designer",
    "A brand identity designer creates how a brand looks and feels — logo, colours, typography, imagery style and a brand guideline that keeps everything consistent.", GV,
    duties=["Research the business, audience and competitors", "Create logo concepts and visual systems", "Define colours, typography and imagery style",
            "Build brand guidelines", "Apply the identity to stationery, packaging, social and signage", "Present concepts to clients"],
    postings=["Branding studios, design agencies, startups and freelance"],
    facts=[fact("Education", "B.Des/BFA + experience"), fact("Core skills", "Concept, typography, logo design, systems thinking"),
           fact("Tools", "Illustrator, InDesign, Figma, Photoshop"), fact("Hiring rounds", "Portfolio → branding test → interview → HR"),
           fact("Usual entry", "2–3 years as a graphic designer"), fact("Portfolio", "3–4 full identity case studies")],
    levels=[["Beginner", "Logo basics and type"], ["Intermediate", "Full identity system with applications"], ["Job-ready", "Strategy-led identities with guidelines and client presentation"]],
    steps=[step("Master graphic design basics", "Year 1", "Typography, layout and Illustrator."),
           step("Study brand strategy", "Months 6–12", "Positioning, audience, tone of voice and naming basics."),
           step("Design logos and systems", "Months 9–15", "Logos, colour systems, type pairing and patterns."),
           step("Create brand guidelines", "Months 12–18", "Usage rules, do's and don'ts, templates."),
           step("Build 3–4 case studies", "Ongoing", "Real or self-initiated brands with full applications."),
           step("Join a branding studio", "After experience", "Usually after working as a graphic designer.")],
    hiring=_hiring("Create a mini identity (logo + colours + 3 applications) from a brief", "Your process, strategy, logo rationale and client presentation"),
    checklist=["You can explain the strategy behind each identity.", "You can design a flexible logo system.", "You can write clear brand guidelines.", "You have full case studies."],
    timeline=_timeline(("Graphic design base", "Year 1"), ("Strategy + logos", "Months 6–15"), ("Guidelines + case studies", "Months 12–18")),
    prep=[{"phase": "Craft", "duration": "Year 1", "focus": ["Typography", "Illustrator"]}, {"phase": "Branding", "duration": "Months 9–18", "focus": ["Strategy", "Systems", "Guidelines"]}],
    resources=[{"label": "Adobe Certified Professional", "url": "https://certifiedprofessional.adobe.com/en/get-started", "note": "Illustrator/InDesign exams."}],
    ladder=[["Start", "Graphic Designer", "0–2 years", "Execution"], ["Mid", "Brand Designer", "2–5 years", "Identities"], ["Senior", "Senior Brand Designer / Design Lead", "5–8 years", "Lead projects"],
            ["Top", "Creative/Brand Director", "8+ years", "Studio leadership"]],
    special=["Check trademarks before finalising a logo; clients often need a trademark search.", "Never present a logo without showing it in use."],
    mistakes=["Designing logos without research.", "Too-complex marks that fail at small sizes.", "No guidelines."],
    faqs=[{"q": "Is branding only logo design?", "a": "No — it's the full visual system and rules, of which the logo is one part."},
          {"q": "Can freshers do branding?", "a": "Usually after some graphic design experience; self-initiated case studies help."},
          {"q": "Which software matters most?", "a": "Illustrator for marks, InDesign for guidelines, Figma for digital applications."}],
    related_items=[related("graphic-designer", "Graphic Designer", "Starting role"), related("packaging-designer", "Packaging Designer", "Brand on products"),
                   related("product-designer", "Product Designer", "Digital products")],
    institutes=[NID, UCEED, CEED, ADOBE],
    sources=[source("NID Admissions", "https://admissions.nid.edu/", "Programmes and eligibility.")],
    extra_sections=_extra(
        [["Illustrator", "Logos and marks", "Paid"], ["InDesign", "Brand guidelines", "Paid"], ["Figma", "Digital applications", "Free plan"], ["Photoshop", "Mock-ups", "Paid"]],
        ["Client research and mood boards", "Sketch logo ideas", "Build the identity system", "Prepare a presentation deck", "Refine after feedback"],
        [["Full identity for a café or startup", "End-to-end branding"], ["Rebrand of an existing local brand", "Strategy thinking"], ["Brand guideline document", "Systems"]],
        ["How do you start a branding project?", "Explain the idea behind a logo you made.", "How do you make a logo work at small sizes?", "What goes into brand guidelines?"],
        EARN),
)

PACKAGING = _des(
    "packaging-designer", "Packaging Designer", "Packaging Design", "How to become a Packaging Designer",
    "A packaging designer designs boxes, labels and pouches that protect the product, follow labelling rules and make people pick it off the shelf.", GV,
    duties=["Design labels, boxes, pouches and bottles", "Work with dielines and structural templates", "Follow mandatory labelling information provided by the brand",
            "Prepare print-ready artwork with printers", "Make 3D mock-ups", "Coordinate with marketing and production"],
    postings=["FMCG and D2C brands, packaging studios, printing and converting companies"],
    facts=[fact("Education", "B.Des/BFA; IIP for technical roles"), fact("Core skills", "Layout, print production, dielines, materials"),
           fact("Tools", "Illustrator, Photoshop, 3D mock-up tools"), fact("Hiring rounds", "Portfolio → artwork test → interview → HR"),
           fact("Technical route", "IIP PG Diploma in Packaging (science/engineering grads)")],
    levels=[["Beginner", "Label and box layouts"], ["Intermediate", "Dielines, print specs and mock-ups"], ["Job-ready", "Shelf-ready packaging systems with print production knowledge"]],
    steps=[step("Graphic design base", "Months 1–6", "Typography, layout, Illustrator."), step("Learn print production", "Months 4–8", "CMYK, spot colours, bleed, dielines, proofs."),
           step("Learn materials", "Months 6–10", "Paperboard, flexible packs, labels and printing processes."),
           step("Build packaging projects", "Months 6–12", "Design and mock up 3–4 product ranges."), step("Apply", "After portfolio", "Brands, studios and printers.")],
    hiring=_hiring("Design a label/box on a given dieline", "Print production, dielines, colour, legal information placement and your projects"),
    checklist=["You can design on a dieline.", "You understand print specs.", "You can create realistic mock-ups.", "You know where mandatory label information must go."],
    timeline=_timeline(("Graphic base", "Months 1–6"), ("Print + materials", "Months 4–10"), ("Projects", "Months 6–12")),
    prep=[{"phase": "Craft + print", "duration": "Months 1–8", "focus": ["Illustrator", "Print production"]}, {"phase": "Projects", "duration": "Months 6–12", "focus": ["Ranges", "Mock-ups"]}],
    resources=[{"label": "Adobe Certified Professional", "url": "https://certifiedprofessional.adobe.com/en/get-started", "note": "Illustrator exam."}],
    ladder=[["Start", "Junior Packaging Designer / Artworker", "0–2 years", "Artwork"], ["Mid", "Packaging Designer", "2–5 years", "Ranges"], ["Senior", "Lead / Design Manager", "5+ years", "Brand portfolios"]],
    special=["Label text (ingredients, MRP, manufacturer details) is a legal requirement provided by the brand — check every proof carefully.",
             "IIP's PG Diploma in Packaging is technical (materials/engineering) and needs a science/engineering degree."],
    mistakes=["Ignoring the dieline.", "Wrong colour mode for print.", "Missing mandatory information on artwork."],
    faqs=[{"q": "Is packaging design different from graphic design?", "a": "It builds on graphic design but adds structure, materials and print production."},
          {"q": "Do I need IIP?", "a": "Not for graphic packaging roles; it's for technical packaging technology roles."},
          {"q": "Which industries hire most?", "a": "FMCG, food, cosmetics, D2C and pharma."}],
    related_items=[related("graphic-designer", "Graphic Designer", "Base skill"), related("brand-identity-designer", "Brand Identity Designer", "Brand systems"),
                   related("commercial-photographer", "Commercial Photographer", "Product imagery")],
    institutes=[NID, UCEED, ADOBE, MESC],
    sources=[source("NID Admissions", "https://admissions.nid.edu/", "Programmes and eligibility.")],
    extra_sections=_extra(
        [["Illustrator", "Artwork on dielines", "Paid"], ["Photoshop", "Mock-ups", "Paid"], ["3D mock-up tools", "Visualising packs", "Free/paid"], ["PDF proofing", "Printer approvals", "Free"]],
        ["Brief from the brand team", "Artwork on the dieline", "Mock-ups for review", "Printer coordination and proof checks"],
        [["Range of 3 products for a D2C brand", "System thinking"], ["Label redesign with before/after", "Problem solving"], ["Print-ready artwork file", "Production skill"]],
        ["What is a dieline?", "How do you make a pack stand out on a shelf?", "How do you check a printer's proof?", "Explain CMYK vs Pantone."],
        EARN),
)

# ---------- UI/UX & Product ----------
UX = "UI/UX & Product"

UI = _des(
    "ui-designer", "UI Designer", "UI Design", "How to become a UI Designer",
    "A UI (user interface) designer designs the screens of apps and websites — layouts, buttons, icons, typography and design systems — so products look clear and are easy to use.", UX,
    duties=["Design app and web screens", "Build and maintain design systems/components", "Create interactive prototypes", "Hand off designs to developers",
            "Follow platform and accessibility guidelines", "Iterate based on feedback and testing"],
    postings=["Product companies, startups, agencies and IT services"],
    facts=[fact("Education", "B.Des/BFA or related"), fact("Time to job-ready", "About 6–9 months of practice"), fact("Core skills", "Layout, typography, components, prototyping"),
           fact("Main tool", "Figma"), fact("Hiring rounds", "Portfolio → design task → interview → HR"), fact("Portfolio", "3 app/web case studies")],
    levels=[["Beginner", "Clean screens with spacing and type"], ["Intermediate", "Components, auto layout and responsive design"], ["Job-ready", "Design systems, prototypes and developer hand-off"]],
    steps=[step("Visual design basics", "Months 1–2", "Grids, spacing, typography, colour and contrast."),
           step("Learn Figma", "Months 1–3", "Frames, auto layout, components, variables and prototyping."),
           step("Study platform guidelines", "Months 2–4", "Apple HIG, Material Design 3 and WCAG accessibility."),
           step("Redesign real apps", "Months 3–6", "Pick apps you use and improve flows."), step("Build 3 case studies", "Months 5–8", "Problem → process → screens → outcome."),
           step("Apply", "After portfolio", "Junior UI/visual designer roles.")],
    hiring=_hiring("Design 2–3 screens for a feature in Figma", "Your design decisions, components, accessibility and hand-off"),
    checklist=["You use Figma components and auto layout well.", "You follow platform and accessibility guidelines.", "You can prototype interactions.", "You have 3 strong case studies."],
    timeline=_timeline(("Visual basics", "Months 1–2"), ("Figma", "Months 1–3"), ("Guidelines", "Months 2–4"), ("Case studies", "Months 3–8")),
    prep=[{"phase": "Learn", "duration": "Months 1–4", "focus": ["Figma", "Guidelines"]}, {"phase": "Build", "duration": "Months 4–8", "focus": ["Case studies", "Feedback"]}],
    resources=[{"label": "Figma Learn", "url": "https://help.figma.com/hc/en-us", "note": "Official tutorials."},
               {"label": "Material Design 3", "url": "https://m3.material.io/", "note": "Android/web guidelines."},
               {"label": "Apple HIG", "url": "https://developer.apple.com/design/human-interface-guidelines/", "note": "iOS guidelines."}],
    ladder=[["Start", "Junior UI Designer", "0–2 years", "Screens"], ["Mid", "UI / Visual Designer", "2–4 years", "Features and systems"],
            ["Senior", "Senior / Lead Designer", "4–8 years", "Design systems"], ["Top", "Design Manager", "8+ years", "Team"]],
    special=["Accessibility (contrast, text size, touch targets) is part of good UI, not optional."],
    mistakes=["Dribbble-style shots with no real problem.", "Ignoring components and consistency.", "Poor developer hand-off."],
    faqs=[{"q": "UI vs UX?", "a": "UI is how screens look and behave; UX is the overall experience, research and flows. Many roles mix both."},
          {"q": "Do I need coding?", "a": "Not required, but basic HTML/CSS helps you talk to developers."},
          {"q": "Is Figma enough?", "a": "Figma is the industry standard for UI today."}],
    related_items=[related("ux-designer-researcher", "UX Designer / Researcher", "Research and flows"), related("product-designer", "Product Designer", "Next step"),
                   related("graphic-designer", "Graphic Designer", "Visual base")],
    institutes=[NID, CEED, GOOGLE_UX, FIGMA, MATERIAL],
    sources=[source("CEED 2027 Information Brochure", "https://www.ceed.iitb.ac.in/", "M.Des eligibility.")],
    extra_sections=_extra(
        [["Figma", "Screens, components, prototypes", "Free plan"], ["FigJam / whiteboard", "Flows", "Free plan"], ["Icon libraries", "Icons", "Free"], ["Contrast checkers", "Accessibility", "Free"]],
        ["Stand-up with the product team", "Design screens for a feature", "Update components", "Review with developers", "Fix issues from QA"],
        [["Redesign a popular app flow", "Problem solving"], ["Small design system (buttons, inputs, cards)", "Systems thinking"], ["Responsive website", "Layout skill"]],
        ["Walk us through a case study.", "How do you make a design accessible?", "What is auto layout?", "How do you hand off to developers?"],
        EARN),
)

UXR = _des(
    "ux-designer-researcher", "UX Designer / Researcher", "UX", "How to become a UX Designer / Researcher",
    "A UX designer or researcher studies how people use a product and designs flows that are easy and useful — through interviews, usability tests, journey maps, wireframes and prototypes.", UX,
    duties=["Plan and run user interviews and usability tests", "Analyse findings and share insights", "Create personas, journeys and information architecture",
            "Design wireframes and flows", "Test prototypes and iterate", "Work with product managers and engineers"],
    postings=["Product companies, startups, research/design consultancies and IT services"],
    facts=[fact("Education", "B.Des/M.Des, HCI or psychology"), fact("Time to job-ready", "About 6–12 months"), fact("Core skills", "Research, synthesis, IA, wireframing, testing"),
           fact("Tools", "Figma, survey and testing tools"), fact("Hiring rounds", "Portfolio → case/whiteboard → interview → HR"), fact("Portfolio", "2–3 research-led case studies")],
    levels=[["Beginner", "Know UX process and wireframing"], ["Intermediate", "Run interviews and usability tests, synthesise insights"],
            ["Job-ready", "Lead a project from research to tested prototype"]],
    steps=[step("Learn UX fundamentals", "Months 1–2", "Design thinking, user-centred design, IA and accessibility."),
           step("Research methods", "Months 2–4", "Interviews, surveys, usability testing and affinity mapping."),
           step("Wireframes and prototypes", "Months 3–5", "Figma flows and clickable prototypes."),
           step("Do real research", "Months 4–8", "Test a real app with 5 users and redesign it."), step("Build case studies", "Months 6–10", "Show research → insight → design → result."),
           step("Apply", "After portfolio", "Associate UX designer or UX research roles.")],
    hiring=_hiring("Whiteboard or take-home case: improve a flow for a given user problem", "Research methods, synthesis, trade-offs and how research changed the design"),
    checklist=["You can plan and run a usability test.", "You can turn research into clear insights.", "You can design flows and prototypes.", "Your case studies show impact."],
    timeline=_timeline(("Fundamentals", "Months 1–2"), ("Research", "Months 2–4"), ("Prototyping", "Months 3–5"), ("Case studies", "Months 4–10")),
    prep=[{"phase": "Learn", "duration": "Months 1–5", "focus": ["Google UX certificate or design degree", "Research methods"]},
          {"phase": "Practice", "duration": "Months 5–10", "focus": ["Real tests", "Case studies"]}],
    resources=[{"label": "Google UX Design Certificate", "url": "https://www.coursera.org/professional-certificates/google-ux-design", "note": "Structured course."},
               {"label": "W3C WAI", "url": "https://www.w3.org/WAI/fundamentals/", "note": "Accessibility basics."}],
    ladder=[["Start", "Associate UX Designer / Researcher", "0–2 years", "Support projects"], ["Mid", "UX Designer / Researcher", "2–5 years", "Own projects"],
            ["Senior", "Senior / Lead UX", "5–8 years", "Strategy"], ["Top", "UX Research / Design Manager", "8+ years", "Teams"]],
    special=["Get consent before recording users and protect their data.", "Five well-run usability tests teach more than a hundred opinions."],
    mistakes=["Skipping research and jumping to screens.", "Leading questions in interviews.", "Case studies with no outcome."],
    faqs=[{"q": "Do UX researchers need design skills?", "a": "Basic wireframing helps; pure research roles focus more on methods and analysis."},
          {"q": "Is psychology useful?", "a": "Yes — psychology and HCI backgrounds are common in UX research."},
          {"q": "Is the Google certificate enough?", "a": "It gives structure; employers still judge your case studies."}],
    related_items=[related("ui-designer", "UI Designer", "Visual side"), related("product-designer", "Product Designer", "End-to-end"), related("graphic-designer", "Graphic Designer", "Visual base")],
    institutes=[NID, CEED, GOOGLE_UX, WAI, FIGMA],
    sources=[source("NID M.Des Admissions Handbook 2027-28", "https://admissions.nid.edu/", "Interaction/Information Design programmes.")],
    extra_sections=_extra(
        [["Figma / FigJam", "Wireframes and synthesis", "Free plan"], ["Survey tools", "Surveys", "Free plans"], ["Video call tools", "Remote interviews", "Free"], ["Spreadsheets", "Analysis", "Free"]],
        ["Plan a study with the product manager", "Run 2–3 user sessions", "Synthesise notes into insights", "Sketch flows", "Share findings"],
        [["Usability test of a public app + redesign", "Research to design"], ["Survey + interview study", "Methods"], ["Information architecture for a website", "Structure"]],
        ["How would you research why users drop off at checkout?", "What makes a good interview question?", "How do you prioritise findings?", "Show research that changed a design."],
        EARN),
)

PRODUCT = _des(
    "product-designer", "Product Designer", "Product Design", "How to become a Product Designer",
    "A product designer owns the end-to-end design of a digital product feature — from understanding the problem and user research to flows, UI and measuring results after launch.", UX,
    duties=["Define problems with product and engineering", "Research users and analyse data", "Design flows, wireframes and high-fidelity UI",
            "Prototype and test", "Work with design systems", "Measure impact after launch"],
    postings=["Product companies and startups (SaaS, fintech, consumer apps)"],
    facts=[fact("Education", "B.Des/M.Des + UI/UX experience"), fact("Usual entry", "After 2–3 years in UI/UX"), fact("Core skills", "UX, UI, product thinking, metrics"),
           fact("Tools", "Figma, analytics dashboards"), fact("Hiring rounds", "Portfolio → product design challenge → panel → HR")],
    levels=[["Beginner", "UI + UX basics"], ["Intermediate", "End-to-end features with research and UI"], ["Job-ready", "Product thinking, metrics and cross-team leadership"]],
    steps=[step("Build UI and UX skills", "Years 1–2", "Start as UI or UX designer."), step("Learn product thinking", "Year 2", "Business goals, metrics, prioritisation."),
           step("Ship features end-to-end", "Years 2–3", "Own a feature from problem to launch."), step("Show impact", "Ongoing", "Case studies with metrics."),
           step("Move into product design roles", "After experience", "Product designer at product companies.")],
    hiring=_hiring("Product design challenge: improve a metric for a given product", "Problem framing, research, trade-offs, metrics and collaboration"),
    checklist=["You can frame problems with business goals.", "You do both UX and UI well.", "You've shipped features.", "Your case studies show measurable impact."],
    timeline=_timeline(("UI/UX roles", "Years 1–2"), ("Product thinking", "Year 2"), ("End-to-end ownership", "Years 2–3")),
    prep=[{"phase": "Grow", "duration": "Years 1–3", "focus": ["Shipping features", "Metrics", "Collaboration"]}],
    resources=[{"label": "Material Design 3", "url": "https://m3.material.io/", "note": "Design system reference."}],
    ladder=[["Mid", "Product Designer", "2–5 years", "Features"], ["Senior", "Senior Product Designer", "5–8 years", "Product areas"],
            ["Lead", "Lead / Staff Designer", "8+ years", "Strategy"], ["Manager", "Design Manager / Head of Design", "8+ years", "Teams"]],
    special=["Product design is usually not an entry-level title — start as UI or UX designer."],
    mistakes=["Pretty screens without problem framing.", "No metrics.", "Ignoring engineering constraints."],
    faqs=[{"q": "Product designer vs UX designer?", "a": "Product designers own the whole feature including business goals and UI; UX roles may focus more on research and flows."},
          {"q": "Can a fresher be a product designer?", "a": "Some startups hire juniors, but most expect UI/UX experience first."},
          {"q": "Is M.Des needed?", "a": "Not mandatory; it helps, especially from NID or IITs."}],
    related_items=[related("ui-designer", "UI Designer", "Entry role"), related("ux-designer-researcher", "UX Designer / Researcher", "Entry role"),
                   related("brand-identity-designer", "Brand Identity Designer", "Brand side")],
    institutes=[NID, CEED, GOOGLE_UX, APPLE_HIG],
    sources=[source("CEED 2027 Information Brochure", "https://www.ceed.iitb.ac.in/", "M.Des eligibility.")],
    extra_sections=_extra(
        [["Figma", "Design and prototyping", "Free plan"], ["Analytics dashboards", "Usage data", "Company-provided"], ["Docs/whiteboards", "Specs and workshops", "Free"]],
        ["Product sync with PM and engineers", "Design and test a feature", "Review data from last release", "Critique with design team"],
        [["End-to-end feature case study with metrics", "Ownership"], ["Onboarding redesign", "Activation thinking"], ["Design system contribution", "Systems"]],
        ["How do you decide what to design first?", "Tell us about a trade-off you made.", "How do you measure success?", "How do you work with engineers?"],
        EARN),
)

GUIDES_GV_UX = [GRAPHIC, BRAND, PACKAGING, UI, UXR, PRODUCT]
