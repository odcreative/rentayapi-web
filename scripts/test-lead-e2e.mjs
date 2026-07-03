/**
 * Lead pipeline uçtan uca test — RLS doğrulaması dahil.
 *
 * Kullanım:  node scripts/test-lead-e2e.mjs
 *
 * Adımlar:
 *   1. ANON INSERT   — teklif formu simülasyonu: anon key ile `leads`
 *                      tablosuna kayıt (RLS: public INSERT açık olmalı).
 *   2. ANON SELECT   — anon'un lead OKUYAMADIĞINI teyit (RLS: SELECT
 *                      policy yok → PostgREST 0 satır döner).
 *   3. ADMIN SELECT  — admin (authenticated) signInWithPassword sonrası
 *                      test kaydını görebilmeli (admin inbox eşdeğeri).
 *   4. TEMİZLİK      — service_role ile test kaydı silinir + doğrulanır.
 *
 * Hiçbir secret/şifre çıktıya yazılmaz. Script idempotenttir: marker
 * benzersizdir, eski takılı test kayıtları da (varsa) temizlenir.
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
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!url || !anonKey || !serviceKey || !adminEmail || !adminPassword) {
  console.error("HATA: gerekli env değişkenleri eksik.");
  process.exit(1);
}

const noSession = { auth: { persistSession: false, autoRefreshToken: false } };
const anon = createClient(url, anonKey, noSession);
const service = createClient(url, serviceKey, noSession);

const MARKER = `E2E-TEST-${Date.now()}`;
const results = [];
let failed = false;

function verdict(step, ok, detail) {
  results.push({ step, ok, detail });
  console.log(`${ok ? "✔ PASS" : "✘ FAIL"}  ${step} — ${detail}`);
  if (!ok) failed = true;
}

// --- 1) ANON INSERT (teklif formu simülasyonu) -------------------------
{
  const { error } = await anon.from("leads").insert({
    name: `E2E Test Lead (${MARKER})`,
    phone: "+90 532 000 00 00",
    email: "e2e-test@rentayapi.com",
    message: `Otomatik uçtan uca test kaydı — ${MARKER}. Silinecek.`,
    source_page: "/teklif-al",
    utm: {
      utm_source: "e2e-test",
      utm_medium: "script",
      landing_page: "/teklif-al",
    },
  });
  verdict(
    "1. anon INSERT leads",
    !error,
    error ? `hata: ${error.message}` : "teklif formu insert'i kabul edildi"
  );
}

// --- 2) ANON SELECT reddi ----------------------------------------------
{
  const { data, error } = await anon
    .from("leads")
    .select("id, name")
    .ilike("name", `%${MARKER}%`);
  // RLS'te SELECT policy'si olmadığında PostgREST hata değil 0 satır döner;
  // her iki durum da "anon okuyamıyor" demektir.
  const blocked = Boolean(error) || (data ?? []).length === 0;
  verdict(
    "2. anon SELECT reddi",
    blocked,
    error
      ? `sorgu hata verdi (${error.message}) — okunamadı`
      : `${(data ?? []).length} satır döndü (0 beklenir)`
  );
}

// --- 3) ADMIN (authenticated) SELECT ------------------------------------
{
  const adminClient = createClient(url, anonKey, noSession);
  const { data: authData, error: authError } =
    await adminClient.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

  if (authError || !authData.session) {
    verdict("3. admin SELECT", false, `giriş başarısız: ${authError?.message}`);
  } else {
    const { data, error } = await adminClient
      .from("leads")
      .select("id, name, phone, source_page, utm, status")
      .ilike("name", `%${MARKER}%`);
    const found = !error && (data ?? []).length === 1;
    verdict(
      "3. admin SELECT (inbox görünürlüğü)",
      found,
      error
        ? `hata: ${error.message}`
        : `${(data ?? []).length} satır (1 beklenir)` +
            (found
              ? `; status=${data[0].status}, source_page=${data[0].source_page}, utm_source=${data[0].utm?.utm_source}`
              : "")
    );
    await adminClient.auth.signOut();
  }
}

// --- 4) TEMİZLİK: service_role DELETE ------------------------------------
{
  // Bu koşunun kaydı + (varsa) eski takılı E2E-TEST kayıtları
  const { error: delError } = await service
    .from("leads")
    .delete()
    .ilike("name", "%E2E-TEST-%");
  const { data: remaining, error: checkError } = await service
    .from("leads")
    .select("id")
    .ilike("name", "%E2E-TEST-%");
  const clean = !delError && !checkError && (remaining ?? []).length === 0;
  verdict(
    "4. service_role temizlik",
    clean,
    delError || checkError
      ? `hata: ${(delError ?? checkError)?.message}`
      : "test kayıtları silindi, kalan: 0"
  );
}

// --- Özet ----------------------------------------------------------------
console.log("\n--- SONUÇ ---");
console.log(
  `${results.filter((r) => r.ok).length}/${results.length} adım PASS` +
    (failed ? " — BAŞARISIZ ADIM VAR" : " — pipeline sağlıklı")
);
process.exit(failed ? 1 : 0);
