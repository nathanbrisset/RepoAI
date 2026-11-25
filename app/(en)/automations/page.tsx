import { AutomationsPage } from "@/components/pages/automations-page"
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale"

export const dynamic = "force-static"

export function generateMetadata() {
  return metadataFor("/automations", PAGE_LOCALE_EN)
}

export default function Page() {
  return <AutomationsPage />
}
