#!/usr/bin/env node
/**
 * Post-CSV pass: exact ECB conversion (1 EUR = 1.1052 USD) on group C slugs only.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { usdToEur } from "./lib/ecb-eur.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content", "tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")

const GROUP_C = ["cartesia", "kagi", "khanmigo", "typecast", "zed"]

/** CSV integer € mistaken for USD → official USD list price */
const SLUG_USD_SOURCES = {
  cartesia: [[5, 5], [44, 49], [271, 299]],
  kagi: [[5, 5], [9, 10], [23, 25]],
  khanmigo: [[4, 4], [40, 44], [44, 44]],
  typecast: [[5, 5], [49, 54]],
  zed: [[9, 10], [5, 5], [27, 30]],
}

/** Prior bad ECB decimals still in visitor copy → correct USD source */
const SLUG_DECIMAL_FIX = {
  kagi: [
    [8.14, 10],
    [20.81, 25],
  ],
  zed: [
    [8.14, 10],
    [24.43, 30],
  ],
  typecast: [[44.34, 54]],
  khanmigo: [[40, 44]],
}

function formatEur(n, locale) {
  const s = n.toFixed(2)
  if (locale === "fr") return s.replace(".", ",")
  return s
}

function replaceUsdMarkers(text, locale) {
  if (!text || typeof text !== "string") return text
  return text.replace(/\$(\d{1,4}(?:\.\d{1,2})?)/g, (_, usd) => {
    const eur = usdToEur(Number(usd))
    if (eur == null) return `$${usd}`
    return `${formatEur(eur, locale)} €`
  })
}

function replaceIntegerEuro(text, locale, slug) {
  if (!text || typeof text !== "string") return text
  let s = text
  for (const [wrongInt, usd] of SLUG_USD_SOURCES[slug] || []) {
    const exact = usdToEur(usd)
    if (exact == null) continue
    const repl = formatEur(exact, locale)
    if (Math.abs(wrongInt - exact) < 0.005) continue
    const wrongFr = String(wrongInt).replace(".", ",")
    const patterns =
      locale === "fr"
        ? [
            new RegExp(`(?<![\\d,])${wrongFr}(?=\\s*€)`, "g"),
            new RegExp(`(?<![\\d.])${wrongInt}(?=\\s*€)`, "g"),
          ]
        : [new RegExp(`(?<![\\d.])${wrongInt}(?=\\s*€)`, "g")]
    for (const re of patterns) s = s.replace(re, repl)
  }
  return s
}

function replaceDecimalEuro(text, locale, slug) {
  if (!text || typeof text !== "string") return text
  let s = text
  for (const [wrong, usd] of SLUG_DECIMAL_FIX[slug] || []) {
    const exact = usdToEur(usd)
    if (exact == null) continue
    const repl = formatEur(exact, locale)
    const wrongFr = String(wrong).replace(".", ",")
    const patterns =
      locale === "fr"
        ? [
            new RegExp(`(?<![\\d,])${wrongFr.replace(".", ",")}(?=\\s*€)`, "g"),
            new RegExp(`(?<![\\d.,])${wrong}(?=\\s*€)`, "g"),
          ]
        : [new RegExp(`(?<![\\d.])${wrong}(?=\\s*€)`, "g")]
    for (const re of patterns) s = s.replace(re, repl)
  }
  return s
}

export function localizeGroupCText(text, locale, slug = "") {
  if (!text || typeof text !== "string") return text
  let s = replaceUsdMarkers(text, locale)
  if (slug) {
    s = replaceIntegerEuro(s, locale, slug)
    s = replaceDecimalEuro(s, locale, slug)
  }
  return s
}

function addStringSlot(slots, locale, get, set) {
  slots.push({ loc: locale, get, set })
}

function addFeatureSlots(slots, arr, locale, setter) {
  if (!Array.isArray(arr)) return
  arr.forEach((_, i) => {
    addStringSlot(
      slots,
      locale,
      () => arr[i],
      (v) => {
        arr[i] = v
        setter(arr)
      },
    )
  })
}

function addHowToSlots(slots, steps, locale) {
  if (!Array.isArray(steps)) return
  steps.forEach((step) => {
    if (!step) return
    if (typeof step.title === "string" && step.title.trim()) {
      addStringSlot(slots, locale, () => step.title, (v) => {
        step.title = v
      })
    }
    if (typeof step.description === "string" && step.description.trim()) {
      addStringSlot(slots, locale, () => step.description, (v) => {
        step.description = v
      })
    }
  })
}

function visitorSlots(tool, overlay) {
  const slots = []
  addStringSlot(slots, "en", () => tool.summary, (v) => (tool.summary = v))
  addStringSlot(slots, "en", () => tool.description, (v) => (tool.description = v))
  addStringSlot(slots, "en", () => tool.pricing?.note, (v) => (tool.pricing.note = v))
  addStringSlot(slots, "en", () => tool.pricing?.details, (v) => (tool.pricing.details = v))

  addStringSlot(slots, "fr", () => overlay.summary_fr, (v) => {
    overlay.summary_fr = v
  })
  addStringSlot(slots, "fr", () => overlay.description_fr, (v) => {
    overlay.description_fr = v
  })
  addStringSlot(slots, "fr", () => tool.summary_fr, (v) => {
    tool.summary_fr = v
  })
  addStringSlot(slots, "fr", () => tool.description_fr, (v) => {
    tool.description_fr = v
  })
  addStringSlot(slots, "fr", () => overlay.pricingNote_fr, (v) => {
    overlay.pricingNote_fr = v
  })

  addFeatureSlots(slots, tool.features, "en", (v) => (tool.features = v))
  addFeatureSlots(slots, tool.features_fr, "fr", (v) => (tool.features_fr = v))
  addFeatureSlots(slots, overlay.features_fr, "fr", (v) => {
    overlay.features_fr = v
  })

  addHowToSlots(slots, tool.howToUse, "en")
  addHowToSlots(slots, tool.howToUse_fr, "fr")
  addHowToSlots(slots, overlay.howToUse_fr, "fr")

  return slots
}

function main() {
  const dry = process.argv.includes("--check")
  const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
  let changed = false
  const report = {}

  for (const slug of GROUP_C) {
    const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, `${slug}.json`), "utf8"))
    fr[slug] ??= {}
    const overlay = fr[slug]
    const before = JSON.stringify({ tool, overlay })
    for (const slot of visitorSlots(tool, overlay)) {
      const cur = slot.get()
      if (typeof cur !== "string" || !cur.trim()) continue
      const next = localizeGroupCText(cur, slot.loc === "fr" ? "fr" : "en", slug)
      if (next !== cur) slot.set(next)
    }
    const after = JSON.stringify({ tool, overlay })
    if (after !== before) {
      changed = true
      report[slug] = true
      if (!dry) {
        fs.writeFileSync(path.join(toolsDir, `${slug}.json`), `${JSON.stringify(tool, null, 2)}\n`)
      }
    }
  }
  if (changed && !dry) fs.writeFileSync(frPath, `${JSON.stringify(fr, null, 2)}\n`)
  console.log(`Group C ECB: ${Object.keys(report).join(", ") || "no changes"}${dry ? " [check]" : ""}`)
  if (dry && changed) process.exit(1)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main()
}