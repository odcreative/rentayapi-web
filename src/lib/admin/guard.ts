/**
 * Admin sayfa guard'ı — her admin server component'i işe bununla başlar.
 *
 * 1) Env yoksa: { configured: false } döner → sayfa <NotConfigured /> gösterir
 *    (build/runtime asla patlamaz).
 * 2) Env varsa: session doğrulanır; kullanıcı yoksa /admin/login'e redirect.
 *    (Middleware birincil koruma; bu ikinci savunma hattı.)
 */

import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "./env";

export type AdminContext =
  | { configured: false; supabase: null; user: null }
  | { configured: true; supabase: SupabaseClient; user: User };

export async function requireAdmin(): Promise<AdminContext> {
  if (!isSupabaseConfigured()) {
    return { configured: false, supabase: null, user: null };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return { configured: true, supabase, user };
}
