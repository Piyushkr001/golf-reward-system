"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Users, CreditCard, HeartHandshake, Gift, Award, Banknote, ShieldCheck, Search } from "lucide-react";
import toast from "react-hot-toast";

type AdminSummary = {
  users: number;
  subscriptions: number;
  charities: { total: number; featured: number };
  draws: { published: number };
  winners: { 
    total: number;
    pendingReviews: number;
    pendingPayouts: number;
    paidPayouts: number;
    distributedPool: number;
  };
};

export function AdminReportsManager() {
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/admin/reports/summary");
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
     return <div className="p-16 flex justify-center text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const MetricsCard = ({ title, value, icon: Icon, description }: { title: string, value: string | number, icon: any, description?: string }) => (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground tracking-tight">{title}</h3>
            <div className="bg-primary/10 p-2 rounded-lg">
                <Icon className="h-5 w-5 text-primary" />
            </div>
        </div>
        <div className="space-y-1">
            <div className="text-3xl font-black text-foreground">
                {value}
            </div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Primary User Growth & Economy Stats */}
      <div>
         <h2 className="text-lg font-bold mb-4 flex items-center"><Users className="h-5 w-5 mr-2 text-primary" /> Platform Scale</h2>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             <MetricsCard title="Total Registered Users" value={summary.users} icon={Users} description="Lifetime active platform signups" />
             <MetricsCard title="Active Subscribers" value={summary.subscriptions} icon={CreditCard} description="Users with active payment links" />
             <MetricsCard title="Registered Charities" value={summary.charities.total} icon={HeartHandshake} description={`${summary.charities.featured} currently featured partners`} />
             <MetricsCard title="Published Monthly Draws" value={summary.draws.published} icon={Gift} description="Simulated results published" />
         </div>
      </div>

      {/* Reward Distribution Lifecycle */}
      <div>
         <h2 className="text-lg font-bold mb-4 flex items-center"><Award className="h-5 w-5 mr-2 text-primary" /> Reward Lifecycle Overview</h2>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             <MetricsCard title="Total Winning Entries" value={summary.winners.total} icon={Award} description="Total lifetime winning users matched" />
             <MetricsCard title="Pending Validation Audits" value={summary.winners.pendingReviews} icon={Search} description="User submissions awaiting approval" />
             <MetricsCard title="Pending Prize Distributions" value={summary.winners.pendingPayouts} icon={ShieldCheck} description="Approved winners awaiting final payment" />
             <MetricsCard title="Successfully Paid Out" value={summary.winners.paidPayouts} icon={Banknote} description="Total paid distributions" />
             <MetricsCard title="Cumulative Value Given" value={`$${summary.winners.distributedPool.toLocaleString()}`} icon={Banknote} description="Total value distributed to winners" />
         </div>
      </div>
    </div>
  );
}
