/**
 * Sitemap veri katmanı — Supabase hazır olana kadar canlı URL envanteri
 * fallback'i ile çalışır; env geldiğinde DB slug'ları ile BİRLEŞTİRİR
 * (union). Amaç: migrasyonda sıralama taşıyan hiçbir canlı URL'in
 * sitemap'ten düşmemesi (PRODUCT_PLAN §6 — birebir koruma disiplini).
 *
 * Kaynak envanter: 06_MIGRASYON/canli-site-url-envanteri.md (2 Tem 2026,
 * canlı sitemap_index.xml). Bu listeler oradan script ile üretildi —
 * elle düzenleme yerine envanteri güncelleyip yeniden üretmek daha güvenli.
 *
 * NOT: "buyuk-cadilar-2025", "endustiryel-cadir-rehberi",
 * "kocaeli-cadir-kiramala-kermes" gibi yazım hatalı görünen slug'lar
 * BİLEREK böyle — canlı URL'ler birebir bunlar.
 */

import { createClient } from "@supabase/supabase-js";

/**
 * Canlı sitedeki kök-seviye blog yazısı slug'ları (post-sitemap).
 * NOT: "cadir-fiyatlari-2025" bilinçli YOK — canlıda 301 →
 * /cadir-fiyatlari-rehberi-2025 (next.config.ts redirect'i devraldı).
 * Ek: "kisa-dayanikli-depo-cadiri" canlı sitemap'te yoktu ama DB dump'ta
 * publish'ti (muhtemel sitemap eksiği) — içerik korunduğu için listede.
 */
export const LIVE_POST_SLUGS: readonly string[] = [
  "stand-cadiri-rehberi",
  "parti-cadiri-kiralama",
  "koridor-yuruyus-yolu",
  "cadir-fiyatlari-rehberi-2025",
  "kisa-dayanikli-depo-cadiri",
  "buyuk-cadilar-2025",
  "istanbul-cadir-kiralama-fiyatlari-2025",
  "etkinlik-cadir-kiralama",
  "sandvic-panel-depo-vs-endustriyel-cadir",
  "endustiryel-cadir-rehberi",
  "depo-cadiri-metraj-hesabi",
  "pagoda-cadir-olculeri",
  "cadir-iklimlendirme-2025",
  "protokol-cadiri",
  "zemin-podyum",
  "kislik-cadir-ve-izolasyon-cozumleri",
  "kiralik-cadir-icin-sorulmasi-gerekenler",
  "cadir-kiralama-fiyatlari",
  "depo-cadirlari-avantajlari",
  "depo-cadiri-maliyetleri",
  "kiralik-cadir-secimi",
  "etkinlikler-icin-kiralik-cadir-modelleri",
  "neden-kiralik-cadir-kullanmalisiniz",
  "lojistik-depo-cadiri",
  "sanayi-depo-cadiri",
  "depo-cadiri-nedir",
  "depo-cadir-modelleri",
  "depo-cadiri-fiyatlari",
  "depo-cadiri-kullanim-alanlari",
  "kurumsal-etkinlikler-cadir-modelleri",
  "kiralik-cadir-modelleri-ve-avantajlari",
] as const;

/** Canlı sitedeki 13 şehir landing slug'ı (/sehirler/<slug>). */
export const LIVE_CITY_SLUGS: readonly string[] = [
  "adana-kiralik-cadir",
  "sivas-kiralik-cadir",
  "mersin-kiralik-cadir",
  "izmir-kiralik-cadir",
  "istanbul-kiralik-cadir",
  "antalya-kiralik-cadir",
  "ankara-kiralik-cadir",
  "kocaeli-kiralik-cadir",
  "ordu-kiralik-cadir",
  "trabzon-kiralik-cadir",
  "bursa-kiralik-cadir",
  "bodrum-kiralik-cadir",
  "gebze-kiralik-cadir",
] as const;

/** Canlı sitedeki 67 proje detay slug'ı (/projeler/<slug>). */
export const LIVE_PROJECT_SLUGS: readonly string[] = [
  "uluslararasi-etkinlikler",
  "etkinlikler",
  "2017-deaflympics-oyunlari-samsun-kiralik-cadir",
  "ido-yalova-iskele-kanopisi",
  "uluslararasi-iplik-fuari-2024",
  "depo-cadir-turleri-bandirma-depo-cadiri",
  "ido-bandirma-giris-kanopisi",
  "hatay-cadir-kiralama",
  "elazig-ramazan-cadirlari-2018",
  "elazig-iftar-cadirlari-2017",
  "yemekhane-cadiri-emsey-hospital",
  "sivas-cadir-kiralama",
  "seffaf-cadir-bodrum-dugun",
  "outlet-cadiri-istanbul",
  "mersin-kiralik-cadir-2013-akdeniz-oyunlari",
  "mercedes-benz-fashion-week-2016",
  "malatya-kiralik-cadir-kitap-fuari",
  "kocaeli-cadir-kiramala-kermes",
  "sivas-iftar-cadiri",
  "etnospor-oyunlari-2019",
  "dolmabahce-sarayi-guvenlik-cadiri",
  "depo-cadiri-bursa",
  "depo-cadiri-asas-thermo-roof-catili",
  "dentur-besiktas-iskele-kanopisi",
  "canakkale-depo-cadiri",
  "baku-2015-european-games-baku-cadir-kiralama",
  "asfa-koleji-celik-cadir",
  "antalya-kiralik-cadir-growtech-2015",
  "ankara-ramazan-cadiri",
  "cadir-kiralama-tuzla-yatch-show-2018",
  "fuar-referanslari",
  "depo-cadir-referanslar",
  "antalya-kiralik-cadir-growtech-2024",
  "2024-adana-teknofest",
  "golf-turnuvasi-antalya-2017",
  "golf-turnuvasi-antalya-cadir-kiralama",
  "manisa-kiralik-cadir",
  "kiralik-toren-cadiri-isik-universitesi-mezuniyetis",
  "kiralik-fuar-cadiri-polatli-tarim-fuari",
  "kiralik-cadirlar-tuzla-boatshow-2019",
  "gebze-kermes-kiralik-cadir",
  "fuar-cadirlari-tuzla-boatshow-2018",
  "europort-kiralik-fuar-cadiri",
  "cadir-kiralama-hizmeti-izfas-2019",
  "bigboyz-festivali",
  "antalya-kiralik-cadir-growtech-2019",
  "borusan-golcuk-depo-cadiri",
  "ankara-kiralik-cadir-iyi-parti",
  "vodafone-dijital-donusum-zirvesi-istanbul-cadir-kiralama",
  "istanbul-kiralik-cadir-fashion-week",
  "trabzon-kiralik-cadir-kermes",
  "bodrum-kiralik-cadir-yatch-show",
  "ankara-kiralik-cadir-komatek-fuari",
  "istanbul-kiralik-cadir-smartcity",
  "izmir-kiralik-cadir-izfas-mermer-fuari",
  "bursa-cadir-kiralama-tuyap-fuari",
  "antalya-kiralik-cadir-growtech-fuari",
  "rize-cadir-kiralama-kermes",
  "turkish-airlens-open-golf-turnuvasi-2018",
  "turkish-airlines-open-golf-turnuvasi",
  "kiralik-cadir-ordu-fuar-cadiri",
  "turkmenistan-cadir-kiralama-nevruz-bayrami",
  "platform-kiralama-sertap-erener-konseri",
  "dugun-cadirlari-antalya",
  "cadir-kiralama-tuzla-yatch-show-2015-2019",
  "bursa-kiralik-cadir",
  "2011-dunya-universiteler-kis-oyunlari-erzurum",
] as const;

/* ------------------------------------------------------------------ */

type SlugRow = { slug: string };

/**
 * Guard'lı Supabase client — env yoksa null döner, sitemap build'i
 * KIRILMAZ (cloud proje henüz kurulmadı; STATUS.md "Bilinen Eksikler").
 */
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/** DB slug'larını fallback listesiyle birleştirir (sıra: fallback + yeni). */
function mergeSlugs(fallback: readonly string[], fromDb: string[]): string[] {
  return [...new Set([...fallback, ...fromDb])];
}

/** Yayınlanmış blog yazısı slug'ları (posts.published_at <= now). */
export async function getPostSlugs(): Promise<string[]> {
  const supabase = getSupabase();
  if (!supabase) return [...LIVE_POST_SLUGS];
  try {
    const { data } = await supabase
      .from("posts")
      .select("slug")
      .not("published_at", "is", null);
    return mergeSlugs(LIVE_POST_SLUGS, (data as SlugRow[] | null)?.map((r) => r.slug) ?? []);
  } catch {
    return [...LIVE_POST_SLUGS];
  }
}

/** Yayınlanmış proje slug'ları (projects.published = true). */
export async function getProjectSlugs(): Promise<string[]> {
  const supabase = getSupabase();
  if (!supabase) return [...LIVE_PROJECT_SLUGS];
  try {
    const { data } = await supabase
      .from("projects")
      .select("slug")
      .eq("published", true);
    return mergeSlugs(LIVE_PROJECT_SLUGS, (data as SlugRow[] | null)?.map((r) => r.slug) ?? []);
  } catch {
    return [...LIVE_PROJECT_SLUGS];
  }
}

/** Yayınlanmış şehir slug'ları (cities.published = true). */
export async function getCitySlugs(): Promise<string[]> {
  const supabase = getSupabase();
  if (!supabase) return [...LIVE_CITY_SLUGS];
  try {
    const { data } = await supabase
      .from("cities")
      .select("slug")
      .eq("published", true);
    return mergeSlugs(LIVE_CITY_SLUGS, (data as SlugRow[] | null)?.map((r) => r.slug) ?? []);
  } catch {
    return [...LIVE_CITY_SLUGS];
  }
}
