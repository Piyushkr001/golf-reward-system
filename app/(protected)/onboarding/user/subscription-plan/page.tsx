"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2 } from "lucide-react";
import { OnboardingShell } from "../../_shared/OnboardingShell";
import { ProgressStepper } from "../../_shared/ProgressStepper";
import { Button } from "@/components/ui/button";


type Plan = {
  id: string;
  name: string;
  slug: string;
  price: number;
  interval: "monthly" | "yearly";
  currency: string;
};

export default function SubscriptionPlanPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch("/api/subscriptions/plans")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPlans(data.plans);
      })
      .catch((err) => console.error(err))
      .finally(() => setFetching(false));
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/onboarding/user/subscription-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedPlan: selected }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Please select a plan");
      router.push(data.nextStep);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <ProgressStepper current={4} total={4} labels={["Profile", "Charity", "Contribution", "Plan"]} />
      </div>

      <OnboardingShell
        title="Choose your subscription plan"
        description="Select the plan you want to start with. Billing integration can later connect directly to Stripe checkout."
        sidebar={
          <div className="space-y-4">
            <div className="inline-flex rounded-2xl bg-amber-400/10 p-3 text-amber-300">
              <CreditCard className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Plan selection</h2>
            <p className="text-sm leading-6 text-slate-300">
              This step stores the user’s initial subscription preference so you can later connect it with your payment flow and entitlement logic.
            </p>
          </div>
        }
      >
        {fetching ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {plans.map((plan) => {
              const active = selected === plan.slug;
              const formattedPrice = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: plan.currency,
              }).format(plan.price / 100);

              const description = plan.interval === "monthly" 
                ? "Flexible access with monthly billing and core subscriber participation."
                : "Best-value annual subscription with long-term participation benefits.";

              const displayInterval = plan.interval === "monthly" ? "/mo" : "/yr";

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelected(plan.slug)}
                  className={`rounded-3xl border p-6 text-left transition ${
                    active ? "border-cyan-400 bg-cyan-400/10" : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                  <p className="mt-2 text-3xl font-bold text-cyan-300">
                    {formattedPrice}<span className="text-sm text-slate-400 font-normal">{displayInterval}</span>
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
                </button>
              );
            })}
          </div>
        )}

        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSubmit} disabled={loading || fetching} className="h-12 rounded-2xl bg-linear-to-r from-violet-600 to-cyan-500 px-6 text-white">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Finish Setup
          </Button>
        </div>
      </OnboardingShell>
    </>
  );
}