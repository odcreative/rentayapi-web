import type { SVGProps } from "react";

/**
 * Renta Yapı — İkon bileşeni (sprite tabanlı).
 * Kaynak: 01_TASARIM/docs/icons/build_icons.py  →  public/icons/renta-icons.svg
 * Tüm ikonlar 24×24, 2px stroke, currentColor. Renk = çevreleyen metnin `color`'ı.
 *
 *   <Icon name="tent-event" />                 // 24px, metin rengi
 *   <Icon name="phone-call" size={20} className="text-red" />
 *   <Icon name="star" size={16} style={{ color: "var(--star)" }} title="Puan" />
 */
export type RentaIconName = "search" | "menu" | "close" | "home" | "arrow-left" | "arrow-right" | "arrow-up-right" | "chevron-down" | "chevron-up" | "chevron-left" | "chevron-right" | "plus" | "minus" | "check" | "check-circle" | "x-circle" | "filter" | "sliders" | "grid" | "list" | "more-horizontal" | "more-vertical" | "external-link" | "share" | "heart" | "star" | "play" | "pause" | "refresh" | "globe" | "eye" | "download" | "info" | "alert" | "phone" | "phone-call" | "mail" | "message" | "send" | "map-pin" | "navigation" | "map" | "calculator" | "quote" | "clipboard" | "headset" | "card" | "clock" | "tent-event" | "tent-warehouse" | "tent-big" | "tent-pagoda" | "tent-dome" | "tent-ramadan" | "tent-fair" | "tent-arch" | "tent-hangar" | "tent-transparent" | "tent-double" | "tent-canopy" | "tent-gazebo" | "tent-corridor" | "tent-polygon" | "tent-cube" | "tent-stage" | "tent-container" | "tent-pavilion" | "tent-inflatable" | "span-width" | "height" | "area" | "snow-load" | "wind" | "fire-retardant" | "waterproof" | "membrane" | "frame" | "modular" | "anchor" | "ventilation" | "glass" | "gutter" | "load" | "weather" | "temperature" | "expandable" | "roof-pitch" | "hvac" | "heater" | "lighting" | "flooring" | "carpet" | "door-glass" | "door-sliding" | "window" | "stage" | "furniture" | "power" | "sound" | "truss" | "partition" | "ramp" | "survey" | "design" | "quote-approve" | "production" | "delivery" | "installation" | "rental" | "handover" | "dismantle" | "maintenance" | "support" | "permit" | "inspection" | "warranty" | "fair" | "festival" | "wedding" | "corporate" | "concert" | "sports" | "exhibition" | "ramadan" | "logistics" | "construction" | "industrial" | "agriculture" | "military" | "emergency" | "aviation" | "automotive" | "catering" | "education" | "healthcare" | "experience" | "iso" | "quality" | "fast-setup" | "nationwide" | "custom" | "award" | "references" | "team" | "safety" | "eco" | "export" | "projects" | "turnkey" | "article" | "catalog" | "pdf" | "guide" | "faq" | "checklist" | "tag" | "receipt" | "ruler" | "gallery" | "video" | "news" | "tip" | "compare" | "logo" | "facebook" | "instagram" | "linkedin" | "youtube" | "x-twitter" | "whatsapp" | "google";

type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: RentaIconName;
  /** px — 14/16/20/24/28/32/40/48/64 önerilir. Varsayılan 24. */
  size?: number;
  /** Erişilebilir başlık. Verilirse ikon anlamlı (role="img"); yoksa dekoratif. */
  title?: string;
};

/** Küçükte biraz kalın, büyükte biraz ince — optik denge (icons.css ile aynı). */
function opticalStroke(size: number): number {
  if (size <= 16) return 2.25;
  if (size >= 40) return 1.75;
  return 2;
}

export function Icon({ name, size = 24, title, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={opticalStroke(size)}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable={false}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <use href={`/icons/renta-icons.svg#rt-${name}`} />
    </svg>
  );
}

export default Icon;
