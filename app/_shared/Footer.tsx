'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InstagramLogoIcon, LinkedinLogoIcon, XLogoIcon } from '@phosphor-icons/react';

export default function Footer() {
  const pathname = usePathname();
  
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/70 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">

          {/* Brand & Description */}
          <div className="flex flex-col lg:w-1/3 gap-6">
            <Image
              src="/Images/Logo/logo.svg"
              alt="PlayLance"
              width={140}
              height={40}
              className="dark:invert w-auto h-18"
            />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              PlayLance transforms your golfing journey into a rewarding experience. Play your favorite courses, compete, and redeem points for premium gear.
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://x.com" className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-violet-100 dark:hover:bg-violet-500/20 text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                <XLogoIcon className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com" className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-violet-100 dark:hover:bg-violet-500/20 text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                <InstagramLogoIcon className="h-5 w-5" />
              </Link>
              <Link href="https://linkedin.com" className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-violet-100 dark:hover:bg-violet-500/20 text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                <LinkedinLogoIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Links Grid */}
          <div className="flex flex-col sm:flex-row gap-12 sm:gap-24">

            {/* Product */}
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-slate-900 dark:text-white">Platform</h4>
              <Link href="/" className="text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Home</Link>
              <Link href="/how-it-works" className="text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">How it Works</Link>
              <Link href="/pricing" className="text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Pricing</Link>
              <Link href="/charities" className="text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Charities</Link>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-slate-900 dark:text-white">Legal</h4>
              <Link href="/privacy-policy" className="text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Terms of Service</Link>
              <Link href="/cookie-policy" className="text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Cookie Policy</Link>
            </div>

            {/* CTA App */}
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-slate-900 dark:text-white">Get Started</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-[200px]">
                Ready to elevate your game and earn rewards?
              </p>
              <Link href="/sign-up">
                <Button className="w-full bg-linear-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white shadow-md shadow-violet-500/20">
                  Join for Free
                </Button>
              </Link>
            </div>

          </div>

        </div>

        {/* Copyright separator */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-500">
          <p>© {new Date().getFullYear()} PlayLance. All rights reserved.</p>
          <div className="flex items-center gap-1 font-medium">
            Built with <Trophy className="h-4 w-4 text-violet-500 inline mx-0.5" /> for Golfers
          </div>
        </div>
      </div>
    </footer>
  );
}