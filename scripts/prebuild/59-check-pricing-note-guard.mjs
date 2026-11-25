#!/usr/bin/env node
import path from "node:path"
import { spawnSync } from "node:child_process"
import { repoRoot } from "./_spawn.mjs"

const result = spawnSync(
  "npx",
  ["tsx", "--test", path.join(repoRoot, "lib/pricing-note-guard.test.ts")],
  { cwd: repoRoot, stdio: "inherit", env: process.env },
)
if (result.status !== 0) process.exit(result.status ?? 1)