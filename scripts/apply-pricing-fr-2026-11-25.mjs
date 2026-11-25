#!/usr/bin/env node
/**
 * Apply Contenu CSV (pricing-fr-2026-11-25) to tools + fr-tools overlay.
 *
 *   node scripts/apply-pricing-fr-2026-11-25.mjs
 *   node scripts/apply-pricing-fr-2026-11-25.mjs --check
 *   node scripts/apply-pricing-fr-2026-11-25.mjs --report
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { EUR_PER_USD, usdToEur } from "./lib/ecb-eur.mjs"
import {
  collectTexts,
  pricingFieldPairs,
  scanFrEnPriceParity,
} from "./check-fr-en-price-parity.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const defaultCsv = path.join(root, "data/imports/pricing-fr-2026-11-25.csv")
const toolsDir = path.join(root, "content", "tools")
const frPath = path.join(root, "content/i18n/fr-tools.json")

const MASQUE_SLUGS = new Set([
  "codepal",
  "graphite",
  "hedra",
  "heidi-health",
  "higgsfield",
  "soundful",
])

const GROUP_C_ECB = new Set(["cartesia", "kagi", "khanmigo", "typecast", "zed"])

const GOOGLE_PRICE_SLUGS = new Set(["gemini", "jules", "notebooklm"])

/** Stale Google AI list prices → official EUR (Contenu CSV). */
const GOOGLE_PRICE_MAP = [
  { wrong: 5, en: "4.99", fr: "4,99" },
  { wrong: 18, en: "21.99", fr: "21,99" },
  { wrong: 90, en: "99.99", fr: "99,99" },
]
const GOOGLE_ULTRA_20X = { wrong: 90, en: "219.99", fr: "219,99" }

const AMOUNT_RE =
  /(?:^|[^\d])(\d{1,4}(?:[.,]\d{1,2})?)\s*(?:€|EUR\b|\$|USD\b)/giu

const GUARD_COPY_RES = [
  {
    id: "annual-not-restated-en",
    re: /[;.]\s*the yearly amount is not restated here\.?/gi,
    replace: "",
  },
  {
    id: "annual-not-restated-fr",
    re: /[;.]\s*le montant annuel n['’]est pas repris ici\.?/gi,
    replace: "",
  },
  {
    id: "annual-billing-not-restated-en",
    re: /;\s*the yearly amount is not restated here\.?/gi,
    replace: "",
  },
  {
    id: "yearly-not-recorded-en",
    re: /\s*;\s*the yearly amount is not recorded here\.?/gi,
    replace: "",
  },
  {
    id: "yearly-not-recorded-fr",
    re: /\s*;\s*le montant annuel n['’]est pas repris ici\.?/gi,
    replace: "",
  },
]

const AI_FLOOR_PLAN_FR =
  /Une option annuelle affichée à −40 % est proposée\s*;\s*le montant annuel n['’]est pas repris ici\./u
const AI_FLOOR_PLAN_FR_OK = "Une option annuelle à −40 % est proposée."

const EXPLAINPAPER_FR =
  /Une facturation annuelle avec 25 % de réduction est proposée\s*;\s*le montant annuel n['’]est pas repris ici\./u
const EXPLAINPAPER_FR_OK =
  "Une facturation annuelle avec 25 % de réduction est proposée."

function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ""
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"'
          i++
        } else quoted = false
      } else cell += c
    } else if (c === '"') quoted = true
    else if (c === ",") {
      row.push(cell)
      cell = ""
    } else if (c === "\n") {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ""
    } else if (c !== "\r") cell += c
  }
  if (cell.length || row.length) {
    row.push(cell)
    rows.push(row)
  }
  const headers = rows[0]
  return rows
    .slice(1)
    .filter((r) => r.some((value) => value && value.trim()))
    .map((r) => Object.fromEntries(headers.map((header, index) => [header, r[index] ?? ""])))
}

function stableJson(obj) {
  return `${JSON.stringify(obj, null, 2)}\n`
}

function readTool(slug) {
  const p = path.join(toolsDir, `${slug}.json`)
  if (!fs.existsSync(p)) return null
  return JSON.parse(fs.readFileSync(p, "utf8"))
}

function writeTool(slug, tool, dry) {
  const p = path.join(toolsDir, `${slug}.json`)
  const next = stableJson(tool)
  const prev = fs.existsSync(p) ? fs.readFileSync(p, "utf8") : ""
  if (next !== prev) {
    if (!dry) fs.writeFileSync(p, next)
    return true
  }
  return false
}

function extractAmounts(text) {
  if (!text || typeof text !== "string") return []
  const out = []
  let m
  const re = new RegExp(AMOUNT_RE.source, AMOUNT_RE.flags)
  while ((m = re.exec(text)) !== null) {
    const raw = m[1].replace(",", ".")
    const n = Number.parseFloat(raw)
    if (!Number.isNaN(n)) out.push(n)
  }
  return out
}

function amountsCompatible(enAmounts, frAmounts) {
  const en = [...new Set(enAmounts)].sort((a, b) => a - b)
  let fr = [...new Set(frAmounts)].sort((a, b) => a - b)
  if (!en.includes(0) && fr.includes(0)) fr = fr.filter((n) => n !== 0)
  return JSON.stringify(en) === JSON.stringify(fr)
}

function formatEur(n, locale) {
  if (locale === "fr") {
    const s = n.toFixed(2).replace(".", ",")
    return s.replace(/,00$/, "").replace(/(\d),(\d)0$/, "$1,$2")
  }
  const s = n.toFixed(2)
  return s.replace(/\.00$/, "").replace(/(\d)\.(\d)0$/, "$1.$2")
}

function localizeFrPricingNote(text) {
  if (!text) return text
  let s = text
  s = s.replace(/\bIndividual\b/g, "Individuel")
  s = s.replace(/\bProfessional\b/g, "Professionnel")
  s = s.replace(/\bBasic\b/g, "Basique")
  s = s.replace(/\bBusiness\b/g, "Business")
  s = s.replace(/\bFree\b/g, "Gratuit")
  s = s.replace(/\bEnterprise\b/g, "Entreprise")
  s = s.replace(/\bPlus\b/g, "Plus")
  s = s.replace(/\bPro\b/g, "Pro")
  s = s.replace(/\bStarter\b/g, "Starter")
  s = s.replace(/\(un plan\)/gi, "(une génération)")
  s = s.replace(/\bplan payant\b/gi, "offre payante")
  s = s.replace(/\bplans payants\b/gi, "offres payantes")
  s = s.replace(/\bplans automatiques\b/gi, "aperçus automatiques")
  s = s.replace(/(\d[\d\s]*)\s+plans\b/giu, "$1 formules")
  s = s.replace(/\bplans\b/gi, "formules")
  s = s.replace(/\bplan\b/gi, "formule")
  s = s.replace(/\bbilled\b/gi, "facturé")
  s = s.replace(/\bAnnual\b/g, "annuel")
  s = s.replace(/\bannual\b/gi, "annuel")
  s = s.replace(/\bCredits\b/g, "crédits")
  s = s.replace(/\btrial\b/gi, "essai")
  s = s.replace(/\bcredits\b/gi, "crédits")
  s = s.replace(/\bper month\b/gi, "par mois")
  s = s.replace(/\/mo\b/gi, "/mois")
  s = s.replace(/\/user\b/gi, "/utilisateur")
  s = s.replace(/\/hr\b/gi, "/h")
  return s.replace(/\s{2,}/g, " ").trim()
}

function replaceGuardCopy(text, slug, copyRewrites) {
  if (!text || typeof text !== "string") return text
  let s = text
  if (slug === "ai-floor-plan") {
    if (AI_FLOOR_PLAN_FR.test(s)) {
      s = s.replace(AI_FLOOR_PLAN_FR, AI_FLOOR_PLAN_FR_OK)
      copyRewrites.push({ slug, field: "note-fr", rule: "ai-floor-plan-annual" })
    }
    s = s.replace(
      /A yearly option advertised as 40% off is offered;\s*the yearly amount is not restated here\./i,
      "A yearly option advertised as 40% off is offered.",
    )
  }
  if (slug === "explainpaper") {
    if (EXPLAINPAPER_FR.test(s)) {
      s = s.replace(EXPLAINPAPER_FR, EXPLAINPAPER_FR_OK)
      copyRewrites.push({ slug, field: "note-fr", rule: "explainpaper-annual" })
    }
    s = s.replace(
      /A yearly billing option with a 25% saving is offered;\s*the yearly amount is not restated here\./i,
      "A yearly billing option with a 25% saving is offered.",
    )
  }
  for (const { id, re, replace } of GUARD_COPY_RES) {
    if (re.test(s)) {
      copyRewrites.push({ slug, rule: id })
      s = s.replace(re, replace)
    }
    re.lastIndex = 0
  }
  s = s.replace(/\s{2,}/g, " ").replace(/\s+([;,.])/g, "$1").trim()
  return s
}

function stripMoneyAmounts(text) {
  if (!text || typeof text !== "string") return text
  let s = text
  s = s.replace(
    /\(?\s*\d{1,4}(?:[.,]\d{1,2})?\s*(?:€|EUR|\$|USD)\s*(?:\/\s*(?:mo|month|mois|user|seat|siège|an|year|yr|hour|h))?\s*\)?/gi,
    "",
  )
  s = s.replace(/\b\d{1,4}(?:[.,]\d{1,2})?\s*(?:€|EUR|\$|USD)\b/gi, "")
  s = s.replace(/\s{2,}/g, " ").replace(/\s+([,;.:])/g, "$1")
  s = s.replace(/;\s*;/g, ";").replace(/,\s*,/g, ",")
  return s.trim()
}

function detailsContradictsNote(note, details) {
  if (!details?.trim() || !note?.trim()) return false
  const a = extractAmounts(note)
  const b = extractAmounts(details)
  if (a.length && b.length) {
    return !amountsCompatible(a, b)
  }
  const n = note.trim().toLowerCase()
  const d = details.trim().toLowerCase()
  return d !== n && b.length > 0 && a.length > 0
}

function ecbRoundedReplacements() {
  /** Whole € figures that often stand in for USD→EUR rounding (Group C). */
  const usdMarks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 18, 20, 23, 27, 40, 44, 49, 50, 71, 136, 271]
  const map = new Map()
  for (const usd of usdMarks) {
    const eur = usdToEur(usd)
    const rounded = Math.round(eur)
    if (rounded !== eur && Math.abs(rounded - eur) > 0.01) {
      map.set(rounded, eur)
    }
    map.set(usd, eur)
  }
  return map
}

const ECB_ROUNDED = ecbRoundedReplacements()

function replaceEcbAmountsInText(text, locale) {
  if (!text || typeof text !== "string") return text
  let s = text
  s = s.replace(/\$(\d{1,4}(?:\.\d{1,2})?)/g, (_, usd) => {
    const eur = usdToEur(Number(usd))
    return `${formatEur(eur, locale)} €`
  })
  for (const [wrong, exact] of ECB_ROUNDED.entries()) {
    const repl = formatEur(exact, locale)
    const wrongFr = String(wrong).replace(".", ",")
    const patterns =
      locale === "fr"
        ? [
            new RegExp(`(?<![\\d,])${wrongFr}(?=\\s*€)`, "g"),
            new RegExp(`(?<![\\d.])${wrong}(?=\\s*€)`, "g"),
          ]
        : [new RegExp(`(?<![\\d.])${wrong}(?=\\s*€)`, "g")]
    for (const re of patterns) {
      s = s.replace(re, repl)
    }
  }
  return s
}

function replaceGoogleStalePrices(text, locale, slug) {
  if (!text || typeof text !== "string") return text
  let s = text
  for (const { wrong, en, fr } of GOOGLE_PRICE_MAP) {
    const repl = locale === "fr" ? fr : en
    const wrongStr = locale === "fr" ? String(wrong).replace(".", ",") : String(wrong)
    s = s.replace(
      new RegExp(`(?<![\\d,])${wrongStr}(?=\\s*€\\s*/\\s*mo)`, "gi"),
      repl,
    )
    s = s.replace(
      new RegExp(`(?<![\\d,])${wrongStr}(?=\\s*€\\s*/\\s*month)`, "gi"),
      repl,
    )
    s = s.replace(
      new RegExp(`(?<![\\d,.])${wrong}(?=\\s*€\\s*/\\s*mo)`, "gi"),
      repl,
    )
  }
  if (slug === "gemini" && /20x|20×/i.test(text)) {
    const { wrong, en, fr } = GOOGLE_ULTRA_20X
    const repl = locale === "fr" ? fr : en
    s = s.replace(
      new RegExp(`(?<![\\d,])${wrong}(?=\\s*€)`, "g"),
      repl,
    )
  }
  return s
}

function amountsInOrder(text) {
  if (!text) return []
  const re = /(\d{1,4}(?:[.,]\d{1,2})?)\s*€/giu
  const out = []
  let m
  while ((m = re.exec(text)) !== null) {
    out.push({
      raw: m[1],
      n: Number.parseFloat(m[1].replace(",", ".")),
      index: m.index,
      len: m[0].length,
    })
  }
  return out
}

function alignFrDescriptionToEn(frText, enText) {
  if (!frText || !enText) return frText
  const enOrder = amountsInOrder(enText)
  const frOrder = amountsInOrder(frText)
  if (!enOrder.length) return stripMoneyAmounts(frText)
  if (!frOrder.length) return frText
  let out = frText
  const pairs = Math.min(enOrder.length, frOrder.length)
  for (let i = pairs - 1; i >= 0; i--) {
    const frAmt = frOrder[i]
    const enAmt = enOrder[i]
    if (frAmt.n === enAmt.n) continue
    const repl = formatEur(enAmt.n, "fr")
    out =
      out.slice(0, frAmt.index) +
      repl +
      out.slice(frAmt.index + frAmt.raw.length)
  }
  return out
}

function mapFrAmountsToEn(frText, enAmounts) {
  if (!frText || !enAmounts.length) return frText
  const frAmounts = extractAmounts(frText)
  if (!frAmounts.length) return frText
  const sortedEn = [...enAmounts].sort((a, b) => a - b)
  const sortedFr = [...frAmounts].sort((a, b) => a - b)
  if (amountsCompatible(sortedEn, sortedFr)) return frText
  let out = frText
  const paired = Math.min(sortedEn.length, sortedFr.length)
  for (let i = 0; i < paired; i++) {
    const from = sortedFr[i]
    const to = sortedEn[i]
    if (from === to) continue
    const fromFr = formatEur(from, "fr")
    const toFr = formatEur(to, "fr")
    out = out.replace(new RegExp(`${fromFr.replace(".", "\\.")}(?=\\s*€)`, "g"), toFr)
    out = out.replace(new RegExp(`${String(from).replace(".", ",")}(?=\\s*€)`, "g"), toFr)
  }
  return out
}

function mapEnAmountsToCanonical(enText, canonical) {
  if (!enText || !canonical.length) return enText
  const cur = extractAmounts(enText)
  if (amountsCompatible(cur, canonical)) return enText
  let out = enText
  const sortedCur = [...new Set(cur)].sort((a, b) => a - b)
  const sortedCan = [...new Set(canonical)].sort((a, b) => a - b)
  const n = Math.min(sortedCur.length, sortedCan.length)
  for (let i = 0; i < n; i++) {
    if (sortedCur[i] === sortedCan[i]) continue
    const from = formatEur(sortedCur[i], "en")
    const to = formatEur(sortedCan[i], "en")
    out = out.replace(new RegExp(`${from.replace(".", "\\.")}(?=\\s*€)`, "g"), to)
  }
  return out
}

function visitorStrings(tool, overlay) {
  const out = []
  const push = (loc, kind, ref, get, set) => {
    out.push({ loc, kind, ref, get, set })
  }
  push("en", "description", tool, () => tool.description, (v) => {
    tool.description = v
  })
  push("fr", "description", overlay, () => overlay.description_fr ?? tool.description_fr, (v) => {
    if (!overlay.description_fr && tool.description_fr) tool.description_fr = v
    else overlay.description_fr = v
  })
  if (Array.isArray(tool.features)) {
    tool.features.forEach((f, i) => {
      push("en", `features[${i}]`, tool, () => tool.features[i], (v) => {
        tool.features[i] = v
      })
    })
  }
  const frFeat = overlay.features_fr ?? tool.features_fr
  if (Array.isArray(frFeat)) {
    frFeat.forEach((f, i) => {
      push("fr", `features_fr[${i}]`, overlay, () => (overlay.features_fr ?? tool.features_fr)?.[i], (v) => {
        if (overlay.features_fr) overlay.features_fr[i] = v
        else {
          if (!tool.features_fr) tool.features_fr = []
          tool.features_fr[i] = v
        }
      })
    })
  }
  if (Array.isArray(tool.howToUse)) {
    tool.howToUse.forEach((step, i) => {
      push("en", `howToUse[${i}].description`, step, () => step.description, (v) => {
        step.description = v
      })
    })
  }
  const frHow = overlay.howToUse_fr ?? tool.howToUse_fr
  if (Array.isArray(frHow)) {
    frHow.forEach((step, i) => {
      const target = overlay.howToUse_fr?.[i] ?? tool.howToUse_fr?.[i]
      if (!target) return
      push("fr", `howToUse_fr[${i}].description`, target, () => target.description, (v) => {
        target.description = v
      })
    })
  }
  return out
}

function transformVisitorCopy(tool, overlay, slug, handlers) {
  for (const vs of visitorStrings(tool, overlay)) {
    const cur = vs.get()
    if (typeof cur !== "string" || !cur.trim()) continue
    let next = cur
    for (const fn of handlers) next = fn(next, vs.loc, slug)
    if (next !== cur) vs.set(next)
  }
}

function applyRow(row, ctx) {
  const slug = row.slug?.trim()
  if (!slug) return
  const statut = (row.statut || "").trim().toLowerCase()
  const isMasque = statut === "masqué" || statut === "masque" || MASQUE_SLUGS.has(slug)
  const isOk = statut === "ok"

  const tool = readTool(slug)
  if (!tool) {
    ctx.missing.push(slug)
    return
  }
  ctx.fr[slug] ??= {}
  const overlay = ctx.fr[slug]
  const beforeTool = stableJson(tool)
  const beforeOverlay = stableJson(overlay)

  let noteFr = (row.pricing_note_fr_corrigee || "").trim()
  let noteEn = (row.pricing_note_en_corrigee || "").trim()
  noteFr = replaceGuardCopy(noteFr, slug, ctx.copyRewrites)
  noteEn = replaceGuardCopy(noteEn, slug, ctx.copyRewrites)
  noteFr = localizeFrPricingNote(noteFr)

  if (isMasque) {
    ctx.counts.masque++
    if (!tool.pricing) tool.pricing = { verified: true }
    tool.pricing.uncertain = true
    tool.pricing.verified = true
    if (noteEn) tool.pricing.note = noteEn
    else delete tool.pricing.note
    delete tool.pricing.details
    delete tool.pricing.note_fr
    if (noteFr) overlay.pricingNote_fr = noteFr
    else delete overlay.pricingNote_fr
    const src = (row.source_url || "").trim()
    if (src) tool.pricing.sourceUrl = src

    transformVisitorCopy(tool, overlay, slug, [(text) => stripMoneyAmounts(text)])
    ctx.touched.add(slug)
  } else if (isOk) {
    ctx.counts.ok++
    if (noteFr) overlay.pricingNote_fr = noteFr
    if (tool.pricing?.note_fr) delete tool.pricing.note_fr
    if (!tool.pricing) tool.pricing = { verified: true }
    if (noteEn) tool.pricing.note = noteEn
    const refNote = noteEn || noteFr
    if (tool.pricing.details && refNote) {
      if (detailsContradictsNote(refNote, tool.pricing.details)) {
        delete tool.pricing.details
      } else if (noteFr && extractAmounts(tool.pricing.details).length > extractAmounts(noteFr).length + 2) {
        delete tool.pricing.details
      }
    }
    const src = (row.source_url || "").trim()
    if (src) tool.pricing.sourceUrl = src
    ctx.touched.add(slug)
  }

  const handlers = []
  if (GOOGLE_PRICE_SLUGS.has(slug)) {
    handlers.push((text, loc) => replaceGoogleStalePrices(text, loc, slug))
  }
  if (GROUP_C_ECB.has(slug)) {
    handlers.push((text, loc) => replaceEcbAmountsInText(text, loc))
    ctx.counts.groupC++
  }
  if (handlers.length) transformVisitorCopy(tool, overlay, slug, handlers)

  const toolChanged = stableJson(tool) !== beforeTool
  const overlayChanged = stableJson(overlay) !== beforeOverlay
  if (toolChanged || overlayChanged) {
    ctx.wouldChange = true
    if (!ctx.dry) {
      if (toolChanged) writeTool(slug, tool, false)
      ctx.frDirty = true
    }
  }
}

function fixParityForSlug(slug, ctx) {
  const tool = readTool(slug)
  if (!tool || tool.pricing?.uncertain) return false
  ctx.fr[slug] ??= {}
  const overlay = ctx.fr[slug]
  const canonicalEn = extractAmounts(tool.pricing?.note || "")

  let fixed = false
  const descEn = tool.description?.trim() || ""
  let descFr = overlay.description_fr?.trim() || tool.description_fr?.trim() || ""
  if (descEn && descFr) {
    let aligned = alignFrDescriptionToEn(descFr, descEn)
    if (slug === "claude") {
      aligned = alignFrDescriptionToEn(
        aligned.replace(/Max coûte 90 €\/mois \(5x\) et Ultra 181 €\/mois \(20x\)\./u, "tandis que Max commence à 23 €/mois."),
        descEn,
      )
    }
    if (aligned !== descFr) {
      overlay.description_fr = aligned
      fixed = true
      descFr = aligned
    }
  }

  if (Array.isArray(overlay.features_fr) && Array.isArray(tool.features)) {
    overlay.features_fr = overlay.features_fr.map((frLine, i) => {
      const enLine = tool.features[i]
      if (typeof enLine !== "string" || typeof frLine !== "string") return frLine
      const aligned = alignFrDescriptionToEn(frLine, enLine)
      return aligned
    })
    const changed = overlay.features_fr.some((frLine, i) => {
      const prev = ctx.fr[slug]?.features_fr?.[i]
      return prev !== frLine
    })
    if (changed) fixed = true
  }

  if (Array.isArray(overlay.howToUse_fr) && Array.isArray(tool.howToUse)) {
    overlay.howToUse_fr = overlay.howToUse_fr.map((step, i) => {
      const enStep = tool.howToUse[i]
      if (!step?.description || !enStep?.description) return step
      const aligned = alignFrDescriptionToEn(step.description, enStep.description)
      if (aligned === step.description) return step
      fixed = true
      return { ...step, description: aligned }
    })
  }

  const beforeTool = stableJson(tool)
  if (!ctx.dry && stableJson(tool) !== beforeTool) writeTool(slug, tool, false)
  if (fixed) {
    ctx.frDirty = true
    return true
  }
  return false
}

function runParityFixes(ctx) {
  const slugs = new Set(ctx.touched)
  for (const row of scanFrEnPriceParity()) slugs.add(row.id)
  let pass = 0
  while (pass < 3) {
    pass++
    for (const slug of [...slugs]) {
      if (fixParityForSlug(slug, ctx)) ctx.parityFixes.push(slug)
    }
    const remaining = scanFrEnPriceParity().map((r) => r.id)
    if (!remaining.length) break
    remaining.forEach((id) => slugs.add(id))
  }
}

function listedActive(tool) {
  const excluded = new Set(["duplicate-of", "sunset", "renamed", "inactive"])
  return tool.status === "active" && !excluded.has(tool.status)
}

function countListed() {
  let active = 0
  let all = 0
  for (const f of fs.readdirSync(toolsDir).filter((n) => n.endsWith(".json"))) {
    all++
    const t = JSON.parse(fs.readFileSync(path.join(toolsDir, f), "utf8"))
    if (listedActive(t)) active++
  }
  return { active, all }
}

function main() {
  const csvArg = process.argv.find((a) => a.endsWith(".csv"))
  const csvPath = csvArg || defaultCsv
  const dry = process.argv.includes("--check")
  const reportOnly = process.argv.includes("--report")

  const rows = parseCsv(fs.readFileSync(csvPath, "utf8"))
  const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))

  const ctx = {
    dry,
    fr,
    frDirty: false,
    wouldChange: false,
    touched: new Set(),
    copyRewrites: [],
    parityFixes: [],
    missing: [],
    counts: { ok: 0, masque: 0, groupC: 0 },
  }

  for (const row of rows) applyRow(row, ctx)

  runParityFixes(ctx)

  if (ctx.frDirty && !dry) {
    fs.writeFileSync(frPath, stableJson(fr))
  }

  const parityAfter = scanFrEnPriceParity()
  const listed = countListed()

  const report = {
    csv: path.relative(root, csvPath),
    fxEcb: `1 EUR = ${EUR_PER_USD} USD`,
    counts: ctx.counts,
    rows: rows.length,
    missing: ctx.missing,
    copyRewrites: ctx.copyRewrites,
    parityFixes: [...new Set(ctx.parityFixes)].sort(),
    parityRemaining: parityAfter.length,
    listedActive: listed.active,
    listedAll: listed.all,
    dryRun: dry,
    wouldChange: ctx.wouldChange || ctx.frDirty,
  }

  if (reportOnly || process.argv.includes("--report")) {
    console.log(JSON.stringify(report, null, 2))
  } else {
    console.log(
      `Applied pricing FR CSV: ok=${ctx.counts.ok} masqué=${ctx.counts.masque} groupC=${ctx.counts.groupC} touched=${ctx.touched.size} parityFixes=${report.parityFixes.length} parityRemaining=${parityAfter.length}`,
    )
  }

  if (dry && (ctx.wouldChange || ctx.frDirty)) process.exit(1)
  if (!dry && parityAfter.length > 0) {
    console.error(`Warning: ${parityAfter.length} parity mismatch(es) remain`)
    for (const r of parityAfter.slice(0, 15)) {
      console.error(`  ${r.id}\t${r.field}`)
    }
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main()
}