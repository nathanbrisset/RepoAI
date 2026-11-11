import { LegalDocumentPage } from "@/components/pages/legal-document-page"
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale"

export const dynamic = "force-static"
export const revalidate = 86400

export function generateMetadata() {
  return metadataFor("/terms", PAGE_LOCALE_EN)
}

export default function TermsOfServicePage() {
  return <LegalDocumentPage kind="terms" />
}
