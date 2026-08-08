import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";
import { useTable } from "@/lib/public-data";
import { EmptyState } from "@/components/empty-state";
import { ModeImage } from "@/components/safe-image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { canonical, slugify, cleanSlugRedirect } from "@/lib/slug";

export const Route = createFileRoute("/kategori/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Kategori ${params.slug.replace(/-/g, " ")} — Berita KBSBB` },
      { name: "description", content: `Kumpulan berita KBSBB pada kategori ${params.slug.replace(/-/g, " ")}.` },
      { property: "og:title", content: `Kategori ${params.slug.replace(/-/g, " ")} — Berita KBSBB` },
      { property: "og:description", content: `Kumpulan berita KBSBB pada kategori ${params.slug.replace(/-/g, " ")}.` },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical(`/kategori/${params.slug}`) },
    ],
    links: [{ rel: "canonical", href: canonical(`/kategori/${params.slug}`) }],
  }),
  beforeLoad: ({ params }) => {
    const clean = cleanSlugRedirect(params.slug);
    if (!clean) return undefined as never;
     throw redirect({ to: "/kategori/$slug", params: { slug: clean }, statusCode: 301 });
  },
  component: Kategori,
});

function Kategori() {
  const { slug } = Route.useParams();
  const all = useTable<any>("news_posts", { filter: (q) => q.eq("is_published", true), order: { column: "published_at", ascending: false } });
  const items = all?.filter((n: any) => (n.tags ?? []).some((t: string) => slugify(t) === slug)) ?? null;
  const label = (all ?? []).flatMap((n: any) => n.tags ?? []).find((t: string) => slugify(t) === slug) ?? slug.replace(/-/g, " ");

  return (
    <SiteLayout>
      <PageHero eyebrow="Kategori" title={label} description={`Semua berita KBSBB dalam kategori ${label}.`} />
      <section className="container-x py-20">
        <Breadcrumbs className="mb-8" items={[{ label: "Berita", to: "/berita" }, { label }]} />
        {items && items.length === 0 ? (
          <EmptyState title="Belum ada berita di kategori ini" description="Silakan pilih kategori lain atau kembali ke halaman berita." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(items ?? []).map((n: any) => (
              <Link key={n.id} to="/berita/$slug" params={{ slug: n.slug }} className="block focus:outline-none">
                <Card className="group h-full overflow-hidden rounded-3xl border-border/70 pt-0 hover:shadow-soft transition-all">
                  <ModeImage src={n.cover_url} alt={n.title} mode={n.display_mode} className="aspect-[16/10] bg-muted" />
                  <CardContent className="px-5 pb-5">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
