/**
 * Scan pricing note fields and emit unclean entries (stdout + data/pricing-notes-audit.json).
 * Uses lib/pricing-note-guard.ts via Node strip-types (same as check-match.ts).
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { uncleanReasons, isCleanPricingNote } from "../lib/pricing-note-guard.ts"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content", "tools")
const frPath = path.join(root, "content", "i18n", "fr-tools.json")
const outPath = path.join(root, "data", "pricing-notes-audit.json")

const toolFiles = fs.readdirSync(toolsDir).filter((name) => name.endsWith(".json"))

/** @type {import("../lib/pricing-note-guard.ts").PricingAuditEntry[]} */
const hidden = []
let scanned = 0
let cleanShown = 0
const hiddenByReason = /** @type {Record<string, number>} */ ({})

function bumpReasons(reasons) {
  for (const reason of reasons) {
    hiddenByReason[reason] = (hiddenByReason[reason] ?? 0) + 1
  }
}

function record(id, field, lang, value) {
  scanned++
  if (value == null || !String(value).trim()) {
    hidden.push({ id, field, lang, value: value ?? "", reasons: ["empty"] })
    bumpReasons(["empty"])
    return
  }
  const reasons = uncleanReasons(value, lang)
  if (reasons.length === 0) {
    cleanShown++
    return
  }
  hidden.push({ id, field, lang, value: String(value), reasons })
  bumpReasons(reasons)
}

for (const file of toolFiles) {
  const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8"))
  const id = tool.id ?? path.basename(file, ".json")
  const pricing = tool.pricing ?? {}
  if ("note" in pricing) record(id, "pricing.note", "en", pricing.note)
  if ("details" in pricing) record(id, "pricing.details", "en", pricing.details)
  if ("note_fr" in pricing) record(id, "pricing.note_fr", "fr", pricing.note_fr)
}

const frTools = JSON.parse(fs.readFileSync(frPath, "utf8"))
for (const [id, overlay] of Object.entries(frTools)) {
  if (overlay && typeof overlay === "object" && "pricingNote_fr" in overlay) {
    record(id, "pricingNote_fr", "fr", overlay.pricingNote_fr)
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    scanned,
    cleanShown,
    hidden: hidden.length,
    hiddenByReason,
  },
  hidden,
}

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`)

console.log(`Scanned: ${scanned}, clean (showable): ${cleanShown}, hidden: ${hidden.length}`)
console.log("Hidden by reason:", hiddenByReason)
console.log("")
console.log("Unclean entries:")
for (const row of hidden) {
  console.log(`  ${row.id}\t${row.field}\t${row.lang}\t${row.reasons.join(",")}`)
}

if (process.argv.includes("--check")) {
  const failed = hidden.filter((row) => row.reasons.some((r) => r !== "empty") || row.value.trim())
  process.exit(failed.length ? 0 : 0)
}