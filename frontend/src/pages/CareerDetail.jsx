import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Bookmark,
  Bot,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Globe,
  IndianRupee,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const TAB_ITEMS = [
  { id: "overview", label: "Overview", icon: "LayoutGrid" },
  { id: "skills", label: "Skills", icon: "Blocks" },
  { id: "roadmap", label: "Path & Roadmap", icon: "RefreshCcw" },
  { id: "jobs", label: "Jobs", icon: "Briefcase" },
  { id: "insights", label: "Insights", icon: "BarChart3" },
];

const STAGE_ICONS = ["Rocket", "Code2", "Brain", "Briefcase", "Target"];
const STAGE_COLORS = ["#5B4FE9", "#22C55E", "#3B82F6", "#F97316", "#A855F7"];

const FALLBACK_STAGE_META = [
  { title: "Build a Strong Foundation", duration: "0 - 3 Months" },
  { title: "Learn Core Skills", duration: "3 - 6 Months" },
  { title: "Explore Advanced Topics", duration: "6 - 9 Months" },
  { title: "Work on Real-World Projects", duration: "9 - 12 Months" },
  { title: "Career Ready", duration: "12+ Months" },
];

const FALLBACK_JOB_META = [
  { level: "Fresher", experience: "0 - 1 Year", multiplier: 0.58 },
  { level: "Early", experience: "1 - 3 Years", multiplier: 0.86 },
  { level: "Mid", experience: "3 - 5 Years", multiplier: 1.12 },
  { level: "Experienced", experience: "5+ Years", multiplier: 1.5 },
  { level: "Expert", experience: "8+ Years", multiplier: 2.15 },
];

const CAREER_LOADING_STEPS = [
  {
    label: "Scanning Indian job demand",
    detail: "Checking role demand, hiring signals, and growth outlook.",
    icon: Search,
    color: "#5B4FE9",
  },
  {
    label: "Mapping salary bands",
    detail: "Estimating fresher, mid-level, and senior salary ranges.",
    icon: IndianRupee,
    color: "#22C55E",
  },
  {
    label: "Building skill map",
    detail: "Prioritizing the skills employers expect for this path.",
    icon: Target,
    color: "#F97316",
  },
  {
    label: "Designing roadmap",
    detail: "Creating a staged learning path from basics to job-ready.",
    icon: BookOpen,
    color: "#3B82F6",
  },
  {
    label: "Preparing career insights",
    detail: "Adding tools, industries, roles, and practical next steps.",
    icon: BarChart3,
    color: "#A855F7",
  },
];

const CAREER_LOADING_PREVIEWS = {
  Salary: ["Fresher range", "Mid-level range", "Senior ceiling"],
  Skills: ["Core skills", "Tool stack", "Practice focus"],
  Roadmap: ["Explore", "Learn", "Prepare", "Achieve"],
  Jobs: ["Entry roles", "Growth roles", "Leadership roles"],
};

const CAREER_ROLE_LIBRARY = {
  "business-analyst": [
    { level: "Campus", experience: "0 - 1 Year", title: "Business Analyst Trainee", desc: "Document requirements, map workflows, and support sprint ceremonies for product or operations teams.", salaryMin: 4.1, salaryMax: 7.5 },
    { level: "Associate", experience: "1 - 3 Years", title: "Associate Business Analyst", desc: "Own user stories, stakeholder interviews, dashboards, and acceptance criteria for business changes.", salaryMin: 6, salaryMax: 12 },
    { level: "Specialist", experience: "3 - 5 Years", title: "Business Systems Analyst", desc: "Translate complex processes into BRDs, FRDs, data flows, and system-ready specifications.", salaryMin: 9, salaryMax: 18 },
    { level: "Consultant", experience: "5 - 8 Years", title: "Product / Process Analyst", desc: "Lead discovery, prioritize requirements, and partner with product, engineering, finance, and operations.", salaryMin: 14, salaryMax: 28 },
    { level: "Leadership", experience: "8+ Years", title: "Principal Business Analyst", desc: "Define analysis standards, guide transformation programs, and influence business strategy with evidence.", salaryMin: 22, salaryMax: 42 },
  ],
  "data-scientist": [
    { level: "Campus", experience: "0 - 1 Year", title: "Data Analyst Intern / Trainee", desc: "Clean datasets, build reports, and validate business hypotheses with SQL, Excel, and Python.", salaryMin: 4.5, salaryMax: 7 },
    { level: "Associate", experience: "1 - 3 Years", title: "Data Scientist", desc: "Build predictive models, analyze experiments, and create insights for product or business teams.", salaryMin: 7, salaryMax: 12 },
    { level: "Specialist", experience: "3 - 5 Years", title: "Applied Data Scientist", desc: "Own ML use cases, feature engineering, model evaluation, and stakeholder-ready recommendations.", salaryMin: 12, salaryMax: 20 },
    { level: "Consultant", experience: "5 - 8 Years", title: "Machine Learning Scientist", desc: "Design production-grade models, mentor analysts, and align data science work with business value.", salaryMin: 20, salaryMax: 35 },
    { level: "Leadership", experience: "8+ Years", title: "Principal / Head of Data Science", desc: "Set data science strategy, govern model quality, and lead high-impact analytics programs.", salaryMin: 30, salaryMax: 60 },
  ],
  "software-developer": [
    { level: "Campus", experience: "0 - 1 Year", title: "Software Engineer Intern / Trainee", desc: "Ship small features, fix bugs, write tests, and learn engineering workflows with guidance.", salaryMin: 5, salaryMax: 10 },
    { level: "Associate", experience: "1 - 3 Years", title: "Software Engineer", desc: "Own product modules, APIs, database changes, and production-quality code reviews.", salaryMin: 8, salaryMax: 18 },
    { level: "Specialist", experience: "3 - 5 Years", title: "Backend / Full-Stack Engineer", desc: "Design services, improve performance, and collaborate across product, QA, and DevOps.", salaryMin: 16, salaryMax: 32 },
    { level: "Consultant", experience: "5 - 8 Years", title: "Staff Engineer / Tech Lead", desc: "Lead architecture, mentor engineers, and make tradeoffs across reliability, speed, and cost.", salaryMin: 28, salaryMax: 55 },
    { level: "Leadership", experience: "8+ Years", title: "Engineering Manager / Principal Engineer", desc: "Own technical direction, team execution, and large-scale engineering outcomes.", salaryMin: 45, salaryMax: 90 },
  ],
  "ux-designer": [
    { level: "Campus", experience: "0 - 1 Year", title: "UX Research / Design Intern", desc: "Support user interviews, journey maps, wireframes, and usability testing for product teams.", salaryMin: 3.5, salaryMax: 6 },
    { level: "Associate", experience: "1 - 3 Years", title: "UX Designer", desc: "Design user flows, prototypes, and interaction patterns backed by research insights.", salaryMin: 6, salaryMax: 12 },
    { level: "Specialist", experience: "3 - 5 Years", title: "Product Designer", desc: "Own end-to-end product experiences, visual systems, and measurable usability improvements.", salaryMin: 11, salaryMax: 20 },
    { level: "Consultant", experience: "5 - 8 Years", title: "Senior Product Designer", desc: "Lead design strategy, mentor designers, and partner with product leadership.", salaryMin: 18, salaryMax: 32 },
    { level: "Leadership", experience: "8+ Years", title: "Design Lead / UX Manager", desc: "Set design quality, research operations, and product experience direction.", salaryMin: 28, salaryMax: 50 },
  ],
};

const EMPTY_CAREER = {
  slug: "",
  title: "",
  icon: "Briefcase",
  iconColor: "#5B4FE9",
  avgSalary: { min: 6, max: 14 },
  jobGrowth5Y: 12,
  jobRoles: "10+",
  demand: "High",
  skills: [],
  roadmap: [],
  jobs: [],
  tags: [],
  insights: {},
};

function levelColor(level) {
  if (level === "Fresher" || level === "Entry") return "#22C55E";
  if (level === "Early" || level === "Mid") return "#3B82F6";
  if (level === "Senior") return "#F97316";
  if (level === "Experienced" || level === "Lead") return "#A855F7";
  return "#EC4899";
}

function asNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function formatLpa(value) {
  const n = asNumber(value, 0);
  return `₹${n.toFixed(1)} L`;
}

function toFlagEmoji(code) {
  if (!code || code.length !== 2) return null;
  const clean = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(clean)) return null;
  return String.fromCodePoint(...clean.split("").map((c) => c.charCodeAt(0) + 127397));
}

function parseTopCountryFlags(raw) {
  if (Array.isArray(raw)) {
    return raw.map((x) => toFlagEmoji(String(x))).filter(Boolean).slice(0, 6);
  }

  if (typeof raw !== "string" || raw.trim().length === 0) {
    return ["🇮🇳", "🇺🇸", "🇬🇧", "🇦🇺"];
  }

  const directCodes = raw
    .replace(/[^a-zA-Z]/g, " ")
    .split(/\s+/)
    .map((x) => x.trim().toUpperCase())
    .filter((x) => x.length === 2);

  const compactCodes = raw
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase()
    .match(/[A-Z]{2}/g) || [];

  const unique = [...new Set([...(directCodes.length ? directCodes : compactCodes)])];
  const flags = unique.map((x) => toFlagEmoji(x)).filter(Boolean);
  return flags.length ? flags.slice(0, 6) : ["🇮🇳", "🇺🇸", "🇬🇧", "🇦🇺"];
}

const COUNTRY_CODE_BY_NAME = {
  india: "IN",
  "united states": "US",
  usa: "US",
  us: "US",
  canada: "CA",
  "united kingdom": "GB",
  uk: "GB",
  germany: "DE",
  australia: "AU",
  singapore: "SG",
  uae: "AE",
  "united arab emirates": "AE",
  netherlands: "NL",
  ireland: "IE",
};

const COUNTRY_NAME_BY_CODE = {
  IN: "India",
  US: "United States",
  CA: "Canada",
  GB: "United Kingdom",
  DE: "Germany",
  AU: "Australia",
  SG: "Singapore",
  AE: "UAE",
  NL: "Netherlands",
  IE: "Ireland",
};

function parseTopCountries(raw) {
  const fallback = ["IN", "US", "GB", "CA"];
  const source = Array.isArray(raw)
    ? raw
    : typeof raw === "string" && raw.trim()
      ? raw.split(/[,;|]/)
      : fallback;

  const countries = source
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .map((item) => {
      const lower = item.toLowerCase();
      const code = /^[a-z]{2}$/i.test(item) ? item.toUpperCase() : COUNTRY_CODE_BY_NAME[lower];
      if (!code) return null;
      return {
        code,
        flag: toFlagEmoji(code),
        name: COUNTRY_NAME_BY_CODE[code] || item,
      };
    })
    .filter(Boolean);

  const unique = [];
  countries.forEach((country) => {
    if (!unique.some((item) => item.code === country.code)) unique.push(country);
  });
  const india = { code: "IN", flag: toFlagEmoji("IN"), name: "India" };
  const indiaFirst = [india, ...unique.filter((country) => country.code !== "IN")];
  return indiaFirst.slice(0, 4);
}

function deriveActivityList(career) {
  const workAreas = career.overviewDetails?.workAreas;
  if (Array.isArray(workAreas) && workAreas.length) {
    return workAreas.map((area) => area.title || area).filter(Boolean).slice(0, 4);
  }

  const map = {
    "data-scientist": ["Collect and clean data", "Analyze patterns", "Build predictive models", "Present insights"],
    "software-developer": ["Build product features", "Write maintainable code", "Debug and test", "Deploy services"],
    "ux-designer": ["Research users", "Design wireframes", "Prototype and validate", "Ship design systems"],
    "chartered-accountant": ["Audit and compliance", "Tax planning", "Financial reporting", "Business advisory"],
    "financial-analyst": ["Study financial data", "Build valuation models", "Create reports", "Guide decisions"],
  };

  if (map[career.slug]) return map[career.slug];

  const fromSkills = (career.skills || []).map((s) => s.name).slice(0, 4);
  if (fromSkills.length >= 4) return fromSkills;
  return [...fromSkills, "Problem solving", "Execution", "Communication", "Growth"].slice(0, 4);
}

function normalizeSkills(career) {
  const existing = (career.skills || []).map((s) => ({
    name: s.name,
    importance: asNumber(s.importance, 72),
    status: s.priority || s.status || "Important",
    description: s.description || "",
    type: s.type || s.group,
  }));

  const title = career.title || "Career";
  const defaults = [
    { name: `${title} Communication`, importance: 72, status: "Important" },
    { name: `${title} Problem Solving`, importance: 78, status: "Important" },
    { name: `${title} Industry Awareness`, importance: 68, status: "Important" },
  ];

  const names = new Set(existing.map((s) => s.name.toLowerCase()));
  defaults.forEach((d) => {
    if (!names.has(d.name.toLowerCase())) existing.push(d);
  });

  return existing.sort((a, b) => b.importance - a.importance);
}

function normalizeRoadmap(career) {
  const raw = Array.isArray(career.roadmap) ? career.roadmap : [];
  if (raw.length) {
    return raw.map((stage, idx) => ({
      stageNum: stage.stageNum || idx + 1,
      title: stage.title || FALLBACK_STAGE_META[idx]?.title || `Stage ${idx + 1}`,
      duration: stage.duration || FALLBACK_STAGE_META[idx]?.duration || "Flexible",
      description: stage.description || "Build relevant practical capability for this stage.",
      skills: stage.skills || [],
    }));
  }

  const skillBuckets = normalizeSkills(career).map((s) => s.name);
  return FALLBACK_STAGE_META.map((meta, idx) => {
    const start = idx * 2;
    return {
      stageNum: idx + 1,
      title: meta.title,
      duration: meta.duration,
      description:
        idx === 0
          ? `Learn the fundamentals required to start as a ${career.title}.`
          : idx === 4
            ? `Prepare for interviews, applications, and role readiness in ${career.title}.`
            : `Advance your practical ability in ${career.title} with structured learning and outcomes.`,
      skills: skillBuckets.slice(start, start + 4),
    };
  });
}

function normalizeJobs(career) {
  const minBase = asNumber(career.avgSalary?.min, 6);
  const maxBase = asNumber(career.avgSalary?.max, Math.max(minBase + 6, 12));
  const titleBase = career.title || "Role";
  const libraryJobs = CAREER_ROLE_LIBRARY[career.slug] || [];

  const raw = Array.isArray(career.jobs) && career.jobs.length ? career.jobs : libraryJobs;
  if (raw.length) {
    return raw.map((job, idx) => {
      const low = asNumber(job.salaryMin, minBase + idx * 2);
      const high = asNumber(job.salaryMax, Math.max(low + 2, low * 1.6));
      return {
        level: job.level || ["Campus", "Associate", "Specialist", "Consultant", "Leadership"][idx] || "Specialist",
        experience: job.experience || FALLBACK_JOB_META[idx]?.experience || "3 - 5 Years",
        title: job.title || `${titleBase} ${idx + 1}`,
        desc: job.desc || "Own higher impact responsibilities and outcomes.",
        salaryMin: low,
        salaryMax: Math.max(high, low + 1),
      };
    });
  }

  const primarySkill = normalizeSkills(career)[0]?.name || "core tools";
  const primaryIndustry = career.insights?.topIndustries?.[0] || career.tags?.[0] || "industry teams";
  const roleTracks = [
    {
      level: "Campus",
      experience: "0 - 1 Year",
      title: `${titleBase} Trainee`,
      desc: `Learn the role through guided tasks, documentation, and practical work with ${primarySkill}.`,
      multiplier: 0.58,
    },
    {
      level: "Associate",
      experience: "1 - 3 Years",
      title: `Associate ${titleBase}`,
      desc: `Handle everyday delivery, collaborate with cross-functional teams, and build reliable career foundations.`,
      multiplier: 0.86,
    },
    {
      level: "Specialist",
      experience: "3 - 5 Years",
      title: `${primarySkill} ${titleBase}`,
      desc: `Apply domain expertise in ${primaryIndustry} and own measurable outcomes for projects or clients.`,
      multiplier: 1.12,
    },
    {
      level: "Consultant",
      experience: "5 - 8 Years",
      title: `${titleBase} Consultant`,
      desc: `Guide teams, solve ambiguous problems, and translate experience into business-ready recommendations.`,
      multiplier: 1.5,
    },
    {
      level: "Leadership",
      experience: "8+ Years",
      title: `${titleBase} Practice Lead`,
      desc: `Shape strategy, mentor teams, and lead high-value programs across the career domain.`,
      multiplier: 2.15,
    },
  ];

  return roleTracks.map((track) => {
    const low = Math.max(2.5, minBase * track.multiplier);
    const high = Math.max(low + 1.5, maxBase * (track.multiplier + 0.3));
    return {
      level: track.level,
      experience: track.experience,
      title: track.title,
      desc: track.desc,
      salaryMin: Number(low.toFixed(1)),
      salaryMax: Number(high.toFixed(1)),
    };
  });
}

function getToolCategory(name = "") {
  const n = name.toLowerCase();
  if (/(python|sql|excel|statistics|analysis|tableau|power bi|pandas|numpy|notion|linear)/.test(n)) return "Analytics";
  if (/(docker|kubernetes|terraform|tensorflow|pytorch|scikit|ml|aws|azure|gcp|git)/.test(n)) return "Automation";
  return "Core";
}

function normalizeTools(career, skills) {
  const fromInsights = (career.insights?.aiTools || []).map((tool) => {
    if (typeof tool === "string") return { name: tool, category: getToolCategory(tool) };
    return {
      name: tool?.name || "AI Tool",
      category: tool?.category || getToolCategory(tool?.name || ""),
      description: tool?.description || "",
    };
  });
  if (fromInsights.length) return fromInsights;
  return skills.slice(0, 6).map((s) => ({ name: s.name, category: getToolCategory(s.name) }));
}

function getSkillCategory(name = "") {
  const n = name.toLowerCase();
  if (/(communication|empathy|storytelling|leadership|research|speaking|collaboration)/.test(n)) return "Soft Skill";
  if (/(figma|excel|sql|python|tableau|power bi|docker|aws|azure|gcp|autocad|revit|git|analytics|hubspot|bloomberg)/.test(n)) return "Tool";
  if (/(strategy|analysis|problem|statistics|modeling|accounting|taxation|legal|security|networking)/.test(n)) return "Analytical";
  return "Core";
}

function AskAiCta({ title, body, color, onClick }) {
  return (
    <div className="bg-brand-50 border border-brand-100 rounded-3xl p-4 sm:p-5 flex items-center gap-3">
      <div className="w-12 h-12 rounded-2xl cc-logo-gradient flex items-center justify-center shrink-0 shadow-brand">
        <Bot size={21} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-heading font-bold text-base text-ink">{title}</p>
        <p className="text-sm text-muted2 mt-0.5">{body}</p>
      </div>
      <button
        onClick={onClick}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border bg-white text-sm font-bold shrink-0"
        style={{ borderColor: `${color}70`, color }}
      >
        <Bot size={16} /> Ask AI
      </button>
    </div>
  );
}

function CircleScore({ value, color }) {
  const size = 96;
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const dash = (Math.max(0, Math.min(100, value)) / 100) * circumference;

  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E8E4FF" strokeWidth="8" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="8" strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading font-extrabold text-2xl leading-none" style={{ color }}>{value}%</span>
        <span className="text-[10px] text-muted2 font-semibold mt-0.5">Match Score</span>
      </div>
    </div>
  );
}

function CareerHeroGraphic({ color }) {
  const bars = [36, 58, 41, 72, 54, 84, 66];
  return (
    <div className="hidden sm:block w-[170px] h-[126px] relative shrink-0">
      <div className="absolute inset-x-7 bottom-1 h-5 rounded-full blur-xl" style={{ background: `${color}35` }} />
      <div
        className="absolute right-1 top-2 w-[148px] h-[104px] rounded-[22px] border border-white/80 shadow-xl overflow-hidden"
        style={{
          background: `linear-gradient(145deg, #ffffff 0%, ${color}16 48%, ${color}2e 100%)`,
          transform: "perspective(420px) rotateY(-18deg) rotateX(6deg)",
        }}
      >
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: `${color}85` }} />
          <span className="w-2 h-2 rounded-full bg-white" />
          <span className="w-2 h-2 rounded-full bg-white" />
        </div>
        <div className="absolute top-9 left-4 right-4 h-2.5 rounded-full bg-white/80" />
        <div className="absolute top-14 left-4 w-12 h-2 rounded-full" style={{ background: `${color}55` }} />
        <div className="absolute bottom-4 left-4 right-4 h-11 flex items-end gap-1.5">
          {bars.slice(0, 5).map((h, i) => (
            <div key={i} className="w-3 rounded-t-lg shadow-sm" style={{ height: `${h}%`, background: i === 3 ? color : `${color}8c` }} />
          ))}
        </div>
        <div className="absolute right-5 bottom-4 w-10 h-10 rounded-full border-[7px] bg-white" style={{ borderColor: `${color}82` }} />
      </div>
      <div className="absolute left-0 top-12 w-14 h-14 rounded-2xl border border-white/80 bg-white shadow-lg flex items-center justify-center" style={{ color }}>
        <TrendingUp size={23} />
      </div>
    </div>
  );
}

function ToolBadge({ name }) {
  const n = name.toLowerCase();
  if (n.includes("python")) return <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-extrabold">Py</div>;
  if (n.includes("sql")) return <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center text-[10px] font-extrabold">SQL</div>;
  if (n.includes("tensor")) return <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-extrabold">TF</div>;
  if (n.includes("scikit")) return <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-extrabold">SK</div>;
  if (n.includes("docker")) return <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-[10px] font-extrabold">DK</div>;
  return <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand flex items-center justify-center text-[10px] font-extrabold">{name.slice(0, 2).toUpperCase()}</div>;
}

export default function CareerDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, refresh } = useAuth();

  const [career, setCareer] = useState(null);
  const [tab, setTab] = useState("overview");
  const [toolFilter, setToolFilter] = useState("All");
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingPreview, setLoadingPreview] = useState("Salary");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get(`/careers/${slug}`);
        if (!mounted) return;
        setCareer(data);
      } catch (error) {
        toast.error(error?.response?.data?.detail || "Failed to load career details.");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if (career) return;
    const id = setInterval(() => {
      setLoadingStep((step) => (step + 1) % CAREER_LOADING_STEPS.length);
    }, 1400);
    return () => clearInterval(id);
  }, [career]);

  const currentCareer = career || EMPTY_CAREER;
  const iconColor = currentCareer.iconColor || "#5B4FE9";
  const CareerIcon = Icons[currentCareer.icon] || Briefcase;
  const isSaved = (user?.saved_items?.careers || []).includes(currentCareer.career_id);
  const aiMatch = (user?.top_career_matches || []).find((m) => m.careerSlug === currentCareer.slug);

  const skills = useMemo(() => normalizeSkills(currentCareer), [currentCareer]);
  const roadmapStages = useMemo(() => normalizeRoadmap(currentCareer), [currentCareer]);
  const jobs = useMemo(() => normalizeJobs(currentCareer), [currentCareer]);
  const activities = useMemo(() => deriveActivityList(currentCareer), [currentCareer]);
  const tools = useMemo(() => normalizeTools(currentCareer, skills), [currentCareer, skills]);
  const countries = useMemo(() => parseTopCountries(currentCareer.insights?.topCountries), [currentCareer]);
  const topIndustries = (currentCareer.insights?.topIndustries || currentCareer.tags || []).slice(0, 6);
  const filteredTools = tools.filter((t) => toolFilter === "All" || t.category === toolFilter);

  if (!career) {
    const loadingTitle = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const activeStep = CAREER_LOADING_STEPS[loadingStep];
    const LoadingIcon = activeStep.icon;
    const previewItems = CAREER_LOADING_PREVIEWS[loadingPreview] || [];
    return (
      <div className="min-h-[72vh] flex items-center justify-center px-4 py-8 overflow-hidden">
        <div className="relative max-w-4xl w-full">
          <div className="absolute -top-10 left-10 w-28 h-28 rounded-full bg-brand-100 blur-3xl opacity-70" />
          <div className="absolute -bottom-8 right-8 w-32 h-32 rounded-full bg-emerald-100 blur-3xl opacity-70" />

          <div className="relative glass-card rounded-3xl p-5 sm:p-7 lg:p-8 border border-white/80">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6 items-center">
              <div className="text-center lg:text-left">
                <div className="relative w-24 h-24 mx-auto lg:mx-0">
                  <div className="absolute inset-0 rounded-[2rem] cc-logo-gradient opacity-20 animate-ping" />
                  <div className="absolute inset-2 rounded-[1.65rem] cc-logo-gradient text-white flex items-center justify-center shadow-brand">
                    <Bot size={34} />
                  </div>
                  <div
                    className="absolute -right-2 -bottom-1 w-11 h-11 rounded-2xl bg-white border border-line flex items-center justify-center shadow-soft"
                    style={{ color: activeStep.color }}
                  >
                    <LoadingIcon size={21} />
                  </div>
                </div>

                <p className="text-xs font-bold text-brand uppercase tracking-wider mt-5">
                  Personalized career intelligence
                </p>
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink mt-2 leading-tight">
                  Building your {loadingTitle} career profile
                </h1>
                <p className="text-sm text-muted2 mt-3 leading-relaxed">
                  {activeStep.detail}
                </p>

                <div className="mt-5 flex items-center gap-2">
                  {CAREER_LOADING_STEPS.map((step, index) => (
                    <div
                      key={step.label}
                      className={`h-2 rounded-full transition-all duration-500 ${index === loadingStep ? "w-16" : "w-7"}`}
                      style={{ background: index <= loadingStep ? step.color : "#E8E4FF" }}
                    />
                  ))}
                </div>

                <div className="mt-5 bg-white/80 border border-line rounded-2xl p-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${activeStep.color}18`, color: activeStep.color }}>
                      <LoadingIcon size={19} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-ink">{activeStep.label}</p>
                      <p className="text-xs text-muted2 mt-0.5">Step {loadingStep + 1} of {CAREER_LOADING_STEPS.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(CAREER_LOADING_PREVIEWS).map((name) => {
                    const active = loadingPreview === name;
                    return (
                      <button
                        key={name}
                        onClick={() => setLoadingPreview(name)}
                        className={`rounded-2xl border p-3 text-left transition-all ${
                          active
                            ? "bg-brand text-white border-brand shadow-brand"
                            : "bg-white border-line text-ink hover:border-brand-300 hover:bg-brand-50"
                        }`}
                      >
                        <p className="text-xs font-bold">{name}</p>
                        <p className={`text-[11px] mt-1 ${active ? "text-white/80" : "text-muted2"}`}>
                          Preview queue
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="bg-white border border-line rounded-3xl p-4 sm:p-5 shadow-soft">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-muted2 uppercase tracking-wider">Now assembling</p>
                      <p className="font-heading font-bold text-lg text-ink mt-1">{loadingPreview}</p>
                    </div>
                    <Sparkles size={20} className="text-brand animate-pulse" />
                  </div>

                  <div className="mt-4 space-y-3">
                    {previewItems.map((item, index) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand flex items-center justify-center text-xs font-extrabold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-ink">{item}</p>
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 rounded-full px-2 py-0.5">
                              queued
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 rounded-full bg-brand-100 overflow-hidden">
                            <div
                              className="h-full rounded-full cc-logo-gradient transition-all duration-700"
                              style={{ width: `${Math.min(95, 38 + loadingStep * 12 + index * 8)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                    {["Salary", "Skills", "Jobs"].map((label, index) => (
                      <div key={label} className="rounded-2xl bg-brand-50 p-3">
                        <p className="text-[11px] text-muted2">{label}</p>
                        <p className="font-heading font-extrabold text-brand text-lg mt-0.5">
                          {loadingStep > index ? "Ready" : "Live"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const toggleSave = async () => {
    try {
      await api.post(isSaved ? "/me/unsave" : "/me/save", { kind: "careers", item_id: career.career_id });
      await refresh();
      toast.success(isSaved ? "Removed from saved careers." : "Saved to your careers.");
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Unable to update saved state.");
    }
  };

  const statItems = [
    {
      icon: IndianRupee,
      label: "Avg. Salary",
      value: `₹${asNumber(career.avgSalary?.min, 5)} - ${asNumber(career.avgSalary?.max, 15)} LPA`,
    },
    {
      icon: TrendingUp,
      label: "Job Growth (5Y)",
      value: `${asNumber(career.jobGrowth5Y, 12)}%`,
      sub: career.demand || "High",
    },
    {
      icon: Briefcase,
      label: "Job Roles",
      value: career.jobRoles || `${jobs.length}+ Roles`,
    },
    {
      icon: Users,
      label: "Demand",
      value: career.demand || "High",
    },
  ];

  const openCareerAI = (focus = "career guidance") => {
    navigate("/ai-chat", {
      state: {
        careerSlug: career.slug,
        careerTitle: career.title,
        careerDescription: career.description,
        careerOverview: career.overview,
        careerFullContext: {
          title: career.title,
          category: career.category,
          field: career.field,
          tags: career.tags || [],
          salary: career.avgSalary,
          jobGrowth5Y: career.jobGrowth5Y,
          demand: career.demand,
          overviewDetails: career.overviewDetails,
          skills,
          roadmap: roadmapStages,
          jobs,
          insights: career.insights,
          salaryProgression: career.salaryProgression,
        },
        careerFocus: focus,
        careerStats: {
          salary: `${asNumber(career.avgSalary?.min, 5)} - ${asNumber(career.avgSalary?.max, 15)} LPA`,
          growth: `${asNumber(career.jobGrowth5Y, 12)}%`,
          demand: career.demand || "High",
          roles: career.jobRoles || `${jobs.length}+ Roles`,
        },
        careerSkills: skills.slice(0, 8).map((skill) => skill.name),
        careerJobs: jobs.slice(0, 5).map((job) => job.title),
      },
    });
  };

  return (
    <div className="max-w-[1100px] mx-auto pb-24 md:pb-10" data-testid="career-detail-page">
      <div className="bg-white/95 border-b border-line px-4 sm:px-6 py-4 sticky top-0 z-20 backdrop-blur">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-ink shrink-0">
            <ArrowLeft size={20} />
          </button>
          <p className="flex-1 font-heading font-bold text-base sm:text-lg text-ink truncate">{career.title}</p>
          <button onClick={toggleSave} className={`p-2 rounded-full ${isSaved ? "text-brand" : "text-muted2"}`}>
            <Bookmark size={20} fill={isSaved ? iconColor : "none"} />
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-6">
        <div className="glass-card rounded-3xl p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm shrink-0" style={{ background: `${iconColor}24`, color: iconColor }}>
                <CareerIcon size={30} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink">{career.title}</h1>
                  {aiMatch && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">✨ {aiMatch.matchPercent}% Match</span>
                  )}
                </div>
                <p className="text-sm sm:text-base text-muted2 mt-2 leading-relaxed">{career.description}</p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {(career.tags || []).map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-semibold border border-line text-muted2">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            <CareerHeroGraphic color={iconColor} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 border-t border-line pt-5">
            {statItems.map((item) => (
              <div key={item.label} className="rounded-2xl bg-white border border-line p-3 sm:p-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: `${iconColor}1e`, color: iconColor }}>
                  <item.icon size={16} />
                </div>
                <p className="text-[11px] text-muted2">{item.label}</p>
                <p className="text-sm font-bold text-ink mt-0.5">{item.value}</p>
                {item.sub && <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">{item.sub}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto no-scrollbar">
          <div className="w-max min-w-full bg-white border border-line rounded-2xl p-1 flex gap-1">
            {TAB_ITEMS.map((item) => (
              (() => {
                const TabIcon = Icons[item.icon] || Sparkles;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition inline-flex items-center gap-1.5 ${
                      tab === item.id ? "text-white shadow-sm" : "text-muted2 hover:text-ink"
                    }`}
                    style={tab === item.id ? { background: iconColor } : {}}
                  >
                    <TabIcon size={14} />
                    {item.label}
                  </button>
                );
              })()
            ))}
          </div>
        </div>

        {tab === "overview" && (
          <div className="mt-4 space-y-4">
            {aiMatch?.reasons?.length > 0 && (
              <div className="glass-card rounded-3xl p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${iconColor}20`, color: iconColor }}>
                        <Star size={15} />
                      </div>
                      <p className="font-heading font-bold text-lg text-ink">Why this is a great fit for you</p>
                    </div>
                    <ul className="space-y-2">
                      {aiMatch.reasons.map((reason, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm sm:text-base text-ink">
                          <CheckCircle2 size={17} className="shrink-0 mt-0.5" style={{ color: iconColor }} />
                          {reason}
                        </li>
                      ))}
                    </ul>
                    <Link to="/careers" className="inline-flex items-center gap-1 text-sm font-semibold mt-3" style={{ color: iconColor }}>
                      View full match analysis <ArrowRight size={14} />
                    </Link>
                  </div>
                  <CircleScore value={aiMatch.matchPercent} color={iconColor} />
                </div>
              </div>
            )}

            <div className="glass-card rounded-3xl p-5 sm:p-6">
              <p className="font-heading font-bold text-lg text-ink">What does a {career.title} do?</p>
              <p className="text-sm sm:text-base text-muted2 leading-relaxed mt-1">{career.overview}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {activities.map((activity, index) => {
                  const iconSet = [Target, Search, BarChart3, BookOpen];
                  const Icon = iconSet[index % iconSet.length];
                  return (
                    <div key={activity} className="bg-white border border-line rounded-2xl p-3 sm:p-4 text-center">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: `${iconColor}1a`, color: iconColor }}>
                        <Icon size={17} />
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-ink leading-tight">{activity}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card rounded-3xl p-5 sm:p-6">
              <p className="font-heading font-bold text-lg text-ink">Top Skills</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.slice(0, 8).map((skill) => (
                  <span key={skill.name} className="px-3 py-1.5 rounded-full text-sm font-semibold border" style={{ borderColor: `${iconColor}52`, color: iconColor, background: `${iconColor}12` }}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            <AskAiCta
              title={`Have questions about ${career.title}?`}
              body="Open the AI chat with this career context already attached."
              color={iconColor}
              onClick={() => openCareerAI("overview")}
            />
          </div>
        )}

        {tab === "skills" && (
          <div className="mt-4 space-y-4">
            <div className="glass-card rounded-3xl p-5 sm:p-6">
              <p className="font-heading font-bold text-xl text-ink">Essential Skills</p>
              <p className="text-sm text-muted2 mt-1">Key capabilities employers expect for {career.title} roles.</p>
              <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {["All Skills", "Technical", "Analytical", "Tool", "Soft Skill"].map((label) => (
                  <span key={label} className="px-3 py-1.5 rounded-full bg-white border border-line text-xs font-semibold text-muted2 whitespace-nowrap">
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-3xl overflow-hidden">
              {skills.map((skill, index) => {
                const skillCategory = getSkillCategory(skill.name);
                const skillIconNames = ["Code2", "Database", "BarChart3", "Brain", "LineChart", "MessageCircle", "ShieldCheck"];
                const SkillIcon = Icons[skillIconNames[index % skillIconNames.length]] || Sparkles;
                return (
                  <div key={skill.name} className="bg-white border-b border-line last:border-b-0 px-4 sm:px-5 py-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${iconColor}14`, color: iconColor }}>
                      <SkillIcon size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-heading font-bold text-base text-ink">{skill.name}</p>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ background: `${iconColor}12`, color: iconColor }}>
                          {skillCategory}
                        </span>
                      </div>
                      <p className="text-sm text-muted2 mt-1">
                        {skill.status === "Essential" ? "Core skill for hiring conversations and daily work." : "Useful differentiator for stronger applications and projects."}
                      </p>
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="text-xs text-muted2">Priority</p>
                      <p className="font-bold text-ink">{skill.status}</p>
                    </div>
                    <ChevronRight size={17} className="text-muted2 shrink-0" />
                  </div>
                );
              })}
            </div>

            <AskAiCta
              title="Need help building a specific skill?"
              body="Ask for courses, projects, interview prep, and a practical learning order."
              color={iconColor}
              onClick={() => openCareerAI("skills")}
            />
          </div>
        )}

        {tab === "roadmap" && (
          <div className="mt-4 space-y-4">
            <div className="glass-card rounded-3xl p-5 sm:p-6">
              <p className="font-heading font-bold text-xl text-ink">Your Personalized Roadmap</p>
              <p className="text-sm text-muted2 mt-1">A step-by-step path to become a successful {career.title}.</p>
              <div className="mt-3 px-3 py-2 rounded-2xl bg-brand-50 border border-brand-100 inline-flex items-center gap-2">
                <Star size={13} className="text-brand" />
                <p className="text-xs font-semibold text-brand">Tailored to your profile and goals</p>
              </div>
            </div>

            {roadmapStages.map((stage, idx) => {
              const StageIcon = Icons[STAGE_ICONS[idx % STAGE_ICONS.length]] || Target;
              const stageColor = STAGE_COLORS[idx % STAGE_COLORS.length];

              return (
                <div key={stage.stageNum} className="flex gap-3 sm:gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center" style={{ background: `${stageColor}17`, color: stageColor }}>
                      <StageIcon size={21} />
                    </div>
                    <p className="text-[10px] font-bold mt-1" style={{ color: stageColor }}>Stage {stage.stageNum}</p>
                    <p className="text-[10px] text-muted2">{stage.duration}</p>
                    {idx < roadmapStages.length - 1 && <div className="w-0.5 flex-1 min-h-6 bg-line mt-1 rounded-full" />}
                  </div>

                  <div className="glass-card rounded-3xl p-4 sm:p-5 flex-1 mb-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="font-heading font-bold text-lg text-ink">{stage.title}</p>
                        <p className="text-sm text-muted2 mt-1 leading-relaxed">{stage.description}</p>
                        {stage.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {stage.skills.slice(0, 5).map((skill) => (
                              <span key={skill} className="px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: `${stageColor}16`, color: stageColor }}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold" style={{ background: `${stageColor}16`, color: stageColor }}>
                          Estimated timeline: {stage.duration}
                        </div>
                      </div>

                      <p className="text-[11px] text-muted2 shrink-0">View requirements</p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="bg-brand-50 border border-brand-100 rounded-3xl p-5 flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white border border-brand-100 text-brand flex items-center justify-center shrink-0">
                <Sparkles size={18} />
              </div>
              <div className="flex-1">
                <p className="font-heading font-bold text-base text-ink">Next Step for You</p>
                <p className="text-sm text-muted2 mt-0.5">Start from Stage 1 requirements and build one portfolio milestone each week.</p>
              </div>
              <Link to="/roadmap" className="hidden sm:inline-flex items-center gap-1.5 bg-brand text-white font-semibold text-sm px-4 py-2.5 rounded-full shadow-brand">
                View Requirements <ArrowRight size={14} />
              </Link>
            </div>

            <AskAiCta
              title={`Plan your ${career.title} roadmap with AI`}
              body="Open AI Chat with this roadmap and career context ready."
              color={iconColor}
              onClick={() => openCareerAI("roadmap")}
            />
          </div>
        )}

        {tab === "jobs" && (
          <div className="mt-4 space-y-4">
            <div className="glass-card rounded-3xl p-5 sm:p-6">
              <p className="font-heading font-bold text-xl text-ink">Job Roles & Salary Insights</p>
              <p className="text-sm text-muted2 mt-1">Explore AI-curated role paths, descriptions, and salary ranges for this career.</p>
              <div className="mt-3 px-3 py-2 rounded-2xl bg-brand-50 border border-brand-100 text-xs font-medium text-muted2 inline-flex items-center gap-2">
                <Sparkles size={13} className="text-brand" />
                Salary ranges are indicative and vary by company, location, and specialization.
              </div>
            </div>

            <div className="glass-card rounded-3xl overflow-hidden">
              <div className="hidden md:grid grid-cols-[140px_1fr_220px] gap-3 px-5 py-3 border-b border-line bg-white/70">
                <p className="text-xs uppercase tracking-wide text-muted2 font-bold">Experience Level</p>
                <p className="text-xs uppercase tracking-wide text-muted2 font-bold">Job Role & Description</p>
                <p className="text-xs uppercase tracking-wide text-muted2 font-bold">Average Package (INR/Year)</p>
              </div>

              {jobs.map((job, idx) => {
                const color = levelColor(job.level);
                return (
                  <div key={`${job.level}-${idx}`} className="grid md:grid-cols-[140px_1fr_220px] gap-3 px-5 py-4 border-b border-line last:border-b-0 bg-white">
                    <div className="flex md:block items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm" style={{ background: `${color}1f`, color }}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ink">{job.level}</p>
                        <p className="text-xs text-muted2">{job.experience}</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-heading font-bold text-lg text-ink">{job.title}</p>
                      <p className="text-sm text-muted2 mt-1 leading-relaxed">{job.desc}</p>
                    </div>

                    <div className="md:text-right">
                      <p className="font-heading font-extrabold text-xl text-ink">
                        {formatLpa(job.salaryMin)} - {formatLpa(job.salaryMax)}
                      </p>
                      <p className="text-xs text-muted2 mt-0.5">Indicative CTC range</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <AskAiCta
              title={`Have questions about ${career.title} jobs?`}
              body="Ask about job roles, salaries, skills, hiring plan, or portfolio projects."
              color={iconColor}
              onClick={() => openCareerAI("jobs and salary")}
            />
          </div>
        )}

        {tab === "insights" && (
          <div className="mt-4 space-y-4">
            <div className="glass-card rounded-3xl p-5 sm:p-6">
              <p className="font-heading font-bold text-xl text-ink">{career.title} Insights</p>
              <p className="text-sm text-muted2 mt-1">Industry trends, hiring demand, and tool ecosystem.</p>
            </div>

            <div className="glass-card rounded-3xl p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${iconColor}1f`, color: iconColor }}>
                  <Globe size={17} />
                </div>
                <div>
                  <p className="font-heading font-bold text-base text-ink">Current Demand in the World</p>
                  <p className="text-xs text-muted2">Global outlook for {career.title} roles</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="rounded-2xl p-4 bg-emerald-50 border border-emerald-100 min-h-[132px]">
                  <p className="text-xs text-muted2">Global Demand</p>
                  <p className="font-semibold text-emerald-700 text-sm leading-relaxed mt-2">{career.insights?.globalDemand || career.demand || "High"}</p>
                  <p className="text-[11px] text-emerald-600 mt-2">Current outlook</p>
                </div>
                <div className="rounded-2xl p-4 bg-brand-50 border border-brand-100 min-h-[132px]">
                  <p className="text-xs text-muted2">Job Growth (Global)</p>
                  <p className="font-heading font-bold text-brand text-2xl mt-2">{asNumber(career.jobGrowth5Y, 12)}%</p>
                  <p className="text-[11px] text-muted2 mt-1">Next 5 years</p>
                </div>
                <div className="rounded-2xl p-4 bg-brand-50 border border-brand-100 min-h-[132px]">
                  <p className="text-xs text-muted2">Open Positions</p>
                  <p className="font-semibold text-ink text-sm leading-relaxed mt-2">{career.insights?.openPositions || "10,000+"}</p>
                  <p className="text-[11px] text-muted2 mt-2">India estimate</p>
                </div>
                <div className="rounded-2xl p-4 bg-brand-50 border border-brand-100 min-h-[132px]">
                  <p className="text-xs text-muted2">Top Hiring Countries</p>
                  <div className="mt-2 space-y-1.5">
                    {countries.map((country) => (
                      <div key={country.code} className="inline-flex mr-1.5 mb-1.5 items-center gap-1.5 px-2 py-1 rounded-full bg-white border border-line text-[11px] font-semibold text-ink">
                        <span>{country.flag}</span>
                        <span>{country.name}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted2 mt-1">Role-dependent markets</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold text-muted2 mb-2">Top Industries Hiring</p>
                <div className="flex flex-wrap gap-2">
                  {topIndustries.map((industry) => (
                    <span key={industry} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-line text-xs font-semibold text-ink">
                      <Briefcase size={11} className="text-brand" /> {industry}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-5 sm:p-6">
              <p className="font-heading font-bold text-lg text-ink">AI Tools for {career.title}</p>
              <p className="text-xs text-muted2 mt-1">Tools to learn and use for better outcomes in this career path.</p>

              <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {["All", "Core", "Analytics", "Automation"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setToolFilter(filter)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition ${
                      toolFilter === filter ? "text-white border-transparent" : "text-muted2 border-line bg-white"
                    }`}
                    style={toolFilter === filter ? { background: iconColor } : {}}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="mt-3 space-y-2">
                {filteredTools.map((tool) => (
                  <div key={tool.name} className="bg-white border border-line rounded-2xl px-3 py-3 flex items-center gap-3">
                    <ToolBadge name={tool.name} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-ink">{tool.name}</p>
                      <p className="text-xs text-muted2 mt-0.5">Best for {tool.category.toLowerCase()} workflows</p>
                    </div>
                    <ChevronRight size={16} className="text-muted2 shrink-0" />
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-brand-50 border border-brand-100 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl cc-logo-gradient flex items-center justify-center shrink-0">
                  <Bot size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-ink">Work Smarter with AI</p>
                  <p className="text-xs text-muted2">Ask the assistant for a custom tool-learning plan.</p>
                </div>
                <button
                  onClick={() => openCareerAI("AI tools and industry insights")}
                  className="inline-flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-2 rounded-full"
                  style={{ background: iconColor }}
                >
                  <Bot size={12} /> Ask AI
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
