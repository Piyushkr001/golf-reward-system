"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Charities", href: "/charities" },
  { name: "About Us", href: "/about-us" },
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const pathname = usePathname();

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
                </div>

              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}