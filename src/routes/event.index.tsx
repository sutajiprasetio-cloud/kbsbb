import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock } from "lucide-react";
import { useTable } from "@/lib/public-data";
import { EmptyState } from "@/components/empty-state";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { canonical } from "@/lib/slug";

export const Route = createFileRoute("/event/")({
  head: () => ({
    meta: [
      { title: "Kegiatan — Agenda Komunitas KBSBB" },
      { name: "description", content: "Ikuti kegiatan KBSBB: aksi donasi, pemeriksaan kesehatan gratis, pembekalan relawan, dan kegiatan komunitas lainnya." },
      { property: "og:title", content: "Kegiatan KBSBB" },
      { property: "og:description", content: "Mari bersama mewujudkan misi kemanusiaan." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/event") },
    ],
    links: [{ rel: "canonical", href: canonical("/event") }],
  }),
  component: Events,
});

function Events() {
  const items = useTable<any>("events", { filter: (q) => q.eq("is_published", true), order: { column: "starts_at", ascending: false } });
  return (
    <SiteLayout>
      <PageHero eyebrow="Kegiatan" title="Mari bergabung langsung bersama kami" description="Aksi sosial, pemeriksaan kesehatan, pertemuan relawan, dan banyak lagi." />
      <section className="container-x py-20">
        <Breadcrumbs className="mb-8" items={[{ label: "Kegiatan" }]} />
        {items && items.length === 0 ? (
          <EmptyState title="Belum ada kegiatan terjadwal" description="Saat ini belum ada kegiatan yang dipublikasikan. Ikuti kami untuk info kegiatan berikutnya." />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {(items ?? []).map((e: any) => {
              const d = new Date(e.starts_at);
              return (
                <Card key={e.id} className="rounded-3xl border-border/70 hover:shadow-soft transition-all">
                  <CardContent className="p-6 flex gap-5">
                    <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl gradient-brand text-white">
                      <div className="text-center leading-tight">
                        <div className="text-3xl font-extrabold">{d.getDate().toString().padStart(2, "0")}</div>
                        <div className="text-[11px] uppercase tracking-widest opacity-90">{d.toLocaleString("id-ID", { month: "short" })}</div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link to="/event/$slug" params={{ slug: e.slug }}>
                        <h3 className="text-lg font-bold leading-snug hover:text-primary transition-colors">{e.title}</h3>
                      </Link>
                      <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{e.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        {e.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {e.location}</span>}
                        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB</span>
                        <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {d.getFullYear()}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button asChild size="sm" className="rounded-full"><Link to="/event/$slug" params={{ slug: e.slug }}>Detail kegiatan</Link></Button>
                        {e.cta_href && <a href={e.cta_href} target="_blank" rel="noreferrer"><Button variant="outline" className="rounded-full" size="sm">Daftar</Button></a>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
