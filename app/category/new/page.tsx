import { CategoryListPage } from "@/components/pages/category-list-page"
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale"

export const dynamic = "force-static"
export const revalidate = 86400

export function generateMetadata() {
  return metadataFor("/category/new", PAGE_LOCALE_EN)
}

export default function NewToolsPage() {
  return <CategoryListPage kind="new" />
}
