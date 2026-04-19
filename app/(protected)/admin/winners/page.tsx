import React from "react";
import { AdminWinnersManager } from "./_components/AdminWinnersManager";

export const metadata = {
  title: "Winners Tracking | PlayLance Admin",
  description: "Review winners and process payouts for finalized draws.",
};

export default function AdminWinnersPage() {
  return (
    <div className="space-y-6 mt-7 p-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Winners & Payouts</h1>
        <p className="text-muted-foreground mt-1">Review validation proofs and process final payouts for winning users.</p>
      </div>

      <AdminWinnersManager />
    </div>
  );
}
