import { GuidesListPage } from "@/components/pages/guides-list-page"
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale"

export const dynamic = "force-static"

export function generateMetadata() {
  return metadataFor("/guides", PAGE_LOCALE_EN)
}

export default function GuidesPage() {
  return <GuidesListPage />
}
