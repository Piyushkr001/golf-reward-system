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
    <section className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-7xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Manage Charities</h1>
          <p className="max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            Create, update, feature, and deactivate charities that subscribers can choose during onboarding and throughout the platform.
          </p>
        </div>

        <Card className="border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          <CardContent className="p-6">
            <CharityAdminManager initialCharities={charityList} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}