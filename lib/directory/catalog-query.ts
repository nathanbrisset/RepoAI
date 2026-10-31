import { filterAndRankCatalogSearch } from "@/lib/catalog-search"
import { compareEditorialRank } from "@/lib/directory/editorial-rank"
import {
  matchesHqCountryFilter,
} from "@/lib/hq-country-filter"
import { PRICE_FILTERS, priceFilterParam, type PriceFilter } from "@/lib/price-filter"
import { directoryRecords, type DirectoryRecord } from "./data"
import type { Locale } from "@/lib/i18n/config"

export const CATALOGUE_PAGE_SIZE = 36

export type SortMode = "trending" | "new" | "top"

export type CatalogQueryInput = {
  category?: string
  q?: string
  sort?: SortMode
  pricing?: string | null
  hqCountry?: string | null
  page?: number
}

export type CatalogQueryResult = {
  items: DirectoryRecord[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

function sortRecords(records: DirectoryRecord[], sort: SortMode, locale: Locale) {
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

export function queryCatalogRecords(locale: Locale, input: CatalogQueryInput): CatalogQueryResult {
  const records = directoryRecords(locale)
  const category = input.category?.trim() || ""
  const queryRaw = (input.q || "").trim()
  const sort: SortMode = input.sort === "new" || input.sort === "top" ? input.sort : "trending"
  const activePrice =
    PRICE_FILTERS.find((filter) => priceFilterParam(filter) === input.pricing) || null
  const hqCountry = input.hqCountry

  const filtered = records.filter((tool) => {
    const matchesCategory = category ? tool.categories.includes(category) : true
    const matchesPrice = activePrice ? tool.priceBucket === activePrice : true
    const matchesCountry = matchesHqCountryFilter(tool.hqCountry, hqCountry)
    return matchesCategory && matchesPrice && matchesCountry
  })

  const searched = queryRaw
    ? filterAndRankCatalogSearch(filtered, queryRaw, locale)
    : sortRecords(filtered, sort, locale)

  const total = searched.length
  const pageSize = CATALOGUE_PAGE_SIZE
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(Math.max(1, input.page || 1), totalPages)
  const start = (page - 1) * pageSize

  return {
    items: searched.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages,
  }
}

export function queryCategoryRecords(
  locale: Locale,
  categoryId: string,
  pricingParam: string | null | undefined,
  page = 1,
): CatalogQueryResult {
  return queryCatalogRecords(locale, {
    category: categoryId,
    pricing: pricingParam,
    page,
  })
}

export function similarDirectoryRecords(
  locale: Locale,
  tool: DirectoryRecord,
  limit = 3,
): DirectoryRecord[] {
  const records = directoryRecords(locale)
  return records
    .filter(
      (item) =>
        item.id !== tool.id && item.categories.some((category) => tool.categories.includes(category)),
    )
    .slice(0, limit)
}

export function randomDirectoryRecord(locale: Locale): DirectoryRecord | null {
  const records = directoryRecords(locale)
  if (records.length === 0) return null
  return records[Math.floor(Math.random() * records.length)] ?? null
}

export function parseCatalogSearchParams(
  params: Record<string, string | string[] | undefined>,
): CatalogQueryInput {
  const read = (key: string) => {
    const value = params[key]
    return typeof value === "string" ? value : Array.isArray(value) ? value[0] : undefined
  }
  const pageRaw = Number.parseInt(read("page") || "1", 10)
  const sortRaw = read("sort")
  return {
    category: read("category"),
    q: read("q"),
    sort: sortRaw === "new" || sortRaw === "top" ? sortRaw : "trending",
    pricing: read("pricing") || null,
    hqCountry: read("hqCountry") || null,
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1,
  }
}

export type { PriceFilter }
