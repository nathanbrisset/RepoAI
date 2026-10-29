#!/usr/bin/env node
/**
 * PR28 — fix copy fields the runtime actually serves (localizeTool + metadata).
 *   node scripts/apply-served-content-fix.mjs [--dry-run]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { execSync } from "child_process"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content/tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const lot2Csv = path.join(root, "data/import-2026-10-29/lot2-tools.csv")
const lot2EnMap = JSON.parse(fs.readFileSync(path.join(root, "data/lot2-use-case-en.json"), "utf8"))
const dryRun = process.argv.includes("--dry-run")

const GENERIC_FILLER = [
  /ships the main workflow advertised on its official site/i,
  /propose le flux principal décrit sur le site officiel/i,
  /Team accounts, roles, or workspaces/i,
  /Comptes équipe, rôles ou espaces de travail/i,
  /Collaboration, roles or workspaces when offered by the vendor/i,
  /Application web et compte utilisateur sur le site officiel/i,
  /Exports, API or integrations for your existing stack/i,
  /Exports, webhooks, or integrations for downstream tools/i,
  /Help center and onboarding to configure the first project/i,
  /Centre d'aide et onboarding pour le premier projet/i,
  /delivers AI-assisted capabilities for/i,
  /apporte des capacités IA pour/i,
  /Check the pricing page before production use/i,
  /Vérifie la page tarifs avant un déploiement en production/i,
  /is an AI product in the .* space with official hosting at/i,
  /The main .+ workflow\.?$/i,
  /Web app and account features on/i,
  /Consulte le site officiel pour les tarifs et limites avant un usage en production/i,
  /Visit .+ for plans, limits and regional availability/i,
  /for official pricing and feature details/i,
]

const EN_OVERRIDES = {
  goose: {
    summary: "Open-source AI agent from Block for terminal, desktop, and API workflows.",
    description:
      "Goose is Block's local open-source agent that reads your repo, edits files, runs shell commands, and automates dev tasks from the terminal, a desktop app, or an API. It extends via MCP servers.",
    features: [
      "Local open-source agent with file and shell access.",
      "MCP extensions to connect your tools.",
      "CLI, desktop app, and API modes.",
      "Automates coding and deployment tasks on your machine.",
    ],
    summary_fr: "Agent IA open source natif pour le terminal, le bureau et l'API (Block).",
    description_fr:
      "Goose est l'agent IA open source de Block qui lit ton dépôt, modifie des fichiers, exécute des commandes et automatise des tâches de développement depuis le terminal, une application de bureau ou une API. Il s'installe localement et s'étend via des extensions MCP.",
    features_fr: [
      "Agent local open source avec accès fichiers et shell.",
      "Extensions MCP pour connecter tes outils.",
      "CLI, application de bureau et mode API.",
      "Automatisation de tâches de code et de déploiement.",
    ],
  },
}

const ID_BY_NAME = {
  "Hunyuan3D (Tencent)": "hunyuan-3d",
  "Lumo (Proton)": "lumo-proton",
  "GPT for Sheets and Docs": "gpt-for-sheets",
  "Abacus.AI ChatLLM": "abacus-chatllm",
  "Rep AI": "rep-ai",
  "Scribbr AI Detector": "scribbr-ai-detector",
  "Hive AI Detector": "hive-ai-detector",
  "Sapling AI Detector": "sapling-ai-detector",
  "Compilatio Magister+": "compilatio-magister",
  "SentinelOne Purple AI": "sentinelone-purple-ai",
  "Abnormal Security": "abnormal-security",
  "Spotter Studio": "spotter",
  "T3 Chat": "t3",
  "Tabby": "tabbyml",
  "Scribe": "scribehow",
  "Synthesis Tutor": "synthesis",
  "Aqua Voice": "withaqua",
  "Regie.ai": "regie",
}

function writeJson(file, value) {
  if (dryRun) return
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

function hasFiller(text) {
  return GENERIC_FILLER.some((re) => re.test(text || ""))
}

function frenchChars(text) {
  return (text.match(/[àâäéèêëïîôùûüç]/gi) || []).length
}

function englishScore(text) {
  const words = (text || "").toLowerCase().split(/\s+/)
  const en = ["the", "and", "for", "with", "your", "from", "that", "this", "are", "help", "supports", "documents", "integrations"]
  return words.filter((w) => en.includes(w)).length
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return ""
  }
}

function stripEmbeddedFeatures(description) {
  if (!description) return description
  const idx = description.search(/\n\nFeature:/i)
  if (idx === -1) return description.trim()
  return description.slice(0, idx).trim()
}

function splitUseCaseBullets(text) {
  return (text || "")
    .split(/[,;—–]|(?:\s+et\s+)/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 8)
    .slice(0, 4)
    .map((s) => (s.endsWith(".") ? s : `${s}.`))
}

function featuresFromUseCase(name, useCaseEn, _useCaseFr, tags, url) {
  const enParts = splitUseCaseBullets(useCaseEn)
  if (enParts.length >= 2) {
    return enParts.map((p) => (p.charAt(0).toUpperCase() + p.slice(1)))
  }
  const host = hostOf(url) || "the official site"
  const core = useCaseEn.endsWith(".") ? useCaseEn : `${useCaseEn}.`
  const tagA = tags?.[0] || "teams"
  const tagB = tags?.[1] || "workflow"
  return [
    core,
    `${name} supports ${tagA} and ${tagB} on ${host}.`,
    `${host} documents current ${name} capabilities, limits, and signup.`,
    `${name} integrations and exports depend on the plan shown on ${host}.`,
  ]
}

function featuresFrFromUseCase(name, useCaseFr, tags, url) {
  const parts = splitUseCaseBullets(useCaseFr)
  if (parts.length >= 2) return parts.map((p) => (p.charAt(0).toUpperCase() + p.slice(1)))
  const host = hostOf(url) || "le site officiel"
  const core = useCaseFr.endsWith(".") ? useCaseFr : `${useCaseFr}.`
  const tagA = tags?.[0] || "équipes"
  const tagB = tags?.[1] || "workflow"
  return [
    core,
    `${name} couvre ${tagA} et ${tagB} sur ${host}.`,
    `${host} décrit les capacités, limites et inscription de ${name}.`,
    `Intégrations et exports ${name} selon l'offre affichée sur ${host}.`,
  ]
}

function parseLot2() {
  const text = fs.readFileSync(lot2Csv, "utf8")
  const rows = []
  let row = []
  let cell = ""
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"'
          i++
        } else quoted = false
      } else cell += c
    } else if (c === '"') quoted = true
    else if (c === ";") {
      row.push(cell)
      cell = ""
    } else if (c === "\n") {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ""
    } else if (c !== "\r") cell += c
  }
  if (cell.length || row.length) {
    row.push(cell)
    rows.push(row)
  }
  const headers = rows[0]
  const byId = new Map()
  for (const r of rows.slice(1)) {
    if (!r.some((v) => v?.trim())) continue
    const rowObj = Object.fromEntries(headers.map((h, i) => [h.trim(), (r[i] ?? "").trim()]))
    const name = rowObj.Nom
    const url = rowObj["Site officiel"]
    const useCaseFr = rowObj["Pourquoi / cas d'usage"]
    let id = ID_BY_NAME[name]
    if (!id) {
      try {
        const host = new URL(url).hostname.replace(/^www\./, "").split(".")[0]
        id = host.toLowerCase().replace(/[^a-z0-9-]/g, "-")
      } catch {
        id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      }
    }
    byId.set(id, { name, url, useCaseFr })
  }
  return byId
}

function readBaseTool(id) {
  try {
    const raw = execSync(`git show restore3-new:content/tools/${id}.json`, { cwd: root, encoding: "utf8" })
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function stripFrenchFromEn(text, frSnippet) {
  if (!text) return text
  let out = text
  if (frSnippet) {
    const fr = frSnippet.replace(/\.$/, "").trim()
    if (fr.length > 6) out = out.replaceAll(fr, "").replaceAll(`${fr}.`, "")
  }
  return out
    .split(/\n+/)
    .filter((line) => {
      const t = line.trim()
      if (!t) return false
      const accents = (t.match(/[àâäéèêëïîôùûüç]/gi) || []).length
      if (accents >= 2 && t.split(/\s+/).length >= 4) return false
      return true
    })
    .join("\n\n")
    .trim()
}

function applyLot2(tool, lot2Row, stats) {
  const { name, url, useCaseFr } = lot2Row
  const useCaseEn = lot2EnMap[useCaseFr] || useCaseFr
  tool.url = url || tool.url
  tool.summary = `${name}: ${useCaseEn}.`
  tool.description = stripEmbeddedFeatures(
    `${name} helps teams with ${useCaseEn.charAt(0).toLowerCase()}${useCaseEn.slice(1)}. See ${hostOf(url) || "the official site"} for pricing and limits.`,
  )
  tool.summary_fr = useCaseFr.endsWith(".") ? useCaseFr : `${useCaseFr}.`
  tool.description_fr = `${tool.summary_fr} Tarifs et limites sur le site officiel.`
  tool.features = featuresFromUseCase(name, useCaseEn, useCaseFr, tool.tags, url)
  tool.features_fr = featuresFrFromUseCase(name, useCaseFr, tool.tags, url)
  stats.lot2++
}

function restoreNonLot2(tool, lot2Ids, stats) {
  if (lot2Ids.has(tool.id)) return
  const base = readBaseTool(tool.id)
  if (!base) return
  const keys = ["summary", "description", "features", "summary_fr", "description_fr", "features_fr"]
  let restored = false
  for (const key of keys) {
    if (base[key] === undefined) continue
    const cur = tool[key]
    const curFiller = typeof cur === "string" ? hasFiller(cur) : Array.isArray(cur) ? cur.some(hasFiller) : false
    const baseFiller = typeof base[key] === "string" ? hasFiller(base[key]) : Array.isArray(base[key]) ? base[key].some(hasFiller) : false
    if (curFiller && !baseFiller) {
      tool[key] = base[key]
      restored = true
    }
  }
  if (restored) stats.restored++
}

function cleanAllFields(tool, stats) {
  tool.description = stripEmbeddedFeatures(tool.description)
  if (tool.description_fr) tool.description_fr = stripEmbeddedFeatures(tool.description_fr)

  if (hasFiller(tool.summary) || /[àâäéèêëïîôùûüç]{2,}/i.test(tool.summary || "")) {
    tool.summary = stripFrenchFromEn(tool.summary, tool.summary_fr)
  }
  tool.description = stripFrenchFromEn(tool.description, tool.summary_fr)

  if ((tool.features || []).some(hasFiller) && tool.tags?.length) {
    tool.features = tool.features.map((line, i) => {
      if (!hasFiller(line)) return line
      const tag = tool.tags[i] || tool.tags[0] || "workflow"
      return `${tool.name} — ${tag}: capabilities described on ${hostOf(tool.url) || "the official site"}.`
    })
    stats.featuresRewritten++
  }

  if ((tool.features_fr || []).some((line) => /^The main /i.test(line) || (englishScore(line) > 2 && frenchChars(line) < 1))) {
    if (tool.summary_fr) {
      tool.features_fr = featuresFrFromUseCase(tool.name, tool.summary_fr.replace(/\.$/, ""), tool.tags, tool.url)
      stats.featuresFrRewritten++
    }
  }
}

function syncFrTools(tools, stats) {
  const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
  for (const tool of tools) {
    if (tool.status !== "active") continue
    if (!tool.summary_fr && !tool.description_fr) continue
    fr[tool.id] = {
      ...(fr[tool.id] || {}),
      summary_fr: tool.summary_fr || fr[tool.id]?.summary_fr,
      description_fr: tool.description_fr || fr[tool.id]?.description_fr,
    }
    if (tool.features_fr?.length) fr[tool.id].features_fr = tool.features_fr
    if (tool.howToUse_fr?.length) fr[tool.id].howToUse_fr = tool.howToUse_fr
    stats.frSynced++
  }
  writeJson(frPath, fr)
}

function loadTools() {
  return fs
    .readdirSync(toolsDir)
    .filter((n) => n.endsWith(".json"))
    .map((file) => ({ file: path.join(toolsDir, file), tool: JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8")) }))
}

function main() {
  const lot2 = parseLot2()
  const lot2Ids = new Set(lot2.keys())
  const stats = { lot2: 0, restored: 0, featuresRewritten: 0, featuresFrRewritten: 0, frSynced: 0, tools: 0 }

  const active = []
  for (const { file, tool } of loadTools()) {
    stats.tools++
    if (tool.status === "sunset" || tool.status === "renamed" || tool.status === "duplicate-of") continue
    active.push(tool)

    restoreNonLot2(tool, lot2Ids, stats)
    const override = EN_OVERRIDES[tool.id]
    if (override) Object.assign(tool, override)
    const lot2Row = lot2.get(tool.id)
    if (lot2Row) applyLot2(tool, lot2Row, stats)
    else cleanAllFields(tool, stats)

    writeJson(file, tool)
  }

  syncFrTools(active, stats)
  console.log(JSON.stringify({ dryRun, ...stats }, null, 2))
}

main()
