/** Shared « À propos » / card summary quality checks for Nat GO imports. */
import crypto from "crypto"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
export const toolsDir = path.join(root, "content/tools")
export const frPath = path.join(root, "content/i18n/fr-tools.json")
export const appliedManifestPath = path.join(root, "data/nat-go-descriptions-applied.json")

/** Golden slugs outside the Nat CSV — served about must stay stable. */
export const REGRESSION_ANCHORS = {
  mage_space: {
    summary_fr:
      "d86cca7bde464adbfa38b981216f45ec8fbeeb560d57001b35cd980bb5b60fdb",
    description_fr:
      "bf88dc17cd70b823fc0619997b586ddd26b5e8d160a970284b66a25ad8503bdd",
    summary_en:
      "b300490f62ea832a4dec2994b726990878873a960276f68582ff6bbad7c11408",
    description_en:
      "4d92efecd43c09dafc6783964b5acde56284c8ad21be9fc9855b0958f288f1e1",
  },
}

export function sha256(text) {
  return crypto.createHash("sha256").update(text || "", "utf8").digest("hex")
}

export function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Detect « Name TLD. » stubs (e.g. 10Web io.) from bad filler scrub / domain truncation.
 */
export function isDomainDotStub(text, tool) {
  const t = (text || "").trim()
  if (!t) return true
  const name = tool?.name || ""
  let tld = ""
  try {
    const host = new URL(tool.url).hostname.replace(/^www\./, "")
    const parts = host.split(".").filter(Boolean)
    tld = parts[parts.length - 1] || ""
  } catch {
    /* ignore */
  }
  if (name && tld) {
    const exact = new RegExp(`^${escapeRegExp(name)}\\s+${escapeRegExp(tld)}\\.?$`, "i")
    if (exact.test(t)) return true
  }
  if (t.length <= 35 && /\s+(io|com|ai|app|dev|co|net|org)\.?$/i.test(t)) {
    const hasFrench = /[àâäéèêëïîôùûüç]/i.test(t)
    if (!hasFrench && t.split(/\s+/).length <= 4) return true
  }
  return false
}

export function isCollapsedCardAndAbout(summary, description) {
  const s = (summary || "").trim()
  const d = (description || "").trim()
  return s === d && s.length > 0 && s.length < 40
}

export function loadFrTools() {
  return JSON.parse(fs.readFileSync(frPath, "utf8"))
}

export function loadListedTools() {
  const frTools = loadFrTools()
  return fs
    .readdirSync(toolsDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(toolsDir, f), "utf8")))
    .filter((t) => !["sunset", "duplicate-of", "renamed", "inactive"].includes(t.status))
    .map((tool) => ({ tool, overlay: frTools[tool.id] || {} }))
}

/** Served copy (matches lib/catalog.ts frenchText precedence). */
export function servedFr(tool, overlay) {
  return {
    summary:
      tool.summary_fr ||
      tool.shortDescription_fr ||
      overlay.summary_fr ||
      overlay.shortDescription_fr ||
      tool.summary,
    description: tool.description_fr || overlay.description_fr || tool.description,
  }
}

export function servedEn(tool) {
  return {
    summary: tool.summary,
    description: tool.description,
  }
}

export function loadNatGoSlugSet() {
  try {
    const manifest = JSON.parse(fs.readFileSync(appliedManifestPath, "utf8"))
    if (Array.isArray(manifest.ids)) return new Set(manifest.ids)
  } catch {
    /* not applied yet */
  }
  return null
}
