/**
 * Site footer — port: 01_TASARIM/footer.html (Premium Dark).
 * İletişim bilgileri ileride `site_settings` tablosundan gelecek.
 */

import Link from "next/link";
import styles from "./Footer.module.css";

const MENU = [
  { href: "/", label: "Anasayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/cadir-modelleri", label: "Çadır Modelleri" },
  { href: "/projelerimiz", label: "Projelerimiz" },
  { href: "/blog", label: "Haber & Blog" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Footer() {
  return (
    <footer className={styles.ftA}>
      <div className={styles.wrap}>
        <div className={styles.grid}>
          {/* SOL: iletişim */}
          <div className={styles.contact}>
            <div className={styles.row}>
              <span className={`${styles.ic} ${styles.wa}`}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.5 3.5A11.7 11.7 0 0012 0a11.8 11.8 0 00-10.2 17.7L0 24l6.5-1.7A11.9 11.9 0 0012 23.9c6.6 0 12-5.4 12-12 0-3.2-1.3-6.2-3.5-8.4zM12 21.8c-1.8 0-3.6-.5-5.2-1.4l-.4-.2-3.9 1 1-3.8-.2-.4A9.9 9.9 0 1112 21.8zm5.5-7.4c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1c-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.2-.2.2-.3.3-.6.1-.2.1-.4 0-.6 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5 0-.8.4-.3.4-1.1 1-1.1 2.6s1.1 3.1 1.3 3.3c.2.3 2.3 3.6 5.6 5 .8.3 1.4.5 1.8.7.8.2 1.5.2 2 .1.6-.1 1.8-.7 2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.4-.3-.7-.5z" />
                </svg>
              </span>
              <div className={styles.v}>
                <small>WhatsApp</small>
                +90 544 671 48 87
              </div>
            </div>
            <div className={styles.row}>
              <span className={styles.ic}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              </span>
              <div className={styles.v}>
                <small>Telefon</small>
                +90 216 504 46 96
              </div>
            </div>
            <div className={styles.row}>
              <span className={styles.ic}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <div className={styles.v}>
                <small>E-posta</small>
                info@rentayapi.com
              </div>
            </div>
            <div className={styles.row}>
              <span className={styles.ic}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <div className={styles.v}>
                <small>Adres</small>
                Atatürk Mah. Sedef Cad. Ata Blokları 2/4
                <br />
                Kat:5 Daire:172, Ataşehir / İstanbul
              </div>
            </div>
          </div>

          {/* ORTA: marka */}
          <div className={styles.center}>
            <div className={styles.logo}>
              <span className={styles.mk}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                  <path d="M3 19l9-13 9 13H3z" />
                </svg>
              </span>
              <span className={styles.lg}>
                REN<span>TA</span> YAPI
              </span>
            </div>
            <span className={styles.tag}>Kiralık Yapı Sistemleri · Est. 2010</span>
            <div className={styles.socials}>
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zM8.34 18.34V10.5H5.67v7.84h2.67zM7 9.34a1.55 1.55 0 100-3.1 1.55 1.55 0 000 3.1zm11.34 9V14.1c0-2.48-1.32-3.63-3.1-3.63-1.42 0-2.06.78-2.42 1.33v-1.14h-2.67c.04.76 0 7.84 0 7.84h2.67v-4.38c0-.24.02-.48.09-.65.19-.48.62-.97 1.36-.97.96 0 1.34.73 1.34 1.8v4.2h2.73z" />
                </svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0022 12z" />
                </svg>
              </a>
              <a href="#" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 7s-.2-1.6-.9-2.3c-.8-.9-1.7-.9-2.1-1C16.8 3.5 12 3.5 12 3.5s-4.8 0-8 .2c-.4 0-1.3.1-2.1 1C1.2 5.4 1 7 1 7S.8 8.9.8 10.8v1.8C.8 14.5 1 16.4 1 16.4s.2 1.6.9 2.3c.8.9 1.9.8 2.4.9 1.7.2 7.7.2 7.7.2s4.8 0 8-.2c.4 0 1.3-.1 2.1-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8v-1.8C23.2 8.9 23 7 23 7zM9.7 14.6V7.9l6.2 3.4-6.2 3.3z" />
                </svg>
              </a>
              <a href="#" aria-label="X / Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2H21.5l-7.6 8.67L23 22h-6.8l-5.31-6.94L4.8 22H1.5l8.13-9.28L1 2h6.96l4.78 6.32L18.244 2zm-2.39 18h1.82L7.94 4H6L15.854 20z" />
                </svg>
              </a>
            </div>
          </div>

          {/* SAĞ: hızlı menü */}
          <div className={styles.menu}>
            <span className={styles.label}>Hızlı Menü</span>
            {MENU.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Dekoratif kırmızı çizgi */}
        <div className={styles.line}>
          <svg viewBox="0 0 1200 48" preserveAspectRatio="none">
            <path
              d="M0 36 L460 36 Q480 36 488 20 L500 8 Q510 0 520 0 L680 0 Q690 0 700 8 L712 20 Q720 36 740 36 L1200 36"
              fill="none"
              stroke="#E20613"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>

      {/* Alt şerit */}
      <div className={styles.wrap}>
        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Renta Yapı. Tüm hakları saklıdır.</span>
          <div className={styles.legal}>
            <Link href="/kvkk">KVKK</Link>
            <span className={styles.sep} />
            <Link href="/cerez-politikasi">Çerez Politikası</Link>
            <span className={styles.sep} />
            <Link href="/gizlilik-politikasi">Gizlilik</Link>
          </div>
          <div className={styles.web}>
            <span className={styles.pill}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              OD Creative
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
