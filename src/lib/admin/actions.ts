"use server";

/**
 * Admin panel server action'ları — tüm mutasyonlar buradan geçer.
 * Yetki: Supabase RLS (authenticated) + middleware; env yoksa her action
 * zarifçe hata mesajı döner.
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { LeadStatus } from "@/lib/types";
import { isSupabaseConfigured, NOT_CONFIGURED_MESSAGE } from "./env";
import { getResource, type ResourceConfig } from "./resources";

export type FormState = { error: string | null; success?: boolean };

export type ActionResult = { error: string | null };

const LEAD_STATUSES: LeadStatus[] = ["new", "called", "quoted", "closed"];

/* ============================================================
   AUTH
   ============================================================ */

export async function loginAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED_MESSAGE };

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "E-posta ve şifre zorunludur." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Giriş başarısız — e-posta veya şifre hatalı." };
  }

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

/* ============================================================
   LEAD DURUMU (pipeline: new → called → quoted → closed)
   ============================================================ */

export async function updateLeadStatusAction(
  id: string,
  status: LeadStatus
): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED_MESSAGE };
  if (!LEAD_STATUSES.includes(status)) {
    return { error: "Geçersiz durum." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);

  if (error) return { error: `Durum güncellenemedi: ${error.message}` };

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { error: null };
}

/* ============================================================
   GENERIC CRUD — resources.ts konfigürasyonundan üretilir
   ============================================================ */

/** FormData → DB satırı. Alan tipine göre parse; hata varsa Türkçe mesaj. */
function parseFormData(
  config: ResourceConfig,
  formData: FormData
): { row?: Record<string, unknown>; error?: string } {
  const row: Record<string, unknown> = {};

  for (const field of config.fields) {
    const raw = formData.get(field.name);

    if (field.type === "checkbox") {
      row[field.name] = raw === "on";
      continue;
    }

    const value = typeof raw === "string" ? raw.trim() : "";

    if (!value) {
      if (field.required) {
        return { error: `"${field.label}" alanı zorunludur.` };
      }
      if (field.type === "json") {
        row[field.name] = JSON.parse(field.jsonDefault ?? "{}");
      } else {
        row[field.name] = null;
      }
      continue;
    }

    switch (field.type) {
      case "number": {
        const num = Number(value);
        if (Number.isNaN(num)) {
          return { error: `"${field.label}" sayısal bir değer olmalı.` };
        }
        row[field.name] = num;
        break;
      }
      case "json": {
        try {
          row[field.name] = JSON.parse(value);
        } catch {
          return { error: `"${field.label}" geçerli JSON değil.` };
        }
        break;
      }
      case "datetime": {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
          return { error: `"${field.label}" geçerli bir tarih değil.` };
        }
        row[field.name] = date.toISOString();
        break;
      }
      default:
        // text / textarea / date / select
        row[field.name] = value;
    }
  }

  return { row };
}

export async function saveResourceAction(
  slug: string,
  id: string | null,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED_MESSAGE };

  const config = getResource(slug);
  if (!config) return { error: "Bilinmeyen içerik türü." };

  const { row, error: parseError } = parseFormData(config, formData);
  if (parseError || !row) return { error: parseError ?? "Form okunamadı." };

  const supabase = await createClient();
  const { error } = id
    ? await supabase.from(config.table).update(row).eq("id", id)
    : await supabase.from(config.table).insert(row);

  if (error) return { error: `Kaydedilemedi: ${error.message}` };

  revalidatePath(`/admin/${slug}`);
  revalidatePath("/admin");
  redirect(`/admin/${slug}`);
}

export async function deleteResourceAction(
  slug: string,
  id: string,
  redirectToList = false
): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED_MESSAGE };

  const config = getResource(slug);
  if (!config) return { error: "Bilinmeyen içerik türü." };

  const supabase = await createClient();
  const { error } = await supabase.from(config.table).delete().eq("id", id);

  if (error) return { error: `Silinemedi: ${error.message}` };

  revalidatePath(`/admin/${slug}`);
  revalidatePath("/admin");
  if (redirectToList) redirect(`/admin/${slug}`);
  return { error: null };
}

/**
 * published/featured hızlı toggle — liste satırından.
 * kind "boolean": true↔false; kind "timestamp": now()↔null (posts.published_at)
 */
export async function toggleFieldAction(
  slug: string,
  id: string,
  field: string,
  kind: "boolean" | "timestamp",
  currentlyOn: boolean
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const config = getResource(slug);
  if (!config) return;
  // Sadece konfigüre edilmiş toggle alanlarına izin ver
  if (!config.toggles?.some((t) => t.field === field && t.kind === kind)) return;

  const nextValue =
    kind === "boolean" ? !currentlyOn : currentlyOn ? null : new Date().toISOString();

  const supabase = await createClient();
  await supabase.from(config.table).update({ [field]: nextValue }).eq("id", id);

  revalidatePath(`/admin/${slug}`);
  revalidatePath("/admin");
}

/* ============================================================
   SITE AYARLARI (site_settings key/value — value JSONB)
   ============================================================ */

export async function saveSettingsAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED_MESSAGE };

  const upserts: { key: string; value: unknown }[] = [];

  // Mevcut anahtarlar: value__<key> alanları
  for (const [name, raw] of formData.entries()) {
    if (!name.startsWith("value__") || typeof raw !== "string") continue;
    const key = name.slice("value__".length);
    try {
      upserts.push({ key, value: JSON.parse(raw) });
    } catch {
      return { error: `"${key}" için girilen değer geçerli JSON değil.` };
    }
  }

  // Yeni anahtar (opsiyonel)
  const newKey = String(formData.get("new_key") ?? "").trim();
  const newValue = String(formData.get("new_value") ?? "").trim();
  if (newKey) {
    try {
      upserts.push({ key: newKey, value: JSON.parse(newValue || '""') });
    } catch {
      return { error: `Yeni anahtar "${newKey}" için değer geçerli JSON değil.` };
    }
  }

  if (upserts.length === 0) return { error: "Kaydedilecek ayar yok." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert(upserts, { onConflict: "key" });

  if (error) return { error: `Ayarlar kaydedilemedi: ${error.message}` };

  revalidatePath("/admin/settings");
  return { error: null, success: true };
}
