/**
 * Apply PM-validated official link fixes (2026-11-16) idempotently.
 *
 * Usage:
 *   node scripts/links-fix-2026-11-16.mjs [--dry-run] [--check]
 *   node scripts/links-fix-2026-11-16.mjs [links-fix.csv] [links-recheck.csv]
 *
 * --check: run idempotency self-test (apply twice in memory; exit 1 if second pass would write).
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content", "tools")
const frPath = path.join(root, "content", "i18n", "fr-tools.json")
const VERIFIED = "2026-11-16"
const dryRun = process.argv.includes("--dry-run")
const checkMode = process.argv.includes("--check")
const fixCsv =
  process.argv.find((a) => a.endsWith("links-fix.csv")) ||
  path.join(root, "data/links-audit-2026-11-16/links-fix.csv")
const recheckCsv =
  process.argv.find((a) => a.endsWith("links-recheck.csv")) ||
  path.join(root, "data/links-audit-2026-11-16/links-recheck.csv")

/** Handled in PR #53 or other PRs — never modify. */
const EXCLUDE = new Set([
  "lovo",
  "smart-copy",
  "google-whisk",
  "producer-ai",
  "windsurf",
  "merciapp",
  "hyprnote",
  "gpt-for-sheets",
  "spotter",
  "skybox-ai",
  "tubebuddy",
  "cordial",
  "webflow",
])

/** Sunset only these (others in CSV already sunset elsewhere). */
const SUNSET_IDS = new Set(["pearai", "csm-ai", "agent"])

const SUNSET_COPY = {
  pearai: {
    statusNote:
      "PearAI's public site is offline and the company is no longer operating; the open-source project is unmaintained.",
    statusNote_fr:
      "Le site public de PearAI est hors ligne et l'entreprise ne fonctionne plus ; le projet open source n'est plus maintenu.",
    clearPrimaryUrl: true,
  },
  "csm-ai": {
    statusNote:
      "Common Sense Machines was acquired by Google in January 2026; the Cube platform and public product are no longer available.",
    statusNote_fr:
      "Common Sense Machines a été racheté par Google en janvier 2026 ; la plateforme Cube et le produit public ne sont plus disponibles.",
    clearPrimaryUrl: true,
  },
  agent: {
    statusNote:
      "The Agent.ai marketplace is no longer live; the agent.ai domain now hosts unrelated HubSpot tooling.",
    statusNote_fr:
      "La place de marché Agent.ai n'est plus en ligne ; le domaine agent.ai héberge désormais des outils HubSpot sans lien avec l'ancien produit.",
    clearPrimaryUrl: true,
  },
}

/** Visible name updates for renamed rows (slug unchanged). */
const RENAMED_NAMES = {
  "abnormal-security": "Abnormal AI",
  "opera-aria": "Opera AI",
  kira: "Litera Review",
  lmarena: "Arena",
  "orb-producer": "LANDR Composer",
  podcastle: "Async",
  sonauto: "Treblo",
  "surfer-seo": "Surfer",
}

const MAGNIFIC = {
  id: "magnific",
  oldUrl: "https://magnific.ai/",
  newUrl: "https://www.magnific.com/",
}

/** Main CTA for Google Opal (opal.google redirects to developer FAQ). */
const GOOGLE_OPAL_CTA = "https://gemini.google.com/app"
const GOOGLE_OPAL_BLOG =
  "https://blog.google/innovation-and-ai/models-and-research/google-labs/mini-apps-opal-gemini-app-experiment/"

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
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
    .filter((r) => r.some((v) => v && v.trim()))
    .map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""])))
}

function hostKey(url) {
  try {
    const u = new URL(url)
    return u.hostname.replace(/^www\./, "").toLowerCase()
  } catch {
    return ""
  }
}

function variants(url) {
  if (!url?.trim()) return []
  const out = new Set([url.trim()])
  try {
    const u = new URL(url.trim())
    out.add(u.origin + u.pathname)
    out.add(u.href.replace(/\/$/, ""))
    out.add(u.href.endsWith("/") ? u.href : `${u.href}/`)
    const noWww = u.hostname.replace(/^www\./, "")
    out.add(`https://${noWww}${u.pathname}`)
    out.add(`https://www.${noWww}${u.pathname}`)
    if (u.protocol === "http:") out.add(u.href.replace(/^http:/, "https:"))
  } catch {
    /* ignore */
  }
  return [...out]
}

function urlVariantList(fromUrl) {
  return [...variants(fromUrl)].sort((a, b) => b.length - a.length)
}

/** True when fromUrl is absent and new canonical URL is already present. */
function stringAlreadyMigrated(text, fromUrl, toUrl) {
  if (typeof text !== "string" || !text) return true
  const froms = urlVariantList(fromUrl)
  const hasOld = froms.some((from) => containsExactUrl(text, from))
  if (hasOld) return false
  const tos = urlVariantList(toUrl)
  if (tos.some((to) => containsExactUrl(text, to))) return true
  if (fromUrl && toUrl && hostKey(fromUrl) === hostKey(toUrl)) {
    try {
      const fromPath = new URL(fromUrl).pathname.replace(/\/$/, "")
      const toPath = new URL(toUrl).pathname.replace(/\/$/, "")
      if (fromPath !== toPath && text.includes(toPath) && !text.includes(fromPath)) return true
    } catch {
      /* ignore */
    }
  }
  return !hasOld
}

function containsExactUrl(text, urlNeedle) {
  if (!urlNeedle || !text.includes(urlNeedle)) return false
  const re = new RegExp(`${escapeRegExp(urlNeedle)}(?![\\w./-])`)
  return re.test(text)
}

function replaceExactUrlInString(text, fromUrl, toUrl) {
  if (typeof text !== "string" || !text || !fromUrl || !toUrl) return text
  if (stringAlreadyMigrated(text, fromUrl, toUrl)) return text
  let next = text
  for (const from of urlVariantList(fromUrl)) {
    if (from === toUrl) continue
    const re = new RegExp(`${escapeRegExp(from)}(?![\\w./-])`, "g")
    next = next.replace(re, toUrl)
  }
  return next
}

function exactUrlFieldMatch(value, fromUrl) {
  if (typeof value !== "string") return false
  const trimmed = value.trim()
  return urlVariantList(fromUrl).some((v) => v === trimmed)
}

function deepReplaceUrls(value, fromUrl, toUrl) {
  if (typeof value === "string") return replaceExactUrlInString(value, fromUrl, toUrl)
  if (Array.isArray(value)) return value.map((item) => deepReplaceUrls(item, fromUrl, toUrl))
  if (value && typeof value === "object") {
    const out = {}
    for (const [k, v] of Object.entries(value)) {
      if (k === "url" || k === "sourceUrl") {
        if (typeof v === "string" && exactUrlFieldMatch(v, fromUrl)) {
          out[k] = toUrl
          continue
        }
      }
      out[k] = deepReplaceUrls(v, fromUrl, toUrl)
    }
    return out
  }
  return value
}

function toolHasOldUrl(tool, oldUrl) {
  if (!oldUrl) return false
  const blob = JSON.stringify(tool)
  return urlVariantList(oldUrl).some((from) => containsExactUrl(blob, from))
}

function fixAlreadyApplied(tool, oldUrl, newUrl) {
  if ((tool.url || "").trim() !== newUrl.trim()) return false
  return !toolHasOldUrl(tool, oldUrl)
}

function clearHowToVisitLinks(tool) {
  for (const key of ["howToUse", "howToUse_fr"]) {
    const steps = tool[key]
    if (!Array.isArray(steps)) continue
    for (const step of steps) {
      if (step.links) delete step.links
    }
  }
}

function scrubPricingDeadHost(tool, deadHosts) {
  const hosts = new Set(deadHosts.filter(Boolean))
  if (!tool.pricing || !hosts.size) return
  const noteKeys = ["note", "note_fr"]
  for (const key of noteKeys) {
    const text = tool.pricing[key]
    if (!text) continue
    let next = text
    for (const h of hosts) {
      next = next.replace(new RegExp(`https?://[^\\s]*${h.replace(/\./g, "\\.")}[^\\s]*`, "gi"), "the official site")
      next = next.replace(new RegExp(`\\b${h.replace(/\./g, "\\.")}\\b`, "gi"), "the official site")
    }
    if (next !== text) tool.pricing[key] = next
  }
  if (tool.pricing.sourceUrl && hosts.has(hostKey(tool.pricing.sourceUrl))) {
    delete tool.pricing.sourceUrl
  }
}

function ensureSource(tool, sourceUrl) {
  const url = (sourceUrl || "").trim()
  if (!url) return
  if (!tool.sources) tool.sources = []
  if (!tool.sources.includes(url)) tool.sources.push(url)
}

function loadTool(id) {
  const file = path.join(toolsDir, `${id}.json`)
  if (!fs.existsSync(file)) return null
  return { file, data: JSON.parse(fs.readFileSync(file, "utf8")) }
}

let checkWouldWrite = 0

function saveTool(file, data) {
  if (checkMode) {
    checkWouldWrite++
    return
  }
  if (!dryRun) fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)
}

function applySunsetVisitorFields(tool, copy) {
  let changed = false
  if (!tool.statusNote || tool.statusNote === copy.statusNote) {
    if (tool.statusNote !== copy.statusNote) {
      tool.statusNote = copy.statusNote
      changed = true
    }
  }
  if (
    copy.statusNote_fr &&
    (!tool.statusNote_fr || tool.statusNote_fr === copy.statusNote_fr)
  ) {
    if (tool.statusNote_fr !== copy.statusNote_fr) {
      tool.statusNote_fr = copy.statusNote_fr
      changed = true
    }
  }
  return changed
}

const report = {
  fix: [],
  renamed: [],
  sunset: [],
  magnific: [],
  recheck: [],
  skipped: [],
}

const fixRows = parseCsv(fs.readFileSync(fixCsv, "utf8"))
const recheckRows = parseCsv(fs.readFileSync(recheckCsv, "utf8"))

for (const row of fixRows) {
  const id = (row.id || "").trim()
  const verdict = (row.verdict || "").trim()
  const oldUrl = (row.old_url || "").trim()
  const newUrl = (row.new_url || "").trim()
  const sourceUrl = (row.source_url || "").trim()

  if (!id) continue
  if (EXCLUDE.has(id)) {
    report.skipped.push({ id, verdict, reason: "excluded by PM scope" })
    continue
  }

  const loaded = loadTool(id)
  if (!loaded) {
    report.skipped.push({ id, verdict, reason: "missing fiche" })
    continue
  }
  const { file, data: tool } = loaded
  let changed = false

  if (verdict === "keep") {
    report.skipped.push({ id, verdict, reason: "keep — no change" })
    continue
  }

  if (verdict === "sunset") {
    if (!SUNSET_IDS.has(id)) {
      report.skipped.push({ id, verdict, reason: "sunset excluded (handled elsewhere)" })
      continue
    }
    const copy = SUNSET_COPY[id]
    if (tool.status !== "sunset") {
      tool.status = "sunset"
      changed = true
    }
    if (applySunsetVisitorFields(tool, copy)) changed = true
    if (copy.clearPrimaryUrl && tool.url) {
      tool.url = ""
      changed = true
    }
    ensureSource(tool, sourceUrl)
    clearHowToVisitLinks(tool)
    scrubPricingDeadHost(tool, [hostKey(oldUrl), hostKey(tool.url)])
    for (const key of ["howToUse", "howToUse_fr"]) {
      const steps = tool[key]
      if (!Array.isArray(steps) || !steps[0]) continue
      const dead = hostKey(oldUrl)
      if (dead && String(steps[0].description || "").toLowerCase().includes(dead)) {
        steps[0].description =
          key === "howToUse_fr"
            ? "Ce produit n'est plus disponible ; vois l'avis ci-dessus."
            : "This product is no longer available; see the notice above."
      }
    }
    if (oldUrl && newUrl) {
      const next = deepReplaceUrls(tool, oldUrl, newUrl)
      if (JSON.stringify(next) !== JSON.stringify(tool)) {
        Object.assign(tool, next)
        changed = true
      }
    }
    tool.lastVerified = VERIFIED
    if (changed) {
      saveTool(file, tool)
      report.sunset.push({ id, old: oldUrl || "(n/a)", new: "(sunset)", verdict, applied: true })
    } else {
      report.skipped.push({ id, verdict, reason: "sunset already applied" })
    }
    continue
  }

  if (verdict === "fix" && newUrl) {
  const resolvedNewUrl = id === "google-opal" ? GOOGLE_OPAL_CTA : newUrl
    if (fixAlreadyApplied(tool, oldUrl, resolvedNewUrl) && tool.lastVerified === VERIFIED) {
      report.skipped.push({ id, verdict, reason: "fix already applied" })
      continue
    }
    if (tool.url !== resolvedNewUrl) {
      tool.url = resolvedNewUrl
      changed = true
    }
    const replaced = deepReplaceUrls(tool, oldUrl, resolvedNewUrl)
    if (JSON.stringify(replaced) !== JSON.stringify(tool)) {
      Object.assign(tool, replaced)
      tool.url = resolvedNewUrl
      changed = true
    }
    if (id === "google-opal") {
      tool.url = GOOGLE_OPAL_CTA
      if (tool.pricing) tool.pricing.sourceUrl = GOOGLE_OPAL_CTA
      if (!tool.sources) tool.sources = []
      if (!tool.sources.includes(GOOGLE_OPAL_BLOG)) tool.sources.push(GOOGLE_OPAL_BLOG)
    }
    ensureSource(tool, sourceUrl || (id === "google-opal" ? GOOGLE_OPAL_BLOG : ""))
    tool.lastVerified = VERIFIED
    if (changed) {
      saveTool(file, tool)
      report.fix.push({ id, old: oldUrl, new: resolvedNewUrl, verdict, applied: true })
    } else {
      report.skipped.push({ id, verdict, reason: "fix already applied" })
    }
    continue
  }

  if (verdict === "renamed" && newUrl) {
    const newName = RENAMED_NAMES[id]
    if (newName && tool.name !== newName) {
      tool.name = newName
      changed = true
    }
    if (tool.url !== newUrl) {
      tool.url = newUrl
      changed = true
    }
    const replaced = deepReplaceUrls(tool, oldUrl, newUrl)
    if (JSON.stringify(replaced) !== JSON.stringify(tool)) {
      Object.assign(tool, replaced)
      tool.url = newUrl
      if (newName) tool.name = newName
      changed = true
    }
    ensureSource(tool, sourceUrl)
    tool.lastVerified = VERIFIED
    if (changed) {
      saveTool(file, tool)
      report.renamed.push({ id, old: oldUrl, new: newUrl, verdict, applied: true })
    } else {
      report.skipped.push({ id, verdict, reason: "renamed already applied" })
    }
    continue
  }

  report.skipped.push({ id, verdict, reason: "no matching rule" })
}

// magnific.ai → magnific.com (recheck redirect + PM point 4)
{
  const loaded = loadTool(MAGNIFIC.id)
  if (loaded) {
    const { file, data: tool } = loaded
    const before = JSON.stringify(tool)
    if (fixAlreadyApplied(tool, MAGNIFIC.oldUrl, MAGNIFIC.newUrl) && tool.lastVerified === VERIFIED) {
      report.skipped.push({ id: MAGNIFIC.id, verdict: "redirect", reason: "magnific already applied" })
    } else {
    tool.url = MAGNIFIC.newUrl
    const next = deepReplaceUrls(tool, MAGNIFIC.oldUrl, MAGNIFIC.newUrl)
    Object.assign(tool, next)
    tool.url = MAGNIFIC.newUrl
    tool.lastVerified = VERIFIED
    if (JSON.stringify(tool) !== before) {
      saveTool(file, tool)
      report.magnific.push({
        id: MAGNIFIC.id,
        old: MAGNIFIC.oldUrl,
        new: MAGNIFIC.newUrl,
        verdict: "redirect",
        applied: true,
      })
    }
    }
  }
}

for (const row of recheckRows) {
  const id = (row.id || "").trim()
  const verdict = (row.verdict || "").trim()
  const finalUrl = (row.final_url || "").trim()
  const auditUrl = (row.url || "").trim()
  if (verdict !== "fix" || !finalUrl) {
    if (id === "magnific" || id === "freepik-ai") continue
    report.skipped.push({ id, verdict, reason: `recheck ${verdict} — no change` })
    continue
  }
  if (EXCLUDE.has(id)) {
    report.skipped.push({ id, verdict, reason: "excluded" })
    continue
  }
  const loaded = loadTool(id)
  if (!loaded) {
    report.skipped.push({ id, verdict, reason: "missing fiche" })
    continue
  }
  const { file, data: tool } = loaded
  const before = JSON.stringify(tool)
  if (auditUrl) {
    Object.assign(tool, deepReplaceUrls(tool, auditUrl, finalUrl))
  }
  tool.url = finalUrl
  tool.lastVerified = VERIFIED
  if (JSON.stringify(tool) !== before) {
    saveTool(file, tool)
    report.recheck.push({ id, old: auditUrl, new: finalUrl, verdict, applied: true })
  }
}

// FR overlay URL sweep for touched ids
const touchedIds = new Set([
  ...report.fix.map((r) => r.id),
  ...report.renamed.map((r) => r.id),
  ...report.sunset.map((r) => r.id),
  ...report.magnific.map((r) => r.id),
  ...report.recheck.map((r) => r.id),
])

const frReplacements = []
for (const row of fixRows) {
  if (EXCLUDE.has(row.id)) continue
  if ((row.verdict === "fix" || row.verdict === "renamed") && row.new_url) {
    const to = row.id === "google-opal" && row.verdict === "fix" ? GOOGLE_OPAL_CTA : row.new_url
    frReplacements.push({ id: row.id, from: row.old_url, to })
  }
}
frReplacements.push({ id: "magnific", from: MAGNIFIC.oldUrl, to: MAGNIFIC.newUrl })

if (fs.existsSync(frPath) && frReplacements.length) {
  const frTools = JSON.parse(fs.readFileSync(frPath, "utf8"))
  let frChanged = false
  for (const { id, from, to } of frReplacements) {
    if (!frTools[id]) continue
    const before = JSON.stringify(frTools[id])
    frTools[id] = deepReplaceUrls(frTools[id], from, to)
    if (JSON.stringify(frTools[id]) !== before) frChanged = true
  }
  for (const id of SUNSET_IDS) {
    if (!frTools[id]) continue
    const overlay = frTools[id]
    const before = JSON.stringify(overlay)
    const frCopy = SUNSET_COPY[id]?.statusNote_fr
    if (
      frCopy &&
      (!overlay.statusNote_fr || overlay.statusNote_fr === frCopy) &&
      overlay.statusNote_fr !== frCopy
    ) {
      overlay.statusNote_fr = frCopy
    }
    clearHowToVisitLinks(overlay)
    if (JSON.stringify(overlay) !== before) frChanged = true
  }
  if (frChanged) {
    if (checkMode) checkWouldWrite++
    else if (!dryRun) fs.writeFileSync(frPath, `${JSON.stringify(frTools, null, 2)}\n`)
  }
}

const summary = {
  dryRun,
  checkMode,
  counts: {
    fix: report.fix.length,
    renamed: report.renamed.length,
    sunset: report.sunset.length,
    magnific: report.magnific.length,
    recheck: report.recheck.length,
    skipped: report.skipped.length,
  },
  report,
}

console.log(JSON.stringify(summary, null, 2))

if (checkMode) {
  const applied =
    report.fix.length +
    report.renamed.length +
    report.sunset.length +
    report.magnific.length +
    report.recheck.length
  if (applied > 0 || checkWouldWrite > 0) {
    console.error(
      `[links-fix --check] expected 0 writes on a fully applied tree (applied=${applied}, fileWrites=${checkWouldWrite})`,
    )
    process.exit(1)
  }
  process.exit(0)
}