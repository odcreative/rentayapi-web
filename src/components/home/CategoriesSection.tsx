"use client";

/**
 * ÜRÜN KATEGORİLERİ — 8'li kategori carousel'i, birebir React portu.
 * Kaynak: 01_TASARIM/anasayfa-native/renta-kategori-carousel.{css,js}
 *         + renta-kategori-carousel-onizleme.html (içerik + layout)
 * - Yatay scroll-snap track, ileri/geri oklar, "01 / 08" sayaç, progress bar
 * - Sürükle-kaydır (mouse) + klavye ok tuşları — kaynak JS ile aynı davranış
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Categories.module.css";

type MetaItem = { strong: string; rest?: string };

type Category = {
  num: string;
  tag: string;
  title: string;
  desc: string;
  meta: [MetaItem, MetaItem];
  href: string;
  image: string;
};

const CATEGORIES: Category[] = [
  {
    num: "01 · Ağır Hizmet",
    tag: "Endüstriyel",
    title: "Endüstriyel Çadırlar",
    desc: "Depo, hangar ve üretim alanları için ağır hizmet tipi modüler yapılar. 10–40 m açıklık.",
    meta: [
      { strong: "10–40 m", rest: " açıklık" },
      { strong: "10 yıl", rest: " garanti" },
    ],
    href: "/cadir-modelleri", // hub fallback (Karar #2) — kök model sayfası yok, quick-win açılınca güncellenecek
    image: "/images/cat-endustriyel.webp",
  },
  {
    num: "02 · Organizasyon",
    tag: "Etkinlik",
    title: "Etkinlik Çadırları",
    desc: "Düğün, fuar, kurumsal etkinlik ve organizasyonlar için A sınıfı çözümler.",
    meta: [
      { strong: "5–25 m", rest: " açıklık" },
      { strong: "72 saat", rest: " kurulum" },
    ],
    href: "/etkinlik-cadiri", // kök model sayfası (Karar #2)
    image: "/images/cat-etkinlik.webp",
  },
  {
    num: "03 · Kompakt",
    tag: "Pagoda",
    title: "Pagoda Çadırlar",
    desc: "3×3, 4×4, 5×5 ve 6×6 modüler kompakt etkinlik çadır sistemleri.",
    meta: [
      { strong: "3×3 – 6×6 m" },
      { strong: "Hızlı", rest: " kurulum" },
    ],
    href: "/pagoda-cadir", // kök model sayfası (Karar #2)
    image: "/images/cat-pagoda.webp",
  },
  {
    num: "04 · Projeye Özel",
    tag: "Özel Tasarım",
    title: "Özel Tasarım Yapılar",
    desc: "Spor sahası kapatma, havuz örtüsü, fabrika genişletme — ihtiyaca özel mühendislik.",
    meta: [
      { strong: "Sınırsız", rest: " form" },
      { strong: "R&D", rest: " destekli" },
    ],
    href: "/cadir-modelleri", // hub fallback (Karar #2)
    image: "/images/cat-ozel.webp",
  },
  {
    num: "05 · Lojistik",
    tag: "Depo Çadırı",
    title: "Depo Çadırları",
    desc: "Sezonluk stok, lojistik üs ve yedek depolama için izolasyonlu ağır hizmet yapıları.",
    meta: [{ strong: "500–5.000 m²" }, { strong: "İzolasyonlu" }],
    href: "/depo-cadiri", // kök model sayfası (Karar #2)
    image: "/images/cat-depo.webp",
  },
  {
    num: "06 · Stand & Lansman",
    tag: "Fuar Çadırı",
    title: "Fuar & Stand Çadırları",
    desc: "Marka lansmanları, fuar standları ve roadshow için şeffaf cepheli özel çözümler.",
    meta: [{ strong: "Cam cephe" }, { strong: "Markalama" }],
    href: "/cadir-modelleri", // hub fallback (Karar #2) — fuar/stand quick-win sayfası S2-3'te brieflendi
    image: "/images/cat-fuar.webp",
  },
  {
    num: "07 · Geniş Açıklık",
    tag: "Spor & Havuz",
    title: "Spor Sahası Kapatma",
    desc: "Tenis kortu, halı saha, yüzme havuzu örtüleri ve büyük açıklıklı spor tesisi yapıları.",
    meta: [
      { strong: "20–50 m", rest: " açıklık" },
      { strong: "Tüm sezon" },
    ],
    href: "/cadir-modelleri", // hub fallback (Karar #2)
    image: "/images/cat-spor.webp",
  },
  {
    num: "08 · Premium",
    tag: "VIP Protokol",
    title: "VIP Protokol Çadırları",
    desc: "Davet, protokol ve özel etkinlikler için lüks finiş ve klima entegrasyonlu çözümler.",
    meta: [{ strong: "Klimalı" }, { strong: "Lüks finiş" }],
    href: "/cadir-modelleri", // hub fallback (Karar #2)
    image: "/images/cat-vip.webp",
  },
];

const pad2 = (n: number) => String(n).padStart(2, "0");

export default function CategoriesSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [cur, setCur] = useState(1);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Kart adımı: ilk iki kartın sol kenarları arası mesafe (kaynak JS ile aynı)
  const step = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const cards = track.children;
    if (cards.length < 2) return track.clientWidth;
    return (
      cards[1].getBoundingClientRect().left -
      cards[0].getBoundingClientRect().left
    );
  }, []);

  // Sayaç + progress bar + ok durumları (kaynak JS `update` birebir)
  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const count = track.children.length;
    if (!count) return;

    const max = track.scrollWidth - track.clientWidth;
    const ratio = max > 0 ? Math.min(1, track.scrollLeft / max) : 0;

    const s = step();
    const idx = s > 0 ? Math.round(track.scrollLeft / s) : 0;
    setCur(Math.max(0, Math.min(count - 1, idx)) + 1);

    const bar = barRef.current;
    if (bar) {
      const visible = Math.min(1, track.clientWidth / track.scrollWidth);
      const barW = visible * 100;
      const barOffset = ratio * (100 - barW);
      bar.style.width = `${barW}%`;
      bar.style.transform = `translateX(${barW ? (barOffset / barW) * 100 : 0}%)`;
    }

    setAtStart(track.scrollLeft <= 2);
    setAtEnd(track.scrollLeft >= max - 2);
  }, [step]);

  const go = useCallback(
    (dir: number) => {
      trackRef.current?.scrollBy({ left: dir * step(), behavior: "smooth" });
    },
    [step]
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => window.requestAnimationFrame(update);
    const onResize = () => window.requestAnimationFrame(update);
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Fare ile sürükle-kaydır (kaynak JS birebir)
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    const onDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX;
      startScroll = track.scrollLeft;
      setDragging(true);
    };
    const onUp = () => {
      if (!isDown) return;
      isDown = false;
      setDragging(false);
    };
    const onMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      track.scrollLeft = startScroll - (e.pageX - startX);
    };
    track.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);

    update();

    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      track.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
    };
  }, [update]);

  return (
    <section className={styles.catBand} id="urunler">
      <div className="wrap">
        <div className={styles.head}>
          <div className={styles.headText}>
            <span className="eyebrow">Ürün Kategorileri</span>
            <h2>Her ihtiyaca özel bir çadır sistemi</h2>
            <p className={styles.lead}>
              Endüstriyel depodan etkinlik çadırına, kompakt pagodadan VIP
              protokol yapılarına — 8 ana kategoride 40+ standart model.
            </p>
          </div>
          <div className={styles.ctrl}>
            <div className={styles.pos}>
              <span>{pad2(cur)}</span>
              <span className={styles.sep}>/</span>
              <span className={styles.tot}>{pad2(CATEGORIES.length)}</span>
            </div>
            <div className={styles.btns}>
              <button
                className={styles.nav}
                aria-label="Önceki ürün"
                disabled={atStart}
                onClick={() => go(-1)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
              <button
                className={styles.nav}
                aria-label="Sonraki ürün"
                disabled={atEnd}
                onClick={() => go(1)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div
          ref={trackRef}
          className={`${styles.track} ${dragging ? styles.dragging : ""}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              go(-1);
            }
            if (e.key === "ArrowRight") {
              e.preventDefault();
              go(1);
            }
          }}
        >
          {CATEGORIES.map((c) => (
            <Link key={c.num} href={c.href} className={styles.card} draggable={false}>
              <Image
                src={c.image}
                alt={c.title}
                fill
                sizes="(max-width: 767px) 86vw, (max-width: 1024px) 45vw, 400px"
                className={styles.img}
                draggable={false}
              />
              <div className={styles.top}>
                <span className={styles.num}>{c.num}</span>
                <span className={styles.arr} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
              <div className={styles.info}>
                <span className={styles.tag}>{c.tag}</span>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <div className={styles.meta}>
                  <span>
                    <b>{c.meta[0].strong}</b>
                    {c.meta[0].rest}
                  </span>
                  <span className={styles.dot} />
                  <span>
                    <b>{c.meta[1].strong}</b>
                    {c.meta[1].rest}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.progress}>
          <span ref={barRef} className={styles.bar} />
        </div>
      </div>
    </section>
  );
}
