import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";
import edu from "@/assets/program-education.jpg";
import health from "@/assets/program-health.jpg";
import food from "@/assets/program-food.jpg";
import disaster from "@/assets/program-disaster.jpg";
import hero1 from "@/assets/hero-1.jpg";
import hero3 from "@/assets/hero-3.jpg";
import { useTable } from "@/lib/public-data";

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

const FALLBACK = [
  { published_at: "2026-03-12", tags: ["Health"], title: "300 families receive free vision screening in Bandung", excerpt: "Our mobile clinic served rural districts with eye exams and free glasses.", cover_url: health },
  { published_at: "2026-03-04", tags: ["Education"], title: "New scholarship batch opens for 150 students in NTT", excerpt: "Applications are now open until end of April.", cover_url: edu },
  { published_at: "2026-02-22", tags: ["Food"], title: "Ramadan meal drive delivers 40,000 iftar packages", excerpt: "Volunteers across 18 cities joined the largest drive to date.", cover_url: food },
  { published_at: "2026-02-10", tags: ["Disaster"], title: "Flood response team deployed to Demak", excerpt: "Rescue and relief operations continue with local partners.", cover_url: disaster },
  { published_at: "2026-01-28", tags: ["Community"], title: "Volunteer Batch 12 onboarding concludes", excerpt: "220 new volunteers ready for the field this quarter.", cover_url: hero3 },
  { published_at: "2026-01-14", tags: ["Health"], title: "New maternal care unit opens in Kupang", excerpt: "Bringing safe childbirth support closer to rural mothers.", cover_url: hero1 },
];

function News() {
  const data = useTable<any>("news_posts", { filter: (q) => q.eq("is_published", true), order: { column: "published_at", ascending: false } });
  const items = data && data.length > 0 ? data : FALLBACK;
  return (
    <SiteLayout>
      <PageHero eyebrow="News & Stories" title="From the field, to your feed" description="Real updates from our teams, campaigns, and communities across Indonesia." />
      <section className="container-x py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((n: any) => (
            <Card key={n.id ?? n.title} className="group overflow-hidden rounded-3xl border-border/70 pt-0 hover:shadow-soft transition-all">
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                {n.cover_url && <img src={n.cover_url} alt={n.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
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
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
