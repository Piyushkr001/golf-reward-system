"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Percent } from "lucide-react";
import { OnboardingShell } from "../../_shared/OnboardingShell";
import { ProgressStepper } from "../../_shared/ProgressStepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContributionPreferencePage() {
  const router = useRouter();
  const [percentage, setPercentage] = useState("10");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/onboarding/user/contribution-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contributionPercentage: Number(percentage) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save contribution preference");
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
        <ProgressStepper current={3} total={4} labels={["Profile", "Charity", "Contribution", "Plan"]} />
      </div>

      <OnboardingShell
        title="Set your contribution preference"
        description="Choose how much of your platform participation should be directed toward your selected charity."
        sidebar={
          <div className="space-y-4">
            <div className="inline-flex rounded-2xl bg-violet-400/10 p-3 text-violet-300">
              <Percent className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Flexible contribution</h2>
            <p className="text-sm leading-6 text-slate-300">
              The minimum supported amount is 10%. You can increase that anytime later as your account evolves.
            </p>
          </div>
        }
      >
        <div className="mx-auto flex max-w-xl flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="percentage" className="text-slate-200">Contribution Percentage</Label>
            <Input
              id="percentage"
              type="number"
              min={10}
              max={100}
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              className="h-12 border-white/10 bg-slate-900/70 text-white"
            />
            <p className="text-sm text-slate-400">Minimum: 10% of your selected plan amount.</p>
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={loading} className="h-12 rounded-2xl bg-linear-to-r from-violet-600 to-cyan-500 px-6 text-white">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Continue
            </Button>
          </div>
        </div>
      </OnboardingShell>
    </>
  );
}