import { listedTools } from "@/lib/catalog"
import { categoryCatalog } from "@/lib/category-meta"
import type { Locale } from "@/lib/i18n/config"
import { categoryCopy } from "@/lib/i18n/messages"
import { toolForLocale } from "@/lib/i18n/localize-tool"
import { priceFilterBucket, type PriceFilter } from "@/lib/price-filter"
import type { Tool } from "@/lib/types"
import { COLLECTION_DEFS, DOOR_ART, DOOR_IDS, FEATURED_STACK_IDS, RECIPE_DEFS } from "./collections"

export type DirectoryRecord = {
  id: string
  name: string
  description: string
  categories: string[]
  tags: string[]
  features: string[]
  url: string
  logo: string
  image: string
  dateAdded: string
  lastVerified: string | null
  pricingLabel?: string
  pricingUncertain: boolean
  pricingNote?: string
  pricingModel?: string
  priceBucket: PriceFilter | null
}

export type DirectoryChip = {
  id: string
  label: string
  count: number
}

export type DirectoryDoor = DirectoryChip & { art: string }

export type ResolvedCollection = {
  slug: string
  title: string
  blurb: string
  tools: DirectoryRecord[]
}

const recordCache = new Map<Locale, DirectoryRecord[]>()

function toRecord(tool: Tool, locale: Locale): DirectoryRecord {
  const localized = toolForLocale(tool, locale)
  const uncertain = tool.pricing?.uncertain === true || !tool.isPremium
  return {
    id: tool.id,
    name: localized.name,
    description: localized.description,
    categories: tool.categories,
    tags: (localized.tags || []).slice(0, 8),
    features: (localized.features || []).slice(0, 6),
    url: tool.url || "",
    logo: tool.logo || "",
    image: tool.image || "",
    dateAdded: tool.dateAdded || "",
    lastVerified: tool.lastVerified ?? null,
    pricingLabel: uncertain ? undefined : localized.pricing?.label || tool.isPremium,
    pricingUncertain: uncertain,
    pricingNote: uncertain ? undefined : localized.pricing?.details,
    pricingModel: tool.pricing?.model,
    priceBucket: priceFilterBucket(tool),
  }
}

export function directoryRecords(locale: Locale): DirectoryRecord[] {
  const cached = recordCache.get(locale)
  if (cached) return cached
  const records = listedTools.map((tool) => toRecord(tool, locale))
  recordCache.set(locale, records)
  return records
}

export function directoryChips(locale: Locale): DirectoryChip[] {
  const records = directoryRecords(locale)
  return categoryCatalog.map((category) => ({
    id: category.id,
    label: categoryCopy(locale, category.id)?.name || category.name,
    count: records.filter((tool) => tool.categories.includes(category.id)).length,
  }))
}

export function directoryDoors(locale: Locale): DirectoryDoor[] {
  const byId = new Map(directoryChips(locale).map((chip) => [chip.id, chip]))
  return DOOR_IDS.map((id) => {
    const chip = byId.get(id)
    return {
      id,
      label: chip?.label || id,
      count: chip?.count || 0,
      art: DOOR_ART[id],
    }
  })
}

/** Deterministic Fisher–Yates so a UTC day always draws the same eight tools. */
export function dailyPickIds(ids: string[], count = 8, now = new Date()) {
  const key = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  let seed = key >>> 0
  const bag = [...ids]
  for (let i = bag.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    const j = seed % (i + 1)
    const swap = bag[i]
    bag[i] = bag[j]
    bag[j] = swap
  }
  return bag.slice(0, count)
}

export function dailyPicks(locale: Locale, count = 8, now = new Date()) {
  const records = directoryRecords(locale)
  const byId = new Map(records.map((record) => [record.id, record]))
  return dailyPickIds(records.map((record) => record.id), count, now)
    .map((id) => byId.get(id))
    .filter((record): record is DirectoryRecord => Boolean(record))
}

export type ResolvedRecipe = {
  id: string
  title: string
  intent: string
  steps: { id: string; label: string; logo: string }[]
}

export function resolvedRecipes(locale: Locale): ResolvedRecipe[] {
  const records = directoryRecords(locale)
  const byId = new Map(records.map((record) => [record.id, record]))
  return RECIPE_DEFS.map((recipe) => ({
    id: recipe.id,
    title: recipe.title[locale],
    intent: recipe.intent[locale],
    steps: recipe.steps
      .filter((step) => byId.has(step.id))
      .map((step) => ({ id: step.id, label: step.label[locale], logo: byId.get(step.id)?.logo || "" })),
  })).filter((recipe) => recipe.steps.length > 0)
}

export function resolvedCollections(locale: Locale): ResolvedCollection[] {
  const byId = new Map(directoryRecords(locale).map((record) => [record.id, record]))
  return COLLECTION_DEFS.map((definition) => ({
    slug: definition.slug,
    title: definition.title[locale],
    blurb: definition.blurb[locale],
    tools: definition.ids
      .map((id) => byId.get(id))
      .filter((record): record is DirectoryRecord => Boolean(record)),
  })).filter((collection) => collection.tools.length > 0)
}

export function featuredStack(locale: Locale) {
  const byId = new Map(directoryRecords(locale).map((record) => [record.id, record]))
  return FEATURED_STACK_IDS.map((id) => byId.get(id)).filter((record): record is DirectoryRecord => Boolean(record))
}

export function categoryCount() {
  return categoryCatalog.length
}
