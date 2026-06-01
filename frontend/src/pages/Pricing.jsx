import React, { useMemo, useState } from "react";
import { CheckCircle2, MessageCircle, Mic, Route, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import PublicShell from "../components/PublicShell";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";
import { breadcrumbSchema, softwareAppSchema } from "../lib/seoSchemas";
import PremiumSubscriptionModal from "../components/PremiumSubscriptionModal";

const plans = [
  {
    key: "starter_offer",
    name: "Starter Offer",
    price: 9,
    originalPrice: 99,
    note: "Limited offer for first unlock",
    featured: true,
    limits: ["Quiz result access", "Explore all careers", "5 institute searches", "Unlimited roadmap", "3 mock interviews", "No AI chat access"],
  },
  {
    key: "standard_99",
    name: "\u20B999 Plan",
    price: 99,
    originalPrice: 99,
    note: "Adds AI chat and more practice",
    featured: false,
    limits: ["Quiz result access", "Explore all careers", "10 institute searches", "Unlimited roadmap", "10 mock interviews", "10 AI chat questions"],
  },
  {
    key: "premium_299",
    name: "\u20B9299 Plan",
    price: 299,
    originalPrice: 299,
    note: "For serious career switching",
    featured: false,
    limits: ["Quiz result access", "Explore all careers", "30 institute searches", "Unlimited roadmap", "30 mock interviews", "40 AI chat questions"],
  },
];

export default function Pricing() {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("starter_offer");
  const activePlan = user?.subscription?.status === "active" ? user.subscription.plan : "";

  const usageCards = useMemo(
    () => [
      ["AI chats", MessageCircle],
      ["Mock interviews", Mic],
      ["Institute searches", Search],
      ["Roadmaps", Route],
    ],
    []
  );

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
        description="Choose a Latecomers AI plan: Starter Offer, Rs 99 Plan, or Rs 299 Plan for career results, AI chats, mock interviews, institute search, and roadmaps."
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand uppercase">Pricing</p>
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink mt-2">Choose your Latecomers plan.</h1>
          <p className="text-muted2 mt-2 text-sm sm:text-base">
            Secure Razorpay checkout. Your plan activates only after backend payment verification.
          </p>
        </div>

        <div className="mt-6 sm:mt-10 grid sm:grid-cols-3 gap-3 sm:gap-4">
          {plans.map((plan) => {
            const isActive = activePlan === plan.key;
            return (
              <div key={plan.key} className={`relative rounded-2xl sm:rounded-3xl border p-4 sm:p-5 bg-white ${plan.featured ? "premium-ring shadow-brand" : "border-line shadow-soft"}`}>
                {plan.featured && (
                  <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-pink-500 text-white text-[10px] sm:text-xs font-bold">Limited Offer</span>
                )}
                {isActive && (
                  <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] sm:text-xs font-bold">Active</span>
                )}
                <h2 className="font-heading font-extrabold text-lg sm:text-xl text-ink">{plan.name}</h2>
                <p className="text-xs text-muted2 mt-0.5">{plan.note}</p>
                <div className="mt-3 flex items-end gap-2">
                  {plan.originalPrice !== plan.price && <span className="text-lg font-bold text-muted2 line-through pb-1">{"\u20B9"}{plan.originalPrice}</span>}
                  <span className="font-heading font-extrabold text-3xl sm:text-4xl text-ink">{"\u20B9"}{plan.price}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedPlan(plan.key);
                    setModalOpen(true);
                  }}
                  className={`mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold ${
                    plan.featured ? "premium-gradient text-white shadow-brand" : "bg-brand-50 text-ink border border-line"
                  }`}
                >
                  <Sparkles size={14} /> {isActive ? "Current plan" : "Subscribe"}
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
      <PremiumSubscriptionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Choose your Latecomers AI plan"
        subtitle="Pay securely with Razorpay. Your subscription is activated after backend verification."
        onSuccess={() => {
          setModalOpen(false);
          toast.success("Plan activated.");
        }}
        initialPlan={selectedPlan}
      />
    </PublicShell>
  );
}
