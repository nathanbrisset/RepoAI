#!/usr/bin/env node
/**
 * PR28 retest #2 — purge QA filler, fix EN/FR served fields, clear broken screenshots.
 *   node scripts/pr28-retest2-purge.mjs [--dry-run] [--no-translate]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { FILLER_PATTERNS, lineIsFiller, stripFillerSentences } from "./qa-filler-patterns.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content/tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const shotDir = path.join(root, "public/screenshots")
const lot2EnMap = JSON.parse(fs.readFileSync(path.join(root, "data/lot2-use-case-en.json"), "utf8"))
const dryRun = process.argv.includes("--dry-run")
const noTranslate = process.argv.includes("--no-translate")

const CLEAR_IMAGE_SLUGS = new Set([
  "chatgpt-atlas",
  "freshdesk-freddy",
  "lavender",
  "liner",
  "opera-aria",
  "ramp",
  "spotter",
  "wan",
  "zerogpt",
  "doubao",
  "sora",
  "jenni-ai",
  "kaiber",
  "chatcode",
])

const WEAK_SHOT_MAX_BYTES = 6500

function writeJson(file, value) {
  if (dryRun) return
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

function frenchChars(text) {
  return (text.match(/[àâäéèêëïîôùûüç]/gi) || []).length
}

function englishScore(text) {
  return (text.match(/\b(the|and|for|with|your|from|that|this|are|help|supports|teams|workflow)\b/gi) || []).length
}

function useCaseEnFromFr(frPhrase) {
  const key = (frPhrase || "").replace(/\.$/, "").trim()
  return lot2EnMap[key] || null
}

async function translate(text, sl, tl) {
  const chunk = (text || "").trim().slice(0, 1800)
  if (!chunk) return ""
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(chunk)}`
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const raw = await res.text()
      if (raw.trimStart().startsWith("<")) throw new Error("non-json")
      const data = JSON.parse(raw)
      return data[0].map((part) => part[0]).join("").trim()
    } catch {
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)))
    }
  }
  return chunk
}

function splitBullets(text) {
  return (text || "")
    .split(/[,;—–]|(?:\s+et\s+)/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 10 && !lineIsFiller(s))
    .slice(0, 4)
    .map((s) => (s.endsWith(".") ? s : `${s}.`))
}

function salvageFeaturesFromDescription(description) {
  if (!description) return []
  const lines = []
  for (const part of description.split(/\n+/)) {
    const m = part.match(/^([^:]+):\s*(.+)/)
    if (m && m[2].length > 20) lines.push(`${m[1].trim()}: ${m[2].trim()}`)
  }
  return lines.filter((l) => !lineIsFiller(l)).slice(0, 4)
}

function buildEnFeatures(tool, useCaseEn) {
  const fromDesc = salvageFeaturesFromDescription(tool.description)
  if (fromDesc.length >= 2) return fromDesc
  const parts = splitBullets(useCaseEn)
  if (parts.length >= 2) return parts.map((p) => (p.charAt(0).toUpperCase() + p.slice(1)))
  const core = (useCaseEn || tool.summary || "").replace(/^[^:]+:\s*/, "").trim()
  const base = core.endsWith(".") ? core : `${core}.`
  const lines = [base.charAt(0).toUpperCase() + base.slice(1)]
  const cat = tool.categories?.[0]?.replace(/-/g, " ")
  if (cat) lines.push(`Focused on ${cat} workflows.`)
  for (const tag of (tool.tags || []).filter((t) => !["ai", "catalog", "no"].includes(t)).slice(0, 2)) {
    if (lines.length >= 4) break
    lines.push(`${tool.name} includes ${tag.replace(/-/g, " ")} capabilities.`)
  }
  return lines.filter((l) => !lineIsFiller(l)).slice(0, 4)
}

async function buildFrFeatures(tool, enFeatures) {
  if (noTranslate) return tool.features_fr?.filter((l) => !lineIsFiller(l)) || []
  const out = []
  for (const line of enFeatures.slice(0, 4)) {
    out.push(await translate(line, "en", "fr"))
    await new Promise((r) => setTimeout(r, 120))
  }
  return out.filter((l) => l && !lineIsFiller(l))
}

function stripEmbeddedFeatures(description) {
  if (!description) return description
  const idx = description.search(/\n\nFeature:/i)
  if (idx === -1) return description.trim()
  return description.slice(0, idx).trim()
}

function cleanEnAbout(tool, useCaseEn) {
  let summary = tool.summary || ""
  if (frenchChars(summary) >= 2 && englishScore(summary) < 3) {
    const en = useCaseEn || tool.name
    summary = `${tool.name}: ${en.endsWith(".") ? en.slice(0, -1) : en}.`
  }
  summary = stripFillerSentences(summary)
  let description = stripEmbeddedFeatures(tool.description)
  description = stripFillerSentences(description)
  if (frenchChars(description) >= 3) {
    const en = useCaseEn || summary.replace(/^[^:]+:\s*/, "")
    description = `${tool.name} helps teams with ${en.charAt(0).toLowerCase()}${en.slice(1).replace(/\.$/, "")}.`
  }
  if (!description || description.length < 30) {
    description = `${summary.replace(/^[^:]+:\s*/, "")} Learn more on the ${tool.name} website.`
  }
  return { summary, description }
}

function cleanFrAbout(tool) {
  let summary_fr = stripFillerSentences(tool.summary_fr || "")
  let description_fr = stripFillerSentences(stripEmbeddedFeatures(tool.description_fr || ""))
  if (!summary_fr && tool.summary_fr) summary_fr = tool.summary_fr
  if (description_fr && lineIsFiller(description_fr)) {
    description_fr = summary_fr || description_fr
  }
  if (summary_fr && !description_fr) description_fr = summary_fr
  return { summary_fr, description_fr }
}

function resolveShotPath(imageField) {
  if (!imageField || !imageField.startsWith("/screenshots/")) return null
  return path.join(root, "public", imageField.replace(/^\//, ""))
}

function fixImageField(tool, stats) {
  if (CLEAR_IMAGE_SLUGS.has(tool.id)) {
    if (tool.image) {
      tool.image = ""
      stats.imageCleared++
    }
    return
  }
  if (!tool.image) return
  const file = resolveShotPath(tool.image)
  if (!file || !fs.existsSync(file)) {
    tool.image = ""
    stats.imageCleared++
    return
  }
  const size = fs.statSync(file).size
  if (size <= WEAK_SHOT_MAX_BYTES) {
    tool.image = ""
    stats.imageCleared++
  }
}

async function main() {
  const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
  const stats = {
    tools: 0,
    fillerLinesRemoved: 0,
    enRebuilt: 0,
    frRebuilt: 0,
    imageCleared: 0,
    overlayFixed: 0,
  }

  const files = fs.readdirSync(toolsDir).filter((f) => f.endsWith(".json"))
  for (const file of files) {
    const filePath = path.join(toolsDir, file)
    const tool = JSON.parse(fs.readFileSync(filePath, "utf8"))
    if (tool.status === "sunset" || tool.status === "duplicate-of" || tool.status === "renamed") continue
    stats.tools++

    let useCaseEn =
      useCaseEnFromFr(tool.summary_fr) ||
      (tool.summary && frenchChars(tool.summary) < 2 ? tool.summary.replace(/^[^:]+:\s*/, "").replace(/\.$/, "") : null)
    if (!useCaseEn && tool.summary_fr && !noTranslate) {
      useCaseEn = await translate(tool.summary_fr.replace(/\.$/, ""), "fr", "en")
      await new Promise((r) => setTimeout(r, 120))
    }

    const en = cleanEnAbout(tool, useCaseEn)
    tool.summary = en.summary
    tool.description = en.description

    const frAbout = cleanFrAbout(tool)
    if (frAbout.summary_fr) tool.summary_fr = frAbout.summary_fr
    if (frAbout.description_fr) tool.description_fr = frAbout.description_fr

    const enFeat = buildEnFeatures(tool, useCaseEn || tool.summary)
    if ((tool.features || []).some(lineIsFiller) || frenchChars((tool.features || []).join(" ")) >= 3) {
      tool.features = enFeat
      stats.enRebuilt++
    } else {
      tool.features = (tool.features || []).filter((l) => !lineIsFiller(l))
    }

    const needFrFeat =
      !tool.features_fr?.length ||
      tool.features_fr.some((l) => lineIsFiller(l) || (englishScore(l) > 2 && frenchChars(l) < 2))
    if (needFrFeat) {
      tool.features_fr = await buildFrFeatures(tool, tool.features)
      stats.frRebuilt++
    } else {
      tool.features_fr = tool.features_fr.filter((l) => !lineIsFiller(l))
    }

    fixImageField(tool, stats)
    writeJson(filePath, tool)

    const overlay = fr[tool.id] || {}
    let overlayChanged = false
    for (const key of ["summary_fr", "description_fr"]) {
      const val = tool[key] || overlay[key]
      if (!val) continue
      const cleaned = key === "description_fr" ? stripFillerSentences(stripEmbeddedFeatures(val)) : stripFillerSentences(val)
      if (cleaned !== overlay[key]) {
        overlay[key] = cleaned
        overlayChanged = true
      }
    }
    if (tool.features_fr?.length) {
      const cleaned = tool.features_fr.filter((l) => !lineIsFiller(l))
      if (JSON.stringify(cleaned) !== JSON.stringify(overlay.features_fr)) {
        overlay.features_fr = cleaned
        overlayChanged = true
      }
    }
    if (overlayChanged) {
      fr[tool.id] = { ...(fr[tool.id] || {}), ...overlay }
      stats.overlayFixed++
    }
  }

  // Second pass: scrub remaining filler in fr-tools not tied to a tool file update
  for (const [id, entry] of Object.entries(fr)) {
    let changed = false
    for (const key of ["summary_fr", "description_fr"]) {
      if (!entry[key]) continue
      const cleaned = stripFillerSentences(entry[key])
      if (cleaned !== entry[key]) {
        entry[key] = cleaned
        changed = true
        stats.fillerLinesRemoved++
      }
    }
    if (entry.features_fr?.length) {
      const cleaned = entry.features_fr.filter((l) => !lineIsFiller(l))
      if (cleaned.length !== entry.features_fr.length) {
        entry.features_fr = cleaned
        changed = true
        stats.fillerLinesRemoved += entry.features_fr.length - cleaned.length
      }
    }
    if (changed) stats.overlayFixed++
  }

  writeJson(frPath, fr)
  console.log(JSON.stringify({ dryRun, ...stats, fillerPatternCount: FILLER_PATTERNS.length }, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
