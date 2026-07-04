import type { ReactNode } from "react";
import styles from "./WhyUs.module.css";

/**
 * NEDEN RENTA? — 8 farkı gösteren koyu band, birebir React portu.
 * Kaynak: 01_TASARIM/index-v2.html `.why-band` (CSS satır 527-543,
 *         markup 1194-1244; responsive 675/723 — birebir).
 * Statik içerik, JS davranışı yok — server component.
 * Koyu band; `.eyebrow.dark` global yardımcı sınıfı kaynaktaki
 * `.why-band .eyebrow` override'ını karşılar (globals.css).
 */

type Why = {
  icon: ReactNode;
  title: string;
  desc: string;
};

const WHYS: Why[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21 L21 21 M5 21 L5 12 L12 7 L19 12 L19 21" />
      </svg>
    ),
    title: "Mühendislik Disiplini",
    desc: "Her projeye özel statik hesap, 3D yerleşim ve mühendislik onayı.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 16 14" />
      </svg>
    ),
    title: "Hızlı Teslim",
    desc: "72 saat – 7 gün arası anahtar teslim kurulum.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z" />
      </svg>
    ),
    title: "Sertifikalı Üretim",
    desc: "CE, TSE, ISO 9001, B1 yangın sınıfı uyumlu.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 7L9 18l-5-5" />
      </svg>
    ),
    title: "%40 Ekonomi",
    desc: "Geleneksel inşaata göre belirgin maliyet avantajı.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: "Modüler Yapı",
    desc: "Söküp taşıma, genişletme ve modifikasyon kolaylığı.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12s-3-7-10-7-10 7-10 7 3 7 10 7 10-7 10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: "Şeffaf Fiyatlandırma",
    desc: "Kalem kalem teklif, gizli maliyet yok.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
    title: "Satış Sonrası Servis",
    desc: "Bakım, onarım, revizyon — proje hayatta tutulur.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7v10l10 5 10-5V7zM2 7l10 5 10-5M12 22V12" />
      </svg>
    ),
    title: "15+ Yıl Tecrübe",
    desc: "1.200+ projeden gelen sahada kazanılmış bilgi.",
  },
];

export default function WhyUsSection() {
  return (
    <section className={styles.whyBand}>
      <div className="wrap">
        <div className={styles.head}>
          <span className="eyebrow dark">Neden Renta?</span>
          <h2>Doğru çözüm ortağı olmamızı sağlayan 8 fark</h2>
          <p className={styles.lead}>
            Sadece çadır üretmiyoruz — keşiften garantiye uzanan, sahada yaşayan
            bir hizmet sunuyoruz.
          </p>
        </div>
        <div className={styles.grid}>
          {WHYS.map((w) => (
            <div key={w.title} className={styles.why}>
              <div className={styles.ic}>{w.icon}</div>
              <h4>{w.title}</h4>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
