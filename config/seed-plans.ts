import "dotenv/config";
import { db } from "./db";
import { subscriptionPlans } from "./schema";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Seeding subscription plans...");
  
  const plans = [
    {
      id: "plan_monthly_01",
      name: "Monthly Plan",
      slug: "monthly",
      interval: "monthly" as const,
      price: 1900, // $19.00 represented in cents, but schema doesn't care, we just print UI price
      currency: "USD",
      isActive: true,
    },
    {
      id: "plan_yearly_01",
      name: "Yearly Plan",
      slug: "yearly",
      interval: "yearly" as const,
      price: 19000,
      currency: "USD",
      isActive: true,
    },
  ];

  for (const plan of plans) {
    await db.insert(subscriptionPlans)
      .values(plan)
      .onConflictDoUpdate({
        target: subscriptionPlans.slug,
        set: {
          name: plan.name,
          price: plan.price,
          isActive: plan.isActive,
          updatedAt: new Date(),
        }
      });
  }

  console.log("Plans seeded successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error seeding plans:", err);
  process.exit(1);
});
