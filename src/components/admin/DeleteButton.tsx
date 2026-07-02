"use client";

/**
 * Onaylı silme butonu — confirm() sonrası server action çağırır.
 */

import { useTransition } from "react";
import { deleteResourceAction } from "@/lib/admin/actions";

type DeleteButtonProps = {
  slug: string;
  id: string;
  /** confirm mesajında gösterilecek kayıt adı */
  itemLabel: string;
  /** Düzenleme sayfasından silinince listeye dön */
  redirectToList?: boolean;
};

export default function DeleteButton({
  slug,
  id,
  itemLabel,
  redirectToList = false,
}: DeleteButtonProps) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm(`"${itemLabel}" kalıcı olarak silinecek. Emin misiniz?`)) {
      return;
    }
    startTransition(async () => {
      const result = await deleteResourceAction(slug, id, redirectToList);
      if (result?.error) window.alert(result.error);
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="rounded-sm border border-line px-2.5 py-1 text-[12.5px] font-bold text-muted transition-colors hover:border-red hover:bg-red hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Siliniyor…" : "Sil"}
    </button>
  );
}
