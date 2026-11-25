#!/usr/bin/env node
/**
 * Deterministic fr-tools.json rebuild for consolidation QA.
 * Plan order 1→16: per-tool key merge from PR tips, never whole-file replace.
 */
import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const cacheDir = path.join(root, ".cache/fr-tools-rebuild")
fs.mkdirSync(cacheDir, { recursive: true })

function loadFrAt(sha) {
  const cache = path.join(cacheDir, `${sha}.json`)
  if (!fs.existsSync(cache)) {
    execSync(`git show ${sha}:content/i18n/fr-tools.json > "${cache}"`, {
      cwd: root,
      stdio: "ignore",
      maxBuffer: 128 * 1024 * 1024,
    })
  }
  return JSON.parse(fs.readFileSync(cache, "utf8"))
}

function importReportIds(rel) {
  const p = path.join(root, rel)
  const data = JSON.parse(fs.readFileSync(p, "utf8"))
  return data.toolIds || []
}

/** Merge tip[id] into out when tip differs from parent for that id, or id is new in tip. */
function mergeLayer(out, tip, parent, { onlyIds = null } = {}) {
  let n = 0
  for (const [id, entry] of Object.entries(tip)) {
    if (onlyIds && !onlyIds.has(id)) continue
    const prev = parent[id]
    if (prev === undefined || JSON.stringify(prev) !== JSON.stringify(entry)) {
      out[id] = structuredClone(entry)
      n++
    }
  }
  return n
}

/** Copy selected keys from src entry into out[id]. */
function copyKeys(out, id, src, keys) {
  if (!src) return 0
  out[id] ??= {}
  let n = 0
  for (const k of keys) {
    if (src[k] !== undefined) {
      out[id][k] = structuredClone(src[k])
      n++
    }
  }
  return n
}

const stats = { layers: [], b1Fix: 0, b2Fix: 0 }

const baseSha = "5d64bdca"
const out = loadFrAt(baseSha)
const baseParent = loadFrAt("36f64287")
stats.layers.push({ layer: "1-3 base", sha: baseSha, keys: Object.keys(out).length })

const layers = [
  {
    name: "#65",
    tip: "6e6ec1ce",
    parent: "5d64bdca",
  },
  {
    name: "#69",
    tip: "53cb3a95",
    parent: "6e6ec1ce",
    onlyIds: new Set(importReportIds("data/import-2026-11-25/import-report.json")),
  },
  {
    name: "#70",
    tip: "f273bebb",
    parent: "53cb3a95",
    onlyIds: new Set(importReportIds("data/import-2026-11-16-lot4/import-report.json")),
  },
  {
    name: "#55",
    tip: "65104cf6",
    parent: "f273bebb",
    onlyIds: new Set(importReportIds("data/import-2026-11-16-lot2/import-report.json")),
  },
  {
    name: "#58",
    tip: "3f2efc0d",
    parent: "65104cf6",
    onlyIds: new Set(importReportIds("data/import-2026-11-16-lot3/import-report.json")),
  },
  {
    name: "#56",
    tip: "1e22f6e3",
    parent: "3f2efc0d",
    onlyIds: new Set(importReportIds("data/import-2026-11-16-renamed/import-report.json")),
  },
  {
    name: "#67 currency overlay",
    tip: "75d3bd50",
    parent: null,
    mode: "currency",
  },
]

for (const layer of layers) {
  if (layer.mode === "currency") {
    const tip = loadFrAt(layer.tip)
    const importIds = new Set([
      ...importReportIds("data/import-2026-11-25/import-report.json"),
      ...importReportIds("data/import-2026-11-16-lot4/import-report.json"),
      ...importReportIds("data/import-2026-11-16-lot2/import-report.json"),
      ...importReportIds("data/import-2026-11-16-lot3/import-report.json"),
      ...importReportIds("data/import-2026-11-16-renamed/import-report.json"),
    ])
    const keys = ["summary_fr", "description_fr", "features_fr", "howToUse_fr", "pricingNote_fr", "statusNote_fr"]
    let n = 0
    for (const [id, entry] of Object.entries(tip)) {
      if (importIds.has(id)) continue
      if (!out[id]) continue
      n += copyKeys(out, id, entry, keys)
    }
    stats.layers.push({ layer: layer.name, updated: n })
    continue
  }
  const tip = loadFrAt(layer.tip)
  const parent = loadFrAt(layer.parent)
  const n = mergeLayer(out, tip, parent, { onlyIds: layer.onlyIds })
  stats.layers.push({ layer: layer.name, updated: n, scoped: layer.onlyIds?.size })
}

// #61 tutoiement: apply diff keys only from 273c9fa7 vs 62ae16ad (not full 84df9207 file)
{
  const tip = loadFrAt("273c9fa7")
  const parent = loadFrAt("62ae16ad")
  const n = mergeLayer(out, tip, parent)
  stats.layers.push({ layer: "#61 tutoiement diff", updated: n })
}

const frPath = path.join(root, "content/i18n/fr-tools.json")
const before = JSON.parse(fs.readFileSync(frPath, "utf8"))
let b1 = 0
let b2 = 0
const importIds = new Set([
  ...importReportIds("data/import-2026-11-25/import-report.json"),
  ...importReportIds("data/import-2026-11-16-lot4/import-report.json"),
  ...importReportIds("data/import-2026-11-16-lot2/import-report.json"),
  ...importReportIds("data/import-2026-11-16-lot3/import-report.json"),
  ...importReportIds("data/import-2026-11-16-renamed/import-report.json"),
])
const lot52Peer = JSON.parse(
  fs.readFileSync(path.join(root, "data/import-2026-11-16-lot2/peer-lot-2026-11-16-40-slugs.json"), "utf8"),
)
const lot52Ids = new Set(Array.isArray(lot52Peer) ? lot52Peer : lot52Peer.ids || [])

for (const id of Object.keys(out)) {
  if (JSON.stringify(before[id]) !== JSON.stringify(out[id])) {
    const hadBadEuro =
      before[id]?.description_fr &&
      out[id]?.description_fr &&
      before[id].description_fr !== out[id].description_fr &&
      /\d+\s*€/.test(before[id].description_fr) &&
      /\d+\s*€/.test(out[id].description_fr)
    if (hadBadEuro) b1++
    if (importIds.has(id) || lot52Ids.has(id)) {
      const hadNote = !!out[id]?.pricingNote_fr
      const beforeNote = !!before[id]?.pricingNote_fr
      if (hadNote && !beforeNote) b2++
    }
  }
}

const toolsDir = path.join(root, "content/tools")
const ancienRe = /ancien catalogue|non revérifié/i
let strippedAncien = 0
let filledNotes = 0

function hostFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return "le site officiel"
  }
}

for (const file of fs.readdirSync(toolsDir).filter((n) => n.endsWith(".json"))) {
  const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8"))
  const id = tool.id ?? path.basename(file, ".json")
  const entry = out[id]
  if (!entry) continue

  if (typeof entry.pricingNote_fr === "string" && ancienRe.test(entry.pricingNote_fr)) {
    entry.pricingNote_fr = `Détails tarifaires sur ${hostFromUrl(tool.url)} ; consulte la page officielle avant un usage en production.`
    strippedAncien++
  }

  if (tool.status !== "active" || tool.pricing?.uncertain === true) continue
  const enNote = tool.pricing?.note?.trim()
  if (!enNote) continue
  const hasFr =
    tool.pricing?.note_fr?.trim() || (typeof entry.pricingNote_fr === "string" && entry.pricingNote_fr.trim())
  if (hasFr) continue
  entry.pricingNote_fr = `Détails tarifaires sur ${hostFromUrl(tool.url)} ; consulte la page officielle avant un usage en production.`
  filledNotes++
}

fs.writeFileSync(frPath, `${JSON.stringify(out, null, 2)}\n`)
execSync(`node scripts/apply-fr-tools-post-rebuild.mjs`, { cwd: root, stdio: "inherit" })
console.log(
  JSON.stringify(
    { stats, b1Estimate: b1, b2Estimate: b2, toolCount: Object.keys(out).length, strippedAncien, filledNotes },
    null,
    2,
  ),
)