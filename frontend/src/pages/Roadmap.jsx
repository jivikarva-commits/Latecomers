import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, BookOpen, Briefcase, CheckCircle2, ChevronDown, ChevronUp, Code2, Layers3, Rocket, Sparkles, Target } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import BackToTopButton from "../components/BackToTopButton";

const FALLBACK_STAGES = [
  { stageNum: 1, title: "Core Skills Required", duration: "0 - 3 Months" },
  { stageNum: 2, title: "Portfolio Requirements", duration: "3 - 6 Months" },
  { stageNum: 3, title: "Job Readiness Checklist", duration: "6 - 9 Months" },
  { stageNum: 4, title: "How to Apply & Get Hired", duration: "9 - 12 Months" },
];

const STAGE_COLORS = ["#5B4FE9", "#22C55E", "#3B82F6", "#F97316"];
const STAGE_ICONS = [Rocket, Code2, Layers3, Target];

function normalizeStages(roadmapData) {
  const raw = roadmapData?.stages || [];
  if (!raw.length) {
    return FALLBACK_STAGES.map((s) => ({
      ...s,
      description: "Understand the exact requirements employers expect at this stage.",
      skills: [],
      resources: [],
    }));
  }
  return raw.map((s, idx) => ({
    stageNum: s.stageNum || idx + 1,
    title: s.title || FALLBACK_STAGES[idx]?.title || `Stage ${idx + 1}`,
    duration: s.duration || FALLBACK_STAGES[idx]?.duration || "Flexible",
    description: s.description || "Clarify what this stage requires for hiring success.",
    skills: s.skills || [],
    resources: s.resources || [],
  }));
}

function stageRequirements(stage) {
  const skills = (stage.skills || []).slice(0, 5);
  const resources = stage.resources || [];
  const certifications = resources.filter((r) => `${r.type}`.toLowerCase().includes("cert")).slice(0, 3);
  const tools = resources.filter((r) => `${r.type}`.toLowerCase().includes("tool")).slice(0, 3);
  const projects = resources.filter((r) => `${r.type}`.toLowerCase().includes("project")).slice(0, 3);
  return {
    skills,
    certifications: certifications.length ? certifications.map((r) => r.label) : ["Industry-recognized role certificate"],
    tools: tools.length ? tools.map((r) => r.label) : ["Role-standard software stack"],
    projects: projects.length ? projects.map((r) => r.label) : ["One end-to-end practical project"],
  };
}

export default function Roadmap() {
  const { user } = useAuth();
  const defaultSlug = user?.top_career_matches?.[0]?.careerSlug || "data-scientist";

  const [slug, setSlug] = useState(defaultSlug);
  const [careers, setCareers] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [openStage, setOpenStage] = useState(0);

  useEffect(() => {
    api
      .get("/careers?limit=200")
      .then(({ data }) => setCareers(data))
      .catch((error) => toast.error(error?.response?.data?.detail || "Failed to load careers."));
  }, []);

  useEffect(() => {
    const topSlug = user?.top_career_matches?.[0]?.careerSlug;
    if (topSlug) setSlug(topSlug);
  }, [user?.top_career_matches]);

  useEffect(() => {
    if (!slug) return;
    setLoadingPage(true);
    api
      .get(`/ai/roadmap/${slug}`)
      .then(({ data }) => setRoadmap(data))
      .catch(() => setRoadmap(null))
      .finally(() => setLoadingPage(false));
  }, [slug]);

  const stages = useMemo(() => normalizeStages(roadmap), [roadmap]);

  const summary = useMemo(() => {
    const totalSkills = new Set(stages.flatMap((s) => s.skills || [])).size;
    const totalResources = stages.reduce((acc, s) => acc + (s.resources?.length || 0), 0);
    return {
      duration: `${stages.length * 3}-${stages.length * 3 + 3} Months`,
      stages: stages.length,
      skills: Math.max(totalSkills, 10),
      projects: Math.max(Math.round(totalResources / 2), 4),
    };
  }, [stages]);

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/ai/roadmap/generate", { career_slug: slug });
      setRoadmap(data);
      toast.success("Career requirements regenerated.");
      setOpenStage(0);
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Roadmap generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const topMatch = user?.top_career_matches?.[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1080px] mx-auto pb-28 overflow-x-hidden w-full min-w-0" data-testid="roadmap-page">
      <h1 className="font-heading font-extrabold text-xl sm:text-3xl text-ink">Your Personalized Roadmap</h1>
      <p className="text-xs sm:text-sm text-muted2 mt-0.5">Step-by-step plan to become job-ready.</p>

      {topMatch && (
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <CheckCircle2 size={13} /> Top match: {topMatch.careerSlug?.replace(/-/g, " ")} ({topMatch.matchPercent}%)
        </div>
      )}

      <div className="mt-3 sm:mt-4 glass-card rounded-2xl p-3 sm:p-4 flex flex-wrap items-center gap-2 sm:gap-3">
        <select
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="bg-white border border-line rounded-full px-3 py-2 text-xs sm:text-sm font-medium flex-1 min-w-0"
          data-testid="roadmap-career-select"
        >
          {careers.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.title}
            </option>
          ))}
        </select>
        <button
          onClick={generate}
          disabled={loading}
          className="inline-flex items-center gap-1.5 bg-brand hover:bg-brand-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-full shadow-brand disabled:opacity-60 shrink-0"
          data-testid="generate-roadmap-button"
        >
          <Sparkles size={14} /> {loading ? "Generating..." : "Refresh"}
        </button>
      </div>

      <h3 className="font-heading font-bold text-sm sm:text-base text-ink mt-5">Roadmap Overview</h3>
      <div className="mt-2 flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
        {[
          { label: "Total Duration", value: summary.duration, icon: Rocket },
          { label: "Total Stages", value: summary.stages, icon: Layers3 },
          { label: "Skills to Learn", value: `${summary.skills}+`, icon: BookOpen },
          { label: "Projects", value: `${summary.projects}+`, icon: Briefcase },
        ].map((item) => (
          <div key={item.label} className="glass-card rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 flex items-center gap-2 min-w-[130px] sm:min-w-0 sm:flex-1 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand flex items-center justify-center shrink-0">
              <item.icon size={15} />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-muted2 leading-tight">{item.label}</p>
              <p className="font-heading font-bold text-sm sm:text-base text-ink">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {loadingPage ? (
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-3xl p-5">
              <div className="h-5 w-48 rounded skeleton-shimmer" />
              <div className="h-4 w-full rounded skeleton-shimmer mt-2" />
              <div className="h-16 w-full rounded skeleton-shimmer mt-4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 sm:mt-6 relative">
          {stages.map((stage, idx) => {
            const stageColor = STAGE_COLORS[idx % STAGE_COLORS.length];
            const StageIcon = STAGE_ICONS[idx % STAGE_ICONS.length];
            const isOpen = openStage === idx;
            const req = stageRequirements(stage);
            const isLast = idx === stages.length - 1;
            return (
              <div key={stage.stageNum} className="flex gap-3 sm:gap-4 relative">
                {/* Timeline column */}
                <div className="flex flex-col items-center shrink-0 w-14 sm:w-20">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${stageColor}18`, color: stageColor }}>
                    <StageIcon size={18} />
                  </div>
                  <p className="text-[10px] sm:text-xs font-bold mt-1" style={{ color: stageColor }}>Stage {stage.stageNum}</p>
                  <p className="text-[9px] sm:text-[10px] text-muted2 leading-tight text-center">{stage.duration}</p>
                  {!isLast && (
                    <div className="flex flex-col items-center mt-1.5 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: stageColor }} />
                      <div className="w-0.5 flex-1 min-h-[32px] bg-brand-100" />
                    </div>
                  )}
                </div>

                {/* Card */}
                <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 flex-1 mb-3 sm:mb-4">
                  <button onClick={() => setOpenStage(isOpen ? -1 : idx)} className="w-full flex items-start gap-2 text-left" data-testid={`roadmap-stage-${stage.stageNum}`}>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-sm sm:text-base text-ink leading-tight">{stage.title}</p>
                      <p className="text-[11px] sm:text-sm text-muted2 mt-0.5 leading-snug line-clamp-2">{stage.description}</p>
                      {stage.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          <span className="text-[10px] font-semibold text-muted2">Key Skills</span>
                          {stage.skills.slice(0, 4).map((s) => (
                            <span key={s} className="px-1.5 py-px rounded text-[10px] font-medium bg-white border border-line text-ink">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5">
                      <div className="relative w-10 h-10 sm:w-11 sm:h-11">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <circle cx="18" cy="18" r="15" fill="none" stroke="#E8E4FF" strokeWidth="2.5" />
                          <circle cx="18" cy="18" r="15" fill="none" stroke={stageColor} strokeWidth="2.5" strokeDasharray={`${idx === 0 ? 20 : 0} 100`} strokeLinecap="round" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-ink">{idx === 0 ? "20%" : "0%"}</span>
                      </div>
                      {isOpen ? <ChevronUp size={14} className="text-muted2" /> : <ChevronDown size={14} className="text-muted2" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-3 pt-3 border-t border-line space-y-3">
                      {req.skills.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted2 mb-1.5">Skills Required</p>
                          <div className="flex flex-wrap gap-1.5">
                            {req.skills.map((skill) => (
                              <span key={skill} className="px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: `${stageColor}12`, color: stageColor }}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="bg-white border border-line rounded-lg p-2.5">
                          <p className="text-[11px] font-bold text-ink mb-1">Certifications</p>
                          {req.certifications.map((item) => (
                            <p key={item} className="text-[10px] sm:text-xs text-muted2 mt-0.5">• {item}</p>
                          ))}
                        </div>
                        <div className="bg-white border border-line rounded-lg p-2.5">
                          <p className="text-[11px] font-bold text-ink mb-1">Tools & Projects</p>
                          {[...req.tools, ...req.projects].slice(0, 3).map((item) => (
                            <p key={item} className="text-[10px] sm:text-xs text-muted2 mt-0.5">• {item}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 sm:mt-6 bg-brand-50 border border-brand-100 rounded-2xl p-3 sm:p-4 flex items-center gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-brand-100 text-brand flex items-center justify-center shrink-0">
          <Rocket size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-xs sm:text-sm text-ink">Next Step for You</p>
          <p className="text-[10px] sm:text-xs text-muted2 mt-0.5">Start with Stage 1 and build your foundation.</p>
        </div>
        <button onClick={() => setOpenStage(0)} className="inline-flex items-center gap-1 bg-brand text-white font-semibold text-[11px] sm:text-sm px-3 py-2 rounded-full shadow-brand shrink-0">
          Start Learning <ArrowRight size={13} />
        </button>
      </div>
      <BackToTopButton />
    </div>
  );
}
