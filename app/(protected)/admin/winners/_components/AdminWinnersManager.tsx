"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Award, Banknote, ShieldCheck, XCircle, Search, FileSymlink, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

import { WinnerRecord } from "@/types/winners";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function AdminWinnersManager() {
  const [winners, setWinners] = useState<WinnerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/admin/winners");
      setWinners(res.data.winners || []);
    } catch (error) {
      toast.error("Failed to load winners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReview = async (winnerId: string, status: "approved" | "rejected") => {
    if (status === "rejected" && !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    
    setProcessingId(winnerId);
    try {
      await axios.post(`/api/admin/winners/${winnerId}/review`, { status, reason: status === "rejected" ? rejectionReason : null });
      toast.success(status === "approved" ? "Proof approved successfully." : "Proof rejected.");
      if (status === "rejected") setRejectingId(null);
      setRejectionReason("");
      await fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || `Failed to process review.`);
    } finally {
      setProcessingId(null);
    }
  };

  const handlePayout = async (winnerId: string) => {
    setProcessingId(`payout-${winnerId}`);
    try {
      await axios.post(`/api/admin/winners/${winnerId}/payout`);
      toast.success("Payout marked as paid.");
      await fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Error distributing payout.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="p-16 text-center text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>;

  if (winners.length === 0) {
    return (
      <div className="bg-card border border-border shadow-md rounded-2xl p-16 text-center">
         <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
         <h3 className="text-xl font-bold tracking-tight mb-2">No Winners Processed</h3>
         <p className="text-muted-foreground">Publish simulated draws to track winners here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {winners.map((win) => {
         const canReview = win.reviewStatus === "submitted";
         const canPay = win.payoutStatus === "approved_for_payment";
         
         return (
           <div key={win.id} className="bg-card border border-border shadow-sm rounded-xl p-5 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              
              <div className="flex-1 space-y-2">
                 <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground text-lg">${win.prizeAmount}</span>
                    <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">{win.tier}</span>
                    <span className="text-muted-foreground text-sm uppercase">Draw: {win.draw?.month}/{win.draw?.year}</span>
                 </div>
                 
                 <p className="text-sm text-muted-foreground break-all">
                    User: <strong className="text-foreground">{win.user?.email || win.userId}</strong>
                 </p>
                 
                 <div className="flex flex-col gap-1 mt-2">
                   <div className="flex items-center gap-2 text-sm">
                      <strong className="min-w-24">Validation:</strong> 
                      <span className={`font-semibold ${win.reviewStatus === 'approved' ? 'text-green-500' : win.reviewStatus === 'rejected' ? 'text-rose-500' : 'text-amber-500'}`}>
                         {win.reviewStatus.replace('_', ' ').toUpperCase()}
                      </span>
                   </div>
                   <div className="flex items-center gap-2 text-sm">
                      <strong className="min-w-24">Payment:</strong> 
                      <span className={`font-semibold ${win.payoutStatus === 'paid' ? 'text-green-500' : win.payoutStatus === 'approved_for_payment' ? 'text-violet-500' : 'text-amber-500'}`}>
                         {win.payoutStatus.replace(/_/g, ' ').toUpperCase()}
                      </span>
                   </div>
                 </div>
              </div>

              {/* Action Handlers explicitly wrapping native UI components */}
              <div className="flex flex-col gap-3 min-w-[200px] w-full md:w-auto">
                  {win.proof?.fileUrl && (
                    <Button variant="outline" className="w-full" onClick={() => window.open(win.proof!.fileUrl, "_blank")}>
                       <ExternalLink className="h-4 w-4 mr-2" /> View Proof
                    </Button>
                 )}

                 {canReview && (
                    <div className="flex gap-2 w-full">
                       <Button 
                         variant="default" 
                         className="flex-1 bg-green-600 hover:bg-green-700 text-white" 
                         disabled={processingId === win.id}
                         onClick={() => handleReview(win.id, "approved")}
                       >
                         {processingId === win.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve"}
                       </Button>
                       
                       <Button variant="destructive" className="flex-1" onClick={() => setRejectingId(win.id)}>
                         Reject
                       </Button>
                       <Dialog open={rejectingId === win.id} onOpenChange={(open) => !open && setRejectingId(null)}>
                         <DialogContent>
                           <DialogHeader>
                             <DialogTitle>Reject Proof</DialogTitle>
                             <DialogDescription>
                               Please state why this proof is being rejected.
                             </DialogDescription>
                           </DialogHeader>
                           <div className="py-4">
                             <Label>Rejection Reason</Label>
                             <Input 
                               className="mt-2" 
                               placeholder="Image is too blurry..." 
                               value={rejectionReason} 
                               onChange={e => setRejectionReason(e.target.value)} 
                             />
                           </div>
                           <DialogFooter>
                             <Button variant="destructive" disabled={processingId === win.id || !rejectionReason.trim()} onClick={() => handleReview(win.id, "rejected")}>
                               {processingId === win.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />} Reject
                             </Button>
                           </DialogFooter>
                         </DialogContent>
                       </Dialog>
                    </div>
                 )}

                 {canPay && (
                    <Button 
                      variant="default" 
                      className="w-full bg-violet-600 hover:bg-violet-700 text-white" 
                      disabled={processingId === `payout-${win.id}`}
                      onClick={() => handlePayout(win.id)}
                    >
                      {processingId === `payout-${win.id}` ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Banknote className="h-4 w-4 mr-2" />}
                      Mark as Paid
                    </Button>
                 )}
              </div>
              
           </div>
         );
      })}
    </div>
  );
}
