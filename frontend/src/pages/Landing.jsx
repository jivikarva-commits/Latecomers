import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, CreditCard, Sparkles, Users, Building2, GraduationCap, Headphones, Brain, FileText, Rocket, Navigation } from "lucide-react";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

const Stat = ({ icon: Icon, value, label, color }) => (
  <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5">
    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: color + "20", color }}>
      <Icon size={22} />
    </div>
    <div>
      <p className="font-heading font-bold text-xl sm:text-2xl text-ink leading-none">{value}</p>
      <p className="text-xs sm:text-sm text-muted2 mt-1">{label}</p>
    </div>
  </div>
);

const HowStep = ({ n, icon: Icon, title, desc }) => (
  <div className="surface-gradient elevated-card rounded-3xl p-6 sm:p-8 border border-line relative" data-testid={`how-step-${n}`}>
    <div className="absolute -top-3 left-6 w-8 h-8 rounded-full bg-white border border-line shadow-soft flex items-center justify-center text-sm font-bold text-ink">
      {n}
    </div>
    <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand flex items-center justify-center mb-4">
      <Icon size={22} />
    </div>
    <h3 className="font-heading font-bold text-lg sm:text-xl text-ink mb-2">{title}</h3>
    <p className="text-sm text-muted2 leading-relaxed">{desc}</p>
  </div>
);

const Testimonial = ({ quote, name, role, avatarSeed }) => (
  <div className="surface-gradient elevated-card rounded-3xl p-5 sm:p-6 border border-line flex gap-4" data-testid="testimonial-card">
    <img
      src={`https://i.pravatar.cc/100?u=${avatarSeed}`}
      alt={name}
      className="w-12 h-12 rounded-full object-cover shrink-0"
    />
    <div>
      <p className="text-sm text-ink leading-relaxed">&ldquo;{quote}&rdquo;</p>
      <p className="text-xs text-muted2 mt-3">— {name}, {role}</p>
    </div>
  </div>
);

const CompassOrb = () => (
  <div className="hidden sm:block absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 pointer-events-none">
    <Sparkles size={14} className="absolute -left-6 top-5 text-brand-300 float-soft" />
    <Sparkles size={12} className="absolute -left-2 -bottom-2 text-brand-200 float-soft" />
    <Sparkles size={10} className="absolute right-1 top-0 text-brand-300 float-soft" />
    <div className="relative w-[132px] h-[132px] lg:w-[164px] lg:h-[164px] rotate-[18deg] float-soft">
      <div className="absolute inset-0 rounded-full border border-white/30 bg-gradient-to-br from-[#A59BFF] via-[#6A5DEF] to-[#2E63FF] shadow-[0_20px_40px_rgba(84,75,230,0.45)]" />
      <div className="absolute -top-2 right-6 w-8 h-8 rounded-full bg-gradient-to-br from-[#A7A0F4] to-[#4A3ED8] border border-white/50 shadow-[0_10px_20px_rgba(78,68,220,0.4)]" />
      <div className="absolute -top-4 right-4 w-4 h-4 rounded-full border-2 border-white/75" />

      <div className="absolute inset-[10px] rounded-full border border-white/35" />
      <div className="absolute inset-[22px] rounded-full border border-white/32" />
      <div className="absolute inset-[34px] rounded-full border border-white/28" />

      <div className="absolute inset-[46px] rounded-full border border-white/55 bg-white/10 backdrop-blur-[1px] flex items-center justify-center">
        <Navigation size={24} className="text-white drop-shadow-sm -rotate-[62deg] lg:w-7 lg:h-7" strokeWidth={2.8} />
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/95 shadow" />
    </div>
  </div>
);

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const startJourney = () => {
    if (isAuthenticated) navigate("/dashboard");
    else navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-brand-50 font-body" data-testid="landing-page">
      {/* Top nav */}
      <header className="sticky top-0 z-40 backdrop-blur bg-brand-50/80 border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-muted2">
            <a href="#how" className="hover:text-ink">How it works</a>
            <a href="#features" className="hover:text-ink">Features</a>
            <a href="#how" className="hover:text-ink">Roadmap</a>
            <Link to="/colleges" className="hover:text-ink">For Institutes</Link>
            <Link to="/scholarships" className="hover:text-ink">Scholarships</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate("/signin")}
              className="hidden sm:inline-flex items-center px-5 py-2 rounded-full border border-line text-ink text-sm font-semibold hover:bg-white transition"
              data-testid="nav-signin-button"
            >
              Sign In
            </button>
            <button
              onClick={startJourney}
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-600 text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-brand transition"
              data-testid="nav-get-started-button"
            >
              Get Started Free <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-10 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-line text-xs sm:text-sm text-muted2">
            <Sparkles size={14} className="text-brand" /> AI-Powered Career Guidance
          </span>
          <h1 className="font-heading font-extrabold tracking-tight text-4xl sm:text-5xl lg:text-6xl text-ink mt-5 leading-[1.05]">
            Find your perfect career in <span className="text-brand">10 minutes</span>,
            <br />not just engineering or medical.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted2 max-w-xl leading-relaxed">
            Personalized roadmap, top coaching near you, scholarships, mock interviews and more — all in one place.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button
              onClick={startJourney}
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-600 text-white font-semibold px-6 py-3.5 rounded-full shadow-brand transition"
              data-testid="hero-start-test-button"
            >
              Start AI Career Test — It's Free <ArrowRight size={18} />
            </button>
            <button className="inline-flex items-center gap-2 text-ink font-medium" data-testid="hero-watch-demo">
              <span className="w-11 h-11 rounded-full bg-white border border-line flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l16 9-16 9V3z"/></svg>
              </span>
              <span className="text-sm">Watch demo<br /><span className="text-xs text-muted2">60 sec</span></span>
            </button>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-5 text-sm text-muted2">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={16} className="text-brand" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5"><CreditCard size={16} className="text-brand" /> No credit card</span>
            <span className="inline-flex items-center gap-1.5"><Sparkles size={16} className="text-brand" /> AI-Powered</span>
            <span className="inline-flex items-center gap-1.5">🇮🇳 Made for India</span>
          </div>
        </div>

        {/* Hero preview card */}
        <div className="relative animate-fade-up" data-testid="hero-preview">
          <div className="glass-card rounded-3xl p-3 sm:p-4">
            <div className="flex gap-3">
              <div className="hidden sm:flex flex-col gap-1 w-32 bg-brand-50 rounded-2xl p-3 text-xs">
                <div className="px-2 py-1.5 rounded-lg bg-white text-brand font-semibold">Dashboard</div>
                <div className="px-2 py-1.5 text-muted2">Roadmap</div>
                <div className="px-2 py-1.5 text-muted2">Careers</div>
                <div className="px-2 py-1.5 text-muted2">Colleges</div>
                <div className="px-2 py-1.5 text-muted2">Coaching</div>
                <div className="px-2 py-1.5 text-muted2">Scholarships</div>
              </div>
              <div className="flex-1 bg-brand-50 rounded-2xl p-4 space-y-3">
                <p className="text-sm font-semibold text-ink">LATE COMERS <span className="text-brand">AI</span></p>
                <p className="text-sm">Hey Arjun! 👋<br />Let's find the perfect career for you.</p>
                <div className="bg-white rounded-2xl px-3 py-2 text-sm shadow-sm">Which subjects do you enjoy the most?</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {["Maths", "Physics", "Biology", "Business", "Design", "Others"].map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-white border border-line">{s}</span>
                  ))}
                </div>
                <div className="bg-white rounded-2xl p-3 mt-2">
                  <p className="text-xs font-semibold text-ink mb-2">Your Top Career Matches</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { t: "Data Scientist", m: 92, c: "#5B4FE9" },
                      { t: "UX Designer", m: 88, c: "#3B82F6" },
                      { t: "Product Mgr", m: 85, c: "#F97316" },
                    ].map((c) => (
                      <div key={c.t} className="rounded-xl border border-line p-2">
                        <div className="w-7 h-7 rounded-lg mb-1" style={{ background: c.c + "30" }} />
                        <p className="text-[10px] font-semibold text-ink leading-tight">{c.t}</p>
                        <p className="text-[10px] text-muted2">{c.m}% Match</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
         <div className="glass-card rounded-3xl grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-line">
          <Stat icon={Users} value="12,847+" label="Students guided this week" color="#5B4FE9" />
          <Stat icon={Building2} value="50,000+" label="Top institutes listed" color="#3B82F6" />
          <Stat icon={GraduationCap} value="1,600+" label="Scholarships available" color="#A855F7" />
          <Stat icon={Headphones} value="24/7" label="AI career counselor" color="#EC4899" />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="text-center mb-10">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-ink">How it works</h2>
          <p className="text-muted2 mt-2">Get your personalized career roadmap in 3 simple steps</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <HowStep n={1} icon={Brain} title="Take AI Career Test" desc="Answer a few smart questions about your interests, skills and goals." />
          <HowStep n={2} icon={FileText} title="Get Your Roadmap" desc="Receive your personalized career list, college options and growth path." />
          <HowStep n={3} icon={Rocket} title="Take Action & Grow" desc="Find top coaching, apply for scholarships, crack interviews and achieve your dream." />
        </div>
      </section>

      {/* Testimonials */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <h3 className="text-center font-heading font-bold text-2xl sm:text-3xl text-ink mb-8">
          Loved by students across India ❤️
        </h3>
        <div className="grid md:grid-cols-3 gap-5">
          <Testimonial quote="Finally got clarity! The AI test was accurate and the roadmap really helped me." name="Rohan" role="12th Student" avatarSeed="1" />
          <Testimonial quote="Found the best coaching near me and even got a scholarship through Late Comers AI." name="Ananya" role="B.Tech Student" avatarSeed="2" />
          <Testimonial quote="Mock interviews were game-changer! Boosted my confidence and cracked my dream role." name="Karan" role="Engineering Graduate" avatarSeed="3" />
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="glass-card rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <Sparkles size={16} className="hidden sm:block absolute left-8 top-9 text-brand-200" />
          <Sparkles size={12} className="hidden sm:block absolute left-16 bottom-10 text-brand-300" />
          <CompassOrb />
          <div className="relative z-10 sm:pr-32 lg:pr-44">
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-ink leading-tight">
              Your career. Your map. <span className="text-brand">Your future.</span>
            </h2>
            <p className="text-muted2 mt-3 text-sm sm:text-base">
              Join thousands of students who are already building their dream careers.
            </p>
            <button
              onClick={startJourney}
              className="mt-7 inline-flex items-center gap-2 bg-brand hover:bg-brand-600 text-white font-semibold px-7 py-3.5 rounded-full shadow-brand"
              data-testid="cta-start-button"
            >
              Start Your Journey — It's 100% Free <ArrowRight size={18} />
            </button>
            <p className="mt-4 text-xs text-muted2">No credit card required · Free forever</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-muted2">
          © 2026 LATE COMERS AI · Made with ❤ for Indian students
        </div>
      </footer>
    </div>
  );
}
