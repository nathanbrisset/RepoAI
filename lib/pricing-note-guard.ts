export type PricingNoteLang = "en" | "fr"

export type UncleanReason =
  | "empty"
  | "internal_note"
  | "non_eur_currency"
  | "wrong_language"
  | "meta_marker"

const INTERNAL_NOTE =
  /notes?\s+non\s+affichée|pas\s+inventé|not\s+invented|hidden\s+notes?|non\s+displayed|two\s+currencies|deux\s+devises|legal\s+entity|distinct\s+from|mention\s+officielle|official\s+(price|pricing)\s+in/i

const META_MARKER = /source:|verified|à\s+vérifier|\bTODO\b|\bTBD\b/i

const NON_EUR_CURRENCY = /\$|\bUSD\b|£|\bGBP\b|₹|\bINR\b|roupies?|rupees?/i

/** Product name exceptions before the EN French-heuristic runs (e.g. Mistral "Le Chat"). */
const EN_ALLOWED_PRODUCT_NAMES = [/\bLe Chat\b/g]

const FRENCH_IN_EN =
  /\b(le|la|les|des|pour|avec)\b|par\s+mois|\bgratuit\b/i

function maskAllowedProductNames(text: string): string {
  let masked = text
  for (const pattern of EN_ALLOWED_PRODUCT_NAMES) {
    masked = masked.replace(pattern, "AllowedProductName")
  }
  return masked
}

const ENGLISH_IN_FR =
  /\bthe\b|\bwith\b|per\s+month|\bfree\b/i

export function uncleanReasons(value: string | undefined | null, lang: PricingNoteLang): UncleanReason[] {
  if (value == null || !String(value).trim()) return ["empty"]

  const text = String(value)
  const reasons: UncleanReason[] = []

  if (INTERNAL_NOTE.test(text)) reasons.push("internal_note")
  if (META_MARKER.test(text)) reasons.push("meta_marker")

  if (NON_EUR_CURRENCY.test(text)) reasons.push("non_eur_currency")

  if (lang === "en" && FRENCH_IN_EN.test(maskAllowedProductNames(text))) reasons.push("wrong_language")
  if (lang === "fr" && ENGLISH_IN_FR.test(text)) reasons.push("wrong_language")

  return [...new Set(reasons)]
}

export function isCleanPricingNote(value: string | undefined | null, lang: PricingNoteLang): boolean {
  return uncleanReasons(value, lang).length === 0
}

/** Prefer `note`, then `details`; return displayed text only when clean. */
export function resolvePricingNote(
  note: string | undefined,
  details: string | undefined,
  lang: PricingNoteLang,
): string | undefined {
  const candidate = note ?? details
  if (candidate == null || !candidate.trim()) return undefined
  return isCleanPricingNote(candidate, lang) ? candidate : undefined
}

/** First non-empty candidate; hidden when it fails the guard (no fallback). */
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