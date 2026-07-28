import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import placeholder from "@/assets/news-placeholder.jpg";

/**
 * Resolves the object path inside the `media` bucket for values stored as:
 *  - a full public URL   .../storage/v1/object/public/media/<path>
 *  - a full signed URL   .../storage/v1/object/sign/media/<path>?token=...
 *  - a bucket-prefixed path  media/<path>
 *  - a bare object path      folder/file.jpg
 */
function mediaPath(url?: string | null) {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  const m = trimmed.match(/\/storage\/v1\/object\/(?:public|sign|authenticated)\/media\/([^?]+)/);
  if (m) return decodeURIComponent(m[1]);

  // Any other absolute URL / data URI is used as-is.
  if (/^(https?:|data:|blob:|\/)/i.test(trimmed)) return null;

  return decodeURIComponent(trimmed.replace(/^media\//, ""));
}

export function SafeImage({
  src,
  alt,
  className,
  loading = "lazy",
  sizes,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  sizes?: string;
}) {
  const [resolved, setResolved] = useState<string>(src || placeholder);

  useEffect(() => {
    let cancelled = false;
    const path = mediaPath(src);
    if (!path) {
      setResolved(src || placeholder);
      return;
    }
    (async () => {
      const { data } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60);
      if (!cancelled) setResolved(data?.signedUrl ?? src ?? placeholder);
    })();
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <img
      src={resolved}
      alt={alt}
      loading={loading}
      decoding="async"
      sizes={sizes}
      className={className}
      onError={(e) => {
        const img = e.currentTarget;
        if (!img.src.endsWith(placeholder)) img.src = placeholder;
      }}
    />
  );
}
