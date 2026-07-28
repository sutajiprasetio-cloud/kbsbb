import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { useTable } from "@/lib/public-data";
import { SafeImage } from "@/components/safe-image";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — KBSBB Moments of Impact" },
      { name: "description", content: "Photos from KBSBB volunteers, programs and community events across Indonesia." },
      { property: "og:title", content: "KBSBB Gallery" },
      { property: "og:description", content: "Moments of impact captured in the field." },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const items = useTable<any>("gallery_items", { order: { column: "sort_order", ascending: true } });
  return (
    <SiteLayout>
      <PageHero eyebrow="Gallery" title="Moments of impact" description="A window into the field — the smiles, the tears, the hope." />
      <section className="container-x py-20">
        {items && items.length === 0 ? (
          <EmptyState title="No photos yet" description="Our gallery is being prepared. Come back soon to see moments from the field." />
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
            {(items ?? []).map((it: any) => (
              <div key={it.id} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl group">
                <SafeImage src={it.image_url} alt={it.title ?? "Gallery"} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
