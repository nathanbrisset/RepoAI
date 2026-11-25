#!/usr/bin/env node
/**
 * QA injection strings — must fail on baseline and tip.
 *
 *   node scripts/run-guard-injections.mjs
 */
import { enMarkersInFr, scanFrPricingQuality } from "./check-fr-pricing-quality.mjs"
import { scanPricingAmountSanity } from "./check-pricing-amount-sanity.mjs"

const injections = [
  {
    guard: 54,
    slug: "fake-non-csv",
    text: "Team plan billed monthly with annual commitment",
    expect: () => enMarkersInFr("Team plan billed monthly with annual commitment", "not-in-csv"),
  },
  {
    guard: 58,
    slug: "fake",
    text: "Starter costs and Team per user.",
    expect: () => /\b(costs?|is|are|est(?:\s+à)?)\s+(and|per|par)\b/i.test("Starter costs and Team per user."),
  },
  {
    guard: 58,
    slug: "fake",
    text: "Pro tier starts at 0 € per month",
    expect: () =>
      /\bPro\b(?:\s+\S+){0,3}\s+(?:starts?\s+at|from|dès|à|at|for)\s+0\s*€/i.test("Pro tier starts at 0 € per month"),
  },
]

let failed = 0
for (const inj of injections) {
  const ok = inj.expect()
  if (!ok) {
    console.error(`INJECTION MISSED guard ${inj.guard}: ${inj.text}`)
    failed++
  } else {
    console.log(`guard ${inj.guard} caught: ${inj.text.slice(0, 60)}...`)
  }
}

const live54 = scanFrPricingQuality().find((v) => v.id === "knowt")
if (live54) console.log("knowt live violations (expected 0 after fixes):", live54.reasons)

if (failed) process.exit(1)
console.log("Guard injections OK")