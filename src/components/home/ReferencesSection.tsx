"use client";

/**
 * REFERANSLAR — yatay akordeon (v3), birebir React portu.
 * Kaynak: 01_TASARIM/index-v2.html `.proj-band` (markup 1072-1191,
 *         JS "PROJECT ACCORDION (v3)" bloğu 1580-1609).
 * - 4 panel; hover/focus/tıklama/dokunma ile aktifleşir (kaynak JS birebir)
 * - Aktif panel flex-grow ile genişler, görsel + bilgi bloğu belirir
 * - CTA linkleri: kaynaktaki /projelerimiz/<kategori>/ alt sayfaları henüz
 *   yok — Karar #2'deki hub-fallback deseniyle /projelerimiz'e bağlandı
 *   (404 üretmeme kuralı; kategori sayfaları açılınca güncellenecek).
 */

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./References.module.css";

type Panel = {
  num: string;
  vLabel: string;
  cat: string;
  title: string;
  desc: string;
  meta: { strong: string; label: string }[];
  href: string;
  image: string;
};

const PANELS: Panel[] = [
  {
    num: "01",
    vLabel: "Uluslararası Etkinlikler",
    cat: "Etkinlik & Fuar",
    title: "Uluslararası Etkinlikler",
    desc: "Dünya çapındaki fuar, lansman ve organizasyonlarda çadırlarımızın nasıl tercih edildiğini keşfedin.",
    meta: [
      { strong: "120+", label: "Proje" },
      { strong: "40+", label: "Marka" },
      { strong: "14 gün", label: "Ort. kurulum" },
    ],
    href: "/projelerimiz",
    image: "/images/ref-etkinlik.webp",
  },
  {
    num: "02",
    vLabel: "Endüstriyel Yapılar",
    cat: "Endüstriyel & Lojistik",
    title: "Endüstriyel Yapılar",
    desc: "Depo, hangar ve üretim alanları için 10–40 m açıklıklı, izolasyonlu ağır hizmet çadır sistemleri.",
    meta: [
      { strong: "540+", label: "Proje" },
      { strong: "5.000 m²", label: "Max. alan" },
      { strong: "10 yıl", label: "Garanti" },
    ],
    href: "/projelerimiz",
    image: "/images/ref-endustriyel.webp",
  },
  {
    num: "03",
    vLabel: "Kurumsal Lansmanlar",
    cat: "Lansman & Stand",
    title: "Kurumsal Lansmanlar",
    desc: "Otomotiv, teknoloji ve perakende dünyasının lider markaları için premium markalama destekli yapılar.",
    meta: [
      { strong: "240+", label: "Proje" },
      { strong: "1.800 m²", label: "Maks. stand" },
      { strong: "5 gün", label: "Hızlı kurulum" },
    ],
    href: "/projelerimiz",
    image: "/images/ref-kurumsal.webp",
  },
  {
    num: "04",
    vLabel: "Özel Tasarım Yapılar",
    cat: "Özel Tasarım & Spor",
    title: "Özel Tasarım Yapılar",
    desc: "Spor sahası kapatma, havuz örtüsü, VIP protokol — projeye özel mühendislik ile sınırsız form.",
    meta: [
      { strong: "300+", label: "Proje" },
      { strong: "50 m", label: "Max. açıklık" },
      { strong: "R&D", label: "Ekibi" },
    ],
    href: "/projelerimiz",
    image: "/images/ref-ozel.webp",
  },
];

/** Kaynak JS: aktif olmayan panelde link/svg tıklaması genişletme yapmaz */
const PASSTHROUGH_TAGS = ["a", "svg", "path", "line", "polyline"];

export default function ReferencesSection() {
  const [active, setActive] = useState(0);

  const handleClick = (idx: number) => (e: React.MouseEvent) => {
    if (idx === active) return; // aktifken iç link navigasyonuna izin ver
    const tag = ((e.target as HTMLElement).tagName || "").toLowerCase();
    if (!PASSTHROUGH_TAGS.includes(tag)) {
      setActive(idx);
    }
  };

  return (
    <section className={styles.projBand} id="referanslar">
      <div className="wrap">
        <div className={styles.projHead}>
          <div className={styles.sec}>
            <span className="eyebrow dark">Referanslar</span>
            <h2>İmza Attığımız Projelerimiz</h2>
            <p className={styles.lead}>
              Endüstriyel depodan uluslararası fuara, kurumsal lansmandan özel
              tasarım yapılara — dünya markalarının tercih ettiği çadır
              sistemleri ortağı.
            </p>
            <Link href="/projelerimiz" className={styles.allLink}>
              Tüm Projeler
              <span className={styles.arrIc}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </Link>
          </div>
          <div className={styles.bigstat}>
            <span className={styles.bigLabel}>Tamamlanmış Proje</span>
            <span className={styles.bigNum}>
              1.200<sup>+</sup>
            </span>
          </div>
        </div>

        {/* Yatay akordeon */}
        <div className={styles.acc} role="tablist" aria-label="Proje kategorileri">
          {PANELS.map((p, idx) => (
            <div
              key={p.num}
              className={`${styles.panel} ${idx === active ? styles.active : ""}`}
              tabIndex={0}
              role="tab"
              aria-selected={idx === active}
              onMouseEnter={() => setActive(idx)}
              onFocus={() => setActive(idx)}
              onClick={handleClick(idx)}
              onTouchStart={() => setActive(idx)}
            >
              <div className={styles.img}>
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 560px) 100vw, (max-width: 1200px) 70vw, 900px"
                />
              </div>
              <div className={styles.veil} />
              <span className={styles.num}>{p.num}</span>
              <span className={styles.vLabel}>{p.vLabel}</span>
              <span className={styles.down} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </span>
              <div className={styles.info}>
                <span className={styles.cat}>{p.cat}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className={styles.accMeta}>
                  {p.meta.map((m) => (
                    <div key={m.label} className={styles.m}>
                      <b>{m.strong}</b>
                      {m.label}
                    </div>
                  ))}
                </div>
                <Link href={p.href} className={styles.cta}>
                  Projeleri Görüntüle
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
