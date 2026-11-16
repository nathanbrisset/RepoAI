import fs from "node:fs"
import path from "node:path"
import { directoryRecords } from "../lib/directory/data"
import type { CatalogSearchIndexFile } from "../lib/directory/catalog-index-types"
import type { Locale } from "../lib/i18n/config"

const OUT_DIR = path.join(process.cwd(), "public/catalog-search")

function summaryFor(record: { description: string }) {
  const text = record.description.replace(/\s+/g, " ").trim()
  return text.length <= 200 ? text : `${text.slice(0, 197)}…`
}

function writeLocale(locale: Locale) {
  const tools = directoryRecords(locale).map((record) => ({
    id: record.id,
    name: record.name,
    categories: record.categories,
    summary: summaryFor(record),
    pricingModel: record.pricingModel,
    priceBucket: record.priceBucket,
    pricingLabel: record.pricingLabel,
    pricingUncertain: record.pricingUncertain,
    hqCountry: record.hqCountry,
    logo: record.logo,
    dateAdded: record.dateAdded,
  }))

  const payload: CatalogSearchIndexFile = {
    locale,
    generatedAt: new Date().toISOString(),
    tools,
  }

  const file = path.join(OUT_DIR, locale === "fr" ? "fr.json" : "en.json")
  fs.writeFileSync(file, `${JSON.stringify(payload)}\n`)
  console.log(`Wrote ${file} (${tools.length} tools)`)
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  writeLocale("en")
  writeLocale("fr")
}

main()