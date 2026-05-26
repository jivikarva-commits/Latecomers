import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Search } from "lucide-react";
import PublicShell from "../components/PublicShell";
import { api } from "../lib/api";
import SEO from "../components/SEO";
import { breadcrumbSchema, itemListSchema } from "../lib/seoSchemas";

export default function CareersExplore() {
  const [careers, setCareers] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.get("/careers?limit=24").then(({ data }) => setCareers(data)).catch(() => setCareers([]));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return careers;
    return careers.filter((career) => [career.title, career.category, ...(career.tags || [])].join(" ").toLowerCase().includes(q));
  }, [careers, query]);

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
            filtered.slice(0, 24).map((career) => ({ name: career.title, path: `/careers/${career.slug}` }))
          ),
        ]}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand uppercase">Career Options</p>
        <div className="mt-2 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink leading-tight">Explore practical career paths.</h1>
            <p className="text-muted2 mt-2 max-w-2xl text-sm sm:text-base">Browse careers across technology, operations, business, healthcare, trades, creative work, and more.</p>
          </div>
          <div className="relative w-full lg:w-[320px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted2" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search careers"
              className="w-full bg-white border border-line rounded-full pl-10 pr-4 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="mt-5 sm:mt-8 grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {filtered.map((career) => (
            <Link key={career.slug} to={`/careers/${career.slug}`} className="surface-gradient border border-line rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:shadow-soft transition">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-brand-50 text-brand flex items-center justify-center">
                <Briefcase size={16} />
              </div>
              <h2 className="font-heading font-bold text-xs sm:text-sm text-ink mt-2 sm:mt-3 leading-tight">{career.title}</h2>
              <p className="text-[10px] sm:text-xs text-muted2 mt-1 line-clamp-2">{career.description || "Explore salary, skills, demand, and roadmap."}</p>
              <div className="mt-2 sm:mt-3 flex items-center justify-between text-[11px] sm:text-xs">
                <span className="font-semibold text-ink">₹{career.avgSalary?.min || 3}-{career.avgSalary?.max || 12}L</span>
                <span className="inline-flex items-center gap-1 text-brand font-semibold">View <ArrowRight size={12} /></span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </PublicShell>
  );
}
