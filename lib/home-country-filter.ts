import type { Locale } from "@/lib/i18n/config"
import { HQ_UK_FILTER } from "@/lib/hq-country-filter"

/** ISO-2 used in catalogue `?hqCountry=` for this locale's home section CTA. */
export function homeCountryCatalogueFilter(locale: Locale): string {
  return locale === "fr" ? "FR" : HQ_UK_FILTER
}