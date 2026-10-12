"""Education requirement for every IT/Tech and Marketing guide.

Private-sector jobs have no single legal qualification, so these state what company job posts in India
commonly ask for (required), what is preferred, and the study route after 10th/12th. Each entry is
(short value for quick facts and eligibility, full text for Step 1).
"""


def _edu(required, preferred, route):
    return required, f"Required: {required}.\nPreferred: {preferred}.\nRoute: {route}."


_CS = "BE/BTech (CS/IT), BCA, BSc (CS/IT) or MCA"
_CS_ROUTE = ("after 12th, take BTech/BE (CS/IT) — needs 12th with Physics, Chemistry and Maths — or BCA/BSc (CS/IT), where many universities "
             "ask for Maths or Computer Science in 12th (check the university's rule). After 10th, a 3-year Diploma in Computer Engineering "
             "followed by lateral-entry BTech is another route")
_CAMPUS = "large companies and campus drives often also ask for minimum marks and no active backlogs — read each job post"

_DEV = _edu(f"graduation in {_CS}", f"a CS/IT degree with good projects; {_CAMPUS}", _CS_ROUTE)
_MOBILE = _edu(f"graduation in {_CS}", f"a CS/IT degree plus 2–3 published apps; {_CAMPUS}", _CS_ROUTE)
_CMS = _edu("Diploma in Computer Engineering/IT, BCA, BSc (CS/IT) or BTech (CS/IT)", "a computer degree or diploma plus live client websites/stores",
            "after 10th, a Diploma in Computer Engineering/IT; after 12th, BCA, BSc (CS/IT) or BTech (CS/IT)")
_CLOUD = _edu(f"graduation in {_CS}", "a CS/IT degree plus a cloud or Linux certification; most companies want 1–2 years of developer, "
              "system-admin or support experience first", _CS_ROUTE)
_MKT_ROUTE = "after 12th (any stream), take BBA, BMS, BMM/BJMC (Mass Media) or BCom; an MBA/PGDM in Marketing later helps for manager roles"

EDUCATION = {
    "frontend-developer": _DEV,
    "backend-developer": _edu(f"graduation in {_CS}", f"a CS/IT degree, because DSA, DBMS and operating systems are tested in interviews; {_CAMPUS}", _CS_ROUTE),
    "full-stack-developer": _DEV,
    "react-developer": _DEV,
    "android-developer": _MOBILE,
    "ios-developer": _edu(f"graduation in {_CS}", f"a CS/IT degree plus a published App Store app (you also need a Mac to build iOS apps); {_CAMPUS}", _CS_ROUTE),
    "flutter-developer": _MOBILE,
    "wordpress-developer": _CMS,
    "shopify-developer": _CMS,
    "data-analyst": _edu("graduation in BSc (Statistics/Maths/CS), BCom, BBA, BCA, BTech or BA/MA Economics",
                         "a degree with Maths or Statistics; 12th with Maths is strongly recommended",
                         "after 12th (Maths preferred), take BSc Statistics/Maths, BCom, BBA, BCA, Economics or BTech"),
    "business-analyst": _edu("graduation in BBA, BCom, BTech, BCA or Economics", "an MBA/PGDM for consulting and product BA roles; domain knowledge (banking, retail, healthcare)",
                             "after 12th, take BBA, BCom, BTech, BCA or Economics; then an MBA/PGDM if you aim for senior BA roles"),
    "data-scientist": _edu("BE/BTech, BSc/MSc (Statistics, Maths, CS, Data Science) or MCA", "a master's degree (MSc/MTech/MS) for many roles; strong maths and statistics",
                           "after 12th with Maths, take BTech (CS/IT/Data Science) or BSc Statistics/Maths/CS; consider an MSc/MTech or the IIT Madras BS in Data Science"),
    "ml-engineer": _edu("BE/BTech, ME/MTech, MSc or MCA in CS, IT, AI/ML or Maths", "a master's degree or 1–2 years as a software developer/data scientist",
                        "after 12th with Physics, Chemistry and Maths, take BTech (CS/IT/AI-ML); an MTech/MS helps for research-heavy roles"),
    "ai-prompt-engineer": _edu(f"graduation in {_CS}", "a CS/IT degree with Python and API skills; domain roles (legal, medical, education) also want a degree in that field",
                               _CS_ROUTE),
    "power-bi-tableau-analyst": _edu("graduation in BCom, BBA, BSc (Maths/Statistics/CS), BCA or BTech", "a degree with Maths/Statistics or commerce",
                                     "after 12th (Maths preferred), take BCom, BBA, BSc, BCA or BTech"),
    "sql-database-analyst": _edu(f"graduation in {_CS}", "a CS/IT degree, because DBMS is part of these courses", _CS_ROUTE),
    "ethical-hacker-penetration-tester": _edu("BE/BTech (CS/IT), BCA, BSc (IT/CS/Cyber Security) or MCA",
                                              "a CS/IT/Cyber Security degree plus a recognised security certification; government and defence-linked posts list exact qualifications in each notification",
                                              "after 12th, take BTech (CS/IT/Cyber Security), BCA or BSc (IT/Cyber Security); an MSc/MTech in Cyber Security helps later"),
    "soc-analyst-l1-l2": _edu("BE/BTech (CS/IT), BCA, BSc (IT/CS) or MCA; some L1 roles accept a Diploma in IT/Networking",
                              "a CS/IT degree plus networking and an entry-level security certification",
                              "after 12th, take BCA, BSc (IT/CS) or BTech (CS/IT); after 10th, a Diploma in Computer Engineering/IT"),
    "network-security-engineer": _edu("BE/BTech (CS/IT/ECE), BCA, BSc (IT) or Diploma in Computer/Electronics Engineering",
                                      "a CS/IT/ECE degree plus networking certifications (e.g. CCNA); most companies want network-engineer experience first",
                                      "after 12th, take BTech (CS/IT/ECE), BCA or BSc IT; after 10th, a Diploma in Computer/Electronics Engineering"),
    "cyber-forensics-analyst": _edu("BSc/BTech/BCA in CS, IT or Forensic Science", "an MSc in Digital/Cyber Forensics; government labs list exact qualifications in each recruitment notice",
                                    "after 12th (Science), take BSc Forensic Science, BSc/BTech (CS/IT) or BCA; then an MSc in Digital/Cyber Forensics"),
    "cloud-security-engineer": _edu(f"graduation in {_CS}", "a CS/IT degree plus 2–3 years in cloud, system administration or security (this is not a fresher role)", _CS_ROUTE),
    "bug-bounty-hunter": _edu("platforms do not set a degree, but you must meet each platform's age rules (some need 18+ or guardian consent)",
                              "a CS/IT degree (BTech, BCA, BSc IT/Cyber Security) for the networking and programming base — and for a security job later",
                              "after 12th, take BTech (CS/IT/Cyber Security), BCA or BSc (IT/Cyber Security)"),
    "cloud-engineer-aws-azure-gcp": _CLOUD,
    "devops-engineer": _CLOUD,
    "linux-system-administrator": _edu("Diploma in Computer Engineering/IT, BCA, BSc (IT/CS) or BTech (CS/IT)", "a computer degree or diploma plus a Red Hat certification (RHCSA)",
                                       "after 10th, a Diploma in Computer Engineering/IT; after 12th, BCA, BSc (IT/CS) or BTech (CS/IT)"),
    "network-engineer-ccna": _edu("Diploma in Computer/Electronics/IT, BTech/BE (CS/IT/ECE/EEE), BCA or BSc (IT)", "a CS/IT/ECE degree or diploma plus CCNA",
                                  "after 10th, a Diploma in Computer/Electronics Engineering; after 12th, BTech (CS/IT/ECE), BCA or BSc IT"),
    "docker-kubernetes-engineer": _CLOUD,
    "seo-specialist": _edu("graduation — BBA, BMS, BMM/BJMC (Mass Media), BCom, BA (English) or BSc/BTech", "a marketing or mass-media degree plus a digital marketing certification", _MKT_ROUTE),
    "performance-marketing-manager": _edu("graduation — BBA, BMS, BCom, Economics or BTech", "an MBA/PGDM in Marketing for manager roles; Google Ads and Meta certifications for entry roles",
                                          "after 12th, take BBA, BMS, BCom, Economics or BTech; an MBA/PGDM in Marketing later"),
    "social-media-manager": _edu("graduation — BMM/BJMC (Mass Media/Journalism), BBA, BMS or BA (English)", "a mass-media degree or a PG Diploma (e.g. IIMC) plus Meta certifications", _MKT_ROUTE),
    "content-marketer-strategist": _edu("graduation — BA (English/Journalism), BJMC/Mass Communication or BMM", "a PG Diploma in journalism/digital media (e.g. IIMC) for media and brand roles",
                                        "after 12th, take BA English/Journalism, BJMC or BMM; a PG Diploma later helps"),
    "copywriter": _edu("graduation — BMM/BJMC (Mass Communication), BA (English) or BFA", "a PG Diploma in Advertising & PR (IIMC) or a MICA programme for top agencies",
                       "after 12th, take BMM/BJMC, BA English or BFA; then a PG Diploma in Advertising"),
    "affiliate-marketer": _edu("programmes do not set a degree, but you must be 18+ and own a qualifying website or app (Amazon Associates India rule)",
                               "a graduation in BBA, BMS, BMM or BCom plus SEO/content training — most people keep studying or working alongside, because income is uncertain",
                               _MKT_ROUTE),
    "crm-specialist": _edu("graduation — BBA, BMS, BCom, BCA or BTech", "an MBA/PGDM in Marketing for manager roles; HubSpot or Salesforce certifications",
                           "after 12th, take BBA, BMS, BCom, BCA or BTech; an MBA/PGDM in Marketing later"),
    "sales-executive-bde": _edu("graduation — BBA, BCom, BA, BSc or BTech (most companies ask for a degree)", "an MBA/PGDM in Sales & Marketing for key-account and manager roles; good English plus Hindi/a regional language",
                                "after 12th, take BBA, BCom, BA, BSc or BTech; an MBA/PGDM later for management"),
    "entrepreneur-founder": _edu("there is no degree rule to register a business, but you must be 18+ to sign contracts and register most business types",
                                 "a graduation in your business area (BBA, BCom, BTech or the relevant field) plus entrepreneurship training such as the EDII PGDM or NIESBUD EDPs",
                                 "after 12th, take BBA, BCom, BTech or a degree in your chosen field; then an EDII programme, NIESBUD EDP or an incubator programme; consult a CA before registering"),
}

_COM_ROUTE = "after 12th (Commerce preferred), take BCom/BBA; add Tally and GST training alongside"

EDUCATION.update({
    "accounts-executive-tally-gst": _edu("graduation — BCom is what most job posts ask for; some accept BBA/BMS with accounting subjects",
                                         "BCom/MCom plus Tally and GST training; CA/CMA Intermediate helps for senior accounts roles", _COM_ROUTE),
    "gst-practitioner": _edu("as per Rule 83 of the CGST Rules, an Indian citizen with a graduate/postgraduate degree in Commerce, Law, Banking (including "
                             "Higher Auditing) or Business Administration/Management, or a pass in the final exam of ICAI, ICSI or ICMAI (other routes exist "
                             "for retired tax officers and old sales-tax practitioners); then you must pass the GST Practitioner exam conducted by NACIN",
                             "BCom/MCom or LLB plus hands-on GST return filing practice",
                             "after 12th, take BCom, BBA/BMS or a law degree; after graduation, enrol on the GST portal and clear the NACIN exam"),
    "income-tax-consultant": _edu("graduation in Commerce (BCom/MCom) or Law (LLB) for most tax jobs; to represent clients before income-tax authorities you must "
                                  "fall in a category the Income-tax Act allows, such as chartered accountant or legal practitioner",
                                  "CA or CMA, or BCom plus LLB, for advisory and representation work",
                                  "after 12th (Commerce preferred), take BCom; then CA/CMA, or an LLB if you want to appear before tax authorities as a legal practitioner"),
    "financial-analyst": _edu("graduation — BCom, BBA, BA/BSc Economics, BSc Maths/Statistics or BTech", "an MBA (Finance), CA, CMA or CFA for most analyst roles in good companies",
                              "after 12th (Maths preferred), take BCom, BBA, Economics or BTech; then MBA Finance, CA or CFA"),
    "investment-banker-analyst": _edu("graduation plus, in most firms, an MBA (Finance) from a top B-school, CA or CFA",
                                      "strong academics from a reputed college; IIM/top B-school MBA or CA is the most common entry route in India",
                                      "after 12th, take BCom, BBA, Economics or BTech; then CAT for an MBA, or CA; CFA Level I can run alongside"),
    "stock-market-trader-analyst": _edu("graduation (BCom, BBA, Economics, BSc Maths/Statistics or BTech) for broking and research jobs; dealers in equity derivatives need "
                                        "NISM Series VIII; a SEBI-registered Research Analyst needs a graduate degree plus NISM Series XV (SEBI RA Regulations)",
                                        "a finance degree or MBA (Finance)/CFA for research roles",
                                        "after 12th, take BCom, BBA, Economics or BSc Maths; clear NISM VIII/XV during or after graduation"),
    "mutual-fund-advisor": _edu("to sell mutual funds: pass NISM Series V-A and get an ARN from AMFI; to give fee-based advice as a SEBI-registered Investment "
                                "Adviser: a graduate degree plus NISM Series X-A and X-B; most company jobs also ask for graduation",
                                "BCom/BBA/Economics graduation; CFP or CFA for advisory roles",
                                "after 12th, take BCom/BBA; clear NISM V-A (you can start as a distributor), then NISM X-A/X-B for advisory work"),
    "sap-fico-consultant": _edu("graduation in Commerce or Finance (BCom/MCom, BBA/MBA Finance) or a CA/CMA qualification — consultants must understand accounting",
                                "CA, CMA or MBA Finance plus the SAP Financial Accounting certification (C_TS4FI)",
                                "after 12th, take BCom; then CA/CMA/MBA Finance and SAP FI training; BTech graduates need strong accounting basics first"),
    "financial-modeler": _edu("graduation — BCom, BBA, Economics, BSc Maths/Statistics or BTech", "an MBA (Finance), CA, CMA or CFA plus advanced Excel and a modelling certificate",
                              "after 12th (Maths preferred), take BCom, BBA, Economics or BTech; then MBA Finance/CA/CFA"),
    "ca-chartered-accountant": _edu("ICAI rules: Foundation route — register after Class 10 and appear in the Foundation exam after appearing in Class 12; Direct Entry "
                                    "to Intermediate — Commerce graduates/post-graduates with at least 55%, other graduates/post-graduates with at least 60%, or ICSI/ICMAI "
                                    "Intermediate-pass students", "Commerce in Class 11–12 (Accountancy and Maths make Foundation easier)",
                                    "Class 10 → register with ICAI Board of Studies → Class 12 + Foundation → Intermediate → 2-year Practical Training → Final"),
    "cma-cost-accountant": _edu("ICMAI rules: admission to Foundation after Class 10, Foundation exam after Class 12; direct entry to Intermediate for graduates "
                                "(except fine/performing arts), engineers, engineering students after 3rd year, or ICAI Intermediate-pass students",
                                "Commerce in Class 11–12 or a BCom degree",
                                "Class 12 → Foundation → Intermediate (2 groups) → 15 months practical training → Final (2 groups)"),
    "cs-company-secretary": _edu("ICSI rules: CSEET for Indian nationals who have passed or are appearing in Class 12; graduates/post-graduates, CS Foundation pass, "
                                 "CA Intermediate pass and CMA Final pass students are exempt from CSEET and can register directly for CS Executive",
                                 "Commerce or Law background (BCom, BBA LLB, LLB)",
                                 "Class 12 → CSEET → CS Executive → CS Professional → 21-month practical training → membership"),
    "acca": _edu("ACCA's minimum entry is two A Levels and three GCSEs (or equivalent) in five subjects including English and Maths — Indian Class 12 results "
                 "are assessed against this; if you don't meet it, start with ACCA Foundations in Accountancy, which has no academic entry requirement",
                 "Commerce with Accountancy/Maths and good English; BCom, CA or CMA graduates get some exemptions",
                 "Class 12 → ACCA registration (or FIA first) → Applied Knowledge → Applied Skills → Strategic Professional + ethics module + 36 months experience"),
    "cfa": _edu("CFA Institute rules: a bachelor's degree, or a final-years undergraduate whose Level I exam is 23 months or less before graduation, or 4,000 hours of "
                "work and/or higher education over at least three sequential years; plus a valid international passport",
                "a finance, commerce, economics or maths background; many candidates are MBA, CA or finance graduates",
                "after 12th, take BCom, BBA, Economics or BTech; register for Level I in your final undergraduate years or after graduation"),
})

# Short labels for the quick-facts box where the full rule is too long.
_SHORT = {
    "gst-practitioner": "Graduation in Commerce/Law/Banking/Business (CGST Rule 83) + NACIN exam",
    "income-tax-consultant": "BCom/MCom or LLB; CA/CMA preferred",
    "investment-banker-analyst": "Graduation + MBA (Finance), CA or CFA",
    "stock-market-trader-analyst": "Graduation + NISM certification (VIII / XV)",
    "mutual-fund-advisor": "NISM V-A + AMFI ARN (distributor); graduation + NISM X-A/X-B (adviser)",
    "sap-fico-consultant": "BCom/MCom, MBA Finance or CA/CMA",
    "ca-chartered-accountant": "Class 12 (Foundation) or graduation with 55%/60% (Direct Entry)",
    "cma-cost-accountant": "Class 12 (Foundation) or graduation (Direct Entry)",
    "cs-company-secretary": "Class 12 + CSEET, or graduation (CSEET exempt)",
    "acca": "Class 12 meeting ACCA entry rules, or Foundations in Accountancy",
    "cfa": "Bachelor's degree (or final-years student) or 4,000 hours work/education",
    "accounts-executive-tally-gst": "BCom (most job posts)",
}
EDUCATION.update({k: (v, EDUCATION[k][1]) for k, v in _SHORT.items()})
