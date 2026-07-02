/**
 * Anasayfa placeholder section iskeleti — Faz 1'de gerçek section'lar
 * (index-v2.html kurgusu) React'e porte edildikçe yerini bırakacak.
 */

type SectionPlaceholderProps = {
  id?: string;
  eyebrow: string;
  title: string;
  note?: string;
  dark?: boolean;
  soft?: boolean;
};

export default function SectionPlaceholder({
  id,
  eyebrow,
  title,
  note,
  dark = false,
  soft = false,
}: SectionPlaceholderProps) {
  return (
    <section
      id={id}
      style={{
        padding: "90px 0",
        background: dark ? "var(--ink-blue)" : soft ? "var(--soft)" : "#fff",
      }}
    >
      <div className="wrap">
        <span className={`eyebrow${dark ? " dark" : ""}`}>{eyebrow}</span>
        <h2 style={dark ? { color: "#fff" } : undefined}>{title}</h2>
        {note && (
          <p
            style={{
              marginTop: 14,
              maxWidth: 560,
              color: dark ? "#8b96a1" : "var(--muted)",
            }}
          >
            {note}
          </p>
        )}
        {/* "Yakında" iskeleti */}
        <div
          style={{
            marginTop: 36,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
          aria-hidden
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                height: 150,
                borderRadius: "var(--radius-md)",
                background: dark
                  ? "rgba(255,255,255,.05)"
                  : "var(--softer)",
                border: `1px dashed ${
                  dark ? "rgba(255,255,255,.12)" : "var(--line)"
                }`,
                display: "grid",
                placeItems: "center",
                color: dark ? "#6b7681" : "var(--muted)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: ".18em",
                textTransform: "uppercase",
              }}
            >
              Yakında
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
