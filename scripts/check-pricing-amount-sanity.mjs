#!/usr/bin/env node
/**
 * Sanity checks on pricing-related visitor copy (amounts, glued words).
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { parseEuroAmountToken } from "./lib/contenu-pricing-csv.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const allowPath = path.join(root, "scripts/prebuild/pricing-amount-sanity-allow.json")
const fieldAllowPath = path.join(root, "scripts/prebuild/pricing-amount-sanity-field-allow.json")

/** `${slug}:${field}:${normalizedAmountOrMarker}:${rule}` → reason (amount-level only; no sub-1000 high-eur). */
const DEFAULT_AMOUNT_EXEMPTIONS = {
  "kleos:pricingNote_fr:45241:high-eur": "Enterprise annual list in Contenu note",
  "twenty:pricingNote_fr:45241:high-eur": "Enterprise annual list in Contenu note",
  "amboss:pricingNote_fr:1085:high-eur": "Student Life list in Contenu note",
  "adside:features_fr[2]:2280:high-eur": "Managed tier list 2280 €/mo in note",
  "adside:features[2]:2280:high-eur": "Managed tier list 2280 €/mo in EN feature",
  "chat-with-work:features_fr[3]:1000:high-eur": "Personal annual tier 1000 €/an in note",
  "chat-with-work:features[3]:1000:high-eur": "Personal annual tier 1000 €/an in EN feature",
  "chat-with-work:features_fr[3]:2000:high-eur": "Personal annual tier 2000 €/an in note",
  "chat-with-work:features[3]:2000:high-eur": "Personal annual tier 2000 €/an in EN feature",
  "dippr:features_fr[1]:5473:high-eur": "Enterprise annual from 5473 €/an in note",
  "dippr:features[1]:5473:high-eur": "Enterprise annual from 5473 €/an in EN feature",
  "dippr:howToUse_fr[2]:5473:high-eur": "Enterprise annual from 5473 €/an in note",
  "dippr:howToUse[2]:5473:high-eur": "Enterprise annual from 5473 €/an in EN how-to",
  "finaloop:summary_fr:904814:high-eur": "Starter revenue threshold in note",
  "finaloop:description_fr:904814:high-eur": "Starter revenue threshold in note",
  "finaloop:howToUse_fr[2]:904814:high-eur": "Starter revenue threshold in how-to step",
  "finaloop:howToUse[2]:904814:high-eur": "Starter revenue threshold in EN how-to",
  "finaloop:howToUse[2].title:904814:high-eur": "Starter revenue threshold in EN how-to title",
  "manufact:features_fr[1]:2736:high-eur": "Pro annual 2736 €/an in note",
  "manufact:features[1]:2736:high-eur": "Pro annual 2736 €/an in EN feature",
  "gitguardian:features_fr[2]:0:zero-eur-starter": "Official free Starter 0 €",
  "gitguardian:howToUse_fr[0]:0:zero-eur-starter": "Official free Starter 0 €",
  "presentations-ai:features[2]:0:zero-eur-starter": "Official free Starter 0 €",
  "presentations-ai:features_fr[2]:0:zero-eur-starter": "Official free Starter 0 €",
  "presentations-ai:howToUse[0]:0:zero-eur-starter": "Official free Starter 0 €",
}

const HIGH_EUR_SKIP_NOTE_FIELDS = new Set([
  "pricing.note",
  "pricing.details",
  "pricingNote_fr",
])

const AMOUNT_RE =
  /(\d{1,3}(?:[ \u00a0]\d{3})*(?:[.,]\d{1,2})?|\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?|\d+(?:[.,]\d{1,2})?)\s*€/giu

const MALFORMED_DOT_AMOUNT_RE = /\b\d+\.\d+\.\d+\b/u
const MALFORMED_FR_COMMA_AMOUNT_RE = /\b0,\d{3},\d{2,}\s*€/u

/** US-style thousands comma in FR copy (e.g. 1,109 €), not valid FR decimals (18,01 €). */
const COMMA_THOUSANDS_EUR_RE = /(?:^|[^\d])[1-9]\d?,\d{3}\s*€/gu

const FR_VISITOR_FIELDS = /(?:^|\.)(?:summary_fr|description_fr|pricingNote_fr|features_fr|howToUse_fr)/u

const GLEDED_TOKEN_RE =
  /\b(?:costsper|isper|areper|estper|estpar|costsand|isand|areand|atper|àper)\b/iu

const VERB_HOLE_RE =
  /\b(?:costs|co[uû]te)\s+and\s+(?:Team|per|par|user|month|seat)\b|\best\s+and\b|\best\s+à\s+par\b|\b(?:à|at)\s+(?:per|par)\s+(?:mo|mois|month)\b/iu

const PAID_TIER_WORDS =
  "Pro|Plus|Premium|Business|Starter|Standard|Professional|Team|Individual|Enterprise|Creator|Ultra|Max"
const PAID_TIER_ZERO_NEAR = new RegExp(
  `\\b(?:${PAID_TIER_WORDS})\\b(?:\\s+\\S+){0,4}\\s+(?:starts?\\s+at|from|dès|à|at|for|costs?|co[uû]te?)\\s+0\\s*€`,
  "iu",
)
const PAID_PLANS_ZERO_RE = /\bpaid\s+plans?\s+start(?:s|ing)?\s+(?:at|with)\s+0\s*€/iu
const STARTER_COSTS_ZERO_RE = /\bStarter\b\s+costs?\s+0\s*€/iu

const FREE_TIER_ZERO_CTX =
  /\b(?:Free|Gratuit|gratuite?)\b[^.]{0,40}\b0\s*€|\b0\s*€[^.]{0,40}(?:forever|pour toujours|durable|permanent)\b/i
const TRIAL_ZERO_AFTER = /\b0\s*€[^.]{0,72}\bafter the trial\b/i
const OFFICIAL_STARTER_ZERO = /\bStarter\b[^.]{0,48}\b(?:at\s+)?0\s*€/iu
const OFFICIAL_USAGE_START_ZERO =
  /\b(?:officially|officiellement)\s+(?:starting|à partir)\s+(?:at\s+)?0\s*€/iu
const ZERO_EUR_PAID_TIER_SKIP_FIELDS = new Set([
  "pricing.note",
  "pricing.details",
  "pricingNote_fr",
])

function listedActive(tool) {
  const excluded = new Set(["duplicate-of", "sunset", "renamed", "inactive"])
  return tool.status === "active" && !excluded.has(tool.status)
}

function loadAmountExemptions() {
  if (!fs.existsSync(allowPath)) return { ...DEFAULT_AMOUNT_EXEMPTIONS }
  const extra = JSON.parse(fs.readFileSync(allowPath, "utf8"))
  return { ...DEFAULT_AMOUNT_EXEMPTIONS, ...extra }
}

function loadFieldAllow() {
  if (!fs.existsSync(fieldAllowPath)) return { expires: "2026-12-15", entries: [] }
  const raw = fs.readFileSync(fieldAllowPath, "utf8").trim()
  if (!raw) return { expires: "2026-12-15", entries: [] }
  return JSON.parse(raw)
}

function isFieldAllowed(id, field, rule, fieldAllow) {
  return fieldAllow.entries?.some((e) => e.id === id && e.field === field && e.rule === rule)
}

function exemptionKey(id, field, amount, rule) {
  const norm =
    rule === "glued-words" ||
    rule === "malformed-amount" ||
    rule === "comma-thousands-eur" ||
    rule === "paid-plans-zero" ||
    rule === "starter-costs-zero"
      ? String(amount)
      : String(Math.round(amount))
  return `${id}:${field}:${norm}:${rule}`
}

function isExempt(exemptions, id, field, amount, rule) {
  return Boolean(exemptions[exemptionKey(id, field, amount, rule)])
}

export function hasGluedWords(text) {
  if (!text || typeof text !== "string") return false
  return GLEDED_TOKEN_RE.test(text) || VERB_HOLE_RE.test(text)
}

export function hasMalformedAmount(text) {
  if (!text || typeof text !== "string") return false
  return MALFORMED_DOT_AMOUNT_RE.test(text) || MALFORMED_FR_COMMA_AMOUNT_RE.test(text)
}

export function hasCommaThousandsEur(text) {
  if (!text || typeof text !== "string") return false
  return COMMA_THOUSANDS_EUR_RE.test(text)
}

export function hasPaidPlansStartAtZero(text) {
  if (!text || typeof text !== "string") return false
  return PAID_PLANS_ZERO_RE.test(text)
}

export function hasStarterCostsZero(text) {
  if (!text || typeof text !== "string") return false
  return STARTER_COSTS_ZERO_RE.test(text)
}

export function hasZeroEurPaidTier(text) {
  if (!text || typeof text !== "string") return false
  if (!/\b0\s*€/u.test(text)) return false
  if (OFFICIAL_STARTER_ZERO.test(text) && !STARTER_COSTS_ZERO_RE.test(text)) return false
  if (FREE_TIER_ZERO_CTX.test(text)) return false
  if (OFFICIAL_USAGE_START_ZERO.test(text)) return false
  if (TRIAL_ZERO_AFTER.test(text)) return true
  return PAID_TIER_ZERO_NEAR.test(text)
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
  if (Array.isArray(tool.features_fr)) {
    tool.features_fr.forEach((t, i) => push(`features_fr[${i}]`, t))
  }
  if (Array.isArray(overlay?.features_fr)) {
    overlay.features_fr.forEach((t, i) => push(`features_fr[${i}]`, t))
  }
  const addHowTo = (steps, fr) => {
    if (!Array.isArray(steps)) return
    steps.forEach((s, i) => {
      const prefix = fr ? "howToUse_fr" : "howToUse"
      push(`${prefix}[${i}].title`, s?.title)
      push(`${prefix}[${i}]`, s?.description)
    })
  }
  addHowTo(tool.howToUse, false)
  addHowTo(tool.howToUse_fr, true)
  addHowTo(overlay?.howToUse_fr, true)
  return out
}

export function scanPricingAmountSanity({ rootDir = root } = {}) {
  const frOverlay = JSON.parse(fs.readFileSync(path.join(rootDir, "content/i18n/fr-tools.json"), "utf8"))
  const exemptions = loadAmountExemptions()
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
      if (
        hasMalformedAmount(text) &&
        !isFieldAllowed(tool.id, label, "malformed-amount", fieldAllow) &&
        !isExempt(exemptions, tool.id, label, "malformed", "malformed-amount")
      ) {
        hits.push({ id: tool.id, field: label, rule: "malformed-amount" })
      }
      if (
        FR_VISITOR_FIELDS.test(label) &&
        hasCommaThousandsEur(text) &&
        !isFieldAllowed(tool.id, label, "comma-thousands-eur", fieldAllow) &&
        !isExempt(exemptions, tool.id, label, "comma-thousands", "comma-thousands-eur")
      ) {
        hits.push({ id: tool.id, field: label, rule: "comma-thousands-eur" })
      }
      if (
        hasGluedWords(text) &&
        !isFieldAllowed(tool.id, label, "glued-words", fieldAllow) &&
        !isExempt(exemptions, tool.id, label, "glued", "glued-words")
      ) {
        hits.push({ id: tool.id, field: label, rule: "glued-words" })
      }
      if (
        hasPaidPlansStartAtZero(text) &&
        !isFieldAllowed(tool.id, label, "paid-plans-zero", fieldAllow) &&
        !isExempt(exemptions, tool.id, label, "paid-plans", "paid-plans-zero")
      ) {
        hits.push({ id: tool.id, field: label, rule: "paid-plans-zero" })
      }
      if (
        hasStarterCostsZero(text) &&
        !isFieldAllowed(tool.id, label, "starter-costs-zero", fieldAllow) &&
        !isExempt(exemptions, tool.id, label, "starter-costs", "starter-costs-zero")
      ) {
        hits.push({ id: tool.id, field: label, rule: "starter-costs-zero" })
      }
      if (
        !ZERO_EUR_PAID_TIER_SKIP_FIELDS.has(label) &&
        hasZeroEurPaidTier(text) &&
        !isFieldAllowed(tool.id, label, "zero-eur-paid-tier", fieldAllow) &&
        !isExempt(exemptions, tool.id, label, 0, "zero-eur-starter") &&
        !isExempt(exemptions, tool.id, label, 0, "zero-eur-paid-tier")
      ) {
        const marker = text.includes("Starter") && !STARTER_COSTS_ZERO_RE.test(text) ? "zero-eur-starter" : "zero-eur-paid-tier"
        hits.push({ id: tool.id, field: label, rule: marker })
      }

      const re = new RegExp(AMOUNT_RE.source, AMOUNT_RE.flags)
      let m
      while ((m = re.exec(text)) !== null) {
        const n = parseEuroAmountToken(m[1])
        if (n != null && n >= 1000 && !HIGH_EUR_SKIP_NOTE_FIELDS.has(label)) {
          if (
            !isFieldAllowed(tool.id, label, "high-eur", fieldAllow) &&
            !isExempt(exemptions, tool.id, label, n, "high-eur")
          ) {
            hits.push({ id: tool.id, field: label, rule: "high-eur", amount: n })
          }
        }
      }
    }
  }
  const seen = new Set()
  const deduped = []
  for (const h of hits) {
    const key = `${h.id}\t${h.field}\t${h.rule}\t${h.amount ?? ""}`
    if (seen.has(key)) continue
    seen.add(key)
    deduped.push(h)
  }
  deduped.sort((a, b) => a.id.localeCompare(b.id) || a.rule.localeCompare(b.rule))
  return deduped
}

const RULE_FIXTURES = [
  {
    rule: "malformed-amount",
    pass: ["Starter 18,01 €/mois.", "Enterprise up to 4 524 068 € in funding.", "Team 1 320 000 credits/year."],
    fail: ["API at 0.007.23 € per credit.", "Tarif 0,007,23 € par crédit."],
  },
  {
    rule: "comma-thousands-eur",
    pass: ["Enterprise 1 109 €/an.", "Pro 18,01 €/mois."],
    fail: ["Team tier from 1,109 € per month."],
  },
  {
    rule: "glued-words",
    pass: ["Paid plans cost per seat.", "Fleet has pricing and session controls.", "Le forfait est à 9 € par mois."],
    fail: [
      "Starter costsper month.",
      "Standard isper user.",
      "Starter costs and Team per user.",
      "Standard est à par mois.",
    ],
  },
  {
    rule: "paid-plans-zero",
    pass: ["paid plans start with Pro at 9 €."],
    fail: ["paid plans start at 0 € after trial.", "Paid plans start at 0 € for teams."],
  },
  {
    rule: "starter-costs-zero",
    pass: ["Starter at 0 € with 200 credits.", "Free plan at 0 € forever."],
    fail: ["Starter costs 0 € per month.", "Starter costs 0 € for teams."],
  },
  {
    rule: "zero-eur-paid-tier",
    pass: ["Pro plan listed with Free trial at 0 € for 7 days."],
    fail: ["Pro tier starts at 0 € per month for teams.", "Team plan at 0 € monthly billed annually."],
  },
]

function runRuleFixtures() {
  const tests = {
    "malformed-amount": hasMalformedAmount,
    "comma-thousands-eur": hasCommaThousandsEur,
    "glued-words": hasGluedWords,
    "paid-plans-zero": hasPaidPlansStartAtZero,
    "starter-costs-zero": hasStarterCostsZero,
    "zero-eur-paid-tier": hasZeroEurPaidTier,
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