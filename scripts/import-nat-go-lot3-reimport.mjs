#!/usr/bin/env node
/**
 * Nat GO Lot 3 reimport — upsert 197 tools from semicolon CSV + quality fixes:
 * FR howToUse (tutoiement), meaningful tags, pricing notes, CSV field sync.
 *
 *   node scripts/import-nat-go-lot3-reimport.mjs [path/to.csv]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { frPath, toolsDir } from "./about-quality-lib.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolIdsPath = path.join(root, "content/tool-ids.json")
const tagsPath = path.join(root, "lib/i18n/tags.ts")
const defaultCsv = path.join(root, "data/import-2026-10-30/lot3-197-tools.csv")
const csvPath = process.argv.find((a) => a.endsWith(".csv")) || defaultCsv
const VERIFIED = "2026-10-30"

const TAGS_FR = Object.fromEntries(
  [...fs.readFileSync(tagsPath, "utf8").matchAll(/^\s+([A-Za-z0-9_-]+|"[^"]+"):\s+"([^"]*)",/gm)].map((m) => {
    const key = m[1].startsWith('"') ? JSON.parse(m[1]) : m[1]
    return [key, m[2]]
  }),
)

const CATEGORY_TAGS = {
  "llm-chatbots": ["chatbot", "llm", "assistant"],
  "ai-agents": ["ai-agents", "agents", "automation"],
  automation: ["automation", "workflow", "integrations"],
  coding: ["developer", "code", "ide"],
  "no-code": ["no-code", "app-builder"],
  writing: ["writing", "content"],
  image: ["image-generation", "creative"],
  video: ["video", "creative"],
  voice: ["voice", "speech"],
  music: ["music", "audio"],
  design: ["design", "ui"],
  meetings: ["meetings", "notes"],
  productivity: ["productivity", "workspace"],
  search: ["search", "research"],
  data: ["data", "analytics"],
  marketing: ["marketing", "seo"],
  sales: ["sales", "crm"],
  support: ["support", "customer-service"],
  hr: ["hr", "recruiting"],
  education: ["education", "learning"],
  health: ["health", "medical"],
  legal: ["legal"],
  finance: ["finance", "accounting"],
  security: ["security"],
  "ai-detection": ["ai-detection", "content"],
}

const GENERIC_TAGS = new Set(["ai", "catalog", "tool"])

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

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return "le site officiel"
  }
}

function clipTitle(text, max = 78) {
  const t = (text || "").split(/[:|]/)[0].trim()
  if (!t) return "Étape suivante"
  return t.length > max ? `${t.slice(0, max - 1).trim()}…` : t
}

function pricingFrom(prix, url) {
  const text = (prix || "").trim()
  const base = { verified: false, sourceUrl: url || undefined }

  if (/^free$/i.test(text)) {
    return {
      ...base,
      model: "free",
      label: "Free",
      note: "Free; check the official site for limits or paid add-ons.",
      note_fr: "Gratuit ; vérifie sur le site les limites ou options payantes.",
    }
  }
  if (/freemium/i.test(text)) {
    return {
      ...base,
      model: "freemium",
      label: "Freemium",
      note: "Freemium; paid tiers and limits are listed on the official site.",
      note_fr: "Freemium : consulte le site officiel pour les limites et offres payantes.",
    }
  }
  if (/^premium$/i.test(text) || /payant/i.test(text)) {
    return {
      ...base,
      model: "paid",
      label: "Premium",
      note: "Paid plans; see the official site for current pricing.",
      note_fr: "Offre payante ; consulte la page tarifs pour les formules en vigueur.",
    }
  }
  if (/enterprise/i.test(text)) {
    return {
      ...base,
      model: "enterprise",
      label: "Enterprise",
      note: "Enterprise pricing; contact sales or see the official site.",
      note_fr: "Offre entreprise ; contacte l'éditeur ou consulte le site pour un devis.",
    }
  }
  if (/open\s*source/i.test(text)) {
    return {
      ...base,
      model: "open-source",
      label: "Open source",
      note: "Open source; hosting, cloud or support plans may apply.",
      note_fr: "Open source ; l'hébergement ou les services cloud peuvent être payants selon ton déploiement.",
    }
  }
  if (/usage[- ]based/i.test(text)) {
    return {
      ...base,
      model: "usage-based",
      label: "Usage-based",
      note: "Usage-based billing; see the pricing page for meters and quotas.",
      note_fr: "Facturation à l'usage ; consulte la page tarifs pour les quotas et le détail.",
    }
  }
  return {
    uncertain: true,
    verified: false,
    note: text || "Pricing not mapped from import.",
    note_fr: text
      ? `Tarif « ${text} » ; vérifie la page officielle avant un usage en production.`
      : "Tarif non confirmé ; consulte le site officiel.",
  }
}

function parseHqCountry(pays) {
  const iso = (pays || "").trim().toUpperCase()
  if (!iso || !/^[A-Z]{2}$/.test(iso)) return {}
  return { hqCountry: iso, hqCountrySource: "import" }
}

function slugTags(id) {
  return id
    .split("-")
    .map((w) => w.toLowerCase())
    .filter((w) => w.length > 2 && !["api", "app", "pro", "dev"].includes(w))
    .slice(0, 2)
}

function buildTags(id, categoryId) {
  const catTags = CATEGORY_TAGS[categoryId] || [categoryId.replace(/-and-.*/, "").split("-")[0]]
  const merged = [...new Set([...catTags, ...slugTags(id)])].filter((t) => t && !GENERIC_TAGS.has(t))
  if (merged.length < 2) merged.push(...catTags.filter((t) => !GENERIC_TAGS.has(t)))
  return [...new Set(merged)].slice(0, 5)
}

function translateTag(tag) {
  return TAGS_FR[tag] || tag
}

function buildHowToEn(name, url, features) {
  const host = hostOf(url)
  const feats = (features || []).slice(0, 2)
  const steps = [
    {
      title: `Open ${name}`,
      description: `Go to ${host}, then sign up or start a free trial if one is offered.`,
      links: [{ label: name, url }],
    },
    {
      title: "Set up your workspace",
      description: "Complete onboarding, preferences, or the first integration the product asks for.",
    },
  ]
  for (const feat of feats) {
    const label = clipTitle(feat, 70)
    steps.push({
      title: label,
      description: `Use ${label.toLowerCase()} on a small sample project before scaling up.`,
    })
  }
  while (steps.length < 4) {
    steps.push({
      title: "Review and connect",
      description: "Export, share, or plug the tool into your stack once the first run looks good.",
    })
  }
  return steps.slice(0, 4)
}

function buildHowToFr(name, url, featuresFr) {
  const host = hostOf(url)
  const feats = (featuresFr || []).slice(0, 2)
  const steps = [
    {
      title: `Ouvre ${name}`,
      description: `Rends-toi sur ${host}, puis crée un compte ou lance l'essai gratuit si c'est proposé.`,
      links: [{ label: name, url }],
    },
    {
      title: "Configure ton espace",
      description: "Complète l'onboarding, tes préférences ou la première intégration demandée par le produit.",
    },
  ]
  for (const feat of feats) {
    const label = clipTitle(feat, 70)
    steps.push({
      title: label,
      description: `Active « ${label} » sur un petit exemple concret avant d'étendre l'usage ou d'automatiser.`,
    })
  }
  while (steps.length < 4) {
    steps.push({
      title: "Contrôle et branche",
      description: "Exporte, partage ou connecte l'outil au reste de ta stack une fois le premier test concluant.",
    })
  }
  return steps.slice(0, 4)
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
  const tags = buildTags(id, categoryId)
  const pricing = pricingFrom(row.prix, url)
  const howToUse = buildHowToEn(name, url, features)
  const howToUse_fr = buildHowToFr(name, url, features_fr)

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
    tags,
    tags_fr: tags.map(translateTag),
    pricing,
    logo: `/logos/${id}.png`,
    image: "",
    dateAdded: VERIFIED,
    lastVerified: VERIFIED,
    features,
    features_fr,
    howToUse,
    howToUse_fr,
    ...geo,
  }
}

function mergeExisting(existing, fresh) {
  const next = { ...existing, ...fresh }
  next.logo = existing.logo?.trim() ? existing.logo : fresh.logo
  next.image = existing.image?.trim() ? existing.image : fresh.image
  next.dateAdded = existing.dateAdded || fresh.dateAdded
  if (existing.sources?.length) next.sources = existing.sources
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
    const fresh = buildFromRow(row)
    const tool = existing ? mergeExisting(existing, fresh) : fresh
    writeJson(path.join(toolsDir, `${tool.id}.json`), tool)
    if (existing) updated++
    else created++

    if (!fr[tool.id]) fr[tool.id] = {}
    fr[tool.id].summary_fr = tool.summary_fr
    fr[tool.id].description_fr = tool.description_fr
    fr[tool.id].features_fr = tool.features_fr
    fr[tool.id].howToUse_fr = tool.howToUse_fr
    fr[tool.id].tags_fr = tool.tags_fr
    if (tool.pricing?.note_fr) fr[tool.id].pricingNote_fr = tool.pricing.note_fr
  }

  writeJson(frPath, fr)
  const toolCount = syncToolIds()

  const reportPath = path.join(root, "data/import-2026-10-30/lot3-reimport-report.json")
  const report = {
    csvRows: rows.length,
    created,
    updated,
    toolFiles: toolCount,
    ids,
    verified: VERIFIED,
  }
  writeJson(reportPath, report)
  console.log(JSON.stringify(report, null, 2))
}

main()
