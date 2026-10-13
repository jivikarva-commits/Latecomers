"""Emerging Tech — beginner guides for blockchain/Web3, drones, EV, IoT and robotics.

Facts checked on 2026-10-13 against official sources: DGT CTS curriculum 'Mechanic Electric Vehicle' (2 years, Class 10,
min. age 14); C-DAC ACTS admission booklet (PGCP-ESD with IoT module, PGCP-RAT robotics, 24 weeks, 55%); Drone Rules 2021
(weight categories, Remote Pilot Certificate) and DigitalSky; Income Tax Department guidance on Virtual Digital Assets
(30% tax, 1% TDS) and FIU-IND registration of VDA service providers under PMLA (2023); e-Yantra (IIT Bombay);
ethereum.org and Solidity documentation. No salary figures are given because there is no official source for them.
"""
from copy import deepcopy

from career_catalog import slugify
from gov_guide_kit import fact, institute, paper, related, source, stage, step
from tech_guides import CDAC_URL, IITM, JOB_STEPS, _guide

BACK = ["/careers-explore?field=emerging", "← All Emerging Tech careers"]
GROUP = "Future-ready Roles"
LABELS = {"nav": {"role": "What you do", "steps": "Start to end", "eligibility": "Education & eligibility", "exam": "Hiring / licensing",
                  "passing": "Job-ready checklist", "calendar": "Timeline", "prepare": "How to learn", "salary": "Career growth", "faqs": "FAQs",
                  "institutes": "Top institutes", "government-sources": "Sources"}}


def _em(slug, title, short, headline, summary, *, icon="Cpu", **kw):
    return _guide(slug, title, short, headline, summary, group=GROUP, scope_prefix="Emerging Tech", back=BACK, icon=icon, color="#7C3AED",
                  category="Emerging Tech", labels=LABELS, test_topics="", interview_topics="", assignment="", **kw)


def _tech_hire(test, interview, task):
    return [
        stage("Round 1 — Resume and projects", "Before tests", "Projects and GitHub matter a lot in emerging tech.",
              [paper("Resume + GitHub/portfolio", "Links", "—", "Show working demos")], "Relevant projects."),
        stage("Round 2 — Technical test", "Common", "Basics of the field.", [paper(test, "MCQ / coding / circuit", "45–90 min", "Practise timed")], "Pass cut-off."),
        stage("Round 3 — Technical interview + task", "1–2 rounds", "Depth and hands-on ability.",
              [paper(interview, "Discussion", "30–60 min", "Explain your design"), paper(task, "Take-home / live", "Hours–days", "Working, tested result")], "Strong reasoning."),
        stage("Round 4 — HR / offer", "Final", "Fit and expectations.", [], "Offer."),
    ]


def _extra(tools, projects, questions):
    return [
        {"id": "tools", "nav": "Tools", "heading": "Tools and tech you will use", "columns": ["Tool", "Used for"], "rows": tools},
        {"id": "projects", "nav": "Portfolio projects", "heading": "Projects to build", "columns": ["Project", "What it proves"], "rows": projects},
        {"id": "interview-questions", "nav": "Interview questions", "heading": "Interview questions to practise", "items": questions},
    ]


# ---------- Institutes / official resources ----------
CDAC_ESD = institute("C-DAC — PG Certificate Programme in Embedded Systems Design (PGCP-ESD)", "Government (MeitY) · C-DAC ACTS", CDAC_URL,
                     "Embedded C, microcontrollers, embedded OS and drivers, RTOS, Internet of Things and Edge AI, with a project.",
                     "Engineering graduates moving into embedded and IoT work.", mode="Physical only", duration="24 weeks full-time",
                     fee="₹99,000 + GST (booklet)", eligibility="C-DAC common eligibility with 55%; admission through C-CAT (Sections A+B+C)")
CDAC_RAT = institute("C-DAC — PG Certificate Programme in Robotics & Allied Technologies (PGCP-RAT)", "Government (MeitY) · C-DAC ACTS", CDAC_URL,
                     "Robotics, automation and allied technologies with hands-on labs and a project.", "Engineers moving into robotics.",
                     mode="Physical only", duration="24 weeks full-time", fee="₹99,000 + GST (booklet)",
                     eligibility="C-DAC common eligibility or a graduate in Mechatronics/Mechanical Engineering, with 55%")
NPTEL = institute("NPTEL / SWAYAM (IITs and IISc)", "Government of India online courses", "https://nptel.ac.in/",
                  "Free courses in blockchain, IoT, robotics, embedded systems and electric vehicles taught by IIT/IISc faculty, with optional proctored certification exams.",
                  "Students and working professionals building fundamentals.", mode="Online", fee="Free to learn (exam fee for certificate)")
EYANTRA = institute("e-Yantra (IIT Bombay, MoE-funded)", "Robotics education initiative", "https://www.e-yantra.org/",
                    "Robotics competitions, lab programmes and project-based learning for engineering students.", "Students who want hands-on robotics projects.",
                    mode="Online + project-based", fee="Free for students (competition)")
ETHEREUM = institute("ethereum.org — developer resources", "Official Ethereum documentation", "https://ethereum.org/en/developers/",
                     "Smart contracts, development frameworks, tutorials and security basics.", "Blockchain/Web3 beginners.", mode="Online", fee="Free")
SOLIDITY = institute("Solidity documentation", "Official language docs", "https://docs.soliditylang.org/",
                     "The main smart-contract language for Ethereum-compatible chains, with security considerations.", "Smart-contract developers.", mode="Online", fee="Free")
LFDT = institute("LF Decentralized Trust (formerly Hyperledger)", "Linux Foundation open-source foundation", "https://www.lfdecentralizedtrust.org/",
                 "Enterprise blockchain projects such as Hyperledger Fabric, with training resources.", "Developers targeting enterprise blockchain.", mode="Online")
DGT_EV = institute("ITI — Mechanic Electric Vehicle (DGT, Craftsmen Training Scheme)", "Directorate General of Training (MSDE)",
                   "https://www.dgt.gov.in/sites/default/files/2024-01/Mechanic%20Electric%20Vehicle_CTS2.0_NSQF-4.pdf",
                   "Motors, motor controllers, battery packs and BMS, charging systems and regenerative braking; leads to the National Trade Certificate.",
                   "10th-pass students who want hands-on EV service jobs.", mode="Full-time at ITIs", duration="2 years",
                   eligibility="Passed Class 10; minimum age 14")
ASDC = institute("Automotive Skills Development Council (ASDC)", "Sector Skill Council (MSDE)", "https://asdc.org.in/",
                 "NSQF qualifications for automotive and EV job roles through training partners.", "Learners wanting short EV/automotive skill certificates.",
                 mode="Through training partners")
DIGITALSKY = institute("DigitalSky (DGCA) — drone registration and RPTOs", "Ministry of Civil Aviation / DGCA", "https://digitalsky.dgca.gov.in/",
                       "Drone registration, airspace map and the list of DGCA-authorised Remote Pilot Training Organisations.",
                       "Every drone pilot and operator.", mode="Online")
MOCA = institute("Ministry of Civil Aviation — Drone Rules, 2021", "Government of India", "https://www.civilaviation.gov.in/",
                 "Drone categories, Remote Pilot Certificate, registration, airspace zones and operations rules.", "Drone pilots and businesses.", mode="Online")
NIELIT = institute("NIELIT", "Government (MeitY) institute", "https://www.nielit.gov.in/",
                   "Short-term and long-term courses in IoT, embedded systems, electronics and emerging technologies at centres across India.",
                   "Diploma/degree students wanting affordable government courses.", mode="Classroom/online (varies)")

# ---------- Guides ----------
BLOCKCHAIN = _em(
    "blockchain-developer", "Blockchain Developer", "Blockchain", "How to become a Blockchain Developer",
    "A blockchain developer builds systems on distributed ledgers — smart contracts, tokens, enterprise blockchains and the backend that connects them to apps. "
    "Strong general programming comes first, because blockchain code is still software that must be tested and secured. "
    "Smart-contract bugs can lose real money, so careful testing and security reviews are a core part of the job.",
    icon="Blocks",
    duties=["Design and write smart contracts", "Build blockchain backends and APIs", "Test and audit contracts for security", "Work with enterprise blockchain frameworks",
            "Optimise gas/cost and performance", "Document and maintain code"],
    postings=["Fintech, Web3 startups, enterprise blockchain teams, consulting, supply-chain and identity projects"],
    facts=[fact("Education", "BTech/BCA/BSc CS/MCA"), fact("Core skills", "Programming, data structures, cryptography basics"), fact("Languages", "Solidity, JavaScript/TypeScript, Go/Rust"),
           fact("Tools", "Hardhat/Foundry, testnets, wallets"), fact("India tax note", "VDA income taxed at 30% with 1% TDS"), fact("Hiring rounds", "Coding → smart-contract task → interview")],
    levels=[["Beginner", "Blockchain concepts and one language"], ["Intermediate", "Smart contracts with tests on a testnet"], ["Job-ready", "Secure, audited dApp/backend projects"]],
    steps=[step("Strong programming base", "Months 1–3",
                "Learn JavaScript/TypeScript or Go, data structures and Git. "
                "Build a few normal software projects first, such as an API or a small web app, so coding feels comfortable. "
                "Weak core programming is one of the most common reasons beginners struggle in blockchain."),
           step("Blockchain fundamentals", "Months 2–4",
                "Learn hashing, digital signatures, consensus, wallets and transactions. "
                "Use the official ethereum.org developer documentation and try sending test transactions with a wallet on a testnet. "
                "Understanding how a transaction is signed and confirmed makes smart contracts much easier to follow."),
           step("Smart contracts", "Months 3–6",
                "Learn Solidity with Hardhat or Foundry, and write tests for every contract. "
                "Start with a simple token and test every function, including what should fail. "
                "Contracts are hard to change once deployed, so testing is part of writing them, not an extra."),
           step("Security", "Months 5–8",
                "Learn the common smart-contract vulnerabilities and how to use audit checklists. "
                "Read the security considerations in the Solidity documentation and review sample contracts for issues such as re-entrancy. "
                "Skipping security is a serious mistake, because bugs can lose real money."),
           step("Build and deploy projects", "Months 6–9",
                "Deploy your contracts on testnets with a working front end. "
                "Testnets let you show a complete, working project without spending real crypto. "
                "A deployed project with tests and a clear README is much stronger than tutorial code."), *JOB_STEPS],
    hiring=_tech_hire("Programming and blockchain basics", "Smart-contract design, security, gas optimisation and your projects", "Write and test a small smart contract"),
    checklist=["You can write and test smart contracts.", "You know common security issues.", "You have deployed projects.", "You understand India's VDA rules at a basic level."],
    timeline=[("Programming", "Months 1–3"), ("Blockchain basics", "Months 2–4"), ("Smart contracts", "Months 3–6"), ("Security + projects", "Months 5–9")],
    prep=[{"phase": "Build", "duration": "Months 1–9", "focus": ["Solidity", "Testing", "Security"]}],
    resources=[{"label": "ethereum.org developers", "url": "https://ethereum.org/en/developers/", "note": "Official docs."}, {"label": "Solidity docs", "url": "https://docs.soliditylang.org/", "note": "Language reference."}],
    ladder=[["Start", "Junior Blockchain Developer", "0–2 years", "Contracts and backend"], ["Mid", "Blockchain Developer", "2–5 years", "Own modules"], ["Senior", "Lead / Security Auditor", "5+ years", "Architecture and audits"]],
    special=["In India, income from transferring virtual digital assets is taxed at 30% with 1% TDS, and VDA service providers must register with FIU-IND under PMLA.",
             "Smart-contract bugs can lose real money — testing and audits are essential."],
    mistakes=["Skipping security.", "Only tutorials, no deployed projects.", "Weak core programming."],
    faqs=[{"q": "Is crypto legal in India?", "a": "Trading is not banned; it is taxed (30% + 1% TDS), and service providers must register with FIU-IND. Rules can change."},
          {"q": "Which language first?", "a": "Start with Solidity for Ethereum-compatible chains, with JavaScript/TypeScript for tooling. "
                                              "Make sure your general programming is solid before you start Solidity. "
                                              "Go or Rust are useful later if you move towards protocol or enterprise work."},
          {"q": "Do enterprises use blockchain?", "a": "Yes, for supply chain, identity and records — often with permissioned frameworks like Hyperledger Fabric. "
                                                       "Hyperledger Fabric is now part of LF Decentralized Trust, which offers training resources. "
                                                       "Enterprise roles usually value strong backend skills along with blockchain knowledge."}],
    related_items=[related("web3-developer", "Web3 Developer", "dApps"), related("iot-engineer", "IoT Engineer", "Connected devices"), related("robotics-engineer", "Robotics Engineer", "Emerging tech")],
    institutes=[ETHEREUM, SOLIDITY, LFDT, NPTEL],
    sources=[source("FIU-IND", "https://fiuindia.gov.in/", "PMLA registration of VDA service providers."), source("ethereum.org", "https://ethereum.org/en/developers/", "Developer documentation.")],
    extra_sections=_extra([["Solidity", "Smart contracts"], ["Hardhat / Foundry", "Testing and deployment"], ["Wallets + testnets", "Testing transactions"], ["Node providers", "Blockchain access"]],
                          [["ERC-20 token with full tests", "Contract basics"], ["Escrow or voting dApp", "End-to-end app"], ["Security review of a sample contract", "Audit thinking"]],
                          ["What is a smart contract?", "Explain re-entrancy.", "How do you reduce gas costs?", "Public vs permissioned blockchains?"]),
)

WEB3 = _em(
    "web3-developer", "Web3 Developer", "Web3", "How to become a Web3 Developer",
    "A Web3 developer builds decentralised apps (dApps) — front ends that connect to wallets and smart contracts, plus the APIs and indexing around them. "
    "It is mainly web development with React and TypeScript, plus wallet and contract integration. "
    "Web3 hiring rises and falls with the crypto market, so strong general web skills keep you employable either way.",
    icon="Globe",
    duties=["Build dApp front ends", "Connect wallets and sign transactions", "Integrate smart contracts", "Index and display on-chain data", "Handle security and UX of transactions", "Collaborate with contract developers"],
    postings=["Web3 startups, fintech, NFT/gaming studios, blockchain infrastructure companies"],
    facts=[fact("Education", "BTech/BCA/BSc CS/MCA"), fact("Core skills", "React/Next.js, TypeScript, wallet integration"), fact("Also needs", "Basic Solidity"),
           fact("Hiring rounds", "Coding → dApp task → interview"), fact("India tax note", "VDA income taxed at 30% with 1% TDS")],
    levels=[["Beginner", "Web development + blockchain basics"], ["Intermediate", "Wallet connect, contract calls"], ["Job-ready", "Full dApp with good UX and security"]],
    steps=[step("Web development", "Months 1–4",
                "Learn HTML, CSS, JavaScript/TypeScript and React. "
                "Build and deploy a few normal web apps first, because a dApp is a web app with extra pieces. "
                "Weak web fundamentals are a common reason Web3 learners get stuck."),
           step("Blockchain basics", "Months 3–5",
                "Learn about wallets, transactions, gas and networks. "
                "Install a wallet, switch to a free testnet and send a few test transactions to see how they work. "
                "This helps you design screens that explain each transaction clearly to users."),
           step("Wallet and contract integration", "Months 4–6",
                "Learn to connect wallets and call contracts using libraries such as ethers or viem. "
                "Build a page that connects a wallet, reads data from a contract and sends a transaction. "
                "Handle pending, failed and rejected transactions gracefully, because poor transaction UX is a common mistake."),
           step("Basic Solidity", "Months 5–7",
                "Learn to read and write simple contracts in Solidity. "
                "You do not need to be a contract expert, but you should understand the functions your front end calls. "
                "This also helps you work smoothly with contract developers on your team."),
           step("Build dApps", "Months 6–9",
                "Build complete dApps and deploy them to testnets with a polished UI. "
                "Choose projects such as a wallet-connected dashboard or a mint page that show the full flow from wallet to contract. "
                "Live testnet demos give recruiters something real to try."), *JOB_STEPS],
    hiring=_tech_hire("JavaScript/React and blockchain basics", "Wallet flows, transaction states, security and your dApps", "Build a small dApp feature"),
    checklist=["You build React apps well.", "You can connect wallets and call contracts.", "You handle transaction errors gracefully.", "You have deployed dApps."],
    timeline=[("Web dev", "Months 1–4"), ("Blockchain basics", "Months 3–5"), ("Integration", "Months 4–7"), ("dApps", "Months 6–9")],
    prep=[{"phase": "Build", "duration": "Months 1–9", "focus": ["React", "Wallets", "Projects"]}],
    resources=[{"label": "ethereum.org developers", "url": "https://ethereum.org/en/developers/", "note": "Official docs."}],
    ladder=[["Start", "Junior Web3 Developer", "0–2 years", "Front ends"], ["Mid", "Web3 / Full-stack Developer", "2–5 years", "Products"], ["Senior", "Lead Engineer", "5+ years", "Architecture"]],
    special=["Web3 jobs depend on the crypto market cycle — strong general web skills keep you employable either way."],
    mistakes=["Weak web fundamentals.", "Poor transaction UX.", "Ignoring security warnings."],
    faqs=[{"q": "Web3 vs blockchain developer?", "a": "Web3 developers focus on dApps and front ends; blockchain developers focus more on contracts and protocol or back-end work. "
                                                      "If you enjoy building user interfaces, Web3 development is the easier entry. "
                                                      "If you prefer logic, security and back-end systems, the blockchain developer path may suit you better."},
          {"q": "Do I need crypto to learn?", "a": "No — use free testnets. "
                                                   "Testnets work like the real networks but use test tokens that have no money value. "
                                                   "You can build, deploy and demo complete projects without buying any cryptocurrency."},
          {"q": "Is a degree needed?", "a": "Most companies ask for a CS degree; strong projects matter a lot. "
                                            "Degrees such as BTech, BCA, BSc CS or MCA are the usual entry routes. "
                                            "Deployed dApps on GitHub help you stand out on top of your degree."}],
    related_items=[related("blockchain-developer", "Blockchain Developer", "Contracts"), related("iot-engineer", "IoT Engineer", "Emerging tech"), related("robotics-engineer", "Robotics Engineer", "Emerging tech")],
    institutes=[ETHEREUM, SOLIDITY, NPTEL, IITM],
    sources=[source("ethereum.org", "https://ethereum.org/en/developers/", "Developer documentation."), source("FIU-IND", "https://fiuindia.gov.in/", "VDA service-provider registration.")],
    extra_sections=_extra([["React / Next.js", "Front end"], ["ethers / viem", "Wallet and contract calls"], ["Wallets", "Signing"], ["Indexers / subgraphs", "On-chain data"]],
                          [["Wallet-connected dashboard", "Integration"], ["NFT mint page on testnet", "Full flow"], ["Token swap UI (testnet)", "Transaction UX"]],
                          ["How does a wallet sign a transaction?", "How do you handle pending/failed transactions?", "What is gas?", "Explain your dApp's architecture."]),
)

DRONE = _em(
    "drone-pilot-operator", "Drone Pilot / Operator", "Drone Pilot", "How to become a Drone Pilot / Operator",
    "A drone pilot flies drones for agriculture spraying, surveys and mapping, inspections, security, media and deliveries — legally under India's Drone Rules, 2021. "
    "Most commercial flying needs a Remote Pilot Certificate, which you get after training and a test at a DGCA-authorised Remote Pilot Training Organisation (RPTO). "
    "After certification, you build experience in a speciality such as agriculture, survey or inspection work.",
    icon="Plane",
    duties=["Plan missions and check airspace zones", "Fly safely and capture data", "Follow the Drone Rules and permissions", "Maintain drones and batteries",
            "Process survey/mapping data (for technical roles)", "Keep flight logs"],
    postings=["Agri-drone services, survey and mapping firms, infrastructure inspection, media, defence/police, startups"],
    facts=[fact("Education", "Remote Pilot Certificate"), fact("Eligibility", "Age 18–65, Class 10 pass"), fact("Training", "DGCA-authorised RPTO + test"),
           fact("Categories", "Nano ≤250 g, micro ≤2 kg, small ≤25 kg, medium ≤150 kg, large >150 kg"), fact("No certificate needed", "Nano drones; micro drones for non-commercial use"),
           fact("Platform", "DigitalSky (registration, airspace map)")],
    levels=[["Trainee", "Simulator and supervised flights"], ["Certified pilot", "Safe operations within rules"], ["Specialist", "Survey, agri-spray or inspection missions"]],
    steps=[step("Learn the rules", "Week 1",
                "Learn the drone categories, registration, airspace zones and prohibited areas under the Drone Rules, 2021. "
                "Open the DigitalSky airspace map and practise checking green, yellow and red zones for places near you. "
                "Knowing the rules keeps you legal and is also tested during training."),
           step("Train at a DGCA-authorised RPTO", "Usually 1–2 weeks (varies)",
                "Complete the training and proficiency test at a DGCA-authorised RPTO, after which the certificate is issued via DigitalSky. "
                "Pick your RPTO from the official list on DigitalSky, and check which drone category the course covers before you pay. "
                "Use simulator practice to prepare for the flying part of the test."),
           step("Choose a speciality", "After certificate",
                "Choose a speciality such as agriculture spraying, survey and mapping, inspection or media. "
                "Agriculture, survey and inspection work are among the fastest-growing areas. "
                "A clear speciality helps you learn the right software and find the right employers."),
           step("Learn the software", "Months 1–3",
                "Learn mission planning and data processing software for your speciality. "
                "Survey work needs mapping software, while agriculture work needs spray planning and field data skills. "
                "Pilots who can also process and deliver data are more useful to employers."),
           step("Get experience", "Months 1–6",
                "Work with drone service companies to build real flying hours and mission experience. "
                "Keep a flight log for every mission, recording the location, purpose and any problems. "
                "A good safety record and clean logs make you more trusted for bigger projects."),
           step("Grow", "Later",
                "Grow into a senior pilot, a trainer or the owner of your own drone service. "
                "Becoming an RPTO instructor or running a business needs strong experience and a clean safety record. "
                "Keep checking the latest rules on the Ministry of Civil Aviation and DigitalSky websites as they can change.")],
    hiring=[stage("Stage 1 — RPTO training", "1–2 weeks (varies)", "Theory + practical flying.", [paper("Proficiency test", "Practical + theory", "As per RPTO", "Practise on simulators")], "Pass the test."),
            stage("Stage 2 — Remote Pilot Certificate", "After passing", "Issued through DigitalSky.", [], "Certificate issued."),
            stage("Stage 3 — Job interview / field test", "Employers", "Flying test and mission planning.", [], "Selection."),
            stage("Stage 4 — On-site work", "Ongoing", "Missions with logs and permissions.", [], "Safe, compliant operations.")],
    checklist=["You hold a Remote Pilot Certificate where required.", "You check airspace zones every flight.", "You maintain logs and equipment.", "You know your speciality's software."],
    timeline=[("Rules", "Week 1"), ("RPTO training", "1–2 weeks"), ("Experience", "Months 1–6")],
    prep=[{"phase": "Certify", "duration": "Weeks", "focus": ["Rules", "RPTO"]}, {"phase": "Specialise", "duration": "Months", "focus": ["Agri/survey/inspection"]}],
    resources=[{"label": "DigitalSky", "url": "https://digitalsky.dgca.gov.in/", "note": "Registration, airspace map, RPTO list."},
               {"label": "Ministry of Civil Aviation", "url": "https://www.civilaviation.gov.in/", "note": "Drone Rules."}],
    ladder=[["Start", "Drone Pilot", "0–2 years", "Missions"], ["Mid", "Senior Pilot / Mission Planner", "2–5 years", "Teams"], ["Senior", "Operations head / RPTO instructor / own business", "5+ years", "Business"]],
    special=["Always check the DigitalSky airspace map — red and yellow zones need permission.", "Agriculture spraying must follow approved pesticide and drone-use guidelines."],
    mistakes=["Flying without checking zones.", "Skipping maintenance.", "No logs or insurance."],
    faqs=[{"q": "Who needs a Remote Pilot Certificate?", "a": "Everyone needs one except those flying nano drones, or micro drones for non-commercial purposes. "
                                                              "Nano drones weigh up to 250 g, and micro drones weigh up to 2 kg. "
                                                              "If you plan to fly anything larger than a nano drone for work, you will need the certificate, so check the latest rules on DigitalSky before you start."},
          {"q": "What is the eligibility?", "a": "You must be aged 18–65 and have passed Class 10, and you must complete training and a test at a DGCA-authorised RPTO. "
                                                 "The certificate is then issued through DigitalSky. "
                                                 "Check the current requirements on DigitalSky before you enrol, as rules can change."},
          {"q": "Which field has most jobs?", "a": "Agriculture spraying, survey and mapping, and inspections are growing fastest. "
                                                   "Agri-drone service companies, survey firms and infrastructure inspection teams hire pilots for these missions. "
                                                   "Pilots who also learn the mapping or spraying software for their field find work more easily."}],
    related_items=[related("robotics-engineer", "Robotics Engineer", "Autonomous systems"), related("iot-engineer", "IoT Engineer", "Sensors"), related("ev-technician-engineer", "EV Technician", "Batteries")],
    institutes=[DIGITALSKY, MOCA, NPTEL, NIELIT],
    sources=[source("DigitalSky (DGCA)", "https://digitalsky.dgca.gov.in/", "Registration, airspace and RPTOs."), source("Ministry of Civil Aviation", "https://www.civilaviation.gov.in/", "Drone Rules, 2021.")],
    extra_sections=_extra([["Drone + controller", "Flying"], ["DigitalSky", "Registration and zones"], ["Mission-planning apps", "Automated flights"], ["Mapping software", "Survey outputs"]],
                          [["Field mapping mission", "Survey skill"], ["Agri-spray practice plan", "Agriculture use"], ["Inspection video of a structure", "Inspection skill"]],
                          ["Explain the drone categories.", "What are green/yellow/red zones?", "Your pre-flight checklist?", "What do you do on signal loss?"]),
)

EV = _em(
    "ev-technician-engineer", "EV Technician / Engineer", "Electric Vehicles", "How to become an EV Technician / Engineer",
    "EV technicians service electric two-, three- and four-wheelers — batteries, motors, controllers and chargers — while EV engineers design and test these systems. "
    "Technicians usually enter through an ITI or diploma, while engineers usually come through a BTech. "
    "High-voltage safety is essential at every level, because battery packs can be dangerous.",
    icon="BatteryCharging",
    duties=["Diagnose EV faults with tools and software", "Service batteries, BMS, motors and controllers", "Install and maintain chargers", "Follow high-voltage safety",
            "(Engineers) design and test powertrains and battery packs", "Document repairs and tests"],
    postings=["EV makers, dealerships and service centres, charging companies, battery manufacturers, R&D"],
    facts=[fact("Education", "ITI/diploma (technician) or BTech (engineer)"), fact("ITI trade", "Mechanic Electric Vehicle — 2 years, Class 10, age 14+"),
           fact("Core skills", "Electrical basics, batteries, diagnostics, safety"), fact("Engineer skills", "Power electronics, motors, BMS, simulation"),
           fact("Skill council", "Automotive Skills Development Council")],
    levels=[["Beginner", "Electrical and vehicle basics"], ["Technician", "Battery/motor/charger servicing"], ["Engineer", "Design, testing and validation"]],
    steps=[step("Choose your level", "After 10th/12th",
                "Choose the ITI EV trade or a diploma if you want technician work, or a BTech if you want engineering work. "
                "The ITI 'Mechanic Electric Vehicle' trade is a hands-on route that starts after Class 10. "
                "Pick based on whether you prefer servicing vehicles or designing and testing systems."),
           step("Electrical fundamentals", "Year 1",
                "Learn circuits, motors, batteries and power electronics. "
                "Practise measuring voltage, current and resistance safely on low-voltage circuits before you touch a vehicle. "
                "Every EV fault you diagnose later depends on these basics."),
           step("High-voltage safety", "Early",
                "Learn insulation checks, the right PPE and isolation procedures for high-voltage systems. "
                "Never work on a battery pack or HV system without proper training, PPE and isolation. "
                "Employers treat safety as the first skill, and ignoring it is a serious mistake."),
           step("Hands-on EV systems", "Ongoing",
                "Work hands-on with the BMS, controllers, chargers and diagnostics software. "
                "Practise reading fault codes and battery health data under a trained supervisor. "
                "Real practice matters more than theory, because employers test whether you can diagnose actual faults."),
           step("Internship / apprenticeship", "During course",
                "Do an internship or apprenticeship with dealers, OEMs or charging companies. "
                "This gives you real service experience and contacts in the industry. "
                "Work hard during the placement, because a good internship can lead to a job offer from the same company."),
           step("Get hired and specialise", "After",
                "After you are hired, specialise in batteries, motors, charging or testing. "
                "Keep learning through short courses, such as NPTEL or ASDC training partner programmes, as the technology changes quickly. "
                "A clear speciality helps you grow into senior technician, engineer or service manager roles.")],
    hiring=_tech_hire("Electrical/automotive basics", "Battery chemistry, BMS, motors, safety and your projects", "Diagnose a fault or analyse test data"),
    checklist=["You follow high-voltage safety.", "You can diagnose common EV faults.", "You understand batteries and BMS.", "You have hands-on training or internship."],
    timeline=[("ITI/diploma or BTech", "2–4 years"), ("Internship", "During course"), ("Job", "After")],
    prep=[{"phase": "Course", "duration": "2–4 years", "focus": ["Electrical basics", "EV systems"]}, {"phase": "Practice", "duration": "Ongoing", "focus": ["Safety", "Diagnostics"]}],
    resources=[{"label": "DGT — Mechanic Electric Vehicle curriculum", "url": "https://www.dgt.gov.in/sites/default/files/2024-01/Mechanic%20Electric%20Vehicle_CTS2.0_NSQF-4.pdf", "note": "Official ITI syllabus."},
               {"label": "NPTEL", "url": "https://nptel.ac.in/", "note": "EV and power electronics courses."}],
    ladder=[["Start", "EV Technician / Graduate Engineer Trainee", "0–2 years", "Service/testing"], ["Mid", "Senior Technician / EV Engineer", "2–5 years", "Systems"], ["Senior", "Service Manager / Lead Engineer", "5+ years", "Teams and design"]],
    special=["High-voltage battery packs can be dangerous — never work without proper training, PPE and isolation."],
    mistakes=["Ignoring HV safety.", "Learning only petrol-vehicle mechanics.", "No hands-on practice."],
    faqs=[{"q": "Can 10th-pass students enter EV jobs?", "a": "Yes — the 2-year ITI 'Mechanic Electric Vehicle' trade needs Class 10 pass and minimum age 14. "
                                                              "It covers motors, controllers, battery packs and BMS, charging systems and regenerative braking. "
                                                              "The course leads to the National Trade Certificate, which helps you apply for EV service jobs."},
          {"q": "Which BTech branch for EV engineering?", "a": "Choose Electrical, Electronics, Mechanical or Automobile engineering; electrical and power electronics knowledge is central. "
                                                               "Whichever branch you pick, add courses or projects in batteries, motors and power electronics. "
                                                               "Free NPTEL courses can fill gaps that your branch does not cover."},
          {"q": "Are there short courses?", "a": "Yes, through ASDC training partners and NPTEL courses. "
                                            "ASDC offers NSQF qualifications for automotive and EV job roles through its training partners. "
                                            "Short courses help you add EV skills, but hands-on practice under supervision is still essential."}],
    related_items=[related("iot-engineer", "IoT Engineer", "Connected vehicles"), related("robotics-engineer", "Robotics Engineer", "Motors and control"), related("drone-pilot-operator", "Drone Pilot", "Batteries")],
    institutes=[DGT_EV, ASDC, NPTEL, NIELIT],
    sources=[source("DGT — Mechanic Electric Vehicle (CTS)", "https://www.dgt.gov.in/sites/default/files/2024-01/Mechanic%20Electric%20Vehicle_CTS2.0_NSQF-4.pdf", "Duration, entry qualification and age.")],
    extra_sections=_extra([["Multimeter / insulation tester", "Electrical checks"], ["Diagnostic software", "Fault codes"], ["BMS tools", "Battery health"], ["HV PPE", "Safety"]],
                          [["Battery pack health report", "Diagnostics"], ["E-bike conversion project (supervised)", "Systems understanding"], ["Charger installation checklist", "Infrastructure"]],
                          ["What does a BMS do?", "How do you isolate an HV system?", "Explain regenerative braking.", "Li-ion vs LFP batteries?"]),
)

IOT = _em(
    "iot-engineer", "IoT Engineer", "IoT", "How to become an IoT Engineer",
    "An IoT engineer builds connected devices and systems — sensors, microcontrollers, firmware, networks and cloud dashboards — for smart homes, factories, agriculture and cities. "
    "The role mixes electronics, embedded programming, networking and cloud skills. "
    "Security matters a lot, because weak IoT devices are common targets for attacks.",
    duties=["Design sensor and microcontroller circuits", "Write embedded firmware", "Connect devices over Wi-Fi/BLE/LoRa/cellular", "Send data to cloud platforms", "Build dashboards and alerts", "Secure devices and data"],
    postings=["Electronics and IoT companies, industrial automation, smart-city projects, agritech, consumer electronics"],
    facts=[fact("Education", "BTech ECE/EEE/CS or BSc Electronics/MCA"), fact("Core skills", "Embedded C, electronics, networking, cloud basics"),
           fact("Course", "C-DAC PGCP-ESD (24 weeks, includes IoT)"), fact("Hiring rounds", "Technical test → hardware/firmware task → interview")],
    levels=[["Beginner", "Arduino/ESP32 sensors and basic code"], ["Intermediate", "Firmware, protocols (MQTT), cloud upload"], ["Job-ready", "End-to-end secure IoT product prototype"]],
    steps=[step("Electronics and C", "Months 1–3",
                "Learn basic circuits, how sensors work and Embedded C. "
                "Build simple circuits on a breadboard, such as reading a temperature sensor and switching an LED. "
                "These basics help you debug hardware problems instead of guessing."),
           step("Microcontrollers", "Months 2–5",
                "Learn Arduino, ESP32 and STM32, and interfaces such as I2C, SPI and UART. "
                "Start with Arduino or ESP32 for learning, then move to STM32 for industry-style work. "
                "Connect different sensors to each board so you learn how each interface behaves."),
           step("Connectivity", "Months 4–6",
                "Learn Wi-Fi, BLE and LoRa, and the MQTT and HTTP protocols. "
                "Build a device that sends sensor readings over Wi-Fi using MQTT and keeps working when the connection drops. "
                "Choosing the right connection for power use and range is a key design skill."),
           step("Cloud and dashboards", "Months 5–8",
                "Learn to store device data in the cloud and build dashboards and alerts. "
                "Make a dashboard that shows live readings and sends an alert when a value crosses a limit. "
                "An end-to-end demo from sensor to dashboard is a strong portfolio project."),
           step("Security", "Months 6–9",
                "Learn secure boot, encryption and safe software updates for devices. "
                "Add encrypted communication and a secure update method to at least one of your projects. "
                "Projects without security are a common weakness, because insecure devices are easy targets."), *JOB_STEPS],
    hiring=_tech_hire("Electronics, C and networking basics", "Microcontrollers, protocols, power, security and your projects", "Build or debug a sensor-to-cloud prototype"),
    checklist=["You can build sensor circuits.", "You write reliable firmware.", "You can send data securely to the cloud.", "You have working IoT projects."],
    timeline=[("Electronics + C", "Months 1–3"), ("Microcontrollers", "Months 2–5"), ("Connectivity", "Months 4–6"), ("Cloud + security", "Months 5–9")],
    prep=[{"phase": "Build", "duration": "Months 1–9", "focus": ["Hardware", "Firmware", "Cloud"]}],
    resources=[{"label": "C-DAC admission booklet", "url": "https://cdac.in/index.aspx?id=edu_acts_admission_booklet", "note": "PGCP-ESD details."}, {"label": "NPTEL", "url": "https://nptel.ac.in/", "note": "IoT courses."}],
    ladder=[["Start", "IoT / Embedded Engineer", "0–2 years", "Firmware and prototypes"], ["Mid", "Senior IoT Engineer", "2–5 years", "Products"], ["Senior", "IoT Architect / Lead", "5+ years", "Systems"]],
    special=["Device security matters — weak IoT devices are common targets for attacks."],
    mistakes=["Ignoring power consumption.", "No security.", "Only simulator projects, no real hardware."],
    faqs=[{"q": "ECE or CS for IoT?", "a": "Both work; ECE helps with hardware, while CS helps with cloud and software. "
                                           "Whichever you choose, learn the other side through projects so you can build a complete system. "
                                           "Employers value people who can work from the sensor all the way to the dashboard."},
          {"q": "Is C-DAC useful?", "a": "Yes — PGCP-ESD includes embedded systems and an IoT module, and C-DAC runs placements. "
                                         "Admission is through the C-CAT entrance test, and the course is full-time and classroom-based. "
                                         "Check the latest C-DAC ACTS admission booklet for eligibility, fees and dates before applying."},
          {"q": "Which board to start with?", "a": "Use Arduino or ESP32 for learning, then move to STM32 for industry-style work. "
                                                   "Arduino is the easiest to start with, while ESP32 adds built-in Wi-Fi and Bluetooth for connected projects. "
                                                   "STM32 boards are closer to what many companies use in real products."}],
    related_items=[related("robotics-engineer", "Robotics Engineer", "Embedded + control"), related("ev-technician-engineer", "EV Engineer", "Embedded in vehicles"), related("blockchain-developer", "Blockchain Developer", "Emerging tech")],
    institutes=[CDAC_ESD, NIELIT, NPTEL, IITM],
    sources=[source("C-DAC ACTS admission booklet", "https://cdac.in/index.aspx?id=edu_acts_admission_booklet", "PGCP-ESD modules, eligibility and fee.")],
    extra_sections=_extra([["ESP32 / STM32", "Microcontrollers"], ["Sensors", "Data capture"], ["MQTT broker", "Messaging"], ["Cloud IoT dashboard", "Visualisation"]],
                          [["Smart-farm soil monitor", "Sensor to cloud"], ["Home energy meter", "Power and data"], ["Secure OTA update demo", "Security"]],
                          ["What is MQTT?", "I2C vs SPI?", "How do you reduce power use?", "How do you secure an IoT device?"]),
)

ROBOT = _em(
    "robotics-engineer", "Robotics Engineer", "Robotics", "How to become a Robotics Engineer",
    "A robotics engineer designs, builds and programs robots — industrial arms, warehouse robots, drones and autonomous systems — combining mechanics, electronics and software. "
    "Robotics is interdisciplinary, so strong maths and programming help more than any single tool. "
    "Most people enter through an engineering degree and build their skills with hands-on projects and competitions.",
    icon="Bot",
    duties=["Design robot mechanisms", "Select sensors and actuators", "Program control and navigation", "Simulate and test robots", "Integrate vision and AI", "Maintain robots in production"],
    postings=["Manufacturing automation, warehouses/logistics, defence, healthcare robotics, research labs, startups"],
    facts=[fact("Education", "BTech Mechatronics/Robotics/Mech/ECE/CS"), fact("Core skills", "Kinematics, control, programming, electronics"), fact("Tools", "ROS, Python/C++, CAD, simulators"),
           fact("Course", "C-DAC PGCP-RAT (24 weeks)"), fact("Projects", "e-Yantra competitions (IIT Bombay)")],
    levels=[["Beginner", "Programming, basic electronics and mechanics"], ["Intermediate", "Build mobile robots with sensors"], ["Job-ready", "ROS-based navigation/manipulation projects"]],
    steps=[step("Maths and programming", "Year 1",
                "Learn linear algebra and programming in Python and C++. "
                "Linear algebra describes how robots move and see, and Python and C++ are the main languages for robot software. "
                "Weak maths is a common reason robotics learners get stuck later."),
           step("Mechanics and electronics", "Years 1–2",
                "Learn how motors, sensors and microcontrollers work. "
                "Build a simple robot such as a line follower or an obstacle-avoiding car to connect these parts together. "
                "Try to understand every part you use instead of only assembling a kit."),
           step("Control and kinematics", "Years 2–3",
                "Learn PID control and forward and inverse kinematics. "
                "Apply them to a real or simulated robot, for example keeping a robot moving in a straight line or moving an arm to a target point. "
                "These topics are common in robotics interviews, so practise explaining them simply."),
           step("ROS and simulation", "Years 2–4",
                "Learn ROS, Gazebo-style simulation and navigation stacks. "
                "Simulators let you test robot behaviour safely before running it on real hardware. "
                "Many robotics jobs use ROS, so a ROS project is a strong addition to your portfolio."),
           step("Competitions and projects", "During degree",
                "Join e-Yantra and your college robotics club for competitions and projects. "
                "The e-Yantra programme, run by IIT Bombay, offers project-based learning that is free for students who take part in its competition. "
                "Real projects that are tested and documented show employers what you can actually build."), *JOB_STEPS],
    hiring=_tech_hire("Maths, programming and engineering basics", "Kinematics, control, ROS, sensors and your robots", "Program a robot behaviour or solve a control problem"),
    checklist=["You can program robots in Python/C++.", "You understand kinematics and control.", "You have used ROS.", "You built physical or simulated robots."],
    timeline=[("Fundamentals", "Years 1–2"), ("Control + ROS", "Years 2–4"), ("Projects", "Throughout")],
    prep=[{"phase": "Degree", "duration": "4 years", "focus": ["Maths", "Control", "Projects"]}, {"phase": "Specialise", "duration": "Optional", "focus": ["C-DAC PGCP-RAT", "MTech"]}],
    resources=[{"label": "e-Yantra", "url": "https://www.e-yantra.org/", "note": "Robotics projects and competitions."}, {"label": "NPTEL", "url": "https://nptel.ac.in/", "note": "Robotics courses."}],
    ladder=[["Start", "Robotics / Automation Engineer", "0–2 years", "Integration"], ["Mid", "Senior Robotics Engineer", "2–5 years", "Systems"], ["Senior", "Lead / Research Engineer", "5+ years", "Architecture/research"]],
    special=["Robotics is interdisciplinary — strong maths and programming help more than any single tool."],
    mistakes=["Only kits without understanding.", "Weak maths.", "No real testing."],
    faqs=[{"q": "Which branch for robotics?", "a": "Mechatronics, Robotics, Mechanical, Electrical/Electronics or CS all work — choose based on whether you prefer hardware or software. "
                                                   "Mechanical and mechatronics lean towards robot design, while electronics and CS lean towards control and software. "
                                                   "Whichever branch you choose, build robot projects that cover the other areas too."},
          {"q": "Is ROS required?", "a": "Many robotics jobs use ROS, so it is a strong skill to have. "
                                         "Learn it through simulation projects first, then try it on a real robot if you can. "
                                         "A ROS navigation or manipulation project helps you stand out in applications."},
          {"q": "Do I need an MTech?", "a": "Not for industry roles; research roles often prefer an MTech or MS. "
                                            "For industry jobs, strong projects and hands-on skills matter more than an extra degree. "
                                            "The C-DAC PGCP-RAT course is another option if you want focused robotics training after engineering."}],
    related_items=[related("iot-engineer", "IoT Engineer", "Embedded systems"), related("drone-pilot-operator", "Drone Pilot", "Autonomous systems"), related("ev-technician-engineer", "EV Engineer", "Motors and control")],
    institutes=[CDAC_RAT, EYANTRA, NPTEL, IITM],
    sources=[source("C-DAC ACTS admission booklet", "https://cdac.in/index.aspx?id=edu_acts_admission_booklet", "PGCP-RAT eligibility and fee."), source("e-Yantra", "https://www.e-yantra.org/", "Robotics programmes.")],
    extra_sections=_extra([["ROS", "Robot software"], ["Python / C++", "Programming"], ["CAD tools", "Mechanical design"], ["Simulators", "Testing"]],
                          [["Line-following / obstacle-avoiding robot", "Basics"], ["ROS navigation in simulation", "Autonomy"], ["Pick-and-place arm", "Manipulation"]],
                          ["Explain PID control.", "Forward vs inverse kinematics?", "How does SLAM work at a high level?", "Walk us through your robot."]),
)

GUIDES = [BLOCKCHAIN, WEB3, DRONE, EV, IOT, ROBOT]
_BY_KEY = {slugify(k): g for g in GUIDES for k in (g["slug"], g["title"])}


def emerging_guide(value):
    g = _BY_KEY.get(slugify(value or ""))
    return deepcopy(g) if g else None
