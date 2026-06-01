import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import PremiumSubscriptionModal from "../components/PremiumSubscriptionModal";
import {
  ArrowLeft, ArrowRight, Award, BarChart3, BookOpen, Briefcase,
  CheckCircle2, ChevronRight, Download, Heart, MapPin, Rocket,
  Share2, Sparkles, Star, Target, TrendingUp, User, Zap,
} from "lucide-react";

const SCORE_COLORS = ["#5B4FE9", "#22C55E", "#3B82F6", "#F97316", "#EC4899", "#8B5CF6"];
const SCORE_ICONS = [Heart, Star, User, Briefcase, Zap, Target];

function ScoreRing({ value, color, size = 48 }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E8E4FF" strokeWidth="3" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-ink">{value}%</span>
    </div>
  );
}

function OverallDonut({ value }) {
  const size = 100;
  const r = 42;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
        <circle cx={50} cy={50} r={r} fill="none" stroke="#E8E4FF" strokeWidth="5" />
        <circle cx={50} cy={50} r={r} fill="none" stroke="#5B4FE9" strokeWidth="5" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading font-extrabold text-xl text-brand leading-none">{value}%</span>
        <span className="text-[9px] text-muted2 mt-0.5">Overall</span>
      </div>
    </div>
  );
}

export default function CareerTestResults() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [data, setData] = useState(state?.result || null);
  const [accessChecked, setAccessChecked] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [showPaywall, setShowPaywall] = useState(!!state?.showSubscription);

  useEffect(() => {
    api.get("/subscriptions/quiz-access")
      .then(() => {
        setHasAccess(true);
        setShowPaywall(false);
        if (!data) api.get("/ai/career-test/latest").then(({ data: d }) => setData(d));
      })
      .catch(() => {
        setHasAccess(false);
        setShowPaywall(true);
      })
      .finally(() => setAccessChecked(true));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const scores = useMemo(() => {
    if (!data?.scores) return [];
    return Object.entries(data.scores).map(([key, value], idx) => ({
      key,
      value,
      color: SCORE_COLORS[idx % SCORE_COLORS.length],
      Icon: SCORE_ICONS[idx % SCORE_ICONS.length],
    }));
  }, [data?.scores]);

  const topMatches = data?.topMatches || [];

  if (!accessChecked) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-4">
              <div className="h-4 w-32 rounded skeleton-shimmer" />
              <div className="h-3 w-full rounded skeleton-shimmer mt-2" />
              <div className="h-10 w-full rounded skeleton-shimmer mt-3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-[70dvh] p-4 flex items-center justify-center">
        <div className="max-w-md rounded-3xl border border-line bg-white p-6 text-center">
          <Sparkles size={28} className="mx-auto text-brand" />
          <h1 className="mt-3 font-heading text-2xl font-black text-ink">Your report is ready</h1>
          <p className="mt-2 text-sm text-muted2">Choose a plan to unlock your AI career result, roadmap, institutes, and interview practice.</p>
          <button onClick={() => setShowPaywall(true)} className="mt-5 w-full rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white">
            View plans
          </button>
        </div>
        <PremiumSubscriptionModal
          open={showPaywall}
          lockClose
          title="Your quiz result is ready"
          subtitle="Unlock your result with a paid plan. Starter offer is available for a limited time."
          offerOnly
          onSuccess={async () => {
            await refresh();
            setHasAccess(true);
            setShowPaywall(false);
            if (!data) {
              const latest = await api.get("/ai/career-test/latest");
              setData(latest.data);
            }
          }}
        />
      </div>
    );
  }

  if (!data || !data.summary) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-4">
              <div className="h-4 w-32 rounded skeleton-shimmer" />
              <div className="h-3 w-full rounded skeleton-shimmer mt-2" />
              <div className="h-10 w-full rounded skeleton-shimmer mt-3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto overflow-x-hidden w-full min-w-0" data-testid="career-test-results">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <button onClick={() => navigate(-1)} className="p-1.5 -ml-1 text-ink">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-heading font-extrabold text-lg sm:text-xl text-ink">Your Career Report</h1>
          <p className="text-[10px] sm:text-xs text-muted2">AI-powered career analysis results</p>
        </div>
        <button className="p-2 rounded-full bg-white border border-line text-brand">
          <Share2 size={14} />
        </button>
        <button className="p-2 rounded-full bg-white border border-line text-brand">
          <Download size={14} />
        </button>
      </div>

      {/* Overall Score Card */}
      <div className="glass-card rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
        <OverallDonut value={data.overall || 0} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-7 h-7 rounded-lg cc-logo-gradient flex items-center justify-center text-white">
              <Sparkles size={13} />
            </div>
            <span className="font-heading font-bold text-sm text-ink">AI Analysis Complete</span>
          </div>
          <p className="text-[11px] sm:text-xs text-muted2 leading-snug line-clamp-3">{data.summary}</p>
          {data.overall >= 70 && (
            <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
              <CheckCircle2 size={10} /> Strong career alignment
            </div>
          )}
        </div>
      </div>

      {/* Score Breakdown */}
      <h3 className="font-heading font-bold text-sm sm:text-base text-ink mt-4 mb-2">Score Breakdown</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {scores.map(({ key, value, color, Icon }) => (
          <div key={key} className="glass-card rounded-xl p-2.5 sm:p-3 flex items-center gap-2">
            <ScoreRing value={value} color={color} size={40} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-xs text-muted2 capitalize truncate">{key}</p>
              <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, background: color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Career Matches */}
      <div className="flex items-center justify-between mt-5 mb-2">
        <h3 className="font-heading font-bold text-sm sm:text-base text-ink">Top Career Matches</h3>
        <span className="text-[10px] text-muted2">{topMatches.length} matches found</span>
      </div>

      <div className="space-y-2" data-testid="results-top-matches">
        {topMatches.map((m, i) => {
          const matchColor = m.matchPercent >= 80 ? "#22C55E" : m.matchPercent >= 60 ? "#3B82F6" : "#F97316";
          return (
            <Link
              to={`/careers/${m.careerSlug}`}
              key={m.careerSlug + i}
              className="glass-card rounded-xl p-2.5 sm:p-3 flex items-center gap-2.5 hover:shadow-soft transition group"
              data-testid={`match-${m.careerSlug}`}
            >
              {/* Rank badge */}
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-xs"
                style={{ background: i === 0 ? "#5B4FE9" : i === 1 ? "#3B82F6" : i === 2 ? "#22C55E" : "#64748B" }}
              >
                #{i + 1}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-xs sm:text-sm text-ink capitalize leading-tight truncate">
                  {m.careerSlug.replace(/-/g, " ")}
                </p>
                {m.reasons?.length > 0 && (
                  <p className="text-[10px] text-muted2 mt-0.5 line-clamp-1">{m.reasons[0]}</p>
                )}
                {m.tags?.length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {m.tags.slice(0, 2).map((t) => (
                      <span key={t} className="px-1.5 py-px rounded-full bg-brand-50 text-brand text-[9px] font-semibold">{t}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <div className="text-right">
                  <p className="font-heading font-bold text-sm" style={{ color: matchColor }}>{m.matchPercent}%</p>
                  <p className="text-[9px] text-muted2">match</p>
                </div>
                <ChevronRight size={14} className="text-muted2 group-hover:text-brand transition" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Insights */}
      {topMatches.length > 0 && (
        <>
          <h3 className="font-heading font-bold text-sm sm:text-base text-ink mt-5 mb-2">Quick Insights</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="glass-card rounded-xl p-2.5 sm:p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-6 h-6 rounded-md bg-brand-50 text-brand flex items-center justify-center">
                  <TrendingUp size={12} />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-ink">Best Match</span>
              </div>
              <p className="text-[11px] sm:text-xs text-muted2 capitalize leading-snug">
                {topMatches[0]?.careerSlug?.replace(/-/g, " ")} at {topMatches[0]?.matchPercent}%
              </p>
            </div>
            <div className="glass-card rounded-xl p-2.5 sm:p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <BarChart3 size={12} />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-ink">Avg Score</span>
              </div>
              <p className="text-[11px] sm:text-xs text-muted2 leading-snug">
                {scores.length > 0 ? Math.round(scores.reduce((a, s) => a + s.value, 0) / scores.length) : 0}% across {scores.length} areas
              </p>
            </div>
            <div className="glass-card rounded-xl p-2.5 sm:p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-6 h-6 rounded-md bg-orange-50 text-orange-500 flex items-center justify-center">
                  <Award size={12} />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-ink">Strongest</span>
              </div>
              <p className="text-[11px] sm:text-xs text-muted2 capitalize leading-snug">
                {scores.length > 0 ? scores.reduce((a, s) => (s.value > a.value ? s : a), scores[0]).key : "N/A"}
              </p>
            </div>
            <div className="glass-card rounded-xl p-2.5 sm:p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-6 h-6 rounded-md bg-brand-100 text-brand flex items-center justify-center">
                  <Target size={12} />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-ink">Focus Area</span>
              </div>
              <p className="text-[11px] sm:text-xs text-muted2 capitalize leading-snug">
                {scores.length > 0 ? scores.reduce((a, s) => (s.value < a.value ? s : a), scores[0]).key : "N/A"}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Next Steps CTA */}
      <div className="mt-4 sm:mt-5 bg-brand-50 border border-brand-100 rounded-2xl p-3 sm:p-4 flex items-center gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-brand-100 text-brand flex items-center justify-center shrink-0">
          <Rocket size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-xs sm:text-sm text-ink">Ready to start your journey?</p>
          <p className="text-[10px] sm:text-xs text-muted2 mt-0.5">Explore your top careers and build your roadmap.</p>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <Link
          to="/careers"
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-brand hover:bg-brand-600 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-brand"
          data-testid="results-explore-careers"
        >
          Explore Careers <ArrowRight size={13} />
        </Link>
        <Link
          to="/roadmap"
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white border border-line text-ink font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-full hover:shadow-soft"
        >
          <MapPin size={13} /> View Roadmap
        </Link>
      </div>

      {/* Retake option */}
      <p className="text-center mt-4 mb-2">
        <Link to="/career-test" className="text-[11px] text-muted2 hover:text-brand transition underline">
          Retake the career test
        </Link>
      </p>
    </div>
  );
}
