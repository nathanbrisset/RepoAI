#!/usr/bin/env node
/**
 * Sanity checks on pricing-related visitor copy (amounts, glued words).
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const allowPath = path.join(root, "scripts/prebuild/pricing-amount-sanity-allow.json")

/** `${slug}:${field}:${normalizedAmountOrMarker}:${rule}` → reason */
const DEFAULT_AMOUNT_EXEMPTIONS = {
  "kleos:pricingNote_fr:45241:high-eur": "Enterprise annual list in Contenu note",
  "twenty:pricingNote_fr:45241:high-eur": "Enterprise annual list in Contenu note",
  "chatbase:pricingNote_fr:452:high-eur": "Business 452 €/mo in pricing note",
  "chatbase:pricingNote_fr:136:high-eur": "Standard 136 €/mo in pricing note",
  "openhands:pricingNote_fr:452:high-eur": "Teams 452 €/mo in note",
  "amboss:pricingNote_fr:1085:high-eur": "Student Life list in Contenu note",
  "wren-ai:pricingNote_fr:723:high-eur": "Enterprise monthly list in Contenu note",
  "wren-ai:pricingNote_fr:506:high-eur": "Enterprise annual monthly-equiv in Contenu note",
  "adside:features_fr[2]:2280:high-eur": "Managed tier list 2280 €/mo in note",
  "chat-with-work:features_fr[3]:1000:high-eur": "Personal annual tier 1000 €/an in note",
  "chat-with-work:features_fr[3]:2000:high-eur": "Personal annual tier 2000 €/an in note",
  "dippr:features_fr[1]:5473:high-eur": "Enterprise annual from 5473 €/an in note",
  "dippr:howToUse_fr[2]:5473:high-eur": "Enterprise annual from 5473 €/an in note",
  "finaloop:summary_fr:904814:high-eur": "Starter revenue threshold in note",
  "finaloop:description_fr:904814:high-eur": "Starter revenue threshold in note",
  "finaloop:howToUse_fr[2]:904814:high-eur": "Starter revenue threshold in how-to step",
  "manufact:features_fr[1]:2736:high-eur": "Pro annual 2736 €/an in note",
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

const AMOUNT_RE = /(\d{1,3}(?:[ \u00a0]\d{3})*(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?)\s*€/giu

const PAID_TIER_WORDS =
  "Pro|Plus|Premium|Business|Starter|Standard|Professional|Team|Individual|Enterprise|Creator|Ultra|Max"
const PAID_TIER_ZERO_NEAR = new RegExp(
  `\\b(?!Starter\\b)(?:${PAID_TIER_WORDS})\\b(?:\\s+\\S+){0,4}\\s+(?:starts?\\s+at|from|dès|co[uû]te?|costs?)\\s+0\\s*€`,
  "iu",
)
const ZERO_EUR_SKIP_FIELDS = new Set(["pricing.note", "pricing.details", "pricingNote_fr"])
const FREE_TIER_ZERO_CTX =
  /\b(?:Free|Gratuit|gratuite?)\b[^.]{0,40}\b0\s*€|\b0\s*€[^.]{0,40}(?:forever|pour toujours|durable|permanent)\b/i
const TRIAL_ZERO_AFTER = /\b0\s*€[^.]{0,72}\bafter the trial\b/i

const MALFORMED_TWO_DOTS = /\b\d+\.\d+\.\d+\b/

function listedActive(tool) {
  const excluded = new Set(["duplicate-of", "sunset", "renamed", "inactive"])
  return tool.status === "active" && !excluded.has(tool.status)
}

function loadAmountExemptions() {
  if (!fs.existsSync(allowPath)) return { ...DEFAULT_AMOUNT_EXEMPTIONS }
  const extra = JSON.parse(fs.readFileSync(allowPath, "utf8"))
  return { ...DEFAULT_AMOUNT_EXEMPTIONS, ...extra }
}

function exemptionKey(id, field, amount, rule) {
  const norm =
    rule === "glued-words" || rule === "malformed-amount"
      ? String(amount)
      : String(Math.round(amount))
  return `${id}:${field}:${norm}:${rule}`
}

function isExempt(exemptions, id, field, amount, rule) {
  return Boolean(exemptions[exemptionKey(id, field, amount, rule)])
}

/** Concatenated tokens such as costsper / isper (no space). */
export function hasGluedWords(text) {
  if (!text || typeof text !== "string") return false
  return /\b(?:costsper|isper|areper|estper|estpar|costsand|isand|areand|atper|àper)\b/iu.test(text)
}

export function hasMalformedAmount(text) {
  if (!text || typeof text !== "string") return false
  return MALFORMED_TWO_DOTS.test(text)
}

export function hasZeroEurPaidTier(text) {
  if (!text || typeof text !== "string") return false
  if (!/\b0\s*€/u.test(text)) return false
  if (/\bStarter\b[^.]{0,48}\b(?:at\s+)?0\s*€/iu.test(text)) return false
  if (FREE_TIER_ZERO_CTX.test(text)) return false
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
  const addHowTo = (steps, label, fr) => {
    if (!Array.isArray(steps)) return
    steps.forEach((s, i) => {
      const prefix = fr ? "howToUse_fr" : "howToUse"
      push(`${prefix}[${i}].title`, s?.title)
      push(`${prefix}[${i}]`, s?.description)
    })
  }
  addHowTo(tool.howToUse, "howToUse", false)
  addHowTo(tool.howToUse_fr, "howToUse_fr", true)
  addHowTo(overlay?.howToUse_fr, "howToUse_fr", true)
  return out
}

function parseEurAmount(raw) {
  const cleaned = raw.replace(/[ \u00a0]/g, "").replace(",", ".")
  const n = Number.parseFloat(cleaned)
  return Number.isNaN(n) ? null : n
}

export function scanPricingAmountSanity({ rootDir = root } = {}) {
  const frOverlay = JSON.parse(fs.readFileSync(path.join(rootDir, "content/i18n/fr-tools.json"), "utf8"))
  const exemptions = loadAmountExemptions()
  const hits = []

  for (const file of fs.readdirSync(path.join(rootDir, "content/tools")).filter((n) => n.endsWith(".json"))) {
    const tool = JSON.parse(fs.readFileSync(path.join(rootDir, "content/tools", file), "utf8"))
    if (!listedActive(tool)) continue

    const overlay = frOverlay[tool.id]
    for (const { label, text } of collectStrings(tool, overlay)) {
      if (hasMalformedAmount(text) && !isExempt(exemptions, tool.id, label, "malformed", "malformed-amount")) {
        hits.push({ id: tool.id, field: label, rule: "malformed-amount" })
      }
      if (hasGluedWords(text) && !isExempt(exemptions, tool.id, label, "glued", "glued-words")) {
        hits.push({ id: tool.id, field: label, rule: "glued-words" })
      }
      if (!ZERO_EUR_SKIP_FIELDS.has(label) && hasZeroEurPaidTier(text)) {
        const marker = text.includes("Starter") ? "zero-eur-starter" : "zero-eur-paid-tier"
        if (!isExempt(exemptions, tool.id, label, 0, marker) && !isExempt(exemptions, tool.id, label, 0, "zero-eur-paid-tier")) {
          hits.push({ id: tool.id, field: label, rule: marker })
        }
      }

      const re = new RegExp(AMOUNT_RE.source, AMOUNT_RE.flags)
      let m
      while ((m = re.exec(text)) !== null) {
        const n = parseEurAmount(m[1])
        if (n != null && n >= 1000 && !HIGH_EUR_SKIP_NOTE_FIELDS.has(label)) {
          if (!isExempt(exemptions, tool.id, label, n, "high-eur")) {
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
    pass: ["Starter 18,01 €/mois.", "Enterprise up to 4,524,068 € in funding.", "Team 1,320,000 credits/year."],
    fail: ["API at 0.007.23 € per credit."],
  },
  {
    rule: "glued-words",
    pass: ["Paid plans cost per seat.", "Fleet has cost and session controls."],
    fail: ["Starter costsper month.", "Standard isper user."],
  },
  {
    rule: "zero-eur-paid-tier",
    pass: ["Starter at 0 € with 200 credits.", "Free plan at 0 € forever."],
    fail: ["Pro costs 0 € per month.", "Ultra tier starts at 0 € monthly billed annually."],
  },
]

function runRuleFixtures() {
  const tests = {
    "malformed-amount": hasMalformedAmount,
    "glued-words": hasGluedWords,
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