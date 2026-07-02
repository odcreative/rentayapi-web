import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getResource } from "@/lib/admin/resources";
import { requireAdmin } from "@/lib/admin/guard";
import { buildDefaults, fetchSelectOptions } from "@/lib/admin/form-defaults";
import NotConfigured from "@/components/admin/NotConfigured";
import PageHeader from "@/components/admin/PageHeader";
import ResourceForm from "@/components/admin/ResourceForm";

type PageProps = { params: Promise<{ resource: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { resource } = await params;
  const config = getResource(resource);
  return { title: config ? `Yeni ${config.labelSingular}` : "Yeni Kayıt" };
}

export default async function ResourceCreatePage({ params }: PageProps) {
  const { resource } = await params;
  const config = getResource(resource);
  if (!config) notFound();

  const ctx = await requireAdmin();
  if (!ctx.configured) return <NotConfigured />;

  const selectOptions = await fetchSelectOptions(ctx.supabase, config.fields);

  return (
    <>
      <PageHeader
        title={`Yeni ${config.labelSingular}`}
        description={`${config.labelPlural} listesine yeni kayıt ekle.`}
      />
      <ResourceForm
        slug={config.slug}
        id={null}
        fields={config.fields}
        defaults={buildDefaults(config.fields)}
        selectOptions={selectOptions}
        cancelHref={`/admin/${config.slug}`}
      />
    </>
  );
}
