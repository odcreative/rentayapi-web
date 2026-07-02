"use client";

/**
 * Çok adımlı teklif formu — /teklif-al
 *
 * Akış: (1) İhtiyaç: model + m² + tarih → (2) Detay: mesaj →
 *       (3) İletişim: ad + firma + telefon + e-posta → submitLead server action
 *
 * Yapı ve akış bu dosyada, görsel katman Forms.module.css'te —
 * tasarım pası geldiğinde sadece CSS değişir.
 */

import { useEffect, useRef, useState } from "react";
import {
  captureAttribution,
  getAttribution,
  getCurrentPage,
} from "@/lib/attribution";
import { submitLead, type SubmitLeadResult } from "@/lib/leads";
import { SITE_SETTINGS } from "@/lib/site-settings";
import {
  buildWhatsAppUrl,
  isValidEmail,
  MODEL_UNSURE,
  normalizeTrPhone,
  parseArea,
  TENT_MODEL_OPTIONS,
} from "./lead-utils";
import styles from "./Forms.module.css";

const STEPS = [
  { key: "ihtiyac", label: "1. İhtiyaç" },
  { key: "detay", label: "2. Detay" },
  { key: "iletisim", label: "3. İletişim" },
] as const;

type FormValues = {
  model: string;
  area: string;
  date: string;
  message: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  /** Honeypot */
  website: string;
};

const INITIAL_VALUES: FormValues = {
  model: "",
  area: "",
  date: "",
  message: "",
  name: "",
  company: "",
  phone: "",
  email: "",
  website: "",
};

type FieldErrors = Partial<Record<string, string>>;

type Status = "form" | "submitting" | "success" | "unavailable";

/** Alan → adım eşlemesi (server validation hatası dönerse doğru adıma zıplamak için) */
const FIELD_STEP: Record<string, number> = {
  model: 0,
  area_m2: 0,
  event_date: 0,
  message: 1,
  name: 2,
  company: 2,
  phone: 2,
  email: 2,
};

export default function TeklifForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("form");
  const [fallback, setFallback] = useState<{
    message: string;
    whatsappUrl: string;
    phone: string;
  } | null>(null);

  // 0 = henüz mount olmadı; gerçek başlangıç zamanı useEffect'te yazılır
  // (render sırasında Date.now() çağırmak react-hooks/purity ihlali).
  const startedAt = useRef<number>(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  // First-touch attribution yakala + doldurma süresi sayacını başlat
  useEffect(() => {
    captureAttribution();
    startedAt.current = Date.now();
  }, []);

  // Adım değişince başlığa focus (ekran okuyucu + klavye kullanıcıları için)
  useEffect(() => {
    if (mounted.current) {
      headingRef.current?.focus();
    } else {
      mounted.current = true;
    }
  }, [step]);

  function setValue<K extends keyof FormValues>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Kullanıcı düzeltmeye başlayınca o alanın hatasını temizle
    setErrors((prev) => {
      const errorKey = key === "area" ? "area_m2" : key;
      if (!prev[errorKey]) return prev;
      const next = { ...prev };
      delete next[errorKey];
      return next;
    });
  }

  function validateStep(current: number): FieldErrors {
    const next: FieldErrors = {};

    if (current === 0) {
      if (!values.model) {
        next.model = "Lütfen bir çadır modeli seçin (emin değilseniz son seçenek).";
      }
      if (parseArea(values.area) === "invalid") {
        next.area_m2 = "Lütfen geçerli bir metrekare değeri girin (örn. 500).";
      }
    }

    if (current === 2) {
      if (values.name.trim().length < 2) {
        next.name = "Lütfen adınızı ve soyadınızı yazın.";
      }
      if (!normalizeTrPhone(values.phone)) {
        next.phone =
          "Lütfen geçerli bir telefon numarası girin (örn. 0532 123 45 67).";
      }
      if (values.email.trim() && !isValidEmail(values.email)) {
        next.email = "Lütfen geçerli bir e-posta adresi girin.";
      }
    }

    return next;
  }

  function focusFirstError(errs: FieldErrors) {
    const first = Object.keys(errs)[0];
    if (!first) return;
    const id = first === "model" ? "model-etkinlik-cadiri" : `field-${first}`;
    document.getElementById(id)?.focus();
  }

  function goNext() {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      focusFirstError(errs);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateStep(2);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      focusFirstError(errs);
      return;
    }

    setStatus("submitting");

    let result: SubmitLeadResult;
    try {
      result = await submitLead({
        name: values.name,
        company: values.company,
        phone: values.phone,
        email: values.email,
        model_slug: values.model === MODEL_UNSURE ? null : values.model,
        area_m2: values.area || null,
        event_date: values.date || null,
        message: values.message,
        source_page: getCurrentPage(),
        utm: getAttribution() as Record<string, string>,
        website: values.website,
        elapsed_ms: Date.now() - startedAt.current,
      });
    } catch {
      // Action'a hiç ulaşılamadı (ağ vb.) — aynı zarif fallback
      result = {
        ok: false,
        code: "unavailable",
        message:
          "Formu şu an ulaştıramadık. Dilerseniz WhatsApp üzerinden veya telefonla hemen ulaşabilirsiniz.",
        whatsappUrl: buildWhatsAppUrl(SITE_SETTINGS.whatsapp),
        phone: SITE_SETTINGS.phone,
      };
    }

    if (result.ok) {
      setStatus("success");
      return;
    }

    if (result.code === "validation") {
      setErrors(result.fieldErrors);
      const firstField = Object.keys(result.fieldErrors)[0];
      setStep(firstField ? (FIELD_STEP[firstField] ?? 2) : 2);
      setStatus("form");
      focusFirstError(result.fieldErrors);
      return;
    }

    setFallback({
      message: result.message,
      whatsappUrl: result.whatsappUrl,
      phone: result.phone,
    });
    setStatus("unavailable");
  }

  // ---------- Sonuç ekranları ----------
  if (status === "success") {
    return (
      <div className={styles.result} role="status">
        <span className={`${styles.resultIcon} ${styles.resultIconSuccess}`} aria-hidden="true">
          ✓
        </span>
        <h2 className={styles.resultTitle}>Talebiniz alındı, teşekkürler!</h2>
        <p className={styles.resultText}>
          Ekibimiz talebinizi inceleyip <strong>en geç 24 saat içinde</strong>{" "}
          size dönüş yapacak. Acil durumlar için WhatsApp hattımız her zaman
          açık.
        </p>
        <div className={styles.resultActions}>
          <a
            className={styles.btnWhatsapp}
            href={buildWhatsAppUrl(SITE_SETTINGS.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp ile yazın
          </a>
          <a className={styles.btnGhost} href={`tel:${SITE_SETTINGS.phone.replace(/\s/g, "")}`}>
            {SITE_SETTINGS.phone}
          </a>
        </div>
      </div>
    );
  }

  if (status === "unavailable" && fallback) {
    return (
      <div className={styles.result} role="alert">
        <span className={`${styles.resultIcon} ${styles.resultIconWarn}`} aria-hidden="true">
          !
        </span>
        <h2 className={styles.resultTitle}>Formu şu an ulaştıramadık</h2>
        <p className={styles.resultText}>{fallback.message}</p>
        <div className={styles.resultActions}>
          <a
            className={styles.btnWhatsapp}
            href={fallback.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp ile ulaşın
          </a>
          <a className={styles.btnGhost} href={`tel:${fallback.phone.replace(/\s/g, "")}`}>
            {fallback.phone}
          </a>
        </div>
      </div>
    );
  }

  // ---------- Form ----------
  const isLastStep = step === STEPS.length - 1;

  return (
    <form className={styles.card} onSubmit={handleSubmit} noValidate>
      {/* Adım göstergesi */}
      <ol className={styles.steps} aria-label="Form adımları">
        {STEPS.map((s, i) => (
          <li
            key={s.key}
            className={[
              styles.stepItem,
              i === step ? styles.stepItemActive : "",
              i < step ? styles.stepItemDone : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-current={i === step ? "step" : undefined}
          >
            {s.label}
          </li>
        ))}
      </ol>

      {/* Honeypot — insanlar görmez; doldurulursa server sessizce düşürür */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="field-website">Web siteniz (boş bırakın)</label>
        <input
          id="field-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => setValue("website", e.target.value)}
        />
      </div>

      {/* ---------- ADIM 1: İhtiyaç ---------- */}
      {step === 0 && (
        <div>
          <h2 className={styles.stepTitle} ref={headingRef} tabIndex={-1}>
            İhtiyacınızı tanıyalım
          </h2>
          <p className={styles.stepHint}>
            Hangi çadır modeliyle ilgileniyorsunuz? Emin değilseniz sorun değil
            — ekibimiz sizinle birlikte netleştirir.
          </p>

          <fieldset
            className={styles.modelGrid}
            aria-describedby={errors.model ? "error-model" : undefined}
            aria-invalid={errors.model ? true : undefined}
          >
            <legend className={styles.modelLegend}>Çadır modeli *</legend>
            {[...TENT_MODEL_OPTIONS, { slug: MODEL_UNSURE, label: "Emin değilim" }].map(
              (option) => (
                <label
                  key={option.slug}
                  className={[
                    styles.modelOption,
                    values.model === option.slug ? styles.modelOptionChecked : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <input
                    type="radio"
                    id={`model-${option.slug}`}
                    name="model"
                    value={option.slug}
                    checked={values.model === option.slug}
                    onChange={(e) => setValue("model", e.target.value)}
                  />
                  {option.label}
                </label>
              )
            )}
          </fieldset>
          {errors.model && (
            <p className={styles.error} id="error-model" role="alert">
              {errors.model}
            </p>
          )}

          <div className={styles.grid2} style={{ marginTop: 20 }}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="field-area_m2">
                Tahmini alan (m²){" "}
                <span className={styles.optional}>— opsiyonel</span>
              </label>
              <input
                id="field-area_m2"
                className={[styles.input, errors.area_m2 ? styles.inputError : ""]
                  .filter(Boolean)
                  .join(" ")}
                type="text"
                inputMode="decimal"
                placeholder="örn. 500"
                value={values.area}
                onChange={(e) => setValue("area", e.target.value)}
                aria-invalid={errors.area_m2 ? true : undefined}
                aria-describedby={errors.area_m2 ? "error-area_m2" : undefined}
              />
              {errors.area_m2 && (
                <p className={styles.error} id="error-area_m2" role="alert">
                  {errors.area_m2}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="field-event_date">
                Kullanım tarihi{" "}
                <span className={styles.optional}>— opsiyonel</span>
              </label>
              <input
                id="field-event_date"
                className={styles.input}
                type="date"
                value={values.date}
                onChange={(e) => setValue("date", e.target.value)}
                aria-describedby="hint-event_date"
              />
              <p className={styles.hint} id="hint-event_date">
                Kesin tarih yoksa boş bırakın, dönemi bir sonraki adımda
                mesajınızda belirtebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------- ADIM 2: Detay ---------- */}
      {step === 1 && (
        <div>
          <h2 className={styles.stepTitle} ref={headingRef} tabIndex={-1}>
            Projenizi anlatın
          </h2>
          <p className={styles.stepHint}>
            Kullanım amacı, konum, kurulum dönemi, özel istekler... Ne kadar
            detay verirseniz teklifimiz o kadar isabetli olur. Bu adımı boş da
            geçebilirsiniz.
          </p>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="field-message">
              Mesajınız <span className={styles.optional}>— opsiyonel</span>
            </label>
            <textarea
              id="field-message"
              className={styles.textarea}
              maxLength={2000}
              placeholder="örn. Eylül ayında İzmir'de 3 günlük bir lansman etkinliği için yaklaşık 400 kişilik kapalı alan arıyoruz…"
              value={values.message}
              onChange={(e) => setValue("message", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* ---------- ADIM 3: İletişim ---------- */}
      {step === 2 && (
        <div>
          <h2 className={styles.stepTitle} ref={headingRef} tabIndex={-1}>
            Size nasıl ulaşalım?
          </h2>
          <p className={styles.stepHint}>
            Bilgileriniz yalnızca teklif süreci için kullanılır, üçüncü
            taraflarla paylaşılmaz.
          </p>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="field-name">
                Ad Soyad *
              </label>
              <input
                id="field-name"
                className={[styles.input, errors.name ? styles.inputError : ""]
                  .filter(Boolean)
                  .join(" ")}
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={(e) => setValue("name", e.target.value)}
                aria-required="true"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? "error-name" : undefined}
              />
              {errors.name && (
                <p className={styles.error} id="error-name" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="field-company">
                Firma <span className={styles.optional}>— opsiyonel</span>
              </label>
              <input
                id="field-company"
                className={styles.input}
                type="text"
                autoComplete="organization"
                value={values.company}
                onChange={(e) => setValue("company", e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="field-phone">
                Telefon *
              </label>
              <input
                id="field-phone"
                className={[styles.input, errors.phone ? styles.inputError : ""]
                  .filter(Boolean)
                  .join(" ")}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0532 123 45 67"
                value={values.phone}
                onChange={(e) => setValue("phone", e.target.value)}
                aria-required="true"
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={errors.phone ? "error-phone" : undefined}
              />
              {errors.phone && (
                <p className={styles.error} id="error-phone" role="alert">
                  {errors.phone}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="field-email">
                E-posta <span className={styles.optional}>— opsiyonel</span>
              </label>
              <input
                id="field-email"
                className={[styles.input, errors.email ? styles.inputError : ""]
                  .filter(Boolean)
                  .join(" ")}
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => setValue("email", e.target.value)}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "error-email" : undefined}
              />
              {errors.email && (
                <p className={styles.error} id="error-email" role="alert">
                  {errors.email}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------- Aksiyonlar ---------- */}
      <div className={styles.actions}>
        {step > 0 ? (
          <button type="button" className={styles.btnGhost} onClick={goBack}>
            ← Geri
          </button>
        ) : (
          <span aria-hidden="true" />
        )}

        {isLastStep ? (
          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Gönderiliyor…" : "Teklif Talebini Gönder"}
          </button>
        ) : (
          <button type="button" className={styles.btnPrimary} onClick={goNext}>
            Devam Et →
          </button>
        )}
      </div>
    </form>
  );
}
