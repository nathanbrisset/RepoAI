/**
 * Apply PM-approved rows from pricing-notes-fix.json (one-off content pass for PR #54).
 * Run: node scripts/apply-pricing-notes-fix.mjs <path-to-fix.json>
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content", "tools")
const frPath = path.join(root, "content", "i18n", "fr-tools.json")
const usdRefPath = path.join(root, "data", "pricing-usd-official-reference.json")

const HOLD_SLUGS = new Set([
  "myedit",
  "recapo",
  "dia",
  "grok",
  "grammarly",
  "perplexity-ai",
  "perplexity-comet",
])

const DELETE_NOTE_SLUGS = new Set(["kimi", "pycaret"])

const fixPath = process.argv[2]
if (!fixPath) {
  console.error("Usage: node scripts/apply-pricing-notes-fix.mjs <pricing-notes-fix.json>")
  process.exit(1)
}

const rows = JSON.parse(fs.readFileSync(fixPath, "utf8"))
const frTools = JSON.parse(fs.readFileSync(frPath, "utf8"))

const applied = []
const skippedHold = []
const skippedMistral = []
const mismatches = []
const usdReference = []

function norm(v) {
  if (v == null) return null
  return String(v)
}

function readCurrent(slug, field) {
  if (field === "pricingNote_fr") {
    return frTools[slug]?.pricingNote_fr ?? undefined
  }
  const toolPath = path.join(toolsDir, `${slug}.json`)
  if (!fs.existsSync(toolPath)) return undefined
  const tool = JSON.parse(fs.readFileSync(toolPath, "utf8"))
  const pricing = tool.pricing ?? {}
  if (field === "pricing.note") return pricing.note
  if (field === "pricing.note_fr") return pricing.note_fr
  if (field === "pricing.details") return pricing.details
  return undefined
}

function writeField(slug, field, value) {
  if (field === "pricingNote_fr") {
    if (!frTools[slug]) frTools[slug] = {}
    if (value === undefined) delete frTools[slug].pricingNote_fr
    else frTools[slug].pricingNote_fr = value
    return
  }
  const toolPath = path.join(toolsDir, `${slug}.json`)
  const tool = JSON.parse(fs.readFileSync(toolPath, "utf8"))
  if (!tool.pricing) tool.pricing = { verified: false }
  const key =
    field === "pricing.note" ? "note" : field === "pricing.note_fr" ? "note_fr" : field === "pricing.details" ? "details" : null
  if (!key) throw new Error(`Unknown field ${field}`)
  if (value === undefined) delete tool.pricing[key]
  else tool.pricing[key] = value
  fs.writeFileSync(toolPath, `${JSON.stringify(tool, null, 2)}\n`)
}

for (const row of rows) {
  const { slug, field, old_value, new_value, note } = row

  if (field === "pricing_usd_official") {
    const reChecked = /Re-checked\s+16\s+Nov\s+2026/i.test(note || "")
    usdReference.push({
      slug,
      field,
      usdValue: new_value,
      source: reChecked ? "official-page-2026-11-16" : "catalog-note-ecb-conversion-source",
      note: note || "",
    })
    continue
  }

  if (HOLD_SLUGS.has(slug)) {
    skippedHold.push({ slug, field })
    continue
  }

  if (slug === "mistral" && field === "pricing.note") {
    skippedMistral.push({ slug, field, reason: "keep original EN note; Le Chat guard whitelist" })
    continue
  }

  const current = readCurrent(slug, field)
  const oldNorm = norm(old_value)
  const curNorm = current === undefined ? undefined : norm(current)

  if (oldNorm !== null && curNorm !== oldNorm) {
    mismatches.push({ slug, field, expected: old_value, actual: current })
    continue
  }

  if (DELETE_NOTE_SLUGS.has(slug) && field === "pricing.note") {
    writeField(slug, field, undefined)
    applied.push({ slug, field, action: "delete" })
    continue
  }

  if (new_value === "" || new_value == null) {
    writeField(slug, field, undefined)
    applied.push({ slug, field, action: "delete" })
    continue
  }

  writeField(slug, field, new_value)
  applied.push({ slug, field, action: "set" })
}

fs.writeFileSync(frPath, `${JSON.stringify(frTools, null, 2)}\n`)

const usdOut = {
  generatedAt: new Date().toISOString(),
  fxSource: "ECB eurofxref-daily 2026-11-13 (1 EUR = 1.1052 USD); see fx-notes.md",
  disclaimer:
    "Reference only — not imported by app code and never displayed. Official USD amounts preserved when EN notes were converted to EUR.",
  entries: usdReference,
}
fs.writeFileSync(usdRefPath, `${JSON.stringify(usdOut, null, 2)}\n`)

const report = { applied: applied.length, skippedHold, skippedMistral, mismatches, usdReferenceRows: usdReference.length }
console.log(JSON.stringify(report, null, 2))
if (mismatches.length) process.exitCode = 1