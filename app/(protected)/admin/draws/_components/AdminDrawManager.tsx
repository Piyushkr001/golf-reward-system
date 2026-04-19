"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, Plus, Play, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { DrawRecord } from "@/types/draws";

export function AdminDrawManager() {
  const [draws, setDraws] = useState<DrawRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [simulating, setSimulating] = useState<string | null>(null);
  
  // Create Draw state
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState(currentMonth.toString());
  const [year, setYear] = useState(currentYear.toString());
  const [logicType, setLogicType] = useState("algorithmic");

  const fetchDraws = async () => {
    try {
      const res = await axios.get("/api/admin/draws");
      setDraws(res.data.draws || []);
    } catch {
      toast.error("Failed to load draws");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDraws();
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      await axios.post("/api/admin/draws/create", {
        month: Number(month),
        year: Number(year),
        logicType
      });
      toast.success("Draft created successfully");
      fetchDraws();
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Failed to create");
    } finally {
      setCreating(false);
    }
  };

  const handleSimulate = async (id: string) => {
    setSimulating(id);
    try {
      await axios.post(`/api/admin/draws/${id}/simulate`);
      toast.success("Draw simulated securely");
      fetchDraws();
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Simulation failed");
    } finally {
      setSimulating(null);
    }
  };

  const handlePublish = async (id: string) => {
    if (!window.confirm("Publishing will lock the draw and reveal to users. Continue?")) return;
    try {
      await axios.post(`/api/admin/draws/${id}/publish`);
      toast.success("Draw published!");
      fetchDraws();
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Publish failed");
    }
  };

  if (loading) return <div className="p-10 text-center text-muted-foreground"><Loader2 className="animate-spin h-8 w-8 mx-auto" /></div>;

  return (
    <div className="space-y-8">
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">Create Draft</h3>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="space-y-2">
            <Label>Month (1-12)</Label>
            <Input type="number" min="1" max="12" value={month} onChange={e => setMonth(e.target.value)} className="w-24 bg-background" />
          </div>
          <div className="space-y-2">
            <Label>Year</Label>
            <Input type="number" value={year} onChange={e => setYear(e.target.value)} className="w-24 bg-background" />
          </div>
          <div className="space-y-2 flex-1">
            <Label>Logic Engine</Label>
            <Select value={logicType} onValueChange={(val) => setLogicType(val || "algorithmic")}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="algorithmic">Algorithmic (Frequency based)</SelectItem>
                <SelectItem value="random">Pure Random (1-45)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCreate} disabled={creating} className="bg-primary text-primary-foreground min-w-32">
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />} Create Draw
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {draws.map((d) => (
          <div key={d.id} className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-xl font-bold">Draw {d.month}/{d.year}</h4>
                <span className={`px-2.5 py-0.5 text-xs rounded-full font-bold uppercase
                  ${d.status === "published" ? "bg-green-500/10 text-green-500" :
                    d.status === "simulated" ? "bg-amber-500/10 text-amber-500" :
                      "bg-slate-500/10 text-slate-500"}`}>
                  {d.status}
                </span>
                <span className="text-xs text-muted-foreground uppercase">{d.logicType}</span>
              </div>
              <p className="text-sm text-foreground mb-1">
                Participants: <span className="font-bold mr-2">{d.participantCount || 0}</span>
                {d.prizePool && (
                  <span className="text-muted-foreground mr-2">| Total Pool: <span className="font-bold text-foreground">${d.prizePool.totalPool}</span></span>
                )}
              </p>
              
              {/* Winner Stats breakdown automatically computed server-side */}
              {d.status !== "draft" && d.winnerCounts && (
                 <div className="flex gap-4 mt-1 text-sm bg-muted/30 px-3 py-2 rounded-lg border border-border">
                    <div><span className="text-green-500 font-bold">5 Matches</span>: {d.winnerCounts.five}</div>
                    <div><span className="text-amber-500 font-bold">4 Matches</span>: {d.winnerCounts.four}</div>
                    <div><span className="text-blue-500 font-bold">3 Matches</span>: {d.winnerCounts.three}</div>
                    {d.rolloverAmount > 0 && <div className="ml-auto flex items-center font-bold text-violet-500">Rollover: ${d.rolloverAmount}</div>}
                 </div>
              )}
              {d.winningNumbers && (
                <div className="flex gap-2 mt-3">
                  {d.winningNumbers.map((n: number, i: number) => (
                    <div key={i} className="bg-primary/20 text-primary font-bold h-8 w-8 flex items-center justify-center rounded-lg border border-primary/30">
                      {n}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {d.status === "draft" && (
                <Button onClick={() => handleSimulate(d.id)} disabled={simulating === d.id} variant="outline" className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10">
                  {simulating === d.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 mr-2" />} Simulate
                </Button>
              )}
              {d.status === "simulated" && (
                <>
                  <Button onClick={() => handleSimulate(d.id)} disabled={simulating === d.id} variant="outline">
                    {simulating === d.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 mr-2" />} Re-Simulate
                  </Button>
                  <Button onClick={() => handlePublish(d.id)} className="bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="h-4 w-4 mr-2" /> Publish Results
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
        {draws.length === 0 && <p className="text-muted-foreground">No draws found.</p>}
      </div>
    </div>
  );
}
