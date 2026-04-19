"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Award, AlertCircle, Calendar } from "lucide-react";

import { DrawRecord, DrawEntryResult } from "@/types/draws";

export function UserDrawView() {
  const [latestDraw, setLatestDraw] = useState<DrawRecord | null>(null);
  const [myEntries, setMyEntries] = useState<DrawEntryResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [drawRes, meRes] = await Promise.all([
          axios.get("/api/draws/latest"),
          axios.get("/api/draws/me")
        ]);
        setLatestDraw(drawRes.data.draw);
        setMyEntries(meRes.data.entries || []);
      } catch (error) {
        console.error("Failed to load generic boundaries", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-16 text-center text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>;

  const currentEntry = myEntries.find(e => e.drawId === latestDraw?.id);

  return (
    <div className="space-y-8">
      {/* Latest Draw Showcase */}
      <div className="bg-card border border-border shadow-md rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Award className="h-48 w-48" />
        </div>
        
        {latestDraw ? (
          <div>
            <h3 className="text-xl font-bold tracking-tight mb-1">
              {new Date(0, latestDraw.month - 1).toLocaleString('default', { month: 'long' })} {latestDraw.year} Draw
            </h3>
            {latestDraw.publishedAt && (
              <p className="text-muted-foreground text-sm mb-6">Results published on {new Date(latestDraw.publishedAt).toLocaleDateString()}</p>
            )}
            
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase text-muted-foreground mb-3 tracking-wider">Winning Numbers</p>
              <div className="flex gap-3">
                {latestDraw.winningNumbers?.map((n: number, i: number) => {
                  const matched = currentEntry?.entryNumbers?.includes(n);
                  return (
                    <div key={i} className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl font-black shadow-sm
                      ${matched ? "bg-amber-500 text-white shadow-amber-500/30" : "bg-primary/10 text-primary border border-primary/20"}`}>
                      {n}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-xl border border-border/50 backdrop-blur-sm">
              <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-amber-500" /> Your Ticket
              </h4>
              {currentEntry ? (
                <div>
                   <div className="flex gap-2 mb-3">
                    {currentEntry.entryNumbers?.map((n: number, i: number) => {
                      const matched = latestDraw.winningNumbers?.includes(n);
                      return (
                        <div key={i} className={`h-10 w-10 text-sm rounded-lg flex items-center justify-center font-bold border
                          ${matched ? "bg-amber-500 text-white border-amber-600" : "bg-background text-muted-foreground border-border"}`}>
                          {n}
                        </div>
                      );
                    })}
                   </div>
                   <p className="text-sm">
                     You matched <strong className="text-amber-500 text-lg">{currentEntry.matchCount}</strong> out of <strong className="text-amber-500 text-lg">5</strong> numbers.
                     {currentEntry.isWinner 
                        ? " Congratulations! You placed in the prize pool!" 
                        : " Better luck next time. Keep logging scores to be eligible!"}
                   </p>
                </div>
              ) : (
                <div className="flex items-start gap-3 mt-3">
                   <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                   <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">You were not eligible for this draw.</p>
                    Ensure your subscription is active and you have logged at least 5 scores to enter automatically next month.
                   </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-xl font-bold mb-2">No past draws found</h3>
            <p className="text-muted-foreground text-sm">Draws are simulated logically every month. Track your scores to stay ready!</p>
          </div>
        )}
      </div>

      {/* Historical List */}
      <h3 className="text-lg font-bold tracking-tight">Draw History</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {myEntries.filter(e => e.drawId !== latestDraw?.id).map((entry) => (
          <div key={entry.id} className="bg-card border border-border rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <strong className="text-sm">{entry.drawDate}</strong>
            </div>
            <div className="flex gap-1.5 mb-3">
              {entry.entryNumbers?.map((n: number, i: number) => {
                 const matched = entry.winningNumbers?.includes(n);
                 return (
                   <div key={i} className={`h-7 w-7 text-xs rounded-md flex items-center justify-center font-bold
                     ${matched ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"}`}>
                     {n}
                   </div>
                 );
              })}
            </div>
            <p className="text-xs font-semibold uppercase">
              {entry.isWinner ? <span className="text-green-500">Won Prize Tier</span> : <span className="text-slate-500">0 Matches Recorded</span>}
            </p>
          </div>
        ))}
        {myEntries.filter(e => e.drawId !== latestDraw?.id).length === 0 && (
          <p className="text-sm text-muted-foreground col-span-full">No historical draws available to show.</p>
        )}
      </div>
    </div>
  );
}
