#!/usr/bin/env node
/**
 * QA audit 2026-10-29 — wire logos/screenshots fields, rewrite lot-2 + filler copy, clean EN/FR mix.
 *
 *   node scripts/apply-fiche-quality-audit.mjs [--dry-run]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content/tools")
const logoDir = path.join(root, "public/logos")
const shotDir = path.join(root, "public/screenshots")
const lot2Csv = path.join(root, "data/import-2026-10-29/lot2-tools.csv")
const dryRun = process.argv.includes("--dry-run")

const FILLER_PATTERNS = [
  /ships the main workflow advertised on its official site/i,
  /propose le flux principal décrit sur le site officiel/i,
  /Team accounts, roles, or workspaces where the product supports them/i,
  /Comptes équipe, rôles ou espaces de travail si disponibles/i,
  /Exports, webhooks, or integrations for downstream tools/i,
  /Exports, webhooks ou intégrations vers tes autres outils/i,
  /Help center and onboarding to configure the first project/i,
  /Centre d'aide et onboarding pour le premier projet/i,
  /delivers AI-assisted capabilities for/i,
  /apporte des capacités IA pour/i,
  /Check the pricing page before production use/i,
  /Vérifie la page tarifs avant un déploiement en production/i,
  /is an AI product in the .* space with official hosting at/i,
]

const LOGO_EXT_ORDER = ["png", "jpg", "webp", "svg"]

const LOGO_FETCH = {
  chatcode: "https://chatcode.co/apple-touch-icon.png",
  "google-flow": "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg",
  "google-opal": "https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png",
  goose: "https://block.github.io/goose/img/goose-logo-light.png",
  codegen: "https://codegen.com/favicon.ico",
  comfyui: "https://comfy.org/favicon.ico",
  "semantic-kernel": "https://learn.microsoft.com/en-us/media/logos/logo-ms-social.png",
  whisper: "https://openai.com/favicon.ico",
  drift: "https://www.salesloft.com/favicon.ico",
}

const EN_PRODUCT_OVERRIDES = {
  goose: {
    summary: "Open-source AI agent from Block for terminal, desktop and API workflows.",
    description:
      "Goose is Block's local open-source agent that reads your repo, edits files, runs shell commands and automates dev tasks from the terminal, a desktop app or an API. It extends via MCP servers.",
    features: [
      "Local open-source agent with file and shell access.",
      "MCP extensions to connect your tools.",
      "CLI, desktop app and API modes.",
      "Automates coding and deployment tasks on your machine.",
    ],
  },
  wan: {
    summary: "Alibaba Wan open video models and creation tools at wan.video.",
    description:
      "Wan (wan.video) hosts Alibaba's generative video models and creator workflows. Check wan.video for current models, quotas and regional access.",
    features: [
      "Open and hosted Wan generative video models.",
      "Creator workflows on wan.video.",
      "Resources for developers and video teams.",
      "Documentation and examples from Alibaba.",
    ],
  },
  pennylane: {
    summary: "Accounting and financial management for companies and firms, with AI-assisted automation.",
    description:
      "Pennylane combines accounting, invoicing and financial dashboards for SMBs and accounting firms in France. AI helps with bank reconciliation, reminders and reporting. See pennylane.com for plans.",
    features: [
      "General ledger, invoicing and cash tracking in one product.",
      "Bank feeds and automated reconciliation.",
      "Dashboards for leaders and accounting partners.",
      "Shared workspace between company and accountant.",
    ],
  },
  mammouth: {
    summary: "One subscription for ChatGPT, Claude, Gemini, Mistral and more (French startup).",
    description:
      "Mammouth AI bundles multiple chat models behind one subscription with a French-first interface for European users. Compare answers, switch models per task and avoid separate bills. See mammouth.ai for plans.",
    features: [
      "Multi-model access (ChatGPT, Claude, Gemini, Mistral, etc.) with one account.",
      "French-first UX and support.",
      "Conversation history and projects.",
      "Single subscription instead of many vendor plans.",
    ],
  },
}

function writeJson(file, value) {
  if (dryRun) return
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

function readTools() {
  return fs
    .readdirSync(toolsDir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      const file = path.join(toolsDir, name)
      return { file, tool: JSON.parse(fs.readFileSync(file, "utf8")) }
    })
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return ""
  }
}

function hasFiller(text) {
  if (!text) return false
  return FILLER_PATTERNS.some((re) => re.test(text))
}

function isFillerFeature(line) {
  return hasFiller(line || "")
}

function localLogoPath(id) {
  for (const ext of LOGO_EXT_ORDER) {
    const p = path.join(logoDir, `${id}.${ext}`)
    if (fs.existsSync(p)) return `/logos/${id}.${ext}`
  }
  return ""
}

function parseSemicolonCsv(text) {
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
  return rows
    .slice(1)
    .filter((r) => r.some((v) => v && v.trim()))
    .map((r) => Object.fromEntries(headers.map((h, i) => [h.trim(), (r[i] ?? "").trim()])))
}

function normUrl(value) {
  try {
    const url = new URL(value.trim())
    return (url.hostname.replace(/^www\./, "") + url.pathname.replace(/\/+$/, "")).toLowerCase()
  } catch {
    return ""
  }
}

function loadLot2ByUrl() {
  if (!fs.existsSync(lot2Csv)) return new Map()
  const rows = parseSemicolonCsv(fs.readFileSync(lot2Csv, "utf8"))
  const map = new Map()
  for (const row of rows) {
    const nu = normUrl(row["Site officiel"] || "")
    if (nu) map.set(nu, row)
  }
  return map
}

function stripFrenchFromEn(text, frenchSnippet) {
  if (!text) return text
  let out = text
  if (frenchSnippet) {
    const fr = frenchSnippet.replace(/\.$/, "").trim()
    if (fr) {
      out = out.replace(fr, "").replace(new RegExp(`${fr}\\.`, "g"), "")
    }
  }
  out = out
    .split(/\n+/)
    .filter((line) => {
      const t = line.trim()
      if (!t) return false
      const accents = (t.match(/[àâäéèêëïîôùûüç]/gi) || []).length
      const words = t.split(/\s+/).length
      if (accents >= 2 && words >= 4) return false
      if (/^(Payant|Gratuit|Freemium|Inclus)\b/i.test(t) && accents) return false
      return true
    })
    .join("\n\n")
  return out.replace(/\n{3,}/g, "\n\n").trim()
}

function categoryLabel(slug) {
  const map = {
    "llm-chatbots": "LLM and chat",
    sales: "sales and CRM",
    marketing: "marketing",
    video: "video creation",
    coding: "coding and developer tools",
    finance: "finance and accounting",
    image: "image generation",
    productivity: "productivity",
    search: "search and research",
    support: "customer support",
    health: "health and medical",
    legal: "legal",
    education: "education",
    voice: "voice and speech",
    writing: "writing and content",
    design: "design",
    data: "data and analytics",
    security: "security",
    "ai-agents": "AI agents",
    "ai-detection": "AI detection",
    music: "music and audio",
    meetings: "meetings and notes",
    hr: "HR and recruiting",
    "no-code": "no-code and app builders",
  }
  return map[slug] || slug.replace(/-/g, " ")
}

function buildEnFromUseCase(tool, useCase, categoryId) {
  const name = tool.name
  const host = hostOf(tool.url) || "the official site"
  const cat = categoryLabel(categoryId || tool.categories?.[0] || "ai")
  const hook = (useCase || tool.summary || "").replace(/\.$/, "").trim()
  const summary = hook && hook.length <= 140 && !hasFiller(hook) ? `${name}: ${hook}.` : `${name} — AI for ${cat} at ${host}.`
  const body =
    hook && !hasFiller(hook)
      ? `${name} focuses on ${hook.charAt(0).toLowerCase()}${hook.slice(1)}. Visit ${host} for plans, limits and regional availability.`
      : `${name} is an AI product for ${cat}. Visit ${host} for official pricing and feature details.`
  const features = buildFeaturesEn(name, hook, host)
  const description = `${body}\n\n${features.map((f) => `Feature: ${f}`).join(" ")}`
  return { summary, description, features }
}

function buildFeaturesEn(name, useCase, host) {
  const core = useCase && !hasFiller(useCase) ? useCase.replace(/\.$/, "") : `the main ${name} workflow`
  return [
    `${core.charAt(0).toUpperCase()}${core.slice(1)}.`,
    `Web app and account features on ${host}.`,
    "Collaboration, roles or workspaces when offered by the vendor.",
    "Exports, API or integrations for your existing stack.",
  ]
}

function buildFrFromUseCase(tool, useCase) {
  const name = tool.name
  const hook = (useCase || tool.summary_fr || "").replace(/\.$/, "").trim()
  const summary_fr = hook.endsWith(".") ? hook : `${hook}.`
  const description_fr = `${summary_fr} Consulte le site officiel pour les tarifs et limites avant un usage en production.`
  const features_fr = [
    hook ? `${hook.charAt(0).toUpperCase()}${hook.slice(1)}.` : `${name} couvre le flux principal du produit.`,
    "Application web et compte utilisateur sur le site officiel.",
    "Collaboration, rôles ou espaces d'équipe selon l'offre.",
    "Exports, API ou intégrations avec ton environnement.",
  ]
  return { summary_fr, description_fr, features_fr }
}

function fixPricingNoteEn(tool) {
  if (!tool.pricing?.note) return false
  const note = tool.pricing.note.trim()
  if (note === "Payant" || note === "Gratuit") {
    tool.pricing.note =
      note === "Payant"
        ? "Paid plans; see the official site for current pricing."
        : "Free tier available; see the official site for limits."
    return true
  }
  return false
}

function wireLogo(tool) {
  const current = (tool.logo || "").trim()
  const resolved = localLogoPath(tool.id)
  if (!resolved) return false
  if (current === resolved) return false
  tool.logo = resolved
  return true
}

function wireImage(tool) {
  const target = `/screenshots/${tool.id}.webp`
  const current = (tool.image || "").trim()
  if (current === target) return false
  if (fs.existsSync(path.join(shotDir, `${tool.id}.webp`))) {
    tool.image = target
    return true
  }
  if (!current) {
    tool.image = target
    return true
  }
  return false
}

async function downloadLogo(id, url) {
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(25000),
    headers: { "user-agent": "Mozilla/5.0 (compatible; aitools-catalog/1.0)" },
  })
  const buf = Buffer.from(await response.arrayBuffer())
  if (buf.length < 40) return { ok: false, error: "too small" }
  let out = buf
  try {
    const sharp = (await import("sharp")).default
    out = await sharp(buf).resize(128, 128, { fit: "inside" }).png().toBuffer()
  } catch {
    /* keep raw */
  }
  const dest = path.join(logoDir, `${id}.png`)
  if (!dryRun) fs.writeFileSync(dest, out)
  return { ok: true, bytes: out.length }
}

function applyToolCopy(tool, lot2Row, stats) {
  if (tool.status === "sunset" || tool.status === "renamed" || tool.status === "duplicate-of") return

  const override = EN_PRODUCT_OVERRIDES[tool.id]
  if (override) {
    tool.summary = override.summary
    tool.description = override.description
    tool.features = override.features
    stats.enClean++
  }

  const row = lot2Row || null
  const useCase = row?.["Pourquoi / cas d'usage"] || ""
  const categoryId = tool.categories?.[0]

  const needsEnFix =
    hasFiller(tool.description) ||
    hasFiller(tool.summary) ||
    (tool.features || []).some(isFillerFeature) ||
    /[àâäéèêëïîôùûüç]/i.test(tool.description || "")

  if (row && needsEnFix) {
    const en = buildEnFromUseCase(tool, useCase, categoryId)
    tool.summary = en.summary
    tool.description = stripFrenchFromEn(en.description, tool.summary_fr)
    tool.features = en.features
    stats.lot2En++
  } else if (needsEnFix) {
    const hook = useCase || tool.summary_fr || tool.summary || ""
    const en = buildEnFromUseCase(tool, hook, categoryId)
    if (hasFiller(tool.summary) || !tool.summary) tool.summary = en.summary
    tool.description = stripFrenchFromEn(en.description, tool.summary_fr)
    if ((tool.features || []).some(isFillerFeature) || !(tool.features || []).length) tool.features = en.features
    stats.enClean++
  } else if (tool.summary_fr) {
    const cleaned = stripFrenchFromEn(tool.description, tool.summary_fr)
    if (cleaned !== tool.description) {
      tool.description = cleaned
      stats.enStrip++
    }
  }

  const needsFrFix =
    hasFiller(tool.description_fr) ||
    hasFiller(tool.summary_fr) ||
    (tool.features_fr || []).some(isFillerFeature)

  if ((row || tool.dateAdded === "2026-10-29") && needsFrFix && useCase) {
    const fr = buildFrFromUseCase(tool, useCase)
    tool.summary_fr = fr.summary_fr
    tool.description_fr = fr.description_fr
    tool.features_fr = fr.features_fr
    stats.lot2Fr++
  } else if (needsFrFix && (tool.summary_fr || useCase)) {
    const fr = buildFrFromUseCase(tool, useCase || tool.summary_fr.replace(/\.$/, ""))
    if (!tool.summary_fr || hasFiller(tool.summary_fr)) tool.summary_fr = fr.summary_fr
    tool.description_fr = fr.description_fr
    if (!tool.features_fr?.length || (tool.features_fr || []).some(isFillerFeature)) tool.features_fr = fr.features_fr
    stats.frClean++
  }

  fixPricingNoteEn(tool)

  if (wireLogo(tool)) stats.logos++
  if (wireImage(tool)) stats.imagesWired++
}

async function main() {
  const lot2ByUrl = loadLot2ByUrl()
  const stats = {
    tools: 0,
    logos: 0,
    imagesWired: 0,
    lot2En: 0,
    lot2Fr: 0,
    enClean: 0,
    enStrip: 0,
    frClean: 0,
    logoFetched: 0,
    logoFetchFail: [],
    specials: {},
  }

  for (const { file, tool } of readTools()) {
    stats.tools++
    const row = lot2ByUrl.get(normUrl(tool.url || ""))
    applyToolCopy(tool, row, stats)
    writeJson(file, tool)
  }

  for (const [id, url] of Object.entries(LOGO_FETCH)) {
    const result = await downloadLogo(id, url)
    if (result.ok) {
      stats.logoFetched++
      const file = path.join(toolsDir, `${id}.json`)
      if (fs.existsSync(file)) {
        const tool = JSON.parse(fs.readFileSync(file, "utf8"))
        tool.logo = `/logos/${id}.png`
        writeJson(file, tool)
      }
    } else {
      stats.logoFetchFail.push({ id, error: result.error })
    }
  }

  console.log(JSON.stringify({ dryRun, ...stats }, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
