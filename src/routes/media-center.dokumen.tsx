import { createFileRoute } from "@tanstack/react-router";
import { EmptyState } from "@/components/empty-state";
import { canonical } from "@/lib/slug";

export const Route = createFileRoute("/media-center/dokumen")({
  head: () => ({
    meta: [
      { title: "Dokumen — Media Center KBSBB" },
      { name: "description", content: "Laporan kegiatan, publikasi, dan dokumen resmi KBSBB yang dapat diunduh." },
      { property: "og:title", content: "Dokumen Resmi KBSBB" },
      { property: "og:description", content: "Laporan dan publikasi resmi KBSBB." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/media-center/dokumen") },
    ],
    links: [{ rel: "canonical", href: canonical("/media-center/dokumen") }],
  }),
  component: () => (
    <EmptyState title="Belum ada dokumen" description="Laporan dan dokumen resmi akan dipublikasikan di halaman ini." />
  ),
});
