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
    title: { en: "Recipes & stacks", fr: "Recettes et stacks" },
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
    ids: ["capcut", "descript", "elevenlabs", "heygen", "runway", "kling", "2short-ai", "klipa-ai"],
  },
  {
    slug: "vibe-coding",
    title: { en: "Vibe coding", fr: "Code en vibe" },
    blurb: {
      en: "Ship a useful app without getting lost in setup.",
      fr: "Livre une app utile sans te perdre dans l'installation.",
    },
    ids: ["v0-vercel", "bolt", "lovable", "spacefast", "sitelas"],
  },
  {
    slug: "voice-podcast",
    title: { en: "Voice & podcast", fr: "Voix et podcast" },
    blurb: {
      en: "Record, clean and publish without a studio.",
      fr: "Enregistrer, nettoyer et publier sans studio.",
    },
    ids: ["elevenlabs", "descript", "notebooklm", "async", "audo", "transkriptor"],
  },
  {
    slug: "image-branding",
    title: { en: "Image & branding", fr: "Image et identité visuelle" },
    blurb: {
      en: "Make a visual system people remember.",
      fr: "Construis une identité visuelle que l'on retient.",
    },
    ids: ["midjourney", "ideogram", "krea", "logoai", "yofont"],
  },
  {
    slug: "research-writing",
    title: { en: "Research & writing", fr: "Recherche et rédaction" },
    blurb: {
      en: "Go from a blank page to a clear draft.",
      fr: "De la page blanche à un texte clair.",
    },
    ids: ["perplexity-ai", "elicit", "notion-ai", "anara", "reference-checker"],
  },
  {
    slug: "go-to-market",
    title: { en: "Solo go-to-market", fr: "Mise sur le marché solo" },
    blurb: {
      en: "Find the angle, the audience and the words.",
      fr: "Trouver l'angle, l'audience et les mots.",
    },
    ids: ["clay", "jasper", "gamma", "replyhey", "marcora"],
  },
  {
    slug: "meetings-notes",
    title: { en: "Meetings & notes", fr: "Réunions et notes" },
    blurb: {
      en: "Leave every call with a clear next step.",
      fr: "Sortir de chaque appel avec la prochaine étape.",
    },
    ids: ["granola", "notebooklm", "notion-ai", "anarlog", "jottoo"],
  },
  {
    slug: "everyday-assistants",
    title: { en: "Everyday assistants", fr: "Assistants du quotidien" },
    blurb: {
      en: "Assistants for writing, thinking and talking things through.",
      fr: "Des assistants pour écrire, réfléchir et en parler.",
    },
    ids: ["chatgpt", "claude", "pi", "opera-ai"],
  },
  {
    slug: "automatisations-agents",
    title: { en: "Automations & agents", fr: "Automatisations & agents" },
    blurb: {
      en: "Connect your apps so repetitive work runs on its own.",
      fr: "Relie tes apps pour que le travail répétitif avance sans toi.",
    },
    ids: ["n8n", "zapier", "make", "deskferry", "opengeni"],
  },
  {
    slug: "video-longue-youtube",
    title: { en: "Long-form video / YouTube", fr: "Vidéo longue / YouTube" },
    blurb: {
      en: "Plan, edit and ship long-form video people watch to the end.",
      fr: "Planifie, monte et publie une vidéo longue que l'on regarde jusqu'au bout.",
    },
    ids: ["runway", "descript", "heygen", "epivoke", "arsaze"],
  },
  {
    slug: "musique-son",
    title: { en: "Music & sound", fr: "Musique & son" },
    blurb: {
      en: "Sketch tracks and voice without a full studio setup.",
      fr: "Esquisse des morceaux et de la voix sans monter un studio.",
    },
    ids: ["suno", "udio", "elevenlabs", "google-flow-music", "treblo", "ichipitchy"],
  },
  {
    slug: "data-science",
    title: { en: "Data science platforms", fr: "Plateformes data science" },
    blurb: {
      en: "ML frameworks and data platforms for engineers—not general-purpose AI assistants.",
      fr: "Frameworks ML et plateformes data pour les ingénieurs—pas des assistants IA grand public.",
    },
    ids: [
      "databricks",
      "knime",
      "h2o_ai",
      "rapidminer",
      "datarobot",
      "deepnote",
      "hex",
      "alkera",
      "weaviate",
      "count",
      "wren-ai",
      "bigml",
    ],
  },
  {
    slug: "sante",
    title: { en: "Health, with care", fr: "Santé, avec prudence" },
    blurb: {
      en: "Prepare a doctor visit or lighten clinical paperwork. These tools never replace a medical opinion.",
      fr: "Prépare une consultation ou allège la paperasse clinique. Ces outils ne remplacent jamais l'avis d'un médecin.",
    },
    ids: [
      "ada-health",
      "ubie",
      "heidi-health",
      "tandem-health",
      "nabla",
      "openevidence",
      "lifen",
      "skinvision",
      "upheal",
    ],
  },
  {
    slug: "education",
    title: { en: "Teach & learn", fr: "Enseigner et apprendre" },
    blurb: {
      en: "Plan a lesson, make it interactive and help learners practise.",
      fr: "Prépare un cours, rends-le interactif et aide tes élèves à s'entraîner.",
    },
    ids: [
      "magicschool",
      "khanmigo",
      "brisk-teaching",
      "eduaide",
      "teachmate",
      "motqn",
      "makelesson",
      "quizlet",
      "wooclap",
    ],
  },
  {
    slug: "e-commerce",
    title: { en: "Online shop", fr: "Boutique en ligne" },
    blurb: {
      en: "Product photos, listings, emails and support for a small online store.",
      fr: "Photos produit, fiches, emails et support pour ta petite boutique en ligne.",
    },
    ids: [
      "shopify-magic",
      "photoroom",
      "pixelcut",
      "holgo",
      "storetoads",
      "klaviyo-ai",
      "gorgias",
      "finaloop",
      "doofinder",
    ],
  },
  {
    slug: "open-source-cloud",
    title: { en: "Open source, cloud optional", fr: "Open source, cloud en option" },
    blurb: {
      en: "Self-host when you want control, or use the vendor's managed cloud when you want speed.",
      fr: "Héberge-les toi-même pour garder la main, ou passe par le cloud de l'éditeur pour aller vite.",
    },
    ids: [
      "dify",
      "langflow",
      "windmill",
      "kestra",
      "openhands",
      "metabase",
      "rakazo",
      "langfuse",
      "chatwoot",
      "twenty",
      "appflowy",
    ],
  },
  {
    slug: "carriere-cv",
    title: { en: "Career & CV", fr: "Carrière & CV" },
    blurb: {
      en: "Find roles, tailor your resume and get ready for the interview.",
      fr: "Trouve des offres, adapte ton CV et prépare l'entretien.",
    },
    ids: [
      "teal",
      "jobscan",
      "kickresume",
      "rezi",
      "resume-io",
      "jobshifu",
      "hiringnow",
      "prezumi",
      "yoodli",
      "big-interview",
    ],
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
  "claude",
  "perplexity-ai",
  "capcut",
  "descript",
  "notion-ai",
  "v0-vercel",
  "gamma",
] as const

export const COMPARE_PRESETS = [
  ["chatgpt", "claude"],
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
  {
    id: "health-notes",
    title: {
      en: "From consultation to a clean letter",
      fr: "De la consultation au courrier propre",
    },
    intent: {
      en: "For clinicians: draft the note, check the literature, send the document. You stay the one who decides.",
      fr: "Pour les soignants : rédige la note, vérifie la littérature, envoie le document. C'est toi qui décides.",
    },
    steps: [
      { id: "heidi-health", label: { en: "Heidi Health", fr: "Heidi Health" } },
      { id: "openevidence", label: { en: "OpenEvidence", fr: "OpenEvidence" } },
      { id: "lifen", label: { en: "Lifen", fr: "Lifen" } },
    ],
  },
  {
    id: "lesson",
    title: {
      en: "A lesson ready in one evening",
      fr: "Un cours prêt en une soirée",
    },
    intent: {
      en: "Plan the lesson, turn it into exercises, then check what stuck.",
      fr: "Planifie le cours, transforme-le en exercices, puis vérifie ce qui est retenu.",
    },
    steps: [
      { id: "magicschool", label: { en: "MagicSchool", fr: "MagicSchool" } },
      { id: "makelesson", label: { en: "MakeLesson", fr: "MakeLesson" } },
      { id: "quizlet", label: { en: "Quizlet", fr: "Quizlet" } },
    ],
  },
  {
    id: "shop-launch",
    title: {
      en: "Product photo to first sale",
      fr: "De la photo produit à la première vente",
    },
    intent: {
      en: "Clean the photo, write the listing, then bring buyers back by email.",
      fr: "Nettoie la photo, rédige la fiche, puis fais revenir les acheteurs par email.",
    },
    steps: [
      { id: "photoroom", label: { en: "Photoroom", fr: "Photoroom" } },
      { id: "holgo", label: { en: "Holgo", fr: "Holgo" } },
      { id: "klaviyo-ai", label: { en: "Klaviyo AI", fr: "Klaviyo AI" } },
    ],
  },
  {
    id: "oss-stack",
    title: {
      en: "An AI app you can host yourself",
      fr: "Une app IA que tu peux héberger toi-même",
    },
    intent: {
      en: "Build the AI app, run its workflows, then measure the results.",
      fr: "Construis l'app IA, fais tourner ses workflows, puis mesure les résultats.",
    },
    steps: [
      { id: "dify", label: { en: "Dify", fr: "Dify" } },
      { id: "windmill", label: { en: "Windmill", fr: "Windmill" } },
      { id: "metabase", label: { en: "Metabase", fr: "Metabase" } },
    ],
  },
  {
    id: "job-search",
    title: {
      en: "From job ad to a tailored CV",
      fr: "De l'offre au CV ajusté",
    },
    intent: {
      en: "Track the roles you want, tailor the resume, then scan it against the job description.",
      fr: "Suis les offres qui t'intéressent, adapte ton CV, puis compare-le à la fiche de poste.",
    },
    steps: [
      { id: "teal", label: { en: "Teal", fr: "Teal" } },
      { id: "kickresume", label: { en: "Kickresume", fr: "Kickresume" } },
      { id: "jobscan", label: { en: "Jobscan", fr: "Jobscan" } },
    ],
  },
]

/** Recipe ids shown on each collection detail page (recettes-et-stacks shows all). */
export const COLLECTION_RECIPE_IDS: Record<string, string[]> = {
  "recettes-et-stacks": [
    "shorts",
    "shorts-broll",
    "research",
    "launch",
    "meetings",
    "automations",
    "longform-video",
    "music-voice",
    "lesson",
    "shop-launch",
    "oss-stack",
    "job-search",
  ],
  "kit-shorts-youtube": ["shorts", "shorts-broll"],
  "automatisations-agents": ["automations"],
  "video-longue-youtube": ["longform-video"],
  "musique-son": ["music-voice"],
  sante: ["health-notes"],
  education: ["lesson"],
  "e-commerce": ["shop-launch"],
  "open-source-cloud": ["oss-stack"],
  "carriere-cv": ["job-search"],
}
