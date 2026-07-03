/**
 * Admin kullanıcısı oluşturma — İDEMPOTENT.
 *
 * Kullanım:  node scripts/create-admin.mjs
 *
 * - `.env.local`'daki SUPABASE_SERVICE_ROLE_KEY ile Supabase Auth'a
 *   admin@rentayapi.com kullanıcısını ekler (email_confirm: true).
 * - Kullanıcı ZATEN varsa: şifreye DOKUNMAZ, sadece raporlar.
 * - Yeni oluşturulursa: şifre `openssl rand -base64 24` ile üretilir ve
 *   SADECE `.env.admin.local` dosyasına (0600) yazılır — stdout'a,
 *   log'a veya rapora asla yazılmaz.
 *
 * GÜVENLİK: service_role anahtarı yalnızca bu server-side script'te,
 * env üzerinden kullanılır. Client koduna asla girmez.
 */

import { createClient } from "@supabase/supabase-js";
import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const APP_DIR = path.resolve(import.meta.dirname, "..");
const ENV_LOCAL = path.join(APP_DIR, ".env.local");
const ENV_ADMIN = path.join(APP_DIR, ".env.admin.local");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@rentayapi.com";

// --- env yükle -------------------------------------------------------
if (!existsSync(ENV_LOCAL)) {
  console.error(`HATA: ${ENV_LOCAL} yok — Supabase env'leri gerekli.`);
  process.exit(1);
}
process.loadEnvFile(ENV_LOCAL);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey) {
  console.error(
    "HATA: NEXT_PUBLIC_SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY eksik."
  );
  process.exit(1);
}

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// --- 1) Kullanıcı zaten var mı? (idempotentlik) -----------------------
const { data: listData, error: listError } = await admin.auth.admin.listUsers({
  page: 1,
  perPage: 1000,
});
if (listError) {
  console.error("HATA: kullanıcı listesi alınamadı:", listError.message);
  process.exit(1);
}

const existing = listData.users.find(
  (u) => (u.email ?? "").toLowerCase() === ADMIN_EMAIL.toLowerCase()
);

if (existing) {
  console.log(`✔ Kullanıcı ZATEN VAR: ${ADMIN_EMAIL} (id: ${existing.id})`);
  console.log("  Şifre sıfırlanmadı (idempotent mod).");
  if (!existsSync(ENV_ADMIN)) {
    console.log(
      `  UYARI: ${ENV_ADMIN} dosyası yok — mevcut şifre bilinmiyorsa` +
        " dashboard'dan reset gerekir."
    );
  }
  process.exit(0);
}

// --- 2) Güçlü rastgele şifre üret (openssl rand -base64 24) -----------
const password =
  process.env.ADMIN_PASSWORD ||
  execFileSync("openssl", ["rand", "-base64", "24"], { encoding: "utf8" }).trim();

if (!password || password.length < 20) {
  console.error("HATA: şifre üretilemedi.");
  process.exit(1);
}

// --- 3) Oluştur --------------------------------------------------------
const { data: created, error: createError } = await admin.auth.admin.createUser(
  {
    email: ADMIN_EMAIL,
    password,
    email_confirm: true,
  }
);
if (createError) {
  console.error("HATA: kullanıcı oluşturulamadı:", createError.message);
  process.exit(1);
}

// --- 4) Kimlik bilgilerini .env.admin.local'a yaz (0600) ---------------
const fileBody = [
  "# Renta Yapı — admin panel kimlik bilgileri (GİZLİ)",
  "# Bu dosya .gitignore'daki `.env*` kuralıyla repo dışıdır — commit ETME.",
  `# Oluşturulma: ${new Date().toISOString()} (scripts/create-admin.mjs)`,
  `ADMIN_EMAIL=${ADMIN_EMAIL}`,
  `ADMIN_PASSWORD=${password}`,
  "",
].join("\n");

writeFileSync(ENV_ADMIN, fileBody, { mode: 0o600 });

console.log(`✔ Admin kullanıcısı OLUŞTURULDU: ${ADMIN_EMAIL} (id: ${created.user.id})`);
console.log(`✔ Kimlik bilgileri yazıldı: ${ENV_ADMIN} (chmod 600)`);
console.log("  Şifre bu çıktıda GÖSTERİLMEZ — dosyaya bakın.");
