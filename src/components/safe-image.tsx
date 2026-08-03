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

/** Resolves a media value (storage path or URL) into a usable image URL. */
export function useMediaUrl(src?: string | null) {
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

  return resolved;
}

/** Tailwind object-fit class for a stored display_mode value. */
export function fitClass(mode?: string | null) {
  const m = (mode ?? "").trim();
  if (m === "contain") return "object-contain object-center";
  if (m === "fill") return "object-fill";
  return "object-cover object-center";
}

/**
 * Image that honours a per-record `display_mode` ("cover" | "contain" | "fill").
 * `className` sizes the frame; `imgClassName` adds effects (e.g. hover scale).
 */
export function ModeImage({
  src,
  alt,
  mode,
  className,
  imgClassName,
  loading = "lazy",
}: {
  src?: string | null;
  alt: string;
  mode?: string | null;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
}) {
  const url = useMediaUrl(src);
  const m = (mode ?? "").trim() || "cover";

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      {m === "contain" && (
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center"
          style={{ backgroundImage: `url("${url}")`, filter: "blur(20px)", opacity: 0.3 }}
          aria-hidden
        />
      )}
      <SafeImage
        src={src}
        alt={alt}
        loading={loading}
        className={`absolute inset-0 h-full w-full ${fitClass(m)} ${imgClassName ?? ""}`}
      />
    </div>
  );
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
  const resolved = useMediaUrl(src);


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
