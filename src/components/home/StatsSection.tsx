"use client";

/**
 * HAKKIMIZDA ÖNİZLEME + SAYAÇ KARTLARI — birebir React portu.
 * Kaynak: 01_TASARIM/index-v2.html — .abt bloğu (Alternatif 1, Editoryal)
 * - 4 sayaç kartı: 15+ yıl / 81 il / 35.000 m² / 1.200+ proje (kaynak rakamlar AYNEN)
 * - Sayaçlar progressive: SSR'da gerçek (final) rakam basılır; JS yüklenince
 *   IntersectionObserver + count-up animasyonu enhancement olarak devreye girer.
 *   (Canlı sitedeki "0 B m²" kırık sayaç sorununun tekrarını engeller.)
 * - "Tanıtım Filmini İzle" → VideoModal (Hero'daki mevcut desen)
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import VideoModal from "@/components/ui/VideoModal";
import { SITE_SETTINGS } from "@/lib/site-settings";
import styles from "./Stats.module.css";

type Stat = {
  icon: ReactNode;
  value: number;
  plus?: boolean;
  label: string;
};

const STATS: Stat[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="3" width="14" height="18" rx="2" />
        <path d="M8 7h6M8 11h6M8 15h3" />
        <circle cx="18.5" cy="17.5" r="3" />
        <path d="M18.5 15.5v2l1.2 1" />
      </svg>
    ),
    value: 15,
    plus: true,
    label: "Yıllık Tecrübe",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 21s-7-5.2-7-11a7 7 0 1114 0c0 5.8-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
    value: 81,
    label: "İl'de Teslimat",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 4h6M4 4v6M4 4l6 6M20 20h-6M20 20v-6M20 20l-6-6" />
      </svg>
    ),
    value: 35000,
    label: "Toplam Alan m²",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15l-4.8 2.5.9-5.4L4.2 8.3l5.4-.8z" />
      </svg>
    ),
    value: 1200,
    plus: true,
    label: "Tamamlanan Proje",
  },
];

const COUNT_UP_MS = 1400;

/**
 * Progressive sayaç: SSR çıktısında ve JS yokken her zaman gerçek (final)
 * rakam görünür. Görünüme girince 0'dan hedefe count-up yapar.
 * prefers-reduced-motion'da animasyon atlanır.
 */
function StatNum({ value, plus }: { value: number; plus?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / COUNT_UP_MS);
          const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
          setDisplay(Math.round(value * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <div ref={ref} className={styles.num}>
      {display.toLocaleString("tr-TR")}
      {plus && <sup>+</sup>}
    </div>
  );
}

export default function StatsSection() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className={styles.abt} id="hakkimizda">
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.copy}>
          <div className={styles.title}>RENTA YAPI</div>
          <p>
            Renta Yapı, 15 yılı aşkın süredir endüstriyel çadır sistemleri
            sektöründe faaliyet göstermektedir. Bu süreçte edinilen tecrübe,
            sürekli gelişen kalitemiz ve son teknolojiyi takip eden yatırım
            yaklaşımı firmamızı Türkiye&apos;nin öncü konumuna getirmiştir.
          </p>
          <p>
            Çelik konstrüksiyon disipliniyle modüler ürün geliştiriyor;
            kalıphane, üretim, montaj ve saha ekiplerimizle her projeyi
            sıfırdan tasarlıyoruz. 2009&apos;dan bu yana 1.200+ projeyi 81 ilde
            anahtar teslim tamamladık.
          </p>
          <div className={styles.actions}>
            <Link href="/hakkimizda" className={styles.btnPrimary}>
              Hakkımızda <span className={styles.arrow}>→</span>
            </Link>
            <button className={styles.play} onClick={() => setVideoOpen(true)}>
              <span className={styles.pbtn}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              Tanıtım Filmini İzle
            </button>
          </div>
          <div className={styles.stats}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.card}>
                <div className={styles.ic}>{s.icon}</div>
                <StatNum value={s.value} plus={s.plus} />
                <div className={styles.lab}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.collage}>
          <div className={`${styles.shot} ${styles.top}`}>
            <Image
              src="/images/about-top.webp"
              alt="Renta Yapı üretim tesisi havadan görünüm"
              fill
              sizes="(max-width: 860px) 100vw, 50vw"
            />
          </div>
          <div className={`${styles.shot} ${styles.bottom}`}>
            <Image
              src="/images/about-bottom.webp"
              alt="Renta Yapı fabrika binası"
              fill
              sizes="(max-width: 860px) 100vw, 50vw"
            />
          </div>
          <div className={`${styles.shot} ${styles.float}`}>
            <Image
              src="/images/about-float.webp"
              alt="Üretim hattı ekipmanları"
              fill
              sizes="230px"
            />
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
