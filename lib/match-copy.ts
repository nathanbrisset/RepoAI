/**
 * Pure helpers for Find your AI MATCH.
 * Active fiches only. Cards never carry visits, ratings, or affiliateUrl.
 */

import taxonomy from "../content/taxonomy.json" with { type: "json" }

type UiLocale = "en" | "fr"

const enCategoryNames = new Map(
  (taxonomy.categories as { id: string; name: string }[]).map((category) => [category.id, category.name]),
)

const frCategoryNames: Record<string, string> = {
  "llm-chatbots": "Assistants IA",
  "ai-agents": "Agents IA",
  automation: "Automatisation",
  coding: "Code",
  "no-code": "No-code",
  writing: "Écriture",
  image: "Image",
  video: "Vidéo",
  voice: "Voix",
  music: "Musique",
  design: "Design",
  meetings: "Réunions",
  productivity: "Productivité",
  search: "Recherche",
  data: "Données",
  marketing: "Marketing",
  sales: "Vente",
  support: "Support",
  hr: "RH",
  education: "Éducation",
  health: "Santé",
  legal: "Juridique",
  finance: "Finance",
  security: "Sécurité",
  "ai-detection": "Détection IA",
  text: "Texte",
  audio: "Audio",
  "data-processing": "Données",
}

export function categoryLabel(locale: UiLocale, id: string): string {
  if (locale === "fr") return frCategoryNames[id] || enCategoryNames.get(id) || id.replace(/-/g, " ")
  return enCategoryNames.get(id) || id.replace(/-/g, " ")
}

export const MAX_QUERY_LENGTH = 500
export const MIN_QUERY_LENGTH = 3
export const MAX_REASON_WORDS = 25
export const MAX_INTRO_WORDS = 50

export const ERROR_CODES = ["empty", "too_long", "invalid", "captcha", "rate_limited", "no_match", "unavailable"] as const
export type MatchErrorCode = (typeof ERROR_CODES)[number]

export type MatchLang = "en" | "fr" | "es" | "de" | "pt" | "it"

export type MatchTool = {
  id: string
  name: string
  url: string
  logo: string
  image: string
  price: string
  priceUnchecked: boolean
  categories: string[]
  tags: string[]
  summary: string
  features: string[]
}

export type MatchCard = {
  id: string
  name: string
  url: string
  logo: string
  image: string
  price: string
  priceUnchecked: boolean
  reason: string
}

export type MatchPayload = {
  intro: string
  recommendations: MatchCard[]
  related: MatchCard[]
  source: "openai" | "catalog"
  lang: MatchLang
}

const COPY: Record<MatchLang, Record<MatchErrorCode, string>> = {
  en: {
    empty: "Describe what you want to do.",
    too_long: "That request is too long. Keep it under 500 characters.",
    invalid: "Describe what you want to do.",
    captcha: "The check did not pass. Solve it, then try again.",
    rate_limited: "Too many searches from this network. Wait a moment, then try again.",
    no_match: "No active tool matches that request. Describe the task with a bit more detail.",
    unavailable: "AI Match is unavailable right now. Try again in a moment.",
  },
  fr: {
    empty: "Décris ce que tu veux faire.",
    too_long: "Cette demande est trop longue. Reste sous 500 caractères.",
    invalid: "Décris ce que tu veux faire.",
    captcha: "La vérification n'a pas abouti. Refais-la, puis réessaie.",
    rate_limited: "Trop de recherches depuis ce réseau. Patiente un peu, puis réessaie.",
    no_match: "Aucun outil actif ne correspond. Décris la tâche avec un peu plus de détails.",
    unavailable: "AI Match est indisponible pour le moment. Réessaie dans un instant.",
  },
  es: {
    empty: "Describe lo que quieres hacer.",
    too_long: "Esa petición es demasiado larga. No pases de 500 caracteres.",
    invalid: "Describe lo que quieres hacer.",
    captcha: "La verificación no salió bien. Resuélvela y vuelve a intentarlo.",
    rate_limited: "Demasiadas búsquedas desde esta red. Espera un momento y vuelve a intentarlo.",
    no_match: "Ninguna herramienta activa encaja. Describe la tarea con un poco más de detalle.",
    unavailable: "AI Match no está disponible ahora mismo. Inténtalo de nuevo en un momento.",
  },
  de: {
    empty: "Beschreibe, was du machen willst.",
    too_long: "Die Anfrage ist zu lang. Bleib unter 500 Zeichen.",
    invalid: "Beschreibe, was du machen willst.",
    captcha: "Die Prüfung hat nicht geklappt. Löse sie und versuche es erneut.",
    rate_limited: "Zu viele Suchen aus diesem Netz. Warte kurz und versuche es erneut.",
    no_match: "Kein aktives Tool passt dazu. Beschreibe die Aufgabe etwas genauer.",
    unavailable: "AI Match ist gerade nicht verfügbar. Versuche es gleich noch einmal.",
  },
  pt: {
    empty: "Descreva o que você quer fazer.",
    too_long: "Esse pedido é longo demais. Fique abaixo de 500 caracteres.",
    invalid: "Descreva o que você quer fazer.",
    captcha: "A verificação não passou. Resolva e tente de novo.",
    rate_limited: "Muitas buscas nesta rede. Espere um pouco e tente de novo.",
    no_match: "Nenhuma ferramenta ativa corresponde. Descreva a tarefa com um pouco mais de detalhe.",
    unavailable: "O AI Match está indisponível neste momento. Tente de novo em instantes.",
  },
  it: {
    empty: "Descrivi che cosa vuoi fare.",
    too_long: "La richiesta è troppo lunga. Resta sotto i 500 caratteri.",
    invalid: "Descrivi che cosa vuoi fare.",
    captcha: "Il controllo non è riuscito. Risolvilo e riprova.",
    rate_limited: "Troppe ricerche da questa rete. Attendi un momento e riprova.",
    no_match: "Nessuno strumento attivo corrisponde. Descrivi il compito con qualche dettaglio in più.",
    unavailable: "AI Match non è disponibile in questo momento. Riprova tra un momento.",
  },
}

const LANGUAGE_HINTS: Record<Exclude<MatchLang, "en">, string[]> = {
  fr: ["je", "j'ai", "pour", "avec", "une", "des", "les", "creer", "ecrire", "video", "videos", "besoin", "cherche", "veux", "mon", "mes", "dans", "outil", "fais", "faire", "voudrais", "sur", "cette", "dessin"],
  es: ["necesito", "quiero", "para", "crear", "herramienta", "escribir", "busco", "una", "con", "video"],
  de: ["ich", "brauche", "fuer", "für", "erstellen", "werkzeug", "schreiben", "eine", "mit", "moechte", "möchte"],
  pt: ["preciso", "quero", "para", "criar", "ferramenta", "escrever", "uma", "com", "video"],
  it: ["bisogno", "voglio", "creare", "strumento", "scrivere", "per", "una", "con", "video"],
}

const STOP = new Set([
  "the", "and", "for", "with", "you", "your", "that", "this", "from", "have", "need", "want", "help",
  "just", "like", "into", "about", "make", "using", "use", "can", "please", "some", "any", "get",
  "une", "des", "les", "pour", "avec", "dans", "mon", "que", "qui", "est", "pas", "du", "au", "aux",
  "mes", "cette", "comme", "sur", "par", "plus", "une", "the", "and",
  "para", "con", "una", "los", "las", "que", "por", "del",
  "ich", "und", "der", "die", "das", "mit", "fuer", "ein", "eine",
  "uma", "com", "para", "que", "nao",
  "per", "con", "una", "che", "del",
])

const GENERIC_TAGS = new Set(["ai", "tool", "tools", "artificial intelligence"])

const INTENTS: { tokens: string[]; categories: string[] }[] = [
  { tokens: ["video", "videos", "avatar", "clip", "film", "youtube", "montage", "short", "shorts"], categories: ["video"] },
  { tokens: ["image", "picture", "logo", "photo", "icon", "illustration", "dessin", "dessiner", "drawing", "visuel"], categories: ["image", "design"] },
  { tokens: ["write", "writing", "newsletter", "copy", "blog", "ecrire", "écrire", "rediger", "rédiger", "article", "texte"], categories: ["text"] },
  { tokens: ["code", "coding", "python", "github", "debug", "programming", "dev", "developpeur", "développeur"], categories: ["coding"] },
  { tokens: ["voice", "audio", "podcast", "speech", "voix", "voixoff", "son", "musique"], categories: ["audio", "music"] },
  { tokens: ["market", "seo", "campaign", "ads", "pub", "marketing", "vente"], categories: ["marketing", "sales"] },
  { tokens: ["data", "spreadsheet", "analytics", "csv", "donnees", "données", "tableur"], categories: ["data-processing"] },
  { tokens: ["design", "figma", "mockup", "interface", "maquette"], categories: ["design"] },
  { tokens: ["task", "meeting", "email", "calendar", "notes", "reunion", "réunion", "courriel"], categories: ["productivity"] },
  { tokens: ["search", "research", "recherche", "sources", "literature"], categories: ["search"] },
  { tokens: ["chat", "chatbot", "assistant", "llm", "discuter"], categories: ["llm-chatbots"] },
]

type ToolInput = {
  id: string
  name: string
  url: string
  logo?: string
  image?: string
  categories?: string[]
  tags?: string[]
  description?: string
  features?: string[]
  isPremium?: string
  pricing?: { label?: string; verified?: boolean }
  status?: string
  affiliateUrl?: string
  visits?: number
  rating?: number
}

export function toMatchTool(tool: ToolInput): MatchTool | null {
  if (tool.status === "sunset" || tool.status === "duplicate-of") return null
  if (!tool.url || !tool.url.startsWith("https://")) return null
  if (!tool.id || !tool.name) return null
  return {
    id: tool.id,
    name: tool.name,
    url: tool.url,
    logo: tool.logo || "",
    image: tool.image || "",
    price: tool.pricing?.label || tool.isPremium || "",
    priceUnchecked: tool.pricing?.verified === false,
    categories: tool.categories || [],
    tags: tool.tags || [],
    summary: tool.description || "",
    features: tool.features || [],
  }
}

export function toCard(tool: MatchTool, reason: string): MatchCard {
  return {
    id: tool.id,
    name: tool.name,
    url: tool.url,
    logo: tool.logo,
    image: tool.image,
    price: tool.price,
    priceUnchecked: tool.priceUnchecked,
    reason,
  }
}

export function detectLanguage(sample: string): MatchLang {
  const lower = sample.toLowerCase()
  const scores: Record<Exclude<MatchLang, "en">, number> = { fr: 0, es: 0, de: 0, pt: 0, it: 0 }
  if (/[àâçéèêëîïôùûüÿœ]/.test(lower)) scores.fr += 3
  if (/[ñ¿¡]/.test(lower)) scores.es += 4
  if (/[äöüß]/.test(lower)) scores.de += 4
  if (/[ãõ]/.test(lower)) scores.pt += 4
  const tokens = lower.split(/[^a-zàâçéèêëîïôùûüÿœñáíóúãõäöüß']+/i).filter(Boolean)
  for (const token of tokens) {
    const folded = token.normalize("NFD").replace(/\p{M}/gu, "")
    for (const lang of Object.keys(LANGUAGE_HINTS) as (keyof typeof LANGUAGE_HINTS)[]) {
      if (LANGUAGE_HINTS[lang].includes(token) || LANGUAGE_HINTS[lang].includes(folded)) scores[lang] += 1
    }
  }
  let best: MatchLang = "en"
  let bestScore = 1
  for (const lang of Object.keys(scores) as (keyof typeof scores)[]) {
    if (scores[lang] > bestScore) {
      best = lang
      bestScore = scores[lang]
    }
  }
  return best
}

/** Prefer UI locale for FR copy when the prompt looks French or is short on /fr. */
export function resolveMatchLang(query: string, locale?: UiLocale): MatchLang {
  const detected = detectLanguage(query)
  if (locale !== "fr") return detected
  if (detected === "fr") return "fr"
  const lower = query.toLowerCase()
  if (/[àâçéèêëîïôùûüÿœ]/.test(lower)) return "fr"
  const tokens = tokenize(query)
  if (tokens.some((token) => LANGUAGE_HINTS.fr.includes(token))) return "fr"
  return detected
}

const UUID_IN_TEXT =
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi

/** Strip matcher/debug phrasing; keep plain-language reasons for UI. */
export function humanizeReason(text: string): string {
  let cleaned = text.trim()
  cleaned = cleaned.replace(UUID_IN_TEXT, "")
  cleaned = cleaned.replace(/Matched in [^:]+:\s*/gi, "")
  cleaned = cleaned.replace(/"([^"]+)"/g, "$1")
  cleaned = cleaned.replace(/Matches use case:\s*[\w_]+/gi, "")
  cleaned = cleaned.replace(/\bid:\s*[\w-]+/gi, "")
  cleaned = cleaned.replace(/\b(slug|uuid|score|rating|visits)\b:\s*\S+/gi, "")
  cleaned = cleaned.replace(/\b[a-z0-9]+(?:-[a-z0-9]+){2,}\b/gi, (slug) => {
    if (/^[0-9a-f-]{36}$/i.test(slug)) return ""
    if (slug.includes("-") && slug.length > 24) return ""
    return slug
  })
  cleaned = cleaned.replace(/\s{2,}/g, " ").trim()
  if (isUselessReason(cleaned)) return ""
  return limitWords(cleaned, MAX_REASON_WORDS)
}

export function messageForCode(code: unknown, sample = ""): string {
  const lang = detectLanguage(sample)
  const table = COPY[lang]
  if (typeof code === "string" && code in table) return table[code as MatchErrorCode]
  return table.unavailable
}

export function promptProblem(prompt: unknown): "empty" | "too_long" | "invalid" | null {
  if (typeof prompt !== "string") return "invalid"
  const trimmed = prompt.trim()
  if (trimmed.length < MIN_QUERY_LENGTH) return "empty"
  if (trimmed.length > MAX_QUERY_LENGTH) return "too_long"
  return null
}

export function limitWords(text: string, max: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean)
  if (words.length <= max) return words.join(" ")
  return words.slice(0, max).join(" ")
}

export function nameKey(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "")
}

export function namesMatch(catalogName: string, modelName: string): boolean {
  const left = nameKey(catalogName)
  const right = nameKey(modelName)
  return left.length > 0 && left === right
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function nameBoundary(name: string): string {
  const inner = name.trim().split(/\s+/).filter(Boolean).map(escapeRegExp).join("\\s+")
  return `(^|[^A-Za-z0-9])${inner}([^A-Za-z0-9]|$)`
}

export function mentionsForeignTool(text: string, allowedNames: string[], allNames: string[]): boolean {
  let remaining = text
  const allowed = [...allowedNames].sort((a, b) => b.length - a.length)
  for (const name of allowed) {
    if (!name.trim()) continue
    remaining = remaining.replace(new RegExp(nameBoundary(name), "ig"), " ")
  }
  const allowedKeys = new Set(allowedNames.map(nameKey))
  for (const name of allNames) {
    const key = nameKey(name)
    if (key.length < 4 || allowedKeys.has(key)) continue
    if (new RegExp(nameBoundary(name), "i").test(remaining)) return true
  }
  return false
}

export function isUselessReason(text: string): boolean {
  const trimmed = text.trim()
  if (trimmed.length < 12) return true
  if (/^\.?[a-z0-9]{1,12}$/i.test(trimmed)) return true
  if (/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(trimmed)) return true
  const words = trimmed.split(/\s+/).filter(Boolean)
  return words.length < 4
}

export function tokenize(query: string): string[] {
  const normalized = query.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase()
  const parts = normalized.split(/[^a-z0-9+#]+/).filter((token) => token.length >= 3 && !STOP.has(token))
  return [...new Set(parts)]
}

/** Task words that do not appear in the English fiches, mapped to words that do. */
const QUERY_EXPANSIONS: Record<string, string[]> = {
  newsletter: ["email", "writing", "write"],
  bulletin: ["email", "writing", "write"],
  rediger: ["writing", "write"],
  ecrire: ["writing", "write"],
  redaction: ["writing", "write"],
  article: ["writing", "write"],
  blog: ["writing", "write"],
  copywriting: ["writing", "write"],
  courriel: ["email"],
  formation: ["training", "video"],
  avatar: ["avatar", "video"],
  voix: ["voice", "speech", "audio"],
  voixoff: ["voice", "audio"],
  musique: ["music", "audio"],
  traduire: ["translation", "translate"],
  traduction: ["translation", "translate"],
  resumer: ["summary"],
  resume: ["summary"],
  reunion: ["meeting"],
  presentation: ["presentation", "slides"],
  diapositives: ["presentation", "slides"],
  programmation: ["code", "coding"],
  coder: ["code", "coding"],
  python: ["python", "code"],
  donnees: ["data"],
  tableau: ["spreadsheet", "data"],
  chatbot: ["chatbot", "chat"],
  image: ["image"],
  logo: ["logo", "design"],
  photo: ["photo", "image"],
  videos: ["video"],
  video: ["video"],
  dessin: ["design", "image", "illustration", "drawing"],
  dessiner: ["design", "image", "illustration", "drawing"],
  creer: ["create", "video"],
  créer: ["create", "video"],
  faire: ["create", "make"],
  montage: ["video", "edit"],
  recherche: ["research", "search"],
  automatiser: ["automate", "workflow"],
  automatisation: ["automate", "workflow"],
}

export function searchTokens(query: string): string[] {
  const tokens = tokenize(query)
  const expanded = new Set(tokens)
  for (const token of tokens) {
    for (const extra of QUERY_EXPANSIONS[token] || []) {
      if (extra.length >= 3 && !STOP.has(extra)) expanded.add(extra)
    }
  }
  return [...expanded]
}

/** Lowercase + strip accents for consistent query/catalog matching. */
export function foldMatchText(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase()
}

export function tokenMatchVariants(token: string): string[] {
  const variants = new Set<string>([token])
  if (token.length > 3 && token.endsWith("s")) variants.add(token.slice(0, -1))
  if (token.length > 4 && token.endsWith("es")) variants.add(token.slice(0, -2))
  if (token.length >= 3 && !token.endsWith("s")) variants.add(`${token}s`)
  return [...variants]
}

export function textIncludesToken(text: string, token: string): boolean {
  const hay = foldMatchText(text)
  for (const variant of tokenMatchVariants(token)) {
    if (variant.length >= 3 && hay.includes(variant)) return true
  }
  return false
}

function intentCategories(query: string): string[] {
  const tokens = new Set(searchTokens(query))
  const categories = new Set<string>()
  for (const intent of INTENTS) {
    if (intent.tokens.some((token) => tokens.has(token))) {
      intent.categories.forEach((category) => categories.add(category))
    }
  }
  return [...categories]
}

export function rankTools(tools: MatchTool[], query: string, localeHint?: UiLocale): { tool: MatchTool; score: number }[] {
  const tokens = searchTokens(query)
  if (tokens.length === 0) return []
  const uiLocale: UiLocale = localeHint || (detectLanguage(query) === "fr" ? "fr" : "en")
  const rows = tools.map((tool) => {
    const name = foldMatchText(tool.name)
    const summary = foldMatchText(tool.summary)
    const features = foldMatchText(tool.features.join(" "))
    const tags = tool.tags.map((tag) => foldMatchText(tag))
    const categories = tool.categories.flatMap((category) => {
      const label = categoryLabel(uiLocale, category)
      return [foldMatchText(category.replace(/-/g, " ")), foldMatchText(label)]
    })
    let score = 0
    for (const token of tokens) {
      const variants = tokenMatchVariants(token)
      if (variants.some((variant) => name === variant)) score += 12
      else if (variants.some((variant) => textIncludesToken(tool.name, variant))) score += 8
      if (tags.some((tag) => variants.some((variant) => tag.includes(variant)))) score += 5
      if (categories.some((category) => variants.some((variant) => category.includes(variant)))) score += 4
      if (variants.some((variant) => summary.includes(variant))) score += 2
      if (variants.some((variant) => features.includes(variant))) score += 1
    }
    return { tool, score }
  })
  rows.sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name) || a.tool.id.localeCompare(b.tool.id))
  return rows
}

export function shortlist(tools: MatchTool[], query: string, limit = 16): MatchTool[] {
  const ranked = rankTools(tools, query).filter((row) => row.score > 0)
  const picked = ranked.slice(0, limit).map((row) => row.tool)
  if (picked.length >= 8) return picked
  const have = new Set(picked.map((tool) => tool.id))
  const categories = intentCategories(query)
  const extras = tools
    .filter((tool) => !have.has(tool.id) && tool.categories.some((category) => categories.includes(category)))
    .sort((a, b) => a.id.localeCompare(b.id))
  return [...picked, ...extras].slice(0, limit)
}

function displayCategory(lang: MatchLang, categoryId: string): string {
  const locale: UiLocale = lang === "fr" ? "fr" : "en"
  return categoryLabel(locale, categoryId)
}

export function fallbackReason(lang: MatchLang, tool: MatchTool, index = 0): string {
  const category = displayCategory(lang, tool.categories[0] || "llm-chatbots")
  const tag =
    tool.tags.find((item) => item.trim().length > 2 && !GENERIC_TAGS.has(item.toLowerCase())) || category
  const templates: Record<MatchLang, [string, string, string]> = {
    en: [
      `${tool.name} lines up with what you asked for — strong in ${category}, especially around ${tag}.`,
      `${tool.name} is a solid fit here, in ${category}, with ${tag} as a highlight.`,
      `${tool.name} can help with this task — look at ${category} and ${tag}.`,
    ],
    fr: [
      `${tool.name} colle à ce que tu décris — côté ${category}, avec ${tag} en point fort.`,
      `${tool.name} répond bien à ton besoin, dans ${category}, autour de ${tag}.`,
      `${tool.name} est une piste solide pour cette tâche (${category}, ${tag}).`,
    ],
    es: [
      `${tool.name} encaja con lo que pides — fuerte en ${category}, sobre todo en ${tag}.`,
      `${tool.name} es una buena opción aquí, en ${category}, con ${tag} como foco.`,
      `${tool.name} puede ayudar en esta tarea — mira ${category} y ${tag}.`,
    ],
    de: [
      `${tool.name} passt zu deiner Anfrage — stark in ${category}, besonders bei ${tag}.`,
      `${tool.name} ist hier eine gute Wahl unter ${category}, Schwerpunkt ${tag}.`,
      `${tool.name} kann bei dieser Aufgabe helfen — ${category}, vor allem ${tag}.`,
    ],
    pt: [
      `${tool.name} combina com o que você pediu — forte em ${category}, especialmente em ${tag}.`,
      `${tool.name} é uma boa opção aqui, em ${category}, com destaque em ${tag}.`,
      `${tool.name} pode ajudar nesta tarefa — veja ${category} e ${tag}.`,
    ],
    it: [
      `${tool.name} corrisponde a ciò che chiedi — forte in ${category}, soprattutto su ${tag}.`,
      `${tool.name} è una buona scelta qui, in ${category}, con focus su ${tag}.`,
      `${tool.name} può aiutare in questo compito — guarda ${category} e ${tag}.`,
    ],
  }
  return humanizeReason(templates[lang][index % 3]) || limitWords(templates[lang][0], MAX_REASON_WORDS)
}

export function fallbackIntro(lang: MatchLang): string {
  const templates: Record<MatchLang, string> = {
    en: "These active tools from the directory match what you described.",
    fr: "Ces outils encore actifs du répertoire correspondent à ta demande.",
    es: "Estas herramientas activas del directorio encajan con lo que describes.",
    de: "Diese aktiven Tools aus dem Verzeichnis passen zu deiner Anfrage.",
    pt: "Estas ferramentas ativas do diretório correspondem ao que você descreveu.",
    it: "Questi strumenti attivi della directory corrispondono alla tua richiesta.",
  }
  return templates[lang]
}

function safeReason(lang: MatchLang, tool: MatchTool): string {
  const templates: Record<MatchLang, string> = {
    en: `${tool.name} is an active match for this request.`,
    fr: `${tool.name} est une fiche active qui correspond à cette demande.`,
    es: `${tool.name} es una ficha activa que encaja con esta petición.`,
    de: `${tool.name} ist ein aktiver Eintrag und passt zu dieser Anfrage.`,
    pt: `${tool.name} é uma ficha ativa que combina com este pedido.`,
    it: `${tool.name} è una scheda attiva e corrisponde a questa richiesta.`,
  }
  return limitWords(templates[lang], MAX_REASON_WORDS)
}

export function catalogMatch(
  tools: MatchTool[],
  query: string,
  allNames: string[],
  localeHint?: UiLocale,
): Omit<MatchPayload, "related"> | null {
  const lang = resolveMatchLang(query, localeHint)
  const ranked = rankTools(tools, query, localeHint).filter((row) => row.score > 0).slice(0, 3)
  if (ranked.length === 0) return null
  const used = new Set<string>()
  const recommendations: MatchCard[] = []
  for (const row of ranked) {
    if (used.has(row.tool.id)) continue
    used.add(row.tool.id)
    let reason = fallbackReason(lang, row.tool, recommendations.length)
    if (mentionsForeignTool(reason, [row.tool.name], allNames) || isUselessReason(reason)) {
      reason = safeReason(lang, row.tool)
    }
    recommendations.push(toCard(row.tool, reason))
  }
  return { intro: fallbackIntro(lang), recommendations, source: "catalog", lang }
}

export function parseModelJson(content: string): unknown {
  const trimmed = content.trim()
  if (!trimmed) return null
  try {
    return JSON.parse(trimmed)
  } catch {
    const start = trimmed.indexOf("{")
    const end = trimmed.lastIndexOf("}")
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1))
      } catch {
        return null
      }
    }
    return null
  }
}

export function validateModelPayload(
  raw: unknown,
  candidates: MatchTool[],
  allNames: string[],
  lang: MatchLang
): Omit<MatchPayload, "related"> | null {
  if (!raw || typeof raw !== "object") return null
  const record = raw as { intro?: unknown; picks?: unknown }
  if (!Array.isArray(record.picks)) return null
  const byId = new Map(candidates.map((tool) => [tool.id.toLowerCase(), tool]))
  const used = new Set<string>()
  const seenReasons = new Set<string>()
  const recommendations: MatchCard[] = []
  for (const item of record.picks) {
    if (!item || typeof item !== "object") continue
    const pick = item as { id?: unknown; name?: unknown; reason?: unknown }
    if (typeof pick.id !== "string" || typeof pick.name !== "string") continue
    const tool = byId.get(pick.id.trim().toLowerCase())
    if (!tool || !namesMatch(tool.name, pick.name) || used.has(tool.id)) continue
    used.add(tool.id)
    let reason = typeof pick.reason === "string" ? humanizeReason(pick.reason) : ""
    if (
      isUselessReason(reason) ||
      mentionsForeignTool(reason, [tool.name], allNames) ||
      seenReasons.has(nameKey(reason))
    ) {
      reason = fallbackReason(lang, tool, recommendations.length)
    }
    seenReasons.add(nameKey(reason))
    recommendations.push(toCard(tool, reason))
    if (recommendations.length === 3) break
  }
  if (recommendations.length === 0) return null
  let intro = typeof record.intro === "string" ? limitWords(record.intro, MAX_INTRO_WORDS) : ""
  const allowed = recommendations.map((card) => card.name)
  if (
    !intro ||
    intro.length < 8 ||
    /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}$/i.test(intro) ||
    mentionsForeignTool(intro, allowed, allNames) ||
    recommendations.some((card) => nameKey(card.reason) === nameKey(intro))
  ) {
    intro = fallbackIntro(lang)
  }
  return { intro, recommendations, source: "openai", lang }
}

export function relatedCards(tools: MatchTool[], picks: MatchCard[], query: string, allNames: string[] = []): MatchCard[] {
  const main = tools.find((tool) => tool.id === picks[0]?.id)
  const primary = main?.categories[0]
  if (!main || !primary) return []
  const pickIds = new Set(picks.map((card) => card.id))
  const pickReasons = new Set(picks.map((card) => nameKey(card.reason)))
  const mainTags = new Set(
    main.tags.map((tag) => tag.toLowerCase()).filter((tag) => tag.length > 2 && !GENERIC_TAGS.has(tag))
  )
  const tokens = searchTokens(query)
  return tools
    .filter((tool) => !pickIds.has(tool.id) && tool.categories[0] === primary)
    .map((tool) => {
      const shared = tool.tags.filter((tag) => mainTags.has(tag.toLowerCase())).length
      const hay = foldMatchText(`${tool.name} ${tool.summary} ${tool.tags.join(" ")}`)
      const hits = tokens.reduce((count, token) => count + (textIncludesToken(hay, token) ? 1 : 0), 0)
      return { tool, score: shared * 3 + hits * 2 }
    })
    .filter((row) => row.score >= 3)
    .sort((a, b) => b.score - a.score || a.tool.id.localeCompare(b.tool.id))
    .slice(0, 3)
    .map(({ tool }) => {
      const blurb = limitWords(tool.summary, MAX_REASON_WORDS)
      const foreign = allNames.length > 0 && mentionsForeignTool(blurb, [tool.name], allNames)
      const reason = isUselessReason(blurb) || pickReasons.has(nameKey(blurb)) || foreign ? "" : blurb
      return toCard(tool, reason)
    })
}

export function presentCards(value: unknown): MatchCard[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  const cards: MatchCard[] = []
  for (const item of value) {
    if (!item || typeof item !== "object") continue
    const card = item as Partial<MatchCard>
    if (typeof card.id !== "string" || typeof card.name !== "string" || !card.name.trim()) continue
    if (typeof card.url !== "string" || !card.url.startsWith("https://")) continue
    if (seen.has(card.id)) continue
    seen.add(card.id)
    cards.push({
      id: card.id,
      name: card.name,
      url: card.url,
      logo: typeof card.logo === "string" ? card.logo : "",
      image: typeof card.image === "string" ? card.image : "",
      price: typeof card.price === "string" ? card.price : "",
      priceUnchecked: card.priceUnchecked === true,
      reason: typeof card.reason === "string" ? limitWords(card.reason, MAX_REASON_WORDS) : "",
    })
  }
  return cards
}

export function visualSrc(card: MatchCard): string {
  const src = card.logo || card.image
  if (src.startsWith("/") || src.startsWith("https://")) return src
  return ""
}
