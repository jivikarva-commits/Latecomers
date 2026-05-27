import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { Search, Filter, Bookmark, Sparkles } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const CareerRow = ({ c, match, saved, onSave, onOpen, isAiMatch }) => {
  const Ic = Icons[c.icon] || Icons.Briefcase;
  return (
    <div
      onClick={() => onOpen(c.slug)}
      className={`surface-gradient rounded-xl sm:rounded-2xl border p-2.5 sm:p-4 flex flex-col hover:shadow-soft transition cursor-pointer ${
        isAiMatch ? "border-brand-200" : "border-line"
      }`}
      data-testid={`career-row-${c.slug}`}
    >
      <div className="flex items-start justify-between gap-1.5">
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: (c.iconColor || "#5B4FE9") + "20", color: c.iconColor || "#5B4FE9" }}
        >
          <Ic size={18} />
        </div>
        <div className="flex items-center gap-1">
          <span
            className={`inline-block px-1.5 py-px rounded-full text-[10px] font-bold ${
              isAiMatch
                ? "bg-emerald-100 text-emerald-700"
                : "bg-brand-50 text-brand"
            }`}
          >
            {match}%
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(c);
            }}
            className={`p-1 rounded-full shrink-0 ${saved ? "text-brand" : "text-muted2"}`}
            data-testid={`save-career-${c.slug}`}
          >
            <Bookmark size={14} fill={saved ? "#5B4FE9" : "none"} />
          </button>
        </div>
      </div>
      <h3 className="font-heading font-bold text-xs sm:text-sm text-ink mt-1.5 leading-tight line-clamp-2">{c.title}</h3>
      <div className="flex gap-1 mt-1.5 flex-wrap">
        {(c.tags || []).slice(0, 2).map((t) => (
          <span key={t} className="px-1.5 py-px rounded-full bg-brand-50 text-brand text-[9px] sm:text-[10px] font-semibold">
            {t}
          </span>
        ))}
      </div>
      <p className="text-[10px] sm:text-xs text-muted2 mt-auto pt-1.5">
        Avg ₹{c.avgSalary?.min}–{c.avgSalary?.max} LPA · Growth {c.jobGrowth5Y}% ·{" "}
        <span className="text-emerald-600 font-semibold">{c.demand}</span>
      </p>
    </div>
  );
};

export default function Careers() {
  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const [allCareers, setAllCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get(`/careers?limit=200${q ? `&q=${encodeURIComponent(q)}` : ""}`)
      .then(({ data }) => setAllCareers(data))
      .finally(() => setLoading(false));
  }, [q]);

  const savedSet = new Set(user?.saved_items?.careers || []);
  const careerAnalysis = user?.careerAnalysis || null;

  const userMatches = useMemo(() => {
    if (careerAnalysis?.topCareers?.length > 0) {
      return careerAnalysis.topCareers.map((m) => ({
        careerSlug: m.slug || m.careerSlug,
        matchPercent: m.matchPercent,
        tags: m.tags || [],
        reasons: m.whyMatch || m.reasons || [],
        avgSalaryMin: m.avgSalaryMin,
        avgSalaryMax: m.avgSalaryMax,
        jobGrowth: m.jobGrowth,
      }));
    }
    return user?.top_career_matches || [];
  }, [careerAnalysis, user?.top_career_matches]);

  const matchMap = useMemo(() => new Map(userMatches.map((m) => [m.careerSlug, m])), [userMatches]);
  const hasAiMatches = userMatches.length > 0;

  // Sort careers: AI-matched first (in match order), then the rest
  const sortedCareers = useMemo(() => {
    if (!hasAiMatches || allCareers.length === 0) return allCareers;

    // Build ordered list: AI matches in score order first
    const aiSlugs = userMatches.map((m) => m.careerSlug).filter(Boolean);
    const aiCareers = aiSlugs
      .map((slug) => {
        const career = allCareers.find((c) => c.slug === slug);
        const match = matchMap.get(slug);
        return {
          ...(career || {}),
          ...(match || {}),
          slug,
          career_id: career?.career_id || `match-${slug}`,
          title: career?.title || match?.title || slug.replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase()),
          description: career?.description || match?.description || `Explore ${match?.title || slug.replace(/-/g, " ")} as a matched career path.`,
          tags: match?.tags?.length ? match.tags : career?.tags || [],
          avgSalary: match?.avgSalaryMin ? { min: match.avgSalaryMin, max: match.avgSalaryMax } : career?.avgSalary,
          jobGrowth5Y: match?.jobGrowth ?? career?.jobGrowth5Y,
          demand: match?.demand || career?.demand || "High",
        };
      })
      .filter(Boolean);

    // Remaining careers not in AI matches
    const aiSlugSet = new Set(aiSlugs);
    const otherCareers = allCareers.filter((c) => !aiSlugSet.has(c.slug));

    return [...aiCareers, ...otherCareers];
  }, [allCareers, userMatches, matchMap, hasAiMatches]);

  const getMatch = (slug, idx) => {
    const m = matchMap.get(slug);
    if (m) return m.matchPercent;
    // Fallback for non-AI-matched careers
    return [78, 75, 72, 70, 68, 65, 63, 60, 58, 55][idx] ?? 60;
  };

  const onSave = async (c) => {
    const isSaved = savedSet.has(c.career_id);
    await api.post(isSaved ? "/me/unsave" : "/me/save", {
      kind: "careers",
      item_id: c.career_id,
    });
    refresh();
  };

  const onOpenCareer = (slug) => navigate(`/careers/${slug}`);

  const onGenerateCareer = async () => {
    const title = q.trim();
    if (!title) return;
    setGenerating(true);
    try {
      const { data } = await api.post("/careers/generate", { title });
      navigate(`/careers/${data.slug}`);
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Unable to generate this career right now.");
    } finally {
      setGenerating(false);
    }
  };

  const topCareers = sortedCareers.slice(0, hasAiMatches ? userMatches.length : 3);
  const restCareers = sortedCareers.slice(topCareers.length);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto overflow-x-hidden w-full min-w-0" data-testid="careers-page">
      <h1 className="font-heading font-extrabold text-xl sm:text-3xl text-ink">
        Top Career Recommendations
      </h1>
      <p className="text-muted2 mt-0.5 sm:mt-1 text-xs sm:text-sm">
        {hasAiMatches
          ? "Personalized by AI based on your quiz answers"
          : "Explore popular careers across all fields"}
      </p>

      {/* Top / AI-matched section */}
      <div className="mt-4 sm:mt-5 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-50 text-brand text-[11px] sm:text-xs font-bold">
        {hasAiMatches ? (
          <><Sparkles size={11} /> Your AI-Matched Careers</>
        ) : (
          <>⭐ Top Recommendations</>
        )}
      </div>

      <div className="mt-2.5 sm:mt-3 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
        {loading &&
          [1, 2, 3].map((i) => (
            <div key={i} className="surface-gradient rounded-xl sm:rounded-2xl border border-line p-2.5 sm:p-4">
              <div className="w-9 h-9 rounded-xl skeleton-shimmer" />
              <div className="h-4 w-3/4 rounded mt-2 skeleton-shimmer" />
              <div className="h-3 w-full rounded mt-1.5 skeleton-shimmer" />
              <div className="h-8 w-full rounded mt-2 skeleton-shimmer" />
            </div>
          ))}

        {!loading && topCareers.map((c, idx) => {
          const Ic = Icons[c.icon] || Icons.Briefcase;
          const match = getMatch(c.slug, idx);
          const aiMatch = matchMap.get(c.slug);
          return (
            <Link
              key={c.career_id}
              to={`/careers/${c.slug}`}
              className={`surface-gradient rounded-xl sm:rounded-2xl border p-2.5 sm:p-4 hover:shadow-soft transition flex flex-col ${
                hasAiMatches ? "border-brand-200" : "border-line"
              }`}
              data-testid={`top-career-${c.slug}`}
            >
              <div className="flex items-start justify-between gap-1">
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: (c.iconColor || "#5B4FE9") + "20", color: c.iconColor || "#5B4FE9" }}
                >
                  <Ic size={17} />
                </div>
                <span className="inline-block px-1.5 py-px rounded-full bg-emerald-100 text-emerald-700 text-[10px] sm:text-[11px] font-bold whitespace-nowrap">
                  {hasAiMatches ? "✨ " : ""}{match}%
                </span>
              </div>

              <h3 className="font-heading font-bold text-xs sm:text-base text-ink mt-2 leading-tight line-clamp-2">{c.title}</h3>

              <div className="flex gap-1 mt-1.5 flex-wrap">
                {(aiMatch?.tags?.length ? aiMatch.tags : c.tags || []).slice(0, 2).map((t) => (
                  <span key={t} className="px-1.5 py-px rounded-full bg-brand-50 text-brand text-[9px] sm:text-[10px] font-semibold">
                    {t}
                  </span>
                ))}
              </div>

              {aiMatch?.reasons?.[0] ? (
                <p className="text-[10px] sm:text-xs text-emerald-700 mt-1.5 line-clamp-1 font-medium">
                  ✓ {aiMatch.reasons[0]}
                </p>
              ) : (
                <p className="text-[10px] sm:text-xs text-muted2 mt-1.5 line-clamp-2">{c.description}</p>
              )}

              <div className="flex items-center gap-1.5 mt-auto pt-2 text-[10px] sm:text-xs text-muted2">
                <span className="font-semibold text-ink">₹{c.avgSalary?.min}–{c.avgSalary?.max}L</span>
                <span>·</span>
                <span>{c.jobGrowth5Y}% <span className="text-emerald-600">{c.demand}</span></span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Rest of careers */}
      <h2 className="font-heading font-bold text-sm sm:text-lg text-ink mt-6 sm:mt-8 mb-2 sm:mb-3">
        {hasAiMatches ? "Explore More Careers" : "All Careers"}
      </h2>
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search careers, skills or roles..."
            data-testid="careers-search-input"
            className="w-full bg-white border border-line rounded-full pl-9 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm placeholder:text-muted2"
          />
        </div>
        <button
          className="p-2 sm:p-2.5 rounded-full bg-white border border-line text-brand"
          data-testid="careers-filter-button"
        >
          <Filter size={15} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {!loading && restCareers.map((c, idx) => (
          <CareerRow
            key={c.career_id}
            c={c}
            match={getMatch(c.slug, idx + topCareers.length)}
            saved={savedSet.has(c.career_id)}
            onSave={onSave}
            onOpen={onOpenCareer}
            isAiMatch={false}
          />
        ))}
        {!loading && allCareers.length === 0 && (
          <div className="col-span-full bg-white border border-line rounded-2xl p-4 sm:p-5 text-center">
            <p className="font-semibold text-ink text-sm">No careers found for this search.</p>
            <p className="text-xs sm:text-sm text-muted2 mt-1">Try a broader keyword.</p>
            {q.trim() && (
              <button
                onClick={onGenerateCareer}
                disabled={generating}
                className="mt-4 inline-flex items-center gap-2 bg-brand hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-brand disabled:opacity-60"
              >
                <Sparkles size={15} />
                {generating ? `Generating ${q.trim()}...` : `Generate ${q.trim()} with AI`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
