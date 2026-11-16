import type { RedirectRule } from "./redirect-sources"
import { normalizePathname } from "./redirect-sources"

function matchSource(pathname: string, source: string): boolean {
  const normalized = normalizePathname(pathname)
  const pattern = normalizePathname(source)

  if (!pattern.includes(":")) {
    return normalized === pattern
  }

  if (pattern.endsWith("/:path*") || pattern === "/:path*") {
    return true
  }

  const idMatch = pattern.match(/^(\/fr)?\/tool\/:id$/)
  if (idMatch) {
    const re = new RegExp(`^${idMatch[1] ?? ""}/tool/[^/]+$`)
    return re.test(normalized)
  }

  const nestedTool = pattern.match(/^(\/fr)?\/tool\/tool\/:id$/)
  if (nestedTool) {
    const re = new RegExp(`^${nestedTool[1] ?? ""}/tool/tool/[^/]+$`)
    return re.test(normalized)
  }

  const toolsAlias = pattern.match(/^(\/fr)?\/tools\/:id$/)
  if (toolsAlias) {
    const re = new RegExp(`^${toolsAlias[1] ?? ""}/tools/[^/]+$`)
    return re.test(normalized)
  }

  return normalized === pattern
}

export function resolveRedirectHopCount(
  pathname: string,
  rules: RedirectRule[],
  options?: { skipHostConditionals?: boolean; maxHops?: number },
): number {
  const maxHops = options?.maxHops ?? 10
  let current = pathname
  let hops = 0

  for (let attempt = 0; attempt < maxHops; attempt++) {
    const rule = rules.find(
      (entry) =>
        (options?.skipHostConditionals !== false ? !entry.has?.length : true) &&
        matchSource(current, entry.source),
    )
    if (!rule?.destination) break

    hops += 1
    if (rule.destination.startsWith("http")) {
      return hops
    }
    current = rule.destination
  }

  return hops
}