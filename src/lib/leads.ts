"use server";

/**
 * Lead server action — teklif ve iletişim formlarının tek gönderim noktası.
 *
 * Akış:
 *   1. Anti-spam: honeypot dolu VEYA form insanüstü hızda doldurulmuşsa
 *      sessizce "başarılı" döner (bot'a ipucu verme), INSERT yapılmaz.
 *   2. Server-side doğrulama (client'takinin aynası — lead-utils.ts).
 *   3. Supabase env YOKSA / placeholder ise: zarif fallback döner
 *      (WhatsApp + telefon) — kullanıcıya teknik hata gösterilmez.
 *   4. model slug → tent_models.id lookup (RLS gereği model unpublished ise
 *      bulunamayabilir → model bilgisi mesajın başına yazılır, kaybolmaz).
 *   5. `leads` INSERT (RLS: public INSERT'e açık). Hata → yine zarif fallback.
 */

import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/queries";
import {
  buildWhatsAppUrl,
  getModelLabel,
  isValidEmail,
  isValidIsoDate,
  normalizeTrPhone,
  parseArea,
  TENT_MODEL_OPTIONS,
} from "@/components/forms/lead-utils";

/** Bundan kısa sürede doldurulan form büyük ihtimalle bot'tur. */
const MIN_FILL_MS = 3000;

const UTM_ALLOWED_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "referrer",
  "landing_page",
] as const;

export type LeadFormInput = {
  name: string;
  company?: string;
  phone: string;
  email?: string;
  /** tent_models.slug veya null ("Emin değilim" / iletişim formu) */
  model_slug?: string | null;
  /** Ham string gelir (input value), server parse eder */
  area_m2?: string | null;
  /** YYYY-MM-DD veya null */
  event_date?: string | null;
  message?: string;
  /** Formun gönderildiği sayfa (attribution.getCurrentPage) */
  source_page?: string;
  /** First-touch UTM seti (attribution.getAttribution) */
  utm?: Record<string, string | undefined>;
  /** Honeypot — insanlar görmez ve doldurmaz */
  website?: string;
  /** Form açılışından submit'e geçen süre (ms) */
  elapsed_ms?: number;
};

export type SubmitLeadResult =
  | { ok: true }
  | { ok: false; code: "validation"; fieldErrors: Record<string, string> }
  | {
      ok: false;
      code: "unavailable";
      /** Kullanıcıya gösterilecek zarif mesaj */
      message: string;
      whatsappUrl: string;
      phone: string;
    };

/** Env var mı ve placeholder değil mi? (.env.local.example: YOUR_PROJECT_REF) */
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return (
    url.startsWith("https://") &&
    !url.includes("YOUR_") &&
    key.length > 20 &&
    !key.includes("YOUR_")
  );
}

async function unavailableResult(input?: LeadFormInput): Promise<SubmitLeadResult> {
  const parts = ["Merhaba, web sitenizden teklif talebi göndermek istedim."];
  if (input?.model_slug) parts.push(`Model: ${getModelLabel(input.model_slug)}.`);
  if (input?.area_m2?.trim()) parts.push(`Tahmini alan: ${input.area_m2.trim()} m².`);
  if (input?.name?.trim()) parts.push(`Ad: ${input.name.trim()}.`);

  // DB-first iletişim bilgisi; env/DB yoksa getSiteSettings kendi içinde
  // statik fallback'e düşer — burada ek guard gerekmez.
  const settings = await getSiteSettings();

  return {
    ok: false,
    code: "unavailable",
    message:
      "Formu şu an ulaştıramadık. Dilerseniz WhatsApp üzerinden veya telefonla hemen ulaşabilirsiniz.",
    whatsappUrl: buildWhatsAppUrl(settings.whatsapp, parts.join(" ")),
    phone: settings.phone,
  };
}

export async function submitLead(input: LeadFormInput): Promise<SubmitLeadResult> {
  // --- 1) Anti-spam: sessiz düşür ------------------------------------
  const isBot =
    Boolean(input.website && input.website.trim().length > 0) ||
    (typeof input.elapsed_ms === "number" && input.elapsed_ms < MIN_FILL_MS);
  if (isBot) return { ok: true };

  // --- 2) Server-side doğrulama --------------------------------------
  const fieldErrors: Record<string, string> = {};

  const name = (input.name ?? "").trim().slice(0, 200);
  if (name.length < 2) fieldErrors.name = "Lütfen adınızı ve soyadınızı yazın.";

  const phone = normalizeTrPhone(input.phone ?? "");
  if (!phone) {
    fieldErrors.phone =
      "Lütfen geçerli bir telefon numarası girin (örn. 0532 123 45 67).";
  }

  const emailRaw = (input.email ?? "").trim();
  const email = emailRaw ? emailRaw.slice(0, 200) : null;
  if (email && !isValidEmail(email)) {
    fieldErrors.email = "Lütfen geçerli bir e-posta adresi girin.";
  }

  const area = parseArea(input.area_m2 ?? "");
  if (area === "invalid") {
    fieldErrors.area_m2 = "Lütfen geçerli bir metrekare değeri girin.";
  }

  const eventDateRaw = (input.event_date ?? "").trim();
  const eventDate = eventDateRaw && isValidIsoDate(eventDateRaw) ? eventDateRaw : null;

  const modelSlug =
    input.model_slug &&
    TENT_MODEL_OPTIONS.some((m) => m.slug === input.model_slug)
      ? input.model_slug
      : null;

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, code: "validation", fieldErrors };
  }

  const company = (input.company ?? "").trim().slice(0, 200) || null;
  let message = (input.message ?? "").trim().slice(0, 2000) || null;
  const sourcePage = (input.source_page ?? "").trim().slice(0, 300) || null;

  // utm jsonb: sadece bilinen anahtarlar, string değerler, uzunluk sınırlı
  const utm: Record<string, string> = {};
  for (const key of UTM_ALLOWED_KEYS) {
    const value = input.utm?.[key];
    if (typeof value === "string" && value) utm[key] = value.slice(0, 500);
  }

  // --- 3) Supabase yoksa zarif fallback -------------------------------
  if (!isSupabaseConfigured()) {
    return await unavailableResult(input);
  }

  // --- 4) INSERT -------------------------------------------------------
  try {
    const supabase = await createClient();

    // model slug → id (RLS: unpublished model anon'a görünmez → null kalır,
    // model bilgisi mesaja yazılarak korunur)
    let tentModelId: string | null = null;
    if (modelSlug) {
      const { data: model } = await supabase
        .from("tent_models")
        .select("id")
        .eq("slug", modelSlug)
        .maybeSingle();
      tentModelId = model?.id ?? null;

      if (!tentModelId) {
        const prefix = `[Model: ${getModelLabel(modelSlug)}]`;
        message = message ? `${prefix}\n${message}` : prefix;
      }
    }

    const { error } = await supabase.from("leads").insert({
      name,
      company,
      phone,
      email,
      tent_model_id: tentModelId,
      area_m2: area,
      event_date: eventDate,
      message,
      source_page: sourcePage,
      utm,
    });

    if (error) {
      console.error("[leads] INSERT hatası:", error.message);
      return await unavailableResult(input);
    }

    return { ok: true };
  } catch (err) {
    console.error("[leads] Beklenmeyen hata:", err);
    return await unavailableResult(input);
  }
}
