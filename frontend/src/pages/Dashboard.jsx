import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Download, FileText, Mic, Building2, GraduationCap, Sparkles, CheckCircle2, RotateCcw } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import * as Icons from "lucide-react";
import NotificationBell from "../components/NotificationBell";

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const REQUIREMENT_SECTIONS = [
  {
    title: "Core Skills Required",
    points: ["Technical and domain fundamentals", "Practical communication and problem solving"],
  },
  {
    title: "Portfolio Requirements",
    points: ["2-4 projects with measurable outcomes", "Resume-ready proof of your capabilities"],
  },
  {
    title: "Job Readiness Checklist",
    points: ["Interview preparation and role-specific practice", "Certifications employers value"],
  },
  {
    title: "How to Apply & Get Hired",
    points: ["Target companies and role strategy", "Applications, referrals, and follow-up plan"],
  },
];

export default function Dashboard() {
  const { user, refresh } = useAuth();
  const navigate = useNavigate();
  const [careersMap, setCareersMap] = useState({});
  const [allCareers, setAllCareers] = useState([]);
  const [loadingCareers, setLoadingCareers] = useState(true);

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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto" data-testid="dashboard-page">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink">
            {getTimeGreeting()}, {user?.name?.split(" ")[0] || "there"}! <span className="inline-block">👋</span>
          </h1>
          <p className="text-muted2 mt-1 text-sm sm:text-base">
            {hasRealData ? "Your AI-powered career requirement snapshot is ready." : "Let's map your career requirements clearly."}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden md:block">
            <NotificationBell />
          </div>
          <button
            onClick={() => navigate("/roadmap")}
            className="inline-flex items-center gap-2 bg-white border border-line rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-ink hover:bg-brand-50"
            data-testid="dashboard-resume-roadmap"
          >
            <Download size={14} /> <span className="hidden xs:inline">Career</span> Requirements
          </button>
        </div>
      </div>

      <div className="mt-5 sm:mt-6 glass-card rounded-3xl p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5 items-center" data-testid="career-match-card">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-muted2 uppercase tracking-wider">Career Match Score</p>
          {hasRealData ? (
            <>
              <div className="flex items-end gap-3">
                <p className="font-heading font-extrabold text-5xl text-brand leading-none">
                  {overall}
                  <span className="text-3xl">%</span>
                </p>
                {scoreBadge && (
                  <span className={`mb-1 px-3 py-1 rounded-full text-xs font-semibold ${scoreBadge.cls}`}>
                    {scoreBadge.label}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {[
                  { k: "Skills", v: cmScore?.skills },
                  { k: "Interests", v: cmScore?.interests },
                  { k: "Goals", v: cmScore?.goals },
                  { k: "Values", v: cmScore?.values },
                  { k: "Personality", v: cmScore?.personality },
                ]
                  .filter(({ v }) => v != null)
                  .map(({ k, v }) => (
                    <span key={k} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-50 text-brand text-[11px] font-semibold">
                      {k} {v}%
                    </span>
                  ))}
              </div>
              {(careerAnalysis?.summary || user?.profile?.summary) && (
                <p className="text-xs text-muted2 mt-1 line-clamp-2 leading-relaxed">
                  {careerAnalysis?.summary || user.profile.summary}
                </p>
              )}
              <Link to="/careers" className="inline-flex items-center gap-1 text-xs font-semibold text-brand mt-1 w-fit" data-testid="view-full-analysis-link">
                View full analysis →
              </Link>
              <button
                onClick={retakeQuiz}
                className="inline-flex items-center gap-1 text-xs font-semibold text-muted2 hover:text-brand w-fit"
                data-testid="retake-quiz-button"
              >
                <RotateCcw size={13} /> Retake Quiz
              </button>
            </>
          ) : (
            <>
              <p className="font-heading font-extrabold text-5xl text-brand/30 leading-none">
                —<span className="text-3xl">%</span>
              </p>
              <p className="text-sm text-muted2 mt-1">Complete the career quiz to see your personalized match score.</p>
              <button
                onClick={() => navigate("/onboarding")}
                className="mt-2 inline-flex items-center gap-2 bg-brand text-white font-semibold px-4 py-2.5 rounded-full text-sm shadow-brand w-fit"
              >
                <Sparkles size={14} /> Take Career Quiz
              </button>
            </>
          )}
        </div>

        <div className="h-52 sm:h-56 w-full">
          <ResponsiveContainer>
            <RadarChart key={`${overall ?? "na"}-${user?.updated_at || "fresh"}`} data={radar} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid stroke="#E8E4FF" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "#64748B", fontSize: 11, fontWeight: 600 }} />
              <Radar name="You" dataKey="value" stroke="#5B4FE9" fill="#5B4FE9" fillOpacity={hasRealData ? 0.35 : 0.08} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-heading font-bold text-lg sm:text-xl text-ink">
          {hasRealData ? "Your AI-Matched Careers" : "Popular Career Paths"}
        </h2>
        <Link to="/careers" className="text-sm font-semibold text-brand" data-testid="dashboard-view-all-careers">
          View all →
        </Link>
      </div>

      {loadingCareers ? (
        <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="surface-gradient rounded-3xl border border-line p-5">
              <div className="w-12 h-12 rounded-2xl skeleton-shimmer" />
              <div className="h-5 w-2/3 rounded mt-3 skeleton-shimmer" />
              <div className="h-4 w-full rounded mt-2 skeleton-shimmer" />
              <div className="h-16 w-full rounded mt-3 skeleton-shimmer" />
            </div>
          ))}
        </div>
      ) : (
        <div className={careerAnalysis ? "mt-3 flex gap-4 overflow-x-auto pb-2 snap-x" : "mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-4"}>
          {displayCareers.map((c) => {
            const Ic = Icons[c.icon] || Icons.Briefcase;
            return (
              <Link
                to={`/careers/${c.slug}`}
                key={c.career_id || c.slug}
                className={careerAnalysis ? "surface-gradient rounded-3xl p-5 border border-line elevated-card hover:shadow-md transition min-w-[280px] sm:min-w-[340px] snap-start" : "surface-gradient rounded-3xl p-5 border border-line elevated-card hover:shadow-md transition"}
                data-testid={`dashboard-career-card-${c.slug}`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{ background: (c.iconColor || "#5B4FE9") + "25", color: c.iconColor || "#5B4FE9" }}
                  >
                    <Ic size={20} />
                  </div>
                </div>
                <div className="mt-3 flex items-start justify-between gap-2">
                  <p className="font-heading font-bold text-base text-ink leading-tight">{c.title}</p>
                  <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                    {c.matchPercent}%
                  </span>
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {(c.matchTags?.length ? c.matchTags : c.tags || []).slice(0, 3).map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-brand-50 text-brand text-[11px] font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
                {c.matchReasons?.length > 0 && <p className="text-[11px] text-emerald-700 mt-2 line-clamp-1 font-medium">✓ {c.matchReasons[0]}</p>}
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div className="bg-brand-50 rounded-xl p-2">
                    <p className="text-muted2">Avg Salary</p>
                    <p className="font-bold text-ink">
                      ₹{c.avgSalary?.min}–{c.avgSalary?.max} LPA
                    </p>
                  </div>
                  <div className="bg-brand-50 rounded-xl p-2">
                    <p className="text-muted2">Growth (5Y)</p>
                    <p className="font-bold text-ink">
                      {c.jobGrowth5Y}% <span className="text-emerald-600">{c.demand}</span>
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {careerAnalysis && additionalCareers.length > 0 && (
        <div className="mt-6" data-testid="dashboard-additional-careers">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-ink">More Career Matches</h2>
          <div className="mt-3 space-y-3">
            {additionalCareers.map((c) => (
              <Link
                to={`/careers/${c.slug}`}
                key={c.slug}
                className="bg-white border border-line rounded-2xl p-4 flex items-center justify-between gap-4 hover:bg-brand-50 transition"
                data-testid={`dashboard-additional-career-${c.slug}`}
              >
                <div className="min-w-0">
                  <p className="font-heading font-bold text-sm sm:text-base text-ink truncate">{c.title}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {(c.matchTags || c.tags || []).slice(0, 3).map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-full bg-brand-50 text-brand text-[11px] font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted2 mt-1">
                    ₹{c.avgSalary?.min}–{c.avgSalary?.max} LPA · {c.demand || "High"} demand
                  </p>
                </div>
                <span className="shrink-0 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                  {c.matchPercent}%
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-7 glass-card rounded-3xl p-5 sm:p-7" data-testid="dashboard-roadmap-card">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-ink">Career Requirements Snapshot</h2>
          <Link to="/roadmap" className="text-sm font-semibold text-brand">
            View details →
          </Link>
        </div>
        <div className="mt-4 grid md:grid-cols-2 gap-3">
          {REQUIREMENT_SECTIONS.map((section) => (
            <div key={section.title} className="bg-white border border-line rounded-2xl p-4">
              <p className="text-sm font-bold text-ink">{section.title}</p>
              {section.points.map((point) => (
                <p key={point} className="text-xs text-muted2 mt-1 inline-flex items-start gap-1.5">
                  <CheckCircle2 size={12} className="text-brand mt-0.5 shrink-0" />
                  {point}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { to: "/career-test", icon: FileText, label: "AI Career Test", id: "qa-career-test" },
          { to: "/mock-interview", icon: Mic, label: "Mock Interview", id: "qa-mock-interview" },
          { to: "/colleges", icon: Building2, label: "Colleges", id: "qa-colleges" },
          { to: "/scholarships", icon: GraduationCap, label: "Scholarships", id: "qa-scholarships" },
        ].map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="surface-gradient rounded-2xl border border-line p-4 flex flex-col items-center justify-center text-center hover:bg-brand-50 transition"
            data-testid={a.id}
          >
            <a.icon size={22} className="text-brand mb-2" />
            <span className="text-xs sm:text-sm font-semibold text-ink">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
