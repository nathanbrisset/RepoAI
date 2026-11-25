#!/usr/bin/env node
/**
 * Apply Contenu CSV to pricing notes only (no visitor-copy transforms except allowed jargon).
 *
 *   node scripts/apply-pricing-fr-2026-11-25.mjs
 *   node scripts/apply-pricing-fr-2026-11-25.mjs --check
 */
import fs from "fs"
import path from "path"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const defaultCsv = path.join(root, "data/imports/pricing-fr-2026-11-25.csv")
const toolsDir = path.join(root, "content", "tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")

const MASQUE_SLUGS = new Set([
  "codepal",
  "graphite",
  "hedra",
  "heidi-health",
  "higgsfield",
  "soundful",
])

const AMOUNT_RE =
  /\d{1,4}(?:[.,]\d{1,2})?\s*(?:€|EUR|\$|USD)(?:\/\s*(?:mo|mois|month|an|year|user|siège|seat|h|hr|heure))?|\(\s*0\s*€\s*\)/giu

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

function stableJson(obj) {
  return `${JSON.stringify(obj, null, 2)}\n`
}

function readTool(slug) {
  const p = path.join(toolsDir, `${slug}.json`)
  if (!fs.existsSync(p)) return null
  return JSON.parse(fs.readFileSync(p, "utf8"))
}

/** Only transformations allowed on CSV text before write. */
export function polishCsvNote(text, slug) {
  if (!text || typeof text !== "string") return text
  let s = text
  if (slug === "ai-floor-plan") {
    s = s.replace(
      /[;.]\s*le montant annuel n['’]est pas repris ici\.?/giu,
      ".",
    )
    s = s.replace(
      /[;.]\s*the yearly amount is not restated here\.?/giu,
      ".",
    )
    s = s.replace(
      /Une option annuelle affichée à −40 % est proposée\s*;\s*le montant annuel n['’]est pas repris ici\./u,
      "Une option annuelle à −40 % est proposée.",
    )
    s = s.replace(
      /A yearly option advertised as 40% off is offered;\s*the yearly amount is not restated here\./iu,
      "A yearly option advertised as 40% off is offered.",
    )
  }
  s = s.replace(/\s*;\s*le montant annuel n['’]est pas repris ici\.?/giu, ".")
  s = s.replace(/\s*;\s*the yearly amount is not restated here\.?/giu, ".")
  s = s.replace(/\s*;\s*le montant annuel n['’]est pas repris ici\.?/giu, ".")
  return s
}

function stripAmountsClean(text) {
  if (!text || typeof text !== "string") return text
  let s = text
  s = s.replace(AMOUNT_RE, "")
  s = s.replace(/\b\d{1,4}(?:[.,]\d{1,2})?\s*(?:€|EUR|\$|USD)\b/giu, "")
  s = s.replace(/\s+([,;:.)])/g, "$1")
  s = s.replace(/([(\[])\s+/g, "$1")
  s = s.replace(/\s{2,}/g, " ")
  s = s.replace(/\s+([;,.])/g, "$1")
  s = s.replace(/\bat\s+\./gi, ".")
  s = s.replace(/\b(from|à partir de|coûte|costs?)\s*([;,.]|$)/gi, "$2")
  s = s.replace(/;\s*;/g, ";")
  return s.trim()
}

function cleanSentences(text) {
  let s = stripAmountsClean(text)
  s = s.replace(/\bcostsper\b/gi, "costs per")
  s = s.replace(/\bcostsand\b/gi, "costs and")
  s = s.replace(/\bisPer\b/gi, "is per")
  s = s.replace(/\bisper\b/gi, "is per")
  s = s.replace(/\bTeamper\b/gi, "Team per")
  return s.trim()
}

function scrubMasqueVisitor(tool, overlay) {
  if (tool.description) tool.description = cleanSentences(tool.description)
  if (tool.description_fr) tool.description_fr = cleanSentences(tool.description_fr)
  const dfr = overlay.description_fr ?? tool.description_fr
  if (dfr) {
    if (overlay.description_fr != null) overlay.description_fr = cleanSentences(dfr)
    else tool.description_fr = cleanSentences(dfr)
  }
  for (const key of ["features", "features_fr"]) {
    const inOverlay = key === "features_fr" && overlay.features_fr
    const arr = inOverlay ? overlay.features_fr : tool[key]
    if (!Array.isArray(arr)) continue
    const next = arr.map((line) => (typeof line === "string" ? cleanSentences(line) : line))
    if (inOverlay) overlay.features_fr = next
    else tool[key] = next
  }
  const scrubSteps = (steps) => {
    if (!Array.isArray(steps)) return steps
    return steps.map((step) => {
      if (!step || typeof step.description !== "string") return step
      let desc = cleanSentences(step.description)
      desc = desc.replace(/^Commence par:\s*/iu, "")
      return { ...step, description: desc }
    })
  }
  tool.howToUse = scrubSteps(tool.howToUse)
  if (overlay.howToUse_fr) overlay.howToUse_fr = scrubSteps(overlay.howToUse_fr)
  else if (tool.howToUse_fr) tool.howToUse_fr = scrubSteps(tool.howToUse_fr)
}

function applyRow(row, ctx) {
  const slug = row.slug?.trim()
  if (!slug) return
  const statut = (row.statut || "").trim().toLowerCase()
  const isMasque = statut === "masqué" || statut === "masque" || MASQUE_SLUGS.has(slug)
  const isOk = statut === "ok"

  const tool = readTool(slug)
  if (!tool) {
    ctx.missing.push(slug)
    return
  }
  ctx.fr[slug] ??= {}
  const overlay = ctx.fr[slug]
  const beforeTool = stableJson(tool)
  const beforeOverlay = stableJson(overlay)

  const noteFr = polishCsvNote((row.pricing_note_fr_corrigee || "").trim(), slug)
  const noteEn = polishCsvNote((row.pricing_note_en_corrigee || "").trim(), slug)

  if (!tool.pricing) tool.pricing = { verified: true }

  if (isMasque) {
    ctx.counts.masque++
    tool.pricing.uncertain = true
    tool.pricing.verified = true
    if (noteEn) tool.pricing.note = noteEn
    else delete tool.pricing.note
    delete tool.pricing.details
    delete tool.pricing.note_fr
    if (noteFr) overlay.pricingNote_fr = noteFr
    else delete overlay.pricingNote_fr
    const src = (row.source_url || "").trim()
    if (src) tool.pricing.sourceUrl = src
    ctx.touched.add(slug)
  } else if (isOk) {
    ctx.counts.ok++
    if (noteFr) overlay.pricingNote_fr = noteFr
    else delete overlay.pricingNote_fr
    if (tool.pricing.note_fr) delete tool.pricing.note_fr
    if (noteEn) tool.pricing.note = noteEn
    const src = (row.source_url || "").trim()
    if (src) tool.pricing.sourceUrl = src
    if (tool.pricing.uncertain) delete tool.pricing.uncertain
    ctx.touched.add(slug)
  }

  if (stableJson(tool) !== beforeTool) {
    ctx.wouldChange = true
    if (!ctx.dry) fs.writeFileSync(path.join(toolsDir, `${slug}.json`), stableJson(tool))
  }
  if (stableJson(overlay) !== beforeOverlay) {
    ctx.wouldChange = true
    ctx.frDirty = true
  }
}

function main() {
  const dry = process.argv.includes("--check")
  const csvPath = process.argv.find((a, i) => process.argv[i - 1] === "--csv") || defaultCsv
  const rows = parseCsv(fs.readFileSync(csvPath, "utf8"))
  const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))

  const ctx = {
    dry,
    fr,
    frDirty: false,
    wouldChange: false,
    touched: new Set(),
    missing: [],
    counts: { ok: 0, masque: 0 },
  }

  for (const row of rows) applyRow(row, ctx)

  if (ctx.frDirty && !dry) fs.writeFileSync(frPath, stableJson(ctx.fr))

  console.log(
    `CSV apply (notes only): ok=${ctx.counts.ok} masqué=${ctx.counts.masque} touched=${ctx.touched.size}${dry ? " [check]" : ""}`,
  )
  if (ctx.missing.length) {
    console.error("Missing tools:", ctx.missing.join(", "))
    process.exit(1)
  }
  if (dry) {
    const verify = path.join(root, "scripts/verify-pricing-fr-csv-applied.mjs")
    const r = spawnSync(process.execPath, [verify, "--check"], { stdio: "inherit" })
    process.exit(r.status ?? 1)
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main()
}