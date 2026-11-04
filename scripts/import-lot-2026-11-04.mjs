#!/usr/bin/env node
/**
 * Catalogue lot 2026-11-04 — 24 tools from comma CSV + deliver assets + FR backfill (first 13).
 *
 *   node scripts/import-lot-2026-11-04.mjs [--dry-run]
 */
import crypto from "crypto"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const importDir = path.join(root, "data/import-2026-11-04")
const csvPath = path.join(importDir, "lot.csv")
const backfillPath = path.join(importDir, "backfill-13.json")
const md5Path = path.join(importDir, "md5.json")
const deliverLogos = path.join(importDir, "deliver/logos")
const deliverShots = path.join(importDir, "deliver/screenshots")
const toolsDir = path.join(root, "content/tools")
const toolIdsPath = path.join(root, "content/tool-ids.json")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const publicLogos = path.join(root, "public/logos")
const publicShots = path.join(root, "public/screenshots")
const VERIFIED = "2026-11-04"
const dryRun = process.argv.includes("--dry-run")

const SLUGS = [
  "dedica",
  "empacer",
  "specsight",
  "botgauge",
  "floot",
  "spacesheep",
  "clawsgo-science",
  "cedric-ai",
  "hera",
  "xmind-agent",
  "entire",
  "treg",
  "simulon",
  "vaani",
  "scape",
  "strawberry",
  "unleashx",
  "testifly",
  "clayzo",
  "greta-sh",
  "faylee",
  "hyperresearch",
  "synter-canvas",
  "display",
]

const BLANK_PRICING_IDS = new Set(["botgauge", "entire"])

const CATEGORY_SLUG = {
  Marketing: "marketing",
  Productivity: "productivity",
  Coding: "coding",
  Design: "design",
  "Data Processing": "data-processing",
  Video: "video",
  Audio: "voice",
  Text: "text",
}

const COUNTRY_ISO = {
  india: "IN",
  "united states": "US",
  usa: "US",
  france: "FR",
  switzerland: "CH",
}

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

function pricingFor(row, id) {
  if (BLANK_PRICING_IDS.has(id)) {
    return { verified: false, uncertain: true }
  }
  const label = (row.pricing || "").trim()
  if (!label) return { verified: false, uncertain: true }
  const url = (row.official_url_final || row.official_url || "").trim()
  const verified = /^\d{4}-\d{2}-\d{2}$/.test((row.pricing_verified_on || "").trim())
  const sourceUrl = pricingSource(row.source || "", url)
  const base = { verified, ...(sourceUrl ? { sourceUrl } : {}) }

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
  if (!steps.length) return undefined
  const out = steps.map((text, index) => {
    const trimmed = text.trim()
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

function howToFromCell(cell, name, url) {
  const raw = (cell || "").trim()
  if (!raw) return undefined
  let parts
  if (raw.includes(";")) {
    parts = splitList(raw)
  } else if (/, then /i.test(raw)) {
    parts = raw.split(/,\s*then\s+/i).map((s) => s.trim()).filter(Boolean)
  } else {
    parts = [raw]
  }
  return howToStepsFromStrings(parts, name, url)
}

function copyAssets(slugs, expectedMd5) {
  const mismatches = []
  for (const slug of slugs) {
    const logoSrc = path.join(deliverLogos, `${slug}.png`)
    const shotSrc = path.join(deliverShots, `${slug}.webp`)
    const logoDst = path.join(publicLogos, `${slug}.png`)
    const shotDst = path.join(publicShots, `${slug}.webp`)
    for (const [kind, src, dst, map] of [
      ["logo", logoSrc, logoDst, expectedMd5.logos],
      ["screenshot", shotSrc, shotDst, expectedMd5.screenshots],
    ]) {
      if (!fs.existsSync(src)) throw new Error(`Missing deliver ${kind}: ${slug}`)
      const hash = md5File(src)
      const want = map?.[slug]
      if (want && hash !== want) {
        mismatches.push({ slug, kind, want, got: hash })
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
  const rows = parseCsv(fs.readFileSync(csvPath, "utf8"))
  if (rows.length !== SLUGS.length) {
    throw new Error(`Expected ${SLUGS.length} CSV rows, got ${rows.length}`)
  }

  const backfill = JSON.parse(fs.readFileSync(backfillPath, "utf8"))
  const backfillBySlug = Object.fromEntries(backfill.map((entry) => [entry.slug, entry]))
  const expectedMd5 = JSON.parse(fs.readFileSync(md5Path, "utf8"))

  copyAssets(SLUGS, expectedMd5)

  const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
  const created = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const id = SLUGS[i]
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

    const bf = backfillBySlug[id]
    let features = splitList(row.features)
    let howToUse = howToFromCell(row.howTo, name, url)
    if (bf) {
      if (bf.features?.length) features = bf.features
      if (bf.howTo?.length) howToUse = howToStepsFromStrings(bf.howTo, name, url)
    }

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
      pricing: pricingFor(row, id),
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

    const summaryFr = (row.short_description_fr || bf?.short_description_fr || "").trim()
    if (summaryFr) {
      tool.summary_fr = summaryFr
      tool.description_fr = summaryFr
    }

    const csvFeatures = splitList(row.features)
    if (bf?.features?.length) {
      tool.features_fr = bf.features
    } else if (csvFeatures.length && summaryFr) {
      tool.features_fr = csvFeatures
    }

    if (bf?.howTo?.length) {
      tool.howToUse_fr = howToStepsFromStrings(bf.howTo, name, url)
    } else if (howToUse?.length && summaryFr) {
      tool.howToUse_fr = howToUse
    }

    writeJson(path.join(toolsDir, `${id}.json`), tool)
    created.push(id)

    if (!fr[id]) fr[id] = {}
    if (summaryFr) {
      fr[id].summary_fr = summaryFr
      fr[id].description_fr = summaryFr
    }
    if (tool.features_fr?.length) fr[id].features_fr = tool.features_fr
    if (tool.howToUse_fr?.length) fr[id].howToUse_fr = tool.howToUse_fr
  }

  const orderedFr = Object.fromEntries(Object.entries(fr).sort(([a], [b]) => a.localeCompare(b)))
  writeJson(frPath, orderedFr)

  const toolCount = dryRun ? "dry-run" : syncToolIds()

  const report = {
    date: VERIFIED,
    slugs: SLUGS,
    toolsWritten: created.length,
    toolFiles: toolCount,
    md5Verified: true,
    blankPricing: [...BLANK_PRICING_IDS],
  }
  writeJson(path.join(importDir, "import-report.json"), report)
  console.log(JSON.stringify(report, null, 2))
}

main()
