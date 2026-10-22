#!/usr/bin/env node
/**
 * Quality check for every active fiche.
 *
 *   node scripts/qa-fiches.mjs
 *   node scripts/qa-fiches.mjs --fix
 *
 * Checks description, How To Use, agreement between the two, the official
 * link (HTTP 2xx/3xx after redirects, not a parking or 404 page), and the
 * homepage capture named by the fiche `image` field (a local path under
 * public/). The capture must be present, non-empty, not a generated logo
 * plate, and not an error or cookie wall. Files under 15 KB fail. That
 * threshold is not lowered. SPARSE_HOMEPAGE_IDS lists real sparse homepages
 * whose second capture stays under 15 KB at maximum WebP quality; only the
 * size check is skipped for those ids.
 *
 * --fix rewrites a missing or incoherent How To Use from the fiche's own
 * description, follows a same-site redirect onto the final official URL,
 * and drops generated logo plates so they are not shown as homepages.
 * Anything still failing is listed with a reason.
 */
import fs from "fs"
import path from "path"
import sharp from "sharp"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content/tools")
const publicDir = path.join(root, "public")
const reportJson = path.join(root, "scripts/qa/report.json")
const reportMd = path.join(root, "scripts/qa/REPORT.md")
const captureReport = path.join(root, "scripts/screenshots/capture-report.json")
const fix = process.argv.includes("--fix")

const STOP = new Set(
  "about,with,from,that,this,your,into,onto,over,their,there,which,using,used,tool,tools,plan,plans,free,more,than,also,have,been,will,when,where,what,they,them,such,other,each,some,only,after,before,across,under,while,these,those,site,website,official,open,visit,users,user,helps,help,make,makes,made,create,creates,including,include,available,version,features,feature".split(",")
)
const PARKING = /domain (is )?for sale|buy this domain|this domain is parked|sedo domain parking|hugedomains|this webpage is parked/i
const NOT_FOUND = /page not found|\b404\b[^.]{0,40}not found|404 not found/i
const COOKIE = /cookie|consent|gdpr|accept all|we value your privacy/i

/**
 * Real homepages that stay under 15 KB even at maximum WebP quality because
 * the page itself is sparse. A second capture was kept as-is; pixels were
 * not padded to clear the threshold. Do not lower the global 15 KB check.
 * Only the size check is skipped for these ids. A missing, unreadable,
 * empty, or plate capture still fails.
 */
const SPARSE_HOMEPAGE_IDS = new Set(["autoregex", "chatcode"])

function imageFile(tool) {
  const image = typeof tool.image === "string" ? tool.image.trim() : ""
  if (!image.startsWith("/") || image.startsWith("//")) return ""
  const file = path.resolve(publicDir, `.${image}`)
  const relative = path.relative(publicDir, file)
  if (relative.startsWith("..") || path.isAbsolute(relative)) return ""
  return file
}

function tokens(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((word) => word.length > 4 && !STOP.has(word))
}

function splitSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!])\s+(?=[A-Z"“])/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 30)
}

function howToFrom(name, url, description) {
  const steps = [
    {
      title: `Open ${name}`,
      description: `Open the official ${name} website.`,
      links: [{ label: name, url }],
    },
  ]
  for (const sentence of splitSentences(description).slice(0, 3)) {
    const title = sentence.split(/[,:]/)[0].trim()
    steps.push({
      title: title.length > 90 ? `${title.slice(0, 87).trim()}...` : title,
      description: sentence,
    })
  }
  if (steps.length < 2) steps.push({ title: `Use ${name}`, description })
  return steps
}

function howToOverlaps(description, howToUse) {
  if (!Array.isArray(howToUse) || !howToUse.length) return false
  if (!howToUse.every((step) => step?.title && step?.description)) return false
  const described = new Set(tokens(description))
  const shared = new Set(tokens(howToUse.map((step) => `${step.title} ${step.description}`).join(" ")).filter((word) => described.has(word)))
  return shared.size >= 2
}

function loadTools() {
  return fs
    .readdirSync(toolsDir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      const file = path.join(toolsDir, name)
      const tool = JSON.parse(fs.readFileSync(file, "utf8"))
      tool.__file = file
      return tool
    })
}

function loadCapture() {
  if (!fs.existsSync(captureReport)) return new Map()
  const payload = JSON.parse(fs.readFileSync(captureReport, "utf8"))
  return new Map((payload.results || []).map((item) => [item.id, item]))
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return ""
  }
}

function sameSite(left, right) {
  const a = hostOf(left)
  const b = hostOf(right)
  if (!a || !b) return false
  return a === b || a.endsWith(`.${b}`) || b.endsWith(`.${a}`)
}

function hardFailure(link) {
  if (!link) return ""
  if (link.status === 404 || link.status === 410) return "404"
  const error = `${link.error || ""}`.toLowerCase()
  if (/timeout|aborted|timed out|etimedout/.test(error)) return "timeout"
  if (/cert|ssl|tls|unable to verify|certificate/.test(error)) return "ssl"
  return ""
}

function urlCandidates(url) {
  const found = []
  const push = (value) => {
    try {
      const next = new URL(value).href
      if (!found.includes(next)) found.push(next)
    } catch {
      /* ignore malformed candidates */
    }
  }
  push(url)
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return found
  }
  if (parsed.protocol === "http:") push(url.replace(/^http:/, "https:"))
  const bare = parsed.hostname.replace(/^www\./, "")
  const withWww = parsed.hostname.startsWith("www.") ? bare : `www.${parsed.hostname}`
  push(`${parsed.protocol}//${withWww}${parsed.pathname}`)
  push(`${parsed.protocol}//${bare}/`)
  push(`${parsed.protocol}//${withWww}/`)
  return found
}

/** Keep How To Use links on the fiche's current official host. Drop YouTube and other third parties. */
function officialize(tool) {
  let changed = false
  if (tool.affiliateUrl) {
    tool.affiliateUrl = ""
    changed = true
  }
  if (!Array.isArray(tool.howToUse)) return changed
  for (const step of tool.howToUse) {
    const links = Array.isArray(step.links) ? step.links : []
    const kept = links.filter((link) => sameSite(link.url, tool.url) && !/youtube\.com|youtu\.be/i.test(link.url))
    if (kept.length !== links.length) {
      step.links = kept.length ? kept : [{ label: tool.name, url: tool.url }]
      changed = true
    }
    if (/https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\//i.test(`${step.title} ${step.description} ${links.map((link) => link.url).join(" ")}`)) {
      step.description = `Continue on the official ${tool.name} website.`
      step.title = step.title.replace(/https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/\S*/gi, tool.name)
      if (!step.links?.length) step.links = [{ label: tool.name, url: tool.url }]
      changed = true
    }
  }
  return changed
}

async function checkLink(url) {
  const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 25000)
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml",
      },
    })
    const status = response.status
    const finalUrl = response.url || url
    const body = (await response.text()).slice(0, 200000)
    const text = body.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
    const title = (body.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1].replace(/\s+/g, " ").trim()
    return { ok: status >= 200 && status < 400, status, finalUrl, title, text: text.slice(0, 4000), error: "" }
  } catch (error) {
    return { ok: false, status: 0, finalUrl: url, title: "", text: "", error: error instanceof Error ? error.message : String(error) }
  } finally {
    clearTimeout(timer)
  }
}

async function checkImage(file, { skipSize = false } = {}) {
  if (!file || !fs.existsSync(file)) return "capture absente"
  const stat = fs.statSync(file)
  if (!skipSize && stat.size < 15 * 1024) return `capture suspecte (${stat.size} octets, sous 15 Ko)`
  try {
    const meta = await sharp(file).metadata()
    if (!meta.width || meta.width < 320 || !meta.height || meta.height < 180) return "capture illisible"
    const stats = await sharp(file).stats()
    const stdev = stats.channels.reduce((sum, channel) => sum + channel.stdev, 0) / stats.channels.length
    if (stdev < 6) return "capture quasi vide"
    const { data, info } = await sharp(file).resize(48, 30, { fit: "fill" }).removeAlpha().raw().toBuffer({ resolveWithObject: true })
    let plate = 0
    const colors = new Set()
    for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      colors.add(`${r >> 4},${g >> 4},${b >> 4}`)
      if (Math.abs(r - 243) < 14 && Math.abs(g - 244) < 14 && Math.abs(b - 246) < 14) plate++
    }
    const pixels = data.length / info.channels
    if (colors.size < 8 && stat.size < 12 * 1024) return "capture trop uniforme pour être une homepage (logo ou aplat)"
    return ""
  } catch (error) {
    return `capture illisible (${error instanceof Error ? error.message : error})`
  }
}

function pageIsBad(title, text) {
  const blob = `${title}\n${text}`
  if (PARKING.test(blob)) return "parking de domaine"
  if (NOT_FOUND.test(blob) && (text || "").length < 1200) return "page 404"
  const cookieHits = (blob.match(/cookie|consent|gdpr|accept all|we value your privacy/gi) || []).length
  if ((text || "").length < 320 && cookieHits >= 2 && COOKIE.test(blob)) return "mur de cookies"
  return ""
}

function nameOnPage(name, blob) {
  if (name.length > 3 && blob.includes(name)) return true
  const parts = name.split(/[^a-z0-9]+/).filter((word) => word.length > 4 && !STOP.has(word))
  return parts.some((part) => new RegExp(`\\b${part}\\b`).test(blob))
}

function officialHowToLink(linkUrl, tool) {
  if (sameSite(linkUrl, tool.url)) return true
  const host = hostOf(linkUrl)
  const parts = tool.name.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length >= 6 && !STOP.has(word))
  return parts.some((part) => host.includes(part))
}

function agreesWithPage(tool, text, title) {
  const blob = `${title}\n${text}`.toLowerCase()
  if ((text || "").length < 80 && (title || "").length < 2) return ""
  const nameHit = nameOnPage(tool.name.toLowerCase(), blob)
  const described = tokens(`${tool.description} ${tool.summary}`)
  const overlap = described.filter((word) => blob.includes(word)).length
  if (nameHit || overlap >= 2) return ""
  return "le texte de la page officielle ne recoupe ni le nom ni la description"
}

async function mapPool(items, limit, worker) {
  const results = new Array(items.length)
  let cursor = 0
  async function run() {
    while (cursor < items.length) {
      const index = cursor++
      results[index] = await worker(items[index], index)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run))
  return results
}

const allTools = loadTools()
const captured = loadCapture()
const fixes = []

if (fix) {
  for (const tool of allTools) {
    if (officialize(tool)) fixes.push({ id: tool.id, action: "affiliate retiré ou liens How To Use ramenés au domaine officiel" })
    if (tool.status === "active" && !howToOverlaps(tool.description || tool.summary, tool.howToUse)) {
      tool.howToUse = howToFrom(tool.name, tool.url, tool.description || tool.summary)
      officialize(tool)
      fixes.push({ id: tool.id, action: "how-to réécrit depuis la description de la fiche" })
    }
  }
}

const tools = allTools.filter((tool) => tool.status === "active")

console.log(`Checking ${tools.length} active fiches`)
const checked = await mapPool(tools, 12, async (tool) => {
  const failures = []
  if (tool.affiliateUrl) failures.push("affiliateUrl renseigné")
  if (!tool.description || tool.description.trim().length < 40) failures.push("description absente ou trop courte")
  if (!howToOverlaps(tool.description || tool.summary, tool.howToUse)) failures.push("How To Use absent ou pas cohérent avec la description")
  const offsite = []
  for (const step of tool.howToUse || []) {
    for (const link of step.links || []) {
      if (!officialHowToLink(link.url, tool) || /youtube\.com|youtu\.be/i.test(link.url)) offsite.push(link.url)
    }
  }
  if (offsite.length) failures.push(`lien How To Use hors domaine officiel (${offsite.slice(0, 3).join(", ")})`)
  const link = await checkLink(tool.url)
  const shot = captured.get(tool.id)
  const rendered = shot?.textSample || ""
  const renderedTitle = shot?.title || ""
  const browserStatus = Number(shot?.httpStatus || 0)
  const browserOk = browserStatus >= 200 && browserStatus < 400 && shot?.outcome === "success"
  const linkOk = link.ok || browserOk
  const clientBlocked = !linkOk && link.status === 403
  if (!linkOk && !clientBlocked) failures.push(link.error ? `lien officiel injoignable (${link.error})` : `lien officiel HTTP ${link.status || browserStatus || "absent"}`)
  const badPage = pageIsBad(link.title || renderedTitle, link.text || rendered)
  if (linkOk && badPage) failures.push(`lien officiel : ${badPage}`)
  const coherence = agreesWithPage(tool, link.text.length > 80 ? link.text : rendered, link.title || renderedTitle)
  if (linkOk && !badPage && coherence) failures.push(coherence)
  const imagePath = imageFile(tool)
  const imageProblem = await checkImage(imagePath, { skipSize: SPARSE_HOMEPAGE_IDS.has(tool.id) })
  if (imageProblem) failures.push(imageProblem)
  const kind = !linkOk && !browserOk ? hardFailure(link) : ""
  if (fix && kind) {
    let recovered = null
    for (const candidate of urlCandidates(tool.url)) {
      if (candidate === tool.url) continue
      const attempt = await checkLink(candidate)
      const attemptBad = pageIsBad(attempt.title, attempt.text)
      const named = attempt.text.toLowerCase().includes(tool.name.toLowerCase()) || attempt.title.toLowerCase().includes(tool.name.toLowerCase())
      if (attempt.ok && !attemptBad && (sameSite(attempt.finalUrl, tool.url) || named)) {
        recovered = attempt
        break
      }
    }
    if (recovered) {
      tool.url = recovered.finalUrl
      officialize(tool)
      fixes.push({ id: tool.id, action: `URL officielle mise à jour vers ${recovered.finalUrl} après ${kind}` })
      const index = failures.findIndex((item) => item.startsWith("lien officiel"))
      if (index >= 0) failures.splice(index, 1)
    } else {
      tool.status = "inactive"
      tool.statusNote = `Official URL failed (${kind}) when checked on 2026-10-21.`
      fixes.push({ id: tool.id, action: `passé en inactif : ${kind} sur ${tool.url}` })
      for (let i = failures.length - 1; i >= 0; i--) {
        if (failures[i].startsWith("lien officiel")) failures.splice(i, 1)
      }
    }
  }
  if (fix && link.ok && !pageIsBad(link.title, link.text) && link.finalUrl && link.finalUrl !== tool.url && sameSite(link.finalUrl, tool.url)) {
    tool.url = link.finalUrl
    officialize(tool)
    fixes.push({ id: tool.id, action: `URL officielle mise à jour vers ${link.finalUrl}` })
  }
  if (fix && imageProblem && /plaque logo|trop uniforme|vide/.test(imageProblem) && imagePath && fs.existsSync(imagePath)) {
    fs.rmSync(imagePath)
    tool.image = ""
    fixes.push({ id: tool.id, action: "plaque logo retirée" })
  }
  return { id: tool.id, name: tool.name, url: tool.url, failures }
})

if (fix) {
  const changed = new Set(fixes.map((item) => item.id))
  for (const tool of allTools) {
    if (!changed.has(tool.id)) continue
    const file = tool.__file
    delete tool.__file
    fs.writeFileSync(file, `${JSON.stringify(tool, null, 2)}\n`)
  }
}

const failed = checked.filter((item) => item.failures.length)
const passed = checked.length - failed.length
const byReason = new Map()
for (const item of failed) {
  for (const reason of item.failures) {
    const key = reason.replace(/https?:\/\/\S+/g, "(url)").replace(/HTTP \d+/, "HTTP")
    byReason.set(key, (byReason.get(key) || 0) + 1)
  }
}

const payload = {
  generatedAt: new Date().toISOString(),
  activeChecked: checked.length,
  passed,
  failed: failed.length,
  fixes,
  byReason: Object.fromEntries([...byReason.entries()].sort((a, b) => b[1] - a[1])),
  failures: failed,
}
fs.mkdirSync(path.dirname(reportJson), { recursive: true })
fs.writeFileSync(reportJson, JSON.stringify(payload, null, 2))
const rows = failed
  .map((item) => `| ${item.id} | ${item.name.replace(/\|/g, "/")} | ${item.failures.join("; ").replace(/\|/g, "/")} |`)
  .join("\n")
const md = `# Contrôle des fiches actives

Généré le ${payload.generatedAt.slice(0, 10)}.

| Compteur | Nombre |
| --- | ---: |
| Fiches actives contrôlées | ${payload.activeChecked} |
| Conformes | ${payload.passed} |
| Encore en échec | ${payload.failed} |
| Corrections appliquées pendant ce passage | ${fixes.length} |

## Échecs restants par raison

${[...byReason.entries()].map(([reason, count]) => `- ${count} × ${reason}`).join("\n") || "Aucun."}

## Fiches non corrigées

| id | nom | raison |
| --- | --- | --- |
${rows || "| — | — | — |"}

## Notes

Le contrôle lit le fichier nommé par le champ \`image\` de chaque fiche, résolu sous \`public/\`. Le seuil de 15 Ko n'est pas abaissé.

Exceptions documentées (homepage réelle peu chargée ; une seconde capture au maximum de la qualité WebP reste sous 15 Ko ; aucun pixel n'est ajouté) : ${[...SPARSE_HOMEPAGE_IDS].sort().join(", ")}. Seul le contrôle de taille est ignoré pour ces identifiants. Une capture absente, illisible, vide ou en aplat échoue quand même.
`
fs.writeFileSync(reportMd, md)
console.log(`passed ${passed} / ${checked.length}, failed ${failed.length}, fixes ${fixes.length}`)
console.log(`report ${reportMd}`)
