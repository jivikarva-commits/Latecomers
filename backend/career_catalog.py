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
        "Chartered Accountant CA", "CMA Cost Accountant", "Company Secretary CS", "ACCA", "CFA Analyst",
        "Stock Market Trader", "Investment Banker", "Financial Planner", "Mutual Fund Advisor",
        "GST Practitioner", "Income Tax Consultant", "SAP FICO Consultant", "Financial Modeler",
        "Business Analyst", "Economist", "Actuary", "Insurance Advisor", "Bank PO", "RBI Officer", "Auditor",
        "E-commerce Entrepreneur", "Supply Chain Manager", "Logistics Manager", "Import Export Specialist",
        "Retail Manager", "Tally Accountant",
    ],
    "Arts and Humanities": [
        "Lawyer", "Judge", "Judiciary Officer", "Political Scientist", "Sociologist", "Psychologist",
        "Counselor", "Social Worker", "Historian", "Archaeologist", "Philosopher", "Journalist",
        "News Anchor", "Content Writer", "Copywriter", "Author", "Poet", "Public Relations Officer",
        "HR Manager", "Teacher", "Professor", "School Counselor", "UPSC IAS Officer", "MPSC Officer",
        "Foreign Service Officer", "NGO Worker", "Translator", "Interpreter", "Tourism Manager", "Event Manager",
    ],
    "Creativity and Design": [
        "Graphic Designer", "UI UX Designer", "Product Designer", "Brand Identity Designer", "Packaging Designer",
        "Motion Graphics Artist", "Video Editor", "Film Director", "Cinematographer", "Photographer",
        "Drone Photographer", "Animator 2D", "Animator 3D", "VFX Artist", "CGI Artist", "Game Designer",
        "Game Developer", "Character Designer", "AR VR Developer", "Interior Designer", "Fashion Designer",
        "Jewellery Designer", "Industrial Designer", "Web Designer", "Illustration Artist", "Comic Artist",
        "Music Producer", "Sound Designer", "Podcast Creator", "YouTube Content Creator", "Instagram Influencer",
        "Reels Editor",
    ],
    "Business and Management": [
        "MBA Manager", "Marketing Manager", "Sales Manager", "Business Development Executive", "Product Manager",
        "Project Manager", "Operations Manager", "Startup Founder", "Entrepreneur", "E-commerce Seller",
        "Digital Marketing Manager", "Performance Marketer", "SEO Specialist", "Social Media Manager",
        "Affiliate Marketer", "CRM Specialist", "Brand Manager", "Customer Success Manager", "Franchise Owner",
        "Business Consultant", "Meta Ads Manager", "Google Ads Specialist", "Content Marketer",
        "Sales Professional", "Copywriter",
    ],
    "Technology": [
        "Full Stack Developer", "Frontend Developer", "Backend Developer", "MERN Stack Developer",
        "Python Developer", "Java Developer", "Android Developer", "iOS Developer", "Flutter Developer",
        "React Native Developer", "DevOps Engineer", "Cloud Architect", "AWS Solutions Architect",
        "Azure Engineer", "Kubernetes Engineer", "Docker Specialist", "Cybersecurity Analyst",
        "Ethical Hacker", "Penetration Tester", "SOC Analyst", "Network Engineer", "Database Administrator",
        "Blockchain Developer", "Web3 Developer", "Smart Contract Developer", "WordPress Developer",
        "Shopify Developer", "Technical Writer", "QA Engineer", "Prompt Engineer",
        "C CPP Developer", "DotNet Developer", "PHP Developer", "Linux Administrator",
    ],
    "Government and Defense": [
        "UPSC IAS Officer", "MPSC Officer", "Bank PO SBI IBPS", "RBI Grade B Officer", "SSC CGL Officer",
        "SSC CHSL", "Railway Officer RRB NTPC", "Defence Officer NDA CDS", "Police Officer PSI", "Talathi",
        "Intelligence Officer", "Customs Officer", "Forest Officer", "Municipal Corporation Officer",
        "Postal Department Officer",
    ],
    "Vocational and Skill": [
        "Electrician", "AC Refrigeration Technician", "Mobile Repair Technician", "CCTV Installation Technician",
        "Automobile Technician", "CNC Machine Operator", "Plumber", "Carpenter", "Welder",
        "Solar Panel Technician", "Lift Technician", "Fire Safety Officer", "Security Supervisor",
        "Housekeeping Manager",
    ],
    "Healthcare and Wellness": [
        "Yoga Instructor", "Fitness Trainer", "Personal Trainer", "Spa Therapist", "Makeup Artist",
        "Hair Stylist", "Nail Art Technician", "Beauty Salon Owner", "Ayurvedic Practitioner",
        "Homeopathy Doctor", "Meditation Coach", "Diet and Nutrition Coach",
        "Medical Biller",
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
        "App Developer Independent", "SaaS Founder",
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
    "Doctor MBBS": {"slug": "doctor-mbbs", "icon": "Stethoscope", "salary": (8, 30), "demand": "Very High", "growth": 10},
    "Chartered Accountant CA": {"slug": "chartered-accountant-ca", "icon": "Calculator", "salary": (7, 28), "demand": "High"},
    "Data Scientist": {"icon": "BarChart3", "salary": (12, 28), "demand": "Very High", "growth": 31},
    "AI ML Engineer": {"icon": "BrainCircuit", "salary": (10, 30), "demand": "Very High", "growth": 32},
    "Full Stack Developer": {"icon": "Code2", "salary": (6, 24), "demand": "Very High", "growth": 24},
    "Cybersecurity Analyst": {"icon": "Shield", "salary": (6, 18), "demand": "Very High", "growth": 26},
    "Lawyer": {"icon": "Scale", "salary": (5, 25), "demand": "Medium"},
    "Graphic Designer": {"icon": "Palette", "salary": (3, 14), "demand": "High"},
    "UI UX Designer": {"slug": "ui-ux-designer", "icon": "PenTool", "salary": (6, 20), "demand": "High"},
    "Pilot": {"icon": "Plane", "salary": (12, 60), "demand": "High"},
    "EV Technology Engineer": {"icon": "Zap", "salary": (6, 20), "demand": "Very High", "growth": 35},
    "Bug Bounty Hunter": {"icon": "Bug", "salary": (4, 30), "demand": "High", "growth": 28},
    "Malware Analyst": {"icon": "ShieldAlert", "salary": (6, 18), "demand": "High", "growth": 24},
    "Meta Ads Manager": {"icon": "Target", "salary": (4, 16), "demand": "High", "growth": 22},
    "Google Ads Specialist": {"icon": "Target", "salary": (4, 16), "demand": "High", "growth": 20},
    "Content Marketer": {"icon": "FileText", "salary": (3, 14), "demand": "High", "growth": 22},
    "C CPP Developer": {"slug": "c-cpp-developer", "icon": "Code2", "salary": (5, 20), "demand": "High", "growth": 12},
    "DotNet Developer": {"slug": "dotnet-developer", "icon": "Code2", "salary": (5, 22), "demand": "High", "growth": 14},
    "PHP Developer": {"icon": "Code2", "salary": (4, 16), "demand": "Medium", "growth": 8},
    "Linux Administrator": {"icon": "Terminal", "salary": (5, 16), "demand": "High", "growth": 15},
    "German Language Expert": {"icon": "Languages", "salary": (4, 15), "demand": "High"},
    "Japanese Language Expert": {"icon": "Languages", "salary": (5, 18), "demand": "Very High"},
    "Korean Language Expert": {"icon": "Languages", "salary": (4, 15), "demand": "High"},
    "Medical Biller": {"icon": "FileText", "salary": (3, 8), "demand": "High"},
    "Sales Professional": {"icon": "Handshake", "salary": (3, 18), "demand": "Very High", "growth": 15},
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
            career = {
                "career_id": f"career-{slug}",
                "title": title,
                "slug": slug,
                "icon": override.get("icon", meta["icon"]),
                "iconColor": meta["color"],
                "category": field,
                "field": field,
                "tags": _tags(title, field),
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
