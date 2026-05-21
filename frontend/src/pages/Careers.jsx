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
      className={`surface-gradient rounded-3xl border p-4 sm:p-5 flex items-center justify-between hover:shadow-soft transition cursor-pointer ${
        isAiMatch ? "border-brand-200" : "border-line"
      }`}
      data-testid={`career-row-${c.slug}`}
    >
      <div className="flex items-center gap-4 flex-1">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: (c.iconColor || "#5B4FE9") + "25", color: c.iconColor || "#5B4FE9" }}
        >
          <Ic size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-heading font-bold text-base text-ink truncate">{c.title}</h3>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isAiMatch
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-brand-50 text-brand"
              }`}
            >
              {isAiMatch ? "✨ " : ""}{match}% Match
            </span>
          </div>
          <div className="flex gap-1.5 mt-1 flex-wrap">
            {(c.tags || []).slice(0, 3).map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-full bg-brand-50 text-brand text-[11px] font-semibold">
                {t}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted2 mt-1">
            Avg ₹{c.avgSalary?.min}–{c.avgSalary?.max} LPA · Growth {c.jobGrowth5Y}% ·{" "}
            <span className="text-emerald-600 font-semibold">{c.demand}</span>
          </p>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSave(c);
        }}
        className={`p-2 rounded-full shrink-0 ${saved ? "text-brand" : "text-muted2"}`}
        data-testid={`save-career-${c.slug}`}
      >
        <Bookmark size={20} fill={saved ? "#5B4FE9" : "none"} />
      </button>
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
      .get(`/careers?limit=60${q ? `&q=${encodeURIComponent(q)}` : ""}`)
      .then(({ data }) => setAllCareers(data))
      .finally(() => setLoading(false));
  }, [q]);

  const savedSet = new Set(user?.saved_items?.careers || []);

  // Memoize user match data to keep references stable
  const userMatches = useMemo(() => user?.top_career_matches || [], [user?.top_career_matches]);
  const matchMap = useMemo(() => new Map(userMatches.map((m) => [m.careerSlug, m])), [userMatches]);
  const hasAiMatches = userMatches.length > 0;

  // Sort careers: AI-matched first (in match order), then the rest
  const sortedCareers = useMemo(() => {
    if (!hasAiMatches || allCareers.length === 0) return allCareers;

    // Build ordered list: AI matches in score order first
    const aiSlugs = userMatches.map((m) => m.careerSlug);
    const aiCareers = aiSlugs
      .map((slug) => allCareers.find((c) => c.slug === slug))
      .filter(Boolean);

    // Remaining careers not in AI matches
    const aiSlugSet = new Set(aiSlugs);
    const otherCareers = allCareers.filter((c) => !aiSlugSet.has(c.slug));

    return [...aiCareers, ...otherCareers];
  }, [allCareers, userMatches, hasAiMatches]);

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
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto" data-testid="careers-page">
      <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink">
        Top Career Recommendations
      </h1>
      <p className="text-muted2 mt-1 text-sm">
        {hasAiMatches
          ? "Personalized by AI based on your quiz answers"
          : "Explore popular careers across all fields"}
      </p>

      {/* Top / AI-matched section */}
      <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand text-xs font-bold">
        {hasAiMatches ? (
          <><Sparkles size={12} /> Your AI-Matched Careers</>
        ) : (
          <>⭐ Top Recommendations</>
        )}
      </div>

      <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading &&
          [1, 2, 3].map((i) => (
            <div key={i} className="surface-gradient rounded-3xl border border-line p-5">
              <div className="w-12 h-12 rounded-2xl skeleton-shimmer" />
              <div className="h-5 w-2/3 rounded mt-3 skeleton-shimmer" />
              <div className="h-4 w-full rounded mt-2 skeleton-shimmer" />
              <div className="h-16 w-full rounded mt-3 skeleton-shimmer" />
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
              className={`surface-gradient rounded-3xl border p-5 hover:shadow-soft transition ${
                hasAiMatches ? "border-brand-200" : "border-line"
              }`}
              data-testid={`top-career-${c.slug}`}
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: (c.iconColor || "#5B4FE9") + "25", color: c.iconColor || "#5B4FE9" }}
                >
                  <Ic size={22} />
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">
                  {hasAiMatches ? "✨ " : ""}{match}% Match
                </span>
              </div>

              <h3 className="font-heading font-bold text-lg text-ink mt-3">{c.title}</h3>

              {/* AI match tags OR career tags */}
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {(aiMatch?.tags?.length ? aiMatch.tags : c.tags || []).slice(0, 3).map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-brand-50 text-brand text-[11px] font-semibold">
                    {t}
                  </span>
                ))}
              </div>

              {/* AI reason or description */}
              {aiMatch?.reasons?.[0] ? (
                <p className="text-xs text-emerald-700 mt-2 line-clamp-1 font-medium">
                  ✓ {aiMatch.reasons[0]}
                </p>
              ) : (
                <p className="text-xs text-muted2 mt-2 line-clamp-2">{c.description}</p>
              )}

              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="bg-brand-50 rounded-xl p-2">
                  <p className="text-muted2">Avg Salary</p>
                  <p className="font-bold text-ink">₹{c.avgSalary?.min} – {c.avgSalary?.max} LPA</p>
                </div>
                <div className="bg-brand-50 rounded-xl p-2">
                  <p className="text-muted2">Growth (5Y)</p>
                  <p className="font-bold text-ink">
                    {c.jobGrowth5Y}%{" "}
                    <span className="text-emerald-600">{c.demand}</span>
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Rest of careers */}
      <h2 className="font-heading font-bold text-lg text-ink mt-8 mb-3">
        {hasAiMatches ? "Explore More Careers" : "All Careers"}
      </h2>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search careers, skills or roles..."
            data-testid="careers-search-input"
            className="w-full bg-white border border-line rounded-full pl-10 pr-4 py-2.5 text-sm placeholder:text-muted2"
          />
        </div>
        <button
          className="p-2.5 rounded-full bg-white border border-line text-brand"
          data-testid="careers-filter-button"
        >
          <Filter size={16} />
        </button>
      </div>

      <div className="space-y-3">
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
          <div className="bg-white border border-line rounded-3xl p-5 text-center">
            <p className="font-semibold text-ink">No careers found for this search.</p>
            <p className="text-sm text-muted2 mt-1">Try a broader keyword.</p>
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
