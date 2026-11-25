#!/usr/bin/env npx tsx
/**
 * Prebuild guard: fail on vouvoiement in FR tool fields (P1-6).
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
  findTutoiementViolations,
  fixHowToGabaritStep4,
  tuifyText,
  TUTOIEMENT_ALLOWLIST,
} from "../lib/i18n/fr-tutoiement"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content/tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")

const FR_KEYS = [
  "summary_fr",
  "description_fr",
  "shortDescription_fr",
  "pricingNote_fr",
  "features_fr",
  "howToUse_fr",
] as const

type Violation = { file: string; toolId: string; field: string; snippet: string }

function fieldStrings(key: string, value: unknown): string[] {
  if (typeof value === "string") {
    const base = key === "howToUse_fr" ? fixHowToGabaritStep4(value) ?? value : value
    return [base]
  }
  if (key === "features_fr" && Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === "string")
  }
  if (key === "howToUse_fr" && Array.isArray(value)) {
    return value.flatMap((step) => {
      if (!step || typeof step !== "object") return []
      const title = typeof step.title === "string" ? fixHowToGabaritStep4(step.title) ?? step.title : ""
      const desc =
        typeof step.description === "string" ? fixHowToGabaritStep4(step.description) ?? step.description : ""
      return [title, desc].filter(Boolean)
    })
  }
  return []
}

function inspectText(text: string): string[] {
  if (TUTOIEMENT_ALLOWLIST.some((re) => re.test(text))) return []
  const normalized = tuifyText(text) ?? text
  return findTutoiementViolations(normalized)
}

function scanRecord(file: string, toolId: string, record: Record<string, unknown>): Violation[] {
  const out: Violation[] = []
  for (const key of FR_KEYS) {
    if (!(key in record)) continue
    for (const text of fieldStrings(key, record[key])) {
      const hits = inspectText(text)
      if (hits.length === 0) continue
      out.push({ file, toolId, field: key, snippet: `${hits.join(", ")} — ${text.slice(0, 100)}` })
    }
  }
  return out
}

function main() {
  const violations: Violation[] = []
  const fr = JSON.parse(fs.readFileSync(frPath, "utf8")) as Record<string, Record<string, unknown>>
  for (const [id, entry] of Object.entries(fr)) {
    violations.push(...scanRecord("content/i18n/fr-tools.json", id, entry))
  }
  for (const name of fs.readdirSync(toolsDir).filter((f) => f.endsWith(".json"))) {
    const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, name), "utf8")) as Record<string, unknown>
    const id = String(tool.id || name.replace(/\.json$/, ""))
    violations.push(...scanRecord(`content/tools/${name}`, id, tool))
  }
  if (violations.length > 0) {
    console.error(`check-fr-tutoiement: ${violations.length} violation(s)`)
    for (const v of violations.slice(0, 50)) {
      console.error(`  ${v.toolId} [${v.field}] (${v.file}): ${v.snippet}`)
    }
    if (violations.length > 50) console.error(`  … and ${violations.length - 50} more`)
    process.exit(1)
  }
  console.log("check-fr-tutoiement: ok")
}

main()