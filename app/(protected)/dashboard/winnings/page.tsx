import React from "react";
import { WinningsManager } from "./_components/WinningsManager";

export const metadata = {
  title: "My Winnings | PlayLance",
  description: "Review and handle validations for your accumulated prize payouts securely.",
};

export default function WinningsPage() {
  return (
    <div className="space-y-6 mt-7 p-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prize Validations</h1>
        <p className="text-muted-foreground mt-1">Submit Proof files linking your PlayLance rewards securely to proceed with disbursements.</p>
      </div>

      <WinningsManager />
    </div>
  );
}
