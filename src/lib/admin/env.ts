/**
 * Supabase env guard — cloud proje henüz yokken (env placeholder/boş)
 * admin paneli ve middleware'in zarifçe "yapılandırılmamış" moduna
 * düşmesini sağlar. Build-time'da asla patlamaz.
 */

export const NOT_CONFIGURED_MESSAGE =
  "Supabase bağlantısı yapılandırılmamış — .env.local dosyasını doldurun.";

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return false;

  // .env.local.example placeholder'ları doldurulmamış sayılır
  if (url.includes("YOUR_PROJECT_REF") || key.startsWith("YOUR_")) return false;

  try {
    // Geçersiz URL → createClient'a hiç gitme
    new URL(url);
  } catch {
    return false;
  }

  return true;
}
