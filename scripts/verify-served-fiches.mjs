#!/usr/bin/env node
/**
 * QA-aligned audit on *served* copy (catalog merge + localizeTool fields + filler patterns).
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { textHasFiller } from "./qa-filler-patterns.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content/tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const shotDir = path.join(root, "public/screenshots")

const frTools = JSON.parse(fs.readFileSync(frPath, "utf8"))

function frenchChars(text) {
  return (text.match(/[àâäéèêëïîôùûüç]/gi) || []).length
}

function englishScore(text) {
  const words = (text || "").toLowerCase().split(/\s+/)
  const en = ["the", "and", "for", "with", "your", "from", "that", "this", "are", "help"]
  return words.filter((w) => en.includes(w)).length
}

function frenchText(inline, overlay) {
  return inline || overlay
}

function servedFr(tool) {
  const overlay = frTools[tool.id] || {}
  return {
    description: frenchText(tool.summary_fr || tool.shortDescription_fr, overlay.summary_fr || overlay.shortDescription_fr) || tool.summary,
    longDescription:
      frenchText(tool.description_fr, overlay.description_fr) || tool.description_fr || tool.description,
    features:
      (tool.features_fr?.length ? tool.features_fr : overlay.features_fr)?.length
        ? tool.features_fr?.length
          ? tool.features_fr
          : overlay.features_fr
        : tool.features || [],
  }
}

function servedEn(tool) {
  return {
    description: tool.summary,
    longDescription: tool.description,
    features: tool.features || [],
  }
}

function brokenImage(tool) {
  if (!tool.image) return false
  const rel = tool.image.replace(/^\//, "")
  const file = path.join(root, "public", rel)
  return !fs.existsSync(file)
}

const tools = fs
  .readdirSync(toolsDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(toolsDir, f), "utf8")))
  .filter((t) => t.status === "active")

let frAboutEn = 0
let frFeaturesEn = 0
let enMixed = 0
let fillerFr = 0
let fillerEn = 0
let fillerAny = 0
let brokenImages = 0

for (const tool of tools) {
  const fr = servedFr(tool)
  const en = servedEn(tool)

  const frAbout = `${fr.description} ${fr.longDescription}`
  if (englishScore(frAbout) > 4 && frenchChars(frAbout) < 2) frAboutEn++
  const frFeatText = (fr.features || []).join(" ")
  if (englishScore(frFeatText) > 3 && frenchChars(frFeatText) < 2) frFeaturesEn++

  const enAbout = `${en.description} ${en.longDescription}`
  const enFeat = (en.features || []).join(" ")
  if (frenchChars(enAbout) >= 3) enMixed++

  const frFill = textHasFiller(`${frAbout} ${frFeatText}`)
  const enFill = textHasFiller(`${enAbout} ${enFeat}`)
  if (frFill) fillerFr++
  if (enFill) fillerEn++
  if (frFill || enFill) fillerAny++

  if (brokenImage(tool)) brokenImages++
}

console.log(
  JSON.stringify(
    {
      active: tools.length,
      frAboutEnglish: frAboutEn,
      frFeaturesEnglish: frFeaturesEn,
      enMixedFrench: enMixed,
      fillerFr,
      fillerEn,
      fillerTools: fillerAny,
      brokenScreenshotRefs: brokenImages,
    },
    null,
    2,
  ),
)
