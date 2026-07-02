import type { Metadata } from "next";
import PagePlaceholder from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description:
    "Çadır kiralama süreçleri, fiyatlandırma, kurulum süreleri ve teknik özellikler hakkında sıkça sorulan sorular.",
};

/** Port kaynağı: 01_TASARIM/sss.html — FAQ schema (JSON-LD) ile. Veri: `faqs` tablosu. */
export default function SssPage() {
  return (
    <PagePlaceholder
      eyebrow="Destek"
      title="Sıkça Sorulan Sorular"
      description="FAQ accordion + FAQPage schema Faz 1'de porte edilecek."
    />
  );
}
