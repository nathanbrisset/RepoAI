import guidesFile from "@/content/automations/guides.json"
import { formatDisplayPrice } from "@/lib/format-display-price"
import type { Locale } from "@/lib/i18n/config"
import { pricingLabel } from "@/lib/i18n/messages"

type Localized = { en: string; fr: string }

export type AutomationGuide = {
  id: string
  name: string
  url: string
  logo: string
  subcategory: Localized
  pitch: Localized
  audience: Localized
  pricingBadge: string
  price: Localized
  priceRank: number | null
  freeOffer: boolean
  worksWith: Localized
  openSource: boolean
  selfHost: boolean
  onPrem: boolean
  use: Localized
  why: Localized
  how: Localized
  bestFor: Localized
  dateAdded: string
  pinned: boolean
}

export type AutomationCard = {
  id: string
  name: string
  url: string
  logo: string
  subcategoryId: string
  subcategory: string
  pitch: string
  audience: string
  pricingBadge: string
  price: string
  priceRank: number | null
  freeOffer: boolean
  worksWith: string
  openSource: boolean
  selfHost: boolean
  onPrem: boolean
  use: string
  why: string
  how: string
  bestFor: string
  dateAdded: string
  order: number
  pinned: boolean
}

const PIN_ORDER = ["n8n", "zapier", "make"]

function pick(value: Localized | undefined, locale: Locale) {
  if (!value) return ""
  return formatDisplayPrice(value[locale] || value.en)
}

export function automationCards(locale: Locale): AutomationCard[] {
  return (guidesFile.tools as AutomationGuide[]).map((tool, order) => ({
    id: tool.id,
    name: tool.name,
    url: tool.url,
    logo: tool.logo,
    subcategoryId: tool.subcategory.en,
    subcategory: pick(tool.subcategory, locale),
    pitch: pick(tool.pitch, locale),
    audience: pick(tool.audience, locale),
    pricingBadge: pricingLabel(locale, tool.pricingBadge),
    price: pick(tool.price, locale),
    priceRank: tool.priceRank,
    freeOffer: tool.freeOffer,
    worksWith: pick(tool.worksWith, locale),
    openSource: tool.openSource,
    selfHost: tool.selfHost,
    onPrem: tool.onPrem,
    use: pick(tool.use, locale),
    why: pick(tool.why, locale),
    how: pick(tool.how, locale),
    bestFor: pick(tool.bestFor, locale),
    dateAdded: tool.dateAdded || "",
    order,
    pinned: PIN_ORDER.includes(tool.id),
  }))
}
