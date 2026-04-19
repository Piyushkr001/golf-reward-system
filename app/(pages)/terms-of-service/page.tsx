import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Scale, 
  UserCheck, 
  AlertTriangle, 
  CreditCard,
  Ban,
  ArrowRight
} from "lucide-react";

export const metadata = {
  title: "Terms of Service | PlayLance",
  description: "Review the PlayLance Terms of Service outlining platform usage rules and contractual agreements.",
};

export default function TermsOfServicePage() {
  const lastUpdated = "April 2026";

  const termsSections = [
    {
      icon: <UserCheck className="w-5 h-5 text-amber-600 dark:text-amber-500" />,
      title: "1. Account Registration & Eligibility",
      content: "By accessing PlayLance, you confirm you are legally eligible to execute binding agreements natively. You are solely responsible for maintaining the confidentiality of your session tokens and credentials. Any fraudulent activity or simulated injection linked to your account may result in immediate termination.",
    },
    {
      icon: <CreditCard className="w-5 h-5 text-amber-600 dark:text-amber-500" />,
      title: "2. Subscription & Billing Metrics",
      content: "All subscriptions are managed via verified internal hooks. By subscribing, you authorize recursive deductions matching your selected interval (Monthly/Yearly). Funds allocated to charitable percentages are locked strictly upon transaction clearing and are heavily protected against unwarranted refunds.",
    },
    {
      icon: <Scale className="w-5 h-5 text-amber-600 dark:text-amber-500" />,
      title: "3. Draw Algorithms & Fair Play",
      content: "All simulated draws executed by the PlayLance platform are strictly randomized natively. Match outcomes (5-match, 4-match, 3-match) depend entirely on the mathematically verified pool parameters. Attempting to manipulate score tracking externally violates these terms explicitly.",
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" />,
      title: "4. Payout Dispersals & Liabilities",
      content: "Winning payouts are inherently subject to manual review boundaries verified by site administrators. Dispersals may be frozen seamlessly if provided verification proofs fail audits. We hold no liability for errors originating from missing or strictly inaccurate routing parameters submitted by users.",
    },
    {
      icon: <Ban className="w-5 h-5 text-amber-600 dark:text-amber-500" />,
      title: "5. Termination of Services",
      content: "We intrinsically reserve the right to suspend or structurally delete your account if boundaries breached contradict these terms. Terminations executed via administrative controls dynamically cancel all pending draw queue interactions.",
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 
        Hero Section 
      */}
      <section className="relative overflow-hidden pt-24 pb-16 flex flex-col items-center justify-center text-center px-4">
        {/* Dynamic Gradient Background utilizing Tailwind v4 syntax */}
        <div className="absolute inset-0 bg-linear-to-b from-amber-50 via-white to-transparent dark:from-amber-950/20 dark:via-background dark:to-transparent -z-10" />
        
        {/* Subtle background glow effect */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-amber-400/20 dark:bg-amber-600/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-3xl space-y-6 flex flex-col items-center z-10">
          <div className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-700 dark:text-amber-400 backdrop-blur-sm">
            <FileText className="h-4 w-4 mr-2" />
            Legal Agreement
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Terms of Service
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Please review the parameters governing your interaction with the PlayLance draw simulation and charitable ecosystem natively.
          </p>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-500">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col items-center flex-1">
        <div className="max-w-4xl w-full flex flex-col gap-6">

          {/* Terms Cards */}
          {termsSections.map((section, idx) => (
            <Card key={idx} className="border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-xs hover:shadow-sm transition-shadow">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20">
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100/50 dark:bg-amber-900/30">
                    {section.icon}
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px]">
                  {section.content}
                </p>
              </CardContent>
            </Card>
          ))}

          {/* Contact Node */}
          <div className="mt-8 relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 dark:bg-amber-500/10" />
            
            <div className="relative z-10 space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-2">
                Questions about our Terms?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md">
                If you need clarification on billing boundaries, payout structures, or structural liability conditions, please contact support natively.
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <Link href="/contact">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-500/20 rounded-full px-8">
                  Contact Support <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
