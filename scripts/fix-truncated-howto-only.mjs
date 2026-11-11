#!/usr/bin/env node
/**
 * Only rewrite howTo step titles that were produced by the legacy truncation algorithm
 * (title ends with "..." or equals legacyTruncate(firstSentence(desc))).
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { truncateHowToTitle, firstSentenceForHowTo } from "../lib/i18n/truncate-how-to-title.mjs"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const TOOLS = path.join(ROOT, "content", "tools")
const HOWTO_TITLE_MAX = 90

function legacyFirstSentence(text) {
  const trimmed = text.trim()
  for (let i = 0; i < trimmed.length; i++) {
    const c = trimmed[i]
    if (c !== "." && c !== "!" && c !== "?") continue
    const next = trimmed[i + 1]
    if (i === trimmed.length - 1 || (next && /\s/.test(next))) {
      return trimmed.slice(0, i + 1).trim()
    }
  }
  return trimmed
}

function legacyTruncateHowToTitle(text, max = HOWTO_TITLE_MAX) {
  if (text.length <= max) return text
  const slice = text.slice(0, max)
  const lastSpace = slice.lastIndexOf(" ")
  if (lastSpace > Math.floor(max * 0.45)) {
    return `${slice.slice(0, lastSpace).trim()}...`
  }
  return `${slice.trim()}...`
}

function legacyStepTitle(description) {
  const trimmed = String(description).trim()
  if (!trimmed) return "Step"
  let title = legacyFirstSentence(trimmed)
  title = legacyTruncateHowToTitle(title)
  return title.length >= 3 ? title : trimmed.slice(0, HOWTO_TITLE_MAX)
}

function newStepTitle(description) {
  const trimmed = String(description).trim()
  if (!trimmed) return "Step"
  let title = firstSentenceForHowTo(trimmed)
  title = truncateHowToTitle(title, HOWTO_TITLE_MAX)
  return title.length >= 3 ? title : trimmed.slice(0, HOWTO_TITLE_MAX)
}

function wasLegacyDerived(step) {
  const desc = String(step.description || "").trim()
  const title = String(step.title || "").trim()
  if (!desc || !title) return false
  if (title === desc) return false
  const legacy = legacyStepTitle(desc)
  if (title === legacy) return true
  if (title.endsWith("...") && title.length < desc.length) return true
  return false
}

let stepsUpdated = 0
let toolsUpdated = 0
const touched = []

for (const file of fs.readdirSync(TOOLS).filter((name) => name.endsWith(".json"))) {
  const abs = path.join(TOOLS, file)
  const tool = JSON.parse(fs.readFileSync(abs, "utf8"))
  let fileTouched = false
  for (const key of ["howToUse", "howToUse_fr"]) {
    if (!Array.isArray(tool[key])) continue
    for (const step of tool[key]) {
      if (!step?.description || !wasLegacyDerived(step)) continue
      const next = newStepTitle(step.description)
      if (next === step.description) continue
      if (next !== step.title) {
        step.title = next
        stepsUpdated++
        fileTouched = true
      }
    }
  }
  if (fileTouched) {
    fs.writeFileSync(abs, `${JSON.stringify(tool, null, 2)}\n`)
    toolsUpdated++
    touched.push(tool.id)
  }
}

console.log(JSON.stringify({ toolsUpdated, stepsUpdated, touched }, null, 2))
