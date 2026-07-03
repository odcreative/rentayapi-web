/**
 * Admin girişi doğrulama — anon key + signInWithPassword.
 *
 * Kullanım:  node scripts/verify-admin-login.mjs
 *
 * `.env.local` (URL + anon key) ve `.env.admin.local` (ADMIN_EMAIL +
 * ADMIN_PASSWORD) dosyalarını okur; admin panelin kullandığı akışın
 * aynısıyla (public anon client → signInWithPassword) girişi doğrular.
 * Şifre hiçbir çıktıya yazılmaz.
 */

import { createClient } from "@supabase/supabase-js";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const APP_DIR = path.resolve(import.meta.dirname, "..");

for (const file of [".env.local", ".env.admin.local"]) {
  const p = path.join(APP_DIR, file);
  if (!existsSync(p)) {
    console.error(`HATA: ${p} yok.`);
    process.exit(1);
  }
  process.loadEnvFile(p);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!url || !anonKey || !email || !password) {
  console.error("HATA: gerekli env değişkenleri eksik.");
  process.exit(1);
}

const supabase = createClient(url, anonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

if (error || !data.user) {
  console.error(`✘ GİRİŞ BAŞARISIZ (${email}):`, error?.message ?? "kullanıcı yok");
  process.exit(1);
}

console.log(`✔ GİRİŞ BAŞARILI: ${data.user.email} (id: ${data.user.id})`);
console.log(`  role: ${data.user.role} | email_confirmed: ${Boolean(data.user.email_confirmed_at)}`);

await supabase.auth.signOut();
console.log("✔ Oturum kapatıldı (test temiz).");
