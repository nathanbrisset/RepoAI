#!/usr/bin/env node
/**
 * Run all scripts/prebuild/NN-name.mjs checks in numeric order; stop on first failure.
 */
import fs from "fs"
import path from "path"
import { spawnSync } from "child_process"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const prebuildDir = path.join(root, "scripts/prebuild")

if (!fs.existsSync(prebuildDir)) {
  console.error("Missing scripts/prebuild/")
  process.exit(1)
}

const steps = fs
  .readdirSync(prebuildDir)
  .filter((name) => /^\d{2,}-.+\.mjs$/.test(name))
  .sort((a, b) => {
    const na = Number.parseInt(a, 10)
    const nb = Number.parseInt(b, 10)
    return na - nb
  })

if (!steps.length) {
  console.error("No prebuild steps found in scripts/prebuild/")
  process.exit(1)
}

console.log(`Prebuild runner: ${steps.length} step(s)`)
for (const step of steps) {
  const script = path.join(prebuildDir, step)
  console.log(`\n[prebuild] ${step}`)
  const result = spawnSync(process.execPath, [script], {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  })
  if (result.status !== 0) {
    console.error(`\n[prebuild] failed: ${step} (exit ${result.status ?? 1})`)
    process.exit(result.status ?? 1)
  }
}

console.log("\n[prebuild] all checks passed")