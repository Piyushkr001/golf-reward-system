"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Loader2, Trash2, Edit2, Check, X, Calendar, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GolfScore } from "./types";

interface ScoreListProps {
  scores: GolfScore[];
  onScoreUpdated: (score: GolfScore) => void;
  onScoreDeleted: (scoreId: string) => void;
}

export function ScoreList({ scores, onScoreUpdated, onScoreDeleted }: ScoreListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editScore, setEditScore] = useState<number | "">("");
  const [editDate, setEditDate] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<string | null>(null); // holds score ID being processed

  const startEditing = (score: GolfScore) => {
    setEditingId(score.id);
    setEditScore(score.score);
    // scoreDate from DB is typically YYYY-MM-DD
    setEditDate(score.scoreDate.split("T")[0]);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditScore("");
    setEditDate("");
  };

  const saveEdit = async (scoreId: string) => {
    if (editScore === "" || editScore < 1 || editScore > 45) {
      toast.error("Score must be between 1 and 45");
      return;
    }
    if (!editDate) {
      toast.error("Please select a date");
      return;
    }

    setActionLoading(scoreId);
    try {
      const res = await axios.patch(`/api/scores/${scoreId}`, {
        score: Number(editScore),
        scoreDate: editDate,
      });
      toast.success("Score updated!");
      onScoreUpdated(res.data.score);
      setEditingId(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update score");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteScore = async (scoreId: string) => {
    if (!window.confirm("Are you sure you want to delete this score?")) return;
    
    setActionLoading(scoreId);
    try {
      await axios.delete(`/api/scores/${scoreId}`);
      toast.success("Score deleted!");
      onScoreDeleted(scoreId);
    } catch (error: any) {
      toast.error("Failed to delete score");
    } finally {
      setActionLoading(null);
    }
  };

  if (scores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-card border border-border rounded-2xl shadow-sm text-center">
        <div className="bg-muted p-4 rounded-full mb-4">
          <Trophy className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">No scores yet</h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          You haven't logged any golf scores. Add your first score above to start tracking your performance.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Recent Scores
        </h3>
        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md font-medium">
          {scores.length} / 5 Max
        </span>
      </div>

      <div className="grid gap-3">
        {scores.map((score, index) => {
          const isEditing = editingId === score.id;
          const isLoading = actionLoading === score.id;
          // visually highlight the most recent score if it's the first in the list
          const isLatest = index === 0;

          return (
            <div 
              key={score.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${
                isLatest ? "border-primary/30 bg-primary/5 shadow-sm" : "border-border bg-card shadow-xs"
              }`}
            >
              <div className="flex-1 mb-4 sm:mb-0">
                {isEditing ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="w-full sm:w-24">
                      <Input
                        type="number"
                        min="1"
                        max="45"
                        value={editScore}
                        onChange={(e) => setEditScore(e.target.value === "" ? "" : Number(e.target.value))}
                        className="h-9"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="w-full sm:w-40">
                      <Input
                        type="date"
                        value={editDate}
                        max={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="h-9 [&::-webkit-calendar-picker-indicator]:dark:invert"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center h-12 w-12 rounded-lg font-bold text-xl ${
                      isLatest ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}>
                      {score.score}
                    </div>
                    <div>
                      <div className="flex items-center text-sm font-medium text-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        {score.scoreDate ? format(new Date(score.scoreDate), "MMMM d, yyyy") : "Unknown Date"}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Logged on {format(new Date(score.createdAt), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                {isEditing ? (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={cancelEditing} 
                      disabled={isLoading}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => saveEdit(score.id)} 
                      disabled={isLoading}
                      className="h-8 px-3 text-xs"
                    >
                      {isLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : <Check className="h-3 w-3 mr-1.5" />}
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => startEditing(score)}
                      disabled={actionLoading !== null}
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteScore(score.id)}
                      disabled={actionLoading !== null}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
