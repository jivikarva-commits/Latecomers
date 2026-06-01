import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, MessageCircle, Mic, Route, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import BrandClockMark from "./BrandClockMark";

const fallbackPlans = [
  {
    key: "starter_offer",
    name: "Starter Offer",
    originalPrice: 99,
    amount: 9,
    features: {
      aiQuestionsLimit: 0,
      mockInterviewLimit: 3,
      instituteSearchLimit: 5,
      roadmapUnlimited: true,
      quizResultAccess: true,
    },
  },
  {
    key: "standard_99",
    name: "\u20B999 Plan",
    originalPrice: 99,
    amount: 99,
    features: {
      aiQuestionsLimit: 10,
      mockInterviewLimit: 10,
      instituteSearchLimit: 10,
      roadmapUnlimited: true,
      quizResultAccess: true,
    },
  },
  {
    key: "premium_299",
    name: "\u20B9299 Plan",
    originalPrice: 299,
    amount: 299,
    features: {
      aiQuestionsLimit: 40,
      mockInterviewLimit: 30,
      instituteSearchLimit: 30,
      roadmapUnlimited: true,
      quizResultAccess: true,
    },
  },
];

let razorpayScriptPromise = null;

function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve(true);
  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }
  return razorpayScriptPromise;
}

function planFeatures(plan) {
  const f = plan.features || {};
  return [
    "Quiz result access",
    "Explore all careers",
    `Institute search: ${f.instituteSearchLimit || 0} times`,
    "Roadmap: unlimited",
    `Mock Interview: ${f.mockInterviewLimit || 0} times`,
    f.aiQuestionsLimit > 0 ? `AI Chat: ${f.aiQuestionsLimit} questions` : "No AI chat access",
  ];
}

export default function PremiumSubscriptionModal({
  open,
  onClose,
  onSuccess,
  title = "Unlock your Latecomers AI plan",
  subtitle = "Choose a plan to access your career result and continue your roadmap.",
  lockClose = false,
  initialPlan = "starter_offer",
  offerOnly = false,
}) {
  const { user, refresh, setUser } = useAuth();
  const [plans, setPlans] = useState(fallbackPlans);
  const [loadingPlan, setLoadingPlan] = useState("");

  useEffect(() => {
    if (!open) return;
    api.get("/subscriptions/plans")
      .then(({ data }) => {
        if (Array.isArray(data?.plans) && data.plans.length) setPlans(data.plans);
      })
      .catch(() => setPlans(fallbackPlans));
  }, [open]);

  const activePlan = user?.subscription?.status === "active" ? user.subscription.plan : "";

  const sortedPlans = useMemo(() => {
    const order = ["starter_offer", "standard_99", "premium_299"];
    const visiblePlans = offerOnly ? plans.filter((plan) => plan.key === "starter_offer") : plans;
    return [...visiblePlans].sort((a, b) => {
      const ai = order.indexOf(a.key);
      const bi = order.indexOf(b.key);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  }, [plans, offerOnly]);

  if (!open) return null;

  const startPayment = async (planKey) => {
    setLoadingPlan(planKey);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Razorpay checkout could not load.");
      const { data } = await api.post("/payments/razorpay/order", { plan: planKey });
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Latecomers AI",
        description: data.plan?.name || "Subscription",
        order_id: data.orderId,
        prefill: {
          name: data.user?.name || user?.name || "",
          email: data.user?.email || user?.email || "",
        },
        theme: { color: "#7C2DFF" },
        handler: async (response) => {
          try {
            const verify = await api.post("/payments/razorpay/verify", {
              plan: planKey,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verify.data?.user) setUser(verify.data.user);
            await refresh();
            toast.success("Subscription activated.");
            onSuccess?.(verify.data);
          } catch (err) {
            toast.error(err?.response?.data?.detail || "Payment verification failed.");
          } finally {
            setLoadingPlan("");
          }
        },
        modal: {
          ondismiss: () => setLoadingPlan(""),
        },
      };
      const checkout = new window.Razorpay(options);
      checkout.open();
    } catch (error) {
      toast.error(error?.response?.data?.detail || error.message || "Payment could not start.");
      setLoadingPlan("");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-ink/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5" role="dialog" aria-modal="true">
      <div className={`relative w-full ${offerOnly ? "max-w-lg" : "max-w-5xl"} max-h-[92dvh] overflow-y-auto rounded-3xl bg-white border border-line`}>
        {!lockClose && (
          <button onClick={onClose} className="absolute right-3 top-3 z-10 h-9 w-9 rounded-full border border-line bg-white text-muted2 flex items-center justify-center">
            <X size={18} />
          </button>
        )}
        <div className="p-4 sm:p-7">
          <div className="text-center max-w-2xl mx-auto">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl cc-logo-gradient text-white">
              <BrandClockMark size={28} animated={offerOnly} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand">Premium access</p>
            <h2 className="font-heading text-2xl sm:text-4xl font-black text-ink mt-1">{title}</h2>
            <p className="mt-2 text-sm sm:text-base text-muted2">{subtitle}</p>
          </div>

          <div className={`mt-5 grid gap-3 ${offerOnly ? "grid-cols-1" : "lg:grid-cols-3"}`}>
            {sortedPlans.map((plan) => {
              const featured = plan.key === "starter_offer";
              const active = activePlan === plan.key;
              return (
                <div key={plan.key} className={`relative rounded-2xl border p-4 sm:p-5 ${featured ? "border-brand bg-brand-50/50" : "border-line bg-white"}`}>
                  {featured && (
                    <span className="absolute -top-2.5 left-4 rounded-full bg-pink-500 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                      Limited Offer
                    </span>
                  )}
                  {active && (
                    <span className="absolute -top-2.5 right-4 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-black text-white">Active</span>
                  )}
                  <h3 className="font-heading text-lg font-black text-ink">{plan.name}</h3>
                  <div className="mt-3 flex items-end gap-2">
                    {plan.originalPrice !== plan.amount && (
                      <span className="pb-1 text-lg font-bold text-muted2 line-through">{"\u20B9"}{plan.originalPrice}</span>
                    )}
                    <span className="font-heading text-4xl font-black text-ink">{"\u20B9"}{plan.amount}</span>
                  </div>
                  <button
                    onClick={() => startPayment(plan.key)}
                    disabled={!!loadingPlan || active}
                    className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-bold disabled:opacity-60 ${featured ? "premium-gradient text-white" : "bg-brand text-white"}`}
                  >
                    {loadingPlan === plan.key
                      ? "Opening checkout..."
                      : active
                      ? "Current plan"
                      : offerOnly && featured
                      ? "Pay \u20B99 and generate result"
                      : plan.key === initialPlan
                      ? "Choose this plan"
                      : "Upgrade"}
                  </button>
                  <div className="mt-4 space-y-2">
                    {planFeatures(plan).map((item) => (
                      <p key={item} className="flex items-start gap-2 text-[12.5px] text-ink">
                        <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand" /> {item}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {!offerOnly && (
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ["Results", Sparkles],
                ["Institutes", Search],
                ["Roadmaps", Route],
                ["Interview", Mic],
                ["AI Chat", MessageCircle],
              ].map(([label, Icon]) => (
                <div key={label} className="rounded-xl border border-line bg-[#FAFAFE] p-3 text-center">
                  <Icon size={17} className="mx-auto text-brand" />
                  <p className="mt-1 text-xs font-bold text-ink">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
