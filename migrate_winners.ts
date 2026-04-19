import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

async function migrateWinners() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log('Initiating tracking tables mapping Winners...');

  try {
    // 1. Types
    await sql`
      DO $$ BEGIN
        CREATE TYPE "winner_tier" AS ENUM ('5-match', '4-match', '3-match');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    
    await sql`
      DO $$ BEGIN
        CREATE TYPE "review_status" AS ENUM ('not_submitted', 'submitted', 'approved', 'rejected');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    
    await sql`
      DO $$ BEGIN
        CREATE TYPE "payout_status" AS ENUM ('pending', 'approved_for_payment', 'paid');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    // 2. Tables
    await sql`
      CREATE TABLE IF NOT EXISTS "winners" (
        "id" text PRIMARY KEY NOT NULL,
        "draw_id" text NOT NULL,
        "draw_entry_id" text NOT NULL,
        "user_id" text NOT NULL,
        "tier" "winner_tier" NOT NULL,
        "prize_amount" integer DEFAULT 0 NOT NULL,
        "review_status" "review_status" DEFAULT 'not_submitted' NOT NULL,
        "payout_status" "payout_status" DEFAULT 'pending' NOT NULL,
        "rejection_reason" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `;

    // Connect References inside "winners"
    // drawId -> draws.id (if not exists)
    // drawEntryId -> drawEntries.id
    // userId -> users.id
    await sql`
      DO $$ BEGIN
        ALTER TABLE "winners" ADD CONSTRAINT "winners_draw_id_draws_id_fk" FOREIGN KEY ("draw_id") REFERENCES "public"."draws"("id") ON DELETE cascade ON UPDATE no action;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    await sql`
      DO $$ BEGIN
        ALTER TABLE "winners" ADD CONSTRAINT "winners_draw_entry_id_draw_entries_id_fk" FOREIGN KEY ("draw_entry_id") REFERENCES "public"."draw_entries"("id") ON DELETE cascade ON UPDATE no action;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    await sql`
      DO $$ BEGIN
        ALTER TABLE "winners" ADD CONSTRAINT "winners_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS "winners_draw_entry_idx" ON "winners" ("draw_entry_id");
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "winner_proofs" (
        "id" text PRIMARY KEY NOT NULL,
        "winner_id" text NOT NULL,
        "file_url" text NOT NULL,
        "file_name" text,
        "mime_type" text,
        "submitted_at" timestamp DEFAULT now() NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `;

    await sql`
      DO $$ BEGIN
        ALTER TABLE "winner_proofs" ADD CONSTRAINT "winner_proofs_winner_id_winners_id_fk" FOREIGN KEY ("winner_id") REFERENCES "public"."winners"("id") ON DELETE cascade ON UPDATE no action;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    console.log('✅ Winner constraint map completely configured!');
  } catch (error) {
    console.error('Migration failed explicitly tracing winners:', error);
    process.exit(1);
  }
}

migrateWinners();
