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
    slug: "recettes-et-stacks",
    title: { en: "Recipes & stacks", fr: "Recettes & stacks" },
    blurb: {
      en: "Recipes for getting useful work done.",
      fr: "Des recettes pour avancer sur un vrai travail.",
    },
    ids: [
      "capcut",
      "elevenlabs",
      "descript",
      "perplexity-ai",
      "elicit",
      "notebooklm",
      "v0-vercel",
      "gamma",
      "jasper",
      "granola",
      "notion-ai",
    ],
  },
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
  {
    slug: "automatisations-agents",
    title: { en: "Automations & agents", fr: "Automatisations & agents" },
    blurb: {
      en: "Connect your apps so repetitive work runs on its own.",
      fr: "Relie tes apps pour que le travail répétitif avance sans toi.",
    },
    ids: ["n8n", "zapier", "make"],
  },
  {
    slug: "video-longue-youtube",
    title: { en: "Long-form video / YouTube", fr: "Vidéo longue / YouTube" },
    blurb: {
      en: "Plan, edit and ship long-form video people watch to the end.",
      fr: "Planifie, monte et publie une vidéo longue que l'on regarde jusqu'au bout.",
    },
    ids: ["runway", "descript", "heygen"],
  },
  {
    slug: "musique-son",
    title: { en: "Music & sound", fr: "Musique & son" },
    blurb: {
      en: "Sketch tracks and voice without a full studio setup.",
      fr: "Esquisse des morceaux et de la voix sans monter un studio.",
    },
    ids: ["suno", "udio", "elevenlabs"],
  },
]

/** Home grid: these four paths surface before other collections. */
export const HOME_FEATURED_COLLECTION_SLUGS = [
  "kit-shorts-youtube",
  "automatisations-agents",
  "video-longue-youtube",
  "musique-son",
] as const

export const FEATURED_STACK_IDS = ["v0-vercel", "runway", "jasper"] as const

/** Hand-curated home picks — short copy, strong tools (not random catalogue draw). */
export const DOJO_PICK_IDS = [
  "chatgpt",
  "claude-3",
  "perplexity-ai",
  "capcut",
  "descript",
  "notion-ai",
  "v0-vercel",
  "gamma",
] as const

export const COMPARE_PRESETS = [
  ["chatgpt", "claude-3"],
  ["cursor", "devin"],
  ["granola", "notebooklm"],
] as const

export type RecipeDef = {
  id: string
  title: Record<Locale, string>
  intent: Record<Locale, string>
  steps: { id: string; label: Record<Locale, string> }[]
}

export const RECIPE_DEFS: RecipeDef[] = [
  {
    id: "shorts",
    title: {
      en: "Shorts, without the editing spiral",
      fr: "Des shorts, sans la spirale de montage",
    },
    intent: {
      en: "From a rough idea to a short people finish watching.",
      fr: "D'une idée brute à un short que l'on regarde jusqu'au bout.",
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
    intent: {
      en: "Go from a blank page to a clear draft.",
      fr: "De la page blanche à un texte clair.",
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
    intent: {
      en: "A practical stack for turning one idea into a landing page, a video, and a launch post.",
      fr: "Un stack pratique pour transformer une idée en page, en vidéo et en post de lancement.",
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
    intent: {
      en: "Leave every call with a clear next step.",
      fr: "Sortir de chaque appel avec la prochaine étape.",
    },
    steps: [
      { id: "granola", label: { en: "Granola", fr: "Granola" } },
      { id: "notebooklm", label: { en: "NotebookLM", fr: "NotebookLM" } },
      { id: "notion-ai", label: { en: "Notion AI", fr: "Notion AI" } },
    ],
  },
  {
    id: "shorts-broll",
    title: {
      en: "B-roll and hooks without a shoot",
      fr: "Des plans B-roll et des hooks sans tournage",
    },
    intent: {
      en: "Generate visuals and avatars when you cannot film everything yourself.",
      fr: "Génère des visuels et des avatars quand tu ne peux pas tout filmer toi-même.",
    },
    steps: [
      { id: "runway", label: { en: "Runway", fr: "Runway" } },
      { id: "heygen", label: { en: "HeyGen", fr: "HeyGen" } },
      { id: "kling", label: { en: "Kling", fr: "Kling" } },
    ],
  },
  {
    id: "automations",
    title: {
      en: "Lead to follow-up, on autopilot",
      fr: "Du lead au suivi, en pilote automatique",
    },
    intent: {
      en: "Connect your apps so repetitive hand-offs run without copy-paste.",
      fr: "Relie tes apps pour que les passages répétitifs avancent sans copier-coller.",
    },
    steps: [
      { id: "n8n", label: { en: "n8n", fr: "n8n" } },
      { id: "zapier", label: { en: "Zapier", fr: "Zapier" } },
      { id: "make", label: { en: "Make", fr: "Make" } },
    ],
  },
  {
    id: "longform-video",
    title: {
      en: "Long video from script to publish",
      fr: "Vidéo longue, du script à la publication",
    },
    intent: {
      en: "Plan, edit and ship long-form video people watch to the end.",
      fr: "Planifie, monte et publie une vidéo longue que l'on regarde jusqu'au bout.",
    },
    steps: [
      { id: "descript", label: { en: "Descript", fr: "Descript" } },
      { id: "runway", label: { en: "Runway", fr: "Runway" } },
      { id: "heygen", label: { en: "HeyGen", fr: "HeyGen" } },
    ],
  },
  {
    id: "music-voice",
    title: {
      en: "Track sketch and voice in one pass",
      fr: "Esquisse de morceau et voix en une passe",
    },
    intent: {
      en: "Sketch tracks and voice without a full studio setup.",
      fr: "Esquisse des morceaux et de la voix sans monter un studio.",
    },
    steps: [
      { id: "suno", label: { en: "Suno", fr: "Suno" } },
      { id: "udio", label: { en: "Udio", fr: "Udio" } },
      { id: "elevenlabs", label: { en: "ElevenLabs", fr: "ElevenLabs" } },
    ],
  },
]

/** Recipe ids shown on each collection detail page (recettes-et-stacks shows all). */
export const COLLECTION_RECIPE_IDS: Record<string, string[]> = {
  "recettes-et-stacks": ["shorts", "shorts-broll", "research", "launch", "meetings", "automations", "longform-video", "music-voice"],
  "kit-shorts-youtube": ["shorts", "shorts-broll"],
  "automatisations-agents": ["automations"],
  "video-longue-youtube": ["longform-video"],
  "musique-son": ["music-voice"],
}
