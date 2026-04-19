import { ScoreManager } from "./_components/ScoreManager";

export default function ScoresPage() {
  return (
    <div className="flex-1 w-full flex flex-col relative">
      <div className="absolute top-0 w-full h-[25vh] bg-linear-to-b from-primary/10 to-transparent -z-10 pointer-events-none" />
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">My Scores</h2>
        </div>
        
        <ScoreManager />
      </div>
    </div>
  );
}
