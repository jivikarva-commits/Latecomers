import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Lock } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

// ─── 15 Career Profiling Questions (all static — no AI generation) ──────────
/* Legacy quiz removed from runtime. Kept here temporarily for diff context.
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
*/

const QUESTIONS = [
  {
    id: "q1",
    section: "Who Are You?",
    sectionIndex: 1,
    sectionDescription: "Let's start with a few basics about your background.",
    question: "What is your highest level of education?",
    type: "single",
    autoAdvance: true,
    profileKey: "educationLevel",
    options: [
      { value: "Class 10 passed", label: "Class 10 passed" },
      { value: "Class 12 passed", label: "Class 12 passed" },
      { value: "Currently in college", label: "Currently in college" },
      { value: "Graduate / Postgraduate", label: "Graduate / Postgraduate" },
      { value: "Working professional", label: "Working professional (any degree)" },
      { value: "No formal degree / Dropped out", label: "No formal degree / Dropped out" },
    ],
  },
  {
    id: "q2",
    section: "Who Are You?",
    sectionIndex: 1,
    question: "What is your current situation?",
    type: "single",
    autoAdvance: true,
    profileKey: "currentSituation",
    options: [
      { value: "Still studying", label: "Still studying (school or college)" },
      { value: "Just finished, exploring options", label: "Just finished studies, exploring options" },
      { value: "Working, want to switch career", label: "Working, want to switch career" },
      { value: "Working, want to upskill", label: "Working, want to upskill in same field" },
      { value: "Took a break, re-entering", label: "Took a break, re-entering career" },
    ],
  },
  {
    id: "q3",
    section: "Who Are You?",
    sectionIndex: 1,
    question: "What was your main subject area in school or college?",
    type: "single",
    autoAdvance: true,
    profileKey: "subjectBackground",
    skipIf: { questionId: "q1", answer: "No formal degree / Dropped out" },
    options: [
      { value: "Science PCM", label: "Science - Maths / Physics / Chemistry (PCM)" },
      { value: "Science PCB", label: "Science - Biology / Chemistry (PCB)" },
      { value: "Commerce", label: "Commerce / Accounts / Business" },
      { value: "Arts/Humanities", label: "Arts / Humanities / Social Science" },
      { value: "Engineering/Diploma", label: "Engineering / Diploma / ITI" },
      { value: "Other", label: "Other / Not sure / Not applicable" },
    ],
  },
  {
    id: "q4",
    section: "Interests & Personality",
    sectionIndex: 2,
    sectionDescription: "Tell us what excites you - this is the most important section.",
    question: "Which of these activities do you genuinely enjoy?",
    type: "multi",
    autoAdvance: false,
    min: 1,
    max: 3,
    hint: "Select up to 3",
    profileKey: "activities",
    options: [
      { value: "Solving puzzles / coding / logical problems", label: "Solving puzzles / coding / logical problems" },
      { value: "Drawing, designing, or making creative things", label: "Drawing, designing, or making creative things" },
      { value: "Teaching, explaining, or helping others learn", label: "Teaching, explaining, or helping others learn" },
      { value: "Talking to people / selling / convincing", label: "Talking to people / selling / convincing" },
      { value: "Working with tools, machines, or electronics", label: "Working with tools, machines, or electronics" },
      { value: "Writing, storytelling, or content creation", label: "Writing, storytelling, or content creation" },
      { value: "Beauty, fitness, wellness, or cooking", label: "Beauty, fitness, wellness, or cooking" },
      { value: "Managing teams, planning, or leading", label: "Managing teams, planning, or leading" },
      { value: "Playing or making games / digital content", label: "Playing or making games / digital content" },
      { value: "Travelling, hosting, or serving customers", label: "Travelling, hosting, or serving customers" },
      { value: "Learning or speaking foreign languages", label: "Learning or speaking foreign languages" },
    ],
  },
  {
    id: "q5",
    section: "Interests & Personality",
    sectionIndex: 2,
    question: "What kind of work environment suits you best?",
    type: "single",
    autoAdvance: true,
    profileKey: "workEnvironment",
    options: [
      { value: "Desk / computer work", label: "Desk / computer-based (technical or analytical work)" },
      { value: "Creative / remote", label: "Creative studio or work-from-anywhere" },
      { value: "On-field / hands-on", label: "On-the-field or hands-on physical work" },
      { value: "In front of people", label: "In front of people - teaching, presenting, or serving" },
      { value: "Structured office", label: "Office-based - structured, team-oriented" },
    ],
  },
  {
    id: "q6",
    section: "Interests & Personality",
    sectionIndex: 2,
    question: "Which best describes your personality?",
    type: "single",
    autoAdvance: true,
    profileKey: "personality",
    options: [
      { value: "Creative", label: "Creative & artistic - I think visually and love making things" },
      { value: "Logical", label: "Logical & analytical - I love data, systems, and problem-solving" },
      { value: "Social", label: "Social & communicative - I'm great with people and languages" },
      { value: "Entrepreneurial", label: "Entrepreneurial & ambitious - I want to build my own thing" },
      { value: "Disciplined", label: "Disciplined & consistent - I prefer structured, reliable paths" },
      { value: "Caring", label: "Caring & service-oriented - I want to help or heal people" },
    ],
  },
  {
    id: "q7",
    section: "Interests & Personality",
    sectionIndex: 2,
    question: "What topics do you genuinely enjoy learning about?",
    type: "multi",
    autoAdvance: false,
    min: 1,
    max: 3,
    hint: "Select up to 3",
    profileKey: "favouriteTopics",
    options: [
      { value: "Computers / software / coding", label: "Computers, software, or coding" },
      { value: "Data / numbers / analytics", label: "Data, numbers, or business analytics" },
      { value: "Art / animation / gaming / visual media", label: "Art, animation, gaming, or visual media" },
      { value: "Finance / accounting / stock markets", label: "Finance, accounting, or stock markets" },
      { value: "Human body / health / medicine", label: "Human body, health, or medicine" },
      { value: "Law / politics / government", label: "Law, politics, or government" },
      { value: "Foreign languages / international cultures", label: "Foreign languages or international cultures" },
      { value: "Beauty / fashion / fitness / wellness", label: "Beauty, fashion, fitness, or wellness" },
      { value: "Photography / films / storytelling", label: "Photography, films, or storytelling" },
      { value: "Machines / electronics / engineering", label: "Machines, electronics, or engineering" },
      { value: "Marketing / social media / content", label: "Marketing, social media, or content" },
    ],
  },
  {
    id: "q8",
    section: "Career Goals",
    sectionIndex: 3,
    sectionDescription: "What do you want from your career?",
    question: "What matters most to you in a career?",
    type: "single",
    autoAdvance: true,
    profileKey: "careerPriority",
    options: [
      { value: "High salary", label: "High salary / financial independence" },
      { value: "Job security", label: "Job security and stability" },
      { value: "Creative freedom", label: "Creative freedom - doing work I love" },
      { value: "Quick income", label: "Quick income - earning within months" },
      { value: "Own business", label: "Building my own business or freelancing" },
      { value: "Help people", label: "Helping people / making a social impact" },
      { value: "International career", label: "Working internationally or travelling for work" },
    ],
  },
  {
    id: "q9",
    section: "Career Goals",
    sectionIndex: 3,
    question: "How soon do you want to start earning a good income?",
    type: "single",
    autoAdvance: true,
    profileKey: "incomeTimeline",
    options: [
      { value: "3-6 months", label: "Within 3-6 months (short course / skill-based)" },
      { value: "1 year", label: "Within 1 year" },
      { value: "1-3 years", label: "1-3 years is fine (certification or degree)" },
      { value: "3-5 years", label: "3-5 years is okay (CA / Engineering / Law / MBA)" },
    ],
  },
  {
    id: "q10",
    section: "Field of Interest",
    sectionIndex: 4,
    sectionDescription: "Which world do you want to work in?",
    question: "Which field excites you the most?",
    type: "single",
    autoAdvance: true,
    profileKey: "fieldInterest",
    options: [
      { value: "IT/Software/Coding", label: "IT / Software / Coding", category: "IT / Software / Tech" },
      { value: "Data Science/AI/Analytics", label: "Data Science / AI / Analytics", category: "Data & AI" },
      { value: "Cybersecurity", label: "Cybersecurity", category: "Cybersecurity" },
      { value: "Cloud/DevOps/Infrastructure", label: "Cloud & Infrastructure (AWS / DevOps / Networking)", category: "Cloud & Infrastructure" },
      { value: "Design/UI-UX/Graphics", label: "Design / UI-UX / Graphic Arts", category: "Design / Creative / Media" },
      { value: "Animation/Gaming/VFX", label: "Animation / Gaming / VFX", category: "Animation / VFX / Gaming" },
      { value: "Photography/Film/Cinema", label: "Photography / Film / Cinematography", category: "Photography & Film Making" },
      { value: "Digital Marketing/Content", label: "Digital Marketing / Content Creation", category: "Digital Marketing" },
      { value: "Finance/Accounting/Stocks", label: "Finance / Accounting / Stock Market", category: "Finance / Commerce" },
      { value: "Healthcare/Medical", label: "Healthcare / Medical Allied", category: "Healthcare & Medical Allied" },
      { value: "Beauty/Fashion/Wellness", label: "Beauty / Fashion / Fitness / Wellness", category: "Beauty / Wellness" },
      { value: "Languages/International", label: "Languages / International Careers / Tourism", category: "Language" },
      { value: "Aviation/Hospitality/Travel", label: "Aviation / Hospitality / Travel", category: "Aviation & Hospitality" },
      { value: "Government/Civil Services", label: "Government Exams / Civil Services", category: "Government Exam" },
      { value: "Law/MBA/Management", label: "Law / MBA / Management", category: "Law & Management" },
      { value: "Vocational/Trades/Repair", label: "Vocational Skills / Trades / Repair Work", category: "Vocational / Skill" },
      { value: "Emerging Tech", label: "Emerging Tech (Blockchain / EV / Robotics / IoT / Drone)", category: "Emerging Technology" },
      { value: "Freelance/Entrepreneurship", label: "Freelancing / Entrepreneurship / Startups", category: "High-Income Freelance" },
    ],
  },
  {
    id: "q11",
    section: "Practical Factors",
    sectionIndex: 5,
    sectionDescription: "Let's factor in exams, budget, and learning style.",
    question: "Are you open to any of these specific exam paths?",
    type: "single",
    autoAdvance: true,
    profileKey: "examInterest",
    options: [
      { value: "Not targeting any exam", label: "Not targeting any exam" },
      { value: "Banking / SSC / Railways", label: "Banking / SSC / Railways" },
      { value: "UPSC / MPSC / State PSC", label: "UPSC / MPSC / State PSC" },
      { value: "Defense / NDA / CDS / Police", label: "Defense / NDA / CDS / Police" },
      { value: "CA / CMA / CS", label: "CA / CMA / CS" },
      { value: "MBA entrance", label: "MBA entrance (CAT / XAT / SNAP)" },
      { value: "CLAT / Law entrance", label: "CLAT / Law entrance" },
    ],
  },
  {
    id: "q12",
    section: "Practical Factors",
    sectionIndex: 5,
    question: "What is your budget for courses and upskilling?",
    type: "single",
    autoAdvance: true,
    profileKey: "budget",
    options: [
      { value: "Free only", label: "Free only (YouTube / free resources)" },
      { value: "Under Rs 20,000", label: "Under Rs 20,000" },
      { value: "Rs 20,000 - Rs 50,000", label: "Rs 20,000 - Rs 50,000" },
      { value: "Rs 50,000 - Rs 1 lakh", label: "Rs 50,000 - Rs 1 lakh" },
      { value: "Above Rs 1 lakh", label: "Above Rs 1 lakh (college / full degree)" },
    ],
  },
  {
    id: "q13",
    section: "Practical Factors",
    sectionIndex: 5,
    question: "How do you prefer to learn?",
    type: "single",
    autoAdvance: true,
    profileKey: "learningPreference",
    options: [
      { value: "Online self-paced", label: "Online - recorded / self-paced (watch anytime)" },
      { value: "Online live", label: "Online - live classes with a teacher" },
      { value: "Offline classroom", label: "Offline - physical classroom / institute" },
      { value: "Hybrid", label: "Hybrid (mix of online + offline)" },
      { value: "On-the-job", label: "On-the-job / apprenticeship / internship" },
    ],
  },
  {
    id: "q14",
    section: "Challenges & Identity",
    sectionIndex: 6,
    sectionDescription: "Last two questions - what should the roadmap account for?",
    question: "What is your biggest challenge right now?",
    type: "single",
    autoAdvance: true,
    profileKey: "biggestChallenge",
    options: [
      { value: "I don't know what career to choose", label: "I don't know what career to choose" },
      { value: "Financial pressure / limited budget", label: "Financial pressure / limited budget" },
      { value: "I lack confidence or feel behind others", label: "I lack confidence or feel behind others" },
      { value: "Family pressure to choose a specific path", label: "Family pressure to choose a specific path" },
      { value: "My English isn't strong", label: "My English isn't strong" },
      { value: "Too many options, can't decide", label: "Too many options, can't decide" },
      { value: "I have a gap in education or work history", label: "I have a gap in education or work history" },
    ],
  },
  {
    id: "q15",
    section: "Challenges & Identity",
    sectionIndex: 6,
    question: "One last thing - where are you located?",
    type: "single",
    autoAdvance: true,
    profileKey: "location",
    options: [
      { value: "Metro city", label: "Metro city (Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Pune, Kolkata)" },
      { value: "Tier 2 city", label: "Tier 2 city (Jaipur, Lucknow, Indore, Nagpur, Surat, etc.)" },
      { value: "Tier 3 / rural", label: "Tier 3 / small town / rural area" },
      { value: "Outside India", label: "Outside India / planning to go abroad" },
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

function optionValue(option) {
  return typeof option === "string" ? option : option.value;
}

function optionLabel(option) {
  return typeof option === "string" ? option : option.label;
}

function shouldSkipQuestion(question, answers) {
  if (!question?.skipIf) return false;
  const actual = answers[question.skipIf.questionId];
  return Array.isArray(actual)
    ? actual.includes(question.skipIf.answer)
    : actual === question.skipIf.answer;
}

export default function Onboarding() {
  const { user, refresh } = useAuth();
  const navigate = useNavigate();

  // phase: "welcome" | "quiz" | "analyzing" | "done"
  const [phase, setPhase] = useState("welcome");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [advancing, setAdvancing] = useState(false);

  const visibleQuestions = QUESTIONS.filter((question) => !shouldSkipQuestion(question, answers));
  const visibleTotal = visibleQuestions.length;
  const q = visibleQuestions[currentQ] || visibleQuestions[visibleTotal - 1];
  const isMulti = q?.type === "multi";
  const currentAnswer = answers[q?.id];
  const isSelected = (option) =>
    isMulti
      ? Array.isArray(currentAnswer) && currentAnswer.includes(optionValue(option))
      : currentAnswer === optionValue(option);
  const hasAnswer = isMulti
    ? Array.isArray(currentAnswer) && currentAnswer.length >= (q?.min || 1)
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
      const value = optionValue(option);
      if (isMulti) {
        setAnswers((prev) => {
          const curr = Array.isArray(prev[q.id]) ? prev[q.id] : [];
          const set = new Set(curr);
          if (set.has(value)) {
            set.delete(value);
          } else {
            if (set.size >= (q.max || 1)) return prev;
            set.add(value);
          }
          return { ...prev, [q.id]: Array.from(set) };
        });
      } else {
        setAnswers((prev) => ({ ...prev, [q.id]: value }));
        setAdvancing(true);
        setTimeout(() => {
          setAdvancing(false);
          advanceToNext({ forcedAnswer: value });
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

      if (currentQ < visibleTotal - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        // Last question done → submit for AI analysis
        submitForAnalysis(mergedAnswers);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentQ, answers, q, isMulti, visibleTotal]
  );

  const goBack = () => {
    if (currentQ > 0) setCurrentQ((n) => Math.max(0, n - 1));
    else setPhase("welcome");
  };

  // ── Submit to AI for analysis ──────────────────────────────────────────────
  const submitForAnalysis = async (finalAnswers = answers) => {
    setPhase("analyzing");

    const answersPayload = QUESTIONS.filter((qq) => !shouldSkipQuestion(qq, finalAnswers)).map((qq) => ({
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
            AI is analyzing your answers to find your best career matches.
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
  const progressPct = ((currentQ + 1) / visibleTotal) * 100;

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
                {currentQ + 1} / {visibleTotal}
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
                key={optionValue(option)}
                label={optionLabel(option)}
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
                {currentQ === visibleTotal - 1 ? (
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
          {Array.from({ length: visibleTotal }).map((_, i) => (
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
