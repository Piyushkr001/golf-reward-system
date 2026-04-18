import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UserOnboardingCompletePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center">
      <Card className="w-full border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
        <CardContent className="flex flex-col items-center p-8 text-center sm:p-12">
          <div className="mb-5 rounded-full bg-emerald-400/10 p-4 text-emerald-300">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold text-white">You’re all set</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Your onboarding is complete. Your profile, charity preference, contribution percentage, and plan selection have been saved.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard">
              <Button className="h-12 rounded-2xl bg-linear-to-r from-violet-600 to-cyan-500 px-6 text-white">Go to Dashboard</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="h-12 rounded-2xl border-white/10 bg-white/5 px-6 text-slate-100">Review Plans</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}