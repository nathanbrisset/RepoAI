#!/usr/bin/env node
/**
 * Compare pricing-fr CSV expectations to on-disk JSON (153 slugs).
 *
 *   node scripts/verify-pricing-fr-csv-applied.mjs --check
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { polishCsvNote } from "./apply-pricing-fr-2026-11-25.mjs"
import { localizeGroupCText } from "./apply-pricing-group-c-ecb.mjs"

const GROUP_C = new Set(["cartesia", "kagi", "khanmigo", "typecast", "zed"])

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const csvPath = path.join(root, "data/imports/pricing-fr-2026-11-25.csv")
const toolsDir = path.join(root, "content", "tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")

const AMOUNT_IN_TEXT =
  /\d{1,4}(?:[.,]\d{1,2})?\s*(?:€|EUR|\$|USD)/iu

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

function norm(s) {
  return String(s || "")
}

function main() {
  const check = process.argv.includes("--check")
  const rows = parseCsv(fs.readFileSync(csvPath, "utf8"))
  const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
  const diffs = []

  for (const row of rows) {
    const slug = row.slug?.trim()
    if (!slug) continue
    const statut = (row.statut || "").trim().toLowerCase()
    const isMasque = statut === "masqué" || statut === "masque"
    const toolPath = path.join(toolsDir, `${slug}.json`)
    if (!fs.existsSync(toolPath)) {
      diffs.push({ slug, field: "tool", expected: "exists", actual: "missing" })
      continue
    }
    const tool = JSON.parse(fs.readFileSync(toolPath, "utf8"))
    const overlay = fr[slug] || {}
    let expectFr = polishCsvNote((row.pricing_note_fr_corrigee || "").trim(), slug)
    let expectEn = polishCsvNote((row.pricing_note_en_corrigee || "").trim(), slug)
    if (GROUP_C.has(slug)) {
      if (expectFr) expectFr = localizeGroupCText(expectFr, "fr", slug)
      if (expectEn) expectEn = localizeGroupCText(expectEn, "en", slug)
    }
    const actualFr = norm(overlay.pricingNote_fr)
    const actualEn = norm(tool.pricing?.note)

    if (expectFr && actualFr !== norm(expectFr)) {
      diffs.push({ slug, field: "pricingNote_fr", expected: expectFr.slice(0, 80), actual: actualFr.slice(0, 80) })
    }
    if (!isMasque && expectEn && actualEn !== norm(expectEn)) {
      diffs.push({ slug, field: "pricing.note", expected: expectEn.slice(0, 80), actual: actualEn.slice(0, 80) })
    }

    if (isMasque) {
      if (tool.pricing?.uncertain !== true) {
        diffs.push({ slug, field: "pricing.uncertain", expected: true, actual: tool.pricing?.uncertain })
      }
      const blobs = [
        tool.description,
        overlay.description_fr,
        ...(tool.features || []),
        ...(overlay.features_fr || []),
      ].filter(Boolean)
      for (const blob of blobs) {
        if (AMOUNT_IN_TEXT.test(blob)) {
          diffs.push({ slug, field: "masqué-amount", expected: "no €", actual: blob.slice(0, 60) })
          break
        }
      }
    }

    const src = (row.source_url || "").trim()
    if (src && tool.pricing?.sourceUrl && tool.pricing.sourceUrl !== src) {
      diffs.push({
        slug,
        field: "pricing.sourceUrl",
        expected: src,
        actual: tool.pricing.sourceUrl,
      })
    }
  }

  console.log(`CSV↔JSON diff: ${diffs.length} difference(s) on ${rows.length} rows`)
  for (const d of diffs.slice(0, 50)) {
    console.log(`  ${d.slug}\t${d.field}\texpected: ${JSON.stringify(d.expected)}\tactual: ${JSON.stringify(d.actual)}`)
  }
  if (diffs.length > 50) console.log(`  ... and ${diffs.length - 50} more`)

  const outPath = path.join(root, "data/imports/pricing-fr-csv-verify-latest.txt")
  const lines = [
    `pricing-fr CSV verify @ ${new Date().toISOString()}`,
    `rows: ${rows.length}`,
    `diffs: ${diffs.length}`,
    "",
    ...diffs.map(
      (d) => `${d.slug}\t${d.field}\t${JSON.stringify(d.expected)}\t${JSON.stringify(d.actual)}`,
    ),
  ]
  fs.writeFileSync(outPath, lines.join("\n") + "\n")
  console.log(`Wrote ${outPath}`)

  if (check && diffs.length) process.exit(1)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main()
}