"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HeartHandshake, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { OnboardingShell } from "../../_shared/OnboardingShell";
import { ProgressStepper } from "../../_shared/ProgressStepper";
import { Button } from "@/components/ui/button";

interface Charity {
  id: string;
  name: string;
  shortDescription: string;
  category: string;
  imageUrl?: string | null;
}

export default function CharitySelectionPage() {
  const router = useRouter();
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const res = await fetch("/api/charities");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load charities");
        setCharities(data.charities || []);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load charities");
      } finally {
        setFetching(false);
      }
    };

    fetchCharities();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/user/charity-selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ charityId: selected }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Please select a charity");

      toast.success("Charity selected successfully");
      router.push(data.nextStep);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
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
        description="Select the organization that should receive the charitable impact allocation from your Playlance journey."
        sidebar={
          <div className="space-y-4">
            <div className="inline-flex rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold text-white">A purpose-led experience</h2>
            <p className="text-sm leading-6 text-slate-300">
              Charity selection is part of your account setup because impact is central to the platform experience.
            </p>
          </div>
        }
      >
        {fetching ? (
          <div className="flex min-h-[280px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 lg:grid-cols-3">
              {charities.map((charity) => {
                const active = selected === charity.id;
                return (
                  <button
                    key={charity.id}
                    type="button"
                    onClick={() => setSelected(charity.id)}
                    className={`overflow-hidden rounded-3xl border text-left transition ${
                      active
                        ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-950/30"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="h-40 w-full bg-slate-900">
                      {charity.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={charity.imageUrl} alt={charity.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-500">No Image</div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-white">{charity.name}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-cyan-300">{charity.category}</p>
                      <p className="mt-3 text-sm leading-6 text-slate-300">{charity.shortDescription}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={loading || !selected}
                className="h-12 rounded-2xl bg-linear-to-r from-violet-600 to-cyan-500 px-6 text-white"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Continue
              </Button>
            </div>
          </div>
        )}
      </OnboardingShell>
    </>
  );
}