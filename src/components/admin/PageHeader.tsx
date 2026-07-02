import Link from "next/link";

/**
 * Panel sayfa başlığı — başlık + opsiyonel açıklama + opsiyonel aksiyon linki.
 */
export default function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
      <div>
        <h1 className="!text-[26px] !tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-[13.5px] text-muted">{description}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="rounded-sm bg-red px-5 py-2.5 text-[13.5px] font-extrabold text-white transition-colors hover:bg-red-dark"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
