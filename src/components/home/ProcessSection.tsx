import styles from "./Process.module.css";

/**
 * SÜREÇ — 5 adımlık süreç bandı (timeline), birebir port.
 * Kaynak: 01_TASARIM/index-v2.html `.proc-band` (markup 1246-1262).
 * Statik içerik, JS davranışı yok — server component.
 */

type Step = {
  num: string;
  title: string;
  desc: string;
};

const STEPS: Step[] = [
  { num: "01", title: "Keşif & Analiz", desc: "Saha incelemesi, zemin ve erişim raporu." },
  { num: "02", title: "Tasarım", desc: "3D yerleşim, ölçü ve modül seçimi." },
  { num: "03", title: "Üretim", desc: "Çelik konstrüksiyon + PVC kaplama." },
  { num: "04", title: "Montaj", desc: "72 saatte anahtar teslim kurulum." },
  { num: "05", title: "Teslim & Garanti", desc: "10 yıla kadar yapısal garanti." },
];

export default function ProcessSection() {
  return (
    <section className={styles.procBand}>
      <div className="wrap">
        <div className={styles.head}>
          <span className="eyebrow">Nasıl Çalışıyoruz</span>
          <h2>5 adımda projenizi hayata geçiriyoruz</h2>
          <p className={styles.lead}>
            İlk görüşmeden anahtar teslimine kadar tüm süreci tek bir ekiple
            yönetiyoruz.
          </p>
        </div>
        <div className={styles.timeline}>
          {STEPS.map((s) => (
            <div key={s.num} className={styles.step}>
              <div className={styles.ico}>{s.num}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
