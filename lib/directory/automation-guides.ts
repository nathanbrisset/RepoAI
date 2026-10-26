import guidesFile from "@/content/automations/guides.json"
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
  priceFrom: string
  worksWith: Localized
  openSource: boolean
  selfHost: boolean
  onPrem: boolean
  use: Localized
  why: Localized
  how: Localized
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
  priceFrom: string
  worksWith: string
  openSource: boolean
  selfHost: boolean
  onPrem: boolean
  use: string
  why: string
  how: string
  pinned: boolean
}

const PIN_ORDER = ["n8n", "zapier", "make"]

function pick(value: Localized, locale: Locale) {
  return value[locale] || value.en
}

export function automationCards(locale: Locale): AutomationCard[] {
  const pinRank = new Map(PIN_ORDER.map((id, index) => [id, index]))
  const cards = (guidesFile.tools as AutomationGuide[]).map((tool) => ({
    id: tool.id,
    name: tool.name,
    url: tool.url,
    logo: tool.logo,
    subcategoryId: tool.subcategory.en,
    subcategory: pick(tool.subcategory, locale),
    pitch: pick(tool.pitch, locale),
    audience: pick(tool.audience, locale),
    pricingBadge: pricingLabel(locale, tool.pricingBadge),
    priceFrom: tool.priceFrom,
    worksWith: pick(tool.worksWith, locale),
    openSource: tool.openSource,
    selfHost: tool.selfHost,
    onPrem: tool.onPrem && !tool.selfHost,
    use: pick(tool.use, locale),
    why: pick(tool.why, locale),
    how: pick(tool.how, locale),
    pinned: PIN_ORDER.includes(tool.id),
  }))
  return cards.sort((a, b) => (pinRank.get(a.id) ?? 100) - (pinRank.get(b.id) ?? 100))
}
