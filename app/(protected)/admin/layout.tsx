import { ReactNode } from "react";
import { ProtectedShell } from "@/components/layout/ProtectedShell";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ProtectedShell>{children}</ProtectedShell>;
}
