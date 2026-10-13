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
    "A graphic designer communicates ideas visually — social posts, ads, brochures, logos, presentations and packaging — using typography, colour, layout and images. "
    "The job is to make a message clear and attractive for a specific audience, usually working from a client or marketing brief. "
    "Most hiring depends on the quality of your portfolio rather than your marks.", GV,
    duties=["Understand the brief and audience", "Create layouts for social media, ads, print and presentations", "Choose typography, colour and images",
            "Follow and build brand guidelines", "Prepare files correctly for print and digital", "Revise designs from feedback"],
    postings=["Advertising and design agencies, in-house brand teams, startups, publishing and print houses", "Freelance work is common"],
    facts=[fact("Education", "B.Des/BFA"), fact("Time to job-ready", "About 6–12 months of steady practice"), fact("Core skills", "Typography, layout, colour, concept"),
           fact("Tools", "Photoshop, Illustrator, InDesign, Figma, Canva"), fact("Hiring rounds", "Portfolio → design test → interview → HR"),
           fact("Portfolio", "8–12 strong pieces across formats"), fact("Work mode", "Office, hybrid or freelance")],
    levels=[["Beginner", "Basic layouts using grids, two fonts and a clear colour palette"], ["Intermediate", "Campaign sets, print-ready files, brand-consistent work"],
            ["Job-ready", "Concept-driven work you can explain, delivered fast and print/digital ready"]],
    steps=[step("Learn design basics", "Months 1–2", "Start with typography, grids, hierarchy, colour theory and composition, because every layout you make later depends on them. "
                                                     "Study one topic at a time and make small practice pieces, such as a poster that uses only two fonts. "
                                                     "These basics are what separate clean, professional work from cluttered designs."),
           step("Learn the core tools", "Months 1–4", "Learn Photoshop for editing images, Illustrator for logos and vectors, InDesign for print layouts and Figma for digital screens. "
                                                      "Practise each tool on small real tasks instead of only watching tutorials. "
                                                      "Agencies expect you to move between these tools comfortably."),
           step("Copy and study great work", "Months 2–4", "Recreate well-designed posters and ads as private practice to understand spacing, alignment and type pairing. "
                                                           "Compare your version with the original and note what you missed. "
                                                           "Keep these studies for learning only, and never present copied work as your own portfolio piece."),
           step("Do real briefs", "Months 3–8", "Design for a local business, NGO or college fest so you work with a real brief, a deadline and real feedback. "
                                                "Real clients teach you to listen, revise and deliver files correctly for print and social media. "
                                                "These projects often become your strongest portfolio pieces."),
           step("Build a portfolio site", "Months 6–9", "Put your best 8–12 pieces on a simple portfolio website or a Behance page. "
                                                        "For each project, show the brief, your sketches and options, and the final design so recruiters can see how you think. "
                                                        "Showing your process, not just final images, is what makes a portfolio convincing."),
           step("Apply for internships and jobs", "After 8–10 pieces", "Apply to agencies, in-house brand teams and startups for internships or junior designer roles. "
                                                                       "Expect a design test after the portfolio review, so practise finishing short briefs on a deadline. "
                                                                       "Keep improving your portfolio with the feedback you get from each application.")],
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
    faqs=[{"q": "Is Canva enough?", "a": "Canva is useful for quick social posts, and many small businesses use it. "
                                         "However, agencies and in-house teams expect Photoshop, Illustrator and InDesign or Figma for professional work. "
                                         "Learn Canva if you like, but build your portfolio in the professional tools."},
          {"q": "Do I need to draw well?", "a": "Basic sketching helps you plan layouts and ideas quickly on paper. "
                                                "Graphic design is mostly about layout, typography and ideas rather than drawing skill. "
                                                "If you can sketch simple boxes and shapes to plan a page, that is enough to start."},
          {"q": "Which degree is best?", "a": "A B.Des in Communication or Graphic Design, or a BFA in Applied Art, gives the strongest foundation. "
                                              "Diplomas also work if your portfolio is strong, because studios hire mainly on the quality of your work. "
                                              "Choose a course that gives you plenty of real projects and feedback."}],
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
    "A brand identity designer creates how a brand looks and feels — logo, colours, typography, imagery style and a brand guideline that keeps everything consistent. "
    "The work starts with understanding the business and its audience, and ends with a system that other designers can follow. "
    "Most people move into this role after a few years as a graphic designer.", GV,
    duties=["Research the business, audience and competitors", "Create logo concepts and visual systems", "Define colours, typography and imagery style",
            "Build brand guidelines", "Apply the identity to stationery, packaging, social and signage", "Present concepts to clients"],
    postings=["Branding studios, design agencies, startups and freelance"],
    facts=[fact("Education", "B.Des/BFA + experience"), fact("Core skills", "Concept, typography, logo design, systems thinking"),
           fact("Tools", "Illustrator, InDesign, Figma, Photoshop"), fact("Hiring rounds", "Portfolio → branding test → interview → HR"),
           fact("Usual entry", "2–3 years as a graphic designer"), fact("Portfolio", "3–4 full identity case studies")],
    levels=[["Beginner", "Logo basics and type"], ["Intermediate", "Full identity system with applications"], ["Job-ready", "Strategy-led identities with guidelines and client presentation"]],
    steps=[step("Master graphic design basics", "Year 1", "Spend your first year getting strong at typography, layout and Illustrator, because every identity is built from these skills. "
                                                          "Practise drawing clean vector shapes and setting type with care. "
                                                          "Most brand designers first work as graphic designers to build this base."),
           step("Study brand strategy", "Months 6–12", "Learn the basics of positioning, target audience, tone of voice and naming. "
                                                       "Strategy explains why a brand should look a certain way, so your designs have a clear reason behind them. "
                                                       "Read brand case studies and write a one-page strategy before you design anything."),
           step("Design logos and systems", "Months 9–15", "Practise logos, colour systems, type pairing and patterns that work together as one family. "
                                                           "Test every logo at very small and very large sizes, and in black and white. "
                                                           "A flexible system matters more than a single clever logo."),
           step("Create brand guidelines", "Months 12–18", "Write guidelines that explain how to use the logo, colours, fonts and imagery, with clear do's and don'ts. "
                                                           "Add ready templates, such as social posts or letterheads, so others can apply the brand correctly. "
                                                           "Good guidelines keep the brand consistent long after you hand it over."),
           step("Build 3–4 case studies", "Ongoing", "Create 3–4 full identity projects for real or self-initiated brands, covering research, logo, system and applications. "
                                                     "Show each identity in use on packaging, signage, social media and stationery. "
                                                     "Branding studios judge you mainly on these case studies."),
           step("Join a branding studio", "After experience", "Apply to branding studios and agencies once you have graphic design experience and strong case studies. "
                                                              "Expect a short branding test and a portfolio presentation in the interview. "
                                                              "Practise explaining the idea behind each identity clearly, because clients will ask the same questions.")],
    hiring=_hiring("Create a mini identity (logo + colours + 3 applications) from a brief", "Your process, strategy, logo rationale and client presentation"),
    checklist=["You can explain the strategy behind each identity.", "You can design a flexible logo system.", "You can write clear brand guidelines.", "You have full case studies."],
    timeline=_timeline(("Graphic design base", "Year 1"), ("Strategy + logos", "Months 6–15"), ("Guidelines + case studies", "Months 12–18")),
    prep=[{"phase": "Craft", "duration": "Year 1", "focus": ["Typography", "Illustrator"]}, {"phase": "Branding", "duration": "Months 9–18", "focus": ["Strategy", "Systems", "Guidelines"]}],
    resources=[{"label": "Adobe Certified Professional", "url": "https://certifiedprofessional.adobe.com/en/get-started", "note": "Illustrator/InDesign exams."}],
    ladder=[["Start", "Graphic Designer", "0–2 years", "Execution"], ["Mid", "Brand Designer", "2–5 years", "Identities"], ["Senior", "Senior Brand Designer / Design Lead", "5–8 years", "Lead projects"],
            ["Top", "Creative/Brand Director", "8+ years", "Studio leadership"]],
    special=["Check trademarks before finalising a logo; clients often need a trademark search.", "Never present a logo without showing it in use."],
    mistakes=["Designing logos without research.", "Too-complex marks that fail at small sizes.", "No guidelines."],
    faqs=[{"q": "Is branding only logo design?", "a": "No, branding is the full visual system and its rules, and the logo is only one part of it. "
                                                      "It also covers colours, typography, imagery style and how all of these are used together. "
                                                      "That is why brand designers deliver guidelines, not just a logo file."},
          {"q": "Can freshers do branding?", "a": "Freshers usually start as graphic designers and move into branding after gaining some experience. "
                                                  "Self-initiated identity case studies help you show branding skill even before you get paid branding work. "
                                                  "Treat your first job as training in typography and handling client feedback."},
          {"q": "Which software matters most?", "a": "Illustrator is the main tool for logos and marks, and InDesign is used to build brand guideline documents. "
                                                     "Figma is useful for showing the identity on websites and apps. "
                                                     "Learn the software well, but remember that ideas and strategy matter more than tools."}],
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
    "A packaging designer designs boxes, labels and pouches that protect the product, follow labelling rules and make people pick it off the shelf. "
    "The job mixes graphic design with print production, dielines and packaging materials. "
    "Most work comes from FMCG, food, cosmetics, D2C and pharma brands, packaging studios and printers.", GV,
    duties=["Design labels, boxes, pouches and bottles", "Work with dielines and structural templates", "Follow mandatory labelling information provided by the brand",
            "Prepare print-ready artwork with printers", "Make 3D mock-ups", "Coordinate with marketing and production"],
    postings=["FMCG and D2C brands, packaging studios, printing and converting companies"],
    facts=[fact("Education", "B.Des/BFA; IIP for technical roles"), fact("Core skills", "Layout, print production, dielines, materials"),
           fact("Tools", "Illustrator, Photoshop, 3D mock-up tools"), fact("Hiring rounds", "Portfolio → artwork test → interview → HR"),
           fact("Technical route", "IIP PG Diploma in Packaging (science/engineering grads)")],
    levels=[["Beginner", "Label and box layouts"], ["Intermediate", "Dielines, print specs and mock-ups"], ["Job-ready", "Shelf-ready packaging systems with print production knowledge"]],
    steps=[step("Graphic design base", "Months 1–6", "Start with typography, layout and Illustrator, because all packaging artwork is built with these skills. "
                                                     "Practise designing simple labels and posters until your layouts are clean and easy to read. "
                                                     "A strong graphic base makes the technical parts much easier to learn."),
           step("Learn print production", "Months 4–8", "Learn CMYK and spot colours, bleed, dielines and how to check printer proofs. "
                                                        "Mistakes in print files are costly, because a whole print run can come out wrong. "
                                                        "Visit a local printer if you can and ask how they prepare and check artwork."),
           step("Learn materials", "Months 6–10", "Study paperboard, flexible packs, labels and the printing processes used for each of them. "
                                                  "The material changes how colours print and how the pack is folded or sealed. "
                                                  "Collect real packs from shops and open them flat to see how they are made."),
           step("Build packaging projects", "Months 6–12", "Design and mock up 3–4 product ranges, such as a set of related products for one brand. "
                                                           "Work on real dielines and create realistic 3D mock-ups to show how each pack looks on a shelf. "
                                                           "These ranges show both your design thinking and your production skill."),
           step("Apply", "After portfolio", "Apply to brand teams, packaging studios and printing companies for junior designer or artworker roles. "
                                            "Expect a test where you design a label or box on a given dieline. "
                                            "Show that you can place mandatory label information correctly, because employers check this carefully.")],
    hiring=_hiring("Design a label/box on a given dieline", "Print production, dielines, colour, legal information placement and your projects"),
    checklist=["You can design on a dieline.", "You understand print specs.", "You can create realistic mock-ups.", "You know where mandatory label information must go."],
    timeline=_timeline(("Graphic base", "Months 1–6"), ("Print + materials", "Months 4–10"), ("Projects", "Months 6–12")),
    prep=[{"phase": "Craft + print", "duration": "Months 1–8", "focus": ["Illustrator", "Print production"]}, {"phase": "Projects", "duration": "Months 6–12", "focus": ["Ranges", "Mock-ups"]}],
    resources=[{"label": "Adobe Certified Professional", "url": "https://certifiedprofessional.adobe.com/en/get-started", "note": "Illustrator exam."}],
    ladder=[["Start", "Junior Packaging Designer / Artworker", "0–2 years", "Artwork"], ["Mid", "Packaging Designer", "2–5 years", "Ranges"], ["Senior", "Lead / Design Manager", "5+ years", "Brand portfolios"]],
    special=["Label text (ingredients, MRP, manufacturer details) is a legal requirement provided by the brand — check every proof carefully.",
             "IIP's PG Diploma in Packaging is technical (materials/engineering) and needs a science/engineering degree."],
    mistakes=["Ignoring the dieline.", "Wrong colour mode for print.", "Missing mandatory information on artwork."],
    faqs=[{"q": "Is packaging design different from graphic design?", "a": "It builds on graphic design but adds structure, materials and print production. "
                                                                           "You must design on a dieline, think about how the pack looks in 3D and make sure it prints correctly. "
                                                                           "Most packaging designers start with graphic design skills and then learn these technical parts."},
          {"q": "Do I need IIP?", "a": "Not for graphic packaging design roles, where your portfolio matters most. "
                                       "IIP's PG Diploma in Packaging is meant for technical packaging technology roles and needs a science or engineering degree. "
                                       "Choose it only if you want to work on materials and engineering rather than artwork."},
          {"q": "Which industries hire most?", "a": "FMCG, food, cosmetics, D2C and pharma companies hire the most packaging designers. "
                                                    "Packaging studios and printing companies also hire artworkers and designers. "
                                                    "Build portfolio projects for the industry you want to join."}],
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
    "A UI (user interface) designer designs the screens of apps and websites — layouts, buttons, icons, typography and design systems — so products look clear and are easy to use. "
    "Most UI work today is done in Figma, together with product managers and developers. "
    "Hiring is based on a portfolio of app and web case studies.", UX,
    duties=["Design app and web screens", "Build and maintain design systems/components", "Create interactive prototypes", "Hand off designs to developers",
            "Follow platform and accessibility guidelines", "Iterate based on feedback and testing"],
    postings=["Product companies, startups, agencies and IT services"],
    facts=[fact("Education", "B.Des/BFA or related"), fact("Time to job-ready", "About 6–9 months of practice"), fact("Core skills", "Layout, typography, components, prototyping"),
           fact("Main tool", "Figma"), fact("Hiring rounds", "Portfolio → design task → interview → HR"), fact("Portfolio", "3 app/web case studies")],
    levels=[["Beginner", "Clean screens with spacing and type"], ["Intermediate", "Components, auto layout and responsive design"], ["Job-ready", "Design systems, prototypes and developer hand-off"]],
    steps=[step("Visual design basics", "Months 1–2", "Learn grids, spacing, typography, colour and contrast, because these decide whether a screen feels clear or messy. "
                                                      "Practise by redrawing simple screens, such as a login page or a settings page. "
                                                      "Good contrast also makes your designs easier for everyone to read."),
           step("Learn Figma", "Months 1–3", "Learn frames, auto layout, components, variables and prototyping using the free official Figma tutorials. "
                                             "Build small reusable components, such as buttons and cards, instead of drawing every screen from scratch. "
                                             "This is how real product teams work, and interviewers often ask about it."),
           step("Study platform guidelines", "Months 2–4", "Read Apple's Human Interface Guidelines, Material Design 3 and the WCAG accessibility guidance. "
                                                           "They explain the standard patterns and behaviours that users already expect on iOS, Android and the web. "
                                                           "Following them makes your designs easier to build and easier to use."),
           step("Redesign real apps", "Months 3–6", "Pick apps you use every day and redesign one flow, such as sign-up or checkout, to make it simpler. "
                                                    "Write down what was confusing before and how your version fixes it. "
                                                    "This trains you to solve problems, not just make screens look pretty."),
           step("Build 3 case studies", "Months 5–8", "Turn your best work into three case studies, each in the same order: problem, process, screens and outcome. "
                                                      "Show your sketches, early versions and the reasons behind your final choices. "
                                                      "Recruiters read case studies to understand how you think."),
           step("Apply", "After portfolio", "Apply for junior UI or visual designer roles at product companies, startups, agencies and IT services. "
                                            "Expect a design task where you create 2–3 screens for a feature in Figma. "
                                            "Be ready to explain your components, accessibility choices and how you would hand off the design to developers.")],
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
          {"q": "Do I need coding?", "a": "Coding is not required for UI design roles. "
                                          "Basic HTML and CSS help you understand what is easy or hard to build, so you can talk better with developers. "
                                          "You can learn these basics later, once your design skills are strong."},
          {"q": "Is Figma enough?", "a": "Figma is the industry standard tool for UI design today, so it is the right tool to master first. "
                                         "Along with Figma, you need strong visual basics and a good knowledge of platform guidelines. "
                                         "Tools can change, but these skills stay useful."}],
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
    "A UX designer or researcher studies how people use a product and designs flows that are easy and useful — through interviews, usability tests, journey maps, wireframes and prototypes. "
    "The goal is to understand real user problems before and after screens are designed. "
    "They work closely with product managers, UI designers and engineers.", UX,
    duties=["Plan and run user interviews and usability tests", "Analyse findings and share insights", "Create personas, journeys and information architecture",
            "Design wireframes and flows", "Test prototypes and iterate", "Work with product managers and engineers"],
    postings=["Product companies, startups, research/design consultancies and IT services"],
    facts=[fact("Education", "B.Des/M.Des, HCI or psychology"), fact("Time to job-ready", "About 6–12 months"), fact("Core skills", "Research, synthesis, IA, wireframing, testing"),
           fact("Tools", "Figma, survey and testing tools"), fact("Hiring rounds", "Portfolio → case/whiteboard → interview → HR"), fact("Portfolio", "2–3 research-led case studies")],
    levels=[["Beginner", "Know UX process and wireframing"], ["Intermediate", "Run interviews and usability tests, synthesise insights"],
            ["Job-ready", "Lead a project from research to tested prototype"]],
    steps=[step("Learn UX fundamentals", "Months 1–2", "Learn design thinking, user-centred design, information architecture (IA) and accessibility. "
                                                       "These ideas explain why research comes before screens and how to organise content so people can find it. "
                                                       "A structured course, such as the Google UX Design Certificate, can guide you through them."),
           step("Research methods", "Months 2–4", "Practise interviews, surveys, usability testing and affinity mapping. "
                                                  "Learn to write neutral, open questions that do not push the user towards an answer. "
                                                  "Each method answers different questions, so learn when to use which one."),
           step("Wireframes and prototypes", "Months 3–5", "Learn to draw simple wireframes and turn them into clickable prototypes in Figma. "
                                                           "Prototypes let you test ideas with users before developers spend time building them. "
                                                           "Keep early wireframes rough so you can change them quickly."),
           step("Do real research", "Months 4–8", "Run a usability test of a real app with 5 users and note where they struggle. "
                                                  "Then redesign the problem areas and test again to see if things improved. "
                                                  "Always take consent before recording users, and keep their data safe."),
           step("Build case studies", "Months 6–10", "Write 2–3 case studies that show research, insight, design and result, in that order. "
                                                     "Explain what you learned from users and how it changed your design. "
                                                     "Case studies with no clear outcome are a common mistake, so always end with what changed."),
           step("Apply", "After portfolio", "Apply for associate UX designer or UX researcher roles at product companies, startups and consultancies. "
                                            "Expect a whiteboard or take-home case where you improve a flow for a user problem. "
                                            "Practise talking through your research methods and the trade-offs you made.")],
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
    faqs=[{"q": "Do UX researchers need design skills?", "a": "Basic wireframing helps, because it lets you show your findings as simple screens. "
                                                              "Pure research roles focus more on research methods, analysis and clear reporting. "
                                                              "If you enjoy both, a UX designer role lets you combine them."},
          {"q": "Is psychology useful?", "a": "Yes, psychology and HCI (human-computer interaction) backgrounds are common in UX research. "
                                              "They teach you how people think, behave and make decisions, which is the heart of research work. "
                                              "You still need a portfolio of real research projects to get hired."},
          {"q": "Is the Google certificate enough?", "a": "It gives you a clear structure and portfolio projects to start with. "
                                                          "Employers still judge you mainly on your case studies and how well you explain your research. "
                                                          "Add your own real research projects to stand out from others who took the same course."}],
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
    "A product designer owns the end-to-end design of a digital product feature — from understanding the problem and user research to flows, UI and measuring results after launch. "
    "They work closely with product managers and engineers and think about business goals as well as users. "
    "It is usually not an entry-level role, so most people start as UI or UX designers.", UX,
    duties=["Define problems with product and engineering", "Research users and analyse data", "Design flows, wireframes and high-fidelity UI",
            "Prototype and test", "Work with design systems", "Measure impact after launch"],
    postings=["Product companies and startups (SaaS, fintech, consumer apps)"],
    facts=[fact("Education", "B.Des/M.Des + UI/UX experience"), fact("Usual entry", "After 2–3 years in UI/UX"), fact("Core skills", "UX, UI, product thinking, metrics"),
           fact("Tools", "Figma, analytics dashboards"), fact("Hiring rounds", "Portfolio → product design challenge → panel → HR")],
    levels=[["Beginner", "UI + UX basics"], ["Intermediate", "End-to-end features with research and UI"], ["Job-ready", "Product thinking, metrics and cross-team leadership"]],
    steps=[step("Build UI and UX skills", "Years 1–2", "Start your career as a UI or UX designer to build strong skills in research, flows and screen design. "
                                                       "Product design needs both sides, so use these years to strengthen whichever side is weaker. "
                                                       "Ask to join research sessions or design reviews outside your main tasks."),
           step("Learn product thinking", "Year 2", "Learn how business goals, metrics and prioritisation shape design decisions. "
                                                    "Ask your product manager why a feature matters and how its success will be measured. "
                                                    "This helps you design for results, not just for good-looking screens."),
           step("Ship features end-to-end", "Years 2–3", "Take ownership of one feature from the problem stage all the way to launch. "
                                                         "Work through research, flows, UI, testing and developer hand-off yourself, with support from your team. "
                                                         "Shipping real features is the clearest proof that you are ready for a product designer role."),
           step("Show impact", "Ongoing", "Write case studies that show what changed after launch, using the metrics your team tracked. "
                                          "Explain the trade-offs you made and what you would do differently next time. "
                                          "Hiring panels look for this kind of measurable impact."),
           step("Move into product design roles", "After experience", "Apply for product designer roles at product companies and startups once you have shipped features. "
                                                                      "Expect a product design challenge where you improve a metric for a given product, followed by a panel interview. "
                                                                      "Prepare to explain how you work with engineers and handle technical constraints.")],
    hiring=_hiring("Product design challenge: improve a metric for a given product", "Problem framing, research, trade-offs, metrics and collaboration"),
    checklist=["You can frame problems with business goals.", "You do both UX and UI well.", "You've shipped features.", "Your case studies show measurable impact."],
    timeline=_timeline(("UI/UX roles", "Years 1–2"), ("Product thinking", "Year 2"), ("End-to-end ownership", "Years 2–3")),
    prep=[{"phase": "Grow", "duration": "Years 1–3", "focus": ["Shipping features", "Metrics", "Collaboration"]}],
    resources=[{"label": "Material Design 3", "url": "https://m3.material.io/", "note": "Design system reference."}],
    ladder=[["Mid", "Product Designer", "2–5 years", "Features"], ["Senior", "Senior Product Designer", "5–8 years", "Product areas"],
            ["Lead", "Lead / Staff Designer", "8+ years", "Strategy"], ["Manager", "Design Manager / Head of Design", "8+ years", "Teams"]],
    special=["Product design is usually not an entry-level title — start as UI or UX designer."],
    mistakes=["Pretty screens without problem framing.", "No metrics.", "Ignoring engineering constraints."],
    faqs=[{"q": "Product designer vs UX designer?", "a": "Product designers own the whole feature, including business goals, research, flows and UI. "
                                                         "UX roles may focus more on research and flows, while UI roles focus on screens. "
                                                         "In many companies the titles overlap, so read each job description carefully."},
          {"q": "Can a fresher be a product designer?", "a": "Some startups hire junior product designers, but most companies expect UI or UX experience first. "
                                                             "If you are a fresher, start in a UI or UX role and grow into product design. "
                                                             "Strong end-to-end case studies can help you move up faster."},
          {"q": "Is M.Des needed?", "a": "An M.Des is not mandatory for product design roles. "
                                         "It helps, especially from NID or the IITs, because it gives deep training and strong networks. "
                                         "Experience of shipping real features still matters most to employers."}],
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
