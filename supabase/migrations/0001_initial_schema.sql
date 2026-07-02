-- ============================================================
-- RENTA YAPI — İlk şema (PRODUCT_PLAN §7: İçerik Modeli & Admin Panel)
-- Next.js + Supabase rebuild — 0001_initial_schema.sql
--
-- İlkeler:
--   * İçerik tabloları: public SELECT (published = true şartıyla)
--   * leads: public sadece INSERT (teklif formu), okuma/yönetim authenticated
--   * Tüm yönetim (CRUD): authenticated (admin panel, Supabase Auth)
--   * Her tabloda created_at / updated_at (+ otomatik updated_at trigger'ı)
-- ============================================================

-- ---------------------------------------------------------------
-- Ortak: updated_at trigger fonksiyonu
-- ---------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------
-- Enum: lead durumu (yeni → arandı → teklif → kapandı)
-- ---------------------------------------------------------------
create type public.lead_status as enum ('new', 'called', 'quoted', 'closed');

-- ===============================================================
-- 1) tent_models — çadır modelleri
--    (5 mevcut: etkinlik/depo/büyük/pagoda/iftar + 5 quick-win yeni)
-- ===============================================================
create table public.tent_models (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  slug             text not null unique,
  description      text,
  specs            jsonb not null default '{}'::jsonb,  -- açıklık/yükseklik/kaplama vb.
  gallery          jsonb not null default '[]'::jsonb,  -- [{url, alt, sort}]
  faqs             jsonb not null default '[]'::jsonb,  -- [{question, answer}]
  meta_title       text,
  meta_description text,
  sort_order       integer not null default 0,
  published        boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger tent_models_set_updated_at
  before update on public.tent_models
  for each row execute function public.set_updated_at();

-- ===============================================================
-- 2) projects — referans projeler (hedef 85/85; launch ~25-30)
-- ===============================================================
create table public.projects (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  city             text,
  year             integer,
  sector           text,
  client_name      text,
  tent_model_id    uuid references public.tent_models (id) on delete set null,
  gallery          jsonb not null default '[]'::jsonb,
  excerpt          text,
  body             text,
  featured         boolean not null default false,
  published        boolean not null default false,
  meta_title       text,
  meta_description text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index projects_tent_model_id_idx on public.projects (tent_model_id);
create index projects_published_featured_idx on public.projects (published, featured);
create index projects_city_idx on public.projects (city);

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ===============================================================
-- 3) posts — blog yazıları (31 canlı yazı migrate; kök URL'lerde)
-- ===============================================================
create table public.posts (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  category         text,
  excerpt          text,
  body             text,
  cover_url        text,
  published_at     timestamptz,                          -- null = taslak
  meta_title       text,
  meta_description text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index posts_published_at_idx on public.posts (published_at desc);
create index posts_category_idx on public.posts (category);

create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ===============================================================
-- 4) cities — şehir landing sayfaları (13 mevcut + 8 yeni post-launch)
-- ===============================================================
create table public.cities (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  content    jsonb not null default '[]'::jsonb,         -- içerik blokları
  published  boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger cities_set_updated_at
  before update on public.cities
  for each row execute function public.set_updated_at();

-- ===============================================================
-- 5) leads — teklif talepleri (lead-gen çekirdeği; kaynak + UTM ölçümü)
-- ===============================================================
create table public.leads (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  company       text,
  phone         text,
  email         text,
  tent_model_id uuid references public.tent_models (id) on delete set null,
  area_m2       numeric,
  event_date    date,
  message       text,
  source_page   text,                                    -- formun gönderildiği sayfa
  utm           jsonb not null default '{}'::jsonb,      -- utm_source/medium/campaign...
  status        public.lead_status not null default 'new',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index leads_status_idx on public.leads (status);
create index leads_created_at_idx on public.leads (created_at desc);

create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ===============================================================
-- 6) testimonials — müşteri yorumları
-- ===============================================================
create table public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  author_name text not null,
  company     text,
  quote       text not null,
  rating      integer check (rating between 1 and 5),
  sort_order  integer not null default 0,
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

-- ===============================================================
-- 7) client_logos — 27 kurumsal müşteri logosu
-- ===============================================================
create table public.client_logos (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  logo_url   text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger client_logos_set_updated_at
  before update on public.client_logos
  for each row execute function public.set_updated_at();

-- ===============================================================
-- 8) faqs — genel SSS (/sss sayfası + FAQ schema)
-- ===============================================================
create table public.faqs (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  answer     text not null,
  category   text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger faqs_set_updated_at
  before update on public.faqs
  for each row execute function public.set_updated_at();

-- ===============================================================
-- 9) site_settings — key/value ayarlar
--    (iletişim, sosyal, duyuru şeridi, promo_video_url ...)
-- ===============================================================
create table public.site_settings (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique,
  value      jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ============================================================
-- RLS — Row Level Security
-- ============================================================
alter table public.tent_models   enable row level security;
alter table public.projects      enable row level security;
alter table public.posts         enable row level security;
alter table public.cities        enable row level security;
alter table public.leads         enable row level security;
alter table public.testimonials  enable row level security;
alter table public.client_logos  enable row level security;
alter table public.faqs          enable row level security;
alter table public.site_settings enable row level security;

-- ---------- Public SELECT: yayınlanmış içerik ----------
create policy "Public: published tent models"
  on public.tent_models for select
  using (published = true);

create policy "Public: published projects"
  on public.projects for select
  using (published = true);

create policy "Public: published posts"
  on public.posts for select
  using (published_at is not null and published_at <= now());

create policy "Public: published cities"
  on public.cities for select
  using (published = true);

create policy "Public: published testimonials"
  on public.testimonials for select
  using (published = true);

create policy "Public: client logos"
  on public.client_logos for select
  using (true);

create policy "Public: faqs"
  on public.faqs for select
  using (true);

create policy "Public: site settings"
  on public.site_settings for select
  using (true);

-- ---------- leads: public sadece INSERT (teklif formu) ----------
create policy "Public: insert leads"
  on public.leads for insert
  to anon, authenticated
  with check (true);

-- ---------- Yönetim: authenticated tam yetki (admin panel MVP) ----------
-- Not: Panel MVP'de içeriği OD Creative girer (karar §13/4). İleride
-- rol bazlı daraltma gerekirse (ör. editor/admin) bu policy'ler bölünür.
create policy "Admin: manage tent models"
  on public.tent_models for all
  to authenticated
  using (true) with check (true);

create policy "Admin: manage projects"
  on public.projects for all
  to authenticated
  using (true) with check (true);

create policy "Admin: manage posts"
  on public.posts for all
  to authenticated
  using (true) with check (true);

create policy "Admin: manage cities"
  on public.cities for all
  to authenticated
  using (true) with check (true);

create policy "Admin: manage leads"
  on public.leads for all
  to authenticated
  using (true) with check (true);

create policy "Admin: manage testimonials"
  on public.testimonials for all
  to authenticated
  using (true) with check (true);

create policy "Admin: manage client logos"
  on public.client_logos for all
  to authenticated
  using (true) with check (true);

create policy "Admin: manage faqs"
  on public.faqs for all
  to authenticated
  using (true) with check (true);

create policy "Admin: manage site settings"
  on public.site_settings for all
  to authenticated
  using (true) with check (true);

-- ============================================================
-- Başlangıç verisi: 5 mevcut model slug'ı (URL'ler birebir korunuyor)
-- + varsayılan site ayarları
-- ============================================================
insert into public.tent_models (name, slug, sort_order, published) values
  ('Etkinlik Çadırı',            'etkinlik-cadiri',                 1, false),
  ('Depo Çadırı',                'depo-cadiri',                     2, false),
  ('Büyük Çadırlar',             'buyuk-cadirlar',                  3, false),
  ('Pagoda Çadır',               'pagoda-cadir',                    4, false),
  ('İftar ve Ramazan Çadırı',    'iftar-cadiri-ve-ramazan-cadiri',  5, false);

insert into public.site_settings (key, value) values
  ('promo_video_url', '""'::jsonb),
  ('contact', '{
    "phone": "+90 216 504 46 96",
    "whatsapp": "+90 544 671 48 87",
    "email": "info@rentayapi.com",
    "address": "Atatürk Mah. Sedef Cad. Ata Blokları 2/4 Kat:5 Daire:172, Ataşehir / İstanbul"
  }'::jsonb);
