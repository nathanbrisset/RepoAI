#!/usr/bin/env node
/**
 * One bad mutation at a time on real catalogue fiches; record CAUGHT/MISSED per case.
 * Writes data/imports/guard-injections-results.txt (current guards only — no baseline).
 */
import fs from "fs"
import os from "os"
import path from "path"
import { fileURLToPath } from "url"
import { enMarkersInFr, scanFrPricingQuality } from "./check-fr-pricing-quality.mjs"
import { scanPricingAmountSanity } from "./check-pricing-amount-sanity.mjs"
import { scanFrEnPriceParity } from "./check-fr-en-price-parity.mjs"
import { uncleanReasons } from "../lib/pricing-note-guard.ts"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const outPath = path.join(root, "data/imports/guard-injections-results.txt")
const casesPath = path.join(root, "data/imports/guard-injections-cases.json")

function loadCases() {
  const data = JSON.parse(fs.readFileSync(casesPath, "utf8"))
  return data.cases
}

function setByPath(obj, field, value) {
  const parts = field.split(".")
  let cur = obj
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i]
    const isLast = i === parts.length - 1
  if (/^\d+$/.test(p)) {
      const idx = Number(p)
      if (!Array.isArray(cur)) throw new Error(`setByPath: expected array at index ${field}`)
      if (isLast) {
        cur[idx] = value
        return
      }
      if (cur[idx] == null || typeof cur[idx] !== "object") {
        cur[idx] = /^\d+$/.test(parts[i + 1]) ? [] : {}
      }
      cur = cur[idx]
      continue
    }
    if (isLast) {
      cur[p] = value
      return
    }
    if (cur[p] == null || typeof cur[p] !== "object") {
      cur[p] = /^\d+$/.test(parts[i + 1]) ? [] : {}
    }
    cur = cur[p]
  }
}

function cloneContentDir(destRoot) {
  const dest = path.join(destRoot, "content")
  fs.cpSync(path.join(root, "content"), dest, { recursive: true })
  return dest
}

function applyMutation(rootDir, caseRow) {
  const contentDir = path.join(rootDir, "content")
  const toolPath = path.join(contentDir, "tools", `${caseRow.slug}.json`)
  const frPath = path.join(contentDir, "i18n/fr-tools.json")
  if (!fs.existsSync(toolPath)) throw new Error(`missing tool ${caseRow.slug}`)
  const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))

  if (caseRow.layer === "tool") {
    const tool = JSON.parse(fs.readFileSync(toolPath, "utf8"))
    setByPath(tool, caseRow.field, caseRow.value)
    fs.writeFileSync(toolPath, `${JSON.stringify(tool, null, 2)}\n`)
    return
  }
  if (caseRow.layer === "overlay") {
    if (!fr[caseRow.slug]) fr[caseRow.slug] = {}
    setByPath(fr[caseRow.slug], caseRow.field, caseRow.value)
    fs.writeFileSync(frPath, `${JSON.stringify(fr, null, 2)}\n`)
    return
  }
  throw new Error(`unknown layer ${caseRow.layer}`)
}

function caseCaught(caseRow, rootDir) {
  const slug = caseRow.slug
  if (caseRow.guard === 52) {
    return scanFrEnPriceParity({ rootDir }).some((m) => m.id === slug)
  }
  if (caseRow.guard === 54) {
    const fr = JSON.parse(
      fs.readFileSync(path.join(rootDir, "content/i18n/fr-tools.json"), "utf8"),
    )
    const note = fr[slug]?.pricingNote_fr ?? ""
  if (note && enMarkersInFr(note, slug)) return true
    return scanFrPricingQuality({ rootDir }).some((m) => m.id === slug)
  }
  if (caseRow.guard === 58) {
    const hits = scanPricingAmountSanity({ rootDir }).filter((h) => h.id === slug)
    if (!hits.length) return false
    if (caseRow.rule) return hits.some((h) => h.rule === caseRow.rule)
    return true
  }
  if (caseRow.guard === 59 || caseRow.guard === 60) {
    const fr = JSON.parse(fs.readFileSync(path.join(rootDir, "content/i18n/fr-tools.json"), "utf8"))
    const note = fr[slug]?.pricingNote_fr ?? ""
    return uncleanReasons(note, "fr").includes("wrong_language")
  }
  return false
}

function runCase(caseRow) {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "guard-inject-"))
  try {
    cloneContentDir(tmpRoot)
    applyMutation(tmpRoot, caseRow)
    const caught = caseCaught(caseRow, tmpRoot)
    return { ...caseRow, caught }
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true })
  }
}

function main() {
  const check = process.argv.includes("--check")
  const cases = loadCases()
  const qa = cases.filter((c) => !c.id.startsWith("qa52"))
  const g52 = cases.filter((c) => c.id.startsWith("qa52"))
  const lines = [
    `guard-injections @ ${new Date().toISOString()}`,
    `cases: ${cases.length} (QA ${qa.length}, guard 52 ${g52.length})`,
    "",
  ]
  const results = []
  for (const caseRow of cases) {
    const r = runCase(caseRow)
    results.push(r)
    const status = r.caught ? "CAUGHT" : "MISSED"
    const rule = r.rule ? `\t${r.rule}` : ""
    lines.push(`${status}\tguard ${r.guard}\t${r.id}\t${r.slug}\t${r.field ?? ""}${rule}`)
  }
  const caughtN = results.filter((r) => r.caught).length
  lines.push("")
  lines.push(`score: ${caughtN}/${results.length}`)
  const body = `${lines.join("\n")}\n`
  fs.writeFileSync(outPath, body)
  console.log(body)

  const missed = results.filter((r) => !r.caught)
  if (check && missed.length) {
    console.error(`Guard injections: ${missed.length} missed — ${missed.map((m) => m.id).join(", ")}`)
    process.exit(1)
  }
  if (!check) console.log("Guard injections recorded (use --check to fail on misses).")
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main()
}