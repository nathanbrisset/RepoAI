#!/usr/bin/env node
/**
 * PR28 retest #4 — apply served FR/EN fixes + global filler purge.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { execSync } from "child_process"
import { lineIsFiller, stripFillerSentences, textHasFiller } from "./qa-filler-patterns.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content/tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const fixes = JSON.parse(fs.readFileSync(path.join(root, "data/pr28-retest4-served-fixes.json"), "utf8"))

const FR_SLUGS = [
  "bolt",
  "mokker",
  "octaneai",
  "originality-ai",
  "perso",
  "prezi",
  "rask-ai",
  "relay-app",
  "revid",
  "simplified",
  "smartcat",
  "stack-ai",
  "tripo-ai",
  "vectorizer",
  "vic-ai",
  "vizcom",
  "modjo",
  "paperpal",
  "peec-ai",
  "pencil",
  "regie",
  "sana",
  "sapling-ai-detector",
  "synthflow",
  "topview",
  "vizard",
  "yuma",
  "zencoder",
]

const EN_SLUGS = [
  "compar-ia",
  "elsaspeak",
  "harpa",
  "hypefury",
  "hypotenuse",
  "photoleapapp",
  "smartcat",
  "la-growth-machine",
]

function readBase(id) {
  try {
    return JSON.parse(execSync(`git show restore3-new:content/tools/${id}.json`, { cwd: root, encoding: "utf8" }))
  } catch {
    return null
  }
}

function frenchChars(t) {
  return (t.match(/[àâäéèêëïîôùûüç]/gi) || []).length
}

function englishScore(t) {
  return (t.match(/\b(the|and|for|with|your|from|that|this|are|help|teams|workflow|software|official)\b/gi) || []).length
}

function applyPatch(tool, patch) {
  if (!patch) return
  for (const key of ["summary", "description", "summary_fr", "description_fr", "features", "features_fr", "tags_fr"]) {
    if (patch[key] !== undefined) tool[key] = patch[key]
  }
}

function syncOverlay(fr, tool) {
  const entry = { ...(fr[tool.id] || {}) }
  if (tool.summary_fr) entry.summary_fr = tool.summary_fr
  if (tool.description_fr) entry.description_fr = tool.description_fr
  if (tool.features_fr?.length) entry.features_fr = tool.features_fr
  if (tool.tags_fr?.length) entry.tags_fr = tool.tags_fr
  for (const key of ["summary_fr", "description_fr", "features_fr"]) {
    if (entry[key] === undefined) delete entry[key]
  }
  if (Object.keys(entry).length) fr[tool.id] = entry
}

function purgeToolCopy(tool) {
  tool.summary = stripFillerSentences(tool.summary) || tool.summary
  tool.description = stripFillerSentences(tool.description) || tool.description
  if (tool.summary_fr) tool.summary_fr = stripFillerSentences(tool.summary_fr) || tool.summary_fr
  if (tool.description_fr) {
    tool.description_fr =
      stripFillerSentences(tool.description_fr.replace(/\s*Fonctionnalité\s*:[^.!?]*[.!?]\s*/gi, " ")) || tool.description_fr
  }
  tool.features = (tool.features || []).filter((l) => l && !lineIsFiller(l))
  if (tool.features_fr) {
    tool.features_fr = tool.features_fr.filter((l) => l && !lineIsFiller(l))
    if (!tool.features_fr.length) delete tool.features_fr
  }
  if (/software with an official web app/i.test(tool.summary)) {
    const base = readBase(tool.id)
    if (base?.summary && !textHasFiller(base.summary) && frenchChars(base.summary) < 2) tool.summary = base.summary
    else if (tool.description && frenchChars(tool.description) < 2) {
      tool.summary = tool.description.split(/(?<=[.!?])\s+/)[0]?.trim() || tool.summary
    }
  }
}

function servedFrSnapshot(tool, frTools) {
  const o = frTools[tool.id] || {}
  const summary = tool.summary_fr || o.summary_fr || tool.summary
  const long = tool.description_fr || o.description_fr || tool.description
  const feats = tool.features_fr?.length ? tool.features_fr : o.features_fr?.length ? o.features_fr : tool.features
  return { summary, long, feats: feats || [] }
}

function servedEnSnapshot(tool) {
  return { summary: tool.summary, long: tool.description, feats: tool.features || [] }
}

function langLabel(text) {
  const fr = frenchChars(text)
  const en = englishScore(text)
  if (fr >= 2 && en <= 4) return "fr"
  if (en >= 3 && fr < 2) return "en"
  if (fr >= 2 && en >= 3) return "mixed"
  return fr >= 1 ? "fr-lean" : "en-lean"
}

const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
const stats = { patched: 0, purged: 0 }

for (const file of fs.readdirSync(toolsDir).filter((f) => f.endsWith(".json"))) {
  const p = path.join(toolsDir, file)
  const tool = JSON.parse(fs.readFileSync(p, "utf8"))
  if (tool.status !== "active") continue

  const patch = fixes[tool.id]
  if (patch) {
    applyPatch(tool, patch)
    stats.patched++
  }

  if (FR_SLUGS.includes(tool.id) && patch) {
    applyPatch(tool, patch)
    syncOverlay(fr, tool)
  }

  if (EN_SLUGS.includes(tool.id) && patch) {
    applyPatch(tool, patch)
  }

  purgeToolCopy(tool)
  stats.purged++

  if (FR_SLUGS.includes(tool.id)) syncOverlay(fr, tool)

  fs.writeFileSync(p, `${JSON.stringify(tool, null, 2)}\n`)
}

for (const [id, entry] of Object.entries(fr)) {
  if (entry.description_fr) {
    entry.description_fr = entry.description_fr.replace(/\s*Fonctionnalité\s*:[^.!?]*[.!?]\s*/gi, " ").trim()
  }
  if (entry.features_fr) entry.features_fr = entry.features_fr.filter((l) => l && !lineIsFiller(l))
  if (entry.features_fr && !entry.features_fr.length) delete entry.features_fr
}

fs.writeFileSync(frPath, `${JSON.stringify(fr, null, 2)}\n`)

const frTools = JSON.parse(fs.readFileSync(frPath, "utf8"))
const proof = { fr: [], en: [] }

for (const id of FR_SLUGS) {
  const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, `${id}.json`), "utf8"))
  const s = servedFrSnapshot(tool, frTools)
  const blob = `${s.summary} ${s.long} ${(s.feats || []).join(" ")}`
  proof.fr.push({ id, about: langLabel(`${s.summary} ${s.long}`), features: langLabel((s.feats || []).join(" ")), filler: textHasFiller(blob) })
}

for (const id of EN_SLUGS) {
  const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, `${id}.json`), "utf8"))
  const s = servedEnSnapshot(tool)
  const blob = `${s.summary} ${s.long} ${(s.feats || []).join(" ")}`
  proof.en.push({ id, about: langLabel(`${s.summary} ${s.long}`), features: langLabel((s.feats || []).join(" ")), filler: textHasFiller(blob) })
}

console.log(JSON.stringify({ stats, proof }, null, 2))
