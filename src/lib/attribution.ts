/**
 * Attribution (kaynak + UTM) yakalama — client-side util.
 *
 * Mantık (first-touch): kullanıcının oturumdaki İLK sayfa görüntülemesinde
 * URL'deki utm_* parametreleri + referrer + landing page sessionStorage'a
 * yazılır. Sonraki sayfalarda üzerine YAZILMAZ — form hangi sayfadan
 * gönderilirse gönderilsin, ziyaretin orijinal kaynağı korunur.
 *
 * Form submit'te:
 *   - `getAttribution()` → leads.utm (jsonb) kolonuna gider
 *     (utm_source/medium/campaign/term/content + referrer + landing_page)
 *   - `getCurrentPage()` → leads.source_page kolonuna gider
 *     (formun GÖNDERİLDİĞİ sayfa)
 *
 * `captureAttribution()` şimdilik form bileşenlerinin mount'unda çağrılıyor.
 * Sitenin TAMAMINDA first-touch yakalamak için `AttributionTracker`
 * (src/components/forms/AttributionTracker.tsx) ileride layout'a eklenebilir.
 */

const STORAGE_KEY = "renta_attribution_v1";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  /** Site dışından gelen referrer (aynı origin ise yazılmaz) */
  referrer?: string;
  /** Ziyaretin ilk sayfası (path + query) */
  landing_page?: string;
};

/** İlk ziyarette UTM + referrer + landing page'i sessionStorage'a yazar (first-touch). */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  try {
    // First-touch: daha önce yazıldıysa dokunma.
    if (window.sessionStorage.getItem(STORAGE_KEY)) return;

    const attribution: Attribution = {};
    const params = new URLSearchParams(window.location.search);

    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) attribution[key] = value.slice(0, 300);
    }

    if (
      document.referrer &&
      !document.referrer.startsWith(window.location.origin)
    ) {
      attribution.referrer = document.referrer.slice(0, 500);
    }

    attribution.landing_page = (
      window.location.pathname + window.location.search
    ).slice(0, 500);

    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // sessionStorage erişilemez (gizli mod / kısıtlı ortam) — sessizce geç,
    // form attribution'sız da çalışmalı.
  }
}

/** Kaydedilmiş attribution setini döndürür (yoksa boş obje). */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Attribution;
    }
    return {};
  } catch {
    return {};
  }
}

/** Formun gönderildiği sayfa (leads.source_page). */
export function getCurrentPage(): string {
  if (typeof window === "undefined") return "";
  return window.location.pathname.slice(0, 300);
}
