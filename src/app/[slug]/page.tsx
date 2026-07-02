import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/queries";
import { FALLBACK_POSTS } from "@/lib/fallback-content";

/**
 * KÖK SEVİYE DİNAMİK ROUTE — /[slug]
 *
 * SEO migrasyon disiplini: canlı sitedeki blog yazıları kök seviyede yaşıyor
 * (rentayapi.com/depo-cadiri-nedir/ gibi) ve URL'ler birebir korunuyor.
 * İçerik `posts` tablosundan (env yoksa fallback-content.ts) gelir;
 * eşleşme yoksa notFound().
 *
 * Statik route'lar (hakkimizda, depo-cadiri vb.) Next.js önceliği gereği
 * bu dinamik route'un ÜZERİNDE çalışır — çakışma yok.
 *
 * NOT: Sade prose render — tasarım pası (Article schema, TOC, ilgili
 * yazılar vb.) Faz 4'te gelecek.
 */

type Params = { params: Promise<{ slug: string }> };

/** Bilinen yazı slug'ları build'te statik üretilir; yenileri runtime'da çözülür. */
export function generateStaticParams() {
  return FALLBACK_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.meta_title ?? post.title,
    description: post.meta_description ?? post.excerpt ?? undefined,
  };
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(date);
}

export default async function KokSlugPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const dateLabel = formatDate(post.published_at);

  return (
    <article style={{ padding: "90px 0 120px" }}>
      <div className="wrap" style={{ maxWidth: 820 }}>
        <header>
          <span className="eyebrow">{post.category ?? "Blog"}</span>
          <h1 style={{ fontSize: "clamp(30px, 4vw, 48px)", marginTop: 10 }}>
            {post.title}
          </h1>
          {dateLabel && (
            <p style={{ marginTop: 14, color: "var(--muted)", fontSize: 14, fontWeight: 600 }}>
              <time dateTime={post.published_at ?? undefined}>{dateLabel}</time>
            </p>
          )}
        </header>

        {/* Sade prose blok — tipografi/tasarım pası Faz 4'te */}
        <div
          style={{ marginTop: 40 }}
          dangerouslySetInnerHTML={{ __html: post.body ?? "" }}
        />

        <footer style={{ marginTop: 56, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
          <Link href="/blog" style={{ color: "var(--red)", fontWeight: 700 }}>
            ← Tüm yazılar
          </Link>
        </footer>
      </div>
    </article>
  );
}
