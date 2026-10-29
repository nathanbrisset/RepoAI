import { localLogoIds } from "@/lib/generated/local-logos"

const localLogoSet = new Set<string>(localLogoIds)

/** True when a catalogue path points at a file under public/logos. */
export function isLocalLogoPath(src: string) {
  return src.startsWith("/logos/")
}

/** Drop /logos/... when the PNG is missing; keep https logos as-is. */
export function resolveCatalogLogo(logo: string | undefined | null): string {
  const value = (logo || "").trim()
  if (!value) return ""
  if (!isLocalLogoPath(value)) return value
  const base = value.slice("/logos/".length).replace(/\.(png|webp|jpg|svg)$/i, "")
  if (!localLogoSet.has(base)) return ""
  return value
}
