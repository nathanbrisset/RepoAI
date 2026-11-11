// Auto-generated — run: node scripts/generate-fr-mirror-pages.mjs
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_FR } from "@/lib/i18n/page-locale"
import { CategoryPageContent } from "@/lib/pages/category-page-content"
import { generateStaticParams } from "@/app/(en)/categories/[category]/page"
export const dynamic = "force-static"
export { generateStaticParams }
export const dynamicParams = false
type PageProps = {
  params: Promise<{ category: string }>
}
export async function generateMetadata(props: PageProps) {
  const { category } = await props.params
  return metadataFor(`/categories/${category}`, PAGE_LOCALE_FR)
}
export default async function Page(props: PageProps) {
  return CategoryPageContent({ locale: PAGE_LOCALE_FR, params: props.params })
}