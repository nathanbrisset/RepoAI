#!/usr/bin/env node
/**
 * Per-tool visitor-field merge from a pinned git revision of fr-tools.json.
 * For each tool id in the pin, copy pinned values when JSON.stringify differs.
 */
import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const VISITOR_KEYS = [
  "summary_fr",
  "description_fr",
  "features_fr",
  "howToUse_fr",
  "pricingNote_fr",
  "statusNote_fr",
  "tags_fr",
]

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const frPath = path.join(root, "content/i18n/fr-tools.json")

const pinSha = process.argv.find((a) => a.startsWith("--pin="))?.slice(6) || process.env.FR_TOOLS_PIN_SHA || "3d83ba26"

const pinned = JSON.parse(
  execSync(`git show ${pinSha}:content/i18n/fr-tools.json`, {
    encoding: "utf8",
    maxBuffer: 128 * 1024 * 1024,
  }),
)

const cur = JSON.parse(fs.readFileSync(frPath, "utf8"))

let keysRestored = 0
let toolsTouched = 0
const restoredById = {}

for (const [id, pinEntry] of Object.entries(pinned)) {
  if (!pinEntry || typeof pinEntry !== "object") continue
  cur[id] ??= {}
  let touched = false
  for (const key of VISITOR_KEYS) {
    if (!(key in pinEntry)) continue
    const fromPin = pinEntry[key]
    const fromCur = cur[id][key]
    if (JSON.stringify(fromCur) !== JSON.stringify(fromPin)) {
      cur[id][key] = structuredClone(fromPin)
      keysRestored++
      touched = true
      restoredById[id] ??= []
      restoredById[id].push(key)
    }
  }
  if (touched) toolsTouched++
}

fs.writeFileSync(frPath, `${JSON.stringify(cur, null, 2)}\n`)

const report = { pinSha, keysRestored, toolsTouched, restoredById }
console.log(JSON.stringify(report, null, 2))