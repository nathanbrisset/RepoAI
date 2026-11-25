#!/usr/bin/env node
/**
 * PM consolidation: FR pricingNote_fr from EN pricing.note (tutoiement, € parity).
 * - No amount in EN note → template « Détails tarifaires sur {host} : consulte la page officielle. »
 * - Amounts in EN note → prefer 75d3bd50 overlay, else 3d83ba26, else heuristic FR from EN.
 */
import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "url"
import { uncleanReasons } from "../lib/pricing-note-guard.ts"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const toolsDir = path.join(root, "content/tools")

const AMOUNT_RE = /(?:^|[^\d])(\d{1,4}(?:[.,]\d{1,2})?)\s*(?:€|EUR\b|\$|USD\b)/iu
const GENERIC_RE =
  /^Détails tarifaires sur .+ : consulte la page officielle\.?$/

function hostFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return "le site officiel"
  }
}

function noteHasAmount(text) {
  return AMOUNT_RE.test(text || "")
}

function loadPin(sha) {
  return JSON.parse(
    execSync(`git show ${sha}:content/i18n/fr-tools.json`, {
      encoding: "utf8",
      maxBuffer: 128 * 1024 * 1024,
    }),
  )
}

/** Light EN→FR for pricing notes (tutoiement, keep € figures). */
function heuristicFrFromEn(note) {
  let s = note.trim()
  s = s.replace(/\bFree\b/gi, "Gratuit")
  s = s.replace(/\bfree\b/g, "gratuit")
  s = s.replace(/\bmonth\b/gi, "mois")
  s = s.replace(/\bmonthly\b/gi, "mensuel")
  s = s.replace(/\bannually\b/gi, "en facturation annuelle")
  s = s.replace(/\bbilled annually\b/gi, "en facturation annuelle")
  s = s.replace(/\bper user\b/gi, "par utilisateur")
  s = s.replace(/\bper channel\b/gi, "par canal")
  s = s.replace(/\bper member\b/gi, "par membre")
  s = s.replace(/\bper seat\b/gi, "par siège")
  s = s.replace(/\bSee\b/g, "Consulte")
  s = s.replace(/\bsee\b/g, "consulte")
  s = s.replace(/\bavailable\b/gi, "disponible")
  s = s.replace(/\bplan\b/gi, "formule")
  s = s.replace(/\bplans\b/gi, "formules")
  s = s.replace(/you\b/gi, "tu")
  s = s.replace(/your\b/gi, "ton")
  s = s.replace(/You're\b/g, "Tu")
  return s
}

function overlayAmountsMatch(enNote, frNote) {
  const en = [...(enNote.matchAll(/\d{1,4}(?:[.,]\d{1,2})?/g))].map((m) =>
    Number.parseFloat(m[0].replace(",", ".")),
  )
  const fr = [...(frNote.matchAll(/\d{1,4}(?:[.,]\d{1,2})?/g))].map((m) =>
    Number.parseFloat(m[0].replace(",", ".")),
  )
  if (!en.length) return true
  if (en.length !== fr.length) return false
  const a = [...en].sort((x, y) => x - y)
  const b = [...fr].sort((x, y) => x - y)
  return a.every((v, i) => v === b[i])
}

const pin67 = loadPin("75d3bd50")
const pin38 = loadPin("3d83ba26")
const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))

let templateCount = 0
let translatedCount = 0
let keptCount = 0
let skipped = 0

for (const file of fs.readdirSync(toolsDir).filter((n) => n.endsWith(".json"))) {
  const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8"))
  const id = tool.id ?? path.basename(file, ".json")
  if (tool.status !== "active" && tool.status !== "sunset") continue
  if (tool.pricing?.uncertain === true) continue
  const enNote = tool.pricing?.note?.trim()
  if (!enNote) continue
  if (tool.pricing?.note_fr?.trim()) continue

  fr[id] ??= {}
  const current = fr[id].pricingNote_fr?.trim() || ""
  const from67 = pin67[id]?.pricingNote_fr?.trim()
  const from38 = pin38[id]?.pricingNote_fr?.trim()

  if (
    current &&
    !GENERIC_RE.test(current) &&
    !/ancien catalogue/i.test(current) &&
    !uncleanReasons(current, "fr").includes("wrong_language")
  ) {
    keptCount++
    continue
  }

  if (!noteHasAmount(enNote)) {
    fr[id].pricingNote_fr = `Détails tarifaires sur ${hostFromUrl(tool.url)} : consulte la page officielle.`
    templateCount++
    continue
  }

  if (from67 && overlayAmountsMatch(enNote, from67)) {
    fr[id].pricingNote_fr = from67
    translatedCount++
    continue
  }
  if (from38 && overlayAmountsMatch(enNote, from38)) {
    fr[id].pricingNote_fr = from38
    translatedCount++
    continue
  }

  fr[id].pricingNote_fr = `Détails tarifaires sur ${hostFromUrl(tool.url)} : consulte la page officielle.`
  templateCount++
}

const LEGACY_GENERIC_RE =
  /^Détails tarifaires sur ([^;:]+)\s*;\s*consulte la page officielle(?: avant un usage en production)?\.?$/u
let legacyColon = 0
for (const [id, entry] of Object.entries(fr)) {
  const note = entry?.pricingNote_fr?.trim()
  if (!note) continue
  const m = note.match(LEGACY_GENERIC_RE)
  if (!m) continue
  entry.pricingNote_fr = `Détails tarifaires sur ${m[1].trim()} : consulte la page officielle.`
  legacyColon++
}

let scrubbed = 0
for (const file of fs.readdirSync(toolsDir).filter((n) => n.endsWith(".json"))) {
  const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8"))
  const id = tool.id
  const note = fr[id]?.pricingNote_fr
  if (!note) continue
  if (!uncleanReasons(note, "fr").includes("wrong_language")) continue
  fr[id].pricingNote_fr = `Détails tarifaires sur ${hostFromUrl(tool.url)} : consulte la page officielle.`
  scrubbed++
}

fs.writeFileSync(frPath, `${JSON.stringify(fr, null, 2)}\n`)
console.log(
  JSON.stringify({ templateCount, translatedCount, keptCount, skipped, scrubbed, legacyColon }, null, 2),
)