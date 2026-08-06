import { useEffect, useMemo, useRef } from "react";
import DOMPurify from "dompurify";
import { supabase } from "@/integrations/supabase/client";

function mediaPath(url: string) {
  const m = url.match(/\/storage\/v1\/object\/(?:public|sign|authenticated)\/media\/([^?]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

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
      ADD_ATTR: ["target", "rel", "data-align", "data-width", "data-caption", "colspan", "rowspan", "style"],
      ADD_TAGS: ["figure", "figcaption"],
    });
  }, [html]);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let cancelled = false;
    const imgs = Array.from(root.querySelectorAll("img"));
    imgs.forEach(async (img) => {
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
