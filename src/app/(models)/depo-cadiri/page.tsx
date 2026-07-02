import type { Metadata } from "next";
import ModelPage, { buildModelMetadata } from "../model-page";

/**
 * Model detay sayfası — KÖK seviyede (/depo-cadiri), mevcut URL birebir korunuyor.
 * (Öncelikli SEO optimizasyonu: CTR anomalisi.)
 * Veri: tent_models (env yoksa fallback-content.ts). Görsel şablon Faz 2'de.
 */
const SLUG = "depo-cadiri";

export async function generateMetadata(): Promise<Metadata> {
  return buildModelMetadata(SLUG);
}

export default function Page() {
  return <ModelPage slug={SLUG} />;
}
