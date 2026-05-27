import React, { useEffect, useMemo, useState, lazy } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Bookmark,
  Bot,
  Brain,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Code2,
  Database,
  FolderOpen,
  Globe,
  GraduationCap,
  IndianRupee,
  Layers3,
  LayoutGrid,
  LineChart,
  MessageCircle,
  RefreshCcw,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";

// Icon cache to avoid import * as Icons
const iconCache = {
  ArrowLeft, ArrowRight, BarChart3, BookOpen, Bookmark, Bot, Brain, Briefcase,
  CheckCircle2, ChevronDown, ChevronRight, ChevronUp, Code2, Database, FolderOpen,
  Globe, GraduationCap, IndianRupee, Layers3, LayoutGrid, LineChart, MessageCircle,
  RefreshCcw, Rocket, Search, ShieldCheck, Sparkles, Star, Target, TrendingUp, Users, Wrench,
};
let fullIconsPromise = null;
function loadFullIcons() {
  if (!fullIconsPromise) fullIconsPromise = import("lucide-react");
  return fullIconsPromise;
}
function getIcon(name) {
  if (iconCache[name]) return iconCache[name];
  loadFullIcons().then((mod) => { if (mod[name]) iconCache[name] = mod[name]; });
  return Briefcase;
}
// Replacement for Icons[name]
const Icons = new Proxy(iconCache, { get: (t, p) => t[p] || getIcon(p) || Briefcase });
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

const STAGE_ICONS = ["GraduationCap", "Target", "BookOpen", "Bot", "FolderOpen", "Briefcase"];
const STAGE_COLORS = ["#7C3AED", "#10B981", "#0EA5E9", "#8B5CF6", "#F97316", "#EC4899"];

const FALLBACK_STAGE_META = [
  { title: "Education", duration: "0 - 2 Months", type: "education" },
  { title: "Skills To Master", duration: "2 - 6 Months", type: "skills" },
  { title: "Courses", duration: "6 - 9 Months", type: "courses" },
  { title: "AI Tools", duration: "9 - 10 Months", type: "tools" },
  { title: "Portfolio & Projects", duration: "10 - 11 Months", type: "projects" },
  { title: "Placement & Jobs", duration: "11 - 12 Months", type: "jobs" },
];

const SECTION_META = {
  education: { icon: GraduationCap, label: "Education Path", color: "#7C3AED" },
  skills: { icon: Target, label: "Skills To Master", color: "#10B981" },
  courses: { icon: BookOpen, label: "Recommended Paid Courses", color: "#0EA5E9" },
  tools: { icon: Bot, label: "AI Tools", color: "#8B5CF6" },
  projects: { icon: FolderOpen, label: "Portfolio Projects", color: "#F97316" },
  portfolio: { icon: FolderOpen, label: "Portfolio Projects", color: "#F97316" },
  jobs: { icon: Briefcase, label: "Common Job Roles", color: "#EC4899" },
  placement: { icon: Briefcase, label: "Placement Suggestions", color: "#EC4899" },
};

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

function uniqueItems(items, limit = 6) {
  const seen = new Set();
  return items
    .map((item) => (typeof item === "string" ? item : item?.name || item?.title || item?.label || item?.text || ""))
    .map((item) => item.trim())
    .filter((item) => {
      const key = item.toLowerCase();
      if (!item || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}

function isGenericRoadmapItem(item = "") {
  const value = String(item).toLowerCase();
  return /(item\d|course specialization|tool certification|mentor-led practical|check eligibility|compare degree|shortlist institutes|career specialization|project\d|role\d|tip\d|fundamentals$|industry awareness$)/.test(value);
}

function buildEducationItems(career) {
  const title = career.title || "this career";
  const category = `${career.category || ""} ${career.field || ""}`.toLowerCase();
  if (/(finance|commerce|account|financial|bank|investment|tax|cfa|ca|cma|cs)/.test(category + title.toLowerCase())) {
    return [
      "10+2 Commerce or any stream with strong maths/business interest",
      "B.Com, BBA Finance, BAF, BMS, Economics, or related degree preferred",
      "Excel, accounting basics, finance statements, and business maths foundation",
    ];
  }
  if (/(software|tech|data|ai|cloud|cyber|developer|analytics)/.test(category + title.toLowerCase())) {
    return [
      "10+2 any stream; PCM or computer science helps but is not mandatory",
      "BCA, BSc IT, BE/BTech, diploma, or strong project portfolio route",
      "Build fundamentals in logic, computers, English, and problem solving",
    ];
  }
  if (/(design|creative|media|animation|vfx|ui|ux|graphic)/.test(category + title.toLowerCase())) {
    return [
      "10+2 any stream with visual communication and creative aptitude",
      "Design, fine arts, animation, media, or UI/UX diploma/degree preferred",
      "Portfolio quality matters more than marks for most entry roles",
    ];
  }
  if (/(government|upsc|mpsc|ssc|railway|bank|defense|police)/.test(category + title.toLowerCase())) {
    return [
      "Check official exam eligibility, age limit, attempts, and reservation rules",
      "Complete graduation if the target exam requires a degree",
      "Keep documents, domicile/category certificates, and exam calendar ready",
    ];
  }
  return [
    `Understand eligibility and entry routes for ${title}`,
    "Compare degree, diploma, certification, and apprenticeship options",
    "Shortlist institutes, online programs, and local training providers",
  ];
}

function buildCourseItems(career) {
  const title = career.title || "Career";
  const lower = title.toLowerCase();
  const certs = uniqueItems(career.insights?.certifications || [], 4);
  if (certs.length) return certs;
  if (/(financial model|financial analyst|investment|finance)/.test(lower)) {
    return [
      "Financial Modeling & Valuation Analyst (FMVA) - CFI",
      "Financial Modeling and Valuation - NSE Academy / Elearnmarkets",
      "Excel for Financial Analysis - Udemy or Coursera paid course",
      "Equity Research and Valuation - BSE Institute or similar provider",
    ];
  }
  if (/(graphic|visual|design)/.test(lower)) {
    return [
      "Graphic Design Specialization - Coursera",
      "Adobe Photoshop and Illustrator Masterclass - Udemy",
      "Brand Identity Design - Domestika",
      "UI/UX Design Professional Certificate - Google or Coursera",
    ];
  }
  if (/(data|analytics|business analyst)/.test(lower)) {
    return [
      "Google Data Analytics Professional Certificate - Coursera",
      "Excel to MySQL: Analytic Techniques - Duke University",
      "Power BI Data Analyst Associate training - Microsoft Learn",
      "SQL and Tableau for Analytics - Udemy paid course",
    ];
  }
  return [
    `${title} job-ready certification from a reputed provider`,
    `${title} practical masterclass with assignments and mentor feedback`,
    "Communication, resume, and interview preparation course",
    "Paid specialization course with portfolio or capstone project",
  ];
}

function buildProjectItems(career) {
  const title = career.title || "Career";
  const lower = title.toLowerCase();
  if (/(financial model|financial analyst|investment|finance)/.test(lower)) {
    return [
      "Build a 3-statement financial model for an Indian listed company",
      "Create DCF and comparable-company valuation case study",
      "Publish an Excel dashboard with assumptions, charts, and summary note",
      "Prepare a 5-slide investment recommendation presentation",
    ];
  }
  if (/(graphic|visual|design)/.test(lower)) {
    return [
      "Create 8-10 logo, poster, social media, and branding samples",
      "Build one complete brand identity case study",
      "Redesign one real business brochure, packaging, or landing section",
      "Publish portfolio on Behance, Dribbble, or a simple website",
    ];
  }
  if (/(data|analytics|business analyst)/.test(lower)) {
    return [
      "Analyze a public dataset and publish insights dashboard",
      "Create an Excel/Power BI business KPI dashboard",
      "Write one case study with problem, data, analysis, and recommendation",
      "Upload project files and summary to GitHub or portfolio",
    ];
  }
  return [
    `Build 3 practical ${title} projects with real-world scenarios`,
    "Write short case studies explaining problem, process, and result",
    "Collect screenshots, files, certificates, and project links in one portfolio",
    "Prepare a 60-second project explanation for interviews",
  ];
}

function fallbackSectionsForStage(career, meta, commonSkills) {
  const tools = uniqueItems(normalizeTools(career, normalizeSkills(career)).map((tool) => tool.name), 6);
  const jobs = uniqueItems(normalizeJobs(career).map((job) => job.title), 5);
  const title = career.title || "this career";
  const map = {
    education: [{ type: "education", label: "Education Path", items: buildEducationItems(career) }],
    skills: [{ type: "skills", label: "Skills To Master", items: uniqueItems(commonSkills, 8) }],
    courses: [{ type: "courses", label: "Recommended Paid Courses", items: buildCourseItems(career) }],
    tools: [{ type: "tools", label: "AI Tools", items: tools.length ? tools : ["ChatGPT", "Perplexity", "Notion AI", "Canva AI"] }],
    projects: [{ type: "projects", label: "Portfolio Projects", items: buildProjectItems(career) }],
    jobs: [
      { type: "jobs", label: "Common Job Roles", items: jobs.length ? jobs : [`${title} Trainee`, `Junior ${title}`, `${title} Associate`] },
      {
        type: "placement",
        label: "Placement Suggestions",
        items: [
          "Build a role-specific resume with project proof",
          "Optimize LinkedIn, Naukri, Indeed, and Internshala profiles",
          "Apply weekly and track responses in a simple spreadsheet",
          "Practice interviews, assignments, and portfolio walkthroughs",
        ],
      },
    ],
  };
  return map[meta.type] || [];
}

function normalizeRoadmap(career) {
  const skillBuckets = normalizeSkills(career).map((s) => s.name);
  const raw = Array.isArray(career.roadmap) ? career.roadmap : [];
  if (raw.length) {
    return raw.map((stage, idx) => ({
      ...(() => {
        const meta = FALLBACK_STAGE_META[idx] || {};
        const start = Math.max(0, idx - 1) * 2;
        const commonSkills = uniqueItems([...(stage.skills || []), ...skillBuckets.slice(start, start + 4)], 8);
        const rawSections = stage.sections || [];
        const hasUsefulSections = rawSections.some((section) => (section.items || []).some((item) => !isGenericRoadmapItem(item)));
        return {
          stageNum: stage.stageNum || idx + 1,
          title: stage.title || meta.title || `Stage ${idx + 1}`,
          duration: stage.duration || meta.duration || "Flexible",
          description: stage.description || `Build practical capability for ${career.title}.`,
          preview: stage.preview || stage.description || "",
          skills: commonSkills,
          sections: hasUsefulSections ? rawSections : fallbackSectionsForStage(career, meta, commonSkills),
          resources: stage.resources || [],
          milestone: stage.milestone,
        };
      })(),
    }));
  }

  return FALLBACK_STAGE_META.map((meta, idx) => {
    const start = Math.max(0, idx - 1) * 2;
    const commonSkills = uniqueItems(skillBuckets.slice(start, start + 4), 8);
    return {
      stageNum: idx + 1,
      title: meta.title,
      duration: meta.duration,
      description:
        idx === 0
          ? `Formal education and eligibility required for ${career.title}.`
          : idx === 5
            ? `Prepare for jobs, applications, and interviews in ${career.title}.`
            : `Build practical proof and capability for ${career.title}.`,
      preview: meta.title,
      skills: commonSkills,
      sections: fallbackSectionsForStage(career, meta, commonSkills),
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
    <div className="bg-brand-50 border border-brand-100 rounded-2xl p-3 sm:p-4 flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl cc-logo-gradient flex items-center justify-center shrink-0 shadow-brand">
        <Bot size={15} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-heading font-bold text-xs sm:text-sm text-ink">{title}</p>
        <p className="text-[10px] sm:text-xs text-muted2 mt-0.5">{body}</p>
      </div>
      <button
        onClick={onClick}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border bg-white text-xs font-bold shrink-0"
        style={{ borderColor: `${color}70`, color }}
      >
        <Bot size={13} /> Ask AI
      </button>
    </div>
  );
}

function CircleScore({ value, color }) {
  const size = 56;
  const r = 22;
  const circumference = 2 * Math.PI * r;
  const dash = (Math.max(0, Math.min(100, value)) / 100) * circumference;

  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E8E4FF" strokeWidth="4" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4" strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading font-extrabold text-sm leading-none" style={{ color }}>{value}%</span>
        <span className="text-[7px] text-muted2 font-semibold">Match</span>
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
  if (n.includes("python")) return <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-extrabold">Py</div>;
  if (n.includes("sql")) return <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center text-[10px] font-extrabold">SQL</div>;
  if (n.includes("tensor")) return <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-extrabold">TF</div>;
  if (n.includes("scikit")) return <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-extrabold">SK</div>;
  if (n.includes("docker")) return <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center text-[10px] font-extrabold">DK</div>;
  return <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand flex items-center justify-center text-[10px] font-extrabold">{name.slice(0, 2).toUpperCase()}</div>;
}

export default function CareerDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, refresh } = useAuth();

  const [career, setCareer] = useState(null);
  const [tab, setTab] = useState("overview");
  const [toolFilter, setToolFilter] = useState("All");
  const [openRoadmapStage, setOpenRoadmapStage] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingPreview, setLoadingPreview] = useState("Salary");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get(`/careers/${slug}`);
        if (!mounted) return;
        setCareer(data);
        localStorage.setItem("last_roadmap_career_slug", data.slug || slug);
        localStorage.setItem("last_roadmap_career_title", data.title || "");
        localStorage.setItem("active_institute_course", data.title || "");
        window.dispatchEvent(new CustomEvent("latecomers:roadmap-career-change", {
          detail: { slug: data.slug || slug, title: data.title || "" },
        }));
        window.dispatchEvent(new CustomEvent("latecomers:institute-course-change", {
          detail: { course: data.title || "" },
        }));
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
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${activeStep.color}18`, color: activeStep.color }}>
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
    <div className="max-w-[1100px] mx-auto overflow-x-hidden w-full min-w-0" data-testid="career-detail-page">
      <div className="bg-white/95 border-b border-line px-3 sm:px-5 py-2.5 sticky top-0 z-20 backdrop-blur">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-1.5 -ml-1 text-ink shrink-0">
            <ArrowLeft size={18} />
          </button>
          <p className="flex-1 font-heading font-bold text-sm sm:text-base text-ink truncate">{career.title}</p>
          <button onClick={toggleSave} className={`p-1.5 rounded-full ${isSaved ? "text-brand" : "text-muted2"}`}>
            <Bookmark size={16} fill={isSaved ? iconColor : "none"} />
          </button>
        </div>
      </div>

      <div className="px-3 sm:px-5 pt-4">
        <div className="glass-card rounded-2xl p-3 sm:p-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-sm shrink-0" style={{ background: `${iconColor}24`, color: iconColor }}>
              <CareerIcon size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="font-heading font-extrabold text-base sm:text-xl text-ink">{career.title}</h1>
                {aiMatch && (
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">✨ {aiMatch.matchPercent}%</span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-muted2 mt-1 leading-snug line-clamp-2">{career.description}</p>
              <div className="flex gap-1 mt-1.5 flex-wrap">
                {(career.tags || []).slice(0, 3).map((tag) => (
                  <span key={tag} className="px-1.5 py-px rounded-full text-[9px] sm:text-[10px] font-semibold border border-line text-muted2">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 border-t border-line pt-3">
            {statItems.map((item) => (
              <div key={item.label} className="rounded-xl bg-white border border-line p-2 sm:p-2.5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${iconColor}1e`, color: iconColor }}>
                  <item.icon size={13} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] text-muted2 truncate">{item.label}</p>
                  <p className="text-[11px] sm:text-xs font-bold text-ink">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 overflow-x-auto no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
          <div className="w-max min-w-full bg-white border border-line rounded-xl p-0.5 flex gap-0.5">
            {TAB_ITEMS.map((item) => {
              const TabIcon = Icons[item.icon] || Sparkles;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold whitespace-nowrap transition inline-flex items-center gap-1 ${
                    tab === item.id ? "text-white shadow-sm" : "text-muted2 hover:text-ink"
                  }`}
                  style={tab === item.id ? { background: iconColor } : {}}
                >
                  <TabIcon size={12} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {tab === "overview" && (
          <div className="mt-3 space-y-3">
            {aiMatch?.reasons?.length > 0 && (
              <div className="glass-card rounded-2xl p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${iconColor}20`, color: iconColor }}>
                        <Star size={12} />
                      </div>
                      <p className="font-heading font-bold text-xs sm:text-sm text-ink">Why this fits you</p>
                    </div>
                    <ul className="space-y-1">
                      {aiMatch.reasons.map((reason, index) => (
                        <li key={index} className="flex items-start gap-1.5 text-[11px] sm:text-xs text-ink">
                          <CheckCircle2 size={12} className="shrink-0 mt-0.5" style={{ color: iconColor }} />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <CircleScore value={aiMatch.matchPercent} color={iconColor} />
                </div>
              </div>
            )}

            <div className="glass-card rounded-2xl p-3 sm:p-4">
              <p className="font-heading font-bold text-sm text-ink">What does a {career.title} do?</p>
              <p className="text-[11px] sm:text-xs text-muted2 leading-snug mt-1 line-clamp-3">{career.overview}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                {activities.map((activity, index) => {
                  const iconSet = [Target, Search, BarChart3, BookOpen];
                  const Icon = iconSet[index % iconSet.length];
                  return (
                    <div key={activity} className="bg-white border border-line rounded-xl p-2 sm:p-2.5 text-center">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center mx-auto mb-1" style={{ background: `${iconColor}1a`, color: iconColor }}>
                        <Icon size={13} />
                      </div>
                      <p className="text-[10px] sm:text-xs font-semibold text-ink leading-tight">{activity}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-3 sm:p-4">
              <p className="font-heading font-bold text-sm text-ink">Top Skills</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skills.slice(0, 8).map((skill) => (
                  <span key={skill.name} className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold border" style={{ borderColor: `${iconColor}52`, color: iconColor, background: `${iconColor}12` }}>
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
          <div className="mt-3 space-y-3">
            <div className="glass-card rounded-2xl p-3 sm:p-4">
              <p className="font-heading font-bold text-sm sm:text-base text-ink">Essential Skills</p>
              <p className="text-[10px] sm:text-xs text-muted2 mt-0.5">Key capabilities employers expect for {career.title} roles.</p>
              <div className="mt-2 flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {["All Skills", "Technical", "Analytical", "Tool", "Soft Skill"].map((label) => (
                  <span key={label} className="px-2 py-1 rounded-full bg-white border border-line text-[10px] font-semibold text-muted2 whitespace-nowrap">
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
              {skills.map((skill, index) => {
                const skillCategory = getSkillCategory(skill.name);
                const skillIconNames = ["Code2", "Database", "BarChart3", "Brain", "LineChart", "MessageCircle", "ShieldCheck"];
                const SkillIcon = Icons[skillIconNames[index % skillIconNames.length]] || Sparkles;
                return (
                  <div key={skill.name} className="bg-white border-b border-line last:border-b-0 px-3 sm:px-4 py-2.5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${iconColor}14`, color: iconColor }}>
                      <SkillIcon size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-heading font-bold text-xs sm:text-sm text-ink">{skill.name}</p>
                        <span className="px-1.5 py-px rounded-full text-[9px] font-bold" style={{ background: `${iconColor}12`, color: iconColor }}>
                          {skillCategory}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted2 mt-0.5 line-clamp-1">
                        {skill.status === "Essential" ? "Core skill for hiring and daily work." : "Differentiator for stronger applications."}
                      </p>
                    </div>
                    <ChevronRight size={13} className="text-muted2 shrink-0" />
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
          <div className="mt-3 space-y-3">
            <div className="glass-card rounded-2xl p-3 sm:p-4">
              <p className="font-heading font-bold text-sm sm:text-base text-ink">Your Personalized Roadmap</p>
              <p className="text-[10px] sm:text-xs text-muted2 mt-0.5">Step-by-step path to become a successful {career.title}.</p>
              <div className="mt-2 px-2 py-1 rounded-full bg-brand-50 border border-brand-100 inline-flex items-center gap-1.5">
                <Star size={10} className="text-brand" />
                <p className="text-[10px] font-semibold text-brand">Tailored to your profile</p>
              </div>
            </div>

            {roadmapStages.map((stage, idx) => {
              const StageIcon = Icons[STAGE_ICONS[idx % STAGE_ICONS.length]] || Target;
              const stageColor = STAGE_COLORS[idx % STAGE_COLORS.length];
              const isOpen = openRoadmapStage === idx;
              const sections = stage.sections || [];

              return (
                <div key={stage.stageNum} className="flex gap-2.5 sm:gap-3">
                  <div className="flex flex-col items-center shrink-0 w-14 sm:w-16">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ background: `${stageColor}17`, color: stageColor }}>
                      <StageIcon size={16} />
                    </div>
                    <p className="text-[9px] font-bold mt-0.5" style={{ color: stageColor }}>Stage {stage.stageNum}</p>
                    {idx < roadmapStages.length - 1 && (
                      <div className="flex flex-col items-center mt-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: stageColor }} />
                        <div className="w-0.5 flex-1 min-h-[26px]" style={{ background: `${stageColor}28` }} />
                      </div>
                    )}
                  </div>

                  <div className={`rounded-xl sm:rounded-2xl border flex-1 mb-2 overflow-hidden transition ${isOpen ? "glass-card border-brand/20 shadow-md" : "surface-gradient border-line"}`}>
                    <button
                      onClick={() => setOpenRoadmapStage(isOpen ? -1 : idx)}
                      className="w-full p-2.5 sm:p-3 flex items-start gap-2 text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-heading font-bold text-xs sm:text-sm text-ink leading-tight">{stage.title}</p>
                          <span className="px-1.5 py-px rounded-full text-[9px] font-bold" style={{ background: `${stageColor}15`, color: stageColor }}>{stage.duration}</span>
                        </div>
                        <p className={`text-[10px] sm:text-xs text-muted2 mt-0.5 leading-snug ${isOpen ? "" : "line-clamp-1"}`}>{stage.description}</p>
                      </div>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: `${stageColor}12`, color: stageColor }}>
                        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-2.5 sm:px-3 pb-3 space-y-2.5">
                        {sections.map((section, sIdx) => {
                          const key = (section.type || section.label || "").toLowerCase().replace(/[^a-z]/g, "");
                          const meta = SECTION_META[key] || SECTION_META.skills;
                          const SectionIcon = meta.icon;
                          const items = section.items || [];
                          return (
                            <div key={`${stage.stageNum}-${sIdx}`} className="bg-white border border-line rounded-xl p-2.5">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${meta.color}15`, color: meta.color }}>
                                  <SectionIcon size={13} />
                                </div>
                                <p className="text-xs font-bold text-ink">{section.label || meta.label}</p>
                              </div>
                              <div className={key === "skills" || key === "tools" ? "flex flex-wrap gap-1.5 pl-8" : "space-y-1.5 pl-8"}>
                                {items.map((item, iIdx) => (
                                  key === "skills" || key === "tools" ? (
                                    <span key={iIdx} className="px-2 py-1 rounded-full text-[10px] font-semibold" style={{ background: `${meta.color}12`, color: meta.color }}>
                                      {typeof item === "string" ? item : item.text || item.label}
                                    </span>
                                  ) : (
                                    <div key={iIdx} className="flex items-start gap-2 text-[10px] sm:text-xs text-ink leading-relaxed">
                                      <CheckCircle2 size={12} className="mt-0.5 shrink-0" style={{ color: meta.color }} />
                                      <span>{typeof item === "string" ? item : item.text || item.label}</span>
                                    </div>
                                  )
                                ))}
                              </div>
                            </div>
                          );
                        })}
                        {!sections.length && stage.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {stage.skills.slice(0, 8).map((skill) => (
                              <span key={skill} className="px-1.5 py-px rounded-full text-[9px] font-semibold" style={{ background: `${stageColor}16`, color: stageColor }}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white border border-brand-100 text-brand flex items-center justify-center shrink-0">
                <Sparkles size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-xs sm:text-sm text-ink">Next Step for You</p>
                <p className="text-[10px] sm:text-xs text-muted2 mt-0.5">Start Stage 1 and build one milestone each week.</p>
              </div>
              <Link to="/roadmap" className="hidden sm:inline-flex items-center gap-1 bg-brand text-white font-semibold text-[11px] px-3 py-2 rounded-full shadow-brand shrink-0">
                View <ArrowRight size={11} />
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
          <div className="mt-3 space-y-3">
            <div className="glass-card rounded-2xl p-3 sm:p-4">
              <p className="font-heading font-bold text-sm sm:text-base text-ink">Job Roles & Salary</p>
              <p className="text-[10px] sm:text-xs text-muted2 mt-0.5">AI-curated role paths and salary ranges.</p>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
              {jobs.map((job, idx) => {
                const color = levelColor(job.level);
                return (
                  <div key={`${job.level}-${idx}`} className="px-3 sm:px-4 py-2.5 border-b border-line last:border-b-0 bg-white flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0" style={{ background: `${color}1f`, color }}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-heading font-bold text-xs sm:text-sm text-ink">{job.title}</p>
                        <span className="text-[9px] text-muted2">({job.experience})</span>
                      </div>
                      <p className="text-[10px] text-muted2 mt-0.5 line-clamp-1">{job.desc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-heading font-bold text-xs sm:text-sm text-ink">
                        {formatLpa(job.salaryMin)}-{formatLpa(job.salaryMax)}
                      </p>
                      <p className="text-[9px] text-muted2">CTC/yr</p>
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
          <div className="mt-3 space-y-3">
            <div className="glass-card rounded-2xl p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${iconColor}1f`, color: iconColor }}>
                  <Globe size={13} />
                </div>
                <p className="font-heading font-bold text-sm text-ink">Market Demand</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="rounded-xl p-2.5 bg-emerald-50 border border-emerald-100">
                  <p className="text-[9px] text-muted2">Global Demand</p>
                  <p className="font-semibold text-emerald-700 text-xs mt-1">{career.insights?.globalDemand || career.demand || "High"}</p>
                </div>
                <div className="rounded-xl p-2.5 bg-brand-50 border border-brand-100">
                  <p className="text-[9px] text-muted2">Growth (5Y)</p>
                  <p className="font-heading font-bold text-brand text-base mt-1">{asNumber(career.jobGrowth5Y, 12)}%</p>
                </div>
                <div className="rounded-xl p-2.5 bg-brand-50 border border-brand-100">
                  <p className="text-[9px] text-muted2">Open Positions</p>
                  <p className="font-semibold text-ink text-xs mt-1">{career.insights?.openPositions || "10,000+"}</p>
                </div>
                <div className="rounded-xl p-2.5 bg-brand-50 border border-brand-100">
                  <p className="text-[9px] text-muted2">Top Countries</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {countries.map((country) => (
                      <span key={country.code} className="inline-flex items-center gap-1 px-1.5 py-px rounded-full bg-white border border-line text-[9px] font-semibold text-ink">
                        {country.flag} {country.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-2.5">
                <p className="text-[9px] font-semibold text-muted2 mb-1.5">Top Industries</p>
                <div className="flex flex-wrap gap-1">
                  {topIndustries.map((industry) => (
                    <span key={industry} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-line text-[10px] font-semibold text-ink">
                      <Briefcase size={9} className="text-brand" /> {industry}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-3 sm:p-4">
              <p className="font-heading font-bold text-sm text-ink">AI Tools for {career.title}</p>
              <div className="mt-2 flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {["All", "Core", "Analytics", "Automation"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setToolFilter(filter)}
                    className={`px-2 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap border transition ${
                      toolFilter === filter ? "text-white border-transparent" : "text-muted2 border-line bg-white"
                    }`}
                    style={toolFilter === filter ? { background: iconColor } : {}}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <div className="mt-2 space-y-1.5">
                {filteredTools.map((tool) => (
                  <div key={tool.name} className="bg-white border border-line rounded-xl px-2.5 py-2 flex items-center gap-2.5">
                    <ToolBadge name={tool.name} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs text-ink">{tool.name}</p>
                      <p className="text-[10px] text-muted2">{tool.category}</p>
                    </div>
                    <ChevronRight size={13} className="text-muted2 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            <AskAiCta
              title={`${career.title} tools & insights`}
              body="Ask AI for a custom tool-learning plan."
              color={iconColor}
              onClick={() => openCareerAI("AI tools and industry insights")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
