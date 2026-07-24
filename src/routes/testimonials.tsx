import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero3 from "@/assets/hero-3.jpg";
import health from "@/assets/program-health.jpg";
import disaster from "@/assets/program-disaster.jpg";
import edu from "@/assets/program-education.jpg";
import food from "@/assets/program-food.jpg";

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

const Q = [
  { name: "Siti Rahmawati", role: "Volunteer, Batch 09", quote: "KBSBB gave me a family and a purpose. Every field visit reminds me why compassion matters.", img: hero3 },
  { name: "Dr. Andi Pratama", role: "Medical Partner", quote: "The mobile clinics reach patients I couldn't otherwise. This is real, deeply organized humanitarian work.", img: health },
  { name: "Ibu Marlina", role: "Beneficiary, Sumba", quote: "Our village now has clean water. My children can go to school without walking three kilometers.", img: disaster },
  { name: "Rina Kartika", role: "Corporate Partner", quote: "The most transparent NGO we work with. Impact reports are stellar and honest.", img: hero1 },
  { name: "Yusuf Ibrahim", role: "Scholarship Recipient", quote: "I'm the first in my family to reach university. KBSBB made it possible.", img: edu },
  { name: "Pak Hendra", role: "Village Head, NTT", quote: "They came, they stayed, they listened. That is rare and precious.", img: food },
];

function Testimonials() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Stories" title="Voices from the community" description="Volunteers, partners and beneficiaries — in their own words." />
      <section className="container-x py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Q.map((q) => (
            <Card key={q.name} className="rounded-3xl border-border/70 hover:shadow-soft transition-all">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/50" />
                <p className="mt-4 text-base leading-relaxed">"{q.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <img src={q.img} alt={q.name} loading="lazy" className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <div className="font-bold">{q.name}</div>
                    <div className="text-xs text-muted-foreground">{q.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
