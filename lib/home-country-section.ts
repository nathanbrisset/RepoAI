import type { DirectoryRecord } from "@/lib/directory/data"
import { directoryRecords } from "@/lib/directory/data"
import type { Locale } from "@/lib/i18n/config"
import { HQ_UK_FILTER, matchesHqCountryFilter } from "@/lib/hq-country-filter"

const FR_EDITORIAL = ["mistral", "photoroom", "lighton"]

function normalizeToken(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "")
}

function matchesEditorialToken(tool: DirectoryRecord, token: string): boolean {
  const needle = normalizeToken(token)
  const id = normalizeToken(tool.id)
  const name = normalizeToken(tool.name)
  return id === needle || id.includes(needle) || name.includes(needle)
}

function pickTopCountryTools(candidates: DirectoryRecord[], editorialOrder: string[], limit: number): DirectoryRecord[] {
  const picked: DirectoryRecord[] = []
  const used = new Set<string>()

  for (const token of editorialOrder) {
    if (picked.length >= limit) break
    const found = candidates.find((tool) => !used.has(tool.id) && matchesEditorialToken(tool, token))
    if (found) {
      picked.push(found)
      used.add(found.id)
    }
  }

  const rest = candidates
    .filter((tool) => !used.has(tool.id))
    .sort((a, b) => a.name.localeCompare(b.name, "en"))

  for (const tool of rest) {
    if (picked.length >= limit) break
    picked.push(tool)
  }

  return picked
}

/** ISO-2 used in catalogue `?hqCountry=` for this locale's home section CTA. */
export function homeCountryCatalogueFilter(locale: Locale): string {
  return locale === "fr" ? "FR" : HQ_UK_FILTER
}

export function homeCountrySectionTools(locale: Locale): DirectoryRecord[] {
  const filter = homeCountryCatalogueFilter(locale)
  const candidates = directoryRecords(locale).filter((tool) => matchesHqCountryFilter(tool.hqCountry, filter))
  if (candidates.length === 0) return []

  if (locale === "fr") {
    return pickTopCountryTools(candidates, FR_EDITORIAL, 3)
  }
  return pickTopCountryTools(candidates, [], 3)
}
