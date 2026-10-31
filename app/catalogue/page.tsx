import { Suspense } from "react"
import { CatalogueClient } from "@/components/directory/catalogue-client"
import { parseCatalogSearchParams, queryCatalogRecords } from "@/lib/directory/catalog-query"
import { getLocale } from "@/lib/i18n/get-locale"
import { metadataFor } from "@/lib/i18n/metadata"

export function generateMetadata() {
  return metadataFor("/catalogue")
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function CataloguePage({ searchParams }: PageProps) {
  const locale = await getLocale()
  const params = await searchParams
  const catalogPage = queryCatalogRecords(locale, parseCatalogSearchParams(params))

  return (
    <Suspense fallback={<div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8" />}>
      <CatalogueClient basePath="/catalogue" catalogPage={catalogPage} />
    </Suspense>
  )
}
