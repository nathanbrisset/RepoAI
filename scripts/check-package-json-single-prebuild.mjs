#!/usr/bin/env node
/** Standalone entry: same rule as scripts/prebuild/05-check-package-json-single-prebuild.mjs */
import { spawnSync } from "child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const script = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "prebuild/05-check-package-json-single-prebuild.mjs",
)
const result = spawnSync(process.execPath, [script], { stdio: "inherit" })
process.exit(result.status ?? 1)