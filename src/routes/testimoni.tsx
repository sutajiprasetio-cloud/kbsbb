import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { useTable } from "@/lib/public-data";
import { ModeImage } from "@/components/safe-image";
import { EmptyState } from "@/components/empty-state";
import { canonical } from "@/lib/slug";
import { RichText } from "@/components/rich-text";

export const Route = createFileRoute("/testimoni")({
  head: () => ({
    meta: [
      { title: "Kisah Inspiratif — Suara Komunitas KBSBB" },
      { name: "description", content: "Baca testimoni relawan, mitra kesehatan, dan penerima manfaat KBSBB dari seluruh Indonesia." },
      { property: "og:title", content: "Kisah Inspiratif KBSBB" },
      { property: "og:description", content: "Suara nyata dari lapangan." },
      { property: "og:url", content: canonical("/testimoni") },
    ],
    links: [{ rel: "canonical", href: canonical("/testimoni") }],
  }),
  component: Testimonials,
});

function Testimonials() {
  const items = useTable<any>("testimonials", { filter: (q) => q.eq("is_active", true), order: { column: "sort_order", ascending: true } });
  return (
    <SiteLayout>
      <PageHero eyebrow="Kisah Inspiratif" title="Suara dari komunitas" description="Relawan, mitra, dan penerima manfaat — dalam kata-kata mereka sendiri." />
      <section className="container-x py-20">
        {items && items.length === 0 ? (
          <EmptyState title="Belum ada kisah" description="Testimoni dari komunitas kami akan segera tampil di sini." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(items ?? []).map((q: any) => (
              <Card key={q.id} className="rounded-3xl border-border/70 hover:shadow-soft transition-all">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-primary/50" />
                  <p className="mt-4 text-base leading-relaxed">"{q.quote}"</p>
                  <div className="mt-6 flex items-center gap-3">
                    {q.avatar_url && <ModeImage src={q.avatar_url} alt={q.name} mode={q.display_mode} className="h-12 w-12 shrink-0 rounded-full" />}
                    <div>
                      <div className="font-bold">{q.name}</div>
                      <div className="text-xs text-muted-foreground">{q.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
