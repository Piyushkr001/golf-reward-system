import { AdminDrawManager } from "./_components/AdminDrawManager";

export default function AdminDrawsPage() {
  return (
    <div className="flex-1 w-full flex flex-col relative text-foreground">
      {/* Decorative background elements */}
      <div className="absolute top-0 w-full h-[30vh] bg-linear-to-b from-primary/10 to-transparent -z-10 pointer-events-none" />
      
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Draw Engine Terminal</h2>
          <p className="text-muted-foreground max-w-2xl mt-2">
            Configure draw parameters, run simulations, and safely publish finalized draws here.
          </p>
        </div>
        
        <AdminDrawManager />
      </div>
    </div>
  );
}
