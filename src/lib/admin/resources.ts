/**
 * Generic CRUD kaynak konfigürasyonu — admin panelin tek gerçek kaynağı.
 *
 * Her içerik tablosu (tent_models, projects, posts, testimonials,
 * client_logos, faqs) burada deklaratif olarak tanımlanır; liste sayfası,
 * form ve server action'lar bu konfigürasyondan üretilir. Yeni tablo
 * eklemek = buraya bir kayıt eklemek.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "checkbox"
  | "json"
  | "date"
  | "datetime"
  | "select";

export interface FieldDef {
  /** DB kolon adı */
  name: string;
  /** Türkçe form etiketi */
  label: string;
  type: FieldType;
  required?: boolean;
  /** Alan altında gösterilecek yardım metni */
  help?: string;
  /** textarea/json satır sayısı */
  rows?: number;
  /** json alanı boş bırakılırsa yazılacak varsayılan ("{}" veya "[]") */
  jsonDefault?: string;
  /** select: seçenekleri bu tablodan çek (value/label kolonları) */
  optionsFrom?: { table: string; valueColumn: string; labelColumn: string };
}

export type CellKind = "text" | "boolean" | "number" | "date";

export interface ListColumn {
  name: string;
  label: string;
  kind?: CellKind;
}

export interface ToggleDef {
  /** DB kolonu (boolean ya da timestamptz) */
  field: string;
  label: string;
  /** boolean: true/false — timestamp: now()/null (posts.published_at) */
  kind: "boolean" | "timestamp";
}

export interface ResourceConfig {
  /** URL segmenti: /admin/[slug] */
  slug: string;
  /** Supabase tablo adı */
  table: string;
  labelSingular: string;
  labelPlural: string;
  /** Liste satırının ana başlığı olarak gösterilecek kolon */
  titleField: string;
  orderBy: { column: string; ascending: boolean };
  listColumns: ListColumn[];
  fields: FieldDef[];
  toggles?: ToggleDef[];
}

const META_FIELDS: FieldDef[] = [
  { name: "meta_title", label: "Meta Başlık (SEO)", type: "text" },
  {
    name: "meta_description",
    label: "Meta Açıklama (SEO)",
    type: "textarea",
    rows: 2,
  },
];

export const RESOURCES: Record<string, ResourceConfig> = {
  modeller: {
    slug: "modeller",
    table: "tent_models",
    labelSingular: "Çadır Modeli",
    labelPlural: "Çadır Modelleri",
    titleField: "name",
    orderBy: { column: "sort_order", ascending: true },
    listColumns: [
      { name: "name", label: "Model" },
      { name: "slug", label: "Slug" },
      { name: "sort_order", label: "Sıra", kind: "number" },
      { name: "published", label: "Yayın", kind: "boolean" },
    ],
    fields: [
      { name: "name", label: "Model Adı", type: "text", required: true },
      {
        name: "slug",
        label: "Slug (URL)",
        type: "text",
        required: true,
        help: "Kök URL — canlı site ile birebir korunur (örn. depo-cadiri).",
      },
      { name: "description", label: "Açıklama", type: "textarea", rows: 5 },
      {
        name: "specs",
        label: "Teknik Özellikler (JSON)",
        type: "json",
        jsonDefault: "{}",
        help: 'Örn: {"aciklik": "10-40 m", "yukseklik": "4-6 m"}',
      },
      {
        name: "gallery",
        label: "Galeri (JSON)",
        type: "json",
        jsonDefault: "[]",
        help: 'Örn: [{"url": "/images/x.webp", "alt": "...", "sort": 1}]',
      },
      {
        name: "faqs",
        label: "Model SSS (JSON)",
        type: "json",
        jsonDefault: "[]",
        help: 'Örn: [{"question": "...", "answer": "..."}]',
      },
      { name: "sort_order", label: "Sıra", type: "number" },
      { name: "published", label: "Yayında", type: "checkbox" },
      ...META_FIELDS,
    ],
    toggles: [{ field: "published", label: "Yayın", kind: "boolean" }],
  },

  projeler: {
    slug: "projeler",
    table: "projects",
    labelSingular: "Proje",
    labelPlural: "Projeler",
    titleField: "title",
    orderBy: { column: "created_at", ascending: false },
    listColumns: [
      { name: "title", label: "Proje" },
      { name: "city", label: "Şehir" },
      { name: "year", label: "Yıl", kind: "number" },
      { name: "sector", label: "Sektör" },
      { name: "featured", label: "Öne Çıkan", kind: "boolean" },
      { name: "published", label: "Yayın", kind: "boolean" },
    ],
    fields: [
      { name: "title", label: "Proje Başlığı", type: "text", required: true },
      { name: "slug", label: "Slug (URL)", type: "text", required: true },
      { name: "city", label: "Şehir", type: "text" },
      { name: "year", label: "Yıl", type: "number" },
      { name: "sector", label: "Sektör", type: "text" },
      { name: "client_name", label: "Müşteri Adı", type: "text" },
      {
        name: "tent_model_id",
        label: "Çadır Modeli",
        type: "select",
        optionsFrom: {
          table: "tent_models",
          valueColumn: "id",
          labelColumn: "name",
        },
      },
      {
        name: "gallery",
        label: "Galeri (JSON)",
        type: "json",
        jsonDefault: "[]",
        help: 'Örn: [{"url": "/images/x.webp", "alt": "...", "sort": 1}]',
      },
      { name: "excerpt", label: "Özet", type: "textarea", rows: 3 },
      { name: "body", label: "İçerik", type: "textarea", rows: 10 },
      { name: "featured", label: "Öne Çıkan", type: "checkbox" },
      { name: "published", label: "Yayında", type: "checkbox" },
      ...META_FIELDS,
    ],
    toggles: [
      { field: "published", label: "Yayın", kind: "boolean" },
      { field: "featured", label: "Öne Çıkan", kind: "boolean" },
    ],
  },

  blog: {
    slug: "blog",
    table: "posts",
    labelSingular: "Blog Yazısı",
    labelPlural: "Blog Yazıları",
    titleField: "title",
    orderBy: { column: "created_at", ascending: false },
    listColumns: [
      { name: "title", label: "Başlık" },
      { name: "category", label: "Kategori" },
      { name: "published_at", label: "Yayın Tarihi", kind: "date" },
      { name: "published_at", label: "Yayın", kind: "boolean" },
    ],
    fields: [
      { name: "title", label: "Başlık", type: "text", required: true },
      {
        name: "slug",
        label: "Slug (URL)",
        type: "text",
        required: true,
        help: "Blog yazıları kök URL'de yaşar (SEO migrasyonu) — örn. cadir-kiralama-fiyatlari.",
      },
      { name: "category", label: "Kategori", type: "text" },
      { name: "excerpt", label: "Özet", type: "textarea", rows: 3 },
      { name: "body", label: "İçerik", type: "textarea", rows: 14 },
      { name: "cover_url", label: "Kapak Görseli URL", type: "text" },
      {
        name: "published_at",
        label: "Yayın Tarihi",
        type: "datetime",
        help: "Boş bırakılırsa taslak kalır.",
      },
      ...META_FIELDS,
    ],
    toggles: [{ field: "published_at", label: "Yayın", kind: "timestamp" }],
  },

  referanslar: {
    slug: "referanslar",
    table: "testimonials",
    labelSingular: "Referans (Yorum)",
    labelPlural: "Referanslar",
    titleField: "author_name",
    orderBy: { column: "sort_order", ascending: true },
    listColumns: [
      { name: "author_name", label: "Kişi" },
      { name: "company", label: "Firma" },
      { name: "rating", label: "Puan", kind: "number" },
      { name: "sort_order", label: "Sıra", kind: "number" },
      { name: "published", label: "Yayın", kind: "boolean" },
    ],
    fields: [
      { name: "author_name", label: "Kişi Adı", type: "text", required: true },
      { name: "company", label: "Firma", type: "text" },
      { name: "quote", label: "Yorum", type: "textarea", rows: 4, required: true },
      { name: "rating", label: "Puan (1-5)", type: "number" },
      { name: "sort_order", label: "Sıra", type: "number" },
      { name: "published", label: "Yayında", type: "checkbox" },
    ],
    toggles: [{ field: "published", label: "Yayın", kind: "boolean" }],
  },

  logolar: {
    slug: "logolar",
    table: "client_logos",
    labelSingular: "Müşteri Logosu",
    labelPlural: "Müşteri Logoları",
    titleField: "name",
    orderBy: { column: "sort_order", ascending: true },
    listColumns: [
      { name: "name", label: "Müşteri" },
      { name: "logo_url", label: "Logo URL" },
      { name: "sort_order", label: "Sıra", kind: "number" },
    ],
    fields: [
      { name: "name", label: "Müşteri Adı", type: "text", required: true },
      { name: "logo_url", label: "Logo URL", type: "text", required: true },
      { name: "sort_order", label: "Sıra", type: "number" },
    ],
  },

  sss: {
    slug: "sss",
    table: "faqs",
    labelSingular: "SSS",
    labelPlural: "Sık Sorulan Sorular",
    titleField: "question",
    orderBy: { column: "sort_order", ascending: true },
    listColumns: [
      { name: "question", label: "Soru" },
      { name: "category", label: "Kategori" },
      { name: "sort_order", label: "Sıra", kind: "number" },
    ],
    fields: [
      { name: "question", label: "Soru", type: "text", required: true },
      { name: "answer", label: "Cevap", type: "textarea", rows: 5, required: true },
      { name: "category", label: "Kategori", type: "text" },
      { name: "sort_order", label: "Sıra", type: "number" },
    ],
  },
};

export function getResource(slug: string): ResourceConfig | null {
  return Object.prototype.hasOwnProperty.call(RESOURCES, slug)
    ? RESOURCES[slug]
    : null;
}

/** Sidebar navigasyonu (Dashboard/Lead'ler/Ayarlar + CRUD kaynakları) */
export const ADMIN_NAV: { href: string; label: string }[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Lead'ler" },
  { href: "/admin/modeller", label: "Modeller" },
  { href: "/admin/projeler", label: "Projeler" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/referanslar", label: "Referanslar" },
  { href: "/admin/logolar", label: "Logolar" },
  { href: "/admin/sss", label: "SSS" },
  { href: "/admin/settings", label: "Site Ayarları" },
];
