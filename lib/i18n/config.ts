export const LOCALES = ["en", "fr"] as const

export type Locale = (typeof LOCALES)[number]

export const defaultLocale: Locale = "en"

export const LOCALE_COOKIE = "locale"

export const SITE_URL = "https://www.aitools.ninja"

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "fr"
}
