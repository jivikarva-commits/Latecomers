import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Award, Building2, Briefcase, Sparkles, ArrowRight, CheckCircle2, Pencil, Save } from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";

const EDUCATION_OPTIONS = ["School Student", "12th Pass", "Undergraduate", "Graduate", "Postgraduate"];
const STREAM_OPTIONS = ["Science", "Commerce", "Arts", "Management", "Law", "Medical", "Engineering"];
const SUBJECT_OPTIONS = ["Maths", "Physics", "Chemistry", "Biology", "Economics", "Accountancy", "Business Studies", "Computer Science", "English", "History", "Political Science"];
const GOAL_OPTIONS = ["Get a high-paying private job", "Prepare for government exams", "Build a business/startup", "Work in creative or media fields", "Research and higher studies", "Still exploring"];

const Stat = ({ icon: Icon, label, value }) => (
  <div className="bg-white rounded-2xl border border-line p-4 flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand flex items-center justify-center shrink-0">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-xs text-muted2">{label}</p>
      <p className="font-bold text-ink">{value}</p>
    </div>
  </div>
);

export default function Profile() {
  const { user, logout, refresh } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    educationLevel: "",
    stream: "",
    subjects: [],
    careerGoal: "",
    location: "",
  });

  useEffect(() => {
    setForm({
      educationLevel: user?.profile?.educationLevel || "",
      stream: user?.profile?.stream || "",
      subjects: user?.profile?.subjects || [],
      careerGoal: user?.profile?.careerGoal || "",
      location: user?.profile?.location || "",
    });
  }, [user]);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const toggleSubject = (subject) =>
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject) ? prev.subjects.filter((s) => s !== subject) : [...prev.subjects, subject],
    }));

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.put("/me/profile", form);
      await api.post("/ai/profile/rematch");
      await refresh();
      setEditing(false);
      toast.success("Profile updated! Your career matches have been refreshed.");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const cmScore = user?.profile?.careerMatchScore;
  const overall = cmScore?.overall ?? null;
  const hasScore = overall !== null;
  const topMatches = (user?.top_career_matches || []).slice(0, 3);

  const scoreBadge = !hasScore
    ? null
    : overall >= 80
    ? { label: "Excellent Match", cls: "bg-emerald-100 text-emerald-700" }
    : overall >= 65
    ? { label: "Good Match", cls: "bg-blue-100 text-blue-700" }
    : { label: "Growing Match", cls: "bg-amber-100 text-amber-700" };

  const profileFields = [
    { label: "Education", value: user?.profile?.educationLevel },
    { label: "Stream", value: user?.profile?.stream },
    { label: "Subjects", value: (user?.profile?.subjects || []).join(", ") || null },
    { label: "Career Goal", value: user?.profile?.careerGoal },
    { label: "Location", value: user?.profile?.location },
    { label: "Learning Style", value: user?.profile?.learningStyle },
  ].filter((f) => f.value);

  const noSavedCareers = (user?.saved_items?.careers?.length || 0) === 0;
  const noSavedColleges = (user?.saved_items?.colleges?.length || 0) === 0;
  const noSavedScholarships = (user?.saved_items?.scholarships?.length || 0) === 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-4" data-testid="profile-page">
      <div className="bg-white rounded-3xl border border-line p-5 sm:p-7 text-center">
        {user?.picture ? (
          <img src={user.picture} alt="" className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-brand-100" />
        ) : (
          <div className="w-20 h-20 rounded-full mx-auto cc-logo-gradient text-white flex items-center justify-center text-2xl font-bold border-4 border-brand-100">
            {(user?.name || "U").slice(0, 1)}
          </div>
        )}
        <h1 className="font-heading font-extrabold text-2xl text-ink mt-4">{user?.name}</h1>
        <p className="text-sm text-muted2">{user?.email}</p>
        <p className="text-xs text-muted2 mt-1 inline-flex items-center gap-1">
          <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google" className="w-3 h-3" />
          Signed in with Google
        </p>
      </div>

      {hasScore ? (
        <div className="bg-white rounded-3xl border border-line p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">Career Match Score</p>
              <p className="font-heading font-extrabold text-4xl text-brand mt-1">{overall}%</p>
              {scoreBadge && <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${scoreBadge.cls}`}>{scoreBadge.label}</span>}
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { k: "Skills", v: cmScore?.skills },
                { k: "Interests", v: cmScore?.interests },
                { k: "Goals", v: cmScore?.goals },
                { k: "Values", v: cmScore?.values },
                { k: "Personality", v: cmScore?.personality },
              ].map(
                ({ k, v }) =>
                  v != null && (
                    <div key={k} className="bg-brand-50 rounded-xl px-2 py-1 text-center">
                      <p className="font-bold text-brand">{v}%</p>
                      <p className="text-muted2 text-[10px]">{k}</p>
                    </div>
                  )
              )}
            </div>
          </div>
          {user?.profile?.summary && <p className="text-sm text-muted2 mt-3 leading-relaxed border-t border-line pt-3">{user.profile.summary}</p>}
        </div>
      ) : (
        <div className="bg-brand-50 rounded-3xl border border-brand-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl cc-logo-gradient text-white flex items-center justify-center shrink-0">
            <Sparkles size={22} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-ink text-sm">Complete your career profile</p>
            <p className="text-xs text-muted2 mt-0.5">Take the AI quiz to get your Career Match Score.</p>
          </div>
          <Link to="/onboarding" className="inline-flex items-center gap-1 bg-brand text-white text-xs font-semibold px-4 py-2 rounded-full shadow-brand">
            Start <ArrowRight size={12} />
          </Link>
        </div>
      )}

      {topMatches.length > 0 && (
        <div className="bg-white rounded-3xl border border-line p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="font-heading font-bold text-ink">Top Career Matches</p>
            <Link to="/careers" className="text-xs font-semibold text-brand">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {topMatches.map((m, i) => (
              <Link key={m.careerSlug} to={`/careers/${m.careerSlug}`} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-brand-50 transition">
                <div className="w-8 h-8 rounded-full cc-logo-gradient text-white flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink capitalize truncate">{m.careerSlug?.replace(/-/g, " ")}</p>
                  {m.tags?.length > 0 && <p className="text-[11px] text-muted2 truncate">{m.tags.slice(0, 3).join(" · ")}</p>}
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold shrink-0">{m.matchPercent}%</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-3">
        <Stat icon={Briefcase} label="Saved Careers" value={user?.saved_items?.careers?.length || 0} />
        <Stat icon={Building2} label="Saved Colleges" value={user?.saved_items?.colleges?.length || 0} />
        <Stat icon={Award} label="Saved Scholarships" value={user?.saved_items?.scholarships?.length || 0} />
      </div>

      {(noSavedCareers || noSavedColleges || noSavedScholarships) && (
        <div className="bg-white rounded-3xl border border-line p-5 space-y-2">
          <p className="font-heading font-bold text-ink">Saved Items</p>
          {noSavedCareers && (
            <p className="text-sm text-muted2">
              No saved careers yet. <Link to="/careers" className="text-brand font-semibold">Browse careers</Link> and bookmark your favorites.
            </p>
          )}
          {noSavedColleges && (
            <p className="text-sm text-muted2">
              No saved colleges yet. <Link to="/colleges" className="text-brand font-semibold">Explore colleges</Link> and save options you like.
            </p>
          )}
          {noSavedScholarships && (
            <p className="text-sm text-muted2">
              No saved scholarships yet. <Link to="/scholarships" className="text-brand font-semibold">Check scholarships</Link> and bookmark relevant ones.
            </p>
          )}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-line p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="font-heading font-bold text-ink">Profile Details</p>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-line text-xs font-semibold text-ink">
              <Pencil size={12} /> Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing(false)} className="px-3 py-1.5 rounded-full border border-line text-xs font-semibold text-ink">
                Cancel
              </button>
              <button onClick={saveProfile} disabled={saving} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand text-white text-xs font-semibold disabled:opacity-60">
                <Save size={12} /> {saving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        {!editing ? (
          <ul className="space-y-2">
            {profileFields.map(({ label, value }) => (
              <li key={label} className="flex items-start gap-2 text-sm">
                <CheckCircle2 size={14} className="text-brand mt-0.5 shrink-0" />
                <span>
                  <span className="font-semibold text-ink">{label}: </span>
                  <span className="text-muted2">{value}</span>
                </span>
              </li>
            ))}
            {profileFields.length === 0 && <p className="text-sm text-muted2">No profile details available yet.</p>}
          </ul>
        ) : (
          <div className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold text-ink mb-1">Education Level</p>
                <select value={form.educationLevel} onChange={(e) => updateField("educationLevel", e.target.value)} className="w-full bg-brand-50 border border-line rounded-xl px-3 py-2 text-sm">
                  <option value="">Select</option>
                  {EDUCATION_OPTIONS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-xs font-semibold text-ink mb-1">Stream</p>
                <select value={form.stream} onChange={(e) => updateField("stream", e.target.value)} className="w-full bg-brand-50 border border-line rounded-xl px-3 py-2 text-sm">
                  <option value="">Select</option>
                  {STREAM_OPTIONS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-ink mb-1">Subjects</p>
              <div className="flex flex-wrap gap-2">
                {SUBJECT_OPTIONS.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    className={`px-2.5 py-1 rounded-full text-xs border ${
                      form.subjects.includes(subject) ? "bg-brand text-white border-brand" : "bg-white border-line text-ink"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold text-ink mb-1">Career Goal</p>
                <select value={form.careerGoal} onChange={(e) => updateField("careerGoal", e.target.value)} className="w-full bg-brand-50 border border-line rounded-xl px-3 py-2 text-sm">
                  <option value="">Select</option>
                  {GOAL_OPTIONS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-xs font-semibold text-ink mb-1">Location</p>
                <input
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="City or locality"
                  className="w-full bg-brand-50 border border-line rounded-xl px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={logout}
        className="w-full inline-flex items-center justify-center gap-2 bg-white border border-line text-ink font-semibold px-5 py-3 rounded-full hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition"
        data-testid="profile-logout-button"
      >
        <LogOut size={16} /> Sign out
      </button>
    </div>
  );
}
