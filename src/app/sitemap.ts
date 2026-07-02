import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/site";
import {
  getCitySlugs,
  getPostSlugs,
  getProjectSlugs,
} from "@/lib/seo/sitemap-data";

/**
 * sitemap.xml — canlı sitenin 6 parçalı sitemap index'inin (page/post/
 * sehirler/project/service/local) tek dosyada karşılığı.
 *
 * Migrasyon disiplini: canlı sitede sıralama taşıyan HİÇBİR URL sitemap'ten
 * düşmez. Supabase env henüz yokken slug'lar canlı URL envanterinden gelen
 * statik fallback listeleridir; env gelince DB slug'ları ile birleşir
 * (bkz. src/lib/seo/sitemap-data.ts — guard'lı helper'lar, kırılmaz).
 *
 * Bilinçli dışarıda bırakılanlar:
 *   - /slider-test  → 301 ile / (test sayfası, PRODUCT_PLAN §6: silinir)
 *   - /services     → 301 ile /cadir-modelleri (canlıda da zaten 301'di)
 *   - /projeler     → 301 ile /projelerimiz (hub birleştirildi)
 *   - /locations.kml→ 301 ile /sehirler (WP local-sitemap kalıntısı)
 *   - /admin, /teklif-al (dönüşüm sayfası, indekslenmesine gerek yok ama
 *     zararsız — şimdilik listede), yasal sayfalar (noindex iskelet)
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // --- Statik çekirdek sayfalar (canlı page-sitemap + yeni route'lar) ---
  const staticPaths: Array<{ path: string; priority: number }> = [
    { path: "/", priority: 1.0 },
    { path: "/cadir-modelleri", priority: 0.9 },
    { path: "/hakkimizda", priority: 0.7 },
    { path: "/iletisim", priority: 0.7 },
    { path: "/teklif-al", priority: 0.8 },
    { path: "/projelerimiz", priority: 0.8 },
    { path: "/sehirler", priority: 0.7 },
    { path: "/blog", priority: 0.7 },
    { path: "/sss", priority: 0.6 },
  ];

  // --- Model sayfaları (kök seviye, canlı industrium_service-sitemap) ---
  const modelPaths = [
    "/depo-cadiri",
    "/buyuk-cadirlar",
    "/pagoda-cadir",
    "/etkinlik-cadiri",
    "/iftar-cadiri-ve-ramazan-cadiri",
  ];

  // --- Dinamikler: env yoksa canlı envanter fallback'i, varsa DB union ---
  const [postSlugs, projectSlugs, citySlugs] = await Promise.all([
    getPostSlugs(),
    getProjectSlugs(),
    getCitySlugs(),
  ]);

  return [
    ...staticPaths.map(({ path, priority }) => ({
      url: absoluteUrl(path),
      lastModified: now,
      priority,
    })),
    ...modelPaths.map((path) => ({
      url: absoluteUrl(path),
      lastModified: now,
      priority: 0.9,
    })),
    ...citySlugs.map((slug) => ({
      url: absoluteUrl(`/sehirler/${slug}`),
      lastModified: now,
      priority: 0.8,
    })),
    ...postSlugs.map((slug) => ({
      url: absoluteUrl(`/${slug}`),
      lastModified: now,
      priority: 0.6,
    })),
    ...projectSlugs.map((slug) => ({
      url: absoluteUrl(`/projeler/${slug}`),
      lastModified: now,
      priority: 0.5,
    })),
  ];
}
