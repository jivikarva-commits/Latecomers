import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Brain, Building2, CheckCircle2, GraduationCap, Headphones, Map, MessageCircle, Mic, Search, Sparkles, UserRoundCheck } from "lucide-react";
import PublicShell from "../components/PublicShell";
import { useAuth } from "../context/AuthContext";

const audiences = [
  ["BPO & Telecallers", "Your communication skills and resilience are real assets. We show where they can take you next."],
  ["Backoffice & Data Entry Workers", "Your process thinking can grow into analytics, operations, finance, and admin leadership paths."],
  ["Graduates With No Direction", "You are not behind. You need a clearer map from your degree to a practical next step."],
  ["Career Switchers at Any Age", "Your past experience still matters. Latecomers helps you connect the dots and restart with confidence."],
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
  ["Tell us about yourself", "Answer a simple quiz about your background, interests, personality, values, and goals."],
  ["Get your AI career match score", "See careers that fit you, with salary ranges, growth, and clear reasons."],
  ["Follow your personalised roadmap", "Get a month-by-month plan with skills, courses, projects, costs, and timelines."],
  ["Practice, apply, and land the job", "Use mock interviews, scholarships, institutes, and AI guidance until your first offer."],
];

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const startJourney = () => navigate(isAuthenticated ? "/dashboard" : "/signin");

  return (
    <PublicShell>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-10 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-line text-xs sm:text-sm font-semibold text-muted2">
            <Sparkles size={14} className="text-brand" /> AI-powered career guidance for late starters
          </span>
          <h1 className="font-heading font-extrabold tracking-normal text-4xl sm:text-6xl lg:text-7xl text-ink mt-5 leading-[1.02]">
            You didn't start late.
            <span className="block text-brand">You started at the right time.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted2 max-w-2xl leading-relaxed">
            Whether you're stuck in a BPO, grinding in backoffice, or sitting with a degree and no direction, your career story is not over. Latecomers looks at who you really are and tells you which career fits you, and exactly how to get there.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button onClick={startJourney} className="inline-flex items-center gap-2 bg-brand hover:bg-brand-600 text-white font-semibold px-5 sm:px-6 py-3.5 rounded-full shadow-brand">
              Find my career path <ArrowRight size={18} />
            </button>
            <a href="#how" className="inline-flex items-center gap-2 text-ink font-semibold px-4 py-3">
              See how it works <ArrowRight size={16} />
            </a>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted2">
            {["All Career Options", "No resume needed", "Takes 5 minutes", "₹9 to unlock full results"].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-brand" /> {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="bg-white border border-line rounded-3xl shadow-soft p-4 sm:p-6">
            <img src="/brand/latecomers-logo.jpeg" alt="Latecomers logo" className="w-full rounded-2xl border border-line object-cover" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ["12,000+", "Careers discovered"],
                ["89%", "Quiz match accuracy"],
                ["320+", "Active scholarships"],
                ["4.8", "User rating"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-brand-50 border border-line p-4">
                  <p className="font-heading font-extrabold text-2xl text-ink">{value}</p>
                  <p className="text-xs text-muted2 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-line py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold tracking-[0.28em] text-brand uppercase">Who is this for?</p>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-ink mt-3">Built for people the system forgot.</h2>
          <p className="text-muted2 mt-4 max-w-3xl leading-relaxed">
            Most career platforms are made for freshers with perfect resumes and clear goals. We are built for everyone else.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {audiences.map(([title, text]) => (
              <div key={title} className="surface-gradient border border-line rounded-2xl p-5">
                <UserRoundCheck className="text-brand mb-4" size={24} />
                <h3 className="font-heading font-bold text-lg text-ink">{title}</h3>
                <p className="text-sm text-muted2 mt-2 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <p className="text-xs font-bold tracking-[0.28em] text-brand uppercase">How it works</p>
        <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-ink mt-3">From confused to career-ready in 4 steps.</h2>
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          {steps.map(([title, text], index) => (
            <div key={title} className="bg-white border border-line rounded-2xl p-5">
              <div className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center font-bold">{index + 1}</div>
              <h3 className="font-heading font-bold text-lg text-ink mt-4">{title}</h3>
              <p className="text-sm text-muted2 mt-2 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-line py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold tracking-[0.28em] text-brand uppercase">What you get</p>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-ink mt-3">Everything you need. Nothing you don't.</h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(([title, Icon]) => (
              <div key={title} className="surface-gradient border border-line rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand flex items-center justify-center"><Icon size={22} /></div>
                <p className="font-heading font-bold text-ink">{title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
        <Headphones className="mx-auto text-brand" size={34} />
        <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-ink mt-4">Late But not Lost.</h2>
        <p className="text-muted2 mt-3 max-w-2xl mx-auto">Start with one honest quiz. Leave with a direction you can actually follow.</p>
        <div className="mt-7 flex justify-center gap-3 flex-wrap">
          <button onClick={startJourney} className="inline-flex items-center gap-2 bg-brand hover:bg-brand-600 text-white font-semibold px-6 py-3.5 rounded-full shadow-brand">
            Start now <ArrowRight size={18} />
          </button>
          <Link to="/pricing" className="inline-flex items-center gap-2 bg-white border border-line text-ink font-semibold px-6 py-3.5 rounded-full">
            View plans
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
