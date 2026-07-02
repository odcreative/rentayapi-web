"use client";

/**
 * site_settings key/value formu — her anahtar için JSON textarea +
 * yeni anahtar ekleme satırı. Hata durumunda girilen değerler korunur.
 */

import { useActionState } from "react";
import { saveSettingsAction, type FormState } from "@/lib/admin/actions";

type SettingRow = { key: string; value: string };

const inputClass =
  "w-full rounded-sm border border-line bg-white px-3.5 py-2.5 text-[13px] font-mono text-ink outline-none transition-colors focus:border-red";

export default function SettingsForm({ settings }: { settings: SettingRow[] }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    saveSettingsAction,
    { error: null }
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      {state.error && (
        <p className="rounded-sm border border-red/25 bg-red/6 px-4 py-3 text-[13.5px] font-semibold text-red">
          {state.error}
        </p>
      )}
      {state.success && !state.error && (
        <p className="rounded-sm border border-whatsapp/30 bg-whatsapp/8 px-4 py-3 text-[13.5px] font-semibold text-[#127A3D]">
          Ayarlar kaydedildi.
        </p>
      )}

      {settings.length === 0 && (
        <p className="rounded-sm border border-dashed border-line bg-soft px-4 py-6 text-center text-[14px] text-muted">
          Henüz kayıtlı ayar yok — aşağıdan ilk anahtarı ekleyin.
        </p>
      )}

      {settings.map((setting) => (
        <div key={setting.key}>
          <label
            htmlFor={`s-${setting.key}`}
            className="mb-1.5 block font-mono text-[13px] font-bold text-ink"
          >
            {setting.key}
          </label>
          <textarea
            id={`s-${setting.key}`}
            name={`value__${setting.key}`}
            rows={Math.min(10, Math.max(2, setting.value.split("\n").length))}
            defaultValue={setting.value}
            spellCheck={false}
            className={inputClass}
          />
        </div>
      ))}

      {/* Yeni anahtar */}
      <fieldset className="rounded-md border border-dashed border-line bg-soft/60 p-4">
        <legend className="px-1.5 text-[12px] font-extrabold uppercase tracking-[0.12em] text-muted">
          Yeni Anahtar Ekle
        </legend>
        <div className="space-y-3">
          <input
            name="new_key"
            type="text"
            placeholder="anahtar_adi (örn. announcement_bar)"
            className="w-full rounded-sm border border-line bg-white px-3.5 py-2.5 text-[13.5px] text-ink outline-none transition-colors focus:border-red"
          />
          <textarea
            name="new_value"
            rows={2}
            placeholder={'JSON değer — örn. "metin" veya {"enabled": true}'}
            spellCheck={false}
            className={inputClass}
          />
        </div>
      </fieldset>

      <p className="text-[12.5px] text-muted">
        Değerler JSON formatındadır: düz metin için çift tırnak kullanın
        (örn. <code className="rounded-sm bg-soft px-1 py-0.5">&quot;https://…&quot;</code>).
      </p>

      <div className="border-t border-line pt-5">
        <button
          type="submit"
          disabled={pending}
          className="rounded-sm bg-red px-6 py-2.5 text-[14px] font-extrabold text-white transition-colors hover:bg-red-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Kaydediliyor…" : "Ayarları Kaydet"}
        </button>
      </div>
    </form>
  );
}
