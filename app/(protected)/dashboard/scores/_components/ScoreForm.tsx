"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GolfScore } from "./types";

interface ScoreFormProps {
  onScoreAdded: (score: GolfScore) => void;
  disabled?: boolean;
}

export function ScoreForm({ onScoreAdded, disabled }: ScoreFormProps) {
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | "">("");
  
  // Default to today in YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];
  const [scoreDate, setScoreDate] = useState<string>(today);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    if (score === "" || score < 1 || score > 45) {
      toast.error("Score must be between 1 and 45");
      return;
    }
    if (!scoreDate) {
      toast.error("Please select a date");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/scores", {
        score: Number(score),
        scoreDate,
      });
      toast.success("Score added successfully!");
      onScoreAdded(res.data.score);
      setScore(""); // reset score input
      // Keep date as is or reset to today
      setScoreDate(today);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add score");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs p-5 md:p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Target className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Add New Score</h2>
          <p className="text-sm text-muted-foreground">Log your latest 9 or 18 holes.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex flex-col gap-2 w-full sm:w-1/3 relative">
          <Label htmlFor="score">Total Score (1-45)</Label>
          <Input 
            id="score"
            type="number" 
            min="1" 
            max="45" 
            value={score} 
            onChange={(e) => setScore(e.target.value === "" ? "" : Number(e.target.value))} 
            placeholder="e.g. 18"
            required
            disabled={loading || disabled}
            className="h-11 bg-background"
          />
        </div>

        <div className="flex flex-col gap-2 w-full sm:w-1/3 relative">
          <Label htmlFor="scoreDate">Date Played</Label>
          <Input 
            id="scoreDate"
            type="date" 
            value={scoreDate}
            max={today}
            onChange={(e) => setScoreDate(e.target.value)} 
            required
            disabled={loading || disabled}
            className="h-11 bg-background [&::-webkit-calendar-picker-indicator]:dark:invert"
          />
        </div>

        <Button 
          type="submit" 
          disabled={loading || disabled} 
          className="h-11 w-full sm:w-1/3 bg-linear-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white shadow-md shadow-violet-500/20"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          {loading ? "Saving..." : "Log Score"}
        </Button>
      </form>
      
      {disabled && (
        <p className="text-xs text-amber-500 mt-4 flex items-center gap-1.5">
          You must be fully onboarded or have an active account to log scores.
        </p>
      )}
    </div>
  );
}
