// Auto-generated — run: node scripts/generate-fr-mirror-pages.mjs
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_FR } from "@/lib/i18n/page-locale"
import EnPage from "@/app/(en)/about/page"

export const dynamic = "force-static"

export function generateMetadata() {
  return metadataFor("/about", PAGE_LOCALE_FR)
}

export default EnPage
