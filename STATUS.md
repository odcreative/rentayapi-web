# Renta Yapı — Next.js + Supabase Scaffold Durumu

**Tarih:** 2 Temmuz 2026 (akşam güncellemesi — 4 paralel track tamamlandı)
**Konum:** `~/Projects/RENTA_NEW_PROJECT/app/`
**Faz:** Faz 1-2 karışık ilerleme (tasarım portları beklemede — karar aşaması; tasarımsız her şey inşa edildi)
**Build:** ✅ `npm run build` hatasız — 44 statik sayfa + dinamik route'lar + middleware, ESLint temiz

---

## ✅ 2 Tem Gece — Supabase + GitHub kuruldu (BLOKÖR ÇÖZÜLDÜ)

- **GitHub:** repo `github.com/odcreative/rentayapi-web` (public), `main` push edildi (2 commit, 109 dosya). `origin` bağlı. `.env*` gitignore'da → secret sızmadı.
- **Supabase cloud:** proje **`renta-yapi`** — ref `cfoinrwemxjzydmhdpvt`, bölge **eu-central-1 (Frankfurt)**, org `odcreative`. (Önceki 2 çöp proje — Tokyo + Vercel/US — silindi; free plan 2-proje limiti.)
- **Migration'lar:** `0001` + `0002` + `0003` `npx supabase db push` ile uygulandı (local==remote, 3/3). `supabase/config.toml` linkli.
- **`.env.local`:** URL + anon + service_role + `NEXT_PUBLIC_SITE_URL=localhost:3000` yazıldı (gitignore'da). **DB şifresi:** `1Password/Bitwarden`'a kaydet — CLI'da `SUPABASE_DB_PASSWORD`.
- **Uçtan uca test:** `/` 200, `/etkinlik-cadiri` 200 + DB içeriği render (fallback değil), `/blog` 200, `/admin` 307 (auth redirect ✓). RLS doğru: public tablolar okunuyor, `leads` anon SELECT edemiyor.
- **Seed doğrulandı:** tent_models 5, posts 31, site_settings 2, leads 0.

**Kalan manuel adımlar:** (1) Auth'tan **admin kullanıcısı** oluştur (dashboard → Authentication → Add user) → `/admin` login testi; (2) **Vercel** bağla (repo import + prod env: `NEXT_PUBLIC_SITE_URL=https://www.rentayapi.com` + Supabase env'leri); (3) prod'a geçişte `robots` kapısı açılır.

---

## 2 Tem Akşam Sprint'i (4 paralel track)

1. **Admin panel MVP** ✅ — `/admin`: Supabase Auth login + middleware koruması, lead inbox (durum pipeline: Yeni/Arandı/Teklif Verildi/Kapandı, filtre, satır içi durum değiştirme), 6 tablo generic CRUD (`src/lib/admin/resources.ts` deklaratif config — yeni tablo = bir kayıt), site ayarları formu, dashboard sayaçları. Env yokken kurulum talimatlı ekran. Kök layout'a dokunulmadı (admin kendi fullscreen overlay'i; ileride route group'a taşınabilir).
2. **Teklif formu + lead capture** ✅ — `/teklif-al` 3 adımlı form (model/m²/tarih → mesaj → iletişim, TR telefon doğrulama), `/iletisim` kısa form + bilgiler, `submitLead` server action (honeypot + min süre anti-spam), first-touch UTM/referrer/landing yakalama (`attribution.ts`, sessionStorage; `AttributionTracker` layout'a mount edildi). Env yokken WhatsApp fallback. Tüm stiller tek `Forms.module.css` — tasarım pası kolay.
3. **SEO/migrasyon altyapısı** ✅ — 127 canlı URL: 123 korundu, 4+23 kural 301 (eski WP'deki 23 tarihi redirect kuralı SQL dump'tan devralındı — `docs/301-haritasi.md`). `robots.ts` env-bazlı kapı (NEXT_PUBLIC_SITE_URL prod değilse full disallow), `sitemap.ts` (fallback slug'lar + DB union), layout metadata temeli (title template, OG, env-bazlı noindex), `OrganizationSchema` JSON-LD (layout'a mount edildi), `/kvkk` + `/gizlilik-politikasi` + `/cerez-politikasi` noindex iskelet (hukuk onayı bekliyor — eski sitede yasal metin hiç yokmuş). Footer legal linkleri bağlandı.
4. **Veri katmanı + içerik migrasyonu** ✅ — `queries.ts` 8 guard'lı helper (env yok → `fallback-content.ts` statik fallback), eski WP dump'tan 19 blog + 5 model içeriği çıkarıldı (spam taraması TEMİZ — dump hack temizliği sonrası), `0002_content_seed.sql` idempotent seed, blog/`[slug]`/model route'ları DB-driven + `notFound()` + generateMetadata. ⚠️ Dump canlıdan eski: 13 canlı blog yazısı dump'ta yok → canlı siteden çekme işi devam ediyor.

> ⚠️ **ORTAM UYARISI (2 Tem):** Disk %100 doluydu (544 MB boş) ve Desktop iCloud-senkronlu
> olduğu için iCloud `node_modules`'u buluta atıp yerel kopyaları sildi (dataless eviction)
> — build saatlerce asılı kaldı. Çözüm: npm cache temizlendi (1.9 GB açıldı) +
> `node_modules` silinip yeniden kuruldu. **Kalıcı öneri:** ya diskte yer aç
> ya da projeyi iCloud-senkronlu olmayan bir dizine taşı (örn. `~/Projects/`);
> aksi halde eviction tekrarlayabilir.

---

## Ne Kuruldu

### Stack
- **Next.js 16.2** — App Router, TypeScript, `src/` dizini, `@/*` import alias
- **Tailwind CSS v4** — `@theme` token eşlemesi ile
- **@supabase/supabase-js + @supabase/ssr** — client/server helper'lar hazır (cloud proje HENÜZ yok)
- **Manrope** — `next/font/google`, variable font (300–800), `--font-manrope`

### Design token portu (`src/app/globals.css`)
- `design-system.html` `:root` bloğu birebir taşındı: `--red #E20613`, `--red-dark`, `--red-light`, `--ink`, `--ink-2`, `--ink-blue`, `--text`, `--muted`, `--line`, `--soft`, `--softer`, `--whatsapp`, `--star`
- 4 katman gölge (`--shadow` / `-lg` / `-xl` / `-red`), radius 8/14px, container 1280px
- Tailwind v4 `@theme inline` eşlemesi: `bg-red`, `text-ink`, `shadow-red`, `rounded-sm/md`, `max-w-site` vb.
- Tipografi ölçekleri base layer'da: H1 clamp(40–72px)/800/-.035em, H2 clamp(30–48px)/800/-.03em, body 16px/1.75; `.eyebrow` yardımcı sınıfı (+0.18em tracking)

### Çekirdek UI
- **Header** (`src/components/layout/Header.tsx` + module CSS) — anasayfa-header.html portu:
  - Anasayfada şeffaf overlay + akıllı sticky (scroll-down gizle / scroll-up beyaz reveal / tepede tekrar şeffaf)
  - İç sayfalarda solid beyaz sticky varyant (route'a göre otomatik, `usePathname`)
  - Kırmızı logo kutusu (inline SVG), nav (6 link), TR/EN switch placeholder, **Teklif Al** CTA pill, mobil burger + tam ekran menü
- **Footer** (`src/components/layout/Footer.tsx`) — footer.html (Premium Dark) birebir portu: iletişim sütunu, marka + sosyal, hızlı menü, dekoratif kırmızı çizgi, KVKK/legal şeridi
- **Hero v1** (`src/components/home/Hero.tsx`) — hero-varyasyon-1.html **birebir** portu:
  - 4 slide, 6 sn auto-advance, ok/progress/sayaç kontrolleri, giriş animasyonları (CSS transition'lar korundu)
  - **EK: "Tanıtım videosunu izle"** — play ikonlu secondary buton → `VideoModal` (ESC/overlay kapatma, body scroll kilidi; YouTube embed veya `<video>`; kaynak `site_settings.promo_video_url`'den — şimdilik boş → "yakında" placeholder'ı)
  - Görseller: `public/images/hero-1..4.webp` (01_TASARIM/assets'ten kopyalandı)
- **Anasayfa** (`src/app/page.tsx`) — Hero + 6 placeholder section (index-v2 kurgusu): Kategoriler, Stats/Sayaç, Süreç, Referanslar, Blog, CTA — her biri ayrı component (`src/components/home/*Section.tsx`)

### Supabase hazırlığı
- `src/lib/supabase/client.ts` (browser) + `server.ts` (App Router, async cookies) — standart @supabase/ssr deseni
- `.env.local.example` — URL / anon key / service role placeholder'ları
- `supabase/migrations/0001_initial_schema.sql` — PRODUCT_PLAN §7 tam şema:
  - `tent_models`, `projects`, `posts`, `cities`, `leads`, `testimonials`, `client_logos`, `faqs`, `site_settings`
  - `lead_status` enum: `new/called/quoted/closed` (yeni/arandı/teklif/kapandı)
  - Her tabloda `created_at`/`updated_at` + otomatik trigger
  - RLS: içerik tabloları public SELECT (published şartıyla; posts → `published_at <= now()`), `leads` public sadece INSERT, tüm yönetim `authenticated`
  - Seed: 5 mevcut model slug'ı + varsayılan `site_settings` (promo_video_url, contact)
- `src/lib/types.ts` — tüm tablolara karşılık TypeScript interface'leri
- `src/lib/site-settings.ts` — DB kurulana kadar statik fallback (promo video, iletişim)

---

## Dosya Haritası

```
app/
├── .env.local.example              # Supabase env placeholder'ları
├── STATUS.md                       # bu dosya
├── supabase/migrations/
│   └── 0001_initial_schema.sql     # tam şema + RLS + seed
├── public/images/
│   ├── hero-1..4.webp              # hero slider görselleri
│   └── renta-logo.svg
└── src/
    ├── app/
    │   ├── layout.tsx              # Manrope + Header/Footer
    │   ├── globals.css             # DESIGN TOKENS + @theme + tipografi
    │   ├── page.tsx                # Anasayfa (Hero + 6 placeholder section)
    │   ├── hakkimizda/
    │   ├── cadir-modelleri/        # model hub (5 modele link verir)
    │   ├── (models)/               # KÖK seviye model URL'leri (SEO: birebir korunur)
    │   │   ├── etkinlik-cadiri/  depo-cadiri/  buyuk-cadirlar/
    │   │   ├── pagoda-cadir/  iftar-cadiri-ve-ramazan-cadiri/
    │   ├── projelerimiz/           # filtreli galeri (Faz 3)
    │   ├── projeler/[slug]/        # proje detay
    │   ├── sehirler/[sehir]/       # şehir landing (Faz 4)
    │   ├── blog/                   # blog listesi
    │   ├── [slug]/                 # KÖK dinamik route — blog yazıları kökte!
    │   ├── sss/  iletisim/  teklif-al/
    │   └── admin/                  # "panel yakında" (Faz 2)
    ├── components/
    │   ├── layout/  Header.tsx  Footer.tsx  RentaLogo.tsx  (+ module.css)
    │   ├── home/    Hero.tsx (+css)  CategoriesSection  StatsSection
    │   │            ProcessSection  ReferencesSection  BlogSection  CtaSection
    │   └── ui/      VideoModal.tsx (+css)  SectionPlaceholder  PagePlaceholder
    └── lib/
        ├── supabase/client.ts  server.ts
        ├── types.ts            # DB interface'leri
        └── site-settings.ts    # statik fallback (→ site_settings tablosu)
```

---

## Routing Notları (SEO migrasyon disiplini)

- **Model detayları kök seviyede** (`/depo-cadiri` vb.) — canlı URL'ler birebir korunuyor; `(models)` route group ile çözüldü. 5 quick-win yeni model sayfası da aynı desende açılacak.
- **Blog yazıları kök seviyede** — `src/app/[slug]/page.tsx` catch route'u; Faz 4'te `posts` tablosundan slug eşleşmesi + `notFound()` eklenecek. Statik route'lar Next.js önceliğiyle dinamik route'u ezer, çakışma yok.
- `/en/` (Faz 4.5) henüz açılmadı — i18n routing kararıyla birlikte gelecek.

## Hero Portu Kararları

- Hero kendi container'ını kullanır (orijinaldeki 1480px), site geneli 1280px.
- Progress bar orijinaldeki JS transition yerine CSS animation + React key ile sıfırlanıyor (aynı görsel sonuç, daha az imperative kod).
- Video butonu her slide'ın CTA satırında (birincil CTA'nın yanında secondary); modal açıkken auto-advance durur.
- `side-info` "15 yıllık öncü" → **"16 yıllık öncü"** (PRODUCT_PLAN: kuruluş 2010); footer "Est. 2009" → **"Est. 2010"** olarak düzeltildi.
- Slide CTA linkleri yeni route'lara güncellendi (`.html` uzantıları kaldırıldı).

---

## Sonraki Adımlar

1. **Supabase cloud projesi (BLOKÖR — insan aksiyonu)** — proje aç, `0001` + `0002` (+`0003` gelirse) migration'ları uygula, `.env.local` doldur, Auth'tan admin kullanıcısı oluştur, admin panel + teklif formu uçtan uca test
2. **Vercel bağlama** — repo push + Vercel import; prod env'e `NEXT_PUBLIC_SITE_URL=https://www.rentayapi.com` MUTLAKA (yoksa robots full-disallow kalır — bilinçli emniyet); domain geçişi Faz 5'te
3. **TASARIM KARARI BEKLENİYOR:** anasayfa section portları (index-v2.html: kategori carousel, about+sayaç, referans akordeonu, why-us, süreç, logolar, testimonials, blog, CTA), hakkimizda/sss iç sayfa portları, model şablonu görsel katmanı, teklif formu + blog/model sayfalarının görsel pası
4. **13 eksik canlı blog yazısı** — canlı siteden çekiliyor (devam eden agent görevi); bitmezse launch öncesi tekrar dene ya da taze DB dump'ı al
5. **Görsel migrasyonu** — içerik görselleri hâlâ `www.rentayapi.com/wp-content/uploads`'a işaret ediyor → Supabase Storage/R2'ye taşınacak
6. **5 quick-win yeni model sayfası** (fuar/stand/şantiye/kubbeli/afet) — Faz 2; katalog PDF entegrasyonu
7. **Tanıtım filmi** — dosya Renta/ajans arşivinden temin edilince `site_settings.promo_video_url`'e eklenecek (modal hazır)
8. **Yasal metinler** — KVKK/gizlilik/çerez sayfaları iskelet; hukuk onaylı içerik gerekiyor

## Bilinen Eksikler

- Supabase cloud projesi yok → `site-settings.ts` statik fallback'te; DB sorgusu yapılan yer henüz yok
- İç sayfalar placeholder — tasarım portları fazlarına bırakıldı
- Mobil menü minimal (tasarım dosyalarında mobil menü paneli tasarımı yoktu — burger işlevsel olsun diye basit fullscreen panel eklendi)
- TR/EN switch görsel placeholder — i18n Faz 4.5
- KVKK/Çerez/Gizlilik linkleri `#` — sayfaları yok
- `robots.txt` / `sitemap.xml` / 301 haritası / schema markup — Faz 4 (SEO migration) kapsamı
- Slide 2 "40 metre açıklık" ve slide 3 "2.000+ kişilik" iddiaları tasarım metninden — launch öncesi Renta ile doğrulanmalı
