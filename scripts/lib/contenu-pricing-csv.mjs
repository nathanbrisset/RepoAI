import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { polishCsvNote } from "../apply-pricing-fr-2026-11-25.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const csvPath = path.join(root, "data/imports/pricing-fr-2026-11-25.csv")

const AMOUNT_RE =
  /(?:^|[^\d])(\d{1,4}(?:[ \u00a0]\d{3})*(?:[.,]\d{1,2})?)\s*€/giu

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

let _rows
export function contenuCsvRows() {
  if (!_rows) _rows = parseCsv(fs.readFileSync(csvPath, "utf8"))
  return _rows
}

export function contenuSlugSet() {
  return new Set(contenuCsvRows().map((r) => r.slug?.trim()).filter(Boolean))
}

export function contenuFrNoteBySlug() {
  const map = new Map()
  for (const row of contenuCsvRows()) {
    const slug = row.slug?.trim()
    if (!slug) continue
    map.set(slug, polishCsvNote((row.pricing_note_fr_corrigee || "").trim(), slug))
  }
  return map
}

export function normalizeAmounts(text) {
  if (!text || typeof text !== "string") return []
  const out = []
  let m
  const re = new RegExp(AMOUNT_RE.source, AMOUNT_RE.flags)
  while ((m = re.exec(text)) !== null) {
    const raw = m[1].replace(/[ \u00a0]/g, "").replace(",", ".")
    const n = Number.parseFloat(raw)
    if (!Number.isNaN(n)) out.push(n)
  }
  return [...new Set(out)].sort((a, b) => a - b)
}

export function amountKey(amounts) {
  return JSON.stringify(amounts)
}

export function frNoteMatchesCsv(overlayNote, slug, csvBySlug = contenuFrNoteBySlug()) {
  const csv = csvBySlug.get(slug)
  if (!csv || !overlayNote?.trim()) return false
  return amountKey(normalizeAmounts(csv)) === amountKey(normalizeAmounts(overlayNote))
}