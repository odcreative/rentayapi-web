import type { Metadata } from "next";
import PagePlaceholder from "@/components/ui/PagePlaceholder";

/**
 * Çerez Politikası — iskelet.
 * Eski sitede (09_Eskisiteyedek SQL yedeği tarandı) çerez sayfası YOKTU;
 * metin sıfırdan hazırlanacak ve hukuk onayından geçecek.
 * Onaylı metin gelene kadar noindex.
 */
export const metadata: Metadata = {
  title: "Çerez Politikası",
  description: "Renta Yapı web sitesinde kullanılan çerezler ve tercih yönetimi.",
  robots: { index: false, follow: false }, // içerik hukuk onayı bekliyor — onaylanınca kaldır
};

export default function CerezPolitikasiPage() {
  return (
    <PagePlaceholder
      eyebrow="Yasal"
      title="Çerez Politikası"
      description="Sitede kullanılan çerez türleri, kullanım amaçları ve tercihlerinizi nasıl yönetebileceğiniz. İçerik hukuk onayı bekliyor — onaylı metin eklendiğinde bu sayfa yayına alınacak ve noindex kaldırılacak."
    />
  );
}
