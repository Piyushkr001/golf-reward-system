import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Cookie, 
  Settings, 
  ShieldAlert, 
  ActivitySquare,
  ArrowRight,
  DatabaseZap
} from "lucide-react";

export const metadata = {
  title: "Cookie Policy | PlayLance",
  description: "Learn how the PlayLance platform utilizes cookies and tracking methodologies.",
};

export default function CookiePolicyPage() {
  const lastUpdated = "April 2026";

  const cookieSections = [
    {
      icon: <DatabaseZap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      title: "1. What Are Cookies?",
      content: "Cookies are small string files structurally cached securely inside your browser's persistent memory. They allow the server mapping boundaries to retain session tracking natively, ensuring your user authentications persist without requiring arbitrary re-logins.",
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      title: "2. Strictly Necessary Cookies",
      content: "We inject minimal cryptographic payloads natively to map explicit session bounds via Next.js Edge JWT verification. These cookies are hard-locked explicitly, meaning the administrative dashboard parameters and your physical account security strictly depend on them functioning.",
    },
    {
      icon: <ActivitySquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      title: "3. Analytical Tracking",
      content: "To optimize load paths mapping algorithms organically, we utilize aggregate, anonymous structural analytical tools. This retains zero personal identifiers natively; instead, it observes raw metrics tracking component interactions securely to ensure database speeds stay stable.",
    },
    {
      icon: <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      title: "4. Managing Preferences",
      content: "You retain total structural validation over how cookies behave natively. You can instruct your browser physically to reject all generic tracking cookies if preferred. However, blocking strictly necessary authentication JWT handlers will explicitly break dashboard access boundaries.",
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 
        Hero Section 
      */}
      <section className="relative overflow-hidden pt-24 pb-16 flex flex-col items-center justify-center text-center px-4">
        {/* Dynamic Gradient Background utilizing Tailwind v4 syntax */}
        <div className="absolute inset-0 bg-linear-to-b from-indigo-50 via-white to-transparent dark:from-indigo-950/20 dark:via-background dark:to-transparent -z-10" />
        
        {/* Subtle background glow effect */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-indigo-400/20 dark:bg-indigo-600/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-3xl space-y-6 flex flex-col items-center z-10">
          <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-700 dark:text-indigo-400 backdrop-blur-sm">
            <Cookie className="h-4 w-4 mr-2" />
            Tracking Protocols
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Cookie Policy
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Understand exactly the parameters guiding how PlayLance securely stores session data natively verifying interacting boundaries.
          </p>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-500">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col items-center flex-1">
        <div className="max-w-4xl w-full flex flex-col gap-6">

          {/* Cookie Cards */}
          {cookieSections.map((section, idx) => (
            <Card key={idx} className="border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-xs hover:shadow-sm transition-shadow">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20">
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-100/50 dark:bg-indigo-900/30">
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
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 dark:bg-indigo-500/10" />
            
            <div className="relative z-10 space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-2">
                Have Cookie Preferences?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md">
                If you need further debugging tracking specifically regarding internal storage boundaries natively, contact the developer loop.
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <Link href="/contact">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 rounded-full px-8">
                  Contact Platform <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
