import React from "react";
import { AdminReportsManager } from "./_components/AdminReportsManager";

export const metadata = {
  title: "Reports & Analytics | PlayLance Admin",
  description: "View high-level overview metrics across your entire platform.",
};

export default function AdminReportsPage() {
  return (
    <div className="space-y-6 mt-7 p-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">Holistic insights into your active users, charities, and prize distributions.</p>
      </div>

      <AdminReportsManager />
    </div>
  );
}
