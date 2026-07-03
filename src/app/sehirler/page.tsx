import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Şehirler — Türkiye Genelinde Kiralık Çadır",
  description:
    "İstanbul'dan Trabzon'a 13 şehirde kiralık çadır kurulumu. Şehrinizdeki Renta Yapı hizmetlerini keşfedin — 81 il'e teslimat.",
};

/**
 * Şehirler hub'ı — /sehirler (Karar #3: hub route AÇIK).
 * 13 mevcut şehir landing'inin iç-link merkezi; canlı URL slug'ları
 * birebir korunur (06_MIGRASYON/301-redirect-haritasi.csv — BIREBIR-KORUNUR).
 * Landing içerikleri Faz 4'te — bu sayfa yalnızca hub iskeleti.
 */

const CITIES: { name: string; slug: string }[] = [
  { name: "Adana", slug: "adana-kiralik-cadir" },
  { name: "Ankara", slug: "ankara-kiralik-cadir" },
  { name: "Antalya", slug: "antalya-kiralik-cadir" },
  { name: "Bodrum", slug: "bodrum-kiralik-cadir" },
  { name: "Bursa", slug: "bursa-kiralik-cadir" },
  { name: "Gebze", slug: "gebze-kiralik-cadir" },
  { name: "İstanbul", slug: "istanbul-kiralik-cadir" },
  { name: "İzmir", slug: "izmir-kiralik-cadir" },
  { name: "Kocaeli", slug: "kocaeli-kiralik-cadir" },
  { name: "Mersin", slug: "mersin-kiralik-cadir" },
  { name: "Ordu", slug: "ordu-kiralik-cadir" },
  { name: "Sivas", slug: "sivas-kiralik-cadir" },
  { name: "Trabzon", slug: "trabzon-kiralik-cadir" },
];

export default function SehirlerPage() {
  return (
    <section style={{ padding: "90px 0 120px", minHeight: "55vh" }}>
      <div className="wrap">
        <span className="eyebrow">Şehirler</span>
        <h1 style={{ fontSize: "clamp(32px, 4.4vw, 56px)" }}>
          Türkiye Genelinde Kiralık Çadır
        </h1>
        <p style={{ marginTop: 18, maxWidth: 640, color: "var(--muted)", fontSize: 17 }}>
          81 il&apos;e teslimat yapıyoruz. Aşağıdaki şehirler için yerel kurulum
          ve referans projelerimizi inceleyin.
        </p>
        <ul
          style={{
            marginTop: 40,
            listStyle: "none",
            padding: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {CITIES.map((city) => (
            <li key={city.slug}>
              <Link
                href={`/sehirler/${city.slug}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "18px 22px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--line)",
                  background: "#fff",
                  color: "var(--ink)",
                  fontWeight: 700,
                  fontSize: 15.5,
                }}
              >
                {city.name}
                <span aria-hidden="true" style={{ color: "var(--red)" }}>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
