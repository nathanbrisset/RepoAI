import { catalogTools } from "@/content/tools/index"
import type { CatalogTool } from "./tool-schema"
import type { Tool } from "./types"

export type { CatalogTool }

/** Runtime shape the pages already expect, plus the fields stored in JSON. */
function pricingType(model: CatalogTool["pricing"]["model"]) {
  if (model === "freemium") return "freemium" as const
  if (model === "free" || model === "open-source" || !model) return "free" as const
  return "paid" as const
}

export function toRuntimeTool(entry: CatalogTool): Tool {
  const uncertain = entry.pricing.uncertain === true
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
    isPremium: uncertain ? undefined : entry.pricing.label,
    pricing: {
      type: pricingType(entry.pricing.model),
      model: entry.pricing.model,
      label: uncertain ? undefined : entry.pricing.label,
      details: uncertain ? undefined : entry.pricing.note,
      verified: entry.pricing.verified,
      sourceUrl: entry.pricing.sourceUrl,
      uncertain,
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

/** Cards, related fiches, search, and categories omit closed, renamed, inactive, and duplicate pages. /tool/{id} still resolves. Renamed ids 308 from next.config. */
export const listedTools: Tool[] = allTools.filter(
  (tool) => tool.status !== "duplicate-of" && tool.status !== "sunset" && tool.status !== "renamed" && tool.status !== "inactive",
)

export function getToolById(id: string) {
  return allTools.find((tool) => tool.id === id) || null
}
