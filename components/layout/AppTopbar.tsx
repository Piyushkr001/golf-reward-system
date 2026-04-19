"use client";

import { useRouter, usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/Modetoggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";

interface AppTopbarProps {
  role: "user" | "admin" | string;
}

export function AppTopbar({ role }: AppTopbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Create a display-friendly label from the pathname
  const pathParts = pathname.split('/').filter(Boolean);
  const currentSection = pathParts.length > 0 
    ? pathParts[pathParts.length - 1].replace(/-/g, ' ')
    : 'Dashboard';
  
  const displayLabel = currentSection.charAt(0).toUpperCase() + currentSection.slice(1);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (res.ok) {
        router.push("/sign-in");
        toast.success("Logged out successfully");
      } else {
        toast.error("Failed to logout");
      }
    } catch (err) {
      toast.error("An error occurred during logout");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-2" />
        <div className="flex items-center gap-2">
          {/* Subtle breadcrumb / label */}
          <span className="font-semibold text-sm hidden md:block text-muted-foreground capitalize">
            {displayLabel}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 flex-none">
        <Badge variant="outline" className="hidden sm:inline-flex capitalize">
          {role}
        </Badge>
        <ModeToggle />
        <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
          <LogOut className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </header>
  );
}
