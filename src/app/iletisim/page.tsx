import type { Metadata } from "next";
import ContactForm from "@/components/forms/ContactForm";
import { SITE_SETTINGS } from "@/lib/site-settings";
import { buildWhatsAppUrl, digitsOnly } from "@/components/forms/lead-utils";
import styles from "@/components/forms/Forms.module.css";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Renta Yapı iletişim: telefon, WhatsApp, e-posta ve Ataşehir/İstanbul ofis adresi. Teklif için hemen ulaşın.",
};

/**
 * İletişim sayfası — kısa form (aynı `submitLead` action'ı, model=null)
 * + statik iletişim bilgileri (site_settings fallback) + harita placeholder.
 * Port kaynağı 01_TASARIM/iletisim.html — görsel pas o portta gelecek.
 */
export default function IletisimPage() {
  return (
    <>
      <section className={styles.pageHead}>
        <div className="wrap">
          <span className="eyebrow">İletişim</span>
          <h1 style={{ fontSize: "clamp(32px, 4.4vw, 56px)" }}>Bize Ulaşın</h1>
          <p>
            Telefon, WhatsApp veya form — size en kolay gelen kanaldan yazın,
            en geç 24 saat içinde dönüş yapalım.
          </p>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className="wrap">
          <div className={styles.contactGrid}>
            {/* Sol: iletişim bilgileri (site_settings statik fallback) */}
            <div>
              <div className={styles.infoCard}>
                <h2>İletişim Bilgileri</h2>
                <ul className={styles.infoList}>
                  <li>
                    <strong>Telefon</strong>
                    <a href={`tel:+${digitsOnly(SITE_SETTINGS.phone)}`}>
                      {SITE_SETTINGS.phone}
                    </a>
                  </li>
                  <li>
                    <strong>WhatsApp</strong>
                    <a
                      href={buildWhatsAppUrl(SITE_SETTINGS.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {SITE_SETTINGS.whatsapp}
                    </a>
                  </li>
                  <li>
                    <strong>E-posta</strong>
                    <a href={`mailto:${SITE_SETTINGS.email}`}>
                      {SITE_SETTINGS.email}
                    </a>
                  </li>
                  <li>
                    <strong>Adres</strong>
                    {SITE_SETTINGS.address}
                  </li>
                </ul>
                <a
                  href={buildWhatsAppUrl(
                    SITE_SETTINGS.whatsapp,
                    "Merhaba, çadır kiralama hakkında bilgi almak istiyorum."
                  )}
                  className={styles.btnWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp ile hemen yazın
                </a>
              </div>

              {/* Harita embed placeholder — ofis pin'i sonraki pasta eklenecek */}
              <div className={styles.mapPlaceholder} role="img" aria-label="Harita yakında">
                Harita yakında — Ataşehir / İstanbul
              </div>
            </div>

            {/* Sağ: kısa iletişim formu → leads (model=null) */}
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
