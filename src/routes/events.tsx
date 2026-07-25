import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock } from "lucide-react";
import { useTable } from "@/lib/public-data";

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

const FALLBACK = [
  { starts_at: "2026-04-18T06:00:00Z", title: "Charity Run for Clean Water", location: "GBK Senayan, Jakarta", description: "5K/10K family run — every registration funds one water well." },
  { starts_at: "2026-04-27T08:00:00Z", title: "Free Health Camp — Bogor", location: "Alun-alun Bogor", description: "General checkups, dental, pediatric and free medicines." },
  { starts_at: "2026-05-10T10:00:00Z", title: "Volunteer Onboarding Batch 12", location: "KBSBB HQ, Jakarta", description: "Meet the team, tour our operations and get field-ready." },
  { starts_at: "2026-05-22T18:30:00Z", title: "Beasiswa Award Ceremony", location: "Balai Kartini, Jakarta", description: "Celebrating our 2026 scholarship recipients." },
];

function Events() {
  const data = useTable<any>("events", { filter: (q) => q.eq("is_published", true), order: { column: "starts_at", ascending: true } });
  const items = data && data.length > 0 ? data : FALLBACK;
  return (
    <SiteLayout>
      <PageHero eyebrow="Events" title="Come, join us in person" description="Charity runs, health camps, volunteer meetups and more." />
      <section className="container-x py-20">
        <div className="grid gap-5 md:grid-cols-2">
          {items.map((e: any) => {
            const d = new Date(e.starts_at);
            return (
              <Card key={e.id ?? e.title} className="rounded-3xl border-border/70 hover:shadow-soft transition-all">
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
      </section>
    </SiteLayout>
  );
}
