"""Dynamic career catalog seed data for LATE COMERS AI."""
import re


FIELD_CAREERS = {
    "Science": [
        "Doctor MBBS", "Surgeon", "Dentist", "Pharmacist", "Nurse", "Physiotherapist", "Lab Technician",
        "Radiology Technician", "Medical Coder", "Nutritionist and Dietitian", "Veterinarian", "Biotechnologist",
        "Research Scientist", "Environmental Scientist", "Forensic Scientist", "Geologist", "Astronomer",
        "Physics Teacher", "Chemistry Teacher", "Civil Engineer", "Mechanical Engineer", "Electrical Engineer",
        "Electronics Engineer", "Chemical Engineer", "Aerospace Engineer", "Biomedical Engineer",
        "Agricultural Scientist", "Food Technologist", "AI ML Engineer", "Data Scientist", "Robotics Engineer",
        "EV Technician", "Drone Pilot", "IoT Engineer", "Nuclear Scientist",
    ],
    "Commerce": [
        "Chartered Accountant CA", "CMA Cost Accountant", "Company Secretary CS", "ACCA Professional", "CFA Analyst",
        "Stock Market Trader", "Investment Banker", "Financial Planner", "Mutual Fund Advisor",
        "GST Practitioner", "Income Tax Consultant", "SAP FICO Consultant", "Financial Modeler",
        "Business Analyst", "Economist", "Actuary", "Insurance Advisor", "Bank PO", "RBI Officer", "Auditor",
        "E-commerce Entrepreneur", "Supply Chain Manager", "Logistics Manager", "Import Export Specialist",
        "Retail Manager", "Tally Accountant",
    ],
    "Arts and Humanities": [
        "Lawyer", "CLAT Lawyer", "Judge", "Judiciary Officer", "Political Scientist", "Sociologist", "Psychologist",
        "Counselor", "Social Worker", "Historian", "Archaeologist", "Philosopher", "Journalist",
        "News Anchor", "Content Writer", "Copywriter", "Author", "Poet", "Public Relations Officer",
        "HR Manager", "Teacher", "Professor", "School Counselor", "UPSC IAS Officer", "MPSC Officer",
        "Foreign Service Officer", "NGO Worker", "Translator", "Interpreter", "Tourism Manager", "Event Manager",
    ],
    "Creativity and Design": [
        "Graphic Designer", "UI UX Designer", "UI Designer", "Product Designer", "Brand Identity Designer",
        "Packaging Designer", "Motion Graphics Artist", "Video Editor", "Film Director", "Cinematographer",
        "Photographer", "Drone Photographer", "Animator 2D", "3D Animator", "VFX Artist", "CGI Artist",
        "Game Designer", "Game Developer", "Character Designer", "AR VR Developer", "Interior Designer",
        "Fashion Designer", "Jewellery Designer", "Industrial Designer", "Web Designer", "Illustration Artist",
        "Comic Artist", "Music Producer", "Sound Designer", "Podcast Creator", "YouTube Content Creator",
        "Instagram Influencer", "Reels Editor",
    ],
    "Business and Management": [
        "MBA Manager", "Marketing Manager", "Sales Manager", "Business Development Executive", "Product Manager",
        "Project Manager", "Operations Manager", "Startup Founder", "Entrepreneur", "E-commerce Seller",
        "Digital Marketing Manager", "Performance Marketer", "SEO Specialist", "Social Media Manager",
        "Affiliate Marketer", "CRM Specialist", "Brand Manager", "Customer Success Manager", "Franchise Owner",
        "Business Consultant", "Meta Ads Manager", "Google Ads Specialist", "Content Marketer",
        "Sales Professional", "Copywriter", "Content Creator",
    ],
    "Technology": [
        "Full Stack Developer", "Frontend Developer", "Backend Developer", "MERN Stack Developer",
        "Python Developer", "Java Developer", "Android Developer", "iOS Developer", "Flutter Developer",
        "React Native Developer", "DevOps Engineer", "Cloud Architect", "AWS Solutions Architect",
        "Cloud Engineer", "Azure Engineer", "Kubernetes Engineer", "Docker Specialist", "Cybersecurity Analyst",
        "Ethical Hacker", "Penetration Tester", "SOC Analyst", "Network Engineer", "Network Security Engineer",
        "Database Administrator", "Blockchain Developer", "Web3 Developer", "Smart Contract Developer",
        "WordPress Developer", "Shopify Developer", "Technical Writer", "QA Engineer", "Prompt Engineer",
        "C CPP Developer", "DotNet Developer", "PHP Developer", "Linux Administrator",
        "Data Analyst", "SQL Developer", "Power BI Developer", "Tableau Developer",
        "Business Analytics Specialist", "Generative AI Specialist",
    ],
    "Government and Defense": [
        "UPSC IAS Officer", "MPSC Officer", "Bank PO SBI IBPS", "RBI Grade B Officer", "SSC CGL Officer",
        "SSC CHSL", "Railway Officer RRB NTPC", "Defence Officer NDA CDS", "Police Officer PSI", "Talathi",
        "Intelligence Officer", "Customs Officer", "Forest Officer", "Municipal Corporation Officer",
        "Postal Department Officer",
    ],
    "Vocational and Skill": [
        "Electrician", "AC Repair Technician", "Mobile Repair Technician", "CCTV Installation Technician",
        "Automobile Technician", "CNC Machine Operator", "Plumber", "Carpenter", "Welder",
        "Solar Panel Technician", "Lift Technician", "Fire Safety Officer", "Security Supervisor",
        "Housekeeping Manager",
    ],
    "Healthcare and Wellness": [
        "Yoga Instructor", "Fitness Trainer", "Personal Trainer", "Spa Therapist", "Makeup Artist",
        "Hair Stylist", "Nail Art Technician", "Beauty Salon Owner", "Ayurvedic Practitioner",
        "Homeopathy Doctor", "Meditation Coach", "Diet and Nutrition Coach",
        "Medical Biller", "Nutritionist",
    ],
    "Aviation and Hospitality": [
        "Cabin Crew", "Pilot", "Airport Ground Staff", "Aviation Manager", "Hotel Manager",
        "Restaurant Manager", "Chef", "Cruise Line Staff", "Travel Agent", "Tour Guide", "Event Planner",
        "Wedding Planner",
    ],
    "Emerging Technology": [
        "Metaverse Developer", "NFT Artist", "Crypto Analyst", "AI Prompt Engineer", "No-Code Developer",
        "Low-Code Developer", "Cybersecurity Consultant", "Data Privacy Officer", "Digital Forensics Expert",
        "Space Technology Engineer", "Quantum Computing Researcher",
        "EV Technology Engineer", "Bug Bounty Hunter", "Malware Analyst",
    ],
    "Freelance and Independent": [
        "Freelance Web Developer", "Freelance Graphic Designer", "Freelance Video Editor",
        "Freelance Copywriter", "Freelance SEO Consultant", "Freelance Social Media Manager", "Online Tutor",
        "Course Creator", "Drop Shipper", "Print on Demand Seller", "Amazon FBA Seller",
        "App Developer Independent", "SaaS Founder", "SEO Freelancer",
    ],
    "Language": [
        "German Language Expert", "Japanese Language Expert", "French Language Expert",
        "Spanish Language Expert", "Korean Language Expert", "Mandarin Chinese Expert",
        "Arabic Language Expert", "BPO Language Specialist",
    ],
}


FIELD_META = {
    "Science": {"icon": "Atom", "color": "#3B82F6", "salary": (5, 18), "growth": 16, "demand": "High"},
    "Commerce": {"icon": "Calculator", "color": "#0EA5E9", "salary": (5, 20), "growth": 14, "demand": "High"},
    "Arts and Humanities": {"icon": "BookOpen", "color": "#A855F7", "salary": (4, 15), "growth": 11, "demand": "Medium"},
    "Creativity and Design": {"icon": "Palette", "color": "#EC4899", "salary": (4, 18), "growth": 18, "demand": "High"},
    "Business and Management": {"icon": "BriefcaseBusiness", "color": "#F97316", "salary": (6, 24), "growth": 17, "demand": "High"},
    "Technology": {"icon": "Code2", "color": "#22C55E", "salary": (6, 28), "growth": 24, "demand": "Very High"},
    "Government and Defense": {"icon": "Landmark", "color": "#64748B", "salary": (4, 16), "growth": 8, "demand": "High"},
    "Vocational and Skill": {"icon": "Wrench", "color": "#F59E0B", "salary": (2.5, 9), "growth": 15, "demand": "High"},
    "Healthcare and Wellness": {"icon": "HeartPulse", "color": "#EF4444", "salary": (3, 14), "growth": 18, "demand": "High"},
    "Aviation and Hospitality": {"icon": "Plane", "color": "#14B8A6", "salary": (3.5, 18), "growth": 13, "demand": "Medium"},
    "Emerging Technology": {"icon": "Sparkles", "color": "#5B4FE9", "salary": (7, 32), "growth": 30, "demand": "Very High"},
    "Freelance and Independent": {"icon": "Rocket", "color": "#8B5CF6", "salary": (2, 40), "growth": 28, "demand": "High"},
    "Language": {"icon": "Languages", "color": "#0891B2", "salary": (3, 15), "growth": 18, "demand": "High"},
}


TITLE_OVERRIDES = {
    # ─── Science ───
    "Doctor MBBS": {"slug": "doctor-mbbs", "icon": "Stethoscope", "salary": (8, 30), "demand": "Very High", "growth": 10},
    "Data Scientist": {"icon": "BarChart3", "salary": (10, 28), "demand": "Very High", "growth": 31, "tags": ["Python", "ML", "Analytics"]},
    "AI ML Engineer": {"icon": "BrainCircuit", "salary": (12, 35), "demand": "Very High", "growth": 35, "tags": ["AI", "Machine Learning", "Python"]},
    "Robotics Engineer": {"icon": "Bot", "salary": (6, 20), "demand": "High", "growth": 25, "tags": ["Robotics", "Engineering", "AI"]},
    "Nurse": {"icon": "HeartPulse", "salary": (3, 10), "demand": "High", "growth": 15, "tags": ["Nursing", "Healthcare", "Hospital"]},
    "Physiotherapist": {"icon": "HeartPulse", "salary": (3, 12), "demand": "High", "growth": 18, "tags": ["Physio", "Therapy", "Healthcare"]},
    "Medical Coder": {"icon": "FileText", "salary": (3, 10), "demand": "High", "growth": 20, "tags": ["Medical", "Coding", "ICD"]},

    # ─── Commerce / Finance ───
    "Chartered Accountant CA": {"slug": "chartered-accountant-ca", "icon": "Calculator", "salary": (7, 28), "demand": "High"},
    "ACCA Professional": {"slug": "acca-professional", "icon": "Calculator", "salary": (6, 20), "demand": "High", "growth": 18, "tags": ["ACCA", "Finance", "International"]},
    "CFA Analyst": {"icon": "TrendingUp", "salary": (10, 30), "demand": "High", "growth": 20, "tags": ["CFA", "Investment", "Finance"]},
    "GST Practitioner": {"icon": "Calculator", "salary": (3, 12), "demand": "High", "growth": 18, "tags": ["GST", "Tax", "Finance"]},
    "Income Tax Consultant": {"icon": "Calculator", "salary": (4, 15), "demand": "High", "growth": 16, "tags": ["Income Tax", "Finance", "Consulting"]},
    "SAP FICO Consultant": {"icon": "Database", "salary": (8, 25), "demand": "High", "growth": 18, "tags": ["SAP", "Finance", "ERP"]},
    "Financial Modeler": {"icon": "LineChart", "salary": (8, 25), "demand": "High", "growth": 20, "tags": ["Excel", "Finance", "Modeling"]},
    "Tally Accountant": {"icon": "Calculator", "salary": (2, 8), "demand": "High", "growth": 12, "tags": ["Tally", "Accounts", "Finance"]},

    # ─── Arts / Law ───
    "Lawyer": {"icon": "Scale", "salary": (5, 25), "demand": "Medium"},
    "CLAT Lawyer": {"slug": "clat-lawyer", "icon": "Scale", "salary": (5, 25), "demand": "Medium", "growth": 11, "tags": ["Law", "CLAT", "Legal"]},

    # ─── Creativity and Design ───
    "Graphic Designer": {"icon": "Palette", "salary": (3, 14), "demand": "High", "growth": 18, "tags": ["Design", "Photoshop", "Illustrator"]},
    "UI UX Designer": {"slug": "ui-ux-designer", "icon": "PenTool", "salary": (6, 20), "demand": "High"},
    "UI Designer": {"slug": "ui-designer", "icon": "PenTool", "salary": (5, 18), "demand": "High", "growth": 20, "tags": ["UI", "Figma", "Design"]},
    "Video Editor": {"icon": "Video", "salary": (4, 15), "demand": "High", "growth": 22, "tags": ["Video", "Premiere Pro", "Editing"]},
    "Photographer": {"icon": "Camera", "salary": (3, 15), "demand": "Medium", "growth": 15, "tags": ["Photography", "Camera", "Editing"]},
    "Cinematographer": {"icon": "Video", "salary": (4, 20), "demand": "Medium", "growth": 15, "tags": ["Film", "Camera", "Direction"]},
    "Game Designer": {"icon": "Gamepad2", "salary": (5, 18), "demand": "High", "growth": 22, "tags": ["Game", "Unity", "Design"]},
    "VFX Artist": {"icon": "Sparkles", "salary": (5, 18), "demand": "High", "growth": 20, "tags": ["VFX", "CGI", "After Effects"]},
    "Drone Photographer": {"icon": "Camera", "salary": (4, 15), "demand": "High", "growth": 20, "tags": ["Drone", "Photography", "Aerial"]},
    "Character Designer": {"icon": "Palette", "salary": (4, 15), "demand": "High", "growth": 18, "tags": ["Character", "Animation", "Design"]},
    "3D Animator": {"slug": "3d-animator", "icon": "Box", "salary": (5, 18), "demand": "High", "growth": 20, "tags": ["3D", "Animation", "Maya"]},
    "Interior Designer": {"icon": "Home", "salary": (4, 15), "demand": "High", "growth": 20, "tags": ["Interior", "Design", "Space"]},

    # ─── Business and Marketing ───
    "MBA Manager": {"icon": "BriefcaseBusiness", "salary": (8, 30), "demand": "High", "growth": 18, "tags": ["MBA", "Management", "Business"]},
    "Performance Marketer": {"icon": "Target", "salary": (5, 18), "demand": "High", "growth": 25, "tags": ["Meta Ads", "Google Ads", "ROI"]},
    "SEO Specialist": {"icon": "Search", "salary": (4, 15), "demand": "High", "growth": 20, "tags": ["SEO", "Marketing", "Google"]},
    "Social Media Manager": {"icon": "Share2", "salary": (4, 15), "demand": "High", "growth": 22, "tags": ["Social Media", "Marketing", "Content"]},
    "Content Creator": {"slug": "content-creator", "icon": "Video", "salary": (3, 50), "demand": "Very High", "growth": 35, "tags": ["Content", "YouTube", "Reels"]},
    "Affiliate Marketer": {"icon": "Link", "salary": (3, 20), "demand": "High", "growth": 25, "tags": ["Affiliate", "Marketing", "Online"]},
    "Meta Ads Manager": {"icon": "Target", "salary": (4, 16), "demand": "High", "growth": 22},
    "Google Ads Specialist": {"icon": "Target", "salary": (4, 16), "demand": "High", "growth": 20},
    "Content Marketer": {"icon": "FileText", "salary": (3, 14), "demand": "High", "growth": 22},
    "Sales Professional": {"icon": "Handshake", "salary": (3, 18), "demand": "Very High", "growth": 15},

    # ─── Technology ───
    "Full Stack Developer": {"icon": "Code2", "salary": (8, 25), "demand": "Very High", "growth": 25, "tags": ["Coding", "Web", "JavaScript"]},
    "MERN Stack Developer": {"icon": "Code2", "salary": (8, 22), "demand": "Very High", "growth": 25, "tags": ["MongoDB", "React", "Node"]},
    "Frontend Developer": {"icon": "Monitor", "salary": (6, 20), "demand": "High", "growth": 22, "tags": ["React", "CSS", "JavaScript"]},
    "Backend Developer": {"icon": "Server", "salary": (7, 22), "demand": "High", "growth": 22, "tags": ["Node", "API", "Database"]},
    "Java Developer": {"icon": "Code2", "salary": (7, 22), "demand": "High", "growth": 20, "tags": ["Java", "Spring", "Backend"]},
    "Android Developer": {"icon": "Smartphone", "salary": (7, 22), "demand": "High", "growth": 20, "tags": ["Android", "Kotlin", "Mobile"]},
    "iOS Developer": {"icon": "Smartphone", "salary": (8, 25), "demand": "High", "growth": 20, "tags": ["Swift", "iOS", "Mobile"]},
    "Flutter Developer": {"icon": "Smartphone", "salary": (7, 20), "demand": "High", "growth": 22, "tags": ["Flutter", "Dart", "Mobile"]},
    "React Native Developer": {"icon": "Smartphone", "salary": (7, 20), "demand": "High", "growth": 22, "tags": ["React Native", "Mobile", "JavaScript"]},
    "DotNet Developer": {"slug": "dotnet-developer", "icon": "Code2", "salary": (6, 18), "demand": "High", "growth": 18, "tags": [".NET", "C#", "Microsoft"]},
    "PHP Developer": {"icon": "Code2", "salary": (5, 15), "demand": "Medium", "growth": 15, "tags": ["PHP", "Laravel", "Web"]},
    "C CPP Developer": {"slug": "c-cpp-developer", "icon": "Code2", "salary": (6, 18), "demand": "High", "growth": 16, "tags": ["C", "C++", "Systems"]},
    "DevOps Engineer": {"icon": "GitBranch", "salary": (10, 28), "demand": "Very High", "growth": 26, "tags": ["DevOps", "CI/CD", "Docker"]},
    "AWS Solutions Architect": {"icon": "Cloud", "salary": (10, 30), "demand": "Very High", "growth": 28, "tags": ["AWS", "Cloud", "Architecture"]},
    "Cloud Engineer": {"slug": "cloud-engineer", "icon": "Cloud", "salary": (10, 28), "demand": "Very High", "growth": 25, "tags": ["Cloud", "Azure", "GCP"]},
    "Kubernetes Engineer": {"icon": "Container", "salary": (12, 30), "demand": "High", "growth": 28, "tags": ["Kubernetes", "Docker", "Cloud"]},
    "Cybersecurity Analyst": {"icon": "Shield", "salary": (6, 18), "demand": "High", "growth": 24, "tags": ["Security", "Network", "SOC"]},
    "Ethical Hacker": {"icon": "ShieldAlert", "salary": (6, 20), "demand": "Very High", "growth": 28, "tags": ["Hacking", "Security", "Kali Linux"]},
    "Penetration Tester": {"icon": "ShieldAlert", "salary": (8, 22), "demand": "High", "growth": 28, "tags": ["PenTest", "Security", "Hacking"]},
    "SOC Analyst": {"icon": "Shield", "salary": (5, 15), "demand": "High", "growth": 25, "tags": ["SOC", "Security", "Monitoring"]},
    "Network Security Engineer": {"slug": "network-security-engineer", "icon": "Shield", "salary": (6, 18), "demand": "High", "growth": 22, "tags": ["Network", "Security", "Firewall"]},
    "Blockchain Developer": {"icon": "Link", "salary": (10, 30), "demand": "High", "growth": 35, "tags": ["Blockchain", "Web3", "Crypto"]},
    "Web3 Developer": {"icon": "Globe", "salary": (10, 30), "demand": "High", "growth": 35, "tags": ["Web3", "Blockchain", "Crypto"]},
    "WordPress Developer": {"icon": "Globe", "salary": (3, 15), "demand": "High", "growth": 18, "tags": ["WordPress", "Web", "Freelance"]},
    "Shopify Developer": {"icon": "ShoppingCart", "salary": (4, 18), "demand": "High", "growth": 22, "tags": ["Shopify", "E-commerce", "Web"]},
    "Prompt Engineer": {"icon": "MessageSquare", "salary": (8, 25), "demand": "Very High", "growth": 40, "tags": ["AI", "Prompting", "GenAI"]},
    "Generative AI Specialist": {"slug": "generative-ai-specialist", "icon": "BrainCircuit", "salary": (12, 30), "demand": "Very High", "growth": 45, "tags": ["GenAI", "LLM", "AI"]},
    "Data Analyst": {"slug": "data-analyst", "icon": "BarChart3", "salary": (5, 15), "demand": "Very High", "growth": 25, "tags": ["SQL", "Excel", "Analytics"]},
    "SQL Developer": {"slug": "sql-developer", "icon": "Database", "salary": (5, 15), "demand": "High", "growth": 18, "tags": ["SQL", "Database", "Analytics"]},
    "Power BI Developer": {"slug": "power-bi-developer", "icon": "BarChart3", "salary": (6, 18), "demand": "High", "growth": 22, "tags": ["Power BI", "Data", "Visualization"]},
    "Tableau Developer": {"slug": "tableau-developer", "icon": "BarChart3", "salary": (6, 18), "demand": "High", "growth": 20, "tags": ["Tableau", "Data", "Visualization"]},
    "Business Analytics Specialist": {"slug": "business-analytics-specialist", "icon": "LineChart", "salary": (7, 20), "demand": "High", "growth": 22, "tags": ["Analytics", "Business", "Data"]},
    "Linux Administrator": {"icon": "Terminal", "salary": (5, 16), "demand": "High", "growth": 15},

    # ─── Government ───
    "UPSC IAS Officer": {"slug": "upsc-ias-officer", "icon": "Landmark", "salary": (7, 20), "demand": "High", "growth": 8, "tags": ["UPSC", "IAS", "Government"]},
    "MPSC Officer": {"slug": "mpsc-officer", "icon": "Landmark", "salary": (5, 15), "demand": "High", "growth": 8, "tags": ["MPSC", "Maharashtra", "Government"]},
    "SSC CGL Officer": {"slug": "ssc-cgl-officer", "icon": "Landmark", "salary": (4, 12), "demand": "High", "growth": 6, "tags": ["SSC", "Government", "CGL"]},
    "Railway Officer RRB NTPC": {"slug": "railway-officer", "icon": "Train", "salary": (4, 12), "demand": "High", "growth": 6, "tags": ["Railways", "Government", "RRB"]},
    "Defence Officer NDA CDS": {"slug": "defence-officer", "icon": "Shield", "salary": (7, 18), "demand": "High", "growth": 8, "tags": ["NDA", "CDS", "Defence"]},
    "Police Officer PSI": {"slug": "police-officer-psi", "icon": "Shield", "salary": (4, 10), "demand": "High", "growth": 6, "tags": ["Police", "PSI", "Government"]},

    # ─── Vocational ───
    "Electrician": {"icon": "Zap", "salary": (2, 8), "demand": "High", "growth": 15, "tags": ["Electrical", "Skill", "Vocational"]},
    "AC Repair Technician": {"slug": "ac-repair-technician", "icon": "Wrench", "salary": (2, 8), "demand": "High", "growth": 15, "tags": ["AC", "Repair", "Vocational"]},
    "Mobile Repair Technician": {"icon": "Smartphone", "salary": (2, 8), "demand": "High", "growth": 18, "tags": ["Mobile", "Repair", "Skill"]},
    "Automobile Technician": {"icon": "Car", "salary": (2, 8), "demand": "High", "growth": 15, "tags": ["Auto", "Mechanic", "Skill"]},

    # ─── Healthcare and Wellness / Beauty ───
    "Nutritionist": {"slug": "nutritionist", "icon": "Apple", "salary": (3, 12), "demand": "High", "growth": 18, "tags": ["Nutrition", "Diet", "Health"]},
    "Makeup Artist": {"icon": "Palette", "salary": (3, 15), "demand": "High", "growth": 20, "tags": ["Makeup", "Beauty", "Wellness"]},
    "Hair Stylist": {"icon": "Scissors", "salary": (3, 12), "demand": "High", "growth": 18, "tags": ["Hair", "Styling", "Beauty"]},
    "Fitness Trainer": {"icon": "Dumbbell", "salary": (3, 12), "demand": "High", "growth": 22, "tags": ["Fitness", "Gym", "Trainer"]},
    "Yoga Instructor": {"icon": "HeartPulse", "salary": (3, 10), "demand": "High", "growth": 20, "tags": ["Yoga", "Wellness", "Instructor"]},
    "Medical Biller": {"icon": "FileText", "salary": (3, 8), "demand": "High"},

    # ─── Aviation and Hospitality ───
    "Pilot": {"icon": "Plane", "salary": (12, 60), "demand": "High"},
    "Cabin Crew": {"icon": "Plane", "salary": (4, 15), "demand": "High", "growth": 18, "tags": ["Aviation", "Cabin", "Airlines"]},
    "Hotel Manager": {"icon": "Building", "salary": (5, 18), "demand": "High", "growth": 16, "tags": ["Hotel", "Hospitality", "Management"]},
    "Airport Ground Staff": {"icon": "Plane", "salary": (3, 10), "demand": "High", "growth": 15, "tags": ["Airport", "Aviation", "Ground"]},

    # ─── Emerging Technology ───
    "EV Technology Engineer": {"icon": "Zap", "salary": (6, 20), "demand": "Very High", "growth": 35},
    "Bug Bounty Hunter": {"icon": "Bug", "salary": (4, 20), "demand": "High", "growth": 30, "tags": ["Hacking", "Bug Bounty", "Security"]},
    "Malware Analyst": {"icon": "ShieldAlert", "salary": (6, 18), "demand": "High", "growth": 24},

    # ─── Freelance ───
    "Freelance Copywriter": {"slug": "freelance-copywriter", "icon": "PenTool", "salary": (3, 15), "demand": "High", "growth": 20, "tags": ["Copywriting", "Freelance", "Content"]},
    "SEO Freelancer": {"slug": "seo-freelancer", "icon": "Search", "salary": (3, 15), "demand": "High", "growth": 20, "tags": ["SEO", "Freelance", "Marketing"]},

    # ─── Language ───
    "German Language Expert": {"icon": "Languages", "salary": (4, 15), "demand": "High", "growth": 18, "tags": ["German", "Language", "Translation"]},
    "Japanese Language Expert": {"icon": "Languages", "salary": (4, 15), "demand": "High", "growth": 18, "tags": ["Japanese", "Language", "Translation"]},
    "French Language Expert": {"icon": "Languages", "salary": (4, 15), "demand": "Medium", "growth": 15, "tags": ["French", "Language", "Translation"]},
    "Korean Language Expert": {"icon": "Languages", "salary": (4, 15), "demand": "High", "growth": 20, "tags": ["Korean", "Language", "Translation"]},
    "Arabic Language Expert": {"icon": "Languages", "salary": (5, 18), "demand": "High", "growth": 18, "tags": ["Arabic", "Language", "Translation"]},
    "BPO Language Specialist": {"icon": "Headphones", "salary": (3, 10), "demand": "High", "growth": 15, "tags": ["BPO", "Language", "Communication"]},
}


def slugify(title: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")


def _tags(title: str, field: str):
    words = [w for w in re.split(r"\s+", title.replace("-", " ")) if len(w) > 2]
    tags = [field.split(" and ")[0], *words[:2]]
    return list(dict.fromkeys(tags))[:4]


def build_dynamic_careers():
    careers = []
    seen = set()
    for field, titles in FIELD_CAREERS.items():
        meta = FIELD_META[field]
        for title in titles:
            override = TITLE_OVERRIDES.get(title, {})
            slug = override.get("slug") or slugify(title)
            if slug in seen:
                continue
            seen.add(slug)
            salary_min, salary_max = override.get("salary", meta["salary"])
            growth = override.get("growth", meta["growth"])
            demand = override.get("demand", meta["demand"])
            tags = override.get("tags") or _tags(title, field)
            career = {
                "career_id": f"career-{slug}",
                "title": title,
                "slug": slug,
                "icon": override.get("icon", meta["icon"]),
                "iconColor": meta["color"],
                "category": field,
                "field": field,
                "tags": tags,
                "shortDescription": f"Explore {title} as a career path for Indian students with skills, roadmap, jobs, and salary guidance.",
                "description": f"Explore {title} as a career path for Indian students with skills, roadmap, jobs, and salary guidance.",
                "avgSalaryMin": salary_min,
                "avgSalaryMax": salary_max,
                "avgSalary": {"min": salary_min, "max": salary_max},
                "jobGrowth5Y": growth,
                "demand": demand,
                "totalJobRoles": 8,
                "jobRoles": "8+",
                "detailsGeneratedByAI": False,
                "detailsCachedAt": None,
                "aiGeneratedDetails": None,
                "overview": f"{title} is a career in {field} with growing opportunities across India.",
                "skills": [],
                "roadmap": [],
                "jobs": [],
                "insights": {},
            }
            careers.append(career)
    return careers


DYNAMIC_CAREERS = build_dynamic_careers()
