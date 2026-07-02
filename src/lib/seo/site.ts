/**
 * Site URL / ortam yardımcıları — SEO altyapısının tek kaynağı.
 *
 * NEXT_PUBLIC_SITE_URL:
 *   - Production (go-live)  → https://www.rentayapi.com
 *   - Preview / staging     → Vercel preview URL'i veya hiç set edilmemiş
 *
 * Go-live checklist'ine EKLE: Vercel production env'ine
 * NEXT_PUBLIC_SITE_URL=https://www.rentayapi.com yazılmadan robots.txt
 * tüm siteyi disallow eder (bilinçli güvenlik varsayılanı — aşağıya bak).
 */

/** Canlı domain — canonical origin (www'lu). */
export const PROD_ORIGIN = "https://www.rentayapi.com";

/**
 * Mutlak URL üretiminde kullanılacak origin.
 * Env yoksa metadataBase için PROD_ORIGIN'e düşer (zararsız);
 * indeksleme kararı için ASLA bu fallback kullanılmaz → isProductionSite().
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? PROD_ORIGIN).replace(
  /\/+$/,
  ""
);

/**
 * İndeksleme kapısı: SADECE env açıkça prod domain'i gösteriyorsa true.
 *
 * Neden default-disallow? Preview/staging ortamları yanlışlıkla Google'a
 * açılmasın diye. Neden hardcode-disallow DEĞİL? Başka bir projede lansman
 * öncesi robots.txt'e elle yazılan `Disallow: /` go-live'da unutuldu ve tüm
 * site indekslenemedi. Burada anahtar env'de: prod'da NEXT_PUBLIC_SITE_URL
 * set edilince robots otomatik allow-all olur, kod değişikliği gerekmez.
 */
export function isProductionSite(): boolean {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  return raw === PROD_ORIGIN || raw === "https://rentayapi.com";
}

/** Path'ten mutlak URL üret ("/iletisim" → "https://www.rentayapi.com/iletisim"). */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
