import type { Metadata } from "next";
import PagePlaceholder from "@/components/ui/PagePlaceholder";

/**
 * KVKK Aydınlatma Metni — iskelet.
 * Eski sitede (09_Eskisiteyedek SQL yedeği tarandı) KVKK sayfası YOKTU;
 * metin sıfırdan hazırlanacak ve hukuk onayından geçecek.
 * Onaylı metin gelene kadar noindex.
 */
export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "Renta Yapı kişisel verilerin korunması kanunu (KVKK) aydınlatma metni.",
  robots: { index: false, follow: false }, // içerik hukuk onayı bekliyor — onaylanınca kaldır
};

export default function KvkkPage() {
  return (
    <PagePlaceholder
      eyebrow="Yasal"
      title="KVKK Aydınlatma Metni"
      description="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni. İçerik hukuk onayı bekliyor — onaylı metin eklendiğinde bu sayfa yayına alınacak ve noindex kaldırılacak."
    />
  );
}
