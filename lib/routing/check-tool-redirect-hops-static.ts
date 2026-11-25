/**
 * Build-time: rename/duplicate tool redirects must resolve in one hop (rule graph).
 *
 *   npx tsx lib/routing/check-tool-redirect-hops-static.ts
 */
import assert from "node:assert/strict"
import { getSiteRedirects } from "./site-redirects.mjs"
import { resolveRedirectHopCount } from "./redirect-resolve"

const RENAME_PAIRS = [
  { from: "gpt-for-sheets", to: "autosheet" },
  { from: "sonauto", to: "treblo" },
  { from: "podcastle", to: "async" },
  { from: "hyprnote", to: "anarlog" },
  { from: "lmarena", to: "arena" },
  { from: "opera-aria", to: "opera-ai" },
  { from: "windsurf", to: "devin" },
  { from: "producer-ai", to: "google-flow-music" },
  { from: "google-whisk", to: "google-flow" },
] as const

async function main() {
  const rules = await getSiteRedirects()
  const sources: string[] = []
  for (const { from } of RENAME_PAIRS) {
    sources.push(`/tool/${from}`, `/fr/tool/${from}`)
  }

  const bad: { source: string; hops: number }[] = []
  for (const source of sources) {
    const hops = resolveRedirectHopCount(source, rules, { skipHostConditionals: true })
    if (hops !== 1) bad.push({ source, hops })
  }

  assert.equal(
    bad.length,
    0,
    `tool redirects must be single-hop: ${bad.map((b) => `${b.source} (${b.hops})`).join(", ")}`,
  )
  console.log(`Tool redirect hop check OK (${sources.length} sources).`)
}

main()