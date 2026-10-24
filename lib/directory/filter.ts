import { categoryCopy } from "@/lib/i18n/messages"
import type { Locale } from "@/lib/i18n/config"
import { DOJO_PICKS } from "./picks"
import type { DirectoryTool } from "./tools"

export type SortMode = "trending" | "new" | "top"

export function toolMatches(tool: DirectoryTool, query: string, locale: Locale) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const fields = [
    tool.name,
    tool.tagline,
    tool.description,
    ...tool.tags,
    ...tool.categories,
    ...tool.categories.map((id) => categoryCopy(locale, id)?.name || ""),
  ]
  return fields.some((field) => field.toLowerCase().includes(q))
}

export function sortTools(tools: DirectoryTool[], sort: SortMode) {
  return [...tools].sort((a, b) => {
    if (sort === "new") return (b.dateAdded || "").localeCompare(a.dateAdded || "") || a.name.localeCompare(b.name)
    if (sort === "top") return b.features.length - a.features.length || a.name.localeCompare(b.name)
    const aKey = a.lastVerified || a.dateAdded || ""
    const bKey = b.lastVerified || b.dateAdded || ""
    return bKey.localeCompare(aKey) || a.name.localeCompare(b.name)
  })
}

export function searchedTools(tools: DirectoryTool[], query: string, locale: Locale) {
  return query.trim() ? tools.filter((tool) => toolMatches(tool, query, locale)) : tools
}

export function wallTools(
  tools: DirectoryTool[],
  options: { query: string; category: string; sort: SortMode; collectionId: string | null; locale: Locale },
) {
  if (options.collectionId) {
    const pick = DOJO_PICKS.find((item) => item.id === options.collectionId)
    if (!pick) return []
    const byId = new Map(tools.map((tool) => [tool.id, tool]))
    return pick.slugs.map((id) => byId.get(id)).filter((tool): tool is DirectoryTool => Boolean(tool))
  }
  const searched = searchedTools(tools, options.query, options.locale)
  const filtered = options.category === "all" ? searched : searched.filter((tool) => tool.categories.includes(options.category))
  return sortTools(filtered, options.sort)
}
