"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useLocale } from "@/components/locale-provider"
import { parseCatalogSearchParams, queryCatalogRecords } from "@/lib/directory/catalog-query"
import { CatalogueClient } from "./catalogue-client"

export function CataloguePageBody({ basePath }: { basePath: "/catalogue" | "/tools" }) {
  const locale = useLocale()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const catalogPage = useMemo(() => {
    if (!mounted) {
      return queryCatalogRecords(locale, {})
    }
    const params: Record<string, string | string[] | undefined> = {}
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    return queryCatalogRecords(locale, parseCatalogSearchParams(params))
  }, [locale, searchParams, mounted])

  return <CatalogueClient basePath={basePath} catalogPage={catalogPage} />
}
