#!/usr/bin/env npx tsx
/**
 * Nat product decision (Oct 2026): tutoiement everywhere in FR served copy.
 *
 *   npx tsx scripts/fr-tutoiement-sweep.ts [--dry-run] [--slugs-file path]
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
  HOWTO_STEP4_GABARIT_BAD,
  HOWTO_STEP4_GABARIT_GOOD,
  tuifyFeatureLines,
  tuifyHowToSteps,
  tuifyText,
} from "../lib/i18n/fr-tutoiement"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content/tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const automationsFr = path.join(root, "content/automations/fr-copy.json")

const dryRun = process.argv.includes("--dry-run")
const slugsFileArg = process.argv.find((a) => a.startsWith("--slugs-file="))
const slugFilter = slugsFileArg
  ? new Set(
      fs
        .readFileSync(slugsFileArg.split("=")[1]!, "utf8")
        .split(/\n/)
        .map((s) => s.trim())
        .filter(Boolean),
    )
  : null

const SKIP = new Set(["sunset", "duplicate-of", "renamed", "inactive"])

const FR_STRING_KEYS = [
  "summary_fr",
  "description_fr",
  "shortDescription_fr",
  "pricingNote_fr",
  "howToUse_fr",
  "features_fr",
] as const

function fixGabaritInPlace(obj: Record<string, unknown>) {
  const howTo = obj.howToUse_fr
  if (!Array.isArray(howTo)) return
  for (const step of howTo) {
    if (step && typeof step === "object" && typeof step.description === "string") {
      if (step.description.includes(HOWTO_STEP4_GABARIT_BAD)) {
        step.description = step.description.replace(HOWTO_STEP4_GABARIT_BAD, HOWTO_STEP4_GABARIT_GOOD)
      } else if (step.description.includes("partagez ou connectez ton environnement")) {
        step.description = step.description.replace(/partagez/g, "partage").replace(/connectez/g, "connecte")
      }
    }
  }
}

function patchRecord(record: Record<string, unknown>) {
  let n = 0
  fixGabaritInPlace(record)
  for (const key of FR_STRING_KEYS) {
    if (!(key in record)) continue
    const before = JSON.stringify(record[key])
    if (key === "howToUse_fr") record[key] = tuifyHowToSteps(record[key] as Parameters<typeof tuifyHowToSteps>[0])
    else if (key === "features_fr") record[key] = tuifyFeatureLines(record[key] as string[])
    else record[key] = tuifyText(record[key] as string)
    if (JSON.stringify(record[key]) !== before) n++
  }
  return n
}

function writeJson(file: string, value: unknown) {
  if (dryRun) return
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

function shouldPatchToolId(id: string) {
  return !slugFilter || slugFilter.has(id)
}

function main() {
  const stats = { toolFiles: 0, toolFields: 0, frOverlay: 0, gabaritFixed: 0 }

  const fr = JSON.parse(fs.readFileSync(frPath, "utf8")) as Record<string, Record<string, unknown>>
  for (const id of Object.keys(fr)) {
    const before = JSON.stringify(fr[id].howToUse_fr)
    fixGabaritInPlace(fr[id])
    if (JSON.stringify(fr[id].howToUse_fr) !== before) stats.gabaritFixed++
    if (!shouldPatchToolId(id)) continue
    stats.frOverlay += patchRecord(fr[id])
  }
  writeJson(frPath, fr)

  for (const file of fs.readdirSync(toolsDir).filter((f) => f.endsWith(".json"))) {
    const toolPath = path.join(toolsDir, file)
    const tool = JSON.parse(fs.readFileSync(toolPath, "utf8")) as Record<string, unknown> & { status?: string; id?: string }
    if (SKIP.has(tool.status || "")) continue
    const id = String(tool.id || file.replace(/\.json$/, ""))
    if (!shouldPatchToolId(id)) continue
    const n = patchRecord(tool)
    if (n) {
      stats.toolFiles++
      stats.toolFields += n
      writeJson(toolPath, tool)
    }
  }

  if (fs.existsSync(automationsFr) && !slugFilter) {
    const auto = JSON.parse(fs.readFileSync(automationsFr, "utf8"))
    const next = JSON.parse(JSON.stringify(auto))
    const walk = (v: unknown): unknown => {
      if (typeof v === "string") return tuifyText(v)
      if (Array.isArray(v)) return v.map(walk)
      if (v && typeof v === "object") {
        const o: Record<string, unknown> = {}
        for (const [k, val] of Object.entries(v)) o[k] = walk(val)
        return o
      }
      return v
    }
    writeJson(automationsFr, walk(next))
  }

  console.log(JSON.stringify({ dryRun, slugFilter: slugFilter?.size ?? null, ...stats }, null, 2))
}

main()