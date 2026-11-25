#!/usr/bin/env node
/**
 * Guard: FR pricing notes must not be English copies, templates, or EN-marked.
 * Failures outside scripts/prebuild/pricing-fr-pending.json break --check.
 *
 *   node scripts/check-fr-pricing-quality.mjs
 *   node scripts/check-fr-pricing-quality.mjs --check
 *   node scripts/check-fr-pricing-quality.mjs --write-allowlist
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const allowPath = path.join(root, "scripts/prebuild/pricing-fr-pending.json")

const TEMPLATE_RE = /^Détails tarifaires sur .+ : consulte la page officielle\.?$/u
const AMOUNT_RE = /(?:^|[^\d])(\d{1,4}(?:[.,]\d{1,2})?)\s*(?:€|EUR\b)/iu
const EN_MARKERS_IN_FR =
  /\b(per month|\/mo\b|\/hr\b|\/user\b|\bplans\b|\bplan\b|free tier|\bFree\b|\btrial\b|\bannual\b|\bIndividual\b|\bbilled\b|\bcredits\b)/iu

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
  return AMOUNT_RE.test(text || "")
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

    if (fr && EN_MARKERS_IN_FR.test(fr)) add(tool.id, "en_markers_in_fr")

    if (fr && TEMPLATE_RE.test(fr) && enAnyAmount) add(tool.id, "template_with_en_amount")

    if (fr) {
      if (enNote && normalizeCompare(fr) === normalizeCompare(enNote)) {
        add(tool.id, "verbatim_en_copy")
      } else if (enDetails && !enNote && normalizeCompare(fr) === normalizeCompare(enDetails)) {
        add(tool.id, "verbatim_en_copy")
      }
    }

    if (enDetails && textHasAmount(enDetails) && fr) {
      if (TEMPLATE_RE.test(fr) || EN_MARKERS_IN_FR.test(fr)) {
        add(tool.id, "details_not_reflected_in_fr")
      }
      if (enNote && textHasAmount(enNote) === false) {
        if (normalizeCompare(fr) === normalizeCompare(enDetails)) {
          add(tool.id, "details_verbatim_in_fr")
        }
      }
    }
  }

  const violations = [...bySlug.entries()].map(([id, reasons]) => ({
    id,
    reasons: [...reasons].sort(),
  }))
  violations.sort((a, b) => a.id.localeCompare(b.id))
  return violations
}

function loadAllowlist() {
  if (!fs.existsSync(allowPath)) return new Set()
  const data = JSON.parse(fs.readFileSync(allowPath, "utf8"))
  return new Set(data.slugs || [])
}

function main() {
  const check = process.argv.includes("--check")
  const writeAllow = process.argv.includes("--write-allowlist")
  const violations = scanFrPricingQuality()

  const byReason = {}
  for (const v of violations) {
    for (const r of v.reasons) {
      byReason[r] = (byReason[r] ?? 0) + 1
    }
  }

  console.log(`FR pricing quality: ${violations.length} tool(s) with issue(s)`)
  for (const row of violations.slice(0, 30)) {
    console.log(`  ${row.id}\t${row.reasons.join(", ")}`)
  }
  if (violations.length > 30) console.log(`  ... and ${violations.length - 30} more`)

  if (writeAllow) {
    const payload = {
      _header: "TEMPORAIRE — à vider à l'application du CSV Contenu",
      slugs: violations.map((v) => v.id),
      countsByReason: byReason,
    }
    fs.mkdirSync(path.dirname(allowPath), { recursive: true })
    fs.writeFileSync(allowPath, `${JSON.stringify(payload, null, 2)}\n`)
    console.log(`Wrote ${allowPath} (${payload.slugs.length} slugs)`)
    return
  }

  if (!check) return

  const allowed = loadAllowlist()
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