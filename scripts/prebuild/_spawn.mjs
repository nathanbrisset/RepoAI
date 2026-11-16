import { spawnSync } from "child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")

/** @param {string[]} command */
export function runCommand(command) {
  const [bin, ...args] = command
  const result = spawnSync(bin, args, {
    cwd: repoRoot,
    stdio: "inherit",
    env: process.env,
    shell: bin === "npx",
  })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}