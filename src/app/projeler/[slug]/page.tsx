import PagePlaceholder from "@/components/ui/PagePlaceholder";

/**
 * Proje detay sayfası — /projeler/[slug]
 * Veri: `projects` tablosu (galeri, sektör, şehir, model ilişkisi).
 */
export default async function ProjeDetayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <PagePlaceholder
      eyebrow="Referans Proje"
      title={slug}
      description="Proje detay şablonu Faz 3'te (Referans Motoru) kurulacak — galeri, sektör/şehir/model etiketi, ilgili projeler ve teklif CTA'sı."
    />
  );
}
