import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentDbUser } from "@/lib/current-user";
import { getOrCreateOnboardingProfile, isOnboardingComplete } from "@/lib/onboarding";

export default async function DashboardProtractorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentDbUser();

  // 1. Kick out unauthenticated users
  if (!user) {
    redirect("/sign-in");
  }

  // 2. Fetch Onboarding Profile
  const profile = await getOrCreateOnboardingProfile(user.id);

  // 3. Kick out incomplete profiles directly into the onboarding ecosystem
  if (!isOnboardingComplete(profile.status)) {
    if (user.role === "admin") {
      redirect("/onboarding/admin");
    } else {
      redirect("/onboarding/user");
    }
  }

  // 4. Onboarding is fully verified; allow unhindered passage
  return <>{children}</>;
}
