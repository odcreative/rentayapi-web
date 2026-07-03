/**
 * Middleware — iki görev:
 *
 * 1) 410 Gone (SEO, Karar #4 — Sprint 2): kalıcı olarak kaldırılan eski
 *    WP URL'leri (/slider-test, /locations.kml) 410 döner; Google bunları
 *    301'den daha hızlı indexten düşürür. NOT: Bu path'ler next.config.ts
 *    redirect listesinde OLMAMALI — config redirects middleware'den ÖNCE
 *    çalışır ve 410'u gölgeler (o listeden bilinçli çıkarıldılar).
 *
 * 2) /admin/* koruması — @supabase/ssr middleware deseni (updateSession).
 *    - Env yoksa (Supabase cloud projesi kurulmadı) HİÇBİR ŞEY yapmadan
 *      geçer; sayfalar kendi "yapılandırılmamış" ekranını gösterir.
 *    - Env varsa: session çerezlerini yeniler, kullanıcı yoksa
 *      /admin/login'e, login'deyken kullanıcı varsa /admin'e yönlendirir.
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/admin/env";

/**
 * 410 Gone dönen path'ler (Karar #4). "/slider-test/" varyantı Next'in
 * trailing-slash normalizasyonu (308 → "/slider-test") sonrası buraya
 * zaten "/slider-test" olarak düşer; Set'te yine de tutulur (emniyet).
 */
const GONE_PATHS = new Set(["/slider-test", "/slider-test/", "/locations.kml"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- 1) 410 Gone -----------------------------------------------------
  if (GONE_PATHS.has(pathname)) {
    return new NextResponse("410 Gone — bu sayfa kalıcı olarak kaldırıldı.", {
      status: 410,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  // --- 2) /admin koruması -----------------------------------------------
  // Supabase kurulmadıysa middleware kırılmasın — guard.
  if (!isSupabaseConfigured()) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ÖNEMLİ: createServerClient ile response arasına kod koyma —
  // getUser() session'ı yeniler (updateSession deseni).
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Ağ/konfig hatası → oturumsuz kabul et; login sayfası açık kalır.
  }

  const isLoginPage = pathname === "/admin/login";

  if (!user && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (user && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/slider-test", "/locations.kml"],
};
