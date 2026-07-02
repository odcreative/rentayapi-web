import { SITE_SETTINGS } from "@/lib/site-settings";
import { PROD_ORIGIN } from "@/lib/seo/site";

/**
 * Organization + LocalBusiness JSON-LD (schema.org).
 *
 * ENTEGRASYON NOTU (layout sahibi için):
 *   Bu bileşen HENÜZ hiçbir yere mount EDİLMEDİ — layout.tsx JSX'i başka
 *   agent'ların sahipliğinde olduğu için bilinçli olarak dokunulmadı.
 *   Entegrasyon: src/app/layout.tsx <body> içine tek satır:
 *
 *     import OrganizationSchema from "@/components/seo/OrganizationSchema";
 *     ...
 *     <body>
 *       <OrganizationSchema />
 *       ...
 *
 *   Server component'tir, client bundle'a girmez. Site geneli tek kez
 *   render edilmesi yeterlidir (sayfa bazlı Product/FAQ/Article şemaları
 *   Faz 4'te ayrı bileşenler olarak gelecek).
 *
 * Veri kaynağı: src/lib/site-settings.ts statik fallback — Supabase
 * `site_settings` tablosu devreye girince otomatik güncel kalması için
 * oradaki tek kaynaktan besleniyor, burada değer TEKRAR EDİLMEDİ.
 *
 * URL'lerde bilinçli olarak PROD_ORIGIN (www.rentayapi.com) kullanılır:
 * schema'daki kimlik URL'leri preview ortamında bile canonical domain'i
 * göstermelidir.
 */
export default function OrganizationSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${PROD_ORIGIN}/#organization`,
        name: "Renta Yapı",
        legalName: "Renta Yapı",
        url: PROD_ORIGIN,
        logo: `${PROD_ORIGIN}/images/renta-logo.svg`,
        foundingDate: "2010",
        email: SITE_SETTINGS.email,
        telephone: SITE_SETTINGS.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress:
            "Atatürk Mah. Sedef Cad. Ata Blokları 2/4 Kat:5 Daire:172",
          addressLocality: "Ataşehir",
          addressRegion: "İstanbul",
          addressCountry: "TR",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: SITE_SETTINGS.phone,
          email: SITE_SETTINGS.email,
          availableLanguage: ["Turkish"],
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${PROD_ORIGIN}/#localbusiness`,
        name: "Renta Yapı — Kiralık Çadır Sistemleri",
        parentOrganization: { "@id": `${PROD_ORIGIN}/#organization` },
        url: PROD_ORIGIN,
        image: `${PROD_ORIGIN}/images/hero-1.webp`,
        telephone: SITE_SETTINGS.phone,
        email: SITE_SETTINGS.email,
        priceRange: "₺₺",
        address: {
          "@type": "PostalAddress",
          streetAddress:
            "Atatürk Mah. Sedef Cad. Ata Blokları 2/4 Kat:5 Daire:172",
          addressLocality: "Ataşehir",
          addressRegion: "İstanbul",
          addressCountry: "TR",
        },
        areaServed: { "@type": "Country", name: "Türkiye" },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify çıktısı güvenli — kullanıcı girdisi içermiyor
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
