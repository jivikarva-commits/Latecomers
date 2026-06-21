import React, { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronRight, CheckCircle2, Sparkles, Target, MapPinned, Building2 } from "lucide-react";
import PublicShell from "../components/PublicShell";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext";
import { getLandingPage } from "../data/landingPages";
import { CAREER_GUIDES } from "../data/careerGuides";
import { breadcrumbSchema, faqSchema } from "../lib/seoSchemas";

// Internal links every landing page surfaces — strong topical signal for Google.
const HUB_LINKS = [
  { to: "/career-guide/data-analyst-india", label: "Career guides", icon: Target },
  { to: "/careers-explore", label: "Explore all careers", icon: MapPinned },
  { to: "/pricing", label: "Pricing", icon: Sparkles },
  { to: "/institutes", label: "Find institutes", icon: Building2 },
];

export default function LandingSEO() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  // Routes are fixed keyword paths (e.g. /career-quiz); slug = path minus leading slash.
  const slug = location.pathname.replace(/^\/+/, "").replace(/\/+$/, "");
  const page = getLandingPage(slug);

  const startQuiz = () => navigate(isAuthenticated ? "/dashboard" : "/signin");

  const faqs = page?.faqs || [];
  const careerSpotlight = useMemo(() => CAREER_GUIDES.slice(0, 18), []);

  if (!page) {
    return (
      <PublicShell>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-2xl font-black text-ink">Page not found</h1>
          <Link to="/" className="mt-4 inline-block text-brand font-bold">Go home →</Link>
        </div>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        path={`/${page.slug}`}
        jsonLd={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: page.eyebrow || "Career Guidance", path: `/${page.slug}` },
          ]),
          faqSchema(faqs),
        ]}
      />

      {/* Hero */}
      <section className="bg-[#F6F1FF]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-[11px] sm:text-xs text-muted2 mb-3 flex items-center gap-1">
            <Link to="/" className="hover:text-brand">Home</Link>
            <ChevronRight size={12} />
            <span className="text-ink font-semibold">{page.eyebrow}</span>
          </nav>
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand uppercase">{page.eyebrow}</p>
          <h1 className="mt-2 font-heading font-black text-2xl sm:text-4xl lg:text-[2.6rem] leading-tight text-ink">{page.h1}</h1>
          <p className="mt-4 max-w-3xl text-sm sm:text-lg text-muted2 leading-relaxed">{page.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={startQuiz} className="rounded-lg bg-brand px-5 py-3 text-sm font-black text-white hover:bg-brand-700 transition">
              {page.ctaPrimary} <ArrowRight className="inline-block" size={16} />
            </button>
            <Link to="/careers-explore" className="rounded-lg border border-brand/40 bg-white px-5 py-3 text-sm font-black text-brand">
              Browse careers <ArrowRight className="inline-block" size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Content sections */}
      <section className="bg-white py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          {page.sections.map((s) => (
            <div key={s.heading}>
              <h2 className="font-heading font-black text-xl sm:text-2xl text-ink leading-tight">{s.heading}</h2>
              <div className="mt-3 space-y-3">
                {s.body.map((p) => (
                  <p key={p} className="text-sm sm:text-base text-muted2 leading-relaxed">{p}</p>
                ))}
              </div>
              {s.bullets && (
                <ul className="mt-4 grid sm:grid-cols-2 gap-2.5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 rounded-xl bg-brand-50 border border-line p-3 text-sm font-semibold text-ink">
                      <CheckCircle2 size={15} className="text-brand mt-0.5 shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Career grid (best-careers hub page only) — internal links to 18 career guides */}
      {page.showCareerGrid && (
        <section className="bg-brand-50 py-10 sm:py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-black text-xl sm:text-2xl text-ink">Explore the best careers — with salary & roadmap</h2>
            <p className="text-sm sm:text-base text-muted2 mt-2">Each guide covers salary, a month-by-month roadmap, skills, free courses, and job roles.</p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
              {careerSpotlight.map((g) => (
                <Link key={g.slug} to={`/career-guide/${g.slug}`} className="group flex items-center gap-3 rounded-xl border border-line bg-white p-3 hover:border-brand/40 hover:shadow-soft transition">
                  <span className="text-xl shrink-0">{g.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-heading font-bold text-[13px] sm:text-sm text-ink leading-tight truncate">{g.title}</span>
                    <span className="block text-[11px] text-muted2">₹{g.salaryMin}-{g.salaryMax} LPA · {g.timeline}</span>
                  </span>
                  <ArrowRight size={14} className="text-muted2 group-hover:text-brand shrink-0" />
                </Link>
              ))}
            </div>
            <Link to="/careers-explore" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand">
              See all careers <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="bg-white py-10 sm:py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-black text-xl sm:text-2xl text-ink">Frequently asked questions</h2>
            <div className="mt-5 space-y-3">
              {faqs.map((f) => (
                <details key={f.question} className="group rounded-xl border border-line bg-[#FAFAFE] p-4">
                  <summary className="flex cursor-pointer items-center justify-between font-heading font-bold text-sm sm:text-base text-ink list-none">
                    {f.question}
                    <ChevronRight size={16} className="text-brand transition group-open:rotate-90" />
                  </summary>
                  <p className="mt-2.5 text-sm text-muted2 leading-relaxed">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA + internal links */}
      <section className="relative overflow-hidden bg-brand py-12 sm:py-16 text-center text-white">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-pink-500/20" />
        <div className="relative max-w-3xl mx-auto px-4">
          <h2 className="font-heading font-black text-2xl sm:text-4xl leading-tight">Find your best-fit career in 5 minutes.</h2>
          <p className="mt-3 text-sm sm:text-base font-semibold text-white/80">Free AI career quiz + personalised roadmap. Built for India's late starters and confused graduates.</p>
          <button onClick={startQuiz} className="mt-6 rounded-xl bg-white px-7 py-3.5 text-sm font-black text-brand">
            {page.ctaPrimary} <ArrowRight className="inline" size={16} />
          </button>
          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            {HUB_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="inline-flex items-center gap-1.5 rounded-full bg-white/12 border border-white/20 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition">
                <l.icon size={13} /> {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
