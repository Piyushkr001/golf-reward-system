import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, 
  Dices, 
  ShieldCheck, 
  LineChart, 
  HeartHandshake, 
  Trophy,
  Activity
} from "lucide-react";

export const metadata = {
  title: "Features | PlayLance",
  description: "Explore the core features driving the PlayLance reward engine.",
};

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 
        Hero Section 
      */}
      <section className="relative overflow-hidden pt-24 pb-20 flex flex-col items-center justify-center text-center px-4">
        {/* Dynamic Gradient Background utilizing Tailwind v4 syntax */}
        <div className="absolute inset-0 bg-linear-to-b from-blue-50 via-white to-transparent dark:from-blue-950/30 dark:via-background dark:to-transparent -z-10" />
        
        {/* Subtle background glow effect */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-blue-400/20 dark:bg-blue-600/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-4xl space-y-8 flex flex-col items-center z-10">
          <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
            Feature Deep Dive
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Advanced Tooling for <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">Unmatched Engagement.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            PlayLance relies on a robust ecosystem connecting subscription management, mathematical simulations, and charitable integrations natively.
          </p>

          <div className="flex gap-4 pt-4">
            <Link href="/sign-up">
              <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8 font-semibold shadow-lg shadow-blue-500/20">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col items-center">
        <div className="max-w-6xl w-full">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all duration-300 flex flex-col">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                  <Activity className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Score Engine</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  Log your recreational outcomes seamlessly using our secure validation loops. The system tracks your metrics natively to gauge your eligibility for monthly rewards.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:cyan-500/50 transition-all duration-300 flex flex-col">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center mb-4 text-cyan-600 dark:text-cyan-400">
                  <Dices className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Algorithmic Draws</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  Monthly scheduled draw simulations strictly map submitted arrays against winning patterns. Automated tier generation cleanly distributes prizes.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:purple-500/50 transition-all duration-300 flex flex-col">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Charity Ecosystem</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  Browse integrated partnership endpoints and configure dynamic percentage bounds from your playtime to fund social initiatives globally.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:green-500/50 transition-all duration-300 flex flex-col">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Verified Payouts</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  Administrators utilize a rigorous manual review pipeline ensuring external winning proofs align securely with internal system generation outputs.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:amber-500/50 transition-all duration-300 flex flex-col">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
                  <LineChart className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">High-Fidelity Analytics</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  Live real-time aggregations capturing active subscriptions, global participants, distributions, and platform-scale health natively.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:rose-500/50 transition-all duration-300 flex flex-col">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-lg bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center mb-4 text-rose-600 dark:text-rose-400">
                  <Trophy className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Tiered Architecture</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  System strictly bounds outcomes formatting 5-match, 4-match, and 3-match algorithms automatically pushing residual 5-match roll-overs exactly.
                </CardDescription>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Info Split Section using Flexbox */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800 flex justify-center">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Secured at the Foundation
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Every route interaction is guarded by custom Edge-compatible JWT middlewares. Platform logic is built directly on Next.js Server Components, removing leaky API surfaces.
            </p>
            <ul className="space-y-4 pt-4">
              {[
                "Drizzle ORM over Neon PostgreSQL",
                "Explicit Role-Tracking Arrays",
                "Native Transaction Idempotency",
              ].map((item, i) => (
                <li key={i} className="flex items-center text-slate-700 dark:text-slate-300">
                  <ShieldCheck className="h-5 w-5 text-blue-500 mr-3 shrink-0" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex-1 w-full max-w-md mx-auto">
            <div className="relative aspect-square sm:aspect-4/3 md:aspect-square w-full rounded-3xl overflow-hidden bg-linear-to-br from-blue-500/10 to-transparent border border-blue-200 dark:border-blue-900/50 shadow-inner flex items-center justify-center p-8">
              <div className="absolute inset-0 bg-linear-to-tr from-cyan-400/20 to-blue-600/20 mix-blend-overlay dark:mix-blend-color-burn" />
              <div className="relative z-10 w-full h-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6 flex flex-col gap-4">
                {/* Mock UI Element */}
                <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div className="space-y-2 mt-4">
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
                  <div className="h-2 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  <div className="h-2 w-4/6 bg-slate-200 dark:bg-slate-800 rounded-full" />
                </div>
                <div className="mt-auto flex justify-between items-center bg-blue-50 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-100 dark:border-blue-900">
                  <div className="h-10 w-10 bg-blue-200 dark:bg-blue-800 rounded-full flex shrink-0" />
                  <div className="h-3 w-16 bg-blue-200 dark:bg-blue-800 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Flow */}
      <section className="py-20 bg-slate-900 dark:bg-background border-t border-slate-800 px-4 flex justify-center">
        <div className="max-w-4xl text-center space-y-6 flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white">Join PlayLance Now</h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            Experience an ecosystem designed to turn regular scoring interactions into profound rewards.
          </p>
          <Link href="/sign-in">
            <Button size="lg" className="bg-cyan-500 text-white hover:bg-cyan-400 transition-colors rounded-full px-10 border-0 h-14 text-lg mt-6">
              Access Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
