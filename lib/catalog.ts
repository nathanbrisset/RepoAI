import { catalogTools } from "@/content/tools/index"
import { frenchToolsById } from "@/lib/i18n/french-catalog"
import { resolveCatalogLogo } from "@/lib/logo-url"
import type { CatalogTool } from "./tool-schema"
import type { Tool } from "./types"

export type { CatalogTool }

function frenchText(inline: string | undefined, overlay: string | undefined) {
  return inline || overlay
}

/** Runtime shape the pages already expect, plus the fields stored in JSON. */
function pricingType(model: CatalogTool["pricing"]["model"]) {
  if (model === "freemium") return "freemium" as const
  if (model === "free" || model === "open-source" || !model) return "free" as const
  return "paid" as const
}

export function toRuntimeTool(entry: CatalogTool): Tool {
  const overlay = frenchToolsById[entry.id]
  const uncertain = entry.pricing.uncertain === true
  return {
    id: entry.id,
    name: entry.name,
    description: entry.summary,
    longDescription: entry.description,
    url: entry.url,
    image: entry.image,
    logo: resolveCatalogLogo(entry.logo),
    categories: entry.categories,
    tags: entry.tags,
    summary_fr: frenchText(entry.summary_fr || entry.shortDescription_fr, overlay?.summary_fr || overlay?.shortDescription_fr),
    shortDescription_fr: frenchText(entry.shortDescription_fr, overlay?.shortDescription_fr),
    description_fr: frenchText(entry.description_fr, overlay?.description_fr),
    tags_fr: entry.tags_fr || overlay?.tags_fr,
    features_fr: entry.features_fr || overlay?.features_fr,
    howToUse_fr: entry.howToUse_fr || overlay?.howToUse_fr,
    statusNote_fr: frenchText(entry.statusNote_fr, overlay?.statusNote_fr),
    dateAddedNote_fr: frenchText(entry.dateAddedNote_fr, overlay?.dateAddedNote_fr),
    pricingNote_fr: frenchText(entry.pricing.note_fr, overlay?.pricingNote_fr),
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
    hqCountry: entry.hqCountry,
    hqCountrySource: entry.hqCountrySource,
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
