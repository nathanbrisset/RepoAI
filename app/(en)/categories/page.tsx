import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale"
import { CategoriesListPageContent } from "@/lib/pages/categories-list-page-content"

export const dynamic = "force-static"

export function generateMetadata() {
  return metadataFor("/categories", PAGE_LOCALE_EN)
}

export default function CategoriesPage() {
  return <CategoriesListPageContent locale={PAGE_LOCALE_EN} />
}
