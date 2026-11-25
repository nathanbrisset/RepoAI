#!/usr/bin/env node
/**
 * Guard: FR pricing notes must not be English copies, templates, or EN-marked.
 * Failures outside scripts/prebuild/pricing-fr-pending.json break --check.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import {
  contenuSlugSet,
  frNoteMatchesCsv,
} from "./lib/contenu-pricing-csv.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const allowPath = path.join(root, "scripts/prebuild/pricing-fr-pending.json")

const TEMPLATE_RE = /^Détails tarifaires sur .+ : consulte la page officielle\.?$/u
const AMOUNT_AFTER = /(?:^|[^\d])(\d{1,4}(?:[.,]\d{1,2})?)\s*€/iu
const AMOUNT_BEFORE = /€\s*(\d{1,4}(?:[.,]\d{1,2})?)/iu
const EN_MARKERS_IN_FR_CORE =
  /\b(per month|free tier|billed annually|billed yearly|billed monthly)\b|\b(?:monthly|yearly)\s+(?:billing|plan)\b|(?:^|[^\w])€\d|\b\d+\s*€\/mo\b|\b(?:\/mo|\/hr|\/user)\b/iu

/** Tier token immediately before an amount (Contenu CSV slugs only). */
const TIER_BEFORE_AMOUNT =
  /\b(?:Free|Basic|Plus|Pro|Professional|Enterprise|Starter|Team|Individual|Business|Credits?)\s+(?:at\s+)?(?:\d{1,4}(?:[.,]\d{1,2})?\s*€)/giu

const CONTENU_SLUGS = contenuSlugSet()

function scrubContenuTierWords(fr, slug) {
  if (!CONTENU_SLUGS.has(slug)) return String(fr || "")
  return String(fr || "").replace(TIER_BEFORE_AMOUNT, (m) => " ".repeat(m.length))
}

export function enMarkersInFr(fr, slug = "") {
  return EN_MARKERS_IN_FR_CORE.test(scrubContenuTierWords(fr, slug))
}

function listedActive(tool) {
  const excluded = new Set(["duplicate-of", "sunset", "renamed", "inactive"])
  return tool.status === "active" && !excluded.has(tool.status)
}

function normalizeCompare(s) {
  return String(s || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
}

function textHasAmount(text) {
  const s = text || ""
  return AMOUNT_AFTER.test(s) || AMOUNT_BEFORE.test(s)
}

export function scanFrPricingQuality({ rootDir = root } = {}) {
  const frOverlay = JSON.parse(
    fs.readFileSync(path.join(rootDir, "content/i18n/fr-tools.json"), "utf8"),
  )
  const bySlug = new Map()

  const add = (id, reason) => {
    if (!bySlug.has(id)) bySlug.set(id, new Set())
    bySlug.get(id).add(reason)
  }

  for (const file of fs.readdirSync(path.join(rootDir, "content/tools")).filter((n) =>
    n.endsWith(".json"),
  )) {
    const tool = JSON.parse(
      fs.readFileSync(path.join(rootDir, "content/tools", file), "utf8"),
    )
    if (!listedActive(tool)) continue
    if (tool.pricing?.uncertain === true) continue

    const overlay = frOverlay[tool.id]
    const enNote = tool.pricing?.note?.trim() || ""
    const enDetails = tool.pricing?.details?.trim() || ""
    const fr =
      tool.pricing?.note_fr?.trim() || overlay?.pricingNote_fr?.trim() || ""

    if (!fr && (enNote || enDetails)) continue

    const enAnyAmount = textHasAmount(enNote) || textHasAmount(enDetails)

    if (fr && enMarkersInFr(fr, tool.id)) add(tool.id, "en_markers_in_fr")

    if (fr && TEMPLATE_RE.test(fr) && enAnyAmount) add(tool.id, "template_with_en_amount")

    if (fr) {
      if (enNote && normalizeCompare(fr) === normalizeCompare(enNote)) {
        add(tool.id, "verbatim_en_copy")
      } else if (enDetails && !enNote && normalizeCompare(fr) === normalizeCompare(enDetails)) {
        add(tool.id, "verbatim_en_copy")
      }
    }

    const contenuFr = overlay?.pricingNote_fr?.trim() || ""
    const frFromContenuCsv =
      contenuFr && contenuFr === fr && frNoteMatchesCsv(contenuFr, tool.id)

    if (enDetails && textHasAmount(enDetails) && fr) {
      if (frFromContenuCsv) {
        /* Contenu CSV FR note */
      } else if (TEMPLATE_RE.test(fr) || enMarkersInFr(fr, tool.id)) {
        add(tool.id, "details_not_reflected_in_fr")
      }
      if (enNote && textHasAmount(enNote) === false) {
        if (normalizeCompare(fr) === normalizeCompare(enDetails)) {
          add(tool.id, "details_verbatim_in_fr")
        }
      }
    }
  }

  return [...bySlug.entries()].map(([id, reasons]) => ({
    id,
    reasons: [...reasons].sort(),
  })).sort((a, b) => a.id.localeCompare(b.id))
}

function loadAllowlist() {
  if (!fs.existsSync(allowPath)) return { slugs: new Set(), data: null }
  const data = JSON.parse(fs.readFileSync(allowPath, "utf8"))
  return { slugs: new Set(data.slugs || []), data }
}

function assertAllowlistNotExpired(data) {
  const expires = data?.expires
  if (!expires) return
  const today = new Date().toISOString().slice(0, 10)
  if (today > expires) {
    console.error(`pricing-fr-pending.json expired on ${expires} (today ${today}).`)
    process.exit(1)
  }
}

function main() {
  const check = process.argv.includes("--check")
  const writeAllow = process.argv.includes("--write-allowlist")
  const violations = scanFrPricingQuality()

  console.log(`FR pricing quality: ${violations.length} tool(s) with issue(s)`)
  for (const row of violations.slice(0, 30)) {
    console.log(`  ${row.id}\t${row.reasons.join(", ")}`)
  }

  if (writeAllow) {
    const payload = {
      _header: "TEMPORAIRE — à vider à l'application du CSV Contenu",
      expires: "2026-12-15",
      slugs: violations.map((v) => v.id),
    }
    fs.writeFileSync(allowPath, `${JSON.stringify(payload, null, 2)}\n`)
    return
  }

  if (!check) return

  const { slugs: allowed, data: allowData } = loadAllowlist()
  assertAllowlistNotExpired(allowData)
  const failingIds = new Set(violations.map((v) => v.id))
  const unlisted = violations.filter((v) => !allowed.has(v.id))
  const stale = [...allowed].filter((id) => !failingIds.has(id))

  if (stale.length) {
    console.error(`Allowlist stale (no longer failing): ${stale.join(", ")}`)
    process.exit(1)
  }
  if (unlisted.length) {
    console.error(`${unlisted.length} violation(s) not in pricing-fr-pending.json:`)
    for (const row of unlisted.slice(0, 40)) {
      console.error(`  ${row.id}\t${row.reasons.join(", ")}`)
    }
    process.exit(1)
  }
  console.log(`\nFR pricing quality check passed (${allowed.size} allowlisted).`)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main()
}