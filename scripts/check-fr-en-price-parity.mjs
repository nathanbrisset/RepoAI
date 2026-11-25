#!/usr/bin/env node
/**
 * Fail when listed active tools show different € price figures in EN vs FR visitor copy.
 * Compares description, pricing.note/details and FR overlays (pricingNote_fr, note_fr).
 *
 *   node scripts/check-fr-en-price-parity.mjs [--check]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const AMOUNT_RE =
  /(?:^|[^\d])(\d{1,4}(?:[.,]\d{1,2})?)\s*(?:€|EUR\b|\$|USD\b)/giu

function listedActive(tool) {
  const excluded = new Set(["duplicate-of", "sunset", "renamed", "inactive"])
  return tool.status === "active" && !excluded.has(tool.status)
}

function normalizeAmounts(text) {
  if (!text || typeof text !== "string") return []
  const out = []
  let m
  const re = new RegExp(AMOUNT_RE.source, AMOUNT_RE.flags)
  while ((m = re.exec(text)) !== null) {
    const raw = m[1].replace(",", ".")
    const n = Number.parseFloat(raw)
    if (!Number.isNaN(n)) out.push(n)
  }
  return out
}

function amountKey(amounts) {
  return JSON.stringify([...new Set(amounts)].sort((a, b) => a - b))
}

/** FR copy often adds explicit 0 € for free tiers that EN omits. */
function amountsCompatible(enAmounts, frAmounts) {
  const en = [...new Set(enAmounts)].sort((a, b) => a - b)
  let fr = [...new Set(frAmounts)].sort((a, b) => a - b)
  if (!en.includes(0) && fr.includes(0)) {
    fr = fr.filter((n) => n !== 0)
  }
  if (amountKey(en) === amountKey(fr)) return true
  /* Contenu FR notes often list a subset of EN detail tiers */
  if (fr.length > 0 && fr.every((n) => en.includes(n))) return true
  return false
}

/** EN/FR text pairs checked when both sides may carry prices. */
export function pricingFieldPairs(tool, overlay) {
  const pairs = [
    {
      en: tool.description,
      fr: tool.description_fr || overlay?.description_fr,
      label: "description",
    },
    {
      en: tool.pricing?.note,
      fr: tool.pricing?.note_fr || overlay?.pricingNote_fr,
      label: "pricing.note",
    },
    {
      en: tool.pricing?.details,
      fr: tool.pricing?.note_fr || overlay?.pricingNote_fr,
      label: "pricing.details",
    },
  ]
  const hasEnNote = typeof tool.pricing?.note === "string" && tool.pricing.note.trim()
  return pairs
    .filter((p) => !(p.label === "pricing.details" && hasEnNote))
    .filter((p) => typeof p.en === "string" && p.en.trim() && typeof p.fr === "string" && p.fr.trim())
}

export function collectTexts(tool, overlay) {
  return pricingFieldPairs(tool, overlay).flatMap((p) => [p.en, p.fr])
}

export function scanFrEnPriceParity({ rootDir = root } = {}) {
  const frOverlay = JSON.parse(fs.readFileSync(path.join(rootDir, "content/i18n/fr-tools.json"), "utf8"))
  const mismatches = []

  for (const file of fs.readdirSync(path.join(rootDir, "content/tools")).filter((n) => n.endsWith(".json"))) {
    const tool = JSON.parse(fs.readFileSync(path.join(rootDir, "content/tools", file), "utf8"))
    if (!listedActive(tool)) continue
    if (tool.pricing?.uncertain === true) continue

    const overlay = frOverlay[tool.id]
    for (const { en, fr, label } of pricingFieldPairs(tool, overlay)) {
      const enAmounts = normalizeAmounts(en)
      const frAmounts = normalizeAmounts(fr)
      if (enAmounts.length === 0 && frAmounts.length === 0) continue
      if (enAmounts.length === 0 || frAmounts.length === 0) continue
      if (!amountsCompatible(enAmounts, frAmounts)) {
        mismatches.push({
          id: tool.id,
          field: label,
          enAmounts: [...new Set(enAmounts)].sort((a, b) => a - b),
          frAmounts: [...new Set(frAmounts)].sort((a, b) => a - b),
        })
        break
      }
    }

    const descEn = tool.description?.trim() || ""
    const descFr =
      tool.description_fr?.trim() ||
      overlay?.description_fr?.trim() ||
      tool.summary_fr?.trim() ||
      overlay?.summary_fr?.trim() ||
      ""
    if (descEn && descFr) {
      const enAmounts = normalizeAmounts(descEn)
      const frAmounts = normalizeAmounts(descFr)
      if (enAmounts.length && frAmounts.length && !amountsCompatible(enAmounts, frAmounts)) {
        if (!mismatches.some((m) => m.id === tool.id && m.field === "description")) {
          mismatches.push({
            id: tool.id,
            field: "description",
            enAmounts: [...new Set(enAmounts)].sort((a, b) => a - b),
            frAmounts: [...new Set(frAmounts)].sort((a, b) => a - b),
          })
        }
      }
    }
  }
  return mismatches
}

function main() {
  const check = process.argv.includes("--check")
  const hits = scanFrEnPriceParity()
  console.log(`FR/EN price parity: ${hits.length} mismatch(es)`)
  for (const row of hits.slice(0, 50)) {
    console.log(
      `  ${row.id}\t${row.field}\tEN [${row.enAmounts.join(", ")}]\tFR [${row.frAmounts.join(", ")}]`,
    )
  }
  if (hits.length > 50) console.log(`  ... and ${hits.length - 50} more`)
  if (check && hits.length > 0) {
    console.error("\nFR/EN price parity check failed.")
    process.exit(1)
  }
  if (check) console.log("\nFR/EN price parity check passed.")
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main()
}