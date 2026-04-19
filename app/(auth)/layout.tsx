import React from "react";
import Link from 'next/link';
import { Trophy } from "lucide-react";
import Image from "next/image";

import { cookies } from "next/headers";
import ClientAuthRedirect from "./ClientAuthRedirect";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Catch authenticated users traversing to public auth gates
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (sessionToken) {
    return <ClientAuthRedirect />;
  }
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-linear-to-r from-violet-600/20 to-cyan-500/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-linear-to-r from-orange-500/10 to-fuchsia-500/20 blur-[120px]" />
      </div>

      <div className="z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6 py-12">
        <Image src="/Images/Logo/auth-logo.svg" alt="Logo" width={280} height={280} className="mb-10 dark:invert"/>        
        {children}        
      </div>
    </div>
  );
}
