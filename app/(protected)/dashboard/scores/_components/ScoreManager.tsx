"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { GolfScore } from "./types";
import { ScoreForm } from "./ScoreForm";
import { ScoreList } from "./ScoreList";
import toast from "react-hot-toast";

export function ScoreManager() {
  const [scores, setScores] = useState<GolfScore[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = async () => {
    try {
      const res = await axios.get("/api/scores");
      if (res.data.scores) {
        setScores(res.data.scores);
      }
    } catch (error: any) {
      toast.error("Failed to load scores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const handleScoreAdded = (newScore: GolfScore) => {
    // Add to top, ensuring max 5 displayed locally just like backend 
    setScores((prev) => {
        const next = [newScore, ...prev];
        // Sort effectively by date
        next.sort((a, b) => new Date(b.scoreDate).getTime() - new Date(a.scoreDate).getTime());
        return next.slice(0, 5); 
    });
  };

  const handleScoreUpdated = (updatedScore: GolfScore) => {
    setScores((prev) => {
        const updated = prev.map((s) => (s.id === updatedScore.id ? updatedScore : s));
        updated.sort((a, b) => new Date(b.scoreDate).getTime() - new Date(a.scoreDate).getTime());
        return updated;
    });
  };

  const handleScoreDeleted = (scoreId: string) => {
    setScores((prev) => prev.filter((s) => s.id !== scoreId));
    // It's a good idea to refresh from backend to pull in the next oldest score 
    // if there were more than 5 historically (though business logic says only 5 exist total).
    fetchScores();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground animate-pulse text-sm">Loading your scores...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ScoreForm onScoreAdded={handleScoreAdded} />
      <ScoreList 
        scores={scores} 
        onScoreUpdated={handleScoreUpdated} 
        onScoreDeleted={handleScoreDeleted} 
      />
    </div>
  );
}
