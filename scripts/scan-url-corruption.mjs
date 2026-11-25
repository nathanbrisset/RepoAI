#!/usr/bin/env node
/**
 * Scan EN tool fiches + FR overlay for doubled hosts, repeated path segments, repeated numeric suffixes.
 *
 * Usage: node scripts/scan-url-corruption.mjs [--json]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.join(root, "content", "tools")
const frPath = path.join(root, "content", "i18n", "fr-tools.json")
const asJson = process.argv.includes("--json")
const selfTest = process.argv.includes("--self-test")

const doubledHost = /(?:https?:\/\/)?([\w-]+)\.\1\.(?:[\w-]+\.)*[\w-]+/gi
const repeatedPath = /\/([\w][\w%-]*)\/-\1(?:\/-\1)+/gi
/** e.g. seedream5_55_55_5 from bad substring replacement */
const repeatedSuffix = /seedream\d+_\d+(?:_\d+){2,}/gi

/** @type {{ id: string, lang: string, kind: string, snippet: string }[]} */
const hits = []

function scanText(id, lang, text) {
  if (typeof text !== "string" || !text) return
  for (const re of [
    { kind: "doubled-host", re: doubledHost },
    { kind: "repeated-path-segment", re: repeatedPath },
    { kind: "repeated-suffix", re: repeatedSuffix },
  ]) {
    re.re.lastIndex = 0
    let m
    while ((m = re.re.exec(text))) {
      const start = Math.max(0, m.index - 40)
      const end = Math.min(text.length, m.index + m[0].length + 40)
      hits.push({
        id,
        lang,
        kind: re.kind,
        snippet: text.slice(start, end).replace(/\s+/g, " "),
      })
    }
  }
}

function walk(id, lang, value) {
  if (typeof value === "string") scanText(id, lang, value)
  else if (Array.isArray(value)) value.forEach((v) => walk(id, lang, v))
  else if (value && typeof value === "object") {
    for (const v of Object.values(value)) walk(id, lang, v)
  }
}

if (selfTest) {
  scanText(
    "scan-self-test",
    "en",
    "pricing.note: see https://dragon.dragon.dragon.nuance.com/en-us/dragon",
  )
  if (!hits.length) {
    console.error("[scan-url-corruption] self-test: failed to detect doubled host in secondary field")
    process.exit(1)
  }
  console.log("[scan-url-corruption] self-test OK (doubled-host detector)")
  process.exit(0)
}

for (const name of fs.readdirSync(toolsDir)) {
  if (!name.endsWith(".json")) continue
  const id = name.replace(/\.json$/, "")
  const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, name), "utf8"))
  walk(id, "en", tool)
}

if (fs.existsSync(frPath)) {
  const fr = JSON.parse(fs.readFileSync(frPath, "utf8"))
  for (const [id, overlay] of Object.entries(fr)) walk(id, "fr", overlay)
}

const out = { hitCount: hits.length, hits }
if (asJson) console.log(JSON.stringify(out, null, 2))
else {
  console.log(`URL corruption scan: ${hits.length} hit(s)`)
  for (const h of hits) {
    console.log(`- ${h.id} [${h.lang}] ${h.kind}: …${h.snippet}…`)
  }
}

process.exit(hits.length ? 1 : 0)