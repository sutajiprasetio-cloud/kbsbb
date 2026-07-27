import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import placeholder from "@/assets/news-placeholder.jpg";

/** Extracts the object path when the URL points at our Supabase `media` bucket. */
function mediaPath(url?: string | null) {
  if (!url) return null;
  const m = url.match(/\/storage\/v1\/object\/(?:public|sign)\/media\/([^?]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export function SafeImage({
  src,
  alt,
  className,
  loading = "lazy",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
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
      className={className}
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src !== placeholder) img.src = placeholder;
      }}
    />
  );
}
