"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, UserRound } from "lucide-react";
import { OnboardingShell } from "../../_shared/OnboardingShell";
import { ProgressStepper } from "../../_shared/ProgressStepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UserProfileOnboardingPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/onboarding/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save profile");

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
        <ProgressStepper
          current={1}
          total={4}
          labels={["Profile", "Charity", "Contribution", "Plan"]}
        />
      </div>

      <OnboardingShell
        title="Set up your subscriber profile"
        description="Start with the basics so we can personalize your experience before you choose a charity and subscription plan."
        sidebar={
          <div className="space-y-6">
            <div>
              <div className="mb-4 inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                <UserRound className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-semibold text-white">A guided setup flow</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Your onboarding is intentionally short and clear. We’ll collect your basic profile, charity preference, contribution percentage, and preferred plan.
              </p>
            </div>
            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-4 text-sm text-slate-300">
                <div className="mb-2 flex items-center gap-2 text-slate-100">
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                  Why this matters
                </div>
                <p>Completing onboarding helps unlock your dashboard flow and aligns your account with the platform’s subscription and charity experience.</p>
              </CardContent>
            </Card>
          </div>
        }
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="fullName" className="text-slate-200">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="h-12 border-white/10 bg-slate-900/70 text-white placeholder:text-slate-500"
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="h-12 rounded-2xl bg-linear-to-r from-violet-600 to-cyan-500 px-6 text-white"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Continue
            </Button>
          </div>
        </div>
      </OnboardingShell>
    </>
  );
}