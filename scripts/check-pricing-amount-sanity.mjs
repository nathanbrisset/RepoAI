#!/usr/bin/env node
/**
 * Sanity checks on pricing-related visitor copy (amounts, glued words).
 *
 *   node scripts/check-pricing-amount-sanity.mjs
 *   node scripts/check-pricing-amount-sanity.mjs --check
 *   node scripts/check-pricing-amount-sanity.mjs --test-rules
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content", "tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const csvPath = path.join(root, "data/imports/pricing-fr-2026-11-25.csv")

function loadContenuPricingSlugs() {
  const text = fs.readFileSync(csvPath, "utf8")
  const lines = text.trim().split(/\n/).slice(1)
  return new Set(lines.map((line) => line.split(",")[0]?.trim()).filter(Boolean))
}

/** EUR amounts ≥ 1000 that are legitimate list prices (slug, reason). */
const HIGH_EUR_ALLOW = new Map([
  ["kleos", "Enterprise annual list 45 241 €/an in Contenu note"],
  ["twenty", "Enterprise 45 241 €/an in Contenu note"],
  ["chatbase", "Business tier list price may exceed 1000 €/mo"],
  ["openhands", "Teams plan 452 €/mo"],
  ["botpress", "Plus 136 €/mo — check if amounts exceed threshold individually"],
])

/** Decimal prices mis-typed as 0.007.23 € (not version strings like v0.8.7). */
const MALFORMED_NUMBER_RE = /\b\d{1,4}\.\d{2,}\.\d{2,}\b|\b\d{1,4},\d{2,},\d{2,}\b/u
const GLUED_RE = /\b(costsper|isper|costsand|Teamper)\b/iu
const AMOUNT_RE = /(\d{1,3}(?:[ \u00a0]\d{3})*(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?)\s*€/giu

const PAID_TIER_BEFORE_ZERO =
  /\b(Pro|Plus|Premium|Business|Starter|Standard|Professional|Team|Individual|Enterprise|Creator|Ultra|Max)\b[^.]{0,80}?(?<![\d,])0\s*€/iu

const PRICING_AMOUNT_FIELDS = new Set([
  "pricing.note",
  "pricing.details",
  "pricingNote_fr",
])

/** Summary/description should not carry four-digit+ € unless allowlisted (notes may). */
const HIGH_EUR_SUMMARY_FIELDS = new Set(["description", "description_fr"])

/** « aucune adhésion 0 € » and similar negations are intentional. */
function isNegatedZeroEur(text) {
  return /\b(?:aucune?|sans|no\b|not\b|n['’]était|indiquée?|durable|listed)\b/i.test(text) && /0\s*€/.test(text)
}

function listedActive(tool) {
  const excluded = new Set(["duplicate-of", "sunset", "renamed", "inactive"])
  return tool.status === "active" && !excluded.has(tool.status)
}

function collectStrings(tool, overlay) {
  const out = []
  const push = (label, text) => {
    if (typeof text === "string" && text.trim()) out.push({ label, text })
  }
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
  const contenuSlugs = loadContenuPricingSlugs()
  const hits = []

  for (const file of fs.readdirSync(path.join(rootDir, "content/tools")).filter((n) => n.endsWith(".json"))) {
    const tool = JSON.parse(fs.readFileSync(path.join(rootDir, "content/tools", file), "utf8"))
    if (!listedActive(tool)) continue
    if (!contenuSlugs.has(tool.id)) continue
    if (tool.pricing?.uncertain === true) continue

    const overlay = frOverlay[tool.id]
    for (const { label, text } of collectStrings(tool, overlay)) {
      if (MALFORMED_NUMBER_RE.test(text)) {
        hits.push({ id: tool.id, field: label, rule: "malformed-amount" })
      }
      if (GLUED_RE.test(text)) {
        hits.push({ id: tool.id, field: label, rule: "glued-words" })
      }
      if (
        PAID_TIER_BEFORE_ZERO.test(text) &&
        !/\b(?:Free|Gratuit|gratuite?)\b/i.test(text) &&
        !isNegatedZeroEur(text)
      ) {
        hits.push({ id: tool.id, field: label, rule: "zero-eur-paid-tier" })
      }

      const re = new RegExp(AMOUNT_RE.source, AMOUNT_RE.flags)
      let m
      while ((m = re.exec(text)) !== null) {
        const n = parseEurAmount(m[1])
        if (n != null && n >= 1000 && HIGH_EUR_SUMMARY_FIELDS.has(label)) {
          const allowed = HIGH_EUR_ALLOW.get(tool.id)
          if (!allowed) hits.push({ id: tool.id, field: label, rule: "high-eur", amount: n })
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
    fail: ["Pro costsper month on annual billing."],
  },
  {
    rule: "zero-eur-paid-tier",
    pass: ["Free plan at 0 € forever."],
    fail: ["Pro tier starts at 0 € per month for teams."],
  },
  {
    rule: "high-eur",
    pass: ["Enterprise 952 €/an on request."],
    fail: ["Standard 1 500 €/mois without allowlist."],
  },
]

function runRuleFixtures() {
  const patterns = {
    "malformed-amount": MALFORMED_NUMBER_RE,
    "glued-words": GLUED_RE,
    "zero-eur-paid-tier": PAID_TIER_BEFORE_ZERO,
    "high-eur": /1[ \u00a0]?500\s*€/u,
  }
  const errors = []
  for (const { rule, pass, fail } of RULE_FIXTURES) {
    const pat = patterns[rule]
    if (!pat) continue
    for (const s of pass) {
      if (rule === "zero-eur-paid-tier") {
        if (pat.test(s) && !/\b(?:Free|Gratuit)\b/i.test(s)) errors.push(`pass failed ${rule}: ${s}`)
      } else if (rule === "high-eur") {
        if (pat.test(s)) errors.push(`pass failed ${rule}: ${s}`)
      } else if (pat.test(s)) errors.push(`pass failed ${rule}: ${s}`)
    }
    for (const s of fail) {
      if (!pat.test(s)) errors.push(`fail missed ${rule}: ${s}`)
    }
  }
  if (errors.length) {
    console.error("Rule fixtures failed:", errors.join("\n"))
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