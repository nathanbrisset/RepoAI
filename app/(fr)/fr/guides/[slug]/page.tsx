// Auto-generated — run: node scripts/generate-fr-mirror-pages.mjs
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_FR } from "@/lib/i18n/page-locale"
import { GuidePageContent } from "@/lib/pages/guide-page-content"
import { generateStaticParams } from "@/app/(en)/guides/[slug]/page"
export const dynamic = "force-static"
export { generateStaticParams }
export const dynamicParams = false
type PageProps = {
  params: Promise<{ slug: string }>
}
export async function generateMetadata(props: PageProps) {
  const { slug } = await props.params
  return metadataFor(`/guides/${slug}`, PAGE_LOCALE_FR)
}
export default async function Page(props: PageProps) {
  return GuidePageContent({ locale: PAGE_LOCALE_FR, params: props.params })
}