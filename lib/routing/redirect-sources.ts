import fs from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { listedTools } from "../catalog"

export type RedirectRule = {
  source: string
  destination?: string
  permanent?: boolean
  has?: unknown[]
}

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..")

export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") return "/"
  const withoutQuery = pathname.split("?")[0].split("#")[0]
  return withoutQuery.endsWith("/") ? withoutQuery.slice(0, -1) : withoutQuery
}

export function toolPathCaseVariants(pathname: string): string[] {
  const match = pathname.match(/^(\/fr)?\/tool\/([^/]+)(\/)?$/i)
  if (!match) return [normalizePathname(pathname)]
  const prefix = match[1] ?? ""
  const id = match[2]
  const slash = match[3] ?? ""
  const lowerId = id.toLowerCase()
  const lower = `${prefix}/tool/${lowerId}${slash}`
  const title =
    lowerId.length > 0
      ? `${prefix}/tool/${lowerId[0].toUpperCase()}${lowerId.slice(1)}${slash}`
      : lower
  return [...new Set([normalizePathname(lower), normalizePathname(title)])]
}

function expandDynamicSources(source: string, toolIds: string[]): string[] {
  if (!source.includes(":")) return [source]
  const out: string[] = []
  if (source.includes(":id")) {
    for (const id of toolIds) {
      out.push(source.replace(/:id/g, id))
    }
  }
  if (source.includes(":path*")) {
    out.push(source.replace(/:path\*/g, ""))
  }
  return out
}

export async function loadNextRedirectRules(): Promise<RedirectRule[]> {
  const mod = await import(pathToFileURL(path.join(repoRoot, "lib/routing/site-redirects.mjs")).href)
  return mod.getSiteRedirects()
}

export function loadVercelRedirectRules(): RedirectRule[] {
  const vercelPath = path.join(repoRoot, "vercel.json")
  const parsed = JSON.parse(fs.readFileSync(vercelPath, "utf8")) as { redirects?: RedirectRule[] }
  return parsed.redirects ?? []
}

export function expandRedirectSources(
  rules: RedirectRule[],
  options?: { toolIds?: string[]; includeCaseVariants?: boolean; skipHostConditionals?: boolean },
): string[] {
  const toolIds = options?.toolIds ?? listedTools.map((tool) => tool.id)
  const expanded = new Set<string>()

  for (const rule of rules) {
    if (options?.skipHostConditionals !== false && rule.has?.length) continue
    const literals = expandDynamicSources(rule.source, toolIds)
    for (const literal of literals) {
      const normalized = normalizePathname(literal)
      expanded.add(normalized)
      if (options?.includeCaseVariants !== false) {
        for (const variant of toolPathCaseVariants(literal)) expanded.add(variant)
      }
    }
  }

  return [...expanded].sort()
}

export async function allRedirectSourcePathnames(): Promise<string[]> {
  const nextRules = await loadNextRedirectRules()
  const vercelRules = loadVercelRedirectRules()
  return expandRedirectSources([...vercelRules, ...nextRules])
}