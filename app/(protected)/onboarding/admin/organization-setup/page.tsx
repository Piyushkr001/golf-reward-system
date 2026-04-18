"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Loader2 } from "lucide-react";
import { OnboardingShell } from "../../_shared/OnboardingShell";
import { ProgressStepper } from "../../_shared/ProgressStepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminOrganizationSetupPage() {
  const router = useRouter();
  const [organizationName, setOrganizationName] = useState("");
  const [organizationSlug, setOrganizationSlug] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/onboarding/admin/organization-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationName, organizationSlug }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save organization setup");
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
        <ProgressStepper current={3} total={3} labels={["Profile", "Access", "Workspace"]} />
      </div>

      <OnboardingShell
        title="Set up your admin workspace"
        description="Configure the initial organization details that will anchor your administrative environment."
        sidebar={
          <div className="space-y-4">
            <div className="inline-flex rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
              <Building2 className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Operational workspace</h2>
            <p className="text-sm leading-6 text-slate-300">
              You can later expand this area into platform-level settings, reward controls, charity configuration, and draw administration.
            </p>
          </div>
        }
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="organizationName" className="text-slate-200">Organization Name</Label>
            <Input
              id="organizationName"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="Enter organization name"
              className="h-12 border-white/10 bg-slate-900/70 text-white"
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="organizationSlug" className="text-slate-200">Organization Slug</Label>
            <Input
              id="organizationSlug"
              value={organizationSlug}
              onChange={(e) => setOrganizationSlug(e.target.value)}
              placeholder="e.g. playlance-admin"
              className="h-12 border-white/10 bg-slate-900/70 text-white"
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={loading} className="h-12 rounded-2xl bg-linear-to-r from-violet-600 to-cyan-500 px-6 text-white">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Finish Setup
            </Button>
          </div>
        </div>
      </OnboardingShell>
    </>
  );
}