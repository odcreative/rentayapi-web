/**
 * Server-side veri katmanı — guard'lı Supabase sorguları + statik fallback.
 *
 * Desen (site-settings.ts ile aynı felsefe): Supabase cloud projesi henüz
 * yokken (env placeholder / boş) her helper `fallback-content.ts` sabitlerine
 * düşer — build ve runtime env'siz de çalışır. Env dolduğunda aynı fonksiyonlar
 * otomatik olarak DB'den okur; sorgu hatasında da fallback'e düşülür (site
 * hiçbir koşulda boş içerik göstermez).
 *
 * Not: DB canlı ama tablo henüz seed'lenmemişse (0002 uygulanmadıysa) boş
 * sonuç yine fallback'e düşer — içerik 0002_content_seed.sql ile birebir aynı.
 */

import { createClient } from "@/lib/supabase/server";
import type { Faq, Post, Project, TentModel, Testimonial } from "@/lib/types";
import { FALLBACK_POSTS, FALLBACK_TENT_MODELS } from "@/lib/fallback-content";

/** DB'de içerik kaynağı henüz yok — fallback tablolarında karşılığı olmayanlar. */
const FALLBACK_PROJECTS: Project[] = [];
const FALLBACK_FAQS: Faq[] = [];
const FALLBACK_TESTIMONIALS: Testimonial[] = [];

/**
 * Supabase env hazır mı? `.env.local.example` placeholder'ları
 * (YOUR_PROJECT_REF vb.) da "yok" sayılır.
 */
function hasSupabaseEnv(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
      key &&
      url.startsWith("https://") &&
      !url.includes("YOUR_") &&
      !key.includes("YOUR_")
  );
}

// ---------------------------------------------------------------
// posts — blog yazıları (kök URL'lerde: /[slug])
// ---------------------------------------------------------------

/** Yayındaki yazılar, yeni → eski. */
export async function getPublishedPosts(): Promise<Post[]> {
  if (!hasSupabaseEnv()) return FALLBACK_POSTS;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false });
    if (error || !data || data.length === 0) return FALLBACK_POSTS;
    return data as Post[];
  } catch {
    return FALLBACK_POSTS;
  }
}

/** Slug ile tek yazı; yoksa null (route notFound() döner). */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!hasSupabaseEnv()) {
    return FALLBACK_POSTS.find((p) => p.slug === slug) ?? null;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .maybeSingle();
    if (error || !data) {
      return FALLBACK_POSTS.find((p) => p.slug === slug) ?? null;
    }
    return data as Post;
  } catch {
    return FALLBACK_POSTS.find((p) => p.slug === slug) ?? null;
  }
}

// ---------------------------------------------------------------
// tent_models — çadır modelleri (kök URL'lerde, route group `(models)`)
// ---------------------------------------------------------------

/** Yayındaki modeller, sort_order sıralı. */
export async function getTentModels(): Promise<TentModel[]> {
  if (!hasSupabaseEnv()) return FALLBACK_TENT_MODELS;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tent_models")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return FALLBACK_TENT_MODELS;
    return data as TentModel[];
  } catch {
    return FALLBACK_TENT_MODELS;
  }
}

/** Slug ile tek model; yoksa null. */
export async function getTentModelBySlug(
  slug: string
): Promise<TentModel | null> {
  if (!hasSupabaseEnv()) {
    return FALLBACK_TENT_MODELS.find((m) => m.slug === slug) ?? null;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tent_models")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !data) {
      return FALLBACK_TENT_MODELS.find((m) => m.slug === slug) ?? null;
    }
    return data as TentModel;
  } catch {
    return FALLBACK_TENT_MODELS.find((m) => m.slug === slug) ?? null;
  }
}

// ---------------------------------------------------------------
// projects — referans projeler (Faz 3'te içerik gelecek)
// ---------------------------------------------------------------

/** Yayındaki projeler; featured önce, sonra yeni → eski. */
export async function getProjects(): Promise<Project[]> {
  if (!hasSupabaseEnv()) return FALLBACK_PROJECTS;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("featured", { ascending: false })
      .order("year", { ascending: false });
    if (error || !data) return FALLBACK_PROJECTS;
    return data as Project[];
  } catch {
    return FALLBACK_PROJECTS;
  }
}

/** Slug ile tek proje; yoksa null. */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!hasSupabaseEnv()) {
    return FALLBACK_PROJECTS.find((p) => p.slug === slug) ?? null;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !data) return null;
    return data as Project;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------
// faqs / testimonials
// ---------------------------------------------------------------

/** Genel SSS (/sss + FAQ schema), sort_order sıralı. */
export async function getFaqs(): Promise<Faq[]> {
  if (!hasSupabaseEnv()) return FALLBACK_FAQS;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data) return FALLBACK_FAQS;
    return data as Faq[];
  } catch {
    return FALLBACK_FAQS;
  }
}

/** Yayındaki müşteri yorumları, sort_order sıralı. */
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!hasSupabaseEnv()) return FALLBACK_TESTIMONIALS;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error || !data) return FALLBACK_TESTIMONIALS;
    return data as Testimonial[];
  } catch {
    return FALLBACK_TESTIMONIALS;
  }
}
