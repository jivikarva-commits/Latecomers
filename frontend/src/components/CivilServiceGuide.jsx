import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ExternalLink, Landmark } from "lucide-react";
import SEO from "./SEO";

const panel = "rounded-2xl border border-line bg-white p-5 sm:p-7 min-w-0 scroll-mt-48 sm:scroll-mt-32";
const h2 = "font-heading text-xl sm:text-2xl font-bold text-ink mb-4";
const muted = "text-sm leading-7 text-muted2";

const SECTIONS = [
  ["role", "What you do"],
  ["steps", "Start to end"],
  ["eligibility", "Eligibility"],
  ["exam", "Exam pattern"],
  ["passing", "Passing rules"],
  ["calendar", "Dates"],
  ["prepare", "How to prepare"],
  ["training", "Training"],
  ["salary", "Pay & growth"],
  ["faqs", "FAQs"],
  ["government-sources", "Sources"],
];

const Bullets = ({ items }) => (
  <ul className="list-disc pl-5 space-y-2 text-sm leading-7 text-muted2">{items.map((item) => <li key={item}>{item}</li>)}</ul>
);

function Table({ columns, rows }) {
  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table className="w-full min-w-[520px] text-sm border-collapse">
        <thead>
          <tr>{columns.map((c) => <th key={c} className="text-left font-semibold text-ink bg-[#F4F0FF] px-3 py-2 border border-line">{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j} className="px-3 py-2 border border-line text-muted2 align-top leading-6">{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SourceList({ sources, kind, title }) {
  const items = sources.filter((s) => s.kind === kind);
  if (!items.length) return null;
  return (
    <div>
      <h3 className="font-bold text-ink mb-3">{title}</h3>
      <ul className="space-y-4">
        {items.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-brand underline underline-offset-4 font-semibold text-sm inline-flex items-start gap-2 break-words">
              {s.label}<ExternalLink size={14} className="shrink-0 mt-1" />
            </a>
            <p className="text-xs leading-6 text-muted2 mt-1">{s.scope}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

const jump = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

export default function CivilServiceGuide({ career, embedded = false }) {
  const p = career.governmentProfile;
  const d = p.details;
  return (
    <main className="w-full min-w-0 bg-[#F8F6FF] px-4 sm:px-6 py-6 sm:py-10">
      {!embedded && <SEO title={`How to Become an ${d.service.short} Officer — Eligibility, Exam, Steps & Pay`} description={p.summary} path={`/careers/${career.slug}`} />}
      <div className="max-w-5xl mx-auto space-y-5">
        {!embedded && <Link className="text-sm text-brand font-semibold" to="/careers-explore?field=government">← All government careers</Link>}

        <header className={`${panel} border-brand/20`}>
          <div className="flex flex-wrap gap-2 items-center text-xs font-semibold text-brand">
            <Landmark size={18} /> Beginner's guide <span className="text-muted2">• {p.scope}</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-ink mt-4 leading-tight">How to become an {d.service.short} officer</h1>
          <p className="text-base font-semibold text-ink mt-2">{d.service.full}</p>
          <p className="text-muted2 mt-3 leading-7">{p.summary}</p>
          <div className="mt-5 border-t border-line pt-4 text-xs leading-6 text-muted2">
            <p><strong className="text-ink">Checked against official documents on:</strong> {p.reviewedAt}</p>
            <p><strong className="text-ink">Rules used:</strong> {p.sourceCycle}</p>
          </div>
        </header>

        <nav aria-label="On this page" className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs font-semibold text-muted2 mb-2">On this page</p>
          <div className="flex flex-wrap gap-2">
            {SECTIONS.map(([id, label]) => (
              <button key={id} type="button" onClick={() => jump(id)} className="rounded-full border border-line bg-[#F8F6FF] px-3 py-1.5 text-xs font-semibold text-ink hover:border-brand hover:text-brand">
                {label}
              </button>
            ))}
          </div>
        </nav>

        <section aria-label="Quick facts" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {d.quickFacts.map((f) => (
            <div key={f.label} className="rounded-xl border border-line bg-white p-4 min-w-0">
              <p className="text-[11px] uppercase tracking-wide font-semibold text-muted2">{f.label}</p>
              <p className="text-sm font-bold text-ink mt-1 leading-6 break-words">{f.value}</p>
            </div>
          ))}
        </section>

        <section id="role" className={panel}>
          <h2 className={h2}>What does an {d.service.short} officer do?</h2>
          <p className={`${muted} mb-4`}>{d.role.intro}</p>
          <Bullets items={d.role.duties} />
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {[d.service.authority, ...d.role.postings].map((x) => (
              <p key={x} className="rounded-lg bg-[#F8F6FF] px-3 py-2 text-xs font-semibold text-ink leading-6">{x}</p>
            ))}
          </div>
        </section>

        <aside className="rounded-xl border border-amber-200 bg-amber-50 p-4 sm:p-5 text-sm leading-7 text-amber-950">
          <h2 className="font-bold mb-1">Before you apply</h2><p>{p.notice}</p>
        </aside>

        <section id="steps" className={panel}>
          <h2 className={h2}>Step-by-step: from start to joining</h2>
          <ol className="relative space-y-5">
            {d.steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white text-sm font-bold">{i + 1}</span>
                <div className="min-w-0">
                  <p className="font-bold text-ink leading-7">{s.title}</p>
                  <p className="text-xs font-semibold text-brand">{s.when}</p>
                  <p className={`${muted} mt-1`}>{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="eligibility" className={panel}>
          <h2 className={h2}>Eligibility — can you apply?</h2>
          <ul className="space-y-2 mb-6">
            {p.eligibility.map((e) => (
              <li key={e} className="flex gap-2 text-sm leading-7 text-muted2"><CheckCircle2 size={18} className="text-brand shrink-0 mt-1" />{e}</li>
            ))}
          </ul>
          <h3 className="font-bold text-ink mb-3">Age limit and attempts by category</h3>
          <Table columns={d.categoryTable.columns} rows={d.categoryTable.rows} />
          <p className="text-xs leading-6 text-muted2 mt-3">{d.categoryTable.note}</p>
          <h3 className="font-bold text-ink mt-6 mb-2">What counts as an attempt?</h3>
          <Bullets items={d.attemptRules} />
        </section>

        <section id="exam" className={panel}>
          <h2 className={h2}>Exam pattern — 3 stages</h2>
          <div className="space-y-6">
            {d.examStages.map((stage) => (
              <div key={stage.name} className="rounded-xl border border-line p-4 sm:p-5">
                <h3 className="font-bold text-ink">{stage.name}</h3>
                <p className="text-xs font-semibold text-brand mt-1">{stage.when}</p>
                <p className={`${muted} mt-2 mb-3`}>{stage.purpose}</p>
                <Table columns={["Paper", "Marks", "Time", "Counts for"]} rows={stage.papers.map((x) => [x.paper, x.marks, x.duration, x.counts])} />
                <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-sm leading-7 text-ink"><strong>To pass: </strong>{stage.passRule}</p>
              </div>
            ))}
          </div>
          <h3 className="font-bold text-ink mt-6 mb-2">Optional subject</h3>
          <p className={muted}>{d.optionalSubjects}</p>
        </section>

        <section id="passing" className={panel}>
          <h2 className={h2}>Passing marks & how your final rank is made</h2>
          <Bullets items={d.passingRules} />
        </section>

        <section id="calendar" className={panel}>
          <h2 className={h2}>Important dates</h2>
          <p className="text-sm font-semibold text-ink mb-3">{d.calendar.label}</p>
          <Table columns={["Event", "Date"]} rows={d.calendar.rows.map((r) => [r.event, r.date])} />
          <p className="text-xs leading-6 text-muted2 mt-3">{d.calendar.note}</p>
        </section>

        <section id="prepare" className={panel}>
          <h2 className={h2}>How to prepare (suggested plan)</h2>
          <p className="text-xs leading-6 text-muted2 mb-4">This is a common, practical study plan — not an official UPSC requirement. Adjust it to your pace and whether you are studying or working.</p>
          <div className="grid gap-4 md:grid-cols-2">
            {d.prepPlan.map((ph) => (
              <div key={ph.phase} className="rounded-xl border border-line p-4">
                <p className="font-bold text-ink">{ph.phase}</p>
                <p className="text-xs font-semibold text-brand mb-2">{ph.duration}</p>
                <Bullets items={ph.focus} />
              </div>
            ))}
          </div>
          <h3 className="font-bold text-ink mt-6 mb-3">Free official resources</h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {d.freeResources.map((r) => (
              <li key={r.url} className="rounded-xl border border-line p-3">
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-brand font-semibold text-sm inline-flex items-start gap-1.5 underline underline-offset-4 break-words">{r.label}<ExternalLink size={13} className="shrink-0 mt-1" /></a>
                <p className="text-xs leading-6 text-muted2 mt-1">{r.note}</p>
              </li>
            ))}
          </ul>
          <h3 className="font-bold text-ink mt-6 mb-2">Common mistakes to avoid</h3>
          <Bullets items={d.mistakes} />
        </section>

        <section id="training" className={panel}>
          <h2 className={h2}>Training after selection</h2>
          <p className={`${muted} mb-4`}>{d.training.intro}</p>
          <Table columns={["Phase", "Where", "Duration"]} rows={d.training.phases.map((t) => [t.name, t.place, t.duration])} />
          <p className="text-xs leading-6 text-muted2 mt-3">{d.training.note}</p>
        </section>

        <section id="salary" className={panel}>
          <h2 className={h2}>Pay & career growth</h2>
          <Table columns={["Grade", "Typical post", "Pay level", "Starting basic / month", "Eligible after"]}
            rows={d.careerLadder.rows.map((r) => [r.stage, r.typicalPost, r.level, r.entryBasic, r.after])} />
          <p className="text-xs leading-6 text-muted2 mt-3">{d.careerLadder.note}</p>
          <p className="text-xs leading-6 text-muted2 mt-2">{p.payNote}</p>
        </section>

        <section className="rounded-xl border border-brand/20 bg-brand-50 p-5 sm:p-6">
          <h2 className="font-bold text-ink mb-2">{d.special.title}</h2>
          <Bullets items={d.special.items} />
        </section>

        <section id="faqs" className={panel}>
          <h2 className={h2}>Beginner FAQs</h2>
          <div className="divide-y divide-line">
            {d.faqs.map((f) => (
              <details key={f.q} className="py-3 group">
                <summary className="cursor-pointer font-semibold text-ink text-sm leading-7">{f.q}</summary>
                <p className={`${muted} mt-2`}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={panel}>
          <h2 className={h2}>Same exam, other services</h2>
          <p className={`${muted} mb-4`}>{p.caution}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {d.related.map((r) => (
              <Link key={r.slug} to={`/careers/${r.slug}`} className="rounded-xl border border-line p-4 hover:border-brand flex items-center justify-between gap-3">
                <span className="min-w-0"><span className="block font-bold text-ink text-sm">{r.title}</span><span className="block text-xs text-muted2 mt-1">{r.why}</span></span>
                <ArrowRight size={18} className="text-brand shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        <section id="government-sources" className={panel}>
          <h2 className={h2}>Sources & verification</h2>
          <p className={`${muted} mb-6`}>Every rule above was checked against the official documents listed here. Institute links are only cross-checks, not endorsements. Vacancies, dates and individual eligibility are decided by the current UPSC notification.</p>
          <div className="grid gap-8 md:grid-cols-2">
            <SourceList sources={p.sources} kind="official" title="Official documents" />
            <SourceList sources={p.sources} kind="institute" title="Published cross-checks" />
          </div>
        </section>
      </div>
    </main>
  );
}
