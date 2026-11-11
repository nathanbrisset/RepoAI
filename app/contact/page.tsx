import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale"
import ContactPage from "./contact-client"

export const dynamic = "force-static"
export const revalidate = 86400

export function generateMetadata() {
  return metadataFor("/contact", PAGE_LOCALE_EN)
}

export default function Page() {
  return <ContactPage />
}
