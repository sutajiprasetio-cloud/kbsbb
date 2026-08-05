import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { ModeImage } from "@/components/safe-image";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { canonical, slugify } from "@/lib/slug";

export const Route = createFileRoute("/berita/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: "Artikel — Berita KBSBB" },
      { name: "description", content: "Baca kisah lengkap dari kegiatan kemanusiaan KBSBB di seluruh Indonesia." },
      { property: "og:title", content: "Artikel Berita KBSBB" },
      { property: "og:description", content: "Baca kisah lengkap dari kegiatan kemanusiaan KBSBB di seluruh Indonesia." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: canonical(`/berita/${params.slug}`) },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical(`/berita/${params.slug}`) }],
  }),
  component: NewsDetail,
});

function NewsDetail() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<any | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const client = supabase as any;
      let { data } = await client.from("news_posts").select("*").eq("is_published", true).eq("slug", slug).maybeSingle();
      if (!data && /^[0-9a-f-]{36}$/i.test(slug)) {
        const res = await client.from("news_posts").select("*").eq("is_published", true).eq("id", slug).maybeSingle();
        data = res.data;
      }
      if (!cancelled) setPost(data ?? null);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  return (
    <SiteLayout>
      <article className="container-x max-w-3xl py-28">
        <Breadcrumbs className="mb-6" items={[{ label: "Berita", to: "/berita" }, { label: post?.title ?? "Artikel" }]} />
        <Button asChild variant="ghost" className="mb-6 -ml-3">
          <Link to="/berita"><ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Berita</Link>
        </Button>

        {post === undefined ? (
          <div className="space-y-4">
            <Skeleton className="aspect-[16/9] w-full rounded-3xl" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : post === null ? (
          <EmptyState title="Artikel tidak ditemukan" description="Berita ini mungkin telah dihapus atau tautannya tidak sesuai." />
        ) : (
          <>
            <ModeImage src={post.cover_url} alt={post.title} mode={post.display_mode} loading="eager" className="aspect-[16/9] rounded-3xl bg-muted" />
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {post.tags?.[0] ? (
                <Link to="/kategori/$slug" params={{ slug: slugify(post.tags[0]) }} className="rounded-full bg-brand-soft px-2.5 py-0.5 font-semibold text-primary hover:opacity-80">{post.tags[0]}</Link>
              ) : (
                <span className="rounded-full bg-brand-soft px-2.5 py-0.5 font-semibold text-primary">Berita</span>
              )}
              {post.author && <span className="inline-flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>}
              {post.published_at && <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(post.published_at).toLocaleDateString("id-ID")}</span>}
            </div>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold leading-tight tracking-tight">{post.title}</h1>
            {post.excerpt && <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>}
            {post.content && (
              <div className="mt-8 space-y-4 text-base leading-relaxed text-foreground/90">
                {String(post.content).split(/\n{2,}/).map((p: string, i: number) => (
                  <p key={i} className="whitespace-pre-line">{p}</p>
                ))}
              </div>
            )}
            {post.tags?.length > 1 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.slice(1).map((t: string) => (
                  <span key={t} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{t}</span>
                ))}
              </div>
            )}
            <div className="mt-12">
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/berita"><ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Berita</Link>
              </Button>
            </div>
          </>
        )}
      </article>
    </SiteLayout>
  );
}
