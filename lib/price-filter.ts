import type { Tool } from "./types"

/** The four price filters shown on /tools. Stored fiche labels stay unchanged. */
export const PRICE_FILTERS = ["Free", "Freemium", "Premium", "Usage-based"] as const

export type PriceFilter = (typeof PRICE_FILTERS)[number]

/** Stable English query values, shared by /tools and /fr/tools. */
const PRICE_FILTER_PARAMS: Record<PriceFilter, string> = {
  Free: "free",
  Freemium: "freemium",
  Premium: "premium",
  "Usage-based": "usage-based",
}

const PARAM_TO_FILTER = Object.fromEntries(
  PRICE_FILTERS.map((label) => [PRICE_FILTER_PARAMS[label], label]),
) as Record<string, PriceFilter>

export const PRICE_FILTER_OPTIONS: { label: PriceFilter; className: string }[] = [
  { label: "Free", className: "border-border bg-card text-foreground" },
  { label: "Freemium", className: "border-border bg-card text-foreground" },
  { label: "Premium", className: "border-border bg-card text-foreground" },
  { label: "Usage-based", className: "border-border bg-card text-foreground" },
]

export function priceFilterParam(filter: PriceFilter): string {
  return PRICE_FILTER_PARAMS[filter]
}

/** Unknown values are ignored so a bad query does not select a filter. */
export function priceFilterFromParam(value: string | null | undefined): PriceFilter | null {
  if (!value) return null
  return PARAM_TO_FILTER[value] ?? null
}

const PAID_HOSTING_BOILERPLATE = /paid hosting were not rechecked/gi
const CONCRETE_PRICE = /(?:[$€£]\s?\d|\d+(?:[.,]\d+)?\s?(?:USD|EUR|GBP|\$|€|£))/i

function noteHasConcretePrice(tool: Tool): boolean {
  const note = `${tool.pricing?.details || ""} ${tool.pricingNote_fr || ""}`.replace(PAID_HOSTING_BOILERPLATE, "")
  return CONCRETE_PRICE.test(note)
}

/**
 * Bucket used only by the price filters.
 * Enterprise and one-time fold into Premium.
 * Open source folds into Free unless the fiche states a paid price
 * (a paid model, or a concrete amount in the price note).
 * Uncertain prices stay out of every filter.
 */
export function priceFilterBucket(tool: Tool): PriceFilter | null {
  if (tool.pricing?.uncertain || !tool.isPremium) return null

  const label = tool.isPremium
  const model = tool.pricing?.model

  if (label === "Open source" || model === "open-source") {
    if (model === "freemium" || label === "Freemium") return "Freemium"
    if (model === "usage-based" || label === "Usage-based") return "Usage-based"
    if (
      model === "paid" ||
      model === "enterprise" ||
      model === "one-time" ||
      label === "Premium" ||
      label === "Enterprise" ||
      label === "One-time" ||
      noteHasConcretePrice(tool)
    ) {
      return "Premium"
    }
    return "Free"
  }

  if (label === "Enterprise" || label === "One-time" || model === "enterprise" || model === "one-time") {
    return "Premium"
  }

  if (label === "Free" || label === "Freemium" || label === "Premium" || label === "Usage-based") {
    return label
  }

  return null
}

export function matchesPriceFilter(tool: Tool, filter: PriceFilter | null): boolean {
  if (!filter) return true
  return priceFilterBucket(tool) === filter
}
