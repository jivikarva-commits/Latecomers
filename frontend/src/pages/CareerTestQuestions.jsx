import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, BadgeCheck, ShieldCheck, X, Lightbulb, Sparkles } from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";
import HeroIllustration from "../components/HeroIllustration";
import { ClipboardCheck } from "lucide-react";
import PremiumSubscriptionModal from "../components/PremiumSubscriptionModal";
import { useAuth } from "../context/AuthContext";

export default function CareerTestQuestions() {
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);
  const navigate = useNavigate();
  const { refresh } = useAuth();

  useEffect(() => {
    api.get("/career-test/questions").then(({ data }) => setQuestions(data));
  }, []);

  const q = questions[idx];
  const progress = useMemo(() => questions.length ? Math.round(((idx + 1) / questions.length) * 100) : 0, [idx, questions.length]);
  const selected = answers[q?.question_id];

  const onSelect = (key) => setAnswers({ ...answers, [q.question_id]: key });
  const next = () => {
    if (idx < questions.length - 1) setIdx(idx + 1);
    else submit();
  };
  const prev = () => idx > 0 && setIdx(idx - 1);

  const buildPayload = () => ({
    answers: questions.map((qq) => ({
      questionId: qq.question_id,
      answer: answers[qq.question_id] || "A",
      category: qq.category,
    })),
  });

  const generateResult = async (payload) => {
    setGenerating(true);
    setShowPaywall(false);
    try {
      await api.post("/ai/career-test/score", payload);
      await refresh();
      toast.success("AI result generated.");
      navigate("/dashboard", { replace: true, state: { quizCompleted: true } });
    } catch (e) {
      if (e?.response?.status === 402) {
        setPendingPayload(payload);
        setShowPaywall(true);
        return;
      }
      toast.error(e?.response?.data?.detail || "Scoring failed");
    } finally {
      setGenerating(false);
      setSubmitting(false);
    }
  };

  const submit = async () => {
    setSubmitting(true);
    const payload = buildPayload();
    setPendingPayload(payload);
    try {
      await api.get("/subscriptions/quiz-access");
      await generateResult(payload);
    } catch (e) {
      if (e?.response?.status === 402) {
        setShowPaywall(true);
      } else {
        toast.error(e?.response?.data?.detail || "Please complete payment to generate your result.");
      }
      setSubmitting(false);
    }
  };

  if (generating) {
    return (
      <div className="min-h-[70dvh] flex items-center justify-center p-6" data-testid="career-test-generating">
        <div className="w-full max-w-xl text-center">
          <div className="mx-auto h-20 w-20 rounded-full cc-logo-gradient text-white flex items-center justify-center">
            <Sparkles size={34} />
          </div>
          <h1 className="mt-7 font-heading text-2xl sm:text-3xl font-black text-ink">Building your personalized roadmap...</h1>
          <p className="mt-2 text-sm text-muted2">AI is analyzing your answers to find your best career matches.</p>
          <div className="mx-auto mt-8 h-2 w-full max-w-md overflow-hidden rounded-full bg-brand-50">
            <div className="h-full w-4/5 rounded-full bg-brand animate-pulse" />
          </div>
          <p className="mt-4 text-xs text-muted2">Building your Career Match Score & Top Recommendations...</p>
        </div>
      </div>
    );
  }

  if (!q) {
    return <div className="p-6 text-center text-muted2">Loading questions…</div>;
  }

  const exit = () => navigate("/career-test");

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto overflow-x-hidden w-full min-w-0" data-testid="career-test-questions">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <button onClick={() => navigate(-1)} className="p-1.5 -ml-1 text-ink" data-testid="back-btn">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-heading font-extrabold text-lg sm:text-xl text-ink">AI Career Test</h1>
          <p className="text-[10px] sm:text-xs text-muted2">Discover your ideal career path</p>
        </div>
        <button onClick={exit} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-line bg-white text-[11px] sm:text-xs font-semibold text-ink" data-testid="exit-test-btn">
          <X size={12} /> Exit
        </button>
      </div>

      {/* Progress */}
      <div className="glass-card rounded-2xl p-3 sm:p-4 mb-3">
        <div className="flex items-center justify-between text-[11px] sm:text-xs mb-1.5">
          <span className="font-semibold text-ink">Question {idx + 1} of {questions.length}</span>
          <span className="font-semibold text-brand">{progress}%</span>
        </div>
        <div className="h-1.5 bg-brand-50 rounded-full overflow-hidden">
          <div className="h-full bg-brand transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question card */}
      <div className="glass-card rounded-2xl p-3.5 sm:p-5">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-brand-50 text-brand flex items-center justify-center">
            <BadgeCheck size={13} />
          </span>
          <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand text-[10px] font-bold capitalize">
            {q.category}
          </span>
        </div>
        <h2 className="font-heading font-bold text-base sm:text-lg text-ink mt-3 leading-snug">{q.question}</h2>
        <p className="text-[10px] sm:text-xs text-muted2 mt-0.5">Choose the option that best describes you.</p>

        <div className="mt-3 space-y-2" data-testid="question-options">
          {q.options.map((o) => {
            const isSel = selected === o.key;
            return (
              <button
                key={o.key}
                onClick={() => onSelect(o.key)}
                data-testid={`option-${o.key}`}
                className={`w-full text-left flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border transition ${
                  isSel ? "bg-white border-brand ring-2 ring-brand/30" : "bg-white border-line hover:border-brand/40"
                }`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${isSel ? "bg-brand text-white" : "bg-white border-2 border-line text-muted2"}`}>
                  {o.key}
                </span>
                <span className={`text-xs sm:text-sm ${isSel ? "text-ink font-semibold" : "text-ink"}`}>{o.text}</span>
              </button>
            );
          })}
        </div>

        {/* Tip */}
        <div className="mt-3 rounded-xl bg-brand-50 p-2.5 sm:p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center shrink-0">
            <Lightbulb size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading font-bold text-[11px] sm:text-xs text-ink">Tip</p>
            <p className="text-[10px] sm:text-xs text-muted2 mt-0.5">No right or wrong answers. Be honest for best results!</p>
          </div>
          <HeroIllustration Icon={ClipboardCheck} size={44} className="hidden sm:block" />
        </div>

        <div className="mt-4 flex justify-between items-center gap-2">
          <button
            onClick={prev}
            disabled={idx === 0}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full bg-white border border-line text-xs font-semibold text-ink disabled:opacity-40"
            data-testid="question-prev"
          >
            <ArrowLeft size={14} /> Previous
          </button>
          <button
            onClick={next}
            disabled={!selected || submitting}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-brand hover:bg-brand-600 text-white text-xs font-semibold shadow-brand disabled:opacity-50"
            data-testid="question-next"
          >
            {submitting ? "Checking..." : idx === questions.length - 1 ? "Submit" : "Next"} <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-muted2 mt-5 inline-flex items-center gap-1.5 justify-center w-full">
        <ShieldCheck size={14} className="text-brand" /> Your answers are private and secure.
      </p>
      <PremiumSubscriptionModal
        open={showPaywall}
        lockClose
        initialPlan="starter_offer"
        title="Unlock your AI career result"
        subtitle="New user offer: pay Rs 9 today. The Rs 99 starter plan is discounted for your first quiz result."
        onSuccess={() => {
          if (pendingPayload) generateResult(pendingPayload);
        }}
      />
    </div>
  );
}
