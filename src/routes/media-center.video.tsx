import { createFileRoute } from "@tanstack/react-router";
import { EmptyState } from "@/components/empty-state";
import { canonical } from "@/lib/slug";

export const Route = createFileRoute("/media-center/video")({
  head: () => ({
    meta: [
      { title: "Video — Media Center KBSBB" },
      { name: "description", content: "Kumpulan video kegiatan dan kisah penerima manfaat program kemanusiaan KBSBB." },
      { property: "og:title", content: "Video KBSBB" },
      { property: "og:description", content: "Rekaman kegiatan dan kisah penerima manfaat KBSBB." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/media-center/video") },
    ],
    links: [{ rel: "canonical", href: canonical("/media-center/video") }],
  }),
  component: () => (
    <EmptyState title="Belum ada video" description="Koleksi video kegiatan kami sedang disiapkan. Silakan kembali lagi nanti." />
  ),
});
