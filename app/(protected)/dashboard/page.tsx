import React from "react";
import { UserDashboardSummary } from "./_components/UserDashboardSummary";

export default function UserDashboardPage() {
  return (
    <div className="flex-1 w-full flex flex-col items-center min-h-[50vh] p-8 mt-4">
      <div className="max-w-4xl mx-auto w-full text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Your Dashboard
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Welcome to your Playlance dashboard! View your upcoming games, manage your charity contributions, and claim your rewards.
        </p>

        {/* Dashboard Aggregate Injection */}
        <UserDashboardSummary />

      </div>
    </div>
  );
}
