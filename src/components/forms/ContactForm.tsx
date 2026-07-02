"use client";

/**
 * Kısa iletişim formu — /iletisim
 * Aynı submitLead server action'ını model_slug: null ile kullanır;
 * gönderim yine `leads` tablosuna düşer (source_page = /iletisim + UTM).
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  captureAttribution,
  getAttribution,
  getCurrentPage,
} from "@/lib/attribution";
import { submitLead, type SubmitLeadResult } from "@/lib/leads";
import { SITE_SETTINGS } from "@/lib/site-settings";
import { buildWhatsAppUrl, normalizeTrPhone } from "./lead-utils";
import styles from "./Forms.module.css";

type Status = "form" | "submitting" | "success" | "unavailable";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [status, setStatus] = useState<Status>("form");
  const [fallback, setFallback] = useState<{
    message: string;
    whatsappUrl: string;
    phone: string;
  } | null>(null);

  // 0 = henüz mount olmadı; gerçek başlangıç zamanı useEffect'te yazılır.
  const startedAt = useRef<number>(0);

  useEffect(() => {
    captureAttribution();
    startedAt.current = Date.now();
  }, []);

  function validate() {
    const next: Partial<Record<string, string>> = {};
    if (name.trim().length < 2) {
      next.name = "Lütfen adınızı ve soyadınızı yazın.";
    }
    if (!normalizeTrPhone(phone)) {
      next.phone =
        "Lütfen geçerli bir telefon numarası girin (örn. 0532 123 45 67).";
    }
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const first = Object.keys(errs)[0];
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    setErrors({});
    setStatus("submitting");

    let result: SubmitLeadResult;
    try {
      result = await submitLead({
        name,
        phone,
        message,
        model_slug: null,
        source_page: getCurrentPage(),
        utm: getAttribution() as Record<string, string>,
        website,
        elapsed_ms: Date.now() - startedAt.current,
      });
    } catch {
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
    } else if (result.code === "validation") {
      setErrors(result.fieldErrors);
      setStatus("form");
    } else {
      setFallback({
        message: result.message,
        whatsappUrl: result.whatsappUrl,
        phone: result.phone,
      });
      setStatus("unavailable");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.result} role="status">
        <span className={`${styles.resultIcon} ${styles.resultIconSuccess}`} aria-hidden="true">
          ✓
        </span>
        <h2 className={styles.resultTitle}>Mesajınız alındı!</h2>
        <p className={styles.resultText}>
          En geç 24 saat içinde size dönüş yapacağız. Acil konular için
          WhatsApp hattımızı kullanabilirsiniz.
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

  return (
    <form className={styles.card} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.stepTitle}>Bize yazın</h2>
      <p className={styles.stepHint}>
        Kısaca ihtiyacınızı anlatın, en geç 24 saat içinde dönüş yapalım.
        Detaylı teklif için <Link href="/teklif-al">teklif formunu</Link>{" "}
        kullanabilirsiniz.
      </p>

      {/* Honeypot */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="contact-website">Web siteniz (boş bırakın)</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className={styles.grid2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-name">
            Ad Soyad *
          </label>
          <input
            id="contact-name"
            className={[styles.input, errors.name ? styles.inputError : ""]
              .filter(Boolean)
              .join(" ")}
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-required="true"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "contact-error-name" : undefined}
          />
          {errors.name && (
            <p className={styles.error} id="contact-error-name" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-phone">
            Telefon *
          </label>
          <input
            id="contact-phone"
            className={[styles.input, errors.phone ? styles.inputError : ""]
              .filter(Boolean)
              .join(" ")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0532 123 45 67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-required="true"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "contact-error-phone" : undefined}
          />
          {errors.phone && (
            <p className={styles.error} id="contact-error-phone" role="alert">
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="contact-message">
          Mesajınız <span className={styles.optional}>— opsiyonel</span>
        </label>
        <textarea
          id="contact-message"
          className={styles.textarea}
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className={styles.actions}>
        <span aria-hidden="true" />
        <button
          type="submit"
          className={styles.btnPrimary}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Gönderiliyor…" : "Mesajı Gönder"}
        </button>
      </div>
    </form>
  );
}
