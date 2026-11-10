#!/usr/bin/env node
/**
 * Catalogue lot 2026-11-10 — 37 tools from lot CSV + copy-37.json + deliver assets.
 *
 *   node scripts/import-lot-2026-11-10.mjs [--dry-run]
 */
import crypto from "crypto"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const importDir = path.join(root, "data/import-2026-11-10")
const csvPath = path.join(importDir, "lot.csv")
const copyPath = path.join(importDir, "copy-37.json")
const md5Path = path.join(importDir, "md5.json")
const deliverLogos = path.join(importDir, "deliver/logos")
const deliverShots = path.join(importDir, "deliver/screenshots")
const toolsDir = path.join(root, "content/tools")
const toolIdsPath = path.join(root, "content/tool-ids.json")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const publicLogos = path.join(root, "public/logos")
const publicShots = path.join(root, "public/screenshots")
const VERIFIED = "2026-11-10"
const dryRun = process.argv.includes("--dry-run")

const FORBIDDEN_IDS = new Set([
  "cardboard-ai",
  "pushary",
  "polylane",
  "vlogme",
  "bridge",
  "wthumb",
  "liveswap-ai",
  "unfurl",
])

const CATEGORY_SLUG = {
  Marketing: "marketing",
  Productivity: "productivity",
  Coding: "coding",
  Design: "design",
  "Data Processing": "data-processing",
  Video: "video",
  Audio: "voice",
  Text: "text",
  Image: "image",
}

const COUNTRY_ISO = {
  india: "IN",
  "united states": "US",
  usa: "US",
  france: "FR",
  switzerland: "CH",
  germany: "DE",
  uk: "GB",
  "united kingdom": "GB",
  spain: "ES",
  canada: "CA",
  australia: "AU",
  singapore: "SG",
  israel: "IL",
  netherlands: "NL",
  sweden: "SE",
  norway: "NO",
  finland: "FI",
  italy: "IT",
  japan: "JP",
  china: "CN",
  brazil: "BR",
}

/** When deliver slug would overwrite an existing catalogue entry */
const COLLISION_RENAMES = {
  rerun: "rerun-build",
}

const USD_IN_DISPLAY = /\$|(?:^|\s)USD\b|\bdollars?\b/i

function writeJson(file, value) {
  if (dryRun) return
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

function md5File(file) {
  return crypto.createHash("md5").update(fs.readFileSync(file)).digest("hex")
}

function parseCsv(text) {
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
    else if (c === ",") {
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

function splitList(cell) {
  return (cell || "")
    .split(/\s*;\s*/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function urlsFrom(text) {
  const found = text.match(/https?:\/\/[^\s;,)"']+/g) || []
  const unique = []
  for (const raw of found) {
    const url = raw.replace(/[.)\]]+$/, "")
    try {
      const parsed = new URL(url)
      if (!unique.includes(parsed.href)) unique.push(parsed.href)
    } catch {
      /* skip */
    }
  }
  return unique
}

function pricingSource(source, url) {
  return urlsFrom(source).find((u) => /pricing|\/plans\b|\/price\b/i.test(u)) || undefined
}

function pricingFor(row, pricingEn) {
  const label = (row.pricing || "").trim()
  if (!label) return { verified: false, uncertain: true }
  const url = (row.official_url_final || row.official_url || "").trim()
  const verified = /^\d{4}-\d{2}-\d{2}$/.test((row.pricing_verified_on || "").trim())
  const sourceUrl = pricingSource(row.source || "", url)
  const base = {
    verified,
    ...(sourceUrl ? { sourceUrl } : {}),
    ...(pricingEn ? { details: pricingEn } : {}),
  }

  if (/^free$/i.test(label)) return { ...base, model: "free", label: "Free" }
  if (/freemium/i.test(label)) return { ...base, model: "freemium", label: "Freemium" }
  if (/premium/i.test(label)) return { ...base, model: "paid", label: "Premium" }
  if (/enterprise/i.test(label)) return { ...base, model: "enterprise", label: "Enterprise" }
  if (/usage/i.test(label)) return { ...base, model: "usage-based", label: "Usage-based" }
  return { verified: false, uncertain: true, note: label }
}

function parseHqCountry(raw) {
  const key = (raw || "").trim().toLowerCase()
  if (!key) return {}
  const iso = COUNTRY_ISO[key]
  if (!iso) return {}
  return { hqCountry: iso, hqCountrySource: "import" }
}

function howToStepsFromStrings(steps, name, url) {
  if (!steps?.length) return undefined
  const out = steps.map((text, index) => {
    const trimmed = String(text).trim()
    const titleMatch = trimmed.match(/^([^,.:;]{3,80})/)
    let title = titleMatch ? titleMatch[1].trim() : `Step ${index + 1}`
    if (title.length > 90) title = `${title.slice(0, 87).trim()}...`
    const step = { title, description: trimmed }
    if (index === 0 && url) {
      step.links = [{ label: name, url }]
    }
    return step
  })
  return out
}

function resolveToolId(deliverSlug, existingIds) {
  if (FORBIDDEN_IDS.has(deliverSlug)) {
    throw new Error(`Forbidden tool slug in lot: ${deliverSlug}`)
  }
  let id = deliverSlug
  if (existingIds.has(id)) {
    const alt = COLLISION_RENAMES[deliverSlug]
    if (!alt || existingIds.has(alt)) {
      throw new Error(`ID collision for deliver slug "${deliverSlug}" (existing id "${id}")`)
    }
    id = alt
  }
  return id
}

function assertNoUsdInDisplayedFields(tool, copyEntry) {
  const fields = [
    tool.summary,
    tool.description,
    tool.summary_fr,
    tool.description_fr,
    tool.pricing?.details,
    ...(tool.features || []),
    ...(tool.features_fr || []),
  ]
  for (const f of fields) {
    if (typeof f === "string" && USD_IN_DISPLAY.test(f)) {
      throw new Error(`USD marker in displayed field for ${tool.id}`)
    }
  }
  if (copyEntry?.pricing_usd_official && Object.keys(tool).includes("pricing_usd_official")) {
    throw new Error(`pricing_usd_official must not be stored for ${tool.id}`)
  }
}

function copyAssets(pairs, expectedMd5) {
  const mismatches = []
  for (const { deliverSlug, id } of pairs) {
    const logoSrc = path.join(deliverLogos, `${deliverSlug}.png`)
    const shotSrc = path.join(deliverShots, `${deliverSlug}.webp`)
    const logoDst = path.join(publicLogos, `${id}.png`)
    const shotDst = path.join(publicShots, `${id}.webp`)
    for (const [kind, src, dst, map] of [
      ["logo", logoSrc, logoDst, expectedMd5.logos],
      ["screenshot", shotSrc, shotDst, expectedMd5.screenshots],
    ]) {
      if (!fs.existsSync(src)) throw new Error(`Missing deliver ${kind}: ${deliverSlug}`)
      const hash = md5File(src)
      const want = map?.[deliverSlug]
      if (want && hash !== want) {
        mismatches.push({ slug: deliverSlug, kind, want, got: hash })
      }
      if (!dryRun) fs.copyFileSync(src, dst)
    }
  }
  if (mismatches.length) {
    throw new Error(`MD5 mismatches: ${JSON.stringify(mismatches, null, 2)}`)
  }
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
  const copyEntries = JSON.parse(fs.readFileSync(copyPath, "utf8"))
  const SLUGS = copyEntries.map((e) => e.slug)
  if (SLUGS.length !== 37) throw new Error(`Expected 37 copy entries, got ${SLUGS.length}`)

  const rows = parseCsv(fs.readFileSync(csvPath, "utf8"))
  if (rows.length !== SLUGS.length) {
    throw new Error(`Expected ${SLUGS.length} CSV rows, got ${rows.length}`)
  }

  const copyBySlug = Object.fromEntries(copyEntries.map((entry) => [entry.slug, entry]))
  const expectedMd5 = JSON.parse(fs.readFileSync(md5Path, "utf8"))
  const existingIds = new Set(JSON.parse(fs.readFileSync(toolIdsPath, "utf8")))

  const idPairs = []
  const createdIds = []
  const renames = []
  const skipped = []

  for (let i = 0; i < SLUGS.length; i++) {
    const deliverSlug = SLUGS[i]
    const id = resolveToolId(deliverSlug, existingIds)
    if (id !== deliverSlug) {
      renames.push({ deliverSlug, id, reason: "existing tool id collision" })
    }
    idPairs.push({ deliverSlug, id })
    createdIds.push(id)
    existingIds.add(id)
  }

  copyAssets(idPairs, expectedMd5)

  const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const deliverSlug = SLUGS[i]
    const { id } = idPairs[i]
    const copy = copyBySlug[deliverSlug]
    if (!copy) throw new Error(`Missing copy for ${deliverSlug}`)

    const name = row.name
    const url = (row.official_url_final || row.official_url).trim()
    new URL(url)
    const categoryId = CATEGORY_SLUG[row.category]
    if (!categoryId) throw new Error(`Unknown category "${row.category}" for ${name}`)

    const tags = (row.tags || "")
      .split(",")
      .map((t) => t.trim().toLowerCase().replace(/\s+/g, "-"))
      .filter(Boolean)
    if (!tags.length) throw new Error(`No tags for ${name}`)

    const summary = row.short_description.trim()
    const description = row.long_description.trim()
    if (!summary || !description) throw new Error(`Empty copy for ${name}`)

    const pricingEn = (copy.pricing_en || "").trim()
    const pricingFr = (copy.pricing_fr || "").trim()
    if (pricingEn && USD_IN_DISPLAY.test(pricingEn)) {
      throw new Error(`pricing_en must be EUR-only for ${id}`)
    }
    if (pricingFr && USD_IN_DISPLAY.test(pricingFr)) {
      throw new Error(`pricing_fr must be EUR-only for ${id}`)
    }

    const features = splitList(row.features)
    const howToUse = howToStepsFromStrings(copy.howTo_en, name, url)
    const howToUseFr = howToStepsFromStrings(copy.howTo_fr, name, url)

    const tool = {
      id,
      name,
      url,
      affiliateUrl: "",
      status: "active",
      summary,
      description,
      categories: [categoryId],
      tags,
      pricing: pricingFor(row, pricingEn || undefined),
      logo: `/logos/${id}.png`,
      image: `/screenshots/${id}.webp`,
      dateAdded: VERIFIED,
      lastVerified: VERIFIED,
      ...(features.length ? { features } : {}),
      ...(howToUse?.length ? { howToUse } : {}),
      ...parseHqCountry(row.hqCountry),
    }

    const sources = urlsFrom(row.source || "")
    if (sources.length) tool.sources = sources

    const summaryFr = (row.short_description_fr || "").trim()
    if (summaryFr) {
      tool.summary_fr = summaryFr
      tool.description_fr = summaryFr
    }

    if (summaryFr && features.length) {
      tool.features_fr = features
    }

    if (howToUseFr?.length) {
      tool.howToUse_fr = howToUseFr
    }

    assertNoUsdInDisplayedFields(tool, copy)

    writeJson(path.join(toolsDir, `${id}.json`), tool)

    if (!fr[id]) fr[id] = {}
    if (summaryFr) {
      fr[id].summary_fr = summaryFr
      fr[id].description_fr = summaryFr
    }
    if (tool.features_fr?.length) fr[id].features_fr = tool.features_fr
    if (tool.howToUse_fr?.length) fr[id].howToUse_fr = tool.howToUse_fr
    if (pricingFr) fr[id].pricingNote_fr = pricingFr
  }

  const orderedFr = Object.fromEntries(Object.entries(fr).sort(([a], [b]) => a.localeCompare(b)))
  writeJson(frPath, orderedFr)

  const toolCount = dryRun ? "dry-run" : syncToolIds()

  const report = {
    date: VERIFIED,
    deliverSlugs: SLUGS,
    toolIds: createdIds,
    idRenames: renames,
    skipped,
    toolsWritten: createdIds.length,
    toolFiles: toolCount,
    md5Verified: true,
    forbiddenExcluded: [...FORBIDDEN_IDS],
  }
  writeJson(path.join(importDir, "import-report.json"), report)
  console.log(JSON.stringify(report, null, 2))
}

main()
