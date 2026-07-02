import type { Metadata } from "next";
import type { SiteSetting } from "@/lib/types";
import { requireAdmin } from "@/lib/admin/guard";
import NotConfigured from "@/components/admin/NotConfigured";
import PageHeader from "@/components/admin/PageHeader";
import SettingsForm from "@/components/admin/SettingsForm";

export const metadata: Metadata = { title: "Site Ayarları" };

export default async function AdminSettingsPage() {
  const ctx = await requireAdmin();
  if (!ctx.configured) return <NotConfigured />;
  const { supabase } = ctx;

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("key", { ascending: true });

  const settings = ((data ?? []) as unknown as SiteSetting[]).map((row) => ({
    key: row.key,
    value: JSON.stringify(row.value, null, 2),
  }));

  return (
    <>
      <PageHeader
        title="Site Ayarları"
        description="key/value ayarlar (site_settings) — iletişim, tanıtım videosu, duyuru şeridi vb."
      />

      {error && (
        <p className="mb-4 rounded-sm border border-red/25 bg-red/6 px-4 py-3 text-[13.5px] font-semibold text-red">
          Ayarlar yüklenemedi: {error.message}
        </p>
      )}

      <SettingsForm settings={settings} />
    </>
  );
}
