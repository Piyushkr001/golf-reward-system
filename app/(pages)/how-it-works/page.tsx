import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  UserPlus, 
  HeartHandshake, 
  Activity, 
  Dices, 
  Award,
  CheckCircle2
} from "lucide-react";

export const metadata = {
  title: "How It Works | PlayLance",
  description: "Learn step-by-step how the PlayLance platform turns gameplay into charitable rewards.",
};

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      icon: <UserPlus className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />,
      title: "Join & Subscribe",
      description: "Create your free account to access the dashboard. To qualify for draws, subscribe to a flexible monthly or annual plan.",
    },
    {
      number: "02",
      icon: <HeartHandshake className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
      title: "Select Your Charity",
      description: "Browse our directory of verified global partners and allocate your subscription's built-in contribution percentage instantly.",
    },
    {
      number: "03",
      icon: <Activity className="h-8 w-8 text-purple-600 dark:text-purple-400" />,
      title: "Log Your Core Scores",
      description: "Hit the course and log your scores into your dashboard. The system natively tracks your metrics against leaderboards over time.",
    },
    {
      number: "04",
      icon: <Dices className="h-8 w-8 text-amber-600 dark:text-amber-400" />,
      title: "Enter Automatic Draws",
      description: "Once you lock in at least 5 qualifying scores, you are structurally entered into the automated monthly prize pool draw.",
    },
    {
      number: "05",
      icon: <Award className="h-8 w-8 text-green-600 dark:text-green-400" />,
      title: "Win & Finalize Payouts",
      description: "Match 3, 4, or 5 core sequences algorithmically to win cash natively! Upload verification proofs and watch the funds clear to your bank.",
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 
        Hero Section 
      */}
      <section className="relative overflow-hidden pt-24 pb-24 flex flex-col items-center justify-center text-center px-4">
        {/* Dynamic Gradient Background utilizing Tailwind v4 syntax */}
        <div className="absolute inset-0 bg-linear-to-b from-purple-50 via-white to-transparent dark:from-purple-950/30 dark:via-background dark:to-transparent -z-10" />
        
        {/* Subtle background glow effect */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-purple-400/20 dark:bg-purple-600/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-4xl space-y-8 flex flex-col items-center z-10">
          <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-600 dark:text-purple-400 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-purple-500 mr-2"></span>
            Seamless Mechanics
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            From Sign-Up to <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-blue-500">Global Impact.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            We’ve eliminated convoluted tracking loops. Discover exactly how your inputs dictate verifiable wins and charity backing locally.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/sign-up">
              <Button size="lg" className="w-full sm:w-auto font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 shadow-lg shadow-purple-500/20">
                Start Connecting
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Step-by-Step Flow Section using Flexbox */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col items-center relative overflow-hidden">
        {/* Decorative connecting line for desktop view */}
        <div className="hidden lg:block absolute left-1/2 top-32 bottom-32 w-0.5 bg-linear-to-b from-purple-200 via-blue-200 to-cyan-200 dark:from-purple-900 dark:via-blue-900 dark:to-cyan-900 -translate-x-1/2 -z-10" />
        
        <div className="max-w-5xl w-full flex flex-col gap-12 lg:gap-24 relative z-10">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={step.number} className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${isEven ? "" : "lg:flex-row-reverse"}`}>
                
                {/* Visual Half */}
                <div className="flex-1 w-full flex justify-center lg:justify-end">
                  <div className={`relative aspect-video lg:aspect-square w-full max-w-md rounded-3xl overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-center p-8 group ${!isEven ? "lg:mr-auto lg:ml-0" : "lg:ml-auto lg:mr-0"}`}>
                    <div className="absolute inset-0 bg-linear-to-tr from-purple-500/5 to-cyan-500/5 mix-blend-overlay" />
                    
                    {/* Number Overlay */}
                    <span className="absolute top-4 right-6 text-6xl font-black text-slate-100 dark:text-slate-800/50 select-none transition-transform group-hover:scale-110 duration-500">
                      {step.number}
                    </span>

                    <div className="h-24 w-24 rounded-2xl bg-white dark:bg-slate-950 shadow-lg border border-slate-100 dark:border-slate-800 flex items-center justify-center z-10 group-hover:-translate-y-2 transition-transform duration-500">
                      {step.icon}
                    </div>
                  </div>
                </div>

                {/* Center Node (Desktop only) */}
                <div className="hidden lg:flex w-12 h-12 shrink-0 rounded-full bg-white dark:bg-slate-950 border-4 border-purple-500 items-center justify-center relative shadow-lg shadow-purple-500/20">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                </div>

                {/* Text Half */}
                <div className={`flex-1 w-full text-center lg:text-left ${isEven ? "lg:pl-8" : "lg:pr-8"}`}>
                  <div className="inline-flex items-center text-sm font-bold text-purple-600 dark:text-purple-400 mb-2 uppercase tracking-wider">
                    Step {step.number}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <ul className="mt-6 space-y-3 text-left w-full max-w-sm mx-auto lg:mx-0">
                    <li className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 shrink-0" />
                      <span className="opacity-90">Securely processed logic</span>
                    </li>
                    <li className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 shrink-0" />
                      <span className="opacity-90">Automated transition</span>
                    </li>
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Simple CTA Bar */}
      <section className="bg-linear-to-r from-purple-600 to-blue-600 py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">Trust the Process.</h2>
            <p className="text-purple-100 text-lg">One unified application managing your distributions dynamically.</p>
          </div>
          <Link href="/sign-up" className="shrink-0">
            <Button size="lg" className="bg-white text-purple-700 hover:bg-slate-100 hover:scale-105 transition-transform rounded-full px-8 h-14 text-lg font-bold shadow-xl">
              Launch Setup
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
