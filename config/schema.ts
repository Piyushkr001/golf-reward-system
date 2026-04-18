import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const onboardingStatusEnum = pgEnum("onboarding_status", [
  "not_started",
  "in_progress",
  "completed",
]);

export const onboardingStepEnum = pgEnum("onboarding_step", [
  "user_profile",
  "user_charity_selection",
  "user_contribution_preference",
  "user_subscription_plan",
  "user_complete",
  "admin_profile",
  "admin_access_validation",
  "admin_organization_setup",
  "admin_complete",
]);

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash"),
    googleId: text("google_id"),
    role: userRoleEnum("role").notNull().default("user"),
    isVerified: boolean("is_verified").notNull().default(false),
    verificationToken: text("verification_token"),
    resetToken: text("reset_token"),
    resetTokenExpiry: timestamp("reset_token_expiry", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
  })
);

export const onboardingProfiles = pgTable("onboarding_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, {
    onDelete: "cascade",
  }),
  status: onboardingStatusEnum("status").notNull().default("not_started"),
  currentStep: onboardingStepEnum("current_step"),

  // common
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),

  // user onboarding fields
  charityId: text("charity_id"),
  contributionPercentage: integer("contribution_percentage"),
  selectedPlan: text("selected_plan"), // monthly | yearly

  // admin onboarding fields
  adminDisplayName: text("admin_display_name"),
  adminAccessCode: text("admin_access_code"),
  organizationName: text("organization_name"),
  organizationSlug: text("organization_slug"),

  completedAt: timestamp("completed_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});