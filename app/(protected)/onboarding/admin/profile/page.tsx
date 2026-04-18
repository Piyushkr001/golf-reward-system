"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { OnboardingShell } from "../../_shared/OnboardingShell";
import { ProgressStepper } from "../../_shared/ProgressStepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminProfilePage() {
  const router = useRouter();
  const [adminDisplayName, setAdminDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/onboarding/admin/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminDisplayName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save admin profile");
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
        <ProgressStepper current={1} total={3} labels={["Profile", "Access", "Workspace"]} />
      </div>

      <OnboardingShell
        title="Set up your admin identity"
        description="Configure the admin-facing profile details you want to use across the Playlance operational console."
        sidebar={
          <div className="space-y-4">
            <div className="inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Internal admin setup</h2>
            <p className="text-sm leading-6 text-slate-300">
              This flow is separate from subscriber onboarding so administrators can enter a controlled, operational environment.
            </p>
          </div>
        }
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="adminDisplayName" className="text-slate-200">Admin Display Name</Label>
            <Input
              id="adminDisplayName"
              value={adminDisplayName}
              onChange={(e) => setAdminDisplayName(e.target.value)}
              placeholder="Enter display name"
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