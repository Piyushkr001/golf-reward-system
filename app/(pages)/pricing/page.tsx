"use client";

import { useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";



type Plan = {
  id: string;
  name: string;
  slug: string;
  price: number;
  interval: "monthly" | "yearly";
  currency: string;
};

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user has a session cookie
    if (document.cookie.includes('session=')) {
      setIsAuthenticated(true);
      fetch("/api/subscriptions/current")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.subscription?.status === "active") {
            setActivePlanId(data.subscription.planId);
          }
        })
        .catch(() => {});
    }
    
    fetch("/api/subscriptions/plans")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPlans(data.plans);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelectPlan = async (plan: Plan) => {
    if (!isAuthenticated) {
      router.push("/sign-up");
      return;
    }

    setProcessingPlan(plan.id);
    try {
      const res = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planSlug: plan.slug }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success(`Successfully subscribed to ${plan.name} plan!`);
        router.push("/dashboard/billing");
      } else {
        toast.error(data.message || "Something went wrong");
        if (data.message?.toLowerCase().includes("already active")) {
           router.push("/dashboard/billing");
        }
      }
    } catch (error) {
      toast.error("Failed to process subscription");
    } finally {
      setProcessingPlan(null);
    }
  };

  return (
    <main className="min-h-screen bg-black text-slate-100 selection:bg-cyan-500/30 flex flex-col">


      <div className="flex-1 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-cyan-400">Pricing</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Pricing plans for everyone
            </p>
            <p className="mt-6 mx-auto max-w-2xl text-lg leading-8 text-slate-300">
              Join Playlance to experience the premium features and be a part of a community that matters.
              Choose an affordable plan that's packed with the best features for engaging interactions.
            </p>
          </div>

          <div className="mt-16 flex justify-center">
            {loading ? (
              <div className="flex flex-col items-center gap-4 text-cyan-400">
                <Loader2 className="h-10 w-10 animate-spin" />
                <p>Loading plans...</p>
              </div>
            ) : (
              <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                {plans.map((plan) => {
                  const isYearly = plan.interval === "yearly";
                  const isActivePlan = activePlanId === plan.id;
                  const formattedPrice = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: plan.currency,
                  }).format(plan.price / 100);

                  const features = plan.interval === "monthly"
                    ? [
                      "Full platform access",
                      "Monthly premium reports",
                      "Basic charity voting rights",
                      "Standard support",
                    ]
                    : [
                      "Everything in Monthly",
                      "Advanced analytics & insights",
                      "Double charity voting power",
                      "Priority 24/7 support",
                      "Exclusive community badge",
                    ];

                  return (
                    <div
                      key={plan.id}
                      className={`rounded-3xl p-8 xl:p-10 border ${isYearly
                          ? "bg-white/5 border-cyan-400 ring-1 ring-cyan-400 shadow-2xl shadow-cyan-900/20"
                          : "bg-white/5 border-white/10"
                        }`}
                    >
                      <div className="flex items-center justify-between gap-x-4">
                        <h3 className={`text-2xl font-bold ${isYearly ? "text-cyan-400" : "text-white"}`}>
                          {plan.name}
                        </h3>
                        {isYearly && (
                          <p className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold leading-5 text-cyan-400">
                            Most popular
                          </p>
                        )}
                      </div>

                      <p className="mt-4 text-sm leading-6 text-slate-300">
                        {isYearly ? "Best value for long term members." : "Flexible monthly access to the platform."}
                      </p>

                      <p className="mt-6 flex items-baseline gap-x-1">
                        <span className="text-4xl font-bold tracking-tight text-white">{formattedPrice}</span>
                        <span className="text-sm font-semibold leading-6 text-slate-400">
                          {isYearly ? "/year" : "/month"}
                        </span>
                      </p>

                      <Button
                        onClick={() => handleSelectPlan(plan)}
                        disabled={processingPlan === plan.id || isActivePlan}
                        className={`w-full mt-6 py-6 text-lg rounded-xl flex items-center justify-center gap-2 ${isYearly
                            ? "bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                            : "bg-white/10 hover:bg-white/20 text-white"
                          } ${isActivePlan ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {processingPlan === plan.id ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                        {isActivePlan ? "Active Plan" : "Get started today"}
                      </Button>

                      <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-300 xl:mt-10">
                        {features.map((feature) => (
                          <li key={feature} className="flex gap-x-3">
                            <Check className="h-6 w-5 flex-none text-cyan-400" aria-hidden="true" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>


    </main>
  );
}
