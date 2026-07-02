import type { Metadata } from "next";
import PagePlaceholder from "@/components/ui/PagePlaceholder";

/**
 * Gizlilik Politikası — iskelet.
 * Eski sitede (09_Eskisiteyedek SQL yedeği tarandı) gizlilik sayfası YOKTU;
 * metin sıfırdan hazırlanacak ve hukuk onayından geçecek.
 * Onaylı metin gelene kadar noindex.
 */
export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "Renta Yapı gizlilik politikası ve veri işleme esasları.",
  robots: { index: false, follow: false }, // içerik hukuk onayı bekliyor — onaylanınca kaldır
};

export default function GizlilikPolitikasiPage() {
  return (
    <PagePlaceholder
      eyebrow="Yasal"
      title="Gizlilik Politikası"
      description="Kişisel verilerinizin hangi amaçlarla işlendiğini ve nasıl korunduğunu açıklayan gizlilik politikası. İçerik hukuk onayı bekliyor — onaylı metin eklendiğinde bu sayfa yayına alınacak ve noindex kaldırılacak."
    />
  );
}
