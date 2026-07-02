/**
 * TeklifCTA — sayfa içlerine gömülebilir mini teklif bandı.
 * Server component; state yok. Her sayfayı teklif hunisine bağlamak için
 * (PRODUCT_PLAN ürün ilkesi 1). Henüz hiçbir sayfaya eklenmedi —
 * kullanım: <section className="wrap"><TeklifCTA /></section> veya wrap'i
 * kendi içinde ister misiniz diye `wrapped` prop'u ile.
 */

import Link from "next/link";
import { SITE_SETTINGS } from "@/lib/site-settings";
import { buildWhatsAppUrl } from "./lead-utils";
import styles from "./Forms.module.css";

type TeklifCTAProps = {
  title?: string;
  text?: string;
  /** true ise kendi `.wrap` container'ını basar (varsayılan: false) */
  wrapped?: boolean;
};

export default function TeklifCTA({
  title = "Projeniz için teklif alın",
  text = "Model, metrekare ve tarihinizi paylaşın — ekibimiz en geç 24 saat içinde net bir teklifle dönsün.",
  wrapped = false,
}: TeklifCTAProps) {
  const band = (
    <div className={styles.ctaBand}>
      <div>
        <p className={styles.ctaBandTitle}>{title}</p>
        <p className={styles.ctaBandText}>{text}</p>
      </div>
      <div className={styles.ctaBandActions}>
        <Link href="/teklif-al" className={styles.btnPrimary}>
          Teklif Al →
        </Link>
        <a
          href={buildWhatsAppUrl(SITE_SETTINGS.whatsapp)}
          className={styles.btnWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );

  if (!wrapped) return band;
  return <div className="wrap">{band}</div>;
}
