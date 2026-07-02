/**
 * İçerik modeli TypeScript tipleri — supabase/migrations/0001_initial_schema.sql
 * ile birebir eşleşir (PRODUCT_PLAN §7).
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

/** Lead durumu: yeni → arandı → teklif → kapandı */
export type LeadStatus = "new" | "called" | "quoted" | "closed";

interface Timestamps {
  created_at: string;
  updated_at: string;
}

/** Çadır modelleri (etkinlik, depo, hangar, pagoda, iftar + quick-win yeniler) */
export interface TentModel extends Timestamps {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  /** Açıklık / yükseklik / kaplama vb. teknik özellikler */
  specs: Json;
  /** Görsel URL listesi: [{ url, alt, sort }] */
  gallery: Json;
  /** Model sayfası SSS: [{ question, answer }] */
  faqs: Json;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
  published: boolean;
}

/** Referans projeler (hedef: 85/85) */
export interface Project extends Timestamps {
  id: string;
  title: string;
  slug: string;
  city: string | null;
  year: number | null;
  sector: string | null;
  client_name: string | null;
  tent_model_id: string | null;
  gallery: Json;
  excerpt: string | null;
  body: string | null;
  featured: boolean;
  published: boolean;
  meta_title: string | null;
  meta_description: string | null;
}

/** Blog yazıları (31 canlı yazı migrate edilecek — kök URL'lerde) */
export interface Post extends Timestamps {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  excerpt: string | null;
  body: string | null;
  cover_url: string | null;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

/** Şehir landing sayfaları (13 mevcut + 8 yeni post-launch) */
export interface City extends Timestamps {
  id: string;
  name: string;
  slug: string;
  /** İçerik blokları: [{ type, ...props }] */
  content: Json;
  published: boolean;
}

/** Teklif talepleri — lead-gen makinesinin çekirdeği */
export interface Lead extends Timestamps {
  id: string;
  name: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  tent_model_id: string | null;
  area_m2: number | null;
  event_date: string | null;
  message: string | null;
  /** Formun gönderildiği sayfa (kaynak ölçümü) */
  source_page: string | null;
  /** utm_source / utm_medium / utm_campaign vb. */
  utm: Json;
  status: LeadStatus;
}

export interface Testimonial extends Timestamps {
  id: string;
  author_name: string;
  company: string | null;
  quote: string;
  rating: number | null;
  sort_order: number;
  published: boolean;
}

export interface ClientLogo extends Timestamps {
  id: string;
  name: string;
  logo_url: string;
  sort_order: number;
}

export interface Faq extends Timestamps {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
}

/** key/value site ayarları (iletişim, sosyal, duyuru şeridi, tanıtım videosu) */
export interface SiteSetting extends Timestamps {
  id: string;
  key: string;
  value: Json;
}
