import Hero from "@/components/home/Hero";
import CategoriesSection from "@/components/home/CategoriesSection";
import StatsSection from "@/components/home/StatsSection";
import ProcessSection from "@/components/home/ProcessSection";
import ReferencesSection from "@/components/home/ReferencesSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import ClientLogosSection from "@/components/home/ClientLogosSection";
import BlogSection from "@/components/home/BlogSection";
import CtaSection from "@/components/home/CtaSection";
import { getSiteSettings } from "@/lib/queries";

/**
 * Anasayfa — index-v2.html kurgusu.
 * Section sırası kaynak index-v2 body akışına BİREBİR uyar (Karar #6):
 * Hero → Hakkımızda(=Stats) → Kategoriler → Referanslar → Neden Renta (WhyUs)
 *  → Süreç → Müşteri Logoları → Blog → CTA.
 *
 * Not: index-v2 `.abt` (Hakkımızda) bloğu hakkımızda metni + eylemler +
 * 4 sayaç kartı + görsel kolajın TAMAMINI içerir; bu bütün blok tek
 * component olarak StatsSection'a portlanmıştır (id="hakkimizda"). Ayrı bir
 * Hakkımızda component'ı YOKTUR — mükerrer sayaç riski bu yüzden yok.
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
      <WhyUsSection />
      <ProcessSection />
      <ClientLogosSection />
      <BlogSection />
      <CtaSection />
    </>
  );
}
