#!/usr/bin/env node
/**
 * Fails when catalogue data leaks into shared-size client chunks (post-`next build`).
 * Allows a large catalogue-only chunk on listing routes; guards layout/shared bundles.
 */
import fs from "node:fs"
import path from "node:path"

const CHUNKS_DIR = path.join(process.cwd(), ".next/static/chunks")
const SHARED_MAX_BYTES = 500 * 1024
/** Catalogue route chunk (~5 MB); anything smaller must not embed the full catalog. */
const CATALOGUE_ONLY_MIN_BYTES = 3 * 1024 * 1024

const CATALOG_MARKERS = [
  "listedTools",
  "directoryRecords(",
  '"howToUse"',
  "queryCatalogRecords",
  "filterAndRankCatalogSearch",
  "content/tools/index",
]

function fail(message) {
  console.error(`check-client-bundle: ${message}`)
  process.exit(1)
}

if (!fs.existsSync(CHUNKS_DIR)) {
  fail(`missing ${CHUNKS_DIR} — run next build first`)
}

const files = fs.readdirSync(CHUNKS_DIR).filter((name) => name.endsWith(".js"))
let largest = { name: "", size: 0 }
const sharedViolations = []

for (const name of files) {
  const filePath = path.join(CHUNKS_DIR, name)
  const size = fs.statSync(filePath).size
  if (size > largest.size) largest = { name, size }

  if (size >= CATALOGUE_ONLY_MIN_BYTES) continue

  const text = fs.readFileSync(filePath, "utf8")
  const hits = CATALOG_MARKERS.filter((marker) => text.includes(marker))

  if (hits.length >= 2) {
    sharedViolations.push({ name, size, reason: "catalog-markers", hits })
  } else if (size > SHARED_MAX_BYTES) {
    sharedViolations.push({ name, size, reason: "oversized-shared", hits: [] })
  }
}

console.log(
  JSON.stringify(
    {
      chunks: files.length,
      largestChunk: largest,
      largestKb: Math.round(largest.size / 1024),
      sharedViolations,
    },
    null,
    2,
  ),
)

if (sharedViolations.length > 0) {
  fail(JSON.stringify(sharedViolations, null, 2))
}

console.log("check-client-bundle: OK")