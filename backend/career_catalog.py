"""Allowed career/course catalog for Latecomers AI."""
import re


def slugify(value: str) -> str:
    value = re.sub(r"&", " and ", value.lower())
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


FIELD_META = {
    "IT / Software / Tech": {"icon": "Code2", "color": "#2563EB"},
    "Data & AI": {"icon": "BarChart3", "color": "#7C3AED"},
    "Cybersecurity": {"icon": "Shield", "color": "#0F766E"},
    "Cloud & Infrastructure": {"icon": "Cloud", "color": "#0284C7"},
    "Design / Creative / Media": {"icon": "Palette", "color": "#DB2777"},
    "Animation / VFX / Gaming": {"icon": "Gamepad2", "color": "#9333EA"},
    "Photography & Film Making": {"icon": "Camera", "color": "#EA580C"},
    "Digital Marketing": {"icon": "Megaphone", "color": "#F97316"},
    "Finance / Commerce": {"icon": "Calculator", "color": "#16A34A"},
    "Government Exam": {"icon": "Landmark", "color": "#475569"},
    "Law & Management": {"icon": "Scale", "color": "#4F46E5"},
    "Language": {"icon": "Languages", "color": "#0891B2"},
    "Healthcare & Medical Allied": {"icon": "BriefcaseMedical", "color": "#DC2626"},
    "Aviation & Hospitality": {"icon": "Plane", "color": "#0369A1"},
    "Vocational / Skill": {"icon": "Wrench", "color": "#CA8A04"},
    "Beauty / Wellness": {"icon": "Sparkles", "color": "#E11D48"},
    "High-Income Freelance": {"icon": "Laptop", "color": "#059669"},
    "Emerging Technology": {"icon": "Rocket", "color": "#5B4FE9"},
}


COURSE_GROUPS = [
    ("IT / Software / Tech", [
        "Full Stack Development", "MERN Stack & MEAN Stack", "Frontend Development",
        "Backend Development", "Python Development", "Java Development", "C/C++",
        ".NET Development", "PHP Development", "Mobile App Development",
        "Android Development", "iOS Development", "Flutter Development", "React Native",
    ]),
    ("Data & AI", [
        "Data Analytics", "Data Science", "Business Analytics", "AI & Machine Learning",
        "Deep Learning", "Prompt Engineering", "Generative AI",
        "NLP (Natural Language Processing)", "Big Data", "Hadoop", "Power BI",
        "Tableau", "SQL", "Excel Analytics",
    ]),
    ("Cybersecurity", [
        "Ethical Hacking", "Penetration Testing", "SOC Analyst", "Network Security",
        "Cyber Forensics", "Cloud Security", "CEH Certification", "CompTIA Security+",
        "CISSP", "Bug Bounty Training", "Kali Linux", "SIEM Tools", "Malware Analysis",
    ]),
    ("Cloud & Infrastructure", [
        "AWS", "Microsoft Azure", "Google Cloud", "DevOps", "Docker", "Kubernetes",
        "Linux Administration", "System Administration", "Networking (CCNA/CCNP)",
    ]),
    ("Design / Creative / Media", [
        "Graphic & Visual Design", "UI/UX & Product Design", "Video & Motion",
    ]),
    ("Animation / VFX / Gaming", [
        "2D Animation", "3D Animation", "VFX", "CGI", "Game Design",
        "Game Development", "Unity", "Unreal Engine", "Character Design",
        "AR/VR Development",
    ]),
    ("Photography & Film Making", [
        "Photography", "Cinematography", "Film Making", "Direction", "Drone Photography",
    ]),
    ("Digital Marketing", ["Digital Marketing"]),
    ("Finance / Commerce", [
        "Tally", "GST Practitioner", "Income Tax", "SAP FICO", "Financial Modeling",
        "Investment Banking", "Stock Market Trading", "Mutual Fund Advisory",
        "CA Foundation Exam", "CMA Foundation Exam", "CS Executive Entrance Test (CSEET)",
        "Association of Chartered Certified Accountants (ACCA)",
        "Chartered Financial Analyst (CFA) Program",
    ]),
    ("Government Exam", [
        "Union Public Service Commission (UPSC) Civil Services Exam",
        "Maharashtra Public Service Commission (MPSC) Exam",
        "Banking Exam", "SSC Exam", "Railways Exam", "Defense Exam",
        "Police & State Exams",
    ]),
    ("Law & Management", [
        "CLAT", "Judiciary preparation", "LLB entrance", "Common Admission Test (CAT)",
        "MBA entrance", "XAT", "SNAP", "NMAT",
    ]),
    ("Language", [
        "German", "Japanese", "French", "Spanish", "Korean", "Mandarin Chinese",
        "Arabic", "Translator", "Interpreter", "BPO language specialist", "Embassy jobs",
        "Tourism", "Teaching",
    ]),
    ("Healthcare & Medical Allied", [
        "Nursing", "Physiotherapy", "Pharmacy", "Medical Coding", "Medical Billing",
        "Lab Technician", "Radiology", "Nutritionist",
    ]),
    ("Aviation & Hospitality", [
        "Cabin Crew", "Aviation Management", "Airport Ground Staff", "Hotel Management",
        "Cruise Line Training",
    ]),
    ("Vocational / Skill", [
        "Electrician", "AC Repair", "Mobile Repair", "CCTV Installation",
        "Automobile Technician", "CNC Machine Operator", "Interior Design",
    ]),
    ("Beauty / Wellness", [
        "Makeup Artist", "Hair Styling", "Nail Art", "Spa Therapy",
        "Fitness Trainer", "Yoga Instructor",
    ]),
    ("High-Income Freelance", [
        "Web Design", "WordPress Development", "Shopify Development",
        "Freelance Video Editing", "Freelance Copywriting", "SEO Freelancing",
    ]),
    ("Emerging Technology", [
        "Blockchain", "Crypto Analytics", "Web3 Development", "Drone Technology",
        "EV Technology", "Robotics", "IoT",
    ]),
]

PUBLIC_CATEGORY_ROLE_GROUPS = [
    ("IT / Software / Tech", [
        "Frontend Developer", "Backend Developer", "Full Stack Developer",
        "Android Developer", "iOS Developer", "Flutter Developer", "React Developer",
        "WordPress Developer", "Shopify Developer", "AI/Prompt Engineer",
        "Power BI / Tableau Analyst", "SQL / Database Analyst",
    ]),
    ("Data & AI", [
        "Data Analyst", "Business Analyst", "Data Scientist", "ML Engineer",
    ]),
    ("Cybersecurity", [
        "Ethical Hacker / Penetration Tester", "SOC Analyst (L1/L2)",
        "Network Security Engineer", "Cyber Forensics Analyst",
        "Cloud Security Engineer", "Bug Bounty Hunter",
    ]),
    ("Cloud & Infrastructure", [
        "Cloud Engineer (AWS/Azure/GCP)", "DevOps Engineer",
        "Linux / System Administrator", "Network Engineer (CCNA)",
        "Docker / Kubernetes Engineer",
    ]),
    ("Digital Marketing", [
        "SEO Specialist", "Performance Marketing Manager", "Social Media Manager",
        "Content Marketer / Strategist", "Copywriter", "Affiliate Marketer",
        "CRM Specialist", "Sales Executive / BDE", "Entrepreneur / Founder",
        "SEO Executive", "Social Media Executive",
    ]),
    ("Finance / Commerce", [
        "Accounts Executive (Tally/GST)", "GST Practitioner", "Income Tax Consultant",
        "Financial Analyst", "Investment Banker (Analyst)",
        "Stock Market Trader / Analyst", "Mutual Fund Advisor",
        "SAP FICO Consultant", "Financial Modeler", "CA (Chartered Accountant)",
        "CMA (Cost Accountant)", "CS (Company Secretary)", "ACCA", "CFA",
        "Tally Accountant",
    ]),
    ("Design / Creative / Media", [
        "Graphic Designer", "Brand Identity Designer", "Packaging Designer",
        "UI Designer", "UX Designer / Researcher", "Product Designer",
        "Video Editor", "Motion Graphics Designer", "Color Grading Artist",
        "Reels / Short Form Editor", "Commercial Photographer",
        "Cinematographer / DOP", "Film Director", "Drone Photographer / Videographer",
        "Photo/Video Editor", "Interior Design Assistant",
    ]),
    ("Animation / VFX / Gaming", [
        "2D / 3D Animator", "VFX Artist", "Game Designer",
        "Game Developer (Unity/Unreal)", "AR/VR Developer",
    ]),
    ("Government Exam", [
        "IAS / IPS / IFS Officer", "State Service Officer (DSP, BDO, Tahsildar)",
        "Probationary Officer (PO)", "RBI Grade B Officer", "Bank Clerk",
        "Inspector / Auditor / Examiner", "LDC / DEO / Postal Assistant",
        "Multi-Tasking Staff", "Junior Clerk / Station Master",
        "Track Maintainer / Helper", "Army / Navy / Air Force Officer (NDA/CDS)",
        "Short Service Commission (AFCAT)", "Police Sub Inspector",
        "Village Revenue Officer (Talathi)", "Police Constable",
        "Army Soldier (GD / Technical / Clerk)", "NDA Officer",
        "Postal / LIC / Bank Clerk", "Railway Helper / Technician",
        "Talathi / Revenue Clerk", "SSC MTS",
    ]),
    ("Law & Management", [
        "Lawyer / Advocate", "Corporate Lawyer", "Judge (Judiciary)",
        "MBA - Marketing Manager", "MBA - Finance Manager", "MBA - HR Manager",
        "MBA - Operations Manager",
    ]),
    ("Healthcare & Medical Allied", [
        "Nursing Officer / Staff Nurse", "Physiotherapist", "Medical Coder",
        "Medical Biller", "Lab Technician / DMLT", "Radiology Technician",
        "Nutritionist / Dietitian", "Pharmacist", "Lab Technician",
    ]),
    ("Language", [
        "Translator (Document/Legal/Technical)", "Interpreter (Live / Conference)",
        "Language Teacher / Trainer", "BPO Language Specialist",
        "Embassy / Consulate Staff", "Tourism & Travel Guide",
        "Subtitler / Dubbing Artist",
    ]),
    ("Aviation & Hospitality", [
        "Cabin Crew / Air Hostess", "Airport Ground Staff",
        "Aviation Operations Manager", "Hotel Front Office Executive",
        "F&B Manager", "Event Manager", "Cruise Line Hospitality Staff",
        "Cabin Crew", "Hotel Front Desk Staff",
    ]),
    ("Emerging Technology", [
        "Blockchain Developer", "Web3 Developer", "Drone Pilot / Operator",
        "EV Technician / Engineer", "IoT Engineer", "Robotics Engineer",
        "Drone Pilot",
    ]),
    ("Vocational / Skill", [
        "Data Entry Operator", "Electrician", "Mobile Repair Technician",
        "AC Repair Technician", "CCTV Installer", "Automobile Technician",
        "CNC Machine Operator",
    ]),
    ("Beauty / Wellness", [
        "Makeup Artist", "Mehendi Artist", "Hair Stylist",
        "Nail Art Technician", "Yoga Instructor", "Fitness Trainer",
    ]),
]

CATALOG_GROUPS = COURSE_GROUPS + PUBLIC_CATEGORY_ROLE_GROUPS


def _catalog_items():
    seen_slugs = set()
    items = []
    for field, titles in CATALOG_GROUPS:
        for title in titles:
            item_slug = slugify(title)
            if item_slug in seen_slugs:
                continue
            seen_slugs.add(item_slug)
            items.append((field, title))
    return items


CATALOG_ITEMS = _catalog_items()
ALLOWED_CAREER_TITLES = [title for _, title in CATALOG_ITEMS]
ALLOWED_CAREER_SLUGS = {slugify(title) for title in ALLOWED_CAREER_TITLES}


def _salary_for(field: str) -> dict:
    ranges = {
        "IT / Software / Tech": (4, 18),
        "Data & AI": (5, 22),
        "Cybersecurity": (4, 20),
        "Cloud & Infrastructure": (5, 22),
        "Design / Creative / Media": (3, 15),
        "Animation / VFX / Gaming": (3, 16),
        "Digital Marketing": (3, 14),
        "Finance / Commerce": (3, 20),
        "Government Exam": (3, 18),
        "Law & Management": (4, 22),
        "Healthcare & Medical Allied": (3, 12),
        "Aviation & Hospitality": (3, 12),
        "Vocational / Skill": (2, 10),
        "Beauty / Wellness": (2, 12),
        "High-Income Freelance": (3, 25),
        "Emerging Technology": (4, 22),
    }
    low, high = ranges.get(field, (3, 15))
    return {"min": low, "max": high}


def _career_doc(title: str, field: str, index: int) -> dict:
    meta = FIELD_META.get(field, FIELD_META["Emerging Technology"])
    salary = _salary_for(field)
    return {
        "career_id": f"career-{slugify(title)}",
        "slug": slugify(title),
        "title": title,
        "icon": meta["icon"],
        "iconColor": meta["color"],
        "category": field,
        "field": field,
        "tags": [field, "Course", "India"],
        "description": f"Explore {title} as a career path for Indian students with skills, roadmap, jobs, and salary guidance.",
        "shortDescription": f"Explore {title} with skills, roadmap, jobs, and salary guidance.",
        "avgSalary": salary,
        "avgSalaryMin": salary["min"],
        "avgSalaryMax": salary["max"],
        "jobGrowth5Y": 12 + (index % 14),
        "jobRoles": "8+",
        "totalJobRoles": 8,
        "demand": "High",
        "overview": f"{title} is a practical career/course path in India with growing demand for skilled learners.",
        "skills": [],
        "roadmap": [],
        "jobs": [],
        "insights": {},
    }


DYNAMIC_CAREERS = [
    _career_doc(title, field, index)
    for index, (field, title) in enumerate(CATALOG_ITEMS)
]
