import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight, BookOpen, Briefcase, Bot, CheckCircle2, ChevronDown, ChevronUp,
  Code2, GraduationCap, Layers3, Rocket, Search, Sparkles, Target,
  Wrench, FolderOpen, Award, MapPin,
} from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import BackToTopButton from "../components/BackToTopButton";

const STAGE_COLORS = ["#7C3AED", "#10B981", "#0EA5E9", "#8B5CF6", "#F97316", "#EC4899"];
const STAGE_ICONS = [GraduationCap, Target, BookOpen, Bot, FolderOpen, Briefcase];
const SECTION_META = {
  education: { icon: GraduationCap, label: "Education Path", color: "#7C3AED" },
  courses: { icon: BookOpen, label: "Courses", color: "#0EA5E9" },
  skills: { icon: Target, label: "Skills To Master", color: "#10B981" },
  projects: { icon: FolderOpen, label: "Projects & Portfolio", color: "#F97316" },
  portfolio: { icon: FolderOpen, label: "Projects & Portfolio", color: "#F97316" },
  certifications: { icon: Award, label: "Certifications", color: "#EC4899" },
  tools: { icon: Bot, label: "AI Tools", color: "#8B5CF6" },
  resources: { icon: BookOpen, label: "Resources", color: "#14B8A6" },
  jobs: { icon: Briefcase, label: "Common Job Roles", color: "#EC4899" },
  placement: { icon: Briefcase, label: "Placement Suggestions", color: "#EC4899" },
  location: { icon: MapPin, label: "Where to Apply", color: "#6366F1" },
};

function normalizeStages(roadmapData) {
  const raw = roadmapData?.stages || [];
  if (!raw.length) return [];
  return raw.map((s, idx) => ({
    stageNum: s.stageNum || idx + 1,
    title: s.title || `Stage ${idx + 1}`,
    duration: s.duration || "Flexible",
    description: s.description || "",
    preview: s.preview || s.description || "",
    sections: s.sections || [],
    skills: s.skills || [],
    resources: s.resources || [],
  }));
}

export default function Roadmap() {
  const { user } = useAuth();
  const storedSlug = localStorage.getItem("last_roadmap_career_slug") || "";
  const storedTitle = localStorage.getItem("last_roadmap_career_title") || "";
  const defaultSlug = user?.lastRoadmapCareerSlug || storedSlug || user?.top_career_matches?.[0]?.careerSlug || "";

  const [slug, setSlug] = useState(defaultSlug);
  const [careers, setCareers] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [openStage, setOpenStage] = useState(0);

  // Search autocomplete state
  const [searchText, setSearchText] = useState(storedSlug === defaultSlug ? storedTitle : "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    api
      .get("/careers?limit=200")
      .then(({ data }) => {
        setCareers(data);
        // Set initial search text from default slug
        if (defaultSlug) {
          const match = data.find((c) => c.slug === defaultSlug);
          if (match) setSearchText(match.title);
          else if (storedSlug === defaultSlug && storedTitle) setSearchText(storedTitle);
        }
      })
      .catch((error) => toast.error(error?.response?.data?.detail || "Failed to load careers."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const nextSlug = user?.lastRoadmapCareerSlug || localStorage.getItem("last_roadmap_career_slug") || user?.top_career_matches?.[0]?.careerSlug;
    if (nextSlug && nextSlug !== slug) {
      setSlug(nextSlug);
      const match = careers.find((c) => c.slug === nextSlug);
      if (match) setSearchText(match.title);
      else setSearchText(localStorage.getItem("last_roadmap_career_title") || "");
    }
  }, [user?.lastRoadmapCareerSlug, user?.top_career_matches, careers, slug]);

  useEffect(() => {
    const handler = (event) => {
      const nextSlug = event.detail?.slug || localStorage.getItem("last_roadmap_career_slug");
      const nextTitle = event.detail?.title || localStorage.getItem("last_roadmap_career_title") || "";
      if (!nextSlug) return;
      setSlug(nextSlug);
      setRoadmap(null);
      setOpenStage(0);
      const match = careers.find((c) => c.slug === nextSlug);
      setSearchText(match?.title || nextTitle);
    };
    window.addEventListener("latecomers:roadmap-career-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("latecomers:roadmap-career-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, [careers]);

  useEffect(() => {
    if (!slug) { setLoadingPage(false); return; }
    let cancelled = false;
    setLoadingPage(true);
    (async () => {
      try {
        const { data } = await api.get(`/ai/roadmap/${slug}`);
        if (!cancelled) setRoadmap(data);
      } catch (error) {
        if (!cancelled) setRoadmap(null);
      } finally {
        if (!cancelled) setLoadingPage(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredCareers = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return careers.slice(0, 12);
    return careers.filter((c) => {
      const haystack = `${c.title} ${(c.tags || []).join(" ")} ${c.field || ""}`.toLowerCase();
      return haystack.includes(q);
    }).slice(0, 10);
  }, [searchText, careers]);

  const stages = useMemo(() => normalizeStages(roadmap), [roadmap]);
  const selectedCareer = careers.find((c) => c.slug === slug);

  const summary = useMemo(() => {
    const totalSkills = new Set(stages.flatMap((s) => s.skills || [])).size;
    const actionCount = stages.reduce((a, s) => a + (s.sections || []).reduce((sum, section) => sum + (section.items?.length || 0), 0), 0);
    return {
      duration: roadmap?.totalDuration || (stages.length ? "12 Months" : "-"),
      stages: stages.length,
      skills: Math.max(totalSkills, stages.length ? 10 : 0),
      projects: Math.max(actionCount, stages.length ? 12 : 0),
    };
  }, [roadmap?.totalDuration, stages]);

  const selectCareer = (career) => {
    setSlug(career.slug);
    setSearchText(career.title);
    localStorage.setItem("last_roadmap_career_slug", career.slug);
    localStorage.setItem("last_roadmap_career_title", career.title);
    setShowSuggestions(false);
  };

  const generate = async () => {
    if (!slug) { toast.error("Search and select a career first."); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/ai/roadmap/generate", { career_slug: slug });
      setRoadmap(data);
      if (selectedCareer) {
        localStorage.setItem("last_roadmap_career_slug", selectedCareer.slug);
        localStorage.setItem("last_roadmap_career_title", selectedCareer.title);
      }
      toast.success("Roadmap generated with specific action items!");
      setOpenStage(0);
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Roadmap generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const topMatch = user?.top_career_matches?.[0];
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1080px] mx-auto overflow-x-hidden w-full min-w-0" data-testid="roadmap-page">
      <h1 className="font-heading font-extrabold text-xl sm:text-3xl text-ink">Your Career Roadmap</h1>
      <p className="text-xs sm:text-sm text-muted2 mt-0.5">Step-by-step plan with specific actions to become job-ready.</p>

      {topMatch && (
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <CheckCircle2 size={13} /> Top match: {topMatch.careerSlug?.replace(/-/g, " ")} ({topMatch.matchPercent}%)
        </div>
      )}

      {/* Search bar with autocomplete */}
      <div className="mt-3 sm:mt-4 glass-card rounded-2xl p-3 sm:p-4">
        <p className="text-xs font-semibold text-muted2 mb-2">Search & select a career to generate your roadmap</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1" ref={searchRef}>
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted2 z-10" />
            <input
              value={searchText}
              onChange={(e) => { setSearchText(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Type a career... e.g. Data Scientist, Full Stack Developer"
              className="w-full bg-white border border-line rounded-xl pl-10 pr-4 py-2.5 text-sm"
              data-testid="roadmap-career-search"
            />
            {showSuggestions && filteredCareers.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-line rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                {filteredCareers.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => selectCareer(c)}
                    className={`w-full text-left px-4 py-2.5 hover:bg-brand-50 flex items-center gap-3 border-b border-line/50 last:border-b-0 transition ${slug === c.slug ? "bg-brand-50" : ""}`}
                    data-testid={`career-suggestion-${c.slug}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand flex items-center justify-center shrink-0">
                      <Briefcase size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink truncate">{c.title}</p>
                      <p className="text-[10px] text-muted2 truncate">{c.field} · {c.demand || "Growing"}</p>
                    </div>
                    {slug === c.slug && <CheckCircle2 size={14} className="text-brand ml-auto shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={generate}
            disabled={loading || !slug}
            className="inline-flex items-center justify-center gap-1.5 bg-brand hover:bg-brand-600 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-brand disabled:opacity-60 shrink-0"
            data-testid="generate-roadmap-button"
          >
            <Sparkles size={14} /> {loading ? "Generating..." : "Generate Roadmap"}
          </button>
        </div>
        {selectedCareer && !loading && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-muted2">Selected:</span>
            <span className="font-semibold text-brand">{selectedCareer.title}</span>
            {selectedCareer.salary_range && <span className="text-muted2">· {selectedCareer.salary_range}</span>}
          </div>
        )}
        {loading && (
          <div className="mt-3 flex items-center gap-3 px-1">
            <span className="w-4 h-4 border-2 border-brand-200 border-t-brand rounded-full animate-spin shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-brand animate-pulse">
              Crafting your personalized roadmap{selectedCareer ? ` for ${selectedCareer.title}` : ""}...
            </p>
          </div>
        )}
      </div>

      {/* Overview stats */}
      {stages.length > 0 && (
        <>
          <h3 className="font-heading font-bold text-sm sm:text-base text-ink mt-5">Roadmap Overview</h3>
          <div className="mt-2 flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
            {[
              { label: "Total Duration", value: summary.duration, icon: Rocket },
              { label: "Total Stages", value: summary.stages, icon: Layers3 },
              { label: "Skills to Learn", value: `${summary.skills}+`, icon: BookOpen },
              { label: "Action Items", value: `${summary.projects}+`, icon: Briefcase },
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
        </>
      )}

      {/* Loading skeleton */}
      {loadingPage && slug ? (
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-3xl p-5">
              <div className="h-5 w-48 rounded skeleton-shimmer" />
              <div className="h-4 w-full rounded skeleton-shimmer mt-2" />
              <div className="h-16 w-full rounded skeleton-shimmer mt-4" />
            </div>
          ))}
        </div>
      ) : stages.length > 0 ? (
        /* Accordion stage cards */
        <div className="mt-5 sm:mt-6 relative">
          {stages.map((stage, idx) => {
            const stageColor = STAGE_COLORS[idx % STAGE_COLORS.length];
            const StageIcon = STAGE_ICONS[idx % STAGE_ICONS.length];
            const isOpen = openStage === idx;
            const isLast = idx === stages.length - 1;

            // Parse sections from new AI format
            const sections = stage.sections || [];

            return (
              <div key={stage.stageNum} className="flex gap-3 sm:gap-4 relative">
                {/* Timeline column */}
                <div className="flex flex-col items-center shrink-0 w-10 sm:w-16">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${stageColor}18`, color: stageColor }}>
                    <StageIcon size={16} />
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-bold mt-1 text-center leading-tight" style={{ color: stageColor }}>Stage {stage.stageNum}</p>
                  {!isLast && (
                    <div className="flex flex-col items-center mt-1 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: stageColor }} />
                      <div className="w-0.5 flex-1 min-h-[24px]" style={{ background: `${stageColor}30` }} />
                    </div>
                  )}
                </div>

                {/* Accordion card */}
                <div className={`flex-1 mb-3 sm:mb-4 rounded-xl sm:rounded-2xl border transition-all ${isOpen ? "glass-card border-brand/20 shadow-md" : "surface-gradient border-line"}`}>
                  {/* Collapsed header — always visible */}
                  <button
                    onClick={() => setOpenStage(isOpen ? -1 : idx)}
                    className="w-full p-3 sm:p-4 flex items-center gap-3 text-left"
                    data-testid={`roadmap-stage-${stage.stageNum}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-heading font-bold text-sm sm:text-base text-ink leading-tight">{stage.title}</p>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${stageColor}15`, color: stageColor }}>{stage.duration}</span>
                      </div>
                      {!isOpen && (
                        <p className="text-[11px] sm:text-xs text-muted2 mt-1 line-clamp-1">{stage.preview || stage.description}</p>
                      )}
                    </div>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: `${stageColor}12` }}>
                      {isOpen ? <ChevronUp size={14} style={{ color: stageColor }} /> : <ChevronDown size={14} style={{ color: stageColor }} />}
                    </div>
                  </button>

                  {/* Expanded content */}
                  {isOpen && (
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-3">
                      {stage.description && (
                        <p className="text-xs sm:text-sm text-muted2 leading-relaxed">{stage.description}</p>
                      )}

                      {/* Render sections from AI */}
                      {sections.map((section, sIdx) => {
                        const key = (section.type || section.label || "").toLowerCase().replace(/[^a-z]/g, "");
                        const meta = SECTION_META[key] || Object.values(SECTION_META).find(m => section.label?.toLowerCase().includes(m.label.toLowerCase().split(" ")[0])) || { icon: BookOpen, label: section.label || "Details", color: "#64748B" };
                        const SectionIcon = meta.icon;
                        const items = section.items || [];

                        return (
                          <div key={sIdx} className="bg-white border border-line rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: `${meta.color}15`, color: meta.color }}>
                                <SectionIcon size={13} />
                              </div>
                              <p className="text-xs sm:text-sm font-bold text-ink">{section.label || meta.label}</p>
                            </div>
                            <div className="space-y-1.5 pl-8">
                              {items.map((item, iIdx) => (
                                <div key={iIdx} className="flex items-start gap-2 text-[11px] sm:text-xs text-ink leading-relaxed">
                                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: meta.color }} />
                                  <span>{typeof item === "string" ? item : item.text || item.label || JSON.stringify(item)}</span>
                                </div>
                              ))}
                              {items.length === 0 && (
                                <p className="text-[11px] text-muted2 italic">Generate a roadmap to see specific action items.</p>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Fallback: render skills/resources if no sections */}
                      {sections.length === 0 && (stage.skills?.length > 0 || stage.resources?.length > 0) && (
                        <>
                          {stage.skills?.length > 0 && (
                            <div className="bg-white border border-line rounded-xl p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                  <Wrench size={13} />
                                </div>
                                <p className="text-xs sm:text-sm font-bold text-ink">Skills Required</p>
                              </div>
                              <div className="flex flex-wrap gap-1.5 pl-8">
                                {stage.skills.map((s) => (
                                  <span key={s} className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-50 text-brand">{s}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {stage.resources?.length > 0 && (
                            <div className="bg-white border border-line rounded-xl p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                  <BookOpen size={13} />
                                </div>
                                <p className="text-xs sm:text-sm font-bold text-ink">Resources</p>
                              </div>
                              <div className="space-y-1.5 pl-8">
                                {stage.resources.map((r, i) => (
                                  <div key={i} className="flex items-start gap-2 text-[11px] sm:text-xs text-ink">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                    <span>{r.label || r}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {sections.length === 0 && !stage.skills?.length && !stage.resources?.length && (
                        <div className="text-center py-3">
                          <p className="text-xs text-muted2">Click "Generate Roadmap" above to get specific, actionable steps for this stage.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : !loadingPage && slug ? (
        <div className="mt-6 glass-card rounded-2xl p-6 text-center">
          <Sparkles size={28} className="mx-auto text-brand mb-2" />
          <p className="font-heading font-bold text-sm sm:text-base text-ink">No roadmap yet</p>
          <p className="text-xs text-muted2 mt-1">Click "Generate Roadmap" to create a personalized, step-by-step plan.</p>
        </div>
      ) : !loadingPage ? (
        <div className="mt-6 glass-card rounded-2xl p-6 text-center">
          <Search size={28} className="mx-auto text-muted2 mb-2" />
          <p className="font-heading font-bold text-sm sm:text-base text-ink">Search for a career to get started</p>
          <p className="text-xs text-muted2 mt-1">Type a career name above and select it to see your roadmap.</p>
        </div>
      ) : null}

      {/* Next step CTA */}
      {stages.length > 0 && (
        <div className="mt-4 sm:mt-6 bg-brand-50 border border-brand-100 rounded-2xl p-3 sm:p-4 flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-brand-100 text-brand flex items-center justify-center shrink-0">
            <Rocket size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading font-bold text-xs sm:text-sm text-ink">Ready to Start?</p>
            <p className="text-[10px] sm:text-xs text-muted2 mt-0.5">Begin with Stage 1 and follow each action item step by step.</p>
          </div>
          <button onClick={() => setOpenStage(0)} className="inline-flex items-center gap-1 bg-brand text-white font-semibold text-[11px] sm:text-sm px-3 py-2 rounded-full shadow-brand shrink-0">
            Start <ArrowRight size={13} />
          </button>
        </div>
      )}
      <BackToTopButton />
    </div>
  );
}
