#!/usr/bin/env node
/**
 * Post-CSV pass: exact ECB conversion (1 EUR = 1.1052 USD) on group C slugs only.
 * Converts official $ list prices → € at 2 decimals. Does not remap already-exact € figures.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { usdToEur } from "./lib/ecb-eur.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content", "tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")

const GROUP_C = ["cartesia", "kagi", "khanmigo", "typecast", "zed"]

/** [displayed integer € from CSV, official USD list price] */
const SLUG_USD_SOURCES = {
  cartesia: [
    [5, 5],
    [44, 49],
    [271, 299],
  ],
  kagi: [
    [5, 5],
    [9, 10],
    [23, 25],
  ],
  khanmigo: [
    [4, 4],
    [44, 44],
  ],
  typecast: [
    [5, 5],
    [49, 54],
  ],
  zed: [
    [9, 10],
    [5, 5],
    [27, 30],
  ],
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

function replaceCsvRoundedEuro(text, locale, slug) {
  if (!text || typeof text !== "string") return text
  let s = text
  const pairs = SLUG_USD_SOURCES[slug] || []
  for (const [wrongInt, usd] of pairs) {
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

export function localizeGroupCText(text, locale, slug = "") {
  let s = replaceUsdMarkers(text, locale)
  if (slug) s = replaceCsvRoundedEuro(s, locale, slug)
  return s
}

function visitorSlots(tool, overlay) {
  const slots = [
    { loc: "en", get: () => tool.description, set: (v) => (tool.description = v) },
    { loc: "en", get: () => tool.summary, set: (v) => (tool.summary = v) },
    { loc: "en", get: () => tool.pricing?.note, set: (v) => (tool.pricing.note = v) },
    { loc: "en", get: () => tool.pricing?.details, set: (v) => (tool.pricing.details = v) },
    {
      loc: "fr",
      get: () => overlay.description_fr ?? tool.description_fr,
      set: (v) => {
        if (overlay.description_fr != null) overlay.description_fr = v
        else tool.description_fr = v
      },
    },
    {
      loc: "fr",
      get: () => overlay.summary_fr ?? tool.summary_fr,
      set: (v) => {
        if (overlay.summary_fr != null) overlay.summary_fr = v
        else tool.summary_fr = v
      },
    },
    {
      loc: "fr",
      get: () => overlay.pricingNote_fr,
      set: (v) => {
        overlay.pricingNote_fr = v
      },
    },
  ]
  for (const key of ["features", "features_fr"]) {
    const useOverlay = key === "features_fr" && overlay.features_fr
    const arr = useOverlay ? overlay.features_fr : tool[key]
    if (!Array.isArray(arr)) continue
    arr.forEach((_, i) => {
      slots.push({
        loc: key === "features_fr" ? "fr" : "en",
        get: () => (useOverlay ? overlay.features_fr : tool.features)[i],
        set: (v) => {
          ;(useOverlay ? overlay.features_fr : tool.features)[i] = v
        },
      })
    })
  }
  const howEn = tool.howToUse
  if (Array.isArray(howEn)) {
    howEn.forEach((step, i) => {
      if (step?.title) {
        slots.push({
          loc: "en",
          get: () => step.title,
          set: (v) => {
            step.title = v
          },
        })
      }
      slots.push({
        loc: "en",
        get: () => step.description,
        set: (v) => {
          step.description = v
        },
      })
    })
  }
  const howFr = overlay.howToUse_fr ?? tool.howToUse_fr
  if (Array.isArray(howFr)) {
    howFr.forEach((step, i) => {
      const target = overlay.howToUse_fr?.[i] ?? tool.howToUse_fr?.[i]
      if (target?.title) {
        slots.push({
          loc: "fr",
          get: () => target.title,
          set: (v) => {
            target.title = v
          },
        })
      }
      slots.push({
        loc: "fr",
        get: () => target?.description,
        set: (v) => {
          if (target) target.description = v
        },
      })
    })
  }
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