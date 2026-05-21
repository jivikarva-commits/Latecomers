import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, BadgeCheck, ShieldCheck, X, Lightbulb } from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";
import HeroIllustration from "../components/HeroIllustration";
import { ClipboardCheck } from "lucide-react";

export default function CareerTestQuestions() {
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

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

  const submit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        answers: questions.map((qq) => ({
          questionId: qq.question_id,
          answer: answers[qq.question_id] || "A",
          category: qq.category,
        })),
      };
      const { data } = await api.post("/ai/career-test/score", payload);
      toast.success("AI scoring complete!");
      navigate("/career-test/results", { state: { result: data } });
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Scoring failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!q) {
    return <div className="p-6 text-center text-muted2">Loading questions…</div>;
  }

  const exit = () => navigate("/career-test");

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto pb-28" data-testid="career-test-questions">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-ink" data-testid="back-btn">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-ink">AI Career Test</h1>
          <p className="text-xs sm:text-sm text-muted2">Discover your ideal career path</p>
        </div>
        <button onClick={exit} className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-line bg-white text-xs sm:text-sm font-semibold text-ink" data-testid="exit-test-btn">
          <X size={14} /> Exit Test
        </button>
      </div>

      {/* Progress */}
      <div className="bg-white border border-line rounded-3xl p-4 sm:p-5 mb-4">
        <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
          <span className="font-semibold text-ink">Question {idx + 1} of {questions.length}</span>
          <span className="font-semibold text-brand">{progress}% Completed</span>
        </div>
        <div className="h-2 bg-brand-50 rounded-full overflow-hidden">
          <div className="h-full bg-brand transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-3xl border border-line shadow-soft p-5 sm:p-7">
        <div className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-full bg-brand-50 text-brand flex items-center justify-center">
            <BadgeCheck size={16} />
          </span>
          <span className="px-3 py-1 rounded-full bg-brand-50 text-brand text-xs font-bold capitalize">
            {q.category}
          </span>
        </div>
        <h2 className="font-heading font-bold text-xl sm:text-2xl text-ink mt-4">{q.question}</h2>
        <p className="text-xs sm:text-sm text-muted2 mt-1">Choose the option that best describes you.</p>

        <div className="mt-5 space-y-3" data-testid="question-options">
          {q.options.map((o) => {
            const isSel = selected === o.key;
            return (
              <button
                key={o.key}
                onClick={() => onSelect(o.key)}
                data-testid={`option-${o.key}`}
                className={`w-full text-left flex items-center gap-3 p-4 rounded-2xl border transition ${
                  isSel ? "bg-white border-brand ring-2 ring-brand/30" : "bg-white border-line hover:border-brand/40"
                }`}
              >
                <span className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${isSel ? "bg-brand text-white" : "bg-white border-2 border-line text-muted2"}`}>
                  {o.key}
                </span>
                <span className={`text-sm sm:text-base ${isSel ? "text-ink font-semibold" : "text-ink"}`}>{o.text}</span>
              </button>
            );
          })}
        </div>

        {/* Tip card with 3D-ish illustration */}
        <div className="mt-5 rounded-2xl bg-brand-50 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center shrink-0">
            <Lightbulb size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading font-bold text-sm text-ink">Tip</p>
            <p className="text-xs text-muted2 mt-0.5">There are no right or wrong answers. Be honest to get the best results!</p>
          </div>
          <HeroIllustration Icon={ClipboardCheck} size={56} className="hidden sm:block" />
        </div>

        <div className="mt-6 flex justify-between items-center gap-3">
          <button
            onClick={prev}
            disabled={idx === 0}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white border border-line text-sm font-semibold text-ink disabled:opacity-40"
            data-testid="question-prev"
          >
            <ArrowLeft size={16} /> Previous
          </button>
          <button
            onClick={next}
            disabled={!selected || submitting}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-brand hover:bg-brand-600 text-white text-sm font-semibold shadow-brand disabled:opacity-50"
            data-testid="question-next"
          >
            {submitting ? "Scoring with AI..." : idx === questions.length - 1 ? "Submit" : "Next"} <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-muted2 mt-5 inline-flex items-center gap-1.5 justify-center w-full">
        <ShieldCheck size={14} className="text-brand" /> Your answers are private and secure.
      </p>
    </div>
  );
}
