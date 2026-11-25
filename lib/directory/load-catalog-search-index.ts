"use client"

import type { CatalogSearchIndexEntry, CatalogSearchIndexFile } from "@/lib/directory/catalog-index-types"
import type { Locale } from "@/lib/i18n/config"

const cache = new Map<Locale, Promise<CatalogSearchIndexEntry[]>>()

export function catalogSearchIndexUrl(locale: Locale) {
  return locale === "fr" ? "/catalog-search/fr.json" : "/catalog-search/en.json"
}

export function loadCatalogSearchIndex(locale: Locale): Promise<CatalogSearchIndexEntry[]> {
  const cached = cache.get(locale)
  if (cached) return cached

  const promise = fetch(catalogSearchIndexUrl(locale), { credentials: "same-origin" })
    .then((response) => {
      if (!response.ok) throw new Error(`catalog search index ${response.status}`)
      return response.json() as Promise<CatalogSearchIndexFile>
    })
    .then((file) => file.tools)

  cache.set(locale, promise)
  return promise
}

export function prefetchCatalogSearchIndex(locale: Locale) {
  void loadCatalogSearchIndex(locale).catch(() => undefined)
}