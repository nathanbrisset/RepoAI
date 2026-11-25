#!/usr/bin/env node
/**
 * Single-hop check for tool rename/duplicate redirects (no HTTP server).
 */
import { spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const result = spawnSync(
  "npx",
  ["tsx", path.join(root, "lib/routing/check-tool-redirect-hops-static.ts")],
  { cwd: root, stdio: "inherit", encoding: "utf8" },
)

process.exit(result.status ?? 1)