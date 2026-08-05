import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://kbsbb.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const STATIC_ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/tentang-kami", changefreq: "monthly", priority: "0.8" },
  { path: "/visi-misi", changefreq: "yearly", priority: "0.6" },
  { path: "/tim-kami", changefreq: "monthly", priority: "0.6" },
  { path: "/program", changefreq: "weekly", priority: "0.9" },
  { path: "/donasi", changefreq: "daily", priority: "1.0" },
  { path: "/berita", changefreq: "daily", priority: "0.9" },
  { path: "/event", changefreq: "weekly", priority: "0.8" },
  { path: "/dokumentasi", changefreq: "weekly", priority: "0.7" },
  { path: "/media-center", changefreq: "weekly", priority: "0.6" },
  { path: "/media-center/foto", changefreq: "weekly", priority: "0.5" },
  { path: "/media-center/video", changefreq: "monthly", priority: "0.4" },
  { path: "/media-center/dokumen", changefreq: "monthly", priority: "0.4" },
  { path: "/mitra", changefreq: "monthly", priority: "0.5" },
  { path: "/testimoni", changefreq: "monthly", priority: "0.5" },
  { path: "/relawan", changefreq: "monthly", priority: "0.7" },
  { path: "/faq", changefreq: "monthly", priority: "0.5" },
  { path: "/kontak", changefreq: "monthly", priority: "0.7" },
];

const slugify = (input: string) =>
  String(input ?? "")
    .toLowerCase()
    .replace(/&/g, " dan ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const url = process.env["SUPABASE_URL"];
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
        const entries: SitemapEntry[] = [...STATIC_ENTRIES];

        if (url && key) {
          const supabase = createClient(url, key, {
            auth: { persistSession: false },
            global: {
              fetch: (input, init) => {
                const h = new Headers(init?.headers);
                if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
                h.set("apikey", key);
                return fetch(input, { ...init, headers: h });
              },
            },
          });

          const [news, programs, events, gallery, campaigns] = await Promise.all([
            supabase.from("news_posts").select("slug, tags").eq("is_published", true),
            supabase.from("programs").select("slug").eq("is_active", true),
            supabase.from("events").select("slug").eq("is_published", true),
            supabase.from("gallery_items").select("slug"),
            supabase.from("donation_campaigns").select("slug").eq("is_active", true),
          ]);

          const tags = new Set<string>();
          (news.data ?? []).forEach((n: any) => {
            if (n.slug) entries.push({ path: `/berita/${n.slug}`, changefreq: "monthly", priority: "0.7" });
            (n.tags ?? []).forEach((t: string) => { const s = slugify(t); if (s) tags.add(s); });
          });
          tags.forEach((t) => entries.push({ path: `/kategori/${t}`, changefreq: "weekly", priority: "0.5" }));
          (programs.data ?? []).forEach((p: any) => p.slug && entries.push({ path: `/program/${p.slug}`, changefreq: "monthly", priority: "0.8" }));
          (events.data ?? []).forEach((e: any) => e.slug && entries.push({ path: `/event/${e.slug}`, changefreq: "monthly", priority: "0.6" }));
          (gallery.data ?? []).forEach((g: any) => g.slug && entries.push({ path: `/dokumentasi/${g.slug}`, changefreq: "monthly", priority: "0.4" }));
          (campaigns.data ?? []).forEach((c: any) => c.slug && entries.push({ path: `/donasi/${c.slug}`, changefreq: "daily", priority: "0.9" }));
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ].filter(Boolean).join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
