import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Lock } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

// ─── 15 Career Profiling Questions (all static — no AI generation) ──────────
const QUESTIONS = [
  {
    id: "q1", section: "Who Are You?", sectionNum: 1,
    question: "What is your highest level of education?",
    type: "single",
    options: [
      "Class 10 passed", "Class 12 passed", "College student",
      "Graduate", "Working professional", "Unemployed/job seeker",
    ],
  },
  {
    id: "q2", section: "Who Are You?", sectionNum: 1,
    question: "Which stream or field are you from?",
    type: "single",
    options: [
      "Science (PCM)", "Science (PCB)", "Commerce",
      "Arts/Humanities", "Diploma/ITI", "Other/Not applicable",
    ],
  },
  {
    id: "q3", section: "Who Are You?", sectionNum: 1,
    question: "What best describes your current situation?",
    type: "single",
    options: [
      "Studying in school (10th/12th)",
      "Deciding what to do after 12th",
      "Currently in college",
      "Recently graduated, looking for direction",
      "Working but want to change career",
    ],
  },
  {
    id: "q4", section: "Academic Background", sectionNum: 2,
    question: "Which subjects do you enjoy the most?",
    type: "multi", max: 3, hint: "Select up to 3",
    options: [
      "Maths", "Science/Biology", "Computers/Technology",
      "Business/Accounts", "Arts/Humanities",
      "Language/Communication", "Design/Creativity",
    ],
  },
  {
    id: "q5", section: "Personality", sectionNum: 3,
    question: "Which activities excite you the most?",
    type: "multi", max: 3, hint: "Select up to 3",
    options: [
      "Solving technical problems",
      "Designing/editing/creating",
      "Talking to people/sales",
      "Managing/business/leadership",
      "Gaming/animation/content creation",
      "Helping people/social work",
      "Government/public service",
    ],
  },
  {
    id: "q6", section: "Personality", sectionNum: 3,
    question: "What type of work suits you best?",
    type: "single",
    options: [
      "Logical/problem-solving (comfortable with computers)",
      "Creative/artistic work",
      "Communication/sales/people facing",
      "Analytical/data work",
      "Management/leadership",
      "Practical/manual/field work",
    ],
  },
  {
    id: "q7", section: "Personality", sectionNum: 3,
    question: "Which best describes your personality?",
    type: "single",
    options: [
      "Creative", "Logical/analytical", "Disciplined/organized",
      "Entrepreneurial", "Social/people person",
      "Competitive/achievement driven",
    ],
  },
  {
    id: "q8", section: "Career Goals", sectionNum: 4,
    question: "What is your main career goal?",
    type: "single",
    options: [
      "High salary/financial growth", "Job security/stability",
      "Creative freedom", "Fast income (within months)",
      "Government job", "Business/startup", "International career",
    ],
  },
  {
    id: "q9", section: "Career Goals", sectionNum: 4,
    question: "How quickly do you want to start earning a good income?",
    type: "single",
    options: [
      "Within 3-6 months", "Within 1 year",
      "1-3 years is okay", "Long term (3-5 years) is fine",
    ],
  },
  {
    id: "q10", section: "Field Interest", sectionNum: 5,
    question: "Which field interests you the most?",
    type: "single",
    options: [
      "IT/Software/Coding", "Data Science/AI/Analytics",
      "Cybersecurity/Cloud", "Design/Media/UX",
      "Digital Marketing/Content", "Finance/Accounting",
      "Government/Civil Services", "Law/Management (MBA)",
      "Healthcare/Medical",
      "Creative Arts/Animation/Gaming",
      "Vocational/Skill trades", "Freelance/Entrepreneurship",
    ],
  },
  {
    id: "q11", section: "Government & Exams", sectionNum: 6,
    question: "Are you interested in any government or professional certification exam?",
    type: "single",
    options: [
      "Not interested", "Banking exams (SBI/IBPS/RBI)",
      "UPSC/MPSC (IAS/IPS)", "SSC/Railways",
      "Defense/Police (NDA/CDS)", "CA/CMA/CS",
      "MBA entrance (CAT/XAT/SNAP)", "CLAT/Law entrance",
    ],
  },
  {
    id: "q12", section: "Practical Factors", sectionNum: 7,
    question: "What is your budget for learning and upskilling?",
    type: "single",
    options: [
      "Under ₹20,000", "₹20,000 – ₹40,000",
      "₹40,000 – ₹1 lakh", "Above ₹1 lakh (college/full course)",
    ],
  },
  {
    id: "q13", section: "Practical Factors", sectionNum: 7,
    question: "What is your preferred way to learn?",
    type: "single",
    options: [
      "Offline classroom", "Online live classes",
      "Recorded/self-paced", "Hybrid (online + offline)",
    ],
  },
  {
    id: "q14", section: "Challenges", sectionNum: 8,
    question: "What is your biggest challenge right now?",
    type: "single",
    options: [
      "No clarity/too confused", "Financial pressure/money issues",
      "Lack of skills/confidence", "Family pressure",
      "English communication barrier", "Too many options, can't decide",
    ],
  },
  {
    id: "q15", section: "Career Identity", sectionNum: 8,
    question: "Which statement describes you best?",
    type: "single",
    options: [
      "I want quick job-ready skills (3-6 months)",
      "I want a long-term stable career",
      "I want a high-income elite career (CA/Engineering/MBA)",
      "I want government job security",
      "I want creative freedom",
      "I want to start my own business",
    ],
  },
];

const TOTAL = QUESTIONS.length; // 15

const ANALYZING_MESSAGES = [
  "Analyzing your answers…",
  "Mapping your strengths & interests…",
  "Matching career paths for India…",
  "Calculating your match scores…",
  "Building your personalized roadmap…",
  "Almost there…",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function AIBubble({ children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-full cc-logo-gradient flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-sm">
        AI
      </div>
      <div className="bg-brand-50 border border-brand-100 rounded-2xl rounded-tl-sm px-5 py-4 flex-1">
        {children}
      </div>
    </div>
  );
}

function OptionChip({ label, selected, onClick, multiSelect }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all border ${
        selected
          ? "bg-brand text-white border-brand shadow-md shadow-brand/25 scale-[1.02]"
          : "bg-white border-line text-ink hover:bg-brand-50 hover:border-brand-300"
      }`}
    >
      {selected && multiSelect ? "✓ " : ""}
      {label}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Onboarding() {
  const { user, refresh } = useAuth();
  const navigate = useNavigate();

  // phase: "welcome" | "quiz" | "analyzing" | "done"
  const [phase, setPhase] = useState("welcome");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [advancing, setAdvancing] = useState(false);

  const q = QUESTIONS[currentQ];
  const isMulti = q?.type === "multi";
  const currentAnswer = answers[q?.id];
  const isSelected = (option) =>
    isMulti
      ? Array.isArray(currentAnswer) && currentAnswer.includes(option)
      : currentAnswer === option;
  const hasAnswer = isMulti
    ? Array.isArray(currentAnswer) && currentAnswer.length > 0
    : !!currentAnswer;

  // Cycle loading messages
  useEffect(() => {
    if (phase !== "analyzing") return;
    const id = setInterval(
      () => setLoadingMsgIdx((m) => (m + 1) % ANALYZING_MESSAGES.length),
      700
    );
    return () => clearInterval(id);
  }, [phase]);

  // If already onboarded, skip to dashboard
  useEffect(() => {
    if (user?.onboarded) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  // ── Answer selection ────────────────────────────────────────────────────────
  const selectOption = useCallback(
    (option) => {
      if (advancing) return;
      if (isMulti) {
        setAnswers((prev) => {
          const curr = Array.isArray(prev[q.id]) ? prev[q.id] : [];
          const set = new Set(curr);
          if (set.has(option)) {
            set.delete(option);
          } else {
            if (set.size >= (q.max || 1)) return prev;
            set.add(option);
          }
          return { ...prev, [q.id]: Array.from(set) };
        });
      } else {
        setAnswers((prev) => ({ ...prev, [q.id]: option }));
        setAdvancing(true);
        setTimeout(() => {
          setAdvancing(false);
          advanceToNext({ forcedAnswer: option });
        }, 280);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q, isMulti, advancing, currentQ, answers]
  );

  // ── Navigation ──────────────────────────────────────────────────────────────
  const advanceToNext = useCallback(
    ({ forcedAnswer } = {}) => {
      const ans = isMulti ? answers[q?.id] : forcedAnswer ?? answers[q?.id];
      const valid = isMulti ? Array.isArray(ans) && ans.length > 0 : !!ans;
      if (!valid) return;

      const mergedAnswers = forcedAnswer !== undefined ? { ...answers, [q.id]: forcedAnswer } : answers;

      if (currentQ < TOTAL - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        // Last question done → submit for AI analysis
        submitForAnalysis(mergedAnswers);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentQ, answers, q, isMulti]
  );

  const goBack = () => {
    if (currentQ > 0) setCurrentQ((n) => n - 1);
    else setPhase("welcome");
  };

  // ── Submit to AI for analysis ──────────────────────────────────────────────
  const submitForAnalysis = async (finalAnswers = answers) => {
    setPhase("analyzing");

    const answersPayload = QUESTIONS.map((qq) => ({
      questionId: qq.id,
      question: qq.question,
      answer: finalAnswers[qq.id] ?? "",
    }));

    try {
      await api.post("/ai/onboarding/analyze", { answers: answersPayload });
      await refresh();
      navigate("/dashboard", { replace: true });
    } catch (e) {
      console.error("Onboarding AI analysis failed:", e);
      try {
        await api.put("/me/profile", { onboarded: true });
        await refresh();
      } catch {}
      navigate("/dashboard", { replace: true });
    }
  };

  // ── Phases ──────────────────────────────────────────────────────────────────

  // Welcome screen
  if (phase === "welcome") {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <div className="bg-white rounded-3xl border border-line shadow-soft p-8 text-center">
            <div className="w-16 h-16 rounded-full cc-logo-gradient flex items-center justify-center mx-auto mb-5 shadow-brand text-white text-lg font-bold">
              AI
            </div>
            <h1 className="font-heading font-extrabold text-2xl text-ink">
              Hi {user?.name?.split(" ")[0] || "there"}! 👋
            </h1>
            <p className="text-muted2 mt-3 leading-relaxed text-sm">
              I'll ask you{" "}
              <strong className="text-ink">15 quick questions</strong> to build
              your personalized career roadmap. This takes about{" "}
              <strong className="text-ink">3 minutes</strong> and helps me match
              you with the best careers in India for your profile.
            </p>

            <div className="mt-5 flex gap-4 justify-center text-xs text-muted2">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-500" /> 15 questions
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-500" /> ~3 minutes
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-500" /> AI-powered
              </span>
            </div>

            <button
              onClick={() => setPhase("quiz")}
              className="mt-7 w-full inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-600 text-white font-semibold px-6 py-3.5 rounded-full shadow-brand transition"
            >
              Let's Start <ArrowRight size={18} />
            </button>

            <p className="text-xs text-muted2 mt-4 flex items-center justify-center gap-1">
              <Lock size={11} /> Your answers are private and used only to personalize your roadmap.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Analyzing screen
  if (phase === "analyzing") {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full cc-logo-gradient flex items-center justify-center mx-auto mb-6 shadow-brand">
            <Sparkles size={30} className="text-white animate-pulse" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-ink">
            {ANALYZING_MESSAGES[loadingMsgIdx]}
          </h2>
          <p className="text-muted2 mt-2 text-sm">
            AI is analyzing your {TOTAL} answers to find your best career matches.
          </p>
          {/* Animated progress bar */}
          <div className="mt-8 h-2 bg-brand-100 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-brand rounded-full"
              style={{ animation: "progress 3s ease-in-out forwards" }}
            />
          </div>
          <p className="text-xs text-muted2 mt-3">
            Building your Career Match Score &amp; Top Recommendations…
          </p>
        </div>
      </div>
    );
  }

  // ── Quiz screen ─────────────────────────────────────────────────────────────
  const progressPct = ((currentQ + 1) / TOTAL) * 100;

  return (
    <div className="min-h-screen bg-brand-50" data-testid="onboarding-page">
      {/* Top progress bar */}
      <div className="sticky top-0 z-10 bg-brand-50/95 backdrop-blur-sm px-4 pt-4 pb-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-2 rounded-full bg-white border border-line text-muted2 hover:text-ink shrink-0"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-brand">{q?.section}</span>
              <span className="text-xs text-muted2">
                {currentQ + 1} / {TOTAL}
              </span>
            </div>
            <div className="h-2 bg-brand-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <Logo size={30} />
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-20">
        <div className="bg-white rounded-3xl border border-line shadow-soft p-6 sm:p-8 space-y-6">
          {/* AI bubble with question */}
          <AIBubble>
            <p className="text-sm font-semibold text-ink leading-snug">
              {q?.question}
            </p>
            {q?.hint && (
              <p className="text-xs text-muted2 mt-1">{q.hint}</p>
            )}
          </AIBubble>

          {/* Options */}
          <div className="flex flex-wrap gap-2.5 pl-0 sm:pl-13">
            {q?.options.map((option) => (
              <OptionChip
                key={option}
                label={option}
                selected={isSelected(option)}
                onClick={() => selectOption(option)}
                multiSelect={isMulti}
              />
            ))}
          </div>

          {/* Next button (only for multi-select) */}
          {isMulti && (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => advanceToNext()}
                disabled={!hasAnswer}
                className="inline-flex items-center gap-2 bg-brand hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-full transition"
              >
                {currentQ === TOTAL - 1 ? (
                  <>
                    <Sparkles size={16} /> Analyze My Profile
                  </>
                ) : (
                  <>
                    Next <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Section dots */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all ${
                i < currentQ
                  ? "w-2 h-2 bg-brand"
                  : i === currentQ
                  ? "w-3 h-3 bg-brand ring-2 ring-brand ring-offset-2"
                  : "w-2 h-2 bg-brand-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
