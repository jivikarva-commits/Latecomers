import React from "react";
import { ArrowRight, BarChart3, Building2, CheckCircle2, ClipboardList, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import PublicShell from "../components/PublicShell";
import SEO from "../components/SEO";

const benefits = [
  ["Reach learners with intent", "Students come after identifying a target career, budget, city, and timeline.", Users],
  ["Show practical course fit", "Position your courses against career outcomes, not just generic brochure text.", Building2],
  ["Improve lead quality", "Latecomers users already understand why they need the skill before they enquire.", BarChart3],
];

const trust = [
  "Verified institute profile",
  "Career-page course discovery",
  "Location and budget-aware matching",
  "Lead-ready contact flow",
  "Scholarship and affordability context",
  "B2B partnership support",
];

export default function ForInstitutes() {
  return (
    <PublicShell>
      <SEO
        title="For Institutes - Partner with Latecomers AI"
        description="Partner with Latecomers AI to reach career-ready learners looking for practical training, upskilling courses, institutes, and coaching in India."
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <section className="grid lg:grid-cols-[1fr_0.9fr] gap-10 items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.28em] text-brand uppercase">For Institutes</p>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-ink mt-3 leading-tight">
              Meet learners who already know why they need training.
            </h1>
            <p className="text-muted2 mt-5 text-base sm:text-lg leading-relaxed">
              Latecomers AI connects institutes, coaching centers, and upskilling providers with students and working professionals who are actively choosing a career path, comparing options, and preparing to take action.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/contact" className="inline-flex items-center gap-2 premium-gradient text-white font-semibold px-6 py-3.5 rounded-full shadow-brand">
                Become a partner <ArrowRight size={18} />
              </Link>
              <Link to="/careers-explore" className="inline-flex items-center gap-2 bg-white border border-line text-ink font-semibold px-6 py-3.5 rounded-full">
                See career categories
              </Link>
            </div>
          </div>

          <div className="bg-white border border-line rounded-3xl p-5 sm:p-6 shadow-soft premium-ring">
            <div className="premium-gradient rounded-2xl p-5 text-white">
              <ClipboardList size={30} />
              <p className="font-heading font-extrabold text-2xl mt-4">Higher-intent education leads</p>
              <p className="text-white/80 text-sm mt-2 leading-relaxed">A cleaner funnel for institutes that teach job-ready skills.</p>
            </div>
            <div className="mt-4 space-y-2">
              {benefits.map(([title, text, Icon]) => (
                <div key={title} className="flex items-start gap-3 rounded-2xl bg-brand-50 border border-line p-4">
                  <div className="w-10 h-10 rounded-xl bg-white text-brand flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-ink">{title}</p>
                    <p className="text-sm text-muted2 mt-1 leading-relaxed">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12 bg-white border border-line rounded-3xl p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <ShieldCheck className="text-brand shrink-0" size={26} />
            <div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink">Built for trust and conversion</h2>
              <p className="text-muted2 mt-2 leading-relaxed">The best leads are not the loudest leads. They are learners with a clear career goal, realistic budget, and urgency to start.</p>
            </div>
          </div>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {trust.map((item) => (
              <div key={item} className="surface-gradient border border-line rounded-2xl p-4 flex items-start gap-3">
                <CheckCircle2 className="text-brand shrink-0 mt-0.5" size={18} />
                <p className="font-semibold text-ink text-sm">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
