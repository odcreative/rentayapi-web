import Hero from "@/components/home/Hero";
import CategoriesSection from "@/components/home/CategoriesSection";
import StatsSection from "@/components/home/StatsSection";
import ProcessSection from "@/components/home/ProcessSection";
import ReferencesSection from "@/components/home/ReferencesSection";
import BlogSection from "@/components/home/BlogSection";
import CtaSection from "@/components/home/CtaSection";

/**
 * Anasayfa — index-v2.html kurgusu.
 * Hero (v1, birebir port) + placeholder section'lar; her section
 * Faz 1-3'te index-v2'deki gerçek tasarımıyla değiştirilecek.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <StatsSection />
      <ProcessSection />
      <ReferencesSection />
      <BlogSection />
      <CtaSection />
    </>
  );
}
