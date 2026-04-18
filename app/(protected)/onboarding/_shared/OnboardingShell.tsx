import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function OnboardingShell({
  title,
  description,
  sidebar,
  children,
}: {
  title: string;
  description: string;
  sidebar: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid flex-1 items-stretch gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
        <CardContent className="flex h-full flex-col p-6 sm:p-8">
          <div className="mb-8">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">Playlance Onboarding</p>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">{description}</p>
          </div>
          <div className="flex-1">{children}</div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-slate-900/70 shadow-2xl backdrop-blur-xl">
        <CardContent className="flex h-full flex-col justify-between p-6 sm:p-8">
          {sidebar}
        </CardContent>
      </Card>
    </div>
  );
}