import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale"
import AboutPage from "./about-client"

export const dynamic = "force-static"

export function generateMetadata() {
  return metadataFor("/about", PAGE_LOCALE_EN)
}

export default function Page() {
  return <AboutPage />
}
