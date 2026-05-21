import React, { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Mic, Building2, GraduationCap, Sparkles, CheckCircle2, RotateCcw, Briefcase, Search, BookOpen, ClipboardCheck, Trophy } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "../components/NotificationBell";

// Lazy load heavy recharts library — with percentage labels on each axis
const LazyRadarChart = lazy(() =>
  import("recharts").then((mod) => ({
    default: ({ data, hasRealData, chartKey }) => {
      const renderTick = ({ payload, x, y, textAnchor }) => {
        const item = data.find((d) => d.metric === payload.value);
        return (
          <g>
            <text x={x} y={y} textAnchor={textAnchor} fill="#64748B" fontSize={10} fontWeight={600}>
              {payload.value}
            </text>
            {hasRealData && item?.value > 0 && (
              <text x={x} y={y + 13} textAnchor={textAnchor} fill="#5B4FE9" fontSize={10} fontWeight={700}>
                {item.value}%
              </text>
            )}
          </g>
        );
      };
      return (
        <mod.ResponsiveContainer width="100%" height="100%">
          <mod.RadarChart key={chartKey} data={data} cx="50%" cy="50%" outerRadius="65%">
            <mod.PolarGrid stroke="#E8E4FF" />
            <mod.PolarAngleAxis dataKey="metric" tick={renderTick} />
            <mod.Radar name="You" dataKey="value" stroke="#5B4FE9" fill="#5B4FE9" fillOpacity={hasRealData ? 0.35 : 0.08} />
          </mod.RadarChart>
        </mod.ResponsiveContainer>
      );
    },
  }))
);

// Dynamic icon resolver — avoids importing entire lucide-react library
const iconCache = { FileText, Mic, Building2, GraduationCap, Sparkles, CheckCircle2, RotateCcw, Briefcase };
function getIcon(name) {
  if (iconCache[name]) return iconCache[name];
  return Briefcase; // fallback
}
// Lazy load remaining icons on demand
let fullIconsPromise = null;
function loadFullIcons() {
  if (!fullIconsPromise) {
    fullIconsPromise = import("lucide-react").then((mod) => {
      Object.assign(iconCache, mod);
    });
  }
  return fullIconsPromise;
}

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const ROADMAP_STEPS = [
  { n: 1, icon: Search, label: "Explore", desc: "Discover careers that match you", color: "#5B4FE9" },
  { n: 2, icon: BookOpen, label: "Learn", desc: "Build the right skills & knowledge", color: "#3B82F6" },
  { n: 3, icon: ClipboardCheck, label: "Prepare", desc: "Get ready with practice & guidance", color: "#F97316" },
  { n: 4, icon: Trophy, label: "Achieve", desc: "Apply, crack & achieve your goals", color: "#22C55E" },
];

export default function Dashboard() {
  const { user, refresh } = useAuth();
  const navigate = useNavigate();
  const [careersMap, setCareersMap] = useState({});
  const [allCareers, setAllCareers] = useState([]);
  const [loadingCareers, setLoadingCareers] = useState(true);

  // Lazy load full icon set after mount for career card icons
  const [iconsLoaded, setIconsLoaded] = useState(false);
  useEffect(() => {
    loadFullIcons().then(() => setIconsLoaded(true));
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/careers?limit=60");
        setAllCareers(data);
        const map = {};
        data.forEach((c) => {
          map[c.slug] = c;
        });
        setCareersMap(map);
      } catch (e) {
        console.error("Failed to fetch careers", e);
      } finally {
        setLoadingCareers(false);
      }
    })();
  }, []);

  const careerAnalysis = user?.careerAnalysis || null;
  const userMatches = useMemo(() => user?.top_career_matches || [], [user?.top_career_matches]);
  const cmScore = careerAnalysis?.scores
    ? { overall: careerAnalysis.overallScore, ...careerAnalysis.scores }
    : user?.profile?.careerMatchScore;
  const overall = careerAnalysis?.overallScore ?? cmScore?.overall ?? null;
  const hasRealData = !!cmScore && overall !== null;

  useEffect(() => {
    console.log("Dashboard careerAnalysis data:", careerAnalysis);
  }, [careerAnalysis]);

  const radar = [
    { metric: "Skills", value: cmScore?.skills ?? 0 },
    { metric: "Interests", value: cmScore?.interests ?? 0 },
    { metric: "Personality", value: cmScore?.personality ?? 0 },
    { metric: "Values", value: cmScore?.values ?? 0 },
    { metric: "Goals", value: cmScore?.goals ?? 0 },
  ];

  const displayCareers = useMemo(() => {
    if (careerAnalysis?.topCareers?.length > 0) {
      return careerAnalysis.topCareers.map((m) => {
        const career = careersMap[m.slug] || {};
        return {
          ...career,
          ...m,
          avgSalary: { min: m.avgSalaryMin, max: m.avgSalaryMax },
          jobGrowth5Y: m.jobGrowth,
          matchTags: m.tags || [],
          matchReasons: m.whyMatch || [],
        };
      });
    }
    if (userMatches.length > 0) {
      return userMatches
        .slice(0, 3)
        .map((m) => {
          const career = careersMap[m.careerSlug];
          if (!career) return null;
          return { ...career, matchPercent: m.matchPercent, matchTags: m.tags || [], matchReasons: m.reasons || [] };
        })
        .filter(Boolean);
    }
    return allCareers.slice(0, 3).map((c, i) => ({
      ...c,
      matchPercent: [92, 88, 85][i] ?? 80,
      matchTags: c.tags || [],
      matchReasons: [],
    }));
  }, [allCareers, careerAnalysis, careersMap, userMatches]);

  const additionalCareers = useMemo(() => {
    if (!careerAnalysis?.additionalCareers?.length) return [];
    return careerAnalysis.additionalCareers.map((m) => {
      const career = careersMap[m.slug] || {};
      return {
        ...career,
        ...m,
        avgSalary: { min: m.avgSalaryMin, max: m.avgSalaryMax },
        jobGrowth5Y: m.jobGrowth,
        matchTags: m.tags || [],
      };
    });
  }, [careerAnalysis, careersMap]);

  const retakeQuiz = async () => {
    try {
      await api.post("/ai/onboarding/retake");
      await refresh();
      navigate("/onboarding");
    } catch (e) {
      console.error("Failed to reset onboarding quiz", e);
    }
  };

  const scoreBadge = !hasRealData
    ? null
    : overall >= 80
    ? { label: "Excellent Match", cls: "bg-emerald-100 text-emerald-700" }
    : overall >= 65
    ? { label: "Good Match", cls: "bg-blue-100 text-blue-700" }
    : { label: "Growing Match", cls: "bg-amber-100 text-amber-700" };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-x-hidden w-full min-w-0" data-testid="dashboard-page">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="font-heading font-extrabold text-xl sm:text-3xl text-ink">
            {getTimeGreeting()}, {user?.name?.split(" ")[0] || "there"}! <span className="inline-block">👋</span>
          </h1>
          <p className="text-muted2 mt-0.5 sm:mt-1 text-xs sm:text-base">
            {hasRealData ? "Your AI-powered career requirement snapshot is ready." : "Let's map your career requirements clearly."}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden md:block">
            <NotificationBell />
          </div>
        </div>
      </div>

      <div className="mt-3 sm:mt-5 glass-card rounded-2xl sm:rounded-3xl p-3 sm:p-5" data-testid="career-match-card">
        <p className="text-[10px] sm:text-xs font-semibold text-muted2 uppercase tracking-wider mb-2">Your Career Match Score</p>
        <div className="grid grid-cols-[1fr_1fr] sm:grid-cols-2 gap-2 sm:gap-4 items-center">
          <div className="flex flex-col gap-1">
            {hasRealData ? (
              <>
                <div className="flex items-end gap-1.5 sm:gap-2">
                  <p className="font-heading font-extrabold text-3xl sm:text-5xl text-brand leading-none">
                    {overall}<span className="text-xl sm:text-3xl">%</span>
                  </p>
                </div>
                {scoreBadge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold w-fit ${scoreBadge.cls}`}>
                    {scoreBadge.label}
                  </span>
                )}
                {(careerAnalysis?.summary || user?.profile?.summary) && (
                  <p className="text-[10px] sm:text-xs text-muted2 mt-0.5 line-clamp-2 leading-snug">
                    {careerAnalysis?.summary || user.profile.summary}
                  </p>
                )}
                <Link to="/careers" className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-brand mt-0.5 w-fit" data-testid="view-full-analysis-link">
                  View full analysis →
                </Link>
              </>
            ) : (
              <>
                <p className="font-heading font-extrabold text-3xl sm:text-5xl text-brand/30 leading-none">
                  —<span className="text-xl sm:text-3xl">%</span>
                </p>
                <p className="text-[10px] sm:text-sm text-muted2 mt-0.5">Complete the career quiz to see your score.</p>
                <button
                  onClick={() => navigate("/onboarding")}
                  className="mt-1.5 inline-flex items-center gap-1.5 bg-brand text-white font-semibold px-3 py-2 rounded-full text-xs sm:text-sm shadow-brand w-fit"
                >
                  <Sparkles size={13} /> Take Quiz
                </button>
              </>
            )}
          </div>

          <div className="h-36 sm:h-48 w-full max-w-full min-w-0 overflow-hidden">
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><div className="w-6 h-6 border-2 border-brand-200 border-t-brand rounded-full animate-spin" /></div>}>
              <LazyRadarChart
                data={radar}
                hasRealData={hasRealData}
                chartKey={`${overall ?? "na"}-${user?.updated_at || "fresh"}`}
              />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="mt-5 sm:mt-6 flex items-center justify-between">
        <h2 className="font-heading font-bold text-base sm:text-xl text-ink">
          {hasRealData ? "Your AI-Matched Careers" : "Popular Career Paths"}
        </h2>
        <Link to="/careers" className="text-sm font-semibold text-brand" data-testid="dashboard-view-all-careers">
          View all →
        </Link>
      </div>

      {loadingCareers ? (
        <div className="mt-2.5 flex gap-2.5 sm:gap-4 overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
          {[1, 2, 3].map((i) => (
            <div key={i} className="surface-gradient rounded-2xl border border-line p-3 sm:p-5 min-w-[200px] sm:min-w-[280px] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl skeleton-shimmer shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="h-4 w-3/4 rounded skeleton-shimmer" />
                  <div className="h-3 w-1/2 rounded mt-1.5 skeleton-shimmer" />
                </div>
              </div>
              <div className="h-3 w-full rounded mt-2.5 skeleton-shimmer" />
              <div className="h-8 w-full rounded-lg mt-2 skeleton-shimmer" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-2.5 flex gap-2.5 sm:gap-4 overflow-x-auto pb-2 snap-x no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {displayCareers.map((c) => {
            const Ic = getIcon(c.icon) || Briefcase;
            return (
              <Link
                to={`/careers/${c.slug}`}
                key={c.career_id || c.slug}
                className="surface-gradient rounded-2xl p-3 sm:p-4 border border-line elevated-card hover:shadow-md transition min-w-[200px] sm:min-w-[280px] max-w-[220px] sm:max-w-[320px] snap-start shrink-0"
                data-testid={`dashboard-career-card-${c.slug}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: (c.iconColor || "#5B4FE9") + "20", color: c.iconColor || "#5B4FE9" }}
                    >
                      <Ic size={17} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-bold text-[13px] sm:text-sm text-ink leading-tight truncate">{c.title}</p>
                      <span className="inline-block px-1.5 py-px rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold mt-0.5">
                        {c.matchPercent}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {(c.matchTags?.length ? c.matchTags : c.tags || []).slice(0, 2).map((t) => (
                    <span key={t} className="px-1.5 py-px rounded-full bg-brand-50 text-brand text-[10px] font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
                {c.matchReasons?.length > 0 && <p className="text-[10px] text-emerald-700 mt-1.5 line-clamp-1 font-medium">✓ {c.matchReasons[0]}</p>}
                <div className="flex items-center gap-2 mt-2 text-[10px] sm:text-xs text-muted2">
                  <span className="font-semibold text-ink">₹{c.avgSalary?.min}–{c.avgSalary?.max}L</span>
                  <span>·</span>
                  <span>{c.jobGrowth5Y}% <span className="text-emerald-600 font-semibold">{c.demand}</span></span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {careerAnalysis && additionalCareers.length > 0 && (
        <div className="mt-5 sm:mt-6" data-testid="dashboard-additional-careers">
          <h2 className="font-heading font-bold text-sm sm:text-xl text-ink">More Career Matches</h2>
          <div className="mt-2 sm:mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {additionalCareers.map((c) => {
              const Ic = getIcon(c.icon) || Briefcase;
              return (
                <Link
                  to={`/careers/${c.slug}`}
                  key={c.slug}
                  className="bg-white border border-line rounded-xl p-2.5 sm:p-3.5 hover:bg-brand-50 transition flex flex-col"
                  data-testid={`dashboard-additional-career-${c.slug}`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: (c.iconColor || "#5B4FE9") + "18", color: c.iconColor || "#5B4FE9" }}
                    >
                      <Ic size={15} />
                    </div>
                    <span className="px-1.5 py-px rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                      {c.matchPercent}%
                    </span>
                  </div>
                  <p className="font-heading font-bold text-xs sm:text-sm text-ink mt-1.5 leading-tight line-clamp-2">{c.title}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {(c.matchTags || c.tags || []).slice(0, 2).map((t) => (
                      <span key={t} className="px-1.5 py-px rounded-full bg-brand-50 text-brand text-[9px] sm:text-[10px] font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted2 mt-auto pt-1.5">
                    ₹{c.avgSalary?.min}–{c.avgSalary?.max}L · {c.demand || "High"}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4 sm:mt-7 glass-card rounded-2xl sm:rounded-3xl p-3 sm:p-6" data-testid="dashboard-roadmap-card">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-heading font-bold text-sm sm:text-xl text-ink">Your Personalized Roadmap</h2>
          <Link to="/roadmap" className="text-[11px] sm:text-sm font-semibold text-brand whitespace-nowrap">
            View roadmap →
          </Link>
        </div>
        <div className="mt-3 sm:mt-5 grid grid-cols-4 gap-1 sm:gap-3 relative">
          {/* Connector line */}
          <div className="absolute top-[18px] sm:top-[22px] left-[12.5%] right-[12.5%] h-0.5 bg-brand-100 z-0" />
          {ROADMAP_STEPS.map((step) => {
            const isCompleted = step.n === 1 && hasRealData;
            return (
              <div key={step.n} className="flex flex-col items-center text-center relative z-10">
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center ${
                    isCompleted ? "bg-brand text-white" : "bg-white border-2 border-brand-100 text-muted2"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={18} /> : <step.icon size={16} className="sm:w-[18px] sm:h-[18px]" />}
                </div>
                <p className="text-[10px] sm:text-xs font-bold mt-1.5" style={{ color: step.color }}>
                  Step {step.n}
                </p>
                <p className="font-heading font-bold text-[11px] sm:text-sm text-ink leading-tight">{step.label}</p>
                <p className="text-[9px] sm:text-[11px] text-muted2 mt-0.5 leading-tight hidden sm:block">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 sm:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        {[
          { to: "/career-test", icon: FileText, label: "AI Career Test", id: "qa-career-test" },
          { to: "/mock-interview", icon: Mic, label: "Mock Interview", id: "qa-mock-interview" },
          { to: "/colleges", icon: Building2, label: "Colleges", id: "qa-colleges" },
          { to: "/scholarships", icon: GraduationCap, label: "Scholarships", id: "qa-scholarships" },
        ].map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="surface-gradient rounded-xl sm:rounded-2xl border border-line p-3 sm:p-4 flex flex-col items-center justify-center text-center hover:bg-brand-50 transition"
            data-testid={a.id}
          >
            <a.icon size={20} className="text-brand mb-1.5 sm:mb-2" />
            <span className="text-[11px] sm:text-sm font-semibold text-ink">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
