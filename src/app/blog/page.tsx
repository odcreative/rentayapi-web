import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Haber & Blog",
  description:
    "Çadır kiralama rehberleri, fiyat kılavuzları ve sektör içerikleri — Renta Yapı blog.",
};

/**
 * Blog listesi — /blog
 * DİKKAT: Yazı detayları /blog/[slug] DEĞİL, kök seviyede /[slug]
 * (canlı sitedeki URL'ler birebir korunuyor — bkz. src/app/[slug]/page.tsx).
 *
 * Sade liste — kart/grid tasarım pası Faz 4'te.
 */
export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const formatter = new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" });

  return (
    <section style={{ padding: "90px 0 120px", minHeight: "55vh" }}>
      <div className="wrap" style={{ maxWidth: 820 }}>
        <span className="eyebrow">Haber & Blog</span>
        <h1 style={{ fontSize: "clamp(32px, 4.4vw, 56px)" }}>Blog</h1>
        <p style={{ marginTop: 18, maxWidth: 640, color: "var(--muted)", fontSize: 17 }}>
          Çadır kiralama rehberleri, fiyat kılavuzları ve sektör içerikleri.
        </p>

        <ul style={{ marginTop: 48, listStyle: "none", padding: 0, display: "grid", gap: 32 }}>
          {posts.map((post) => {
            const date = post.published_at ? new Date(post.published_at) : null;
            return (
              <li
                key={post.slug}
                style={{ paddingBottom: 32, borderBottom: "1px solid var(--line)" }}
              >
                {date && !Number.isNaN(date.getTime()) && (
                  <time
                    dateTime={post.published_at ?? undefined}
                    style={{ color: "var(--muted)", fontSize: 13, fontWeight: 600, letterSpacing: ".04em" }}
                  >
                    {formatter.format(date)}
                  </time>
                )}
                <h2 style={{ fontSize: "clamp(20px, 2.4vw, 26px)", marginTop: 6 }}>
                  <Link href={`/${post.slug}`} style={{ color: "inherit" }}>
                    {post.title}
                  </Link>
                </h2>
                {post.excerpt && (
                  <p style={{ marginTop: 10, color: "var(--muted)", fontSize: 15.5 }}>
                    {post.excerpt}
                  </p>
                )}
                <p style={{ marginTop: 12 }}>
                  <Link href={`/${post.slug}`} style={{ color: "var(--red)", fontWeight: 700, fontSize: 14 }}>
                    Devamını oku →
                  </Link>
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
