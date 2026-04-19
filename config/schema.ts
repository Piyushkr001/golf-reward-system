import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  integer,
  uniqueIndex,
  date,
  json,
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

export const drawLogicTypeEnum = pgEnum("draw_logic_type", ["random", "algorithmic"]);
export const drawStatusEnum = pgEnum("draw_status", ["draft", "simulated", "published"]);

export const draws = pgTable(
  "draws",
  {
    id: text("id").primaryKey(),
    month: integer("month").notNull(),
    year: integer("year").notNull(),
    logicType: drawLogicTypeEnum("logic_type").notNull(),
    status: drawStatusEnum("status").notNull().default("draft"),
    winningNumbers: json("winning_numbers").$type<number[]>(),
    rolloverAmount: integer("rollover_amount").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
    publishedAt: timestamp("published_at", { mode: "date" }),
  },
  (table) => ({
    drawsMonthYearIdx: uniqueIndex("draws_month_year_idx").on(table.month, table.year),
  })
);

export const drawEntries = pgTable(
  "draw_entries",
  {
    id: text("id").primaryKey(),
    drawId: text("draw_id").notNull().references(() => draws.id, {
      onDelete: "cascade",
    }),
    userId: text("user_id").notNull().references(() => users.id, {
      onDelete: "cascade",
    }),
    entryNumbers: json("entry_numbers").$type<number[]>().notNull(),
    matchCount: integer("match_count"),
    isWinner: boolean("is_winner").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    drawEntriesDrawUserIdx: uniqueIndex("draw_entries_draw_user_idx").on(table.drawId, table.userId),
  })
);

export const prizePools = pgTable("prize_pools", {
  id: text("id").primaryKey(),
  drawId: text("draw_id").notNull().references(() => draws.id, {
    onDelete: "cascade",
  }),
  totalPool: integer("total_pool").notNull().default(0),
  fiveMatchPool: integer("five_match_pool").notNull().default(0),
  fourMatchPool: integer("four_match_pool").notNull().default(0),
  threeMatchPool: integer("three_match_pool").notNull().default(0),
  rolloverIntoNext: integer("rollover_into_next").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});