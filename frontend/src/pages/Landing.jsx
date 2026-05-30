import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Building2,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  Cloud,
  Code2,
  FileSpreadsheet,
  GraduationCap,
  Headphones,
  HeartPulse,
  IndianRupee,
  LineChart,
  Map,
  MapPinned,
  Megaphone,
  MessageCircle,
  Mic,
  Palette,
  Play,
  Repeat2,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  User,
  UserCheck,
  Users,
  WalletCards,
} from "lucide-react";
import PublicShell from "../components/PublicShell";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";
import { faqSchema, organizationSchema, softwareAppSchema, websiteSchema } from "../lib/seoSchemas";

const audiences = [
  ["Late Starters", "Starting your journey after a break or later in life.", User],
  ["Job Switchers", "Want to switch your career to something better.", Repeat2],
  ["Graduates", "Confused about what to do after 12th or graduation.", GraduationCap],
  ["Confused Professionals", "Not sure if you're on the right path.", UserCheck],
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

const popularCareers = [
  ["UI/UX Designer", "Design", "High Demand", Palette, "from-purple-500 to-violet-700"],
  ["Data Analyst", "Analytics", "High Growth", BarChart3, "from-cyan-400 to-sky-600"],
  ["DevOps Engineer", "IT & Cloud", "High Salary", Cloud, "from-blue-400 to-indigo-600"],
  ["Cybersecurity Analyst", "Security", "High Growth", ShieldCheck, "from-blue-500 to-violet-700"],
  ["Makeup Artist", "Creative", "Flexible", Sparkles, "from-pink-400 to-fuchsia-600"],
  ["Cloud Engineer", "IT & Cloud", "High Salary", Cloud, "from-sky-400 to-blue-700"],
  ["Medical Coder", "Healthcare", "Stable", HeartPulse, "from-purple-500 to-pink-500"],
  ["CA Foundation", "Commerce", "Elite Path", Calculator, "from-emerald-400 to-teal-600"],
  ["B.Com / BAF", "Accounts", "Degree Track", BookOpen, "from-amber-400 to-orange-600"],
  ["BBA / BMS", "Management", "Business", BriefcaseBusiness, "from-indigo-400 to-purple-600"],
  ["Financial Modeling", "Finance", "High Value", LineChart, "from-lime-400 to-emerald-600"],
  ["Tally + GST", "Accounting", "Job Ready", FileSpreadsheet, "from-rose-400 to-pink-600"],
];

const heroPills = [
  ["Full Stack Developer", Code2, "left-[5%] top-[9%]"],
  ["Cybersecurity Analyst", ShieldCheck, "left-0 top-[40%]"],
  ["Medical Coder", HeartPulse, "left-[10%] bottom-[14%]"],
  ["Social Media Manager", Megaphone, "right-0 top-[12%]"],
  ["Finance Analyst", WalletCards, "right-[3%] top-[42%]"],
  ["Data Analyst", BarChart3, "right-[7%] bottom-[12%]"],
];

function JourneyCard() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-1 sm:-mt-2 pb-8 sm:pb-14">
      <div className="rounded-2xl sm:rounded-[2rem] border border-line bg-white p-3.5 sm:p-8 lg:p-10 shadow-soft">
        <div className="text-center">
          <h2 className="font-heading text-lg sm:text-3xl font-extrabold text-ink">Your Career Journey Starts Here</h2>
          <p className="mt-1.5 text-xs sm:text-base font-semibold text-muted2">Personalized guidance - Practical roadmap - Real results</p>
        </div>
        <div className="mt-5 sm:mt-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-4">
          {journey.map(([title, text, Icon], index) => (
            <div key={title} className="relative text-center">
              {index < journey.length - 1 && (
                <ArrowRight className="absolute right-[-20px] top-12 hidden text-brand lg:block" size={34} strokeWidth={2.4} />
              )}
              <div className="mx-auto flex h-16 w-16 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-brand-50">
                <Icon size={32} className="text-brand-800 sm:hidden" strokeWidth={1.8} />
                <Icon size={58} className="text-brand-800 hidden sm:block" strokeWidth={1.8} />
              </div>
              <h3 className="mt-2.5 sm:mt-5 font-heading text-xs sm:text-lg font-extrabold text-ink">{title}</h3>
              <p className="mx-auto mt-1 sm:mt-2 max-w-[220px] text-[10px] sm:text-sm leading-relaxed text-ink/82">{text}</p>
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
        path="/"
        jsonLd={[
          organizationSchema(),
          websiteSchema(),
          softwareAppSchema(),
          faqSchema([
            {
              question: "Who is Latecomers AI for?",
              answer: "Latecomers AI is for BPO workers, confused graduates, students, late starters, and career switchers in India who need practical career direction.",
            },
            {
              question: "How much does Latecomers AI start at?",
              answer: "Latecomers AI plans start at Rs 9 for basic career results.",
            },
            {
              question: "What does Latecomers AI provide?",
              answer: "Latecomers AI provides career matching, practical roadmaps, institute search, scholarship guidance, mock interviews, and AI career chat.",
            },
          ]),
        ]}
      />

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fff_0%,#fff_55%,#FCF8FF_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(560px_320px_at_74%_12%,rgba(236,72,153,0.11),transparent_62%),radial-gradient(620px_360px_at_94%_24%,rgba(124,44,242,0.12),transparent_62%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-6 sm:pb-10 grid lg:grid-cols-[0.92fr_1.08fr] gap-5 sm:gap-8 lg:gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-2 text-[11px] sm:text-sm font-extrabold text-brand shadow-[0_10px_28px_rgba(124,44,242,0.08)]">
              <Star size={14} className="fill-pink-500 text-pink-500" />
              AI-Powered Career Guidance
            </span>
            <h1 className="mt-5 font-heading text-[2.15rem] min-[390px]:text-[2.35rem] sm:text-5xl lg:text-[4rem] font-black leading-[1.08] text-ink">
              You Are Not Late.
              <span className="block">You Just Need the</span>
              <span className="block">Right <span className="premium-text-gradient">Career Map.</span></span>
            </h1>
            <p className="mt-5 max-w-xl text-sm sm:text-lg leading-relaxed text-ink/82">
              Get AI-powered career suggestions, step-by-step roadmaps, and the right skills to build a future you'll love.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button onClick={startJourney} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-brand px-4 sm:px-7 py-3 text-sm sm:text-base font-extrabold text-white shadow-brand transition hover:from-brand-700 hover:to-pink-500">
                Take the Career Quiz <ArrowRight size={17} />
              </button>
              <a href="#how" className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 sm:px-7 py-3 text-sm sm:text-base font-extrabold text-ink transition hover:border-brand hover:text-brand">
                <Play size={15} className="fill-ink" /> Watch How It Works
              </a>
            </div>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-3 max-w-2xl">
              {[
                ["AI-Powered Matching", Sparkles],
                ["Personalized Roadmaps", Map],
                ["Affordable Guidance", IndianRupee],
                ["For Every Background", Users],
              ].map(([label, Icon]) => (
                <div key={label} className="flex items-center gap-2 text-[10px] min-[390px]:text-[11px] sm:text-xs font-extrabold text-ink">
                  <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand">
                    <Icon size={14} className="sm:hidden" />
                    <Icon size={16} className="hidden sm:block" />
                  </span>
                  <span className="leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-0 sm:min-h-[470px]">
            <div className="absolute inset-8 hidden rounded-full border border-dashed border-brand/20 sm:block" />
            <div className="relative mx-auto w-full max-w-[280px] rounded-[1.1rem] border border-line bg-white p-4 shadow-[0_20px_48px_rgba(124,44,242,0.16)] sm:absolute sm:left-1/2 sm:top-1/2 sm:w-[290px] sm:max-w-none sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[1.4rem] sm:p-6 sm:shadow-[0_24px_65px_rgba(124,44,242,0.18)]">
              <div className="flex items-start justify-between gap-3 text-xs font-extrabold text-ink">
                <span>Your AI Career Match</span>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] text-emerald-700">95% Match</span>
              </div>
              <div className="mt-4 sm:mt-6 text-center">
                <div className="mx-auto flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-brand to-pink-500 text-white shadow-brand">
                  <Palette size={24} className="sm:hidden" />
                  <Palette size={32} className="hidden sm:block" />
                </div>
                <h2 className="mt-3 sm:mt-4 font-heading text-lg sm:text-2xl font-black text-ink">UI/UX Designer</h2>
                <div className="mt-3 inline-flex rounded-lg bg-brand-100 px-3 py-1 text-[11px] font-extrabold text-brand-800">
                  Creative - High Growth - In Demand
                </div>
              </div>
              <div className="mt-4 sm:mt-5 space-y-2">
                <p className="text-xs font-black text-ink">Why this career?</p>
                {["Great fit for your personality", "High demand in the market", "Good growth & future scope"].map((item) => (
                  <p key={item} className="flex items-center gap-2 text-xs font-semibold text-ink/78">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    {item}
                  </p>
                ))}
              </div>
              <button onClick={startJourney} className="mt-4 sm:mt-5 w-full rounded-lg bg-gradient-to-r from-brand-600 to-brand py-2.5 sm:py-3 text-sm font-extrabold text-white shadow-brand">
                View Full Roadmap
              </button>
            </div>

            {heroPills.map(([label, Icon, position]) => (
              <div key={label} className={`absolute hidden sm:flex ${position} items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_16px_40px_rgba(124,44,242,0.14)] border border-line`}>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand">
                  <Icon size={21} />
                </span>
                <span className="max-w-[118px] text-xs font-black leading-tight text-ink">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-7 sm:pb-9">
          <h2 className="text-center font-heading text-xl sm:text-xl font-black text-ink">Popular Career Paths</h2>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-12 gap-2.5 sm:gap-3">
            {popularCareers.map(([title, tag1, tag2, Icon, gradient]) => (
              <Link key={title} to="/careers-explore" className="rounded-lg border border-line bg-white p-2.5 sm:p-3 text-center shadow-[0_10px_30px_rgba(22,7,65,0.045)] transition hover:-translate-y-0.5 hover:shadow-soft">
                <span className={`mx-auto flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br ${gradient} text-white`}>
                  <Icon size={18} className="sm:hidden" />
                  <Icon size={24} className="hidden sm:block" />
                </span>
                <h3 className="mt-2 sm:mt-3 min-h-[28px] sm:min-h-[34px] text-[11px] sm:text-xs font-black leading-tight text-ink">{title}</h3>
                <div className="mt-1.5 sm:mt-2 flex flex-wrap justify-center gap-1 text-[8.5px] sm:text-[9px] font-bold text-muted2">
                  <span>{tag1}</span>
                  <span>{tag2}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-5 text-center">
            <Link to="/careers-explore" className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-brand px-7 py-3 text-sm font-extrabold text-white shadow-brand">
              Explore 50+ Careers <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12">
          <div className="rounded-2xl bg-brand-50 px-4 py-5 sm:px-7 sm:py-6">
            <h2 className="text-center font-heading text-lg sm:text-xl font-black text-ink">Who Is This For?</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {audiences.map(([title, text, Icon]) => (
                <div key={title} className="flex items-center gap-3 lg:border-r lg:border-line last:border-r-0 lg:pr-4">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-brand shadow-[0_12px_32px_rgba(124,44,242,0.12)]">
                    <Icon size={30} />
                  </span>
                  <span>
                    <h3 className="font-heading text-sm font-black text-ink">{title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-ink/78">{text}</p>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <JourneyCard />

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
