#!/usr/bin/env node
/**
 * Post-CSV pass: exact ECB conversion (1 EUR = 1.1052 USD) on group C slugs only.
 * Touches pricing notes + visitor copy; never converts amounts already in € (except $→€ map).
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { usdToEur } from "./lib/ecb-eur.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content", "tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")

const GROUP_C = ["cartesia", "kagi", "khanmigo", "typecast", "zed"]

/** Rounded € figures that stand in for common USD list prices. */
const ROUNDED_TO_EXACT = new Map([
  [5, 4.52],
  [4, 3.62],
  [10, 9.05],
  [30, 27.14],
  [49, 44.34],
  [54, 48.86],
  [44, 39.81],
  [9, 8.14],
  [27, 24.43],
  [23, 20.81],
  [71, 64.24],
])

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

function replaceRoundedEuro(text, locale) {
  if (!text || typeof text !== "string") return text
  let s = text
  for (const [wrong, exact] of ROUNDED_TO_EXACT) {
    const repl = formatEur(exact, locale)
    const wrongFr = String(wrong).replace(".", ",")
    const patterns =
      locale === "fr"
        ? [
            new RegExp(`(?<![\\d,])${wrongFr}(?=\\s*€)`, "g"),
            new RegExp(`(?<![\\d.])${wrong}(?=\\s*€)`, "g"),
          ]
        : [new RegExp(`(?<![\\d.])${wrong}(?=\\s*€)`, "g")]
    for (const re of patterns) s = s.replace(re, repl)
  }
  return s
}

export function localizeGroupCText(text, locale) {
  return replaceRoundedEuro(replaceUsdMarkers(text, locale), locale)
}

function visitorSlots(tool, overlay) {
  const slots = [
    { loc: "en", get: () => tool.description, set: (v) => (tool.description = v) },
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
      const next = localizeGroupCText(cur, slot.loc === "fr" ? "fr" : "en")
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