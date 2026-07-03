import type { Metadata } from "next";
import TeklifForm from "@/components/forms/TeklifForm";
import { getSiteSettings } from "@/lib/queries";
import styles from "@/components/forms/Forms.module.css";

export const metadata: Metadata = {
  title: "Teklif Al",
  description:
    "Kiralık çadır teklifi alın: model, metrekare ve tarih bilgisiyle 24 saatte dönüş.",
};

/**
 * Çok adımlı teklif formu — lead-gen çekirdeği.
 * Gönderim `leads` tablosuna düşer (source_page + first-touch UTM ile);
 * admin panel lead inbox'ında durum takibi yapılır (yeni/arandı/teklif/kapandı).
 */
export default async function TeklifAlPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <section className={styles.pageHead}>
        <div className="wrap">
          <span className="eyebrow">Teklif</span>
          <h1 style={{ fontSize: "clamp(32px, 4.4vw, 56px)" }}>Teklif Al</h1>
          <p>
            3 kısa adımda ihtiyacınızı paylaşın; ekibimiz en geç 24 saat içinde
            net bir teklifle dönüş yapsın.
          </p>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className="wrap">
          <TeklifForm contact={settings} />
        </div>
      </section>
    </>
  );
}
