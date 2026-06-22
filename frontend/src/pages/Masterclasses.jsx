import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, CalendarDays, Clock, GraduationCap, MapPin, Plus, Sparkles,
  Upload, User, Video, X, CheckCircle2,
} from "lucide-react";
import PublicShell from "../components/PublicShell";
import SEO from "../components/SEO";
import { api } from "../lib/api";
import { toast } from "sonner";

const MODES = ["Online", "Offline", "Hybrid"];

const formatDate = (d) => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return d;
  }
};

// Compress an uploaded image to a small JPEG data URL (no S3 needed).
function compressImage(file, maxW = 800, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const EMPTY = {
  instituteName: "", title: "", description: "", thumbnail: "",
  date: "", time: "", mode: "Online", locationOrLink: "", price: "Free",
  instructor: "", contactEmail: "", contactPhone: "", registrationLink: "",
};

function MasterclassCard({ mc }) {
  const reg = mc.registrationLink || (mc.contactEmail ? `mailto:${mc.contactEmail}` : null);
  const ModeIcon = mc.mode === "Offline" ? MapPin : Video;
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white hover:shadow-soft transition flex flex-col">
      <div className="relative h-40 bg-brand-50">
        {mc.thumbnail ? (
          <img src={mc.thumbnail} alt={mc.title} className="h-full w-full object-cover" loading="lazy" decoding="async" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand">
            <GraduationCap size={40} />
          </div>
        )}
        <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-brand shadow-sm">
          <ModeIcon size={11} /> {mc.mode}
        </span>
        {mc.price && (
          <span className="absolute top-2 right-2 rounded-full bg-brand px-2.5 py-1 text-[10px] font-black text-white shadow-sm">
            {mc.price}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-brand">{mc.instituteName}</p>
        <h3 className="mt-1 font-heading font-black text-sm text-ink leading-snug line-clamp-2">{mc.title}</h3>
        <p className="mt-1.5 text-xs text-muted2 line-clamp-2">{mc.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted2">
          <span className="inline-flex items-center gap-1"><CalendarDays size={12} /> {formatDate(mc.date)}</span>
          {mc.time && <span className="inline-flex items-center gap-1"><Clock size={12} /> {mc.time}</span>}
          {mc.instructor && <span className="inline-flex items-center gap-1"><User size={12} /> {mc.instructor}</span>}
        </div>
        <div className="mt-3 pt-3 border-t border-line flex items-center justify-between gap-2">
          {reg ? (
            <a href={reg} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-xs font-black text-white">
              Register <ArrowRight size={13} />
            </a>
          ) : (
            <span className="text-xs text-muted2">{mc.contactPhone}</span>
          )}
          {mc.locationOrLink && mc.mode !== "Online" && (
            <span className="text-[11px] text-muted2 truncate max-w-[45%]">{mc.locationOrLink}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Masterclasses() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [thumbPreview, setThumbPreview] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    api.get("/masterclasses")
      .then(({ data }) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please choose an image file."); return; }
    try {
      const dataUrl = await compressImage(file);
      if (dataUrl.length > 300000) { toast.error("Image too large after compression. Try a smaller image."); return; }
      setForm((f) => ({ ...f, thumbnail: dataUrl }));
      setThumbPreview(dataUrl);
    } catch {
      toast.error("Could not process image.");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (form.instituteName.trim().length < 2) return toast.error("Enter institute name");
    if (form.title.trim().length < 3) return toast.error("Enter masterclass title");
    if (form.description.trim().length < 10) return toast.error("Add a short description");
    if (!form.date) return toast.error("Pick a date");
    if (!form.contactEmail && !form.contactPhone && !form.registrationLink)
      return toast.error("Add a contact email, phone, or registration link");

    setSubmitting(true);
    try {
      await api.post("/masterclasses", form);
      setSubmitted(true);
      setForm(EMPTY);
      setThumbPreview("");
      toast.success("Submitted for review!");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const closeForm = () => { setShowForm(false); setSubmitted(false); };

  const upcoming = useMemo(() => items, [items]);

  return (
    <PublicShell>
      <SEO
        title="Masterclasses for Students in India – Latecomers AI"
        description="Discover upcoming masterclasses, workshops, and webinars from verified institutes across India."
        path="/masterclasses"
      />

      {/* Hero */}
      <section className="bg-[#F6F1FF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand uppercase">Masterclasses</p>
          <h1 className="mt-2 font-heading font-black text-2xl sm:text-4xl leading-tight text-ink">
            Upcoming masterclasses & workshops in India
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted2 leading-relaxed">
            Free and paid masterclasses, webinars, and skill workshops from institutes across India.
            Listings are curated by Latecomers AI so learners see only reviewed programs.
          </p>
        </div>
      </section>

      {/* Listings */}
      <section className="bg-white py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => <div key={i} className="h-72 rounded-2xl bg-brand-50 animate-pulse" />)}
            </div>
          ) : upcoming.length === 0 ? (
            <div className="rounded-2xl border border-line bg-brand-50/50 p-10 text-center">
              <GraduationCap size={36} className="mx-auto text-brand" />
              <h2 className="mt-3 font-heading font-black text-lg text-ink">No upcoming masterclasses yet</h2>
              <p className="mt-1.5 text-sm text-muted2">New verified masterclasses will appear here once the admin team publishes them.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming.map((mc) => <MasterclassCard key={mc.id} mc={mc} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand py-12 text-center text-white">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-heading font-black text-2xl sm:text-3xl">Want your institute featured?</h2>
          <p className="mt-2 text-sm sm:text-base text-white/80">Reach the Latecomers AI team for curated masterclass listings and student discovery campaigns.</p>
        </div>
      </section>

      {/* Submission modal */}
      {false && showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-8" onClick={closeForm}>
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5 sticky top-0 bg-white rounded-t-2xl">
              <p className="font-heading font-black text-base text-ink inline-flex items-center gap-2">
                <Sparkles size={16} className="text-brand" /> List your masterclass
              </p>
              <button onClick={closeForm} className="text-muted2 hover:text-ink"><X size={20} /></button>
            </div>

            {submitted ? (
              <div className="p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="mt-4 font-heading font-black text-lg text-ink">Submitted for review!</h3>
                <p className="mt-1.5 text-sm text-muted2">Our team will review your masterclass and publish it shortly. Thank you!</p>
                <button onClick={closeForm} className="mt-5 rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-white">Done</button>
              </div>
            ) : (
              <form onSubmit={submit} className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
                {/* Thumbnail */}
                <div>
                  <label className="text-xs font-bold text-ink">Thumbnail (recommended)</label>
                  <div className="mt-1.5 flex items-center gap-3">
                    <div className="h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-line bg-brand-50 flex items-center justify-center">
                      {thumbPreview ? (
                        <img src={thumbPreview} alt="preview" className="h-full w-full object-cover" />
                      ) : (
                        <GraduationCap size={22} className="text-brand/50" />
                      )}
                    </div>
                    <div className="flex-1">
                      <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-xs font-bold text-ink hover:border-brand">
                        <Upload size={13} /> Upload image
                      </button>
                      <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
                      <p className="mt-1.5 text-[10px] text-muted2">or paste an image URL below</p>
                      <input value={form.thumbnail.startsWith("data:") ? "" : form.thumbnail} onChange={set("thumbnail")} placeholder="https://image-url.jpg" className="mt-1 w-full rounded-lg border border-line px-2.5 py-1.5 text-xs" />
                    </div>
                  </div>
                </div>

                <Field label="Institute / Organiser name *" value={form.instituteName} onChange={set("instituteName")} placeholder="e.g. Bright Future Academy" />
                <Field label="Masterclass title *" value={form.title} onChange={set("title")} placeholder="e.g. Free Data Analytics Masterclass" />
                <div>
                  <label className="text-xs font-bold text-ink">Description *</label>
                  <textarea value={form.description} onChange={set("description")} rows={3} placeholder="What will learners get from this masterclass?" className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-brand outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field type="date" label="Date *" value={form.date} onChange={set("date")} />
                  <Field label="Time" value={form.time} onChange={set("time")} placeholder="6:00 PM IST" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink">Mode</label>
                    <select value={form.mode} onChange={set("mode")} className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-brand outline-none bg-white">
                      {MODES.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <Field label="Price" value={form.price} onChange={set("price")} placeholder="Free or ₹499" />
                </div>

                <Field label={form.mode === "Online" ? "Join link / platform" : "Venue / location"} value={form.locationOrLink} onChange={set("locationOrLink")} placeholder={form.mode === "Online" ? "Zoom / YouTube link" : "City, venue"} />
                <Field label="Instructor / Speaker" value={form.instructor} onChange={set("instructor")} placeholder="e.g. Rohan Sharma" />

                <div className="rounded-lg bg-brand-50 border border-line p-3 space-y-3">
                  <p className="text-[11px] font-bold text-muted2">How can learners register? (at least one)</p>
                  <Field label="Registration link" value={form.registrationLink} onChange={set("registrationLink")} placeholder="https://register-here.com" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Contact email" value={form.contactEmail} onChange={set("contactEmail")} placeholder="you@institute.com" />
                    <Field label="Contact phone" value={form.contactPhone} onChange={set("contactPhone")} placeholder="+91 ..." />
                  </div>
                </div>

                <button type="submit" disabled={submitting} className="w-full rounded-lg bg-brand py-3 text-sm font-black text-white hover:bg-brand-700 disabled:opacity-50 transition">
                  {submitting ? "Submitting…" : "Submit for review"}
                </button>
                <p className="text-[10px] text-muted2 text-center">Your masterclass goes live after a quick review to keep listings genuine.</p>
              </form>
            )}
          </div>
        </div>
      )}
    </PublicShell>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-xs font-bold text-ink">{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-brand outline-none" />
    </div>
  );
}
