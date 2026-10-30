#!/usr/bin/env node
/**
 * Copy non-filler English features into fr-tools.json as features_fr when missing,
 * using lightweight label translation for "Title: body" bullets.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content/tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")

const FILLER = [
  /ships the main workflow/i,
  /propose le flux principal/i,
  /Team accounts, roles, or workspaces/i,
  /Help center and onboarding/i,
  /delivers AI-assisted capabilities/i,
]

const LABEL_FR = {
  "Multimodal Input": "Entrées multimodales",
  "Code Interpreter": "Interpréteur de code",
  Memory: "Mémoire",
  "Advanced Reasoning": "Raisonnement avancé",
  "Long Context Handling": "Long contexte",
  "Safety & Alignment": "Sécurité et alignement",
  "Creative Writing": "Rédaction créative",
  "Helpful for Research": "Aide à la recherche",
  "Cited Answers": "Réponses citées",
  "Web Search Integration": "Recherche web intégrée",
  "Follow-Up Queries": "Relances contextuelles",
  "Multimodal Inputs": "Entrées multimodales",
  "Multilingual Support": "Multilingue",
  "Accurate Summarization": "Synthèses précises",
  "Factual Consistency": "Cohérence factuelle",
  "Academic Writing": "Rédaction académique",
}

function isFiller(line) {
  return FILLER.some((re) => re.test(line || ""))
}

function translateFeature(line) {
  const m = line.match(/^([^:]+):\s*(.+)$/)
  if (!m) return line
  const label = m[1].trim()
  const body = m[2].trim()
  const frLabel = LABEL_FR[label] || label
  return `${frLabel} : ${body}`
}

function loadTools() {
  return fs
    .readdirSync(toolsDir)
    .filter((n) => n.endsWith(".json"))
    .map((n) => JSON.parse(fs.readFileSync(path.join(toolsDir, n), "utf8")))
    .filter((t) => t.status === "active")
}

const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
let added = 0

for (const tool of loadTools()) {
  const features = tool.features || []
  if (!features.length || features.some(isFiller)) continue
  const entry = fr[tool.id]
  if (!entry?.description_fr) continue
  if (entry.features_fr?.length && !entry.features_fr.some(isFiller)) continue
  entry.features_fr = features.map(translateFeature)
  added++
}

fs.writeFileSync(frPath, `${JSON.stringify(fr, null, 2)}\n`)
console.log(`Backfilled features_fr for ${added} tools in fr-tools.json`)
