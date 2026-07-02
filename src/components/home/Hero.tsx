"use client";

/**
 * HERO — Varyasyon 1 (Beket stili minimal), birebir React portu.
 * Kaynak: 01_TASARIM/hero-varyasyon-1.html
 * - 4 slide, 6 sn auto-advance, ok/progress/sayaç kontrolleri
 * - EK: "Tanıtım videosunu izle" butonu → VideoModal (site_settings kaynaklı)
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import VideoModal from "@/components/ui/VideoModal";
import { SITE_SETTINGS } from "@/lib/site-settings";
import styles from "./Hero.module.css";

const AUTO_ADVANCE_MS = 6000;

type Slide = {
  eyebrow: string;
  titleLines: [string, string]; // ikinci satır accent (kırmızı)
  desc: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
};

const SLIDES: Slide[] = [
  {
    eyebrow: "01 · Endüstriyel Çadır",
    titleLines: ["Endüstriyel ölçekte", "modüler depolama"],
    desc: "Çelik konstrüksiyon + teknik PVC kaplama ile üretilen modüler depo çadırları. 72 saatte anahtar teslim, %40'a kadar daha ekonomik.",
    ctaLabel: "Ücretsiz Teklif Al",
    ctaHref: "/depo-cadiri",
    image: "/images/hero-1.webp",
  },
  {
    eyebrow: "02 · Hangar Çadırı",
    titleLines: ["40 metre açıklık,", "sıfır kolon"],
    desc: "Havacılık, makine ve ağır endüstri için tasarlanmış büyük açıklıklı hangar yapıları. Mühendislik onaylı statik hesap garantili.",
    ctaLabel: "Modelleri İncele",
    ctaHref: "/cadir-modelleri",
    image: "/images/hero-2.webp",
  },
  {
    eyebrow: "03 · Etkinlik Çadırı",
    titleLines: ["2.000+ kişilik", "etkinlik alanları"],
    desc: "Fuar, konser, lansman ve kurumsal etkinlikler için estetik dış tasarım + içeriden kolonsuz hacim. Şeffaf yan duvar seçeneği.",
    ctaLabel: "Referanslarımız",
    ctaHref: "/projelerimiz",
    image: "/images/hero-3.webp",
  },
  {
    eyebrow: "04 · Özel Tasarım",
    titleLines: ["Standart yok,", "özel çözüm var"],
    desc: "Spor sahası kapatma, havuz örtüsü, fabrika eki — projeye özel mühendislik tasarımı ve sıfırdan üretim.",
    ctaLabel: "Görüşelim",
    ctaHref: "/iletisim",
    image: "/images/hero-4.webp",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  // Manuel gezinmede progress animasyonunu sıfırlamak için key
  const [cycle, setCycle] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);

  const show = useCallback((i: number) => {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
    setCycle((c) => c + 1);
  }, []);

  // Auto-advance — video modal açıkken durur
  useEffect(() => {
    if (videoOpen) return;
    const timer = setTimeout(() => show(index + 1), AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [index, cycle, videoOpen, show]);

  return (
    <section className={styles.hero} id="hero">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.eyebrow}
          className={`${styles.slide} ${i === index ? styles.active : ""}`}
          style={{ backgroundImage: `url('${slide.image}')` }}
          aria-hidden={i !== index}
        >
          <div className={styles.content}>
            <div className={styles.heroWrap}>
              <span className={styles.eyebrow}>{slide.eyebrow}</span>
              <h1>
                <span className={styles.line}>{slide.titleLines[0]}</span>
                <span className={`${styles.line} ${styles.accent}`}>
                  {slide.titleLines[1]}
                </span>
              </h1>
              <p className={styles.desc}>{slide.desc}</p>
              <div className={styles.ctaRow}>
                <Link href={slide.ctaHref} className={styles.heroCta} tabIndex={i === index ? 0 : -1}>
                  {slide.ctaLabel} <span className={styles.arrBox}>→</span>
                </Link>
                <button
                  className={styles.videoBtn}
                  onClick={() => setVideoOpen(true)}
                  tabIndex={i === index ? 0 : -1}
                >
                  <span className={styles.play}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  Tanıtım videosunu izle
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Side info */}
      <div className={styles.sideInfo}>16 yıllık öncü</div>

      {/* Bottom controls */}
      <div className={styles.heroBottom}>
        <div className={styles.heroWrap}>
          <div className={styles.navArrows}>
            <button aria-label="Önceki" onClick={() => show(index - 1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <button aria-label="Sonraki" onClick={() => show(index + 1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className={styles.progressWrap}>
            <div className={styles.progressTrack}>
              <div key={`${index}-${cycle}`} className={styles.progressFill} />
            </div>
          </div>
          <div className={styles.counter}>
            <span className={styles.current}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className={styles.total}>/{String(SLIDES.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>

      <VideoModal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoUrl={SITE_SETTINGS.promo_video_url}
      />
    </section>
  );
}
