import { Suspense } from "react"
import { CataloguePageBody } from "@/components/directory/catalogue-page-body"
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale"

export const dynamic = "force-static"
export const revalidate = 86400

export function generateMetadata() {
  return metadataFor("/catalogue", PAGE_LOCALE_EN)
}

export default function CataloguePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8" />}>
      <CataloguePageBody basePath="/catalogue" />
    </Suspense>
  )
}
