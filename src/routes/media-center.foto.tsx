import { createFileRoute, Link } from "@tanstack/react-router";
import { useTable } from "@/lib/public-data";
import { ModeImage } from "@/components/safe-image";
import { EmptyState } from "@/components/empty-state";
import { canonical } from "@/lib/slug";

export const Route = createFileRoute("/media-center/foto")({
  head: () => ({
    meta: [
      { title: "Foto — Media Center KBSBB" },
      { name: "description", content: "Galeri foto kegiatan kemanusiaan KBSBB di berbagai daerah di Indonesia." },
      { property: "og:title", content: "Foto Kegiatan KBSBB" },
      { property: "og:description", content: "Dokumentasi foto kegiatan kemanusiaan KBSBB." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/media-center/foto") },
    ],
    links: [{ rel: "canonical", href: canonical("/media-center/foto") }],
  }),
  component: MediaFoto,
});

function MediaFoto() {
  const items = useTable<any>("gallery_items", { order: { column: "sort_order", ascending: true } });
  if (items && items.length === 0) {
    return <EmptyState title="Belum ada foto" description="Dokumentasi foto sedang disiapkan. Silakan kembali lagi nanti." />;
  }
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
      {(items ?? []).map((it: any) => (
        <Link key={it.id} to="/dokumentasi/$slug" params={{ slug: it.slug }} className="mb-4 block break-inside-avoid overflow-hidden rounded-2xl group">
          <ModeImage src={it.image_url} alt={it.title ?? "Dokumentasi"} mode={it.display_mode} className="w-full aspect-[4/3] bg-muted" imgClassName="transition-transform duration-700 group-hover:scale-105" />
        </Link>
      ))}
    </div>
  );
}
