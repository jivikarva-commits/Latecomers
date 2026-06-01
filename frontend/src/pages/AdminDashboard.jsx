import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, CreditCard, IndianRupee, RefreshCw, Users } from "lucide-react";
import { api } from "../lib/api";

const money = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted2">{label}</p>
          <p className="font-heading text-2xl font-black text-ink">{value}</p>
        </div>
      </div>
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
        const left = Math.max(Number(limit || 0) - Number(used || 0), 0);
        return (
          <span key={label} className="rounded-full bg-brand-50 px-2 py-1 text-[11px] font-bold text-brand">
            {label}: {left}/{Number(limit || 0)}
          </span>
        );
      })}
      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">Roadmap: unlimited</span>
    </div>
  );
}

export default function AdminDashboard() {
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
      setError(err?.response?.data?.detail || "Could not load revenue data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const planRows = useMemo(() => Object.entries(data?.revenueByPlan || {}), [data]);
  const users = data?.users || [];
  const payments = data?.paymentHistory || [];

  if (loading) {
    return (
      <div className="p-5 sm:p-8">
        <div className="rounded-3xl border border-line bg-white p-6 text-center text-muted2">Loading revenue dashboard...</div>
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
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-brand">Admin</p>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-ink">Revenue and subscriptions</h1>
          <p className="text-sm text-muted2">Payment history, plan-wise earning, and user limits from MongoDB.</p>
        </div>
        <button onClick={load} className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white">
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={IndianRupee} label="Total earning" value={money(data?.totalMoneyEarned)} />
        <Metric icon={Users} label="Paid users" value={users.length} />
        <Metric icon={CreditCard} label="Successful" value={data?.successfulPayments || 0} />
        <Metric icon={AlertCircle} label="Failed" value={data?.failedPayments || 0} />
      </div>

      <section className="rounded-3xl border border-line bg-white p-4 sm:p-5">
        <h2 className="font-heading text-lg font-black text-ink">Plan-wise earning</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {planRows.map(([plan, item]) => (
            <div key={plan} className="rounded-2xl border border-line bg-brand-50 p-4">
              <p className="text-sm font-bold text-ink">{plan}</p>
              <p className="font-heading text-2xl font-black text-brand">{money(item.amount)}</p>
              <p className="text-xs text-muted2">{item.count} payments</p>
            </div>
          ))}
          {!planRows.length && <p className="text-sm text-muted2">No successful payments yet.</p>}
        </div>
      </section>

      <section className="rounded-3xl border border-line bg-white p-4 sm:p-5">
        <h2 className="font-heading text-lg font-black text-ink">User-wise subscription details</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-[760px] w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.12em] text-muted2">
              <tr>
                <th className="py-2 pr-3">User</th>
                <th className="py-2 pr-3">Plan</th>
                <th className="py-2 pr-3">Paid</th>
                <th className="py-2 pr-3">Remaining limits</th>
                <th className="py-2 pr-3">Expiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((item) => (
                <tr key={item.userId || item.email}>
                  <td className="py-3 pr-3">
                    <p className="font-bold text-ink">{item.name || "User"}</p>
                    <p className="text-xs text-muted2">{item.email}</p>
                  </td>
                  <td className="py-3 pr-3 font-semibold text-ink">{item.subscription?.planName || "-"}</td>
                  <td className="py-3 pr-3 text-muted2">{money(item.subscription?.paidAmount)}</td>
                  <td className="py-3 pr-3"><Remaining usage={item.usage} subscription={item.subscription} /></td>
                  <td className="py-3 pr-3 text-muted2">{(item.subscription?.expiresAt || "").slice(0, 10) || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!users.length && <p className="py-4 text-sm text-muted2">No paid users yet.</p>}
        </div>
      </section>

      <section className="rounded-3xl border border-line bg-white p-4 sm:p-5">
        <h2 className="font-heading text-lg font-black text-ink">Payment history</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-[760px] w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.12em] text-muted2">
              <tr>
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Plan</th>
                <th className="py-2 pr-3">Amount</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Razorpay IDs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {payments.map((item) => (
                <tr key={item.razorpayPaymentId || item.razorpayOrderId || item.createdAt}>
                  <td className="py-3 pr-3 text-muted2">{(item.purchaseDate || item.createdAt || "").slice(0, 10)}</td>
                  <td className="py-3 pr-3 font-semibold text-ink">{item.userEmail || "-"}</td>
                  <td className="py-3 pr-3 text-muted2">{item.selectedPlanName || item.plan}</td>
                  <td className="py-3 pr-3 font-bold text-ink">{money(item.paidAmount)}</td>
                  <td className="py-3 pr-3">
                    <span className="rounded-full bg-brand-50 px-2 py-1 text-xs font-bold text-brand">{item.paymentStatus}</span>
                  </td>
                  <td className="py-3 pr-3 text-xs text-muted2">
                    <p>{item.razorpayOrderId || "-"}</p>
                    <p>{item.razorpayPaymentId || ""}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!payments.length && <p className="py-4 text-sm text-muted2">No payments recorded yet.</p>}
        </div>
      </section>
    </div>
  );
}
