import { useEffect, useMemo, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { supabase } from "@/integrations/supabase/client";

/** Object path inside the private `media` bucket, for any stored URL form. */
function mediaPath(url: string) {
  const trimmed = (url || "").trim();
  if (!trimmed) return null;
  const m = trimmed.match(/\/storage\/v1\/object\/(?:public|sign|authenticated)\/media\/([^?"']+)/);
  if (m) return decodeURIComponent(m[1]);
  if (/^(https?:|data:|blob:|\/)/i.test(trimmed)) return null;
  return decodeURIComponent(trimmed.replace(/^media\//, ""));
}

const ALLOWED_IFRAME_HOSTS = [
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "player.vimeo.com",
  "drive.google.com",
  "www.google.com",
];

/**
 * Renders HTML produced by the admin rich text editor.
 * Images stored in the private `media` bucket are swapped for signed URLs on mount.
 */
export function RichText({ html, className }: { html?: string | null; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [signed, setSigned] = useState<Record<string, string>>({});

  const source = useMemo(() => {
    const raw = (html ?? "").trim();
    if (!raw) return "";
    // Legacy plain-text content: keep paragraph breaks.
    return /<[a-z][\s\S]*>/i.test(raw)
      ? raw
      : raw
          .split(/\n{2,}/)
          .map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
          .join("");
  }, [html]);

  // Resolve every private-bucket image up front so the markup we inject is already valid.
  useEffect(() => {
    let cancelled = false;
    const urls = Array.from(source.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)).map((m) => m[1]);
    const paths = Array.from(
      new Set(urls.map((u) => mediaPath(u)).filter((p): p is string => !!p)),
    );
    if (paths.length === 0) return;
    (async () => {
      const { data } = await supabase.storage.from("media").createSignedUrls(paths, 60 * 60);
      if (cancelled || !data) return;
      const map: Record<string, string> = {};
      data.forEach((row: any) => {
        if (row?.signedUrl && row?.path) map[row.path] = row.signedUrl;
      });
      setSigned(map);
    })();
    return () => {
      cancelled = true;
    };
  }, [source]);

  const clean = useMemo(() => {
    if (!source) return "";
    const resolved = source.replace(/(<img[^>]+src=)["']([^"']+)["']/gi, (full, head, src) => {
      const path = mediaPath(src);
      const url = path ? signed[path] : null;
      return url ? `${head}"${url}"` : full;
    });
    if (typeof window === "undefined") return resolved;
    return DOMPurify.sanitize(resolved, {
      ADD_ATTR: [
        "target", "rel", "data-align", "data-width", "data-caption", "data-type", "data-checked",
        "colspan", "rowspan", "style", "allow", "allowfullscreen", "frameborder", "loading", "decoding",
      ],
      ADD_TAGS: ["figure", "figcaption", "iframe"],
    });
  }, [source, signed]);


  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // Drop iframes from untrusted hosts, then wrap the safe ones responsively.
    root.querySelectorAll("iframe").forEach((frame) => {
      let host = "";
      try {
        host = new URL(frame.getAttribute("src") ?? "", window.location.origin).hostname;
      } catch {
        /* invalid url */
      }
      if (!ALLOWED_IFRAME_HOSTS.includes(host)) {
        frame.remove();
        return;
      }
      if (!frame.parentElement?.classList.contains("rt-embed")) {
        const wrap = document.createElement("div");
        wrap.className = "rt-embed";
        frame.replaceWith(wrap);
        wrap.appendChild(frame);
      }
    });

    // Tables scroll horizontally on small screens instead of overflowing.
    root.querySelectorAll("table").forEach((table) => {
      if (table.parentElement?.classList.contains("rt-table-wrap")) return;
      const wrap = document.createElement("div");
      wrap.className = "rt-table-wrap";
      table.replaceWith(wrap);
      wrap.appendChild(table);
    });

    // External links open safely in a new tab.
    root.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href") ?? "";
      if (/^https?:\/\//i.test(href) && !href.includes(window.location.hostname)) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      }
    });

    root.querySelectorAll("img").forEach((img) => {
      if (!img.getAttribute("alt"))
        img.setAttribute("alt", img.closest("figure")?.querySelector("figcaption")?.textContent ?? "");
    });
  }, [clean]);


  if (!clean) return null;

  return (
    <div
      ref={ref}
      className={`prose prose-sm sm:prose-base max-w-none dark:prose-invert ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

export default RichText;
