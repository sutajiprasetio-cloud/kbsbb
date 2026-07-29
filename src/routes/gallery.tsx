import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { useTable } from "@/lib/public-data";
import { SafeImage } from "@/components/safe-image";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Galeri — Momen Kebaikan KBSBB" },
      { name: "description", content: "Foto-foto relawan, program, dan kegiatan komunitas KBSBB di seluruh Indonesia." },
      { property: "og:title", content: "Galeri KBSBB" },
      { property: "og:description", content: "Momen kebaikan yang terekam dari lapangan." },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const items = useTable<any>("gallery_items", { order: { column: "sort_order", ascending: true } });
  return (
    <SiteLayout>
      <PageHero eyebrow="Galeri" title="Momen kebaikan" description="Jendela menuju lapangan — senyum, haru, dan harapan." />
      <section className="container-x py-20">
        {items && items.length === 0 ? (
          <EmptyState title="Belum ada foto" description="Galeri kami sedang disiapkan. Silakan kembali lagi nanti." />
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
            {(items ?? []).map((it: any) => (
              <div key={it.id} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl group">
                <SafeImage src={it.image_url} alt={it.title ?? "Galeri"} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
