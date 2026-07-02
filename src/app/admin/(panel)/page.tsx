import type { Metadata } from "next";
import Link from "next/link";
import type { Lead } from "@/lib/types";
import { requireAdmin } from "@/lib/admin/guard";
import { LEAD_STATUS_LABELS } from "@/lib/admin/lead-status";
import NotConfigured from "@/components/admin/NotConfigured";
import PageHeader from "@/components/admin/PageHeader";

export const metadata: Metadata = { title: "Dashboard" };

const dateFmt = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "medium",
  timeStyle: "short",
});

function StatCard({
  label,
  value,
  href,
  accent = false,
}: {
  label: string;
  value: number;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-md border p-5 shadow-card transition-transform hover:-translate-y-0.5 ${
        accent ? "border-red/20 bg-red text-white" : "border-line bg-white"
      }`}
    >
      <div
        className={`text-[12px] font-extrabold uppercase tracking-[0.12em] ${
          accent ? "text-white/70" : "text-muted"
        }`}
      >
        {label}
      </div>
      <div
        className={`mt-1.5 text-[34px] font-extrabold leading-none tracking-tight ${
          accent ? "text-white" : "text-ink"
        }`}
      >
        {value}
      </div>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const ctx = await requireAdmin();
  if (!ctx.configured) return <NotConfigured />;
  const { supabase } = ctx;

  const [
    leadsTotal,
    leadsNew,
    modelsPublished,
    projectsPublished,
    postsPublished,
    recentLeadsRes,
  ] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("tent_models")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .not("published_at", "is", null),
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const recentLeads = (recentLeadsRes.data ?? []) as unknown as Lead[];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Lead pipeline'ı ve yayındaki içeriğin genel görünümü."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          label="Yeni Lead"
          value={leadsNew.count ?? 0}
          href="/admin/leads?status=new"
          accent
        />
        <StatCard
          label="Toplam Lead"
          value={leadsTotal.count ?? 0}
          href="/admin/leads"
        />
        <StatCard
          label="Yayında Model"
          value={modelsPublished.count ?? 0}
          href="/admin/modeller"
        />
        <StatCard
          label="Yayında Proje"
          value={projectsPublished.count ?? 0}
          href="/admin/projeler"
        />
        <StatCard
          label="Yayında Yazı"
          value={postsPublished.count ?? 0}
          href="/admin/blog"
        />
      </div>

      {/* Son lead'ler */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="!text-[17px]">Son Lead&apos;ler</h2>
          <Link
            href="/admin/leads"
            className="text-[13px] font-bold text-red hover:text-red-dark"
          >
            Tümünü gör →
          </Link>
        </div>

        <div className="overflow-hidden rounded-md border border-line bg-white shadow-card">
          {recentLeads.length === 0 ? (
            <p className="px-5 py-8 text-center text-[14px] text-muted">
              Henüz lead yok — teklif formu yayına alınınca burada görünecek.
            </p>
          ) : (
            <table className="w-full text-[13.5px]">
              <tbody>
                {recentLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-line last:border-0"
                  >
                    <td className="px-5 py-3 font-bold text-ink">
                      {lead.name}
                    </td>
                    <td className="px-5 py-3 text-body">
                      {lead.company ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-body">
                      {lead.phone ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {dateFmt.format(new Date(lead.created_at))}
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-sm bg-soft px-2 py-1 text-[12px] font-bold text-ink">
                        {LEAD_STATUS_LABELS[lead.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
}
