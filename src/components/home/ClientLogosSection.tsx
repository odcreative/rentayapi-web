import Image from "next/image";
import styles from "./ClientLogos.module.css";

/**
 * MÜŞTERİ LOGOLARI — sonsuz kayan marka şeridi (marquee), birebir port.
 * Kaynak: 01_TASARIM/index-v2.html `.logos-band` (CSS satır 557-568,
 *         markup 1264-1292 — birebir).
 * - 8 benzersiz logo, kesintisiz döngü için iki kez basılır (16 img);
 *   ikinci set aria-hidden (kaynakla aynı).
 * - Animasyon tamamen CSS (@keyframes marquee); JS yok → server component.
 * - prefers-reduced-motion'da animasyon durur (kaynak kuralı).
 * Görsel: 01_TASARIM/assets/imgi_*_ref-logo-*.webp → public/images/ref-logo-*.webp
 */

const LOGOS = [
  "/images/ref-logo-01.webp",
  "/images/ref-logo-02.webp",
  "/images/ref-logo-03.webp",
  "/images/ref-logo-04.webp",
  "/images/ref-logo-05.webp",
  "/images/ref-logo-06.webp",
  "/images/ref-logo-07.webp",
  "/images/ref-logo-11.webp",
];

export default function ClientLogosSection() {
  return (
    <section className={styles.logosBand}>
      <div className="wrap">
        <div className={styles.head}>
          <small>★ Bize güvenen markalar</small>
          <h3>1.200+ projede yanımızda olan firmalar</h3>
        </div>
        <div className={styles.marquee}>
          <div className={styles.track}>
            {LOGOS.map((src) => (
              <Image
                key={src}
                src={src}
                alt="Referans marka"
                width={200}
                height={80}
                className={styles.logo}
              />
            ))}
            {/* kesintisiz döngü için tekrar seti (kaynak: aria-hidden kopyalar) */}
            {LOGOS.map((src) => (
              <Image
                key={`dup-${src}`}
                src={src}
                alt=""
                aria-hidden="true"
                width={200}
                height={80}
                className={styles.logo}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
