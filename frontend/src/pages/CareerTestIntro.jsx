import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Brain, Target, BarChart3, Map as MapIcon,
  CheckCircle2, Clock, Layers3, Zap, Heart, Star, User, Briefcase,
  Bookmark, ShieldCheck, Bot,
} from "lucide-react";
import HeroIllustration from "../components/HeroIllustration";
import { useNavigate } from "react-router-dom";

const Pill = ({ icon: Icon, color, title, desc }) => (
  <div className="bg-white rounded-2xl border border-line p-4 text-center">
    <div className="w-11 h-11 rounded-full mx-auto flex items-center justify-center mb-2" style={{ background: color + "20", color }}>
      <Icon size={20} />
    </div>
    <p className="font-heading font-bold text-sm text-ink">{title}</p>
    <p className="text-[11px] text-muted2 mt-1 leading-snug">{desc}</p>
  </div>
);

const Row = ({ icon: Icon, title, desc }) => (
  <div className="flex items-start gap-3 py-3 border-b border-line last:border-0">
    <div className="w-9 h-9 rounded-full bg-brand-50 text-brand flex items-center justify-center shrink-0">
      <Icon size={16} />
    </div>
    <div>
      <p className="font-semibold text-ink text-sm">{title}</p>
      <p className="text-xs text-muted2">{desc}</p>
    </div>
  </div>
);

const AreaCard = ({ icon: Icon, color, title, desc }) => (
  <div className="bg-white rounded-2xl border border-line p-4 text-center">
    <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2" style={{ background: color + "25", color }}>
      <Icon size={22} />
    </div>
    <p className="font-heading font-bold text-sm text-ink">{title}</p>
    <p className="text-[11px] text-muted2 mt-1 leading-snug">{desc}</p>
  </div>
);

export default function CareerTestIntro() {
  const navigate = useNavigate();
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto overflow-x-hidden w-full min-w-0" data-testid="career-test-intro">
      {/* Top bar */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-ink" data-testid="back-btn">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-ink">AI Career Test</h1>
          <p className="text-xs sm:text-sm text-muted2">Discover your ideal career path with AI</p>
        </div>
        <button className="p-2 rounded-full bg-white border border-line text-brand" data-testid="bookmark-btn">
          <Bookmark size={16} />
        </button>
      </div>

      {/* Hero banner */}
      <div className="bg-brand-50 rounded-3xl p-5 sm:p-6 flex items-center gap-4 sm:gap-6">
        <HeroIllustration Icon={Target} size={84} className="hidden sm:block" />
        <HeroIllustration Icon={Target} size={64} className="sm:hidden" />
        <div className="flex-1 min-w-0">
          <h2 className="font-heading font-bold text-base sm:text-xl text-ink">Find Your Perfect Career Match</h2>
          <p className="text-xs sm:text-sm text-muted2 mt-1.5 leading-relaxed">
            Our AI-powered test analyzes your interests, skills, personality and goals to suggest the best career paths for you.
          </p>
        </div>
      </div>

      {/* Why take */}
      <h3 className="font-heading font-bold text-ink mt-6 mb-3">Why Take This Test?</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Pill icon={Brain} color="#5B4FE9" title="AI-Powered Analysis" desc="Advanced AI finds careers that truly fit you." />
        <Pill icon={Target} color="#5B4FE9" title="Personalized Results" desc="Top career matches for your profile." />
        <Pill icon={BarChart3} color="#3B82F6" title="Detailed Insights" desc="Understand strengths, work style and more." />
        <Pill icon={MapIcon} color="#5B4FE9" title="Smart Roadmap" desc="Receive a personalized learning roadmap." />
      </div>

      {/* What to expect */}
      <h3 className="font-heading font-bold text-ink mt-6 mb-3">What to Expect?</h3>
      <div className="bg-white rounded-3xl border border-line p-5 sm:p-6 grid sm:grid-cols-2 gap-5 items-center">
        <div>
          <Row icon={Layers3} title="60 Questions" desc="Multiple choice questions" />
          <Row icon={Clock} title="10-15 Minutes" desc="Quick and easy to complete" />
          <Row icon={Briefcase} title="4 Key Areas" desc="Interests, Skills, Personality, Work Style" />
          <Row icon={Zap} title="Instant Results" desc="Get your top career matches right away" />
        </div>
        <div className="flex flex-col items-center">
          <div className="relative w-36 h-36">
            <svg viewBox="0 0 36 36" className="w-36 h-36 -rotate-90">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#E8E4FF" strokeWidth="2.5" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#5B4FE9" strokeWidth="2.5" strokeDasharray="90 100" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-muted2">High Accuracy</span>
              <span className="font-heading font-extrabold text-3xl text-ink">90%+</span>
              <span className="text-xs text-muted2">Match Accuracy</span>
            </div>
          </div>
          <div className="bg-brand-50 rounded-full px-3 py-1.5 mt-3 text-xs text-brand font-semibold text-center">
            Thousands of users found their perfect career path!
          </div>
        </div>
      </div>

      {/* Areas covered */}
      <h3 className="font-heading font-bold text-ink mt-6 mb-3">Areas Covered in the Test</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <AreaCard icon={Heart} color="#EC4899" title="Interests" desc="What excites and motivates you" />
        <AreaCard icon={Star} color="#22C55E" title="Skills" desc="What you are good at and enjoy" />
        <AreaCard icon={User} color="#F59E0B" title="Personality" desc="Your traits and natural tendencies" />
        <AreaCard icon={Briefcase} color="#3B82F6" title="Work Style" desc="How you like to work" />
      </div>

      {/* CTA */}
      <div className="mt-6 bg-brand-50 rounded-3xl p-4 sm:p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full cc-logo-gradient text-white flex items-center justify-center shrink-0">
          <Bot size={26} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-sm sm:text-base text-ink">Ready to find your perfect career?</p>
          <p className="text-xs text-muted2 mt-1">Take the AI Career Test and unlock career paths that match your true potential.</p>
        </div>
        <Link
          to="/career-test/questions"
          className="hidden sm:inline-flex items-center gap-2 bg-brand hover:bg-brand-600 text-white font-semibold px-5 py-3 rounded-full shadow-brand"
          data-testid="start-career-test-button"
        >
          Start Test <ArrowRight size={16} />
        </Link>
      </div>

      <Link
        to="/career-test/questions"
        className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-600 text-white font-semibold px-5 py-3.5 rounded-full shadow-brand"
        data-testid="start-career-test-button-mobile"
      >
        Start Test <ArrowRight size={16} />
      </Link>

      {/* Trust */}
      <p className="text-center text-xs text-muted2 mt-5 inline-flex items-center gap-1.5 justify-center w-full">
        <ShieldCheck size={14} className="text-brand" /> Your answers are private and secure. We never share your data.
      </p>
    </div>
  );
}
