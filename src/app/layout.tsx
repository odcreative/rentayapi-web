import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AttributionTracker from "@/components/forms/AttributionTracker";
import OrganizationSchema from "@/components/seo/OrganizationSchema";
import { SITE_URL, isProductionSite } from "@/lib/seo/site";

// Manrope variable font — 300-800 aralığı (design system: 300/400/500/600/700/800)
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  display: "swap",
});

/**
 * Site geneli metadata temeli (SEO migrasyon — Faz 4 öne çekildi).
 * Sayfa bazlı title/description'lar template'e oturur ("%s | Renta Yapı").
 * metadataBase → og:image / canonical gibi relatif URL'ler mutlaklaşır.
 * robots → indeksleme kapısı env bazlı (bkz. src/lib/seo/site.ts +
 * src/app/robots.ts): preview/staging'de noindex, prod'da index.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Renta Yapı — Kiralık Çadır Sistemleri ve Çadır Kiralama",
    template: "%s | Renta Yapı",
  },
  description:
    "Depo çadırı, etkinlik çadırı, hangar ve endüstriyel çadır kiralama ve satış. 16 yıllık tecrübe, Türkiye geneli kurulum, 72 saatte anahtar teslim.",
  applicationName: "Renta Yapı",
  keywords: [
    "çadır kiralama",
    "kiralık çadır",
    "depo çadırı",
    "etkinlik çadırı",
    "endüstriyel çadır",
    "pagoda çadır",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Renta Yapı",
    title: "Renta Yapı — Kiralık Çadır Sistemleri ve Çadır Kiralama",
    description:
      "Depo çadırı, etkinlik çadırı, hangar ve endüstriyel çadır kiralama ve satış. 16 yıllık tecrübe, Türkiye geneli kurulum, 72 saatte anahtar teslim.",
  },
  robots: isProductionSite()
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AttributionTracker />
        <OrganizationSchema />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
