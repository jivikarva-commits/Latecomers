import React from "react";
import { Compass, HeartHandshake, Map, ShieldCheck } from "lucide-react";
import PublicShell from "../components/PublicShell";

const values = [
  ["No shame", "We do not treat late starts, career gaps, or confusion as failure.", HeartHandshake],
  ["Clear next steps", "Every result should lead to a practical action, not vague motivation.", Map],
  ["Honest guidance", "We explain why a career fits and where it may be difficult.", ShieldCheck],
];

export default function About() {
  return (
    <PublicShell>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.28em] text-brand uppercase">About Latecomers</p>
            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-ink mt-3 leading-tight">
              Career guidance for people who are starting again.
            </h1>
            <p className="text-muted2 mt-5 text-lg leading-relaxed">
              Latecomers exists for people who feel they missed the perfect timeline. We help BPO workers, backoffice teams, graduates, and career switchers find realistic career paths using AI, practical roadmaps, institutes, scholarships, and interview practice.
            </p>
          </div>
          <div className="bg-white rounded-3xl border border-line p-6 shadow-soft">
            <Compass className="text-brand" size={42} />
            <h2 className="font-heading font-extrabold text-2xl text-ink mt-5">Late But not Lost.</h2>
            <p className="text-muted2 mt-3 leading-relaxed">
              Our belief is simple: your previous work, struggles, and detours still contain useful signals. The right platform should help you read those signals and turn them into a plan.
            </p>
          </div>
        </div>

        <section className="mt-14 grid md:grid-cols-3 gap-4">
          {values.map(([title, text, Icon]) => (
            <div key={title} className="surface-gradient border border-line rounded-2xl p-5">
              <Icon className="text-brand" size={26} />
              <h3 className="font-heading font-bold text-xl text-ink mt-4">{title}</h3>
              <p className="text-sm text-muted2 mt-2 leading-relaxed">{text}</p>
            </div>
          ))}
        </section>
      </main>
    </PublicShell>
  );
}
