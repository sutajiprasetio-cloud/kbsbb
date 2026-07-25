import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import edu from "@/assets/program-education.jpg";
import health from "@/assets/program-health.jpg";
import food from "@/assets/program-food.jpg";
import disaster from "@/assets/program-disaster.jpg";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import { useTable } from "@/lib/public-data";

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

const FALLBACK = [hero1, edu, food, health, hero3, disaster, hero2, edu, food, hero1, health, hero3].map((image_url, i) => ({ id: i, image_url, title: "Field moment" }));

function Gallery() {
  const data = useTable<any>("gallery_items", { order: { column: "sort_order", ascending: true } });
  const items = data && data.length > 0 ? data : FALLBACK;
  return (
    <SiteLayout>
      <PageHero eyebrow="Gallery" title="Moments of impact" description="A window into the field — the smiles, the tears, the hope." />
      <section className="container-x py-20">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
          {items.map((it: any) => (
            <div key={it.id} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl group">
              <img src={it.image_url} alt={it.title ?? "Gallery"} loading="lazy" className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
