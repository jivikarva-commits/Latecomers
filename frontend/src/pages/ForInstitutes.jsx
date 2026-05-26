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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <section className="grid lg:grid-cols-[1fr_0.9fr] gap-5 sm:gap-8 items-center">
          <div>
            <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand uppercase">For Institutes</p>
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink mt-2 leading-tight">
              Meet learners who already know why they need training.
            </h1>
            <p className="text-muted2 mt-2 text-sm sm:text-base leading-relaxed">
              Latecomers AI connects institutes, coaching centers, and upskilling providers with students and working professionals who are actively choosing a career path, comparing options, and preparing to take action.
            </p>
            <div className="mt-4 sm:mt-5 flex flex-wrap gap-2.5">
              <Link to="/contact" className="inline-flex items-center gap-1.5 premium-gradient text-white font-semibold px-4 sm:px-5 py-2.5 rounded-full shadow-brand text-xs sm:text-sm">
                Become a partner <ArrowRight size={14} />
              </Link>
              <Link to="/careers-explore" className="inline-flex items-center gap-1.5 bg-white border border-line text-ink font-semibold px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm">
                See career categories
              </Link>
            </div>
          </div>

          <div className="bg-white border border-line rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-soft premium-ring">
            <div className="premium-gradient rounded-xl sm:rounded-2xl p-3.5 sm:p-4 text-white">
              <ClipboardList size={22} />
              <p className="font-heading font-extrabold text-base sm:text-xl mt-2.5">Higher-intent education leads</p>
              <p className="text-white/80 text-xs sm:text-sm mt-1.5 leading-relaxed">A cleaner funnel for institutes that teach job-ready skills.</p>
            </div>
            <div className="mt-3 space-y-2">
              {benefits.map(([title, text, Icon]) => (
                <div key={title} className="flex items-start gap-2.5 rounded-xl bg-brand-50 border border-line p-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white text-brand flex items-center justify-center shrink-0">
                    <Icon size={15} />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-xs sm:text-sm text-ink">{title}</p>
                    <p className="text-[10px] sm:text-xs text-muted2 mt-0.5 leading-relaxed">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 sm:mt-10 bg-white border border-line rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="text-brand shrink-0" size={20} />
            <div>
              <h2 className="font-heading font-extrabold text-base sm:text-xl text-ink">Built for trust and conversion</h2>
              <p className="text-muted2 mt-1.5 text-xs sm:text-sm leading-relaxed">The best leads are not the loudest leads. They are learners with a clear career goal, realistic budget, and urgency to start.</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
            {trust.map((item) => (
              <div key={item} className="surface-gradient border border-line rounded-xl p-2.5 sm:p-3 flex items-start gap-2">
                <CheckCircle2 className="text-brand shrink-0 mt-0.5" size={14} />
                <p className="font-semibold text-ink text-[10px] sm:text-xs">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
