import type { Metadata } from "next";
import PagePlaceholder from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Projelerimiz",
  description:
    "Mercedes-Benz Fashion Week'ten Growtech'e — Renta Yapı referans projeleri. Sektör, şehir ve modele göre filtreleyin.",
};

/** Filtreli proje galerisi (sektör × şehir × model) — `projects` tablosundan, DB-driven. */
export default function ProjelerimizPage() {
  return (
    <PagePlaceholder
      eyebrow="Referanslar"
      title="Projelerimiz"
      description="Launch'ta ~25-30 küratörlü proje; hedef 85/85. Filtreli galeri Faz 3'te kurulacak."
    />
  );
}
