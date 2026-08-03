import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SectionId =
  | "hero"
  | "about"
  | "programs"
  | "impact_stats"
  | "campaigns"
  | "events"
  | "gallery"
  | "testimonials"
  | "partners"
  | "news"
  | "faq"
  | "cta_donate"
  | "contact";

export const HOMEPAGE_SECTIONS: { id: SectionId; label: string; description: string }[] = [
  { id: "hero", label: "Hero Slider", description: "Slider utama di bagian paling atas beranda." },
  { id: "about", label: "Tentang Kami", description: "Ringkasan profil dan visi yayasan." },
  { id: "programs", label: "Program Kami", description: "Daftar program unggulan." },
  { id: "impact_stats", label: "Statistik Dampak", description: "Angka dampak (data tetap tersimpan saat nonaktif)." },
  { id: "campaigns", label: "Program Donasi", description: "Kampanye donasi aktif beserta progres dana." },
  { id: "events", label: "Kegiatan Mendatang", description: "Agenda kegiatan yang dipublikasikan." },
  { id: "gallery", label: "Galeri", description: "Pratinjau foto kegiatan." },
  { id: "testimonials", label: "Testimoni", description: "Kutipan dari penerima manfaat dan mitra." },
  { id: "partners", label: "Mitra & Donatur", description: "Logo mitra berjalan (marquee)." },
  { id: "news", label: "Berita Terbaru", description: "Tiga berita terbaru." },
  { id: "faq", label: "FAQ", description: "Pertanyaan yang sering diajukan." },
  { id: "cta_donate", label: "Call To Action Donasi", description: "Ajakan berdonasi dengan tombol." },
  { id: "contact", label: "Kontak", description: "Newsletter dan peta lokasi kantor." },
];

export const DEFAULT_ORDER: SectionId[] = HOMEPAGE_SECTIONS.map((s) => s.id);

/** Sections that were not part of the original homepage default to off. */
export const DEFAULT_ENABLED: Record<SectionId, boolean> = {
  hero: true,
  about: false,
  programs: true,
  impact_stats: true,
  campaigns: true,
  events: true,
  gallery: false,
  testimonials: true,
  partners: true,
  news: true,
  faq: false,
  cta_donate: false,
  contact: true,
};

export const truthy = (v: any, fallback = true) => {
  if (v === undefined || v === null || v === "") return fallback;
  return v !== false && v !== "false" && v !== 0 && v !== "0";
};

export type HomepageConfig = { order: SectionId[]; enabled: Record<SectionId, boolean> };

export function normalizeConfig(raw: any): HomepageConfig {
  const value = raw ?? {};
  const rawOrder: SectionId[] = Array.isArray(value.order) ? value.order : [];
  const order = [
    ...rawOrder.filter((id) => DEFAULT_ORDER.includes(id)),
    ...DEFAULT_ORDER.filter((id) => !rawOrder.includes(id)),
  ];
  const enabled = {} as Record<SectionId, boolean>;
  for (const id of DEFAULT_ORDER) {
    enabled[id] = truthy(value[`show_${id}`], DEFAULT_ENABLED[id]);
  }
  return { order, enabled };
}

export function serializeConfig(cfg: HomepageConfig): Record<string, any> {
  const out: Record<string, any> = { order: cfg.order };
  for (const id of DEFAULT_ORDER) out[`show_${id}`] = !!cfg.enabled[id];
  return out;
}

export function useHomepageConfig() {
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "homepage").maybeSingle();
      if (!cancelled) setConfig(normalizeConfig((data as any)?.value));
    })();
    return () => { cancelled = true; };
  }, []);
  return config;
}
