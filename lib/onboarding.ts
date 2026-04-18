import { eq } from "drizzle-orm";
import { onboardingProfiles, users } from "@/config/schema";
import { db } from "@/config/db";

export type AppRole = "user" | "admin";

export async function getOrCreateOnboardingProfile(userId: string) {
  const existing = await db
    .select()
    .from(onboardingProfiles)
    .where(eq(onboardingProfiles.userId, userId))
    .limit(1);

  if (existing[0]) return existing[0];

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) throw new Error("User not found");

  const currentStep = user.role === "admin" ? ("admin_profile" as const) : ("user_profile" as const);

  const newProfile = {
    id: crypto.randomUUID(),
    userId,
    status: "in_progress" as const,
    currentStep,
  };

  await db.insert(onboardingProfiles).values(newProfile);
  return newProfile;
}

export function getNextStep(role: AppRole, currentStep?: string | null) {
  const userSteps = [
    "user_profile",
    "user_charity_selection",
    "user_contribution_preference",
    "user_subscription_plan",
    "user_complete",
  ];

  const adminSteps = [
    "admin_profile",
    "admin_access_validation",
    "admin_organization_setup",
    "admin_complete",
  ];

  const flow = role === "admin" ? adminSteps : userSteps;
  const currentIndex = currentStep ? flow.indexOf(currentStep) : 0;

  if (currentIndex === -1) return flow[0];
  if (currentIndex >= flow.length - 1) return flow[flow.length - 1];

  return flow[currentIndex + 1];
}

export function getStepRoute(role: AppRole, step?: string | null) {
  const safeStep = step || (role === "admin" ? "admin_profile" : "user_profile");

  const routes: Record<string, string> = {
    user_profile: "/onboarding/user/profile",
    user_charity_selection: "/onboarding/user/charity-selection",
    user_contribution_preference: "/onboarding/user/contribution-preference",
    user_subscription_plan: "/onboarding/user/subscription-plan",
    user_complete: "/onboarding/user/complete",

    admin_profile: "/onboarding/admin/profile",
    admin_access_validation: "/onboarding/admin/access-validation",
    admin_organization_setup: "/onboarding/admin/organization-setup",
    admin_complete: "/onboarding/admin/complete",
  };

  return routes[safeStep] || (role === "admin" ? "/onboarding/admin/profile" : "/onboarding/user/profile");
}

export function isOnboardingComplete(status?: string | null) {
  return status === "completed";
}