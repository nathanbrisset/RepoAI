#!/usr/bin/env node
/**
 * Nat GO — apply curated FR/EN card + fiche descriptions from semicolon CSV.
 * FR copy is applied verbatim (tutoiement preserved). Does not create new tools.
 *
 *   node scripts/import-nat-go-descriptions.mjs [--dry-run] [path/to.csv]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { appliedManifestPath, frPath, toolsDir } from "./about-quality-lib.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const defaultCsv = path.join(root, "data/import-2026-10-30/descriptions-nat-go.csv")
const csvPath = process.argv.find((a) => a.endsWith(".csv")) || defaultCsv
const dryRun = process.argv.includes("--dry-run")

function writeJson(file, value) {
  if (dryRun) return
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

function parseSemicolonCsv(text) {
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
    else if (c === ";") {
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
  const headers = rows[0].map((h) => h.trim())
  return rows
    .slice(1)
    .filter((r) => r.some((v) => v && v.trim()))
    .map((r) => Object.fromEntries(headers.map((h, i) => [h, (r[i] ?? "").trim()])))
}


function shouldUpdateUrl(current, fromCsv) {
  const next = (fromCsv || "").trim()
  if (!next || !/^https?:\/\//i.test(next)) return false
  const cur = (current || "").trim()
  return !cur
}

function main() {
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV not found: ${csvPath}`)
    process.exit(1)
  }
  const rows = parseSemicolonCsv(fs.readFileSync(csvPath, "utf8"))
  const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))

  const report = {
    dryRun,
    csvPath,
    rowsInCsv: rows.length,
    applied: 0,
    skippedUnknown: [],
    urlUpdates: 0,
    toolFilesWritten: 0,
    frOverlayUpdated: 0,
  }

  const appliedIds = []

  for (const row of rows) {
    const id = row.id
    if (!id) continue
    const toolFile = path.join(toolsDir, `${id}.json`)
    if (!fs.existsSync(toolFile)) {
      report.skippedUnknown.push(id)
      continue
    }

    const summaryFr = (row["Résumé FR (carte)"] || "").trim()
    const descriptionFr = (row["Description FR (fiche)"] || "").trim()
    const summaryEn = (row["Summary EN (card)"] || "").trim()
    const descriptionEn = (row["Description EN (fiche)"] || "").trim()
    const site = row.Site

    if (!summaryFr || !descriptionFr || !summaryEn || !descriptionEn) {
      report.skippedUnknown.push(`${id} (missing column)`)
      continue
    }

    const tool = JSON.parse(fs.readFileSync(toolFile, "utf8"))
    let toolChanged = false

    if (tool.summary !== summaryEn) {
      tool.summary = summaryEn
      toolChanged = true
    }
    if (tool.description !== descriptionEn) {
      tool.description = descriptionEn
      toolChanged = true
    }
    if (tool.summary_fr !== summaryFr) {
      tool.summary_fr = summaryFr
      toolChanged = true
    }
    if (tool.description_fr !== descriptionFr) {
      tool.description_fr = descriptionFr
      toolChanged = true
    }
    if (shouldUpdateUrl(tool.url, site)) {
      tool.url = site.trim()
      report.urlUpdates++
      toolChanged = true
    }

    if (toolChanged) {
      writeJson(toolFile, tool)
      report.toolFilesWritten++
    }

    if (!fr[id]) fr[id] = {}
    const entry = fr[id]
    let overlayChanged = false
    if (entry.summary_fr !== summaryFr) {
      entry.summary_fr = summaryFr
      overlayChanged = true
    }
    if (entry.description_fr !== descriptionFr) {
      entry.description_fr = descriptionFr
      overlayChanged = true
    }
    if (overlayChanged) report.frOverlayUpdated++

    appliedIds.push(id)
    report.applied++
  }

  writeJson(frPath, fr)
  writeJson(appliedManifestPath, {
    source: path.relative(root, csvPath),
    appliedAt: new Date().toISOString().slice(0, 10),
    ids: appliedIds,
    count: appliedIds.length,
  })

  console.log(JSON.stringify(report, null, 2))
  if (report.skippedUnknown.length) {
    console.error("Skipped:", report.skippedUnknown.join(", "))
  }
}

main()
