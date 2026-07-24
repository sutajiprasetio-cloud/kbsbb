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

const ITEMS = [
  { date: "12 Mar 2026", cat: "Health", title: "300 families receive free vision screening in Bandung", excerpt: "Our mobile clinic served rural districts with eye exams and free glasses.", img: health },
  { date: "04 Mar 2026", cat: "Education", title: "New scholarship batch opens for 150 students in NTT", excerpt: "Applications are now open until end of April.", img: edu },
  { date: "22 Feb 2026", cat: "Food", title: "Ramadan meal drive delivers 40,000 iftar packages", excerpt: "Volunteers across 18 cities joined the largest drive to date.", img: food },
  { date: "10 Feb 2026", cat: "Disaster", title: "Flood response team deployed to Demak", excerpt: "Rescue and relief operations continue with local partners.", img: disaster },
  { date: "28 Jan 2026", cat: "Community", title: "Volunteer Batch 12 onboarding concludes", excerpt: "220 new volunteers ready for the field this quarter.", img: hero3 },
  { date: "14 Jan 2026", cat: "Health", title: "New maternal care unit opens in Kupang", excerpt: "Bringing safe childbirth support closer to rural mothers.", img: hero1 },
];

function News() {
  return (
    <SiteLayout>
      <PageHero eyebrow="News & Stories" title="From the field, to your feed" description="Real updates from our teams, campaigns, and communities across Indonesia." />
      <section className="container-x py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((n) => (
            <Card key={n.title} className="group overflow-hidden rounded-3xl border-border/70 pt-0 hover:shadow-soft transition-all">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={n.img} alt={n.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <CardContent className="px-5 pb-5">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded-full bg-brand-soft px-2.5 py-0.5 font-semibold text-primary">{n.cat}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {n.date}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold leading-snug">{n.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{n.excerpt}</p>
                <a href="#" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Read more <ArrowRight className="h-4 w-4" /></a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
