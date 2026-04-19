"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Award, Banknote, HelpCircle, User, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

type UserSummary = {
  subscriptionStatus: string;
  winnings: {
    total: number;
    pendingPayouts: number;
    totalPrizeValue: number;
  };
};

export function UserDashboardSummary() {
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/dashboard/summary");
      setSummary(res.data.summary);
    } catch (error) {
      toast.error("Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading || !summary) {
     return <div className="p-8 flex justify-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  const MetricsCard = ({ title, value, icon: Icon, description }: { title: string, value: string | number, icon: any, description?: string }) => (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm overflow-hidden text-left flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-semibold text-muted-foreground tracking-tight">{title}</h3>
            <div className="bg-primary/5 p-1.5 rounded-lg border border-primary/10">
                <Icon className="h-4 w-4 text-primary" />
            </div>
        </div>
        <div className="space-y-0.5">
            <div className="text-2xl font-black text-foreground">
                {value}
            </div>
            {description && <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>}
        </div>
    </div>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full mt-8">
       <MetricsCard 
          title="Subscription Status" 
          value={summary.subscriptionStatus.toUpperCase()} 
          icon={User} 
          description="Your active account status" 
       />
       <MetricsCard 
          title="Total Lifetime Wins" 
          value={summary.winnings.total} 
          icon={Award} 
          description="Matches secured across draws" 
       />
       <MetricsCard 
          title="Pending Queue" 
          value={summary.winnings.pendingPayouts} 
          icon={HelpCircle} 
          description="Validations active inside review" 
       />
       <MetricsCard 
          title="Lifetime Accrued Value" 
          value={`$${summary.winnings.totalPrizeValue.toLocaleString()}`} 
          icon={Banknote} 
          description="Total lifetime value from all prizes" 
       />
    </div>
  );
}
