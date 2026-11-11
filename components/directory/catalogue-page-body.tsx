"use client"

import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { useLocale } from "@/components/locale-provider"
import { parseCatalogSearchParams, queryCatalogRecords } from "@/lib/directory/catalog-query"
import { CatalogueClient } from "./catalogue-client"

export function CataloguePageBody({ basePath }: { basePath: "/catalogue" | "/tools" }) {
  const locale = useLocale()
  const searchParams = useSearchParams()
  const catalogPage = useMemo(() => {
    const params: Record<string, string | string[] | undefined> = {}
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    return queryCatalogRecords(locale, parseCatalogSearchParams(params))
  }, [locale, searchParams])

  return <CatalogueClient basePath={basePath} catalogPage={catalogPage} />
}
