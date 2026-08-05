import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";
import { useTable } from "@/lib/public-data";
import { EmptyState } from "@/components/empty-state";
import { ModeImage } from "@/components/safe-image";

export const Route = createFileRoute("/berita/")({
  head: () => ({
    meta: [
      { title: "Berita — Kabar Terbaru KBSBB" },
      { name: "description", content: "Baca kisah, laporan dampak, dan pengumuman terbaru dari KBSBB." },
      { property: "og:title", content: "Berita KBSBB" },
      { property: "og:description", content: "Kisah dan kabar terbaru dari kegiatan kemanusiaan kami di seluruh Indonesia." },
    ],
  }),
  component: News,
});

function News() {
  const items = useTable<any>("news_posts", { filter: (q) => q.eq("is_published", true), order: { column: "published_at", ascending: false } });
  return (
    <SiteLayout>
      <PageHero eyebrow="Berita & Kisah" title="Berita dan Kegiatan KBSBB" description="Informasi terbaru mengenai kegiatan sosial, program kemanusiaan, dan aksi berbagi yang dilaksanakan KBSBB." />
      <section className="container-x py-20">
        {items && items.length === 0 ? (
          <EmptyState title="Belum ada berita" description="Kami belum mempublikasikan berita. Silakan kembali lagi nanti." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(items ?? []).map((n: any) => (
              <Link key={n.id} to="/berita/$slug" params={{ slug: n.slug }} className="block focus:outline-none">
                <Card className="group h-full overflow-hidden rounded-3xl border-border/70 pt-0 hover:shadow-soft transition-all">
                  <ModeImage src={n.cover_url} alt={n.title} mode={n.display_mode} className="aspect-[16/10] bg-muted" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                  <CardContent className="px-5 pb-5">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="rounded-full bg-brand-soft px-2.5 py-0.5 font-semibold text-primary">{(n.tags?.[0]) ?? "Berita"}</span>
                      {n.published_at && <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(n.published_at).toLocaleDateString("id-ID")}</span>}
                    </div>
                    <h3 className="mt-3 text-lg font-bold leading-snug">{n.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{n.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Baca selengkapnya <ArrowRight className="h-4 w-4" /></span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
