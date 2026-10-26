/**
 * Import the automation-tools CSV into catalog fiches and the /automations guide.
 * English editorial fields are copied from the CSV. French fields come from
 * content/automations/fr-copy.json (a translation of those fields, not new claims).
 *
 *   node scripts/import-automation-tools.mjs
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const csvPath = path.join(root, "content/automations/2026-10-26-automations-tools-v2.csv")
const frPath = path.join(root, "content/automations/fr-copy.json")
const toolsDir = path.join(root, "content/tools")

const ID_BY_NAME = {
  Workato: "workato",
  "Tray.ai": "tray-ai",
  UiPath: "uipath",
  "Automation Anywhere": "automation-anywhere",
  "Pabbly Connect": "pabbly-connect",
  Albato: "albato",
  Integrately: "integrately",
  Latenode: "latenode",
  "Prowork by Parabola": "prowork",
  Tines: "tines",
  Windmill: "windmill",
  Kestra: "kestra",
  "Node-RED": "node-red",
  "Axiom.ai": "axiom-ai",
  n8n: "n8n",
  Zapier: "zapier",
  Make: "make",
  Activepieces: "activepieces",
  Pipedream: "pipedream",
  IFTTT: "ifttt",
  "Microsoft Power Automate": "microsoft-power-automate",
  Gumloop: "gumloop",
  Lindy: "lindy",
  "Relevance AI": "relevance-ai",
  Dify: "dify",
  Langflow: "langflow",
  Bardeen: "bardeen",
  "Browser Use": "browser-use",
  Skyvern: "skyvern",
}

const PINNED = ["n8n", "zapier", "make"]

const SUBCATEGORY_FR = {
  "iPaaS & enterprise integration": "iPaaS et intégration d'entreprise",
  "RPA & agentic automation": "RPA et automatisation agentique",
  "No-code workflow automation": "Automatisation no-code",
  "AI workflow automation": "Workflows IA",
  "Security & IT automation": "Automatisation sécurité et IT",
  "Developer workflow orchestration": "Orchestration pour développeurs",
  "Browser automation": "Automatisation de navigateur",
  "AI agents for work": "Agents IA pour le travail",
}

const AUDIENCE_FR = {
  "IT teams": "Équipes IT",
  Enterprises: "Entreprises",
  Developers: "Développeurs",
  "Operations teams": "Équipes opérations",
  "Automation developers": "Développeurs automation",
  "Small businesses": "Petites entreprises",
  SMBs: "PME",
  Solopreneurs: "Indépendants",
  Agencies: "Agences",
  "SaaS companies": "Éditeurs SaaS",
  "Non-technical users": "Utilisateurs non techniques",
  "Automation builders": "Concepteurs d'automatisations",
  "E-commerce businesses": "Entreprises e-commerce",
  "Security teams": "Équipes sécurité",
  "Data engineers": "Ingénieurs data",
  "Platform teams": "Équipes plateforme",
  Makers: "Makers",
  "Industrial engineers": "Ingénieurs industriels",
  Marketers: "Marketeurs",
  Researchers: "Chercheurs",
  "Technical teams": "Équipes techniques",
  "Ops teams": "Équipes ops",
  "Non-technical teams": "Équipes non techniques",
  Consumers: "Particuliers",
  Creators: "Créateurs",
  "Microsoft 365 organisations": "Organisations Microsoft 365",
  "Business teams": "Équipes métier",
  Professionals: "Professionnels",
  "Small teams": "Petites équipes",
  "AI teams": "Équipes IA",
  "Sales teams": "Équipes commerciales",
  Teams: "Équipes",
}

const WORKS_WITH_EN = {
  workato: "CRM, ERP and HR apps",
  "tray-ai": "700+ apps, MCP, Claude Code, Codex",
  uipath: "Desktop and web applications",
  "automation-anywhere": "Business systems",
  "pabbly-connect": "Forms, CRMs, email tools",
  albato: "Marketing, CRM and sales apps",
  integrately: "Calendly, Pipedrive, MailerLite, Freshdesk",
  latenode: "5,500+ apps, MCP",
  prowork: "Shopify, NetSuite, ShipHero",
  tines: "Sensitive systems and connectors",
  windmill: "GitHub, GitLab",
  kestra: "2,300+ plugins",
  "node-red": "Devices, APIs, online services",
  "axiom-ai": "Websites, via Chrome, an API or Claude",
  n8n: "500+ integrations, HTTP APIs",
  zapier: "9,000+ apps, including forms, CRMs and Slack",
  make: "Thousands of apps",
  activepieces: "760+ app connectors, MCP",
  pipedream: "3,000+ APIs",
  ifttt: "1,000+ services, Discord, Slack, smart home",
  "microsoft-power-automate": "Microsoft 365 and cloud apps",
  gumloop: "Slack, Gmail, CRMs",
  lindy: "Gmail, Slack, Notion, HubSpot",
  "relevance-ai": "Company tools",
  dify: "Deployed as apps or APIs",
  langflow: "Models, vector stores, MCP",
  bardeen: "Websites, spreadsheets, CRMs",
  "browser-use": "Websites, Playwright, Puppeteer",
  skyvern: "Web portals, including 2FA",
}

const MODEL_LABEL = {
  enterprise: "Enterprise",
  paid: "Premium",
  freemium: "Freemium",
  "one-time": "One-time",
  "usage-based": "Usage-based",
  free: "Free",
}

function parseCsv(csv) {
  const rows = []
  let row = []
  let cur = ""
  let quoted = false
  for (let i = 0; i < csv.length; i++) {
    const char = csv[i]
    if (quoted) {
      if (char === '"') {
        if (csv[i + 1] === '"') {
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
  const headers = rows[0]
  return rows.slice(1).filter((cells) => cells.some(Boolean)).map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] || ""])))
}

function sentences(text) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 40)
}

function clipTitle(text) {
  const title = text.split(/[,:]/)[0].trim()
  return title.length > 90 ? `${title.slice(0, 87).trim()}...` : title
}

function howTo(name, url, description, how) {
  const steps = [
    {
      title: `Open ${name}`,
      description: how,
      links: [{ label: name, url }],
    },
  ]
  for (const bit of sentences(description).slice(0, 3)) {
    steps.push({ title: clipTitle(bit), description: bit })
  }
  return steps
}

function howToFr(name, url, description, how) {
  const steps = [
    {
      title: `Ouvrir ${name}`,
      description: how,
      links: [{ label: name, url }],
    },
  ]
  for (const bit of sentences(description).slice(0, 3)) {
    steps.push({ title: clipTitle(bit), description: bit })
  }
  return steps
}

function signals(row) {
  const blob = [row.tags, row.short_description, row.long_description, row.use_case, row.why_choose, row.how_to_start].join("\n")
  const openSource = /(^|;)open-source(;|$)/.test(row.tags) || /open[- ]source/i.test(blob)
  const selfHost = /self-host/i.test(blob) || (/open-source/i.test(row.how_to_start) && /yourself/i.test(row.how_to_start))
  const onPrem = /on-prem/i.test(blob)
  return { openSource, selfHost, onPrem }
}

function httpsUrl(value) {
  const trimmed = value.trim()
  if (!/^https:\/\//.test(trimmed)) return ""
  try {
    return new URL(trimmed).href
  } catch {
    return ""
  }
}

function audienceFr(value) {
  return value
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      if (!AUDIENCE_FR[part]) throw new Error(`Missing French audience: ${part}`)
      return AUDIENCE_FR[part]
    })
    .join(" · ")
}

const rows = parseCsv(fs.readFileSync(csvPath, "utf8"))
const french = JSON.parse(fs.readFileSync(frPath, "utf8"))
if (rows.length !== 29) throw new Error(`Expected 29 tools, found ${rows.length}`)

const guides = []
let created = 0

for (const row of rows) {
  const id = ID_BY_NAME[row.name]
  if (!id) throw new Error(`No id for ${row.name}`)
  const copy = french[row.name]
  if (!copy?.pitch || !copy.use || !copy.why || !copy.how || !copy.worksWith) throw new Error(`Incomplete French copy for ${row.name}`)
  if (!SUBCATEGORY_FR[row.subcategory]) throw new Error(`Missing subcategory translation: ${row.subcategory}`)
  if (!WORKS_WITH_EN[id]) throw new Error(`Missing works-with for ${id}`)
  const label = MODEL_LABEL[row.pricing_model]
  if (!label) throw new Error(`Unknown pricing model ${row.pricing_model} for ${row.name}`)
  const { openSource, selfHost, onPrem } = signals(row)
  const sourceUrl = httpsUrl(row.source.split(";")[0])
  guides.push({
    id,
    name: row.name,
    url: row.official_url_final,
    logo: row.logo_url,
    subcategory: { en: row.subcategory, fr: SUBCATEGORY_FR[row.subcategory] },
    pitch: { en: row.short_description, fr: copy.pitch },
    audience: { en: row.audience.split(";").map((part) => part.trim()).filter(Boolean).join(" · "), fr: audienceFr(row.audience) },
    pricingBadge: row.pricing || label,
    priceFrom: row.price_from,
    worksWith: { en: WORKS_WITH_EN[id], fr: copy.worksWith },
    openSource,
    selfHost,
    onPrem,
    use: { en: row.use_case, fr: copy.use },
    why: { en: row.why_choose, fr: copy.why },
    how: { en: row.how_to_start, fr: copy.how },
    pinned: PINNED.includes(id),
    status: row.status,
  })

  if (row.status !== "new") continue
  const file = path.join(toolsDir, `${id}.json`)
  const description = row.long_description.trim()
  const tool = {
    id,
    name: row.name,
    url: row.official_url_final,
    affiliateUrl: "",
    status: "active",
    summary: row.short_description,
    description,
    summary_fr: copy.pitch,
    description_fr: copy.description,
    categories: ["automation"],
    tags: row.tags.split(";").map((tag) => tag.trim()).filter(Boolean),
    pricing: {
      model: row.pricing_model,
      label,
      verified: true,
      ...(row.price_from ? { note: row.price_from } : {}),
      ...(sourceUrl ? { sourceUrl } : {}),
    },
    logo: row.logo_url,
    image: `/screenshots/${id}.webp`,
    dateAdded: "2026-10-26",
    lastVerified: row.pricing_verified_on,
    sources: [row.official_url_final, sourceUrl].filter((url, index, all) => url && all.indexOf(url) === index),
    features: row.use_cases.split(";").map((feature) => feature.trim()).filter(Boolean),
    howToUse: howTo(row.name, row.official_url_final, description, row.how_to_start),
    howToUse_fr: howToFr(row.name, row.official_url_final, copy.description, copy.how),
  }
  if (!copy.description) throw new Error(`Missing French description for new tool ${row.name}`)
  fs.writeFileSync(file, `${JSON.stringify(tool, null, 2)}\n`)
  created++
}

fs.writeFileSync(path.join(root, "content/automations/guides.json"), `${JSON.stringify({ source: "content/automations/2026-10-26-automations-tools-v2.csv", tools: guides }, null, 2)}\n`)

const ensureAutomation = ["lindy", "relevance-ai", "dify", "langflow", "bardeen", "browser-use", "skyvern"]
for (const id of ensureAutomation) {
  const file = path.join(toolsDir, `${id}.json`)
  const tool = JSON.parse(fs.readFileSync(file, "utf8"))
  if (!tool.categories.includes("automation")) tool.categories.push("automation")
  fs.writeFileSync(file, `${JSON.stringify(tool, null, 2)}\n`)
}

function patch(id, mutate) {
  const file = path.join(toolsDir, `${id}.json`)
  const tool = JSON.parse(fs.readFileSync(file, "utf8"))
  mutate(tool)
  fs.writeFileSync(file, `${JSON.stringify(tool, null, 2)}\n`)
}

patch("n8n", (tool) => {
  tool.pricing.note = "$20/mo (Starter, billed annually); self-host free"
  tool.pricing.sourceUrl = "https://n8n.io/pricing"
  tool.pricing.verified = true
  tool.lastVerified = "2026-10-26"
})

patch("lindy", (tool) => {
  tool.description = tool.description.replace(
    "after that paid plans start at $29.99/month for 3,000 credits.",
    "after that the Team plan starts at $49.99 per month for 5,000 credits.",
  )
  tool.pricing.model = "freemium"
  tool.pricing.label = "Freemium"
  tool.pricing.note = "$49.99/mo (Team, 5,000 credits); $50 free credits valid for 7 days, no card required."
  tool.pricing.sourceUrl = "https://www.lindy.ai/pricing"
  tool.pricing.verified = true
  tool.lastVerified = "2026-10-26"
})

patch("dify", (tool) => {
  tool.pricing.note = "Free Sandbox (200 message credits). Paid plans add message credits and team members."
  tool.pricing.sourceUrl = "https://dify.ai/pricing"
  tool.lastVerified = "2026-10-26"
})

const ids = fs.readdirSync(toolsDir).filter((name) => name.endsWith(".json")).map((name) => name.replace(/\.json$/, "")).sort()
fs.writeFileSync(path.join(root, "content/tool-ids.json"), `${JSON.stringify(ids, null, 2)}\n`)

const pinned = guides.filter((guide) => guide.pinned).map((guide) => guide.id)
if (pinned.join(",") !== "n8n,zapier,make") throw new Error(`Pin order drifted: ${pinned.join(",")}`)
console.log(`Wrote ${guides.length} guides, created ${created} fiches, tool-ids ${ids.length}`)
