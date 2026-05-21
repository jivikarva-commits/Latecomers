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
      .get("/careers?limit=50")
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1080px] mx-auto pb-28" data-testid="roadmap-page">
      <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink">Career Requirements Roadmap</h1>
      <p className="text-sm sm:text-base text-muted2 mt-1">Know exactly what this career requires to become job-ready.</p>

      {topMatch && (
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <CheckCircle2 size={13} /> Top match: {topMatch.careerSlug?.replace(/-/g, " ")} ({topMatch.matchPercent}%)
        </div>
      )}

      <div className="mt-5 glass-card rounded-3xl p-4 sm:p-5 flex flex-wrap items-center gap-3">
        <label className="text-sm font-semibold text-ink">Career:</label>
        <select
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="bg-white border border-line rounded-full px-4 py-2 text-sm font-medium min-w-[220px]"
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
          className="inline-flex items-center gap-2 bg-brand hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-brand disabled:opacity-60"
          data-testid="generate-roadmap-button"
        >
          <Sparkles size={16} /> {loading ? "Generating..." : "Refresh with AI"}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Job-ready Timeline", value: summary.duration, icon: Rocket },
          { label: "Requirement Stages", value: summary.stages, icon: Layers3 },
          { label: "Core Skills", value: `${summary.skills}+`, icon: BookOpen },
          { label: "Portfolio/Projects", value: `${summary.projects}+`, icon: Briefcase },
        ].map((item) => (
          <div key={item.label} className="glass-card rounded-2xl p-4">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand flex items-center justify-center mb-2">
              <item.icon size={16} />
            </div>
            <p className="text-xs text-muted2">{item.label}</p>
            <p className="font-heading font-extrabold text-lg text-ink mt-0.5">{item.value}</p>
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
        <div className="mt-6 space-y-4">
          {stages.map((stage, idx) => {
            const stageColor = STAGE_COLORS[idx % STAGE_COLORS.length];
            const StageIcon = STAGE_ICONS[idx % STAGE_ICONS.length];
            const isOpen = openStage === idx;
            const req = stageRequirements(stage);
            return (
              <div key={stage.stageNum} className="flex gap-3 sm:gap-4">
                <div className="hidden sm:flex flex-col items-center shrink-0 w-24">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${stageColor}1a`, color: stageColor }}>
                    <StageIcon size={22} />
                  </div>
                  <p className="text-xs font-bold mt-2" style={{ color: stageColor }}>
                    Stage {stage.stageNum}
                  </p>
                  <p className="text-[11px] text-muted2">{stage.duration}</p>
                  {idx < stages.length - 1 && <div className="w-0.5 h-12 bg-line rounded-full mt-2" />}
                </div>

                <div className="glass-card rounded-3xl p-4 sm:p-5 flex-1">
                  <button onClick={() => setOpenStage(isOpen ? -1 : idx)} className="w-full flex items-start gap-3 text-left" data-testid={`roadmap-stage-${stage.stageNum}`}>
                    <div className="sm:hidden w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${stageColor}1a`, color: stageColor }}>
                      <StageIcon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted2">
                        Stage {stage.stageNum} • {stage.duration}
                      </p>
                      <p className="font-heading font-bold text-lg text-ink mt-0.5">{stage.title}</p>
                      <p className="text-sm text-muted2 mt-1 leading-relaxed">{stage.description}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[11px] font-bold" style={{ color: stageColor }}>
                        View Requirements
                      </p>
                      {isOpen ? <ChevronUp size={15} className="text-muted2 mt-1 ml-auto" /> : <ChevronDown size={15} className="text-muted2 mt-1 ml-auto" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-4 pt-4 border-t border-line space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted2 mb-2">Skills/Qualifications Required</p>
                        <div className="flex flex-wrap gap-2">
                          {req.skills.length ? (
                            req.skills.map((skill) => (
                              <span key={skill} className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: `${stageColor}15`, color: stageColor }}>
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p className="text-sm text-muted2">Role-relevant fundamentals and practical application skills.</p>
                          )}
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="bg-white border border-line rounded-xl p-3">
                          <p className="text-xs font-bold text-ink mb-1">Certifications Employers Value</p>
                          {req.certifications.map((item) => (
                            <p key={item} className="text-xs text-muted2 mt-1">
                              • {item}
                            </p>
                          ))}
                        </div>
                        <div className="bg-white border border-line rounded-xl p-3">
                          <p className="text-xs font-bold text-ink mb-1">Tools/Software Familiarity</p>
                          {req.tools.map((item) => (
                            <p key={item} className="text-xs text-muted2 mt-1">
                              • {item}
                            </p>
                          ))}
                        </div>
                        <div className="bg-white border border-line rounded-xl p-3 md:col-span-2">
                          <p className="text-xs font-bold text-ink mb-1">Experience/Projects to Build</p>
                          {req.projects.map((item) => (
                            <p key={item} className="text-xs text-muted2 mt-1">
                              • {item}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 text-brand text-xs font-semibold">
                        Estimated timeline: {stage.duration}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 bg-brand-50 border border-brand-100 rounded-3xl p-4 sm:p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-white border border-brand-100 text-brand flex items-center justify-center shrink-0">
          <Rocket size={18} />
        </div>
        <div className="flex-1">
          <p className="font-heading font-bold text-base text-ink">Next Step</p>
          <p className="text-sm text-muted2 mt-0.5">Start with Stage 1 requirements and convert each requirement into weekly action items.</p>
        </div>
        <button onClick={() => setOpenStage(0)} className="hidden sm:inline-flex items-center gap-1.5 bg-brand text-white font-semibold text-sm px-4 py-2.5 rounded-full shadow-brand">
          Explore This Stage <ArrowRight size={14} />
        </button>
      </div>
      <BackToTopButton />
    </div>
  );
}
