"use client";

/**
 * Site header — port: 01_TASARIM/anasayfa-header.html (Beket stili).
 * - Anasayfa ("/"): şeffaf overlay + akıllı sticky (aşağı kaydır → gizle,
 *   yukarı kaydır → beyaz arkaplanla geri aç, tepeye dön → tekrar şeffaf).
 * - İç sayfalar: solid beyaz sticky varyant (header-ic-sayfalar davranışı).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RentaLogo from "./RentaLogo";
import styles from "./Header.module.css";

const NAV_ITEMS = [
  { href: "/", label: "Anasayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/cadir-modelleri", label: "Çadır Modelleri" },
  { href: "/projelerimiz", label: "Projelerimiz" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  // Akıllı sticky davranışı — sadece anasayfada (şeffaf overlay modu)
  useEffect(() => {
    if (!isHome) return;

    const SCROLL_THRESHOLD = 6;
    let triggerPoint = window.innerHeight * 0.35;

    const onResize = () => {
      triggerPoint = window.innerHeight * 0.35;
    };

    const update = () => {
      const curr = window.scrollY;
      const delta = curr - lastY.current;

      if (curr < triggerPoint) {
        setScrolled(false);
        setRevealed(false);
      } else {
        setScrolled(true);
        if (delta < -SCROLL_THRESHOLD) setRevealed(true);
        else if (delta > SCROLL_THRESHOLD) setRevealed(false);
      }

      lastY.current = curr;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(update);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [isHome]);

  // Not: mobil menü linkleri onClick ile menüyü kapatıyor — pathname
  // effect'ine gerek yok (react-hooks/set-state-in-effect).

  const isActive = useCallback(
    (href: string) =>
      href === "/" ? pathname === "/" : pathname.startsWith(href),
    [pathname]
  );

  const headerClass = [
    styles.siteHeader,
    !isHome && styles.solid,
    isHome && scrolled && styles.scrolled,
    isHome && scrolled && revealed && styles.visible,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header className={headerClass}>
        <Link href="/" className={styles.logoBox} aria-label="Renta Yapı — Anasayfa">
          <RentaLogo className={styles.logoSvg} />
        </Link>
        <div className={styles.headerBar}>
          <nav className={styles.mainNav} aria-label="Ana menü">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={isActive(item.href) ? styles.active : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className={styles.headerRight}>
            {/* TR/EN switch — placeholder (i18n Faz 4.5'te) */}
            <button className={styles.lang} type="button" aria-label="Dil seçimi (yakında)">
              <span className={styles.flag} /> TR ▾
            </button>
            <Link href="/teklif-al" className={styles.ctaPill}>
              <span className={styles.ic}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
              Teklif Al
            </Link>
            <button
              className={styles.burger}
              aria-label="Menü"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className={styles.mobileMenu} role="dialog" aria-label="Mobil menü">
          <button
            className={styles.mobileClose}
            aria-label="Menüyü kapat"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? styles.active : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/teklif-al"
            className={styles.mobileCta}
            onClick={() => setMenuOpen(false)}
          >
            Teklif Al
          </Link>
          <span className={styles.mobileLang}>TR · EN (yakında)</span>
        </div>
      )}
    </>
  );
}
