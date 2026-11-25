import { Suspense } from "react"
import { CataloguePageBody } from "@/components/directory/catalogue-page-body"
import { parseCatalogSearchParams, queryCatalogRecords } from "@/lib/directory/catalog-query"
import type { Locale } from "@/lib/i18n/config"

export function CataloguePageContent({ locale }: { locale: Locale }) {
  const initialPage = queryCatalogRecords(locale, parseCatalogSearchParams({}))

  return (
    <Suspense fallback={<div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8" />}>
      <CataloguePageBody basePath="/catalogue" initialPage={initialPage} />
    </Suspense>
  )
}