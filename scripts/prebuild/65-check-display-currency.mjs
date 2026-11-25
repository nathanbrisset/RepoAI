#!/usr/bin/env node
import path from "node:path"
import { repoRoot, runCommand } from "./_spawn.mjs"

runCommand([
  process.execPath,
  "--experimental-strip-types",
  path.join(repoRoot, "scripts/check-display-currency.mjs"),
  "--check",
])