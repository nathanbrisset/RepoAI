#!/usr/bin/env node
/**
 * Add fr-tools.json entries for active tools missing French overlay (Google translate gtx).
 *   node scripts/backfill-fr-tools-missing.mjs [--limit 20]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const frPath = path.join(root, "content/i18n/fr-tools.json")
const toolsDir = path.join(root, "content/tools")

const limitArg = process.argv.indexOf("--limit")
const limit = limitArg >= 0 ? Number(process.argv[limitArg + 1]) : 0

async function translateEnToFr(text) {
  const chunk = (text || "").trim().slice(0, 4500)
  if (!chunk) return ""
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=${encodeURIComponent(chunk)}`
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) })
  if (!res.ok) throw new Error(`translate HTTP ${res.status}`)
  const data = await res.json()
  return data[0].map((part) => part[0]).join("").trim()
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
const missing = []

for (const file of fs.readdirSync(toolsDir).filter((f) => f.endsWith(".json"))) {
  const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8"))
  if (tool.status !== "active") continue
  if (fr[tool.id]?.summary_fr && fr[tool.id]?.description_fr) continue
  if (tool.summary_fr && tool.description_fr) {
    fr[tool.id] = {
      ...(fr[tool.id] || {}),
      summary_fr: tool.summary_fr,
      description_fr: tool.description_fr,
      ...(tool.features_fr?.length ? { features_fr: tool.features_fr } : {}),
    }
    continue
  }
  missing.push(tool)
}

const todo = limit > 0 ? missing.slice(0, limit) : missing
let done = 0
for (const tool of todo) {
  try {
    const summary_fr = await translateEnToFr(tool.summary || tool.description?.slice(0, 200))
    const description_fr = await translateEnToFr(tool.description || tool.summary)
    const features_fr = []
    for (const line of (tool.features || []).slice(0, 4)) {
      features_fr.push(await translateEnToFr(line))
      await sleep(120)
    }
    fr[tool.id] = {
      ...(fr[tool.id] || {}),
      summary_fr,
      description_fr,
      ...(features_fr.length ? { features_fr } : {}),
    }
    done++
    process.stderr.write(`translated ${tool.id}\n`)
    await sleep(200)
  } catch (error) {
    process.stderr.write(`fail ${tool.id}: ${error.message}\n`)
  }
}

fs.writeFileSync(frPath, `${JSON.stringify(fr, null, 2)}\n`)
console.log(JSON.stringify({ missing: missing.length, translated: done, total: Object.keys(fr).length }, null, 2))
