/**
 * Fail prebuild when visitor-facing copy still mentions non-EUR currencies.
 *
 *   node --experimental-strip-types scripts/check-display-currency.mjs
 *   node --experimental-strip-types scripts/check-display-currency.mjs --check
 *   node --experimental-strip-types scripts/check-display-currency.mjs --compare-csv path/to/usd-fields.csv
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { containsNonEurDisplayCurrency } from "../lib/pricing-note-guard.ts"
import { COLLECTION_DEFS } from "../lib/directory/collections.ts"
import { categoryCopy } from "../lib/i18n/messages.ts"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content", "tools")
const frPath = path.join(root, "content", "i18n", "fr-tools.json")
const guidesPath = path.join(root, "content", "automations", "guides.json")
const allowlistPath = path.join(root, "data", "display-currency-allowlist.json")

function loadAllowlist() {
  if (!fs.existsSync(allowlistPath)) return []
  const data = JSON.parse(fs.readFileSync(allowlistPath, "utf8"))
  return Array.isArray(data.allow) ? data.allow : []
}

function isAllowed(allowlist, row) {
  return allowlist.some(
    (entry) =>
      entry.slug === row.slug &&
      entry.champ === row.champ &&
      entry.fichier === row.fichier &&
      (entry.langue == null || entry.langue === row.langue),
  )
}

function pushHit(hits, allowlist, row) {
  if (!containsNonEurDisplayCurrency(row.value)) return
  if (isAllowed(allowlist, row)) return
  hits.push({
    slug: row.slug,
    champ: row.champ,
    langue: row.langue,
    fichier: row.fichier,
    value: row.value,
  })
}

function pickFrenchSource(tool, overlay, inlineKey, overlayKey) {
  const inline = tool[inlineKey]
  if (inline != null && String(inline).trim() !== "") {
    return { fichier: `content/tools/${tool.id}.json`, value: inline }
  }
  const over = overlay?.[overlayKey ?? inlineKey]
  if (over != null && String(over).trim() !== "") {
    return { fichier: `content/i18n/fr-tools.json`, value: over }
  }
  return null
}

function pickFrenchArraySource(tool, overlay, inlineKey, overlayKey) {
  const inline = tool[inlineKey]
  const useInline = Array.isArray(inline) && inline.length > 0
  const arr = useInline ? inline : overlay?.[overlayKey ?? inlineKey]
  if (!Array.isArray(arr) || arr.length === 0) return null
  const fichier = useInline ? `content/tools/${tool.id}.json` : `content/i18n/fr-tools.json`
  return { fichier, arr }
}

function scanTools(allowlist) {
  const hits = []
  const frOverlay = JSON.parse(fs.readFileSync(frPath, "utf8"))
  const toolRel = (id) => `content/tools/${id}.json`

  for (const file of fs.readdirSync(toolsDir).filter((n) => n.endsWith(".json"))) {
    const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8"))
    const id = tool.id ?? path.basename(file, ".json")
    const overlay = frOverlay[id]
    const rel = toolRel(id)

    const fields = [
      ["description", "en", tool.description],
      ["summary", "en", tool.summary],
      ["statusNote", "en", tool.statusNote],
      ["dateAddedNote", "en", tool.dateAddedNote],
      ["pricing.note", "en", tool.pricing?.note],
      ["pricing.details", "en", tool.pricing?.details],
      ["pricing.note_fr", "fr", tool.pricing?.note_fr],
    ]

    for (const [champ, langue, value] of fields) {
      if (typeof value !== "string" || !value.trim()) continue
      pushHit(hits, allowlist, { slug: id, champ, langue, fichier: rel, value })
    }

    for (const [i, value] of (tool.features || []).entries()) {
      if (typeof value !== "string" || !value.trim()) continue
      pushHit(hits, allowlist, {
        slug: id,
        champ: `features[${i}]`,
        langue: "en",
        fichier: rel,
        value,
      })
    }

    for (const [i, step] of (tool.howToUse || []).entries()) {
      if (step?.title) {
        pushHit(hits, allowlist, {
          slug: id,
          champ: `howToUse[${i}].title`,
          langue: "en",
          fichier: rel,
          value: step.title,
        })
      }
      if (step?.description) {
        pushHit(hits, allowlist, {
          slug: id,
          champ: `howToUse[${i}].description`,
          langue: "en",
          fichier: rel,
          value: step.description,
        })
      }
    }

    const descFr = pickFrenchSource(tool, overlay, "description_fr", "description_fr")
    if (descFr) {
      pushHit(hits, allowlist, {
        slug: id,
        champ: "description_fr",
        langue: "fr",
        fichier: descFr.fichier,
        value: descFr.value,
      })
    }

    const featuresFr = pickFrenchArraySource(tool, overlay, "features_fr", "features_fr")
    if (featuresFr) {
      for (const [i, value] of featuresFr.arr.entries()) {
        if (typeof value !== "string" || !value.trim()) continue
        pushHit(hits, allowlist, {
          slug: id,
          champ: `features_fr[${i}]`,
          langue: "fr",
          fichier: featuresFr.fichier,
          value,
        })
      }
    }

    const howFr = pickFrenchArraySource(tool, overlay, "howToUse_fr", "howToUse_fr")
    if (howFr) {
      for (const [i, step] of howFr.arr.entries()) {
        if (step?.title) {
          pushHit(hits, allowlist, {
            slug: id,
            champ: `howToUse_fr[${i}].title`,
            langue: "fr",
            fichier: howFr.fichier,
            value: step.title,
          })
        }
        if (step?.description) {
          pushHit(hits, allowlist, {
            slug: id,
            champ: `howToUse_fr[${i}].description`,
            langue: "fr",
            fichier: howFr.fichier,
            value: step.description,
          })
        }
      }
    }

    const noteOverlay = overlay?.pricingNote_fr
    if (typeof noteOverlay === "string" && noteOverlay.trim()) {
      pushHit(hits, allowlist, {
        slug: id,
        champ: "pricingNote_fr",
        langue: "fr",
        fichier: "content/i18n/fr-tools.json",
        value: noteOverlay,
      })
    }
  }

  return hits
}

function scanAutomationGuides(allowlist) {
  const hits = []
  const guides = JSON.parse(fs.readFileSync(guidesPath, "utf8"))
  const rel = "content/automations/guides.json"
  const localizedKeys = [
    "subcategory",
    "pitch",
    "audience",
    "price",
    "worksWith",
    "use",
    "why",
    "how",
    "bestFor",
  ]

  for (const tool of guides.tools || []) {
    const id = tool.id
    for (const key of localizedKeys) {
      const block = tool[key]
      if (!block || typeof block !== "object") continue
      for (const langue of ["en", "fr"]) {
        const value = block[langue]
        if (typeof value !== "string" || !value.trim()) continue
        pushHit(hits, allowlist, {
          slug: id,
          champ: `${key}.${langue}`,
          langue,
          fichier: rel,
          value,
        })
      }
    }
  }
  return hits
}

function scanCollections(allowlist) {
  const hits = []
  const rel = "lib/directory/collections.ts"
  for (const def of COLLECTION_DEFS) {
    for (const langue of ["en", "fr"]) {
      pushHit(hits, allowlist, {
        slug: def.slug,
        champ: `title.${langue}`,
        langue,
        fichier: rel,
        value: def.title[langue],
      })
      pushHit(hits, allowlist, {
        slug: def.slug,
        champ: `blurb.${langue}`,
        langue,
        fichier: rel,
        value: def.blurb[langue],
      })
    }
  }
  return hits
}

function scanCategoryCopy(allowlist) {
  const hits = []
  const rel = "lib/i18n/messages.ts"
  const taxonomy = JSON.parse(
    fs.readFileSync(path.join(root, "content", "taxonomy.json"), "utf8"),
  )
  const categoryIds = [
    ...taxonomy.categories.map((c) => c.id),
    ...(taxonomy.legacyIds || []),
  ]
  for (const id of categoryIds) {
    for (const langue of ["en", "fr"]) {
      const copy = categoryCopy(langue, id)
      if (!copy) continue
      for (const [part, value] of Object.entries(copy)) {
        if (typeof value !== "string" || !value.trim()) continue
        pushHit(hits, allowlist, {
          slug: id,
          champ: `category.${part}`,
          langue,
          fichier: rel,
          value,
        })
      }
    }
  }
  return hits
}

export function scanDisplayCurrency({ rootDir = root } = {}) {
  const prevRoot = root
  void prevRoot
  const allowlist = loadAllowlist()
  return [
    ...scanTools(allowlist),
    ...scanAutomationGuides(allowlist),
    ...scanCollections(allowlist),
    ...scanCategoryCopy(allowlist),
  ]
}

function rowKey(row) {
  return `${row.slug}\t${row.champ}\t${row.langue}\t${row.fichier}`
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

function compareWithCsv(hits, csvPath) {
  const text = fs.readFileSync(csvPath, "utf8")
  const expected = parseCsvRows(text)
  const expectedKeys = new Set(expected.map((r) => `${r.slug}\t${r.champ}\t${r.langue}\t${r.fichier}`))
  const actualKeys = new Set(hits.map(rowKey))

  const onlyExpected = [...expectedKeys].filter((k) => !actualKeys.has(k))
  const onlyActual = [...actualKeys].filter((k) => !expectedKeys.has(k))

  return {
    expectedCount: expected.length,
    actualCount: hits.length,
    onlyExpected: onlyExpected.slice(0, 50),
    onlyActual: onlyActual.slice(0, 50),
    onlyExpectedCount: onlyExpected.length,
    onlyActualCount: onlyActual.length,
    extraFamilies: [...new Set(onlyActual.map((k) => k.split("\t")[1]))],
    missedFamilies: [...new Set(onlyExpected.map((k) => k.split("\t")[1]))],
  }
}

function main() {
  const check = process.argv.includes("--check")
  const compareIdx = process.argv.indexOf("--compare-csv")
  const csvPath = compareIdx >= 0 ? process.argv[compareIdx + 1] : null

  const hits = scanDisplayCurrency()
  console.log(`Display-currency scan: ${hits.length} hit(s)`)

  if (csvPath) {
    const diff = compareWithCsv(hits, csvPath)
    console.log(JSON.stringify(diff, null, 2))
  }

  if (hits.length) {
    for (const row of hits.slice(0, 40)) {
      const excerpt = row.value.slice(0, 100).replace(/\s+/g, " ")
      console.log(`  ${row.slug}\t${row.champ}\t${row.langue}\t${row.fichier}\t${excerpt}`)
    }
    if (hits.length > 40) console.log(`  ... and ${hits.length - 40} more`)
  }

  if (check && hits.length > 0) {
    console.error(`\nDisplay-currency check failed: ${hits.length} hit(s).`)
    process.exit(1)
  }
  if (check) console.log("\nDisplay-currency check passed.")
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main()
}