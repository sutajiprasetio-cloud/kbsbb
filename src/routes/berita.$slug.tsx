import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { ModeImage } from "@/components/safe-image";
//import { ArrowLeft, Calendar, User } from "lucide-react";
import { ArrowLeft, Calendar, User, Share2} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { canonical, slugify } from "@/lib/slug";
import { Card, CardContent } from "@/components/ui/card";

import { Link2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";


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
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "";
  
  const shareTitle = post?.title || "Berita KBSBB";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const client = supabase as any;
      let { data } = await client.from("news_posts").select("*").eq("is_published", true).eq("slug", slug).maybeSingle();
      if (!data && /^[0-9a-f-]{36}$/i.test(slug)) {
        const res = await client.from("news_posts").select("*").eq("is_published", true).eq("id", slug).maybeSingle();
        data = res.data;
      }
    //  if (!cancelled) setPost(data ?? null);
      if (!cancelled) {
  setPost(data ?? null);

  if (data) {
    const { data: related } = await client
      .from("news_posts")
      .select("*")
      .eq("is_published", true)
      .neq("id", data.id)
      .order("published_at", { ascending: false })
      .limit(3);

    setRelatedPosts(related || []);
  }
}
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
          <>
            <div className="mt-8 space-y-6 text-base text-foreground/90">
              {String(post.content).split(/\n{2,}/).map((p: string, i: number) => (
                <p
                  key={i}
                  className="whitespace-pre-line"
                  style={{
                    textAlign: "justify",
                    lineHeight: "1.9",
                  }}
                >
                  {p}
                </p>
              ))}
            </div>
        
            <div className="mt-10 rounded-xl border border-primary/30 bg-card p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <span className="font-medium text-foreground">
                  Sebarkan kebaikan ini melalui :
                </span>
        
                <div className="flex flex-wrap items-center gap-3">
        
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      shareTitle + "\n" + shareUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-primary text-primary transition hover:bg-primary hover:text-white"
                  >
                    <FaWhatsapp size={16} />
                  </a>
        
                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      shareUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-primary text-primary transition hover:bg-primary hover:text-white"
                  >
                    <FaFacebookF size={16} />
                  </a>
        
                         
                  {/* Telegram */}
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(
                      shareUrl
                    )}&text=${encodeURIComponent(shareTitle)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-primary text-primary transition hover:bg-primary hover:text-white"
                  >
                    <FaTelegramPlane size={16} />
                  </a>
        
                  {/* X */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      shareTitle
                    )}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-primary text-primary transition hover:bg-primary hover:text-white"
                  >
                    <FaXTwitter size={16} />
                  </a>
        
                  {/* Salin Link */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                  
                      toast.success("URL artikel berhasil disalin", {
                        description: "Silakan bagikan ke teman dan keluarga",
                        duration: 2500,
                      });
                    }}
                    title="Salin Link"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-primary text-primary transition hover:bg-primary hover:text-white"
                  >
                    <Link2 size={16} />
                  </button>
        
                </div>
              </div>
            </div>
          </>
        )} 
            
                        
            {post.tags?.length > 1 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.slice(1).map((t: string) => (
                  <span key={t} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{t}</span>
                ))}
              </div>
            )}

          {relatedPosts.length > 0 && (
              <section className="mt-16 border-t pt-12">
                <h2 className="mb-8 text-2xl font-bold">
                  Berita Lainnya
                </h2>
            
                <div className="grid gap-6 md:grid-cols-3">
                  {relatedPosts.map((item) => (
                    <Link
                      key={item.id}
                      to="/berita/$slug"
                      params={{ slug: item.slug }}
                      className="group"
                    >
                      <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300">
                        <ModeImage
                          src={item.cover_url}
                          alt={item.title}
                          mode={item.display_mode}
                          className="aspect-video"
                          imgClassName="group-hover:scale-105 transition-transform duration-500"
                        />
            
                        <CardContent className="p-4">
                          <h3 className="font-bold line-clamp-2 group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
            
                          {item.published_at && (
                            <p className="mt-2 text-xs text-muted-foreground">
                              {new Date(item.published_at).toLocaleDateString("id-ID")}
                            </p>
                          )}
            
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                            {item.excerpt}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
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
