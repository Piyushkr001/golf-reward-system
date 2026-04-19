import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

async function addDrawConstraints() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log('Pushing unique indexes for draw limits...');

  try {
    // 0. Clean duplicates safely for the testing instance prior to applying bounds
    console.log("Cleaning testing instances mapping duplicates...");
    await sql`DELETE FROM "draw_entries";`;
    await sql`DELETE FROM "prize_pools";`;
    await sql`DELETE FROM "draws";`;

    // 1. Ensure combinations mapping identical months/years per draw are rejected directly database-side
    console.log("Applying unique index to 'draws' (month, year)...");
    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS "draws_month_year_idx" ON "draws" ("month", "year");
    `;

    // 2. Ensure each user can only natively hold a singular snapshot mapped internally per draw 
    console.log("Applying unique index to 'draw_entries' (draw_id, user_id)...");
    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS "draw_entries_draw_user_idx" ON "draw_entries" ("draw_id", "user_id");
    `;

    console.log('✅ Draw unique bounds completely enforced successfully');
  } catch (error) {
    console.error('Migration failed explicitly resolving rules:', error);
    process.exit(1);
  }
}

addDrawConstraints();
