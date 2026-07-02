import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getResource, type ListColumn } from "@/lib/admin/resources";
import { requireAdmin } from "@/lib/admin/guard";
import DeleteButton from "@/components/admin/DeleteButton";
import NotConfigured from "@/components/admin/NotConfigured";
import PageHeader from "@/components/admin/PageHeader";
import PublishToggle from "@/components/admin/PublishToggle";

type PageProps = { params: Promise<{ resource: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { resource } = await params;
  return { title: getResource(resource)?.labelPlural ?? "İçerik" };
}

const dateFmt = new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" });

function Cell({ row, col }: { row: Record<string, unknown>; col: ListColumn }) {
  const value = row[col.name];

  if (col.kind === "boolean") {
    const isOn = Boolean(value);
    return (
      <span
        className={`rounded-sm px-2 py-0.5 text-[11.5px] font-extrabold ${
          isOn ? "bg-red/8 text-red" : "bg-soft text-muted"
        }`}
      >
        {isOn ? "Yayında" : "Taslak"}
      </span>
    );
  }

  if (col.kind === "date") {
    return (
      <span className="text-muted">
        {typeof value === "string" ? dateFmt.format(new Date(value)) : "—"}
      </span>
    );
  }

  if (value === null || value === undefined || value === "") return <>—</>;

  return (
    <span className="block max-w-[260px] truncate" title={String(value)}>
      {String(value)}
    </span>
  );
}

export default async function ResourceListPage({ params }: PageProps) {
  const { resource } = await params;
  const config = getResource(resource);
  if (!config) notFound();

  const ctx = await requireAdmin();
  if (!ctx.configured) return <NotConfigured />;
  const { supabase } = ctx;

  const { data, error } = await supabase
    .from(config.table)
    .select("*")
    .order(config.orderBy.column, { ascending: config.orderBy.ascending })
    .limit(500);

  const rows = (data ?? []) as Record<string, unknown>[];

  return (
    <>
      <PageHeader
        title={config.labelPlural}
        description={`${rows.length} kayıt`}
        action={{
          href: `/admin/${config.slug}/new`,
          label: `+ Yeni ${config.labelSingular}`,
        }}
      />

      {error && (
        <p className="mb-4 rounded-sm border border-red/25 bg-red/6 px-4 py-3 text-[13.5px] font-semibold text-red">
          Kayıtlar yüklenemedi: {error.message}
        </p>
      )}

      <div className="overflow-x-auto rounded-md border border-line bg-white shadow-card">
        <table className="w-full text-[13.5px]">
          <thead>
            <tr className="border-b border-line bg-soft text-left text-[11.5px] font-extrabold uppercase tracking-[0.1em] text-muted">
              {config.listColumns.map((col, i) => (
                <th key={`${col.name}-${i}`} className="px-4 py-3">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !error && (
              <tr>
                <td
                  colSpan={config.listColumns.length + 1}
                  className="px-4 py-10 text-center text-muted"
                >
                  Henüz kayıt yok — &quot;Yeni {config.labelSingular}&quot; ile
                  ilk kaydı oluşturun.
                </td>
              </tr>
            )}
            {rows.map((row) => {
              const id = String(row.id);
              const title = String(row[config.titleField] ?? id);
              return (
                <tr
                  key={id}
                  className="border-b border-line last:border-0 hover:bg-soft/50"
                >
                  {config.listColumns.map((col, i) => (
                    <td
                      key={`${col.name}-${i}`}
                      className={`px-4 py-3 ${
                        col.name === config.titleField
                          ? "font-bold text-ink"
                          : "text-body"
                      }`}
                    >
                      {col.name === config.titleField ? (
                        <Link
                          href={`/admin/${config.slug}/${id}`}
                          className="hover:text-red"
                        >
                          <Cell row={row} col={col} />
                        </Link>
                      ) : (
                        <Cell row={row} col={col} />
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {config.toggles?.map((toggle) => (
                        <PublishToggle
                          key={toggle.field}
                          slug={config.slug}
                          id={id}
                          field={toggle.field}
                          label={toggle.label}
                          kind={toggle.kind}
                          isOn={Boolean(row[toggle.field])}
                        />
                      ))}
                      <Link
                        href={`/admin/${config.slug}/${id}`}
                        className="rounded-sm border border-line px-2.5 py-1 text-[12.5px] font-bold text-body transition-colors hover:border-ink hover:text-ink"
                      >
                        Düzenle
                      </Link>
                      <DeleteButton
                        slug={config.slug}
                        id={id}
                        itemLabel={title}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
