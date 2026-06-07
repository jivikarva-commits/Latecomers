import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  BarChart3,
  Bot,
  Briefcase,
  Building2,
  CheckCircle2,
  Download,
  Globe,
  GraduationCap,
  IndianRupee,
  LayoutGrid,
  Lightbulb,
  MapPin,
  Navigation,
  RefreshCw,
  Rocket,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  FolderOpen,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { toast } from "sonner";
import SEO from "../components/SEO";
import BrandClockMark from "../components/BrandClockMark";
import PublicShell from "../components/PublicShell";
import AppLayout from "../components/layout/AppLayout";

const SECTION_ORDER = ["education", "skills", "courses", "tools", "projects", "placement", "jobs"];

const SECTION_META = {
  education: { num: 1, title: "Education", icon: GraduationCap, color: "#7C3AED", bg: "#F3EEFF" },
  skills: { num: 2, title: "Skills to Master", icon: Target, color: "#10B981", bg: "#E6F8F0" },
  courses: { num: 3, title: "Courses (Step by Step)", icon: ClipboardList, color: "#0EA5E9", bg: "#E0F2FE" },
  tools: { num: 4, title: "AI Tools Every Professional Should Learn", icon: Bot, color: "#8B5CF6", bg: "#F1ECFF" },
  projects: { num: 5, title: "Portfolio Projects", icon: FolderOpen, color: "#F97316", bg: "#FFEFE0" },
  placement: { num: 6, title: "Placement Preparation", icon: Rocket, color: "#EC4899", bg: "#FCE7F3" },
  jobs: { num: 7, title: "Jobs You Can Apply For", icon: Briefcase, color: "#5B4FE9", bg: "#EEEAFF" },
};

function asNumber(v, d = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
}

function getStageItems(stages, type) {
  if (!Array.isArray(stages)) return [];
  for (const stage of stages) {
    for (const section of stage.sections || []) {
      if ((section.type || "").toLowerCase() === type) {
        return section.items || [];
      }
    }
  }
  return [];
}

function fieldForTitle(title) {
  return detectField({ title });
}

function roleSpecificFallbacks(title) {
  const field = fieldForTitle(title);
  const presets = {
    tech: {
      education: [
        "12th pass students can start, but must build strong coding fundamentals and a public project portfolio.",
        "BCA/BSc IT/BE/BTech helps for campus jobs, but it is not mandatory for startup and agency roles.",
        "Learn HTML, CSS, JavaScript, React, backend APIs, databases, Git, and deployment with hands-on projects.",
      ],
      skills: ["HTML, CSS, and JavaScript", "React and component thinking", "Node.js or backend APIs", "MongoDB/SQL basics", "Git, GitHub, and deployment", "Debugging and clean code"],
      courses: ["Web development fundamentals", "JavaScript and React", "Backend APIs with Node.js", "Database design", "Git and deployment workflow", "Portfolio project sprint"],
      projects: ["Responsive portfolio website", "Full-stack CRUD app with login", "E-commerce or booking mini app", "API dashboard with database", "Deployed capstone project"],
      placement: ["GitHub profile with pinned projects", "Live demo links for 3 projects", "Resume with tech stack and impact", "Practice JavaScript, API, database, and debugging questions", "Explain each project architecture clearly"],
      tasks: ["Build and improve website/app features", "Connect frontend screens with backend APIs", "Fix bugs and test user flows", "Deploy updates and document code"],
    },
    data: {
      education: [
        "12th pass students can start with Excel and statistics, but graduation helps for analyst hiring.",
        "Commerce, science, engineering, BCA, BSc, BCom, BBA, and MBA backgrounds can enter with the right portfolio.",
        "Learn Excel, SQL, Power BI/Tableau, Python basics, statistics, dashboards, and business storytelling.",
      ],
      skills: ["Advanced Excel", "SQL queries", "Power BI or Tableau dashboards", "Basic statistics", "Python with Pandas", "Business problem framing"],
      courses: ["Excel for analytics", "SQL for data analysis", "Power BI dashboarding", "Statistics basics", "Python data analysis", "Business case study practice"],
      projects: ["Sales dashboard in Power BI", "Customer churn analysis", "Excel MIS report pack", "SQL case study with insights", "Python notebook analysis"],
      placement: ["Portfolio with 3 dashboards", "SQL and Excel test practice", "One-page case study summaries", "Resume with metrics and business impact", "Prepare for scenario-based analyst interviews"],
      tasks: ["Clean and organize data", "Build reports and dashboards", "Find patterns and business insights", "Present recommendations to teams"],
    },
    marketing: {
      education: [
        "12th pass and graduates can start if they build strong communication, research, and campaign proof.",
        "BPO, sales, telecalling, and back-office experience can become a big advantage because customer understanding matters.",
        "Learn content strategy, ads basics, SEO, analytics, Canva, social platforms, and client reporting.",
      ],
      skills: ["Content planning", "Social media strategy", "SEO basics", "Canva and creative briefs", "Analytics and reporting", "Client communication"],
      courses: ["Digital marketing basics", "Social media management", "SEO and content writing", "Performance marketing basics", "Analytics and reporting", "Campaign portfolio building"],
      projects: ["30-day social media calendar", "Instagram campaign case study", "SEO blog content plan", "Ad copy and landing page brief", "Brand audit report"],
      placement: ["Show campaign samples", "Create a simple content portfolio", "Practice client brief questions", "Track metrics like reach, CTR, and leads", "Prepare examples of customer understanding"],
      tasks: ["Plan content and campaigns", "Create posts, briefs, and reports", "Track analytics and improve performance", "Coordinate with designers, clients, or sales teams"],
    },
    design: {
      education: [
        "12th pass students can start with design fundamentals and portfolio work; a degree is helpful but not mandatory.",
        "Graduates from any stream can switch if they learn UI principles, visual design, and user problem solving.",
        "Learn Figma, layout, typography, color, UX research basics, wireframes, and case-study writing.",
      ],
      skills: ["Figma", "Layout and typography", "Color and visual hierarchy", "Wireframing", "UX research basics", "Case-study presentation"],
      courses: ["Design fundamentals", "Figma UI design", "UX research basics", "Design systems", "Portfolio case studies", "Interview design tasks"],
      projects: ["Mobile app redesign", "Landing page UI kit", "Dashboard screen case study", "User flow and wireframe project", "Design system sample"],
      placement: ["Portfolio with 3 case studies", "Show before-after design thinking", "Practice app critique tasks", "Prepare Figma file walkthrough", "Explain user problem and trade-offs"],
      tasks: ["Create wireframes and UI screens", "Improve visual hierarchy", "Review user flows", "Collaborate with developers and product teams"],
    },
    healthcare: {
      education: [
        "Some healthcare roles need specific diplomas/degrees or certifications; check eligibility before joining a course.",
        "12th science is required for many clinical paths, while admin/coding/support roles may allow broader backgrounds.",
        "Learn domain terminology, compliance, patient/customer communication, and the exact tools used in the role.",
      ],
      skills: ["Medical terminology", "Process accuracy", "Compliance basics", "Documentation", "Patient/customer communication", "Tool handling"],
      courses: ["Role-specific healthcare certification", "Medical terminology basics", "Documentation and compliance", "Practical lab/process training", "Interview and workplace readiness"],
      projects: ["Sample patient record workflow", "Terminology flashcard set", "Process checklist", "Case documentation sample", "Accuracy practice log"],
      placement: ["Verify recognized certification", "Prepare process accuracy examples", "Practice scenario questions", "Keep documents ready", "Apply to hospitals, diagnostics, and healthtech firms"],
      tasks: ["Handle role-specific records or procedures", "Follow compliance steps", "Coordinate with healthcare teams", "Maintain accurate documentation"],
    },
    finance: {
      education: [
        "Commerce background helps strongly, but some entry roles allow any graduate with Excel and accounting basics.",
        "CA/CMA/CS/CFA-style paths need formal eligibility and exam commitment.",
        "Learn accounting, taxation, Excel, Tally/Zoho, GST basics, reporting, and compliance discipline.",
      ],
      skills: ["Accounting basics", "Excel", "GST and tax concepts", "Tally or Zoho Books", "Financial reporting", "Compliance discipline"],
      courses: ["Accounting fundamentals", "Excel for finance", "GST and taxation basics", "Tally/Zoho practice", "Financial statements", "Interview case practice"],
      projects: ["GST invoice practice file", "Monthly MIS report", "Tally ledger simulation", "Profit and loss analysis", "Tax calculation worksheet"],
      placement: ["Show Excel/Tally samples", "Practice accounting entries", "Prepare GST and invoice questions", "Apply to CA firms and finance teams", "Keep accuracy examples ready"],
      tasks: ["Maintain records and reports", "Work on invoices, ledgers, and reconciliations", "Support tax/compliance workflows", "Prepare financial summaries"],
    },
    default: {
      education: [
        `Understand the minimum eligibility for ${title} before selecting a course.`,
        "Build practical proof through projects, assignments, internships, or freelance samples.",
        "Focus on communication, tools, and the exact skills employers test for entry-level roles.",
      ],
      skills: [`${title} fundamentals`, "Digital tools", "Communication", "Problem solving", "Portfolio building", "Interview readiness"],
      courses: [`${title} fundamentals`, "Hands-on practical training", "Tool workflow", "Portfolio building", "Job readiness practice"],
      projects: [`${title} starter project`, `${title} case study`, `${title} portfolio sample`, "Client-style assignment", "Final capstone"],
      placement: ["Create a focused resume", "Add proof of work", "Practice role-specific questions", "Apply to local and online openings", "Track applications weekly"],
      tasks: ["Understand requirements", "Complete practical work", "Coordinate with teams", "Improve work using feedback"],
    },
  };
  return presets[field] || presets.default;
}

function fallbackEducationPaths(title) {
  const specific = roleSpecificFallbacks(title).education;
  return [
    {
      heading: "Bachelor's Degree",
      tag: "Recommended",
      body: specific[0],
      duration: "3 - 4 Years",
    },
    {
      heading: "Diploma / Certificate",
      body: specific[1],
      duration: "6 Months - 1 Year",
    },
    {
      heading: "Self Learning",
      body: specific[2],
      duration: "Flexible",
    },
    {
      heading: "Higher Studies (Optional)",
      body: "For specialization, advanced research, or moving into leadership and niche roles.",
      duration: "1 - 2 Years",
    },
  ];
}

function buildEducationPaths(stages, title) {
  const items = getStageItems(stages, "education");
  if (!items.length) return fallbackEducationPaths(title);
  const labels = ["Bachelor's Degree", "Diploma / Certificate", "Self Learning", "Higher Studies"];
  return items.slice(0, 4).map((item, idx) => ({
    heading: labels[idx] || `Path ${idx + 1}`,
    tag: idx === 0 ? "Recommended" : null,
    body: item,
    duration: idx === 0 ? "3 - 4 Years" : idx === 1 ? "6 Months - 1 Year" : idx === 2 ? "Flexible" : "1 - 2 Years",
  }));
}

function buildSkillStages(stages, title) {
  const items = getStageItems(stages, "skills");
  const all = items.length ? items : roleSpecificFallbacks(title).skills;
  const third = Math.ceil(all.length / 3);
  return [
    { title: "Stage 1: Fundamentals", subtitle: "Build your foundation", items: all.slice(0, third) },
    { title: "Stage 2: Practical Skills", subtitle: "Tools you must know", items: all.slice(third, third * 2) },
    { title: "Stage 3: Advanced Skills", subtitle: "Level up your expertise", items: all.slice(third * 2) },
  ].filter((s) => s.items.length > 0);
}

function buildCourseMonths(stages, title = "this career") {
  const items = getStageItems(stages, "courses");
  const list = items.length ? items : roleSpecificFallbacks(title).courses;
  const labels = [
    { month: "Month 1", title: "Build Foundation" },
    { month: "Month 2 - 3", title: "Learn Core Tools" },
    { month: "Month 4 - 6", title: "Specialize" },
    { month: "Beyond 6 Months", title: "Build & Grow" },
  ];
  const chunked = [];
  const step = Math.ceil(list.length / 4) || 1;
  for (let i = 0; i < 4; i++) {
    const chunk = list.slice(i * step, (i + 1) * step);
    chunked.push({ ...labels[i], items: chunk.length ? chunk : [list[i % list.length] || "Practice"] });
  }
  return chunked;
}

function buildAITools(stages, career) {
  const items = getStageItems(stages, "tools");
  if (items.length) {
    return items.slice(0, 5).map((raw) => {
      const [name, useCase] = String(raw).split(/[—–\-:]/).map((s) => s.trim());
      return {
        name: name || raw,
        usedFor: useCase || "Productivity & content workflows",
        bestFor: "Speed, quality, and automation",
      };
    });
  }
  // Field-curated fallback
  const curated = FIELD_AI_TOOLS[detectField(career)] || FIELD_AI_TOOLS.default;
  return curated.slice(0, 5).map((t) => ({
    name: t.name,
    usedFor: t.category,
    bestFor: "Speed, quality, and automation",
  }));
}

function buildProjects(stages, title) {
  const items = getStageItems(stages, "projects");
  const list = items.length ? items : roleSpecificFallbacks(title).projects;
  return list.slice(0, 6).map((p, idx) => ({
    num: String(idx + 1).padStart(2, "0"),
    title: p,
    skills: "Skills, tools, workflow",
    difficulty: ["Easy", "Easy", "Easy", "Medium", "Hard", "Hard"][idx] || "Medium",
    recruiterValue: idx < 3 ? 3 : idx < 5 ? 4 : 5,
  }));
}

function buildPlacement(stages, title = "this career") {
  const items = getStageItems(stages, "placement");
  const specific = roleSpecificFallbacks(title).placement;
  return {
    resume: specific,
    interviewQs: items.length ? items.slice(0, 5) : [
      "Explain your design / work process.",
      "Why did you choose this color palette / approach?",
      "How do you handle client feedback?",
      "Which is your favorite project and why?",
      "How do you keep yourself updated?",
    ],
    remember: "Your portfolio is your biggest strength. Make it simple, professional and impactful.",
  };
}

function buildJobs(stages, baseJobs, title, salary) {
  if (Array.isArray(baseJobs) && baseJobs.length) {
    return baseJobs.slice(0, 5).map((j) => ({
      title: j.title || title,
      skills: (j.desc || "Skills, tools").slice(0, 80),
      salary: `₹${asNumber(j.salaryMin, salary?.min || 3)} - ${asNumber(j.salaryMax, salary?.max || 12)} LPA`,
      level: j.level || "Fresher",
    }));
  }
  const items = getStageItems(stages, "jobs");
  const list = items.length ? items : [title, `Junior ${title}`, `${title} Associate`, `${title} Specialist`, `${title} Lead`];
  const min = asNumber(salary?.min, 3);
  const max = asNumber(salary?.max, 12);
  return list.slice(0, 5).map((t, idx) => ({
    title: t,
    skills: "Core skills & tools",
    salary: `₹${(min * (1 + idx * 0.2)).toFixed(0)} - ${(max * (1 + idx * 0.3)).toFixed(0)} LPA`,
    level: ["Fresher", "1+ Yr Exp", "2+ Yr Exp", "3+ Yr Exp", "5+ Yr Exp"][idx],
  }));
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-white p-3 sm:p-4">
      <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl shrink-0" style={{ background: `${color}1c`, color }}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-muted2">{label}</p>
        <p className="font-heading text-sm sm:text-base font-black text-ink">{value}</p>
        {sub && <p className="text-[10px] sm:text-[11px] text-muted2">{sub}</p>}
      </div>
    </div>
  );
}

function SectionShell({ type, children }) {
  const [open, setOpen] = useState(false);
  const meta = SECTION_META[type];
  const Icon = meta.icon;
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5 p-4 text-left sm:p-5"
        aria-expanded={open}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: meta.bg, color: meta.color }}>
          <Icon size={18} />
        </span>
        <h2 className="min-w-0 flex-1 font-heading text-base sm:text-lg font-black text-ink">
          <span style={{ color: meta.color }}>{meta.num}.</span> {meta.title}
        </h2>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand">
          {open ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
        </span>
      </button>
      {open && <div className="border-t border-line px-4 pb-4 pt-4 sm:px-6 sm:pb-6">{children}</div>}
    </section>
  );
}

function LoadingSkeleton({ title }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="rounded-2xl border border-line bg-white p-5 sm:p-7 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl cc-logo-gradient flex items-center justify-center shadow-brand text-white">
            <BrandClockMark size={28} animated />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand">Generating your report</p>
            <h1 className="font-heading text-xl sm:text-2xl font-black text-ink mt-0.5">{title}</h1>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted2">Building a personalized career guide — education, skills, courses, AI tools, projects, placement, and job paths.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-brand-50 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 mb-4">
        <AlertCircle size={26} />
      </div>
      <h2 className="font-heading text-xl font-black text-ink">Couldn't build your report</h2>
      <p className="mt-2 text-sm text-muted2">{message || "Something went wrong while generating the AI career report."}</p>
      <button onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-white">
        <RefreshCw size={15} /> Retry generation
      </button>
    </div>
  );
}

function PublicCareerHero({ career, onTakeQuiz, onFindInstitute, onFindRoadmap }) {
  const title = career?.title || "Career Report";
  const words = title.split(/\s+/).filter(Boolean);
  const accentWord = words.length > 1 ? words.pop() : "";
  const mainTitle = words.join(" ") || title;
  const category = career?.category || career?.field || "Career";
  const fitRows = buildCareerFitRows(career);
  const degreeRow = fitRows.find((row) => row.label === "Degree mandatory");
  const passRow = fitRows.find((row) => row.label === "12th Pass");
  const codingRow = fitRows.find((row) => row.label === "Coding required");
  const summary =
    career?.roleReport?.summary ||
    career?.overviewDetails?.description ||
    career?.overview ||
    career?.description ||
    `Explore ${title} with practical roadmap, institutes, tools, and job guidance for Indian students.`;
  const primaryPill = (career?.tags || [category]).slice(0, 2).join(" • ") || category;

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#120B3D] px-5 py-8 text-white sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute bottom-[-110px] left-[18%] h-64 w-64 rounded-full bg-yellow-300/10 sm:h-80 sm:w-80" />

      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-3xl">
        <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/75">
          <span className="h-2 w-2 rounded-full bg-white/80" />
          <span className="truncate">{category} • {primaryPill}</span>
        </div>

        <h1 className="mt-7 font-heading text-[38px] font-black leading-[1.02] tracking-normal sm:text-5xl lg:text-6xl">
          <span>{mainTitle}</span>
          {accentWord && <span className="block text-yellow-300">{accentWord}</span>}
        </h1>

        <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-white/72 sm:text-lg">
          {summary}
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <span className="rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-bold text-white/82">
            Practical roadmap
          </span>
          <span className="rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-bold text-white/82">
            {degreeRow?.value === "Yes" ? "Degree required" : `12th: ${passRow?.value || "Allowed"}`}
          </span>
          <span className="rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-bold text-white/82">
            Coding: {codingRow?.value || "Role based"}
          </span>
          <span className="rounded-full border border-yellow-300/35 bg-yellow-300/10 px-4 py-2 text-sm font-black text-yellow-300">
            6 - 12 months to job ready
          </span>
        </div>

        <div className="mt-9 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={onTakeQuiz}
            className="rounded-2xl bg-gradient-to-r from-brand-600 to-pink-500 px-5 py-4 text-left font-heading text-lg font-black text-white transition hover:from-brand hover:to-pink-500"
          >
            Take Career Quiz →
          </button>
          <button
            type="button"
            onClick={onFindInstitute}
            className="rounded-2xl border border-white/25 bg-white/8 px-5 py-4 text-left font-heading text-lg font-black text-white transition hover:bg-white/14"
          >
            Find Institute →
          </button>
          <button
            type="button"
            onClick={onFindRoadmap}
            className="rounded-2xl border border-white/25 bg-white/8 px-5 py-4 text-left font-heading text-lg font-black text-white transition hover:bg-white/14"
          >
            Find Roadmap →
          </button>
        </div>
        </div>
      </div>
    </section>
  );
}

const TABS = [
  { id: "report", label: "Report", icon: LayoutGrid },
  { id: "overview", label: "Overview", icon: Sparkles },
  { id: "insights", label: "Insights", icon: BarChart3 },
  { id: "institutes", label: "Institute", icon: Building2 },
];

// --- Field detection + curated insights (industries + AI tools) ---
function detectField(career) {
  const blob = `${career?.title || ""} ${career?.category || ""} ${career?.field || ""} ${(career?.tags || []).join(" ")}`.toLowerCase();
  if (/(video|motion|film|animation|vfx|cinemat|photograph|editor|reels|director)/.test(blob)) return "video";
  if (/(graphic|visual|ui|ux|product design|illustrat|brand)/.test(blob)) return "design";
  if (/(developer|engineer|software|backend|frontend|full.?stack|devops|cloud|cyber|security|sysadmin|network)/.test(blob)) return "tech";
  if (/(data|analyst|scientist|ml |machine learning|ai engineer|sql|tableau|power bi)/.test(blob)) return "data";
  if (/(marketing|seo|content|copy|social media|crm|sales|growth|affiliate|brand strategist)/.test(blob)) return "marketing";
  if (/(finance|account|tax|investment|banking|ca |cma|cs |acca|cfa|sap|financial)/.test(blob)) return "finance";
  if (/(law|advocate|judge|legal|paralegal)/.test(blob)) return "law";
  if (/(mba|hr|operations|management|consultant)/.test(blob)) return "management";
  if (/(government|civil services|ssc|upsc|ips|ias|defense|railway|police|psu|bank po)/.test(blob)) return "government";
  if (/(health|nurse|pharm|medical|coder|biller|lab tech|radiology|nutrition|physio)/.test(blob)) return "healthcare";
  if (/(language|translator|interpret|teacher|tourism|embassy|subtitler)/.test(blob)) return "languages";
  if (/(aviation|cabin crew|airline|airport|hotel|hospitality|cruise|event)/.test(blob)) return "aviation";
  if (/(blockchain|web3|drone|ev |iot|robotics)/.test(blob)) return "emerging";
  if (/(makeup|mehendi|hair|nail|electrician|technician|repair|cctv|fitness|yoga)/.test(blob)) return "trade";
  return "default";
}

const FIELD_INDUSTRIES = {
  video: ["Film & OTT", "Advertising", "Social Media", "Gaming Studios", "News & Media", "YouTube Creators"],
  design: ["SaaS Product", "E-commerce", "Advertising Agencies", "Edtech", "Fintech", "D2C Brands"],
  tech: ["SaaS Product", "Fintech", "E-commerce", "Edtech", "Healthtech", "IT Services"],
  data: ["Fintech", "E-commerce", "Banking", "Consulting", "Healthtech", "SaaS Analytics"],
  marketing: ["D2C Brands", "Agencies", "E-commerce", "Edtech", "Media Houses", "Startups"],
  finance: ["Banks", "NBFCs", "Investment Firms", "Big 4 (Audit)", "Insurance", "MNC Finance"],
  law: ["Corporate Law Firms", "Judiciary", "Banking & Compliance", "Govt Departments", "Real Estate", "Legaltech"],
  management: ["Consulting", "FMCG", "Banking", "Tech Companies", "Manufacturing", "Retail"],
  government: ["Govt Ministries", "PSUs", "Regulatory Bodies", "Railways", "Defense", "State Govts"],
  healthcare: ["Hospitals", "Pharma", "Health Insurance", "Diagnostics", "Healthtech", "Medical Devices"],
  languages: ["BPOs & KPOs", "Embassies", "Translation Agencies", "Tourism", "OTT Subtitling", "MNC Support"],
  aviation: ["Airlines", "Airports", "Hotels", "Travel Tech", "Cruise Lines", "Event Management"],
  emerging: ["Web3 Startups", "Drone Services", "EV Manufacturers", "IoT Product Cos", "Robotics R&D", "Smart Cities"],
  trade: ["Salons & Spas", "Wedding Industry", "Local Businesses", "Building & Construction", "Auto Workshops", "Freelance"],
  default: ["Startups", "MNCs", "Service Companies", "Product Companies", "Agencies", "Consulting"],
};

const FIELD_AI_TOOLS = {
  video: [
    { name: "Adobe Premiere Pro", category: "Editing" },
    { name: "After Effects", category: "Motion" },
    { name: "DaVinci Resolve", category: "Color" },
    { name: "CapCut", category: "Reels" },
    { name: "Runway ML", category: "AI Video" },
    { name: "Descript", category: "AI Audio" },
  ],
  design: [
    { name: "Figma", category: "Design" },
    { name: "Adobe Photoshop", category: "Design" },
    { name: "Adobe Illustrator", category: "Vector" },
    { name: "Midjourney", category: "AI Art" },
    { name: "Canva", category: "Layouts" },
    { name: "ChatGPT", category: "Copy" },
  ],
  tech: [
    { name: "GitHub Copilot", category: "AI Coding" },
    { name: "Cursor", category: "AI IDE" },
    { name: "ChatGPT", category: "AI Assistant" },
    { name: "Claude", category: "AI Assistant" },
    { name: "Postman AI", category: "API" },
    { name: "Notion AI", category: "Docs" },
  ],
  data: [
    { name: "ChatGPT", category: "Analysis" },
    { name: "Claude", category: "Analysis" },
    { name: "Tableau AI", category: "Viz" },
    { name: "Power BI Copilot", category: "Viz" },
    { name: "Python + Pandas", category: "Core" },
    { name: "Hex / Deepnote", category: "Notebooks" },
  ],
  marketing: [
    { name: "ChatGPT", category: "Copy" },
    { name: "Jasper", category: "Long-form" },
    { name: "Copy.ai", category: "Ads" },
    { name: "Canva AI", category: "Creatives" },
    { name: "Buffer / Hootsuite", category: "Scheduling" },
    { name: "SurferSEO", category: "SEO" },
  ],
  finance: [
    { name: "Excel Copilot", category: "Modeling" },
    { name: "ChatGPT", category: "Research" },
    { name: "Bloomberg Terminal", category: "Markets" },
    { name: "Tally / Zoho Books", category: "Accounting" },
    { name: "Power BI", category: "Dashboards" },
    { name: "Notion AI", category: "Notes" },
  ],
  law: [
    { name: "ChatGPT", category: "Drafting" },
    { name: "Claude", category: "Long Docs" },
    { name: "Manupatra / SCC", category: "Research" },
    { name: "DocuSign", category: "E-sign" },
    { name: "Notion", category: "Case Notes" },
    { name: "Grammarly", category: "Editing" },
  ],
  management: [
    { name: "ChatGPT", category: "Frameworks" },
    { name: "Claude", category: "Strategy" },
    { name: "Notion AI", category: "Docs" },
    { name: "Miro", category: "Whiteboard" },
    { name: "Excel / Sheets", category: "Models" },
    { name: "Slack AI", category: "Comms" },
  ],
  government: [
    { name: "Testbook", category: "Mock Tests" },
    { name: "Adda247", category: "Prep" },
    { name: "Unacademy", category: "Live Classes" },
    { name: "ChatGPT", category: "Doubt Solver" },
    { name: "PIB / PRS India", category: "Current Affairs" },
    { name: "Notion", category: "Notes" },
  ],
  healthcare: [
    { name: "ChatGPT", category: "Reference" },
    { name: "UpToDate", category: "Clinical" },
    { name: "ICD-10 / CPT Coders", category: "Coding" },
    { name: "Practo / 1mg", category: "Tele-health" },
    { name: "Excel", category: "Reports" },
    { name: "Notion", category: "Logs" },
  ],
  languages: [
    { name: "DeepL", category: "Translation" },
    { name: "ChatGPT", category: "Practice" },
    { name: "Duolingo", category: "Learning" },
    { name: "Anki", category: "Flashcards" },
    { name: "Otter.ai", category: "Transcription" },
    { name: "Grammarly", category: "Editing" },
  ],
  aviation: [
    { name: "Amadeus", category: "GDS" },
    { name: "Sabre", category: "GDS" },
    { name: "Opera PMS", category: "Hotel" },
    { name: "ChatGPT", category: "Etiquette" },
    { name: "Duolingo", category: "Language" },
    { name: "Canva", category: "Comms" },
  ],
  emerging: [
    { name: "ChatGPT", category: "Assistant" },
    { name: "GitHub Copilot", category: "AI Coding" },
    { name: "Hardhat / Foundry", category: "Web3" },
    { name: "DJI Fly", category: "Drone" },
    { name: "Arduino IDE", category: "IoT" },
    { name: "ROS", category: "Robotics" },
  ],
  trade: [
    { name: "Pinterest", category: "Inspiration" },
    { name: "Instagram", category: "Marketing" },
    { name: "WhatsApp Business", category: "Clients" },
    { name: "YouTube", category: "Learning" },
    { name: "Canva", category: "Posters" },
    { name: "ChatGPT", category: "Captions" },
  ],
  default: [
    { name: "ChatGPT", category: "Assistant" },
    { name: "Claude", category: "Assistant" },
    { name: "Notion AI", category: "Docs" },
    { name: "Canva", category: "Visuals" },
    { name: "Google Gemini", category: "Search" },
    { name: "Grammarly", category: "Writing" },
  ],
};

function getCuratedIndustries(career, fromInsights) {
  const field = detectField(career);
  // For any known field, ALWAYS use curated list (backend data is too generic).
  if (field !== "default") {
    return FIELD_INDUSTRIES[field];
  }
  // Only for unknown fields, fall back to backend list if it has 3+ items.
  if (Array.isArray(fromInsights) && fromInsights.length >= 3) {
    return fromInsights.slice(0, 6);
  }
  return FIELD_INDUSTRIES.default;
}

function getCuratedAITools(career, fromInsights) {
  const field = detectField(career);
  if (field !== "default") {
    return FIELD_AI_TOOLS[field];
  }
  if (Array.isArray(fromInsights) && fromInsights.length > 0) {
    const looksGeneric = fromInsights.every((t) => {
      const n = typeof t === "string" ? t : t?.name || "";
      return /industry tools|collaboration tools|career tools|general tools/i.test(n);
    });
    if (!looksGeneric) {
      return fromInsights.map((t) => (typeof t === "string" ? { name: t } : t)).slice(0, 6);
    }
  }
  return FIELD_AI_TOOLS.default;
}

function deriveActivities(career) {
  const workAreas = career?.overviewDetails?.workAreas;
  if (Array.isArray(workAreas) && workAreas.length) {
    return workAreas.map((a) => a.title || a).filter(Boolean).slice(0, 4);
  }
  const fromSkills = (career?.skills || []).map((s) => s.name).slice(0, 4);
  if (fromSkills.length >= 4) return fromSkills;
  return [...fromSkills, "Problem solving", "Execution", "Communication", "Growth"].slice(0, 4);
}

function parseCountries(raw) {
  const fallback = [
    { code: "IN", name: "India", flag: "🇮🇳" },
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
  ];
  if (!raw) return fallback;
  const codeMap = { india: "IN", us: "US", usa: "US", uk: "GB", canada: "CA", germany: "DE", australia: "AU", singapore: "SG", uae: "AE" };
  const nameMap = { IN: "India", US: "United States", GB: "United Kingdom", CA: "Canada", DE: "Germany", AU: "Australia", SG: "Singapore", AE: "UAE" };
  const list = (Array.isArray(raw) ? raw : String(raw).split(/[,;|]/))
    .map((x) => String(x).trim())
    .filter(Boolean)
    .map((x) => {
      const code = /^[a-z]{2}$/i.test(x) ? x.toUpperCase() : codeMap[x.toLowerCase()];
      if (!code) return null;
      return { code, name: nameMap[code] || x, flag: String.fromCodePoint(...code.split("").map((c) => c.charCodeAt(0) + 127397)) };
    })
    .filter(Boolean);
  return list.length ? list.slice(0, 4) : fallback;
}

function buildCareerFitRows(career) {
  const blob = `${career?.title || ""} ${career?.category || ""} ${career?.field || ""} ${(career?.tags || []).join(" ")}`.toLowerCase();
  const isSoftware = /(full.?stack|frontend|backend|software|web developer|app developer|developer|programmer|react|python|java)/.test(blob);
  const isData = /(data|analytics|analyst|scientist|sql|power bi|tableau)/.test(blob);
  const isDevOpsCyber = /(devops|cloud|cyber|security|network)/.test(blob);
  const isMedical = /(doctor|nurse|medical|pharma|lab technician|radiology|physio|healthcare)/.test(blob);
  const isLegal = /(law|legal|advocate|judge|paralegal)/.test(blob);
  const isFinanceCredential = /\b(ca|cma|cs|acca|cfa|chartered|tax|gst|account|accounts|accounting)\b/.test(blob);
  const isGovernment = /(government|upsc|ssc|railway|bank po|police|defence|defense|psu)/.test(blob);
  const isCreativeMarketing = /(marketing|social media|content|seo|copy|graphic|design|video|motion|makeup|mehendi|photography)/.test(blob);
  const needsDegree = isMedical || isLegal || isFinanceCredential || isGovernment;

  let coding = "No";
  if (isSoftware) coding = "Yes";
  else if (isData || isDevOpsCyber) coding = "Basic";

  return [
    { label: "12th Pass", value: needsDegree ? "No" : isSoftware ? "Yes + portfolio" : "Yes" },
    { label: "Any Graduate", value: "Yes" },
    { label: "BPO / Back-office experience", value: isSoftware ? "Helpful" : isCreativeMarketing || isData ? "Big advantage" : "Helpful" },
    { label: "English fluency needed", value: isGovernment || isMedical ? "Basic is enough" : "Good English helps" },
    { label: "Prior experience needed", value: "No" },
    { label: "Degree mandatory", value: needsDegree ? "Yes" : "No" },
    { label: "Age limit", value: isGovernment ? "Exam rules apply" : "None" },
    { label: "Coding required", value: coding },
  ];
}

function detailedDayTasks(career) {
  const title = career?.title || "this role";
  const field = detectField(career);
  const presets = {
    marketing: [
      "Create and schedule posts for Instagram, Facebook, LinkedIn, and YouTube Shorts based on the weekly content plan.",
      "Write captions, hooks, carousel copy, ad copy, and content calendars for weekly or monthly campaigns.",
      "Reply to comments and DMs, collect leads, handle community queries, and pass hot leads to the sales team.",
      "Track reach, engagement, follower growth, CTR, leads, and conversions using platform analytics.",
      "Coordinate with designers, video editors, or Canva templates to create creatives that match brand tone.",
      "Run or assist with paid ads, boosted posts, retargeting, and campaign reporting for clients or brands.",
      "Study trends, competitors, hashtags, viral formats, and algorithm changes to improve content performance.",
    ],
    tech: [
      "Convert Figma screens or requirements into responsive frontend pages with clean components.",
      "Build backend APIs, authentication flows, database models, and business logic for real app features.",
      "Connect frontend with APIs, handle loading/error states, validate forms, and test complete user journeys.",
      "Fix bugs, read error logs, debug browser/API issues, and improve performance on mobile and desktop.",
      "Use Git and GitHub for commits, branches, code reviews, and safe deployment workflow.",
      "Deploy projects on Vercel, Render, AWS, or similar platforms and monitor production behavior.",
      "Discuss requirements with product/design/client teams and break large features into small tasks.",
    ],
    data: [
      "Clean raw data from Excel, SQL tables, forms, CRMs, or APIs and remove duplicate or incorrect records.",
      "Write SQL queries to filter, join, group, and summarize business data for decision making.",
      "Build dashboards in Power BI, Tableau, or Excel with KPIs, charts, filters, and drill-down views.",
      "Find patterns, trends, outliers, and revenue/customer insights from weekly or monthly data.",
      "Prepare reports for managers with clear takeaways, business impact, and recommended next actions.",
      "Automate repeated reports using formulas, scripts, templates, or scheduled dashboard refreshes.",
      "Present findings to non-technical teams in simple language without overloading them with raw data.",
    ],
    design: [
      "Create wireframes, UI screens, icons, layouts, and design systems in Figma or similar tools.",
      "Review user flows and improve navigation, hierarchy, spacing, typography, and mobile usability.",
      "Convert a client or product brief into moodboards, low-fidelity screens, and polished final designs.",
      "Collaborate with developers to explain assets, states, responsive behavior, and interaction details.",
      "Collect feedback from users, clients, or product teams and improve designs through iterations.",
      "Maintain reusable components, color styles, typography tokens, and consistent visual patterns.",
      "Prepare case studies that explain the problem, process, decisions, and final business/user outcome.",
    ],
  };
  return presets[field] || [
    `Understand daily requirements and plan practical ${title} tasks clearly before execution.`,
    "Use the right tools to complete assignments, document progress, and maintain quality.",
    "Coordinate with team members, clients, or seniors to clarify expectations and avoid rework.",
    "Review output, fix mistakes, and improve based on feedback or performance metrics.",
    "Build small proof-of-work samples that can be used in a portfolio or interview.",
    "Track learning, applications, and project outcomes weekly to stay consistent.",
  ];
}

function detailedSkillGroups(career) {
  const field = detectField(career);
  const presets = {
    marketing: {
      hardSkills: [
        "Content writing and copywriting for captions, hooks, scripts, and ad creatives.",
        "Meta Business Suite, Buffer, Hootsuite, or similar tools for scheduling and publishing.",
        "Canva or basic design tools to create quick creatives, thumbnails, and carousels.",
        "Basic analytics: Meta Insights, LinkedIn Analytics, Google Analytics, and campaign reports.",
        "SEO basics, hashtag strategy, keyword research, and content optimization.",
        "Paid ads fundamentals: audience, budget, creatives, CTR, leads, and retargeting.",
      ],
      softSkills: [
        "Creativity and trend awareness for fresh content ideas.",
        "Communication and brand voice understanding.",
        "Time management across multiple platforms, deadlines, and campaigns.",
        "Customer empathy for comments, DMs, and community management.",
        "Reporting discipline to explain what worked and what needs improvement.",
      ],
    },
    tech: {
      hardSkills: [
        "HTML, CSS, JavaScript, responsive layouts, browser debugging, and accessibility basics.",
        "React components, state management, routing, forms, and reusable UI patterns.",
        "Backend APIs with Node/Python, authentication, validation, and error handling.",
        "Databases such as MongoDB or SQL with schema design, queries, and relationships.",
        "Git, GitHub, deployment, environment variables, logs, and production debugging.",
        "Testing, performance optimization, security basics, and clean code practices.",
      ],
      softSkills: [
        "Problem solving and patience while debugging.",
        "Clear communication with design/product/client teams.",
        "Consistency in daily coding practice.",
        "Ability to read documentation and learn independently.",
        "Ownership of quality, deadlines, and deployed output.",
      ],
    },
    data: {
      hardSkills: [
        "Advanced Excel: pivots, formulas, lookup logic, dashboards, and MIS reporting.",
        "SQL: joins, grouping, filtering, subqueries, and business-focused queries.",
        "Power BI or Tableau dashboarding with KPIs, filters, and data storytelling.",
        "Basic statistics: averages, trends, outliers, correlation, and hypothesis thinking.",
        "Python with Pandas for cleaning, analysis, and repeatable notebooks.",
        "Business problem framing: convert raw data into decisions and next steps.",
      ],
      softSkills: [
        "Attention to detail and data accuracy.",
        "Business curiosity and questioning mindset.",
        "Clear explanation for non-technical stakeholders.",
        "Patience with messy data and repeated revisions.",
        "Structured reporting and deadline discipline.",
      ],
    },
    design: {
      hardSkills: [
        "Figma layouts, components, auto-layout, variants, and clickable prototypes.",
        "Typography, spacing, color theory, visual hierarchy, and responsive design.",
        "Wireframing, user flows, information architecture, and screen-state planning.",
        "UX research basics: interviews, surveys, competitor study, and usability feedback.",
        "Design systems, icons, buttons, form states, cards, and reusable UI patterns.",
        "Portfolio case-study writing with problem, process, decisions, and outcome.",
      ],
      softSkills: [
        "User empathy and product thinking.",
        "Visual taste and attention to polish.",
        "Communication with developers and clients.",
        "Feedback handling without becoming defensive.",
        "Consistency in practice and iteration.",
      ],
    },
  };
  return presets[field] || {
    hardSkills: roleSpecificFallbacks(career?.title || "this role").skills.map((skill) => `${skill}: learn the basics and practice with real assignments.`),
    softSkills: ["Communication", "Problem solving", "Consistency", "Time management", "Professional discipline"],
  };
}

function detailedGettingStarted(career) {
  const title = career?.title || "this career";
  const field = detectField(career);
  const presets = {
    marketing: [
      { title: "Learn the basics", body: "Join a practical digital marketing or social media course. Learn platform fundamentals, content strategy, ad basics, analytics, and reporting." },
      { title: "Pick 1-2 platforms and go deep", body: "Instagram plus LinkedIn is a strong beginner combo. Understand formats, algorithms, content hooks, and what makes people engage." },
      { title: "Practice on your own profile", body: "Treat your own Instagram or LinkedIn as a project. Try content ideas, check reach, and document learnings." },
      { title: "Build a small portfolio", body: "Save screenshots of posts, growth metrics, calendars, campaign reports, and before-after examples." },
      { title: "Apply for internships or freelance gigs", body: "Use Internshala, LinkedIn, Naukri, and local business outreach. Even a small internship counts as real experience." },
    ],
    tech: [
      { title: "Build coding foundation", body: "Start with HTML, CSS, JavaScript, Git, and one framework like React. Practice daily instead of only watching tutorials." },
      { title: "Create 3 small projects", body: "Build a portfolio site, CRUD app, and dashboard/login app. Deploy every project and keep GitHub clean." },
      { title: "Learn backend and database basics", body: "Understand APIs, authentication, MongoDB/SQL, validation, and how frontend talks to backend." },
      { title: "Practice debugging and interviews", body: "Solve JavaScript questions, explain your projects, read logs, and fix real errors." },
      { title: "Apply with proof", body: "Send GitHub, live demo links, and a short explanation of what you built and what problem it solves." },
    ],
    data: [
      { title: "Master Excel first", body: "Learn pivots, formulas, charts, lookup logic, and dashboard basics. Excel is still tested in many fresher analyst roles." },
      { title: "Add SQL and dashboarding", body: "Practice SQL joins, grouping, filtering, and build dashboards in Power BI or Tableau." },
      { title: "Create business case studies", body: "Use sales, customer, finance, or operations data and write clear insights, not just charts." },
      { title: "Build a portfolio", body: "Publish dashboard screenshots, GitHub notebooks, project summaries, and key business recommendations." },
      { title: "Apply to MIS/Data roles", body: "Search MIS Analyst, Data Analyst Intern, BI Intern, and Operations Analyst with 0-1 year filters." },
    ],
    design: [
      { title: "Learn design fundamentals", body: "Study spacing, typography, color, layout, visual hierarchy, and mobile-first UI rules." },
      { title: "Practice Figma deeply", body: "Learn components, auto-layout, variants, prototypes, responsive frames, and design systems." },
      { title: "Redesign real screens", body: "Pick existing apps/websites and create better versions with reasoning, not just decoration." },
      { title: "Write case studies", body: "Show problem, users, constraints, process, design decisions, and final screens." },
      { title: "Apply with portfolio", body: "Send 3 polished case studies and be ready to explain your design choices in interviews." },
    ],
  };
  return presets[field] || [
    { title: "Understand the role", body: `Learn what ${title} professionals actually do daily and what employers expect from freshers.` },
    { title: "Learn core skills", body: "Pick a focused course or roadmap and practice the exact tools used in entry-level work." },
    { title: "Build proof", body: "Create assignments, projects, case studies, or samples that show you can do practical work." },
    { title: "Prepare profile", body: "Update resume, LinkedIn, portfolio, and interview answers with role-specific examples." },
    { title: "Apply consistently", body: "Track jobs, follow up, improve based on rejections, and keep adding better proof." },
  ];
}

function detailedTools(career, baseTools) {
  const field = detectField(career);
  const curated = {
    marketing: [
      { name: "Meta Business Suite", use: "Schedule posts, manage pages, run ads, reply to comments, and track campaign performance." },
      { name: "Canva", use: "Create carousels, thumbnails, ad creatives, stories, and simple brand templates without heavy design software." },
      { name: "Google Analytics", use: "Understand traffic sources, user behavior, landing page results, and campaign conversions." },
      { name: "Buffer / Hootsuite", use: "Plan multi-platform calendars, schedule content, and manage reporting across accounts." },
      { name: "ChatGPT", use: "Generate content ideas, hooks, captions, ad variations, reports, and campaign briefs faster." },
      { name: "Google Sheets", use: "Track content calendars, leads, campaign metrics, experiments, and monthly performance reports." },
    ],
    tech: [
      { name: "VS Code / Cursor", use: "Write code, debug files, use AI assistance, and manage project structure efficiently." },
      { name: "GitHub", use: "Store code, show portfolio proof, collaborate through branches, and share projects with recruiters." },
      { name: "Postman", use: "Test APIs, inspect requests/responses, debug auth issues, and document endpoints." },
      { name: "MongoDB / PostgreSQL", use: "Store app data, design schemas, query records, and connect backend logic to real databases." },
      { name: "Vercel / Render / AWS", use: "Deploy live projects so recruiters can test your work instead of only reading code." },
      { name: "ChatGPT / Claude", use: "Debug errors, understand docs, generate test cases, and review code quality." },
    ],
    data: [
      { name: "Microsoft Excel", use: "Clean data, build MIS reports, pivot tables, formulas, charts, and quick business summaries." },
      { name: "SQL", use: "Pull, join, filter, and summarize data from company databases." },
      { name: "Power BI", use: "Create dashboards, KPIs, filters, and recurring business reports." },
      { name: "Python + Pandas", use: "Clean larger datasets, automate analysis, and create repeatable notebooks." },
      { name: "Tableau", use: "Build visual dashboards and present insights for stakeholders." },
      { name: "ChatGPT / Claude", use: "Explain formulas, debug SQL, draft insights, and structure reports." },
    ],
    design: [
      { name: "Figma", use: "Create UI screens, components, prototypes, design systems, and handoff files." },
      { name: "FigJam / Miro", use: "Map user journeys, flows, brainstorming, and UX research notes." },
      { name: "Adobe Photoshop", use: "Edit images, mockups, banners, and visual assets for polished presentations." },
      { name: "Canva", use: "Quick social creatives, presentation layouts, and basic brand assets." },
      { name: "Maze / Useberry", use: "Run simple usability tests and collect feedback on designs." },
      { name: "ChatGPT", use: "Draft case studies, UX copy, interview questions, and design rationale." },
    ],
  };
  if (curated[field]) return curated[field];
  return (baseTools || []).slice(0, 6).map((tool) => ({
    name: tool.name,
    use: tool.use || tool.usedFor || tool.category || "Use this to improve speed, quality, and daily role workflow.",
  }));
}

function detailedSalaryPath(career, jobs) {
  const title = career?.title || "Career";
  const field = detectField(career);
  const min = asNumber(career?.avgSalary?.min, 3);
  const max = asNumber(career?.avgSalary?.max, 12);
  const presets = {
    marketing: [
      { role: "Marketing / Social Media Intern", years: "0 - 6 months", salary: "Rs 5K - Rs 15K/month", body: "Learns posting, research, basic reporting, captions, and campaign support." },
      { role: "Digital Marketing Executive", years: "0 - 2 years", salary: "Rs 2L - Rs 3.5L/year", body: "Executes content, SEO, ads support, scheduling, and weekly client reports." },
      { role: `${title} Manager`, years: "2 - 4 years", salary: "Rs 4L - Rs 8L/year", body: "Leads strategy, manages campaigns, tracks performance, and coordinates with designers or sales teams.", current: true },
      { role: "Growth / Brand Strategist", years: "4 - 6 years", salary: "Rs 9L - Rs 15L/year", body: "Owns channel strategy, budgets, conversions, brand positioning, and team review." },
      { role: "Digital Marketing Manager / Brand Manager", years: "6+ years", salary: "Rs 14L - Rs 25L+/year", body: "Oversees SEO, ads, content, analytics, brand, agencies, and business growth." },
    ],
    tech: [
      { role: "Web Development Intern", years: "0 - 6 months", salary: "Rs 8K - Rs 20K/month", body: "Builds small UI screens, fixes bugs, learns Git, and ships supervised tasks." },
      { role: "Junior Developer", years: "0 - 2 years", salary: "Rs 3L - Rs 6L/year", body: "Creates frontend/backend features, consumes APIs, writes tests, and maintains code." },
      { role: title, years: "2 - 4 years", salary: `Rs ${Math.max(min, 4)}L - Rs ${Math.max(max, 10)}L/year`, body: "Owns modules, handles production bugs, improves performance, and works with product teams.", current: true },
      { role: "Senior Developer", years: "4 - 6 years", salary: "Rs 12L - Rs 24L/year", body: "Designs architecture, mentors juniors, reviews code, and manages complex integrations." },
      { role: "Tech Lead / Engineering Manager", years: "6+ years", salary: "Rs 25L - Rs 50L+/year", body: "Leads engineering delivery, system design, hiring, planning, and cross-team execution." },
    ],
    data: [
      { role: "Data / MIS Intern", years: "0 - 6 months", salary: "Rs 8K - Rs 18K/month", body: "Cleans data, prepares Excel reports, and supports dashboards." },
      { role: "Junior Data Analyst", years: "0 - 2 years", salary: "Rs 3L - Rs 6L/year", body: "Works on SQL, Excel, Power BI dashboards, and business reporting." },
      { role: title, years: "2 - 4 years", salary: `Rs ${Math.max(min, 4)}L - Rs ${Math.max(max, 12)}L/year`, body: "Finds insights, builds dashboards, explains trends, and supports decisions.", current: true },
      { role: "Senior Analyst / BI Analyst", years: "4 - 6 years", salary: "Rs 10L - Rs 20L/year", body: "Owns KPIs, analytics models, stakeholder reporting, and decision dashboards." },
      { role: "Analytics Manager / Data Product Lead", years: "6+ years", salary: "Rs 18L - Rs 35L+/year", body: "Leads analytics strategy, data teams, governance, and business impact." },
    ],
    design: [
      { role: "Design Intern", years: "0 - 6 months", salary: "Rs 5K - Rs 15K/month", body: "Creates UI screens, social creatives, wireframes, and portfolio case studies." },
      { role: "Junior UI/Graphic Designer", years: "0 - 2 years", salary: "Rs 2.5L - Rs 5L/year", body: "Handles visual design, Figma files, brand layouts, and design revisions." },
      { role: title, years: "2 - 4 years", salary: `Rs ${Math.max(min, 4)}L - Rs ${Math.max(max, 10)}L/year`, body: "Owns user flows, design systems, client presentations, and polished deliverables.", current: true },
      { role: "Senior Designer / Product Designer", years: "4 - 6 years", salary: "Rs 10L - Rs 20L/year", body: "Leads research, systems, product UX, and junior designer reviews." },
      { role: "Design Lead / Creative Director", years: "6+ years", salary: "Rs 18L - Rs 35L+/year", body: "Owns design direction, brand quality, hiring, and business outcomes." },
    ],
  };
  return presets[field] || (jobs || []).slice(0, 5).map((job, index) => ({
    role: job.title,
    years: job.level || ["0 - 1 year", "1 - 3 years", "3 - 5 years", "5+ years"][index] || "Growth stage",
    salary: job.salary,
    body: job.skills || "Build proof, improve skills, and apply consistently.",
    current: index === 1,
  }));
}

function detailedEmployerGuide(career) {
  const field = detectField(career);
  const guides = {
    marketing: {
      types: [
        { title: "Digital marketing agencies", body: "Best place to start, fast learning, multiple clients, and broad exposure." },
        { title: "Brands in-house", body: "Better focus, stronger pay growth, and deeper ownership of one brand." },
        { title: "Startups", body: "Often remote, high ownership, quick growth, and direct founder/team visibility." },
        { title: "Freelance", body: "Own clients, work from home, and income grows with proof and referrals." },
      ],
      apply: [
        { title: "Internshala", body: "Best for first internship and fresher roles" },
        { title: "LinkedIn", body: `Search "${career?.title || "role"} fresher"` },
        { title: "Naukri.com", body: "Filter by 0 years experience and city" },
        { title: "Apna App", body: "Good for Tier 2 city jobs" },
        { title: "Instagram DMs to local businesses", body: "Underrated and works well with a sample audit" },
      ],
      remote: "Yes - highly remote-friendly",
    },
    tech: {
      types: [
        { title: "IT service companies", body: "Good for first job, training exposure, and structured team work." },
        { title: "SaaS/product startups", body: "Better learning curve, ownership, and modern engineering practices." },
        { title: "Agencies", body: "Fast portfolio growth through websites, dashboards, and client apps." },
        { title: "Freelance / contract", body: "Works after 3-5 solid deployed projects and good communication." },
      ],
      apply: [
        { title: "LinkedIn", body: "Search junior developer, frontend intern, full stack intern" },
        { title: "Naukri.com", body: "Filter by React, JavaScript, Node, fresher" },
        { title: "AngelList / Wellfound", body: "Good for startup internships" },
        { title: "GitHub + cold email", body: "Send live demo and GitHub links" },
      ],
      remote: "Yes - remote-friendly after portfolio proof",
    },
    data: {
      types: [
        { title: "Analytics teams", body: "Work on dashboards, SQL, KPIs, and stakeholder reports." },
        { title: "Finance / operations teams", body: "Strong for Excel, MIS, reporting, and process analytics." },
        { title: "Consulting and startups", body: "High learning, multiple business problems, and quick portfolio growth." },
        { title: "Agencies / BI vendors", body: "Project-based dashboards for different clients and industries." },
      ],
      apply: [
        { title: "LinkedIn", body: "Search data analyst fresher, MIS analyst, BI intern" },
        { title: "Naukri.com", body: "Filter by Excel, SQL, Power BI, 0-1 years" },
        { title: "Internshala", body: "Good for first analytics internship" },
        { title: "Kaggle / GitHub portfolio", body: "Share projects with dashboard links" },
      ],
      remote: "Hybrid - remote possible after trust and dashboard proof",
    },
  };
  const fallback = {
    types: getCuratedIndustries(career).slice(0, 4).map((name) => ({ title: name, body: `Good place to apply for ${career?.title || "this role"} roles and internships.` })),
    apply: [
      { title: "LinkedIn", body: "Search fresher and internship roles" },
      { title: "Naukri.com", body: "Filter by city and 0-1 years experience" },
      { title: "Internshala", body: "Best for first internship" },
      { title: "Local institutes / referrals", body: "Ask for placement support and local openings" },
    ],
    remote: "Depends on role and company",
  };
  const guide = guides[field] || fallback;
  return {
    ...guide,
    cities: ["Mumbai", "Pune", "Bengaluru", "Hyderabad", "Delhi", "Chennai"],
  };
}

function detailedRelatedRoles(career, jobs) {
  const field = detectField(career);
  const roles = {
    marketing: [
      ["Content Writer", "Marketing > Content"],
      ["SEO Specialist", "Marketing > Search"],
      ["Digital Marketing Executive", "Marketing > Digital"],
      ["Graphic Designer", "Marketing > Design"],
      ["Performance Marketer", "Marketing > Paid Ads"],
      ["Influencer Marketing Manager", "Marketing > Influencer"],
      ["Email Marketing Specialist", "Marketing > Email"],
      ["Brand Manager", "Marketing > Brand"],
    ],
    tech: [
      ["Frontend Developer", "IT / Tech > Web"],
      ["Backend Developer", "IT / Tech > APIs"],
      ["Full Stack Developer", "IT / Tech > Product"],
      ["React Developer", "IT / Tech > Frontend"],
      ["Node.js Developer", "IT / Tech > Backend"],
      ["DevOps Engineer", "IT / Tech > Cloud"],
      ["QA Automation Engineer", "IT / Tech > Testing"],
      ["Product Engineer", "IT / Tech > SaaS"],
    ],
    data: [
      ["MIS Executive", "Data > Reporting"],
      ["Data Analyst", "Data > Analytics"],
      ["Business Analyst", "Data > Business"],
      ["Power BI Developer", "Data > Dashboards"],
      ["SQL Analyst", "Data > Database"],
      ["Operations Analyst", "Data > Ops"],
      ["Product Analyst", "Data > Product"],
      ["BI Consultant", "Data > Consulting"],
    ],
    design: [
      ["UI Designer", "Design > Interface"],
      ["UX Researcher", "Design > Research"],
      ["Product Designer", "Design > Product"],
      ["Graphic Designer", "Design > Visual"],
      ["Brand Designer", "Design > Brand"],
      ["Motion Designer", "Design > Motion"],
      ["Web Designer", "Design > Web"],
      ["Creative Lead", "Design > Leadership"],
    ],
  };
  const mapped = roles[field] || (jobs || []).map((job) => [job.title, career?.category || "Related"]);
  return mapped.slice(0, 8).map(([title, category]) => ({ title, category }));
}

function isWeakRoleSection(section, careerTitle) {
  const text = JSON.stringify(section || {}).toLowerCase();
  const title = String(careerTitle || "").toLowerCase();
  if (!text || text.length < 90) return true;
  if (/domain skills|research requirements|complete practical tasks|small agencies|local businesses|freelance clients|industry tools|collaboration tools/.test(text)) return true;
  if (title && !text.includes(title) && section?.num === 1) return true;
  return false;
}

function buildRoleAudienceCards(career) {
  const field = detectField(career);
  const title = career?.title || "this role";
  const defaults = {
    tech: [
      { icon: "🎓", title: "Just passed 12th?", body: "Yes, you can start if you build coding basics, GitHub projects, and a live portfolio. A degree helps for bigger companies but proof of work is the real entry ticket." },
      { icon: "🏫", title: "Graduate looking to start?", body: "BCA, BSc IT, BE/BTech, BCom, BBA, or any degree works if you add practical projects, internships, and interview-ready fundamentals." },
      { icon: "🔁", title: "Switching careers?", body: `You can move into ${title} if you practice daily, rebuild your resume around projects, and show 2-3 deployed apps instead of only certificates.` },
    ],
    marketing: [
      { icon: "🎓", title: "Just passed 12th?", body: "You do not need a degree to begin. Start with content, social media, analytics basics, and manage a page for a local business to create proof." },
      { icon: "🏫", title: "Graduate looking to start?", body: "Marketing, BBA, mass communication, commerce, arts, or any stream can enter. Internships and campaign samples matter more than marks." },
      { icon: "🔁", title: "Switching careers?", body: "Sales, BPO, teaching, content writing, and customer support experience become useful because this role needs audience understanding and communication." },
    ],
    finance: [
      { icon: "🎓", title: "12th commerce student?", body: "Commerce stream is ideal. Start with accounts, Excel, GST basics, and Tally/Zoho before choosing a deeper qualification." },
      { icon: "🏫", title: "Degree / stream needed?", body: "B.Com, BAF, BMS, BBA Finance, Economics, or CA/CMA/CS tracks help strongly. Some roles require formal eligibility and exam commitment." },
      { icon: "🔁", title: "Switching careers?", body: "Back-office, MIS, operations, banking support, and admin experience can help if you prove Excel, accuracy, and compliance discipline." },
    ],
    healthcare: [
      { icon: "🎓", title: "12th eligibility?", body: "Many healthcare roles need 12th science or a recognized certificate/diploma. Always verify eligibility before paying for a course." },
      { icon: "🏫", title: "Degree / diploma path", body: "Clinical roles usually need formal qualifications. Healthcare admin, coding, and support roles may allow broader backgrounds with certification." },
      { icon: "🔁", title: "Switching careers?", body: "Customer support, documentation, insurance, and operations experience can help in non-clinical healthcare roles." },
    ],
    default: [
      { icon: "🎓", title: "12th / beginner route", body: `Start with ${title} fundamentals, practical assignments, and a small portfolio before spending heavily on advanced courses.` },
      { icon: "🏫", title: "Degree / stream guidance", body: "Any stream can explore the role unless a regulated degree is mandatory. Choose the learning path based on eligibility and hiring expectations." },
      { icon: "🔁", title: "Career switchers", body: "Past experience helps when you translate it into domain knowledge, communication, process discipline, or customer understanding." },
    ],
  };
  return defaults[field] || defaults.default;
}

function buildCourseGlance(career) {
  const field = detectField(career);
  const fitRows = buildCareerFitRows(career);
  const valueFor = (label) => fitRows.find((row) => row.label === label)?.value || "Role based";
  const streamMap = {
    tech: "Any stream; PCM or Computer Science helps",
    data: "Any stream; maths/statistics/commerce helps",
    marketing: "Any stream; communication and creativity help",
    design: "Any stream; design/arts/media helps",
    finance: "Commerce preferred",
    healthcare: "Science or role-specific diploma may be required",
    law: "Any stream for BA LLB; degree required for LLB",
    government: "Exam-specific eligibility",
    aviation: "Any stream; grooming and communication matter",
    languages: "Any stream; language proficiency required",
    trade: "Any stream; skill certificate/apprenticeship helps",
  };
  return [
    { label: "12th pass", value: valueFor("12th Pass") },
    { label: "Degree mandatory", value: valueFor("Degree mandatory") },
    { label: "Best stream", value: streamMap[field] || "Any stream with practical proof" },
    { label: "Prior experience", value: valueFor("Prior experience needed") },
    { label: "English level", value: valueFor("English fluency needed") },
    { label: "Coding required", value: valueFor("Coding required") },
  ];
}

function buildDefaultRoleSections(career, computed, fitRows) {
  const title = career?.title || "this role";
  const category = career?.category || career?.field || "career";
  const specific = roleSpecificFallbacks(title);
  const tools = (computed.aiTools || []).slice(0, 5).map((tool) => ({ name: tool.name, use: tool.usedFor || tool.bestFor || "Role workflow" }));
  const jobs = (computed.jobs || []).slice(0, 4);
  const employerGuide = detailedEmployerGuide(career);
  const skillGroups = detailedSkillGroups(career);
  return [
    {
      num: 1,
      title: "What is this role?",
      type: "text",
      summary: career?.overview || career?.description || `${title} is a practical career path in India.`,
      items: specific.tasks,
    },
    { num: 2, title: "Is this job for me?", type: "fitTable", rows: fitRows },
    { num: 3, title: "Day-to-Day Tasks", type: "list", items: detailedDayTasks(career), cardList: true },
    {
      num: 4,
      title: "Skills You Need to Learn",
      type: "skills",
      hardSkills: skillGroups.hardSkills,
      softSkills: skillGroups.softSkills,
    },
    {
      num: 5,
      title: "Who Is This Role For?",
      type: "cards",
      cards: buildRoleAudienceCards(career),
    },
    {
      num: 6,
      title: "How to Get Started",
      type: "steps",
      steps: detailedGettingStarted(career),
      courses: (specific.courses || []).slice(0, 3).map((course, index) => ({
        mode: "Classroom",
        title: course,
        detail: index === 0 ? "3-6 months" : index === 1 ? "1-3 months" : "6-12 months",
      })),
    },
    {
      num: 7,
      title: `Best Institutes for Learning ${title}`,
      type: "institutes",
      items: [`Search ${title} institutes near your city`, "Compare reviews, trainer quality, practical assignments, and placement support", "Ask for demo class, project work, fees, and refund rules before paying"],
    },
    {
      num: 8,
      title: `Course Glance for ${title}`,
      type: "courseGlance",
      items: buildCourseGlance(career),
    },
    { num: 9, title: "Tools Used in This Role", type: "tools", tools: detailedTools(career, tools) },
    {
      num: 10,
      title: "Career Path & Salary Expectations",
      type: "salaryPath",
      steps: detailedSalaryPath(career, jobs),
      freelance: ["marketing", "design", "tech"].includes(detectField(career))
        ? { title: "Freelance Income (Work from Home)", rows: [["1 client", "Rs 8,000 - Rs 15,000/month"], ["3 clients", "Rs 30,000 - Rs 50,000/month"], ["5-6 clients", "Rs 80,000 - Rs 1,50,000/month"]] }
        : null,
      note: ["marketing", "design", "tech"].includes(detectField(career))
        ? "With strong proof of work, this career can grow through jobs, freelance clients, and remote projects."
        : "Income grows fastest when you combine practical skills, proof of work, and consistent applications.",
    },
    {
      num: 11,
      title: "Where Can I Work & Who Hires Freshers?",
      type: "employers",
      employerTypes: employerGuide.types,
      cities: employerGuide.cities,
      remote: employerGuide.remote,
      apply: employerGuide.apply,
      industries: getCuratedIndustries(career, career?.insights?.topIndustries).slice(0, 5),
      companies: career?.insights?.topCompaniesIndia || [],
    },
    { num: 12, title: `Related Roles in ${category}`, type: "related", roles: detailedRelatedRoles(career, jobs) },
  ];
}

function normalizeRoleReportSections(career, computed) {
  const fitRows = buildCareerFitRows(career);
  const defaultSections = buildDefaultRoleSections(career, computed, fitRows);
  const sections = career?.roleReport?.sections;
  if (Array.isArray(sections) && sections.length) {
    const byNum = new Map(sections.map((section, index) => [section.num || index + 1, { ...section, num: section.num || index + 1 }]));
    return defaultSections
      .map((fallback) => {
        const existing = byNum.get(fallback.num);
        if (!existing || [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(fallback.num) || isWeakRoleSection(existing, career?.title)) return fallback;
        return { ...fallback, ...existing, title: fallback.title, type: fallback.type };
      })
      .sort((a, b) => (a.num || 99) - (b.num || 99));
  }
  return defaultSections;
}

function RoleReportAccordion({ career, sections, onFindInstitutes }) {
  const [open, setOpen] = useState(() => Math.max(0, (sections || []).findIndex((section) => section.num === 2)));
  const fitBadgeClass = (value = "") => {
    const text = String(value).toLowerCase();
    if (/advantage|star|big/.test(text)) return "bg-amber-50 text-amber-700";
    if (/basic|enough|helpful/.test(text)) return "bg-brand-50 text-brand";
    if (/no|none|yes/.test(text)) return "bg-emerald-50 text-emerald-700";
    return "bg-brand-50 text-brand";
  };
  const fitBadgeText = (value = "") => {
    const text = String(value).trim();
    if (/^yes$/i.test(text)) return "☑ Yes";
    if (/advantage/i.test(text)) return "★ " + text;
    return text;
  };
  const renderSection = (section) => {
    const items = section.items || [];
    if (section.type === "fitTable") {
      return (
        <div className="border-t border-line">
          {(section.rows || []).map((row, index) => (
            <div key={`${row.label}-${index}`} className="grid grid-cols-[1.25fr_1fr] gap-2 border-b border-line last:border-b-0 px-3 sm:px-4 py-2.5 sm:py-3.5 text-[12px] sm:text-sm">
              <span className="font-bold text-[#2B255F]">{row.label}</span>
              <span>
                <span className={`inline-flex rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10.5px] sm:text-[11px] font-black ${fitBadgeClass(row.value)}`}>
                  {fitBadgeText(row.value)}
                </span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    if (section.type === "skills") {
      return (
        <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
          {[["Hard skills", section.hardSkills, "text-brand"], ["Soft skills", section.softSkills, "text-amber-600"]].map(([label, list, color]) => (
            <div key={label} className="rounded-xl sm:rounded-2xl border border-[#DCD4F3] bg-[#F8F4FF] p-3 sm:p-4">
              <p className={`font-heading text-xs sm:text-sm font-black uppercase tracking-widest ${color}`}>{label}</p>
              <div className="mt-2.5 sm:mt-3 border-t border-[#DCD4F3] pt-2.5 sm:pt-3 space-y-2">
                {(list || []).map((skill) => (
                  <div key={skill} className="rounded-lg sm:rounded-xl border border-line bg-white px-3 py-2.5 sm:py-3 text-[12.5px] sm:text-sm font-semibold leading-relaxed text-muted2">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (section.type === "cards") {
      return (
        <div className="space-y-3">
          {(section.cards || []).map((card) => (
            <div key={card.title} className="flex gap-2.5 sm:gap-3 rounded-xl border border-[#DCD4F3] bg-[#F7F3FF] p-3 sm:p-4">
              {card.icon && <span className="text-lg sm:text-xl leading-none">{card.icon}</span>}
              <div className="min-w-0">
                <p className="font-heading text-[13px] sm:text-sm font-black text-ink">{card.title}</p>
                <p className="mt-1 text-[12px] sm:text-[13px] text-muted2 leading-relaxed">{card.body}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (section.type === "steps") {
      const steps = section.steps || [];
      return (
        <div className="space-y-4 sm:space-y-5">
          <div className="relative pl-8 sm:pl-10">
            <div className="absolute left-3.5 sm:left-4 top-7 bottom-7 sm:top-8 sm:bottom-8 w-px bg-[#DCD4F3]" />
            <div className="space-y-6 sm:space-y-8">
              {steps.map((step, index) => (
                <div key={`${step.title || step.role}-${index}`} className="relative">
                  <span className="absolute -left-8 sm:-left-10 top-0 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-brand font-heading text-xs sm:text-sm font-black text-white">{index + 1}</span>
                  <p className="font-heading text-[13.5px] sm:text-base font-black leading-snug text-ink">{step.title || step.role}</p>
                  <p className="mt-1.5 sm:mt-2 text-[12.5px] sm:text-sm leading-relaxed text-muted2">{step.body || `${step.years || ""}${step.salary ? ` - ${step.salary}` : ""}`}</p>
                </div>
              ))}
            </div>
          </div>
          {section.courses?.length > 0 && (
            <div className="border-t border-dashed border-[#DCD4F3] pt-4 sm:pt-5">
              <p className="font-heading text-xs sm:text-sm font-black uppercase tracking-widest text-brand">Courses to explore (offline / classroom)</p>
              <div className="mt-3 space-y-3">
                {section.courses.map((course) => (
                  <div key={course.title} className="rounded-xl sm:rounded-2xl bg-[#120B3D] p-3 sm:p-4 text-center">
                    <p className="text-[11px] font-black uppercase tracking-widest text-yellow-300">{course.mode}</p>
                    <p className="mt-2 font-heading text-sm sm:text-base font-black text-white">{course.title}</p>
                    <p className="mt-1 text-xs sm:text-sm font-semibold text-white/60">{course.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    if (section.type === "salaryPath") {
      const steps = section.steps || [];
      return (
        <div className="space-y-4 sm:space-y-5">
          <div className="relative pl-6 sm:pl-7">
            <div className="absolute left-2.5 top-3 bottom-3 w-px bg-[#DCD4F3]" />
            <div className="space-y-4 sm:space-y-5">
              {steps.map((step, index) => (
                <div key={`${step.role}-${index}`} className="relative">
                  <span className={`absolute -left-[29px] top-1 h-5 w-5 rounded-full border-4 ${step.current ? "border-[#D8C7FF] bg-brand" : "border-[#F0EBFF] bg-[#DCD4F3]"}`} />
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-heading text-sm sm:text-base font-black text-ink">{step.role}</p>
                      <p className="mt-1 text-xs sm:text-sm font-semibold text-muted2">{step.years}</p>
                      <p className="mt-1 text-sm sm:text-base font-black text-brand">{step.salary}</p>
                      {step.body && <p className="mt-1 text-[12.5px] sm:text-sm leading-relaxed text-muted2">{step.body}</p>}
                    </div>
                    {step.current && <span className="w-fit rounded-lg bg-yellow-300 px-3 py-2 text-[11px] font-black uppercase text-ink">You are here</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {section.freelance && (
            <div className="rounded-xl sm:rounded-2xl bg-[#120B3D] p-3 sm:p-4 text-white">
              <p className="font-heading text-xs sm:text-sm font-black text-yellow-300">{section.freelance.title}</p>
              <div className="mt-3 space-y-2">
                {(section.freelance.rows || []).map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[0.8fr_1.2fr] gap-3 text-xs sm:text-sm">
                    <span className="text-white/70">{label}</span>
                    <span className="font-black">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {section.note && <div className="rounded-xl sm:rounded-2xl bg-brand p-3 sm:p-4 font-heading text-sm sm:text-base font-black leading-relaxed text-white">{section.note}</div>}
        </div>
      );
    }
    if (section.type === "tools") {
      return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(section.tools || []).map((tool) => (
            <div key={tool.name} className="rounded-xl sm:rounded-2xl border border-line bg-[#FAFAFE] p-3 sm:p-4">
              <div className="mb-2.5 sm:mb-3 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-[#F0EBFF] text-brand">
                <Bot size={16} />
              </div>
              <p className="font-heading text-sm sm:text-base font-black text-ink">{tool.name}</p>
              <p className="mt-1.5 sm:mt-2 text-[12.5px] sm:text-sm leading-relaxed text-muted2">{tool.use || tool.category || tool.description}</p>
            </div>
          ))}
        </div>
      );
    }
    if (section.type === "institutes") {
      return (
        <div>
          <ul className="space-y-2">
            {items.map((item) => <li key={item} className="flex items-start gap-2 text-[12.5px] sm:text-[13px] text-ink"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />{item}</li>)}
          </ul>
          <button onClick={onFindInstitutes} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-bold text-white">
            <Navigation size={15} /> Find institutes for {career?.title}
          </button>
        </div>
      );
    }
    if (section.type === "courseGlance") {
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {(section.items || []).map((item) => (
            <div key={item.label} className="rounded-xl border border-[#DCD4F3] bg-[#F7F3FF] p-2.5 sm:p-3">
              <p className="text-[9.5px] sm:text-[10px] font-black uppercase tracking-widest text-brand">{item.label}</p>
              <p className="mt-1 font-heading text-[13px] sm:text-sm font-black leading-snug text-ink">{item.value}</p>
            </div>
          ))}
        </div>
      );
    }
    if (section.type === "employers") {
      return (
        <div className="space-y-5">
          <div>
            <p className="font-heading text-sm sm:text-base font-black text-ink">Types of Employers</p>
            <div className="mt-3 space-y-2">
              {(section.employerTypes || []).map((item) => (
                <div key={item.title} className="rounded-xl bg-[#F6F1FF] p-2.5 sm:p-3 text-[12.5px] sm:text-sm leading-relaxed text-muted2">
                  <span className="font-black text-ink">{item.title}</span> - {item.body}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-heading text-sm sm:text-base font-black text-ink">Cities with Most Jobs</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(section.cities || []).map((city) => <span key={city} className="rounded-full bg-[#F0EBFF] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-black text-brand">{city}</span>)}
            </div>
          </div>
          {section.remote && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 sm:p-3 font-heading text-xs sm:text-sm font-black text-emerald-700">Remote work: {section.remote}</div>}
          <div>
            <p className="font-heading text-sm sm:text-base font-black text-ink">Where to Apply Right Now</p>
            <div className="mt-3 space-y-2">
              {(section.apply || []).map((item) => (
                <div key={item.title} className="flex items-center gap-3 rounded-xl border border-line bg-[#FAFAFE] p-2.5 sm:p-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-[13px] sm:text-sm font-black text-ink">{item.title}</p>
                    <p className="mt-1 text-[12px] sm:text-[12.5px] text-muted2">{item.body}</p>
                  </div>
                  <span className="text-brand">↗</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    if (section.type === "related") {
      return (
        <div className="space-y-2.5 sm:space-y-3">
          {(section.roles || []).map((role) => (
            <div key={role.title} className="flex items-center gap-2.5 sm:gap-3 rounded-xl border border-white/10 bg-[#120B3D] p-3 sm:p-4 text-white">
              <div className="min-w-0 flex-1">
                <p className="font-heading text-sm sm:text-base font-black text-white">{role.title}</p>
                <p className="mt-1 text-xs sm:text-sm text-white/60">{role.category}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const slug = String(role.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                  if (slug) window.location.href = `/careers/${slug}`;
                }}
                className="shrink-0 rounded-full bg-white px-2.5 sm:px-3 py-1.5 text-[10.5px] sm:text-[11px] font-black text-brand"
              >
                View Course
              </button>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div>
        {section.summary && <p className="text-[12.5px] sm:text-sm text-muted2 leading-relaxed">{section.summary}</p>}
        {items.length > 0 && (
          <ul className={`mt-3 ${section.cardList ? "space-y-3" : "space-y-2"}`}>
            {items.map((item) => (
              <li key={item} className={section.cardList ? "flex items-start gap-2.5 sm:gap-3 rounded-xl bg-[#F6F1FF] px-3 sm:px-4 py-3 sm:py-4 text-[12.5px] sm:text-sm leading-relaxed text-muted2" : "flex items-start gap-2 text-[12.5px] sm:text-[13px] text-ink"}>
                <span className="mt-0.5 shrink-0 text-base sm:text-lg font-black text-brand">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2.5 sm:space-y-3.5">
      {(sections || []).map((section, index) => {
        const isOpen = open === index;
        return (
          <div key={`${section.num}-${section.title}`} className="overflow-hidden rounded-xl sm:rounded-2xl border border-[#DCD4F3] bg-white">
            <button type="button" onClick={() => setOpen(isOpen ? -1 : index)} className="flex w-full items-center gap-2.5 sm:gap-3 px-3 sm:px-5 py-3 sm:py-5 text-left">
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0EBFF] text-xs sm:text-sm font-black text-brand">{section.num}</span>
              <span className="min-w-0 flex-1 font-heading text-[13px] sm:text-base font-black leading-snug text-ink">{section.title}</span>
              <span className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg border transition ${isOpen ? "border-brand bg-brand text-white" : "border-[#D6C9F5] text-[#8278B6]"}`}>
                {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </span>
            </button>
            {isOpen && <div className="px-3 pb-3 sm:px-5 sm:pb-5">{renderSection(section)}</div>}
          </div>
        );
      })}
    </div>
  );
}

export default function CareerReportPage({ slug: propSlug, embedded = false }) {
  const params = useParams();
  const slug = propSlug || params.slug;
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [career, setCareer] = useState(null);
  const [report, setReport] = useState(null); // AI roadmap data { stages, totalDuration }
  const [aiInsights, setAiInsights] = useState(null); // AI-generated insights
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");
  const [generating, setGenerating] = useState(false);
  const [tab, setTab] = useState("report");
  const reportRef = useRef(null);

  // 1) Load base career info + sync Roadmap/Institutes tabs
  useEffect(() => {
    let mounted = true;
    setCareer(null);
    setReport(null);
    setAiInsights(null);
    setStatus("loading");
    setErrorMsg("");
    setTab("report");
    (async () => {
      try {
        const { data } = await api.get(`/careers/${slug}`);
        if (!mounted) return;
        setCareer(data);

        // Sync with Roadmap & Institutes pages (localStorage + custom events)
        const resolvedSlug = data.slug || slug;
        const resolvedTitle = data.title || "";
        try {
          localStorage.setItem("last_roadmap_career_slug", resolvedSlug);
          localStorage.setItem("last_roadmap_career_title", resolvedTitle);
          localStorage.setItem("active_institute_course", resolvedTitle);
        } catch (_) { /* ignore quota */ }
        window.dispatchEvent(new CustomEvent("latecomers:roadmap-career-change", {
          detail: { slug: resolvedSlug, title: resolvedTitle },
        }));
        window.dispatchEvent(new CustomEvent("latecomers:institute-course-change", {
          detail: { course: resolvedTitle },
        }));
      } catch (e) {
        setErrorMsg(e?.response?.data?.detail || "Career not found.");
        setStatus("error");
      }
    })();
    return () => { mounted = false; };
  }, [slug]);

  // 2) Use the career report immediately. The /careers/:slug endpoint owns report generation/cache.
  useEffect(() => {
    if (!career?.slug) return;
    setReport({ stages: career.roadmap || [], totalDuration: career.roadmapTotalDuration || "12 Months" });
    setStatus("ready");
  }, [career]);
  // Fetch AI insights on demand (lazy: when user opens Overview or Insights tab)
  useEffect(() => {
    if (!career?.slug) return;
    if (aiInsights) return;
    if (tab !== "overview" && tab !== "insights") return;
    let cancelled = false;
    (async () => {
      setInsightsLoading(true);
      try {
        const { data } = await api.get(`/ai/insights/${career.slug}`);
        if (!cancelled && data) setAiInsights(data);
      } catch (e) {
        if (!cancelled) {
          // 500 means AI failed — show curated fallback (handled by getCurated* helpers)
          console.warn("AI insights failed, using curated fallback", e?.response?.data?.detail || e?.message);
        }
      } finally {
        if (!cancelled) setInsightsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [tab, career?.slug, aiInsights]);

  const regenerateInsights = async () => {
    if (!career?.slug) return;
    setInsightsLoading(true);
    setAiInsights(null);
    try {
      const { data } = await api.post(`/ai/insights/${career.slug}/refresh`);
      if (data) setAiInsights(data);
      toast.success("Insights regenerated with fresh AI data");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Couldn't regenerate insights");
    } finally {
      setInsightsLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 46;
      const usableW = pageW - margin * 2;
      let y = margin;

      const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
      const filename = `${clean(career?.title || "career-report").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "career-report"}-latecomers-report.pdf`;
      const addPageIfNeeded = (height = 40) => {
        if (y + height > pageH - margin) {
          doc.addPage();
          y = margin;
        }
      };
      const writeWrapped = (text, size = 10, color = [76, 72, 99], indent = 0, gap = 12) => {
        const lines = doc.splitTextToSize(clean(text), usableW - indent);
        addPageIfNeeded(lines.length * (size + 4) + gap);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(size);
        doc.setTextColor(...color);
        doc.text(lines, margin + indent, y);
        y += lines.length * (size + 4) + gap;
      };
      const section = (title) => {
        addPageIfNeeded(52);
        y += 8;
        doc.setFillColor(243, 238, 255);
        doc.roundedRect(margin, y - 18, usableW, 30, 8, 8, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(32, 13, 76);
        doc.text(title, margin + 12, y + 2);
        y += 28;
      };
      const bullet = (text) => writeWrapped(`- ${text}`, 9.5, [76, 72, 99], 10, 7);
      const smallTitle = (text) => {
        addPageIfNeeded(24);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(16, 7, 54);
        doc.text(clean(text), margin, y);
        y += 15;
      };

      doc.setFillColor(248, 246, 255);
      doc.rect(0, 0, pageW, pageH, "F");
      doc.setTextColor(124, 44, 242);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("LATECOMERS AI CAREER REPORT", margin, y);
      y += 26;
      doc.setTextColor(16, 7, 54);
      doc.setFontSize(26);
      doc.text(doc.splitTextToSize(clean(career?.title || "Career Report"), usableW), margin, y);
      y += 38;
      writeWrapped(career?.description || `Personalized roadmap for ${career?.title || "this career"}.`, 11, [76, 72, 99], 0, 16);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(124, 44, 242);
      doc.text(`Match: ${matchScore}%`, margin, y);
      doc.text(`Salary: Rs ${salaryMin}-${salaryMax} LPA`, margin + 120, y);
      doc.text(`Demand: ${demand}`, margin + 285, y);
      y += 26;

      section("1. Education");
      educationPaths.forEach((path) => {
        smallTitle(`${path.heading}${path.tag ? ` (${path.tag})` : ""} - ${path.duration}`);
        writeWrapped(path.body, 9.5, [76, 72, 99], 10, 8);
      });

      section("2. Skills to Master");
      skillStages.forEach((stage) => {
        smallTitle(stage.title);
        stage.items.forEach(bullet);
      });

      section("3. Courses Step by Step");
      courseMonths.forEach((month) => {
        smallTitle(`${month.month}: ${month.title}`);
        month.items.forEach(bullet);
      });

      section("4. AI Tools");
      aiTools.forEach((tool) => bullet(`${tool.name}: ${tool.usedFor}. Best for ${tool.bestFor}.`));

      section("5. Portfolio Projects");
      projects.forEach((p) => bullet(`${p.title} (${p.difficulty}) - Skills: ${p.skills}`));

      section("6. Placement Preparation");
      smallTitle("Resume Checklist");
      placement.resume.forEach(bullet);
      smallTitle("Top Interview Questions");
      placement.interviewQs.forEach(bullet);
      smallTitle("Remember");
      writeWrapped(placement.remember, 9.5, [76, 72, 99], 10, 8);

      section("7. Jobs You Can Apply For");
      jobs.forEach((job) => bullet(`${job.title} - ${job.salary} - ${job.level}. Skills: ${job.skills}`));

      const pages = doc.getNumberOfPages();
      for (let i = 1; i <= pages; i += 1) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(120, 116, 140);
        doc.text(`Latecomers AI - Page ${i} of ${pages}`, margin, pageH - 24);
      }
      doc.save(filename);
      toast.success("PDF downloaded");
    } catch (e) {
      console.error("PDF generation failed:", e);
      toast.error("Couldn't generate PDF. Please try again.");
    }
  };

  const retry = async () => {
    if (!career?.slug) return navigate("/careers-explore");
    setStatus("loading");
    setGenerating(true);
    try {
      const { data } = await api.post("/ai/roadmap/generate", { career_slug: career.slug });
      if (data?.stages?.length) {
        setReport(data);
        setStatus("ready");
      } else {
        throw new Error("Empty report");
      }
    } catch (e) {
      setErrorMsg(e?.response?.data?.detail || e?.message || "Retry failed.");
      setStatus("error");
    } finally {
      setGenerating(false);
    }
  };

  const stages = useMemo(() => report?.stages || [], [report?.stages]);

  const educationPaths = useMemo(() => buildEducationPaths(stages, career?.title || "this career"), [stages, career?.title]);
  const skillStages = useMemo(() => buildSkillStages(stages, career?.title || "this career"), [stages, career?.title]);
  const courseMonths = useMemo(() => buildCourseMonths(stages, career?.title || "this career"), [stages, career?.title]);
  const aiTools = useMemo(() => buildAITools(stages, career), [stages, career]);
  const projects = useMemo(() => buildProjects(stages, career?.title || "career"), [stages, career?.title]);
  const placement = useMemo(() => buildPlacement(stages, career?.title || "this career"), [stages, career?.title]);
  const jobs = useMemo(() => buildJobs(stages, career?.jobs, career?.title || "Role", career?.avgSalary), [stages, career]);
  const roleReportSections = useMemo(
    () => normalizeRoleReportSections(career, { educationPaths, skillStages, courseMonths, aiTools, projects, placement, jobs }),
    [career, educationPaths, skillStages, courseMonths, aiTools, projects, placement, jobs]
  );

  const openInstituteFinder = () => {
    const course = career?.title || "";
    try {
      localStorage.setItem("active_institute_course", course);
    } catch (_) {
      // ignore storage failures
    }
    window.dispatchEvent(new CustomEvent("latecomers:institute-course-change", { detail: { course } }));
    navigate(`/colleges?course=${encodeURIComponent(course)}&auto=1`);
  };

  const startQuiz = () => {
    navigate(isAuthenticated ? "/dashboard" : "/signin");
  };

  const openRoadmap = () => {
    setTab("report");
    window.setTimeout(() => {
      reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  // Auth-aware shell: logged-in users see the in-app dashboard layout (sidebar +
  // bottom tabs); public visitors see the marketing PublicShell. Embedded usage
  // (e.g. Roadmap page) bypasses both since the host page already provides chrome.
  const withShell = (node) => {
    if (embedded) return node;
    if (isAuthenticated) return <AppLayout>{node}</AppLayout>;
    return <PublicShell>{node}</PublicShell>;
  };

  if (status === "loading" && !report) {
    const title = career?.title || slug.split("-").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ");
    return withShell(<LoadingSkeleton title={title} />);
  }

  if (status === "error") {
    return withShell(<ErrorState message={errorMsg} onRetry={retry} />);
  }

  const matchScore = 89;
  const salaryMin = asNumber(career?.avgSalary?.min, 4);
  const salaryMax = asNumber(career?.avgSalary?.max, 15);
  const demand = career?.demand || "High";

  return withShell(
    <div className={embedded ? "" : "min-h-screen bg-[#F8F6FF]"}>
      {!embedded && <SEO title={`${career?.title || "Career"} - Latecomers AI Report`} description={`Personalized career report for ${career?.title}.`} path={`/careers/${slug}`} />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-4 sm:space-y-6">
        {!embedded && (
          <nav className="text-sm font-semibold text-muted2">
            <button type="button" onClick={() => navigate("/")} className="hover:text-brand">Home</button>
            <span className="px-2">›</span>
            <button type="button" onClick={() => navigate("/careers-explore")} className="hover:text-brand">
              {career?.category || "Careers"}
            </button>
            <span className="px-2">›</span>
            <span className="font-black text-brand">{career?.title}</span>
          </nav>
        )}

        {/* Hero / report header */}
        {!embedded ? (
          <PublicCareerHero
            career={career}
            onTakeQuiz={startQuiz}
            onFindInstitute={openInstituteFinder}
            onFindRoadmap={openRoadmap}
          />
        ) : (
        <div className="rounded-2xl border border-line bg-white p-4 sm:p-6 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] items-start">
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-brand">Your Career Report</p>
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-ink mt-1.5">{career?.title}</h1>
              <p className="mt-2 text-sm text-muted2 max-w-2xl leading-relaxed">{career?.description}</p>
            </div>
            <div className="flex flex-wrap gap-2 no-print">
              <button onClick={downloadPDF} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-brand-700 transition">
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 grid-cols-2 lg:grid-cols-4">
            <StatCard icon={CheckCircle2} label="Match Score" value={`${matchScore}%`} sub="Excellent Match" color="#10B981" />
            <StatCard icon={IndianRupee} label="Salary Range" value={`₹${salaryMin} - ${salaryMax} LPA`} sub="Average" color="#F97316" />
            <StatCard icon={TrendingUp} label="Demand" value={demand} sub="Top Cities" color="#EC4899" />
            <StatCard icon={Clock} label="Time to Job Ready" value="6 - 12 Months" sub="With consistent effort" color="#5B4FE9" />
          </div>
        </div>
        )}

        {/* Tab strip */}
        <div className="no-print rounded-2xl border border-line bg-white p-1.5 flex gap-1 overflow-x-auto no-scrollbar">
          {TABS.map((t) => {
            const TIcon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                  active ? "bg-brand text-white shadow-sm" : "text-muted2 hover:text-ink"
                }`}
              >
                <TIcon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* OVERVIEW tab */}
        {tab === "overview" && (
          <div className="space-y-4 sm:space-y-6">
            {(() => {
              const aiMatch = (user?.top_career_matches || []).find((m) => m.careerSlug === career?.slug);
              const activities = aiInsights?.activities?.length ? aiInsights.activities : deriveActivities(career);
              const overviewText = aiInsights?.overview || career?.overview || career?.description;
              const topSkills = (career?.skills || []).slice(0, 8);
              return (
                <>
                  {insightsLoading && !aiInsights && (
                    <div className="rounded-xl border border-brand/20 bg-brand-50 p-3 flex items-center gap-2 text-[12.5px] text-brand">
                      <Sparkles size={14} className="animate-pulse" />
                      Generating AI insights for {career?.title}…
                    </div>
                  )}

                  {aiMatch?.reasons?.length > 0 && (
                    <div className="rounded-2xl border border-line bg-white p-4 sm:p-5 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><Star size={15} /></span>
                        <p className="font-heading text-sm sm:text-base font-black text-ink">Why this fits you</p>
                        <span className="ml-auto rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold px-2.5 py-0.5">{aiMatch.matchPercent}% match</span>
                      </div>
                      <ul className="space-y-2">
                        {aiMatch.reasons.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-[13px] text-ink">
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" /> {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="rounded-2xl border border-line bg-white p-4 sm:p-5 shadow-sm">
                    <p className="font-heading text-base sm:text-lg font-black text-ink">What does a {career?.title} do?</p>
                    <p className="mt-2 text-sm text-muted2 leading-relaxed">{overviewText}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
                      {activities.map((a, i) => {
                        const iconSet = [Target, Search, BarChart3, Lightbulb];
                        const Icon = iconSet[i % iconSet.length];
                        return (
                          <div key={a} className="rounded-xl border border-line bg-[#FAFAFE] p-3 text-center">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand mb-1.5"><Icon size={15} /></span>
                            <p className="text-[12px] font-semibold text-ink leading-tight">{a}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {topSkills.length > 0 && (
                    <div className="rounded-2xl border border-line bg-white p-4 sm:p-5 shadow-sm">
                      <p className="font-heading text-base font-black text-ink">Top Skills</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {topSkills.map((s) => (
                          <span key={s.name} className="rounded-full border border-brand/30 bg-brand-50 text-brand text-[12px] font-bold px-3 py-1">{s.name}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button onClick={() => navigate("/ai-chat", { state: { careerSlug: career?.slug, careerTitle: career?.title } })} className="w-full rounded-2xl border border-brand/30 bg-brand-50 p-4 flex items-center gap-3 hover:bg-brand-100 transition">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl cc-logo-gradient text-white"><BrandClockMark size={23} /></span>
                    <div className="flex-1 text-left">
                      <p className="font-heading text-sm font-black text-ink">Have questions about {career?.title}?</p>
                      <p className="text-[12px] text-muted2 mt-0.5">Open AI chat with this career context attached.</p>
                    </div>
                    <span className="text-brand text-sm font-bold">Ask AI →</span>
                  </button>
                </>
              );
            })()}
          </div>
        )}

        {/* INSIGHTS tab */}
        {tab === "insights" && (
          <div className="space-y-4 sm:space-y-6">
            {(() => {
              const insights = career?.insights || {};
              // Prefer AI-generated insights; fall back to backend/curated data
              const countries = parseCountries(aiInsights?.topCountries || insights.topCountries);
              const industries = aiInsights?.topIndustries?.length
                ? aiInsights.topIndustries.slice(0, 6)
                : getCuratedIndustries(career, insights.topIndustries || career?.tags);
              const aiTools = aiInsights?.topAITools?.length
                ? aiInsights.topAITools
                : getCuratedAITools(career, insights.aiTools);
              const marketDemand = aiInsights?.marketDemand || insights.globalDemand || demand;
              const growthPct = aiInsights?.growthPct || asNumber(career?.jobGrowth5Y, 12);
              const openPositions = aiInsights?.openPositions || insights.openPositions || "10,000+";
              return (
                <>
                  <div className="rounded-2xl border border-line bg-white p-4 sm:p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand"><Globe size={15} /></span>
                      <p className="font-heading text-sm sm:text-base font-black text-ink">Market Demand</p>
                      {aiInsights && <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-brand">AI generated</span>}
                      {insightsLoading && !aiInsights && (
                        <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-brand font-bold">
                          <Sparkles size={11} className="animate-pulse" /> Generating…
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">Global Demand</p>
                        <p className="font-heading text-sm font-black text-emerald-700 mt-1">{marketDemand}</p>
                      </div>
                      <div className="rounded-xl border border-brand/20 bg-brand-50 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-brand">Growth (5Y)</p>
                        <p className="font-heading text-lg font-black text-brand mt-1">{growthPct}%</p>
                      </div>
                      <div className="rounded-xl border border-brand/20 bg-brand-50 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-brand">Open Positions</p>
                        <p className="font-heading text-sm font-black text-ink mt-1">{openPositions}</p>
                      </div>
                      <div className="rounded-xl border border-line bg-[#FAFAFE] p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-muted2">Top Countries</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {countries.map((c) => (
                            <span key={c.code} className="inline-flex items-center gap-1 rounded-full border border-line bg-white text-[11px] font-semibold text-ink px-2 py-0.5">{c.flag} {c.name}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {industries.length > 0 && (
                      <div className="mt-4">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-muted2 mb-2">Top Industries</p>
                        <div className="flex flex-wrap gap-1.5">
                          {industries.map((i) => (
                            <span key={i} className="inline-flex items-center gap-1 rounded-full border border-line bg-white text-[12px] font-semibold text-ink px-2.5 py-0.5">
                              <Briefcase size={11} className="text-brand" /> {i}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-line bg-white p-4 sm:p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <p className="font-heading text-base font-black text-ink">AI Tools for {career?.title}</p>
                      {aiInsights && <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-brand">AI generated</span>}
                    </div>
                    <p className="text-[12.5px] text-muted2 mt-1">Real software & platforms used by working professionals in this field.</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {aiTools.map((tool) => {
                        const t = typeof tool === "string" ? { name: tool } : tool;
                        return (
                          <div key={t.name} className="rounded-xl border border-line bg-[#FAFAFE] p-3 flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand text-[10px] font-black shrink-0">{t.name.slice(0, 2).toUpperCase()}</span>
                            <div className="min-w-0">
                              <p className="font-semibold text-[13px] text-ink truncate">{t.name}</p>
                              {t.category && <p className="text-[11px] text-muted2">{t.category}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              );
            })()}

            <div className="no-print text-center py-2">
              <button onClick={regenerateInsights} disabled={insightsLoading} className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-xs font-bold text-muted2 hover:text-brand hover:border-brand transition disabled:opacity-50">
                <RefreshCw size={13} className={insightsLoading ? "animate-spin" : ""} />
                {insightsLoading ? "Regenerating…" : "Regenerate insights with fresh AI"}
              </button>
            </div>
          </div>
        )}

        {/* INSTITUTE tab */}
        {tab === "institutes" && (
          <div className="rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand">
                  <Building2 size={22} />
                </div>
                <h2 className="mt-3 font-heading text-xl sm:text-2xl font-black text-ink">
                  Find institutes for {career?.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-muted2 leading-relaxed">
                  We will open the Institute Finder with this career name already filled. Add your city or use auto-location, then search nearby Indian institutes, coaching centers, and training options.
                </p>
              </div>
              <button
                type="button"
                onClick={openInstituteFinder}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-700 transition"
              >
                <Navigation size={16} /> Find Institute
              </button>
            </div>
          </div>
        )}

        {/* REPORT tab (default) */}
        {tab === "report" && (
          <div ref={reportRef} className="scroll-mt-28 space-y-4 sm:space-y-6">

        <div className="rounded-2xl border border-line bg-[#EEE9F8] p-3 sm:p-4">
          <RoleReportAccordion career={career} sections={roleReportSections} onFindInstitutes={openInstituteFinder} />
        </div>

        {false && (
          <>
        {/* 1. Education */}
        <SectionShell type="education">
          <p className="text-sm text-muted2 mb-4">You can become a <span className="font-bold text-ink">{career?.title}</span> through different education paths. Choose what suits you best.</p>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {educationPaths.map((path, idx) => (
              <div key={idx} className="rounded-xl border border-line bg-[#FAFAFE] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand text-xs font-black">{idx + 1}</span>
                  <p className="font-heading text-sm font-black text-ink">{path.heading}</p>
                </div>
                {path.tag && (
                  <span className="inline-block mb-2 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5">{path.tag}</span>
                )}
                <p className="text-[12.5px] text-muted2 leading-relaxed">{path.body}</p>
                <p className="mt-3 text-[11px] font-bold text-ink"><span className="text-brand">Duration:</span> {path.duration}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-[12px] text-amber-900">
            💡 <span className="font-bold">Tip:</span> A strong portfolio and practical skills matter more than just a degree in most industries.
          </div>
        </SectionShell>

        {/* 2. Skills */}
        <SectionShell type="skills">
          <p className="text-sm text-muted2 mb-4">Master these skills in the right order to become job-ready.</p>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
            {skillStages.map((stage, idx) => (
              <div key={idx} className="rounded-xl border border-line bg-[#FAFAFE] p-4">
                <p className="font-heading text-sm font-black text-ink">{stage.title}</p>
                <p className="text-[11px] text-muted2 mt-0.5">{stage.subtitle}</p>
                <ul className="mt-3 space-y-1.5">
                  {stage.items.map((item) => (
                    <li key={item} className="flex items-start gap-1.5 text-[12.5px] text-ink">
                      <span className="text-emerald-500 mt-0.5">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SectionShell>

        {/* 3. Courses */}
        <SectionShell type="courses">
          <p className="text-sm text-muted2 mb-4">Follow this roadmap to go from beginner to job-ready in 6 months.</p>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
            {courseMonths.map((m, idx) => (
              <div key={idx} className="rounded-xl border border-line bg-[#FAFAFE] p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-brand">{m.month}</p>
                <p className="font-heading text-sm font-black text-ink mt-1">{m.title}</p>
                <ul className="mt-2.5 space-y-1.5">
                  {m.items.map((item) => (
                    <li key={item} className="flex items-start gap-1.5 text-[12.5px] text-muted2">
                      <span className="text-brand mt-0.5">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SectionShell>

        {/* 4. AI Tools */}
        <SectionShell type="tools">
          <p className="text-sm text-muted2 mb-4">AI tools will 10x your productivity and creativity.</p>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-5">
            {aiTools.map((tool, idx) => (
              <div key={idx} className="rounded-xl border border-line bg-[#FAFAFE] p-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand">
                    <Bot size={15} />
                  </span>
                  <p className="font-heading text-sm font-black text-ink truncate">{tool.name}</p>
                </div>
                <p className="mt-2 text-[12px] text-muted2"><span className="font-bold text-ink">Used for:</span> {tool.usedFor}</p>
                <p className="mt-1 text-[11.5px] text-muted2"><span className="font-bold text-ink">Best for:</span> {tool.bestFor}</p>
              </div>
            ))}
          </div>
        </SectionShell>

        {/* 5. Portfolio Projects */}
        <SectionShell type="projects">
          <p className="text-sm text-muted2 mb-4">Build these projects and showcase them in your portfolio.</p>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <div key={p.num} className="rounded-xl border border-line bg-[#FAFAFE] p-4">
                <p className="text-xs font-black text-brand">{p.num}</p>
                <p className="font-heading text-sm font-black text-ink mt-1 leading-snug">{p.title}</p>
                <p className="mt-2 text-[12px] text-muted2"><span className="font-bold text-ink">Skills Used:</span> {p.skills}</p>
                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-muted2">Difficulty: <span className="text-ink">{p.difficulty}</span></span>
                  <span className="text-yellow-500">{"★".repeat(p.recruiterValue)}{"☆".repeat(5 - p.recruiterValue)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-brand-50 border border-brand/20 p-3 text-[12px] text-brand">
            💡 <span className="font-bold">Tip:</span> Add a case study for each project — Problem, Solution, Tools, Outcome.
          </div>
        </SectionShell>

        {/* 6. Placement Preparation */}
        <SectionShell type="placement">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-line bg-[#FAFAFE] p-4">
              <p className="font-heading text-sm font-black text-ink mb-3">Resume Checklist</p>
              <ul className="space-y-1.5">
                {placement.resume.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[12.5px] text-ink">
                    <CheckCircle2 size={13} className="shrink-0 text-emerald-500 mt-0.5" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-line bg-[#FAFAFE] p-4">
              <p className="font-heading text-sm font-black text-ink mb-3">Top Interview Questions</p>
              <ol className="space-y-1.5 list-decimal list-inside">
                {placement.interviewQs.map((q) => (
                  <li key={q} className="text-[12.5px] text-ink">{q}</li>
                ))}
              </ol>
            </div>
            <div className="rounded-xl border border-brand/20 bg-brand-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-brand" />
                <p className="font-heading text-sm font-black text-ink">Remember</p>
              </div>
              <p className="text-[12.5px] text-ink leading-relaxed">{placement.remember}</p>
            </div>
          </div>
        </SectionShell>

        {/* 7. Jobs You Can Apply For */}
        <SectionShell type="jobs">
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {jobs.map((j, idx) => (
              <div key={idx} className="rounded-xl border border-line bg-[#FAFAFE] p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand mb-2">
                  <Briefcase size={15} />
                </span>
                <p className="font-heading text-sm font-black text-ink leading-snug">{j.title}</p>
                <p className="mt-2 text-[11.5px] text-muted2"><span className="font-bold text-ink">Skills:</span> {j.skills}</p>
                <div className="mt-2.5 flex items-center justify-between text-[11px] font-bold">
                  <span className="text-brand">{j.salary}</span>
                  <span className="text-muted2">{j.level}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
          </>
        )}

          </div>
        )}

        {false && tab === "report" && (
          <div className="no-print text-center py-6">
            <button onClick={retry} disabled={generating} className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-xs font-bold text-muted2 hover:text-brand hover:border-brand transition disabled:opacity-50">
              <RefreshCw size={13} className={generating ? "animate-spin" : ""} />
              {generating ? "Regenerating…" : "Regenerate report with fresh AI"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
