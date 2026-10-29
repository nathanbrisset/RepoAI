/** Catalogue / filter param for UK tools (data may use GB or UK). */
export const HQ_UK_FILTER = "GB" as const

const ISO2 = /^[A-Z]{2}$/

export function normalizeHqCountry(code: string | undefined | null): string | undefined {
  if (!code) return undefined
  const upper = code.toUpperCase()
  if (upper === "UK") return "GB"
  return ISO2.test(upper) ? upper : undefined
}

/** Match a tool hqCountry against a catalogue query value (e.g. FR, GB, US). */
export function matchesHqCountryFilter(
  toolCountry: string | undefined,
  filterParam: string | null | undefined,
): boolean {
  if (!filterParam) return true
  const filter = filterParam.toUpperCase()
  const tool = toolCountry?.toUpperCase()
  if (!tool) return false
  if (filter === HQ_UK_FILTER || filter === "UK") {
    return tool === "GB" || tool === "UK"
  }
  return tool === filter
}

export type SwipeCountry = "FR" | "UK" | "US" | "ES" | "DE"

export const CATALOGUE_HQ_COUNTRIES: readonly SwipeCountry[] = ["FR", "UK", "US", "ES", "DE"]

/** Catalogue chip selection → `?hqCountry=` (UK uses GB for consistency with home CTAs). */
export function catalogueHqCountryParam(country: SwipeCountry): string {
  return country === "UK" ? HQ_UK_FILTER : country
}

/** Parse `?hqCountry=` into the active catalogue chip (GB|UK → UK). */
export function parseCatalogueHqCountryParam(param: string | null | undefined): SwipeCountry | null {
  if (!param) return null
  const upper = param.toUpperCase()
  if (upper === "GB" || upper === "UK") return "UK"
  if ((CATALOGUE_HQ_COUNTRIES as readonly string[]).includes(upper)) return upper as SwipeCountry
  return null
}

export function matchesSwipeCountry(toolCountry: string | undefined, country: SwipeCountry): boolean {
  if (country === "UK") {
    const tool = toolCountry?.toUpperCase()
    return tool === "GB" || tool === "UK"
  }
  return toolCountry?.toUpperCase() === country
}
