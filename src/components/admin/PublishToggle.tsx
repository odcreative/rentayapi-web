/**
 * published/featured hızlı toggle — server component (form + bound action).
 * boolean kolonlar (published, featured) ve timestamp kolonu
 * (posts.published_at) için ortak.
 */

import { toggleFieldAction } from "@/lib/admin/actions";

type PublishToggleProps = {
  slug: string;
  id: string;
  field: string;
  label: string;
  kind: "boolean" | "timestamp";
  isOn: boolean;
};

export default function PublishToggle({
  slug,
  id,
  field,
  label,
  kind,
  isOn,
}: PublishToggleProps) {
  const action = toggleFieldAction.bind(null, slug, id, field, kind, isOn);

  return (
    <form action={action} className="inline">
      <button
        type="submit"
        title={isOn ? `${label}: açık — kapatmak için tıkla` : `${label}: kapalı — açmak için tıkla`}
        className={`rounded-sm border px-2.5 py-1 text-[12.5px] font-bold transition-colors ${
          isOn
            ? "border-red/30 bg-red/8 text-red hover:bg-red hover:text-white"
            : "border-line bg-soft text-muted hover:border-ink hover:text-ink"
        }`}
      >
        {label} {isOn ? "✓" : "—"}
      </button>
    </form>
  );
}
