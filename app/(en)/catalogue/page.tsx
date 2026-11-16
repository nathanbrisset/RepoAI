import { CataloguePageContent } from "@/lib/pages/catalogue-page-content"
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale"

export const dynamic = "force-static"

export function generateMetadata() {
  return metadataFor("/catalogue", PAGE_LOCALE_EN)
}

export default function CataloguePage() {
  return CataloguePageContent({ locale: PAGE_LOCALE_EN })
}