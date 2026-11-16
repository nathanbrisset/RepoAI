import { filterAndRankCatalogSearch } from "@/lib/catalog-search"
import { compareEditorialRank } from "@/lib/directory/editorial-rank"
import type { CatalogQueryInput, CatalogQueryResult } from "@/lib/directory/catalog-query-types"
import type { CatalogSearchIndexEntry } from "@/lib/directory/catalog-index-types"
import type { DirectoryRecord } from "@/lib/directory/data"
import { CATALOGUE_PAGE_SIZE } from "@/lib/directory/listing-query-params"
import type { Locale } from "@/lib/i18n/config"
import { matchesHqCountryFilter } from "@/lib/hq-country-filter"
import { PRICE_FILTERS, priceFilterParam } from "@/lib/price-filter"
import type { SortMode } from "@/lib/directory/listing-query-params"

export function indexEntryToRecord(entry: CatalogSearchIndexEntry): DirectoryRecord {
  return {
    id: entry.id,
    name: entry.name,
    description: entry.summary,
    categories: entry.categories,
    tags: [],
    features: [],
    url: "",
    logo: entry.logo,
    image: "",
    dateAdded: entry.dateAdded,
    lastVerified: null,
    pricingUncertain: entry.pricingUncertain,
    pricingLabel: entry.pricingLabel,
    pricingModel: entry.pricingModel,
    priceBucket: entry.priceBucket,
    hqCountry: entry.hqCountry,
  }
}

function sortIndexRecords(records: CatalogSearchIndexEntry[], sort: SortMode, locale: Locale) {
  if (sort === "new") {
    return [...records].sort(
      (a, b) => (b.dateAdded || "").localeCompare(a.dateAdded || "") || compareEditorialRank(a.id, b.id),
    )
  }
  if (sort === "top") {
    return [...records].sort(
      (a, b) =>
        compareEditorialRank(a.id, b.id) ||
        a.name.localeCompare(b.name, locale) ||
        a.id.localeCompare(b.id),
    )
  }
  return [...records].sort(
    (a, b) =>
      compareEditorialRank(a.id, b.id) ||
      (b.dateAdded || "").localeCompare(a.dateAdded || "") ||
      a.name.localeCompare(b.name, locale),
  )
}

export function queryCatalogFromIndex(
  locale: Locale,
  index: CatalogSearchIndexEntry[],
  input: CatalogQueryInput,
): CatalogQueryResult {
  const category = input.category?.trim() || ""
  const queryRaw = (input.q || "").trim()
  const sort: SortMode = input.sort === "new" || input.sort === "top" ? input.sort : "trending"
  const activePrice =
    PRICE_FILTERS.find((filter) => priceFilterParam(filter) === input.pricing) || null
  const hqCountry = input.hqCountry

  const filtered = index.filter((tool) => {
    const matchesCategory = category ? tool.categories.includes(category) : true
    const matchesPrice = activePrice ? tool.priceBucket === activePrice : true
    const matchesCountry = matchesHqCountryFilter(tool.hqCountry, hqCountry)
    return matchesCategory && matchesPrice && matchesCountry
  })

  const searchRows = filtered.map((entry) => ({ ...entry, description: entry.summary }))
  const searched = queryRaw
    ? filterAndRankCatalogSearch(searchRows, queryRaw, locale)
    : sortIndexRecords(filtered, sort, locale)

  const total = searched.length
  const pageSize = CATALOGUE_PAGE_SIZE
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(Math.max(1, input.page || 1), totalPages)
  const start = (page - 1) * pageSize

  return {
    items: searched.slice(start, start + pageSize).map(indexEntryToRecord),
    total,
    page,
    pageSize,
    totalPages,
  }
}