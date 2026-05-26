import React, { useMemo, useState } from "react";
import { CheckCircle2, MessageCircle, Mic, Route, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import PublicShell from "../components/PublicShell";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";
import { breadcrumbSchema, softwareAppSchema } from "../lib/seoSchemas";

const plans = [
  {
    key: "basic",
    name: "Basic",
    price: 9,
    note: "Unlock career results only",
    featured: false,
    limits: ["No AI chats", "Career report access", "Basic roadmap preview", "Best for first-time clarity"],
  },
  {
    key: "standard",
    name: "Standard",
    price: 99,
    note: "Most useful starter plan",
    featured: true,
    limits: ["15 AI chats", "5 mock interviews", "10 institute searches", "10 roadmaps"],
  },
  {
    key: "premium",
    name: "Premium",
    price: 299,
    note: "For serious career switching",
    featured: false,
    limits: ["30 AI chats", "15 mock tests", "20 institute searches", "20 roadmaps"],
  },
];

export default function Pricing() {
  const { user, refresh, setUser } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState("");
  const activePlan = user?.subscription?.status === "active" ? user.subscription.plan : localStorage.getItem("latecomers_mock_plan");

  const usageCards = useMemo(
    () => [
      ["AI chats", MessageCircle],
      ["Mock interviews", Mic],
      ["Institute searches", Search],
      ["Roadmaps", Route],
    ],
    []
  );

  const subscribe = async (planKey) => {
    setLoadingPlan(planKey);
    try {
      if (user) {
        const { data } = await api.post("/me/mock-subscribe", { plan: planKey });
        if (data.user) setUser(data.user);
        await refresh();
      } else {
        localStorage.setItem("latecomers_mock_plan", planKey);
      }
      toast.success("Mock subscription active. Razorpay will be connected later.");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Could not activate mock subscription.");
    } finally {
      setLoadingPlan("");
    }
  };

  return (
    <PublicShell>
      <SEO
        title="Pricing Plans - Latecomers AI"
        path="/pricing"
        jsonLd={[
          softwareAppSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
          ]),
        ]}
        description="Choose a Latecomers AI plan: Basic ₹9, Standard ₹99, or Premium ₹299 for career results, AI chats, mock interviews, institute search, and roadmaps."
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand uppercase">Pricing</p>
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink mt-2">Choose your Latecomers plan.</h1>
          <p className="text-muted2 mt-2 text-sm sm:text-base">
            Mock subscription — click any plan to activate immediately. Razorpay can be added later.
          </p>
        </div>

        <div className="mt-6 sm:mt-10 grid sm:grid-cols-3 gap-3 sm:gap-4">
          {plans.map((plan) => {
            const isActive = activePlan === plan.key;
            return (
              <div key={plan.key} className={`relative rounded-2xl sm:rounded-3xl border p-4 sm:p-5 bg-white ${plan.featured ? "premium-ring shadow-brand" : "border-line shadow-soft"}`}>
                {plan.featured && (
                  <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-brand text-white text-[10px] sm:text-xs font-bold">Recommended</span>
                )}
                {isActive && (
                  <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] sm:text-xs font-bold">Active</span>
                )}
                <h2 className="font-heading font-extrabold text-lg sm:text-xl text-ink">{plan.name}</h2>
                <p className="text-xs text-muted2 mt-0.5">{plan.note}</p>
                <div className="mt-3 flex items-end gap-1">
                  <span className="font-heading font-extrabold text-3xl sm:text-4xl text-ink">₹{plan.price}</span>
                  <span className="text-muted2 pb-1 text-xs">/ mock</span>
                </div>
                <button
                  onClick={() => subscribe(plan.key)}
                  disabled={loadingPlan === plan.key}
                  className={`mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold ${
                    plan.featured ? "premium-gradient text-white shadow-brand" : "bg-brand-50 text-ink border border-line"
                  } disabled:opacity-60`}
                >
                  <Sparkles size={14} /> {loadingPlan === plan.key ? "Activating..." : isActive ? "Subscribed" : "Subscribe"}
                </button>
                <div className="mt-4 space-y-2">
                  {plan.limits.map((item) => (
                    <p key={item} className="flex items-start gap-2 text-xs sm:text-sm text-muted2">
                      <CheckCircle2 size={14} className="text-brand shrink-0 mt-0.5" /> {item}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <section className="mt-6 sm:mt-10 bg-white border border-line rounded-2xl p-4 sm:p-6">
          <h2 className="font-heading font-bold text-sm sm:text-base text-ink">Included usage categories</h2>
          <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {usageCards.map(([label, Icon]) => (
              <div key={label} className="surface-gradient border border-line rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-brand-50 text-brand flex items-center justify-center shrink-0"><Icon size={15} /></div>
                <p className="font-semibold text-ink text-xs sm:text-sm">{label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
