import { redirect } from "next/navigation";
import { getCurrentDbUser } from "@/lib/current-user";
import { getOrCreateOnboardingProfile, getStepRoute } from "@/lib/onboarding";

export default async function AdminOnboardingEntryPage() {
  const user = await getCurrentDbUser();
  if (!user) redirect("/admin/login");
  if (user.role !== "admin") redirect("/onboarding/user");

  const profile = await getOrCreateOnboardingProfile(user.id);
  redirect(getStepRoute("admin", profile.currentStep));
}