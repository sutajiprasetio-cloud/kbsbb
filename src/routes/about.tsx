import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Award, Users, Sprout } from "lucide-react";
import { useSingleton, useTable } from "@/lib/public-data";
import { SafeImage } from "@/components/safe-image";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Tentang KBSBB — Visi, Misi & Kisah Kami" },
      { name: "description", content: "Kenali orang-orang di balik KBSBB — yayasan kemanusiaan Indonesia yang berbagi sehat dan berkah di 34 provinsi." },
      { property: "og:title", content: "Tentang KBSBB" },
      { property: "og:description", content: "Misi, nilai, dan kisah perjalanan kami." },
    ],
  }),
  component: About,
});

const VALUES = [
  { icon: Heart, title: "Kepedulian", text: "Kami hadir dengan kepedulian dan kasih sayang untuk membantu masyarakat yang membutuhkan tanpa membedakan latar belakang." },
  { icon: Award, title: "Kebersamaan", text: "Kebaikan akan lebih bermakna ketika dilakukan bersama. Kami mengajak masyarakat, relawan, dan mitra untuk tumbuh dalam semangat gotong royong." },
  { icon: Users, title: "Pelayanan", text: "Melalui program kesehatan, sosial, pendidikan, dakwah dan kemanusiaan, kami memberikan pelayanan yang bermanfaat dan tepat sasaran." },
  { icon: Sprout, title: "Keberkahan", text: "Setiap program dirancang untuk menghadirkan manfaat yang berkelanjutan, sehingga kebaikan yang diberikan dapat terus dirasakan oleh masyarakat yang membutuhkan." },
];

function About() {
  const about = useSingleton<any>("about_content", 1);
  const team = useTable<any>("team_members", { filter: (q) => q.eq("is_active", true), order: { column: "sort_order", ascending: true } });

  return (
    <SiteLayout>
      <PageHero eyebrow="Tentang Kami" title={about?.headline ?? "Tentang KBSBB"} description={about?.intro ?? undefined} />

      {(about?.story || about?.image_url) && (
        <section className="container-x py-20 grid lg:grid-cols-2 gap-12 items-center">
          <SafeImage src={about?.image_url} alt="Komunitas" className="rounded-3xl object-cover w-full aspect-[4/3] shadow-soft" />
          {about?.story && (
         
          <div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Sejarah kami</h2>
          <p
            className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-line text-justify"
            style={{ textAlign: "justify" }}
          >
              {about.story}
            </p>
          </div>
          
          )}
        </section>
      )}

      {(about?.mission || about?.vision) && (
        <section className="container-x py-8 grid md:grid-cols-2 gap-6">
          {about?.mission && (
            <Card className="rounded-3xl border-border/70">
              <CardContent className="p-8">
                <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-brand text-white"><Target className="h-5 w-5" /></div>
                <h3 className="mt-4 text-2xl font-extrabold">Misi</h3>
                <p className="mt-2 text-muted-foreground whitespace-pre-line text-justify" style={{ textAlign: "justify" }} >{about.mission}</p>
              </CardContent>
            </Card>
          )}
          {about?.vision && (
            <Card className="rounded-3xl border-border/70">
              <CardContent className="p-8">
                <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-brand text-white"><Award className="h-5 w-5" /></div>
                <h3 className="mt-4 text-2xl font-extrabold">Visi</h3>
                <p className="mt-2 text-muted-foreground whitespace-pre-line text-justify" style={{ textAlign: "justify" }} >{about.vision}</p>
              </CardContent>
            </Card>
          )}
        </section>
      )}

      {about === null && (
        <section className="container-x py-20">
          <EmptyState title="Konten tentang kami segera hadir" description="Kisah, visi, dan misi kami akan segera dipublikasikan di halaman ini." />
        </section>
      )}

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
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center">Tim KBSBB</h2>
        {team && team.length === 0 ? (
          <EmptyState className="mt-10" title="Data pengurus segera hadir" description="Profil pengurus kami akan segera dipublikasikan di sini." />
        ) : (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-6 gap-5">
            {(team ?? []).map((t: any) => (
              <div key={t.id} className="text-center">
                <SafeImage src={t.photo_url} alt={t.name} className="mx-auto aspect-square w-full rounded-3xl object-cover" />
                <div className="mt-3 font-bold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
