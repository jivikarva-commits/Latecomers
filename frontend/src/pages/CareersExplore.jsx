import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Briefcase, Search, X } from "lucide-react";
import PublicShell from "../components/PublicShell";
import { api } from "../lib/api";
import SEO from "../components/SEO";
import { breadcrumbSchema, itemListSchema } from "../lib/seoSchemas";
import { CAREER_CATEGORIES } from "../data/careerCategories";
import { CAREER_GUIDES } from "../data/careerGuides";
import { openCareerReportByTitle } from "../lib/careerNavigation";

export default function CareersExplore() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const fieldKey = searchParams.get("field");
  const initialSearch = searchParams.get("search") || "";

  const [careers, setCareers] = useState([]);
  const [query, setQuery] = useState(initialSearch);

  useEffect(() => {
    api.get("/careers?limit=240").then(({ data }) => setCareers(data)).catch(() => setCareers([]));
  }, []);

  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const activeCategory = useMemo(
    () => CAREER_CATEGORIES.find((c) => c.key === fieldKey) || null,
    [fieldKey]
  );

  const catalogRoles = useMemo(() => {
    const seen = new Set();
    const out = [];
    CAREER_CATEGORIES.forEach((cat) => {
      cat.subsections.forEach((sub) => {
        sub.roles.forEach((role) => {
          const key = role.toLowerCase();
          if (seen.has(key)) return;
          seen.add(key);
          out.push({
            title: role,
            role,
            group: sub.title,
            category: cat.label,
            description: `${sub.title} career path under ${cat.label}.`,
          });
        });
      });
    });
    return out;
  }, []);

  const categoryRoles = useMemo(() => {
    if (!activeCategory) return [];
    return catalogRoles.filter((item) => item.category === activeCategory.label);
  }, [activeCategory, catalogRoles]);

  const mergedCareers = useMemo(() => {
    const byTitle = new Map();
    catalogRoles.forEach((item) => byTitle.set(item.title.toLowerCase(), item));
    careers.forEach((career) => {
      const title = String(career.title || "").trim();
      if (!title) return;
      const existing = byTitle.get(title.toLowerCase()) || {};
      byTitle.set(title.toLowerCase(), {
        ...existing,
        ...career,
        title,
        role: title,
        group: existing.group || career.category || career.field || "Career",
        category: existing.category || career.category || career.field || "Career",
        description: career.description || existing.description || "Explore salary, skills, demand, and roadmap.",
      });
    });
    return Array.from(byTitle.values()).sort((a, b) => a.title.localeCompare(b.title));
  }, [catalogRoles, careers]);

  const filteredCategoryRoles = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categoryRoles;
    return categoryRoles.filter((r) =>
      [r.role, r.group, r.category].join(" ").toLowerCase().includes(q)
    );
  }, [categoryRoles, query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mergedCareers;
    return mergedCareers.filter((career) =>
      [career.title, career.category, career.group, ...(career.tags || [])].join(" ").toLowerCase().includes(q)
    );
  }, [mergedCareers, query]);

  const clearField = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("field");
    setSearchParams(next, { replace: true });
  };

  const openReport = (title) => {
    openCareerReportByTitle(title, navigate);
  };

  const renderRoleCard = (career) => (
    <button
      key={career.slug || career.title}
      type="button"
      onClick={() => openReport(career.title || career.role)}
      className="surface-gradient border border-line rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:shadow-soft transition text-left"
    >
      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-brand-50 text-brand flex items-center justify-center">
        <Briefcase size={16} />
      </div>
      <h2 className="font-heading font-bold text-xs sm:text-sm text-ink mt-2 sm:mt-3 leading-tight">{career.title || career.role}</h2>
      <p className="text-[10px] sm:text-xs text-muted2 mt-1 line-clamp-2">
        {career.description || career.group || "Explore salary, skills, demand, and roadmap."}
      </p>
      <div className="mt-2 sm:mt-3 flex items-center justify-between text-[11px] sm:text-xs">
        <span className="font-semibold text-ink">Rs {career.avgSalary?.min || 3}-{career.avgSalary?.max || 12}L</span>
        <span className="inline-flex items-center gap-1 text-brand font-semibold">View <ArrowRight size={12} /></span>
      </div>
    </button>
  );

  return (
    <PublicShell>
      <SEO
        title="Explore Career Options in India"
        description="Explore practical career options for graduates, BPO workers, students, and career switchers including full stack, MERN, UI/UX, digital marketing, analytics, AI/ML, and more."
        path="/careers-explore"
        jsonLd={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Career Options", path: "/careers-explore" },
          ]),
          itemListSchema(
            "Career options and course roadmaps in India",
            "Practical career and course options for students, graduates, BPO workers, and career switchers.",
            (activeCategory ? filteredCategoryRoles : filtered)
              .slice(0, 24)
              .map((career) => ({ name: career.title || career.role, path: `/careers-explore?search=${encodeURIComponent(career.title || career.role)}` }))
          ),
        ]}
      />
      <main className="w-full px-4 sm:px-6 lg:px-10 py-8 sm:py-16">
        <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand uppercase">Career Options</p>
        <div className="mt-2 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink leading-tight">
              {activeCategory ? `${activeCategory.label} careers.` : "Explore practical career paths."}
            </h1>
            <p className="text-muted2 mt-2 max-w-2xl text-sm sm:text-base">
              {activeCategory
                ? `Browse roles under ${activeCategory.label} - tap any role to generate a detailed report.`
                : "Browse careers across technology, operations, business, healthcare, trades, creative work, and more."}
            </p>
          </div>
          <div className="relative w-full lg:w-[320px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted2" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={activeCategory ? `Search ${activeCategory.label} roles` : "Search careers"}
              className="w-full bg-white border border-line rounded-full pl-10 pr-4 py-2.5 text-sm"
            />
          </div>
        </div>

        {activeCategory && (
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand/30 text-brand text-[11px] sm:text-xs font-bold px-3 py-1.5">
              {activeCategory.label}
              <button type="button" onClick={clearField} aria-label="Clear category filter" className="hover:text-pink-500">
                <X size={13} />
              </button>
            </span>
            <span className="text-[11px] sm:text-xs text-muted2">{filteredCategoryRoles.length} roles</span>
          </div>
        )}

        {activeCategory ? (
          <div className="mt-5 sm:mt-8 space-y-6 sm:space-y-8">
            {activeCategory.subsections.map((sub) => {
              const q = query.trim().toLowerCase();
              const subRoles = q ? sub.roles.filter((r) => r.toLowerCase().includes(q)) : sub.roles;
              if (subRoles.length === 0) return null;
              return (
                <div key={sub.title}>
                  <h3 className="font-heading font-black text-sm sm:text-base text-ink mb-3">{sub.title}</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4">
                    {subRoles.map((role) => renderRoleCard({ title: role, role, group: sub.title, category: activeCategory.label }))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-5 sm:mt-8 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4">
            {filtered.map(renderRoleCard)}
          </div>
        )}

        {/* In-depth career guides — internal links to prerendered SEO pages */}
        <section className="mt-10 sm:mt-14 border-t border-line pt-8">
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand uppercase">In-depth guides</p>
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-ink mt-1.5">Career guides for India — salary, roadmap & skills</h2>
          <p className="text-muted2 mt-2 max-w-2xl text-sm sm:text-base">
            Detailed, no-degree-needed guides for India's most in-demand careers. Each covers salary, a month-by-month roadmap, top skills, free courses, and job roles.
          </p>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {CAREER_GUIDES.map((g) => (
              <Link
                key={g.slug}
                to={`/career-guide/${g.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-line bg-white p-3 hover:border-brand/40 hover:shadow-soft transition"
              >
                <span className="text-xl shrink-0">{g.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-heading font-bold text-[13px] sm:text-sm text-ink leading-tight truncate">{g.title}</span>
                  <span className="block text-[11px] text-muted2">₹{g.salaryMin}-{g.salaryMax} LPA · {g.timeline}</span>
                </span>
                <ArrowRight size={14} className="text-muted2 group-hover:text-brand shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
