/**
 * Generic form yardımcıları (server-side):
 * - buildDefaults: DB satırı → input'a hazır default değerler
 * - fetchSelectOptions: select alanları için ilişkili tablo seçenekleri
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { FieldDef } from "./resources";

export type SelectOption = { value: string; label: string };

function toDatetimeLocalValue(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Satır verisini (düzenleme) ya da boş formu (oluşturma) input değerlerine
 * çevirir. json → pretty stringify, datetime → datetime-local formatı.
 */
export function buildDefaults(
  fields: FieldDef[],
  row?: Record<string, unknown> | null
): Record<string, string | boolean> {
  const defaults: Record<string, string | boolean> = {};

  for (const field of fields) {
    const value = row?.[field.name];

    switch (field.type) {
      case "checkbox":
        defaults[field.name] = Boolean(value);
        break;
      case "json":
        defaults[field.name] =
          value === undefined || value === null
            ? (field.jsonDefault ?? "{}")
            : JSON.stringify(value, null, 2);
        break;
      case "datetime":
        defaults[field.name] =
          typeof value === "string" ? toDatetimeLocalValue(value) : "";
        break;
      case "date":
        defaults[field.name] =
          typeof value === "string" ? value.slice(0, 10) : "";
        break;
      default:
        defaults[field.name] =
          value === undefined || value === null ? "" : String(value);
    }
  }

  return defaults;
}

/** select tipli alanların seçeneklerini ilişkili tablolardan çeker. */
export async function fetchSelectOptions(
  supabase: SupabaseClient,
  fields: FieldDef[]
): Promise<Record<string, SelectOption[]>> {
  const options: Record<string, SelectOption[]> = {};

  for (const field of fields) {
    if (field.type !== "select" || !field.optionsFrom) continue;

    const { table, valueColumn, labelColumn } = field.optionsFrom;
    const { data } = await supabase
      .from(table)
      .select(`${valueColumn}, ${labelColumn}`)
      .order(labelColumn, { ascending: true });

    options[field.name] = ((data ?? []) as unknown as Record<string, unknown>[]).map(
      (row) => ({
        value: String(row[valueColumn] ?? ""),
        label: String(row[labelColumn] ?? ""),
      })
    );
  }

  return options;
}
