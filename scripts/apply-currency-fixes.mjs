/**
 * Apply Contenu-approved EUR copy from a CSV export.
 *
 * Columns: slug, champ, langue, fichier, valeur_actuelle, valeur_corrigee [, action]
 *   action=delete — clear field or remove sentence when valeur_corrigee is empty
 *
 *   node scripts/apply-currency-fixes.mjs path/to/fixes.csv
 *   node scripts/apply-currency-fixes.mjs path/to/fixes.csv --dry-run
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content", "tools")
const frPath = path.join(root, "content", "i18n", "fr-tools.json")
const guidesPath = path.join(root, "content", "automations", "guides.json")

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\u00a0/g, " ")
    .trim()
}

/** Exact match, or long shared prefix when catalogue drifted after CSV export. */
function valuesMatch(current, expected) {
  const cur = normalizeText(current)
  const exp = normalizeText(expected)
  if (cur === exp) return true
  const shorter = exp.length <= cur.length ? exp : cur
  const longer = exp.length > cur.length ? exp : cur
  if (shorter.length >= 120 && longer.startsWith(shorter)) return true
  return false
}

function candidateFichiers(slug, champ) {
  if (/^(price|why|how)\.(en|fr)$/.test(champ)) return ["content/automations/guides.json"]
  if (
    champ === "description_fr" ||
    champ === "pricingNote_fr" ||
    champ.startsWith("features_fr") ||
    champ.startsWith("howToUse_fr")
  ) {
    return ["content/i18n/fr-tools.json", `content/tools/${slug}.json`]
  }
  return [`content/tools/${slug}.json`]
}

function resolveFichier(slug, champ, expected, frTools, guides) {
  for (const fichier of candidateFichiers(slug, champ)) {
    const current = readAtChamp(null, frTools, guides, slug, champ, fichier)
    if (valuesMatch(current, expected)) return fichier
  }
  return candidateFichiers(slug, champ)[0]
}

function parseCsvRows(text) {
  const lines = text.trim().split(/\r?\n/)
  const header = lines.shift()?.split(",") ?? []
  const rows = []
  for (const line of lines) {
    const cells = []
    let cur = ""
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          cur += '"'
          i++
        } else if (ch === '"') inQuotes = false
        else cur += ch
      } else if (ch === '"') inQuotes = true
      else if (ch === ",") {
        cells.push(cur)
        cur = ""
      } else cur += ch
    }
    cells.push(cur)
    const row = {}
    for (const [i, key] of header.entries()) row[key] = cells[i] ?? ""
    rows.push(row)
  }
  return rows
}

function readAtChamp(_ctx, frTools, guides, slug, champ, fichier) {
  if (fichier === "content/automations/guides.json") {
    const entry = (guides.tools || []).find((t) => t.id === slug)
    if (!entry) return undefined
    const [key, lang] = champ.split(".")
    return entry[key]?.[lang]
  }

  if (fichier === "content/i18n/fr-tools.json") {
    const overlay = frTools[slug]
    if (!overlay) return undefined
    if (champ === "description_fr") return overlay.description_fr
    if (champ === "pricingNote_fr") return overlay.pricingNote_fr
    const feat = champ.match(/^features_fr\[(\d+)\]$/)
    if (feat) return overlay.features_fr?.[Number(feat[1])]
    const how = champ.match(/^howToUse_fr\[(\d+)\]\.(title|description)$/)
    if (how) return overlay.howToUse_fr?.[Number(how[1])]?.[how[2]]
    return undefined
  }

  const toolPath = path.join(toolsDir, `${slug}.json`)
  if (!fs.existsSync(toolPath)) return undefined
  const tool = JSON.parse(fs.readFileSync(toolPath, "utf8"))

  if (champ === "description") return tool.description
  if (champ === "summary") return tool.summary
  if (champ === "statusNote") return tool.statusNote
  if (champ === "dateAddedNote") return tool.dateAddedNote
  if (champ === "description_fr") return tool.description_fr
  if (champ === "pricing.note") return tool.pricing?.note
  if (champ === "pricing.details") return tool.pricing?.details
  if (champ === "pricing.note_fr") return tool.pricing?.note_fr

  const feat = champ.match(/^features\[(\d+)\]$/)
  if (feat) return tool.features?.[Number(feat[1])]
  const featFr = champ.match(/^features_fr\[(\d+)\]$/)
  if (featFr) return tool.features_fr?.[Number(featFr[1])]

  const how = champ.match(/^howToUse\[(\d+)\]\.(title|description)$/)
  if (how) return tool.howToUse?.[Number(how[1])]?.[how[2]]
  const howFr = champ.match(/^howToUse_fr\[(\d+)\]\.(title|description)$/)
  if (howFr) return tool.howToUse_fr?.[Number(howFr[1])]?.[howFr[2]]

  return undefined
}

function writeAtChamp(_ctx, frTools, guides, slug, champ, fichier, value) {
  if (fichier === "content/automations/guides.json") {
    const entry = (guides.tools || []).find((t) => t.id === slug)
    if (!entry) throw new Error(`Guide not found: ${slug}`)
    const [key, lang] = champ.split(".")
    if (!entry[key]) entry[key] = { en: "", fr: "" }
    if (value === undefined || value === "") delete entry[key][lang]
    else entry[key][lang] = value
    return
  }

  if (fichier === "content/i18n/fr-tools.json") {
    if (!frTools[slug]) frTools[slug] = {}
    const overlay = frTools[slug]
    if (champ === "description_fr") {
      if (value === undefined) delete overlay.description_fr
      else overlay.description_fr = value
      return
    }
    if (champ === "pricingNote_fr") {
      if (value === undefined) delete overlay.pricingNote_fr
      else overlay.pricingNote_fr = value
      return
    }
    const feat = champ.match(/^features_fr\[(\d+)\]$/)
    if (feat) {
      const i = Number(feat[1])
      if (!overlay.features_fr) overlay.features_fr = []
      if (value === undefined) overlay.features_fr.splice(i, 1)
      else overlay.features_fr[i] = value
      return
    }
    const how = champ.match(/^howToUse_fr\[(\d+)\]\.(title|description)$/)
    if (how) {
      const i = Number(how[1])
      const part = how[2]
      if (!overlay.howToUse_fr) overlay.howToUse_fr = []
      if (!overlay.howToUse_fr[i]) overlay.howToUse_fr[i] = { title: "", description: "" }
      if (value === undefined) delete overlay.howToUse_fr[i][part]
      else overlay.howToUse_fr[i][part] = value
      return
    }
    throw new Error(`Unsupported overlay champ ${champ}`)
  }

  const toolPath = path.join(toolsDir, `${slug}.json`)
  const tool = JSON.parse(fs.readFileSync(toolPath, "utf8"))

  if (champ === "description") tool.description = value
  else if (champ === "summary") tool.summary = value
  else if (champ === "statusNote") {
    if (value === undefined) delete tool.statusNote
    else tool.statusNote = value
  } else if (champ === "dateAddedNote") {
    if (value === undefined) delete tool.dateAddedNote
    else tool.dateAddedNote = value
  } else if (champ === "description_fr") {
    if (value === undefined) delete tool.description_fr
    else tool.description_fr = value
  } else if (champ === "pricing.note") {
    if (!tool.pricing) tool.pricing = { verified: false }
    if (value === undefined) delete tool.pricing.note
    else tool.pricing.note = value
  } else if (champ === "pricing.details") {
    if (!tool.pricing) tool.pricing = { verified: false }
    if (value === undefined) delete tool.pricing.details
    else tool.pricing.details = value
  } else if (champ === "pricing.note_fr") {
    if (!tool.pricing) tool.pricing = { verified: false }
    if (value === undefined) delete tool.pricing.note_fr
    else tool.pricing.note_fr = value
  } else if (/^features\[(\d+)\]$/.test(champ)) {
    const i = Number(champ.match(/^features\[(\d+)\]$/)[1])
    if (!tool.features) tool.features = []
    if (value === undefined) tool.features.splice(i, 1)
    else tool.features[i] = value
  } else if (/^features_fr\[(\d+)\]$/.test(champ)) {
    const i = Number(champ.match(/^features_fr\[(\d+)\]$/)[1])
    if (!tool.features_fr) tool.features_fr = []
    if (value === undefined) tool.features_fr.splice(i, 1)
    else tool.features_fr[i] = value
  } else if (/^howToUse\[(\d+)\]\.(title|description)$/.test(champ)) {
    const m = champ.match(/^howToUse\[(\d+)\]\.(title|description)$/)
    const i = Number(m[1])
    const part = m[2]
    if (!tool.howToUse) tool.howToUse = []
    if (!tool.howToUse[i]) tool.howToUse[i] = { title: "", description: "" }
    if (value === undefined) delete tool.howToUse[i][part]
    else tool.howToUse[i][part] = value
  } else if (/^howToUse_fr\[(\d+)\]\.(title|description)$/.test(champ)) {
    const m = champ.match(/^howToUse_fr\[(\d+)\]\.(title|description)$/)
    const i = Number(m[1])
    const part = m[2]
    if (!tool.howToUse_fr) tool.howToUse_fr = []
    if (!tool.howToUse_fr[i]) tool.howToUse_fr[i] = { title: "", description: "" }
    if (value === undefined) delete tool.howToUse_fr[i][part]
    else tool.howToUse_fr[i][part] = value
  } else throw new Error(`Unsupported champ ${champ}`)

  fs.writeFileSync(toolPath, `${JSON.stringify(tool, null, 2)}\n`)
}

function applyRows(rows, { dryRun, label }) {
  const frTools = JSON.parse(fs.readFileSync(frPath, "utf8"))
  const guides = JSON.parse(fs.readFileSync(guidesPath, "utf8"))
  const applied = []
  const deleted = []
  const mismatches = []

  for (const row of rows) {
    const slug = row.slug
    const champ = row.champ ?? row.field
    const fichier = row.fichier || resolveFichier(slug, champ, row.valeur_actuelle ?? row.old_value, frTools, guides)
    const expect = row.valeur_actuelle ?? row.old_value
    const next = row.valeur_corrigee ?? row.new_value
    const action = row.action

    const current = readAtChamp(null, frTools, guides, slug, champ, fichier)
    const curNorm = current == null ? "" : String(current)
    const expectNorm = expect == null ? "" : String(expect)

    if (!valuesMatch(current, expect)) {
      mismatches.push({ slug, champ, fichier, label, current: curNorm.slice(0, 80), expected: expectNorm.slice(0, 80) })
      continue
    }

    const isDelete = action === "delete" && (!next || !String(next).trim())
    const newValue = isDelete ? undefined : next

    if (!dryRun) {
      writeAtChamp(null, frTools, guides, slug, champ, fichier, newValue)
    }
    applied.push({ slug, champ, fichier, action: isDelete ? "delete" : "replace" })
    if (isDelete) deleted.push({ slug, champ, fichier })
  }

  if (!dryRun) {
    fs.writeFileSync(frPath, `${JSON.stringify(frTools, null, 2)}\n`)
    fs.writeFileSync(guidesPath, `${JSON.stringify(guides, null, 2)}\n`)
  }

  return {
    label,
    applied: applied.length,
    deleted: deleted.length,
    replacements: applied.length - deleted.length,
    mismatches,
    dryRun,
  }
}

function main() {
  const dryRun = process.argv.includes("--dry-run")
  const csvPath = process.argv.find((a) => a.endsWith(".csv"))
  const jsonPath = process.argv.find((a) => a.endsWith(".json") && a.includes("usd-fields"))
  if (!csvPath && !jsonPath) {
    console.error("Usage: node scripts/apply-currency-fixes.mjs <fixes.csv> [fixes.json] [--dry-run]")
    process.exit(1)
  }

  const reports = []
  if (csvPath) reports.push(applyRows(parseCsvRows(fs.readFileSync(csvPath, "utf8")), { dryRun, label: "csv" }))
  if (jsonPath) {
    const frTools = JSON.parse(fs.readFileSync(frPath, "utf8"))
    const guides = JSON.parse(fs.readFileSync(guidesPath, "utf8"))
    const jsonRows = JSON.parse(fs.readFileSync(jsonPath, "utf8")).map((row) => ({
      ...row,
      champ: row.field,
    }))
    const pending = jsonRows.filter((row) => {
      const fichier = resolveFichier(row.slug, row.champ, row.old_value, frTools, guides)
      const current = readAtChamp(null, frTools, guides, row.slug, row.champ, fichier)
      if (!valuesMatch(current, row.old_value)) return false
      return normalizeText(current) !== normalizeText(row.new_value)
    })
    reports.push(applyRows(pending, { dryRun, label: "json" }))
  }

  const summary = {
    applied: reports.reduce((n, r) => n + r.applied, 0),
    deleted: reports.reduce((n, r) => n + r.deleted, 0),
    replacements: reports.reduce((n, r) => n + r.replacements, 0),
    mismatches: reports.flatMap((r) => r.mismatches),
    dryRun,
    bySource: reports.map((r) => ({
      label: r.label,
      applied: r.applied,
      deleted: r.deleted,
      mismatches: r.mismatches.length,
    })),
  }
  console.log(JSON.stringify({ ...summary, mismatchCount: summary.mismatches.length }, null, 2))
  if (summary.mismatches.length) {
    console.log("Mismatches:")
    for (const m of summary.mismatches.slice(0, 30)) console.log(m)
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main()
}