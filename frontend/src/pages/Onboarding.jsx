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
    section: "Interests",
    sectionIndex: 1,
    sectionDescription: "First, let's understand what naturally pulls your attention.",
    question: "When you have free time, what do you most naturally enjoy doing?",
    type: "single",
    autoAdvance: true,
    profileKey: "naturalInterest",
    options: [
      { value: "Helping someone solve a problem", label: "Helping someone solve a problem" },
      { value: "Creating or making something", label: "Creating or making something" },
      { value: "Analysing data or information", label: "Analysing data or information" },
      { value: "Talking to or persuading people", label: "Talking to or persuading people" },
      { value: "Organising or managing a process", label: "Organising or managing a process" },
    ],
  },
  {
    id: "q2",
    section: "Interests",
    sectionIndex: 1,
    question: "Which activity sounds most satisfying to you?",
    type: "single",
    autoAdvance: true,
    profileKey: "activityInterest",
    options: [
      { value: "Building an app or website", label: "Building an app or website", category: "IT / Software / Tech" },
      { value: "Planning and running a project", label: "Planning and running a project", category: "Law & Management" },
      { value: "Writing content or telling stories", label: "Writing content or telling stories", category: "Digital Marketing" },
      { value: "Working with numbers and spreadsheets", label: "Working with numbers and spreadsheets", category: "Finance / Commerce" },
      { value: "Designing something that looks great", label: "Designing something that looks great", category: "Design / Creative / Media" },
      { value: "Exploring a different practical path", label: "Exploring a different practical path" },
    ],
  },
  {
    id: "q3",
    section: "Interests",
    sectionIndex: 1,
    question: "Have you ever fixed someone's phone or computer, or explained a technical thing and felt satisfied?",
    type: "single",
    autoAdvance: true,
    profileKey: "technicalComfort",
    options: [
      { value: "Yes, I enjoy technical fixing", label: "Yes, I enjoy technical fixing" },
      { value: "Sometimes, I can try with guidance", label: "Sometimes, I can try with guidance" },
      { value: "No, technical fixing does not interest me", label: "No, technical fixing does not interest me" },
    ],
  },
  {
    id: "q4",
    section: "Interests",
    sectionIndex: 1,
    question: "Which subject did you actually enjoy most in school or college?",
    type: "single",
    autoAdvance: true,
    profileKey: "subjectBackground",
    options: [
      { value: "Maths or Accounts", label: "Maths or Accounts", category: "Finance / Commerce" },
      { value: "English or Communication", label: "English or Communication", category: "Language" },
      { value: "Computer Science", label: "Computer Science", category: "IT / Software / Tech" },
      { value: "Business Studies or Economics", label: "Business Studies or Economics", category: "Law & Management" },
      { value: "Arts or Drawing", label: "Arts or Drawing", category: "Design / Creative / Media" },
    ],
  },
  {
    id: "q5",
    section: "Interests",
    sectionIndex: 1,
    question: "If you had to choose an evening side project, what would it be?",
    type: "single",
    autoAdvance: true,
    profileKey: "sideProject",
    options: [
      { value: "Learning to code", label: "Learning to code", category: "IT / Software / Tech" },
      { value: "Starting a small business", label: "Starting a small business", category: "High-Income Freelance" },
      { value: "Creating videos, writing, or design", label: "Creating videos, writing, or design", category: "Design / Creative / Media" },
      { value: "Studying for a government exam", label: "Studying for a government exam", category: "Government Exam" },
      { value: "Improving English or communication", label: "Improving English or communication", category: "Language" },
    ],
  },
  {
    id: "q6",
    section: "Interests",
    sectionIndex: 1,
    question: "What kind of problem do you most enjoy solving?",
    type: "single",
    autoAdvance: true,
    profileKey: "problemStyle",
    options: [
      { value: "Technical problems", label: "Technical problems - fixing, building, debugging", category: "IT / Software / Tech" },
      { value: "People problems", label: "People problems - helping, communicating, managing", category: "Aviation & Hospitality" },
      { value: "Business problems", label: "Business problems - strategy, planning, numbers", category: "Law & Management" },
      { value: "Creative problems", label: "Creative problems - design, writing, storytelling", category: "Design / Creative / Media" },
      { value: "Still exploring problem types", label: "Still exploring what fits me best" },
    ],
  },
  {
    id: "q7",
    section: "Work Style",
    sectionIndex: 2,
    sectionDescription: "Now let's map how you like to work day to day.",
    question: "Which work environment sounds most like you?",
    type: "single",
    autoAdvance: true,
    profileKey: "workEnvironment",
    options: [
      { value: "Independent clear tasks", label: "Working independently with clear tasks" },
      { value: "Team shared goals", label: "Working with a team on shared goals" },
      { value: "Leading others", label: "Managing or leading others" },
      { value: "Customer-facing work", label: "Working directly with customers or clients" },
      { value: "Quiet data or systems work", label: "Working quietly with data or systems" },
    ],
  },
  {
    id: "q8",
    section: "Work Style",
    sectionIndex: 2,
    question: "How do you feel about deadlines and targets?",
    type: "single",
    autoAdvance: true,
    profileKey: "deadlineStyle",
    options: [
      { value: "Deadlines motivate me", label: "Deadlines motivate me" },
      { value: "Steady paced work suits me", label: "Steady paced work suits me" },
      { value: "Targets are fine if fair", label: "Targets are fine if they are fair" },
    ],
  },
  {
    id: "q9",
    section: "Work Style",
    sectionIndex: 2,
    question: "Are you comfortable working on a computer for most of your day?",
    type: "single",
    autoAdvance: true,
    profileKey: "computerComfort",
    options: [
      { value: "Fully comfortable on computer", label: "Fully comfortable on computer" },
      { value: "Can manage computer work", label: "Can manage computer work with practice" },
      { value: "Prefer physical or face-to-face work", label: "Prefer physical or face-to-face work" },
    ],
  },
  {
    id: "q10",
    section: "Work Style",
    sectionIndex: 2,
    question: "If your team made a mistake on a project, what would you naturally do?",
    type: "single",
    autoAdvance: true,
    profileKey: "teamResponse",
    options: [
      { value: "Take charge and solve fast", label: "Take charge and find a solution fast" },
      { value: "Analyse and document the issue", label: "Analyse what went wrong and document it" },
      { value: "Communicate clearly to everyone", label: "Communicate the issue clearly to everyone" },
      { value: "Support the team emotionally", label: "Support my team emotionally and help them recover" },
    ],
  },
  {
    id: "q11",
    section: "Work Style",
    sectionIndex: 2,
    question: "How do you prefer to learn new skills?",
    type: "single",
    autoAdvance: true,
    profileKey: "learningPreference",
    options: [
      { value: "Self-paced video courses", label: "Online video courses at my own pace" },
      { value: "In-person classroom training", label: "In-person classroom training" },
      { value: "Hands-on project learning", label: "Learning by doing hands-on projects" },
      { value: "Reading and self-study", label: "Reading and self-study" },
    ],
  },
  {
    id: "q12",
    section: "Personality",
    sectionIndex: 3,
    sectionDescription: "This helps us understand the role you will actually enjoy.",
    question: "Friends or colleagues would describe you as:",
    type: "single",
    autoAdvance: true,
    profileKey: "personality",
    options: [
      { value: "Planner", label: "The one who always has a plan" },
      { value: "Calm support", label: "The one who keeps everyone calm" },
      { value: "Creative solver", label: "The one who finds creative solutions" },
      { value: "Fast executor", label: "The one who makes things happen fast" },
      { value: "Technical detail person", label: "The one who understands technical details" },
    ],
  },
  {
    id: "q13",
    section: "Personality",
    sectionIndex: 3,
    question: "When facing an important decision, you usually:",
    type: "single",
    autoAdvance: true,
    profileKey: "decisionStyle",
    options: [
      { value: "Gather data first", label: "Gather all data before deciding" },
      { value: "Trust instinct", label: "Go with my gut feeling" },
      { value: "Discuss with others", label: "Discuss with others and take input" },
      { value: "Decide quickly and adjust", label: "Decide quickly and adjust later" },
    ],
  },
  {
    id: "q14",
    section: "Personality",
    sectionIndex: 3,
    question: "How comfortable are you speaking in front of people - presentations, calls, meetings?",
    type: "single",
    autoAdvance: true,
    profileKey: "speakingComfort",
    options: [
      { value: "Very comfortable speaking", label: "Very comfortable - I actually enjoy it" },
      { value: "Comfortable with preparation", label: "Somewhat comfortable with preparation" },
      { value: "Prefer avoiding public speaking", label: "I prefer to avoid it when possible" },
    ],
  },
  {
    id: "q15",
    section: "Personality",
    sectionIndex: 3,
    question: "How do you handle repetitive tasks?",
    type: "single",
    autoAdvance: true,
    profileKey: "repetitionStyle",
    options: [
      { value: "Accuracy matters to me", label: "Fine - consistency and accuracy matter to me" },
      { value: "Prefer variety after some time", label: "I manage but prefer variety" },
      { value: "Need challenge to stay motivated", label: "I find repetition demotivating and need challenge" },
    ],
  },
  {
    id: "q16",
    section: "Personality",
    sectionIndex: 3,
    question: "Which statement feels most true about you?",
    type: "single",
    autoAdvance: true,
    profileKey: "careerIdentity",
    options: [
      { value: "I like building things", label: "I like building things - products, systems, code" },
      { value: "I like growing things", label: "I like growing things - businesses, teams, revenue" },
      { value: "I like fixing things", label: "I like fixing things - problems, processes, inefficiencies" },
      { value: "I like helping people", label: "I like helping people, communities, or organisations" },
      { value: "I am still discovering this", label: "I am still discovering what energizes me" },
    ],
  },
  {
    id: "q17",
    section: "Values",
    sectionIndex: 4,
    sectionDescription: "Your values decide what kind of success feels right.",
    question: "What matters most to you in a job?",
    type: "single",
    autoAdvance: true,
    profileKey: "careerPriority",
    options: [
      { value: "High salary and financial security", label: "High salary and financial security" },
      { value: "Work-life balance and flexibility", label: "Work-life balance and flexibility" },
      { value: "Meaningful work that helps people", label: "Meaningful work that helps people" },
      { value: "Continuous learning and career growth", label: "Continuous learning and career growth" },
      { value: "Status and recognition", label: "Status and recognition" },
    ],
  },
  {
    id: "q18",
    section: "Values",
    sectionIndex: 4,
    question: "How important is job security to you?",
    type: "single",
    autoAdvance: true,
    profileKey: "securityNeed",
    options: [
      { value: "Stability is top priority", label: "Very important - stability is my priority" },
      { value: "Some risk for growth is okay", label: "Somewhat - I can take some risk for growth" },
      { value: "Risk is fine for bigger rewards", label: "Not very - I can take risks for bigger rewards" },
    ],
  },
  {
    id: "q19",
    section: "Values",
    sectionIndex: 4,
    question: "Would you rather work for a company or run your own business someday?",
    type: "single",
    autoAdvance: true,
    profileKey: "businessPreference",
    options: [
      { value: "Stable company role", label: "Company - stable salary and clear role" },
      { value: "Job now business later", label: "Both - stable job now, business later" },
      { value: "Own business goal", label: "My own business - I want to be my own boss" },
    ],
  },
  {
    id: "q20",
    section: "Values",
    sectionIndex: 4,
    question: "How important is social impact or purpose in your job?",
    type: "single",
    autoAdvance: true,
    profileKey: "purposeNeed",
    options: [
      { value: "Purpose matters more than salary", label: "Very important - purpose matters deeply" },
      { value: "Purpose is nice to have", label: "Somewhat - nice to have but not essential" },
      { value: "Income and growth first", label: "Not important - I prioritise income and growth" },
    ],
  },
  {
    id: "q21",
    section: "Skills",
    sectionIndex: 5,
    sectionDescription: "Be honest here. This helps us create a realistic roadmap.",
    question: "Rate your English communication skills honestly:",
    type: "single",
    autoAdvance: true,
    profileKey: "englishLevel",
    options: [
      { value: "Excellent English", label: "Excellent - fluent spoken and written" },
      { value: "Good professional English", label: "Good - can manage professional situations" },
      { value: "Basic English", label: "Basic - can handle simple tasks" },
      { value: "Weak English", label: "Weak - I want to improve this" },
    ],
  },
  {
    id: "q22",
    section: "Skills",
    sectionIndex: 5,
    question: "How comfortable are you with numbers, calculations, and spreadsheets?",
    type: "single",
    autoAdvance: true,
    profileKey: "numbersComfort",
    options: [
      { value: "Strong with numbers", label: "Very comfortable - I enjoy data and numbers" },
      { value: "Moderate with numbers", label: "Moderate - I can manage with practice" },
      { value: "Avoid numbers", label: "Not comfortable - I prefer non-numbers work" },
    ],
  },
  {
    id: "q23",
    section: "Skills",
    sectionIndex: 5,
    question: "Have you used software tools at work or study, like Excel, CRM, ERP, or dashboards?",
    type: "single",
    autoAdvance: true,
    profileKey: "softwareExposure",
    options: [
      { value: "Extensive tool experience", label: "Yes, I have used several tools extensively" },
      { value: "Basic tool experience", label: "I have used basic tools" },
      { value: "No tool experience", label: "No, I have not used work software much" },
    ],
  },
  {
    id: "q24",
    section: "Skills",
    sectionIndex: 5,
    question: "Which skills do you already have, even at a basic level?",
    type: "multi",
    autoAdvance: false,
    min: 1,
    max: 4,
    hint: "Select up to 4",
    profileKey: "existingSkills",
    options: [
      { value: "MS Excel", label: "MS Excel", category: "Data & AI" },
      { value: "Customer service communication", label: "Customer service or communication", category: "Aviation & Hospitality" },
      { value: "Data entry typing", label: "Data entry or typing accuracy", category: "Finance / Commerce" },
      { value: "Social media basics", label: "Social media basics", category: "Digital Marketing" },
      { value: "Basic coding knowledge", label: "Basic coding or technical knowledge", category: "IT / Software / Tech" },
      { value: "Writing content creation", label: "Writing or content creation", category: "Digital Marketing" },
      { value: "No current skill yet", label: "No clear skill yet - I want beginner guidance" },
    ],
  },
  {
    id: "q25",
    section: "Skills",
    sectionIndex: 5,
    question: "How do you rate your problem-solving ability when something goes wrong at work?",
    type: "single",
    autoAdvance: true,
    profileKey: "problemSolving",
    options: [
      { value: "Strong problem solver", label: "Strong - I stay calm and figure it out" },
      { value: "Average problem solver", label: "Average - I manage with some guidance" },
      { value: "Need clear instructions", label: "I prefer clear instructions when problems happen" },
    ],
  },
  {
    id: "q26",
    section: "Situation",
    sectionIndex: 6,
    sectionDescription: "Last section: your current reality and timeline.",
    question: "Which option best describes your recent background?",
    type: "single",
    autoAdvance: true,
    profileKey: "currentSituation",
    options: [
      { value: "BPO or telecaller experience", label: "BPO or telecaller experience" },
      { value: "Backoffice or data entry experience", label: "Backoffice or data entry experience" },
      { value: "Fresh graduate figuring out career", label: "Fresh graduate figuring out career" },
      { value: "Fresher with no work experience", label: "Fresher with no work experience" },
    ],
  },
  {
    id: "q27",
    section: "Situation",
    sectionIndex: 6,
    question: "What is stopping you most from moving ahead right now?",
    type: "single",
    autoAdvance: true,
    profileKey: "biggestChallenge",
    options: [
      { value: "No career growth in current work", label: "No career growth in current work" },
      { value: "Do not know which career to choose", label: "Do not know which career to choose" },
      { value: "Lack right skills or qualifications", label: "Lack the right skills or qualifications" },
      { value: "Financial constraints for courses", label: "Financial constraints for courses" },
      { value: "Low confidence after a gap", label: "Low confidence after a gap or slow start" },
    ],
  },
  {
    id: "q28",
    section: "Situation",
    sectionIndex: 6,
    question: "In your ideal workday, what are you doing?",
    type: "single",
    autoAdvance: true,
    profileKey: "idealWorkday",
    options: [
      { value: "Solving code or data at a laptop", label: "Sitting at a laptop solving code or data", category: "Data & AI" },
      { value: "Presenting strategy in meetings", label: "In meetings, presenting or discussing strategy", category: "Law & Management" },
      { value: "Creating content design or videos", label: "Creating content, design, or videos", category: "Design / Creative / Media" },
      { value: "Meeting clients and selling", label: "Meeting clients, presenting, or selling", category: "Digital Marketing" },
      { value: "Preparing reports and spreadsheets", label: "Working with numbers, spreadsheets, and reports", category: "Finance / Commerce" },
    ],
  },
  {
    id: "q29",
    section: "Situation",
    sectionIndex: 6,
    question: "What is your target monthly salary in your next role?",
    type: "single",
    autoAdvance: true,
    profileKey: "targetSalary",
    options: [
      { value: "15000-25000 monthly", label: "Rs 15,000 - Rs 25,000" },
      { value: "25000-40000 monthly", label: "Rs 25,000 - Rs 40,000" },
      { value: "40000-60000 monthly", label: "Rs 40,000 - Rs 60,000" },
      { value: "60000 plus monthly", label: "Rs 60,000+" },
      { value: "Not sure target salary", label: "Not sure yet - whatever is fair" },
    ],
  },
  {
    id: "q30",
    section: "Situation",
    sectionIndex: 6,
    question: "How quickly do you want to be in a new career?",
    type: "single",
    autoAdvance: true,
    profileKey: "incomeTimeline",
    options: [
      { value: "3-6 months transition", label: "As fast as possible - 3 to 6 months" },
      { value: "6-12 months transition", label: "6 to 12 months - I want to do it properly" },
      { value: "1-2 years transition", label: "1 to 2 years - I can take my time" },
      { value: "No fixed pressure", label: "No pressure - whenever I am ready" },
    ],
  },
];

const TOTAL = QUESTIONS.length; // 30

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
              <strong className="text-ink">30 quick questions</strong> to build
              your personalized career roadmap. This takes about{" "}
              <strong className="text-ink">5 minutes</strong> and helps me match
              you with the best careers in India for your profile.
            </p>

            <div className="mt-5 flex gap-4 justify-center text-xs text-muted2">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-500" /> 30 questions
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-500" /> ~5 minutes
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
