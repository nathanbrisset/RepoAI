#!/usr/bin/env node
/**
 * Fail if visitor-facing fields still mention previous-catalog carryover wording.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const patterns = [
  /ancien catalogue/i,
  /previous catalog/i,
  /carried over from the previous catalog/i,
]

function collectStrings(value, out) {
  if (typeof value === "string") out.push(value)
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out))
  else if (value && typeof value === "object")
    Object.values(value).forEach((v) => collectStrings(v, out))
}

let hits = 0
const fr = JSON.parse(fs.readFileSync(path.join(root, "content/i18n/fr-tools.json"), "utf8"))
const frStrings = []
collectStrings(fr, frStrings)
frStrings.forEach((text) => {
  if (patterns.some((p) => p.test(text))) hits++
})

const toolsDir = path.join(root, "content/tools")
for (const file of fs.readdirSync(toolsDir).filter((n) => n.endsWith(".json"))) {
  const tool = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8"))
  const strings = []
  collectStrings(tool, strings)
  strings.forEach((text) => {
    if (patterns.some((p) => p.test(text))) hits++
  })
}

if (hits > 0) {
  console.error(`ancien-catalogue check failed: ${hits} visitor field hit(s)`)
  process.exit(1)
}
console.log("ancien-catalogue check passed (0 hits).")