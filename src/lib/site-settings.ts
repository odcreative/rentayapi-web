/**
 * Site ayarları — STATİK FALLBACK + tipler.
 *
 * DB-birincil okuma `src/lib/queries.ts` → `getSiteSettings()`:
 * server tarafında `site_settings` tablosundan okur (key/value jsonb:
 * `promo_video_url` + `contact`), env yoksa / sorgu hata verirse buradaki
 * statik değerlere düşer. Site hiçbir koşulda boş ayarla kalmaz.
 *
 * Bu dosya client-safe'tir (server import'u YOK): client component'ler
 * prop gelmediğinde varsayılan olarak bu sabitleri kullanır.
 *
 * Sunucu tarafında kullanım:
 *   import { getSiteSettings } from "@/lib/queries";
 *   const settings = await getSiteSettings(); // DB-first + fallback
 */

/** `site_settings` tablosundan birleştirilmiş, kod tarafında düz obje. */
export type SiteSettings = {
  /** Tanıtım filmi — YouTube linki veya video dosya URL'i ("" = henüz yok). */
  promo_video_url: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
};

/** Form component'lerinin ihtiyaç duyduğu alt küme. */
export type SiteContact = Pick<SiteSettings, "phone" | "whatsapp">;

/** Statik fallback — DB'ye erişilemezse son çare tek kaynak. */
export const SITE_SETTINGS: SiteSettings = {
  /** Nihai film Renta / ajans arşivinden temin edilecek (PRODUCT_PLAN §13/9). */
  promo_video_url: "",

  phone: "+90 216 504 46 96",
  whatsapp: "+90 544 671 48 87",
  email: "info@rentayapi.com",
  address:
    "Atatürk Mah. Sedef Cad. Ata Blokları 2/4 Kat:5 Daire:172, Ataşehir / İstanbul",
};
