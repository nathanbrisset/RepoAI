import { listedTools } from "@/lib/catalog"
import type { Locale } from "./config"
import { toolForLocale } from "./localize-tool"

/** Fields the header search actually matches. One language, no fiche overlay. */
export type CatalogSearchRecord = {
  id: string
  name: string
  description: string
  categories: string[]
  tags?: string[]
  features?: string[]
}

const cache = new Map<Locale, CatalogSearchRecord[]>()

export function searchRecordsForLocale(locale: Locale): CatalogSearchRecord[] {
  const cached = cache.get(locale)
  if (cached) return cached
  const records = listedTools.map((tool) => {
    const localized = toolForLocale(tool, locale)
    return {
      id: localized.id,
      name: localized.name,
      description: localized.description,
      categories: localized.categories,
      tags: localized.tags,
      features: localized.features,
    }
  })
  cache.set(locale, records)
  return records
}
