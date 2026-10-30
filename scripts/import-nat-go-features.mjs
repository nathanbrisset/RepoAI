#!/usr/bin/env node
/**
 * Nat GO — apply curated FR/EN feature lists from semicolon CSV.
 * Copy is applied verbatim (pipe-separated cells → string arrays). Does not create new tools.
 *
 *   node scripts/import-nat-go-features.mjs [--dry-run] [path/to.csv]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { frPath, toolsDir } from "./about-quality-lib.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const defaultCsv = path.join(root, "data/import-2026-10-30/features-nat-go.csv")
const appliedManifestPath = path.join(root, "data/nat-go-features-applied.json")
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

function splitFeatures(cell) {
  return (cell || "")
    .split(/\s*\|\s*/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function arraysEqual(a, b) {
  if (!a && !b) return true
  if (!a || !b || a.length !== b.length) return false
  return a.every((v, i) => v === b[i])
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
    skippedMissingFeatures: [],
    toolFilesWritten: 0,
    frOverlayUpdated: 0,
    unchanged: 0,
  }

  const appliedIds = []

  for (const row of rows) {
    const id = row.id
    if (!id) continue

    const featuresFr = splitFeatures(row["Fonctionnalités FR"])
    const featuresEn = splitFeatures(row["Features EN"])

    if (!featuresFr.length || !featuresEn.length) {
      report.skippedMissingFeatures.push(id)
      continue
    }

    const toolFile = path.join(toolsDir, `${id}.json`)
    if (!fs.existsSync(toolFile)) {
      report.skippedUnknown.push(id)
      continue
    }

    const tool = JSON.parse(fs.readFileSync(toolFile, "utf8"))
    let toolChanged = false

    if (!arraysEqual(tool.features, featuresEn)) {
      tool.features = featuresEn
      toolChanged = true
    }
    if (!arraysEqual(tool.features_fr, featuresFr)) {
      tool.features_fr = featuresFr
      toolChanged = true
    }

    if (toolChanged) {
      writeJson(toolFile, tool)
      report.toolFilesWritten++
    } else {
      report.unchanged++
    }

    if (!fr[id]) fr[id] = {}
    const entry = fr[id]
    let overlayChanged = false
    if (!arraysEqual(entry.features_fr, featuresFr)) {
      entry.features_fr = featuresFr
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
    console.error("Unknown ids:", report.skippedUnknown.join(", "))
  }
  if (report.skippedMissingFeatures.length) {
    console.error("Missing features:", report.skippedMissingFeatures.join(", "))
  }
}

main()
