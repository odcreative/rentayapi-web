import type { Metadata } from "next";
import ContactForm from "@/components/forms/ContactForm";
import { getSiteSettings } from "@/lib/queries";
import { buildWhatsAppUrl, digitsOnly } from "@/components/forms/lead-utils";
import styles from "@/components/forms/Forms.module.css";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Renta Yapı iletişim: telefon, WhatsApp, e-posta ve Ataşehir/İstanbul ofis adresi. Teklif için hemen ulaşın.",
};

/**
 * İletişim sayfası — kısa form (aynı `submitLead` action'ı, model=null)
 * + iletişim bilgileri (site_settings DB-first, statik fallback yedekli)
 * + harita placeholder.
 * Port kaynağı 01_TASARIM/iletisim.html — görsel pas o portta gelecek.
 */
export default async function IletisimPage() {
  const settings = await getSiteSettings();

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
            {/* Sol: iletişim bilgileri (site_settings DB-first + fallback) */}
            <div>
              <div className={styles.infoCard}>
                <h2>İletişim Bilgileri</h2>
                <ul className={styles.infoList}>
                  <li>
                    <strong>Telefon</strong>
                    <a href={`tel:+${digitsOnly(settings.phone)}`}>
                      {settings.phone}
                    </a>
                  </li>
                  <li>
                    <strong>WhatsApp</strong>
                    <a
                      href={buildWhatsAppUrl(settings.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {settings.whatsapp}
                    </a>
                  </li>
                  <li>
                    <strong>E-posta</strong>
                    <a href={`mailto:${settings.email}`}>
                      {settings.email}
                    </a>
                  </li>
                  <li>
                    <strong>Adres</strong>
                    {settings.address}
                  </li>
                </ul>
                <a
                  href={buildWhatsAppUrl(
                    settings.whatsapp,
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
            <ContactForm contact={settings} />
          </div>
        </div>
      </section>
    </>
  );
}
