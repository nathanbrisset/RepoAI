#!/usr/bin/env node
/**
 * Fail when listed active tools show different € price figures in EN vs FR visitor copy.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { amountKey, normalizeAmounts } from "./lib/contenu-pricing-csv.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const allowPath = path.join(root, "scripts/prebuild/fr-en-price-parity-amount-allow.json")

/** `${slug}:${amount}` → reason (top-up packs only; prefer empty once FR note is complete). */
const DEFAULT_AMOUNT_ALLOW = {}

function loadAmountAllow() {
  if (!fs.existsSync(allowPath)) return { expires: "2026-12-15", amounts: { ...DEFAULT_AMOUNT_ALLOW } }
  const data = JSON.parse(fs.readFileSync(allowPath, "utf8"))
  return {
    expires: data.expires || "2026-12-15",
    amounts: { ...DEFAULT_AMOUNT_ALLOW, ...(data.amounts || {}) },
  }
}

function listedActive(tool) {
  const excluded = new Set(["duplicate-of", "sunset", "renamed", "inactive"])
  return tool.status === "active" && !excluded.has(tool.status)
}

function amountsStrictParity(enAmounts, frAmounts, slug, allow) {
  if (amountsCompatible(enAmounts, frAmounts)) return true
  const en = [...new Set(enAmounts)]
  const fr = [...new Set(frAmounts)]
  const extraEn = en.filter((n) => !fr.some((r) => Math.abs(r - n) < 0.02))
  const extraFr = fr.filter((n) => !en.some((l) => Math.abs(l - n) < 0.02))
  const allowed = allow.amounts || {}
  const ok = (n) => Boolean(allowed[`${slug}:${n}`])
  if (extraFr.length === 0 && extraEn.length > 0 && extraEn.every(ok)) return true
  if (extraEn.length === 0 && extraFr.length > 0 && extraFr.every(ok)) return true
  return false
}

function amountsCompatible(enAmounts, frAmounts) {
  const en = [...new Set(enAmounts)].sort((a, b) => a - b)
  let fr = [...new Set(frAmounts)].sort((a, b) => a - b)
  if (!en.includes(0) && fr.includes(0)) fr = fr.filter((n) => n !== 0)
  return amountKey(en) === amountKey(fr)
}

export function pricingFieldPairs(tool, overlay) {
  const frNote = overlay?.pricingNote_fr?.trim() || tool.pricing?.note_fr?.trim() || ""
  const pairs = [
    {
      en: tool.description,
      fr: tool.description_fr || overlay?.description_fr,
      label: "description",
    },
    {
      en: tool.pricing?.note,
      fr: frNote,
      label: "pricing.note",
    },
    {
      en: tool.pricing?.details,
      fr: frNote,
      label: "pricing.details",
    },
  ]
  return pairs.filter((p) => typeof p.en === "string" && p.en.trim() && typeof p.fr === "string" && p.fr.trim())
}

function detailsVsNoteMismatch(tool, allow) {
  const note = tool.pricing?.note?.trim()
  const details = tool.pricing?.details?.trim()
  if (!note || !details) return null
  const noteAmounts = normalizeAmounts(note)
  const detailAmounts = normalizeAmounts(details)
  if (!detailAmounts.length && !noteAmounts.length) return null
  if (amountsStrictParity(detailAmounts, noteAmounts, tool.id, allow)) {
    return null
  }
  return {
    id: tool.id,
    field: "pricing.details-vs-note",
    enAmounts: [...new Set(detailAmounts)].sort((a, b) => a - b),
    frAmounts: [...new Set(noteAmounts)].sort((a, b) => a - b),
  }
}

export function scanFrEnPriceParity({ rootDir = root } = {}) {
  const frOverlay = JSON.parse(fs.readFileSync(path.join(rootDir, "content/i18n/fr-tools.json"), "utf8"))
  const allow = loadAmountAllow()
  const today = new Date().toISOString().slice(0, 10)
  if (allow.expires && today > allow.expires) {
    throw new Error(`fr-en-price-parity-amount-allow.json expired on ${allow.expires}`)
  }
  const mismatches = []

  for (const file of fs.readdirSync(path.join(rootDir, "content/tools")).filter((n) => n.endsWith(".json"))) {
    const tool = JSON.parse(fs.readFileSync(path.join(rootDir, "content/tools", file), "utf8"))
    if (!listedActive(tool)) continue
    if (tool.pricing?.uncertain === true) continue

    const overlay = frOverlay[tool.id]
    const vsNote = detailsVsNoteMismatch(tool, allow)
    if (vsNote) {
      mismatches.push(vsNote)
      continue
    }
    for (const { en, fr, label } of pricingFieldPairs(tool, overlay)) {
      const enAmounts = normalizeAmounts(en)
      const frAmounts = normalizeAmounts(fr)
      if (enAmounts.length === 0 && frAmounts.length === 0) continue
      if (enAmounts.length === 0 || frAmounts.length === 0) continue
      if (amountsCompatible(enAmounts, frAmounts)) continue
      if (!amountsStrictParity(enAmounts, frAmounts, tool.id, allow)) {
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
  if (check && hits.length > 0) {
    console.error("\nFR/EN price parity check failed.")
    process.exit(1)
  }
  if (check) console.log("\nFR/EN price parity check passed.")
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main()
}