import type { NextConfig } from "next";
import path from "path";

/**
 * 301 REDIRECT HARİTASI — SEO migrasyonu (WordPress → Next.js).
 *
 * Kaynaklar:
 *   1. Canlı URL envanteri: 06_MIGRASYON/canli-site-url-envanteri.md
 *   2. Canlı WP'de ZATEN kurulu 301'ler (devralındı):
 *      wpe9_redirection_items + wpe9_rank_math_redirections
 *      (06_MIGRASYON/rentayap_data.sql) — bunlar taşınmazsa yıllardır
 *      backlink taşıyan eski URL'ler 404 olur.
 *
 * İnsan-okur tam harita: app/docs/301-haritasi.md
 *
 * NOT: Birebir korunan URL'ler (5 model sayfası kökte, 31 blog yazısı kökte,
 * 67 proje detayı, 13 şehir sayfası, çekirdek sayfalar) burada YOKTUR —
 * redirect gerektirmezler. Trailing slash farkını Next.js kendisi kalıcı
 * (308) redirect ile çözer, ayrıca kural gerekmez.
 */
const legacyRedirects: Array<{ source: string; destination: string }> = [
  // --- Yapısal / hub birleştirmeleri ---
  { source: "/slider-test", destination: "/" }, // test sayfası — PRODUCT_PLAN §6: silinir
  { source: "/services", destination: "/cadir-modelleri" }, // canlıda da 301'di (2100+ hit)
  { source: "/projeler", destination: "/projelerimiz" }, // hub birleşti; /projeler/:slug korunuyor
  { source: "/locations.kml", destination: "/sehirler" }, // WP local-sitemap kalıntısı

  // --- Canlı WP Redirection eklentisinden devralınan 301'ler ---
  { source: "/depo-cadirlari", destination: "/depo-cadiri" },
  { source: "/kiralik-cadirlar", destination: "/cadir-modelleri" },
  { source: "/iftar-cadiri", destination: "/iftar-cadiri-ve-ramazan-cadiri" },
  { source: "/ramazan-cadiri", destination: "/iftar-cadiri-ve-ramazan-cadiri" },
  {
    source: "/depo-cadirlari-avantajlari-ekonomik-ve-pratik-cozumler",
    destination: "/depo-cadirlari-avantajlari",
  },
  {
    source: "/depo-cadirlarinin-kullanim-alanlari-ve-cozumleri",
    destination: "/depo-cadiri-kullanim-alanlari",
  },
  {
    source: "/depo-cadiri-fiyatlari-nasil-belirlenir",
    destination: "/depo-cadiri-fiyatlari",
  },
  {
    source: "/depo-cadiri-modelleri-hangi-model-size-uygun",
    destination: "/depo-cadir-modelleri",
  },
  {
    source: "/depo-cadiri-nedir-avantajlari-nelerdir",
    destination: "/depo-cadiri-nedir",
  },
  {
    source: "/kiralik-depo-cadirlari-ile-maliyetlerinizi-dusurun",
    destination: "/depo-cadiri-maliyetleri",
  },
  {
    source: "/sanayide-depo-cadiri-kullaniminin-avantajlari",
    destination: "/sanayi-depo-cadiri",
  },
  {
    source: "/depo-cadirlarinin-lojistik-ve-tedarik-zincirindeki-rolu",
    destination: "/lojistik-depo-cadiri",
  },
  {
    source: "/neden-kiralik-cadir-kullanmalisiniz-avantajlari-ve-faydalari",
    destination: "/neden-kiralik-cadir-kullanmalisiniz",
  },
  {
    source: "/etkinlikler-icin-kiralik-cadir-modelleri-ihtiyaciniza-uygun-cozumu-bulun",
    destination: "/etkinlikler-icin-kiralik-cadir-modelleri",
  },

  // --- Rank Math'ten devralınanlar (hedefler semantik iyileştirildi:
  //     canlıda hepsi /iletisim'e gidiyordu, burada doğru sayfalara) ---
  { source: "/cadir-kiralama-hizmetleri-iletisim", destination: "/iletisim" },
  { source: "/cadir-kiralama-iletisim", destination: "/iletisim" },
  { source: "/cadir-kiralamasi-hakkimizda", destination: "/hakkimizda" },
  { source: "/cozumler", destination: "/cadir-modelleri" },
  {
    source: "/etkinlik-cadirlari-cozumler/big-tent-fuar-cadiri",
    destination: "/buyuk-cadirlar",
  },
  {
    source: "/etkinlik-cadirlari-cozumler/pagoda-ramazan-cadiri",
    destination: "/pagoda-cadir",
  },
  { source: "/kiralik-cadir-fiyati-teklif-formu", destination: "/teklif-al" },
  { source: "/teklif-formu", destination: "/teklif-al" },
  // Canlıda da 301'di (canonical → rehber; içerik byte-byte aynı, duplicate)
  { source: "/cadir-fiyatlari-2025", destination: "/cadir-fiyatlari-rehberi-2025" },

  // --- WP arşiv/feed yapıları (kategori: renta-blog-icerikleri,
  //     etkinlik-blog, fuar-blog, depo-cadirlar-blog vb.) ---
  { source: "/category/:path*", destination: "/blog" },
  { source: "/tag/:path*", destination: "/blog" },
  { source: "/author/:path*", destination: "/blog" },
  { source: "/feed", destination: "/blog" },
  { source: "/comments/feed", destination: "/blog" },
];

const nextConfig: NextConfig = {
  // ~/package-lock.json (stray) yüzünden workspace root yanlış çıkarımını engelle
  turbopack: {
    root: path.join(__dirname),
  },

  async redirects() {
    return [
      ...legacyRedirects.map(({ source, destination }) => ({
        source,
        destination,
        permanent: true, // 308 yerine 301 istenirse statusCode: 301; Google ikisini de kalıcı sayar
      })),
      // Eski WP ?p=<id> kısa linkleri — id→slug eşlemesi yapılamıyor,
      // 404 yerine blog hub'ına indir. Sadece kök path + p parametresi.
      {
        source: "/",
        has: [{ type: "query" as const, key: "p" }],
        destination: "/blog",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
