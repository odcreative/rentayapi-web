import SectionPlaceholder from "@/components/ui/SectionPlaceholder";

/** index-v2: "Latest Blog" — son yazılar (posts tablosundan) */
export default function BlogSection() {
  return (
    <SectionPlaceholder
      eyebrow="Haber & Blog"
      title="Rehberler ve sektör içerikleri"
      note="Son 3 yazı `posts` tablosundan listelenecek (31 canlı yazı migrate edildikten sonra)."
      soft
    />
  );
}
