import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Landmark } from "lucide-react";
import SEO from "./SEO";
import CivilServiceGuide from "./CivilServiceGuide";

const Bullets = ({ items }) => <ul className="list-disc pl-5 space-y-3 text-sm leading-7 text-muted2">{items.map((item) => <li key={item}>{item}</li>)}</ul>;

function References({ sources, kind, title }) {
  return <div>
    <h3 className="font-bold text-ink mb-3">{title}</h3>
    <ul className="space-y-4">
      {sources.filter((s) => s.kind === kind).map((s) => <li key={s.url}>
        <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-brand underline underline-offset-4 font-semibold text-sm inline-flex items-start gap-2 break-words">
          {s.label}<ExternalLink size={14} className="shrink-0 mt-1" />
        </a>
        <p className="text-xs leading-6 text-muted2 mt-1">{s.scope}</p>
      </li>)}
    </ul>
  </div>;
}

export default function GovernmentCareerReport({ career, embedded = false }) {
  const p = career.governmentProfile;
  if (p.details) return <CivilServiceGuide career={career} embedded={embedded} />;
  const panel = "rounded-2xl border border-line bg-white p-5 sm:p-7 min-w-0";
  return <main className="w-full min-w-0 bg-[#F8F6FF] px-4 sm:px-6 py-6 sm:py-10">
    {!embedded && <SEO title={`${career.title} — Eligibility, Exam & Official Sources`} description={p.summary} path={`/careers/${career.slug}`} />}
    <div className="max-w-5xl mx-auto space-y-5">
      {!embedded && <Link className="text-sm text-brand font-semibold" to="/careers-explore?field=government">← All government careers</Link>}
      <header className={`${panel} border-brand/20`}>
        <div className="flex flex-wrap gap-2 items-center text-xs font-semibold text-brand"><Landmark size={18} /> Government career guide <span className="text-muted2">• {p.scope}</span></div>
        <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-ink mt-4 leading-tight">{career.title}</h1>
        <p className="text-muted2 mt-4 leading-7">{p.summary}</p>
        <div className="mt-5 border-t border-line pt-4 text-xs leading-6 text-muted2">
          <p><strong className="text-ink">Editorial review:</strong> {p.reviewedAt}</p>
          <p><strong className="text-ink">Source cycle:</strong> {p.sourceCycle}</p>
          <a className="text-brand underline" href="#government-sources">Read official sources and published institute cross-checks ↓</a>
        </div>
      </header>
      <aside className="rounded-xl border border-amber-200 bg-amber-50 p-4 sm:p-5 text-sm leading-7 text-amber-950">
        <h2 className="font-bold mb-1">Before you apply</h2><p>{p.notice}</p>
      </aside>
      <section className={panel}><h2 className="font-heading text-xl font-bold text-ink mb-4">Eligibility & entry routes</h2><Bullets items={p.eligibility} /></section>
      <div className="grid gap-5 md:grid-cols-2">
        <section className={panel}><h2 className="font-heading text-xl font-bold text-ink mb-4">Selection process</h2><Bullets items={p.selection} /></section>
        <section className={panel}><h2 className="font-heading text-xl font-bold text-ink mb-4">Pay & service conditions</h2><p className="text-sm text-muted2 leading-7">{p.pay}</p><p className="text-xs text-muted2 leading-6 mt-4 border-t border-line pt-3">{p.payNote}</p></section>
      </div>
      <section className={panel}>
        <h2 className="font-heading text-xl font-bold text-ink mb-4">What to prepare</h2><Bullets items={p.subjects} />
        <p className="text-sm text-muted2 leading-7 mt-4 border-t border-line pt-4"><strong className="text-ink">Suggested approach:</strong> Download the correct syllabus, solve an official previous paper, identify weak topics and build a revision/mock-test schedule. Practise the relevant typing, aptitude or physical test alongside written preparation. Coaching is optional; preparation time and selection are not guaranteed.</p>
      </section>
      <aside className="rounded-xl border border-brand/20 bg-brand-50 p-5 text-sm leading-7 text-ink"><h2 className="font-bold mb-1">Important distinction</h2><p>{p.caution}</p></aside>
      <section id="government-sources" className={`${panel} scroll-mt-24`}>
        <h2 className="font-heading text-xl font-bold text-ink mb-3">Sources & verification scope</h2>
        <p className="text-sm text-muted2 leading-7 mb-6">Official recruitment notices control eligibility. Institute links are published reference material reviewed for cross-checking; they are not direct confirmations, partnerships or endorsements. Older source cycles are labelled above. Current vacancies, deadlines and individual eligibility are not certified by this guide.</p>
        <div className="grid gap-8 md:grid-cols-2">
          <References sources={p.sources} kind="official" title="Official authorities" />
          <References sources={p.sources} kind="institute" title="Published institute references" />
        </div>
      </section>
    </div>
  </main>;
}
