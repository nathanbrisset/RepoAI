import { CataloguePageBody } from "@/components/directory/catalogue-page-body"
import { parseCatalogSearchParams, queryCatalogRecords } from "@/lib/directory/catalog-query"
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale"
import { Suspense } from "react"

export const dynamic = "force-static"

export function generateMetadata() {
  return metadataFor("/tools", PAGE_LOCALE_EN)
}

export default function Page() {
  const initialPage = queryCatalogRecords(PAGE_LOCALE_EN, parseCatalogSearchParams({}))

  return (
    <Suspense fallback={<div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8" />}>
      <CataloguePageBody basePath="/tools" initialPage={initialPage} />
    </Suspense>
  )
}