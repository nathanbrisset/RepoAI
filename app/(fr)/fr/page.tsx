// Auto-generated — run: node scripts/generate-fr-mirror-pages.mjs
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_FR } from "@/lib/i18n/page-locale"
import { HomePageContent } from "@/lib/pages/home-page-content"
export const dynamic = "force-static"
export function generateMetadata() {
  return metadataFor("/", PAGE_LOCALE_FR)
}
export default function Page() {
  return HomePageContent({ locale: PAGE_LOCALE_FR })
}