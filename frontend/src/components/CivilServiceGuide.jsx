import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ExternalLink, GraduationCap, Landmark } from "lucide-react";
import SEO from "./SEO";

const panel = "rounded-2xl border border-line bg-white p-5 sm:p-7 min-w-0 scroll-mt-48 sm:scroll-mt-32";
const h2 = "font-heading text-xl sm:text-2xl font-bold text-ink mb-4";
const muted = "text-sm leading-7 text-muted2";

const SECTIONS = ["role", "steps", "eligibility", "exam", "passing", "calendar", "prepare", "training", "salary", "faqs", "institutes", "government-sources"];

// Government guides use these defaults; other guides (e.g. IT/Tech) override them via details.labels.
const DEFAULT_LABELS = {
  nav: { role: "What you do", steps: "Start to end", eligibility: "Eligibility", exam: "Exam pattern", passing: "Passing rules",
    calendar: "Dates", prepare: "How to prepare", training: "Training", salary: "Pay & growth", faqs: "FAQs",
    institutes: "Top institutes", "government-sources": "Sources" },
  steps: "Step-by-step: from start to joining",
  eligibility: "Eligibility — can you apply?",
  passing: "Passing marks & how your final rank is made",
  calendar: "Important dates",
  prepare: "How to prepare (suggested plan)",
  resources: "Free official resources",
  reviewed: "Checked against official documents on:",
  cycle: "Rules used:",
  back: ["/careers-explore?field=government", "← All government careers"],
  seo: "Eligibility, Exam, Steps & Pay",
  institutes: "Top institutes & official courses",
};

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
          <li key={`${s.label}-${s.url}`}>
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

const has = (d, id) => {
  const optional = { calendar: d.calendar, training: d.training, salary: d.careerLadder, faqs: d.faqs?.length, institutes: d.institutes?.length };
  return id in optional ? Boolean(optional[id]) : true;
};

const jump = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

export default function CivilServiceGuide({ career, embedded = false }) {
  const p = career.governmentProfile || career.guideProfile;
  const d = p.details;
  const L = { ...DEFAULT_LABELS, ...d.labels, nav: { ...DEFAULT_LABELS.nav, ...d.labels?.nav } };
  const headline = d.service.headline || `How to become an ${d.service.short} officer`;
  const stages = d.examStages.length;
  return (
    <main className="w-full min-w-0 bg-[#F8F6FF] px-4 sm:px-6 py-6 sm:py-10">
      {!embedded && <SEO title={`${d.service.seoTitle || headline} — ${L.seo}`} description={p.summary} path={`/careers/${career.slug}`} />}
      <div className="max-w-5xl mx-auto space-y-5">
        {!embedded && <Link className="text-sm text-brand font-semibold" to={L.back[0]}>{L.back[1]}</Link>}

        <header className={`${panel} border-brand/20`}>
          <div className="flex flex-wrap gap-2 items-center text-xs font-semibold text-brand">
            <Landmark size={18} /> Beginner's guide <span className="text-muted2">• {p.scope}</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-ink mt-4 leading-tight">{headline}</h1>
          <p className="text-base font-semibold text-ink mt-2">{d.service.full}</p>
          <p className="text-muted2 mt-3 leading-7">{p.summary}</p>
          <div className="mt-5 border-t border-line pt-4 text-xs leading-6 text-muted2">
            <p><strong className="text-ink">{L.reviewed}</strong> {p.reviewedAt}</p>
            <p><strong className="text-ink">{L.cycle}</strong> {p.sourceCycle}</p>
          </div>
        </header>

        <nav aria-label="On this page" className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs font-semibold text-muted2 mb-2">On this page</p>
          <div className="flex flex-wrap gap-2">
            {SECTIONS.filter((id) => has(d, id)).map((id) => (
              <button key={id} type="button" onClick={() => jump(id)} className="rounded-full border border-line bg-[#F8F6FF] px-3 py-1.5 text-xs font-semibold text-ink hover:border-brand hover:text-brand">
                {L.nav[id]}
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
          <h2 className={h2}>{d.role.heading || `What does an ${d.service.short} officer do?`}</h2>
          <p className={`${muted} mb-4`}>{d.role.intro}</p>
          <Bullets items={d.role.duties} />
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {[d.service.authority, ...d.role.postings].map((x) => (
              <p key={x} className="rounded-lg bg-[#F8F6FF] px-3 py-2 text-xs font-semibold text-ink leading-6">{x}</p>
            ))}
          </div>
        </section>

        <section id="steps" className={panel}>
          <h2 className={h2}>{L.steps}</h2>
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
          <h2 className={h2}>{L.eligibility}</h2>
          <ul className="space-y-2 mb-6">
            {(d.eligibility || p.eligibility).map((e) => (
              <li key={e} className="flex gap-2 text-sm leading-7 text-muted2"><CheckCircle2 size={18} className="text-brand shrink-0 mt-1" />{e}</li>
            ))}
          </ul>
          {d.categoryTable && <>
            <h3 className="font-bold text-ink mb-3">{d.categoryTable.title || "Age limit and attempts by category"}</h3>
            <Table columns={d.categoryTable.columns} rows={d.categoryTable.rows} />
            <p className="text-xs leading-6 text-muted2 mt-3">{d.categoryTable.note}</p>
          </>}
          {d.attemptRules?.length > 0 && <>
            <h3 className="font-bold text-ink mt-6 mb-2">{d.attemptHeading || "What counts as an attempt?"}</h3>
            <Bullets items={d.attemptRules} />
          </>}
        </section>

        <section id="exam" className={panel}>
          <h2 className={h2}>{d.examHeading || `Selection process — ${stages} ${stages === 1 ? "stage" : "stages"}`}</h2>
          <div className="space-y-6">
            {d.examStages.map((stage) => (
              <div key={stage.name} className="rounded-xl border border-line p-4 sm:p-5">
                <h3 className="font-bold text-ink">{stage.name}</h3>
                <p className="text-xs font-semibold text-brand mt-1">{stage.when}</p>
                <p className={`${muted} mt-2 mb-3`}>{stage.purpose}</p>
                {stage.papers?.length > 0 && <Table columns={d.labels?.paperColumns || ["Paper / test", "Marks", "Time", "Counts for"]} rows={stage.papers.map((x) => [x.paper, x.marks, x.duration, x.counts])} />}
                <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-sm leading-7 text-ink"><strong>{d.labels?.passPrefix || "To pass:"} </strong>{stage.passRule}</p>
              </div>
            ))}
          </div>
          {d.optionalSubjects && <>
            <h3 className="font-bold text-ink mt-6 mb-2">{d.optionalHeading || "Optional subject"}</h3>
            <p className={muted}>{d.optionalSubjects}</p>
          </>}
        </section>

        <section id="passing" className={panel}>
          <h2 className={h2}>{L.passing}</h2>
          <Bullets items={d.passingRules} />
        </section>

        {d.calendar && <section id="calendar" className={panel}>
          <h2 className={h2}>{d.calendar.heading || L.calendar}</h2>
          <p className="text-sm font-semibold text-ink mb-3">{d.calendar.label}</p>
          <Table columns={["Event", "Date"]} rows={d.calendar.rows.map((r) => [r.event, r.date])} />
          <p className="text-xs leading-6 text-muted2 mt-3">{d.calendar.note}</p>
        </section>}

        <section id="prepare" className={panel}>
          <h2 className={h2}>{L.prepare}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {d.prepPlan.map((ph) => (
              <div key={ph.phase} className="rounded-xl border border-line p-4">
                <p className="font-bold text-ink">{ph.phase}</p>
                <p className="text-xs font-semibold text-brand mb-2">{ph.duration}</p>
                <Bullets items={ph.focus} />
              </div>
            ))}
          </div>
          <h3 className="font-bold text-ink mt-6 mb-3">{L.resources}</h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {d.freeResources.map((r) => (
              <li key={`${r.label}-${r.url}`} className="rounded-xl border border-line p-3">
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-brand font-semibold text-sm inline-flex items-start gap-1.5 underline underline-offset-4 break-words">{r.label}<ExternalLink size={13} className="shrink-0 mt-1" /></a>
                <p className="text-xs leading-6 text-muted2 mt-1">{r.note}</p>
              </li>
            ))}
          </ul>
          <h3 className="font-bold text-ink mt-6 mb-2">Common mistakes to avoid</h3>
          <Bullets items={d.mistakes} />
        </section>

        {d.training && <section id="training" className={panel}>
          <h2 className={h2}>{d.training?.heading || "Training after selection"}</h2>
          <p className={`${muted} mb-4`}>{d.training.intro}</p>
          <Table columns={["Phase", "Where", "Duration"]} rows={d.training.phases.map((t) => [t.name, t.place, t.duration])} />
          <p className="text-xs leading-6 text-muted2 mt-3">{d.training.note}</p>
        </section>}

        {d.careerLadder && <section id="salary" className={panel}>
          <h2 className={h2}>{d.careerLadder.heading || "Pay & career growth"}</h2>
          {d.careerLadder.columns
            ? <Table columns={d.careerLadder.columns} rows={d.careerLadder.rows} />
            : <Table columns={["Grade", "Typical post", "Pay level", "Starting basic / month", "Eligible after"]}
              rows={d.careerLadder.rows.map((r) => [r.stage, r.typicalPost, r.level, r.entryBasic, r.after])} />}
          <p className="text-xs leading-6 text-muted2 mt-3">{d.careerLadder.note}</p>
          {p.payNote && <p className="text-xs leading-6 text-muted2 mt-2">{p.payNote}</p>}
        </section>}

        {d.special && <section className="rounded-xl border border-brand/20 bg-brand-50 p-5 sm:p-6">
          <h2 className="font-bold text-ink mb-2">{d.special.title}</h2>
          <Bullets items={d.special.items} />
        </section>}

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

        {d.institutes?.length > 0 && <section id="institutes" className={panel}>
          <h2 className={h2}>{L.institutes}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {d.institutes.map((ins) => (
              <article key={ins.name} className="rounded-xl border border-line p-4 sm:p-5 min-w-0 flex flex-col">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand"><GraduationCap size={18} /></span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-ink leading-6">{ins.name}</h3>
                    <p className="text-xs font-semibold text-brand mt-0.5">{ins.type}</p>
                  </div>
                </div>
                <dl className="mt-3 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1.5 text-xs leading-5">
                  {[["Mode", ins.mode], ["Duration", ins.duration], ["Fee", ins.fee], ["Who can join", ins.eligibility]].filter(([, v]) => v).map(([k, v]) => (
                    <React.Fragment key={k}><dt className="font-semibold text-ink">{k}</dt><dd className="text-muted2 min-w-0 break-words">{v}</dd></React.Fragment>
                  ))}
                </dl>
                <p className={`${muted} mt-3`}><strong className="text-ink">What you learn: </strong>{ins.covers}</p>
                <p className="text-xs leading-6 text-muted2 mt-2"><strong className="text-ink">Best for: </strong>{ins.bestFor}</p>
                <a href={ins.url} target="_blank" rel="noopener noreferrer" className="mt-auto pt-3 text-brand font-semibold text-sm inline-flex items-center gap-1.5 underline underline-offset-4">Official page<ExternalLink size={13} /></a>
              </article>
            ))}
          </div>
        </section>}

        <section className={panel}>
          <h2 className={h2}>{d.relatedHeading || "Related government careers"}</h2>
          {p.caution && <p className={`${muted} mb-4`}>{p.caution}</p>}
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
          <p className={`${muted} mb-6`}>Official notifications and websites used for this guide.</p>
          <div className="grid gap-8 md:grid-cols-2">
            <SourceList sources={p.sources} kind="official" title="Official documents" />
            <SourceList sources={p.sources} kind="institute" title="Published cross-checks" />
          </div>
        </section>
      </div>
    </main>
  );
}
