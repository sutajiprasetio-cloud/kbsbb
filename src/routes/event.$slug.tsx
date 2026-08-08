import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { ModeImage } from "@/components/safe-image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { canonical, cleanSlugRedirect } from "@/lib/slug";
import { RichText } from "@/components/rich-text";

export const Route = createFileRoute("/event/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: "Kegiatan KBSBB" },
      { name: "description", content: "Detail kegiatan KBSBB — waktu, lokasi, dan cara ikut serta." },
      { property: "og:title", content: "Kegiatan KBSBB" },
      { property: "og:description", content: "Detail kegiatan KBSBB — waktu, lokasi, dan cara ikut serta." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: canonical(`/event/${params.slug}`) },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical(`/event/${params.slug}`) }],
  }),
  beforeLoad: ({ params }) => {
    const clean = cleanSlugRedirect(params.slug);
    if (!clean) return undefined as never;
     throw redirect({ to: "/event/$slug", params: { slug: clean }, statusCode: 301 });
  },
  component: EventDetail,
});

function EventDetail() {
  const { slug } = Route.useParams();
  const [item, setItem] = useState<any | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await (supabase as any).from("events").select("*").eq("is_published", true).eq("slug", slug).maybeSingle();
      if (!cancelled) setItem(data ?? null);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const d = item?.starts_at ? new Date(item.starts_at) : null;

  return (
    <SiteLayout>
      <article className="container-x max-w-3xl py-28">
        <Breadcrumbs className="mb-6" items={[{ label: "Kegiatan", to: "/event" }, { label: item?.title ?? "Kegiatan" }]} />
        {item === undefined ? (
          <div className="space-y-4"><Skeleton className="aspect-[16/9] w-full rounded-3xl" /><Skeleton className="h-8 w-2/3" /></div>
        ) : item === null ? (
          <EmptyState title="Kegiatan tidak ditemukan" description="Kegiatan ini mungkin telah selesai atau tautannya tidak sesuai." />
        ) : (
          <>
            <ModeImage src={item.image_url} alt={item.title} mode={item.display_mode} loading="eager" className="aspect-[16/9] rounded-3xl bg-muted" />
            <h1 className="mt-8 text-3xl md:text-4xl font-bold leading-tight tracking-tight">{item.title}</h1>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {d && <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" /> {d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</span>}
              {d && <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB</span>}
              {item.location && <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {item.location}</span>}
            </div>
            {item.description && (
              <RichText html={item.description} className="mt-6 text-base leading-relaxed text-foreground/90" />
            )}
            <div className="mt-10 flex flex-wrap gap-3">
              {item.cta_href && <a href={item.cta_href} target="_blank" rel="noreferrer"><Button className="rounded-full">Daftar</Button></a>}
              <Button asChild variant="outline" className="rounded-full"><Link to="/event"><ArrowLeft className="h-4 w-4 mr-2" /> Semua Kegiatan</Link></Button>
            </div>
          </>
        )}
      </article>
    </SiteLayout>
  );
}
