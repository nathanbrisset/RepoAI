#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"

const BASE = process.env.BASE_URL || "http://127.0.0.1:3000"
const OUT = process.env.OUT_DIR || "/opt/cursor/artifacts/lighthouse-mobile"
const ROUTES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["/", "/catalogue", "/recommendation", "/collections/vibe-coding"]

function runLighthouse(url) {
  const out = spawnSync(
    "npx",
    [
      "lighthouse",
      url,
      "--only-categories=performance",
      "--form-factor=mobile",
      "--screenEmulation.mobile",
      "--quiet",
      "--output=json",
      "--output-path=stdout",
      "--chrome-flags=--headless --no-sandbox",
    ],
    { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 },
  )
  if (out.status !== 0) {
    throw new Error(out.stderr || out.stdout || `lighthouse failed for ${url}`)
  }
  return JSON.parse(out.stdout)
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true })
  const rows = []
  for (const route of ROUTES) {
    const url = `${BASE}${route}`
    const report = runLighthouse(url)
    const perf = report.categories.performance.score
    const lcp = report.audits["largest-contentful-paint"]?.numericValue
    const tbt = report.audits["total-blocking-time"]?.numericValue
    rows.push({
      route,
      performance: Math.round((perf ?? 0) * 100),
      lcpMs: lcp != null ? Math.round(lcp) : null,
      tbtMs: tbt != null ? Math.round(tbt) : null,
    })
    console.log(`${route}: perf=${Math.round((perf ?? 0) * 100)} LCP=${Math.round(lcp ?? 0)}ms TBT=${Math.round(tbt ?? 0)}ms`)
  }
  fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify(rows, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})