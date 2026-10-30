#!/usr/bin/env node
/** Scrub filler from fr-tools.json description_fr / features_fr (Zod-safe). */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { lineIsFiller, stripFillerSentences } from "./qa-filler-patterns.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const toolsDir = path.join(root, "content/tools")

function stripFeatureBlocks(text) {
  return (text || "")
    .replace(/\s*Fonctionnalité\s*:[^.!?]*[.!?]\s*/gi, " ")
    .replace(/\s*Feature\s*:[^.!?]*[.!?]\s*/gi, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
}

const tools = Object.fromEntries(
  fs
    .readdirSync(toolsDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const t = JSON.parse(fs.readFileSync(path.join(toolsDir, f), "utf8"))
      return [t.id, t]
    }),
)

const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
let fixed = 0

for (const [id, entry] of Object.entries(fr)) {
  for (const key of ["summary_fr", "description_fr", "shortDescription_fr"]) {
    if (!entry[key]) continue
    let v = stripFeatureBlocks(stripFillerSentences(entry[key]))
    if (v && v.trim()) entry[key] = v.trim()
    else {
      delete entry[key]
      fixed++
    }
  }
  if (entry.features_fr) {
    entry.features_fr = entry.features_fr.filter((l) => l && !lineIsFiller(l))
    if (!entry.features_fr.length) delete entry.features_fr
  }
  const tool = tools[id]
  if (!entry.features_fr?.length && tool?.features_fr?.length) {
    entry.features_fr = tool.features_fr.filter((l) => !lineIsFiller(l))
    fixed++
  }
  if (!entry.summary_fr && tool?.summary_fr) entry.summary_fr = stripFillerSentences(tool.summary_fr)
  if (!entry.description_fr && tool?.description_fr) {
    entry.description_fr = stripFeatureBlocks(stripFillerSentences(tool.description_fr))
  }
  if (Object.keys(entry).length === 0) delete fr[id]
}

fs.writeFileSync(frPath, `${JSON.stringify(fr, null, 2)}\n`)
console.log(JSON.stringify({ fixed, keys: Object.keys(fr).length }, null, 2))
