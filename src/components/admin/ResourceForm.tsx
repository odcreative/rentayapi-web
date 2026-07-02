"use client";

/**
 * Generic CRUD formu — resources.ts FieldDef listesinden üretilir.
 * Tüm tablolar (modeller/projeler/blog/referanslar/logolar/sss) aynı
 * component'i kullanır; alan konfigürasyonu server sayfadan props ile gelir.
 *
 * useActionState: hata durumunda sayfa yenilenmez, girilen değerler korunur.
 */

import Link from "next/link";
import { useActionState } from "react";
import type { FieldDef } from "@/lib/admin/resources";
import { saveResourceAction, type FormState } from "@/lib/admin/actions";

export type SelectOption = { value: string; label: string };

type ResourceFormProps = {
  slug: string;
  /** null → oluşturma, uuid → düzenleme */
  id: string | null;
  fields: FieldDef[];
  /** Alan adı → input'a hazır default değer (json stringify edilmiş vb.) */
  defaults: Record<string, string | boolean>;
  /** select alanları için: alan adı → seçenekler */
  selectOptions: Record<string, SelectOption[]>;
  cancelHref: string;
};

const inputClass =
  "w-full rounded-sm border border-line bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors focus:border-red";

export default function ResourceForm({
  slug,
  id,
  fields,
  defaults,
  selectOptions,
  cancelHref,
}: ResourceFormProps) {
  const action = saveResourceAction.bind(null, slug, id);
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    { error: null }
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      {state.error && (
        <p className="rounded-sm border border-red/25 bg-red/6 px-4 py-3 text-[13.5px] font-semibold text-red">
          {state.error}
        </p>
      )}

      {fields.map((field) => {
        const def = defaults[field.name];

        return (
          <div key={field.name}>
            {field.type === "checkbox" ? (
              <label className="flex cursor-pointer items-center gap-2.5 text-[14px] font-bold text-ink">
                <input
                  type="checkbox"
                  name={field.name}
                  defaultChecked={def === true}
                  className="h-4 w-4 accent-[var(--red)]"
                />
                {field.label}
              </label>
            ) : (
              <>
                <label
                  htmlFor={`f-${field.name}`}
                  className="mb-1.5 block text-[13px] font-bold text-ink"
                >
                  {field.label}
                  {field.required && <span className="ml-0.5 text-red">*</span>}
                </label>

                {field.type === "textarea" || field.type === "json" ? (
                  <textarea
                    id={`f-${field.name}`}
                    name={field.name}
                    rows={field.rows ?? (field.type === "json" ? 5 : 4)}
                    required={field.required}
                    defaultValue={typeof def === "string" ? def : ""}
                    spellCheck={field.type !== "json"}
                    className={`${inputClass} ${
                      field.type === "json" ? "font-mono text-[13px]" : ""
                    }`}
                  />
                ) : field.type === "select" ? (
                  <select
                    id={`f-${field.name}`}
                    name={field.name}
                    required={field.required}
                    defaultValue={typeof def === "string" ? def : ""}
                    className={inputClass}
                  >
                    <option value="">— Seçiniz —</option>
                    {(selectOptions[field.name] ?? []).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`f-${field.name}`}
                    name={field.name}
                    type={
                      field.type === "number"
                        ? "number"
                        : field.type === "date"
                          ? "date"
                          : field.type === "datetime"
                            ? "datetime-local"
                            : "text"
                    }
                    step={field.type === "number" ? "any" : undefined}
                    required={field.required}
                    defaultValue={typeof def === "string" ? def : ""}
                    className={inputClass}
                  />
                )}

                {field.help && (
                  <p className="mt-1 text-[12.5px] text-muted">{field.help}</p>
                )}
              </>
            )}
          </div>
        );
      })}

      <div className="flex items-center gap-3 border-t border-line pt-5">
        <button
          type="submit"
          disabled={pending}
          className="rounded-sm bg-red px-6 py-2.5 text-[14px] font-extrabold text-white transition-colors hover:bg-red-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Kaydediliyor…" : id ? "Güncelle" : "Oluştur"}
        </button>
        <Link
          href={cancelHref}
          className="rounded-sm border border-line px-6 py-2.5 text-[14px] font-bold text-body transition-colors hover:border-ink hover:text-ink"
        >
          Vazgeç
        </Link>
      </div>
    </form>
  );
}
