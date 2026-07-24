import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, GraduationCap, UtensilsCrossed, LifeBuoy, Droplet, Home, ArrowRight } from "lucide-react";
import edu from "@/assets/program-education.jpg";
import health from "@/assets/program-health.jpg";
import food from "@/assets/program-food.jpg";
import disaster from "@/assets/program-disaster.jpg";

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

const P = [
  { icon: Stethoscope, tag: "Health", img: health, title: "Mobile Health Clinics", desc: "Monthly free clinics with doctors, dentists, and pharmacists in remote villages. Since 2015, over 128,000 patients served." },
  { icon: GraduationCap, tag: "Education", img: edu, title: "Beasiswa Anak Bangsa", desc: "Full scholarships, learning kits and mentorship for underprivileged children from elementary to university." },
  { icon: UtensilsCrossed, tag: "Food", img: food, title: "Berbagi Nasi Berkah", desc: "Weekly hot meals, monthly staple packages and Ramadan iftar drives across major cities." },
  { icon: LifeBuoy, tag: "Disaster", img: disaster, title: "Tanggap Bencana", desc: "Rapid deployment for floods, earthquakes and volcanic eruptions. Trained response teams in 12 provinces." },
  { icon: Droplet, tag: "Water", img: disaster, title: "Air Bersih untuk Semua", desc: "Deep-well drilling and rainwater harvesting for villages without reliable water access." },
  { icon: Home, tag: "Shelter", img: edu, title: "Rumah Layak Huni", desc: "Rehabilitation and rebuilding of homes for widows, orphans and disaster-affected families." },
];

function Programs() {
  return (
    <SiteLayout>
      <PageHero eyebrow="What we do" title="Programs that change lives" description="Six pillars, one mission: to serve Indonesia's most vulnerable with dignity, transparency and love." />
      <section className="container-x py-20">
        <div className="grid gap-8 md:grid-cols-2">
          {P.map((p) => (
            <Card key={p.title} className="overflow-hidden rounded-3xl border-border/70 pt-0 hover:shadow-soft transition-all">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <CardContent className="px-6 pb-6">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-primary">
                  <p.icon className="h-3.5 w-3.5" /> {p.tag}
                </div>
                <h3 className="mt-3 text-xl font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                <Link to="/donate" className="mt-5 inline-block">
                  <Button className="rounded-full gap-2">Support this program <ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
