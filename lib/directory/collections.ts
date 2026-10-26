import type { Locale } from "@/lib/i18n/config"

export const DOOR_IDS = [
  "coding",
  "video",
  "image",
  "music",
  "writing",
  "llm-chatbots",
  "search",
  "sales",
] as const

export const DOOR_ART: Record<(typeof DOOR_IDS)[number], string> = {
  coding: "/art/coding.webp",
  video: "/art/video.webp",
  image: "/art/image.webp",
  music: "/art/music.webp",
  writing: "/art/writing.webp",
  "llm-chatbots": "/art/chat.webp",
  search: "/art/research.webp",
  sales: "/art/business.webp",
}

export type CollectionDef = {
  slug: string
  title: Record<Locale, string>
  blurb: Record<Locale, string>
  ids: string[]
}

/** Editorial paths. Every id is a real catalogue fiche; missing ids are dropped at resolve time. */
export const COLLECTION_DEFS: CollectionDef[] = [
  {
    slug: "kit-shorts-youtube",
    title: { en: "Kit Shorts YouTube", fr: "Kit Shorts YouTube" },
    blurb: {
      en: "From a rough idea to a short people finish watching.",
      fr: "D'une idée brute à un short que l'on regarde jusqu'au bout.",
    },
    ids: ["capcut", "descript", "elevenlabs", "heygen", "runway", "kling"],
  },
  {
    slug: "vibe-coding",
    title: { en: "Vibe coding", fr: "Vibe coding" },
    blurb: {
      en: "Ship a useful app without getting lost in setup.",
      fr: "Sortir une app utile sans se perdre dans l'installation.",
    },
    ids: ["v0-vercel", "bolt", "lovable"],
  },
  {
    slug: "voice-podcast",
    title: { en: "Voice & podcast", fr: "Voix et podcast" },
    blurb: {
      en: "Record, clean and publish without a studio.",
      fr: "Enregistrer, nettoyer et publier sans studio.",
    },
    ids: ["elevenlabs", "descript", "notebooklm"],
  },
  {
    slug: "image-branding",
    title: { en: "Image & branding", fr: "Image et branding" },
    blurb: {
      en: "Make a visual system people remember.",
      fr: "Un système visuel dont on se souvient.",
    },
    ids: ["midjourney", "ideogram", "krea"],
  },
  {
    slug: "research-writing",
    title: { en: "Research & writing", fr: "Recherche et écriture" },
    blurb: {
      en: "Go from a blank page to a clear draft.",
      fr: "De la page blanche à un texte clair.",
    },
    ids: ["perplexity-ai", "elicit", "notion-ai"],
  },
  {
    slug: "go-to-market",
    title: { en: "Solo go-to-market", fr: "Go-to-market solo" },
    blurb: {
      en: "Find the angle, the audience and the words.",
      fr: "Trouver l'angle, l'audience et les mots.",
    },
    ids: ["clay", "jasper", "gamma"],
  },
  {
    slug: "meetings-notes",
    title: { en: "Meetings & notes", fr: "Réunions et notes" },
    blurb: {
      en: "Leave every call with a clear next step.",
      fr: "Sortir de chaque appel avec la prochaine étape.",
    },
    ids: ["granola", "notebooklm", "notion-ai"],
  },
  {
    slug: "everyday-assistants",
    title: { en: "Everyday assistants", fr: "Assistants du quotidien" },
    blurb: {
      en: "Assistants for writing, thinking and talking things through.",
      fr: "Des assistants pour écrire, réfléchir et en parler.",
    },
    ids: ["chatgpt", "claude-3", "pi"],
  },
]

export const FEATURED_STACK_IDS = ["v0-vercel", "runway", "jasper"] as const

export const COMPARE_PRESETS = [
  ["chatgpt", "claude-3"],
  ["cursor", "devin"],
  ["granola", "notebooklm"],
] as const

export type RecipeDef = {
  id: string
  title: Record<Locale, string>
  steps: { id: string; label: Record<Locale, string> }[]
}

export const RECIPE_DEFS: RecipeDef[] = [
  {
    id: "shorts",
    title: {
      en: "Shorts, without the editing spiral",
      fr: "Des shorts, sans la spirale de montage",
    },
    steps: [
      { id: "capcut", label: { en: "CapCut", fr: "CapCut" } },
      { id: "elevenlabs", label: { en: "ElevenLabs", fr: "ElevenLabs" } },
      { id: "descript", label: { en: "Descript", fr: "Descript" } },
    ],
  },
  {
    id: "research",
    title: {
      en: "Research to a clear brief",
      fr: "De la recherche à un brief clair",
    },
    steps: [
      { id: "perplexity-ai", label: { en: "Perplexity", fr: "Perplexity" } },
      { id: "elicit", label: { en: "Elicit", fr: "Elicit" } },
      { id: "notebooklm", label: { en: "NotebookLM", fr: "NotebookLM" } },
    ],
  },
  {
    id: "launch",
    title: {
      en: "Idea to a launch page",
      fr: "D'une idée à une page de lancement",
    },
    steps: [
      { id: "v0-vercel", label: { en: "v0", fr: "v0" } },
      { id: "gamma", label: { en: "Gamma", fr: "Gamma" } },
      { id: "jasper", label: { en: "Jasper", fr: "Jasper" } },
    ],
  },
  {
    id: "meetings",
    title: {
      en: "Meeting to the next step",
      fr: "De la réunion à la prochaine étape",
    },
    steps: [
      { id: "granola", label: { en: "Granola", fr: "Granola" } },
      { id: "notebooklm", label: { en: "NotebookLM", fr: "NotebookLM" } },
      { id: "notion-ai", label: { en: "Notion AI", fr: "Notion AI" } },
    ],
  },
]
