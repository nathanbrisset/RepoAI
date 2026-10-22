import { catalogTools } from "@/content/tools/index"
import type { CatalogTool } from "./tool-schema"
import type { Tool } from "./types"

export type { CatalogTool }

/** Runtime shape the pages already expect, plus the fields stored in JSON. */
export function toRuntimeTool(entry: CatalogTool): Tool {
  return {
    id: entry.id,
    name: entry.name,
    description: entry.summary,
    longDescription: entry.description,
    url: entry.url,
    image: entry.image,
    logo: entry.logo,
    categories: entry.categories,
    tags: entry.tags,
    dateAdded: entry.dateAdded ?? "",
    dateAddedNote: entry.dateAddedNote,
    isPremium: entry.pricing.label,
    pricing: {
      type: entry.pricing.model === "paid" ? "paid" : entry.pricing.model === "freemium" ? "freemium" : "free",
      model: entry.pricing.model,
      label: entry.pricing.label,
      details: entry.pricing.note,
      verified: entry.pricing.verified,
      sourceUrl: entry.pricing.sourceUrl,
    },
    features: entry.features,
    howToUse: entry.howToUse,
    status: entry.status,
    successorId: entry.successorId,
    statusNote: entry.statusNote,
    lastVerified: entry.lastVerified,
    sources: entry.sources?.filter((source) => source !== entry.affiliateUrl),
  } as Tool
}

export const allTools: Tool[] = catalogTools.map(toRuntimeTool)

/** Cards, related fiches, search, and categories omit closed, renamed, and duplicate pages. /tool/{id} still resolves for sunset pages. Renamed ids 308 from next.config. */
export const listedTools: Tool[] = allTools.filter(
  (tool) => tool.status !== "duplicate-of" && tool.status !== "sunset" && tool.status !== "renamed",
)

export function getToolById(id: string) {
  return allTools.find((tool) => tool.id === id) || null
}
