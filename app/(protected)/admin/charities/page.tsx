import { redirect } from "next/navigation";
import { getCurrentDbUser } from "@/lib/current-user";
import { getAllCharitiesForAdmin } from "@/lib/charities";
import { Card, CardContent } from "@/components/ui/card";
import { CharityAdminManager } from "./_components/CharityAdminManager";

export default async function AdminCharitiesPage() {
  const user = await getCurrentDbUser();

  if (!user) redirect("/admin/login");
  if (user.role !== "admin") redirect("/dashboard");

  const charityList = await getAllCharitiesForAdmin();

  return (
    <section className="flex-1 w-full flex flex-col relative overflow-hidden">
      {/* Decorative background elements that work in both themes */}
      <div className="absolute top-0 w-full h-[30vh] bg-linear-to-b from-primary/10 to-transparent -z-10 pointer-events-none" />
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">Manage Charities</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            Create, update, feature, and deactivate charities that subscribers can choose during onboarding and throughout the platform.
          </p>
        </div>

        <Card className="border-border bg-card/40 shadow-xl backdrop-blur-2xl">
          <CardContent className="p-6">
            <CharityAdminManager initialCharities={charityList} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}