#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { repoRoot } from "./_spawn.mjs"

const pkgPath = path.join(repoRoot, "package.json")
const raw = fs.readFileSync(pkgPath, "utf8")
const matches = [...raw.matchAll(/"prebuild"\s*:/g)]

if (matches.length !== 1) {
  console.error(
    `package.json must define exactly one "prebuild" script (found ${matches.length} raw "prebuild" keys).`,
  )
  console.error(
    "Duplicate keys merge silently in JSON — use scripts/prebuild/*.mjs instead of adding another prebuild entry.",
  )
  process.exit(1)
}

console.log('package.json: single "prebuild" key OK')