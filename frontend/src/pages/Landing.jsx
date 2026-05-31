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
      <p className={`text-[10px] font-black uppercase tracking-[0.22em] sm:text-xs ${light ? "text-yellow-300" : "text-pink-500"}`}>{eyebrow}</p>
      <h2 className={`mt-2 font-heading text-[1.35rem] font-black leading-tight sm:mt-3 sm:text-3xl lg:text-[2.15rem] ${light ? "text-white" : "text-ink"}`}>{title}</h2>
      {text && <p className={`mt-2 text-[13px] leading-relaxed sm:mt-3 sm:text-sm ${light ? "text-white/72" : "text-muted2"}`}>{text}</p>}
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

      <section className="overflow-hidden bg-[#F6F1FF]">
        <div className="mx-auto grid max-w-[1440px] gap-5 px-4 py-6 sm:gap-6 sm:px-8 sm:py-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-16 lg:py-10">
          <div className="flex max-w-[570px] flex-col justify-start lg:pt-2">
            <span className="w-fit max-w-full rounded-full bg-pink-100 px-3 py-1.5 text-[10px] font-black text-pink-600 sm:px-4 sm:py-2 sm:text-xs">
              + For late starters, BPO workers and confused graduates
            </span>
            <h1 className="mt-4 font-heading text-[1.7rem] font-black leading-[1.12] text-ink min-[390px]:text-[1.85rem] sm:mt-6 sm:text-[2.4rem] sm:leading-[1.08] lg:text-[2.65rem] xl:text-[2.9rem]">
              You are not late.
              <span className="block">You just need the{" "}
                <span className="inline whitespace-nowrap text-brand underline decoration-pink-400 decoration-4 underline-offset-4">right career map.</span>
              </span>
            </h1>
            <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-muted2 sm:mt-4 sm:text-sm">
              Latecomers AI helps you find a practical career path, understand why it fits, and follow a step-by-step roadmap to move from confusion to action.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
              <button onClick={startJourney} className="rounded-lg bg-brand px-4 py-2.5 text-xs font-black text-white sm:px-5 sm:py-3 sm:text-sm">
                Take the career quiz <ArrowRight className="inline-block" size={16} />
              </button>
              <a href="#how" className="rounded-lg border border-brand/40 bg-white px-4 py-2.5 text-xs font-black text-brand sm:px-5 sm:py-3 sm:text-sm">
                See how it works <ArrowRight className="inline-block" size={16} />
              </a>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-2.5">
              {["Starts at Rs 9", "Switcher-friendly", "Takes 5 min"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[10.5px] font-bold text-muted2 sm:px-3 sm:py-1.5 sm:text-xs">
                  <CheckCircle2 size={13} className="text-emerald-500" /> {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative lg:min-h-[500px]">
            <div className="absolute left-[1%] top-[4%] hidden whitespace-nowrap rounded-full bg-pink-100 px-3 py-1.5 text-[11px] font-bold text-pink-700 lg:block">Cabin Crew</div>
            <div className="absolute left-[1%] top-[16%] hidden whitespace-nowrap rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-bold text-muted2 lg:block">Cybersecurity Analyst</div>
            <div className="absolute left-[1%] top-[28%] hidden whitespace-nowrap rounded-full bg-emerald-100 px-3 py-1.5 text-[11px] font-bold text-emerald-700 lg:block">Mehendi Artist</div>
            <div className="absolute left-[1%] top-[40%] hidden whitespace-nowrap rounded-full bg-yellow-100 px-3 py-1.5 text-[11px] font-bold text-yellow-800 lg:block">Makeup Artist</div>
            <div className="absolute left-[1%] top-[52%] hidden whitespace-nowrap rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-bold text-muted2 lg:block">Cloud Engineer</div>
            <div className="absolute left-[1%] top-[64%] hidden whitespace-nowrap rounded-full bg-pink-100 px-3 py-1.5 text-[11px] font-bold text-pink-700 lg:block">Product Photographer</div>
            <div className="absolute left-[1%] top-[76%] hidden whitespace-nowrap rounded-full bg-emerald-100 px-3 py-1.5 text-[11px] font-bold text-emerald-700 lg:block">UI/UX Designer</div>
            <div className="absolute left-[1%] top-[88%] hidden whitespace-nowrap rounded-full bg-yellow-100 px-3 py-1.5 text-[11px] font-bold text-yellow-800 lg:block">EdTech Trainer</div>

            <div className="absolute right-[1%] top-[4%] hidden whitespace-nowrap rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-bold text-muted2 lg:block">DevOps Engineer</div>
            <div className="absolute right-[1%] top-[16%] hidden whitespace-nowrap rounded-full bg-emerald-100 px-3 py-1.5 text-[11px] font-bold text-emerald-700 lg:block">Airport Ground Staff</div>
            <div className="absolute right-[1%] top-[28%] hidden whitespace-nowrap rounded-full bg-yellow-100 px-3 py-1.5 text-[11px] font-bold text-yellow-800 lg:block">Data Analyst</div>
            <div className="absolute right-[1%] top-[40%] hidden whitespace-nowrap rounded-full bg-pink-100 px-3 py-1.5 text-[11px] font-bold text-pink-700 lg:block">Social Media Manager</div>
            <div className="absolute right-[1%] top-[52%] hidden whitespace-nowrap rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-bold text-muted2 lg:block">Full Stack Developer</div>
            <div className="absolute right-[1%] top-[64%] hidden whitespace-nowrap rounded-full bg-emerald-100 px-3 py-1.5 text-[11px] font-bold text-emerald-700 lg:block">Loan Processing Officer</div>
            <div className="absolute right-[1%] top-[76%] hidden whitespace-nowrap rounded-full bg-yellow-100 px-3 py-1.5 text-[11px] font-bold text-yellow-800 lg:block">Podcast Producer</div>
            <div className="absolute right-[1%] top-[88%] hidden whitespace-nowrap rounded-full bg-pink-100 px-3 py-1.5 text-[11px] font-bold text-pink-700 lg:block">Medical Coder</div>

            <div className="absolute left-1/2 top-[2%] z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-pink-500 px-3 py-1.5 text-[11px] font-black text-white lg:block">+ AI-Powered Match</div>
            <div className="mx-auto mt-2 w-full max-w-[260px] rounded-2xl border border-line bg-white p-3.5 shadow-xl lg:absolute lg:left-1/2 lg:top-[9%] lg:mt-0 lg:-translate-x-1/2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-ink">
                  <Target size={20} />
                </div>
                <div>
                  <p className="font-heading text-sm font-black text-ink">Your Career Match</p>
                  <p className="text-xs text-muted2">Based on your profile</p>
                </div>
              </div>
              <div className="mt-4 space-y-2.5">
                {[
                  ["Cybersecurity Analyst", "94% match", true],
                  ["DevOps Engineer", "88% match"],
                  ["Data Analyst", "81% match"],
                  ["Full Stack Developer", "75% match"],
                  ["Mehendi Artist (Freelance)", "70% match"],
                ].map(([title, score, active]) => (
                  <div key={title} className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-[11px] font-black ${active ? "border-brand bg-brand text-white" : "border-line bg-brand-50 text-ink"}`}>
                    <span>{title}</span>
                    <span className={`rounded-full px-2 py-1 text-[10px] ${active ? "bg-yellow-300 text-ink" : "bg-emerald-100 text-emerald-700"}`}>{score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-brand-900 py-4 text-white sm:py-5">
          <div className="mx-auto grid max-w-4xl grid-cols-3 gap-3 px-4 text-center sm:grid-cols-5 sm:gap-5">
            {stats.map(([value, label]) => (
              <div key={label}>
                <p className="font-heading text-base font-black text-yellow-300 sm:text-2xl">{value}</p>
                <p className="mt-0.5 text-[8.5px] font-bold uppercase tracking-wide text-white/60 sm:mt-1 sm:text-[10px]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="bg-brand-50 py-8 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="How it works" title="From confused to career-ready in 4 steps." text="Personalized guidance. Practical roadmap. Real results for people like you." />
          <div className="mt-5 grid gap-2.5 sm:mt-10 sm:gap-4 sm:grid-cols-2 md:grid-cols-4">
            {steps.map(([title, text, Icon], index) => (
              <div key={title} className="rounded-xl border border-line bg-white p-3.5 sm:rounded-2xl sm:p-5">
                <div className="mb-2.5 flex items-center gap-2 sm:mb-4 sm:block">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-100 text-[10px] font-black text-brand sm:mb-4 sm:h-9 sm:w-9 sm:text-xs">0{index + 1}</div>
                  <Icon size={18} className="text-ink sm:mb-4 sm:h-[26px] sm:w-[26px]" />
                </div>
                <h3 className="font-heading text-[13px] font-black text-ink sm:text-base">{title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted2 sm:mt-2 sm:text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Who is this for?" title="Built for people the system forgot." text="Most career platforms speak to perfect freshers. Latecomers AI is for people who have lived a little, worked a little, struggled a little, and now want a real next step." />
          <div className="mt-5 grid gap-2.5 sm:mt-10 sm:gap-4 md:grid-cols-2">
            {audiences.map(([title, text, Icon]) => (
              <div key={title} className="flex gap-3 rounded-xl border border-line bg-brand-50 p-3.5 sm:gap-4 sm:rounded-2xl sm:p-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand sm:h-11 sm:w-11 sm:rounded-xl">
                  <Icon size={18} className="sm:h-[22px] sm:w-[22px]" />
                </div>
                <div>
                  <h3 className="font-heading text-[14px] font-black text-ink sm:text-base">{title}</h3>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted2 sm:mt-1.5 sm:text-sm">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-900 py-8 text-white sm:py-14">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-pink-500/20" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Career tracks" title="40+ paths. Real job titles. No fluff." text="From mainstream tech roles to hidden-gem careers - we map paths that match your actual background, not just your dream." light />
          <div className="mt-5 grid gap-2.5 sm:mt-10 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {careerTracks.map(([title, category, text, tag, Icon]) => (
              <Link key={title} to="/careers-explore" className="rounded-xl border border-white/12 bg-white/6 p-3.5 sm:rounded-2xl sm:p-5">
                <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand sm:mb-4 sm:h-10 sm:w-10 sm:rounded-xl">
                  <Icon size={17} />
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/42 sm:text-[10px]">{category}</p>
                <h3 className="mt-1 font-heading text-[13px] font-black text-white sm:mt-1.5 sm:text-base">{title}</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-white/62 sm:mt-1.5 sm:min-h-[56px] sm:text-sm">{text}</p>
                <span className="mt-2.5 inline-flex rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-black uppercase text-yellow-200 sm:mt-3 sm:px-2.5 sm:py-1 sm:text-[10px]">{tag}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-50 py-8 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="From the blog" title="Real talk. No career jargon." text="Honest guides written for people who are figuring it out, not for people who already have it figured out." />
          <div className="mt-5 grid gap-3 sm:mt-12 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map(([category, title, text, date, Icon, bg]) => (
              <Link key={title} to="/blog" className="overflow-hidden rounded-xl border border-line bg-white sm:rounded-2xl">
                <div className={`flex h-28 items-center justify-center sm:h-44 ${bg}`}>
                  <Icon size={36} className="text-ink sm:h-12 sm:w-12" />
                </div>
                <div className="p-4 sm:p-6">
                  <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[9.5px] font-black uppercase text-brand sm:px-3 sm:py-1 sm:text-[10px]">{category}</span>
                  <h3 className="mt-2.5 font-heading text-[14px] font-black leading-snug text-ink sm:mt-4 sm:text-lg">{title}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-muted2 sm:mt-3 sm:text-sm">{text}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-muted2 sm:mt-6 sm:text-xs">
                    <span>{date}</span>
                    <span className="text-brand">Read <ArrowRight className="inline" size={13} /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Real stories" title="Real People. Real Switches." text="From BPO floors to careers they never imagined. Here's what our users say." />
          <div className="mt-5 grid gap-3 sm:mt-12 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map(([name, role, text, initials]) => (
              <div key={name} className="rounded-xl border border-line bg-white p-4 sm:rounded-2xl sm:p-6">
                <div className="text-yellow-400">*****</div>
                <p className="mt-3 text-[13px] leading-relaxed text-ink sm:mt-4 sm:text-sm">{text}</p>
                <div className="mt-4 flex items-center gap-3 sm:mt-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-xs font-black text-white sm:h-10 sm:w-10 sm:text-sm">{initials}</div>
                  <div>
                    <p className="font-heading text-[13px] font-black text-ink sm:text-sm">{name}</p>
                    <p className="text-[11px] text-muted2 sm:text-xs">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand py-10 text-center text-white sm:py-20">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-pink-500/20" />
        <div className="relative mx-auto max-w-3xl px-4">
          <h2 className="font-heading text-[1.5rem] font-black leading-tight sm:text-5xl">Your next career chapter starts with one quiz.</h2>
          <p className="mt-3 text-[13px] font-semibold text-white/76 sm:mt-5 sm:text-base">Join 12,000+ late starters who found their direction. Takes 5 minutes. Starts at Rs 9.</p>
          <button onClick={startJourney} className="mt-6 rounded-xl bg-white px-6 py-3 text-xs font-black text-brand sm:mt-9 sm:px-8 sm:py-4 sm:text-sm">
            Take the free career quiz <ArrowRight className="inline" size={16} />
          </button>
        </div>
      </section>
    </PublicShell>
  );
}
