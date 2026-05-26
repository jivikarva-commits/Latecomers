"""Seed data: careers, colleges, scholarships, career test questions."""
from career_catalog import DYNAMIC_CAREERS

REMOVED_CAREER_SLUGS = [
    "doctor",
    "doctor-mbbs",
    "dentist",
    "surgeon",
    "pharmacist",
    "civil-engineer",
    "nurse",
    "physiotherapist",
    "veterinarian",
    "veterinary-doctor",
    "optometrist",
    "occupational-therapist",
    "speech-therapist",
    "audiologist",
    "paramedic",
    "homeopathic-doctor",
    "ayurvedic-doctor",
    "unani-practitioner",
]

CAREERS = [
    {
        "career_id": "c1", "slug": "data-scientist", "title": "Data Scientist",
        "icon": "BarChart3", "iconColor": "#5B4FE9",
        "description": "Analyze complex data and build insights that drive smarter business decisions.",
        "tags": ["Analytics", "Problem Solving", "Programming"],
        "avgSalary": {"min": 12, "max": 28}, "jobGrowth5Y": 31, "jobRoles": "18+",
        "demand": "Very High",
        "overview": "Data Scientists turn raw data into actionable insights using statistics, ML and business sense. India's data economy is exploding — every major firm needs them.",
        "skills": [
            {"name": "Python", "importance": 95, "status": "Essential"},
            {"name": "Statistics & Probability", "importance": 90, "status": "Essential"},
            {"name": "SQL", "importance": 85, "status": "Essential"},
            {"name": "Machine Learning", "importance": 88, "status": "Essential"},
            {"name": "Data Visualization", "importance": 75, "status": "Important"},
            {"name": "Communication", "importance": 70, "status": "Important"},
        ],
        "roadmap": [
            {"stageNum": 1, "title": "Explore", "duration": "1-2 months", "description": "Discover what data science is about", "skills": ["Python basics", "Statistics intuition"]},
            {"stageNum": 2, "title": "Learn", "duration": "6-9 months", "description": "Build core skills", "skills": ["Pandas/NumPy", "ML algorithms", "SQL"]},
            {"stageNum": 3, "title": "Prepare", "duration": "3-4 months", "description": "Portfolio & interviews", "skills": ["Kaggle projects", "Resume", "DSA basics"]},
            {"stageNum": 4, "title": "Achieve", "duration": "Ongoing", "description": "Land role & grow", "skills": ["Domain expertise", "MLOps", "Leadership"]},
        ],
        "jobs": [
            {"level": "Entry", "title": "Junior Data Analyst", "desc": "Reporting + dashboards", "salaryMin": 4, "salaryMax": 8},
            {"level": "Mid", "title": "Data Scientist", "desc": "Build ML models for business", "salaryMin": 12, "salaryMax": 22},
            {"level": "Senior", "title": "Senior Data Scientist", "desc": "Lead complex projects", "salaryMin": 20, "salaryMax": 35},
            {"level": "Lead", "title": "Principal Data Scientist", "desc": "Strategy & teams", "salaryMin": 35, "salaryMax": 60},
        ],
        "insights": {
            "globalDemand": "Very High", "openPositions": "32,000+",
            "topIndustries": ["Tech", "Finance", "Healthcare", "Retail"],
            "aiTools": ["Pandas", "Scikit-learn", "TensorFlow", "PyTorch", "Tableau"],
        },
    },
    {
        "career_id": "c2", "slug": "ux-designer", "title": "UX Designer",
        "icon": "Pen", "iconColor": "#3B82F6",
        "description": "Design meaningful experiences that solve real user problems.",
        "tags": ["Design", "Creativity", "User Research"],
        "avgSalary": {"min": 6, "max": 18}, "jobGrowth5Y": 20, "jobRoles": "15+", "demand": "High",
        "overview": "UX Designers craft intuitive product experiences. India's product startup boom needs UX talent across fintech, edtech and SaaS.",
        "skills": [
            {"name": "Figma", "importance": 95, "status": "Essential"},
            {"name": "User Research", "importance": 90, "status": "Essential"},
            {"name": "Wireframing", "importance": 85, "status": "Essential"},
            {"name": "Prototyping", "importance": 80, "status": "Important"},
            {"name": "Design Systems", "importance": 75, "status": "Important"},
            {"name": "Visual Design", "importance": 70, "status": "Important"},
        ],
        "roadmap": [],
        "jobs": [
            {"level": "Entry", "title": "Junior UX Designer", "desc": "Wireframes & support", "salaryMin": 4, "salaryMax": 7},
            {"level": "Mid", "title": "UX Designer", "desc": "Own product flows", "salaryMin": 8, "salaryMax": 15},
            {"level": "Senior", "title": "Senior UX Designer", "desc": "Lead design strategy", "salaryMin": 15, "salaryMax": 25},
        ],
        "insights": {"globalDemand": "High", "openPositions": "18,000+", "topIndustries": ["Tech", "E-commerce", "Banking"], "aiTools": ["Figma", "Sketch", "Adobe XD", "Maze"]},
    },
    {
        "career_id": "c3", "slug": "software-developer", "title": "Software Developer",
        "icon": "Code2", "iconColor": "#22C55E",
        "description": "Build applications and systems that power the digital world.",
        "tags": ["Coding", "Logic", "Problem Solving"],
        "avgSalary": {"min": 8, "max": 20}, "jobGrowth5Y": 22, "jobRoles": "20+", "demand": "High",
        "overview": "The backbone of every tech company. From startups to MNCs, software developers are in massive demand across India.",
        "skills": [
            {"name": "Data Structures & Algorithms", "importance": 95, "status": "Essential"},
            {"name": "JavaScript / Python / Java", "importance": 90, "status": "Essential"},
            {"name": "Git & Collaboration", "importance": 80, "status": "Essential"},
            {"name": "Databases", "importance": 75, "status": "Important"},
            {"name": "System Design", "importance": 70, "status": "Important"},
        ],
        "roadmap": [],
        "jobs": [
            {"level": "Entry", "title": "SDE-1", "desc": "Build features under guidance", "salaryMin": 6, "salaryMax": 12},
            {"level": "Mid", "title": "SDE-2", "desc": "Own modules end-to-end", "salaryMin": 15, "salaryMax": 28},
            {"level": "Senior", "title": "SDE-3 / Tech Lead", "desc": "Lead system design", "salaryMin": 30, "salaryMax": 60},
        ],
        "insights": {"globalDemand": "Very High", "openPositions": "1,20,000+", "topIndustries": ["IT Services", "Product", "Fintech"], "aiTools": ["VSCode", "GitHub Copilot", "Docker"]},
    },
    {
        "career_id": "c4", "slug": "product-manager", "title": "Product Manager",
        "icon": "Megaphone", "iconColor": "#F97316",
        "description": "Lead product vision, strategy and execution across teams.",
        "tags": ["Leadership", "Strategy", "Communication"],
        "avgSalary": {"min": 15, "max": 32}, "jobGrowth5Y": 27, "jobRoles": "12+", "demand": "Very High",
        "overview": "PMs sit at the intersection of business, design and engineering. India's product economy makes this one of the hottest roles.",
        "skills": [
            {"name": "Product Strategy", "importance": 95, "status": "Essential"},
            {"name": "Communication", "importance": 90, "status": "Essential"},
            {"name": "Analytical Thinking", "importance": 85, "status": "Essential"},
            {"name": "User Empathy", "importance": 80, "status": "Important"},
        ],
        "roadmap": [], "jobs": [
            {"level": "Entry", "title": "Associate PM", "desc": "Own small features", "salaryMin": 12, "salaryMax": 20},
            {"level": "Mid", "title": "Product Manager", "desc": "Own product area", "salaryMin": 22, "salaryMax": 40},
            {"level": "Senior", "title": "Senior PM / Lead", "desc": "Org-wide strategy", "salaryMin": 40, "salaryMax": 80},
        ],
        "insights": {"globalDemand": "Very High", "openPositions": "12,000+", "topIndustries": ["SaaS", "Fintech", "Consumer Internet"], "aiTools": ["Notion", "Linear", "Mixpanel"]},
    },
    {"career_id": "c5", "slug": "business-analyst", "title": "Business Analyst", "icon": "TrendingUp", "iconColor": "#EC4899",
     "description": "Bridge business and tech with data-driven decisions.", "tags": ["Analytics", "Communication", "Research"],
     "avgSalary": {"min": 7, "max": 16}, "jobGrowth5Y": 18, "jobRoles": "10+", "demand": "High",
     "overview": "BAs translate business needs into actionable insights and requirements.",
     "skills": [{"name": "SQL", "importance": 90, "status": "Essential"}, {"name": "Excel", "importance": 80, "status": "Essential"}, {"name": "Communication", "importance": 85, "status": "Essential"}],
     "roadmap": [], "jobs": [], "insights": {"globalDemand": "High", "openPositions": "20,000+", "topIndustries": ["Consulting", "BFSI"], "aiTools": ["Tableau", "Power BI"]}},
    {"career_id": "c6", "slug": "cybersecurity-analyst", "title": "Cybersecurity Analyst", "icon": "Shield", "iconColor": "#14B8A6",
     "description": "Protect organizations from digital threats and breaches.", "tags": ["Security", "Networking", "Problem Solving"],
     "avgSalary": {"min": 6, "max": 14}, "jobGrowth5Y": 24, "jobRoles": "12+", "demand": "High",
     "overview": "With India's digital push, cybersecurity is critical across banking, government and tech.",
     "skills": [{"name": "Networking", "importance": 85, "status": "Essential"}, {"name": "Linux", "importance": 80, "status": "Essential"}, {"name": "Security Tools", "importance": 90, "status": "Essential"}],
     "roadmap": [], "jobs": [], "insights": {"globalDemand": "Very High", "openPositions": "15,000+", "topIndustries": ["BFSI", "IT"], "aiTools": ["Wireshark", "Splunk", "Burp Suite"]}},
    {"career_id": "c7", "slug": "cloud-engineer", "title": "Cloud Engineer", "icon": "Cloud", "iconColor": "#5B4FE9",
     "description": "Build and operate scalable cloud infrastructure.", "tags": ["Cloud", "DevOps", "Infrastructure"],
     "avgSalary": {"min": 10, "max": 22}, "jobGrowth5Y": 22, "jobRoles": "14+", "demand": "High",
     "overview": "Cloud adoption is rocketing across India. AWS, Azure, GCP skills are in massive demand.",
     "skills": [{"name": "AWS / Azure / GCP", "importance": 95, "status": "Essential"}, {"name": "Linux", "importance": 85, "status": "Essential"}, {"name": "CI/CD", "importance": 80, "status": "Important"}],
     "roadmap": [], "jobs": [], "insights": {"globalDemand": "Very High", "openPositions": "25,000+", "topIndustries": ["IT", "Product"], "aiTools": ["Terraform", "Docker", "Kubernetes"]}},
    {"career_id": "c8", "slug": "marketing-manager", "title": "Marketing Manager", "icon": "Megaphone", "iconColor": "#F97316",
     "description": "Drive brand growth through campaigns and strategy.", "tags": ["Strategy", "Creativity", "Analytics"],
     "avgSalary": {"min": 8, "max": 20}, "jobGrowth5Y": 16, "jobRoles": "15+", "demand": "Medium",
     "overview": "Marketing is evolving fast with digital-first consumers.",
     "skills": [{"name": "Digital Marketing", "importance": 90, "status": "Essential"}, {"name": "Analytics", "importance": 80, "status": "Essential"}],
     "roadmap": [], "jobs": [], "insights": {"globalDemand": "High", "openPositions": "10,000+", "topIndustries": ["FMCG", "E-commerce"], "aiTools": ["Google Analytics", "HubSpot"]}},
    {"career_id": "c9", "slug": "financial-analyst", "title": "Financial Analyst", "icon": "TrendingUp", "iconColor": "#22C55E",
     "description": "Analyze financial data to guide investments and decisions.", "tags": ["Finance", "Analytics", "Excel"],
     "avgSalary": {"min": 6, "max": 18}, "jobGrowth5Y": 14, "jobRoles": "10+", "demand": "High",
     "overview": "Core role across investment banks, corporates and consulting.",
     "skills": [{"name": "Financial Modeling", "importance": 90, "status": "Essential"}, {"name": "Excel", "importance": 95, "status": "Essential"}],
     "roadmap": [], "jobs": [], "insights": {"globalDemand": "High", "openPositions": "8,000+", "topIndustries": ["BFSI", "Consulting"], "aiTools": ["Bloomberg", "Excel"]}},
    {"career_id": "c10", "slug": "medical-representative-mr", "title": "Medical Representative (MR)", "icon": "BriefcaseMedical", "iconColor": "#7C3AED",
     "description": "Build healthcare sales relationships with doctors, clinics, hospitals, and pharma teams.",
     "tags": ["Sales", "Healthcare", "Communication"],
     "avgSalary": {"min": 3, "max": 12}, "jobGrowth5Y": 18, "jobRoles": "10+", "demand": "High",
     "overview": "Medical Representative is a practical healthcare-adjacent role for graduates who can communicate well, travel locally, learn product knowledge, and grow into area sales or pharma brand roles.",
     "skills": [{"name": "Product Knowledge", "importance": 85, "status": "Essential"}, {"name": "Communication", "importance": 95, "status": "Essential"}, {"name": "CRM Follow-up", "importance": 78, "status": "Important"}],
     "roadmap": [], "jobs": [], "insights": {"globalDemand": "High", "openPositions": "18,000+", "topIndustries": ["Pharma", "Healthcare Sales", "Diagnostics"], "aiTools": ["CRM", "Excel", "WhatsApp Business"]}},
    {"career_id": "c11", "slug": "lawyer", "title": "Lawyer", "icon": "Scale", "iconColor": "#A855F7",
     "description": "Practice law and advocate for clients.", "tags": ["Law", "Communication", "Analysis"],
     "avgSalary": {"min": 5, "max": 25}, "jobGrowth5Y": 8, "jobRoles": "All practice areas", "demand": "Medium",
     "overview": "5-year integrated law or 3-year LLB after grad. NLUs are the top schools.",
     "skills": [{"name": "Legal Research", "importance": 90, "status": "Essential"}, {"name": "Communication", "importance": 95, "status": "Essential"}],
     "roadmap": [], "jobs": [], "insights": {"globalDemand": "Medium", "openPositions": "5,000+", "topIndustries": ["Law Firms", "Corporate"], "aiTools": []}},
    {"career_id": "c12", "slug": "interior-designer", "title": "Interior Designer", "icon": "Home", "iconColor": "#A855F7",
     "description": "Design functional, beautiful homes, offices, studios, and retail spaces.", "tags": ["Design", "Space Planning", "Creativity"],
     "avgSalary": {"min": 4, "max": 15}, "jobGrowth5Y": 20, "jobRoles": "12+", "demand": "High",
     "overview": "Interior design is a strong switcher-friendly path for creative graduates who can learn AutoCAD, SketchUp, client handling, vendor coordination, and portfolio presentation.",
     "skills": [{"name": "Space Planning", "importance": 88, "status": "Essential"}, {"name": "AutoCAD or SketchUp", "importance": 82, "status": "Essential"}, {"name": "Client Communication", "importance": 80, "status": "Important"}],
     "roadmap": [], "jobs": [], "insights": {"globalDemand": "High", "openPositions": "12,000+", "topIndustries": ["Real Estate", "Studios", "Retail"], "aiTools": ["SketchUp", "Canva", "Pinterest"]}},
    {"career_id": "c13", "slug": "chartered-accountant", "title": "Chartered Accountant", "icon": "Calculator", "iconColor": "#0EA5E9",
     "description": "Audit, taxation, finance — the trusted advisors.", "tags": ["Finance", "Accounting", "Detail"],
     "avgSalary": {"min": 7, "max": 25}, "jobGrowth5Y": 14, "jobRoles": "All sectors", "demand": "High",
     "overview": "Tough but prestigious. CA Foundation → Inter → Final via ICAI.",
     "skills": [{"name": "Accounting", "importance": 95, "status": "Essential"}, {"name": "Taxation", "importance": 90, "status": "Essential"}],
     "roadmap": [], "jobs": [], "insights": {"globalDemand": "High", "openPositions": "10,000+", "topIndustries": ["Big4", "Industry"], "aiTools": []}},
    {"career_id": "c14", "slug": "content-creator", "title": "Content Creator", "icon": "Video", "iconColor": "#EC4899",
     "description": "Build audience and monetize creativity.", "tags": ["Creativity", "Video", "Storytelling"],
     "avgSalary": {"min": 3, "max": 50}, "jobGrowth5Y": 35, "jobRoles": "All niches", "demand": "Very High",
     "overview": "Creator economy in India is booming. Unlimited upside if you find your niche.",
     "skills": [{"name": "Storytelling", "importance": 95, "status": "Essential"}, {"name": "Video Editing", "importance": 85, "status": "Essential"}],
     "roadmap": [], "jobs": [], "insights": {"globalDemand": "Very High", "openPositions": "Self-driven", "topIndustries": ["Media", "Brands"], "aiTools": ["CapCut", "Canva", "Notion"]}},
    {"career_id": "c15", "slug": "entrepreneur", "title": "Entrepreneur", "icon": "Rocket", "iconColor": "#5B4FE9",
     "description": "Build businesses that solve real problems at scale.", "tags": ["Leadership", "Risk", "Vision"],
     "avgSalary": {"min": 0, "max": 1000}, "jobGrowth5Y": 30, "jobRoles": "Self-created", "demand": "Very High",
     "overview": "India is the 3rd largest startup ecosystem globally. The 2026s are for builders.",
     "skills": [{"name": "Resilience", "importance": 100, "status": "Essential"}, {"name": "Sales", "importance": 90, "status": "Essential"}, {"name": "Product Sense", "importance": 85, "status": "Essential"}],
     "roadmap": [], "jobs": [], "insights": {"globalDemand": "Always", "openPositions": "Self-create", "topIndustries": ["Anything"], "aiTools": ["Notion", "Linear"]}},
]

COLLEGES = [
    {"college_id": "col1", "name": "IIT Bombay", "location": "Mumbai", "city": "Mumbai", "state": "Maharashtra", "verified": True,
     "courses": ["B.Tech", "M.Tech", "MBA"], "rating": 4.9, "reviewCount": 12500, "avgPlacement": "₹25 LPA", "fees": "₹2.5L/yr",
     "category": ["Engineering", "Top Tier"]},
    {"college_id": "col2", "name": "IIT Delhi", "location": "Delhi", "city": "Delhi", "state": "Delhi", "verified": True,
     "courses": ["B.Tech", "M.Tech"], "rating": 4.9, "reviewCount": 11800, "avgPlacement": "₹24 LPA", "fees": "₹2.5L/yr",
     "category": ["Engineering", "Top Tier"]},
    {"college_id": "col3", "name": "IIT Madras", "location": "Chennai", "city": "Chennai", "state": "Tamil Nadu", "verified": True,
     "courses": ["B.Tech", "M.Tech", "Online BSc"], "rating": 4.9, "reviewCount": 11200, "avgPlacement": "₹22 LPA", "fees": "₹2.5L/yr",
     "category": ["Engineering", "Top Tier"]},
    {"college_id": "col4", "name": "IISc Bangalore", "location": "Bangalore", "city": "Bangalore", "state": "Karnataka", "verified": True,
     "courses": ["BS Research", "MS", "PhD"], "rating": 4.9, "reviewCount": 5800, "avgPlacement": "₹20 LPA", "fees": "₹40K/yr",
     "category": ["Science", "Research", "Top Tier"]},
    {"college_id": "col5", "name": "IIT Kanpur", "location": "Kanpur", "city": "Kanpur", "state": "Uttar Pradesh", "verified": True,
     "courses": ["B.Tech", "M.Tech"], "rating": 4.8, "reviewCount": 9400, "avgPlacement": "₹22 LPA", "fees": "₹2.5L/yr",
     "category": ["Engineering", "Top Tier"]},
    {"college_id": "col6", "name": "NIT Trichy", "location": "Tiruchirappalli", "city": "Trichy", "state": "Tamil Nadu", "verified": True,
     "courses": ["B.Tech", "M.Tech"], "rating": 4.7, "reviewCount": 7800, "avgPlacement": "₹15 LPA", "fees": "₹1.5L/yr",
     "category": ["Engineering"]},
    {"college_id": "col7", "name": "IIIT Hyderabad", "location": "Hyderabad", "city": "Hyderabad", "state": "Telangana", "verified": True,
     "courses": ["B.Tech CSE", "M.Tech"], "rating": 4.8, "reviewCount": 6200, "avgPlacement": "₹28 LPA", "fees": "₹3.5L/yr",
     "category": ["Engineering", "Top Tier"]},
    {"college_id": "col8", "name": "BITS Pilani", "location": "Pilani", "city": "Pilani", "state": "Rajasthan", "verified": True,
     "courses": ["B.E.", "M.Sc"], "rating": 4.7, "reviewCount": 8800, "avgPlacement": "₹18 LPA", "fees": "₹4.5L/yr",
     "category": ["Engineering", "Private"]},
    {"college_id": "col9", "name": "Delhi University (SRCC)", "location": "Delhi", "city": "Delhi", "state": "Delhi", "verified": True,
     "courses": ["B.Com (H)", "Economics"], "rating": 4.7, "reviewCount": 9000, "avgPlacement": "₹12 LPA", "fees": "₹50K/yr",
     "category": ["Commerce", "Top Tier"]},
    {"college_id": "col10", "name": "St. Stephen's College", "location": "Delhi", "city": "Delhi", "state": "Delhi", "verified": True,
     "courses": ["BA", "BSc", "Economics"], "rating": 4.6, "reviewCount": 4200, "avgPlacement": "₹10 LPA", "fees": "₹60K/yr",
     "category": ["Arts", "Top Tier"]},
    {"college_id": "col11", "name": "AIIMS Delhi", "location": "Delhi", "city": "Delhi", "state": "Delhi", "verified": True,
     "courses": ["MBBS", "MD"], "rating": 4.9, "reviewCount": 7800, "avgPlacement": "Government posting", "fees": "₹6K/yr",
     "category": ["Medical", "Top Tier"]},
    {"college_id": "col12", "name": "NLSIU Bangalore", "location": "Bangalore", "city": "Bangalore", "state": "Karnataka", "verified": True,
     "courses": ["B.A. LL.B"], "rating": 4.8, "reviewCount": 3200, "avgPlacement": "₹18 LPA", "fees": "₹3L/yr",
     "category": ["Law", "Top Tier"]},
    {"college_id": "col13", "name": "IIM Ahmedabad", "location": "Ahmedabad", "city": "Ahmedabad", "state": "Gujarat", "verified": True,
     "courses": ["MBA", "PGP"], "rating": 4.9, "reviewCount": 8200, "avgPlacement": "₹35 LPA", "fees": "₹25L total",
     "category": ["Management", "Top Tier"]},
    {"college_id": "col14", "name": "VIT Vellore", "location": "Vellore", "city": "Vellore", "state": "Tamil Nadu", "verified": True,
     "courses": ["B.Tech", "M.Tech"], "rating": 4.4, "reviewCount": 12500, "avgPlacement": "₹8 LPA", "fees": "₹2L/yr",
     "category": ["Engineering", "Private"]},
    {"college_id": "col15", "name": "Manipal Institute of Technology", "location": "Manipal", "city": "Manipal", "state": "Karnataka", "verified": True,
     "courses": ["B.Tech"], "rating": 4.5, "reviewCount": 9200, "avgPlacement": "₹9 LPA", "fees": "₹3.5L/yr",
     "category": ["Engineering", "Private"]},
    {"college_id": "col16", "name": "Christ University", "location": "Bangalore", "city": "Bangalore", "state": "Karnataka", "verified": True,
     "courses": ["BBA", "BCA", "BA"], "rating": 4.5, "reviewCount": 7100, "avgPlacement": "₹6 LPA", "fees": "₹1.5L/yr",
     "category": ["Commerce", "Arts", "Private"]},
    {"college_id": "col17", "name": "NMIMS Mumbai", "location": "Mumbai", "city": "Mumbai", "state": "Maharashtra", "verified": True,
     "courses": ["BBA", "MBA"], "rating": 4.6, "reviewCount": 5800, "avgPlacement": "₹14 LPA", "fees": "₹4L/yr",
     "category": ["Management", "Private"]},
    {"college_id": "col18", "name": "IIT Roorkee", "location": "Roorkee", "city": "Roorkee", "state": "Uttarakhand", "verified": True,
     "courses": ["B.Tech", "M.Tech"], "rating": 4.7, "reviewCount": 8400, "avgPlacement": "₹16 LPA", "fees": "₹2.5L/yr",
     "category": ["Engineering", "Top Tier"]},
    {"college_id": "col19", "name": "JIPMER Puducherry", "location": "Puducherry", "city": "Puducherry", "state": "Puducherry", "verified": True,
     "courses": ["MBBS"], "rating": 4.7, "reviewCount": 2900, "avgPlacement": "Government posting", "fees": "₹6K/yr",
     "category": ["Medical"]},
    {"college_id": "col20", "name": "Symbiosis Pune", "location": "Pune", "city": "Pune", "state": "Maharashtra", "verified": True,
     "courses": ["BBA", "B.Tech", "MBA"], "rating": 4.5, "reviewCount": 6700, "avgPlacement": "₹10 LPA", "fees": "₹3L/yr",
     "category": ["Management", "Private"]},
    {"college_id": "col21", "name": "HR College of Commerce & Economics", "location": "Mumbai", "city": "Mumbai", "state": "Maharashtra", "verified": True,
     "courses": ["B.Com", "BMS", "BAF"], "rating": 4.5, "reviewCount": 5100, "avgPlacement": "₹7 LPA", "fees": "₹45K/yr",
     "category": ["Commerce"]},
    {"college_id": "col22", "name": "St. Xavier's College Mumbai", "location": "Mumbai", "city": "Mumbai", "state": "Maharashtra", "verified": True,
     "courses": ["B.Com", "BA", "BSc"], "rating": 4.7, "reviewCount": 6200, "avgPlacement": "₹8 LPA", "fees": "₹55K/yr",
     "category": ["Commerce", "Arts", "Science"]},
    {"college_id": "col23", "name": "Narsee Monjee College of Commerce and Economics", "location": "Mumbai", "city": "Mumbai", "state": "Maharashtra", "verified": True,
     "courses": ["B.Com", "BMS", "M.Com"], "rating": 4.6, "reviewCount": 4600, "avgPlacement": "₹7.5 LPA", "fees": "₹48K/yr",
     "category": ["Commerce"]},
    {"college_id": "col24", "name": "Hindu College Delhi University", "location": "Delhi", "city": "Delhi", "state": "Delhi", "verified": True,
     "courses": ["BA", "BSc", "B.Com"], "rating": 4.6, "reviewCount": 5400, "avgPlacement": "₹9 LPA", "fees": "₹35K/yr",
     "category": ["Commerce", "Arts", "Science"]},
    {"college_id": "col25", "name": "Faculty of Law, Delhi University", "location": "Delhi", "city": "Delhi", "state": "Delhi", "verified": True,
     "courses": ["LLB", "LLM"], "rating": 4.5, "reviewCount": 3100, "avgPlacement": "₹9 LPA", "fees": "₹25K/yr",
     "category": ["Law"]},
    {"college_id": "col26", "name": "Jindal Global Law School", "location": "Sonipat", "city": "Sonipat", "state": "Haryana", "verified": True,
     "courses": ["BA LLB", "BBA LLB"], "rating": 4.4, "reviewCount": 2600, "avgPlacement": "₹11 LPA", "fees": "₹6L/yr",
     "category": ["Law", "Private"]},
]

SCHOLARSHIPS = [
    {"scholarship_id": "s1", "name": "Reliance Foundation Undergraduate Scholarships",
     "type": "Merit-cum-Need", "description": "For meritorious students from underprivileged backgrounds pursuing undergrad.",
     "amount": "₹2,00,000/year", "eligibility": "Class 12 score >85%, family income <₹15L",
     "deadline": "2026-10-15", "category": ["Undergrad", "All Streams"], "partnerLogo": ""},
    {"scholarship_id": "s2", "name": "AICTE Pragati Scholarship for Girls",
     "type": "Government", "description": "Girls students in technical education.",
     "amount": "₹50,000/year", "eligibility": "Girl student in AICTE-approved technical course",
     "deadline": "2026-12-31", "category": ["Engineering", "Girls"], "partnerLogo": ""},
    {"scholarship_id": "s3", "name": "Tata Capital Pankh Scholarship",
     "type": "Need-Based", "description": "Class 11-12 and Diploma students from economically weaker sections.",
     "amount": "₹12,000/year", "eligibility": "Class 11/12, income <₹2.5L",
     "deadline": "2026-09-30", "category": ["School", "Need-Based"], "partnerLogo": ""},
    {"scholarship_id": "s4", "name": "National Scholarship Portal (NSP)",
     "type": "Government", "description": "Central government umbrella scholarship.",
     "amount": "Varies", "eligibility": "Various schemes — SC/ST/OBC/Minority etc.",
     "deadline": "2026-11-30", "category": ["All", "Government"], "partnerLogo": ""},
    {"scholarship_id": "s5", "name": "Inspire Scholarship (DST)",
     "type": "Merit", "description": "Top 1% Class 12 science students for BSc/MSc.",
     "amount": "₹80,000/year", "eligibility": "Top 1% Class 12 PCB/PCM, BSc/MSc enrolled",
     "deadline": "2026-08-31", "category": ["Science", "Top Tier"], "partnerLogo": ""},
    {"scholarship_id": "s6", "name": "KVPY (now INSPIRE-SHE)",
     "type": "Merit", "description": "Research-oriented science students.",
     "amount": "₹84,000/year", "eligibility": "Class 11-12 + BSc science research aspirants",
     "deadline": "2026-07-15", "category": ["Science", "Research"], "partnerLogo": ""},
    {"scholarship_id": "s7", "name": "Vidyasaarathi Postgraduate Scholarship",
     "type": "Merit-cum-Need", "description": "PG studies in India.",
     "amount": "Up to ₹2L", "eligibility": "Admission in PG course; income criteria apply",
     "deadline": "2026-10-31", "category": ["Postgrad"], "partnerLogo": ""},
    {"scholarship_id": "s8", "name": "Aditya Birla Scholarship",
     "type": "Merit", "description": "Top performers at IITs/IIMs/BITS/NLU/XLRI.",
     "amount": "₹1,75,000/year", "eligibility": "Top rank in select institutes",
     "deadline": "2026-09-15", "category": ["Top Tier", "Engineering", "Management"], "partnerLogo": ""},
    {"scholarship_id": "s9", "name": "OP Jindal Engineering & Management Scholarship",
     "type": "Merit-cum-Need", "description": "For engineering and management students.",
     "amount": "Up to ₹1L/yr", "eligibility": "Active student pursuing eligible courses",
     "deadline": "2026-08-30", "category": ["Engineering", "Management"], "partnerLogo": ""},
    {"scholarship_id": "s10", "name": "Sitaram Jindal Foundation Scholarship",
     "type": "Need-Based", "description": "Students from low-income families.",
     "amount": "₹600-3200/month", "eligibility": "Family income limits, merit criteria",
     "deadline": "2026-12-31", "category": ["Need-Based"], "partnerLogo": ""},
    {"scholarship_id": "s11", "name": "Foundation for Excellence (FFE)",
     "type": "Need-Based", "description": "Engineering and Medicine students.",
     "amount": "₹50,000/year", "eligibility": "Engineering/Medical undergrad, income <₹2.5L",
     "deadline": "2026-09-30", "category": ["Engineering", "Medical"], "partnerLogo": ""},
    {"scholarship_id": "s12", "name": "Central Sector Scholarship (CSSS)",
     "type": "Government", "description": "Top 20 percentile students from Class 12.",
     "amount": "₹10K-20K/yr", "eligibility": "Top 20% in Class 12, family income <₹8L",
     "deadline": "2026-10-31", "category": ["School", "Undergrad"], "partnerLogo": ""},
    {"scholarship_id": "s13", "name": "Kotak Kanya Scholarship",
     "type": "Girls", "description": "For meritorious girl students.",
     "amount": "₹1.5L/year", "eligibility": "Girl student, Class 12 >85%, income <₹6L",
     "deadline": "2026-11-15", "category": ["Girls", "Undergrad"], "partnerLogo": ""},
    {"scholarship_id": "s14", "name": "L'Oreal India For Young Women in Science",
     "type": "Girls", "description": "Women pursuing science.",
     "amount": "₹2.5L total", "eligibility": "Female, BSc/MSc science",
     "deadline": "2026-12-15", "category": ["Science", "Girls"], "partnerLogo": ""},
    {"scholarship_id": "s15", "name": "Buddy4Study Scholarships",
     "type": "Aggregator", "description": "Platform with hundreds of options.",
     "amount": "Varies", "eligibility": "Varies", "deadline": "Rolling",
     "category": ["All"], "partnerLogo": ""},
]


def _build_questions():
    """60 questions across 4 categories (15 each): interests, skills, personality, workStyle."""
    Q = []
    interests = [
        ("Which activity excites you most?", ["Solving puzzles", "Designing visuals", "Helping people", "Leading a team"]),
        ("Pick a weekend hobby:", ["Coding side projects", "Drawing/painting", "Volunteering", "Organizing events"]),
        ("Favorite subject in school?", ["Maths/Science", "Art/Design", "Biology/Psychology", "Business studies"]),
        ("You enjoy reading about:", ["Tech innovations", "Movies/culture", "Health/science", "Startup stories"]),
        ("YouTube channel you binge:", ["3Blue1Brown", "Will Paterson", "Think School", "Y Combinator"]),
        ("You'd love to work on:", ["AI systems", "Brand identity", "Healthcare sales", "New product launch"]),
        ("A dream city to work in:", ["Bangalore (tech)", "Mumbai (creative)", "Delhi (impact)", "Anywhere global"]),
        ("Pick a magazine:", ["Wired", "Vogue", "National Geographic", "Forbes"]),
        ("Free time, you choose:", ["Build something", "Make something beautiful", "Learn about people", "Plan something"]),
        ("Dream internship:", ["AI startup", "Design studio", "NGO/hospital", "Top consulting firm"]),
        ("You're drawn to:", ["Data & patterns", "Aesthetics", "Empathy", "Strategy"]),
        ("Most fun school project?", ["Science experiment", "Art exhibition", "Debate", "Business plan"]),
        ("Pick a TED talk:", ["Future of AI", "Power of design", "Mental health", "How to lead"]),
        ("Career documentary:", ["Coded Bias", "Abstract", "Heart of Care", "Shark Tank"]),
        ("You secretly want to be a:", ["Researcher", "Creator", "Healer/Helper", "Founder/CEO"]),
    ]
    skills = [
        ("How comfortable are you with maths?", ["Very comfortable", "Comfortable", "Okay", "Avoid it"]),
        ("Rate your coding skills:", ["Strong", "Some", "Beginner", "None"]),
        ("Rate your design eye:", ["Strong", "Some", "Okay", "Weak"]),
        ("How well do you write/communicate?", ["Excellent", "Good", "Okay", "Weak"]),
        ("Rate your analytical thinking:", ["Strong", "Good", "Average", "Weak"]),
        ("Rate your public speaking:", ["Strong", "Good", "Okay", "Weak"]),
        ("Rate your organization skills:", ["Excellent", "Good", "Okay", "Weak"]),
        ("Comfort with new tools/software:", ["Very high", "High", "Medium", "Low"]),
        ("Foreign language ability:", ["Fluent", "Good", "Basic", "None"]),
        ("Empathy for others:", ["Very high", "High", "Medium", "Low"]),
        ("Ability to focus deeply:", ["Hours", "1-2 hrs", "Short bursts", "Hard"]),
        ("Comfort handling pressure:", ["Thrive", "Manage well", "Okay", "Struggle"]),
        ("Negotiation/persuasion:", ["Strong", "Good", "Okay", "Weak"]),
        ("Detail orientation:", ["Very strong", "Good", "Average", "Weak"]),
        ("Big-picture thinking:", ["Strong", "Good", "Average", "Weak"]),
    ]
    personality = [
        ("In a group project, you:", ["Lead", "Contribute equally", "Support", "Stay quiet"]),
        ("Big decisions, you rely on:", ["Logic", "Intuition", "Others' input", "Pros/cons list"]),
        ("Are you more:", ["Introverted", "Slightly introverted", "Slightly extroverted", "Extroverted"]),
        ("Risk tolerance:", ["High", "Medium-high", "Medium", "Low"]),
        ("Conflict style:", ["Direct", "Diplomatic", "Avoid", "Mediator"]),
        ("You prefer:", ["Structure", "Some structure", "Flexibility", "Chaos"]),
        ("Learning style:", ["Reading", "Watching", "Doing", "Discussing"]),
        ("Energy from:", ["Solo work", "Small teams", "Large groups", "Mix"]),
        ("Future excites you because:", ["Possibilities", "Stability", "Adventure", "Impact"]),
        ("You're motivated by:", ["Mastery", "Recognition", "Service", "Wealth"]),
        ("Workplace vibe:", ["Quiet office", "Cozy team", "Buzzy startup", "Open coworking"]),
        ("Failure feels like:", ["Lesson", "Setback", "Motivator", "Heavy"]),
        ("Pick a value:", ["Curiosity", "Creativity", "Compassion", "Achievement"]),
        ("In a crisis you:", ["Plan", "Act", "Support", "Lead"]),
        ("Long-term goals are:", ["Clear", "Mostly clear", "Vague", "Open"]),
    ]
    work_style = [
        ("Ideal working hours:", ["9-5", "Flexible", "Night owl", "Hustle 24/7"]),
        ("Preferred work mode:", ["Office", "Hybrid", "Remote", "Anywhere"]),
        ("Travel for work:", ["Love it", "Sometimes", "Rare", "Never"]),
        ("Income vs purpose:", ["Income", "Income > purpose", "Purpose > income", "Purpose"]),
        ("Career pace:", ["Fast-track", "Steady", "Balanced", "Chill"]),
        ("Manager you'd love:", ["Visionary", "Mentor", "Hands-off", "Friend"]),
        ("Team size preference:", ["Solo", "Small (3-5)", "Medium (10-20)", "Large"]),
        ("Ownership vs collaboration:", ["Full ownership", "Mostly own", "Mostly collab", "Full collab"]),
        ("Travel preference for jobs:", ["India only", "Both", "Abroad", "Remote global"]),
        ("Big company vs startup:", ["MNC", "Mid-size", "Startup", "Own venture"]),
        ("Work-life balance importance:", ["Critical", "High", "Medium", "Low"]),
        ("Learning on the job:", ["Crucial", "Important", "Okay", "Not key"]),
        ("Public vs private sector:", ["Government", "PSU", "Private", "NGO"]),
        ("Predictable vs varied tasks:", ["Predictable", "Mostly stable", "Varied", "All variety"]),
        ("How soon to settle:", ["ASAP", "In 5 yrs", "In 10 yrs", "Never settle"]),
    ]

    def add(cat, arr):
        for i, (q, opts) in enumerate(arr):
            Q.append({
                "question_id": f"{cat[:3]}{i+1}", "category": cat,
                "question": q,
                "options": [{"key": k, "text": t} for k, t in zip("ABCD", opts)],
                "order": len(Q) + 1,
            })

    add("interests", interests)
    add("skills", skills)
    add("personality", personality)
    add("workStyle", work_style)
    return Q


TEST_QUESTIONS = _build_questions()


async def seed(db):
    """Idempotent seeding — uses bulk_write for fast Atlas performance."""
    import logging
    from pymongo import UpdateOne
    logger = logging.getLogger(__name__)

    all_careers = [*DYNAMIC_CAREERS]
    detail_fields = {"aiGeneratedDetails", "detailsCachedAt", "detailsGeneratedByAI"}

    # Always upsert to ensure new catalog entries are added
    existing_count = await db.careers.count_documents({})
    if existing_count >= len(all_careers):
        logger.info("Seed: DB has %d careers, catalog has %d — quick sync.", existing_count, len(all_careers))
    else:
        logger.info("Seeding %d careers (DB has %d) ...", len(all_careers), existing_count)

    # Always run upsert to sync new/updated careers
    if True:
        career_ops = []
        for c in all_careers:
            doc = dict(c)
            doc.setdefault("career_id", f"career-{doc['slug']}")
            doc.setdefault("field", doc.get("category") if isinstance(doc.get("category"), str) else "General")
            doc.setdefault("category", doc.get("field", "General"))
            doc.setdefault("shortDescription", doc.get("description", "Explore this career path."))
            doc.setdefault("description", doc.get("shortDescription", "Explore this career path."))
            if "avgSalary" in doc:
                doc.setdefault("avgSalaryMin", doc["avgSalary"].get("min"))
                doc.setdefault("avgSalaryMax", doc["avgSalary"].get("max"))
            else:
                doc["avgSalary"] = {"min": doc.get("avgSalaryMin", 4), "max": doc.get("avgSalaryMax", 12)}
            doc.setdefault("totalJobRoles", 8)
            doc.setdefault("jobRoles", f"{doc['totalJobRoles']}+")
            doc.setdefault("detailsGeneratedByAI", False)
            doc.setdefault("detailsCachedAt", None)
            doc.setdefault("aiGeneratedDetails", None)
            base = {k: v for k, v in doc.items() if k not in detail_fields}
            detail_defaults = {k: doc[k] for k in detail_fields}
            career_ops.append(UpdateOne(
                {"slug": doc["slug"]},
                {"$set": base, "$setOnInsert": detail_defaults},
                upsert=True,
            ))
        await db.careers.bulk_write(career_ops, ordered=False)
        await db.careers.delete_many({"slug": {"$in": REMOVED_CAREER_SLUGS}})
        # Auto-cleanup: remove any career not in the current catalog
        valid_slugs = [c["slug"] for c in all_careers]
        cleanup = await db.careers.delete_many({"slug": {"$nin": valid_slugs}})
        if cleanup.deleted_count:
            logger.info("Cleaned up %d stale careers from DB.", cleanup.deleted_count)
        logger.info("Career seed done.")

    # ── Support collections — only if empty (single bulk per collection) ───────
    if await db.colleges.count_documents({}) == 0:
        await db.colleges.bulk_write(
            [UpdateOne({"college_id": c["college_id"]}, {"$set": dict(c)}, upsert=True) for c in COLLEGES],
            ordered=False,
        )

    if await db.scholarships.count_documents({}) == 0:
        await db.scholarships.bulk_write(
            [UpdateOne({"scholarship_id": s["scholarship_id"]}, {"$set": dict(s)}, upsert=True) for s in SCHOLARSHIPS],
            ordered=False,
        )

    if await db.test_questions.count_documents({}) == 0:
        await db.test_questions.bulk_write(
            [UpdateOne({"question_id": q["question_id"]}, {"$set": dict(q)}, upsert=True) for q in TEST_QUESTIONS],
            ordered=False,
        )
