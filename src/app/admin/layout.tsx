import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel | Renta Yapı",
    template: "%s | Renta Admin",
  },
  robots: { index: false, follow: false },
};

/**
 * Admin kök layout'u — public Header/Footer'ı GİZLEMEK için kök layout'a
 * dokunmuyoruz (başka agent'lar çalışıyor); bunun yerine admin, kendi
 * tam-ekran fixed wrapper'ıyla public chrome'un ÜSTÜNE kurulur.
 * z-[100]: Header z-index 50/90'ın üstünde. Scroll bu container'dadır.
 */
export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-soft text-body">
      {children}
    </div>
  );
}
