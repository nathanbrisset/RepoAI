import { foldMatchText, tokenize } from "./match-copy"
import type { Tool } from "./types"

const GENERIC_TAGS = new Set(["ai", "tool", "tools", "artificial intelligence"])

/** Consumer AI companion / chat-partner fiches (not self-hosted LLM hubs). */
const COMPANION_CHAT_IDS = new Set(["replika", "nomi-ai", "character-ai", "pi", "sesame"])

/** Local / multi-model chat apps that share llm-chatbots but are off-topic next to companions. */
const LLM_HUB_IDS = new Set([
  "librechat",
  "anythingllm",
  "open-webui",
  "gpt4all",
  "khoj",
  "lm-studio",
  "ollama",
  "localai",
  "jan",
])

function companionSignal(tool: Tool): boolean {
  if (COMPANION_CHAT_IDS.has(tool.id)) return true
  const blob = `${tool.description} ${tool.longDescription ?? ""} ${tool.summary_fr ?? ""} ${tool.description_fr ?? ""}`
  return /\bcompanion\b|companionship|compagnon\s+ia\b/i.test(blob)
}

function llmHubOffTopicForCompanion(tool: Tool): boolean {
  if (LLM_HUB_IDS.has(tool.id)) return true
  const blob = `${tool.description} ${tool.longDescription ?? ""}`.toLowerCase()
  if (/\b(self-host|self host|run locally|local llm|offline models)\b/.test(blob)) return true
  if (/\bmultiple models\b|\bmulti-model\b/.test(blob) && !companionSignal(tool)) return true
  return false
}

export const RELATED_TOOLS_MIN = 4
export const RELATED_TOOLS_MAX = 6

function meaningfulTags(tags: string[] | undefined): Set<string> {
  return new Set(
    (tags ?? [])
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 2 && !GENERIC_TAGS.has(tag)),
  )
}

function pricingKey(tool: Tool): string | null {
  if (tool.pricing?.uncertain) return null
  return tool.pricing?.model || tool.pricing?.type || tool.isPremium?.toLowerCase() || null
}

/** Tokens from feature lines (title + body) for overlap scoring. */
function featureTokens(features: string[] | undefined): Set<string> {
  const tokens = new Set<string>()
  for (const line of features ?? []) {
    for (const token of tokenize(line)) tokens.add(token)
  }
  return tokens
}

function sharedCategories(a: Tool, b: Tool): number {
  const bCats = new Set(b.categories)
  return a.categories.filter((cat) => bCats.has(cat)).length
}

function descriptionOverlapScore(base: Tool, candidate: Tool): number {
  const baseTokens = new Set(
    tokenize(foldMatchText(`${base.description} ${base.longDescription ?? ""}`)).slice(0, 24),
  )
  if (baseTokens.size === 0) return 0
  let hits = 0
  for (const token of tokenize(foldMatchText(`${candidate.description} ${candidate.longDescription ?? ""}`))) {
    if (baseTokens.has(token)) hits++
  }
  return Math.min(hits, 6)
}

/** Higher is more similar. Returns -1 when the candidate should be excluded. */
export function scoreRelatedTool(base: Tool, candidate: Tool): number {
  if (base.id === candidate.id) return -1
  const categories = sharedCategories(base, candidate)
  if (categories === 0) return -1

  let score = categories * 4

  const baseTags = meaningfulTags(base.tags)
  for (const tag of meaningfulTags(candidate.tags)) {
    if (baseTags.has(tag)) score += 3
  }

  const basePrice = pricingKey(base)
  const candidatePrice = pricingKey(candidate)
  if (basePrice && candidatePrice && basePrice === candidatePrice) score += 2

  const baseFeatureTokens = featureTokens(base.features)
  const candidateFeatureTokens = featureTokens(candidate.features)
  let featureHits = 0
  for (const token of candidateFeatureTokens) {
    if (baseFeatureTokens.has(token)) featureHits++
  }
  score += Math.min(featureHits, 8)

  score += descriptionOverlapScore(base, candidate)

  if (companionSignal(base)) {
    if (llmHubOffTopicForCompanion(candidate) && !companionSignal(candidate)) return -1
    if (companionSignal(candidate)) score += 8
  }

  return score
}

/**
 * Pick 4–6 listed tools most similar to `tool` by category, tags, features, pricing, and summary overlap.
 * Deterministic for a fixed catalog order (score desc, then id asc).
 */
export function relatedToolsFor(
  tool: Tool,
  pool: Tool[],
  options?: { min?: number; max?: number },
): Tool[] {
  const min = options?.min ?? RELATED_TOOLS_MIN
  const max = options?.max ?? RELATED_TOOLS_MAX

  const ranked = pool
    .map((candidate) => ({ candidate, score: scoreRelatedTool(tool, candidate) }))
    .filter((row) => row.score >= 0)
    .sort((a, b) => b.score - a.score || a.candidate.id.localeCompare(b.candidate.id))

  const strong = ranked.filter((row) => row.score >= 5).map((row) => row.candidate)
  const picked: Tool[] = []
  for (const candidate of strong) {
    if (picked.length >= max) break
    picked.push(candidate)
  }

  if (picked.length < min) {
    for (const row of ranked) {
      if (picked.length >= min) break
      if (!picked.some((item) => item.id === row.candidate.id)) picked.push(row.candidate)
    }
  }

  return picked.slice(0, max)
}
