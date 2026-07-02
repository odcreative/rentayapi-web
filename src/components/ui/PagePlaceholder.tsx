/**
 * İç sayfa placeholder'ı — route iskeleti için.
 * Gerçek sayfa tasarımları (hakkimizda.html, iletisim.html, sss.html,
 * depo-cadiri.html vb.) fazlar ilerledikçe porte edilecek.
 */

type PagePlaceholderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export default function PagePlaceholder({
  eyebrow,
  title,
  description,
  children,
}: PagePlaceholderProps) {
  return (
    <section style={{ padding: "90px 0 120px", minHeight: "55vh" }}>
      <div className="wrap">
        <span className="eyebrow">{eyebrow}</span>
        <h1 style={{ fontSize: "clamp(32px, 4.4vw, 56px)" }}>{title}</h1>
        {description && (
          <p style={{ marginTop: 18, maxWidth: 640, color: "var(--muted)", fontSize: 17 }}>
            {description}
          </p>
        )}
        <div
          style={{
            marginTop: 40,
            padding: "28px 32px",
            borderRadius: "var(--radius-md)",
            background: "var(--soft)",
            border: "1px dashed var(--line)",
            color: "var(--muted)",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: ".04em",
          }}
        >
          Bu sayfa iskelet aşamasında — tasarım portu ve içerik bağlantısı
          yol haritasındaki fazında tamamlanacak.
        </div>
        {children}
      </div>
    </section>
  );
}
