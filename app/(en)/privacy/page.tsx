import { LegalDocumentPage } from "@/components/pages/legal-document-page"
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale"

export const dynamic = "force-static"

export function generateMetadata() {
  return metadataFor("/privacy", PAGE_LOCALE_EN)
}

export default function Page() {
  return <LegalDocumentPage kind="privacy" />
}
