#!/usr/bin/env node
/**
 * Fails when catalogue data leaks into shared client chunks or listing routes exceed budget.
 */
import fs from "node:fs"
import path from "node:path"
import zlib from "node:zlib"

const ROOT = process.cwd()
const CHUNKS_DIR = path.join(ROOT, ".next/static/chunks")
const MANIFEST = path.join(ROOT, ".next/app-build-manifest.json")
const CATALOGUE_ROUTE_MAX_GZIP_BYTES = 300 * 1024

const CATALOGUE_ROUTE_SUFFIXES = ["catalogue/page"]

const CATALOG_MARKERS = [
  "listedTools",
  "directoryRecords(",
  '"howToUse"',
  "queryCatalogRecords",
  "content/tools/index",
]

function fail(message) {
  console.error(`check-client-bundle: ${message}`)
  process.exit(1)
}

function chunkBytes(relativePath) {
  const filePath = path.join(ROOT, ".next", relativePath)
  if (!fs.existsSync(filePath)) return { raw: 0, gzip: 0 }
  const raw = fs.readFileSync(filePath)
  return { raw: raw.length, gzip: zlib.gzipSync(raw).length }
}

function routeGzipBytes(routeKey) {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"))
  const chunks = manifest.pages?.[routeKey]
  if (!chunks) return null
  const unique = [...new Set(chunks)]
  return unique.reduce((sum, rel) => sum + chunkBytes(rel).gzip, 0)
}

function resolveCatalogueRoutes() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"))
  const pages = manifest.pages || {}
  return CATALOGUE_ROUTE_SUFFIXES.flatMap((suffix) =>
    Object.keys(pages).filter((key) => key.includes(suffix)),
  )
}

if (!fs.existsSync(CHUNKS_DIR)) {
  fail(`missing ${CHUNKS_DIR} — run next build first`)
}

const files = fs.readdirSync(CHUNKS_DIR).filter((name) => name.endsWith(".js"))
let largest = { name: "", size: 0 }
const markerViolations = []

for (const name of files) {
  const filePath = path.join(CHUNKS_DIR, name)
  const size = fs.statSync(filePath).size
  if (size > largest.size) largest = { name, size }

  const text = fs.readFileSync(filePath, "utf8")
  const hits = CATALOG_MARKERS.filter((marker) => text.includes(marker))

  if (hits.length >= 2) {
    markerViolations.push({ name, size, hits })
  }
}

const routeBudgets = {}
for (const route of resolveCatalogueRoutes()) {
  const gzipBytes = routeGzipBytes(route)
  if (gzipBytes != null) {
    routeBudgets[route] = { gzipBytes, gzipKb: Math.round(gzipBytes / 1024) }
  }
}

console.log(
  JSON.stringify(
    {
      chunks: files.length,
      largestChunk: largest,
      largestKb: Math.round(largest.size / 1024),
      routeBudgetsGzip: routeBudgets,
      markerViolations,
    },
    null,
    2,
  ),
)

for (const [route, info] of Object.entries(routeBudgets)) {
  if (info.gzipBytes > CATALOGUE_ROUTE_MAX_GZIP_BYTES) {
    fail(`${route} gzip first-load JS ${info.gzipBytes} bytes exceeds ${CATALOGUE_ROUTE_MAX_GZIP_BYTES}`)
  }
}

if (markerViolations.length > 0) {
  fail(JSON.stringify(markerViolations, null, 2))
}

console.log("check-client-bundle: OK")