import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CreditCard,
  IndianRupee,
  LogOut,
  Plus,
  RefreshCw,
  UserCheck,
  Users,
} from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const money = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
const dateText = (value) => (value ? String(value).slice(0, 10) : "-");
const ADMIN_EMAIL = "latecomers.in@gmail.com";
const MASTERCLASS_MODES = ["Online", "Offline", "Hybrid"];
const MASTERCLASS_EMPTY = {
  instituteName: "",
  title: "",
  description: "",
  thumbnail: "",
  date: "",
  time: "",
  mode: "Online",
  locationOrLink: "",
  price: "Free",
  instructor: "",
  contactEmail: "",
  contactPhone: "",
  registrationLink: "",
};

function Metric({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-muted2">{label}</p>
          <p className="font-heading text-2xl font-black text-ink">{value}</p>
          {hint && <p className="text-xs text-muted2">{hint}</p>}
        </div>
      </div>
    </div>
  );
}

function SmallStat({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-line bg-brand-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-muted2">{label}</p>
      <p className="mt-1 font-heading text-2xl font-black text-brand">{value}</p>
      {hint && <p className="text-xs text-muted2">{hint}</p>}
    </div>
  );
}

function Remaining({ usage = {}, subscription = {} }) {
  const limits = subscription.featureLimits || {};
  const rows = [
    ["AI", limits.aiQuestionsLimit, usage.aiQuestionsUsed],
    ["Mock", limits.mockInterviewLimit, usage.mockInterviewUsed],
    ["Institutes", limits.instituteSearchLimit, usage.instituteSearchUsed],
  ];

  return (
    <div className="flex flex-wrap gap-1.5">
      {rows.map(([label, limit, used]) => {
        const total = Number(limit || 0);
        const left = Math.max(total - Number(used || 0), 0);
        return (
          <span key={label} className="rounded-full bg-brand-50 px-2 py-1 text-[11px] font-bold text-brand">
            {label}: {left}/{total}
          </span>
        );
      })}
      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">
        Roadmap: unlimited
      </span>
    </div>
  );
}

function MasterclassField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-[11px] font-black uppercase tracking-[0.08em] text-muted2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand"
      />
    </div>
  );
}

function MasterclassModeration() {
  const [mc, setMc] = useState({ items: [], counts: {} });
  const [busy, setBusy] = useState("");
  const [filter, setFilter] = useState("pending");
  const [form, setForm] = useState(MASTERCLASS_EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get("/admin/masterclasses");
      setMc(data);
    } catch {
      /* non-admin or error — section stays empty */
    }
  };
  useEffect(() => { load(); }, []);

  const moderate = async (id, status) => {
    setBusy(id);
    try {
      await api.post(`/admin/masterclasses/${id}/moderate`, { status });
      await load();
    } finally { setBusy(""); }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this masterclass permanently?")) return;
    setBusy(id);
    try {
      await api.delete(`/admin/masterclasses/${id}`);
      await load();
    } finally { setBusy(""); }
  };

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const createMasterclass = async (event) => {
    event.preventDefault();
    if (form.instituteName.trim().length < 2) return alert("Enter institute name.");
    if (form.title.trim().length < 3) return alert("Enter masterclass title.");
    if (form.description.trim().length < 10) return alert("Add a short description.");
    if (!form.date) return alert("Pick a date.");
    if (!form.contactEmail && !form.contactPhone && !form.registrationLink) {
      return alert("Add registration link, contact email, or contact phone.");
    }

    setSaving(true);
    try {
      await api.post("/admin/masterclasses", form);
      setForm(MASTERCLASS_EMPTY);
      setFilter("approved");
      await load();
    } catch (err) {
      alert(err?.response?.data?.detail || "Could not add masterclass.");
    } finally {
      setSaving(false);
    }
  };

  const list = (mc.items || []).filter((m) => filter === "all" || m.status === filter);

  return (
    <section className="rounded-3xl border border-line bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">Masterclasses</p>
          <h2 className="font-heading text-lg font-black text-ink">Institute submissions</h2>
        </div>
        <div className="flex gap-1.5">
          {["pending", "approved", "rejected", "all"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${filter === f ? "bg-brand text-white" : "bg-brand-50 text-brand"}`}>
              {f} {mc.counts?.[f] != null && f !== "all" ? `(${mc.counts[f]})` : ""}
            </button>
          ))}
          <button onClick={load} className="rounded-full bg-brand-50 px-2.5 py-1.5 text-brand"><RefreshCw size={14} /></button>
        </div>
      </div>

      <form onSubmit={createMasterclass} className="mb-5 rounded-2xl border border-line bg-brand-50/40 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-brand">Admin only</p>
            <h3 className="font-heading text-base font-black text-ink">Add masterclass</h3>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-xs font-black text-white disabled:opacity-50"
          >
            <Plus size={14} /> {saving ? "Publishing..." : "Publish"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <MasterclassField label="Institute / organiser *" value={form.instituteName} onChange={set("instituteName")} placeholder="Bright Future Academy" />
          <MasterclassField label="Masterclass title *" value={form.title} onChange={set("title")} placeholder="Free Data Analytics Masterclass" />
          <MasterclassField type="date" label="Date *" value={form.date} onChange={set("date")} />
          <MasterclassField label="Time" value={form.time} onChange={set("time")} placeholder="6:00 PM IST" />
          <div>
            <label className="text-[11px] font-black uppercase tracking-[0.08em] text-muted2">Mode</label>
            <select
              value={form.mode}
              onChange={set("mode")}
              className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand"
            >
              {MASTERCLASS_MODES.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
            </select>
          </div>
          <MasterclassField label="Price" value={form.price} onChange={set("price")} placeholder="Free or Rs 499" />
          <MasterclassField label={form.mode === "Online" ? "Join link / platform" : "Venue / location"} value={form.locationOrLink} onChange={set("locationOrLink")} placeholder={form.mode === "Online" ? "Zoom / YouTube link" : "City, venue"} />
          <MasterclassField label="Instructor" value={form.instructor} onChange={set("instructor")} placeholder="Rohan Sharma" />
          <MasterclassField label="Thumbnail URL" value={form.thumbnail} onChange={set("thumbnail")} placeholder="https://image-url.jpg" />
          <MasterclassField label="Registration link" value={form.registrationLink} onChange={set("registrationLink")} placeholder="https://register-here.com" />
          <MasterclassField label="Contact email" value={form.contactEmail} onChange={set("contactEmail")} placeholder="team@institute.com" />
          <MasterclassField label="Contact phone" value={form.contactPhone} onChange={set("contactPhone")} placeholder="+91 ..." />
        </div>
        <div className="mt-3">
          <label className="text-[11px] font-black uppercase tracking-[0.08em] text-muted2">Description *</label>
          <textarea
            value={form.description}
            onChange={set("description")}
            rows={3}
            placeholder="What learners will get from this masterclass"
            className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
      </form>

      {list.length === 0 ? (
        <p className="py-4 text-sm text-muted2">No {filter !== "all" ? filter : ""} masterclasses.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {list.map((m) => (
            <div key={m.id} className="flex gap-3 rounded-2xl border border-line p-3">
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-brand-50 flex items-center justify-center">
                {m.thumbnail ? <img src={m.thumbnail} alt="" className="h-full w-full object-cover" /> : <span className="text-xs text-muted2">No image</span>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-heading font-black text-sm text-ink truncate">{m.title}</p>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${m.status === "approved" ? "bg-emerald-50 text-emerald-700" : m.status === "rejected" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}>{m.status}</span>
                </div>
                <p className="text-[11px] text-muted2">{m.instituteName} · {dateText(m.date)} · {m.mode} · {m.price}</p>
                <p className="text-[11px] text-muted2 line-clamp-1">{m.description}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {m.status !== "approved" && <button disabled={busy === m.id} onClick={() => moderate(m.id, "approved")} className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white disabled:opacity-50">Approve</button>}
                  {m.status !== "rejected" && <button disabled={busy === m.id} onClick={() => moderate(m.id, "rejected")} className="rounded-lg bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white disabled:opacity-50">Reject</button>}
                  <button disabled={busy === m.id} onClick={() => remove(m.id)} className="rounded-lg border border-red-200 px-2.5 py-1 text-[11px] font-bold text-red-600 disabled:opacity-50">Delete</button>
                  {(m.registrationLink || m.contactEmail) && <a href={m.registrationLink || `mailto:${m.contactEmail}`} target="_blank" rel="noreferrer" className="rounded-lg border border-line px-2.5 py-1 text-[11px] font-bold text-brand">Link</a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/revenue");
      setData(res.data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not load admin dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const planRows = useMemo(() => Object.entries(data?.revenueByPlan || {}), [data]);
  const platform = data?.platformStats || {};
  const subscribedUsers = data?.subscribedUsers || data?.users || [];
  const loginUsers = data?.loginUsers || [];

  if (loading) {
    return (
      <div className="p-5 sm:p-8">
        <div className="rounded-3xl border border-line bg-white p-6 text-center text-muted2">
          Loading admin panel...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 sm:p-8">
        <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-red-700">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle size={18} /> {error}
          </div>
          <p className="mt-2 text-sm">Only {ADMIN_EMAIL} can open this admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-brand">Admin Panel</p>
          <h1 className="font-heading text-2xl font-black text-ink sm:text-3xl">Latecomers activity</h1>
          <p className="text-sm text-muted2">
            Platform users, subscriptions, logins, Gmail IDs, and mobile numbers.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            onClick={load}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white"
          >
            <RefreshCw size={15} /> Refresh
          </button>
          <button
            onClick={logout}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-bold text-ink hover:border-brand hover:text-brand"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Users} label="Total visitors" value={platform.totalVisitors || platform.totalUsers || 0} hint={`${platform.totalUsers || 0} logged-in users`} />
        <Metric icon={CalendarDays} label="Visitors today" value={platform.visitorsToday || 0} hint={`${platform.usersToday || 0} signups, ${platform.loginsToday || 0} logins`} />
        <Metric icon={CalendarDays} label="Visitors this week" value={platform.visitorsThisWeek || 0} hint={`${platform.usersThisWeek || 0} signups, ${platform.loginsThisWeek || 0} logins`} />
        <Metric icon={CalendarDays} label="Visitors this month" value={platform.visitorsThisMonth || 0} hint={`${platform.usersThisMonth || 0} signups, ${platform.loginsThisMonth || 0} logins`} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={IndianRupee} label="Total revenue" value={money(data?.totalMoneyEarned)} />
        <Metric icon={CreditCard} label="Fully subscribed" value={data?.fullySubscribedUsers || 0} hint="Unique paid users" />
        <Metric icon={UserCheck} label="Logged-in users" value={platform.distinctLoggedInUsers || 0} />
        <Metric icon={AlertCircle} label="Failed payments" value={data?.failedPayments || 0} />
      </div>

      <section className="rounded-3xl border border-line bg-white p-4 sm:p-5">
        <h2 className="font-heading text-lg font-black text-ink">Subscription summary</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {planRows.map(([plan, item]) => (
            <SmallStat key={plan} label={plan} value={money(item.amount)} hint={`${item.count} payments`} />
          ))}
          {!planRows.length && <p className="text-sm text-muted2">No successful payments yet.</p>}
        </div>
      </section>

      <section className="rounded-3xl border border-line bg-white p-4 sm:p-5">
        <h2 className="font-heading text-lg font-black text-ink">Fully subscribed users</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-[860px] w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.12em] text-muted2">
              <tr>
                <th className="py-2 pr-3">User</th>
                <th className="py-2 pr-3">Gmail</th>
                <th className="py-2 pr-3">Mobile</th>
                <th className="py-2 pr-3">Plan</th>
                <th className="py-2 pr-3">Paid</th>
                <th className="py-2 pr-3">Purchase date</th>
                <th className="py-2 pr-3">Remaining limits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {subscribedUsers.map((item) => (
                <tr key={`${item.userId || item.email}-${item.purchaseDate || item.planName}`}>
                  <td className="py-3 pr-3 font-bold text-ink">{item.name || "User"}</td>
                  <td className="py-3 pr-3 text-muted2">{item.email || "-"}</td>
                  <td className="py-3 pr-3 text-muted2">{item.mobile || "-"}</td>
                  <td className="py-3 pr-3 font-semibold text-ink">{item.planName || item.subscription?.planName || "-"}</td>
                  <td className="py-3 pr-3 font-bold text-ink">{money(item.paidAmount || item.subscription?.paidAmount)}</td>
                  <td className="py-3 pr-3 text-muted2">{dateText(item.purchaseDate || item.subscription?.startedAt)}</td>
                  <td className="py-3 pr-3">
                    <Remaining usage={item.usage} subscription={item.subscription} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!subscribedUsers.length && <p className="py-4 text-sm text-muted2">No paid users yet.</p>}
        </div>
      </section>

      <section className="rounded-3xl border border-line bg-white p-4 sm:p-5">
        <h2 className="font-heading text-lg font-black text-ink">Login users and contacts</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-[760px] w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.12em] text-muted2">
              <tr>
                <th className="py-2 pr-3">User</th>
                <th className="py-2 pr-3">Gmail</th>
                <th className="py-2 pr-3">Mobile</th>
                <th className="py-2 pr-3">Login count</th>
                <th className="py-2 pr-3">Last login</th>
                <th className="py-2 pr-3">Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loginUsers.map((item) => (
                <tr key={item.userId || item.email}>
                  <td className="py-3 pr-3 font-bold text-ink">{item.name || "User"}</td>
                  <td className="py-3 pr-3 text-muted2">{item.email || "-"}</td>
                  <td className="py-3 pr-3 text-muted2">{item.mobile || "-"}</td>
                  <td className="py-3 pr-3 font-semibold text-ink">{item.loginCount || 0}</td>
                  <td className="py-3 pr-3 text-muted2">{dateText(item.lastLoginAt)}</td>
                  <td className="py-3 pr-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${item.isActiveSession ? "bg-emerald-50 text-emerald-700" : "bg-brand-50 text-brand"}`}>
                      {item.isActiveSession ? "Active" : "Old"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loginUsers.length && <p className="py-4 text-sm text-muted2">No login sessions recorded yet.</p>}
        </div>
      </section>

      <MasterclassModeration />
    </div>
  );
}
