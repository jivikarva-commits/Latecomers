import React from "react";
import { ArrowRight, BarChart3, Building2, CheckCircle2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import PublicShell from "../components/PublicShell";

const benefits = [
  ["Reach serious learners", Users],
  ["Show courses, fees, and locations", Building2],
  ["Match with career-ready students", BarChart3],
];

export default function ForInstitutes() {
  return (
    <PublicShell>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid lg:grid-cols-[1fr_0.85fr] gap-10 items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.28em] text-brand uppercase">For Institutes</p>
            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-ink mt-3 leading-tight">Help late starters find the right training.</h1>
            <p className="text-muted2 mt-5 text-lg leading-relaxed">
              Latecomers connects learners to institutes and coaching centers based on their career goal, location, budget, and readiness.
            </p>
            <Link to="/contact" className="mt-7 inline-flex items-center gap-2 bg-brand text-white font-semibold px-6 py-3.5 rounded-full shadow-brand">
              Partner with us <ArrowRight size={18} />
            </Link>
          </div>
          <div className="bg-white border border-line rounded-3xl p-6 shadow-soft">
            {benefits.map(([title, Icon]) => (
              <div key={title} className="flex items-center gap-4 py-4 border-b border-line last:border-0">
                <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand flex items-center justify-center"><Icon size={21} /></div>
                <p className="font-heading font-bold text-ink">{title}</p>
              </div>
            ))}
          </div>
        </div>

        <section className="mt-12 grid md:grid-cols-3 gap-4">
          {["Verified institute profile", "Course discovery from career pages", "Lead-ready contact flow"].map((item) => (
            <div key={item} className="surface-gradient border border-line rounded-2xl p-5 flex items-start gap-3">
              <CheckCircle2 className="text-brand shrink-0" size={20} />
              <p className="font-semibold text-ink">{item}</p>
            </div>
          ))}
        </section>
      </main>
    </PublicShell>
  );
}
