import React from "react";
import { getCurrentDbUser } from "@/lib/current-user";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const user = await getCurrentDbUser();
  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center min-h-[50vh]">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Admin Control Panel
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Welcome to the Playlance Admin Dashboard. You can manage organizations, review user analytics, and monitor charity performance here.
        </p>
      </div>
    </div>
  );
}
