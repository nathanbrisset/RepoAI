#!/usr/bin/env node
/**
 * Sanity checks on pricing-related visitor copy (amounts, glued words).
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const allowPath = path.join(root, "scripts/prebuild/pricing-amount-sanity-allow.json")
const fieldAllowPath = path.join(root, "scripts/prebuild/pricing-amount-sanity-field-allow.json")

/** Per (slug, amount) exemptions with reason. Key: `${slug}:${amount}` */
const DEFAULT_HIGH_EUR_ALLOW = {
  "kleos:45241": "Enterprise annual list in Contenu note",
  "twenty:45241": "Enterprise annual list in Contenu note",
  "chatbase:452": "Business 452 €/mo list in pricing note",
  "chatbase:136": "Standard 136 €/mo list in pricing note",
  "openhands:452": "Teams 452 €/mo in note",
  "amboss:1085": "Student Life list in Contenu note",
  "wren-ai:723": "Enterprise monthly list in Contenu note",
  "wren-ai:506": "Enterprise annual monthly-equiv in Contenu note",
}

const MALFORMED_NUMBER_RE = /\b\d{1,4}\.\d{2,}\.\d{2,}\b|\b\d{1,4},\d{2,},\d{2,}\b/u
const VERB_HOLE_RE =
  /\b(costs?\s+and|is\s+and|are\s+and|est\s+à\s+par|est\s+and)\b|\b(?:à|at)\s+(?:per|par)\s+(?:mo|mois|month)\b/iu

function hasGluedWords(text) {
  if (!text || typeof text !== "string") return false
  return VERB_HOLE_RE.test(text)
}

const HIGH_EUR_SKIP_NOTE_FIELDS = new Set([
  "pricing.note",
  "pricing.details",
  "pricingNote_fr",
])
const AMOUNT_RE = /(\d{1,3}(?:[ \u00a0]\d{3})*(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?)\s*€/giu

const PAID_TIER_WORDS =
  "Pro|Plus|Premium|Business|Starter|Standard|Professional|Team|Individual|Enterprise|Creator|Ultra|Max"
const PAID_TIER_ZERO_NEAR =
  new RegExp(
    `\\b(?:${PAID_TIER_WORDS})\\b(?:\\s+\\S+){0,3}\\s+(?:starts?\\s+at|from|dès|à|at|for)\\s+0\\s*€`,
    "iu",
  )

const FREE_CTX = /\b(?:Free|Gratuit|gratuite?|essai|trial)\b/i

function listedActive(tool) {
  const excluded = new Set(["duplicate-of", "sunset", "renamed", "inactive"])
  return tool.status === "active" && !excluded.has(tool.status)
}

function loadHighEurAllow() {
  if (!fs.existsSync(allowPath)) return { ...DEFAULT_HIGH_EUR_ALLOW }
  return { ...DEFAULT_HIGH_EUR_ALLOW, ...JSON.parse(fs.readFileSync(allowPath, "utf8")) }
}

function loadFieldAllow() {
  if (!fs.existsSync(fieldAllowPath)) return { expires: "2026-12-15", entries: [] }
  const raw = fs.readFileSync(fieldAllowPath, "utf8").trim()
  if (!raw) return { expires: "2026-12-15", entries: [] }
  return JSON.parse(raw)
}

function isFieldAllowed(id, field, rule, fieldAllow) {
  return fieldAllow.entries?.some(
    (e) => e.id === id && e.field === field && e.rule === rule,
  )
}

function collectStrings(tool, overlay) {
  const out = []
  const push = (label, text) => {
    if (typeof text === "string" && text.trim()) out.push({ label, text })
  }
  push("summary", tool.summary)
  push("summary_fr", overlay?.summary_fr || tool.summary_fr)
  push("description", tool.description)
  push("description_fr", overlay?.description_fr || tool.description_fr)
  push("pricing.note", tool.pricing?.note)
  push("pricing.details", tool.pricing?.details)
  push("pricingNote_fr", overlay?.pricingNote_fr)
  if (Array.isArray(tool.features)) tool.features.forEach((t, i) => push(`features[${i}]`, t))
  if (Array.isArray(overlay?.features_fr || tool.features_fr)) {
    ;(overlay?.features_fr || tool.features_fr).forEach((t, i) => push(`features_fr[${i}]`, t))
  }
  for (const steps of [tool.howToUse, overlay?.howToUse_fr, tool.howToUse_fr]) {
    if (!Array.isArray(steps)) continue
    steps.forEach((s, i) => push(`howToUse[${i}]`, s?.description))
  }
  return out
}

function parseEurAmount(raw) {
  const cleaned = raw.replace(/[ \u00a0]/g, "").replace(",", ".")
  const n = Number.parseFloat(cleaned)
  return Number.isNaN(n) ? null : n
}

export function scanPricingAmountSanity({ rootDir = root } = {}) {
  const frOverlay = JSON.parse(fs.readFileSync(path.join(rootDir, "content/i18n/fr-tools.json"), "utf8"))
  const highAllow = loadHighEurAllow()
  const fieldAllow = loadFieldAllow()
  const today = new Date().toISOString().slice(0, 10)
  if (fieldAllow.expires && today > fieldAllow.expires) {
    throw new Error(`pricing-amount-sanity-field-allow.json expired on ${fieldAllow.expires}`)
  }
  const hits = []

  for (const file of fs.readdirSync(path.join(rootDir, "content/tools")).filter((n) => n.endsWith(".json"))) {
    const tool = JSON.parse(fs.readFileSync(path.join(rootDir, "content/tools", file), "utf8"))
    if (!listedActive(tool)) continue

    const overlay = frOverlay[tool.id]
    for (const { label, text } of collectStrings(tool, overlay)) {
      if (MALFORMED_NUMBER_RE.test(text) && !isFieldAllowed(tool.id, label, "malformed-amount", fieldAllow)) {
        hits.push({ id: tool.id, field: label, rule: "malformed-amount" })
      }
      if (hasGluedWords(text) && !isFieldAllowed(tool.id, label, "glued-words", fieldAllow)) {
        hits.push({ id: tool.id, field: label, rule: "glued-words" })
      }
      if (
        PAID_TIER_ZERO_NEAR.test(text) &&
        !FREE_CTX.test(text) &&
        !isFieldAllowed(tool.id, label, "zero-eur-paid-tier", fieldAllow)
      ) {
        hits.push({ id: tool.id, field: label, rule: "zero-eur-paid-tier" })
      }

      const re = new RegExp(AMOUNT_RE.source, AMOUNT_RE.flags)
      let m
      while ((m = re.exec(text)) !== null) {
        const n = parseEurAmount(m[1])
        if (
          n != null &&
          n >= 1000 &&
          !HIGH_EUR_SKIP_NOTE_FIELDS.has(label)
        ) {
          const key = `${tool.id}:${Math.round(n)}`
          if (
            !highAllow[key] &&
            !isFieldAllowed(tool.id, label, "high-eur", fieldAllow)
          ) {
            hits.push({ id: tool.id, field: label, rule: "high-eur", amount: n })
          }
        }
      }
    }
  }
  hits.sort((a, b) => a.id.localeCompare(b.id) || a.rule.localeCompare(b.rule))
  return hits
}

const RULE_FIXTURES = [
  {
    rule: "malformed-amount",
    pass: ["Starter 18,01 €/mois."],
    fail: ["API at 0.007.23 € per credit."],
  },
  {
    rule: "glued-words",
    pass: ["Paid plans cost per seat."],
    fail: ["Starter costs and Team per user.", "Standard est à par mois."],
  },
  {
    rule: "zero-eur-paid-tier",
    pass: ["Free plan at 0 € forever.", "Pro plan listed with Free trial at 0 € for 7 days."],
    fail: ["Pro tier starts at 0 € per month for teams.", "Team plan at 0 € monthly billed annually."],
  },
  {
    rule: "high-eur",
    pass: ["Enterprise 952 €/an on request."],
    fail: ["Standard 1 500 €/mois without allowlist."],
  },
]

function runRuleFixtures() {
  const tests = {
    "malformed-amount": (s) => MALFORMED_NUMBER_RE.test(s),
    "glued-words": (s) => hasGluedWords(s),
    "zero-eur-paid-tier": (s) => PAID_TIER_ZERO_NEAR.test(s) && !FREE_CTX.test(s),
    "high-eur": (s) => /1[ \u00a0]?500\s*€/u.test(s),
  }
  const errors = []
  for (const { rule, pass, fail } of RULE_FIXTURES) {
    const fn = tests[rule]
    for (const s of pass) {
      if (fn(s)) errors.push(`pass failed ${rule}: ${s}`)
    }
    for (const s of fail) {
      if (!fn(s)) errors.push(`fail missed ${rule}: ${s}`)
    }
  }
  if (errors.length) {
    console.error("Rule fixtures failed:\n" + errors.join("\n"))
    process.exit(1)
  }
  console.log("Pricing amount sanity rule fixtures OK")
}

function main() {
  if (process.argv.includes("--test-rules")) {
    runRuleFixtures()
    return
  }
  const check = process.argv.includes("--check")
  const hits = scanPricingAmountSanity()
  const byRule = {}
  for (const h of hits) byRule[h.rule] = (byRule[h.rule] ?? 0) + 1
  console.log(`Pricing amount sanity: ${hits.length} hit(s)`, byRule)
  for (const h of hits.slice(0, 40)) {
    console.log(`  ${h.id}\t${h.rule}\t${h.field}${h.amount ? `\t${h.amount}` : ""}`)
  }
  if (check && hits.length) process.exit(1)
  if (check) console.log("\nPricing amount sanity check passed.")
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main()
}