import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { useTable } from "@/lib/public-data";
import { ModeImage } from "@/components/safe-image";
import { EmptyState } from "@/components/empty-state";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { canonical } from "@/lib/slug";

export const Route = createFileRoute("/dokumentasi/")({
  head: () => ({
    meta: [
      { title: "Dokumentasi — Momen Kebaikan KBSBB" },
      { name: "description", content: "Foto-foto relawan, program, dan kegiatan komunitas KBSBB di seluruh Indonesia." },
      { property: "og:title", content: "Dokumentasi KBSBB" },
      { property: "og:description", content: "Momen kebaikan yang terekam dari lapangan." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/dokumentasi") },
    ],
    links: [{ rel: "canonical", href: canonical("/dokumentasi") }],
  }),
  component: Gallery,
});

function Gallery() {
  const items = useTable<any>("gallery_items", { order: { column: "sort_order", ascending: true } });
  return (
    <SiteLayout>
      <PageHero eyebrow="Dokumentasi" title="Jejak Kebaikan KBSBB" description="Kumpulan momen inspiratif dari berbagai program sosial, kemanusiaan, kesehatan, pendidikan, dan pemberdayaan masyarakat yang dilaksanakan oleh KBSBB." />
      <section className="container-x py-20">
        <Breadcrumbs className="mb-8" items={[{ label: "Gallery" }]} />
        {items && items.length === 0 ? (
          <EmptyState title="Belum ada foto" description="Galeri kami sedang disiapkan. Silakan kembali lagi nanti." />
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
            {(items ?? []).map((it: any) => (
              <Link key={it.id} to="/dokumentasi/$slug" params={{ slug: it.slug }} className="mb-4 block break-inside-avoid overflow-hidden rounded-2xl group">
                <ModeImage src={it.image_url} alt={it.title ?? "Dokumentasi"} mode={it.display_mode} className="w-full aspect-[4/3] bg-muted" imgClassName="transition-transform duration-700 group-hover:scale-105" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
