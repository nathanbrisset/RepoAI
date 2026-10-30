#!/usr/bin/env node
/**
 * Remove invalid empty strings from fr-tools + tool JSON (Zod min(1)).
 * Backfill FR from inline tool fields, audit pack (stripped), or EN translate.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { lineIsFiller, stripFillerSentences } from "./qa-filler-patterns.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const toolsDir = path.join(root, "content/tools")
const auditPack = JSON.parse(
  fs.readFileSync(path.join(root, "content/i18n/batches/fr-audit-pack.json"), "utf8"),
)

const STRING_KEYS = [
  "summary_fr",
  "shortDescription_fr",
  "description_fr",
  "statusNote_fr",
  "dateAddedNote_fr",
  "pricingNote_fr",
]
const ARRAY_KEYS = ["features_fr", "tags_fr"]

async function translate(text, sl, tl) {
  const chunk = (text || "").trim().slice(0, 1800)
  if (!chunk) return ""
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(chunk)}`
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) })
      const raw = await res.text()
      if (!res.ok || raw.trimStart().startsWith("<")) throw new Error("bad")
      const data = JSON.parse(raw)
      return data[0].map((p) => p[0]).join("").trim()
    } catch {
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)))
    }
  }
  return ""
}

function cleanString(val) {
  if (val === undefined || val === null) return undefined
  const t = String(val).trim()
  if (!t) return undefined
  const stripped = stripFillerSentences(t)
  return stripped.trim() || undefined
}

function cleanStringArray(arr) {
  if (!Array.isArray(arr)) return undefined
  const out = arr.map((s) => cleanString(s)).filter(Boolean)
  return out.length ? out : undefined
}

function loadTools() {
  return Object.fromEntries(
    fs
      .readdirSync(toolsDir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => {
        const t = JSON.parse(fs.readFileSync(path.join(toolsDir, f), "utf8"))
        return [t.id, t]
      }),
  )
}

function pickFrSummary(tool, pack, entry) {
  return (
    cleanString(tool.summary_fr) ||
    cleanString(tool.shortDescription_fr) ||
    cleanString(entry?.summary_fr) ||
    cleanString(pack?.summary_fr) ||
    undefined
  )
}

function pickFrDescription(tool, pack, entry, summaryFr) {
  return (
    cleanString(tool.description_fr) ||
    cleanString(entry?.description_fr) ||
    cleanString(pack?.description_fr) ||
    summaryFr
  )
}

async function pickFrFeatures(tool, pack, entry) {
  const candidates = [
    tool.features_fr,
    entry?.features_fr,
    pack?.features_fr,
  ]
  for (const list of candidates) {
    const cleaned = cleanStringArray(list?.filter((l) => !lineIsFiller(l)))
    if (cleaned?.length) return cleaned
  }
  const en = cleanStringArray(tool.features)
  if (!en?.length) return undefined
  const out = []
  for (const line of en.slice(0, 4)) {
    const fr = await translate(line, "en", "fr")
    if (fr) out.push(fr)
    await new Promise((r) => setTimeout(r, 80))
  }
  return out.length ? out : undefined
}

function scrubObject(obj, stats) {
  for (const key of STRING_KEYS) {
    if (!(key in obj)) continue
    const cleaned = cleanString(obj[key])
    if (cleaned) obj[key] = cleaned
    else {
      delete obj[key]
      stats.removedEmpty++
    }
  }
  for (const key of ARRAY_KEYS) {
    if (!(key in obj)) continue
    const cleaned = cleanStringArray(obj[key]?.filter((l) => !lineIsFiller(l)))
    if (cleaned) obj[key] = cleaned
    else {
      delete obj[key]
      stats.removedEmpty++
    }
  }
  if (obj.features_fr && obj.features_fr.length === 0) {
    delete obj.features_fr
    stats.removedEmpty++
  }
}

async function main() {
  const tools = loadTools()
  const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
  const stats = { removedEmpty: 0, backfilled: 0, toolsScrubbed: 0 }

  for (const [id, entry] of Object.entries(fr)) {
    scrubObject(entry, stats)
    const tool = tools[id]
    const pack = auditPack[id]

    let summaryFr = pickFrSummary(tool, pack, entry)
    if (!summaryFr && tool?.summary) {
      summaryFr = cleanString(await translate(tool.summary.replace(/^[^:]+:\s*/, ""), "en", "fr"))
    }
    let descriptionFr = pickFrDescription(tool, pack, entry, summaryFr)
    if (!descriptionFr && tool?.description) {
      descriptionFr = cleanString(await translate(stripFillerSentences(tool.description).slice(0, 500), "en", "fr"))
    }

    if (summaryFr && !entry.summary_fr) {
      entry.summary_fr = summaryFr
      stats.backfilled++
    }
    if (descriptionFr && !entry.description_fr) {
      entry.description_fr = descriptionFr
      stats.backfilled++
    }

    const needFeatures =
      !entry.features_fr?.length &&
      (tool?.status === "active" || !tool)
    if (needFeatures && tool) {
      const feats = await pickFrFeatures(tool, pack, entry)
      if (feats?.length) {
        entry.features_fr = feats
        stats.backfilled++
      }
    }

    scrubObject(entry, stats)
    if (Object.keys(entry).length === 0) delete fr[id]
  }

  for (const tool of Object.values(tools)) {
    const filePath = path.join(toolsDir, `${tool.id}.json`)
    const before = JSON.stringify(tool)
    scrubObject(tool, stats)
    for (const key of ["summary", "description"]) {
      if (tool[key] !== undefined && !String(tool[key]).trim()) {
        throw new Error(`Required field empty: ${tool.id}.${key}`)
      }
    }
    if (JSON.stringify(tool) !== before) {
      fs.writeFileSync(filePath, `${JSON.stringify(tool, null, 2)}\n`)
      stats.toolsScrubbed++
    }
  }

  fs.writeFileSync(frPath, `${JSON.stringify(fr, null, 2)}\n`)
  console.log(JSON.stringify(stats, null, 2))

  // Validate like build (french-catalog.ts)
  const { z } = await import("zod")
  const howToStepSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    links: z
      .array(z.object({ label: z.string().min(1), url: z.string().url() }))
      .optional(),
  })
  const schema = z.object({
    summary_fr: z.string().min(1).optional(),
    shortDescription_fr: z.string().min(1).optional(),
    description_fr: z.string().min(1).optional(),
    tags_fr: z.array(z.string().min(1)).optional(),
    features_fr: z.array(z.string().min(1)).optional(),
    howToUse_fr: z.array(howToStepSchema).optional(),
    statusNote_fr: z.string().min(1).optional(),
    dateAddedNote_fr: z.string().min(1).optional(),
    pricingNote_fr: z.string().min(1).optional(),
  })
  z.record(z.string(), schema).parse(JSON.parse(fs.readFileSync(frPath, "utf8")))
  console.log("fr-tools Zod OK")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
