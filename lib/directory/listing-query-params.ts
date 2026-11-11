import type { SortMode } from "@/lib/directory/catalog-query"
import type { PriceFilter } from "@/lib/price-filter"
import { priceFilterParam, PRICE_FILTERS } from "@/lib/price-filter"
import { parseCatalogueHqCountryParam } from "@/lib/hq-country-filter"

export type ListingQueryUi = {
  category: string
  q: string
  sort: SortMode
  pricing: string | null
  hqCountry: string | null
  page: number
}

export function listingQueryFromSearchParams(params: URLSearchParams): ListingQueryUi {
  const category = params.get("category") || ""
  const q = (params.get("q") || "").trim()
  const sortParam = params.get("sort")
  const sort: SortMode = sortParam === "new" || sortParam === "top" ? sortParam : "trending"
  const pricing = params.get("pricing")
  const hqCountry = params.get("hqCountry")
  const pageRaw = Number.parseInt(params.get("page") || "1", 10)
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1
  return { category, q, sort, pricing, hqCountry, page }
}

export const EMPTY_LISTING_QUERY: ListingQueryUi = {
  category: "",
  q: "",
  sort: "trending",
  pricing: null,
  hqCountry: null,
  page: 1,
}

export function activePriceFilter(pricing: string | null) {
  return PRICE_FILTERS.find((filter) => priceFilterParam(filter) === pricing) || null
}

export function activeCatalogueCountry(hqCountry: string | null) {
  return parseCatalogueHqCountryParam(hqCountry)
}
