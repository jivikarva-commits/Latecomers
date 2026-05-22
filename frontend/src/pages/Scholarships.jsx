import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft, Search, Filter, Bookmark, Sparkles, Calendar, GraduationCap,
  Wallet, Users, Building2, ArrowRight, ShieldCheck, ChevronDown, ClipboardList,
} from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import HeroIllustration from "../components/HeroIllustration";
import BackToTopButton from "../components/BackToTopButton";

const TYPES = ["All", "Merit", "Need-Based", "Government", "Girls"];

const StatPill = ({ icon: Icon, color, value, label }) => (
  <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2">
    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: color + "20", color }}>
      <Icon size={16} />
    </div>
    <div>
      <p className="font-heading font-extrabold text-sm sm:text-base text-ink leading-none">{value}</p>
      <p className="text-[10px] sm:text-[11px] text-muted2 mt-1 leading-snug">{label}</p>
    </div>
  </div>
);

const CategoryCard = ({ icon: Icon, color, title, count }) => (
  <div className="surface-gradient rounded-2xl border border-line p-3 sm:p-4 text-center min-w-[110px] sm:min-w-0">
    <div className="w-11 h-11 rounded-full mx-auto flex items-center justify-center mb-2" style={{ background: color + "25", color }}>
      <Icon size={20} />
    </div>
    <p className="font-heading font-bold text-xs sm:text-sm text-ink">{title}</p>
    <p className="text-[10px] sm:text-[11px] text-muted2 mt-0.5">{count} Scholarships</p>
  </div>
);

export default function Scholarships() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [matches, setMatches] = useState({});
  const [matching, setMatching] = useState(false);
  const { user, refresh } = useAuth();

  useEffect(() => {
    setLoading(true);
    api
      .get(`/scholarships?q=${encodeURIComponent(q)}&type=${type}`)
      .then(({ data }) => setList(data))
      .finally(() => setLoading(false));
  }, [q, type]);

  const saved = new Set(user?.saved_items?.scholarships || []);
  const toggle = async (s) => {
    const isSaved = saved.has(s.scholarship_id);
    await api.post(isSaved ? "/me/unsave" : "/me/save", { kind: "scholarships", item_id: s.scholarship_id });
    refresh();
    toast.success(isSaved ? "Removed" : "Saved!");
  };

  const aiMatch = async () => {
    setMatching(true);
    try {
      const { data } = await api.post("/ai/scholarships/match");
      const m = {};
      (data.matches || []).forEach((x) => { m[x.scholarship_id] = x; });
      setMatches(m);
      toast.success("AI matched your scholarships!");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "AI match failed");
    } finally {
      setMatching(false);
    }
  };

  const top = list.slice(0, 3);

  const detailLink = (s) => `https://www.google.com/search?q=${encodeURIComponent(`${s.name} official scholarship`)}`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto" data-testid="scholarships-page">
      {/* Top bar */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-ink"><ArrowLeft size={20} /></button>
        <div className="flex-1">
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-ink">Scholarships</h1>
          <p className="text-xs sm:text-sm text-muted2">Find and apply for scholarships that match your goals</p>
        </div>
        <button className="p-2 rounded-full bg-white border border-line text-brand"><Bookmark size={16} /></button>
      </div>

      {/* Hero banner */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 flex items-center gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
          <h2 className="font-heading font-bold text-base sm:text-xl text-ink">Unlock Opportunities, Fund Your Future</h2>
          <p className="text-xs sm:text-sm text-muted2 mt-1.5 leading-relaxed">
            Explore scholarships, check eligibility and get financial support for your education.
          </p>
        </div>
        <HeroIllustration Icon={GraduationCap} size={96} className="hidden sm:block" />
        <HeroIllustration Icon={GraduationCap} size={64} className="sm:hidden shrink-0" />
      </div>

      {/* Search + filter */}
      <div className="mt-5 flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search scholarships by name, course or keyword..."
            data-testid="scholarships-search"
            className="w-full bg-white border border-line rounded-full pl-10 pr-4 py-3 text-sm"
          />
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-full bg-white border border-line text-xs sm:text-sm font-semibold text-brand">
          <Filter size={14} /> <span className="hidden sm:inline">Filter</span>
        </button>
      </div>

      {/* Type chips */}
      <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            data-testid={`stype-${t.toLowerCase()}`}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap border ${
              type === t ? "bg-brand text-white border-brand shadow-brand" : "bg-white border-line text-ink"
            }`}
          >
            {t}
          </button>
        ))}
        <button className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap border bg-white border-line text-ink inline-flex items-center gap-1">
          More <ChevronDown size={14} />
        </button>
      </div>

      {/* Stats card */}
      <div className="mt-4 glass-card rounded-3xl p-2 grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-line">
        <StatPill icon={Sparkles} color="#5B4FE9" value="320+" label="Active Scholarships" />
        <StatPill icon={Wallet} color="#22C55E" value="₹50 Cr+" label="Total Scholarships" />
        <StatPill icon={Users} color="#F59E0B" value="25K+" label="Students Benefited" />
        <StatPill icon={Building2} color="#3B82F6" value="100+" label="Partners" />
      </div>

      {/* Top Scholarships */}
      <div className="mt-6 flex items-center justify-between">
        <h3 className="font-heading font-bold text-base sm:text-lg text-ink">Top Scholarships for You</h3>
        <button onClick={aiMatch} disabled={matching} className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand">
          {matching ? "Matching…" : "View all →"}
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {loading &&
          [1, 2, 3].map((i) => (
            <div key={i} className="surface-gradient rounded-3xl border border-line p-4 sm:p-5">
              <div className="h-5 w-1/2 skeleton-shimmer rounded" />
              <div className="h-4 w-full skeleton-shimmer rounded mt-2" />
              <div className="h-16 w-full skeleton-shimmer rounded mt-3" />
            </div>
          ))}

        {!loading && top.map((s) => {
          const match = matches[s.scholarship_id];
          return (
            <div key={s.scholarship_id} className="surface-gradient rounded-3xl border border-line p-4 sm:p-5" data-testid={`scholarship-card-${s.scholarship_id}`}>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-50 text-brand flex items-center justify-center shrink-0">
                  <GraduationCap size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-heading font-bold text-sm sm:text-base text-ink leading-tight">{s.name}</h4>
                      <p className="text-xs text-muted2 mt-1 line-clamp-2">{s.description}</p>
                    </div>
                    <button onClick={() => toggle(s)} className={`shrink-0 ${saved.has(s.scholarship_id) ? "text-brand" : "text-muted2"}`} data-testid={`save-scholarship-${s.scholarship_id}`}>
                      <Bookmark size={18} fill={saved.has(s.scholarship_id) ? "#5B4FE9" : "none"} />
                    </button>
                  </div>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-brand-50 text-brand text-[10px] sm:text-[11px] font-bold">{s.type}</span>
                  {match && (
                    <div className="mt-2 bg-emerald-50 rounded-xl p-2 text-xs">
                      <span className="font-bold text-emerald-700">{match.fit_percent}% fit</span> <span className="text-emerald-700">· {match.why}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 text-ink"><Wallet size={12} className="text-brand" /> Up to {s.amount}</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 text-ink"><GraduationCap size={12} className="text-brand" /> {(s.category || []).slice(0, 1).join("") || "All Programs"}</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 text-ink"><Calendar size={12} className="text-brand" /> Apply by {s.deadline}</span>
                <a
                  href={detailLink(s)}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto inline-flex items-center gap-1 bg-brand hover:bg-brand-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
                  data-testid={`view-scholarship-${s.scholarship_id}`}
                >
                  View Details
                </a>
              </div>
            </div>
          );
        })}

        {!loading && top.length === 0 && (
          <div className="bg-white border border-line rounded-3xl p-6 text-center">
            <p className="font-semibold text-ink">No scholarships found for this filter.</p>
            <p className="text-sm text-muted2 mt-1">Try removing filters or searching with broader keywords.</p>
          </div>
        )}
      </div>

      {/* Find My Matches CTA */}
      <div className="mt-5 glass-card rounded-3xl p-4 sm:p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl cc-logo-gradient text-white flex items-center justify-center shrink-0">
          <ClipboardList size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-sm sm:text-base text-ink">Find scholarships that match your profile</p>
          <p className="text-xs text-muted2 mt-0.5">Answer a few questions and get personalized scholarship recommendations.</p>
        </div>
        <button
          onClick={aiMatch}
          disabled={matching}
          className="hidden sm:inline-flex items-center gap-1.5 bg-brand hover:bg-brand-600 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full disabled:opacity-60"
          data-testid="ai-match-scholarships"
        >
          {matching ? "Matching…" : "Find My Matches"} <ArrowRight size={14} />
        </button>
      </div>
      <button
        onClick={aiMatch}
        disabled={matching}
        className="sm:hidden mt-3 w-full inline-flex items-center justify-center gap-1.5 bg-brand text-white text-sm font-semibold px-4 py-3 rounded-full disabled:opacity-60"
        data-testid="ai-match-scholarships-mobile"
      >
        {matching ? "Matching…" : "Find My Matches"} <ArrowRight size={14} />
      </button>

      {/* Popular Categories */}
      <div className="mt-6 flex items-center justify-between">
        <h3 className="font-heading font-bold text-base sm:text-lg text-ink">Popular Categories</h3>
        <button className="text-xs sm:text-sm font-semibold text-brand">View all →</button>
      </div>
      <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-1 sm:grid sm:grid-cols-5">
        <CategoryCard icon={GraduationCap} color="#22C55E" title="Engineering" count="120+" />
        <CategoryCard icon={GraduationCap} color="#3B82F6" title="Computer Science" count="90+" />
        <CategoryCard icon={GraduationCap} color="#F97316" title="Data Science & AI" count="70+" />
        <CategoryCard icon={GraduationCap} color="#5B4FE9" title="MBA / Management" count="60+" />
        <CategoryCard icon={GraduationCap} color="#EC4899" title="Medical / Health" count="60+" />
      </div>

      <p className="text-center text-xs text-muted2 mt-6 inline-flex flex-wrap items-center gap-3 justify-center w-full">
        <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-brand" /> 100% Free</span>
        · <span>All scholarships are verified</span>
        · <span>No hidden charges</span>
      </p>
      <BackToTopButton />
    </div>
  );
}
