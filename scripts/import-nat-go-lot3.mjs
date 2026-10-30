#!/usr/bin/env node
/**
 * Nat GO Lot 3 — upsert 197 tools from semicolon CSV (id-keyed, FR/EN verbatim).
 *
 *   node scripts/import-nat-go-lot3.mjs [path/to.csv]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { frPath, toolsDir } from "./about-quality-lib.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolIdsPath = path.join(root, "content/tool-ids.json")
const defaultCsv = path.join(root, "data/import-2026-10-30/lot3-197-tools.csv")
const csvPath = process.argv.find((a) => a.endsWith(".csv")) || defaultCsv
const VERIFIED = "2026-10-30"

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

function parseSemicolonCsv(text) {
  const normalized = text.replace(/^\uFEFF/, "")
  const rows = []
  let row = []
  let cell = ""
  let quoted = false
  for (let i = 0; i < normalized.length; i++) {
    const c = normalized[i]
    if (quoted) {
      if (c === '"') {
        if (normalized[i + 1] === '"') {
          cell += '"'
          i++
        } else quoted = false
      } else cell += c
    } else if (c === '"') quoted = true
    else if (c === ";") {
      row.push(cell)
      cell = ""
    } else if (c === "\n") {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ""
    } else if (c !== "\r") cell += c
  }
  if (cell.length || row.length) {
    row.push(cell)
    rows.push(row)
  }
  const headers = rows[0].map((h) => h.trim())
  return rows
    .slice(1)
    .filter((r) => r.some((v) => v && v.trim()))
    .map((r) => Object.fromEntries(headers.map((h, i) => [h, (r[i] ?? "").trim()])))
}

function splitFeatures(cell) {
  return (cell || "")
    .split(/\s*\|\s*/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function pricingFrom(label, url) {
  const text = (label || "").trim()
  const note = text
  const base = { verified: false, note, sourceUrl: url || undefined }

  if (/^free$/i.test(text)) {
    return { ...base, model: "free", label: "Free" }
  }
  if (/freemium/i.test(text)) {
    return { ...base, model: "freemium", label: "Freemium" }
  }
  if (/^premium$/i.test(text) || /payant/i.test(text)) {
    return { ...base, model: "paid", label: "Premium" }
  }
  if (/enterprise/i.test(text)) {
    return { ...base, model: "enterprise", label: "Enterprise" }
  }
  if (/open\s*source/i.test(text)) {
    return { ...base, model: "open-source", label: "Open source" }
  }
  if (/usage[- ]based/i.test(text)) {
    return { ...base, model: "usage-based", label: "Usage-based" }
  }
  return { verified: false, note: note || "Pricing not mapped from import.", uncertain: true }
}

function parseHqCountry(pays) {
  const iso = (pays || "").trim().toUpperCase()
  if (!iso || !/^[A-Z]{2}$/.test(iso)) return {}
  return { hqCountry: iso, hqCountrySource: "import" }
}

function defaultHowTo(name, url) {
  return [
    {
      title: `Open ${name}`,
      description: "Create an account at the official URL if you need saved work or billing.",
      links: [{ label: name, url }],
    },
    { title: "Complete onboarding", description: "Follow the product tour or connect the first integration it asks for." },
    { title: "Run a first task", description: "Execute the main workflow using a template or sample input." },
    { title: "Review outputs", description: "Export, share, or connect to your stack before scaling usage." },
  ]
}

function readTool(id) {
  const file = path.join(toolsDir, `${id}.json`)
  if (!fs.existsSync(file)) return null
  return JSON.parse(fs.readFileSync(file, "utf8"))
}

function buildFromRow(row) {
  const id = row.id
  const name = row.nom
  const url = row.url
  const categoryId = row["catégorie"]
  const summary = row["summary EN"]
  const description = row["description EN"]
  const summary_fr = row["résumé FR"]
  const description_fr = row["description FR"]
  const features = splitFeatures(row["key features EN"])
  const features_fr = splitFeatures(row["points clés FR"])
  const geo = parseHqCountry(row.pays)
  const tags = ["ai", categoryId.split("-")[0] || "tool", "catalog"]

  return {
    id,
    name,
    url,
    affiliateUrl: "",
    status: "active",
    summary,
    description,
    summary_fr,
    description_fr,
    categories: [categoryId],
    tags: [...new Set(tags)],
    pricing: pricingFrom(row.prix, url),
    logo: `/logos/${id}.png`,
    image: "",
    dateAdded: VERIFIED,
    lastVerified: VERIFIED,
    features,
    features_fr,
    howToUse: defaultHowTo(name, url),
    ...geo,
  }
}

function mergeExisting(existing, row) {
  const fresh = buildFromRow(row)
  const next = { ...existing }
  next.name = fresh.name
  next.url = fresh.url
  next.summary = fresh.summary
  next.description = fresh.description
  next.summary_fr = fresh.summary_fr
  next.description_fr = fresh.description_fr
  next.features = fresh.features
  next.features_fr = fresh.features_fr
  next.categories = fresh.categories
  next.pricing = fresh.pricing
  next.lastVerified = VERIFIED
  if (fresh.hqCountry) {
    next.hqCountry = fresh.hqCountry
    next.hqCountrySource = fresh.hqCountrySource
  }
  if (!next.logo || !next.logo.trim()) next.logo = fresh.logo
  if (!next.howToUse?.length) next.howToUse = fresh.howToUse
  if (!next.tags?.length) next.tags = fresh.tags
  return next
}

function syncToolIds() {
  const ids = fs
    .readdirSync(toolsDir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => name.replace(/\.json$/, ""))
    .sort()
  writeJson(toolIdsPath, ids)
  return ids.length
}

function main() {
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV not found: ${csvPath}`)
    process.exit(1)
  }
  const rows = parseSemicolonCsv(fs.readFileSync(csvPath, "utf8"))
  if (rows.length !== 197) {
    console.error(`Expected 197 rows, got ${rows.length}`)
    process.exit(1)
  }

  const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
  let created = 0
  let updated = 0
  const ids = []

  for (const row of rows) {
    if (!row.id) throw new Error("Row missing id")
    if (!row["catégorie"]) throw new Error(`Missing category for ${row.id}`)
    ids.push(row.id)

    const existing = readTool(row.id)
    const tool = existing ? mergeExisting(existing, row) : buildFromRow(row)
    writeJson(path.join(toolsDir, `${tool.id}.json`), tool)
    if (existing) updated++
    else created++

    if (!fr[tool.id]) fr[tool.id] = {}
    fr[tool.id].summary_fr = tool.summary_fr
    fr[tool.id].description_fr = tool.description_fr
    fr[tool.id].features_fr = tool.features_fr
  }

  writeJson(frPath, fr)
  const toolCount = syncToolIds()

  const reportPath = path.join(root, "data/import-2026-10-30/lot3-import-report.json")
  const report = {
    csvRows: rows.length,
    created,
    updated,
    toolFiles: toolCount,
    ids,
  }
  writeJson(reportPath, report)
  console.log(JSON.stringify(report, null, 2))
}

main()
