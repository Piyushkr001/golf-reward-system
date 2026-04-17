import React from 'react';
import Link from 'next/link';
import { ArrowRight, Trophy, Target, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { SparklesText } from '@/components/ui/sparkles-text';

export default function Hero() {
  return (
    <section className="relative overflow-hidden w-full pt-20 pb-24 lg:pt-32 lg:pb-32 bg-slate-50 dark:bg-slate-950">
      {/* Background glowing gradients */}
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-linear-to-r from-violet-500/20 to-fuchsia-500/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-linear-to-r from-cyan-500/20 to-blue-500/20 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Left Text Content */}
          <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="group relative flex items-center justify-center mb-6 rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
              <span
                className={cn(
                  "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-linear-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-size-[300%_100%] p-px"
                )}
                style={{
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "destination-out",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "subtract",
                  WebkitClipPath: "padding-box",
                }}
              />
              🏆 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
              <AnimatedGradientText className="text-sm font-medium">
                The #1 Golf Rewards Platform
              </AnimatedGradientText>
              <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
              Elevate Your Game.<br className="hidden md:block" />
              <SparklesText>
                <span className="bg-linear-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
                  Earn Real <br /> Rewards.
                </span>
              </SparklesText>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0">
              PlayLance transforms every swing into points. Compete with friends, climb the leaderboards, and redeem your achievements for premium gear and exclusive experiences.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-linear-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white font-semibold text-lg rounded-full transition-all shadow-lg shadow-violet-500/25">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-full font-semibold text-lg border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
                  How it Works
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl w-full mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start">
                <p className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">10K+</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Active Players</p>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <p className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">500+</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Partner Courses</p>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <p className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">$1M+</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Rewards Claimed</p>
              </div>
            </div>
          </div>

          {/* Right Floating Elements / Graphic */}
          <div className="flex-1 relative w-full max-w-lg mx-auto lg:max-w-none lg:pl-10">
            <div className="relative w-full max-w-[400px] lg:max-w-[500px] aspect-square mx-auto rounded-full border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl flex items-center justify-center p-8 shadow-2xl">

              {/* Conceptual Rings */}
              <div className="absolute inset-4 rounded-full border border-violet-500/20 dark:border-violet-500/30 animate-[spin_40s_linear_infinite]" />
              <div className="absolute inset-12 rounded-full border border-cyan-500/20 dark:border-cyan-500/30 animate-[spin_50s_linear_infinite_reverse]" />

              {/* Floating Cards */}
              <div className="relative z-10 w-full flex flex-col items-center justify-center gap-8">

                {/* Main Logo Card */}
                <div className="w-28 h-28 bg-linear-to-br from-violet-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-500/30 transform hover:scale-105 transition-transform duration-300">
                  <Trophy className="h-14 w-14 text-white" />
                </div>

                <div className="flex flex-col gap-4 w-full px-4">
                  {/* Card 1 */}
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 transform -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 mr-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-500/20 flex shrink-0 items-center justify-center">
                        <Target className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div className="text-left w-full">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Eagle Scored!</p>
                        <p className="text-xs font-medium text-violet-600 dark:text-violet-400">+500 Points</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 ml-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-500/20 flex shrink-0 items-center justify-center">
                        <Users className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <div className="text-left w-full">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Beat John Doe</p>
                        <p className="text-xs font-medium text-cyan-600 dark:text-cyan-400">Match won</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}