"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Award, FileQuestion, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";

import { WinnerRecord } from "@/types/winners";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function WinningsManager() {
  const [winnings, setWinnings] = useState<WinnerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState("");

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/winnings");
      setWinnings(res.data.winnings || []);
    } catch (error) {
      toast.error("Failed to fetch winning logic natively");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitProof = async (winnerId: string) => {
    if (!proofUrl.trim()) {
      toast.error("Please enter a valid URL identifying your file.");
      return;
    }
    setSubmittingId(winnerId);
    try {
      await axios.post(`/api/winnings/${winnerId}/proof`, { fileUrl: proofUrl });
      toast.success("Validation payload successfully linked!");
      setProofUrl("");
      await fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Submission explicitly failed");
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) return <div className="p-16 text-center text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>;

  if (winnings.length === 0) {
    return (
      <div className="bg-card border border-border shadow-md rounded-2xl p-16 text-center">
         <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
         <h3 className="text-xl font-bold tracking-tight mb-2">No Verified Prizes Yet</h3>
         <p className="text-muted-foreground">Continue linking scores natively to enter the global logic parameters physically!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {winnings.map((win) => {
         const isPending = win.reviewStatus === "not_submitted";
         const isRejected = win.reviewStatus === "rejected";
         
         return (
           <div key={win.id} className="bg-card border border-border shadow-md rounded-2xl p-6 flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                 <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/20">
                    {win.tier} Winner
                 </div>
                 <div className="text-xl font-black text-foreground">
                    ${win.prizeAmount}
                 </div>
              </div>

              <div className="mb-6 z-10 flex-g">
                 <h4 className="font-bold mb-1">Draw Cycle</h4>
                 <p className="text-sm text-muted-foreground">
                   {win.draw?.month} / {win.draw?.year}
                 </p>
                 {win.rejectionReason && isRejected && (
                    <div className="mt-4 bg-rose-500/10 border border-rose-500/50 p-3 rounded-lg text-xs text-rose-600 dark:text-rose-400">
                       <strong>Rejection Context:</strong> {win.rejectionReason}
                    </div>
                 )}
              </div>

              <div className="mt-auto z-10 pt-4 border-t border-border">
                 {isPending || isRejected ? (
                   <>
                     <Button variant={isRejected ? "destructive" : "default"} className="w-full" onClick={() => setSubmittingId(`dialog-${win.id}`)}>
                       {isRejected ? "Re-submit Validation Code" : "Submit Validation Payload"} <ArrowRight className="ml-2 h-4 w-4" />
                     </Button>
                     <Dialog open={submittingId === `dialog-${win.id}`} onOpenChange={(open) => !open && setSubmittingId(null)}>
                     <DialogContent>
                       <DialogHeader>
                         <DialogTitle>Submit Winning Proof Link</DialogTitle>
                         <DialogDescription>
                           Provide a structural URL identically framing your verification metrics implicitly to administrators.
                         </DialogDescription>
                       </DialogHeader>
                       <div className="py-4">
                         <Input 
                           placeholder="https://drive.google.com/..." 
                           value={proofUrl} 
                           onChange={e => setProofUrl(e.target.value)} 
                         />
                       </div>
                       <DialogFooter>
                         <Button disabled={submittingId === win.id} onClick={() => handleSubmitProof(win.id)}>
                           {submittingId === win.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileQuestion className="h-4 w-4 mr-2"/>} Push Integration 
                         </Button>
                       </DialogFooter>
                     </DialogContent>
                     </Dialog>
                   </>
                ) : (
                   <div className="w-full flex items-center justify-center p-2 rounded-lg bg-muted text-sm font-semibold">
                      {win.payoutStatus === "paid" ? (
                         <span className="text-green-500 flex items-center"><CheckCircle2 className="h-4 w-4 mr-2" /> Payout Fully Cleared</span>
                      ) : win.reviewStatus === "approved" ? (
                         <span className="text-violet-500 flex items-center"><CheckCircle2 className="h-4 w-4 mr-2" /> Awaiting Final Distribution</span>
                      ) : (
                         <span className="text-amber-500 flex items-center"><Loader2 className="h-4 w-4 animate-spin mr-2" /> Active Administrator Review</span>
                      )}
                   </div>
                )}
              </div>
           </div>
         );
      })}
    </div>
  );
}
