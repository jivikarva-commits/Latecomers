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

_DES_ROUTE = ("after 12th (any stream), take a B.Des through NID DAT or UCEED (IIT B.Des — IIT Guwahati and Roorkee need PCM), "
              "or a BFA/BVA in Applied Art; an M.Des through CEED or NID DAT after graduation")
_CS_JOB = "graduation in BE/BTech (CS/IT), BCA, BSc (CS/IT) or MCA"
_FILM_ROUTE = ("after 12th, take a bachelor's degree (any discipline; BMM/BJMC/film studies helps), then the 3-year MFA in Cinema at "
               "FTII Pune through FTII-ET or a film course at SRFTI Kolkata — or start as an assistant on sets")

EDUCATION.update({
    "graphic-designer": _edu("a design or fine-arts qualification — B.Des (Communication/Graphic Design), BFA/BVA (Applied Art) or a diploma in graphic/communication design",
                             "a B.Des from NID/IIT or a reputed art college, plus a strong portfolio", _DES_ROUTE),
    "brand-identity-designer": _edu("B.Des (Communication/Graphic Design) or BFA/BVA (Applied Art), usually with 2–3 years as a graphic designer",
                                    "an M.Des (Graphic/Communication Design) or strong branding case studies", _DES_ROUTE),
    "packaging-designer": _edu("B.Des (Communication, Industrial or Product Design) or BFA/BVA (Applied Art); technical packaging roles ask for a PG Diploma in Packaging (IIP), which needs a science/engineering degree with PCM",
                               "design degree plus knowledge of print, materials and dielines", _DES_ROUTE),
    "ui-designer": _edu("graduation in design (B.Des Communication/Interaction, BFA/BVA) or a related field (BCA, BSc IT, BTech) with a UI portfolio",
                        "a B.Des/M.Des in Interaction or Communication Design", _DES_ROUTE),
    "ux-designer-researcher": _edu("graduation in design (B.Des/M.Des Interaction Design), HCI, psychology or a related field",
                                   "an M.Des (Interaction/Information Design) or a master's in HCI/psychology for research roles", _DES_ROUTE),
    "product-designer": _edu("B.Des/M.Des (Interaction, Communication or Product Design) or a related degree, usually with 2–3 years of UI/UX work",
                             "an M.Des from NID/IIT plus shipped product case studies", _DES_ROUTE),
    "video-editor": _edu("graduation in Mass Media/Film (BMM, BJMC, BA Film Studies) or a diploma in film/video editing",
                         "the MFA in Cinema (Editing) at FTII for film careers; a strong edit reel for all roles", _FILM_ROUTE),
    "motion-graphics-designer": _edu("B.Des (Communication/Animation), BFA/BVA (Applied Art) or a diploma in animation/motion graphics",
                                     "a design degree plus a motion reel", _DES_ROUTE),
    "color-grading-artist": _edu("a degree or diploma in film/media, editing or cinematography (BMM, BJMC, film school)",
                                 "film-school training plus DaVinci Resolve certification; most colourists start as editors or assistant colourists", _FILM_ROUTE),
    "reels-short-form-editor": _edu("brands and agencies usually ask for graduation (BMM/BJMC/Mass Media preferred); freelance clients judge your portfolio",
                                    "a mass-media degree plus a reel of short-form edits with results", "after 12th, take BMM/BJMC/Mass Media; learn editing alongside"),
    "2d-3d-animator": _edu("B.Des (Animation Film Design), BFA/BVA (Animation/Applied Art), BSc Animation or a diploma in animation",
                           "a design/animation degree from NID or a reputed college, plus a demo reel", _DES_ROUTE),
    "vfx-artist": _edu("BSc Animation & VFX, B.Des, BFA/BVA or a diploma in VFX/compositing",
                       "a VFX degree or diploma plus a breakdown reel", "after 12th (any stream), take BSc Animation & VFX, B.Des or BFA, or a VFX diploma"),
    "game-designer": _edu("B.Des (Game/Interaction Design), BFA, or BTech/BCA for technical designers",
                          "an M.Des in Digital Game Design or Toy & Game Design (NID) plus playable prototypes", _DES_ROUTE),
    "game-developer-unity-unreal": _edu(_CS_JOB, "a CS degree plus published game projects; Unity certification helps",
                                        "after 12th, take BTech/BE (CS/IT) — needs PCM — or BCA/BSc (CS/IT)"),
    "ar-vr-developer": _edu(_CS_JOB, "a CS degree plus XR projects in Unity/Unreal", "after 12th, take BTech/BE (CS/IT) — needs PCM — or BCA/BSc (CS/IT)"),
    "commercial-photographer": _edu("studios and agencies usually ask for a degree or diploma in photography, fine arts or design (B.Des Photography, BFA)",
                                    "an M.Des in Photography Design (NID) or a professional photography diploma, plus a portfolio",
                                    "after 12th (any stream), take a BFA/B.Des or photography diploma; assist working photographers"),
    "cinematographer-dop": _edu("a degree or diploma in cinematography/film; FTII's MFA (Cinematography) needs a bachelor's degree in any discipline",
                                "film-school training (FTII/SRFTI) and years as a camera assistant", _FILM_ROUTE),
    "film-director": _edu("a bachelor's degree for film schools — FTII's MFA (Direction & Screenplay Writing) needs a degree in any discipline",
                          "film-school training plus short films; many directors start as assistant directors", _FILM_ROUTE),
    "drone-photographer-videographer": _edu("a DGCA Remote Pilot Certificate where the Drone Rules require one: age 18–65, Class 10 pass, and training plus a test at a DGCA-authorised Remote Pilot Training Organisation",
                                            "photography/videography skills and a degree or diploma in media/photography for agency jobs",
                                            "after Class 10/12, train at a DGCA-authorised RPTO; learn photography and editing alongside"),
})
_SHORT_DES = {
    "packaging-designer": "B.Des/BFA; IIP PG Diploma for technical roles",
    "reels-short-form-editor": "Graduation (BMM/BJMC preferred) for jobs",
    "commercial-photographer": "Degree/diploma in photography, fine arts or design",
    "cinematographer-dop": "Film degree/diploma; FTII MFA needs graduation",
    "film-director": "Graduation + film school (FTII/SRFTI)",
    "drone-photographer-videographer": "DGCA Remote Pilot Certificate (18–65, Class 10)",
    "ui-designer": "B.Des/BFA or related degree + UI portfolio",
    "ux-designer-researcher": "B.Des/M.Des, HCI or psychology",
    "product-designer": "B.Des/M.Des + 2–3 years UI/UX",
    "graphic-designer": "B.Des, BFA/BVA (Applied Art) or design diploma",
    "brand-identity-designer": "B.Des/BFA + graphic design experience",
    "video-editor": "BMM/BJMC/film degree or editing diploma",
    "motion-graphics-designer": "B.Des/BFA or animation diploma",
    "color-grading-artist": "Film/media degree or diploma",
    "2d-3d-animator": "B.Des/BFA/BSc Animation or diploma",
    "vfx-artist": "BSc Animation & VFX, B.Des/BFA or VFX diploma",
    "game-designer": "B.Des (Game/Interaction) or BTech/BCA",
}
EDUCATION.update({k: (v, EDUCATION[k][1]) for k, v in _SHORT_DES.items()})

_LLB = ("an LL.B. recognised by the Bar Council of India — the 5-year integrated LL.B. after Class 12 or the 3-year LL.B. after graduation "
        "(BCI's Legal Education Rules set a minimum of 45% in the qualifying exam for General and 40% for SC/ST candidates)")
_MBA = ("graduation (at least 3 years after 10+2) and then an MBA/PGDM; IIMs ask for 50% in graduation (45% for SC/ST/PwD) and a CAT score — "
        "final-year students can apply")
_MBA_ROUTE = "after graduation, take CAT (IIMs and many top B-schools), XAT (XLRI and others) or CMAT (AICTE-approved institutes), then WAT/GD and interview"

EDUCATION.update({
    "lawyer-advocate": _edu(_LLB + "; then enrol with a State Bar Council and pass the All India Bar Examination (AIBE) for the Certificate of Practice",
                            "an LL.B. from a National Law University (through CLAT) or a reputed law college",
                            "after 12th (any stream), take CLAT/AILET or a state law entrance for the 5-year LL.B.; or graduate first and take the 3-year LL.B."),
    "corporate-lawyer": _edu(_LLB + "; law firms also need you enrolled as an advocate",
                             "an LL.B. from an NLU or top law school; an LL.M. or CS qualification helps for company-law work",
                             "after 12th, take CLAT for a 5-year BA/BBA LL.B. at an NLU; internships at law firms every year"),
    "judge-judiciary": _edu("an LL.B. and enrolment as an advocate; for Civil Judge (Junior Division) the Supreme Court (20 May 2025) directed a minimum of "
                            "3 years' practice counted from provisional enrolment, applied through each High Court's recruitment rules; District Judge "
                            "direct recruitment needs at least 7 years as an advocate (Article 233)",
                            "strong LL.B. marks and courtroom practice; age limits and language requirements differ by state",
                            "after 12th, LL.B. (5-year) or graduation + LL.B. (3-year) → enrol with the State Bar Council → practise → state judicial service exam"),
    "mba-marketing-manager": _edu(_MBA, "an MBA/PGDM with Marketing specialisation from a reputed B-school; a BBA/BCom/BMS degree helps", _MBA_ROUTE),
    "mba-finance-manager": _edu(_MBA, "an MBA/PGDM (Finance) — or CA/CFA — with strong accounting basics; BCom/BBA/Economics/engineering degrees are common", _MBA_ROUTE),
    "mba-hr-manager": _edu(_MBA + "; TISS's MA in HRM & Labour Relations and XLRI's HRM programme are specialised routes",
                           "an MBA/PGDM (HR) or MA HRM&LR; psychology or social-science degrees help", _MBA_ROUTE),
    "mba-operations-manager": _edu(_MBA, "an MBA/PGDM (Operations/Supply Chain); engineering degrees are common", _MBA_ROUTE),
})
EDUCATION.update({k: (v, EDUCATION[k][1]) for k, v in {
    "lawyer-advocate": "BCI-recognised LL.B. + Bar enrolment + AIBE",
    "corporate-lawyer": "BCI-recognised LL.B. (NLU preferred)",
    "judge-judiciary": "LL.B. + 3 years' practice (Civil Judge); 7 years (District Judge)",
    "mba-marketing-manager": "Graduation + MBA/PGDM (Marketing)",
    "mba-finance-manager": "Graduation + MBA/PGDM (Finance)",
    "mba-hr-manager": "Graduation + MBA/PGDM (HR) or MA HRM&LR",
    "mba-operations-manager": "Graduation + MBA/PGDM (Operations)",
}.items()})
