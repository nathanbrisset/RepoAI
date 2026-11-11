import { spawn, type ChildProcess } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { setTimeout as sleep } from "node:timers/promises"

const root = path.resolve(import.meta.dirname, "..")
const port = 3456
const outFile = path.join(root, "lib/routing/cached-404-html.ts")

async function waitForServer(proc: ChildProcess) {
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`)
      if (response.ok) return
    } catch {
      // retry
    }
    if (proc.exitCode !== null) {
      throw new Error(`next start exited before ready (code ${proc.exitCode})`)
    }
    await sleep(1000)
  }
  throw new Error("next start did not become ready in time")
}

async function fetch404(pathname: string) {
  const response = await fetch(`http://127.0.0.1:${port}${pathname}`)
  return response.text()
}

async function main() {
  const proc = spawn("npx", ["next", "start", "-p", String(port)], {
    cwd: root,
    stdio: "ignore",
    detached: false,
  })

  try {
    await waitForServer(proc)
    const [en, fr] = await Promise.all([fetch404("/nimporte"), fetch404("/fr/nimporte")])
    const contents = `// Auto-generated — npx tsx scripts/snapshot-404-html.ts
export const NOT_FOUND_HTML_EN = ${JSON.stringify(en)}
export const NOT_FOUND_HTML_FR = ${JSON.stringify(fr)}
`
    fs.writeFileSync(outFile, contents)
    console.log(`Wrote ${outFile} (en ${en.length} B, fr ${fr.length} B)`)
  } finally {
    proc.kill("SIGTERM")
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
