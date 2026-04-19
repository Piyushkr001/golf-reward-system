import { Target } from "lucide-react";

export default function ScoresPlaceholderPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Scores (Coming Soon)</h2>
      </div>
      
      <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl border-border bg-card/50 text-center space-y-6">
        <div className="bg-primary/10 p-4 rounded-full">
          <Target className="h-12 w-12 text-cyan-500" />
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="text-xl font-bold">Leaderboards & Scoring System</h3>
          <p className="text-muted-foreground">
            The global scoring system and leaderboards are currently under active development. 
            Check back soon to see where you rank!
          </p>
        </div>
      </div>
    </div>
  );
}
