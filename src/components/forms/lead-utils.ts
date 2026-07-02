/**
 * Lead formları — ortak sabitler ve doğrulama yardımcıları.
 * Hem client (form bileşenleri) hem server (leads.ts server action)
 * tarafından kullanılır; framework'süz saf fonksiyonlar.
 */

/** Çadır modeli seçenekleri — slug'lar 0001_initial_schema.sql seed'i ile birebir. */
export const TENT_MODEL_OPTIONS = [
  { slug: "etkinlik-cadiri", label: "Etkinlik Çadırı" },
  { slug: "depo-cadiri", label: "Depo Çadırı" },
  { slug: "buyuk-cadirlar", label: "Büyük Çadırlar" },
  { slug: "pagoda-cadir", label: "Pagoda Çadır" },
  { slug: "iftar-cadiri-ve-ramazan-cadiri", label: "İftar / Ramazan Çadırı" },
] as const;

export type TentModelSlug = (typeof TENT_MODEL_OPTIONS)[number]["slug"];

/** "Emin değilim" seçeneği — DB'de karşılığı yok, tent_model_id null gider. */
export const MODEL_UNSURE = "emin-degilim";

export function getModelLabel(slug: string): string {
  return (
    TENT_MODEL_OPTIONS.find((m) => m.slug === slug)?.label ??
    (slug === MODEL_UNSURE ? "Emin değilim" : slug)
  );
}

/** Sadece rakamları bırakır. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * TR telefon doğrulama + normalize.
 * Kabul: +90 5xx..., 0 5xx..., 5xx..., 0216..., (0216) 504 46 96 vb.
 * Geçerliyse "+90XXXXXXXXXX" (10 hane) döner, değilse null.
 */
export function normalizeTrPhone(raw: string): string | null {
  const cleaned = raw.replace(/[\s().-]/g, "");
  const match = /^(?:\+90|0090|90|0)?([2-9]\d{9})$/.exec(cleaned);
  return match ? `+90${match[1]}` : null;
}

/** Basit e-posta format kontrolü (zod'suz, pragmatik). */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

/**
 * m² alanını parse eder.
 * boş → null; geçersiz/negatif/absürt büyük → "invalid"; geçerli → number.
 */
export function parseArea(raw: string): number | null | "invalid" {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const num = Number(trimmed.replace(",", "."));
  if (!Number.isFinite(num) || num <= 0 || num > 1_000_000) return "invalid";
  return num;
}

/** YYYY-MM-DD format kontrolü (input type="date" çıktısı). */
export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}

/** "+90 544 671 48 87" → "https://wa.me/905446714887?text=..." */
export function buildWhatsAppUrl(phone: string, text?: string): string {
  const base = `https://wa.me/${digitsOnly(phone)}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
