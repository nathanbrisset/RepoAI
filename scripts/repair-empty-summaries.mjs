#!/usr/bin/env node
/** Restore required summary/description when filler strip left empty strings. */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { execSync } from "child_process"
import { lineIsFiller, stripFillerSentences } from "./qa-filler-patterns.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content/tools")
const lot2EnMap = JSON.parse(fs.readFileSync(path.join(root, "data/lot2-use-case-en.json"), "utf8"))

function readBase(id) {
  try {
    return JSON.parse(execSync(`git show restore3-new:content/tools/${id}.json`, { cwd: root, encoding: "utf8" }))
  } catch {
    return null
  }
}

function cleanDescription(text) {
  let out = (text || "").replace(/\n\nFeature:[\s\S]*/i, "").trim()
  out = out.replace(
    /Transcription support: Provides tools for converting speech to text\. Noise reduction: Reduces unwanted sounds from audio input\. Voice synthesis: Can generate or clone voices using AI models\./gi,
    "",
  )
  out = stripFillerSentences(out)
  return out.replace(/\s{2,}/g, " ").trim()
}

function firstGoodSentence(text) {
  for (const s of (text || "").split(/(?<=[.!?])\s+/)) {
    const t = s.trim()
    if (t.length > 20 && !lineIsFiller(t)) return t.endsWith(".") ? t : `${t}.`
  }
  return ""
}

function repairSummary(tool, base) {
  const frKey = (tool.summary_fr || "").replace(/\.$/, "").trim()
  const fromMap = frKey ? lot2EnMap[frKey] : null
  if (fromMap) return `${tool.name}: ${fromMap.replace(/\.$/, "")}.`

  const fromDesc = firstGoodSentence(tool.description)
  if (fromDesc) return `${tool.name}: ${fromDesc.replace(/\.$/, "")}.`

  const baseSum = base?.summary
  if (baseSum && !lineIsFiller(baseSum) && baseSum.length > 10) {
    const cleaned = stripFillerSentences(baseSum)
    if (cleaned) return cleaned
  }

  const cat = tool.categories?.[0]?.replace(/-/g, " ") || "AI"
  const host = (() => {
    try {
      return new URL(tool.url).hostname.replace(/^www\./, "")
    } catch {
      return "the vendor site"
    }
  })()
  return `${tool.name} — ${cat} tools available at ${host}.`
}

function repairDescription(tool, base) {
  const fromDesc = cleanDescription(tool.description)
  if (fromDesc.length > 40 && !lineIsFiller(fromDesc)) return fromDesc

  const frKey = (tool.summary_fr || "").replace(/\.$/, "").trim()
  const fromMap = frKey ? lot2EnMap[frKey] : null
  if (fromMap) {
    return `${tool.name} helps teams with ${fromMap.charAt(0).toLowerCase()}${fromMap.slice(1).replace(/\.$/, "")}.`
  }

  const baseDesc = cleanDescription(base?.description)
  if (baseDesc.length > 40) {
    const s = firstGoodSentence(baseDesc)
    if (s) return s.length > 40 ? s : baseDesc.slice(0, 500)
  }

  return tool.summary || `${tool.name} is listed on AItools.ninja with a link to the vendor site.`
}

let fixed = 0
for (const file of fs.readdirSync(toolsDir).filter((f) => f.endsWith(".json"))) {
  const p = path.join(toolsDir, file)
  const tool = JSON.parse(fs.readFileSync(p, "utf8"))
  if (tool.status !== "active") continue
  const base = readBase(tool.id)
  let changed = false
  if (!String(tool.summary || "").trim()) {
    tool.summary = repairSummary(tool, base)
    changed = true
  }
  if (!String(tool.description || "").trim()) {
    tool.description = repairDescription(tool, base)
    changed = true
  }
  if (changed) {
    fs.writeFileSync(p, `${JSON.stringify(tool, null, 2)}\n`)
    fixed++
  }
}
console.log(JSON.stringify({ summariesRepaired: fixed }, null, 2))
