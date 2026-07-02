/**
 * /admin/* koruması — @supabase/ssr middleware deseni (updateSession).
 *
 * - Sadece /admin altında çalışır (matcher).
 * - Env yoksa (Supabase cloud projesi henüz kurulmadı) HİÇBİR ŞEY yapmadan
 *   geçer; sayfalar kendi "yapılandırılmamış" ekranını gösterir.
 * - Env varsa: session çerezlerini yeniler, kullanıcı yoksa /admin/login'e,
 *   login'deyken kullanıcı varsa /admin'e yönlendirir.
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/admin/env";

export async function middleware(request: NextRequest) {
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

  const { pathname } = request.nextUrl;
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
  matcher: ["/admin/:path*"],
};
