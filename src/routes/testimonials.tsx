import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { useTable } from "@/lib/public-data";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Stories — Voices from the KBSBB Community" },
      { name: "description", content: "Read testimonials from KBSBB volunteers, medical partners and beneficiaries across Indonesia." },
      { property: "og:title", content: "KBSBB Stories" },
      { property: "og:description", content: "Real voices from the field." },
    ],
  }),
  component: Testimonials,
});

function Testimonials() {
  const items = useTable<any>("testimonials", { filter: (q) => q.eq("is_active", true), order: { column: "sort_order", ascending: true } });
  return (
    <SiteLayout>
      <PageHero eyebrow="Stories" title="Voices from the community" description="Volunteers, partners and beneficiaries — in their own words." />
      <section className="container-x py-20">
        {items && items.length === 0 ? (
          <EmptyState title="No stories yet" description="Testimonials from our community will appear here soon." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(items ?? []).map((q: any) => (
              <Card key={q.id} className="rounded-3xl border-border/70 hover:shadow-soft transition-all">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-primary/50" />
                  <p className="mt-4 text-base leading-relaxed">"{q.quote}"</p>
                  <div className="mt-6 flex items-center gap-3">
                    {q.avatar_url && <img src={q.avatar_url} alt={q.name} loading="lazy" className="h-12 w-12 rounded-full object-cover" />}
                    <div>
                      <div className="font-bold">{q.name}</div>
                      <div className="text-xs text-muted-foreground">{q.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
