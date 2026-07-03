import Hero from "@/components/home/Hero";
import CategoriesSection from "@/components/home/CategoriesSection";
import StatsSection from "@/components/home/StatsSection";
import ProcessSection from "@/components/home/ProcessSection";
import ReferencesSection from "@/components/home/ReferencesSection";
import BlogSection from "@/components/home/BlogSection";
import CtaSection from "@/components/home/CtaSection";
import { getSiteSettings } from "@/lib/queries";

/**
 * Anasayfa — index-v2.html kurgusu.
 * Section sırası kaynak index-v2 body akışına uyar (Karar #6):
 * Hero → Hakkımızda/Stats → Kategoriler → Referanslar → Süreç → Blog → CTA.
 * (index-v2'deki Why ve Logo band'ları henüz portlanmadı — sıraya
 * geldiklerinde Referanslar ile Süreç arasına girecekler.)
 *
 * Site ayarları (tanıtım filmi URL'i) DB-first okunur (site_settings);
 * env/DB yoksa statik fallback (src/lib/site-settings.ts).
 */
export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Hero promoVideoUrl={settings.promo_video_url} />
      <StatsSection promoVideoUrl={settings.promo_video_url} />
      <CategoriesSection />
      <ReferencesSection />
      <ProcessSection />
      <BlogSection />
      <CtaSection />
    </>
  );
}
