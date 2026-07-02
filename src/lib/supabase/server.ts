/**
 * Supabase server client — Server Component / Route Handler / Server Action.
 * Standart @supabase/ssr deseni (Next.js App Router, async cookies).
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component'ten çağrıldığında set başarısız olabilir —
            // middleware session yenilemesi varsa güvenle yok sayılır.
          }
        },
      },
    }
  );
}
