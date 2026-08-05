import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Image, Video, FileText, ArrowRight } from "lucide-react";
import { canonical } from "@/lib/slug";

export const Route = createFileRoute("/media-center/")({
  head: () => ({
    meta: [
      { title: "Media Center — KBSBB" },
      { name: "description", content: "Pusat media KBSBB: kumpulan foto, video, dan dokumen resmi kegiatan kemanusiaan kami." },
      { property: "og:title", content: "Media Center KBSBB" },
      { property: "og:description", content: "Foto, video, dan dokumen resmi KBSBB." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/media-center") },
    ],
    links: [{ rel: "canonical", href: canonical("/media-center") }],
  }),
  component: MediaCenterIndex,
});

const SECTIONS = [
  { to: "/media-center/foto", icon: Image, title: "Foto", text: "Dokumentasi visual kegiatan di lapangan." },
  { to: "/media-center/video", icon: Video, title: "Video", text: "Rekaman kegiatan dan kisah penerima manfaat." },
  { to: "/media-center/dokumen", icon: FileText, title: "Dokumen", text: "Laporan, publikasi, dan berkas resmi." },
];

function MediaCenterIndex() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {SECTIONS.map((s) => (
        <Link key={s.to} to={s.to}>
          <Card className="h-full rounded-3xl border-border/70 hover:shadow-soft transition-all">
            <CardContent className="p-6">
              <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-brand text-white"><s.icon className="h-5 w-5" /></div>
              <h2 className="mt-4 text-lg font-bold">{s.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Lihat {s.title.toLowerCase()} <ArrowRight className="h-4 w-4" /></span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
