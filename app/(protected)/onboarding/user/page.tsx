import { redirect } from "next/navigation";
import { getCurrentDbUser } from "@/lib/current-user";
import { getOrCreateOnboardingProfile, getStepRoute, isOnboardingComplete } from "@/lib/onboarding";

export default async function UserOnboardingEntryPage() {
  const user = await getCurrentDbUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "user") redirect("/onboarding/admin");

  const profile = await getOrCreateOnboardingProfile(user.id);
  
  if (isOnboardingComplete(profile.status)) {
    redirect("/dashboard");
  }

  redirect(getStepRoute("user", profile.currentStep));
}