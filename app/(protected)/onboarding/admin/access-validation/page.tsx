"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2 } from "lucide-react";
import { OnboardingShell } from "../../_shared/OnboardingShell";
import { ProgressStepper } from "../../_shared/ProgressStepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminAccessValidationPage() {
  const router = useRouter();
  const [adminAccessCode, setAdminAccessCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/onboarding/admin/access-validation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminAccessCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to validate access");
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
        <ProgressStepper current={2} total={3} labels={["Profile", "Access", "Workspace"]} />
      </div>

      <OnboardingShell
        title="Validate admin access"
        description="Confirm internal access details before entering the organization configuration stage."
        sidebar={
          <div className="space-y-4">
            <div className="inline-flex rounded-2xl bg-amber-400/10 p-3 text-amber-300">
              <KeyRound className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Controlled access</h2>
            <p className="text-sm leading-6 text-slate-300">
              This step helps distinguish administrative access setup from standard account onboarding.
            </p>
          </div>
        }
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="adminAccessCode" className="text-slate-200">Admin Access Code</Label>
            <Input
              id="adminAccessCode"
              value={adminAccessCode}
              onChange={(e) => setAdminAccessCode(e.target.value)}
              placeholder="Enter internal access code"
              className="h-12 border-white/10 bg-slate-900/70 text-white"
            />
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