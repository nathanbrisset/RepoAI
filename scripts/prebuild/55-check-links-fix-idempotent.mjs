#!/usr/bin/env node
/**
 * Ensure links-fix script is a no-op on the committed catalogue (idempotent).
 */
import { execSync } from "child_process"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..")
const script = path.join(root, "scripts/links-fix-2026-11-16.mjs")

const catalogPaths = ["content/tools", "content/i18n/fr-tools.json"]

function porcelain() {
  return execSync(`git status --porcelain -- ${catalogPaths.join(" ")}`, {
    cwd: root,
    encoding: "utf8",
  }).trim()
}

console.log("[55] links-fix first pass")
execSync(`node "${script}"`, { cwd: root, stdio: "inherit" })
const afterFirst = porcelain()

console.log("[55] links-fix second pass")
execSync(`node "${script}"`, { cwd: root, stdio: "inherit" })
const afterSecond = porcelain()

if (afterFirst !== afterSecond) {
  console.error("[55] links-fix is not idempotent; working tree changed on second pass")
  console.error("after first:\n", afterFirst || "(clean)")
  console.error("after second:\n", afterSecond || "(clean)")
  process.exit(1)
}

execSync(`node "${script}" --check`, { cwd: root, stdio: "inherit" })
console.log("[55] links-fix idempotency OK")