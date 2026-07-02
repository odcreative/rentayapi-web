/**
 * Lead durum etiketleri (TR) — server ve client tarafında ortak kullanılır.
 * Pipeline sırası: new → called → quoted → closed
 */

import type { LeadStatus } from "@/lib/types";

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Yeni",
  called: "Arandı",
  quoted: "Teklif Verildi",
  closed: "Kapandı",
};

export const LEAD_STATUS_ORDER: LeadStatus[] = [
  "new",
  "called",
  "quoted",
  "closed",
];
