import React from "react";
import { AdminWinnersManager } from "./_components/AdminWinnersManager";

export const metadata = {
  title: "Winners Tracking | PlayLance Admin",
  description: "Securely review validation proofs mimicking absolute payout distributions natively.",
};

export default function AdminWinnersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Winners & Payout Engine</h1>
        <p className="text-muted-foreground mt-1">Review validation proofs securely triggering strict payouts directly mapping Native Bounds.</p>
      </div>

      <AdminWinnersManager />
    </div>
  );
}
