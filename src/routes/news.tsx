import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";
import { useTable } from "@/lib/public-data";
import { EmptyState } from "@/components/empty-state";
import { SafeImage } from "@/components/safe-image";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News — KBSBB Updates from the Field" },
      { name: "description", content: "Read the latest stories, impact updates and announcements from KBSBB." },
      { property: "og:title", content: "KBSBB News" },
      { property: "og:description", content: "Stories and updates from our humanitarian work across Indonesia." },
    ],
  }),
  component: News,
});

function News() {
  const items = useTable<any>("news_posts", { filter: (q) => q.eq("is_published", true), order: { column: "published_at", ascending: false } });
  return (
    <SiteLayout>
      <PageHero eyebrow="News & Stories" title="From the field, to your feed" description="Real updates from our teams, campaigns, and communities across Indonesia." />
      <section className="container-x py-20">
        {items && items.length === 0 ? (
          <EmptyState title="No news yet" description="We haven't published any stories yet. Check back soon for updates from the field." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(items ?? []).map((n: any) => (
              <Link key={n.id} to="/news/$slug" params={{ slug: n.slug }} className="block focus:outline-none">
                <Card className="group h-full overflow-hidden rounded-3xl border-border/70 pt-0 hover:shadow-soft transition-all">
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    <SafeImage src={n.cover_url} alt={n.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <CardContent className="px-5 pb-5">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="rounded-full bg-brand-soft px-2.5 py-0.5 font-semibold text-primary">{(n.tags?.[0]) ?? "News"}</span>
                      {n.published_at && <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(n.published_at).toLocaleDateString()}</span>}
                    </div>
                    <h3 className="mt-3 text-lg font-bold leading-snug">{n.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{n.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Read more <ArrowRight className="h-4 w-4" /></span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
