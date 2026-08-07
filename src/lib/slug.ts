/** URL slug helpers — SEO friendly, lowercase, tanpa karakter khusus. */

const CHAR_MAP: Record<string, string> = {
  à: "a", á: "a", â: "a", ã: "a", ä: "a", å: "a",
  è: "e", é: "e", ê: "e", ë: "e",
  ì: "i", í: "i", î: "i", ï: "i",
  ò: "o", ó: "o", ô: "o", õ: "o", ö: "o",
  ù: "u", ú: "u", û: "u", ü: "u",
  ç: "c", ñ: "n", "’": "", "'": "", "`": "",
};

export function slugify(input: string): string {
  return decodeURIComponent(String(input ?? ""))
    .toLowerCase()
    .replace(/[àáâãäåèéêëìíîïòóôõöùúûüçñ’'`]/g, (c) => CHAR_MAP[c] ?? "")
    .replace(/&/g, " dan ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Normalisasi slug dari URL lama (mis. "Khitan%20Berkah" → "khitan-berkah"). */
export const normalizeSlug = (raw: string) => slugify(raw);

export const SITE_URL = "https://kbsbb.lovable.app";

export const canonical = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * Redirect legacy/dirty slugs (spasi/%20, huruf kapital) ke versi bersih.
 * Dipakai di beforeLoad route detail.
 */
export function cleanSlugRedirect(to: string, slug: string) {
  const clean = normalizeSlug(slug);
  return clean && clean !== slug ? clean : null;
}
