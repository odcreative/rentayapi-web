# Renta Yapı — 301 Redirect Haritası (WordPress → Next.js)

**Tarih:** 2 Temmuz 2026 · **Faz:** 4 (öne çekildi)
**Kaynaklar:** `06_MIGRASYON/canli-site-url-envanteri.md` (127 canlı URL, sitemap_index.xml) + `06_MIGRASYON/rentayap_data.sql` içindeki canlı WP redirect tabloları (`wpe9_redirection_items`, `wpe9_rank_math_redirections`)
**Uygulama:** `app/next.config.ts` → `redirects()` (kalıcı redirect; Google 301/308'i eşdeğer sayar)

**Özet:** 127 canlı URL'den **123 birebir korundu**, **4 URL 301** aldı. Ayrıca canlı WP'de zaten kurulu **23 eski 301 kuralı devralındı** + WP arşiv/feed yapıları için 6 wildcard kural eklendi. Hiçbir URL karşılıksız (404/gone) bırakılmadı.

---

## 1. Birebir Korunanlar (redirect GEREKMEZ) — 123 URL

| Grup | Adet | Canlı örnek | Yeni route |
|---|---|---|---|
| Anasayfa | 1 | `/` | `src/app/page.tsx` |
| Çekirdek sayfalar | 5 | `/iletisim/`, `/hakkimizda/`, `/cadir-modelleri/`, `/projelerimiz/`, `/sehirler/` | ilgili statik route'lar |
| Blog hub | 1 | `/blog/` | `src/app/blog/` |
| Blog yazıları (kökte) | 31 | `/depo-cadiri-nedir/`, `/cadir-kiralama-fiyatlari/` | `src/app/[slug]/` (kök catch route) |
| Model sayfaları (kökte) | 5 | `/depo-cadiri/`, `/buyuk-cadirlar/`, `/pagoda-cadir/`, `/etkinlik-cadiri/`, `/iftar-cadiri-ve-ramazan-cadiri/` | `src/app/(models)/*` |
| Şehir sayfaları | 13 | `/sehirler/istanbul-kiralik-cadir/` | `src/app/sehirler/[sehir]/` |
| Proje detayları | 67 | `/projeler/2017-deaflympics-oyunlari-samsun-kiralik-cadir/` | `src/app/projeler/[slug]/` |

> Slug listelerinin tamamı `src/lib/seo/sitemap-data.ts` içinde (sitemap fallback'i olarak da kullanılıyor).
> ⚠️ Yazım hatalı görünen slug'lar **bilerek korundu** — canlı URL'ler birebir bunlar: `buyuk-cadilar-2025`, `endustiryel-cadir-rehberi`, `kocaeli-cadir-kiramala-kermes`, `turkish-airlens-open-golf-turnuvasi-2018`, `kiralik-toren-cadiri-isik-universitesi-mezuniyetis`.

## 2. 301 Alanlar (canlı sitemap'te olup yeni yapıda birleşen/silinen) — 4 URL

| Eski URL | Yeni URL | Durum / gerekçe |
|---|---|---|
| `/slider-test/` | `/` | 301 — test sayfası, PRODUCT_PLAN §6: silinir |
| `/services/` | `/cadir-modelleri` | 301 — canlıda da zaten 301'di (2.100+ hit) |
| `/projeler/` | `/projelerimiz` | 301 — hub birleştirildi; `/projeler/:slug` detayları KORUNUYOR |
| `/locations.kml` | `/sehirler` | 301 — WP local-sitemap kalıntısı |

## 3. Canlı WP'den Devralınan 301'ler — 23 kural

Bunlar canlı sitede **halihazırda 301 olan** eski URL'ler (Redirection eklentisi + Rank Math). Taşınmasalardı yıllardır backlink taşıyan adresler yeni sitede 404 olurdu.

### Redirection eklentisi (14 kural)

| Eski URL | Yeni URL |
|---|---|
| `/depo-cadirlari` | `/depo-cadiri` |
| `/kiralik-cadirlar` | `/cadir-modelleri` |
| `/iftar-cadiri` | `/iftar-cadiri-ve-ramazan-cadiri` |
| `/ramazan-cadiri` | `/iftar-cadiri-ve-ramazan-cadiri` |
| `/depo-cadirlari-avantajlari-ekonomik-ve-pratik-cozumler` | `/depo-cadirlari-avantajlari` |
| `/depo-cadirlarinin-kullanim-alanlari-ve-cozumleri` | `/depo-cadiri-kullanim-alanlari` |
| `/depo-cadiri-fiyatlari-nasil-belirlenir` | `/depo-cadiri-fiyatlari` |
| `/depo-cadiri-modelleri-hangi-model-size-uygun` | `/depo-cadir-modelleri` |
| `/depo-cadiri-nedir-avantajlari-nelerdir` | `/depo-cadiri-nedir` |
| `/kiralik-depo-cadirlari-ile-maliyetlerinizi-dusurun` | `/depo-cadiri-maliyetleri` |
| `/sanayide-depo-cadiri-kullaniminin-avantajlari` | `/sanayi-depo-cadiri` |
| `/depo-cadirlarinin-lojistik-ve-tedarik-zincirindeki-rolu` | `/lojistik-depo-cadiri` |
| `/neden-kiralik-cadir-kullanmalisiniz-avantajlari-ve-faydalari` | `/neden-kiralik-cadir-kullanmalisiniz` |
| `/etkinlikler-icin-kiralik-cadir-modelleri-ihtiyaciniza-uygun-cozumu-bulun` | `/etkinlikler-icin-kiralik-cadir-modelleri` |

### Rank Math (9 kural — hedefler semantik iyileştirildi)

Canlıda bu kaynakların çoğu tembelce `/iletisim`'e gidiyordu; yeni haritada doğru sayfalara yönlendirildi:

| Eski URL | Yeni URL | Not |
|---|---|---|
| `/cadir-kiralama-hizmetleri-iletisim` | `/iletisim` | aynı |
| `/cadir-kiralama-iletisim` | `/iletisim` | aynı |
| `/cadir-kiralamasi-hakkimizda` | `/hakkimizda` | iyileştirildi (eski: /iletisim) |
| `/cozumler` | `/cadir-modelleri` | iyileştirildi |
| `/etkinlik-cadirlari-cozumler/big-tent-fuar-cadiri` | `/buyuk-cadirlar` | iyileştirildi |
| `/etkinlik-cadirlari-cozumler/pagoda-ramazan-cadiri` | `/pagoda-cadir` | iyileştirildi |
| `/kiralik-cadir-fiyati-teklif-formu` | `/teklif-al` | iyileştirildi |
| `/teklif-formu` | `/teklif-al` | iyileştirildi |
| `/category/manufacturing` | `/blog` | wildcard'a dahil (aşağıda) |

## 4. WP Yapısal / Arşiv Kuralları — 6 wildcard

Eski WP taksonomileri: `category/` altında `renta-blog-icerikleri`, `kiralik-cadirlar-post`, `etkinlik-blog`, `fuar-blog`, `depo-cadirlar-blog`, `uncategorized` (SQL yedeğinden doğrulandı).

| Desen | Hedef | Not |
|---|---|---|
| `/category/:path*` | `/blog` | tüm kategori arşivleri |
| `/tag/:path*` | `/blog` | tüm etiket arşivleri |
| `/author/:path*` | `/blog` | yazar arşivleri |
| `/feed`, `/comments/feed` | `/blog` | RSS kalıntıları |
| `/?p=<id>` | `/blog` | WP kısa link; id→slug eşlemesi mümkün değil, 404 yerine hub |

**Trailing slash:** Canlı URL'ler `/iletisim/` biçiminde; Next.js varsayılanı slash'sız. Next bu farkı otomatik **kalıcı (308)** redirect ile çözer — ayrıca kural yazılmadı. (Devralınan 301'lere gelen slash'lı istekler 308→301 şeklinde 2 hop yapar; kabul edilebilir, Google kalıcı zinciri takip eder.)

**Bilinçli 404 bırakılanlar:** `/wp-admin`, `/wp-login.php`, `/xmlrpc.php`, `/wp-content/*` — bot gürültüsü, yönlendirme değeri yok. (Hack temizliği sonrası bu path'lere gelen istekler zaten spam taraması.)

---

## 5. Riskler / Takip Listesi

1. **`/sehirler/` hub'ının kendi `page.tsx`'i yok** — istek şu an kök `[slug]` catch route'una düşüyor (200 dönüyor, 404 değil) ama içerik "blog yazısı placeholder"ı. Faz 4'te gerçek şehirler hub sayfası açılmalı.
2. **Kök `[slug]` ve `projeler/[slug]` catch route'ları her slug'a 200 dönüyor** (`notFound()` yok) → launch öncesi mutlaka DB slug eşleşmesi + `notFound()` eklenmeli, yoksa Google **soft-404** üretir ve sitemap dışı çöp URL'ler indekslenir.
3. **Kategori-benzeri proje slug'ları** (`/projeler/etkinlikler/`, `/projeler/uluslararasi-etkinlikler/`, `/projeler/fuar-referanslari/`, `/projeler/depo-cadir-referanslar/`) canlıda gerçek sayfalar — `projects` tablosuna içerik olarak girilmeli ya da ayrı 301 kararı verilmeli.
4. **`?p=` → `/blog`** kaba bir eşleme; GSC'de belirli `?p=<id>` isabetleri görülürse SQL yedeğinden (wpe9_posts ID→post_name) birebir eşleme çıkarılabilir.
5. **WPML kalıntısı** — eski sitede WPML kuruluydu ama canlı sitemap'te `/en/` URL'i yok; EN route'ları Faz 4.5'te açılırken çakışma kontrolü yapılmalı.
6. **Go-live GSC adımı:** yeni sitemap gönder + eski 6 parçalı sitemap URL'lerinin (`/post-sitemap.xml` vb.) 404/301 durumunu izle.
