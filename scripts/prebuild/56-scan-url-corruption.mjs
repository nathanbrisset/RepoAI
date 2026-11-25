#!/usr/bin/env node
/**
 * Run corruption scan + verify detector catches injected doubled hosts.
 */
import { execSync } from "child_process"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..")
const scan = path.join(root, "scripts/scan-url-corruption.mjs")

console.log("[56] scan self-test (injected doubled host)")
execSync(`node "${scan}" --self-test`, { cwd: root, stdio: "inherit" })

console.log("[56] catalogue corruption scan")
execSync(`node "${scan}"`, { cwd: root, stdio: "inherit" })
console.log("[56] URL corruption scan OK")