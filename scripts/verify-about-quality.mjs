#!/usr/bin/env node
/**
 * Fail CI when served « À propos » / card copy is stubbed or too short for Nat GO slugs.
 *
 *   node scripts/verify-about-quality.mjs
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import {
  REGRESSION_ANCHORS,
  appliedManifestPath,
  isCollapsedCardAndAbout,
  isDomainDotStub,
  loadFrTools,
  loadListedTools,
  servedEn,
  servedFr,
  sha256,
  toolsDir,
} from "./about-quality-lib.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const MIN_ABOUT_LEN = 120

function loadNatIds() {
  const manifest = JSON.parse(fs.readFileSync(appliedManifestPath, "utf8"))
  return new Set(manifest.ids || [])
}

function checkRegressionAnchors() {
  const errors = []
  const frTools = loadFrTools()
  for (const [id, expected] of Object.entries(REGRESSION_ANCHORS)) {
    const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, `${id}.json`), "utf8"))
    const overlay = frTools[id] || {}
    const fr = servedFr(tool, overlay)
    const en = servedEn(tool)
    const got = {
      summary_fr: sha256(fr.summary),
      description_fr: sha256(fr.description),
      summary_en: sha256(en.summary),
      description_en: sha256(en.description),
    }
    for (const [key, hash] of Object.entries(expected)) {
      if (got[key] !== hash) {
        errors.push(`${id}: ${key} changed (expected ${hash.slice(0, 12)}… got ${got[key].slice(0, 12)}…)`)
      }
    }
  }
  return errors
}

function main() {
  if (!fs.existsSync(appliedManifestPath)) {
    console.error(`Missing ${appliedManifestPath} — run import-nat-go-descriptions.mjs first`)
    process.exit(1)
  }

  const natIds = loadNatIds()
  const failures = []
  failures.push(...checkRegressionAnchors())

  for (const { tool, overlay } of loadListedTools()) {
    const inNat = natIds.has(tool.id)
    if (!inNat && !REGRESSION_ANCHORS[tool.id]) continue

    const fr = servedFr(tool, overlay)
    const en = servedEn(tool)

    if (inNat) {
      for (const [label, text] of [
        ["FR summary", fr.summary],
        ["FR about", fr.description],
        ["EN summary", en.summary],
        ["EN about", en.description],
      ]) {
        if (isDomainDotStub(text, tool)) {
          failures.push(`${tool.id}: ${label} is domain-dot stub: ${JSON.stringify(text)}`)
        }
      }
      for (const [label, text] of [
        ["FR about", fr.description],
        ["EN about", en.description],
      ]) {
        if ((text || "").trim().length < MIN_ABOUT_LEN) {
          failures.push(`${tool.id}: ${label} length ${(text || "").length} < ${MIN_ABOUT_LEN}`)
        }
      }
      if (isCollapsedCardAndAbout(fr.summary, fr.description)) {
        failures.push(`${tool.id}: FR summary_fr === description_fr and both < 40 chars`)
      }
    }
  }

  if (failures.length) {
    console.error("verify-about-quality FAILED:\n" + failures.map((f) => `  - ${f}`).join("\n"))
    process.exit(1)
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        natSlugsChecked: natIds.size,
        regressionAnchors: Object.keys(REGRESSION_ANCHORS),
      },
      null,
      2,
    ),
  )
}

main()
