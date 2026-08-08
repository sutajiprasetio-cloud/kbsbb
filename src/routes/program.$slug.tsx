import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { ModeImage } from "@/components/safe-image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { canonical, cleanSlugRedirect } from "@/lib/slug";
import { RichText } from "@/components/rich-text";

export const Route = createFileRoute("/program/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: "Program KBSBB" },
      { name: "description", content: "Detail program kemanusiaan KBSBB — tujuan, cakupan, dan cara Anda ikut mendukung." },
      { property: "og:title", content: "Program KBSBB" },
      { property: "og:description", content: "Detail program kemanusiaan KBSBB." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: canonical(`/program/${params.slug}`) },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical(`/program/${params.slug}`) }],
  }),
  beforeLoad: ({ params }) => {
    const clean = cleanSlugRedirect(params.slug);
    if (!clean) return undefined as never;
     throw redirect({ to: "/program/$slug", params: { slug: clean }, statusCode: 301 });
  },
  component: ProgramDetail,
});

function ProgramDetail() {
  const { slug } = Route.useParams();
  const [item, setItem] = useState<any | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await (supabase as any).from("programs").select("*").eq("is_active", true).eq("slug", slug).maybeSingle();
      if (!cancelled) setItem(data ?? null);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  return (
    <SiteLayout>
      <article className="container-x max-w-3xl py-28">
        <Breadcrumbs className="mb-6" items={[{ label: "Program", to: "/program" }, { label: item?.title ?? "Program" }]} />
        {item === undefined ? (
          <div className="space-y-4">
            <Skeleton className="aspect-[16/9] w-full rounded-3xl" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : item === null ? (
          <EmptyState title="Program tidak ditemukan" description="Program ini mungkin telah dihapus atau tautannya tidak sesuai." />
        ) : (
          <>
            <ModeImage src={item.image_url} alt={item.title} mode={item.display_mode} loading="eager" className="aspect-[16/9] rounded-3xl bg-muted" />
            <h1 className="mt-8 text-3xl md:text-4xl font-bold leading-tight tracking-tight">{item.title}</h1>
            {item.summary && <p className="mt-4 text-lg text-muted-foreground">{item.summary}</p>}
            {item.description && (
              <RichText html={item.description} className="mt-6 text-base leading-relaxed text-foreground/90" />
            )}
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild className="rounded-full gap-2"><Link to="/donasi">Dukung program ini <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild variant="outline" className="rounded-full"><Link to="/program"><ArrowLeft className="h-4 w-4 mr-2" /> Semua Program</Link></Button>
            </div>
          </>
        )}
      </article>
    </SiteLayout>
  );
}
