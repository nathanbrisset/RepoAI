import type { Tool } from "@/lib/types"

/** Slim catalogue row for the directory UI. Official URL only — never an affiliate link. */
export type DirectoryTool = {
  id: string
  name: string
  tagline: string
  description: string
  url: string
  logo?: string
  categories: string[]
  tags: string[]
  pricingLabel?: string
  pricingModel?: string
  pricingDetails?: string
  uncertain?: boolean
  features: string[]
  dateAdded: string
  lastVerified?: string
}

const NEW_WINDOW_MS = 14 * 86_400_000

export function toDirectoryTool(tool: Tool): DirectoryTool {
  const long = (tool.longDescription || "").replace(/\s+/g, " ").trim()
  const description = long.length > 420 ? `${long.slice(0, 417).trimEnd()}…` : long
  return {
    id: tool.id,
    name: tool.name,
    tagline: tool.description,
    description,
    url: tool.url,
    logo: tool.logo || undefined,
    categories: tool.categories || [],
    tags: (tool.tags || []).slice(0, 8),
    pricingLabel: tool.pricing?.uncertain ? undefined : tool.pricing?.label || (typeof tool.isPremium === "string" ? tool.isPremium : undefined),
    pricingModel: tool.pricing?.uncertain ? undefined : tool.pricing?.model,
    pricingDetails: tool.pricing?.uncertain ? undefined : tool.pricing?.details,
    uncertain: tool.pricing?.uncertain === true,
    features: (tool.features || []).slice(0, 6).map((feature) => (feature.length > 160 ? `${feature.slice(0, 157).trimEnd()}…` : feature)),
    dateAdded: tool.dateAdded || "",
    lastVerified: tool.lastVerified || undefined,
  }
}

/** Honest "new" window: added within the last 14 days. No invented vote counts. */
export function isRecentlyAdded(dateAdded: string, now = Date.now()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateAdded)) return false
  const added = Date.parse(`${dateAdded}T00:00:00Z`)
  if (Number.isNaN(added)) return false
  const age = now - added
  return age >= 0 && age <= NEW_WINDOW_MS
}

export function formatCatalogDay(value: string | undefined, locale: "en" | "fr") {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return ""
  const [year, month, day] = value.split("-").map(Number)
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
