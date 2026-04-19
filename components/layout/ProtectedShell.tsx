import { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppTopbar } from "./AppTopbar";
import { getCurrentDbUser } from "@/lib/current-user";
import { redirect } from "next/navigation";

interface ProtectedShellProps {
  children: ReactNode;
}

export async function ProtectedShell({ children }: ProtectedShellProps) {
  const user = await getCurrentDbUser();

  // Fail-safe logic if the protected route gets hit without a session
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <SidebarProvider>
      <AppSidebar role={user.role} />
      <SidebarInset className="bg-muted/10 min-h-screen">
        <AppTopbar role={user.role} />
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
