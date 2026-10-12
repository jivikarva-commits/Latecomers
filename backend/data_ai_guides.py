"""IT / Tech — Data & AI beginner guides (same structure as the Web & App guides).

Course facts checked on 2026-10-12 against: C-DAC ACTS admission booklet (Aug 2026 batch: PGCP-BDA,
PGCP-AI), IIT Madras BS academics page, Coursera pages for the Google, IBM and DeepLearning.AI
programmes, Microsoft Learn (PL-300, T-SQL path), Google Cloud ML Engineer certification page,
Tableau certification page, IIBA ECBA page, DeepLearning.AI short course page and Microsoft's
Generative AI for Beginners repository. Microsoft's Azure AI Engineer (AI-102) is retired and not listed.
"""
from copy import deepcopy

from career_catalog import slugify
from gov_guide_kit import fact, institute, related, source, step
from tech_guides import CDAC_URL, GIT_STEP, IGNOU, IITM, INSTITUTE_SOURCES, JOB_STEPS, _guide

GROUP = "Data & AI"
IITM_URL = "https://study.iitm.ac.in/ds/academics.html"

CDAC_BDA = institute(
    "C-DAC — PG Certificate Programme in Big Data Analytics (PGCP-BDA)", "Government (MeitY) · C-DAC ACTS training centres", CDAC_URL,
    "Linux & cloud computing, Python and R, Java, advanced analytics using statistics, data collection & DBMS, big data technologies (Hadoop/MapReduce), data visualisation, practical machine learning and a project.",
    "Graduates who want intensive classroom/online training for analytics and big data roles.",
    mode="Online or physical (depends on centre)", duration="24 weeks full-time",
    fee="₹97,750 + GST online · ₹1,15,000 + GST physical (Aug 2026 batch)",
    eligibility="Engineering/MCA/science-PG graduates (and management PGs with IT/CS graduation) as per Table 1 · C-CAT Sections A+B")
CDAC_AI = institute(
    "C-DAC — PG Certificate Programme in Artificial Intelligence (PGCP-AI)", "Government (MeitY) · C-DAC ACTS training centres", CDAC_URL,
    "Mathematics & statistics for AI, advanced programming for AI, data analytics, practical machine learning, deep neural networks, NLP & computer vision, AI compute platforms and a project.",
    "Engineering/MCA/science-PG graduates aiming for ML/AI engineering roles.",
    mode="Online or physical (depends on centre)", duration="24 weeks full-time",
    fee="₹1,27,500 + GST online · ₹1,50,000 + GST physical (Aug 2026 batch)",
    eligibility="As per Table 1 of the C-DAC booklet (engineering, MCA or science PG, minimum marks apply) · C-CAT Sections A+B")
IITM_DS = institute(
    "IIT Madras — Diploma in Data Science (BS in Data Science & Applications)", "IIT · online programme", IITM_URL,
    "Machine Learning Foundations, Techniques and Practice, Business Data Management, Tools in Data Science and an ML project, plus a track in Business Analytics or Deep Learning & Generative AI.",
    "Learners who want an IIT-level data science credential while studying or working.",
    mode="Online learning with IIT Madras assessments", duration="Diploma level: 27 credits after the Foundation level (maths, statistics, Python)",
    eligibility="Through the IIT Madras qualifier process — see the admissions page")
GOOGLE_DA = institute(
    "Google Data Analytics Professional Certificate (Coursera)", "Industry certificate · online", "https://www.coursera.org/professional-certificates/google-data-analytics",
    "Spreadsheets, SQL, Tableau, R programming, data cleaning, visualisation and a case-study capstone.",
    "Complete beginners who want a structured first step into analytics.",
    mode="Online, self-paced", duration="9 courses · about 6 months at 10 hours/week", eligibility="Beginners — no background needed")
GOOGLE_ADA = institute(
    "Google Advanced Data Analytics Professional Certificate (Coursera)", "Industry certificate · online", "https://www.coursera.org/professional-certificates/google-advanced-data-analytics",
    "Python for data work, statistics and hypothesis testing, regression, machine learning basics, Tableau and a capstone.",
    "Analysts who already know the basics and want to move toward data science.",
    mode="Online, self-paced", duration="7 courses · about 6 months at 10 hours/week", eligibility="Prior data analytics skills recommended")
GOOGLE_BI = institute(
    "Google Business Intelligence Professional Certificate (Coursera)", "Industry certificate · online", "https://www.coursera.org/professional-certificates/google-business-intelligence",
    "Data modelling and SQL, BigQuery, Tableau dashboards and reports, and BI project work.",
    "Analysts who want to move into BI/dashboard roles.",
    mode="Online, self-paced", duration="4 courses · about 2 months at 10 hours/week", eligibility="Prior data analytics experience recommended")
IBM_DS = institute(
    "IBM Data Science Professional Certificate (Coursera)", "Industry certificate · online", "https://www.coursera.org/professional-certificates/ibm-data-science",
    "Python, SQL, Jupyter, pandas/NumPy, data visualisation, machine learning with scikit-learn and a capstone.",
    "Beginners who want a Python-first data science path.",
    mode="Online, self-paced", duration="12 courses · about 4–6 months at 10 hours/week", eligibility="Beginners — no prior experience needed")
ML_SPEC = institute(
    "Machine Learning Specialization — DeepLearning.AI & Stanford Online (Coursera)", "University/industry course · online", "https://www.coursera.org/specializations/machine-learning-introduction",
    "Supervised and unsupervised learning, neural networks, decision trees, recommender systems and reinforcement learning with Python, NumPy, scikit-learn and TensorFlow (taught by Andrew Ng).",
    "Anyone with basic Python who wants solid ML fundamentals.",
    mode="Online, self-paced", duration="3 courses · about 2 months at 10 hours/week", eligibility="Beginner level; basic Python and maths help")
GCP_MLE = institute(
    "Google Cloud — Professional Machine Learning Engineer certification", "Industry certification · exam", "https://cloud.google.com/learn/certification/machine-learning-engineer",
    "Architecting low-code AI, managing data and models, scaling prototypes, serving models, ML pipelines and monitoring on Google Cloud.",
    "Working ML engineers who want a recognised cloud ML credential (not a first course).",
    mode="Online-proctored or Pearson VUE test centre", duration="2-hour exam, 50–60 questions", fee="US$200 + tax",
    eligibility="No prerequisites; Google recommends 3+ years of industry experience")
MS_PL300 = institute(
    "Microsoft Certified: Power BI Data Analyst Associate (Exam PL-300)", "Industry certification · free Microsoft Learn training", "https://learn.microsoft.com/en-us/credentials/certifications/data-analyst-associate/",
    "Prepare, model, visualise and analyse data, and manage and secure Power BI — using Power Query and DAX.",
    "Anyone targeting Power BI / data analyst roles.",
    mode="Proctored exam (Pearson VUE); free learning paths on Microsoft Learn", duration="100-minute exam · renew free every 12 months online",
    fee="Exam price depends on country", eligibility="No formal prerequisite")
TABLEAU_CERT = institute(
    "Tableau certifications (Salesforce) — Desktop Foundations and Tableau Data Analyst", "Industry certification · Trailhead Academy", "https://www.tableau.com/learn/certification",
    "Desktop Foundations proves basic Tableau skills; Tableau Data Analyst (advanced) covers analysis and dashboards for the analyst role.",
    "Analysts who use or want to use Tableau at work.",
    mode="Online exams through Salesforce Trailhead Academy", eligibility="Start with Desktop Foundations if you are new")
MS_TSQL = institute(
    "Microsoft Learn — Query and modify data with Transact-SQL", "Official Microsoft training · online", "https://learn.microsoft.com/en-us/training/paths/get-started-querying-with-transact-sql/",
    "SELECT queries, sorting and filtering, JOINs, subqueries, built-in functions with GROUP BY, and inserting/updating/deleting data.",
    "Beginners learning SQL for analyst or database roles.",
    mode="Online, self-paced, free", duration="6 modules · beginner", eligibility="Comfort with tables of data (e.g. spreadsheets)")
IIBA_ECBA = institute(
    "IIBA — Entry Certificate in Business Analysis (ECBA)", "Professional certification · International Institute of Business Analysis", "https://www.iiba.org/business-analysis-certifications/ecba/",
    "IIBA describes ECBA as the first step for aspiring business analysis professionals; the exam follows its published ECBA blueprint.",
    "Freshers and career switchers who want a recognised BA credential.",
    mode="Online exam; learning journey and practice exam from IIBA", eligibility="See the ECBA handbook on the IIBA site (student discounts available)")
DLAI_PROMPT = institute(
    "ChatGPT Prompt Engineering for Developers — DeepLearning.AI with OpenAI", "Short course · online", "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/",
    "Prompting principles, summarising, inferring, transforming and expanding text, and building a chatbot with the OpenAI API (taught by Isa Fulford and Andrew Ng).",
    "Beginners with basic Python who want hands-on prompt engineering.",
    mode="Online video + code notebooks", duration="About 1 hour 40 minutes", fee="Free to take during the beta period; certificate needs PRO",
    eligibility="Basic Python")
MS_GENAI = institute(
    "Microsoft — Generative AI for Beginners", "Open-source course · GitHub", "https://github.com/microsoft/generative-ai-for-beginners",
    "21 lessons covering prompt engineering, building chat and search apps, retrieval-augmented generation (RAG), vector databases and AI agents, with Python and TypeScript samples.",
    "Developers who want to build generative-AI applications step by step.",
    mode="Self-paced (open-source, MIT licence)", duration="21 lessons", fee="Course is open; running examples may need paid API credits from your chosen provider",
    eligibility="Basic programming")

_EXTRA_SOURCES = {IITM_URL: source("IIT Madras BS — Academics", IITM_URL, "Diploma in Data Science and Diploma in Programming courses.")}


def _srcs(*items):
    return [*items]


DATA_ANALYST = _guide(
    "data-analyst", "Data Analyst", "Data Analyst", "How to become a Data Analyst",
    "A data analyst turns raw business data into answers — cleaning data, finding trends and presenting them in reports and dashboards that help teams decide.",
    duties=["Collect and clean data from spreadsheets, databases and tools", "Write SQL queries to answer business questions",
            "Build dashboards in Power BI, Tableau or Excel", "Find trends, compare periods and explain what changed", "Present findings to managers in simple language"],
    postings=["E-commerce, banking, fintech, consulting, IT services, healthcare and startups", "Office, hybrid or remote"],
    facts=[fact("Education", "Any graduation works; maths/commerce/CS help"), fact("Time to job-ready", "About 5–8 months (typical)"),
           fact("Core skills", "Excel, SQL, statistics basics"), fact("Tools", "Power BI or Tableau, Python (optional at start)"),
           fact("Job titles", "Data / MIS / Reporting Analyst"), fact("Hiring rounds", "Test → SQL/Excel round → case → HR"),
           fact("Good for", "Commerce, BSc, BBA and career switchers too"), fact("Portfolio", "3 analysis projects + 1 dashboard")],
    levels=[["Beginner", "Excel formulas, pivot tables, charts and basic statistics (mean, median, percentages)"],
            ["Intermediate", "SQL joins and GROUP BY, one BI tool, cleaning messy data"],
            ["Job-ready", "End-to-end projects: question → SQL/Python → dashboard → clear recommendations"]],
    steps=[step("Master Excel", "Month 1", "Formulas (IF, XLOOKUP), pivot tables, charts and data cleaning."),
           step("Learn SQL", "Months 1–3", "SELECT, WHERE, JOINs, GROUP BY, subqueries and window functions."),
           step("Learn statistics basics", "Months 2–3", "Averages, distributions, percentages, correlation and simple A/B test ideas."),
           step("Learn one BI tool", "Months 3–4", "Power BI (PL-300 path) or Tableau — build interactive dashboards."),
           step("Add Python (optional but valuable)", "Months 4–6", "pandas for cleaning and analysis, matplotlib/seaborn for charts."),
           GIT_STEP, *JOB_STEPS],
    test_topics="Excel, SQL queries, aptitude and basic statistics",
    interview_topics="SQL (joins, GROUP BY, window functions), Excel, KPIs, case questions and walking through your dashboards",
    assignment="Analyse a dataset and share insights with a dashboard",
    checklist=["You can answer business questions with SQL.", "You can clean data and build a pivot-table report in Excel.",
               "You have at least one interactive dashboard (Power BI or Tableau).", "You can explain your findings without jargon.", "You have 3 projects with clear write-ups."],
    timeline=[("Excel", "Month 1"), ("SQL", "Months 1–3"), ("Statistics", "Months 2–3"), ("Power BI / Tableau", "Months 3–4"), ("Python + portfolio", "Months 4–7")],
    prep=[{"phase": "Foundation", "duration": "Months 1–3", "focus": ["Excel and SQL daily", "Statistics basics", "Small analyses"]},
          {"phase": "Tools + projects", "duration": "Months 3–6", "focus": ["Power BI or Tableau", "pandas basics", "3 portfolio projects"]},
          {"phase": "Get hired", "duration": "Months 6–8", "focus": ["SQL interview practice", "Case questions", "Mock interviews"]}],
    resources=[{"label": "Microsoft Learn — Power BI training", "url": "https://learn.microsoft.com/en-us/training/powerplatform/power-bi", "note": "Free official Power BI paths."},
               {"label": "Microsoft Learn — Transact-SQL path", "url": "https://learn.microsoft.com/en-us/training/paths/get-started-querying-with-transact-sql/", "note": "Free SQL basics."},
               {"label": "pandas — Getting started", "url": "https://pandas.pydata.org/docs/getting_started/index.html", "note": "Official pandas tutorials."}],
    ladder=[["Start", "Data / MIS Analyst (fresher)", "0–1 year", "Reports and data cleaning"], ["Junior", "Data Analyst", "1–3 years", "Own dashboards and analyses"],
            ["Mid", "Senior Data Analyst / Analytics Lead", "3–6 years", "Define KPIs, guide decisions"], ["Senior", "Analytics Manager / Data Scientist", "6+ years", "Lead teams or move into data science"]],
    special=["SQL is asked in almost every data analyst interview — practise it the most.", "Domain knowledge (sales, finance, operations) makes your analysis more valuable.",
             "Data analyst is a common entry point into data science."],
    mistakes=["Learning many tools but no SQL depth.", "Dashboards with lots of charts but no clear insight.", "Projects without a business question."],
    faqs=[{"q": "Can a commerce or arts graduate become a data analyst?", "a": "Yes. Excel, SQL and a BI tool matter more than your stream; build projects to prove it."},
          {"q": "Do I need Python?", "a": "Not for many entry roles, but it helps you grow and is often asked for mid-level roles."}],
    related_items=[related("power-bi-tableau-analyst", "Power BI / Tableau Analyst", "Focus on dashboards"), related("sql-database-analyst", "SQL / Database Analyst", "Focus on SQL"),
                   related("data-scientist", "Data Scientist", "Next step with ML")],
    institutes=[GOOGLE_DA, MS_PL300, CDAC_BDA, IITM_DS, IBM_DS],
    sources=_srcs(source("Microsoft Learn — Power BI", "https://learn.microsoft.com/en-us/training/powerplatform/power-bi", "Official Power BI training.")),
    group=GROUP,
)

BUSINESS_ANALYST = _guide(
    "business-analyst", "Business Analyst", "Business Analyst", "How to become a Business Analyst",
    "A business analyst connects business teams and tech teams — understanding problems, writing clear requirements and using data to recommend improvements.",
    duties=["Talk to users and managers to understand problems and goals", "Write requirements, user stories and process maps",
            "Analyse data to size problems and measure results", "Work with developers and testers so the right thing gets built", "Present recommendations and track impact"],
    postings=["IT services, banks, consulting firms, product companies and startups", "Often a client-facing role"],
    facts=[fact("Education", "Any graduation; MBA helps for some roles"), fact("Time to job-ready", "About 4–7 months (typical)"),
           fact("Core skills", "Requirements, communication, Excel, SQL basics"), fact("Tools", "Excel, SQL, Jira, process-mapping tools, Power BI/Tableau"),
           fact("Job titles", "Business / Product / Process Analyst"), fact("Hiring rounds", "Aptitude → case → interview → HR"),
           fact("Good for", "Commerce, BBA/MBA, engineers and career switchers"), fact("Portfolio", "BRD/user stories + 1 data case study")],
    levels=[["Beginner", "Write clear user stories and process steps; Excel basics"],
            ["Intermediate", "Gather requirements, map processes, basic SQL and dashboards"],
            ["Job-ready", "Complete case study: problem → requirements → data → recommendation"]],
    steps=[step("Learn how businesses work", "Month 1", "Basics of sales, operations, finance and how software projects run (Agile/Scrum)."),
           step("Learn requirements skills", "Months 1–3", "Stakeholder interviews, user stories, acceptance criteria, BRDs and process maps."),
           step("Learn data basics", "Months 2–4", "Excel, SQL basics and one dashboard tool to support decisions with numbers."),
           step("Build case studies", "Months 3–5", "Pick a real app or process, document problems, requirements and a data-backed recommendation."),
           step("Consider a BA certification", "Optional", "IIBA's ECBA is designed as the first business analysis credential."),
           *JOB_STEPS],
    test_topics="Aptitude, logical reasoning, Excel and basic SQL",
    interview_topics="Requirement gathering scenarios, user stories, process improvement, SQL basics, stakeholder handling and your case studies",
    assignment="Write requirements or a short analysis for a business problem",
    checklist=["You can write clear user stories with acceptance criteria.", "You can map an as-is and to-be process.",
               "You can support decisions with data (Excel/SQL/dashboard).", "You have 2 documented case studies.", "You communicate clearly in writing and speaking."],
    timeline=[("Business + Agile basics", "Month 1"), ("Requirements skills", "Months 1–3"), ("Data skills", "Months 2–4"), ("Case studies", "Months 3–5"), ("Interview prep", "Months 5–7")],
    prep=[{"phase": "Foundation", "duration": "Months 1–3", "focus": ["Agile/Scrum basics", "User stories and BRDs", "Excel"]},
          {"phase": "Data + cases", "duration": "Months 3–5", "focus": ["SQL basics", "Dashboards", "2 case studies"]},
          {"phase": "Get hired", "duration": "Months 5–7", "focus": ["Case interview practice", "Communication", "Mock interviews"]}],
    resources=[{"label": "IIBA — ECBA", "url": "https://www.iiba.org/business-analysis-certifications/ecba/", "note": "Entry-level BA certification and learning journey."},
               {"label": "Microsoft Learn — Power BI training", "url": "https://learn.microsoft.com/en-us/training/powerplatform/power-bi", "note": "Free dashboard skills."}],
    ladder=[["Start", "Associate / Junior Business Analyst", "0–2 years", "Document requirements, support seniors"], ["Mid", "Business Analyst", "2–5 years", "Own requirements for projects"],
            ["Senior", "Senior BA / Lead BA", "5–8 years", "Lead analysis for programmes"], ["Next", "Product Manager / Consultant", "8+ years", "Own product or client strategy"]],
    special=["BA roles vary: IT BAs focus on requirements; data-oriented BAs lean on SQL and dashboards. Read the job post.",
             "Communication and clear writing are as important as tools."],
    mistakes=["Only learning tools without requirement-writing practice.", "Case studies with no measurable outcome.", "Ignoring Agile basics."],
    faqs=[{"q": "Is MBA required to become a business analyst?", "a": "No. Many BAs are graduates from commerce, engineering or other fields; MBA helps for some consulting roles."},
          {"q": "Business analyst or data analyst?", "a": "Data analysts focus on analysing data; business analysts focus on problems and requirements, using data as support."}],
    related_items=[related("data-analyst", "Data Analyst", "More hands-on data work"), related("power-bi-tableau-analyst", "Power BI / Tableau Analyst", "Dashboard specialist"),
                   related("sql-database-analyst", "SQL / Database Analyst", "Query skills")],
    institutes=[IIBA_ECBA, GOOGLE_DA, IITM_DS, CDAC_BDA, GOOGLE_BI],
    sources=_srcs(source("IIBA — ECBA", "https://www.iiba.org/business-analysis-certifications/ecba/", "Entry business analysis certification.")),
    group=GROUP,
)

DATA_SCIENTIST = _guide(
    "data-scientist", "Data Scientist", "Data Scientist", "How to become a Data Scientist",
    "A data scientist uses statistics, programming and machine learning to find patterns in data and build models that predict or recommend.",
    duties=["Frame business problems as data problems", "Clean and explore large datasets with Python and SQL", "Build and evaluate machine learning models",
            "Run experiments (A/B tests) and statistical analyses", "Explain results and work with engineers to put models in production"],
    postings=["Product companies, banks/fintech, e-commerce, consulting and research", "Often needs a strong maths/statistics base"],
    facts=[fact("Education", "Degree in CS, maths, statistics, engineering or similar helps"), fact("Time to job-ready", "About 10–14 months (typical)"),
           fact("Core skills", "Python, SQL, statistics, machine learning"), fact("Libraries", "pandas, NumPy, scikit-learn, matplotlib"),
           fact("Job titles", "Data Scientist / Associate Data Scientist"), fact("Hiring rounds", "Test → stats/ML round → case → HR"),
           fact("Common entry", "Many start as data analysts first"), fact("Portfolio", "3 end-to-end ML projects")],
    levels=[["Beginner", "Python, pandas, SQL and descriptive statistics"], ["Intermediate", "Probability, hypothesis testing, regression and classification with scikit-learn"],
            ["Job-ready", "Feature engineering, model evaluation, explaining models and end-to-end projects"]],
    steps=[step("Learn Python and SQL", "Months 1–3", "Python basics, pandas, NumPy and SQL queries."),
           step("Learn maths and statistics", "Months 2–5", "Probability, distributions, hypothesis tests, linear algebra and calculus basics."),
           step("Learn machine learning", "Months 4–8", "Regression, classification, clustering, model evaluation and scikit-learn."),
           step("Do end-to-end projects", "Months 7–11", "From messy data to a model and a clear write-up; deploy one as a simple app."),
           GIT_STEP, *JOB_STEPS],
    test_topics="Python, SQL, statistics and probability, aptitude",
    interview_topics="Statistics (p-values, distributions), ML (bias-variance, overfitting, metrics), SQL, Python and your projects",
    assignment="Build and explain a predictive model on a given dataset",
    checklist=["You can clean and explore data in Python and SQL.", "You understand core statistics and when to use which test.",
               "You can train, evaluate and explain ML models.", "You have 3 end-to-end projects with clear reports.", "You can explain trade-offs (accuracy vs interpretability)."],
    timeline=[("Python + SQL", "Months 1–3"), ("Statistics + maths", "Months 2–5"), ("Machine learning", "Months 4–8"), ("Projects", "Months 7–11"), ("Interview prep", "Months 10–14")],
    prep=[{"phase": "Foundation", "duration": "Months 1–5", "focus": ["Python, pandas, SQL", "Statistics", "Data cleaning projects"]},
          {"phase": "Machine learning", "duration": "Months 4–9", "focus": ["scikit-learn models", "Evaluation metrics", "Feature engineering"]},
          {"phase": "Get hired", "duration": "Months 9–14", "focus": ["3 end-to-end projects", "Stats + ML interview questions", "Mock interviews"]}],
    resources=[{"label": "Python — official tutorial", "url": "https://docs.python.org/3/tutorial/", "note": "Python basics."},
               {"label": "pandas — Getting started", "url": "https://pandas.pydata.org/docs/getting_started/index.html", "note": "Official pandas tutorials."},
               {"label": "scikit-learn — Getting started", "url": "https://scikit-learn.org/stable/getting_started.html", "note": "Official ML library docs."}],
    ladder=[["Start", "Associate Data Scientist / Analyst", "0–2 years", "Analyses and simple models"], ["Mid", "Data Scientist", "2–5 years", "Own models and experiments"],
            ["Senior", "Senior / Lead Data Scientist", "5–8 years", "Lead projects, mentor"], ["Next", "Principal Data Scientist / Head of Data Science", "8+ years", "Strategy and teams"]],
    special=["Statistics depth separates good data scientists from tool users.", "Many companies hire freshers as analysts first and move them into data science.",
             "A master's degree helps for some research-heavy roles but is not mandatory everywhere."],
    mistakes=["Only Kaggle-style accuracy chasing without business context.", "Skipping statistics.", "Projects that stop at a notebook with no explanation."],
    faqs=[{"q": "Do I need a master's degree?", "a": "Not always. Strong projects and fundamentals can get you in, though some roles prefer a master's."},
          {"q": "Data scientist or ML engineer?", "a": "Data scientists focus on analysis and modelling; ML engineers focus on building and running models in production."}],
    related_items=[related("data-analyst", "Data Analyst", "Common entry point"), related("ml-engineer", "ML Engineer", "Production ML"),
                   related("ai-prompt-engineer", "AI / Prompt Engineer", "Generative AI apps")],
    institutes=[IITM_DS, CDAC_BDA, IBM_DS, GOOGLE_ADA, ML_SPEC],
    sources=_srcs(source("scikit-learn — Getting started", "https://scikit-learn.org/stable/getting_started.html", "Official ML library docs."),
                  source("pandas — Getting started", "https://pandas.pydata.org/docs/getting_started/index.html", "Official pandas docs.")),
    group=GROUP,
)

ML_ENGINEER = _guide(
    "ml-engineer", "ML Engineer", "ML Engineer", "How to become a Machine Learning (ML) Engineer",
    "An ML engineer builds, deploys and maintains machine learning models in real products — combining software engineering with machine learning.",
    duties=["Turn prototype models into reliable services", "Build data and training pipelines", "Deploy models as APIs and monitor their performance",
            "Optimise models for speed and cost", "Work with data scientists, backend and DevOps teams"],
    postings=["Product companies, AI startups, e-commerce, fintech and cloud teams", "Strong software engineering skills expected"],
    facts=[fact("Education", "BE/BTech/MCA/MSc in CS or related usually preferred"), fact("Time to job-ready", "About 12–18 months (typical)"),
           fact("Core skills", "Python, ML, software engineering, SQL"), fact("Frameworks", "scikit-learn, TensorFlow or PyTorch"),
           fact("Also needed", "Docker, APIs, cloud basics, MLOps"), fact("Job titles", "ML Engineer / AI Engineer"),
           fact("Hiring rounds", "DSA test → ML + system design → HR"), fact("Portfolio", "2–3 deployed ML projects")],
    levels=[["Beginner", "Python, data structures, statistics and basic ML"], ["Intermediate", "Train and evaluate models; deep learning with TensorFlow/PyTorch"],
            ["Job-ready", "Deploy models as APIs, pipelines, monitoring, Docker and cloud"]],
    steps=[step("Strong programming base", "Months 1–3", "Python, data structures and algorithms, Git and clean code."),
           step("Maths for ML", "Months 2–4", "Linear algebra, probability, statistics and calculus basics."),
           step("Machine learning and deep learning", "Months 4–9", "Classical ML, neural networks, and one framework (TensorFlow or PyTorch)."),
           step("MLOps and deployment", "Months 8–12", "Serve models with an API, Docker, experiment tracking, monitoring and a cloud platform."),
           GIT_STEP, *JOB_STEPS],
    test_topics="Data structures & algorithms, Python, ML MCQs",
    interview_topics="ML fundamentals, deep learning, model deployment, ML system design, DSA and your projects",
    assignment="Train a model and serve it as an API with documentation",
    checklist=["You write clean, tested Python and can solve DSA problems.", "You can train and evaluate ML and deep learning models.",
               "You can deploy a model as an API in Docker and explain monitoring.", "You have 2–3 deployed ML projects.", "You can discuss ML system design trade-offs."],
    timeline=[("Programming + DSA", "Months 1–3"), ("Maths for ML", "Months 2–4"), ("ML + deep learning", "Months 4–9"), ("MLOps + deployment", "Months 8–12"), ("Projects + interviews", "Months 11–18")],
    prep=[{"phase": "Engineering base", "duration": "Months 1–4", "focus": ["Python + DSA", "Maths", "Git"]},
          {"phase": "ML depth", "duration": "Months 4–9", "focus": ["ML Specialization-level fundamentals", "Deep learning framework", "Projects"]},
          {"phase": "Production", "duration": "Months 9–18", "focus": ["APIs + Docker", "Cloud ML", "System design practice"]}],
    resources=[{"label": "scikit-learn — Getting started", "url": "https://scikit-learn.org/stable/getting_started.html", "note": "Classical ML."},
               {"label": "Python — official tutorial", "url": "https://docs.python.org/3/tutorial/", "note": "Python basics."}],
    ladder=[["Start", "Junior ML Engineer / SDE (ML team)", "0–2 years", "Pipelines and model integration"], ["Mid", "ML Engineer", "2–5 years", "Own models in production"],
            ["Senior", "Senior / Staff ML Engineer", "5–8 years", "ML platform and architecture"], ["Next", "ML Architect / Head of ML", "8+ years", "Strategy and teams"]],
    special=["ML engineering is software engineering first — DSA and coding rounds are common.", "Many people move into ML engineering after working as software or data engineers.",
             "Cloud ML certifications (e.g. Google Cloud Professional ML Engineer) are for experienced engineers, not beginners."],
    mistakes=["Only notebooks — no deployed model.", "Skipping DSA and software engineering.", "Chasing the newest model instead of fundamentals."],
    faqs=[{"q": "Can a fresher become an ML engineer?", "a": "Possible with strong CS skills and projects, but many start as software or data engineers and move in later."},
          {"q": "TensorFlow or PyTorch?", "a": "Either is fine; learn one well. Both are widely used."}],
    related_items=[related("data-scientist", "Data Scientist", "Modelling and analysis"), related("ai-prompt-engineer", "AI / Prompt Engineer", "LLM applications"),
                   related("backend-developer", "Backend Developer", "Serving models via APIs")],
    institutes=[CDAC_AI, IITM_DS, ML_SPEC, GCP_MLE],
    sources=_srcs(source("Google Cloud — Professional ML Engineer", "https://cloud.google.com/learn/certification/machine-learning-engineer", "Exam scope, format and fee.")),
    group=GROUP,
)

AI_PROMPT = _guide(
    "ai-prompt-engineer", "AI / Prompt Engineer", "AI / Prompt Engineer", "How to become an AI / Prompt Engineer",
    "An AI / prompt engineer builds useful applications on top of large language models (LLMs) — designing prompts, connecting company data (RAG), and testing that answers are accurate and safe.",
    duties=["Design and test prompts for chatbots, writing tools and automation", "Connect LLMs to company documents with retrieval (RAG) and vector databases",
            "Build AI features with LLM APIs in Python or JavaScript", "Evaluate outputs for accuracy, safety and cost", "Work with product teams to automate real workflows"],
    postings=["AI startups, product companies, IT services and in-house automation teams", "Fast-changing field — keep learning"],
    facts=[fact("Education", "Any graduation; programming background helps a lot"), fact("Time to job-ready", "About 4–8 months (typical, with coding)"),
           fact("Core skills", "Prompting, Python/JS, APIs, evaluation"), fact("Also used", "RAG, vector databases, agents"),
           fact("Job titles", "AI Engineer / LLM Engineer / Prompt Engineer"), fact("Hiring rounds", "Coding → AI build task → interview → HR"),
           fact("Note", "Pure 'prompt-only' jobs are fewer; prompting + coding is in demand"), fact("Portfolio", "2–3 working AI apps with demos")],
    levels=[["Beginner", "Write clear prompts, use few-shot examples and structured outputs"], ["Intermediate", "Call LLM APIs from code, build a chatbot, basic RAG"],
            ["Job-ready", "Evaluation sets, guardrails, agents/tool use, cost and latency control"]],
    steps=[step("Learn Python basics", "Month 1", "Functions, JSON, HTTP requests and environment variables."),
           step("Learn prompting principles", "Months 1–2", "Clear instructions, examples, step-by-step reasoning, structured output and iteration."),
           step("Build with LLM APIs", "Months 2–4", "Chatbots, summarisers and classifiers using an LLM API and official docs."),
           step("Add RAG and tools", "Months 3–6", "Embeddings, vector databases, retrieval, function/tool calling and simple agents."),
           step("Evaluate and secure", "Months 5–7", "Test sets, measuring accuracy, prompt-injection risks, privacy and cost."),
           GIT_STEP, *JOB_STEPS],
    test_topics="Python coding and API basics",
    interview_topics="Prompt design, RAG architecture, evaluation, hallucinations, safety, cost/latency and your AI apps",
    assignment="Build a small RAG chatbot over given documents and report its accuracy",
    checklist=["You can write and iterate prompts with clear evaluation.", "You can build an LLM app with an API in code.",
               "You can implement basic RAG over documents.", "You measure accuracy and handle failure cases.", "You have 2–3 working AI apps with demos."],
    timeline=[("Python", "Month 1"), ("Prompting", "Months 1–2"), ("LLM APIs", "Months 2–4"), ("RAG + tools", "Months 3–6"), ("Evaluation + portfolio", "Months 5–8")],
    prep=[{"phase": "Basics", "duration": "Months 1–2", "focus": ["Python", "Prompting principles", "Small experiments"]},
          {"phase": "Build", "duration": "Months 2–6", "focus": ["LLM API apps", "RAG", "Tool use / agents"]},
          {"phase": "Get hired", "duration": "Months 6–8", "focus": ["Evaluation + safety", "2–3 demo apps", "Mock interviews"]}],
    resources=[{"label": "OpenAI — Prompt engineering guide", "url": "https://platform.openai.com/docs/guides/prompt-engineering", "note": "Official prompting guide."},
               {"label": "Anthropic — Claude Academy", "url": "https://www.anthropic.com/learn", "note": "Official learning to work and build with Claude."},
               {"label": "Microsoft — Generative AI for Beginners", "url": "https://github.com/microsoft/generative-ai-for-beginners", "note": "21-lesson open course."}],
    ladder=[["Start", "Junior AI Engineer / AI Developer", "0–2 years", "Prompts, integrations, evaluations"], ["Mid", "AI / LLM Engineer", "2–5 years", "Own AI features end to end"],
            ["Senior", "Senior AI Engineer", "5+ years", "Architecture, safety and platform"], ["Next", "AI Lead / Architect", "7+ years", "AI strategy and teams"]],
    special=["Most jobs want prompting plus coding — not prompting alone.", "Tools and model names change fast; principles (clear prompts, evaluation, RAG) last.",
             "Never put private or customer data into tools without permission."],
    mistakes=["Only collecting prompt tricks without building apps.", "No evaluation — just 'it looks good'.", "Ignoring prompt injection and data privacy."],
    faqs=[{"q": "Can I become a prompt engineer without coding?", "a": "Some content/ops roles use prompting without coding, but most AI engineering roles need Python or JavaScript."},
          {"q": "Which model should I learn?", "a": "Learn principles that work across models; practise with at least one major LLM API."}],
    related_items=[related("ml-engineer", "ML Engineer", "Train and deploy models"), related("data-scientist", "Data Scientist", "Data and modelling"),
                   related("backend-developer", "Backend Developer", "APIs around AI features")],
    institutes=[DLAI_PROMPT, MS_GENAI, CDAC_AI, IITM_DS],
    sources=_srcs(source("OpenAI — Prompt engineering", "https://platform.openai.com/docs/guides/prompt-engineering", "Official prompting guide."),
                  source("Anthropic — Claude Academy", "https://www.anthropic.com/learn", "Official Claude learning.")),
    group=GROUP,
)

BI_ANALYST = _guide(
    "power-bi-tableau-analyst", "Power BI / Tableau Analyst", "BI Analyst", "How to become a Power BI / Tableau Analyst",
    "A Power BI / Tableau analyst builds interactive dashboards and reports so managers can track performance and spot problems quickly.",
    duties=["Connect to data sources and clean data (Power Query / Tableau Prep)", "Build data models and measures (DAX in Power BI)",
            "Design clear, interactive dashboards", "Automate and schedule reports", "Manage access and security for reports"],
    postings=["Almost every industry that tracks sales, finance or operations", "Office, hybrid or remote"],
    facts=[fact("Education", "Any graduation works"), fact("Time to job-ready", "About 3–6 months (typical)"),
           fact("Core skills", "Excel, SQL basics, Power BI (DAX) or Tableau"), fact("Certifications", "Microsoft PL-300 · Tableau certifications"),
           fact("Job titles", "BI / Power BI / Tableau / Reporting Analyst"), fact("Hiring rounds", "Tool test → dashboard task → interview → HR"),
           fact("Good for", "Commerce, BBA and MIS executives upskilling"), fact("Portfolio", "3 public dashboards")],
    levels=[["Beginner", "Import data, build basic charts and filters"], ["Intermediate", "Data modelling, DAX measures / calculated fields, interactive dashboards"],
            ["Job-ready", "Performance, row-level security, design best practices and storytelling"]],
    steps=[step("Excel and data basics", "Month 1", "Pivot tables, charts and clean tabular data."),
           step("Pick Power BI or Tableau", "Months 1–3", "Power BI: Power Query, data model, DAX. Tableau: calculated fields, LOD basics, dashboards."),
           step("Learn SQL basics", "Months 2–3", "Most BI data comes from databases."),
           step("Design great dashboards", "Months 3–4", "Clear KPIs, layout, colour and storytelling for business users."),
           step("Get certified (optional)", "Months 4–5", "Microsoft PL-300 for Power BI or a Tableau certification."),
           *JOB_STEPS],
    test_topics="Excel, SQL basics and a BI tool test",
    interview_topics="DAX/calculated fields, data modelling (star schema), dashboard design, SQL and walkthrough of your dashboards",
    assignment="Build a dashboard from a sample dataset and explain the insights",
    checklist=["You can model data and write measures (DAX) or calculated fields.", "Your dashboards answer clear business questions.",
               "You understand security/sharing basics.", "You have 3 public dashboards.", "You can explain your design choices."],
    timeline=[("Excel", "Month 1"), ("Power BI or Tableau", "Months 1–3"), ("SQL basics", "Months 2–3"), ("Dashboard design", "Months 3–4"), ("Certification + portfolio", "Months 4–6")],
    prep=[{"phase": "Tool skills", "duration": "Months 1–3", "focus": ["Power BI/Tableau basics", "Data modelling", "SQL basics"]},
          {"phase": "Portfolio", "duration": "Months 3–5", "focus": ["3 dashboards", "Design best practices", "Optional certification"]},
          {"phase": "Get hired", "duration": "Months 5–6", "focus": ["Tool tests", "Explain dashboards", "Mock interviews"]}],
    resources=[{"label": "Microsoft Learn — Power BI training", "url": "https://learn.microsoft.com/en-us/training/powerplatform/power-bi", "note": "Free official training."},
               {"label": "Tableau — Certifications", "url": "https://www.tableau.com/learn/certification", "note": "Official Tableau certification paths."}],
    ladder=[["Start", "MIS / Reporting Analyst", "0–1 year", "Reports and dashboards"], ["Junior", "BI Analyst / Power BI Developer", "1–3 years", "Own dashboards and models"],
            ["Mid", "Senior BI Developer", "3–6 years", "Data models, governance"], ["Senior", "BI Lead / Analytics Manager", "6+ years", "BI strategy and teams"]],
    special=["Power BI is common in companies using Microsoft tools; Tableau in many analytics-heavy firms — check local job posts.",
             "Microsoft PL-300 must be renewed every 12 months (free online renewal)."],
    mistakes=["Beautiful dashboards that don't answer a question.", "Skipping data modelling and DAX basics.", "No SQL at all."],
    faqs=[{"q": "Power BI or Tableau?", "a": "Learn one deeply first; the concepts transfer. Check which tool appears more in jobs you want."},
          {"q": "Is certification required?", "a": "No, but PL-300 or a Tableau certification can help freshers get shortlisted."}],
    related_items=[related("data-analyst", "Data Analyst", "Broader analysis role"), related("sql-database-analyst", "SQL / Database Analyst", "Stronger SQL"),
                   related("business-analyst", "Business Analyst", "Requirements and decisions")],
    institutes=[MS_PL300, TABLEAU_CERT, GOOGLE_BI, GOOGLE_DA],
    sources=_srcs(source("Microsoft — Power BI Data Analyst Associate", "https://learn.microsoft.com/en-us/credentials/certifications/data-analyst-associate/", "PL-300 skills, exam and renewal."),
                  source("Tableau — Certification", "https://www.tableau.com/learn/certification", "Tableau certifications via Salesforce.")),
    group=GROUP,
)

SQL_ANALYST = _guide(
    "sql-database-analyst", "SQL / Database Analyst", "SQL Analyst", "How to become a SQL / Database Analyst",
    "A SQL / database analyst writes queries to pull, check and organise data from databases, and helps keep data accurate and fast to access.",
    duties=["Write SQL queries and reports for business teams", "Check data quality and fix inconsistencies", "Create views and stored procedures",
            "Help design tables and indexes", "Support analysts, developers and database administrators"],
    postings=["Banks, IT services, telecom, e-commerce and any data-heavy business", "Often a stepping stone to data engineering or DBA roles"],
    facts=[fact("Education", "Any graduation; BCA/BSc CS/IT helps"), fact("Time to job-ready", "About 3–6 months (typical)"),
           fact("Core skills", "SQL (joins, window functions), data modelling"), fact("Databases", "MySQL, PostgreSQL, SQL Server or Oracle"),
           fact("Job titles", "SQL Analyst / Database Analyst / MIS Analyst"), fact("Hiring rounds", "SQL test → technical → HR"),
           fact("Next steps", "Data engineer, DBA, data analyst"), fact("Portfolio", "Query sets + 1 database design project")],
    levels=[["Beginner", "SELECT, WHERE, ORDER BY, basic JOINs and aggregates"], ["Intermediate", "Subqueries, CTEs, window functions, views"],
            ["Job-ready", "Query performance (indexes), normalisation, stored procedures and data quality checks"]],
    steps=[step("Learn SQL basics", "Month 1", "Install MySQL/PostgreSQL or use SQL Server; practise SELECT, filters and JOINs."),
           step("Advanced SQL", "Months 2–3", "GROUP BY, subqueries, CTEs, window functions, CASE and date functions."),
           step("Database design", "Months 3–4", "Keys, normalisation, indexes, views and stored procedures."),
           step("Add a reporting tool", "Months 4–5", "Excel or Power BI to present query results."),
           GIT_STEP, *JOB_STEPS],
    test_topics="SQL query writing, database MCQs and aptitude",
    interview_topics="Joins, GROUP BY vs window functions, indexes, normalisation, query optimisation and real query scenarios",
    assignment="Write queries to answer business questions on a sample database",
    checklist=["You can write complex queries with joins, CTEs and window functions.", "You understand keys, normalisation and indexes.",
               "You can find and fix data quality problems.", "You have a portfolio of query problems and one database design.", "You can explain query performance basics."],
    timeline=[("SQL basics", "Month 1"), ("Advanced SQL", "Months 2–3"), ("Database design", "Months 3–4"), ("Reporting tool", "Months 4–5"), ("Portfolio + interviews", "Months 5–6")],
    prep=[{"phase": "SQL", "duration": "Months 1–3", "focus": ["Daily query practice", "Window functions", "CTEs"]},
          {"phase": "Databases", "duration": "Months 3–5", "focus": ["Design and normalisation", "Indexes", "Stored procedures"]},
          {"phase": "Get hired", "duration": "Months 5–6", "focus": ["SQL interview sets", "Portfolio", "Mock interviews"]}],
    resources=[{"label": "Microsoft Learn — Transact-SQL path", "url": "https://learn.microsoft.com/en-us/training/paths/get-started-querying-with-transact-sql/", "note": "Free 6-module SQL path."},
               {"label": "PostgreSQL tutorial (official docs)", "url": "https://www.postgresql.org/docs/current/tutorial.html", "note": "SQL and database basics."}],
    ladder=[["Start", "MIS / SQL Analyst", "0–1 year", "Queries and reports"], ["Junior", "Database Analyst / SQL Developer", "1–3 years", "Views, procedures, data quality"],
            ["Mid", "Data Engineer / Senior SQL Developer", "3–6 years", "Pipelines and performance"], ["Senior", "Database Architect / DBA Lead", "6+ years", "Design and governance"]],
    special=["SQL is a core skill for data analyst, BI, data engineering and backend roles — it keeps paying off.", "Practise on realistic datasets, not only small textbook tables."],
    mistakes=["Memorising syntax without solving real questions.", "Ignoring NULLs, duplicates and data quality.", "Not learning window functions."],
    faqs=[{"q": "Which database should I learn?", "a": "The SQL concepts are the same. PostgreSQL or MySQL are free to practise; SQL Server and Oracle are common in large companies."},
          {"q": "Is SQL enough for a job?", "a": "For SQL/MIS analyst roles it can be, with Excel or Power BI. Adding Python or a BI tool widens options."}],
    related_items=[related("data-analyst", "Data Analyst", "Analysis + dashboards"), related("power-bi-tableau-analyst", "Power BI / Tableau Analyst", "Dashboards"),
                   related("backend-developer", "Backend Developer", "Apps that use databases")],
    institutes=[MS_TSQL, IITM, GOOGLE_DA, IGNOU, CDAC_BDA],
    sources=_srcs(source("Microsoft Learn — Transact-SQL", "https://learn.microsoft.com/en-us/training/paths/get-started-querying-with-transact-sql/", "SQL learning path."),
                  source("PostgreSQL documentation", "https://www.postgresql.org/docs/current/tutorial.html", "SQL and database basics.")),
    group=GROUP,
)

GUIDES = [DATA_ANALYST, BUSINESS_ANALYST, DATA_SCIENTIST, ML_ENGINEER, AI_PROMPT, BI_ANALYST, SQL_ANALYST]

for _g in GUIDES:
    _srcs_list = _g["guideProfile"]["sources"]
    for _ins in _g["guideProfile"]["details"]["institutes"]:
        if _ins["url"] in _EXTRA_SOURCES and all(s["url"] != _ins["url"] for s in _srcs_list):
            _srcs_list.append(_EXTRA_SOURCES[_ins["url"]])

_BY_KEY = {slugify(k): g for g in GUIDES for k in (g["slug"], g["title"])}


def data_ai_guide(value):
    g = _BY_KEY.get(slugify(value or ""))
    return deepcopy(g) if g else None
