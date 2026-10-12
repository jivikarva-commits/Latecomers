"""IT / Tech — Web & App Development beginner guides (same structure as the government guides).

Institute and course facts were checked on 2026-10-12 against the official pages linked below
(C-DAC ACTS admission booklet Aug-2026 batch, NIELIT O Level booklet Rev 5.1, IIT Madras
academics page, IGNOU BCA page, Coursera/Meta certificate pages and the official Google,
Apple, Flutter, WordPress and Shopify learning sites).
"""
from copy import deepcopy

from career_catalog import slugify
from education_steps import EDUCATION
from gov_guide_kit import details, fact, institute, paper, related, source, stage, step

REVIEWED = "2026-10-12"

CDAC_URL = "https://cdac.in/index.aspx?id=edu_acts_admission_booklet"
OLEVEL_URL = "https://www.nielit.gov.in/content/o-level"
OLEVEL_BOOKLET = "https://www.nielit.in/sites/default/files/headquarter/pdf/20220905_5_1_revised_O_Level_IT.pdf"
IITM_URL = "https://study.iitm.ac.in/ds/academics.html"
IGNOU_URL = "https://www.ignou.ac.in/schools/programme/BCA_NEW"

CDAC_AC = institute(
    "C-DAC — PG Certificate Programme in Advanced Computing (PGCP-AC, earlier PG-DAC)", "Government (MeitY) · C-DAC ACTS training centres", CDAC_URL,
    "C++, object-oriented Java, algorithms & data structures in Java, databases, operating systems, web programming technologies, web-based Java, Microsoft .NET, aptitude and a software project.",
    "Engineering, MCA or science-PG graduates who want an intensive, placement-oriented full-stack course.",
    mode="Online or physical (depends on centre)", duration="24 weeks full-time (900 hours + 300 hours self-study)",
    fee="₹84,150 + GST online · ₹99,000 + GST physical (Aug 2026 batch)",
    eligibility="BE/BTech (any branch), MCA/MCM, or PG in Physics/Maths/Statistics with 55% · admission through C-CAT Sections A+B")
CDAC_MC = institute(
    "C-DAC — PG Certificate Programme in Mobile Computing (PGCP-MC)", "Government (MeitY) · C-DAC ACTS training centres", CDAC_URL,
    "Linux & OS concepts, databases, Java OOP and data structures, web-based Java, mobile programming, hybrid mobile app programming, AI on mobile platforms and a project.",
    "Engineering/MCA/MSc graduates who want classroom training for mobile and hybrid apps.",
    mode="Physical only", duration="24 weeks full-time", fee="₹99,000 + GST (Aug 2026 batch)",
    eligibility="C-DAC common eligibility (BE/BTech in IT/CS/Electronics etc. or MSc CS/IT/Electronics) or course-specific options in the booklet · C-CAT Sections A+B+C")
NIELIT_O = institute(
    "NIELIT — 'O' Level (IT)", "Government (MeitY) · NIELIT centres and accredited institutes", OLEVEL_URL,
    "IT tools & network basics, Web Designing & Publishing (HTML, CSS, JavaScript, AngularJS), Python programming, IoT, four practicals and a project.",
    "12th-pass learners who want a recognised, low-cost foundation in web design before specialising.",
    mode="Through NIELIT centres / accredited institutes", duration="540 learning hours — about 1 year after 12th (6 months after graduation)",
    eligibility="12th pass, or 2-year ITI after 10th (other routes listed in the booklet)")
IITM = institute(
    "IIT Madras — Diploma in Programming (BS in Data Science & Applications)", "IIT · online programme", IITM_URL,
    "Database Management Systems, Python data structures & algorithms, Java, System Commands, and Modern Application Development I & II with two app-building projects.",
    "Learners who want an IIT-level, project-based programming credential while studying or working.",
    mode="Online learning with IIT Madras assessments", duration="Diploma level: 6 courses + 2 projects (27 credits), after the Foundation level",
    eligibility="Through the IIT Madras qualifier process — see the admissions page")
IGNOU = institute(
    "IGNOU — Bachelor of Computer Applications (BCA)", "Central university · open & distance learning", IGNOU_URL,
    "Programming, Java (MCS-206), DBMS (MCS-207), Web Programming (BCS-053) with labs, and a final-semester project.",
    "Learners who want an affordable degree while working or studying elsewhere.",
    mode="Distance learning (English medium)", duration="3 years (maximum 6 years)", fee="₹8,300 per semester (₹49,800 total) + exam fees",
    eligibility="12th pass or equivalent")
META_FE = institute(
    "Meta Front-End Developer Professional Certificate (Coursera)", "Industry certificate · online", "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    "HTML, CSS, JavaScript, React, Bootstrap, Git/GitHub, Jest testing, UX/UI basics, a capstone and interview preparation.",
    "Beginners who want a structured, self-paced front-end path with projects.",
    mode="Online, self-paced", duration="9 courses · about 7 months at 6 hours/week", eligibility="Beginners — no prior experience or degree needed")
META_BE = institute(
    "Meta Back-End Developer Professional Certificate (Coursera)", "Industry certificate · online", "https://www.coursera.org/professional-certificates/meta-back-end-developer",
    "Python, Django, REST APIs, MySQL databases, version control and a Django capstone app.",
    "Beginners who want a guided Python/Django back-end path.",
    mode="Online, self-paced", duration="9 courses · about 8 months at 6 hours/week", eligibility="Beginners — no prior experience or degree needed")
META_ANDROID = institute(
    "Meta Android Developer Professional Certificate (Coursera)", "Industry certificate · online", "https://www.coursera.org/professional-certificates/meta-android-developer",
    "Kotlin programming, Android app development and a React Native course for cross-platform apps.",
    "Beginners who want a structured Android path with a certificate.",
    mode="Online, self-paced", duration="12 courses · about 8 months at 7 hours/week", eligibility="Beginners — no prior experience needed")
META_IOS = institute(
    "Meta iOS Developer Professional Certificate (Coursera)", "Industry certificate · online", "https://www.coursera.org/professional-certificates/meta-ios-developer",
    "Swift fundamentals and advanced Swift, SwiftUI interfaces, working with data, React Native and an iOS app capstone.",
    "Beginners who want a guided iOS path with a certificate.",
    mode="Online, self-paced", duration="12 courses · about 8 months at 7 hours/week", eligibility="Beginners — no degree or prior experience needed")
GOOGLE_ANDROID = institute(
    "Google — Android Basics with Compose", "Official Google course · online", "https://developer.android.com/courses",
    "Kotlin, Jetpack Compose UI, Material Design, app architecture, data storage, networking and testing.",
    "Complete beginners — Google says no programming experience is needed.",
    mode="Online, self-paced", eligibility="Anyone")
APPLE = institute(
    "Apple — Develop in Swift Tutorials & Pathways", "Official Apple learning · online", "https://developer.apple.com/learn/",
    "Building apps with Swift and SwiftUI, plus pathways of videos, documentation and tools for Apple platforms.",
    "Anyone starting iOS development.",
    mode="Online", eligibility="Anyone · building iOS apps needs a Mac with Xcode")
FLUTTER = institute(
    "Flutter (Google) — Dart & Flutter Getting Started pathway", "Official Flutter docs · online", "https://docs.flutter.dev/get-started/learn-flutter",
    "Dart basics, building Flutter apps, app architecture (MVVM), fetching network data, and codelabs such as Firebase login and Google Maps.",
    "Beginners who want one codebase for Android and iOS.",
    mode="Online, self-paced", eligibility="Anyone")
WP_LEARN = institute(
    "Learn WordPress (WordPress.org)", "Official WordPress training · online", "https://learn.wordpress.org/",
    "Beginner WordPress Developer (9 hours, 59 lessons) and Intermediate Theme Developer (8 hours, 32 lessons — build a custom block theme).",
    "Anyone building WordPress themes, plugins or client websites.",
    mode="Online, self-paced", eligibility="Anyone")
SHOPIFY = institute(
    "Shopify Academy", "Official Shopify training · online", "https://www.shopifyacademy.com/",
    "Free learning paths: Shopify Development Fundamentals, Liquid Storefronts for Theme Developers, and Developing Apps for Shopify.",
    "Developers who want to build Shopify themes, apps or client stores.",
    mode="Online, self-paced (many courses free)", eligibility="Anyone")
REACT_DOCS = institute(
    "react.dev — official React learning (Meta)", "Official React docs · online", "https://react.dev/learn",
    "Components, JSX, props, state, hooks and 'Thinking in React', with interactive examples.",
    "Learners who already know basic HTML, CSS and JavaScript.",
    mode="Online, free", eligibility="Basic JavaScript")
MDN = institute(
    "MDN Web Docs — Learn web development (Mozilla)", "Official web documentation · online", "https://developer.mozilla.org/en-US/docs/Learn_web_development",
    "HTML, CSS, JavaScript, accessibility and core web modules from beginner level.",
    "Absolute beginners to web development.",
    mode="Online, free", eligibility="Anyone")

INSTITUTE_SOURCES = {
    CDAC_URL: source("C-DAC ACTS admission booklet (Aug 2026 batch)", CDAC_URL, "PGCP-AC and PGCP-MC modules, duration, fees, eligibility and C-CAT sections."),
    OLEVEL_URL: source("NIELIT 'O' Level (IT) — Revision 5.1 booklet", OLEVEL_BOOKLET, "Modules, 540 learning hours, eligibility, exam pattern and job roles."),
    IITM_URL: source("IIT Madras BS — Academics", IITM_URL, "Diploma in Programming courses, projects and exit options."),
    IGNOU_URL: source("IGNOU BCA programme page", IGNOU_URL, "Duration, eligibility, fee and web/Java/DBMS courses."),
}

LABELS = {
    "nav": {"eligibility": "Education & eligibility", "exam": "Hiring process", "passing": "Job-ready checklist", "calendar": "Timeline",
            "prepare": "How to learn", "salary": "Career growth", "institutes": "Top institutes", "government-sources": "Sources"},
    "steps": "Step-by-step: from zero to your first job",
    "eligibility": "Education and eligibility",
    "passing": "Job-ready checklist",
    "calendar": "Learning timeline",
    "prepare": "How to learn (suggested plan)",
    "resources": "Free official learning resources",
    "reviewed": "Last reviewed:",
    "cycle": "Based on:",
    "back": ["/careers-explore?field=tech", "← All IT / Tech careers"],
    "seo": "Skills, Roadmap, Courses & Institutes",
    "institutes": "Top institutes & official courses",
    "paperColumns": ["What they check", "Format", "Time", "Tip"],
    "passPrefix": "To clear it:",
}

ELIGIBILITY = [
    "There is no entrance exam or age limit for private-sector jobs — after the education check, selection is by tests, projects and interviews.",
    "Many large companies and campus drives also set minimum marks and ask for no active backlogs — read each job post.",
    "You need a laptop/PC, a stable internet connection and 2–3 hours a day of practice.",
]


def _hiring(test_topics, interview_topics, assignment):
    return [
        stage("Round 1 — Resume and portfolio screening", "Before any test", "Recruiters shortlist from your resume, GitHub and live project links.",
              [paper("One-page resume with skills, projects and links", "PDF", "—", "Put your best 2–3 projects at the top"),
               paper("GitHub / portfolio with working demos", "Links", "—", "README with screenshots and setup steps")],
              "Clear, relevant projects and a tidy resume that matches the job post."),
        stage("Round 2 — Online assessment", "Common for freshers and mass hiring", "A timed test, often on a coding platform.",
              [paper(test_topics, "MCQ + coding", "60–90 min (varies)", "Practise timed problems weekly")],
              "Solve the coding questions correctly within time; partial or brute-force solutions may still score."),
        stage("Round 3 — Technical interview(s)", "1–3 rounds", "An engineer checks your fundamentals and asks about your projects.",
              [paper(interview_topics, "Live discussion / coding", "30–60 min each", "Explain your thinking out loud")],
              "Explain concepts clearly, write working code and defend the decisions in your projects."),
        stage("Round 4 — Assignment or machine-coding round", "Common in startups and agencies", "Build a small feature or app in a few hours or days.",
              [paper(assignment, "Take-home / live", "2 hours – 3 days", "Submit clean, tested, documented code")],
              "Working output, readable code and following the brief."),
        stage("Round 5 — HR / managerial round and offer", "Final", "Communication, expectations, notice period and salary discussion.",
              [], "Be honest about skills and availability; read the offer letter before accepting."),
    ]


def _ladder(rows):
    return {"heading": "Career growth", "columns": ["Stage", "Typical title", "Experience (typical)", "What changes"], "rows": rows,
            "note": "Titles and timelines are typical and vary by company. Salaries depend on city, company and skill — compare current job posts."}


def _timeline(rows):
    return {"heading": "Learning timeline", "label": "Typical plan with 2–3 hours of practice a day (faster or slower is normal)",
            "rows": [{"event": e, "date": d} for e, d in rows], "note": "Move to the next stage only when you can build something on your own."}


def _guide(slug, title, short, headline, summary, *, duties, postings, facts, levels, steps, test_topics, interview_topics, assignment,
           checklist, timeline, prep, resources, ladder, special, mistakes, faqs, related_items, institutes, sources,
           group="Web & App Development", levels_title="Skill checklist by level", extra_sections=None, category="IT / Software / Tech",
           scope_prefix="IT / Tech", back=None, icon="Code2", color="#2563EB", hiring=None, eligibility=None):
    edu = EDUCATION.get(slug)
    eligibility = ([f"Education: {edu[0][0].upper() + edu[0][1:]}."] if edu else []) + (eligibility or ELIGIBILITY)
    d = details(
        service={"short": short, "full": title, "headline": headline, "seoTitle": f"{title} Career Guide", "authority": "Hired by IT companies, startups, agencies and freelance clients"},
        quick_facts=[fact(f["label"], EDUCATION[slug][0][0].upper() + EDUCATION[slug][0][1:]) if f["label"] == "Education" and slug in EDUCATION else f for f in facts],
        role={"heading": f"What does a {title} do?", "intro": summary, "duties": duties, "postings": postings},
        eligibility=eligibility or ELIGIBILITY,
        category_table={"title": levels_title, "columns": ["Level", "You should be able to…"], "rows": levels,
                        "note": "Use this to check where you are before applying."},
        exam_stages=hiring or _hiring(test_topics, interview_topics, assignment),
        exam_heading="Hiring process — what companies check",
        passing_rules=checklist,
        steps=[step("Education requirement", "Check before you start", EDUCATION[slug][1]), *steps] if slug in EDUCATION else steps,
        calendar=_timeline(timeline),
        prep_plan=prep,
        free_resources=resources,
        career_ladder=_ladder(ladder),
        special={"title": "Good to know", "items": special},
        mistakes=mistakes,
        faqs=faqs,
        related_items=related_items,
        related_heading="Related IT / Tech careers",
        institutes=institutes,
        labels={**LABELS, "back": back} if back else LABELS,
        extra_sections=extra_sections,
    )
    srcs = [*sources]
    for ins in institutes:
        if ins["url"] in INSTITUTE_SOURCES:
            srcs.append(INSTITUTE_SOURCES[ins["url"]])
        else:
            srcs.append(source(ins["name"], ins["url"], "Official course page: content, duration and eligibility."))
    seen = set()
    srcs = [s for s in srcs if not (s["url"] in seen or seen.add(s["url"]))]
    return {
        "career_id": f"career-{slug}", "slug": slug, "title": title,
        "category": category, "field": category, "icon": icon, "iconColor": color,
        "description": summary, "shortDescription": summary, "tags": [scope_prefix, group],
        "detailsGeneratedByAI": False, "dataSource": "editorial-tech-v1",
        "guideProfile": {"title": title, "scope": f"{scope_prefix} • {group}", "sourceCycle": "Official docs and course pages listed under Sources",
                         "reviewedAt": REVIEWED, "summary": summary, "eligibility": eligibility or ELIGIBILITY, "sources": srcs, "details": d},
    }


GIT_STEP = step("Learn Git and GitHub", "Alongside your first projects", "Commit daily, write README files and push every project to GitHub — recruiters look here.")
JOB_STEPS = [
    step("Build 3 portfolio projects", "After the core skills", "Each project should solve a real problem, be deployed (or have a demo video) and have a clear README."),
    step("Get real experience", "In parallel", "Internships, open-source contributions, freelance work or building something for a local business all count."),
    step("Prepare your resume and LinkedIn", "Before applying", "One-page resume with skills, projects, links and measurable results. Keep LinkedIn and GitHub updated."),
    step("Apply and prepare for interviews", "Job search", "Apply on company career pages, job portals and referrals. Practise coding questions and explain your projects."),
    step("Join, learn and grow", "First job", "Learn the team's codebase, ask for code reviews and keep building skills for the next level."),
]

FRONTEND = _guide(
    "frontend-developer", "Frontend Developer", "Frontend", "How to become a Frontend Developer",
    "A frontend developer builds the part of a website or web app that people see and use — layouts, buttons, forms and interactions — with HTML, CSS and JavaScript.",
    duties=["Turn designs (Figma) into responsive web pages", "Add interactions and fetch data from APIs with JavaScript",
            "Make pages accessible for keyboard and screen-reader users", "Keep pages fast and fix layout bugs across browsers and phones",
            "Work with designers, backend developers and testers"],
    postings=["Product companies, startups, IT services, agencies and media companies", "Remote and freelance frontend work is common"],
    facts=[fact("Education", "Degree helps; portfolio matters most"), fact("Time to job-ready", "About 6–9 months (typical)"),
           fact("Core skills", "HTML, CSS, JavaScript"), fact("Then learn", "React (or Angular/Vue), Git, responsive design"),
           fact("Job titles", "Frontend / UI / Web Developer"), fact("Hiring rounds", "Test → technical → assignment → HR"),
           fact("Work mode", "Office, hybrid or remote"), fact("Portfolio", "3 deployed websites/apps")],
    levels=[["Beginner", "Build static pages with semantic HTML and CSS"], ["Intermediate", "Responsive layouts (flexbox/grid), JavaScript DOM and API calls"],
            ["Job-ready", "A framework like React, accessibility, performance, Git and deployed projects"]],
    steps=[step("Learn HTML", "Weeks 1–3", "Semantic tags, forms, tables, links and images — the structure of every page."),
           step("Learn CSS and responsive design", "Weeks 3–8", "Box model, flexbox, grid, media queries and mobile-first layouts."),
           step("Learn JavaScript", "Months 2–4", "Variables, functions, arrays/objects, DOM events, fetch and async/await."),
           GIT_STEP,
           step("Learn a framework", "Months 4–6", "React is widely asked for; learn components, state, hooks and routing."),
           step("Accessibility and performance", "Months 5–7", "Keyboard navigation, alt text, colour contrast, image optimisation and Lighthouse checks."),
           *JOB_STEPS],
    test_topics="HTML/CSS MCQs, JavaScript output questions, DSA basics",
    interview_topics="CSS layout, JavaScript (closures, events, promises), DOM, React basics, accessibility and your projects",
    assignment="Convert a design into a responsive page or build a small app with API data",
    checklist=["You can turn a design into a responsive page that works on mobile and desktop.", "You can write JavaScript for interactions and API data.",
               "Your pages are keyboard-accessible and fast.", "You have 3 deployed projects on GitHub with READMEs.", "You can explain CSS layout and JavaScript basics in interviews."],
    timeline=[("HTML + CSS", "Months 1–2"), ("JavaScript", "Months 2–4"), ("Framework (React)", "Months 4–6"),
              ("Accessibility + performance", "Months 5–7"), ("Portfolio + interview prep", "Months 7–9")],
    prep=[{"phase": "Foundation", "duration": "Months 1–4", "focus": ["HTML, CSS, JavaScript", "Clone 3 real website layouts", "Git from day one"]},
          {"phase": "Framework", "duration": "Months 4–7", "focus": ["React basics", "API data and forms", "Accessibility checks"]},
          {"phase": "Get hired", "duration": "Months 7–9", "focus": ["3 deployed projects", "JavaScript interview questions", "Mock interviews"]}],
    resources=[{"label": "MDN — Learn web development", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development", "note": "Official beginner curriculum."},
               {"label": "MDN — JavaScript guide", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", "note": "JavaScript reference."},
               {"label": "react.dev — Learn React", "url": "https://react.dev/learn", "note": "Official React docs."}],
    ladder=[["Start", "Frontend Intern / Trainee", "0–1 year", "Pages, components, bug fixes"], ["Junior", "Frontend Developer", "1–3 years", "Own features and UI"],
            ["Mid", "Senior Frontend Engineer", "3–6 years", "Architecture, performance, mentoring"], ["Senior", "Frontend Lead / Architect", "6+ years", "Design systems and team decisions"]],
    special=["Learn HTML, CSS and JavaScript well before a framework — interviews test fundamentals.",
             "Accessibility and responsive design are expected, not extra.", "A good-looking, working portfolio site is itself a project."],
    mistakes=["Jumping to React before JavaScript basics.", "Pages that break on mobile.", "Only tutorial clones without your own features.", "No live links on the resume."],
    faqs=[{"q": "Frontend or full stack first?", "a": "Frontend first is easier to start and shows results quickly; add backend later if you want full stack roles."},
          {"q": "Do I need to be good at design?", "a": "No, but you should follow designs accurately and know basic spacing, typography and colour."}],
    related_items=[related("react-developer", "React Developer", "Go deeper into React"), related("full-stack-developer", "Full Stack Developer", "Add backend skills"),
                   related("wordpress-developer", "WordPress Developer", "Client websites")],
    institutes=[META_FE, NIELIT_O, CDAC_AC, IITM, IGNOU],
    sources=[source("MDN — Learn web development", "https://developer.mozilla.org/en-US/docs/Learn_web_development", "Web fundamentals curriculum."),
             source("react.dev — Learn", "https://react.dev/learn", "Official React documentation.")],
)

BACKEND = _guide(
    "backend-developer", "Backend Developer", "Backend", "How to become a Backend Developer",
    "A backend developer builds the server side of apps — the APIs, business logic, databases and security that the website or mobile app talks to.",
    duties=["Design and build REST/GraphQL APIs used by web and mobile apps", "Design database tables and write efficient queries",
            "Handle login, permissions and data security", "Integrate payments, email, SMS and third-party services",
            "Write tests, fix bugs and keep servers fast and reliable"],
    postings=["Product companies, IT services firms, startups and fintech", "Mostly desk work; remote and hybrid roles are common"],
    facts=[fact("Education", "Degree helps (BCA/BTech/MCA) but skills matter most"), fact("Time to job-ready", "About 8–12 months (typical)"),
           fact("Core languages", "One of Java, Python, Node.js (JavaScript), C# or Go"), fact("Must-know", "SQL, APIs, Git, Linux basics"),
           fact("Job titles", "Backend / Software / API Developer"), fact("Hiring rounds", "Test → technical → assignment → HR"),
           fact("Work mode", "Office, hybrid or remote"), fact("Portfolio", "2–3 deployed APIs with docs")],
    levels=[["Beginner", "Write programs in one language, use variables, loops, functions, classes and files"],
            ["Intermediate", "Build a REST API with a framework, connect a SQL database, add login and validation"],
            ["Job-ready", "Design database schemas, write tests, use Git, deploy an API to the cloud and explain your design"]],
    steps=[step("Pick ONE language and framework", "Week 1", "Java + Spring Boot, Python + Django/FastAPI, or JavaScript + Node.js/Express. Don't switch every month."),
           step("Learn programming fundamentals", "Months 1–2", "Data types, control flow, functions, OOP, error handling and basic data structures."),
           step("Learn SQL and databases", "Months 2–3", "Tables, joins, indexes, transactions; practise with MySQL or PostgreSQL."),
           step("Build APIs with your framework", "Months 3–5", "CRUD APIs, authentication (JWT/sessions), validation, pagination and error handling."),
           GIT_STEP,
           step("Learn deployment basics", "Months 5–7", "Linux commands, environment variables, Docker basics and deploying to a cloud server."),
           *JOB_STEPS],
    test_topics="Data structures & algorithms (arrays, strings, hashing), SQL queries, OOP and language MCQs",
    interview_topics="Your language internals, OOP, SQL joins and indexes, REST design, authentication, caching and your projects",
    assignment="Build a small REST API (e.g. todo/orders) with database, auth and tests",
    checklist=["You can build and document a REST API end to end.", "You can write SQL joins and design normalised tables.",
               "You have 2–3 projects on GitHub with READMEs and at least one deployed.", "You can solve easy–medium coding problems in your language.",
               "You can explain HTTP, status codes, authentication and how your API handles errors."],
    timeline=[("Language + fundamentals", "Months 1–2"), ("SQL + databases", "Months 2–3"), ("Framework + APIs", "Months 3–5"),
              ("Deployment + testing", "Months 5–7"), ("Projects + interview practice", "Months 7–10")],
    prep=[{"phase": "Foundation", "duration": "Months 1–3", "focus": ["One language deeply", "SQL daily practice", "Basic data structures"]},
          {"phase": "Build", "duration": "Months 3–7", "focus": ["Framework + REST APIs", "Authentication and testing", "Docker and deployment"]},
          {"phase": "Get hired", "duration": "Months 7–10", "focus": ["3 portfolio APIs", "Coding problem practice", "Mock interviews"]}],
    resources=[{"label": "MDN — HTTP overview", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview", "note": "How the web and APIs talk."},
               {"label": "PostgreSQL tutorial (official docs)", "url": "https://www.postgresql.org/docs/current/tutorial.html", "note": "SQL and database basics."},
               {"label": "Git — official book (Pro Git)", "url": "https://git-scm.com/book/en/v2", "note": "Version control from scratch."}],
    ladder=[["Start", "Intern / Trainee Developer", "0–1 year", "Learn the codebase, fix small bugs"],
            ["Junior", "Backend Developer / Software Engineer", "1–3 years", "Own features and APIs"],
            ["Mid", "Senior Backend Engineer", "3–6 years", "Design services, review code, mentor"],
            ["Senior", "Lead / Staff Engineer / Architect", "6+ years", "System design, scalability and team decisions"]],
    special=["Backend is less visual — show your work with API docs (e.g. Swagger/Postman collections).",
             "Java and C# are common in large IT services companies; Node.js and Python are common in startups.",
             "System design becomes important after 2–3 years of experience."],
    mistakes=["Jumping between languages and frameworks without finishing projects.", "Ignoring SQL and only using an ORM.",
              "No deployed project — recruiters can't see it working.", "Copying tutorial projects without adding your own features."],
    faqs=[{"q": "Which language is best for backend?", "a": "Any mainstream one works. Java (Spring Boot), Python (Django/FastAPI) and JavaScript (Node.js) are all widely used — pick one and go deep."},
          {"q": "Do I need DSA?", "a": "Yes for most company tests and interviews — practise easy and medium problems regularly."},
          {"q": "Can I learn backend without frontend?", "a": "Yes. Basic HTML/JS helps you test, but backend roles focus on APIs and databases."}],
    related_items=[related("full-stack-developer", "Full Stack Developer", "Frontend + backend together"), related("react-developer", "React Developer", "Frontend with React"),
                   related("android-developer", "Android Developer", "Mobile apps that use your APIs")],
    institutes=[CDAC_AC, IITM, IGNOU, META_BE],
    sources=[source("MDN — HTTP overview", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview", "How HTTP requests and responses work."),
             source("PostgreSQL documentation", "https://www.postgresql.org/docs/current/tutorial.html", "SQL and relational database basics.")],
)

FULLSTACK = _guide(
    "full-stack-developer", "Full Stack Developer", "Full Stack", "How to become a Full Stack Developer",
    "A full stack developer builds both the part users see (frontend) and the server, database and APIs behind it (backend), and can ship a complete web app.",
    duties=["Build responsive user interfaces with HTML, CSS, JavaScript and a framework like React", "Build APIs and business logic on the server",
            "Design databases and connect them to the app", "Deploy and monitor the app", "Work with designers, testers and product managers"],
    postings=["Startups and product companies value full stack skills most", "Agencies and freelancing for complete websites/apps"],
    facts=[fact("Education", "Degree helps but projects matter most"), fact("Time to job-ready", "About 9–12 months (typical)"),
           fact("Common stacks", "MERN (MongoDB, Express, React, Node), Java + React, Python + React"), fact("Must-know", "HTML, CSS, JS, one backend, SQL/NoSQL, Git"),
           fact("Job titles", "Full Stack / Software / Web Developer"), fact("Hiring rounds", "Test → technical → assignment → HR"),
           fact("Work mode", "Office, hybrid or remote"), fact("Portfolio", "2–3 complete, deployed web apps")],
    levels=[["Beginner", "Build static pages with HTML/CSS and add JavaScript interactions"],
            ["Intermediate", "Build a React app and a separate backend API with a database"],
            ["Job-ready", "Ship a full app with login, database, deployment, tests and a clear README"]],
    steps=[step("Learn HTML, CSS and JavaScript", "Months 1–2", "Semantic HTML, responsive CSS (flexbox/grid), modern JavaScript and the DOM."),
           step("Learn a frontend framework", "Months 3–4", "React is widely asked for in job posts; learn components, state, hooks and routing."),
           step("Learn a backend + database", "Months 4–6", "Node.js/Express (or Java/Python), REST APIs, authentication, and SQL or MongoDB."),
           GIT_STEP,
           step("Connect and deploy", "Months 6–8", "Connect frontend to your API, handle errors and loading states, and deploy both parts."),
           *JOB_STEPS],
    test_topics="DSA basics, JavaScript output questions, SQL, HTML/CSS MCQs",
    interview_topics="JavaScript (closures, async/await, promises), React (state, hooks), REST APIs, databases, authentication and your projects",
    assignment="Build a small full app (e.g. task manager) with login, API and database",
    checklist=["You can build a complete app: UI, API, database and deployment.", "Your apps work on mobile and desktop screens.",
               "You understand authentication (sessions/JWT) and basic security.", "You have 2–3 deployed full stack projects on GitHub.",
               "You can solve easy–medium coding problems in JavaScript or your backend language."],
    timeline=[("HTML, CSS, JavaScript", "Months 1–2"), ("React", "Months 3–4"), ("Backend + database", "Months 4–6"),
              ("Full app + deployment", "Months 6–8"), ("Portfolio + interview prep", "Months 8–11")],
    prep=[{"phase": "Frontend", "duration": "Months 1–4", "focus": ["HTML, CSS, JavaScript", "React basics", "Small UI projects"]},
          {"phase": "Backend", "duration": "Months 4–6", "focus": ["Node/Express or Java/Python", "Databases", "Authentication"]},
          {"phase": "Ship + get hired", "duration": "Months 6–11", "focus": ["Deploy 2–3 full apps", "DSA practice", "Mock interviews"]}],
    resources=[{"label": "MDN — Learn web development", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development", "note": "HTML, CSS and JavaScript."},
               {"label": "react.dev — Learn React", "url": "https://react.dev/learn", "note": "Official React docs."},
               {"label": "Node.js — Learn", "url": "https://nodejs.org/en/learn", "note": "Official Node.js guides."}],
    ladder=[["Start", "Intern / Trainee Developer", "0–1 year", "Small features on both sides"],
            ["Junior", "Full Stack Developer", "1–3 years", "Own complete features"],
            ["Mid", "Senior Full Stack Engineer", "3–6 years", "Architecture decisions, code reviews"],
            ["Senior", "Tech Lead / Engineering Manager", "6+ years", "Lead teams and systems"]],
    special=["Full stack ≠ knowing every tool. Be strong in one stack end to end.",
             "Many companies hire 'full stack' but test frontend or backend more — read the job post.",
             "MERN is popular with startups; Java + React is common in larger companies."],
    mistakes=["Learning too many frameworks at once.", "Only frontend demos with no real backend.", "No deployed links on the resume.", "Skipping JavaScript fundamentals to jump into React."],
    faqs=[{"q": "Is full stack harder than frontend or backend?", "a": "It covers more, so it takes longer. Start with frontend basics, then add backend."},
          {"q": "MERN or Java full stack?", "a": "Both have jobs. MERN uses one language (JavaScript) end to end; Java is common in large IT services firms."}],
    related_items=[related("backend-developer", "Backend Developer", "Go deep on servers and APIs"), related("react-developer", "React Developer", "Go deep on React frontend"),
                   related("wordpress-developer", "WordPress Developer", "Quick website delivery for clients")],
    institutes=[CDAC_AC, IITM, IGNOU, META_FE, META_BE],
    sources=[source("MDN — Learn web development", "https://developer.mozilla.org/en-US/docs/Learn_web_development", "Web fundamentals curriculum."),
             source("react.dev — Learn", "https://react.dev/learn", "Official React documentation."),
             source("Node.js — Learn", "https://nodejs.org/en/learn", "Official Node.js learning guides.")],
)

ANDROID = _guide(
    "android-developer", "Android Developer", "Android", "How to become an Android Developer",
    "An Android developer builds apps for Android phones and tablets — the most used mobile platform in India — usually with Kotlin and Jetpack Compose.",
    duties=["Build app screens with Jetpack Compose (or XML layouts in older apps)", "Connect apps to APIs and local databases",
            "Handle permissions, notifications and offline use", "Test on different devices and fix crashes", "Publish and update apps on Google Play"],
    postings=["Product companies, startups, agencies and app studios", "Freelance and your own apps on Google Play"],
    facts=[fact("Education", "Degree helps; app portfolio matters most"), fact("Time to job-ready", "About 8–10 months (typical)"),
           fact("Language", "Kotlin (Java in older apps)"), fact("Tools", "Android Studio, Jetpack Compose, Git"),
           fact("Job titles", "Android Developer / Mobile Engineer"), fact("Hiring rounds", "Test → technical → assignment → HR"),
           fact("Device", "Any laptop that runs Android Studio"), fact("Portfolio", "2–3 apps (Play Store link or APK + GitHub)")],
    levels=[["Beginner", "Write Kotlin programs and build single-screen apps"],
            ["Intermediate", "Multi-screen apps with navigation, ViewModel, Room database and API calls"],
            ["Job-ready", "Clean architecture, testing, handling configuration changes and publishing to Play Store"]],
    steps=[step("Learn Kotlin basics", "Months 1–2", "Variables, functions, classes, null safety, collections and coroutines basics."),
           step("Build UIs with Jetpack Compose", "Months 2–4", "Layouts, state, lists, navigation and Material Design."),
           step("Data and networking", "Months 4–6", "ViewModel, Room database, Retrofit/Ktor for APIs, and app architecture."),
           GIT_STEP,
           step("Publish an app", "Months 6–8", "Create a Google Play developer account (one-time fee) or share APKs, and collect feedback."),
           *JOB_STEPS],
    test_topics="DSA basics, Kotlin/Java MCQs, OOP",
    interview_topics="Activity/Compose lifecycle, state management, coroutines, MVVM, Room, networking, memory leaks and your apps",
    assignment="Build an app that lists data from an API with offline caching",
    checklist=["You can build multi-screen apps in Kotlin with Compose.", "You can call APIs, store data locally and handle errors.",
               "You follow an architecture (e.g. MVVM) and write some tests.", "You have 2–3 apps on GitHub, ideally one on Google Play.",
               "You can explain lifecycle, coroutines and state in interviews."],
    timeline=[("Kotlin", "Months 1–2"), ("Compose UI", "Months 2–4"), ("Data + APIs + architecture", "Months 4–6"),
              ("Publish + polish", "Months 6–8"), ("Interview prep", "Months 8–10")],
    prep=[{"phase": "Language + UI", "duration": "Months 1–4", "focus": ["Kotlin", "Jetpack Compose", "Small apps"]},
          {"phase": "Real apps", "duration": "Months 4–8", "focus": ["APIs and Room", "Architecture", "Publish one app"]},
          {"phase": "Get hired", "duration": "Months 8–10", "focus": ["DSA practice", "Explain your apps", "Mock interviews"]}],
    resources=[{"label": "Android Developers — Courses", "url": "https://developer.android.com/courses", "note": "Official Android Basics with Compose."},
               {"label": "Kotlin docs — Getting started", "url": "https://kotlinlang.org/docs/getting-started.html", "note": "Official Kotlin learning."}],
    ladder=[["Start", "Android Intern / Trainee", "0–1 year", "Small screens and bug fixes"],
            ["Junior", "Android Developer", "1–3 years", "Own features end to end"],
            ["Mid", "Senior Android Engineer", "3–6 years", "Architecture, performance, mentoring"],
            ["Senior", "Mobile Lead / Architect", "6+ years", "Lead mobile platform decisions"]],
    special=["New Android apps use Kotlin and Jetpack Compose; many older apps still use Java and XML — knowing both helps.",
             "A published app with real users is a strong signal to recruiters."],
    mistakes=["Learning only Java/XML for new projects.", "Apps that crash on rotation or slow networks.", "No published app or demo video."],
    faqs=[{"q": "Kotlin or Java?", "a": "Start with Kotlin — Google's official courses and new apps use it."},
          {"q": "Do I need a powerful laptop?", "a": "Android Studio needs a decent amount of RAM; a real Android phone for testing also helps."}],
    related_items=[related("flutter-developer", "Flutter Developer", "One codebase for Android and iOS"), related("ios-developer", "iOS Developer", "Apple platform apps"),
                   related("backend-developer", "Backend Developer", "Build the APIs apps use")],
    institutes=[GOOGLE_ANDROID, CDAC_MC, META_ANDROID, IGNOU],
    sources=[source("Android Developers — Courses", "https://developer.android.com/courses", "Official Android training (Kotlin, Compose)."),
             source("Kotlin documentation", "https://kotlinlang.org/docs/getting-started.html", "Official Kotlin language docs.")],
)

IOS = _guide(
    "ios-developer", "iOS Developer", "iOS", "How to become an iOS Developer",
    "An iOS developer builds apps for iPhone and iPad using Swift and SwiftUI, and publishes them on Apple's App Store.",
    duties=["Build app screens with SwiftUI (UIKit in older apps)", "Connect to APIs and store data on the device",
            "Follow Apple's design and App Store guidelines", "Test on iPhones/iPads and fix crashes", "Publish and update apps on the App Store"],
    postings=["Product companies, startups and app studios with iPhone apps", "Fewer jobs than Android in India, but less competition"],
    facts=[fact("Education", "Degree helps; app portfolio matters most"), fact("Time to job-ready", "About 8–10 months (typical)"),
           fact("Language", "Swift (SwiftUI, UIKit)"), fact("Must-have device", "A Mac with Xcode"),
           fact("Job titles", "iOS Developer / Mobile Engineer"), fact("Hiring rounds", "Test → technical → assignment → HR"),
           fact("Publishing", "Apple Developer Program membership"), fact("Portfolio", "2–3 apps (TestFlight/App Store or GitHub + video)")],
    levels=[["Beginner", "Write Swift code and build simple SwiftUI screens"],
            ["Intermediate", "Navigation, lists, networking with async/await and local storage"],
            ["Job-ready", "App architecture, testing, performance and App Store submission"]],
    steps=[step("Get a Mac and install Xcode", "Week 1", "iOS apps are built in Xcode, which runs on macOS."),
           step("Learn Swift", "Months 1–2", "Types, optionals, structs/classes, protocols, closures and error handling."),
           step("Build UIs with SwiftUI", "Months 2–4", "Views, state, navigation, lists and forms using Apple's Develop in Swift tutorials."),
           step("Data and networking", "Months 4–6", "async/await, Codable JSON, local storage and app architecture (MVVM)."),
           GIT_STEP,
           step("Test and publish", "Months 6–8", "Use TestFlight and submit an app to the App Store (needs Apple Developer Program membership)."),
           *JOB_STEPS],
    test_topics="DSA basics, Swift MCQs, OOP",
    interview_topics="Swift (optionals, value vs reference types, ARC), SwiftUI state, concurrency, networking, app lifecycle and your apps",
    assignment="Build a SwiftUI app that lists and searches data from an API",
    checklist=["You can build multi-screen SwiftUI apps.", "You can fetch, decode and cache API data.", "You understand memory management (ARC) and concurrency basics.",
               "You have 2–3 apps on GitHub and ideally one on TestFlight/App Store.", "You can explain your app's architecture."],
    timeline=[("Swift", "Months 1–2"), ("SwiftUI", "Months 2–4"), ("Data + networking", "Months 4–6"), ("Publish + polish", "Months 6–8"), ("Interview prep", "Months 8–10")],
    prep=[{"phase": "Language + UI", "duration": "Months 1–4", "focus": ["Swift", "SwiftUI", "Small apps"]},
          {"phase": "Real apps", "duration": "Months 4–8", "focus": ["Networking and storage", "Architecture", "TestFlight"]},
          {"phase": "Get hired", "duration": "Months 8–10", "focus": ["DSA practice", "Explain your apps", "Mock interviews"]}],
    resources=[{"label": "Apple — Develop in Swift Tutorials", "url": "https://developer.apple.com/tutorials/develop-in-swift/", "note": "Official Swift and SwiftUI tutorials."},
               {"label": "The Swift Programming Language (docs)", "url": "https://docs.swift.org/swift-book/", "note": "Official Swift book."}],
    ladder=[["Start", "iOS Intern / Trainee", "0–1 year", "Small screens and fixes"], ["Junior", "iOS Developer", "1–3 years", "Own features"],
            ["Mid", "Senior iOS Engineer", "3–6 years", "Architecture and performance"], ["Senior", "Mobile Lead / Architect", "6+ years", "Lead mobile decisions"]],
    special=["You cannot build and publish native iOS apps without macOS/Xcode.", "If you don't have a Mac, consider Flutter or Android first.",
             "Apple Developer Program membership is needed to publish on the App Store."],
    mistakes=["Starting without access to a Mac.", "Learning only UIKit for new projects.", "No TestFlight/App Store build or demo video."],
    faqs=[{"q": "Can I learn iOS on Windows?", "a": "You can learn Swift basics online, but building iOS apps needs a Mac with Xcode."},
          {"q": "SwiftUI or UIKit?", "a": "Start with SwiftUI (Apple's tutorials use it); learn UIKit basics later because many existing apps use it."}],
    related_items=[related("android-developer", "Android Developer", "The bigger mobile market in India"), related("flutter-developer", "Flutter Developer", "Cross-platform apps"),
                   related("backend-developer", "Backend Developer", "APIs for mobile apps")],
    institutes=[APPLE, META_IOS, CDAC_MC, IGNOU],
    sources=[source("Apple Developer — Learn", "https://developer.apple.com/learn/", "Official Swift/SwiftUI learning and Apple Developer Program."),
             source("The Swift Programming Language", "https://docs.swift.org/swift-book/", "Official Swift documentation.")],
)

FLUTTER_DEV = _guide(
    "flutter-developer", "Flutter Developer", "Flutter", "How to become a Flutter Developer",
    "A Flutter developer uses Google's Flutter framework and the Dart language to build Android and iOS apps (and web/desktop) from one codebase.",
    duties=["Build app screens with Flutter widgets", "Manage app state and navigation", "Connect to APIs and Firebase",
            "Use platform features (camera, maps, notifications) through plugins", "Release builds for Android and iOS"],
    postings=["Startups and agencies that want one team for Android and iOS", "Freelance app projects"],
    facts=[fact("Education", "Degree helps; app portfolio matters most"), fact("Time to job-ready", "About 7–9 months (typical)"),
           fact("Language", "Dart"), fact("Tools", "Flutter SDK, VS Code / Android Studio, Firebase"),
           fact("Job titles", "Flutter Developer / Mobile App Developer"), fact("Hiring rounds", "Test → technical → assignment → HR"),
           fact("iOS builds", "Need a Mac for iOS release builds"), fact("Portfolio", "2–3 apps with GitHub + demo/APK")],
    levels=[["Beginner", "Write Dart and build simple widget screens"], ["Intermediate", "Navigation, forms, state management and API calls"],
            ["Job-ready", "Clean architecture (MVVM), Firebase/auth, testing and release builds"]],
    steps=[step("Learn Dart", "Month 1", "Types, functions, classes, null safety, async/await and futures (try DartPad)."),
           step("Learn Flutter widgets", "Months 2–3", "Layouts, stateless/stateful widgets, lists, forms and navigation."),
           step("State management and data", "Months 3–5", "A state management approach, HTTP APIs, local storage and app architecture."),
           GIT_STEP,
           step("Add real features", "Months 5–7", "Firebase login, maps, notifications, then release an Android build (and iOS on a Mac)."),
           *JOB_STEPS],
    test_topics="DSA basics, Dart/OOP MCQs",
    interview_topics="Widget tree and rebuilds, state management, async/futures/streams, navigation, platform channels and your apps",
    assignment="Build a Flutter app with API list, details screen and login",
    checklist=["You can build multi-screen Flutter apps with good state handling.", "You can call APIs and use Firebase or local storage.",
               "Your app runs on Android (and iOS if you have a Mac).", "You have 2–3 apps on GitHub with demos.", "You can explain widget lifecycle and state."],
    timeline=[("Dart", "Month 1"), ("Widgets + navigation", "Months 2–3"), ("State + data", "Months 3–5"), ("Real features + release", "Months 5–7"), ("Interview prep", "Months 7–9")],
    prep=[{"phase": "Dart + widgets", "duration": "Months 1–3", "focus": ["Dart basics", "Layouts", "Small apps"]},
          {"phase": "Real apps", "duration": "Months 3–7", "focus": ["State management", "APIs + Firebase", "Release builds"]},
          {"phase": "Get hired", "duration": "Months 7–9", "focus": ["DSA basics", "Explain your apps", "Mock interviews"]}],
    resources=[{"label": "Flutter — Learn Flutter", "url": "https://docs.flutter.dev/get-started/learn-flutter", "note": "Official getting-started pathway."},
               {"label": "Dart — Language tour", "url": "https://dart.dev/language", "note": "Official Dart docs."}],
    ladder=[["Start", "Flutter Intern / Trainee", "0–1 year", "Screens and bug fixes"], ["Junior", "Flutter Developer", "1–3 years", "Own app features"],
            ["Mid", "Senior Mobile Engineer", "3–6 years", "Architecture and releases"], ["Senior", "Mobile Lead", "6+ years", "Lead cross-platform strategy"]],
    special=["Flutter is popular with startups because one team ships Android and iOS.", "Knowing some native Android/iOS helps when plugins are not enough.",
             "iOS release builds still need macOS and Xcode."],
    mistakes=["Putting all logic inside widgets without any architecture.", "Ignoring Dart fundamentals.", "Only Android demos when the job needs iOS too."],
    faqs=[{"q": "Flutter or native Android?", "a": "Flutter if you want cross-platform startup roles; native Android if you want deep Android roles at larger companies. Both have jobs."},
          {"q": "Do I need a Mac?", "a": "Not to learn or build Android apps — only for iOS release builds."}],
    related_items=[related("android-developer", "Android Developer", "Native Android"), related("ios-developer", "iOS Developer", "Native iOS"),
                   related("backend-developer", "Backend Developer", "APIs for your apps")],
    institutes=[FLUTTER, CDAC_MC, GOOGLE_ANDROID, IGNOU],
    sources=[source("Flutter documentation — Learn Flutter", "https://docs.flutter.dev/get-started/learn-flutter", "Official Flutter learning pathway."),
             source("Dart documentation", "https://dart.dev/language", "Official Dart language docs.")],
)

REACT = _guide(
    "react-developer", "React Developer", "React", "How to become a React Developer",
    "A React developer builds fast, interactive web interfaces using the React library, one of the most widely used frontend tools in Indian job posts.",
    duties=["Build reusable UI components and pages", "Manage state and data from APIs", "Make apps responsive and accessible",
            "Optimise performance and fix UI bugs", "Work with designers (Figma) and backend developers"],
    postings=["Product companies, startups, IT services and agencies", "Remote and freelance frontend work"],
    facts=[fact("Education", "Degree helps; portfolio matters most"), fact("Time to job-ready", "About 6–9 months (typical)"),
           fact("Core skills", "HTML, CSS, JavaScript, React"), fact("Often asked", "TypeScript, Next.js, Tailwind, testing"),
           fact("Job titles", "React / Frontend / UI Developer"), fact("Hiring rounds", "Test → technical → assignment → HR"),
           fact("Work mode", "Office, hybrid or remote"), fact("Portfolio", "3 deployed React apps")],
    levels=[["Beginner", "Build responsive pages with HTML/CSS and JavaScript"], ["Intermediate", "React components, props, state, hooks, routing and API calls"],
            ["Job-ready", "Performance, testing, TypeScript basics, accessibility and deployment"]],
    steps=[step("Master HTML, CSS and JavaScript", "Months 1–2", "React is JavaScript — learn ES6+, arrays, objects, async/await and the DOM first."),
           step("Learn React fundamentals", "Months 3–4", "Components, JSX, props, state, effects and hooks from react.dev."),
           step("Routing, data and forms", "Months 4–5", "Client-side routing, fetching API data, forms and validation."),
           GIT_STEP,
           step("Production skills", "Months 5–7", "TypeScript basics, testing, performance, accessibility and a framework like Next.js."),
           *JOB_STEPS],
    test_topics="JavaScript output questions, DSA basics, HTML/CSS MCQs",
    interview_topics="JavaScript (closures, this, event loop, promises), React (hooks, re-renders, keys, state), CSS layout and your projects",
    assignment="Build a React app with search, filters and API data",
    checklist=["You can build React apps with hooks, routing and API data.", "Your UI is responsive and keyboard-accessible.",
               "You understand re-renders, keys and basic performance fixes.", "You have 3 deployed React projects on GitHub.", "You can solve JavaScript coding questions."],
    timeline=[("HTML, CSS, JavaScript", "Months 1–2"), ("React basics", "Months 3–4"), ("Routing + data", "Months 4–5"),
              ("TypeScript, testing, Next.js", "Months 5–7"), ("Portfolio + interview prep", "Months 7–9")],
    prep=[{"phase": "Web basics", "duration": "Months 1–2", "focus": ["HTML, CSS", "Modern JavaScript", "Small UI clones"]},
          {"phase": "React", "duration": "Months 3–6", "focus": ["Hooks and state", "Routing + API data", "TypeScript basics"]},
          {"phase": "Get hired", "duration": "Months 6–9", "focus": ["3 deployed apps", "JavaScript interview questions", "Mock interviews"]}],
    resources=[{"label": "react.dev — Learn React", "url": "https://react.dev/learn", "note": "Official React docs."},
               {"label": "MDN — JavaScript guide", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", "note": "Official JavaScript reference."}],
    ladder=[["Start", "Frontend Intern / Trainee", "0–1 year", "Components and bug fixes"], ["Junior", "React Developer", "1–3 years", "Own pages and features"],
            ["Mid", "Senior Frontend Engineer", "3–6 years", "Architecture, performance, mentoring"], ["Senior", "Frontend Lead / Architect", "6+ years", "Design systems and team decisions"]],
    special=["Most React interviews test JavaScript more than React itself.", "TypeScript is increasingly expected in job posts.",
             "Next.js knowledge helps for SEO-heavy and full stack React roles."],
    mistakes=["Starting React before JavaScript basics.", "Only to-do apps in the portfolio.", "Ignoring accessibility and mobile layouts."],
    faqs=[{"q": "React or Angular?", "a": "Both have jobs. React is very common in startups and product companies; Angular is used in many large enterprise projects. Check job posts in your target city."},
          {"q": "Do I need a degree for React jobs?", "a": "Yes — most company job posts ask for a degree such as BE/BTech (CS/IT), BCA, BSc (CS/IT) or MCA, and large companies often set minimum marks. Your React portfolio is checked on top of the degree."}],
    related_items=[related("full-stack-developer", "Full Stack Developer", "Add backend to your React skills"), related("backend-developer", "Backend Developer", "Server side"),
                   related("shopify-developer", "Shopify Developer", "E-commerce frontend work")],
    institutes=[META_FE, REACT_DOCS, CDAC_AC, NIELIT_O, IITM],
    sources=[source("react.dev — Learn", "https://react.dev/learn", "Official React documentation."),
             source("MDN — JavaScript Guide", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", "Official JavaScript reference.")],
)

WORDPRESS = _guide(
    "wordpress-developer", "WordPress Developer", "WordPress", "How to become a WordPress Developer",
    "A WordPress developer builds and customises websites on WordPress — themes, plugins and client sites for businesses, blogs and stores.",
    duties=["Set up and configure WordPress sites", "Build or customise block themes", "Write custom plugins and integrate forms, payments and SEO tools",
            "Speed up and secure websites", "Maintain, update and back up client sites"],
    postings=["Digital agencies, marketing firms and media companies", "Strong freelance demand from small businesses"],
    facts=[fact("Education", "No degree needed for most freelance/agency work"), fact("Time to job-ready", "About 4–6 months (typical)"),
           fact("Core skills", "HTML, CSS, JavaScript, PHP, WordPress"), fact("Also useful", "Block themes, WooCommerce, SEO basics"),
           fact("Job titles", "WordPress / Web Developer"), fact("Hiring rounds", "Portfolio → test site task → interview"),
           fact("Work mode", "Agency, remote or freelance"), fact("Portfolio", "3–5 live websites")],
    levels=[["Beginner", "Install WordPress, use themes, pages and plugins"], ["Intermediate", "Customise themes with HTML, CSS, PHP and build a block theme"],
            ["Job-ready", "Write a simple plugin, optimise speed and security, and deliver client sites"]],
    steps=[step("Learn HTML and CSS", "Month 1", "WordPress themes are built on these."),
           step("Use WordPress like a pro", "Month 2", "Install locally, build pages with blocks, manage plugins and settings."),
           step("Learn PHP and theme development", "Months 2–4", "PHP basics, the template hierarchy and building a block theme."),
           step("Plugins, WooCommerce and performance", "Months 4–5", "A basic plugin, WooCommerce stores, caching, image optimisation and security."),
           GIT_STEP,
           *JOB_STEPS],
    test_topics="HTML/CSS/PHP MCQs and a small WordPress task",
    interview_topics="Theme structure, hooks (actions/filters), custom post types, WooCommerce, performance, security and your client sites",
    assignment="Convert a design into a WordPress theme page or build a small plugin",
    checklist=["You can build a complete WordPress site from a design.", "You can customise a block theme and write basic PHP.",
               "You can make sites fast, secure and SEO-friendly.", "You have 3–5 live sites to show.", "You can explain hooks and how plugins work."],
    timeline=[("HTML + CSS", "Month 1"), ("WordPress basics", "Month 2"), ("PHP + themes", "Months 2–4"), ("Plugins + WooCommerce", "Months 4–5"), ("Client projects", "Months 5–6")],
    prep=[{"phase": "Basics", "duration": "Months 1–2", "focus": ["HTML, CSS", "WordPress admin", "Local setup"]},
          {"phase": "Developer skills", "duration": "Months 2–5", "focus": ["PHP", "Block themes", "Simple plugins"]},
          {"phase": "Earn", "duration": "Months 5–6", "focus": ["3–5 live sites", "Freelance profile", "Agency applications"]}],
    resources=[{"label": "Learn WordPress", "url": "https://learn.wordpress.org/", "note": "Official free courses and pathways."},
               {"label": "WordPress Developer Resources", "url": "https://developer.wordpress.org/", "note": "Official theme, block and plugin handbooks."}],
    ladder=[["Start", "WordPress Intern / Junior", "0–1 year", "Site setup and edits"], ["Junior", "WordPress Developer", "1–3 years", "Themes, plugins, client sites"],
            ["Mid", "Senior WordPress Developer", "3–5 years", "Custom builds, performance"], ["Senior", "Lead / Agency owner", "5+ years", "Run projects or your own agency"]],
    special=["Freelancing is very common — your live sites are your resume.", "Modern WordPress uses block themes and the block editor; learn these, not only page builders.",
             "Speed and security skills help you charge more."],
    mistakes=["Relying only on page builders without learning code.", "Installing too many plugins on client sites.", "No backups or updates for client sites."],
    faqs=[{"q": "Do I need PHP?", "a": "For developer roles, yes — themes and plugins use PHP. Site builders can start without it."},
          {"q": "Can I earn as a freelancer?", "a": "Yes, many small businesses need WordPress sites; start with 2–3 sample sites and local clients."}],
    related_items=[related("shopify-developer", "Shopify Developer", "E-commerce sites"), related("full-stack-developer", "Full Stack Developer", "Custom web apps"),
                   related("react-developer", "React Developer", "Modern frontend")],
    institutes=[WP_LEARN, NIELIT_O, MDN, IGNOU],
    sources=[source("Learn WordPress", "https://learn.wordpress.org/", "Official WordPress courses."),
             source("WordPress Developer Resources", "https://developer.wordpress.org/", "Official developer handbooks.")],
)

SHOPIFY_DEV = _guide(
    "shopify-developer", "Shopify Developer", "Shopify", "How to become a Shopify Developer",
    "A Shopify developer builds and customises online stores on Shopify — themes with the Liquid language, store setups and Shopify apps.",
    duties=["Set up and configure Shopify stores", "Customise themes with Liquid, HTML, CSS and JavaScript", "Build theme sections and blocks merchants can edit",
            "Integrate apps, payments and shipping", "Improve store speed and conversions"],
    postings=["E-commerce agencies and D2C brands", "Strong freelance and remote demand, including overseas clients"],
    facts=[fact("Education", "No degree needed for most agency/freelance work"), fact("Time to job-ready", "About 4–6 months (typical)"),
           fact("Core skills", "HTML, CSS, JavaScript, Liquid"), fact("For apps", "Node.js/React and Shopify APIs"),
           fact("Job titles", "Shopify Developer / Theme Developer"), fact("Hiring rounds", "Portfolio → store task → interview"),
           fact("Work mode", "Agency, remote or freelance"), fact("Portfolio", "3–5 store builds or theme customisations")],
    levels=[["Beginner", "Set up a store, use themes and the theme editor"], ["Intermediate", "Edit themes with Liquid, build custom sections and blocks"],
            ["Job-ready", "Build a full custom theme section set, optimise speed and integrate apps/APIs"]],
    steps=[step("Learn HTML, CSS and JavaScript", "Months 1–2", "Themes are web code at their core."),
           step("Learn Shopify as a merchant", "Month 2", "Products, collections, payments, shipping and the theme editor."),
           step("Learn Liquid theme development", "Months 2–4", "Liquid objects/filters, sections and blocks, local workflow with Shopify CLI (Shopify Academy paths)."),
           step("Apps and APIs (optional)", "Months 4–6", "Shopify app development basics with the official 'Developing Apps for Shopify' path."),
           GIT_STEP,
           *JOB_STEPS],
    test_topics="HTML/CSS/JavaScript and a Liquid customisation task",
    interview_topics="Liquid, theme architecture (sections/blocks), store setup, performance, apps and your store builds",
    assignment="Build a custom theme section (e.g. product slider) editable from the theme editor",
    checklist=["You can build and customise Shopify themes with Liquid.", "You can create sections and blocks merchants can edit.",
               "You can improve store speed and fix layout issues.", "You have 3–5 store builds or demo stores.", "You understand Shopify's store setup from a merchant's view."],
    timeline=[("HTML, CSS, JavaScript", "Months 1–2"), ("Shopify store setup", "Month 2"), ("Liquid themes", "Months 2–4"), ("Apps / APIs (optional)", "Months 4–6"), ("Client work", "Months 5–6")],
    prep=[{"phase": "Web basics", "duration": "Months 1–2", "focus": ["HTML, CSS", "JavaScript", "Responsive layouts"]},
          {"phase": "Shopify", "duration": "Months 2–5", "focus": ["Shopify Academy paths", "Liquid sections", "Demo stores"]},
          {"phase": "Earn", "duration": "Months 5–6", "focus": ["Portfolio stores", "Freelance profile", "Agency applications"]}],
    resources=[{"label": "Shopify Academy", "url": "https://www.shopifyacademy.com/", "note": "Official free development learning paths."},
               {"label": "Shopify developer docs — Themes", "url": "https://shopify.dev/docs/storefronts/themes", "note": "Official theme and Liquid docs."}],
    ladder=[["Start", "Shopify Intern / Junior", "0–1 year", "Store setup and edits"], ["Junior", "Shopify Developer", "1–3 years", "Custom sections and themes"],
            ["Mid", "Senior Shopify Developer", "3–5 years", "Custom themes, apps, performance"], ["Senior", "E-commerce Lead / Agency owner", "5+ years", "Run projects or an agency"]],
    special=["Joining the Shopify Partner Program lets you build development stores for practice and clients.", "Theme skills get you started; app skills (Node/React + APIs) open higher-paid work."],
    mistakes=["Editing live store themes without a backup/duplicate.", "Hard-coding content instead of building editable sections.", "Ignoring store speed."],
    faqs=[{"q": "Is Shopify development only for freelancers?", "a": "No — e-commerce agencies and D2C brands hire Shopify developers full time too."},
          {"q": "Do I need to pay to practise?", "a": "Shopify Partners can create development stores for building and testing; many Shopify Academy courses are free."}],
    related_items=[related("wordpress-developer", "WordPress Developer", "Websites and WooCommerce"), related("react-developer", "React Developer", "Frontend and Shopify apps"),
                   related("full-stack-developer", "Full Stack Developer", "Custom e-commerce apps")],
    institutes=[SHOPIFY, NIELIT_O, META_FE, MDN],
    sources=[source("Shopify Academy", "https://www.shopifyacademy.com/", "Official Shopify development learning paths."),
             source("Shopify developer documentation", "https://shopify.dev/docs/storefronts/themes", "Official theme and Liquid documentation.")],
)

GUIDES = [FRONTEND, BACKEND, FULLSTACK, ANDROID, IOS, FLUTTER_DEV, REACT, WORDPRESS, SHOPIFY_DEV]
_BY_KEY = {}
for _g in GUIDES:
    for _k in (_g["slug"], _g["title"]):
        _BY_KEY[slugify(_k)] = _g


def tech_guide(value):
    g = _BY_KEY.get(slugify(value or ""))
    return deepcopy(g) if g else None
