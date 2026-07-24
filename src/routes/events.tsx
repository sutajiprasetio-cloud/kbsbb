import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock } from "lucide-react";

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

const EVENTS = [
  { day: "18", mon: "Apr", title: "Charity Run for Clean Water", loc: "GBK Senayan, Jakarta", time: "06:00 WIB", desc: "5K/10K family run — every registration funds one water well." },
  { day: "27", mon: "Apr", title: "Free Health Camp — Bogor", loc: "Alun-alun Bogor", time: "08:00 WIB", desc: "General checkups, dental, pediatric and free medicines." },
  { day: "10", mon: "May", title: "Volunteer Onboarding Batch 12", loc: "KBSBB HQ, Jakarta", time: "10:00 WIB", desc: "Meet the team, tour our operations and get field-ready." },
  { day: "22", mon: "May", title: "Beasiswa Award Ceremony", loc: "Balai Kartini, Jakarta", time: "18:30 WIB", desc: "Celebrating our 2026 scholarship recipients." },
  { day: "05", mon: "Jun", title: "Ramadan Food Drive Kickoff", loc: "Multi-city", time: "All day", desc: "Volunteer with us to pack and distribute iftar meals." },
  { day: "19", mon: "Jun", title: "Blood Donation Drive", loc: "Grand Indonesia, Jakarta", time: "09:00 WIB", desc: "Partnered with PMI — save lives, give blood." },
];

function Events() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Events" title="Come, join us in person" description="Charity runs, health camps, volunteer meetups and more." />
      <section className="container-x py-20">
        <div className="grid gap-5 md:grid-cols-2">
          {EVENTS.map((e) => (
            <Card key={e.title} className="rounded-3xl border-border/70 hover:shadow-soft transition-all">
              <CardContent className="p-6 flex gap-5">
                <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl gradient-brand text-white">
                  <div className="text-center leading-tight">
                    <div className="text-3xl font-extrabold">{e.day}</div>
                    <div className="text-[11px] uppercase tracking-widest opacity-90">{e.mon}</div>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold leading-snug">{e.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{e.desc}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {e.loc}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {e.time}</span>
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> 2026</span>
                  </div>
                  <Button className="mt-4 rounded-full" size="sm">Register</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
