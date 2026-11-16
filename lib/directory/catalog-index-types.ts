import type { PriceFilter } from "@/lib/price-filter"

/** Light row embedded in static JSON — no howTo, features, or long description. */
export type CatalogSearchIndexEntry = {
  id: string
  name: string
  categories: string[]
  summary: string
  pricingModel?: string
  priceBucket: PriceFilter | null
  pricingLabel?: string
  pricingUncertain: boolean
  hqCountry?: string
  logo: string
  dateAdded: string
}

export type CatalogSearchIndexFile = {
  locale: string
  generatedAt: string
  tools: CatalogSearchIndexEntry[]
}