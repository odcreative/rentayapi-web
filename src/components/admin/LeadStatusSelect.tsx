"use client";

/**
 * Lead durum pipeline'ı — satır içi durum değiştirme (server action).
 * new → called → quoted → closed (Yeni/Arandı/Teklif Verildi/Kapandı)
 */

import { useTransition } from "react";
import type { LeadStatus } from "@/lib/types";
import { updateLeadStatusAction } from "@/lib/admin/actions";
import { LEAD_STATUS_LABELS } from "@/lib/admin/lead-status";

const STATUS_CLASSES: Record<LeadStatus, string> = {
  new: "border-red/30 bg-red/8 text-red",
  called: "border-star/40 bg-star/10 text-[#8A6100]",
  quoted: "border-ink-blue/25 bg-ink-blue/8 text-ink-blue",
  closed: "border-line bg-soft text-muted",
};

export default function LeadStatusSelect({
  id,
  status,
}: {
  id: string;
  status: LeadStatus;
}) {
  const [pending, startTransition] = useTransition();

  function handleChange(next: string) {
    startTransition(async () => {
      const result = await updateLeadStatusAction(id, next as LeadStatus);
      if (result?.error) window.alert(result.error);
    });
  }

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => handleChange(e.target.value)}
      className={`cursor-pointer rounded-sm border px-2 py-1 text-[12.5px] font-bold outline-none transition-opacity disabled:opacity-50 ${STATUS_CLASSES[status]}`}
      aria-label="Lead durumu"
    >
      {(Object.keys(LEAD_STATUS_LABELS) as LeadStatus[]).map((value) => (
        <option key={value} value={value}>
          {LEAD_STATUS_LABELS[value]}
        </option>
      ))}
    </select>
  );
}
