import type { Metadata } from "next";
import Link from "next/link";
import type { Lead, LeadStatus } from "@/lib/types";
import { requireAdmin } from "@/lib/admin/guard";
import { LEAD_STATUS_LABELS, LEAD_STATUS_ORDER } from "@/lib/admin/lead-status";
import LeadStatusSelect from "@/components/admin/LeadStatusSelect";
import NotConfigured from "@/components/admin/NotConfigured";
import PageHeader from "@/components/admin/PageHeader";

export const metadata: Metadata = { title: "Lead'ler" };

type LeadRow = Lead & { tent_models: { name: string } | null };

const dateFmt = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "medium",
  timeStyle: "short",
});

/** utm jsonb → kompakt "source / medium / campaign" özeti */
function utmSummary(utm: unknown): string {
  if (!utm || typeof utm !== "object" || Array.isArray(utm)) return "—";
  const record = utm as Record<string, unknown>;
  const parts = ["utm_source", "utm_medium", "utm_campaign"]
    .map((key) => record[key])
    .filter((v): v is string => typeof v === "string" && v.length > 0);
  return parts.length > 0 ? parts.join(" / ") : "—";
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const ctx = await requireAdmin();
  if (!ctx.configured) return <NotConfigured />;
  const { supabase } = ctx;

  const activeStatus: LeadStatus | null = LEAD_STATUS_ORDER.includes(
    status as LeadStatus
  )
    ? (status as LeadStatus)
    : null;

  let query = supabase
    .from("leads")
    .select("*, tent_models(name)")
    .order("created_at", { ascending: false })
    .limit(300);
  if (activeStatus) query = query.eq("status", activeStatus);

  const [{ data, error }, ...statusCounts] = await Promise.all([
    query,
    ...LEAD_STATUS_ORDER.map((s) =>
      supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("status", s)
    ),
  ]);

  const leads = (data ?? []) as unknown as LeadRow[];
  const totalCount = statusCounts.reduce((sum, r) => sum + (r.count ?? 0), 0);

  return (
    <>
      <PageHeader
        title="Lead'ler"
        description="Teklif talepleri — pipeline: Yeni → Arandı → Teklif Verildi → Kapandı."
      />

      {/* Durum filtresi */}
      <div className="mb-5 flex flex-wrap gap-2">
        <Link
          href="/admin/leads"
          className={`rounded-sm border px-3.5 py-1.5 text-[13px] font-bold transition-colors ${
            !activeStatus
              ? "border-ink bg-ink text-white"
              : "border-line bg-white text-body hover:border-ink hover:text-ink"
          }`}
        >
          Tümü ({totalCount})
        </Link>
        {LEAD_STATUS_ORDER.map((s, i) => (
          <Link
            key={s}
            href={`/admin/leads?status=${s}`}
            className={`rounded-sm border px-3.5 py-1.5 text-[13px] font-bold transition-colors ${
              activeStatus === s
                ? "border-red bg-red text-white"
                : "border-line bg-white text-body hover:border-red hover:text-red"
            }`}
          >
            {LEAD_STATUS_LABELS[s]} ({statusCounts[i].count ?? 0})
          </Link>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-sm border border-red/25 bg-red/6 px-4 py-3 text-[13.5px] font-semibold text-red">
          Lead&apos;ler yüklenemedi: {error.message}
        </p>
      )}

      <div className="overflow-x-auto rounded-md border border-line bg-white shadow-card">
        <table className="w-full min-w-[960px] text-[13.5px]">
          <thead>
            <tr className="border-b border-line bg-soft text-left text-[11.5px] font-extrabold uppercase tracking-[0.1em] text-muted">
              <th className="px-4 py-3">Ad / Firma</th>
              <th className="px-4 py-3">Telefon</th>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3">Kaynak Sayfa</th>
              <th className="px-4 py-3">UTM</th>
              <th className="px-4 py-3">Tarih</th>
              <th className="px-4 py-3">Durum</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && !error && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted">
                  {activeStatus
                    ? `"${LEAD_STATUS_LABELS[activeStatus]}" durumunda lead yok.`
                    : "Henüz lead yok — teklif formu yayına alınınca burada görünecek."}
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-line align-top last:border-0 hover:bg-soft/50"
              >
                <td className="px-4 py-3">
                  <div className="font-bold text-ink">{lead.name}</div>
                  {lead.company && (
                    <div className="text-[12.5px] text-muted">
                      {lead.company}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-body">
                  {lead.phone ?? "—"}
                </td>
                <td className="px-4 py-3 text-body">
                  {lead.tent_models?.name ?? "—"}
                </td>
                <td
                  className="max-w-[180px] truncate px-4 py-3 text-body"
                  title={lead.source_page ?? undefined}
                >
                  {lead.source_page ?? "—"}
                </td>
                <td
                  className="max-w-[160px] truncate px-4 py-3 text-[12.5px] text-muted"
                  title={utmSummary(lead.utm)}
                >
                  {utmSummary(lead.utm)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted">
                  {dateFmt.format(new Date(lead.created_at))}
                </td>
                <td className="px-4 py-3">
                  <LeadStatusSelect id={lead.id} status={lead.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
