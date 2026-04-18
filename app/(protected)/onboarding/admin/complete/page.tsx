import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminOnboardingCompletePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center">
      <Card className="w-full border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
        <CardContent className="flex flex-col items-center p-8 text-center sm:p-12">
          <div className="mb-5 rounded-full bg-emerald-400/10 p-4 text-emerald-300">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin onboarding complete</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Your operational profile and workspace setup are ready. You can now continue into the admin environment.
          </p>
          <div className="mt-8">
            <Link href="/admin">
              <Button className="h-12 rounded-2xl bg-linear-to-r from-violet-600 to-cyan-500 px-6 text-white">Go to Admin Dashboard</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}