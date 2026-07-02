/**
 * Site ayarları — geçici statik kaynak.
 *
 * Supabase cloud projesi kurulunca bu değerler `site_settings` tablosundan
 * okunacak (key/value jsonb). Şimdilik build'i bloklamamak için statik
 * fallback olarak burada tutuluyor.
 *
 * Kullanım hedefi:
 *   const supabase = await createClient();
 *   const { data } = await supabase
 *     .from("site_settings")
 *     .select("value")
 *     .eq("key", "promo_video_url")
 *     .single();
 */

export const SITE_SETTINGS = {
  /** Tanıtım filmi — YouTube linki veya video dosya URL'i.
   *  Nihai film Renta / ajans arşivinden temin edilecek (PRODUCT_PLAN §13/9). */
  promo_video_url: "",

  phone: "+90 216 504 46 96",
  whatsapp: "+90 544 671 48 87",
  email: "info@rentayapi.com",
  address:
    "Atatürk Mah. Sedef Cad. Ata Blokları 2/4 Kat:5 Daire:172, Ataşehir / İstanbul",
} as const;
