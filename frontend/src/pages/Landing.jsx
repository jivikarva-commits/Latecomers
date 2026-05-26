import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Brain, Building2, CheckCircle2, GraduationCap, Headphones, Map, MessageCircle, Mic, Sparkles, UserRoundCheck } from "lucide-react";
import PublicShell from "../components/PublicShell";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";

const audiences = [
  ["BPO & Telecallers", "Turn communication, patience, and CRM discipline into customer success, sales, operations, or support roles."],
  ["Backoffice & Data Entry", "Move from repetitive tasks into analytics, operations, MIS, QA, or process leadership."],
  ["Graduates With No Direction", "Convert your degree into a practical roadmap instead of wasting months comparing random courses."],
  ["Career Switchers", "Use your past experience as a bridge into a better-fit career path, not as a burden."],
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
  ["Tell us where you are", "Answer a simple quiz about education, work history, strengths, interests, and goals."],
  ["Get a realistic match", "See careers that fit your current profile, salary goals, learning style, and confidence level."],
  ["Follow your roadmap", "Build skills month by month with courses, projects, institutes, and interview preparation."],
  ["Move with proof", "Practice answers, save options, compare paths, and apply with a story that makes sense."],
];

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const startJourney = () => navigate(isAuthenticated ? "/dashboard" : "/signin");

  return (
    <PublicShell>
      <SEO
        title="Latecomers AI - Career Guidance for Late Starters"
        description="Latecomers AI helps BPO workers, confused graduates, students, and career switchers in India find practical career paths, roadmaps, institutes, scholarships, mock interviews, and AI guidance."
      />

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-10 sm:pb-14 grid lg:grid-cols-[1.05fr_0.95fr] gap-8 sm:gap-10 items-center">
        <div className="absolute inset-x-4 top-6 h-48 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.12),transparent_65%)] pointer-events-none" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-line text-[11px] sm:text-sm font-semibold text-muted2 shadow-soft">
            <Sparkles size={12} className="text-brand" /> For late starters, BPO workers and confused graduates
          </span>
          <h1 className="font-heading font-extrabold tracking-tight text-3xl sm:text-5xl lg:text-6xl text-ink mt-4 sm:mt-5 leading-[1.05]">
            You are not late.
            <span className="block premium-text-gradient mt-1">You just need the right career map.</span>
          </h1>
          <p className="mt-4 sm:mt-5 text-sm sm:text-lg text-muted2 max-w-2xl leading-relaxed">
            Latecomers AI helps you find a practical career path, understand why it fits, and follow a step-by-step roadmap to move from confusion to action.
          </p>
          <div className="mt-5 sm:mt-7 flex flex-wrap items-center gap-2 sm:gap-3">
            <button onClick={startJourney} className="inline-flex items-center gap-2 premium-gradient hover:opacity-95 text-white font-semibold text-sm px-5 py-3 rounded-full shadow-brand">
              Take the career quiz <ArrowRight size={16} />
            </button>
            <a href="#how" className="inline-flex items-center gap-1.5 text-ink font-semibold text-sm px-3 py-3">
              See how it works <ArrowRight size={14} />
            </a>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] sm:text-xs text-muted2">
            {["No resume needed", "Switcher-friendly", "Takes 5 min", "Starts at ₹9"].map((item) => (
              <span key={item} className="inline-flex items-center gap-1">
                <CheckCircle2 size={12} className="text-brand" /> {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative bg-white/90 border border-line rounded-3xl shadow-soft p-3 sm:p-5 premium-ring">
            <img src="/brand/latecomers-logo.png" alt="Latecomers AI logo" className="w-full rounded-2xl border border-line object-cover" loading="eager" decoding="async" />
            <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3">
              {[
                ["150+", "Career paths"],
                ["5 min", "Quiz time"],
                ["₹9", "Starter plan"],
                ["24/7", "AI guidance"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-brand-50 border border-line p-3 hover:-translate-y-0.5 transition">
                  <p className="font-heading font-extrabold text-xl text-ink">{value}</p>
                  <p className="text-xs text-muted2 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-line py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand uppercase">Who is this for?</p>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink mt-2">Built for people the system forgot.</h2>
          <p className="text-sm sm:text-base text-muted2 mt-3 max-w-3xl leading-relaxed">
            Most career platforms speak to perfect freshers. Latecomers AI is for people who have lived a little, worked a little, struggled a little, and now want a real next step.
          </p>
          <div className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {audiences.map(([title, text]) => (
              <div key={title} className="surface-gradient border border-line rounded-2xl p-4 hover:-translate-y-1 hover:shadow-soft transition">
                <div className="w-9 h-9 rounded-xl premium-gradient text-white flex items-center justify-center mb-3">
                  <UserRoundCheck size={17} />
                </div>
                <h3 className="font-heading font-bold text-sm text-ink leading-tight">{title}</h3>
                <p className="text-xs text-muted2 mt-2 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand uppercase">How it works</p>
        <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink mt-2">From confused to career-ready in 4 steps.</h2>
        <div className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {steps.map(([title, text], index) => (
            <div key={title} className="bg-white border border-line rounded-2xl p-4 hover:-translate-y-1 hover:shadow-soft transition">
              <div className="w-8 h-8 rounded-full premium-gradient text-white flex items-center justify-center text-sm font-bold">{index + 1}</div>
              <h3 className="font-heading font-bold text-sm text-ink mt-3 leading-tight">{title}</h3>
              <p className="text-xs text-muted2 mt-2 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-line py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand uppercase">What you get</p>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink mt-2">Everything you need to move forward.</h2>
          <div className="mt-7 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {features.map(([title, Icon]) => (
              <div key={title} className="surface-gradient border border-line rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-1 hover:shadow-soft transition">
                <div className="w-10 h-10 rounded-2xl premium-gradient text-white flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </div>
                <p className="font-heading font-bold text-sm text-ink">{title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center">
        <div className="premium-gradient rounded-3xl p-6 sm:p-10 text-white shadow-brand">
          <Headphones className="mx-auto text-white" size={28} />
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl mt-3">Late but not lost.</h2>
          <p className="text-sm sm:text-base text-white/82 mt-2 max-w-xl mx-auto">Start with one honest quiz. Leave with a direction you can actually follow.</p>
          <div className="mt-5 flex justify-center gap-2.5 flex-wrap">
            <button onClick={startJourney} className="inline-flex items-center gap-2 bg-white text-ink font-semibold text-sm px-5 py-3 rounded-full">
              Start now <ArrowRight size={16} />
            </button>
            <Link to="/pricing" className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-white font-semibold text-sm px-5 py-3 rounded-full">
              View plans
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
