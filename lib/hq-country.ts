import type { Locale } from "@/lib/i18n/config"

export const HQ_COUNTRY_SOURCE = ["verified", "import", "inferred"] as const
export type HqCountrySource = (typeof HQ_COUNTRY_SOURCE)[number]

const ISO2 = /^[A-Z]{2}$/

export function isValidHqCountry(code: string | undefined | null): code is string {
  return Boolean(code && ISO2.test(code))
}

/** Regional indicator symbol letters → flag emoji (e.g. FR → 🇫🇷). */
export function flagEmoji(iso2: string): string {
  const code = iso2.toUpperCase()
  if (!ISO2.test(code)) return ""
  return String.fromCodePoint(...[...code].map((char) => 0x1f1e6 - 65 + char.charCodeAt(0)))
}

const displayEn = new Intl.DisplayNames(["en"], { type: "region" })
const displayFr = new Intl.DisplayNames(["fr"], { type: "region" })

export function hqCountryDisplayName(iso2: string, locale: Locale): string {
  const code = iso2.toUpperCase()
  if (!ISO2.test(code)) return code
  try {
    return (locale === "fr" ? displayFr : displayEn).of(code) || code
  } catch {
    return code
  }
}
