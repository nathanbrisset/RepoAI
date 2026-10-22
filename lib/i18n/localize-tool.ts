import type { Tool } from "@/lib/types"
import type { Locale } from "./config"
import { pricingLabel } from "./messages"
import { translateTags } from "./tags"

export function formatCatalogDate(value: string | null | undefined, locale: Locale) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")
}

/** Swap in French fiche fields when they exist. English copy stays otherwise. */
export function localizeTool(tool: Tool, locale: Locale): Tool {
  if (locale !== "fr" || !tool) return tool
  const summary = tool.summary_fr || tool.shortDescription_fr
  return {
    ...tool,
    description: summary || tool.description,
    longDescription: tool.description_fr || tool.longDescription,
    tags: translateTags(tool.tags, tool.tags_fr),
    features: tool.features_fr?.length ? tool.features_fr : tool.features,
    howToUse: tool.howToUse_fr?.length ? tool.howToUse_fr : tool.howToUse,
    statusNote: tool.statusNote_fr || tool.statusNote,
    dateAddedNote: tool.dateAddedNote_fr || tool.dateAddedNote,
    pricing: tool.pricing
      ? {
          ...tool.pricing,
          label: pricingLabel(locale, tool.pricing.label || tool.isPremium),
          details: tool.pricingNote_fr || tool.pricing.details,
        }
      : tool.pricing,
  }
}

export function useLocalizedCopy(tool: Tool, locale: Locale) {
  return localizeTool(tool, locale)
}
