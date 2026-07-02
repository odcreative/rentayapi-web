"use client";

/**
 * Admin sidebar — nav + çıkış. Aktif link vurgusu için client component.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV } from "@/lib/admin/resources";
import { logoutAction } from "@/lib/admin/actions";

export default function Sidebar({ userEmail }: { userEmail?: string | null }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside className="sticky top-0 flex h-svh w-60 shrink-0 flex-col bg-ink text-white">
      {/* Marka */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-red text-[15px] font-extrabold text-white">
          R
        </span>
        <div className="leading-tight">
          <div className="text-[14px] font-extrabold tracking-tight">
            Renta Yapı
          </div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
            Admin Panel
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {ADMIN_NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block rounded-sm px-3 py-2 text-[14px] font-semibold transition-colors ${
                  isActive(item.href)
                    ? "bg-red text-white"
                    : "text-white/65 hover:bg-white/8 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Kullanıcı + çıkış */}
      <div className="border-t border-white/10 px-5 py-4">
        {userEmail && (
          <div className="mb-2 truncate text-[12px] text-white/45" title={userEmail}>
            {userEmail}
          </div>
        )}
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full rounded-sm border border-white/15 px-3 py-2 text-[13px] font-bold text-white/75 transition-colors hover:border-red hover:bg-red hover:text-white"
          >
            Çıkış Yap
          </button>
        </form>
      </div>
    </aside>
  );
}
