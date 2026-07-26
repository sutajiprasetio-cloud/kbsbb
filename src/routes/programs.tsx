import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, GraduationCap, UtensilsCrossed, LifeBuoy, Droplet, Home, ArrowRight, HandHeart } from "lucide-react";
import { useTable } from "@/lib/public-data";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — KBSBB Humanitarian Foundation" },
      { name: "description", content: "Explore KBSBB's humanitarian programs across health, education, food security, disaster relief, water and shelter." },
      { property: "og:title", content: "KBSBB Programs" },
      { property: "og:description", content: "Six pillars of humanitarian action across Indonesia." },
    ],
  }),
  component: Programs,
});

const ICONS: Record<string, any> = { Stethoscope, GraduationCap, UtensilsCrossed, LifeBuoy, Droplet, Home, HandHeart };

function Programs() {
  const items = useTable<any>("programs", { filter: (q) => q.eq("is_active", true), order: { column: "sort_order", ascending: true } });
  return (
    <SiteLayout>
      <PageHero eyebrow="What we do" title="Programs that change lives" description="One mission: to serve Indonesia's most vulnerable with dignity, transparency and love." />
      <section className="container-x py-20">
        {items && items.length === 0 ? (
          <EmptyState title="No programs published yet" description="Our program list is being updated. Please check back shortly." />
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {(items ?? []).map((p: any) => {
              const Icon = ICONS[p.icon] ?? HandHeart;
              return (
                <Card key={p.id} className="overflow-hidden rounded-3xl border-border/70 pt-0 hover:shadow-soft transition-all">
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    {p.image_url && <img src={p.image_url} alt={p.title} loading="lazy" className="h-full w-full object-cover" />}
                  </div>
                  <CardContent className="px-6 pb-6">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-primary">
                      <Icon className="h-3.5 w-3.5" /> {p.tag ?? p.slug ?? "Program"}
                    </div>
                    <h3 className="mt-3 text-xl font-bold">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.summary ?? p.description}</p>
                    <Link to="/donate" className="mt-5 inline-block">
                      <Button className="rounded-full gap-2">Support this program <ArrowRight className="h-4 w-4" /></Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
