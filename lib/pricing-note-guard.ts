export type PricingNoteLang = "en" | "fr"

export type UncleanReason =
  | "empty"
  | "internal_note"
  | "non_eur_currency"
  | "wrong_language"
  | "meta_marker"

const INTERNAL_NOTE =
  /notes?\s+non\s+affichée|notes?\s*\(non\s+affichées\)|pas\s+inventé|not\s+invented|hidden\s+notes?|non[-\s]displayed|donc\s+non\s+affiché|not\s+converted\s+here|two\s+currencies|deux\s+devises|legal\s+entity|distinct\s+from|mention\s+officielle|official[-\s]currency\s+notes?|official\s+(price|pricing)\s+in|is\s+not\s+shown\s+here|recorded\s+only\s+in/i

const META_MARKER = /source:|verified|à\s+vérifier|\bTODO\b|\bTBD\b/i

export const NON_EUR_CURRENCY =
  /\$|\bUS\$\b|\bUSD\b|\bUS\s+dollars?\b|\bdollars?\b|£|\bGBP\b|₹|\bINR\b|roupies?|rupees?|\bCHF\b|¥|\bJPY\b|\bCAD\b|A\$|\bAUD\b/i

/** Mask URL, template, and env-var `$` before scanning visitor-facing copy. */
export function maskForCurrencyScan(text: string): string {
  return text
    .replace(/https?:\/\/[^\s)]+/gi, " ")
    .replace(/\$\{[^}]*\}/g, " ")
    .replace(/\$[A-Za-z_][A-Za-z0-9_]*/g, " ")
}

export function containsNonEurDisplayCurrency(text: string | undefined | null): boolean {
  if (text == null || !String(text).trim()) return false
  return NON_EUR_CURRENCY.test(maskForCurrencyScan(String(text)))
}

const EN_ALLOWED_PRODUCT_NAMES = [/\bLe Chat\b/g]

const FRENCH_IN_EN =
  /\b(le|la|les|des|pour|avec)\b|par\s+mois|\bgratuit\b/i

/** English phrasing in FR pricing notes (after tier masking). */
const ENGLISH_IN_FR =
  /\bthe\b|\bwith\b|\bper\s+month\b|\bfree\s+trial\b|\bbilled\s+annually\b|\bbilled\s+yearly\b|\b\w+\s+plan\s+billed\b|\bplan\s*:\s*\d/i

const TIER_NAMES =
  "Free|Pro|Plus|Starter|Team|Business|Enterprise|Hobby|Standard|Basic|Professional|Ultimate|Individual|Essentials|Creator|Scale|Startup|Lite|Max|Premium"

function maskAllowedProductNames(text: string): string {
  let masked = text
  for (const pattern of EN_ALLOWED_PRODUCT_NAMES) {
    masked = masked.replace(pattern, "AllowedProductName")
  }
  return masked
}

function stripUrlsForLanguageHeuristic(text: string): string {
  return text
    .replace(/https?:\/\/[^\s)]+/gi, " ")
    .replace(/\b[\w-]+\/[\w-]+(?:\/[\w-]+)*/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/** Case-sensitive: mask tier names only beside amounts or as plan labels (not « gratuits » etc.). */
export function maskTierNamesInFrenchPricing(text: string): string {
  let s = text
  const tier = TIER_NAMES
  s = s.replace(
    new RegExp(`\\b(${tier})\\b(?=[^€]{0,24}\\d{1,4}(?:[.,]\\d{1,2})?\\s*€)`, "g"),
    "AllowedTier",
  )
  s = s.replace(
    new RegExp(`\\b(?:formule|plan|offre|forfait|tier)\\s+(${tier})\\b`, "g"),
    "AllowedTier",
  )
  s = s.replace(
    new RegExp(`\\b(${tier})\\s+(?:à|at|:)\\s*`, "g"),
    "AllowedTier ",
  )
  s = s.replace(new RegExp(`\\b(${tier})\\s+à\\s+0\\s*€`, "g"), "AllowedTier à 0 €")
  return s
}

export function uncleanReasons(value: string | undefined | null, lang: PricingNoteLang): UncleanReason[] {
  if (value == null || !String(value).trim()) return ["empty"]

  const text = String(value)
  const reasons: UncleanReason[] = []

  if (INTERNAL_NOTE.test(text)) reasons.push("internal_note")
  if (META_MARKER.test(text)) reasons.push("meta_marker")

  if (containsNonEurDisplayCurrency(text)) reasons.push("non_eur_currency")

  const forLang = stripUrlsForLanguageHeuristic(text)
  if (lang === "en" && FRENCH_IN_EN.test(maskAllowedProductNames(forLang))) {
    reasons.push("wrong_language")
  }
  if (lang === "fr") {
    const masked = maskTierNamesInFrenchPricing(forLang)
    if (ENGLISH_IN_FR.test(masked)) reasons.push("wrong_language")
  }

  return [...new Set(reasons)]
}

export function isCleanPricingNote(value: string | undefined | null, lang: PricingNoteLang): boolean {
  return uncleanReasons(value, lang).length === 0
}

export function resolvePricingNote(
  note: string | undefined,
  details: string | undefined,
  lang: PricingNoteLang,
): string | undefined {
  const candidate = note ?? details
  if (candidate == null || !candidate.trim()) return undefined
  return isCleanPricingNote(candidate, lang) ? candidate.trim() : undefined
}

export function resolvePricingNoteFromCandidates(
  candidates: (string | undefined)[],
  lang: PricingNoteLang,
): string | undefined {
  const picked = candidates.find((value) => value != null && value.trim())
  if (!picked) return undefined
  return isCleanPricingNote(picked, lang) ? picked : undefined
}

export type PricingAuditEntry = {
  id: string
  field: string
  lang: PricingNoteLang
  value: string
  reasons: UncleanReason[]
}