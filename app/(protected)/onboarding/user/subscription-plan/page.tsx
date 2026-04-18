"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2 } from "lucide-react";
import { OnboardingShell } from "../../_shared/OnboardingShell";
import { ProgressStepper } from "../../_shared/ProgressStepper";
import { Button } from "@/components/ui/button";


const PLANS = [
  {
    id: "monthly",
    title: "Monthly Plan",
    price: "$19/mo",
    description: "Flexible access with monthly billing and core subscriber participation.",
  },
  {
    id: "yearly",
    title: "Yearly Plan",
    price: "$190/yr",
    description: "Best-value annual subscription with long-term participation benefits.",
  },
];

export default function SubscriptionPlanPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        <div className="grid gap-4 lg:grid-cols-2">
          {PLANS.map((plan) => {
            const active = selected === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelected(plan.id)}
                className={`rounded-3xl border p-6 text-left transition ${
                  active ? "border-cyan-400 bg-cyan-400/10" : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <h3 className="text-xl font-semibold text-white">{plan.title}</h3>
                <p className="mt-2 text-3xl font-bold text-cyan-300">{plan.price}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{plan.description}</p>
              </button>
            );
          })}
        </div>

        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSubmit} disabled={loading} className="h-12 rounded-2xl bg-linear-to-r from-violet-600 to-cyan-500 px-6 text-white">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Finish Setup
          </Button>
        </div>
      </OnboardingShell>
    </>
  );
}