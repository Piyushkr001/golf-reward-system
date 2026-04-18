import "dotenv/config";
import { db } from "./db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Running manual migration for subscription tables...");

  const queries = [
    `CREATE TYPE "public"."billing_event_type" AS ENUM('charge', 'refund', 'invoice_created');`,
    `CREATE TYPE "public"."subscription_interval" AS ENUM('monthly', 'yearly');`,
    `CREATE TYPE "public"."subscription_status" AS ENUM('active', 'inactive', 'canceled', 'past_due');`,
    `CREATE TABLE "subscription_plans" (
      "id" text PRIMARY KEY NOT NULL,
      "name" text NOT NULL,
      "slug" text NOT NULL,
      "interval" "subscription_interval" NOT NULL,
      "price" integer NOT NULL,
      "currency" text DEFAULT 'USD' NOT NULL,
      "is_active" boolean DEFAULT true NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );`,
    `CREATE TABLE "subscriptions" (
      "id" text PRIMARY KEY NOT NULL,
      "user_id" text NOT NULL,
      "plan_id" text NOT NULL,
      "status" "subscription_status" DEFAULT 'inactive' NOT NULL,
      "provider" text DEFAULT 'internal' NOT NULL,
      "provider_subscription_id" text,
      "started_at" timestamp NOT NULL,
      "renewal_date" timestamp,
      "canceled_at" timestamp,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );`,
    `CREATE TABLE "billing_events" (
      "id" text PRIMARY KEY NOT NULL,
      "subscription_id" text NOT NULL,
      "event_type" "billing_event_type" NOT NULL,
      "amount" integer NOT NULL,
      "currency" text DEFAULT 'USD' NOT NULL,
      "provider_event_id" text,
      "created_at" timestamp DEFAULT now() NOT NULL
    );`,
    `ALTER TABLE "billing_events" ADD CONSTRAINT "billing_events_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;`,
    `ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;`,
    `ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE no action ON UPDATE no action;`,
    `CREATE UNIQUE INDEX "subscription_plans_slug_idx" ON "subscription_plans" USING btree ("slug");`,
  ];

  for (const query of queries) {
    try {
      await db.execute(sql.raw(query));
      console.log(`Executed: ${query.substring(0, 50)}...`);
    } catch (err: any) {
      if (err.message && err.message.includes("already exists")) {
        console.log(`Already exists, skipping: ${query.substring(0, 30)}...`);
      } else {
        console.error(`Error executing query: ${query}`, err);
        throw err;
      }
    }
  }

  console.log("Migration completed.");
}

main().catch(console.error);
