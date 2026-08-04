import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMediaUrl } from "@/components/safe-image";
import defaultLogo from "@/assets/logo.png";

export type Branding = {
  logo_header: string;
  logo_footer: string;
  favicon: string;
  site_name: string;
  tagline: string;
};

export const DEFAULT_BRANDING: Branding = {
  logo_header: "",
  logo_footer: "",
  favicon: "",
  site_name: "KBSBB",
  tagline: "Komunitas Berbagi Sehat · Berbagi Berkah",
};

export function normalizeBranding(raw: any, legacy?: any): Branding {
  const v = raw ?? {};
  const l = legacy ?? {};
  return {
    logo_header: v.logo_header ?? l.logo_url ?? "",
    logo_footer: v.logo_footer ?? l.logo_url ?? "",
    favicon: v.favicon ?? l.favicon_url ?? "",
    site_name: v.site_name ?? l.site_name ?? DEFAULT_BRANDING.site_name,
    tagline: v.tagline ?? l.tagline ?? DEFAULT_BRANDING.tagline,
  };
}

/** Reads branding from the CMS (falls back to legacy `general` settings). */
export function useBranding(): Branding {
  const [branding, setBranding] = useState<Branding>(DEFAULT_BRANDING);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    window.addEventListener("kbsbb-branding-updated", bump);
    window.addEventListener("focus", bump);
    return () => {
      window.removeEventListener("kbsbb-branding-updated", bump);
      window.removeEventListener("focus", bump);
    };
  }, []);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("site_settings").select("key, value").in("key", ["branding", "general"]);
      if (cancelled) return;
      const map: Record<string, any> = {};
      (data ?? []).forEach((r: any) => { map[r.key] = r.value ?? {}; });
      setBranding(normalizeBranding(map.branding, map.general));
    })();
    return () => { cancelled = true; };
  }, [tick]);
  return branding;
}

/** Resolves a branding logo value to a usable URL, falling back to the bundled logo. */
export function useBrandLogo(src?: string | null) {
  const resolved = useMediaUrl(src || undefined);
  return src ? resolved : defaultLogo;
}

/** Applies the CMS favicon to the browser tab. */
export function useFavicon(src?: string | null) {
  const resolved = useMediaUrl(src || undefined);
  useEffect(() => {
    if (!src || !resolved) return;
    if (typeof document === "undefined") return;
    const links = Array.from(document.querySelectorAll<HTMLLinkElement>("link[rel~='icon']"));
    links.forEach((l) => l.parentNode?.removeChild(l));
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = resolved;
    document.head.appendChild(link);
  }, [src, resolved]);
}
