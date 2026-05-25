import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Brain, Building2, CheckCircle2, GraduationCap, Headphones, Map, MessageCircle, Mic, Sparkles, UserRoundCheck } from "lucide-react";
import PublicShell from "../components/PublicShell";
import { useAuth } from "../context/AuthContext";

const audiences = [
  ["BPO & Telecallers", "Your communication skills are real assets. We show where they can take you next."],
  ["Backoffice & Data Entry", "Your process thinking can grow into analytics, operations, and admin leadership."],
  ["Graduates With No Direction", "You're not behind. You need a clearer map from your degree to a practical next step."],
  ["Career Switchers", "Your past experience still matters. Connect the dots and restart with confidence."],
];

const features = [
  ["Career Match Score", Brain],
  ["Step-by-Step Roadmap", Map],
  ["Institute Search", Building2],
  ["Scholarship Finder", GraduationCap],
  ["Mock Interviews", Mic],
  ["AI Career Chat", MessageCircle],
];

const steps = [
  ["Tell us about yourself", "Answer a simple quiz about your background, interests, and goals."],
  ["Get your AI career match", "See careers that fit you, with salary ranges and clear reasons."],
  ["Follow your roadmap", "Month-by-month plan with skills, courses, projects, and timelines."],
  ["Land the job", "Mock interviews, scholarships, institutes, and AI guidance until your first offer."],
];

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const startJourney = () => navigate(isAuthenticated ? "/dashboard" : "/signin");

  return (
    <PublicShell>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 lg:pt-16 pb-8 sm:pb-10 grid lg:grid-cols-[1.05fr_0.95fr] gap-6 sm:gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-line text-[11px] sm:text-sm font-semibold text-muted2">
            <Sparkles size={12} className="text-brand" /> AI-powered career guidance
          </span>
          <h1 className="font-heading font-extrabold tracking-tight text-2xl sm:text-4xl lg:text-6xl text-ink mt-3 sm:mt-5 leading-[1.1]">
            You didn't start late.
            <span className="block text-brand mt-1">You started at the right time.</span>
          </h1>
          <p className="mt-3 sm:mt-5 text-sm sm:text-base text-muted2 max-w-2xl leading-relaxed">
            Whether you're stuck in a BPO, grinding in backoffice, or sitting with a degree and no direction — your career story is not over. We tell you which career fits you, and exactly how to get there.
          </p>
          <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
            <button onClick={startJourney} className="inline-flex items-center gap-2 bg-brand hover:bg-brand-600 text-white font-semibold text-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-brand">
              Find my career path <ArrowRight size={16} />
            </button>
            <a href="#how" className="inline-flex items-center gap-1.5 text-ink font-semibold text-sm px-3 py-2.5">
              How it works <ArrowRight size={14} />
            </a>
          </div>
          <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] sm:text-xs text-muted2">
            {["All Career Options", "No resume needed", "Takes 5 min", "₹9 to unlock"].map((item) => (
              <span key={item} className="inline-flex items-center gap-1">
                <CheckCircle2 size={12} className="text-brand" /> {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="bg-white border border-line rounded-2xl sm:rounded-3xl shadow-soft p-3 sm:p-5">
            <img src="/brand/latecomers-logo.jpeg" alt="Latecomers logo" className="w-full rounded-xl sm:rounded-2xl border border-line object-cover" />
            <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3">
              {[
                ["12,000+", "Careers discovered"],
                ["89%", "Match accuracy"],
                ["320+", "Scholarships"],
                ["4.8", "User rating"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl sm:rounded-2xl bg-brand-50 border border-line p-2.5 sm:p-3">
                  <p className="font-heading font-extrabold text-base sm:text-xl text-ink">{value}</p>
                  <p className="text-[10px] sm:text-xs text-muted2 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who is this for */}
      <section className="bg-white border-y border-line py-8 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand uppercase">Who is this for?</p>
          <h2 className="font-heading font-extrabold text-xl sm:text-3xl lg:text-4xl text-ink mt-2">Built for people the system forgot.</h2>
          <p className="text-sm sm:text-base text-muted2 mt-2 max-w-3xl leading-relaxed">
            Most career platforms are for freshers with perfect resumes. We're built for everyone else.
          </p>
          <div className="mt-5 sm:mt-8 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {audiences.map(([title, text]) => (
              <div key={title} className="surface-gradient border border-line rounded-xl sm:rounded-2xl p-3 sm:p-4">
                <UserRoundCheck className="text-brand mb-2 sm:mb-3" size={18} />
                <h3 className="font-heading font-bold text-xs sm:text-sm text-ink leading-tight">{title}</h3>
                <p className="text-[10px] sm:text-xs text-muted2 mt-1.5 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand uppercase">How it works</p>
        <h2 className="font-heading font-extrabold text-xl sm:text-3xl lg:text-4xl text-ink mt-2">From confused to career-ready in 4 steps.</h2>
        <div className="mt-5 sm:mt-8 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          {steps.map(([title, text], index) => (
            <div key={title} className="bg-white border border-line rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs sm:text-sm font-bold">{index + 1}</div>
              <h3 className="font-heading font-bold text-xs sm:text-sm text-ink mt-2 sm:mt-3 leading-tight">{title}</h3>
              <p className="text-[10px] sm:text-xs text-muted2 mt-1.5 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-y border-line py-8 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand uppercase">What you get</p>
          <h2 className="font-heading font-extrabold text-xl sm:text-3xl lg:text-4xl text-ink mt-2">Everything you need. Nothing you don't.</h2>
          <div className="mt-5 sm:mt-8 grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
            {features.map(([title, Icon]) => (
              <div key={title} className="surface-gradient border border-line rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-4">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-brand-50 text-brand flex items-center justify-center shrink-0"><Icon size={18} /></div>
                <p className="font-heading font-bold text-xs sm:text-sm text-ink">{title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 text-center">
        <Headphones className="mx-auto text-brand" size={28} />
        <h2 className="font-heading font-extrabold text-xl sm:text-3xl lg:text-4xl text-ink mt-3">Late But not Lost.</h2>
        <p className="text-sm sm:text-base text-muted2 mt-2 max-w-xl mx-auto">Start with one honest quiz. Leave with a direction you can actually follow.</p>
        <div className="mt-5 flex justify-center gap-2.5 flex-wrap">
          <button onClick={startJourney} className="inline-flex items-center gap-2 bg-brand hover:bg-brand-600 text-white font-semibold text-sm px-5 py-2.5 sm:py-3 rounded-full shadow-brand">
            Start now <ArrowRight size={16} />
          </button>
          <Link to="/pricing" className="inline-flex items-center gap-2 bg-white border border-line text-ink font-semibold text-sm px-5 py-2.5 sm:py-3 rounded-full">
            View plans
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
