import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Database,
  GraduationCap,
  Headphones,
  Map,
  MapPinned,
  MessageCircle,
  Mic,
  Repeat2,
  Star,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import PublicShell from "../components/PublicShell";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";

const audiences = [
  ["BPO & Telecallers", "Turn communication, patience, and CRM discipline into customer success, sales, operations, or support roles.", Users],
  ["Backoffice & Data Entry", "Move from repetitive tasks into analytics, operations, MIS, QA, or process leadership.", Database],
  ["Graduates With No Direction", "Convert your degree into a practical roadmap instead of wasting months comparing random courses.", GraduationCap],
  ["Career Switchers", "Use your past experience as a bridge into a better-fit career path, not as a burden.", Repeat2],
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

const journey = [
  ["Discover Yourself", "Answer a few simple questions about your background, interests, and goals.", Target],
  ["Get Your Career Map", "Receive AI-powered career recommendations tailored for your unique journey.", MapPinned],
  ["Follow Your Roadmap", "Understand the skills, steps, and resources to reach your goal faster.", ClipboardCheck],
  ["Achieve Your Goals", "Build confidence, switch smarter, and grow in a career that truly fits.", Trophy],
];

function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[520px] min-h-[330px] sm:min-h-[430px] text-ink">
      <svg viewBox="0 0 560 470" role="img" aria-label="Career roadmap illustration" className="absolute inset-0 h-full w-full">
        <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.26">
          <path d="M452 62c16-21 52-9 55 17 17-4 33 4 41 19H472" />
          <path d="M410 252c16-21 52-9 55 17 17-4 33 4 41 19H430" />
          <path d="M80 316c14 17 36 26 62 28M74 318c8-18 22-27 43-26M105 302c2-21 13-37 32-48M144 310c13-8 27-9 44-5" />
        </g>

        <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M255 172v210" />
          <path d="M232 382h45" />
          <path d="M245 172h22" />
          <path d="M181 77l88-25 28 31-26 25-91-15z" fill="#F7FAFD" />
          <text x="215" y="89" fontSize="17" fill="#061B4F" transform="rotate(12 215 89)" fontWeight="700">Consultant</text>
          <path d="M170 132l106 7 18 27-23 18-114-13z" fill="#F7FAFD" />
          <text x="214" y="159" fontSize="17" fill="#061B4F" transform="rotate(4 214 159)" fontWeight="700">Marketer</text>
          <path d="M190 193l106 3 18 23-22 20-112-9z" fill="#F7FAFD" />
          <text x="225" y="220" fontSize="17" fill="#0B9BD4" fontWeight="800">Aviation</text>
          <path d="M181 255l112 2 18 22-22 20-118-7z" fill="#F7FAFD" />
          <text x="231" y="282" fontSize="17" fill="#061B4F" fontWeight="700">Tech</text>
          <path d="M166 320h124l14 19-13 18H171l-17-18z" fill="#F7FAFD" />
          <text x="206" y="344" fontSize="17" fill="#061B4F" fontWeight="700">Govt. Service</text>
        </g>

        <g transform="translate(407 152)">
          <circle cx="68" cy="68" r="54" fill="#F7FAFD" stroke="#0B9BD4" strokeWidth="8" />
          <path d="M68 1v20M68 115v20M1 68h20M115 68h20" stroke="#061B4F" strokeWidth="3" strokeLinecap="round" />
          <path d="M96 36L76 79 40 102 61 59z" fill="#0B9BD4" stroke="#061B4F" strokeWidth="3" />
          <circle cx="68" cy="68" r="7" fill="#061B4F" />
        </g>

        <g fill="none" stroke="#061B4F" strokeWidth="2.2" strokeLinecap="round" opacity="0.64">
          <path d="M355 344c72-68 120-60 185-52" />
          <path d="M334 408c54-78 114-102 205-99" />
          <path d="M415 382c43-37 83-51 130-47" />
          <path d="M350 346c-21 9-46 15-76 19" opacity="0.26" />
        </g>
      </svg>
    </div>
  );
}

function JourneyCard() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-1 sm:-mt-2 pb-10 sm:pb-14">
      <div className="rounded-[2rem] border border-line bg-white p-5 sm:p-8 lg:p-10 shadow-soft">
        <div className="text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-ink">Your Career Journey Starts Here</h2>
          <p className="mt-2 text-sm sm:text-base font-semibold text-muted2">Personalized guidance | Practical roadmap | Real results</p>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {journey.map(([title, text, Icon], index) => (
            <div key={title} className="relative text-center">
              {index < journey.length - 1 && (
                <ArrowRight className="absolute right-[-20px] top-12 hidden text-brand lg:block" size={34} strokeWidth={2.4} />
              )}
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-brand-50">
                <Icon size={58} className="text-brand-800" strokeWidth={1.8} />
              </div>
              <h3 className="mt-5 font-heading text-lg font-extrabold text-ink">{title}</h3>
              <p className="mx-auto mt-2 max-w-[220px] text-sm leading-relaxed text-ink/82">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-10 sm:pb-12 grid lg:grid-cols-[1.02fr_0.98fr] gap-8 items-center">
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs sm:text-sm font-bold text-ink shadow-[0_10px_30px_rgba(6,27,79,0.04)]">
            <Star size={15} className="text-brand" /> For late starters, BPO workers and confused graduates
          </span>
          <h1 className="mt-6 font-heading text-4xl sm:text-5xl lg:text-[4rem] font-extrabold leading-[1.08] tracking-tight text-ink">
            You are not late.
            <span className="block">You just <span className="text-brand">need the</span></span>
            <span className="block text-brand">right career map.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-muted2">
            Latecomers AI helps you find a practical career path, understand why it fits, and follow a step-by-step roadmap to move from confusion to action.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-6">
            <button onClick={startJourney} className="inline-flex items-center gap-2 rounded-2xl bg-ink px-6 py-4 text-sm sm:text-base font-bold text-white shadow-brand transition hover:bg-brand-800">
              Take the career quiz <ArrowRight size={18} />
            </button>
            <a href="#how" className="inline-flex items-center gap-2 px-1 py-3 text-sm sm:text-base font-extrabold text-ink transition hover:text-brand">
              See how it works <ArrowRight size={18} />
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-muted2">
            {["No signup needed", "Switcher-friendly", "Takes 5 min", "100% Free"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <CheckCircle2 size={18} className="text-ink" /> {item}
              </span>
            ))}
          </div>
        </div>

        <HeroIllustration />
      </section>

      <JourneyCard />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16">
        <p className="text-xs font-extrabold tracking-[0.22em] text-brand uppercase">Who is this for?</p>
        <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink mt-2">Built for people the system forgot.</h2>
        <p className="text-sm sm:text-base text-muted2 mt-3 max-w-3xl leading-relaxed">
          Most career platforms speak to perfect freshers. Latecomers AI is for people who have lived a little, worked a little, struggled a little, and now want a real next step.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {audiences.map(([title, text, Icon]) => (
            <div key={title} className="flex gap-4 rounded-2xl border border-line bg-white p-4 shadow-[0_10px_28px_rgba(6,27,79,0.04)] transition hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-brand">
                <Icon size={26} />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-ink leading-tight">{title}</h3>
                <p className="text-sm text-ink/82 mt-1 leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="bg-white border-y border-line py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-extrabold tracking-[0.22em] text-brand uppercase">How it works</p>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink mt-2">From confused to career-ready in 4 steps.</h2>
          <div className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {steps.map(([title, text], index) => (
              <div key={title} className="bg-brand-50 border border-line rounded-2xl p-4 hover:-translate-y-1 hover:shadow-soft transition">
                <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center text-sm font-bold">{index + 1}</div>
                <h3 className="font-heading font-bold text-sm text-ink mt-3 leading-tight">{title}</h3>
                <p className="text-xs text-muted2 mt-2 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-extrabold tracking-[0.22em] text-brand uppercase">What you get</p>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink mt-2">Everything you need to move forward.</h2>
          <div className="mt-7 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {features.map(([title, Icon]) => (
              <div key={title} className="bg-white border border-line rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-1 hover:shadow-soft transition">
                <div className="w-10 h-10 rounded-2xl bg-brand text-white flex items-center justify-center shrink-0">
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
