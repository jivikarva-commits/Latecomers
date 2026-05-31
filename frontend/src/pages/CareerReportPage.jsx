import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Bot,
  Briefcase,
  CheckCircle2,
  Download,
  GraduationCap,
  IndianRupee,
  RefreshCw,
  Rocket,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Wrench,
  FolderOpen,
  ClipboardList,
  Clock,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";
import SEO from "../components/SEO";

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

function fallbackEducationPaths(title) {
  return [
    {
      heading: "Bachelor's Degree",
      tag: "Recommended",
      body: `For students who want a strong foundation in ${title} concepts, communication, and structured learning.`,
      duration: "3 - 4 Years",
    },
    {
      heading: "Diploma / Certificate",
      body: "For students who want faster, practical learning and job-ready software skills.",
      duration: "6 Months - 1 Year",
    },
    {
      heading: "Self Learning",
      body: "For students who want to learn online, build portfolio projects, and start freelancing or applying for jobs.",
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
  const all = items.length ? items : [
    `${title} Fundamentals`,
    "Communication & Collaboration",
    "Tools & Software Basics",
    "Project Workflow",
    "Industry Awareness",
    "Portfolio Building",
  ];
  const third = Math.ceil(all.length / 3);
  return [
    { title: "Stage 1: Fundamentals", subtitle: "Build your foundation", items: all.slice(0, third) },
    { title: "Stage 2: Practical Skills", subtitle: "Tools you must know", items: all.slice(third, third * 2) },
    { title: "Stage 3: Advanced Skills", subtitle: "Level up your expertise", items: all.slice(third * 2) },
  ].filter((s) => s.items.length > 0);
}

function buildCourseMonths(stages) {
  const items = getStageItems(stages, "courses");
  const list = items.length ? items : [
    "Foundations course",
    "Hands-on practice course",
    "Advanced specialization",
    "Portfolio & freelancing",
  ];
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

function buildAITools(stages) {
  const items = getStageItems(stages, "tools");
  const defaults = ["ChatGPT", "Claude AI", "Midjourney", "Canva AI", "Notion AI"];
  const list = (items.length ? items : defaults).slice(0, 5);
  return list.map((raw) => {
    const [name, useCase] = String(raw).split(/[—–\-:]/).map((s) => s.trim());
    return {
      name: name || raw,
      usedFor: useCase || "Productivity & content workflows",
      bestFor: "Speed, quality, and automation",
    };
  });
}

function buildProjects(stages, title) {
  const items = getStageItems(stages, "projects");
  const list = items.length ? items : [
    `${title} starter project`,
    `Real-world ${title} case study`,
    `Client-style ${title} brief`,
    `Personal ${title} portfolio`,
    `${title} freelance gig`,
  ];
  return list.slice(0, 6).map((p, idx) => ({
    num: String(idx + 1).padStart(2, "0"),
    title: p,
    skills: "Skills, tools, workflow",
    difficulty: ["Easy", "Easy", "Easy", "Medium", "Hard", "Hard"][idx] || "Medium",
    recruiterValue: idx < 3 ? 3 : idx < 5 ? 4 : 5,
  }));
}

function buildPlacement(stages) {
  const items = getStageItems(stages, "placement");
  return {
    resume: [
      "Strong portfolio link",
      "Behance / Dribbble / GitHub profile",
      "LinkedIn profile up-to-date",
      "3-5 best projects highlighted",
      "Contact information clear",
    ],
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
  const meta = SECTION_META[type];
  const Icon = meta.icon;
  return (
    <section className="rounded-2xl border border-line bg-white p-4 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: meta.bg, color: meta.color }}>
          <Icon size={18} />
        </span>
        <h2 className="font-heading text-base sm:text-lg font-black text-ink">
          <span style={{ color: meta.color }}>{meta.num}.</span> {meta.title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function LoadingSkeleton({ title }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="rounded-2xl border border-line bg-white p-5 sm:p-7 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl cc-logo-gradient flex items-center justify-center shadow-brand">
            <Bot size={22} className="text-white animate-pulse" />
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

export default function CareerReportPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [career, setCareer] = useState(null);
  const [report, setReport] = useState(null); // AI roadmap data { stages, totalDuration }
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");
  const [generating, setGenerating] = useState(false);

  // 1) Load base career info
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get(`/careers/${slug}`);
        if (!mounted) return;
        setCareer(data);
      } catch (e) {
        setErrorMsg(e?.response?.data?.detail || "Career not found.");
        setStatus("error");
      }
    })();
    return () => { mounted = false; };
  }, [slug]);

  // 2) Load AI report: try cached GET, otherwise POST to generate
  useEffect(() => {
    if (!career?.slug) return;
    let mounted = true;
    (async () => {
      setStatus("loading");
      // First check cached AI roadmap (DB-backed: user + career)
      try {
        const { data } = await api.get(`/ai/roadmap/${career.slug}`);
        if (mounted && data?.stages?.length) {
          setReport(data);
          setStatus("ready");
          return;
        }
      } catch (_) {
        // 404 → no cache, proceed to generate
      }
      // Generate fresh
      try {
        setGenerating(true);
        const { data } = await api.post("/ai/roadmap/generate", { career_slug: career.slug });
        if (!mounted) return;
        if (data?.stages?.length) {
          setReport(data);
          setStatus("ready");
        } else {
          // Fall back to whatever the career doc has
          if (career.roadmap?.length) {
            setReport({ stages: career.roadmap, totalDuration: career.roadmapTotalDuration || "12 Months" });
            setStatus("ready");
          } else {
            setErrorMsg("AI returned no report data.");
            setStatus("error");
          }
        }
      } catch (e) {
        const msg = e?.response?.data?.detail || "AI generation failed.";
        // Show fallback if base career has roadmap, else error out
        if (career.roadmap?.length) {
          setReport({ stages: career.roadmap, totalDuration: "12 Months" });
          setStatus("ready");
          toast.error(`${msg} Showing fallback data.`);
        } else {
          setErrorMsg(msg);
          setStatus("error");
        }
      } finally {
        if (mounted) setGenerating(false);
      }
    })();
    return () => { mounted = false; };
  }, [career?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const stages = report?.stages || [];

  const educationPaths = useMemo(() => buildEducationPaths(stages, career?.title || "this career"), [stages, career?.title]);
  const skillStages = useMemo(() => buildSkillStages(stages, career?.title || "this career"), [stages, career?.title]);
  const courseMonths = useMemo(() => buildCourseMonths(stages), [stages]);
  const aiTools = useMemo(() => buildAITools(stages), [stages]);
  const projects = useMemo(() => buildProjects(stages, career?.title || "career"), [stages, career?.title]);
  const placement = useMemo(() => buildPlacement(stages), [stages]);
  const jobs = useMemo(() => buildJobs(stages, career?.jobs, career?.title || "Role", career?.avgSalary), [stages, career]);

  if (status === "loading" && !report) {
    const title = career?.title || slug.split("-").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ");
    return <LoadingSkeleton title={title} />;
  }

  if (status === "error") {
    return <ErrorState message={errorMsg} onRetry={retry} />;
  }

  const matchScore = 89;
  const salaryMin = asNumber(career?.avgSalary?.min, 4);
  const salaryMax = asNumber(career?.avgSalary?.max, 15);
  const demand = career?.demand || "High";

  return (
    <div className="min-h-screen bg-[#F8F6FF]">
      <SEO title={`${career?.title || "Career"} - Latecomers AI Report`} description={`Personalized career report for ${career?.title}.`} path={`/careers/${slug}`} />

      {/* Sticky back bar */}
      <div className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center gap-2 px-4 sm:px-6 lg:px-8 py-2.5">
          <button onClick={() => navigate(-1)} className="p-1.5 -ml-1.5 text-ink"><ArrowLeft size={18} /></button>
          <p className="flex-1 font-heading font-bold text-sm sm:text-base text-ink truncate">{career?.title}</p>
          {generating && (
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-brand font-bold">
              <Sparkles size={12} className="animate-pulse" /> Updating…
            </span>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-4 sm:space-y-6">
        {/* Hero / report header */}
        <div className="rounded-2xl border border-line bg-white p-4 sm:p-6 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] items-start">
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-brand">Your Career Report</p>
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-ink mt-1.5">{career?.title}</h1>
              <p className="mt-2 text-sm text-muted2 max-w-2xl leading-relaxed">{career?.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-xs sm:text-sm font-bold text-white">
                <Download size={14} /> Download PDF
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-ink">
                <Share2 size={14} /> Share
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

        <div className="text-center py-6">
          <button onClick={retry} disabled={generating} className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-xs font-bold text-muted2 hover:text-brand hover:border-brand transition disabled:opacity-50">
            <RefreshCw size={13} className={generating ? "animate-spin" : ""} />
            {generating ? "Regenerating…" : "Regenerate report with fresh AI"}
          </button>
        </div>
      </div>
    </div>
  );
}
