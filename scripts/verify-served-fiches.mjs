#!/usr/bin/env node
/**
 * Approximate QA audit on *served* copy (localizeTool simulation + filler heuristics).
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content/tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")

const FILLER = [
  /Collaboration, roles or workspaces when offered by the vendor/i,
  /Application web et compte utilisateur sur le site officiel/i,
  /Exports, API or integrations for your existing stack/i,
  /ships the main workflow/i,
  /The main .+ workflow/i,
  /delivers AI-assisted capabilities/i,
  /Check the pricing page before production use/i,
  /Web app and account features on/i,
  /publishes workflows and limits on its official website/i,
  /Check .+'s docs for integrations available on your plan/i,
]

const frTools = JSON.parse(fs.readFileSync(frPath, "utf8"))

function hasFiller(text) {
  return FILLER.some((re) => re.test(text || ""))
}

function frenchChars(text) {
  return (text.match(/[àâäéèêëïîôùûüç]/gi) || []).length
}

function englishScore(text) {
  const words = (text || "").toLowerCase().split(/\s+/)
  const en = ["the", "and", "for", "with", "your", "from", "that", "this", "are", "help"]
  return words.filter((w) => en.includes(w)).length
}

function localize(tool, locale) {
  const overlay = frTools[tool.id] || {}
  if (locale !== "fr") {
    return {
      description: tool.summary,
      longDescription: tool.description,
      features: tool.features || [],
    }
  }
  return {
    description: overlay.summary_fr || tool.summary_fr || tool.summary,
    longDescription: overlay.description_fr || tool.description_fr || tool.description,
    features: (overlay.features_fr || tool.features_fr)?.length
      ? overlay.features_fr || tool.features_fr
      : tool.features || [],
  }
}

const tools = fs
  .readdirSync(toolsDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(toolsDir, f), "utf8")))
  .filter((t) => t.status === "active")

let frAboutEn = 0
let frFeaturesEn = 0
let enMixed = 0
let fillerAny = 0

for (const tool of tools) {
  const fr = localize(tool, "fr")
  const en = localize(tool, "en")

  const frAbout = `${fr.description} ${fr.longDescription}`
  if (englishScore(frAbout) > 4 && frenchChars(frAbout) < 2) frAboutEn++
  const frFeatText = (fr.features || []).join(" ")
  if (englishScore(frFeatText) > 3 && frenchChars(frFeatText) < 2) frFeaturesEn++

  const enAbout = `${en.description} ${en.longDescription}`
  if (frenchChars(enAbout) >= 3) enMixed++

  const blob = [frAbout, frFeatText, enAbout, (en.features || []).join(" ")].join(" ")
  if (hasFiller(blob)) fillerAny++
}

console.log(
  JSON.stringify(
    {
      active: tools.length,
      frAboutEnglish: frAboutEn,
      frFeaturesEnglish: frFeaturesEn,
      enMixedFrench: enMixed,
      fillerTools: fillerAny,
    },
    null,
    2,
  ),
)
