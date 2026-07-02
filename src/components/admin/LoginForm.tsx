"use client";

/**
 * Admin login formu — Supabase Auth email/password (server action üzerinden).
 */

import { useActionState } from "react";
import { loginAction, type FormState } from "@/lib/admin/actions";

const initialState: FormState = { error: null };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-sm border border-red/25 bg-red/6 px-4 py-3 text-[13.5px] font-semibold text-red">
          {state.error}
        </p>
      )}

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-[13px] font-bold text-ink"
        >
          E-posta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="admin@rentayapi.com"
          className="w-full rounded-sm border border-line bg-white px-3.5 py-2.5 text-[14.5px] text-ink outline-none transition-colors focus:border-red"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-[13px] font-bold text-ink"
        >
          Şifre
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full rounded-sm border border-line bg-white px-3.5 py-2.5 text-[14.5px] text-ink outline-none transition-colors focus:border-red"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-sm bg-red px-4 py-3 text-[14.5px] font-extrabold text-white transition-colors hover:bg-red-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Giriş yapılıyor…" : "Giriş Yap"}
      </button>
    </form>
  );
}
