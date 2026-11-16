// Auto-generated — run: node scripts/generate-fr-mirror-pages.mjs
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_FR } from "@/lib/i18n/page-locale"
import { ToolPageContent } from "@/lib/pages/tool-page-content"
import { generateStaticParams } from "@/app/(en)/tool/[id]/page"
export const dynamic = "force-static"
export { generateStaticParams }
export const dynamicParams = false
type PageProps = {
  params: Promise<{ id: string }>
}
export async function generateMetadata(props: PageProps) {
  const { id } = await props.params
  return metadataFor(`/tool/${id}`, PAGE_LOCALE_FR)
}
export default async function Page(props: PageProps) {
  return ToolPageContent({ locale: PAGE_LOCALE_FR, params: props.params })
}