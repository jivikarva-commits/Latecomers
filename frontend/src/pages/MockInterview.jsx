import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { toast } from "sonner";
import { ArrowLeft, Mic, ChevronDown, Code2, BarChart3, History, FileText, Clock, Zap, Target, MessageSquare, FileQuestion, Play, ArrowRight, Send, MessageCircle, Bot as BotIcon } from "lucide-react";
import HeroIllustration from "../components/HeroIllustration";
import { useAuth } from "../context/AuthContext";

const ROLES = ["Data Scientist", "Software Developer", "Product Manager", "UX Designer", "Business Analyst", "Cybersecurity Analyst", "Financial Analyst", "Marketing Manager"];

const TypeCard = ({ active, onClick, icon: Icon, color, title, desc, testid }) => (
  <button onClick={onClick} data-testid={testid} className={`p-3 sm:p-4 rounded-2xl border text-left transition relative ${active ? "bg-brand-50 border-brand" : "bg-white border-line hover:border-brand/40"}`}>
    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ background: color + "25", color }}>
      <Icon size={18} />
    </div>
    <p className="font-heading font-bold text-sm text-ink">{title}</p>
    <p className="text-[11px] text-muted2 mt-0.5 leading-snug">{desc}</p>
    {active && <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center text-[10px]">✓</span>}
  </button>
);

const DiffCard = ({ active, onClick, icon: Icon, color, title, desc, testid }) => (
  <button onClick={onClick} data-testid={testid} className={`p-3 sm:p-4 rounded-2xl border text-left transition relative ${active ? "bg-brand-50 border-brand" : "bg-white border-line hover:border-brand/40"}`}>
    <div className="flex items-center gap-2 mb-1">
      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: color + "25", color }}>
        <Icon size={14} />
      </div>
      <p className="font-heading font-bold text-sm text-ink">{title}</p>
    </div>
    <p className="text-[11px] text-muted2 leading-snug">{desc}</p>
    {active && <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center text-[10px]">✓</span>}
  </button>
);

const Stat = ({ icon: Icon, color, value, label }) => (
  <div className="flex flex-col items-center text-center px-2 py-3 sm:py-4">
    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1.5" style={{ background: color + "25", color }}>
      <Icon size={18} />
    </div>
    <p className="font-heading font-extrabold text-base text-brand">{value}</p>
    <p className="text-[11px] text-muted2 leading-snug">{label}</p>
  </div>
);

const Tip = ({ icon: Icon, color, text }) => (
  <div className="flex items-center gap-3 py-3 border-b border-line last:border-0">
    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: color + "25", color }}>
      <Icon size={16} />
    </div>
    <p className="text-sm text-ink">{text}</p>
  </div>
);

const resourceFromWeakness = (text) => {
  const t = `${text}`.toLowerCase();
  if (t.includes("structure") || t.includes("star")) return "Practice STAR framework answer templates";
  if (t.includes("technical") || t.includes("concept")) return "Revise core role concepts and common interview questions";
  if (t.includes("example") || t.includes("project")) return "Prepare 3 detailed project stories with metrics";
  if (t.includes("communication") || t.includes("clarity")) return "Practice concise spoken delivery and mock recordings";
  return "Do one focused mock interview with feedback this week";
};

export default function MockInterview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [role, setRole] = useState("Data Scientist");
  const [type, setType] = useState("behavioral");
  const [diff, setDiff] = useState("easy");
  const [session, setSession] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evals, setEvals] = useState({});
  const [busy, setBusy] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    const topMatchSlug = user?.top_career_matches?.[0]?.careerSlug;
    if (!topMatchSlug) return;
    const topRole = topMatchSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    if (ROLES.includes(topRole)) setRole(topRole);
  }, [user?.top_career_matches]);

  const openHistory = async () => {
    setHistoryOpen(true);
    setHistoryLoading(true);
    try {
      const { data } = await api.get("/ai/mock-interview/history");
      setHistoryList(data || []);
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed to load interview history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const start = async () => {
    setBusy(true);
    try {
      const { data } = await api.post("/ai/mock-interview/start", { role, interview_type: type, difficulty: diff });
      setSession(data);
      setQIdx(0);
      setEvals({});
      setAnswer("");
      setShowResults(false);
      toast.success("Interview started!");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed");
    } finally {
      setBusy(false);
    }
  };

  const submitAns = async () => {
    if (!answer.trim()) return;
    setBusy(true);
    try {
      const { data } = await api.post("/ai/mock-interview/answer", {
        session_id: session.session_id,
        question_index: qIdx,
        answer,
      });
      setEvals((prev) => ({ ...prev, [qIdx]: data }));
      setAnswer("");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Eval failed");
    } finally {
      setBusy(false);
    }
  };

  const finish = () => setShowResults(true);

  const scoredEvals = useMemo(() => Object.values(evals).filter((ev) => typeof ev?.score === "number"), [evals]);
  const overallScore = scoredEvals.length ? (scoredEvals.reduce((sum, ev) => sum + ev.score, 0) / scoredEvals.length).toFixed(1) : "0.0";
  const weakResources = useMemo(() => {
    const weak = scoredEvals.filter((ev) => ev.score <= 6).flatMap((ev) => ev.improvements || []);
    return [...new Set(weak.map(resourceFromWeakness))].slice(0, 4);
  }, [scoredEvals]);

  if (session) {
    const hasQuestions = Array.isArray(session.questions) && session.questions.length > 0;
    if (!hasQuestions) {
      return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto" data-testid="mock-interview-empty-session">
          <div className="glass-card rounded-3xl p-6 sm:p-8 text-center">
            <p className="font-heading font-bold text-xl text-ink">Interview questions unavailable</p>
            <p className="text-sm text-muted2 mt-2">We could not generate valid questions for this setup. Please try again.</p>
            <button onClick={() => setSession(null)} className="mt-5 inline-flex items-center gap-2 bg-brand text-white font-semibold px-5 py-2.5 rounded-full shadow-brand">
              Back to setup
            </button>
          </div>
        </div>
      );
    }

    if (showResults) {
      return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto" data-testid="mock-interview-results">
          <div className="glass-card rounded-3xl p-6">
            <p className="font-heading font-extrabold text-2xl text-ink">Interview Results</p>
            <p className="text-sm text-muted2 mt-1">Role: {session.setup?.role || role}</p>
            <div className="mt-4 bg-brand-50 border border-brand-100 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted2 uppercase">Overall score</p>
                <p className="font-heading font-extrabold text-4xl text-brand">{overallScore}/10</p>
              </div>
              <div className="text-right text-xs text-muted2">
                <p>{scoredEvals.length} answers evaluated</p>
                <p>{session.questions.length} total questions</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <p className="font-heading font-bold text-ink">Feedback by Question</p>
              {session.questions.map((q, idx) => {
                const ev = evals[idx];
                return (
                  <div key={idx} className="bg-white border border-line rounded-2xl p-4">
                    <p className="text-sm font-semibold text-ink">Q{idx + 1}. {q.q}</p>
                    {!ev ? (
                      <p className="text-xs text-muted2 mt-2">No submitted answer for this question.</p>
                    ) : (
                      <>
                        <p className="text-xs font-bold text-brand mt-2">Score: {ev.score}/10</p>
                        <p className="text-sm text-ink mt-1">{ev.feedback}</p>
                        {ev.improvements?.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-semibold text-muted2 uppercase">What to improve</p>
                            {ev.improvements.map((item, k) => (
                              <p key={k} className="text-xs text-muted2 mt-1">• {item}</p>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <p className="font-heading font-bold text-emerald-800">Recommended resources for weak areas</p>
              {weakResources.length ? (
                weakResources.map((item) => (
                  <p key={item} className="text-sm text-emerald-700 mt-1">• {item}</p>
                ))
              ) : (
                <p className="text-sm text-emerald-700 mt-1">Great job. Continue timed mocks and role-specific question practice.</p>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSession(null);
                  setShowResults(false);
                }}
                className="inline-flex items-center gap-2 bg-brand text-white font-semibold px-5 py-2.5 rounded-full shadow-brand"
              >
                Start New Interview
              </button>
              <button onClick={openHistory} className="inline-flex items-center gap-2 bg-white border border-line text-ink font-semibold px-5 py-2.5 rounded-full">
                <History size={14} /> View History
              </button>
            </div>
          </div>
        </div>
      );
    }

    const q = session.questions[qIdx];
    const ev = evals[qIdx];

    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto" data-testid="mock-interview-room">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => setSession(null)} className="p-2 -ml-2 text-ink">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="font-heading font-bold text-lg text-ink">Mock Interview · {session.setup?.role || role}</h1>
            <p className="text-xs text-muted2 capitalize">{session.setup?.interview_type || type} · {session.setup?.difficulty || diff}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted2 mb-2">
          <span>Question {qIdx + 1} of {session.questions.length}</span>
          <span>{session.questions.filter((_, i) => evals[i]).length}/{session.questions.length} answered</span>
        </div>
        <div className="h-2 bg-white border border-line rounded-full overflow-hidden mb-5">
          <div className="h-full bg-brand transition-all" style={{ width: `${((qIdx + 1) / session.questions.length) * 100}%` }} />
        </div>

        <div className="glass-card rounded-3xl p-5 sm:p-7">
          <p className="text-xs uppercase tracking-wider text-brand font-bold">Interviewer</p>
          <p className="font-heading font-bold text-lg text-ink mt-2">{q.q}</p>
          {q.hint && <p className="text-xs text-muted2 mt-2">💡 Hint: {q.hint}</p>}

          {!ev ? (
            <div className="mt-4">
              <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={5} placeholder="Type your answer..." data-testid="interview-answer-input" className="w-full bg-brand-50 border border-line rounded-2xl p-4 text-sm" />
              <button onClick={submitAns} disabled={busy} className="mt-3 inline-flex items-center gap-2 bg-brand hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full disabled:opacity-60" data-testid="submit-answer-button">
                <Send size={14} /> {busy ? "Evaluating…" : "Submit answer"}
              </button>
            </div>
          ) : (
            <div className="mt-4 bg-brand-50 rounded-2xl p-4">
              <p className="font-bold text-brand">Score: {ev.score}/10</p>
              <p className="text-sm text-ink mt-2">{ev.feedback}</p>
              {ev.improvements?.length > 0 && (
                <>
                  <p className="text-xs uppercase tracking-wider text-muted2 mt-3 mb-1">Improvements</p>
                  <ul className="text-sm text-ink space-y-1 list-disc list-inside">
                    {ev.improvements.map((i, k) => <li key={k}>{i}</li>)}
                  </ul>
                </>
              )}
              {qIdx < session.questions.length - 1 ? (
                <button onClick={() => setQIdx(qIdx + 1)} className="mt-4 inline-flex items-center gap-2 bg-brand text-white text-sm font-semibold px-5 py-2 rounded-full" data-testid="next-question-button">
                  Next question <ArrowRight size={14} />
                </button>
              ) : (
                <button onClick={finish} className="mt-4 inline-flex items-center gap-2 bg-brand text-white text-sm font-semibold px-5 py-2 rounded-full" data-testid="finish-interview-button">
                  View Results
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto" data-testid="mock-interview-setup">
      <div className="flex items-start justify-between gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-ink">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-ink">Mock Interview</h1>
          <p className="text-xs sm:text-sm text-muted2">Practice, improve and ace your interviews</p>
        </div>
        <button onClick={openHistory} className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-line bg-white text-xs sm:text-sm font-semibold text-ink" data-testid="history-btn">
          <History size={14} /> History
        </button>
      </div>

      <div className="glass-card rounded-3xl p-5 sm:p-6 flex items-center gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
          <h2 className="font-heading font-bold text-base sm:text-xl text-ink">Practice Real Interviews</h2>
          <p className="text-xs sm:text-sm text-muted2 mt-1.5 leading-relaxed">Get AI-powered mock interviews with realistic questions and instant feedback to boost your confidence.</p>
        </div>
        <HeroIllustration Icon={BotIcon} size={96} className="hidden sm:block" />
        <HeroIllustration Icon={BotIcon} size={64} className="sm:hidden shrink-0" />
      </div>

      <p className="font-heading font-bold text-ink mt-6 mb-2">Choose Role</p>
      <div className="relative">
        <BarChart3 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand z-10" />
        <select value={role} onChange={(e) => setRole(e.target.value)} data-testid="role-select" className="w-full appearance-none bg-white border border-line rounded-2xl pl-12 pr-10 py-3.5 text-sm font-semibold text-ink">
          {ROLES.map((r) => <option key={r}>{r}</option>)}
        </select>
        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted2 pointer-events-none" />
      </div>

      <p className="font-heading font-bold text-ink mt-6 mb-2">Interview Type</p>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <TypeCard active={type === "behavioral"} onClick={() => setType("behavioral")} icon={FileQuestion} color="#5B4FE9" title="Behavioral" desc="Questions about your experience and approach" testid="type-behavioral" />
        <TypeCard active={type === "technical"} onClick={() => setType("technical")} icon={Code2} color="#22C55E" title="Technical" desc="Test your technical knowledge and coding" testid="type-technical" />
        <TypeCard active={type === "case"} onClick={() => setType("case")} icon={BarChart3} color="#F97316" title="Case Study" desc="Business cases to test your problem-solving" testid="type-case" />
      </div>

      <p className="font-heading font-bold text-ink mt-6 mb-2">Difficulty Level</p>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <DiffCard active={diff === "easy"} onClick={() => setDiff("easy")} icon={BarChart3} color="#22C55E" title="Beginner" desc="For freshers" testid="diff-easy" />
        <DiffCard active={diff === "medium"} onClick={() => setDiff("medium")} icon={BarChart3} color="#F59E0B" title="Intermediate" desc="1-3 years exp" testid="diff-medium" />
        <DiffCard active={diff === "hard"} onClick={() => setDiff("hard")} icon={BarChart3} color="#EF4444" title="Advanced" desc="3+ years exp" testid="diff-hard" />
      </div>

      <p className="font-heading font-bold text-ink mt-6 mb-2">What to Expect</p>
      <div className="glass-card rounded-3xl p-2 grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-line">
        <Stat icon={FileText} color="#5B4FE9" value="5-8" label="Questions Per Interview" />
        <Stat icon={Clock} color="#3B82F6" value="15-30 min" label="Duration Per Session" />
        <Stat icon={Zap} color="#22C55E" value="Instant" label="AI Feedback & Suggestions" />
        <Stat icon={Target} color="#F97316" value="Detailed" label="Performance Report" />
      </div>

      <p className="font-heading font-bold text-ink mt-6 mb-2">Tips for a Great Mock Interview</p>
      <div className="surface-gradient rounded-3xl border border-line p-4 sm:p-5">
        <Tip icon={Mic} color="#22C55E" text="Speak clearly and at a normal pace." />
        <Tip icon={MessageSquare} color="#F59E0B" text="Take your time to think before answering." />
        <Tip icon={MessageCircle} color="#5B4FE9" text="Use specific examples with measurable impact." />
      </div>

      <button onClick={start} disabled={busy} className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-600 text-white font-semibold px-6 py-4 rounded-full shadow-brand text-base disabled:opacity-60" data-testid="start-interview-button">
        <Play size={18} fill="currentColor" /> {busy ? "Preparing…" : "Start Mock Interview"}
      </button>

      {historyOpen && (
        <>
          <button onClick={() => setHistoryOpen(false)} className="fixed inset-0 bg-black/30 z-30" aria-label="Close history" />
          <div className="fixed z-40 inset-x-4 md:inset-x-auto md:right-6 top-20 md:w-[440px] bg-white border border-line rounded-3xl shadow-2xl max-h-[70vh] overflow-hidden">
            <div className="px-4 py-3 border-b border-line flex items-center justify-between">
              <p className="font-heading font-bold text-ink">Interview History</p>
              <button onClick={() => setHistoryOpen(false)} className="text-sm font-semibold text-brand">Close</button>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh]">
              {historyLoading && (
                <>
                  <div className="h-16 rounded-xl skeleton-shimmer" />
                  <div className="h-16 rounded-xl skeleton-shimmer" />
                </>
              )}
              {!historyLoading && historyList.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-sm font-semibold text-ink">No interviews yet</p>
                  <p className="text-xs text-muted2 mt-1">Start your first mock interview to build your history.</p>
                </div>
              )}
              {!historyLoading &&
                historyList.map((item) => (
                  <div key={item.session_id} className="bg-brand-50 border border-brand-100 rounded-2xl p-3">
                    <p className="text-sm font-semibold text-ink">{item.setup?.role || "Interview Session"}</p>
                    <p className="text-xs text-muted2 mt-0.5 capitalize">{item.setup?.interview_type} · {item.setup?.difficulty}</p>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-brand font-bold">{item.overall_score || 0}/10</span>
                      <span className="text-muted2">{item.answered_count}/{item.question_count} answered</span>
                    </div>
                    <p className="text-[11px] text-muted2 mt-1">{new Date(item.created_at).toLocaleString()}</p>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
