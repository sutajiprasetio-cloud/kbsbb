import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock } from "lucide-react";
import { useTable } from "@/lib/public-data";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — KBSBB Community Gatherings" },
      { name: "description", content: "Join upcoming KBSBB charity runs, health camps, volunteer onboardings and community events." },
      { property: "og:title", content: "KBSBB Events" },
      { property: "og:description", content: "Come together for the mission." },
    ],
  }),
  component: Events,
});

function Events() {
  const items = useTable<any>("events", { filter: (q) => q.eq("is_published", true), order: { column: "starts_at", ascending: false } });
  return (
    <SiteLayout>
      <PageHero eyebrow="Events" title="Come, join us in person" description="Charity runs, health camps, volunteer meetups and more." />
      <section className="container-x py-20">
        {items && items.length === 0 ? (
          <EmptyState title="No events scheduled" description="There are no published events right now. Follow us to hear about the next gathering." />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {(items ?? []).map((e: any) => {
              const d = new Date(e.starts_at);
              return (
                <Card key={e.id} className="rounded-3xl border-border/70 hover:shadow-soft transition-all">
                  <CardContent className="p-6 flex gap-5">
                    <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl gradient-brand text-white">
                      <div className="text-center leading-tight">
                        <div className="text-3xl font-extrabold">{d.getDate().toString().padStart(2, "0")}</div>
                        <div className="text-[11px] uppercase tracking-widest opacity-90">{d.toLocaleString("en", { month: "short" })}</div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold leading-snug">{e.title}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground">{e.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        {e.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {e.location}</span>}
                        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} WIB</span>
                        <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {d.getFullYear()}</span>
                      </div>
                      {e.cta_href && <a href={e.cta_href} target="_blank" rel="noreferrer"><Button className="mt-4 rounded-full" size="sm">Register</Button></a>}
                    </div>
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
