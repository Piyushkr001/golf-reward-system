import { UserDrawView } from "./_components/UserDrawView";

export default function DrawsPage() {
  return (
    <div className="flex-1 w-full flex flex-col relative text-foreground">
      {/* Decorative background elements */}
      <div className="absolute top-0 w-full h-[30vh] bg-linear-to-b from-primary/10 to-transparent -z-10 pointer-events-none" />
      
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Rewards & Draws</h2>
          <p className="text-muted-foreground max-w-2xl mt-2 text-sm leading-6">
            If you are an active subscriber and have logged 5 valid scores, you are automatically entered into the monthly draw.
          </p>
        </div>
        
        <UserDrawView />
      </div>
    </div>
  );
}
