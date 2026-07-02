import type { Metadata } from "next";
import ModelPage, { buildModelMetadata } from "../model-page";

/**
 * Model detay sayfası — KÖK seviyede (/buyuk-cadirlar), mevcut URL birebir korunuyor.
 * Veri: tent_models (env yoksa fallback-content.ts). Görsel şablon Faz 2'de.
 */
const SLUG = "buyuk-cadirlar";

export async function generateMetadata(): Promise<Metadata> {
  return buildModelMetadata(SLUG);
}

export default function Page() {
  return <ModelPage slug={SLUG} />;
}
