import { Pool } from "@neondatabase/serverless";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const sqlScript = fs.readFileSync("./drizzle/0000_past_ronan.sql", "utf-8");
const statements = sqlScript.split("--> statement-breakpoint");

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

async function main() {
  for (const statement of statements) {
    if (statement.trim()) {
      console.log("Executing:", statement.trim().slice(0, 50) + "...");
      await pool.query(statement.trim());
    }
  }
  console.log("Migration complete!");
  process.exit(0);
}

main().catch(console.error);
