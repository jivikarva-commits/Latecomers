import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  MapPinned,
  ShieldCheck,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import PublicShell from "../components/PublicShell";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";
import { faqSchema, organizationSchema, softwareAppSchema, websiteSchema } from "../lib/seoSchemas";

const stats = [
  ["12,000+", "Quizzes taken"],
  ["40+", "Career paths"],
  ["Rs 9", "Starting price"],
  ["4.8", "Avg. rating"],
  ["5 min", "To complete quiz"],
];

const steps = [
  ["Tell us where you are", "Answer a simple quiz about your education, work history, strengths, interests, and goals.", Target],
  ["Get a realistic match", "See careers that fit your current profile, salary goals, learning style, and confidence level.", MapPinned],
  ["Follow your roadmap", "Build skills month by month with courses, projects, institutes, and interview preparation.", ClipboardCheck],
  ["Move with proof", "Practice answers, save options, compare paths, and apply with a story that actually makes sense.", Trophy],
];

const audiences = [
  ["BPO & Telecallers", "Turn communication, patience, and CRM discipline into customer success, sales, operations, or support roles that actually value your experience.", Users],
  ["Backoffice & Data Entry", "Move from repetitive tasks into analytics, operations, MIS, QA, or process leadership. Your attention to detail is a superpower waiting to be unlocked.", Briefcase],
  ["Graduates With No Direction", "Convert your degree into a practical roadmap instead of wasting months comparing random courses online and still feeling lost.", GraduationCap],
  ["Career Switchers", "Use your past experience as a bridge into a better-fit career path, not as a burden. Every year you've worked counts.", ArrowRight],
];

const careerTracks = [
  ["Full Stack Developer", "Tech", "Build web apps, earn Rs 6-18 LPA. BCA/BSc or self-taught both welcome.", "Hot", Briefcase],
  ["Cybersecurity Analyst", "Tech", "Protect companies from hackers. High demand, ethical hacking certs open doors fast.", "Booming", ShieldCheck],
  ["DevOps Engineer", "Tech", "Automate deployments, manage cloud infra. Great switch for IT support backgrounds.", "Great switch", ClipboardCheck],
  ["Data Analyst", "Analytics", "Turn spreadsheets into insights. Excel, SQL and Power BI is all you need to start.", "High demand", Target],
  ["Cabin Crew / Air Hostess", "Aviation", "Customer service background is your biggest advantage. Airlines hire year-round.", "Growing", Users],
  ["Airport Ground Staff", "Aviation", "Check-in, boarding, cargo handling. Stable government and private roles available.", "Always open", Briefcase],
  ["Mehendi Artist", "Hidden gem", "Freelance, events, bridal bookings, Rs 500-Rs 5000 per session. Low investment.", "Underrated", Trophy],
  ["Makeup Artist", "Hidden gem", "Bridal, film, TV, fashion. Three month course and you can freelance immediately.", "Hidden gem", GraduationCap],
  ["UI/UX Designer", "Creative tech", "Design apps and websites. Figma is free to learn, portfolio matters more than degree.", "Creative", MapPinned],
  ["Social Media Manager", "Marketing", "Run brand pages, create content strategy. BPO communication skills transfer well.", "Fast start", Users],
  ["Medical Coder / Biller", "Healthcare", "Work-from-home friendly US healthcare sector. Three month training path.", "Stable", ClipboardCheck],
  ["SSC / Banking Officer", "Government", "UPSC, SSC CGL, IBPS. Structured 6-12 month prep roadmaps with clear exams.", "Secure", ShieldCheck],
];

const blogs = [
  ["Tech careers", "How a BPO agent became a Cybersecurity Analyst in 11 months", "Rohan had zero coding experience. Here's the exact path he took - certifications, costs, and timeline included.", "May 22, 2025", ShieldCheck, "bg-violet-100"],
  ["Hidden gems", "Making Rs 80,000/month as a freelance Makeup Artist - is it real?", "We spoke to 5 makeup artists across Tier 1 and Tier 2 cities. The numbers might surprise you.", "May 15, 2025", GraduationCap, "bg-pink-100"],
  ["For graduates", "Stop doing random courses. Here's how to actually pick the right one", "Most graduates waste 6-12 months on courses that don't lead anywhere. Here's a 3-question framework.", "May 8, 2025", MapPinned, "bg-yellow-100"],
];

const stories = [
  ["Priya Sharma", "BPO -> Digital Marketing, Pune", "I was stuck in BPO for 4 years thinking this was my life. Latecomers showed me a path into digital marketing. Within 8 months I switched and doubled my salary.", "PS"],
  ["Rahul Kulkarni", "Confused Graduate -> Healthcare Ops, Nagpur", "I graduated in 2021 with no idea what to do. The career quiz was shockingly accurate. Now I'm training for a hospital admin role with a clear 6-month plan.", "RK"],
  ["Anjali Mehta", "Back-office -> Data Analyst, Mumbai", "The roadmap was so practical - exact courses, timelines, even which certifications are worth it. I stopped feeling overwhelmed and started taking real steps.", "AM"],
];

function SectionHeading({ eyebrow, title, text, light = false }) {
  return (
    <div className="max-w-3xl">
      <p className={`text-xs font-black uppercase tracking-[0.28em] ${light ? "text-yellow-300" : "text-pink-500"}`}>{eyebrow}</p>
      <h2 className={`mt-3 font-heading text-3xl sm:text-4xl font-black leading-tight ${light ? "text-white" : "text-ink"}`}>{title}</h2>
      {text && <p className={`mt-4 text-sm sm:text-base leading-relaxed ${light ? "text-white/72" : "text-muted2"}`}>{text}</p>}
    </div>
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

      <section className="bg-[#F6F1FF]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.08fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <span className="w-fit rounded-full bg-pink-100 px-4 py-2 text-xs font-black text-pink-600">
              + For late starters, BPO workers and confused graduates
            </span>
            <h1 className="mt-7 font-heading text-4xl font-black leading-[1.05] text-ink sm:text-6xl">
              You are not late.
              <span className="block">You just need</span>
              <span className="block">
                the <span className="text-brand underline decoration-pink-400 decoration-4 underline-offset-4">right career map.</span>
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted2">
              Latecomers AI helps you find a practical career path, understand why it fits, and follow a step-by-step roadmap to move from confusion to action.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={startJourney} className="rounded-lg bg-brand px-6 py-3 text-sm font-black text-white">
                Take the career quiz <ArrowRight className="inline-block" size={16} />
              </button>
              <a href="#how" className="rounded-lg border border-brand/40 bg-white px-6 py-3 text-sm font-black text-brand">
                See how it works <ArrowRight className="inline-block" size={16} />
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {["Starts at Rs 9", "Switcher-friendly", "Takes 5 min"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs font-bold text-muted2">
                  <CheckCircle2 size={15} className="text-emerald-500" /> {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden">
            <div className="absolute left-[42%] top-[16%] hidden rounded-full bg-pink-100 px-4 py-2 text-xs font-bold text-pink-700 lg:block">Cabin Crew</div>
            <div className="absolute left-[48%] top-[28%] hidden rounded-full border border-line bg-white px-4 py-2 text-xs font-bold text-muted2 lg:block">Cybersecurity Analyst</div>
            <div className="absolute left-[40%] top-[40%] hidden rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700 lg:block">Mehendi Artist</div>
            <div className="absolute left-[46%] top-[52%] hidden rounded-full bg-yellow-100 px-4 py-2 text-xs font-bold text-yellow-800 lg:block">Makeup Artist</div>
            <div className="absolute left-[43%] top-[66%] hidden rounded-full border border-line bg-white px-4 py-2 text-xs font-bold text-muted2 lg:block">Cloud Engineer</div>
            <div className="absolute right-0 top-[16%] hidden rounded-full border border-line bg-white px-4 py-2 text-xs font-bold text-muted2 lg:block">DevOps Engineer</div>
            <div className="absolute right-[2%] top-[29%] hidden rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700 lg:block">Airport Ground Staff</div>
            <div className="absolute right-[1%] top-[42%] hidden rounded-full bg-yellow-100 px-4 py-2 text-xs font-bold text-yellow-800 lg:block">Data Analyst</div>
            <div className="absolute right-[4%] top-[56%] hidden rounded-full bg-pink-100 px-4 py-2 text-xs font-bold text-pink-700 lg:block">Social Media Manager</div>
            <div className="absolute right-[5%] top-[70%] hidden rounded-full border border-line bg-white px-4 py-2 text-xs font-bold text-muted2 lg:block">Full Stack Developer</div>

            <div className="mx-auto mt-2 w-full max-w-[330px] rounded-2xl border border-line bg-white p-5 lg:absolute lg:left-[44%] lg:top-[23%]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-ink">
                  <Target size={22} />
                </div>
                <div>
                  <p className="font-heading text-base font-black text-ink">Your Career Match</p>
                  <p className="text-xs text-muted2">Based on your profile</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ["Cybersecurity Analyst", "94% match", true],
                  ["DevOps Engineer", "88% match"],
                  ["Data Analyst", "81% match"],
                  ["Full Stack Developer", "75% match"],
                  ["Mehendi Artist (Freelance)", "70% match"],
                ].map(([title, score, active]) => (
                  <div key={title} className={`flex items-center justify-between rounded-xl border px-3 py-3 text-xs font-black ${active ? "border-brand bg-brand text-white" : "border-line bg-brand-50 text-ink"}`}>
                    <span>{title}</span>
                    <span className={`rounded-full px-2 py-1 text-[10px] ${active ? "bg-yellow-300 text-ink" : "bg-emerald-100 text-emerald-700"}`}>{score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-brand-900 py-5 text-white">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-5 px-4 text-center sm:grid-cols-5">
            {stats.map(([value, label]) => (
              <div key={label}>
                <p className="font-heading text-2xl font-black text-yellow-300">{value}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="bg-brand-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="How it works" title="From confused to career-ready in 4 steps." text="Personalized guidance. Practical roadmap. Real results for people like you." />
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {steps.map(([title, text, Icon], index) => (
              <div key={title} className="rounded-2xl border border-line bg-white p-6">
                <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-xs font-black text-brand">0{index + 1}</div>
                <Icon size={30} className="mb-5 text-ink" />
                <h3 className="font-heading text-base font-black text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted2">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Who is this for?" title="Built for people the system forgot." text="Most career platforms speak to perfect freshers. Latecomers AI is for people who have lived a little, worked a little, struggled a little, and now want a real next step." />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {audiences.map(([title, text, Icon]) => (
              <div key={title} className="flex gap-5 rounded-2xl border border-line bg-brand-50 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-brand">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-black text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted2">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-900 py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-pink-500/20" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Career tracks" title="40+ paths. Real job titles. No fluff." text="From mainstream tech roles to hidden-gem careers - we map paths that match your actual background, not just your dream." light />
          <div className="mt-12 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {careerTracks.map(([title, category, text, tag, Icon]) => (
              <Link key={title} to="/careers-explore" className="rounded-2xl border border-white/12 bg-white/6 p-5">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand">
                  <Icon size={21} />
                </div>
                <p className="text-[11px] font-black uppercase tracking-widest text-white/42">{category}</p>
                <h3 className="mt-2 font-heading text-base font-black text-white">{title}</h3>
                <p className="mt-2 min-h-[56px] text-sm leading-relaxed text-white/62">{text}</p>
                <span className="mt-4 inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase text-yellow-200">{tag}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="From the blog" title="Real talk. No career jargon." text="Honest guides written for people who are figuring it out, not for people who already have it figured out." />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {blogs.map(([category, title, text, date, Icon, bg]) => (
              <Link key={title} to="/blog" className="overflow-hidden rounded-2xl border border-line bg-white">
                <div className={`flex h-44 items-center justify-center ${bg}`}>
                  <Icon size={48} className="text-ink" />
                </div>
                <div className="p-6">
                  <span className="rounded-full bg-brand-100 px-3 py-1 text-[10px] font-black uppercase text-brand">{category}</span>
                  <h3 className="mt-4 font-heading text-lg font-black leading-snug text-ink">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted2">{text}</p>
                  <div className="mt-6 flex items-center justify-between text-xs font-bold text-muted2">
                    <span>{date}</span>
                    <span className="text-brand">Read <ArrowRight className="inline" size={13} /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Real stories" title="Real People. Real Switches." text="From BPO floors to careers they never imagined. Here's what our users say." />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {stories.map(([name, role, text, initials]) => (
              <div key={name} className="rounded-2xl border border-line bg-white p-6">
                <div className="text-yellow-400">*****</div>
                <p className="mt-4 text-sm leading-relaxed text-ink">{text}</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-sm font-black text-white">{initials}</div>
                  <div>
                    <p className="font-heading text-sm font-black text-ink">{name}</p>
                    <p className="text-xs text-muted2">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand py-20 text-center text-white">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-pink-500/20" />
        <div className="relative mx-auto max-w-3xl px-4">
          <h2 className="font-heading text-4xl font-black leading-tight sm:text-5xl">Your next career chapter starts with one quiz.</h2>
          <p className="mt-5 text-base font-semibold text-white/76">Join 12,000+ late starters who found their direction. Takes 5 minutes. Starts at Rs 9.</p>
          <button onClick={startJourney} className="mt-9 rounded-xl bg-white px-8 py-4 text-sm font-black text-brand">
            Take the free career quiz <ArrowRight className="inline" size={16} />
          </button>
        </div>
      </section>
    </PublicShell>
  );
}
