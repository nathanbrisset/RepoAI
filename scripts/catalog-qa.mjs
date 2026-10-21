#!/usr/bin/env node
/**
 * Contrôles du catalogue hors sunset :
 * - capture locale d'au moins 15 Ko, sauf fiches revues dont la page est vraiment petite
 * - How To Use : pas de YouTube ni de sites tiers connus (guides copiés)
 * - anciens domaines qui ne sont plus l'URL officielle
 *
 *   node scripts/catalog-qa.mjs
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const TOOLS_DIR = path.join(ROOT, "content/tools")
const MIN_BYTES = 15 * 1024

const BLOCKED_HOWTO = ["youtube.com", "youtu.be", "youtube-nocookie.com", "yeschat.ai", "cococlip.ai", "fahimai.com"]
const RETIRED = ["aidungeon.io", "useblackbox.io", "cursor.sh", "chat.openai.com", "lensa-ai.com"]

/**
 * Pages d'accueil réellement peu denses, revues par OCR le 21 octobre 2026.
 * Le fichier reste sous 15 Ko sans être un logo de repli ni une page d'erreur.
 * Ne pas y ajouter une capture sans l'avoir relue.
 */
const SMALL_OK = {
  chatcode: "Interface sombre réelle (Hello I am ChatCode AI, champ Ask Code). La page est plate, le WebP reste sous 15 Ko.",
  albertai: "Page Albert revue : capture légère acceptée.",
  autodraw: "Page d'accueil « AutoDraw / Fast drawing for everyone ».",
  grok: "Interface Grok « What should we explore? ».",
  kimi: "Interface Kimi « Ask anything, or task an agent ».",
  lovable: "Page d'accueil Lovable.",
  luma_ai: "Page d'accueil « Luma is your creative partner ».",
  manus: "Page « Introducing Manus 2.0 », revue.",
  mutiny: "Page d'accueil « What do you want Mutiny to build for you? ».",
  notebooklm: "Page Gemini Notebook « Turn your files into Slide Decks ».",
}

const MULTI_SUFFIX = new Set(["co.uk", "com.au", "co.jp", "com.br", "co.nz"])

function hostOf(url) {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "")
  } catch {
    return ""
  }
}

function blocked(host, list) {
  return list.some((item) => host === item || host.endsWith(`.${item}`))
}

function registrable(host) {
  const parts = host.split(".").filter(Boolean)
  if (parts.length < 2) return host
  const tail = parts.slice(-2).join(".")
  if (MULTI_SUFFIX.has(tail) && parts.length >= 3) return parts.slice(-3).join(".")
  return tail
}

function walkUrls(value, found) {
  if (typeof value === "string" && /^https?:\/\//i.test(value)) found.push(value)
  else if (Array.isArray(value)) value.forEach((item) => walkUrls(item, found))
  else if (value && typeof value === "object") Object.values(value).forEach((item) => walkUrls(item, found))
}

const failures = []
const warnings = []
const tools = fs
  .readdirSync(TOOLS_DIR)
  .filter((name) => name.endsWith(".json"))
  .map((name) => JSON.parse(fs.readFileSync(path.join(TOOLS_DIR, name), "utf8")))

for (const tool of tools) {
  const urls = []
  walkUrls(tool, urls)
  for (const url of urls) {
    const host = hostOf(url)
    if (blocked(host, RETIRED)) failures.push(`${tool.id}: ancien domaine ${url}`)
  }
  if (tool.status === "sunset") continue

  for (const step of tool.howToUse || []) {
    for (const link of step.links || []) {
      const host = hostOf(link.url)
      if (blocked(host, BLOCKED_HOWTO)) failures.push(`${tool.id}: lien How To Use tiers ou YouTube ${link.url}`)
      const toolHost = hostOf(tool.url)
      if (host && toolHost && registrable(host) !== registrable(toolHost) && !blocked(host, BLOCKED_HOWTO)) {
        warnings.push(`${tool.id}: How To Use hors domaine (${link.url})`)
      }
    }
  }

  const image = (tool.image || "").trim()
  if (!image.startsWith("/")) {
    failures.push(`${tool.id}: image non locale (${image || "vide"})`)
    continue
  }
  const abs = path.join(ROOT, "public", image.replace(/^\//, ""))
  if (!fs.existsSync(abs)) {
    failures.push(`${tool.id}: fichier image manquant ${image}`)
    continue
  }
  const size = fs.statSync(abs).size
  if (size < MIN_BYTES && !SMALL_OK[tool.id]) {
    failures.push(`${tool.id}: capture ${size} octets, minimum ${MIN_BYTES}`)
  }
}

const appDir = path.join(ROOT, "app")
function scanTree(dir) {
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name)
    const stat = fs.statSync(abs)
    if (stat.isDirectory()) scanTree(abs)
    else if (/\.(tsx|ts|jsx|js)$/.test(name)) {
      const text = fs.readFileSync(abs, "utf8")
      for (const match of text.match(/https?:\/\/[^"'`\s)]+/g) || []) {
        if (blocked(hostOf(match), RETIRED)) failures.push(`${path.relative(ROOT, abs)}: ancien domaine ${match}`)
      }
    }
  }
}
if (fs.existsSync(appDir)) scanTree(appDir)

if (warnings.length) {
  console.log(`Avertissements How To Use hors domaine de la fiche (${warnings.length}, non bloquants) :`)
  for (const line of warnings) console.log(`  ${line}`)
}
if (failures.length) {
  console.error(`Échecs QA (${failures.length}) :`)
  for (const line of failures) console.error(`  ${line}`)
  process.exit(1)
}
console.log(`QA catalogue OK (${tools.filter((tool) => tool.status !== "sunset").length} fiches hors sunset, minimum ${MIN_BYTES} octets).`)
