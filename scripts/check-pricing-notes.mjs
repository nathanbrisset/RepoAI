/**
 * Scan pricing note fields; fail CI on fixable guard violations.
 *
 *   node --experimental-strip-types scripts/check-pricing-notes.mjs          # summary only
 *   node --experimental-strip-types scripts/check-pricing-notes.mjs --check    # exit 1 on violations
 *   node --experimental-strip-types scripts/check-pricing-notes.mjs --write    # refresh audit JSON if changed
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { uncleanReasons } from "../lib/pricing-note-guard.ts"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content", "tools")
const frPath = path.join(root, "content", "i18n", "fr-tools.json")
const outPath = path.join(root, "data", "pricing-notes-audit.json")

/** USD notes intentionally held for PM re-check (hidden at runtime is OK). */
const HELD_PRICING_NOTE_EN = new Set([
  "dia",
  "grammarly",
  "grok",
  "myedit",
  "perplexity-ai",
  "perplexity-comet",
  "recapo",
])

/** No public EUR price; mentioning "dollar" in the note is intentional (guard hides). */
const DOLLAR_MENTION_SLUGS = new Set([
  "amazon-codewhisperer",
  "amazon-q-developer",
  "arcads",
  "duolingo",
  "profound",
  "voiceflow",
])

export function scanPricingNotes() {
  const toolFiles = fs.readdirSync(toolsDir).filter((name) => name.endsWith(".json"))
  const hidden = []
  let scanned = 0
  let cleanShown = 0
  const hiddenByReason = /** @type {Record<string, number>} */ ({})

  const bumpReasons = (reasons) => {
    for (const reason of reasons) {
      hiddenByReason[reason] = (hiddenByReason[reason] ?? 0) + 1
    }
  }

  const record = (id, field, lang, value) => {
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

  return {
    summary: { scanned, cleanShown, hidden: hidden.length, hiddenByReason },
    hidden,
  }
}

function canonicalPayload({ summary, hidden }) {
  return JSON.stringify({ summary, hidden })
}

function isAllowedHidden(row) {
  if (row.reasons.length === 1 && row.reasons[0] === "empty") return true
  if (
    row.field === "pricing.note" &&
    row.lang === "en" &&
    row.reasons.every((r) => r === "non_eur_currency") &&
    (HELD_PRICING_NOTE_EN.has(row.id) || DOLLAR_MENTION_SLUGS.has(row.id))
  ) {
    return true
  }
  return false
}

function listViolations(hidden) {
  return hidden.filter((row) => !isAllowedHidden(row))
}

function main() {
  const write = process.argv.includes("--write")
  const check = process.argv.includes("--check")
  const report = scanPricingNotes()
  const violations = listViolations(report.hidden)

  console.log(
    `Scanned: ${report.summary.scanned}, clean (showable): ${report.summary.cleanShown}, hidden: ${report.summary.hidden}`,
  )
  console.log("Hidden by reason:", report.summary.hiddenByReason)
  if (report.summary.hidden) {
    console.log("")
    console.log("Unclean entries:")
    for (const row of report.hidden) {
      const tag = isAllowedHidden(row) ? "allow" : "VIOLATION"
      console.log(`  [${tag}] ${row.id}\t${row.field}\t${row.lang}\t${row.reasons.join(",")}`)
    }
  }

  if (write) {
    const nextBody = `${canonicalPayload(report)}\n`
    let previousBody = ""
    if (fs.existsSync(outPath)) {
      const prev = JSON.parse(fs.readFileSync(outPath, "utf8"))
      previousBody = `${canonicalPayload({ summary: prev.summary, hidden: prev.hidden })}\n`
    }
    if (nextBody !== previousBody) {
      fs.mkdirSync(path.dirname(outPath), { recursive: true })
      fs.writeFileSync(
        outPath,
        `${JSON.stringify({ ...report, generatedAt: "2026-11-16T00:00:00.000Z" }, null, 2)}\n`,
      )
      console.log(`\nWrote ${outPath} (content changed)`)
    } else {
      console.log(`\nAudit unchanged; ${outPath} not rewritten`)
    }
  }

  if (check) {
    if (violations.length > 0) {
      console.error(`\nPricing note check failed: ${violations.length} violation(s).`)
      process.exit(1)
    }
    console.log("\nPricing note check passed.")
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main()
}