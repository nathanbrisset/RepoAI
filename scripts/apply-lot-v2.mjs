#!/usr/bin/env node
/**
 * Apply the 24-category taxonomy, the reassignment of existing fiches,
 * and the new-tool lot. Source tables live in data/import-2026-10-21/.
 * Does not invent fields that are absent from those tables or from the fiche itself.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const importDir = path.join(root, "data/import-2026-10-21")
const toolsDir = path.join(root, "content/tools")

const CATEGORY_SLUG = {
  "LLM & Chatbots": "llm-chatbots",
  "AI Agents": "ai-agents",
  "Automation & Workflows": "automation",
  "Coding & Dev Tools": "coding",
  "No-code & App Builders": "no-code",
  "Writing & Content": "writing",
  "Image Generation & Editing": "image",
  Video: "video",
  "Voice & Speech": "voice",
  "Music & Audio": "music",
  "Design & UI": "design",
  "Meetings & Notes": "meetings",
  "Productivity & Workspace": "productivity",
  "Search & Research": "search",
  "Data & Analytics": "data",
  "Marketing & SEO": "marketing",
  "Sales & CRM": "sales",
  "Customer Support": "support",
  "HR & Recruiting": "hr",
  "Education & Learning": "education",
  "Health & Medical": "health",
  Legal: "legal",
  "Finance & Accounting": "finance",
  Security: "security",
}

const LEGACY_IDS = ["text", "audio", "data-processing"]
const HIDE_PRICE_AND_LOGO = new Set(["Dia", "Cleo", "Pi"])
const INACTIVE = new Set(["Fiscal.ai", "SciSpace"])
const KEPT_WITH_MENTION = new Set(["Coda", "Rows", "Gemini CLI"])
const METHOD = /headless browser|\bHTTP\s*\d{3}\b|\bcurl\b|automated request|rate-limit|rate limit|was read through|were read through|blocks automated|returned rate|prices were not readable|was not confirmed on the pricing page|could not be confirmed/i

function parseCSV(text) {
  const rows = []
  let row = []
  let cur = ""
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          cur += '"'
          i++
        } else quoted = false
      } else cur += char
    } else if (char === '"') quoted = true
    else if (char === ",") {
      row.push(cur)
      cur = ""
    } else if (char === "\n") {
      row.push(cur)
      rows.push(row)
      row = []
      cur = ""
    } else if (char !== "\r") cur += char
  }
  if (cur.length || row.length) {
    row.push(cur)
    rows.push(row)
  }
  return rows.filter((entry) => entry.some((cell) => cell.trim() !== ""))
}

function readTable(name) {
  const rows = parseCSV(fs.readFileSync(path.join(importDir, name), "utf8"))
  const header = rows[0]
  return rows.slice(1).map((cells) => Object.fromEntries(header.map((key, index) => [key, cells[index] ?? ""])))
}

function slug(name) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function splitSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!])\s+(?=[A-Z"“])/)
    .map((sentence) => sentence.trim())
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
      /* skip non-urls */
    }
  }
  return unique
}

function pricingSource(source) {
  return urlsFrom(source).find((url) => /pricing|\/plans\b|\/price\b/i.test(url))
}

function productSentences(text, hidePrice) {
  return splitSentences(text).filter((sentence) => {
    if (METHOD.test(sentence)) return false
    if (hidePrice && /\$\d|\bper month\b|pricing page|free tier|paid plan|paid AI|is free\b/i.test(sentence)) return false
    return true
  }).map((sentence) => (hidePrice ? sentence.replace(/\s+for free\b/gi, "") : sentence))
}

function howToFrom(name, url, description, useCases) {
  const sentences = productSentences(description, false)
  const steps = [
    {
      title: `Open ${name}`,
      description: `Open the official ${name} website.`,
      links: [{ label: name, url }],
    },
  ]
  const uses = (useCases || "")
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)
  for (const use of uses) {
    if (steps.length >= 4) break
    const intent = use.replace(/^I want to\s+/i, "").replace(/^I want\s+/i, "").replace(/\.$/, "")
    const title = intent.charAt(0).toUpperCase() + intent.slice(1)
    const words = intent.toLowerCase().split(/\W+/).filter((word) => word.length > 4)
    const match = sentences.find((sentence) => words.some((word) => sentence.toLowerCase().includes(word)))
    steps.push({
      title: title.length > 90 ? `${title.slice(0, 87).trim()}...` : title,
      description: match || sentences[0] || `Use ${name} to ${intent}.`,
    })
  }
  for (const sentence of sentences) {
    if (steps.length >= 4) break
    if (steps.some((step) => step.description === sentence)) continue
    const title = sentence.split(/[,:]/)[0].trim()
    steps.push({
      title: title.length > 90 ? `${title.slice(0, 87).trim()}...` : title,
      description: sentence,
    })
  }
  return steps.slice(0, 4)
}

const STOP = new Set(
  "about,with,from,that,this,your,into,onto,over,their,there,which,using,used,tool,tools,plan,plans,free,more,than,also,have,been,will,when,where,what,they,them,such,other,each,some,only,after,before,across,under,while,these,those,site,website,official,open,visit,users,user,helps,help,make,makes,made,create,creates,including,include,available".split(",")
)

function tokens(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((word) => word.length > 4 && !STOP.has(word))
}

function howToOverlaps(description, howToUse) {
  if (!Array.isArray(howToUse) || howToUse.length === 0) return false
  if (!howToUse.every((step) => step && step.title && step.description)) return false
  const described = new Set(tokens(description))
  const shared = new Set(tokens(howToUse.map((step) => `${step.title} ${step.description}`).join(" ")).filter((word) => described.has(word)))
  return shared.size >= 2
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

function pricingFor(row) {
  if (HIDE_PRICE_AND_LOGO.has(row.name)) return { verified: false, uncertain: true }
  const label = row.pricing.trim()
  const model = row.pricing_model.trim()
  if (!label && !model) return { verified: false, uncertain: true }
  let schemaModel
  let schemaLabel
  if (model === "one-time") {
    schemaModel = "one-time"
    schemaLabel = label === "Premium" ? "Premium" : "One-time"
  } else if (label === "Free" || model === "free") {
    schemaModel = "free"
    schemaLabel = "Free"
  } else if (label === "Freemium" || model === "freemium") {
    schemaModel = "freemium"
    schemaLabel = "Freemium"
  } else if (label === "Premium" || model === "paid") {
    schemaModel = "paid"
    schemaLabel = "Premium"
  } else if (label === "Enterprise" || model === "enterprise") {
    schemaModel = "enterprise"
    schemaLabel = "Enterprise"
  } else if (label === "Usage-based" || model === "usage-based") {
    schemaModel = "usage-based"
    schemaLabel = "Usage-based"
  } else {
    throw new Error(`Unmapped pricing for ${row.name}: ${label} / ${model}`)
  }
  const pricing = {
    model: schemaModel,
    label: schemaLabel,
    verified: /^\d{4}-\d{2}-\d{2}$/.test(row.pricing_verified_on.trim()),
  }
  if (row.price_from.trim()) pricing.note = row.price_from.trim()
  const sourceUrl = pricingSource(row.source)
  if (sourceUrl) pricing.sourceUrl = sourceUrl
  return pricing
}

function mention(name, text) {
  const sentences = splitSentences(text)
  if (name === "Coda") return sentences.find((sentence) => /Superhuman Docs/i.test(sentence)) || ""
  if (name === "Rows") return sentences.find((sentence) => /joined Superhuman/i.test(sentence)) || ""
  if (name === "Gemini CLI") return sentences.find((sentence) => /Antigravity CLI/i.test(sentence)) || ""
  return ""
}

function checkedOn(row) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(row.pricing_verified_on.trim())) return row.pricing_verified_on.trim()
  const match = row.source.match(/\d{4}-\d{2}-\d{2}/)
  return match ? match[0] : null
}

const taxonomyRows = readTable("taxonomy.csv")
const audienceLabels = new Map(
  taxonomyRows.filter((row) => row.row_type === "audience").map((row) => [row.id, row.label])
)
const categories = taxonomyRows
  .filter((row) => row.row_type === "category")
  .map((row) => {
    const id = CATEGORY_SLUG[row.label]
    if (!id) throw new Error(`No slug for ${row.label}`)
    const audiences = row.audiences
      .split(";")
      .map((item) => audienceLabels.get(item.trim()) || item.trim())
      .filter(Boolean)
    return {
      id,
      code: row.id,
      name: row.label,
      description: row.use_cases.trim(),
      about: `Subcategories: ${row.subcategories.trim()}. Audiences: ${audiences.join(", ")}.`,
      subcategories: row.subcategories.split(";").map((item) => item.trim()).filter(Boolean),
      tags: row.tags.split(";").map((item) => item.trim()).filter(Boolean),
    }
  })

if (categories.length !== 24) throw new Error(`Expected 24 categories, got ${categories.length}`)
writeJson(path.join(root, "content/taxonomy.json"), { categories, legacyIds: LEGACY_IDS })

const allowed = new Set([...categories.map((category) => category.id), ...LEGACY_IDS])
const reassignment = readTable("reaffectation-existants.csv")
const byId = new Map(reassignment.map((row) => [row.id, row]))
let reassigned = 0
let howToFilled = 0

for (const file of fs.readdirSync(toolsDir).filter((name) => name.endsWith(".json"))) {
  const abs = path.join(toolsDir, file)
  const tool = JSON.parse(fs.readFileSync(abs, "utf8"))
  let mutated = false
  const row = byId.get(tool.id)
  if (row) {
    const categoryId = CATEGORY_SLUG[row.new_category]
    if (!categoryId) throw new Error(`Unknown category ${row.new_category} on ${tool.id}`)
    const tags = row.normalized_tags.split(";").map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-")).filter(Boolean)
    if (!tags.length) throw new Error(`No tags for ${tool.id}`)
    tool.categories = [categoryId]
    tool.tags = tags
    reassigned++
    mutated = true
  } else if (tool.id === "mp3tomidi") {
    // Not in the reassignment table. Existing tags are Music Production / MIDI,
    // and the taxonomy maps music audio to Music & Audio.
    tool.categories = ["music"]
    mutated = true
  }
  if (tool.status === "active" && !howToOverlaps(tool.description || tool.summary, tool.howToUse)) {
    tool.howToUse = howToFrom(tool.name, tool.url, tool.description || tool.summary, "")
    howToFilled++
    mutated = true
  }
  for (const category of tool.categories) {
    if (!allowed.has(category)) throw new Error(`${tool.id} still uses unknown category ${category}`)
  }
  if (mutated) writeJson(abs, tool)
}

if (reassigned !== 304) throw new Error(`Reassigned ${reassigned}, expected 304`)

const lot = readTable("grand-lot-v2.csv")
const existingIds = new Set(fs.readdirSync(toolsDir).filter((name) => name.endsWith(".json")).map((name) => name.replace(/\.json$/, "")))
let added = 0
const addedIds = []
const mentions = {}

for (const row of lot) {
  const id = slug(row.name)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error(`Bad id ${id} from ${row.name}`)
  if (existingIds.has(id)) {
    const current = JSON.parse(fs.readFileSync(path.join(toolsDir, `${id}.json`), "utf8"))
    if (current.name !== row.name) throw new Error(`Id collision ${id}`)
  }
  const categoryId = CATEGORY_SLUG[row.category]
  if (!categoryId) throw new Error(`Unknown lot category ${row.category} on ${row.name}`)
  const url = (row.official_url_final || row.official_url).trim()
  new URL(url)
  const hide = HIDE_PRICE_AND_LOGO.has(row.name)
  const sentences = productSentences(row.long_description, hide)
  const summarySentences = productSentences(row.short_description, hide)
  const description = sentences.join(" ") || summarySentences.join(" ")
  const summary = summarySentences.join(" ") || description
  if (!description || !summary) throw new Error(`Empty copy for ${row.name}`)
  const tags = row.tags.split(";").map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-")).filter(Boolean)
  if (!tags.length) throw new Error(`No tags for ${row.name}`)
  const statusNote = KEPT_WITH_MENTION.has(row.name) ? mention(row.name, row.long_description) : ""
  if (KEPT_WITH_MENTION.has(row.name) && !statusNote) throw new Error(`Missing kept mention for ${row.name}`)
  if (statusNote) mentions[id] = statusNote
  const sources = urlsFrom(row.source)
  const tool = {
    id,
    name: row.name,
    url,
    affiliateUrl: "",
    status: INACTIVE.has(row.name) ? "inactive" : "active",
    ...(statusNote ? { statusNote } : {}),
    summary,
    description,
    categories: [categoryId],
    tags,
    pricing: pricingFor(row),
    logo: hide ? "" : row.logo_url.trim(),
    image: "",
    dateAdded: null,
    lastVerified: checkedOn(row),
    ...(sources.length ? { sources } : {}),
    howToUse: howToFrom(row.name, url, description, row.use_cases),
  }
  writeJson(path.join(toolsDir, `${id}.json`), tool)
  added++
  addedIds.push(id)
}

const sitemapPath = path.join(root, "public/sitemap.xml")
let sitemap = fs.readFileSync(sitemapPath, "utf8")
const locs = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]))
let extra = ""
function addLoc(loc, lastmod) {
  if (locs.has(loc)) return
  locs.add(loc)
  extra += `  <url>\n    <loc>${loc}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}  </url>\n`
}
addLoc("https://aitools.ninja/categories")
for (const category of categories) addLoc(`https://aitools.ninja/categories/${category.id}`)
for (const file of fs.readdirSync(toolsDir).filter((name) => name.endsWith(".json"))) {
  const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8"))
  if (tool.status !== "active") continue
  addLoc(`https://aitools.ninja/tool/${tool.id}`, tool.lastVerified || undefined)
}
if (!sitemap.includes("</urlset>")) throw new Error("sitemap has no urlset close")
sitemap = sitemap.replace("</urlset>", `${extra}</urlset>`)
fs.writeFileSync(sitemapPath, sitemap)

const activeHow = fs.readdirSync(toolsDir).filter((name) => name.endsWith(".json")).filter((file) => {
  const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8"))
  return tool.status === "active" && Array.isArray(tool.howToUse) && tool.howToUse.length > 0
}).length

const stats = {
  added,
  reassigned,
  howToFilledOnExisting: howToFilled,
  activeWithHowTo: activeHow,
  inactive: [...INACTIVE],
  hiddenPriceAndLogo: [...HIDE_PRICE_AND_LOGO],
  mentions,
  addedIds,
}
writeJson(path.join(root, "scripts/lot-v2-stats.json"), stats)
console.log(JSON.stringify({ added, reassigned, howToFilled, activeWithHowTo: activeHow, mentions: Object.keys(mentions) }, null, 2))
