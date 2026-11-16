#!/usr/bin/env node
/**
 * Wrapper — implementation lives in fr-tutoiement-sweep.ts (shared lib/i18n/fr-tutoiement.ts).
 *
 *   node scripts/fr-tutoiement-sweep.mjs [--dry-run] [--slugs-file=path]
 */
import { spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const res = spawnSync("npx", ["tsx", path.join(root, "scripts/fr-tutoiement-sweep.ts"), ...process.argv.slice(2)], {
  stdio: "inherit",
  cwd: root,
})
process.exit(res.status ?? 1)