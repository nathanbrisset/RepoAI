// Auto-generated — run: node scripts/generate-fr-mirror-pages.mjs
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_FR } from "@/lib/i18n/page-locale"
import { CollectionPageContent } from "@/lib/pages/collection-page-content"
import { generateStaticParams } from "../../../collections/[slug]/page"
export const dynamic = "force-static"
export const revalidate = 86400
export { generateStaticParams }
type PageProps = {
  params: Promise<{ slug: string }>
}
export async function generateMetadata(props: PageProps) {
  const { slug } = await props.params
  return metadataFor(`/collections/${slug}`, PAGE_LOCALE_FR)
}
export default async function Page(props: PageProps) {
  return CollectionPageContent({ locale: PAGE_LOCALE_FR, params: props.params })
}