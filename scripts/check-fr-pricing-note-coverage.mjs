#!/usr/bin/env node
/**
 * Fail when EN has a pricing note/details string but FR has no pricingNote_fr / note_fr.
 *
 *   node scripts/check-fr-pricing-note-coverage.mjs [--check]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

function listedActive(tool) {
  if (tool.status !== "active") return false
  if (
    tool.status === "duplicate-of" ||
    tool.status === "sunset" ||
    tool.status === "renamed" ||
    tool.status === "inactive"
  ) {
    return false
  }
  return true
}

function enPricingNotePresent(pricing) {
  if (!pricing || pricing.uncertain === true) return false
  return Boolean(pricing.note?.trim())
}

function frPricingNotePresent(tool, overlay) {
  const inline = tool.pricing?.note_fr?.trim()
  const overlayNote = overlay?.pricingNote_fr?.trim()
  return Boolean(inline || overlayNote)
}

export function scanFrPricingNoteCoverage({ rootDir = root } = {}) {
  const frPath = path.join(rootDir, "content/i18n/fr-tools.json")
  const toolsDir = path.join(rootDir, "content/tools")
  const frOverlay = JSON.parse(fs.readFileSync(frPath, "utf8"))
  const missing = []

  for (const file of fs.readdirSync(toolsDir).filter((n) => n.endsWith(".json"))) {
    const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8"))
    if (!listedActive(tool)) continue
    if (!enPricingNotePresent(tool.pricing)) continue
    const overlay = frOverlay[tool.id]
    if (!frPricingNotePresent(tool, overlay)) {
      missing.push({
        id: tool.id,
        enNote: (tool.pricing.note || tool.pricing.details || "").slice(0, 100),
      })
    }
  }
  return missing
}

function main() {
  const check = process.argv.includes("--check")
  const hits = scanFrPricingNoteCoverage()
  console.log(`FR pricing-note coverage: ${hits.length} missing`)
  for (const row of hits.slice(0, 50)) {
    console.log(`  ${row.id}\t${row.enNote.replace(/\s+/g, " ")}`)
  }
  if (hits.length > 50) console.log(`  ... and ${hits.length - 50} more`)
  if (check && hits.length > 0) {
    console.error("\nFR pricing-note coverage check failed.")
    process.exit(1)
  }
  if (check) console.log("\nFR pricing-note coverage check passed.")
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main()
}