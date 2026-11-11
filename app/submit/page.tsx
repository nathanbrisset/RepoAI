import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale"
import SubmitPage from "./submit-client"

export const dynamic = "force-static"
export const revalidate = 86400

export function generateMetadata() {
  return metadataFor("/submit", PAGE_LOCALE_EN)
}

export default function Page() {
  return <SubmitPage />
}
