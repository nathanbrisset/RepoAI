#!/usr/bin/env node
/**
 * Catalogue lot 2026-11-11 top-up — 45 tools from lot-45.csv + copy-45.json + deliver assets.
 *
 *   node scripts/import-lot-2026-11-11-topup45.mjs [--dry-run]
 */
import crypto from "crypto"
import fs from "fs"
import path from "path"
import { spawnSync } from "child_process"
import { fileURLToPath } from "url"
import { truncateHowToTitle, firstSentenceForHowTo } from "../lib/i18n/truncate-how-to-title.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const importDir = path.join(root, "data/import-2026-11-11-topup45")
const csvPath = path.join(importDir, "lot-45.csv")
const copyPath = path.join(importDir, "copy-45.json")
const featuresEnPath = path.join(importDir, "features-en-45.json")
const featuresFrPath = path.join(importDir, "features-fr-45.json")
const peerLot56SlugsPath = path.join(importDir, "peer-lot56-slugs.json")
const md5Path = path.join(importDir, "md5.json")
const deliverLogos = path.join(importDir, "deliver/logos")
const deliverShots = path.join(importDir, "deliver/screenshots")
const toolsDir = path.join(root, "content/tools")
const toolIdsPath = path.join(root, "content/tool-ids.json")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const publicLogos = path.join(root, "public/logos")
const publicShots = path.join(root, "public/screenshots")
const VERIFIED = "2026-11-11"
const LOT_SIZE = 45
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
  "heardloom",
  "sitedrop-live",
  "rempa",
  "lumimusic",
])

/** CSV category labels → public taxonomy ids (never legacy text / data-processing). */
const CATEGORY_SLUG = {
  "LLM & Chatbots": "llm-chatbots",
  "AI Agents": "ai-agents",
  "Automation & Workflows": "automation",
  Coding: "coding",
  "Coding & Dev Tools": "coding",
  Design: "design",
  "Design & UI": "design",
  "Image Generation": "image",
  "Image Generation & Editing": "image",
  Marketing: "marketing",
  "Marketing & SEO": "marketing",
  "No-code & App Builders": "no-code",
  Productivity: "productivity",
  "Productivity & Workspace": "productivity",
  "Video Creation": "video",
  Video: "video",
  "Voice & Speech": "voice",
  Audio: "voice",
  Text: "writing",
  "Writing & Content": "writing",
  "Data Processing": "data",
  "Data & Analytics": "data",
  "Education & Learning": "education",
  "Music & Audio": "music",
  "Meetings & Notes": "meetings",
  "Search & Research": "search",
  "Sales & CRM": "sales",
  "Finance & Accounting": "finance",
  Legal: "legal",
  "Customer Support": "support",
  "HR & Recruiting": "hr",
  "Health & Medical": "health",
  Security: "security",
  "AI Detection": "ai-detection",
}

const PUBLIC_CATEGORY_IDS = new Set(
  JSON.parse(fs.readFileSync(path.join(root, "content/taxonomy.json"), "utf8")).categories.map((c) => c.id),
)

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
  montenegro: "ME",
  indonesia: "ID",
  ireland: "IE",
  estonia: "EE",
  ukraine: "UA",
  mexico: "MX",
  "south korea": "KR",
  korea: "KR",
  poland: "PL",
  turkey: "TR",
  portugal: "PT",
  belgium: "BE",
  austria: "AT",
  denmark: "DK",
  "new zealand": "NZ",
  argentina: "AR",
  colombia: "CO",
  chile: "CL",
  peru: "PE",
  vietnam: "VN",
  thailand: "TH",
  philippines: "PH",
  malaysia: "MY",
  taiwan: "TW",
  "hong kong": "HK",
  uae: "AE",
  "united arab emirates": "AE",
  egypt: "EG",
  nigeria: "NG",
  kenya: "KE",
  "south africa": "ZA",
  romania: "RO",
  hungary: "HU",
  czechia: "CZ",
  "czech republic": "CZ",
  slovakia: "SK",
  croatia: "HR",
  serbia: "RS",
  bulgaria: "BG",
  greece: "GR",
  norway: "NO",
  finland: "FI",
  luxembourg: "LU",
  latvia: "LV",
  lithuania: "LT",
  slovenia: "SI",
  cyprus: "CY",
  malta: "MT",
  iceland: "IS",
  pakistan: "PK",
  bangladesh: "BD",
  nepal: "NP",
  sri_lanka: "LK",
  "sri lanka": "LK",
}

/** When deliver slug would overwrite an existing catalogue entry */
const COLLISION_RENAMES = {}

const CURRENCY_LEAK = /\$|(?:^|\s)USD\b|\bdollars?\b|£|(?:^|\s)GBP\b/i

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

const HOWTO_TITLE_MAX = 90

function howToStepTitle(description) {
  const trimmed = String(description).trim()
  if (!trimmed) return "Step"
  let title = firstSentenceForHowTo(trimmed)
  title = truncateHowToTitle(title)
  return title.length >= 3 ? title : trimmed.slice(0, HOWTO_TITLE_MAX)
}

function howToStepsFromStrings(steps, name, url) {
  if (!steps?.length) return undefined
  const out = steps.map((text, index) => {
    const trimmed = String(text).trim()
    const title = howToStepTitle(trimmed)
    const step = { title, description: trimmed }
    if (index === 0 && url) {
      step.links = [{ label: name, url }]
    }
    return step
  })
  return out
}

function resolveToolId(deliverSlug, existingIds, thisLotDeliverSlugs) {
  if (FORBIDDEN_IDS.has(deliverSlug)) {
    throw new Error(`Forbidden tool slug in lot: ${deliverSlug}`)
  }
  let id = deliverSlug
  if (existingIds.has(id)) {
    if (thisLotDeliverSlugs.has(deliverSlug)) return id
    const alt = COLLISION_RENAMES[deliverSlug]
    if (!alt || existingIds.has(alt)) {
      throw new Error(`ID collision for deliver slug "${deliverSlug}" (existing id "${id}")`)
    }
    id = alt
  }
  return id
}

function resolveCategoryId(csvLabel) {
  const categoryId = CATEGORY_SLUG[csvLabel]
  if (!categoryId) throw new Error(`Unknown category "${csvLabel}"`)
  if (!PUBLIC_CATEGORY_IDS.has(categoryId)) {
    throw new Error(`Non-public category "${categoryId}" from "${csvLabel}"`)
  }
  return categoryId
}

function assertNoCurrencyLeakInDisplayedFields(tool, copyEntry, pricingFr) {
  const fields = [
    tool.summary,
    tool.description,
    tool.summary_fr,
    tool.description_fr,
    tool.pricing?.details,
    pricingFr,
    ...(tool.features || []),
    ...(tool.features_fr || []),
    ...(tool.howToUse || []).flatMap((s) => [s.title, s.description]),
    ...(tool.howToUse_fr || []).flatMap((s) => [s.title, s.description]),
  ]
  for (const f of fields) {
    if (typeof f === "string" && CURRENCY_LEAK.test(f)) {
      throw new Error(`Currency leak ($/USD/£/GBP) in displayed field for ${tool.id}`)
    }
  }
  if (copyEntry?.pricing_usd_official && Object.keys(tool).includes("pricing_usd_official")) {
    throw new Error(`pricing_usd_official must not be stored for ${tool.id}`)
  }
  if (copyEntry?.pricing_official_gbp && Object.keys(tool).includes("pricing_official_gbp")) {
    throw new Error(`pricing_official_gbp must not be stored for ${tool.id}`)
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

function runCatalogIndex() {
  if (dryRun) return
  const script = path.join(root, "scripts/catalog-index.mjs")
  const result = spawnSync(process.execPath, [script], { cwd: root, stdio: "inherit" })
  if (result.status !== 0) {
    throw new Error("catalog-index.mjs failed — run npm run catalog:check")
  }
}

function findHomonyms(createdIds, rowsBySlug) {
  const homonyms = []
  const existingTools = fs
    .readdirSync(toolsDir)
    .filter((n) => n.endsWith(".json"))
    .map((n) => {
      const t = JSON.parse(fs.readFileSync(path.join(toolsDir, n), "utf8"))
      return { id: t.id, name: (t.name || "").trim().toLowerCase() }
    })
  const newNames = new Map()
  for (const id of createdIds) {
    const row = rowsBySlug.get(id)
    if (row) newNames.set((row.name || "").trim().toLowerCase(), id)
  }
  for (const [name, newId] of newNames) {
    if (!name) continue
    for (const ex of existingTools) {
      if (ex.id === newId) continue
      if (ex.name === name) {
        homonyms.push({ name: rowName(name), newId, existingId: ex.id })
      }
    }
  }
  return homonyms

  function rowName(n) {
    for (const row of rowsBySlug.values()) {
      if ((row.name || "").trim().toLowerCase() === n) return row.name
    }
    return n
  }
}

function main() {
  const copyEntries = JSON.parse(fs.readFileSync(copyPath, "utf8"))
  const SLUGS = copyEntries.map((e) => e.slug)
  if (SLUGS.length !== LOT_SIZE) throw new Error(`Expected ${LOT_SIZE} copy entries, got ${SLUGS.length}`)

  const rows = parseCsv(fs.readFileSync(csvPath, "utf8"))
  if (rows.length !== SLUGS.length) {
    throw new Error(`Expected ${SLUGS.length} CSV rows, got ${rows.length}`)
  }

  const copyBySlug = Object.fromEntries(copyEntries.map((entry) => [entry.slug, entry]))
  const featuresEnBySlug = JSON.parse(fs.readFileSync(featuresEnPath, "utf8"))
  const featuresFrBySlug = JSON.parse(fs.readFileSync(featuresFrPath, "utf8"))
  for (const slug of SLUGS) {
    const en = featuresEnBySlug[slug]
    const frFeat = featuresFrBySlug[slug]
    if (!en?.length) throw new Error(`features-en-45.json missing or empty for ${slug}`)
    if (!frFeat?.length) throw new Error(`features-fr-45.json missing or empty for ${slug}`)
    if (en.length !== frFeat.length) {
      throw new Error(`features count mismatch for ${slug}: EN ${en.length} vs FR ${frFeat.length}`)
    }
  }
  const featureSlugKeys = new Set([...Object.keys(featuresEnBySlug), ...Object.keys(featuresFrBySlug)])
  if (featureSlugKeys.size !== SLUGS.length) {
    throw new Error(`Expected ${SLUGS.length} feature slugs, got ${featureSlugKeys.size}`)
  }
  const expectedMd5 = JSON.parse(fs.readFileSync(md5Path, "utf8"))
  const existingIds = new Set(JSON.parse(fs.readFileSync(toolIdsPath, "utf8")))
  const thisLotDeliverSlugs = new Set(SLUGS)
  const peerLot56Slugs = fs.existsSync(peerLot56SlugsPath)
    ? JSON.parse(fs.readFileSync(peerLot56SlugsPath, "utf8"))
    : []
  const peerLot56SlugOverlaps = SLUGS.filter((s) => peerLot56Slugs.includes(s))
  if (peerLot56SlugOverlaps.length) {
    throw new Error(
      `Slug overlap with PR #48 lot (import-2026-11-11): ${peerLot56SlugOverlaps.join(", ")}`,
    )
  }

  const idPairs = []
  const createdIds = []
  const renames = []
  const skipped = []
  const categoryMappings = {}

  for (let i = 0; i < SLUGS.length; i++) {
    const deliverSlug = SLUGS[i]
    const id = resolveToolId(deliverSlug, existingIds, thisLotDeliverSlugs)
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
    const url = (copy.official_url_final || row.official_url_final || copy.official_url || row.official_url).trim()
    new URL(url)
    const csvCategory = (copy.category || row.category || "").trim()
    const categoryId = resolveCategoryId(csvCategory)
    categoryMappings[csvCategory] = categoryId

    const tags = (row.tags || "")
      .split(",")
      .map((t) => t.trim().toLowerCase().replace(/\s+/g, "-"))
      .filter(Boolean)
    if (!tags.length) throw new Error(`No tags for ${name}`)

    const summary = row.short_description.trim()
    let description = row.long_description.trim()
    if (!description) description = summary
    if (!summary) throw new Error(`Empty copy for ${name}`)

    const shortFr = (copy.short_fr || row.short_description_fr || "").trim()

    const pricingEn = (copy.pricing_en || "").trim()
    const pricingFr = (copy.pricing_fr || "").trim()
    if (pricingEn && CURRENCY_LEAK.test(pricingEn)) {
      throw new Error(`pricing_en must be EUR-only for ${id}`)
    }
    if (pricingFr && CURRENCY_LEAK.test(pricingFr)) {
      throw new Error(`pricing_fr must be EUR-only for ${id}`)
    }

    const features = featuresEnBySlug[deliverSlug].map((item) => String(item).trim()).filter(Boolean)
    const featuresFr = featuresFrBySlug[deliverSlug].map((item) => String(item).trim()).filter(Boolean)
    if (featuresFr.some((line) => CURRENCY_LEAK.test(line))) {
      throw new Error(`features_fr must not include non-EUR currency for ${id}`)
    }
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
      features,
      ...(howToUse?.length ? { howToUse } : {}),
      ...parseHqCountry(row.hqCountry),
    }

    const sources = urlsFrom(row.source || "")
    if (sources.length) tool.sources = sources

    if (shortFr) {
      tool.summary_fr = shortFr
      tool.description_fr = shortFr
    }

    tool.features_fr = featuresFr

    if (howToUseFr?.length) {
      tool.howToUse_fr = howToUseFr
    }

    assertNoCurrencyLeakInDisplayedFields(tool, copy, pricingFr)

    writeJson(path.join(toolsDir, `${id}.json`), tool)

    if (!fr[id]) fr[id] = {}
    if (shortFr) {
      fr[id].summary_fr = shortFr
      fr[id].description_fr = shortFr
    }
    if (tool.features_fr?.length) fr[id].features_fr = tool.features_fr
    if (tool.howToUse_fr?.length) fr[id].howToUse_fr = tool.howToUse_fr
    if (pricingFr) fr[id].pricingNote_fr = pricingFr
  }

  const rowsBySlug = new Map(createdIds.map((id, i) => [id, rows[i]]))
  const homonyms = dryRun ? [] : findHomonyms(createdIds, rowsBySlug)

  const orderedFr = Object.fromEntries(Object.entries(fr).sort(([a], [b]) => a.localeCompare(b)))
  writeJson(frPath, orderedFr)

  const toolCount = dryRun ? "dry-run" : syncToolIds()
  if (!dryRun) runCatalogIndex()

  const report = {
    date: VERIFIED,
    deliverSlugs: SLUGS,
    toolIds: createdIds,
    idRenames: renames,
    homonyms,
    skipped,
    toolsWritten: createdIds.length,
    toolFiles: toolCount,
    md5Verified: true,
    catalogIndexRegenerated: !dryRun,
    forbiddenExcluded: [...FORBIDDEN_IDS],
    categoryMappings,
    peerLot56SlugOverlaps,
    currencyLeakCheck: "pass",
  }
  writeJson(path.join(importDir, "import-report.json"), report)
  console.log(JSON.stringify(report, null, 2))
}

main()
