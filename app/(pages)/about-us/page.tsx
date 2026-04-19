import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Target, ShieldCheck, HeartHandshake, Zap } from "lucide-react";

export const metadata = {
  title: "About Us | PlayLance",
  description: "Learn more about the mission, vision, and team behind PlayLance.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 
        Hero Section with Gradient 
        Utilizing a smooth dynamic gradient scaling perfectly across light and dark modes 
      */}
      <section className="relative overflow-hidden pt-24 pb-32 flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-linear-to-br from-cyan-100 via-white to-blue-50 dark:from-cyan-950/40 dark:via-background dark:to-blue-900/20 -z-10" />
        
        {/* Subtle background glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-cyan-400/20 dark:bg-cyan-600/20 blur-[100px] rounded-full -z-10" />

        <div className="max-w-3xl space-y-8 flex flex-col items-center z-10">
          <div className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-600 dark:text-cyan-400 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-cyan-500 mr-2 animate-pulse"></span>
            Our Mission
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Redefining Rewards Through <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-500 to-blue-600">Impact.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            PlayLance isn't just a gaming platform. We are bridging the gap between engaging recreational challenges and real-world charitable impact, empowering our users to win big while giving back.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/sign-up">
              <Button size="lg" className="w-full sm:w-auto font-semibold bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-8">
                Join the Movement <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 border-slate-300 dark:border-slate-700">
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Values Section using Flex and Grid */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Built on Core Principles
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Every feature we ship is strictly aligned with our ethos. Transparency, security, and community drive everything we do.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
              <CardContent className="p-8 flex flex-col gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold">Accuracy & Fair Play</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our simulated draw algorithms are completely randomized and mathematically fair, ensuring every logged score translates into an equal chance at securing payouts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
              <CardContent className="p-8 flex flex-col gap-4">
                <div className="h-12 w-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center">
                  <HeartHandshake className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold">Charitable Action</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your subscriptions do more than unlock the platform. We actively partner with verified, high-impact charities, meaning every round you play helps drive social change.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
              <CardContent className="p-8 flex flex-col gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold">Uncompromised Security</h3>
                <p className="text-muted-foreground leading-relaxed">
                  From robust cryptographic JWT validation protecting your data, to strict role-based transaction architectures ensuring payouts are handled with zero internal leaks.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
              <CardContent className="p-8 flex flex-col gap-4">
                <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-bold">Rapid Dispersals</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Winners shouldn't wait. Our dedicated administrative review portal connects verified proof of winning directly to your preferred payout method at maximum speed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-linear-to-br from-slate-900 to-slate-800 dark:from-cyan-950 dark:to-slate-900 rounded-3xl p-10 md:p-16 text-center shadow-xl border border-slate-700/50 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Ready to Play?</h2>
            <p className="text-slate-300 text-lg max-w-xl">
              Register an account today, pick your favorite charity, and step onto the course. The next draw happens soon.
            </p>
            <Link href="/sign-up" className="mt-4">
              <Button size="lg" className="rounded-full bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 transition-transform px-8 font-bold">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
