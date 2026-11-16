import type { SortMode } from "@/lib/directory/listing-query-params"
import type { DirectoryRecord } from "@/lib/directory/data"

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