import type { DirectoryRecord } from "@/lib/directory/data"
import { matchesSwipeCountry, type SwipeCountry } from "@/lib/hq-country-filter"
import type { PriceFilter } from "@/lib/price-filter"

export type { SwipeCountry } from "@/lib/hq-country-filter"

export type SwipePlatform = "web" | "mobile" | "desktop" | "api" | "extension"
export type SwipeLearning = "easy" | "medium" | "advanced"
export type SwipeUseCase =
  | "content_creation"
  | "image_generation"
  | "video_editing"
  | "audio_processing"
  | "data_analysis"
  | "coding_assistance"
  | "research"
  | "marketing"
  | "productivity"
  | "design"

export type SwipeFilters = {
  categoryIds: string[]
  pricing: PriceFilter | null
  platform: SwipePlatform | null
  learning: SwipeLearning | null
  useCase: SwipeUseCase | null
  country: SwipeCountry | null
  jobText: string
}

export const DEFAULT_SWIPE_FILTERS: SwipeFilters = {
  categoryIds: [],
  pricing: null,
  platform: null,
  learning: null,
  useCase: null,
  country: null,
  jobText: "",
}

const USE_CASE_KEYWORDS: Record<SwipeUseCase, string[]> = {
  content_creation: ["write", "create", "generate", "content", "blog", "article", "copy"],
  image_generation: ["image", "picture", "photo", "art", "design", "visual"],
  video_editing: ["video", "edit", "create", "produce", "animation"],
  audio_processing: ["audio", "voice", "sound", "music", "podcast"],
  data_analysis: ["analyze", "data", "insights", "metrics", "analytics"],
  coding_assistance: ["code", "programming", "development", "debug", "build"],
  research: ["research", "study", "analyze", "discover", "investigate"],
  marketing: ["marketing", "campaign", "promote", "advertise", "social"],
  productivity: ["productivity", "efficiency", "automate", "workflow", "task"],
  design: ["design", "layout", "ui", "ux", "graphic", "visual"],
}

const PLATFORM_KEYWORDS: Record<SwipePlatform, string[]> = {
  web: ["web", "browser", "saas", "online", "cloud"],
  mobile: ["mobile", "ios", "android", "iphone", "app store", "play store"],
  desktop: ["desktop", "mac", "windows", "linux", "native app"],
  api: ["api", "sdk", "developer", "integration", "mcp"],
  extension: ["extension", "chrome", "plugin", "add-on", "addon"],
}

const LEARNING_EASY = ["no-code", "nocode", "beginner", "simple", "easy", "anyone", "without coding"]
const LEARNING_ADVANCED = ["developer", "engineer", "api", "sdk", "code", "terminal", "enterprise", "devops"]

function haystack(tool: DirectoryRecord): string {
  return [tool.name, tool.description, tool.tags.join(" "), tool.features.join(" ")].join(" ").toLowerCase()
}

function matchesKeywords(text: string, keywords: string[]): boolean {
  return keywords.some((word) => text.includes(word))
}

function matchesPlatform(tool: DirectoryRecord, platform: SwipePlatform): boolean {
  return matchesKeywords(haystack(tool), PLATFORM_KEYWORDS[platform])
}

function matchesLearning(tool: DirectoryRecord, level: SwipeLearning): boolean {
  const text = haystack(tool)
  const easy = matchesKeywords(text, LEARNING_EASY)
  const advanced = matchesKeywords(text, LEARNING_ADVANCED)
  if (level === "easy") return easy && !advanced
  if (level === "advanced") return advanced
  return !easy && !advanced ? true : easy && advanced
}

function matchesUseCase(tool: DirectoryRecord, useCase: SwipeUseCase): boolean {
  const text = haystack(tool)
  const keywords = USE_CASE_KEYWORDS[useCase]
  const hits = keywords.filter((word) => text.includes(word)).length
  return hits >= Math.max(1, Math.ceil(keywords.length * 0.15))
}

function matchesJobText(tool: DirectoryRecord, jobText: string): boolean {
  const needle = jobText.trim().toLowerCase()
  if (!needle) return true
  const tokens = needle.split(/\s+/).filter((t) => t.length > 2)
  if (tokens.length === 0) return haystack(tool).includes(needle)
  const text = haystack(tool)
  const matched = tokens.filter((token) => text.includes(token)).length
  return matched >= Math.ceil(tokens.length * 0.4)
}

export function filterSwipeDeck(records: DirectoryRecord[], filters: SwipeFilters): DirectoryRecord[] {
  if (filters.categoryIds.length === 0) return []

  return records.filter((tool) => {
    if (!tool.categories.some((category) => filters.categoryIds.includes(category))) return false
    if (filters.pricing && tool.priceBucket !== filters.pricing) return false
    if (filters.platform && !matchesPlatform(tool, filters.platform)) return false
    if (filters.learning && !matchesLearning(tool, filters.learning)) return false
    if (filters.useCase && !matchesUseCase(tool, filters.useCase)) return false
    if (filters.country && !matchesSwipeCountry(tool.hqCountry, filters.country)) return false
    if (!matchesJobText(tool, filters.jobText)) return false
    return true
  })
}

export function shuffleDeck<T>(items: T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}
