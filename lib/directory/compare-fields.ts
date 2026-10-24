import type { DirectoryTool } from "./tools"

const PRICE = /(?:\$|€|£)\s?\d{1,6}(?:[.,]\d{1,2})?|\d{1,6}(?:[.,]\d{1,2})?\s?(?:USD|EUR|GBP)\b/i

export function startingPrice(details?: string) {
  if (!details) return null
  const match = details.match(PRICE)
  return match ? match[0].replace(/\s+/g, " ").trim() : null
}

export function freePlan(tool: DirectoryTool): "yes" | "no" | null {
  if (tool.uncertain) return null
  const model = tool.pricingModel
  if (model === "free" || model === "open-source" || model === "freemium") return "yes"
  if (model === "paid" || model === "enterprise" || model === "usage-based" || model === "one-time") return "no"
  if (!model && !tool.pricingLabel) return null
  return tool.pricingLabel ? "no" : null
}
