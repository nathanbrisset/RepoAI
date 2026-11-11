// Auto-generated — run: node scripts/generate-fr-mirror-pages.mjs
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_FR } from "@/lib/i18n/page-locale"
import EnPage from "../../../category/popular/page"

export const dynamic = "force-static"
export const revalidate = 86400

export function generateMetadata() {
  return metadataFor("/category/popular", PAGE_LOCALE_FR)
}

export default EnPage
