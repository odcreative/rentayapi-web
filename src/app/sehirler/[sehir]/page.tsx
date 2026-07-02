import PagePlaceholder from "@/components/ui/PagePlaceholder";

/**
 * Şehir landing sayfası — /sehirler/[sehir]
 * 13 mevcut şehir taşınacak + 8 yeni şehir post-launch. Veri: `cities` tablosu.
 * NOT: Canlı sitedeki şehir URL yapısı migrasyonda birebir doğrulanacak;
 * gerekirse 301 haritasına eklenir.
 */
export default async function SehirPage({
  params,
}: {
  params: Promise<{ sehir: string }>;
}) {
  const { sehir } = await params;
  return (
    <PagePlaceholder
      eyebrow="Şehirler"
      title={`Kiralık Çadır — ${sehir}`}
      description="Şehir landing şablonu Faz 4'te kurulacak — içerik blokları + o şehirdeki referans projeler."
    />
  );
}
