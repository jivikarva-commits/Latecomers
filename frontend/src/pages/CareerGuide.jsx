import React, { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight, ChevronRight, Clock, GraduationCap, IndianRupee, TrendingUp,
  Briefcase, CheckCircle2, Sparkles, Wrench, BookOpen, MapPinned, Building2,
} from "lucide-react";
import PublicShell from "../components/PublicShell";
import SEO from "../components/SEO";
import { CAREER_GUIDES, getCareerGuide } from "../data/careerGuides";
import { breadcrumbSchema, faqSchema, howToSchema, occupationSchema } from "../lib/seoSchemas";

// 5 SEO FAQs generated per career from real fields — unique answers per page.
function buildFaqs(g) {
  const sal = `₹${g.salaryMin}-${g.salaryMax} LPA`;
  return [
    {
      question: `How long does it take to become a ${g.title} in India?`,
      answer: `Most people become job-ready as a ${g.title} in about ${g.timeline} with consistent effort, following a step-by-step roadmap of skills, projects, and applications.`,
    },
    {
      question: `What salary does a ${g.title} earn in India?`,
      answer: `A ${g.title} in India typically earns ${sal} per year. Freshers usually start around ${g.freshersSalary}, with pay rising quickly as you gain experience and build a portfolio.`,
    },
    {
      question: `Can I become a ${g.title} without a degree in India?`,
      answer: g.degreeNeeded
        ? `${g.title} usually requires a relevant degree or qualifying exam, but the right preparation and certifications matter more than the college you attended.`
        : `Yes. You do not need a specific degree to become a ${g.title} in India — skills like ${g.topSkills.slice(0, 3).join(", ")} and a strong portfolio matter far more than a formal qualification.`,
    },
    {
      question: `What skills do I need to become a ${g.title}?`,
      answer: `The core skills for a ${g.title} are ${g.topSkills.join(", ")}. You can learn all of these online, many through free resources, in around ${g.timeline}.`,
    },
    {
      question: `Which courses are best for ${g.title} in India?`,
      answer: `Good starting courses include ${g.courses.map((c) => `${c.name} (${c.provider})`).join(", ")}. Most are free or low-cost and enough to build job-ready skills.`,
    },
  ];
}

function Stat({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-line bg-white p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: `${color}1c`, color }}>
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted2">{label}</p>
        <p className="font-heading text-sm font-black text-ink">{value}</p>
      </div>
    </div>
  );
}

export default function CareerGuide() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const guide = getCareerGuide(slug);

  const faqs = useMemo(() => (guide ? buildFaqs(guide) : []), [guide]);
  const related = useMemo(
    () => (guide ? guide.related.map(getCareerGuide).filter(Boolean) : []),
    [guide]
  );

  if (!guide) {
    return (
      <PublicShell>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-2xl font-black text-ink">Career guide not found</h1>
          <p className="mt-2 text-muted2">This career guide doesn't exist yet.</p>
          <Link to="/careers-explore" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-white">
            Explore all careers <ArrowRight size={15} />
          </Link>
        </div>
      </PublicShell>
    );
  }

  const sal = `₹${guide.salaryMin}-${guide.salaryMax} LPA`;
  const metaTitle = `${guide.title} Career in India 2026 — Salary, Roadmap & Skills`;
  const metaDesc = `How to become a ${guide.title} in India. Salary: ${sal}. Timeline: ${guide.timeline}. ${guide.degreeNeeded ? "Exam/degree path explained." : "No degree needed."} Free roadmap on Latecomers AI.`;

  return (
    <PublicShell>
      <SEO
        title={metaTitle}
        description={metaDesc}
        path={`/career-guide/${guide.slug}`}
        jsonLd={[
          occupationSchema(guide),
          howToSchema(
            `How to become a ${guide.title} in India`,
            guide.roadmap.map((r) => ({ name: r.phase, text: r.focus }))
          ),
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Careers", path: "/careers-explore" },
            { name: guide.title, path: `/career-guide/${guide.slug}` },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="bg-brand-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <nav aria-label="Breadcrumb" className="text-[11px] sm:text-xs text-white/60 flex items-center gap-1 flex-wrap mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight size={12} />
            <Link to="/careers-explore" className="hover:text-white">Careers</Link>
            <ChevronRight size={12} />
            <span className="text-white font-semibold">{guide.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide">
              {guide.emoji} {guide.category}
            </span>
            <span className="rounded-full bg-yellow-300 text-brand-900 px-2.5 py-1 text-[11px] font-black">{guide.growth} demand</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl font-black leading-tight">
            {guide.title} Career Path in India
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/80 leading-relaxed">{guide.tagline}</p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <Stat icon={IndianRupee} label="Salary range" value={sal} color="#FBBF24" />
            <Stat icon={Clock} label="Time to job-ready" value={guide.timeline} color="#34D399" />
            <Stat icon={TrendingUp} label="Difficulty" value={guide.difficulty} color="#F472B6" />
            <Stat icon={GraduationCap} label="Degree needed" value={guide.degreeNeeded ? "Yes" : "No"} color="#A78BFA" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => navigate("/signin")} className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-black text-brand">
              Take the free career quiz <ArrowRight size={15} />
            </button>
            <Link to="/careers-explore" className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-5 py-2.5 text-sm font-bold text-white">
              Explore more careers
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
        {/* What is */}
        <section>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-ink">What does a {guide.title} do?</h2>
          <p className="mt-3 text-sm sm:text-[15px] text-muted2 leading-relaxed">{guide.intro}</p>
        </section>

        {/* Salary */}
        <section>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-ink flex items-center gap-2">
            <IndianRupee size={20} className="text-brand" /> {guide.title} Salary in India
          </h2>
          <div className="mt-3 grid sm:grid-cols-3 gap-2.5">
            <div className="rounded-xl border border-line bg-brand-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted2">Freshers</p>
              <p className="font-heading text-lg font-black text-brand mt-1">{guide.freshersSalary}</p>
            </div>
            <div className="rounded-xl border border-line bg-brand-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted2">Average range</p>
              <p className="font-heading text-lg font-black text-brand mt-1">{sal}</p>
            </div>
            <div className="rounded-xl border border-line bg-brand-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted2">Market demand</p>
              <p className="font-heading text-lg font-black text-brand mt-1">{guide.growth}</p>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-ink flex items-center gap-2">
            <Wrench size={20} className="text-brand" /> Skills required to become a {guide.title}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {guide.topSkills.map((s) => (
              <span key={s} className="rounded-full border border-brand/30 bg-brand-50 text-brand text-[13px] font-bold px-3 py-1.5">{s}</span>
            ))}
          </div>
          {guide.tools.length > 0 && (
            <p className="mt-3 text-sm text-muted2"><span className="font-bold text-ink">Tools you'll use:</span> {guide.tools.join(", ")}.</p>
          )}
        </section>

        {/* Roadmap (HowTo) */}
        <section>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-ink flex items-center gap-2">
            <MapPinned size={20} className="text-brand" /> How to become a {guide.title} — step by step
          </h2>
          <ol className="mt-4 space-y-3">
            {guide.roadmap.map((r, i) => (
              <li key={r.phase} className="flex gap-3 rounded-xl border border-line bg-white p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand text-white text-xs font-black">{i + 1}</span>
                <div>
                  <p className="font-heading text-sm font-black text-ink">{r.phase}</p>
                  <p className="text-[13px] text-muted2 mt-0.5">{r.focus}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Courses */}
        <section>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-ink flex items-center gap-2">
            <BookOpen size={20} className="text-brand" /> Best courses for {guide.title} in India
          </h2>
          <div className="mt-3 grid sm:grid-cols-3 gap-2.5">
            {guide.courses.map((c) => (
              <div key={c.name} className="rounded-xl border border-line bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-heading text-sm font-black text-ink leading-tight">{c.name}</p>
                  {c.free && <span className="rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 shrink-0">FREE</span>}
                </div>
                <p className="text-[12px] text-muted2 mt-1.5">{c.provider}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Jobs + who hires */}
        <section>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-ink flex items-center gap-2">
            <Briefcase size={20} className="text-brand" /> Jobs you can apply for
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {guide.jobTitles.map((t) => (
              <span key={t} className="rounded-full bg-white border border-line text-ink text-[13px] font-semibold px-3 py-1.5">{t}</span>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-2">
            <Building2 size={16} className="text-brand mt-0.5 shrink-0" />
            <p className="text-sm text-muted2"><span className="font-bold text-ink">Who hires:</span> {guide.whoHires.join(", ")}.</p>
          </div>
        </section>

        {/* Is it right for you / CTA */}
        <section className="rounded-2xl bg-brand-900 text-white p-6 sm:p-8 text-center">
          <Sparkles size={22} className="mx-auto text-yellow-300" />
          <h2 className="font-heading text-xl sm:text-2xl font-black mt-2">Is {guide.title} the right career for you?</h2>
          <p className="mt-2 text-sm text-white/80 max-w-xl mx-auto">Take the free 5-minute Latecomers AI quiz to see if {guide.title} matches your background, skills, and goals — and get a personalised roadmap.</p>
          <button onClick={() => navigate("/signin")} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-black text-brand">
            Take the free career quiz <ArrowRight size={16} />
          </button>
        </section>

        {/* FAQs */}
        <section>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-ink">Frequently asked questions</h2>
          <div className="mt-4 space-y-2.5">
            {faqs.map((f) => (
              <details key={f.question} className="group rounded-xl border border-line bg-white p-4">
                <summary className="cursor-pointer list-none font-heading text-sm sm:text-[15px] font-black text-ink flex items-center justify-between gap-3">
                  {f.question}
                  <ChevronRight size={16} className="text-brand shrink-0 transition group-open:rotate-90" />
                </summary>
                <p className="mt-2.5 text-[13px] sm:text-sm text-muted2 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related careers */}
        {related.length > 0 && (
          <section>
            <h2 className="font-heading text-xl sm:text-2xl font-black text-ink">Related career paths</h2>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {related.map((r) => (
                <Link key={r.slug} to={`/career-guide/${r.slug}`} className="rounded-xl border border-line bg-white p-4 hover:border-brand/40 hover:shadow-soft transition">
                  <p className="text-lg">{r.emoji}</p>
                  <p className="font-heading text-sm font-black text-ink mt-1">{r.title}</p>
                  <p className="text-[12px] text-muted2 mt-0.5">₹{r.salaryMin}-{r.salaryMax} LPA · {r.timeline}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </PublicShell>
  );
}

// Exported for build-time prerender + sitemap scripts.
export const CAREER_GUIDE_SLUGS = CAREER_GUIDES.map((c) => c.slug);
