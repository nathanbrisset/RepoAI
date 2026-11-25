#!/usr/bin/env node
/**
 * Verify tool rename/duplicate redirects are a single hop (curl -sI).
 *   BASE_URL=http://127.0.0.1:3000 node scripts/check-tool-redirect-hops.mjs
 */
import { execSync } from "node:child_process"
import { getSiteRedirects } from "../lib/routing/site-redirects.mjs"

const base = process.env.BASE_URL || "http://127.0.0.1:3000"

const redirects = await getSiteRedirects()
const toolRedirects = redirects.filter(
  (r) =>
    typeof r.source === "string" &&
    (r.source.startsWith("/tool/") || r.source.startsWith("/fr/tool/")) &&
  !r.source.includes(":"),
)

function hops(path) {
  let url = `${base}${path}`
  let chain = []
  for (let i = 0; i < 5; i++) {
    const out = execSync(`curl -sI -o /dev/null -w '%{http_code} %{redirect_url}' '${url}'`, {
      encoding: "utf8",
    }).trim()
    const [code, next] = out.split(/\s+/, 2)
    chain.push(`${url} → ${code}${next ? ` ${next}` : ""}`)
    if (!next || code < 300 || code >= 400) break
    url = next
  }
  const redirectCount = chain.filter((l) => /→ 30[1278]/.test(l)).length
  return { redirectCount, chain }
}

const bad = []
for (const r of toolRedirects) {
  const { redirectCount, chain } = hops(r.source)
  if (redirectCount > 1) bad.push({ source: r.source, destination: r.destination, chain })
}

console.log(`Tool redirect rules checked: ${toolRedirects.length}`)
console.log(`Multi-hop failures: ${bad.length}`)
for (const row of bad.slice(0, 20)) {
  console.log(row.source, "→", row.destination)
  for (const line of row.chain) console.log("  ", line)
}
if (bad.length) process.exit(1)
console.log("All tool redirects are single-hop.")