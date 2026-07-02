import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/admin/env";
import LoginForm from "@/components/admin/LoginForm";
import NotConfigured from "@/components/admin/NotConfigured";

export const metadata: Metadata = { title: "Giriş" };

export default async function AdminLoginPage() {
  if (!isSupabaseConfigured()) {
    return <NotConfigured />;
  }

  // Zaten oturum açıksa panele yönlendir (middleware'in ikinci hattı)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/admin");

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Marka */}
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-red text-lg font-extrabold text-white">
            R
          </span>
          <div className="leading-tight">
            <div className="text-[17px] font-extrabold tracking-tight text-ink">
              Renta Yapı
            </div>
            <div className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-muted">
              Admin Panel
            </div>
          </div>
        </div>

        <div className="rounded-md border border-line bg-white p-7 shadow-card">
          <h1 className="!text-[22px]">Giriş Yap</h1>
          <p className="mb-5 mt-1 text-[13.5px] text-muted">
            Yönetim paneline erişmek için hesabınızla giriş yapın.
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
