#!/usr/bin/env node
/**
 * Nat GO Vague 0 — import 100 tools from semicolon CSV + seed hqCountry.
 *
 *   node scripts/import-nat-go-vague0.mjs [path/to.csv]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content/tools")
const toolIdsPath = path.join(root, "content/tool-ids.json")
const defaultCsv = path.join(
  root,
  "data/import-2026-10-29/nouveaux-outils-pays.csv",
)
const csvPath = process.argv[2] || defaultCsv
const VERIFIED = "2026-10-29"

const CATEGORY_SLUG = {
  "LLM & Chatbots": "llm-chatbots",
  "AI Agents": "ai-agents",
  Design: "design",
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
  "Writing & Content": "writing",
  "Education & Learning": "education",
  "Music & Audio": "music",
  "Meetings & Notes": "meetings",
  "Search & Research": "search",
  "Sales & CRM": "sales",
  "Finance & Accounting": "finance",
  Legal: "legal",
}

const COUNTRY_ISO = {
  "états-unis": "US",
  "etats-unis": "US",
  france: "FR",
  espagne: "ES",
  "royaume-uni": "GB",
  allemagne: "DE",
  canada: "CA",
  singapour: "SG",
  australie: "AU",
  chine: "CN",
  "corée du sud": "KR",
  "coree du sud": "KR",
  israël: "IL",
  israel: "IL",
  italie: "IT",
  inde: "IN",
  japon: "JP",
  pologne: "PL",
  autriche: "AT",
  albanie: "AL",
  turquie: "TR",
  suisse: "CH",
  danemark: "DK",
  hongrie: "HU",
  bangladesh: "BD",
  "hong kong": "HK",
}

const ID_BY_NAME = {
  "Google Opal": "google-opal",
  "Shopify Magic": "shopify-magic",
  "Whisk (Google)": "google-whisk",
  "Adobe Acrobat AI Assistant": "adobe-acrobat-ai-assistant",
  "GitHub Spark": "github-spark",
  "Google Vids": "google-vids",
  "Quso.ai (ex-vidyo.ai)": "vidyoai",
  "Runner H (H Company)": "runner-h",
  "Compar:IA": "compar-ia",
  "LightOn Paradigm": "lighton-paradigm",
  "Moonvalley (Marey)": "moonvalley",
  "Hunyuan Video (Tencent)": "hunyuan-video",
  "Kyutai (Moshi)": "kyutai",
  PlayHT: "playht",
}

const VERIFIED_FR_IDS = new Set([
  "mistral",
  "pennylane",
  "crisp",
  "doctrine",
  "la-growth-machine",
  "noota",
  "leexi",
  "argil",
  "waalaxy",
  "photoroom",
])

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

function parseSemicolonCsv(text) {
  const rows = []
  let row = []
  let cell = ""
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
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
  const headers = rows[0]
  return rows
    .slice(1)
    .filter((r) => r.some((v) => v && v.trim()))
    .map((r) => Object.fromEntries(headers.map((h, i) => [h.trim(), (r[i] ?? "").trim()])))
}

function normName(value) {
  return (value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
}

function normUrl(value) {
  if (!value || !value.trim()) return ""
  try {
    const url = new URL(value.trim())
    return (url.hostname.replace(/^www\./, "") + url.pathname.replace(/\/+$/, "")).toLowerCase()
  } catch {
    return ""
  }
}

function hostOf(value) {
  try {
    return new URL(value).hostname.replace(/^www\./, "").toLowerCase()
  } catch {
    return ""
  }
}

function slugFromName(name, url) {
  if (ID_BY_NAME[name]) return ID_BY_NAME[name]
  const host = hostOf(url || "")
  if (host) {
    const base = host.split(".")[0]
    if (base) {
      const slug = base
        .replace(/[^a-z0-9-]/gi, "-")
        .toLowerCase()
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
      if (slug) return slug
    }
  }
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
}

function pickNewId(name, url) {
  const base = slugFromName(name, url)
  const existing = readTool(base)
  if (!existing) return base
  if (normUrl(existing.url) === normUrl(url)) return base
  let n = 2
  while (readTool(`${base}-${n}`)) n++
  return `${base}-${n}`
}

function parseHqCountry(pays) {
  const raw = (pays || "").trim()
  if (!raw || /^à vérifier$/i.test(raw) || /^a verifier$/i.test(raw)) {
    return { skipped: raw || "(empty)", reason: "verify" }
  }
  if (/à vérifier|a verifier/i.test(raw)) {
    return { skipped: raw, reason: "verify" }
  }
  if (raw.includes("/")) {
    return { skipped: raw, reason: "dual" }
  }
  const key = raw
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
  const iso = COUNTRY_ISO[key]
  if (!iso) return { skipped: raw, reason: "unknown" }
  return { hqCountry: iso, hqCountrySource: "import" }
}

function pricingFrom(label, url) {
  const text = (label || "").trim()
  const note = text
  if (/gratuit|^free$/i.test(text)) {
    return { model: "free", label: "Free", verified: false, note, sourceUrl: url }
  }
  if (/freemium/i.test(text)) {
    return { model: "freemium", label: "Freemium", verified: false, note, sourceUrl: url }
  }
  if (/payant|premium/i.test(text)) {
    return { model: "paid", label: "Premium", verified: false, note, sourceUrl: url }
  }
  if (/inclus|enterprise/i.test(text)) {
    return { model: "paid", label: "Premium", verified: false, note, sourceUrl: url }
  }
  return { uncertain: true, verified: false, note: note || "Pricing not mapped from import." }
}

function defaultFeatures(name) {
  return [
    `${name} ships the main workflow advertised on its official site.`,
    "Team accounts, roles, or workspaces where the product supports them.",
    "Exports, webhooks, or integrations for downstream tools.",
    "Help center and onboarding to configure the first project.",
  ]
}

function defaultFeaturesFr(name) {
  return [
    `${name} propose le flux principal décrit sur le site officiel.`,
    "Comptes équipe, rôles ou espaces de travail si disponibles.",
    "Exports, webhooks ou intégrations vers tes autres outils.",
    "Centre d'aide et onboarding pour le premier projet.",
  ]
}

function defaultHowTo(name, url) {
  return [
    {
      title: `Sign up on ${name}`,
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

function writeTool(tool) {
  writeJson(path.join(toolsDir, `${tool.id}.json`), tool)
}

function loadIndex() {
  const byName = new Map()
  const byUrl = new Map()
  const files = fs.readdirSync(toolsDir).filter((f) => f.endsWith(".json"))
  for (const file of files) {
    const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8"))
    byName.set(normName(tool.name), tool)
    const nu = normUrl(tool.url)
    if (nu) {
      if (!byUrl.has(nu)) byUrl.set(nu, tool)
    }
  }
  return { byName, byUrl, files: new Set(files.map((f) => f.replace(/\.json$/, ""))) }
}

function resolveExisting(row, index) {
  const byName = index.byName.get(normName(row.Nom))
  if (byName) return byName
  const nu = normUrl(row["Site officiel"])
  if (nu && index.byUrl.has(nu)) return index.byUrl.get(nu)
  return null
}

function buildNewTool(row, id, categoryId, geo) {
  const name = row.Nom
  const url = row["Site officiel"]
  const useCase = row["Pourquoi / cas d'usage"]
  const host = hostOf(url)
  const summary = `${name} is an AI product in the ${row["Catégorie AItools.ninja"]} space with official hosting at ${host || "its official site"}.`
  const description = `${summary}\n\n${useCase}. Check the pricing page before production use.\n\nFeature: ${defaultFeatures(name)[0]}`
  const summary_fr = useCase.endsWith(".") ? useCase : `${useCase}.`
  const description_fr = `${summary_fr} Vérifie la page tarifs avant un déploiement en production.`
  const tags = ["ai", categoryId.split("-")[0] || "tool", "catalog"]
  const tool = {
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
    pricing: pricingFrom(row["Modèle de prix"], url),
    logo: `/logos/${id}.png`,
    image: "",
    dateAdded: VERIFIED,
    lastVerified: VERIFIED,
    features: defaultFeatures(name),
    features_fr: defaultFeaturesFr(name),
    howToUse: defaultHowTo(name, url),
  }
  if (geo.hqCountry) {
    tool.hqCountry = geo.hqCountry
    tool.hqCountrySource = geo.hqCountrySource
  }
  return tool
}

function mergeTool(existing, row, categoryId, geo) {
  const useCase = row["Pourquoi / cas d'usage"]
  const url = row["Site officiel"]
  const next = { ...existing }
  if (url && (!existing.url || existing.status === "active")) next.url = url
  if (categoryId && !existing.categories?.includes(categoryId)) {
    next.categories = [...new Set([...(existing.categories || []), categoryId])]
  }
  if (useCase) {
    if (!existing.summary_fr) next.summary_fr = useCase.endsWith(".") ? useCase : `${useCase}.`
    if (!existing.description_fr && next.summary_fr) {
      next.description_fr = `${next.summary_fr} Vérifie la page tarifs avant un déploiement en production.`
    }
  }
  const pricing = pricingFrom(row["Modèle de prix"], url || existing.url)
  if (!existing.pricing?.verified) next.pricing = { ...existing.pricing, ...pricing }
  next.lastVerified = VERIFIED
  if (geo.hqCountry) {
    next.hqCountry = geo.hqCountry
    next.hqCountrySource = geo.hqCountrySource
  }
  return next
}

function seedVerifiedFr() {
  let count = 0
  for (const id of VERIFIED_FR_IDS) {
    const tool = readTool(id)
    if (!tool) continue
    if (tool.hqCountry === "FR" && tool.hqCountrySource === "verified") continue
    writeTool({
      ...tool,
      hqCountry: "FR",
      hqCountrySource: "verified",
      lastVerified: tool.lastVerified || VERIFIED,
    })
    count++
  }
  return count
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
  const index = loadIndex()
  let created = 0
  let updated = 0
  const skippedVerify = []
  const skippedOther = []
  const hqByCountry = {}

  for (const row of rows) {
    const categoryId = CATEGORY_SLUG[row["Catégorie AItools.ninja"]]
    if (!categoryId) {
      throw new Error(`Unknown category "${row["Catégorie AItools.ninja"]}" for ${row.Nom}`)
    }
    const geo = parseHqCountry(row["Pays d'origine"])
    if (geo.skipped) {
      if (geo.reason === "verify") skippedVerify.push({ name: row.Nom, pays: geo.skipped })
      else skippedOther.push({ name: row.Nom, pays: geo.skipped, reason: geo.reason })
    }
    const existing = resolveExisting(row, index)
    if (existing) {
      const merged = mergeTool(existing, row, categoryId, geo)
      writeTool(merged)
      updated++
      index.byName.set(normName(merged.name), merged)
      const nu = normUrl(merged.url)
      if (nu) index.byUrl.set(nu, merged)
    } else {
      const id = pickNewId(row.Nom, row["Site officiel"])
      const tool = buildNewTool(row, id, categoryId, geo)
      writeTool(tool)
      index.files.add(id)
      index.byName.set(normName(tool.name), tool)
      const nu = normUrl(tool.url)
      if (nu) index.byUrl.set(nu, tool)
      created++
    }
    if (geo.hqCountry) {
      hqByCountry[geo.hqCountry] = (hqByCountry[geo.hqCountry] || 0) + 1
    }
  }

  const verifiedFr = seedVerifiedFr()

  // Count tools with hqCountry in catalogue (after import)
  const hqTotals = {}
  for (const file of fs.readdirSync(toolsDir).filter((f) => f.endsWith(".json"))) {
    const t = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8"))
    if (t.hqCountry) hqTotals[t.hqCountry] = (hqTotals[t.hqCountry] || 0) + 1
  }

  const toolCount = syncToolIds()

  console.log(
    JSON.stringify(
      {
        csvRows: rows.length,
        created,
        updated,
        verifiedFrPatched: verifiedFr,
        hqFromCsvByCountry: hqByCountry,
        hqInCatalogue: hqTotals,
        skippedVerify,
        skippedOther,
        toolFiles: toolCount,
      },
      null,
      2,
    ),
  )
}

main()
