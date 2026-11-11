#!/usr/bin/env node
/**
 * Recompute howToUse / howToUse_fr step titles with shared truncateHowToTitle rules.
 */
import fs from "node:fs"
import path from "node:path"
import { truncateHowToTitle, firstSentenceForHowTo } from "../lib/i18n/truncate-how-to-title.mjs"

import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const TOOLS = path.join(ROOT, "content", "tools")

const HOWTO_TITLE_MAX = 90

function howToStepTitle(description) {
  const trimmed = String(description).trim()
  if (!trimmed) return "Step"
  let title = firstSentenceForHowTo(trimmed)
  title = truncateHowToTitle(title, HOWTO_TITLE_MAX)
  return title.length >= 3 ? title : trimmed.slice(0, HOWTO_TITLE_MAX)
}

let changed = 0
for (const file of fs.readdirSync(TOOLS).filter((name) => name.endsWith(".json"))) {
  const abs = path.join(TOOLS, file)
  const tool = JSON.parse(fs.readFileSync(abs, "utf8"))
  let touched = false
  for (const key of ["howToUse", "howToUse_fr"]) {
    if (!Array.isArray(tool[key])) continue
    for (const step of tool[key]) {
      if (!step?.description) continue
      const next = howToStepTitle(step.description)
      if (step.title !== next) {
        step.title = next
        touched = true
      }
    }
  }
  if (touched) {
    fs.writeFileSync(abs, `${JSON.stringify(tool, null, 2)}\n`)
    changed++
    console.log("updated", tool.id)
  }
}
console.log(JSON.stringify({ toolsUpdated: changed }, null, 2))
