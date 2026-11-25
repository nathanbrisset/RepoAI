import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale"
import { CollectionsListPageContent } from "@/lib/pages/collections-list-page-content"

export const dynamic = "force-static"

export function generateMetadata() {
  return metadataFor("/collections", PAGE_LOCALE_EN)
}

export default function CollectionsPage() {
  return <CollectionsListPageContent locale={PAGE_LOCALE_EN} />
}
