import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Award, Users, Sprout } from "lucide-react";
import hero3 from "@/assets/hero-3.jpg";
import hero1 from "@/assets/hero-1.jpg";
import { useSingleton, useTable } from "@/lib/public-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About KBSBB — Our Mission & Story" },
      { name: "description", content: "Meet the people behind KBSBB — an Indonesian humanitarian foundation dedicated to sharing health and blessings across 34 provinces." },
      { property: "og:title", content: "About KBSBB" },
      { property: "og:description", content: "Our mission, values, and story." },
    ],
  }),
  component: About,
});

const VALUES = [
  { icon: Heart, title: "Compassion", text: "We serve with empathy — every beneficiary is family." },
  { icon: Award, title: "Integrity", text: "100% transparent, audited annually, every rupiah accounted for." },
  { icon: Users, title: "Community", text: "Local leaders, local solutions, sustainable impact." },
  { icon: Sprout, title: "Sustainability", text: "Long-term programs that outlast the aid cycle." },
];

function About() {
  const about = useSingleton<any>("about_content", 1);
  const team = useTable<any>("team_members", { filter: (q) => q.eq("is_active", true), order: { column: "sort_order", ascending: true } });

  const headline = about?.headline ?? "Sharing health. Sharing blessings.";
  const intro = about?.intro ?? "Since 2011, KBSBB has served alongside communities from Aceh to Papua — one village, one meal, one life at a time.";
  const story = about?.story ?? "KBSBB — Komunitas Berbagi Sehat Berbagi Berkah — started in 2011 with a handful of friends distributing hot meals every Friday in Jakarta. Today, we are 3,400+ volunteers across 34 provinces, running four national programs and dozens of local initiatives.\n\nWe stay small in overhead and big in heart. Every donation is tracked, audited and reported publicly. Our promise: 100% of your gift reaches the field.";
  const vision = about?.vision ?? "An Indonesia where every family has access to health, education and hope.";
  const mission = about?.mission ?? "Deliver dignified humanitarian aid to Indonesia's most underserved communities.";

  const teamItems = team && team.length > 0 ? team : [
    { name: "H. Bambang Wijaya", role: "Founder & Chairman", photo_url: hero3 },
    { name: "Dr. Rina Kusuma", role: "Executive Director", photo_url: hero1 },
    { name: "Ahmad Fadli", role: "Head of Programs", photo_url: hero3 },
    { name: "Siti Nur Aisyah", role: "Head of Volunteers", photo_url: hero1 },
  ];

  return (
    <SiteLayout>
      <PageHero eyebrow="About Us" title={headline} description={intro} />
      <section className="container-x py-20 grid lg:grid-cols-2 gap-12 items-center">
        <img src={about?.image_url ?? hero1} alt="Community" className="rounded-3xl object-cover w-full aspect-[4/3] shadow-soft" loading="lazy" />
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Our story</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-line">{story}</p>
        </div>
      </section>
      <section className="container-x py-8 grid md:grid-cols-2 gap-6">
        <Card className="rounded-3xl border-border/70">
          <CardContent className="p-8">
            <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-brand text-white"><Target className="h-5 w-5" /></div>
            <h3 className="mt-4 text-2xl font-extrabold">Mission</h3>
            <p className="mt-2 text-muted-foreground whitespace-pre-line">{mission}</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-border/70">
          <CardContent className="p-8">
            <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-brand text-white"><Eye className="h-5 w-5" /></div>
            <h3 className="mt-4 text-2xl font-extrabold">Vision</h3>
            <p className="mt-2 text-muted-foreground whitespace-pre-line">{vision}</p>
          </CardContent>
        </Card>
      </section>
      <section className="container-x py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((v) => (
            <Card key={v.title} className="rounded-3xl border-border/70 hover:shadow-soft transition-all">
              <CardContent className="p-6">
                <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-brand text-white"><v.icon className="h-5 w-5" /></div>
                <h3 className="mt-4 text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="container-x py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center">Leadership</h2>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-5">
          {teamItems.map((t: any) => (
            <div key={t.id ?? t.name} className="text-center">
              <img src={t.photo_url ?? hero1} alt={t.name} loading="lazy" className="mx-auto aspect-square w-full rounded-3xl object-cover" />
              <div className="mt-3 font-bold">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role}</div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
