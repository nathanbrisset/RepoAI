import type { Locale } from "./i18n/config"
import { categoryLabel, foldMatchText, searchTokens, textIncludesToken, tokenMatchVariants } from "./match-copy"

export type CatalogSearchFields = {
  id: string
  name: string
  description: string
  categories: string[]
  tags?: string[]
  features?: string[]
}

function categoryLabels(locale: Locale, categories: string[]): string[] {
  return categories.map((id) => categoryLabel(locale, id))
}

export function catalogSearchHaystack(record: CatalogSearchFields, locale: Locale): string {
  const labels = categoryLabels(locale, record.categories)
  return foldMatchText(
    [record.name, record.description, ...(record.tags || []), ...labels, ...(record.features || [])].join(" "),
  )
}

export function scoreCatalogSearch(record: CatalogSearchFields, query: string, locale: Locale): number {
  const tokens = searchTokens(query)
  if (tokens.length === 0) return 0

  const name = foldMatchText(record.name)
  const description = foldMatchText(record.description)
  const tags = (record.tags || []).map((tag) => foldMatchText(tag))
  const categories = categoryLabels(locale, record.categories).map((label) => foldMatchText(label))
  const categoryIds = record.categories.map((id) => foldMatchText(id.replace(/-/g, " ")))
  const features = foldMatchText((record.features || []).join(" "))

  let score = 0
  for (const token of tokens) {
    const variants = tokenMatchVariants(token)
    if (variants.some((variant) => name === variant)) score += 14
    else if (variants.some((variant) => textIncludesToken(record.name, variant))) score += 9
    if (variants.some((variant) => tags.some((tag) => tag.includes(variant)))) score += 6
    if (
      variants.some(
        (variant) =>
          categories.some((label) => label.includes(variant)) ||
          categoryIds.some((label) => label.includes(variant)),
      )
    ) {
      score += 5
    }
    if (variants.some((variant) => description.includes(variant))) score += 3
    if (variants.some((variant) => features.includes(variant))) score += 2
  }
  return score
}

export function rankCatalogSearch<T extends CatalogSearchFields>(
  records: T[],
  query: string,
  locale: Locale,
): { record: T; score: number }[] {
  const trimmed = query.trim()
  if (!trimmed) return records.map((record) => ({ record, score: 0 }))
  const rows = records
    .map((record) => ({ record, score: scoreCatalogSearch(record, trimmed, locale) }))
    .filter((row) => row.score > 0)
  rows.sort(
    (a, b) =>
      b.score - a.score ||
      a.record.name.localeCompare(b.record.name, locale) ||
      a.record.id.localeCompare(b.record.id),
  )
  return rows
}

export function filterAndRankCatalogSearch<T extends CatalogSearchFields>(
  records: T[],
  query: string,
  locale: Locale,
): T[] {
  const trimmed = query.trim()
  if (!trimmed) return records
  return rankCatalogSearch(records, trimmed, locale).map((row) => row.record)
}
