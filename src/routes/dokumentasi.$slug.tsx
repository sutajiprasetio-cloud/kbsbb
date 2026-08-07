import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { ModeImage } from "@/components/safe-image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArrowLeft } from "lucide-react";
import { canonical, cleanSlugRedirect } from "@/lib/slug";

export const Route = createFileRoute("/dokumentasi/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: "Dokumentasi KBSBB" },
      { name: "description", content: "Dokumentasi kegiatan kemanusiaan KBSBB di lapangan." },
      { property: "og:title", content: "Dokumentasi KBSBB" },
      { property: "og:description", content: "Dokumentasi kegiatan kemanusiaan KBSBB di lapangan." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: canonical(`/dokumentasi/${params.slug}`) },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical(`/dokumentasi/${params.slug}`) }],
  }),
  beforeLoad: ({ params }) => {
    const clean = cleanSlugRedirect(params.slug);
    if (clean) throw redirect({ to: "/dokumentasi/$slug", params: { slug: clean }, statusCode: 301 });
  },
  component: DokumentasiDetail,
});

function DokumentasiDetail() {
  const { slug } = Route.useParams();
  const [item, setItem] = useState<any | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await (supabase as any).from("gallery_items").select("*").eq("slug", slug).maybeSingle();
      if (!cancelled) setItem(data ?? null);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  return (
    <SiteLayout>
      <article className="container-x max-w-4xl py-28">
        <Breadcrumbs className="mb-6" items={[{ label: "Dokumentasi", to: "/dokumentasi" }, { label: item?.title ?? "Dokumentasi" }]} />
        {item === undefined ? (
          <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
        ) : item === null ? (
          <EmptyState title="Dokumentasi tidak ditemukan" description="Foto ini mungkin telah dihapus atau tautannya tidak sesuai." />
        ) : (
          <>
            <ModeImage src={item.image_url} alt={item.title ?? "Dokumentasi"} mode={item.display_mode} loading="eager" className="aspect-[4/3] rounded-3xl bg-muted" />
            <h1 className="mt-8 text-2xl md:text-3xl font-bold tracking-tight">{item.title ?? "Dokumentasi"}</h1>
            {item.category && <p className="mt-2 text-sm text-muted-foreground">{item.category}</p>}
            <Button asChild variant="outline" className="mt-10 rounded-full"><Link to="/dokumentasi"><ArrowLeft className="h-4 w-4 mr-2" /> Semua Dokumentasi</Link></Button>
          </>
        )}
      </article>
    </SiteLayout>
  );
}
