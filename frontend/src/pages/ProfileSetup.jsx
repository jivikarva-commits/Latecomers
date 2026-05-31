import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, GraduationCap, Phone, User as UserIcon, Sparkles } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import { toast } from "sonner";

const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

const EDU_LEVELS = [
  { value: "Class 10 passed", label: "Class 10 passed", desc: "Just finished 10th" },
  { value: "Class 12 passed", label: "Class 12 passed", desc: "HSC / 12th complete" },
  { value: "Currently in college", label: "Currently in college", desc: "UG / Diploma in progress" },
  { value: "Graduate / Postgraduate", label: "Graduate / Postgraduate", desc: "Degree completed" },
  { value: "Working professional", label: "Working professional", desc: "Any degree, currently working" },
  { value: "No formal degree / Dropped out", label: "No formal degree", desc: "Dropped out / self-taught" },
];

const STREAMS = [
  { value: "Science PCM", label: "Science – PCM", desc: "Maths / Physics / Chem" },
  { value: "Science PCB", label: "Science – PCB", desc: "Biology / Chem" },
  { value: "Commerce", label: "Commerce", desc: "Accounts / Business" },
  { value: "Arts/Humanities", label: "Arts / Humanities", desc: "Social science / Lit" },
  { value: "Engineering/Diploma", label: "Engineering / Diploma", desc: "BE / BTech / ITI" },
  { value: "Other", label: "Other / Not sure", desc: "Different background" },
];

const STREAM_REQUIRED_LEVELS = new Set([
  "Class 12 passed",
  "Currently in college",
  "Graduate / Postgraduate",
]);

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { user, refresh } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [eduLevel, setEduLevel] = useState(user?.profile?.educationLevel || "");
  const [stream, setStream] = useState(user?.profile?.stream || "");
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: phone, 2: name+gender, 3: education, 4: review

  React.useEffect(() => {
    if (user?.isProfileCompleted) {
      navigate(user.onboarded ? "/dashboard" : "/onboarding", { replace: true });
    }
  }, [user, navigate]);

  const phoneDigits = phone.replace(/\D/g, "");
  const phoneValid = phoneDigits.length >= 10 && phoneDigits.length <= 15;
  const nameValid = name.trim().length >= 2;
  const genderValid = GENDERS.includes(gender);
  const streamRequired = STREAM_REQUIRED_LEVELS.has(eduLevel);
  const streamValid = !streamRequired || (stream && STREAMS.some((s) => s.value === stream));
  const eduValid = !!eduLevel && streamValid;

  const goNextFromPhone = () => {
    if (!phoneValid) { toast.error("Please enter a valid mobile number (10–15 digits)"); return; }
    setStep(2);
  };

  const goNextFromIdentity = () => {
    if (!nameValid) { toast.error("Please enter your name"); return; }
    if (!genderValid) { toast.error("Please select gender"); return; }
    setStep(3);
  };

  const goNextFromEducation = () => {
    if (!eduLevel) { toast.error("Please select your education level"); return; }
    if (streamRequired && !streamValid) { toast.error("Please select your stream/subject"); return; }
    setStep(4);
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      await api.post("/me/profile/complete", {
        name: name.trim(),
        gender,
        phoneNumber: phone.trim(),
        educationLevel: eduLevel,
        stream: streamRequired ? stream : undefined,
      });
      await refresh();
      toast.success("Profile saved!");
      navigate("/onboarding", { replace: true });
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed to save profile.");
    } finally {
      setSubmitting(false);
    }
  };

  const Stepper = () => (
    <div className="flex items-center gap-1 mb-4">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className={`h-1.5 rounded-full transition-all flex-1 ${n <= step ? "bg-brand" : "bg-brand-100"}`} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-5"><Logo /></div>

        <div className="bg-white rounded-3xl border border-line shadow-soft p-6 sm:p-8">
          <Stepper />
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand">Step {step} of 4</p>
          <h1 className="font-heading font-extrabold text-2xl text-ink mt-1">
            {step === 1 && "Add your mobile number"}
            {step === 2 && "Tell us about you"}
            {step === 3 && "What's your education?"}
            {step === 4 && "All set!"}
          </h1>
          <p className="text-sm text-muted2 mt-1.5 leading-relaxed">
            {step === 1 && "We'll use this for important career updates and to send you your career roadmap. OTP verification will come later."}
            {step === 2 && "Quick details so we can personalize your reports and recommendations."}
            {step === 3 && "Helps us match careers and courses that actually fit your background."}
            {step === 4 && "Review your details and start the career quiz."}
          </p>

          {step === 1 && (
            <div className="mt-5 space-y-3">
              <label className="block">
                <span className="text-xs font-bold text-ink">Mobile number</span>
                <div className="relative mt-1.5">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted2" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d+\s-]/g, ""))}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white border border-line rounded-xl pl-10 pr-4 py-3 text-sm focus:border-brand outline-none"
                    autoFocus
                  />
                </div>
                {phone && !phoneValid && <p className="text-[11px] text-red-500 mt-1">Enter a valid 10–15 digit number</p>}
              </label>
              <button
                onClick={goNextFromPhone}
                disabled={!phoneValid}
                className="w-full inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-600 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition"
              >
                Continue <ArrowRight size={16} />
              </button>
              <p className="text-[11px] text-muted2 text-center">🔒 Your number is private and used only for account security.</p>
            </div>
          )}

          {step === 2 && (
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-xs font-bold text-ink">Your full name</span>
                <div className="relative mt-1.5">
                  <UserIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full bg-white border border-line rounded-xl pl-10 pr-4 py-3 text-sm focus:border-brand outline-none"
                    autoFocus
                  />
                </div>
              </label>
              <div>
                <span className="text-xs font-bold text-ink">Gender</span>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  {GENDERS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`px-3 py-2.5 rounded-xl border text-sm font-semibold transition ${
                        gender === g ? "bg-brand text-white border-brand shadow-brand" : "bg-white border-line text-ink hover:bg-brand-50"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="flex-1 rounded-xl border border-line bg-white text-ink font-bold py-3 text-sm">Back</button>
                <button
                  onClick={goNextFromIdentity}
                  disabled={!nameValid || !genderValid}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition"
                >
                  Continue <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="mt-5 space-y-4">
              <div>
                <span className="text-xs font-bold text-ink">Highest education level</span>
                <div className="grid grid-cols-1 gap-2 mt-1.5">
                  {EDU_LEVELS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setEduLevel(opt.value);
                        if (!STREAM_REQUIRED_LEVELS.has(opt.value)) setStream("");
                      }}
                      className={`text-left px-3 py-2.5 rounded-xl border transition flex items-center gap-3 ${
                        eduLevel === opt.value
                          ? "bg-brand text-white border-brand shadow-brand"
                          : "bg-white border-line text-ink hover:bg-brand-50"
                      }`}
                    >
                      <GraduationCap size={16} className={eduLevel === opt.value ? "text-white" : "text-brand"} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold leading-tight">{opt.label}</p>
                        <p className={`text-[11px] mt-0.5 ${eduLevel === opt.value ? "text-white/85" : "text-muted2"}`}>{opt.desc}</p>
                      </div>
                      {eduLevel === opt.value && <CheckCircle2 size={16} />}
                    </button>
                  ))}
                </div>
              </div>

              {streamRequired && (
                <div className="animate-fade-in">
                  <span className="text-xs font-bold text-ink">Stream / Subject background</span>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {STREAMS.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setStream(s.value)}
                        className={`text-left px-3 py-2.5 rounded-xl border transition ${
                          stream === s.value
                            ? "bg-brand text-white border-brand shadow-brand"
                            : "bg-white border-line text-ink hover:bg-brand-50"
                        }`}
                      >
                        <p className="text-[13px] font-bold leading-tight">{s.label}</p>
                        <p className={`text-[10.5px] mt-0.5 ${stream === s.value ? "text-white/85" : "text-muted2"}`}>{s.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button onClick={() => setStep(2)} className="flex-1 rounded-xl border border-line bg-white text-ink font-bold py-3 text-sm">Back</button>
                <button
                  onClick={goNextFromEducation}
                  disabled={!eduValid}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition"
                >
                  Continue <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-line bg-brand-50/50 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <UserIcon size={14} className="text-brand" />
                  <span className="text-xs text-muted2">Name:</span>
                  <span className="text-sm font-bold text-ink">{name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-brand" />
                  <span className="text-xs text-muted2">Gender:</span>
                  <span className="text-sm font-bold text-ink">{gender}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-brand" />
                  <span className="text-xs text-muted2">Mobile:</span>
                  <span className="text-sm font-bold text-ink">{phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <GraduationCap size={14} className="text-brand mt-0.5" />
                  <span className="text-xs text-muted2">Education:</span>
                  <span className="text-sm font-bold text-ink">
                    {eduLevel}{streamRequired && stream ? ` · ${stream}` : ""}
                  </span>
                </div>
              </div>

              <button
                onClick={submit}
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-600 disabled:opacity-50 text-white font-bold px-6 py-3.5 rounded-xl transition shadow-brand"
                data-testid="start-quiz-cta"
              >
                <Sparkles size={16} /> {submitting ? "Saving…" : "Start the Career Quiz"} <ArrowRight size={16} />
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-full text-xs text-muted2 hover:text-ink"
              >
                ← Edit details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
