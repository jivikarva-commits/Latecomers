import React from "react";
import { Compass, HeartHandshake, Map, ShieldCheck } from "lucide-react";
import PublicShell from "../components/PublicShell";
import SEO from "../components/SEO";

const values = [
  ["No shame", "We do not treat late starts, career gaps, or confusion as failure.", HeartHandshake],
  ["Clear next steps", "Every result should lead to a practical action, not vague motivation.", Map],
  ["Honest guidance", "We explain why a career fits and where it may be difficult.", ShieldCheck],
];

export default function About() {
  return (
    <PublicShell>
      <SEO
        title="About Latecomers AI - Late but not lost"
        description="Learn why Latecomers AI exists for BPO workers, confused graduates, late starters, students, and career switchers who need practical career direction."
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6 sm:gap-10 items-center">
          <div>
            <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand uppercase">About Latecomers</p>
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-ink mt-2 leading-tight">
              Career guidance for people who are starting again.
            </h1>
            <p className="text-muted2 mt-3 text-sm sm:text-base leading-relaxed">
              Latecomers exists for people who feel they missed the perfect timeline. We help BPO workers, backoffice teams, graduates, and career switchers find realistic career paths using AI, practical roadmaps, institutes, scholarships, and interview practice.
            </p>
          </div>
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-line p-4 sm:p-6 shadow-soft">
            <Compass className="text-brand" size={28} />
            <h2 className="font-heading font-extrabold text-lg sm:text-xl text-ink mt-3">Late but not lost.</h2>
            <p className="text-sm text-muted2 mt-2 leading-relaxed">
              Our belief is simple: your previous work, struggles, and detours still contain useful signals. The right platform should help you read those signals and turn them into a plan.
            </p>
          </div>
        </div>

        <section className="mt-8 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {values.map(([title, text, Icon]) => (
            <div key={title} className="surface-gradient border border-line rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
              <Icon className="text-brand" size={20} />
              <h3 className="font-heading font-bold text-sm sm:text-base text-ink mt-2 sm:mt-3">{title}</h3>
              <p className="text-xs sm:text-sm text-muted2 mt-1.5 leading-relaxed">{text}</p>
            </div>
          ))}
        </section>
      </main>
    </PublicShell>
  );
}
