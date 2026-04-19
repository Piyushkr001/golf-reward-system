import { Pool } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

const statements = [
`CREATE TYPE "public"."draw_logic_type" AS ENUM('random', 'algorithmic');`,
`CREATE TYPE "public"."draw_status" AS ENUM('draft', 'simulated', 'published');`,
`CREATE TABLE "draws" (
	"id" text PRIMARY KEY NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"logic_type" "draw_logic_type" NOT NULL,
	"status" "draw_status" DEFAULT 'draft' NOT NULL,
	"winning_numbers" json,
	"rollover_amount" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp
);`,
`CREATE TABLE "draw_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"draw_id" text NOT NULL,
	"user_id" text NOT NULL,
	"entry_numbers" json NOT NULL,
	"match_count" integer,
	"is_winner" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);`,
`CREATE TABLE "prize_pools" (
	"id" text PRIMARY KEY NOT NULL,
	"draw_id" text NOT NULL,
	"total_pool" integer DEFAULT 0 NOT NULL,
	"five_match_pool" integer DEFAULT 0 NOT NULL,
	"four_match_pool" integer DEFAULT 0 NOT NULL,
	"three_match_pool" integer DEFAULT 0 NOT NULL,
	"rollover_into_next" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);`,
`ALTER TABLE "draw_entries" ADD CONSTRAINT "draw_entries_draw_id_draws_id_fk" FOREIGN KEY ("draw_id") REFERENCES "public"."draws"("id") ON DELETE cascade ON UPDATE no action;`,
`ALTER TABLE "draw_entries" ADD CONSTRAINT "draw_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;`,
`ALTER TABLE "prize_pools" ADD CONSTRAINT "prize_pools_draw_id_draws_id_fk" FOREIGN KEY ("draw_id") REFERENCES "public"."draws"("id") ON DELETE cascade ON UPDATE no action;`
];

async function main() {
  for (const statement of statements) {
    if (statement.trim()) {
      console.log("Executing:", statement.trim().slice(0, 50) + "...");
      try {
        await pool.query(statement.trim());
      } catch (e: any) {
        console.log("Ignored or Failed:", e.message);
      }
    }
  }
  console.log("Migration complete!");
  process.exit(0);
}

main().catch(console.error);
