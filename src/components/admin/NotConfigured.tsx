/**
 * Supabase env'leri doldurulmadığında gösterilen zarif bilgi ekranı.
 * (Cloud proje kurulunca .env.local doldurulacak — STATUS.md sonraki adım 1)
 */
export default function NotConfigured() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <div className="w-full max-w-lg rounded-md border border-line bg-white p-8 shadow-card">
        <span className="eyebrow">Kurulum Gerekli</span>
        <h2 className="!text-2xl">Supabase bağlantısı yapılandırılmamış</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-body">
          Admin paneli çalışmak için bir Supabase cloud projesine ihtiyaç
          duyar. Proje açıldıktan sonra <code className="rounded-sm bg-soft px-1.5 py-0.5 text-[13px] text-ink">.env.local</code> dosyasını
          doldurun:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-sm bg-ink p-4 text-[12.5px] leading-relaxed text-white/80">
{`NEXT_PUBLIC_SUPABASE_URL=https://<proje>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>`}
        </pre>
        <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-[14px] text-body">
          <li>Supabase&apos;te proje aç</li>
          <li>
            <code className="rounded-sm bg-soft px-1.5 py-0.5 text-[13px] text-ink">supabase/migrations/0001_initial_schema.sql</code>{" "}
            dosyasını uygula
          </li>
          <li>Authentication → Users&apos;tan admin kullanıcısı oluştur</li>
          <li><code className="rounded-sm bg-soft px-1.5 py-0.5 text-[13px] text-ink">.env.local</code> doldur ve dev sunucusunu yeniden başlat</li>
        </ol>
      </div>
    </div>
  );
}
