"use client";

import { useEffect, useState } from "react";
import { Loader2, CreditCard, CalendarIcon, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import toast from "react-hot-toast";
import { format } from "date-fns";

type Subscription = {
  id: string;
  status: "active" | "inactive" | "canceled" | "past_due";
  planId: string;
  renewalDate: string | null;
  canceledAt: string | null;
  plan: {
    name: string;
    interval: string;
    price: number;
    currency: string;
  } | null;
};

type BillingEvent = {
  id: string;
  eventType: string;
  amount: number;
  currency: string;
  createdAt: string;
};

export default function DashboardBillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [events, setEvents] = useState<BillingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      const [subRes, eventsRes] = await Promise.all([
        fetch("/api/subscriptions/current"),
        fetch("/api/subscriptions/billing-history")
      ]);

      if (subRes.ok) {
        const subData = await subRes.json();
        if (subData.success) setSubscription(subData.subscription);
      }
      
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        if (eventsData.success) setEvents(eventsData.events);
      }
    } catch (error) {
      console.error("Failed to load billing data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You will lose access to premium features.")) return;

    setCanceling(true);
    try {
      const res = await fetch("/api/subscriptions/cancel", { method: "POST" });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Subscription canceled successfully");
        await fetchBillingData();
      } else {
        toast.error(data.message || "Failed to cancel subscription");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount / 100);
  };

  return (
    <div className="flex-1 min-h-screen space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Billing & Subscriptions</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                Manage your subscription and renewal settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subscription && subscription.plan ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        {subscription.plan.name}
                        <Badge variant={subscription.status === "active" ? "default" : "secondary"} className={subscription.status === 'active' ? "bg-cyan-500 hover:bg-cyan-600 text-white" : ""}>
                          {subscription.status.toUpperCase()}
                        </Badge>
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatPrice(subscription.plan.price, subscription.plan.currency)} / {subscription.plan.interval}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" /> Renewal Date
                      </span>
                      <span className="font-medium">
                        {subscription.renewalDate ? format(new Date(subscription.renewalDate), 'MMMM dd, yyyy') : "N/A"}
                      </span>
                    </div>

                    {subscription.canceledAt && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-red-400 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" /> Canceled On
                        </span>
                        <span className="font-medium text-red-500">
                          {format(new Date(subscription.canceledAt), 'MMMM dd, yyyy')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">No active subscription</h3>
                    <p className="text-sm text-muted-foreground mt-1">You are currently not subscribed to any plan.</p>
                  </div>
                  <Button variant="default" className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white" onClick={() => window.location.href = "/pricing"}>
                    View Plans
                  </Button>
                </div>
              )}
            </CardContent>
            {subscription && subscription.status === "active" && (
              <CardFooter className="border-t pt-6 bg-muted/20 flex justify-between">
                <p className="text-xs text-muted-foreground">Changes will take effect at the end of the current billing cycle.</p>
                <Button variant="destructive" size="sm" onClick={handleCancel} disabled={canceling}>
                  {canceling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Cancel Subscription
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        <div className="col-span-4 lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                Recent charges and events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {events.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">
                          {format(new Date(event.createdAt), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {event.eventType.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(event.amount, event.currency)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  No billing history found.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
