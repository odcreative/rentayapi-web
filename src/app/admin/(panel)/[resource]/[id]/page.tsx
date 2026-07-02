import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getResource } from "@/lib/admin/resources";
import { requireAdmin } from "@/lib/admin/guard";
import { buildDefaults, fetchSelectOptions } from "@/lib/admin/form-defaults";
import DeleteButton from "@/components/admin/DeleteButton";
import NotConfigured from "@/components/admin/NotConfigured";
import PageHeader from "@/components/admin/PageHeader";
import ResourceForm from "@/components/admin/ResourceForm";

type PageProps = { params: Promise<{ resource: string; id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { resource } = await params;
  const config = getResource(resource);
  return { title: config ? `${config.labelSingular} Düzenle` : "Düzenle" };
}

export default async function ResourceEditPage({ params }: PageProps) {
  const { resource, id } = await params;
  const config = getResource(resource);
  if (!config) notFound();

  const ctx = await requireAdmin();
  if (!ctx.configured) return <NotConfigured />;
  const { supabase } = ctx;

  const [{ data: row, error }, selectOptions] = await Promise.all([
    supabase.from(config.table).select("*").eq("id", id).maybeSingle(),
    fetchSelectOptions(supabase, config.fields),
  ]);

  if (error) {
    return (
      <p className="rounded-sm border border-red/25 bg-red/6 px-4 py-3 text-[13.5px] font-semibold text-red">
        Kayıt yüklenemedi: {error.message}
      </p>
    );
  }
  if (!row) notFound();

  const record = row as Record<string, unknown>;
  const title = String(record[config.titleField] ?? id);

  return (
    <>
      <PageHeader
        title={`${config.labelSingular} Düzenle`}
        description={title}
      />
      <ResourceForm
        slug={config.slug}
        id={id}
        fields={config.fields}
        defaults={buildDefaults(config.fields, record)}
        selectOptions={selectOptions}
        cancelHref={`/admin/${config.slug}`}
      />
      <div className="mt-10 max-w-2xl rounded-md border border-red/20 bg-red/4 p-5">
        <h3 className="!text-[15px] !text-red">Tehlikeli Bölge</h3>
        <p className="mb-3 mt-1 text-[13px] text-body">
          Bu kayıt kalıcı olarak silinir; geri alınamaz.
        </p>
        <DeleteButton
          slug={config.slug}
          id={id}
          itemLabel={title}
          redirectToList
        />
      </div>
    </>
  );
}
