import assert from "node:assert/strict"
import { test } from "node:test"
import { spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { getSiteRedirects } from "./site-redirects.mjs"
import {
  expandRedirectSources,
  loadVercelRedirectRules,
  toolPathCaseVariants,
} from "./redirect-sources"
import { resolveRedirectHopCount } from "./redirect-resolve"

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..")

test("toolPathCaseVariants includes Devin casing", () => {
  const variants = toolPathCaseVariants("/tool/Devin")
  assert.ok(variants.includes("/tool/devin"))
  assert.ok(variants.includes("/tool/Devin"))
})

test("expandRedirectSources expands /tools/:id for devin", async () => {
  const rules = await getSiteRedirects()
  const sources = expandRedirectSources(rules, { toolIds: ["devin"], includeCaseVariants: false })
  assert.ok(sources.includes("/tools/devin"))
})

test("expandRedirectSources includes vercel.json /tools/:id pattern", () => {
  const vercelRules = loadVercelRedirectRules()
  const sources = expandRedirectSources(vercelRules, {
    toolIds: ["devin"],
    includeCaseVariants: false,
    skipHostConditionals: true,
  })
  assert.ok(sources.includes("/tools/devin"))
})

test("windsurf trailing slash resolves in one hop", async () => {
  const rules = await getSiteRedirects()
  const hops = resolveRedirectHopCount("/tool/windsurf/", rules)
  assert.equal(hops, 1)
})

test("integration: check-sitemap-redirects exits 0", () => {
  const result = spawnSync("npx", ["tsx", "lib/routing/check-sitemap-redirects.ts"], {
    cwd: repoRoot,
    encoding: "utf8",
    env: process.env,
  })
  assert.equal(result.status, 0, result.stderr || result.stdout)
})