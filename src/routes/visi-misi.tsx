import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Award } from "lucide-react";
import { useSingleton } from "@/lib/public-data";
import { EmptyState } from "@/components/empty-state";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { canonical } from "@/lib/slug";
import { RichText } from "@/components/rich-text";

export const Route = createFileRoute("/visi-misi")({
  head: () => ({
    meta: [
      { title: "Visi & Misi — KBSBB" },
      { name: "description", content: "Visi dan misi KBSBB dalam menghadirkan manfaat dan keberkahan melalui program kesehatan, sosial, pendidikan, dakwah, dan kemanusiaan." },
      { property: "og:title", content: "Visi & Misi KBSBB" },
      { property: "og:description", content: "Arah dan tujuan gerakan kemanusiaan KBSBB." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/visi-misi") },
    ],
    links: [{ rel: "canonical", href: canonical("/visi-misi") }],
  }),
  component: VisiMisi,
});

function VisiMisi() {
  const about = useSingleton<any>("about_content", 1);
  return (
    <SiteLayout>
      <PageHero eyebrow="Visi & Misi" title="Arah gerakan kami" description="Landasan setiap langkah kebaikan KBSBB." />
      <section className="container-x py-20">
        <Breadcrumbs className="mb-8" items={[{ label: "Tentang Kami", to: "/tentang-kami" }, { label: "Visi & Misi" }]} />
        {!about?.vision && !about?.mission ? (
          <EmptyState title="Visi & misi segera hadir" description="Konten ini sedang disiapkan oleh tim kami." />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {about?.vision && (
              <Card className="rounded-3xl border-border/70"><CardContent className="p-8">
                <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-brand text-white"><Award className="h-5 w-5" /></div>
                <h2 className="mt-4 text-2xl font-extrabold">Visi</h2>
                <RichText html={about.vision} className="mt-2 text-muted-foreground [&>p]:text-justify" />
              </CardContent></Card>
            )}
            {about?.mission && (
              <Card className="rounded-3xl border-border/70"><CardContent className="p-8">
                <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-brand text-white"><Target className="h-5 w-5" /></div>
                <h2 className="mt-4 text-2xl font-extrabold">Misi</h2>
                <RichText html={about.mission} className="mt-2 text-muted-foreground [&>p]:text-justify" />
              </CardContent></Card>
            )}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
