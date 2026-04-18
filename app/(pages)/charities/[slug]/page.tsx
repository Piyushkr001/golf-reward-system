import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCharityBySlug } from "@/lib/charities";
import { ArrowLeft, ExternalLink, HeartHandshake } from "lucide-react";
import { getCurrentDbUser } from "@/lib/current-user";

export default async function CharityDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const charity = await getCharityBySlug(slug);
  const user = await getCurrentDbUser();

  if (!charity || !charity.isActive) {
    notFound();
  }

  return (
    <section className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/charities" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to Charities
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          <div className="grid items-stretch lg:grid-cols-[1.15fr_0.85fr]">
            <div className="h-[320px] w-full bg-slate-900 lg:h-full">
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

            <div className="flex flex-col p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="bg-cyan-400/10 text-cyan-300 capitalize hover:bg-cyan-400/10">
                  {charity.category}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{charity.name}</h1>
              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">{charity.fullDescription}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {user ? (
                  <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
                    <Button className="h-11 rounded-2xl bg-linear-to-r from-violet-600 to-cyan-500 px-6 text-white">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/sign-up">
                    <Button className="h-11 rounded-2xl bg-linear-to-r from-violet-600 to-cyan-500 px-6 text-white">
                      Support This Charity
                    </Button>
                  </Link>
                )}

                {charity.websiteUrl ? (
                  <a href={charity.websiteUrl} target="_blank" rel="noreferrer">
                    <Button variant="outline" className="h-11 rounded-2xl border-white/10 bg-white/5 px-6 text-slate-100">
                      Visit Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}