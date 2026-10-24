/** Real listed slugs. v0's "v0", "perplexity", and "claude" ids are not in this catalogue. Windsurf is a renamed fiche, so the editor matchup uses Devin. */
export const DOJO_PICKS = [
  {
    id: "vibe",
    titleKey: "directory.pickVibeTitle",
    blurbKey: "directory.pickVibeBlurb",
    slugs: ["v0-vercel", "bolt", "lovable"],
  },
  {
    id: "music-video",
    titleKey: "directory.pickMusicTitle",
    blurbKey: "directory.pickMusicBlurb",
    slugs: ["suno", "kling", "elevenlabs"],
  },
] as const

export const COMPARE_PRESETS = [
  ["granola", "perplexity-ai"],
  ["cursor", "devin"],
  ["chatgpt", "claude-code", "perplexity-ai"],
] as const
