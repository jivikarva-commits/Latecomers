"""Step 1 'Education requirement' for every IT/Tech and Marketing guide.

Private-sector roles have no legal minimum qualification; these describe what employers commonly ask for
in job posts, plus the usual study routes after 10th/12th and the route for other backgrounds.
"""

_DEV = ("Before you start", "Minimum: 12th pass (any stream) is enough to start learning. Most company jobs ask for a graduation — "
        "BCA, BSc (CS/IT), BTech/BE (CS/IT) or MCA are the most common, but many companies accept any degree with a strong portfolio. "
        "After 10th: a 3-year Diploma in Computer Engineering also works. Other stream (BCom/BA)? You can still get in — build projects, "
        "keep your GitHub active and consider a short certificate such as NIELIT 'O' Level or a CDAC course.")
_MOBILE = ("Before you start", "Minimum: 12th pass to start learning. For jobs, most companies prefer BCA, BSc (CS/IT), BTech/BE or MCA; "
           "startups often accept any graduate with 2–3 published apps. After 10th: a Diploma in Computer Engineering is an option. "
           "From a non-IT background: learn programming basics first and let your Play Store/App Store apps prove your skill.")
_CMS = ("Before you start", "Minimum: no degree is required for most agency and freelance work — 12th pass (any stream) is fine. "
        "A BCA/BSc IT or a diploma helps if you want a company job. What clients check is your live websites/stores, not marksheets. "
        "Any background (BCom, BA, design) can start here.")

_ANY_GRAD = "Minimum: graduation in any stream for most company jobs."

EDUCATION = {
    "frontend-developer": _DEV,
    "backend-developer": ("Before you start", "Minimum: 12th pass to start learning. Most backend jobs ask for BCA, BSc (CS/IT), BTech/BE (CS/IT) "
                          "or MCA because DSA, databases and operating-system basics are tested; some product companies hire any graduate who clears "
                          "the coding round. After 10th: a Diploma in Computer Engineering followed by lateral-entry BTech is a route. "
                          "Non-CS graduates should cover DSA and DBMS properly and build 2–3 solid APIs."),
    "full-stack-developer": _DEV,
    "react-developer": _DEV,
    "android-developer": _MOBILE,
    "ios-developer": ("Before you start", "Minimum: 12th pass to start learning; you also need a Mac to build iOS apps. Jobs usually prefer BCA, BSc (CS/IT), "
                      "BTech/BE or MCA, but a published App Store app can matter more than the degree. From a non-IT background: learn Swift basics "
                      "and publish small apps to prove your skill."),
    "flutter-developer": _MOBILE,
    "wordpress-developer": _CMS,
    "shopify-developer": _CMS,
    "data-analyst": ("Before you start", _ANY_GRAD + " Most helpful: BCom, BBA, BSc (Maths/Statistics/CS), BCA, BTech or Economics, because you work "
                     "with numbers every day. 12th with Maths helps but is not compulsory. From arts or other streams: learn Excel, SQL and basic "
                     "statistics well and show 3 analysis projects."),
    "business-analyst": ("Before you start", _ANY_GRAD + " BBA, BCom, BTech, BCA or Economics are common; an MBA helps for consulting and "
                         "product-side BA roles but is not compulsory for entry-level jobs. Domain knowledge (banking, retail, healthcare) is a "
                         "plus. From any stream: learn Excel, SQL and requirement documents (BRD/user stories)."),
    "data-scientist": ("Before you start", "Most jobs ask for a degree in CS, Maths, Statistics, Engineering, Economics or Data Science "
                       "(BTech/BE, BSc, MSc, MCA); many senior roles prefer a master's. 12th with Maths is strongly recommended because the work "
                       "uses statistics, linear algebra and probability. From another stream: complete a structured maths + Python programme "
                       "(e.g. IIT Madras BS in Data Science) before applying."),
    "ml-engineer": ("Before you start", "Usually BE/BTech, MCA, MSc or MTech in CS, IT, Maths or a related field — ML engineer roles test "
                    "programming, DSA and maths. 12th with Maths (PCM) is strongly recommended. Many people move here after 1–2 years as a "
                    "software developer or data scientist. Non-CS graduates should first build strong Python, DSA and maths foundations."),
    "ai-prompt-engineer": ("Before you start", _ANY_GRAD + " A programming background (BCA, BTech, BSc CS) helps a lot because most roles "
                           "also need Python and APIs. Writers, domain experts (law, medicine, education) and analysts from any stream can "
                           "start too if they learn basic Python."),
    "power-bi-tableau-analyst": ("Before you start", _ANY_GRAD + " BCom, BBA, BSc, BCA and BTech are common; comfort with numbers matters more "
                                 "than the degree name. From any stream: learn Excel, SQL and one BI tool, then show dashboards in your portfolio."),
    "sql-database-analyst": ("Before you start", _ANY_GRAD + " BCA, BSc (CS/IT), BTech or MCA help because database concepts (DBMS) are part of "
                             "these courses. After 10th: a Diploma in Computer Engineering works for support-level roles. Other streams can "
                             "start by learning SQL and DBMS basics properly."),
    "ethical-hacker-penetration-tester": ("Before you start", "Minimum: 12th pass to start learning. For jobs, BCA, BSc (IT/CS/Cyber "
                                          "Security), BTech/BE (CS/IT) or a networking diploma is common; many employers also value "
                                          "certifications. Some government and defence-linked roles need a specific degree — read each "
                                          "notification. Non-IT graduates should first learn networking and Linux properly."),
    "soc-analyst-l1-l2": ("Before you start", "Usually graduation with IT/CS: BCA, BSc (IT/CS), BTech or MCA; a diploma in IT/networking works for "
                          "some L1 roles. Any graduate can enter with networking + security basics and an entry-level security certificate. "
                          "Shift work is common."),
    "network-security-engineer": ("Before you start", "Usually BTech/BE (CS/IT/ECE), BCA, BSc (IT) or a Diploma in Computer/Networking. "
                                  "Networking certifications (e.g. CCNA) are often asked for. People usually start as a network or support "
                                  "engineer first."),
    "cyber-forensics-analyst": ("Before you start", "Usually BSc/BTech/BCA in CS, IT or Forensic Science; an MSc in Digital/Cyber Forensics is "
                                "often preferred, especially for government and law-enforcement labs. Government lab posts list exact "
                                "qualifications in each recruitment notice."),
    "cloud-security-engineer": ("Before you start", "Usually a CS/IT degree (BTech, BCA, BSc IT, MCA). This is not a fresher role — most people "
                                "move here after 2–3 years in cloud, system administration or security, so start with one of those."),
    "bug-bounty-hunter": ("Before you start", "No degree is needed — platforms pay for valid bugs, not certificates. Check each platform's age rules (some need 18+ or "
                          "guardian consent) and only test programmes that allow it. A CS/IT degree helps if you later want a security job."),
    "cloud-engineer-aws-azure-gcp": ("Before you start", "Usually BCA, BSc (IT/CS), BTech/BE or MCA; a diploma works for some support-level "
                                     "roles. Any graduate can enter with Linux, networking and one cloud certification. Many start as "
                                     "support or system admin engineers."),
    "devops-engineer": ("Before you start", "Usually BTech/BE (CS/IT), BCA, BSc (IT/CS) or MCA. DevOps is rarely a pure fresher role — people "
                        "often start as a developer, system admin or cloud support engineer and move in after 1–2 years. Non-IT graduates "
                        "should begin with Linux and networking."),
    "linux-system-administrator": ("Before you start", "Minimum: Diploma, BCA, BSc (IT/CS) or BTech is common; some companies hire 12th pass + "
                                   "certification for support roles. Red Hat certifications (RHCSA) are widely asked for. Any background can "
                                   "start by learning Linux daily."),
    "network-engineer-ccna": ("Before you start", "Minimum: Diploma in Computer/Electronics/IT, ITI (for some field roles), BCA, BSc (IT) or BTech "
                              "(CS/IT/ECE). CCNA is the most-asked certification for entry jobs. Many start as a network support or NOC engineer."),
    "docker-kubernetes-engineer": ("Before you start", "Usually BTech/BE (CS/IT), BCA, BSc (IT/CS) or MCA. Not a fresher role — you usually need "
                                   "Linux, networking and 1–2 years of DevOps or development experience first."),
    "seo-specialist": ("Before you start", _ANY_GRAD + " BBA, BCom, BA, BMM/Mass Media, BSc or BTech all work — no specific degree is required. "
                       "Freelance SEO needs no degree at all. Good English writing and comfort with Google Sheets help."),
    "performance-marketing-manager": ("Before you start", _ANY_GRAD + " BBA, BCom, BMS, Economics or BTech are common because the work is "
                                      "numbers-heavy; an MBA (Marketing) helps for manager roles later but is not needed to start. Google Ads "
                                      "and Meta certifications matter more for entry jobs."),
    "social-media-manager": ("Before you start", _ANY_GRAD + " BMM/BMS/Mass Media, BA (English/Journalism), BBA or any degree works. Freelance "
                             "and creator work needs no degree. Your page growth and content samples matter most."),
    "content-marketer-strategist": ("Before you start", _ANY_GRAD + " BA (English/Journalism/Mass Communication), BMM or any degree with "
                                    "strong writing works. A PG Diploma (e.g. IIMC) helps for media and brand roles but is optional."),
    "copywriter": ("Before you start", _ANY_GRAD + " Agencies hire from any stream — BA (English), BMM/Mass Media, BFA and BBA are common. "
                   "A PG Diploma in Advertising (IIMC) or MICA programme helps for top agencies, but your portfolio decides."),
    "affiliate-marketer": ("Before you start", "No qualification is required — you work for yourself. You must be 18+ to sign agreements, and "
                           "programmes such as Amazon Associates India need a qualifying website or app. Good writing or video skills help most."),
    "crm-specialist": ("Before you start", _ANY_GRAD + " BBA, BCom, BMS, BCA or BTech are common; comfort with data and tools matters more "
                       "than the degree. HubSpot or Salesforce certificates help freshers stand out."),
    "sales-executive-bde": ("Before you start", "Minimum: graduation in any stream for most BDE/inside-sales jobs; some field sales and retail "
                            "sales roles accept 12th pass. An MBA (Marketing/Sales) helps for key-account and manager roles later. "
                            "Communication in English plus Hindi/a regional language matters more than marks."),
    "entrepreneur-founder": ("Before you start", "No qualification is required to start a business. You must be 18+ to sign contracts and register "
                             "most business types (consult a CA). Optional learning: EDII PGDM in Entrepreneurship, NIESBUD EDPs or "
                             "incubator programmes. Domain knowledge of your industry matters most."),
}
