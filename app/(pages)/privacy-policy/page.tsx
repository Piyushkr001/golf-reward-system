import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Eye, Lock, Globe, Database, Mail, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | PlayLance",
  description: "Read the PlayLance Privacy Policy to understand how we securely manage your data.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "April 2026";

  const policySections = [
    {
      icon: <Eye className="w-5 h-5 text-emerald-500" />,
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, secure billing arrays, and internal scoring or draw-eligibility metrics locally.",
    },
    {
      icon: <Database className="w-5 h-5 text-emerald-500" />,
      title: "2. Secure Usage of Information",
      content: "We may use the information we collect about you to: Provide, maintain, and improve our Services (including tracking scores, processing automated draws, and validating charitable contributions). It is strictly used to process secure transactions, send you related information, and route verified administrative payouts accordingly.",
    },
    {
      icon: <Globe className="w-5 h-5 text-emerald-500" />,
      title: "3. Sharing of Information",
      content: "Your privacy is critical to our ecosystem. We do not sell or indiscriminately share personal identifiers. Data is only shared securely with selected platform partners (such as payment gateways or explicitly stated connected charities) entirely to fulfill your interactions. We may also safely share data in response to legal processes.",
    },
    {
      icon: <Lock className="w-5 h-5 text-emerald-500" />,
      title: "4. Cryptographic Tracking & Cookies",
      content: "We and our analytics partners use tracking technologies such as locally hosted Next.js Edge JWT verification and standard session cookies to collect state. These are utilized purely to retain secure authentication states inside the platform limits and cannot be accessed externally.",
    },
    {
      icon: <Shield className="w-5 h-5 text-emerald-500" />,
      title: "5. Your Core Rights",
      content: "You retain the sovereign right to access, delete, or structurally modify the physical data we hold mapping your identity. Contact our compliance loop directly to erase historical scores, delete billing footprints, or entirely sever your account matrix from the server.",
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 
        Hero Section 
      */}
      <section className="relative overflow-hidden pt-24 pb-16 flex flex-col items-center justify-center text-center px-4">
        {/* Dynamic Gradient Background utilizing Tailwind v4 syntax */}
        <div className="absolute inset-0 bg-linear-to-b from-emerald-50 via-white to-transparent dark:from-emerald-950/20 dark:via-background dark:to-transparent -z-10" />
        
        {/* Subtle background glow effect */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-emerald-400/20 dark:bg-emerald-600/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-3xl space-y-6 flex flex-col items-center z-10">
          <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-400 backdrop-blur-sm">
            <Shield className="h-4 w-4 mr-2" />
            Security First
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            We are committed to maintaining the highest standard of data protection, ensuring your charitable bounds and winning structures stay safe.
          </p>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-500">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col items-center flex-1">
        <div className="max-w-4xl w-full flex flex-col gap-6">

          {/* Privacy Cards */}
          {policySections.map((section, idx) => (
            <Card key={idx} className="border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-xs hover:shadow-sm transition-shadow">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20">
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100/50 dark:bg-emerald-900/30">
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
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 dark:bg-emerald-500/10" />
            
            <div className="relative z-10 space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-2">
                <Mail className="h-6 w-6 text-emerald-500" /> Need Clarification?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                If you have questions about our handling metrics or security compliance, reach out directly.
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <Link href="/contact">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 rounded-full px-8">
                  Contact Privacy Team <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
