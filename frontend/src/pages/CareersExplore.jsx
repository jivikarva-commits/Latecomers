import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Search } from "lucide-react";
import PublicShell from "../components/PublicShell";
import { api } from "../lib/api";
import SEO from "../components/SEO";

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
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <p className="text-xs font-bold tracking-[0.28em] text-brand uppercase">Career Options</p>
        <div className="mt-3 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-ink leading-tight">Explore practical career paths.</h1>
            <p className="text-muted2 mt-4 max-w-2xl text-lg">Browse careers across technology, operations, business, healthcare, trades, creative work, and more.</p>
          </div>
          <div className="relative w-full lg:w-[360px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted2" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search careers"
              className="w-full bg-white border border-line rounded-full pl-11 pr-4 py-3 text-sm"
            />
          </div>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((career) => (
            <Link key={career.slug} to={`/careers/${career.slug}`} className="surface-gradient border border-line rounded-2xl p-5 hover:shadow-soft transition">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand flex items-center justify-center">
                <Briefcase size={22} />
              </div>
              <h2 className="font-heading font-bold text-xl text-ink mt-4">{career.title}</h2>
              <p className="text-sm text-muted2 mt-2 line-clamp-2">{career.description || "Explore salary, skills, demand, roadmap, and job possibilities."}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-semibold text-ink">₹{career.avgSalary?.min || 3}-{career.avgSalary?.max || 12}L</span>
                <span className="inline-flex items-center gap-1 text-brand font-semibold">View <ArrowRight size={14} /></span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </PublicShell>
  );
}
