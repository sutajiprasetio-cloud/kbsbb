import { useEffect, useMemo, useRef } from "react";
import DOMPurify from "dompurify";
import { supabase } from "@/integrations/supabase/client";

function mediaPath(url: string) {
  const m = url.match(/\/storage\/v1\/object\/(?:public|sign|authenticated)\/media\/([^?]+)/);
  return m ? decodeURIComponent(m[1]) : null;
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

  const clean = useMemo(() => {
    const raw = (html ?? "").trim();
    if (!raw) return "";
    // Legacy plain-text content: keep paragraph breaks.
    const source = /<[a-z][\s\S]*>/i.test(raw)
      ? raw
      : raw
          .split(/\n{2,}/)
          .map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
          .join("");
    if (typeof window === "undefined") return source;
    return DOMPurify.sanitize(source, {
      ADD_ATTR: [
        "target", "rel", "data-align", "data-width", "data-caption", "data-type", "data-checked",
        "colspan", "rowspan", "style", "allow", "allowfullscreen", "frameborder", "loading", "decoding",
      ],
      ADD_TAGS: ["figure", "figcaption", "iframe"],
    });
  }, [html]);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let cancelled = false;

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

    // Private-bucket images need a signed URL.
    root.querySelectorAll("img").forEach(async (img) => {
      if (!img.getAttribute("alt")) img.setAttribute("alt", img.closest("figure")?.querySelector("figcaption")?.textContent ?? "");
      const path = mediaPath(img.getAttribute("src") ?? "");
      if (!path) return;
      const { data } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60);
      if (!cancelled && data?.signedUrl) img.setAttribute("src", data.signedUrl);
    });

    return () => { cancelled = true; };
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
