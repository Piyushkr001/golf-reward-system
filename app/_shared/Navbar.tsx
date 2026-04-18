"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { usePathname } from "next/navigation";
import { Menu, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { ModeToggle } from "@/components/Modetoggle";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Charities", href: "/charities" },
  { name: "About Us", href: "/about-us" },
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [session, setSession] = useState<{ id: number, role: string, email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/auth/me')
      .then(res => {
        if (res.data?.authenticated) setSession(res.data.user);
        else setSession(null);
      })
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
  }, [pathname]);

  const handleSignOut = async () => {
    await axios.post('/api/auth/logout');
    window.location.href = '/';
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky rounded-2xl shadow-xl top-0 z-50 w-full border-b border-slate-200 dark:border-white/10 bg-white/70 bg-linear-to-r from-violet-50/50 to-cyan-50/50 dark:bg-slate-950/70 dark:bg-none backdrop-blur-xl">
      <div className="mx-auto h-20 flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <div className="flex items-center gap-8">
        <Link href="/" className="flex cursor-pointer items-center gap-3">
          <Image src="/Images/Logo/logo.svg" alt="PlayLance"
            width={160}
            height={48}
            className="dark:invert w-auto h-18"
            priority
            />
        </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition ${
                isActive(link.href)
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <ModeToggle />
          
          {!loading && !session ? (
            <>
              <Link href="/admin/login">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="hidden lg:inline">Admin</span>
                </Button>
              </Link>

              <Link href="/sign-in">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                  Sign In
                </Button>
              </Link>

              <Link href="/sign-up">
                <Button className="bg-linear-to-r from-violet-600 to-cyan-500 text-white hover:opacity-90">
                  Get Started
                </Button>
              </Link>
            </>
          ) : !loading && session ? (
            <>
              <Button onClick={handleSignOut} variant="ghost" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                Sign Out
              </Button>
              <Link href={session.role === 'admin' ? '/admin' : '/dashboard'}>
                <Button className="bg-linear-to-r from-violet-600 to-cyan-500 text-white hover:opacity-90">
                  {session.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Button>
              </Link>
            </>
          ) : (
            <div className="w-[180px] h-10 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg" />
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" />}>
              <Menu className="h-6 w-6 text-slate-800 dark:text-white" />
              <span className="sr-only">Toggle Menu</span>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[280px] bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10"
            >
              <div className="flex flex-col gap-6 p-5 mt-10">
                
                {/* Links */}
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-base font-medium ${
                      isActive(link.href)
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* CTA */}
                <div className="flex flex-col gap-3 mt-6">
                  
                  {!loading && !session ? (
                    <>
                      <Link href="/admin/login">
                        <Button variant="ghost" className="w-full flex items-center gap-2 justify-center border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                          <ShieldCheck className="h-4 w-4" />
                          Admin Login
                        </Button>
                      </Link>

                      <Link href="/sign-in">
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>

                      <Link href="/sign-up">
                        <Button className="w-full bg-linear-to-r from-violet-600 to-cyan-500 text-white">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  ) : !loading && session ? (
                    <>
                      <Link href={session.role === 'admin' ? '/admin' : '/dashboard'}>
                        <Button className="w-full bg-linear-to-r from-violet-600 to-cyan-500 text-white">
                          {session.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                        </Button>
                      </Link>

                      <Button onClick={handleSignOut} variant="outline" className="w-full text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50">
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <div className="w-full h-24 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  )}
                </div>

              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}