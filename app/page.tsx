import { HomePageContent } from "@/lib/pages/home-page-content"
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale"

export const dynamic = "force-static"
export const revalidate = 86400

export function generateMetadata() {
  return metadataFor("/", PAGE_LOCALE_EN)
}

export default function Page() {
  return <HomePageContent locale={PAGE_LOCALE_EN} />
}
