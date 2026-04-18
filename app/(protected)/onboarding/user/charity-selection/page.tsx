"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeartHandshake, Loader2 } from "lucide-react";
import { OnboardingShell } from "../../_shared/OnboardingShell";
import { ProgressStepper } from "../../_shared/ProgressStepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CHARITIES = [
  { id: "education-fund", name: "Education Fund", description: "Support access to learning opportunities and school resources." },
  { id: "junior-sports-trust", name: "Junior Sports Trust", description: "Help young athletes access training, mentorship, and equipment." },
  { id: "green-course-initiative", name: "Green Course Initiative", description: "Promote sustainable community recreation and environmental recovery." },
];

export default function CharitySelectionPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/user/charity-selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ charityId: selected }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Please select a charity");
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
        <ProgressStepper current={2} total={4} labels={["Profile", "Charity", "Contribution", "Plan"]} />
      </div>

      <OnboardingShell
        title="Choose a charity to support"
        description="A core part of Playlance is impact. Select the cause that should receive your contribution allocation."
        sidebar={
          <div className="space-y-4">
            <div className="inline-flex rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Impact comes first</h2>
            <p className="text-sm leading-6 text-slate-300">
              This platform is not just about participation and rewards. It is designed to connect play with meaningful contribution.
            </p>
          </div>
        }
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {CHARITIES.map((charity) => {
            const active = selected === charity.id;
            return (
              <button
                key={charity.id}
                type="button"
                onClick={() => setSelected(charity.id)}
                className={`rounded-3xl border p-5 text-left transition ${
                  active
                    ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-950/30"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <h3 className="text-lg font-semibold text-white">{charity.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{charity.description}</p>
              </button>
            );
          })}
        </div>

        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="h-12 rounded-2xl bg-linear-to-r from-violet-600 to-cyan-500 px-6 text-white"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Continue
          </Button>
        </div>
      </OnboardingShell>
    </>
  );
}