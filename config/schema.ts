import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  integer,
  uniqueIndex,
  date,
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

export const charityCategoryEnum = pgEnum("charity_category", [
  "education",
  "sports",
  "health",
  "environment",
  "community",
  "other",
]);

export const subscriptionIntervalEnum = pgEnum("subscription_interval", [
  "monthly",
  "yearly",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "inactive",
  "canceled",
  "past_due",
]);

export const billingEventTypeEnum = pgEnum("billing_event_type", [
  "charge",
  "refund",
  "invoice_created",
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


export const charities = pgTable(
  "charities",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    shortDescription: text("short_description").notNull(),
    fullDescription: text("full_description").notNull(),
    imageUrl: text("image_url"),
    websiteUrl: text("website_url"),
    category: charityCategoryEnum("category").notNull().default("other"),
    featured: boolean("featured").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex("charities_slug_idx").on(table.slug),
  })
);

export const subscriptionPlans = pgTable(
  "subscription_plans",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    interval: subscriptionIntervalEnum("interval").notNull(),
    price: integer("price").notNull(), // using integer for cents or whole numbers
    currency: text("currency").notNull().default("USD"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex("subscription_plans_slug_idx").on(table.slug),
  })
);

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, {
    onDelete: "cascade",
  }),
  planId: text("plan_id").notNull().references(() => subscriptionPlans.id),
  status: subscriptionStatusEnum("status").notNull().default("inactive"),
  provider: text("provider").notNull().default("internal"),
  providerSubscriptionId: text("provider_subscription_id"),
  startedAt: timestamp("started_at", { mode: "date" }).notNull(),
  renewalDate: timestamp("renewal_date", { mode: "date" }),
  canceledAt: timestamp("canceled_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const billingEvents = pgTable("billing_events", {
  id: text("id").primaryKey(),
  subscriptionId: text("subscription_id").notNull().references(() => subscriptions.id, {
    onDelete: "cascade",
  }),
  eventType: billingEventTypeEnum("event_type").notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  providerEventId: text("provider_event_id"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const golfScores = pgTable(
  "golf_scores",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, {
      onDelete: "cascade",
    }),
    score: integer("score").notNull(),
    scoreDate: date("score_date", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    userDateUniqueIdx: uniqueIndex("golf_scores_user_date_idx").on(table.userId, table.scoreDate),
  })
);