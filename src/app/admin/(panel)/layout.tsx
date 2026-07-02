import Sidebar from "@/components/admin/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/admin/env";

/**
 * Panel layout'u — sidebar + içerik alanı.
 * Auth zorlaması middleware + her sayfadaki requireAdmin()'de;
 * burada sadece sidebar için kullanıcı e-postası okunur (env guard'lı).
 */
export default async function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let userEmail: string | null = null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email ?? null;
  }

  return (
    <div className="flex min-h-svh">
      <Sidebar userEmail={userEmail} />
      <main className="min-w-0 flex-1 px-8 py-8 lg:px-10">{children}</main>
    </div>
  );
}
