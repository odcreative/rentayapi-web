import type { Metadata } from "next";
import Link from "next/link";
import PagePlaceholder from "@/components/ui/PagePlaceholder";
import { getTentModels } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Çadır Modelleri",
  description:
    "Etkinlik çadırı, depo çadırı, büyük çadırlar, pagoda ve iftar çadırı — kiralık çadır modelleri ve teknik özellikleri.",
};

/**
 * Model hub — /cadir-modelleri
 * Liste `tent_models` tablosundan (env yoksa fallback-content.ts) gelir;
 * model URL'leri kök seviyede korunur (SEO migrasyon disiplini).
 * Kart/grid tasarım pası Faz 2'de.
 */
export default async function CadirModelleriPage() {
  const models = await getTentModels();

  return (
    <PagePlaceholder
      eyebrow="Model Hub"
      title="Çadır Modelleri"
      description="5 mevcut model + 5 quick-win yeni sayfa (fuar/stand/şantiye/kubbeli/afet) tent_models tablosundan beslenir."
    >
      <ul style={{ marginTop: 32, display: "grid", gap: 18, listStyle: "none", padding: 0 }}>
        {models.map((m) => (
          <li key={m.slug}>
            <Link
              href={`/${m.slug}`}
              style={{ color: "var(--red)", fontWeight: 700, fontSize: 16 }}
            >
              {m.name} →
            </Link>
            {m.meta_description && (
              <p style={{ marginTop: 4, maxWidth: 640, color: "var(--muted)", fontSize: 14.5 }}>
                {m.meta_description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </PagePlaceholder>
  );
}
