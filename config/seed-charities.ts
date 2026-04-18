import { db } from "@/config/db";
import { charities } from "@/config/schema";

async function seed() {
  await db.insert(charities).values([
    {
      id: crypto.randomUUID(),
      name: "Education Fund",
      slug: "education-fund",
      shortDescription: "Support access to learning opportunities and classroom resources.",
      fullDescription:
        "Education Fund helps students and communities access quality learning materials, school support initiatives, and long-term academic development opportunities.",
      imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
      websiteUrl: "https://example.org/education-fund",
      category: "education",
      featured: true,
      isActive: true,
      displayOrder: 1,
    },
    {
      id: crypto.randomUUID(),
      name: "Junior Sports Trust",
      slug: "junior-sports-trust",
      shortDescription: "Create opportunities for young athletes through coaching and equipment.",
      fullDescription:
        "Junior Sports Trust supports youth development through access to sports training, equipment, mentorship, and inclusive recreational programming.",
      imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop",
      websiteUrl: "https://example.org/junior-sports-trust",
      category: "sports",
      featured: true,
      isActive: true,
      displayOrder: 2,
    },
    {
      id: crypto.randomUUID(),
      name: "Green Course Initiative",
      slug: "green-course-initiative",
      shortDescription: "Promote sustainable recreation spaces and environmental recovery.",
      fullDescription:
        "Green Course Initiative focuses on restoring local green spaces, improving sustainability practices, and creating healthier community recreation environments.",
      imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
      websiteUrl: "https://example.org/green-course-initiative",
      category: "environment",
      featured: false,
      isActive: true,
      displayOrder: 3,
    },
  ]).onConflictDoNothing({ target: charities.slug });

  console.log("Charities seeded successfully");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});