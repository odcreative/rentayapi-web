import type { Metadata } from "next";
import PagePlaceholder from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "2010'dan bu yana kiralık çadır sistemleri: Renta Yapı kurumsal, ISO sertifikaları ve firma tarihçesi.",
};

/** Port kaynağı: 01_TASARIM/hakkimizda.html (kurumsal + ISO + timeline) */
export default function HakkimizdaPage() {
  return (
    <PagePlaceholder
      eyebrow="Kurumsal"
      title="Hakkımızda"
      description="16 yıllık tecrübe, ~15 kişilik ekip, Türkiye geneli + yurtdışı kurulum. ISO sertifikaları ve firma timeline'ı bu sayfada yer alacak."
    />
  );
}
