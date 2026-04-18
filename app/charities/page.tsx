import Link from "next/link";
import { getActiveCharities } from "@/lib/charities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, HeartHandshake } from "lucide-react";

export default async function CharitiesPage() {
  const charityList = await getActiveCharities();

  return (
    <section className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-7xl flex-col px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-5 text-center">
          <div className="mx-auto inline-flex rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Explore Our Charities</h1>
          <p className="mx-auto max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Playlance is built around participation with purpose. Discover the organizations you can support through your subscription journey.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {charityList.map((charity) => (
            <Card key={charity.id} className="overflow-hidden border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/10">
              <div className="h-52 w-full overflow-hidden bg-slate-900">
                {charity.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={charity.imageUrl}
                    alt={charity.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-500">No Image</div>
                )}
              </div>

              <CardContent className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-white">{charity.name}</h2>
                  <Badge variant="secondary" className="bg-cyan-400/10 text-cyan-300 capitalize hover:bg-cyan-400/10">
                    {charity.category}
                  </Badge>
                </div>

                <p className="mb-6 text-sm leading-6 text-slate-300">{charity.shortDescription}</p>

                <div className="mt-auto flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-400">
                    {charity.featured ? "Featured cause" : "Active cause"}
                  </span>
                  <Link
                    href={`/charities/${charity.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-200"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}