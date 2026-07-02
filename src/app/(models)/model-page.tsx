import type { Metadata } from "next";
import PagePlaceholder from "@/components/ui/PagePlaceholder";
import { getTentModelBySlug } from "@/lib/queries";

/**
 * Model sayfaları için ortak veri bağlama katmanı — route group `(models)`.
 *
 * 5 model sayfası (kök URL'lerde, SEO: birebir korunur) aynı deseni kullanır:
 * `tent_models` (env yoksa fallback-content.ts) → başlık + meta + içerik.
 *
 * NOT: Görsel şablon DEĞİL — tasarımlar karar aşamasında. Mevcut
 * PagePlaceholder yapısı korunuyor; model içeriği (description HTML)
 * sade prose blok olarak altına akıtılıyor. Gerçek şablon (spec tablosu,
 * galeri, FAQ accordion, sticky CTA) Faz 2'de porte edilecek.
 */

export async function buildModelMetadata(slug: string): Promise<Metadata> {
  const model = await getTentModelBySlug(slug);
  if (!model) return {};
  return {
    title: model.meta_title ?? model.name,
    description: model.meta_description ?? undefined,
  };
}

export default async function ModelPage({ slug }: { slug: string }) {
  const model = await getTentModelBySlug(slug);

  if (!model) {
    return (
      <PagePlaceholder
        eyebrow="Çadır Modelleri"
        title={slug}
        description="Model içeriği bulunamadı — tent_models tablosu / fallback içerik kontrol edilmeli."
      />
    );
  }

  return (
    <PagePlaceholder
      eyebrow="Çadır Modelleri"
      title={model.name}
      description={model.meta_description ?? undefined}
    >
      {model.description && (
        // Sade prose blok — model şablonu (galeri, spec, FAQ) Faz 2'de
        <div
          style={{ marginTop: 48, maxWidth: 820 }}
          dangerouslySetInnerHTML={{ __html: model.description }}
        />
      )}
    </PagePlaceholder>
  );
}
