import React from "react";

export default function UserDashboardPage() {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center min-h-[50vh]">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Your Dashboard
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Welcome to your Playlance dashboard! View your upcoming games, manage your charity contributions, and claim your rewards.
        </p>
      </div>
    </div>
  );
}
