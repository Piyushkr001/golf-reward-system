"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Target,
  ShieldAlert,
  HeartHandshake,
  Gift,
  Award,
  LineChart
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

// Define navigation configuration arrays
const userRoutes = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Billing",
    url: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    title: "Scores",
    url: "/dashboard/scores",
    icon: Target,
  },
  {
    title: "Draws",
    url: "/dashboard/draws",
    icon: Gift,
  },
  {
    title: "My Winnings",
    url: "/dashboard/winnings",
    icon: Award,
  },
];

const adminRoutes = [
  {
    title: "Admin Panel",
    url: "/admin",
    icon: ShieldAlert,
  },
  {
    title: "Charities",
    url: "/admin/charities",
    icon: HeartHandshake,
  },
  {
    title: "Draw Simulator",
    url: "/admin/draws",
    icon: Gift,
  },
  {
    title: "Winners & Payouts",
    url: "/admin/winners",
    icon: Award,
  },
  {
    title: "Reports & Analytics",
    url: "/admin/reports",
    icon: LineChart,
  },
];

interface AppSidebarProps {
  role: "user" | "admin" | string;
}

export function AppSidebar({ role }: AppSidebarProps) {
  const pathname = usePathname();

  // Determine which routes to show based on context. 
  // If we are deep in /admin, we can forcefully show admin routes
  // (to allow admins to view both user/admin dashboard contexts if they switch)
  // For now, let's use the current base path or role to determine rendering.
  const isAdminView = pathname.startsWith("/admin");
  const routes = isAdminView || role === "admin" && pathname.startsWith("/admin") ? adminRoutes : userRoutes;

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="p-4 flex flex-row items-center justify-between border-b border-sidebar-border">
        <Link href="/">
        <Image src="/Images/Logo/logo.svg" alt="PlayLance"
            width={160}
            height={48}
            className="dark:invert w-auto h-18"
            priority
            />
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {isAdminView ? "Admin Access" : "My Account"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((route) => {
                // Determine if this nested route is specifically active
                // e.g. /dashboard/billing should highlight "Billing" but not "Dashboard"
                const isActive = pathname === route.url;
                
                return (
                  <SidebarMenuItem key={route.title}>
                    <SidebarMenuButton 
                      render={<Link href={route.url} />}
                      isActive={isActive} 
                      tooltip={route.title}
                    >
                      <route.icon className="h-4 w-4" />
                      <span>{route.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
