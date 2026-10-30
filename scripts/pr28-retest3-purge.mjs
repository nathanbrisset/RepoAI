#!/usr/bin/env node
/**
 * PR28 retest #3 — restore tool-screenshots, purge retest3 filler templates, fix gap slugs.
 *   node scripts/pr28-retest3-purge.mjs [--dry-run]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { execSync } from "child_process"
import { lineIsFiller, stripFillerSentences, textHasFiller } from "./qa-filler-patterns.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content/tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const shotPngDir = path.join(root, "public/tool-screenshots")
const lot2EnMap = JSON.parse(fs.readFileSync(path.join(root, "data/lot2-use-case-en.json"), "utf8"))
const dryRun = process.argv.includes("--dry-run")

const EN_GAP = new Set([
  "castmagic",
  "compar-ia",
  "crayo",
  "elsaspeak",
  "harpa",
  "hypefury",
  "hypotenuse",
  "maestra",
  "photoleapapp",
  "smartcat",
])
const FR_GAP = new Set([
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
])

const EN_OVERRIDES = {
  castmagic: {
    summary: "Castmagic: Turn podcasts and audio into posts, newsletters, and articles.",
    description:
      "Castmagic repurposes podcast and audio recordings into social posts, newsletters, and long-form content with AI templates and editing controls.",
    features: [
      "Upload audio or podcast episodes for AI transcription.",
      "Generate social posts, newsletters, and blog drafts from transcripts.",
      "Adjust tone and format for each marketing channel.",
      "Export finished content to your publishing stack.",
    ],
  },
  "11x": {
    features: [
      "Autonomous AI sales development rep for outbound prospecting.",
      "Automates follow-ups and meeting booking for revenue teams.",
      "Connects to CRM and email workflows on your stack.",
      "Runs on 11x.ai with plan-based usage limits.",
    ],
    features_fr: [
      "SDR IA autonome pour la prospection sortante.",
      "Automatise les relances et la prise de rendez-vous pour les équipes revenue.",
      "Se connecte au CRM et aux workflows email.",
      "Fonctionne sur 11x.ai selon les limites du forfait.",
    ],
  },
}

function writeJson(file, value) {
  if (dryRun) return
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

function readBase(id) {
  try {
    return JSON.parse(execSync(`git show restore3-new:content/tools/${id}.json`, { cwd: root, encoding: "utf8" }))
  } catch {
    return null
  }
}

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
      await new Promise((r) => setTimeout(r, 350 * (attempt + 1)))
    }
  }
  return ""
}

function frenchChars(t) {
  return (t.match(/[àâäéèêëïîôùûüç]/gi) || []).length
}

function stripEmbeddedFeatures(description) {
  if (!description) return description
  const idx = description.search(/\n\nFeature:/i)
  if (idx === -1) return description.trim()
  return description.slice(0, idx).trim()
}

function cleanDescription(text) {
  let out = stripEmbeddedFeatures(text || "")
  out = out.replace(
    /Transcription support: Provides tools for converting speech to text\. Noise reduction: Reduces unwanted sounds from audio input\. Voice synthesis: Can generate or clone voices using AI models\./gi,
    "",
  )
  out = stripFillerSentences(out)
  out = out.replace(/\s{2,}/g, " ").trim()
  return out
}

function salvageFeaturesFromDescription(description) {
  const lines = []
  for (const part of (description || "").split(/\n+/)) {
    const m = part.match(/^([^:]+):\s*(.+)/)
    if (m && m[2].length > 15 && !lineIsFiller(part)) lines.push(`${m[1].trim()}: ${m[2].trim()}`)
  }
  return lines.slice(0, 4)
}

function sentencesFromText(text) {
  return (text || "")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25 && !lineIsFiller(s) && !/Learn more on/i.test(s))
}

function pickFeatures(tool, base) {
  const override = EN_OVERRIDES[tool.id]?.features
  if (override) return override

  const candidates = [
    tool.features,
    base?.features,
    salvageFeaturesFromDescription(tool.description),
    salvageFeaturesFromDescription(base?.description),
  ]
  for (const list of candidates) {
    const cleaned = (list || []).filter((l) => l && !lineIsFiller(l))
    if (cleaned.length >= 2) return cleaned.slice(0, 4)
  }
  const core = tool.summary.replace(/^[^:]+:\s*/, "").trim()
  const lines = []
  if (core && !lineIsFiller(core) && frenchChars(core) < 2) {
    lines.push(core.endsWith(".") ? core : `${core}.`)
  }
  for (const s of sentencesFromText(tool.description)) {
    if (lines.length >= 4) break
    lines.push(s.endsWith(".") ? s : `${s}.`)
  }
  return lines.length ? lines.slice(0, 4) : [tool.summary]
}

async function pickFeaturesFr(tool, enFeatures) {
  const override = EN_OVERRIDES[tool.id]?.features_fr
  if (override) return override
  const inline = (tool.features_fr || []).filter((l) => l && !lineIsFiller(l))
  if (inline.length >= 2) return inline.slice(0, 4)
  const out = []
  for (const line of enFeatures.slice(0, 4)) {
    out.push(await translate(line, "en", "fr"))
    await new Promise((r) => setTimeout(r, 70))
  }
  return out.filter((l) => l && !lineIsFiller(l)).slice(0, 4)
}

function restoreToolScreenshot(tool, stats) {
  const png = path.join(shotPngDir, `${tool.id}.png`)
  if (!fs.existsSync(png)) return
  const want = `/tool-screenshots/${tool.id}.png`
  if (tool.image !== want) {
    tool.image = want
    stats.screenshotsRestored++
  }
}

function applyEnGapRestore(tool, base) {
  if (!EN_GAP.has(tool.id)) return false
  const override = EN_OVERRIDES[tool.id]
  if (override?.summary) tool.summary = override.summary
  else if (base?.summary && !textHasFiller(base.summary) && frenchChars(base.summary) < 2) tool.summary = base.summary
  else if (tool.summary_fr) {
    const en = lot2EnMap[tool.summary_fr.replace(/\.$/, "").trim()]
    if (en) tool.summary = `${tool.name}: ${en}.`
  }

  if (override?.description) tool.description = override.description
  else if (base?.description) tool.description = cleanDescription(base.description)
  else tool.description = cleanDescription(tool.description)

  tool.features = pickFeatures(tool, base)
  return true
}

async function applyFrGapRestore(tool, enFeatures) {
  if (!FR_GAP.has(tool.id)) return
  const base = readBase(tool.id)
  if (base?.summary_fr && !textHasFiller(base.summary_fr)) tool.summary_fr = stripFillerSentences(base.summary_fr)
  if (base?.description_fr && !textHasFiller(base.description_fr)) {
    tool.description_fr = stripFillerSentences(stripEmbeddedFeatures(base.description_fr))
  }
  tool.features_fr = await pickFeaturesFr(tool, enFeatures)
}

function scrubOverlayEntry(entry) {
  for (const key of ["summary_fr", "description_fr", "shortDescription_fr", "statusNote_fr", "pricingNote_fr"]) {
    if (!(key in entry)) continue
    const v = stripFillerSentences(entry[key])
    if (v && v.trim()) entry[key] = v.trim()
    else delete entry[key]
  }
  if (entry.features_fr) {
    entry.features_fr = entry.features_fr.filter((l) => l && !lineIsFiller(l))
    if (!entry.features_fr.length) delete entry.features_fr
  }
}

async function main() {
  const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
  const stats = {
    tools: 0,
    featuresRebuilt: 0,
    screenshotsRestored: 0,
    overlayScrubbed: 0,
    enGap: 0,
    frGap: 0,
  }

  for (const file of fs.readdirSync(toolsDir).filter((f) => f.endsWith(".json"))) {
    const filePath = path.join(toolsDir, file)
    const tool = JSON.parse(fs.readFileSync(filePath, "utf8"))
    if (tool.status === "sunset" || tool.status === "duplicate-of" || tool.status === "renamed") continue
    stats.tools++

    const base = readBase(tool.id)
    restoreToolScreenshot(tool, stats)

    if (applyEnGapRestore(tool, base)) stats.enGap++
    else {
      tool.description = cleanDescription(tool.description)
      if (textHasFiller(tool.summary) || frenchChars(tool.summary) >= 3) {
        const en = lot2EnMap[(tool.summary_fr || "").replace(/\.$/, "").trim()]
        if (en) tool.summary = `${tool.name}: ${en}.`
      }
      tool.summary = stripFillerSentences(tool.summary) || tool.summary
    }

    const merged = EN_OVERRIDES[tool.id]
    if (merged) {
      if (merged.summary) tool.summary = merged.summary
      if (merged.description) tool.description = merged.description
      if (merged.features) tool.features = merged.features
      if (merged.features_fr) tool.features_fr = merged.features_fr
    }

    const enFeat = pickFeatures(tool, base)
    if ((tool.features || []).some(lineIsFiller) || JSON.stringify(tool.features) !== JSON.stringify(enFeat)) {
      tool.features = enFeat
      stats.featuresRebuilt++
    }

    if (tool.summary_fr) tool.summary_fr = stripFillerSentences(tool.summary_fr) || tool.summary_fr
    if (tool.description_fr) tool.description_fr = stripFillerSentences(stripEmbeddedFeatures(tool.description_fr))

    if (FR_GAP.has(tool.id)) {
      await applyFrGapRestore(tool, tool.features)
      stats.frGap++
    } else if ((tool.features_fr || []).some(lineIsFiller) || !tool.features_fr?.length) {
      tool.features_fr = await pickFeaturesFr(tool, tool.features)
      stats.featuresRebuilt++
    } else {
      tool.features_fr = tool.features_fr.filter((l) => !lineIsFiller(l))
    }

    if (Array.isArray(tool.features_fr) && tool.features_fr.length === 0) delete tool.features_fr

    writeJson(filePath, tool)

    if (tool.summary_fr || tool.description_fr || tool.features_fr?.length) {
      fr[tool.id] = {
        ...(fr[tool.id] || {}),
        ...(tool.summary_fr ? { summary_fr: tool.summary_fr } : {}),
        ...(tool.description_fr ? { description_fr: tool.description_fr } : {}),
        ...(tool.features_fr?.length ? { features_fr: tool.features_fr } : {}),
      }
    }
  }

  for (const [id, entry] of Object.entries(fr)) {
    scrubOverlayEntry(entry)
    if (entry.features_fr?.some(lineIsFiller)) {
      entry.features_fr = entry.features_fr.filter((l) => !lineIsFiller(l))
    }
    if (!entry.features_fr?.length) {
      /* keep howToUse_fr etc. */
    }
    if (Object.keys(entry).length === 0) delete fr[id]
    else stats.overlayScrubbed++
  }

  writeJson(frPath, fr)
  console.log(JSON.stringify({ dryRun, ...stats }, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
