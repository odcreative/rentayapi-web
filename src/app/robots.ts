import type { MetadataRoute } from "next";
import { SITE_URL, isProductionSite } from "@/lib/seo/site";

/**
 * robots.txt — ORTAM BAZLI indeksleme kapısı.
 *
 * Kural (bilinçli tasarım, başka projedeki "lansman sonrası Disallow: /
 * unutuldu, site aylarca indekslenemedi" kazasının dersi):
 *
 *   - NEXT_PUBLIC_SITE_URL prod domain'i (www.rentayapi.com) gösteriyorsa
 *     → allow-all + sitemap referansı. Kod değişikliği GEREKMEZ; go-live
 *     sadece env flip'idir.
 *   - Env yok ya da başka bir şey gösteriyorsa (Vercel preview, staging,
 *     localhost) → tüm site disallow. Preview ortamı yanlışlıkla
 *     indekslenemez.
 *
 * Yani: koda gömülü "geçici disallow" YOK; anahtar tek bir env değişkeni.
 * Go-live checklist: Vercel production env'ine
 * NEXT_PUBLIC_SITE_URL=https://www.rentayapi.com ekle → robots otomatik açılır.
 */
export default function robots(): MetadataRoute.Robots {
  // Preview / staging / env'siz ortam: kapalı kutu.
  if (!isProductionSite()) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  // Production: her şey açık, sadece admin paneli kapalı.
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
