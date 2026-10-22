/**
 * Apply the two PM-validated catalog files onto content/tools.
 *
 * Audit rows are field patches: an empty cell does not wipe existing text.
 * Lot v3 is applied second, so flagship rows win.
 * Removes set status "sunset" and keep the file.
 *
 * Usage: node scripts/apply-pm-csvs.mjs [audit.csv] [lot.csv]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dir = path.join(root, "content", "tools")
const logoDir = path.join(root, "public", "logos")
const auditPath = process.argv[2] || "/home/ubuntu/.cursor/projects/workspace/uploads/2026-10-21-audit-existants_9c52.csv"
const lotPath = process.argv[3] || "/home/ubuntu/.cursor/projects/workspace/uploads/2026-10-21-lot-v3_2ea0.csv"
const VERIFIED = "2026-10-21"

const RENAME_ON_REDIRECT = new Set([
  "Podcastle",
  "CodiumAI",
  "MindsDB",
  "PaintsChainer",
  "Phrasee",
  "MobileMonkey",
  "Autopilot",
  "Sendinblue",
  "Vidyo.ai",
  "Munch",
  "Hugo AI",
  "Replit Ghostwriter",
])

const REMOVE_SUCCESSOR = {
  "Conversion.ai": "jasper",
  Codeium: "devin",
  "Perplexity Labs": "perplexity-ai",
  "DataRobot Code": "datarobot",
  Designify: "canva-ai",
}

function parseCsv(text) {
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
  const headers = rows[0]
  return rows
    .slice(1)
    .filter((r) => r.some((value) => value && value.trim()))
    .map((r) => Object.fromEntries(headers.map((header, index) => [header, r[index] ?? ""])))
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

function ensureUrl(value) {
  const text = (value || "").trim()
  if (!/^https?:\/\//i.test(text)) return ""
  try {
    const url = new URL(text)
    if (url.protocol !== "https:" && url.protocol !== "http:") return ""
    return text
  } catch {
    return ""
  }
}

function extractUrls(text) {
  if (!text) return []
  const found = text.match(/https?:\/\/[^\s<>"']+/g) || []
  const urls = []
  for (let raw of found) {
    raw = raw.replace(/&gt;?/gi, "").replace(/[),.;:]+$/g, "")
    const url = ensureUrl(raw)
    if (url) urls.push(url)
  }
  return [...new Set(urls)]
}

function looseSourceUrl(text, fallback) {
  const explicit = extractUrls(text)
  const priced = explicit.find((url) => /pric|plan|subscription/i.test(url))
  if (priced) return priced
  if (explicit[0]) return explicit[0]
  const mention = (text || "").match(/\b((?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s,;:)]*)?)/i)
  if (mention) {
    const url = ensureUrl(`https://${mention[1].replace(/[.,;]+$/g, "")}`)
    if (url) return url
  }
  return ensureUrl(fallback) || undefined
}

function categoryOf(value) {
  const key = (value || "").trim().toLowerCase()
  const map = {
    text: "text",
    image: "image",
    audio: "audio",
    video: "video",
    coding: "coding",
    marketing: "marketing",
    productivity: "productivity",
    design: "design",
    "data processing": "data-processing",
    "data-processing": "data-processing",
  }
  return map[key] || ""
}

function tagsOf(value) {
  return (value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function pricingFrom(label, verifiedOn, note, sourceUrl) {
  const map = {
    Free: ["free", "Free"],
    Freemium: ["freemium", "Freemium"],
    Premium: ["paid", "Premium"],
    "Open source": ["open-source", "Open source"],
  }
  const pair = map[(label || "").trim()]
  if (!pair) return null
  const pricing = {
    model: pair[0],
    label: pair[1],
    verified: Boolean((verifiedOn || "").trim()),
    note: (note || "").trim(),
  }
  if (sourceUrl) pricing.sourceUrl = sourceUrl
  return pricing
}

function priceSentences(row) {
  const long = row.long_description || ""
  const picked = long
    .split(/(?<=\.)\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => /\$|€|EUR|free tier|paid|plan|credit|subscription/i.test(sentence))
  if (picked.length) return picked.join(" ")
  const source = (row.source || "").trim()
  if (source) return source
  const when = (row.pricing_verified_on || "").trim()
  return `${row.pricing} on the validated check${when ? ` (${when})` : ""}.`
}

function affiliateOf(value) {
  return extractUrls(value)[0] || ""
}

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function writeTool(tool) {
  const clean = {}
  for (const [key, value] of Object.entries(tool)) {
    if (value !== undefined) clean[key] = value
  }
  const file = path.join(dir, `${clean.id}.json`)
  const next = `${JSON.stringify(clean, null, 2)}\n`
  const prev = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : ""
  if (prev !== next) fs.writeFileSync(file, next)
}

function loadTools() {
  const tools = new Map()
  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith(".json"))) {
    const tool = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"))
    tools.set(tool.id, tool)
  }
  return tools
}

function indexes(tools) {
  const byName = new Map()
  const byUrl = new Map()
  for (const tool of tools.values()) {
    const name = normName(tool.name)
    if (!byName.has(name)) byName.set(name, [])
    byName.get(name).push(tool.id)
    const url = normUrl(tool.url)
    if (!url) continue
    if (!byUrl.has(url)) byUrl.set(url, [])
    byUrl.get(url).push(tool.id)
  }
  return { byName, byUrl }
}

function unique(values) {
  return [...new Set(values)]
}

function lookupIds(row, byName, byUrl) {
  const nameHits = byName.get(normName(row.name)) || []
  const urls = [normUrl(row.official_url), normUrl(row.official_url_final)].filter(Boolean)
  const urlHits = unique(urls.flatMap((url) => byUrl.get(url) || []))
  if (nameHits.length === 1) return nameHits
  if (nameHits.length > 1) {
    const overlap = nameHits.filter((id) => urlHits.includes(id))
    return overlap.length === 1 ? overlap : { ambiguous: nameHits }
  }
  if (urlHits.length === 1) return urlHits
  if (urlHits.length > 1) return { ambiguous: urlHits }
  return []
}

function auditTargets(row, byName, byUrl) {
  if (row.name === "Otter.ai" && row.status === "remove") return ["otter"]
  if (row.name === "Otter.ai" && row.status === "update") return ["otterai"]
  if (row.name === "DALL·E" && row.status === "remove") return ["dalle", "dalle_3"]
  if (row.name === "Replit Ghostwriter") return ["replit-ghostwriter"]
  if (row.name === "Perplexity AI" && row.status === "update") {
    return ["perplexity-ai"]
  }
  return lookupIds(row, byName, byUrl)
}

function applyAuditUpdate(tool, row) {
  const source = (row.source || "").trim()
  if (tool.status === "sunset" || tool.status === "duplicate-of") {
    tool.status = "active"
    delete tool.successorId
  }

  const pricing = pricingFrom(
    row.pricing,
    row.pricing_verified_on,
    source,
    looseSourceUrl(source, row.official_url_final || row.official_url),
  )
  if (pricing) {
    tool.pricing = pricing
    if (tool.status === "active") delete tool.statusNote
  }

  const finalUrl = ensureUrl(row.official_url_final)
  const hostChanged = finalUrl && hostOf(finalUrl) !== hostOf(tool.url)
  if (finalUrl) tool.url = finalUrl

  if (row.name === "CopySmith") {
    tool.status = "active"
    delete tool.successorId
    tool.summary = "Company site behind Frase, Describely, and Rytr. No standalone price was published."
    tool.description = "copysmith.ai now describes itself as the company behind Frase, Describely and Rytr. No standalone pricing was found."
    tool.statusNote = source
    tool.pricing = {
      model: "paid",
      label: "Premium",
      verified: false,
      note: source,
      sourceUrl: ensureUrl(row.official_url_final) || ensureUrl(row.official_url),
    }
  } else if (row.name === "Replit Ghostwriter") {
    tool.name = "Replit Agent"
    tool.url = ensureUrl(row.official_url)
    tool.status = "renamed"
    tool.statusNote = source
    tool.summary = "AI coding assistant in the Replit editor. The Ghostwriter name is outdated."
    tool.description = "Replit Ghostwriter is the coding assistant inside the Replit editor. The validated note says that name is outdated and the product is now Replit AI/Agent, with a free mode and Core at $20/month. No replacement URL was recorded, so this fiche keeps https://replit.com/ghostwriter."
    delete tool.successorId
  } else if (row.issue === "dead_link") {
    tool.statusNote = source
    if (tool.status === "sunset") tool.status = "active"
  } else if (hostChanged || row.issue === "redirect") {
    tool.statusNote = source
    tool.status = RENAME_ON_REDIRECT.has(row.name) ? "renamed" : "active"
    if (tool.status === "active") delete tool.successorId
    else delete tool.successorId
  }

  if (tool.id === "soundraw" && tool.description.includes("3758 followers")) {
    tool.description = tool.description.slice(0, tool.description.indexOf("3758 followers")).trim()
  }
  if (tool.id === "otterai") delete tool.successorId

  tool.lastVerified = (row.pricing_verified_on || "").trim() || VERIFIED
}

function applyRemove(tool, row, tools) {
  const source = (row.source || "").trim()
  tool.status = "sunset"
  const finalUrl = ensureUrl(row.official_url_final)
  if (finalUrl) tool.url = finalUrl
  tool.statusNote = source
  tool.lastVerified = VERIFIED
  const successor = row.name === "Otter.ai" ? "otterai" : REMOVE_SUCCESSOR[row.name]
  if (successor && tools.has(successor) && successor !== tool.id) tool.successorId = successor
  else delete tool.successorId
  if (tool.id === "otter") {
    tool.description = tool.description.replace(
      "The second card (otterai) is a duplicate of this URL.",
      "This fiche is the duplicate. The kept fiche is otterai.",
    )
  }
  if (tool.id === "ink" || tool.id === "ink-for-all") delete tool.successorId
}

function blankPricing(row) {
  return {
    model: "paid",
    label: "Premium",
    verified: false,
    note: "The validated file left the pricing column empty. The description says paid plans are listed and no free tier was shown, so no tier is marked verified.",
    sourceUrl: looseSourceUrl(row.source, row.official_url),
  }
}

function applyLot(tool, row, isNew) {
  const skipUrlAndLogo = row.name === "Midjourney"
  const finalUrl = ensureUrl(row.official_url_final) || ensureUrl(row.official_url)
  if (!skipUrlAndLogo && finalUrl) tool.url = finalUrl
  if ((row.name || "").trim()) tool.name = row.name.trim()
  if ((row.short_description || "").trim()) tool.summary = row.short_description.trim()
  if ((row.long_description || "").trim()) tool.description = row.long_description.trim()
  const category = categoryOf(row.category)
  if (category) tool.categories = [category]
  const tags = tagsOf(row.tags)
  if (tags.length) tool.tags = tags
  tool.affiliateUrl = affiliateOf(row.affiliate_program)
  const sources = extractUrls(row.source)
  if (sources.length) tool.sources = sources
  else if (isNew) delete tool.sources

  if ((row.pricing || "").trim()) {
    tool.pricing = pricingFrom(
      row.pricing,
      row.pricing_verified_on,
      priceSentences(row),
      looseSourceUrl(row.source, finalUrl),
    )
  } else {
    tool.pricing = blankPricing(row)
    if (!tool.pricing.sourceUrl) delete tool.pricing.sourceUrl
  }

  tool.status = "active"
  delete tool.successorId
  delete tool.statusNote
  tool.lastVerified = (row.pricing_verified_on || "").trim() || VERIFIED
  if (isNew) {
    tool.image = ""
    tool.logo = tool.logo || ""
    tool.dateAdded = VERIFIED
    delete tool.features
    delete tool.howToUse
    delete tool.dateAddedNote
  }
}

function createTool(id, row) {
  const tool = {
    id,
    name: row.name.trim(),
    url: ensureUrl(row.official_url_final) || ensureUrl(row.official_url),
    affiliateUrl: "",
    status: "active",
    summary: "Pending",
    description: "Pending",
    categories: ["productivity"],
    tags: ["AI"],
    pricing: {
      model: "freemium",
      label: "Freemium",
      verified: false,
      note: "Pending",
    },
    logo: "",
    image: "",
    dateAdded: VERIFIED,
    lastVerified: VERIFIED,
  }
  applyLot(tool, row, true)
  return tool
}

async function downloadLogo(id, logoUrl) {
  const response = await fetch(logoUrl, {
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
    headers: { "user-agent": "Mozilla/5.0 (compatible; aitools-catalog/1.0)" },
  })
  if (!response.ok) return { ok: false, error: `HTTP ${response.status}` }
  const buf = Buffer.from(await response.arrayBuffer())
  const type = response.headers.get("content-type") || ""
  const head = buf.slice(0, 180).toString("utf8").trimStart().toLowerCase()
  let kind = ""
  if (head.startsWith("<svg") || head.startsWith("<?xml") || type.includes("svg")) kind = "svg"
  else if (buf[0] === 0x89 && buf[1] === 0x50) kind = "png"
  else if (buf[0] === 0xff && buf[1] === 0xd8) kind = "jpg"
  else if (buf.slice(0, 4).toString() === "RIFF") kind = "webp"
  else if (type.includes("png")) kind = "png"
  else if (type.includes("jpeg")) kind = "jpg"
  else if (/\.svg(\?|$)/i.test(logoUrl)) kind = "svg"
  else if (/\.png(\?|$)/i.test(logoUrl)) kind = "png"
  else if (/\.ico(\?|$)/i.test(logoUrl) || type.includes("icon")) kind = "ico"
  if (!kind || buf.length < 40) return { ok: false, error: `not an image (${type || "unknown"})` }

  let out = buf
  let ext = kind === "jpg" ? "jpg" : kind === "webp" ? "webp" : "png"
  if (kind !== "png" && kind !== "jpg" && kind !== "webp") {
    try {
      const sharp = (await import("sharp")).default
      out = await sharp(buf).png().toBuffer()
      ext = "png"
    } catch (error) {
      if (kind !== "svg") return { ok: false, error: `could not convert ${kind}` }
      ext = "svg"
      out = buf
    }
  }
  fs.writeFileSync(path.join(logoDir, `${id}.${ext}`), out)
  return { ok: true, rel: `/logos/${id}.${ext}` }
}

const tools = loadTools()
const { byName, byUrl } = indexes(tools)
const audit = parseCsv(fs.readFileSync(auditPath, "utf8"))
const lot = parseCsv(fs.readFileSync(lotPath, "utf8"))
const report = {
  auditMatched: [],
  auditUnmatched: [],
  auditAmbiguous: [],
  specialMatch: [],
  sunset: [],
  lotUpdated: [],
  lotCreated: [],
  lotUnmatchedCreate: [],
  logoFailures: [],
  midjourney: "url and logo left unchanged",
}

for (const row of audit) {
  const targets = auditTargets(row, byName, byUrl)
  if (!Array.isArray(targets)) {
    report.auditAmbiguous.push({ name: row.name, status: row.status, ids: targets.ambiguous })
    continue
  }
  if (!targets.length) {
    report.auditUnmatched.push({ name: row.name, status: row.status, url: row.official_url, issue: row.issue })
    continue
  }
  const auto = lookupIds(row, byName, byUrl)
  const autoIds = Array.isArray(auto) ? auto : []
  if (row.name === "Replit Ghostwriter" || (row.name === "DALL·E" && targets.includes("dalle_3") && !autoIds.includes("dalle_3"))) {
    report.specialMatch.push({
      name: row.name,
      status: row.status,
      ids: targets,
      reason: row.name === "Replit Ghostwriter"
        ? "Current fiche was already renamed to Replit Agent. Matched the original restore3-new id replit-ghostwriter (name and URL)."
        : "One remove row names both dalle and dalle_3. dalle matches the row. dalle_3 is the extra page named in the issue text.",
    })
  }
  if (row.name === "Perplexity AI") {
    report.specialMatch.push({
      name: row.name,
      status: row.status,
      ids: targets,
      reason: "Perplexity Labs now uses the same URL. The price update stays on perplexity-ai. The lot v3 row then replaces that text.",
    })
  }
  if (row.name === "Otter.ai") {
    report.specialMatch.push({
      name: row.name,
      status: row.status,
      ids: targets,
      reason: row.status === "remove"
        ? "Both otter and otterai share this name and URL. The remove sunsets otter and points at otterai."
        : "The price update is applied to otterai, the fiche the remove row says to keep.",
    })
  }
  for (const id of targets) {
    const tool = tools.get(id)
    if (!tool) {
      report.auditUnmatched.push({ name: row.name, status: row.status, url: row.official_url, issue: `missing file ${id}` })
      continue
    }
    if (row.status === "remove") applyRemove(tool, row, tools)
    else applyAuditUpdate(tool, row)
    report.auditMatched.push({ name: row.name, status: row.status, id, issue: row.issue })
  }
}

const otter = tools.get("otter")
const otterai = tools.get("otterai")
if (otter && otterai && otterai.pricing) {
  otter.pricing = {
    ...otterai.pricing,
    note: `Duplicate fiche. ${otterai.pricing.note || ""}`.trim(),
  }
}

const windsurf = tools.get("windsurf")
if (windsurf && tools.has("devin")) {
  windsurf.status = "renamed"
  windsurf.successorId = "devin"
  windsurf.url = "https://devin.ai/desktop"
  windsurf.statusNote = "windsurf.com redirects to devin.ai/desktop. The validated lot lists the current product as Devin (incl. Windsurf)."
  windsurf.lastVerified = VERIFIED
}

for (const row of lot) {
  let ids = row.name === "Gemini Notebook (formerly NotebookLM)" ? ["notebooklm"] : lookupIds(row, byName, byUrl)
  if (row.name === "Gemini Notebook (formerly NotebookLM)") {
    report.specialMatch.push({
      name: row.name,
      status: row.status,
      ids: ["notebooklm"],
      reason: "Name and host differ from the stored fiche (Gemini Notebook, notebook.google.com). Updated notebooklm.json in place.",
    })
  }
  if (!Array.isArray(ids)) {
    console.error("Ambiguous lot row", row.name, ids)
    process.exit(1)
  }
  if (!ids.length) {
    let id = slugify(row.name)
    if (!/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(id)) id = `tool-${VERIFIED}`
    if (tools.has(id)) id = `${id}-2`
    const tool = createTool(id, row)
    if (!tool.url || !tool.summary || !tool.description || !tool.categories?.length || !tool.tags?.length || !tool.pricing) {
      console.error("Incomplete new fiche", row.name)
      process.exit(1)
    }
    tools.set(id, tool)
    byName.set(normName(tool.name), [id])
    report.lotCreated.push({ name: row.name, id })
    ids = [id]
  } else {
    report.lotUpdated.push({ name: row.name, id: ids[0], csvStatus: row.status })
  }
  for (const id of ids) applyLot(tools.get(id), row, report.lotCreated.some((item) => item.id === id))
}

const logoJobs = []
for (const row of lot) {
  if (row.name === "Midjourney") continue
  const logoUrl = ensureUrl(row.logo_url)
  if (!logoUrl) continue
  const id = row.name === "Gemini Notebook (formerly NotebookLM)"
    ? "notebooklm"
    : (report.lotCreated.find((item) => item.name === row.name)?.id
      || report.lotUpdated.find((item) => item.name === row.name)?.id)
  if (id) logoJobs.push({ id, logoUrl, name: row.name })
}

fs.mkdirSync(logoDir, { recursive: true })
for (let i = 0; i < logoJobs.length; i += 6) {
  const batch = logoJobs.slice(i, i + 6)
  const results = await Promise.all(batch.map(async (job) => ({ job, result: await downloadLogo(job.id, job.logoUrl).catch((error) => ({ ok: false, error: error.message })) })))
  for (const { job, result } of results) {
    if (!result.ok) {
      report.logoFailures.push({ name: job.name, id: job.id, url: job.logoUrl, error: result.error })
      continue
    }
    tools.get(job.id).logo = result.rel
  }
}

for (const tool of tools.values()) {
  if (tool.status === "sunset" || tool.status === "renamed") {
    report.sunset.push({ id: tool.id, name: tool.name, status: tool.status, successorId: tool.successorId || "", url: tool.url })
  }
  writeTool(tool)
}

fs.writeFileSync("/tmp/pm-apply-report.json", JSON.stringify(report, null, 2))
console.log(JSON.stringify({
  audit: audit.length,
  lot: lot.length,
  matched: report.auditMatched.length,
  unmatched: report.auditUnmatched,
  ambiguous: report.auditAmbiguous,
  created: report.lotCreated,
  updated: report.lotUpdated.length,
  logoFailures: report.logoFailures,
  sunset: report.sunset.length,
}, null, 2))
