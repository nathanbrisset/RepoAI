/**
 * One-shot migration from lib/data.tsx (restore3-new) into content/tools/*.json.
 * Re-run only if you still have the legacy array in lib/data.tsx.
 * After migration, edit the JSON files directly and run: node scripts/catalog-index.mjs
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const VERIFIED = "2026-10-21"
const outDir = path.join(root, "content", "tools")
const logoDir = path.join(root, "public", "logos")

const src = fs.readFileSync(path.join(root, "lib", "data.tsx"), "utf8")
const marker = "export const mockTools: Tool[] = "
const start = src.indexOf(marker)
if (start < 0) {
  console.error("mockTools array not found. Catalog JSON is already the source; edit the JSON files.")
  process.exit(1)
}
const end = src.lastIndexOf("];")
const body = src.slice(start + marker.length, end + 1)
const legacy = Function(`"use strict"; return (${body});`)()

let checks = []
try {
  checks = JSON.parse(fs.readFileSync("/tmp/url-checks.json", "utf8"))
} catch {
  checks = []
}
const checkById = Object.fromEntries(checks.map((c) => [c.id, c]))

function humanTag(tag) {
  const cleaned = String(tag)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  if (!cleaned) return ""
  return cleaned
    .split(" ")
    .map((word) => {
      if (word.toUpperCase() === word && word.length <= 4) return word
      if (/^(ai|seo|api|sql|ui|ux|tts|llm|ide|crm|b2b|3d)$/i.test(word)) return word.toUpperCase()
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(" ")
}

function goodMeta(text) {
  if (!text) return false
  const t = text.replace(/\s+/g, " ").trim()
  if (t.length < 40 || t.length > 320) return false
  if (/cookie|just a moment|enable javascript|access denied|403/i.test(t)) return false
  return true
}

function isGeneric(text) {
  const t = text.trim()
  return t.length < 90 || /is an AI tool/i.test(t)
}

function normUrl(url) {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, "")
    const pathname = u.pathname.replace(/\/$/, "")
    return `${host}${pathname}`
  } catch {
    return url
  }
}

function validUrl(url) {
  try {
    const u = new URL(url)
    return u.protocol === "https:" || u.protocol === "http:"
  } catch {
    return false
  }
}

function cleanHowTo(steps) {
  if (!Array.isArray(steps)) return undefined
  const out = []
  for (const step of steps) {
    if (!step?.title || !step?.description) continue
    const links = (step.links || []).filter((l) => l?.label && validUrl(l.url))
    const item = { title: String(step.title), description: String(step.description) }
    if (links.length) item.links = links.map((l) => ({ label: String(l.label), url: l.url }))
    out.push(item)
  }
  return out.length ? out : undefined
}

function legacyPricing(tool, url) {
  let host = ""
  try {
    host = new URL(url).hostname
  } catch {
    host = ""
  }
  if (host === "github.com") {
    return {
      model: "open-source",
      label: "Open source",
      verified: false,
      note: "The official link is a GitHub repository. The license and any paid hosting were not rechecked.",
    }
  }
  const map = {
    Free: ["free", "Free"],
    Freemium: ["freemium", "Freemium"],
    Premium: ["paid", "Premium"],
  }
  const pair = map[tool.isPremium] || ["freemium", "Freemium"]
  return {
    model: pair[0],
    label: pair[1],
    verified: false,
    note: "Price label carried over from the previous catalog and not rechecked.",
  }
}

function baseRecord(tool) {
  const check = checkById[tool.id]
  let url = tool.url
  if (check?.final && validUrl(check.final) && check.code && check.code < 400) {
    const final = check.final.split("?")[0]
    if (!final.includes("utm_")) url = final
  }
  const meta = goodMeta(check?.description) ? check.description : goodMeta(check?.og) ? check.og : ""
  const summary = isGeneric(tool.description) && meta ? meta : tool.description.trim()
  const featureSentences = (tool.features || []).slice(0, 4).map((f) => f.trim())
  const descriptionParts = [summary]
  if (meta && meta !== summary) descriptionParts.push(meta)
  if (featureSentences.length) descriptionParts.push(featureSentences.join(" "))
  const tags = []
  const seen = new Set()
  for (const tag of tool.tags || []) {
    const next = humanTag(tag)
    const key = next.toLowerCase()
    if (!next || seen.has(key)) continue
    seen.add(key)
    tags.push(next)
  }
  if (!tags.length) tags.push("AI")
  let dateAdded = tool.dateAdded
  let dateAddedNote
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateAdded || "") || dateAdded < "2019-01-01") {
    dateAddedNote = `The previous Added date was ${tool.dateAdded || "missing"}. It was removed because it is not a credible date for this directory.`
    dateAdded = null
  }
  const imagePath = tool.image && fs.existsSync(path.join(root, "public", tool.image)) ? tool.image : ""
  const record = {
    id: tool.id,
    name: tool.name,
    url,
    affiliateUrl: "",
    status: "active",
    summary,
    description: descriptionParts.join("\n\n"),
    categories: tool.categories.filter((c) =>
      ["text", "image", "audio", "video", "coding", "marketing", "productivity", "data-processing", "design"].includes(c)
    ),
    tags,
    pricing: legacyPricing(tool, url),
    logo: "",
    image: imagePath,
    dateAdded,
    lastVerified: null,
  }
  if (!record.categories.length) record.categories = ["productivity"]
  if (dateAddedNote) record.dateAddedNote = dateAddedNote
  const features = (tool.features || []).map((f) => String(f).trim()).filter(Boolean)
  if (features.length) record.features = features
  const howTo = cleanHowTo(tool.howToUse)
  if (howTo) record.howToUse = howTo
  return record
}

function apply(record, patch) {
  const next = { ...record, ...patch, lastVerified: VERIFIED }
  if (patch.pricing) next.pricing = { ...record.pricing, ...patch.pricing }
  if (patch.sources) next.sources = patch.sources
  return next
}

const records = legacy.map(baseRecord)
const byId = Object.fromEntries(records.map((r) => [r.id, r]))

function must(id) {
  if (!byId[id]) throw new Error(`Missing id ${id}`)
  return byId[id]
}

// Duplicate URLs: keep the longer summary, point the other card at it.
const groups = new Map()
for (const record of records) {
  const key = normUrl(record.url)
  if (!groups.has(key)) groups.set(key, [])
  groups.get(key).push(record)
}
const preferredCanonical = {
  "otter.ai": "otter",
  "datarobot.com": "datarobot",
  "github.com/smythos/sre": "ink",
}
for (const group of groups.values()) {
  if (group.length < 2) continue
  const preferred = group.find((record) => preferredCanonical[normUrl(record.url)] === record.id)
  const ranked = group.slice().sort((a, b) => b.summary.length - a.summary.length)
  const keep = preferred || ranked[0]
  for (const extra of group.filter((record) => record !== keep)) {
    extra.status = "duplicate-of"
    extra.successorId = keep.id
    extra.statusNote = `Same official URL as ${keep.name}. Kept so /tool/${extra.id} does not disappear.`
    extra.lastVerified = VERIFIED
  }
}

Object.assign(must("jasper"), apply(must("jasper"), {
  summary: "Marketing AI for on-brand copy, campaigns, and content workflows.",
  description:
    "Jasper is a marketing platform for writing and campaign work. On 21 October 2026 its pricing page listed two plans: Pro at $69 per seat each month, or $59 per seat each month billed annually, and Business at a custom price. There is no ongoing free plan. A 7-day Pro trial asks for a card and converts to paid if it is not cancelled.",
  pricing: {
    model: "paid",
    label: "Premium",
    verified: true,
    sourceUrl: "https://www.jasper.ai/pricing",
    note: "Pro $69/seat/month, or $59/seat/month billed annually. Business is custom. 7-day trial, no free plan.",
  },
  sources: ["https://www.jasper.ai/pricing", "https://www.jasper.ai"],
}))

Object.assign(must("conversion-ai"), apply(must("conversion-ai"), {
  status: "sunset",
  summary: "Former copywriting brand. The domain now presents a different product.",
  description:
    "Conversion.ai was an earlier name of the Jasper copywriter. On 21 October 2026, conversion.ai answered with the title “Conversion | AI-Native B2B Marketing Automation Platform” and described an agentic marketing product, not the old copy tool. Jasper is the successor of the copywriting product. This card is not a free writing tool.",
  pricing: {
    model: "paid",
    label: "Premium",
    verified: false,
    note: "The old Free label was wrong. No current price was read for the product now on this domain.",
  },
  sources: ["https://conversion.ai/", "https://www.jasper.ai"],
  statusNote: "Domain checked 21 October 2026. It is not the old Conversion.ai copywriter and it is not jasper.ai.",
}))

Object.assign(must("copysmith"), apply(must("copysmith"), {
  status: "sunset",
  url: "https://www.copysmith.ai/",
  summary: "The old Copysmith copywriter is no longer sold under that name.",
  description:
    "Copysmith’s site now describes the company as the parent of Frase, Describely, and Rytr. The previous card treated Copysmith as a free marketing writer. That product is not what the homepage sells.",
  pricing: {
    model: "paid",
    label: "Premium",
    verified: false,
    sourceUrl: "https://www.copysmith.ai/",
    note: "Not free. No current price for the discontinued copywriter was published on the homepage.",
  },
  sources: ["https://www.copysmith.ai/"],
  statusNote: "Homepage checked 21 October 2026.",
}))

Object.assign(must("papercup"), apply(must("papercup"), {
  status: "sunset",
  url: "https://www.papercup.com",
  summary: "AI video dubbing service that has shut down. The domain redirects to RWS.",
  description:
    "Papercup dubbed video into other languages. On 21 October 2026, papercup.com redirected to an RWS localization page for AI dubbing and voice-over, with a campaign parameter naming a Papercup migration. The standalone product is not available.",
  pricing: {
    model: "paid",
    label: "Premium",
    verified: false,
    note: "The old Premium label is historical. There is no Papercup plan to buy.",
  },
  sources: ["https://www.papercup.com"],
  statusNote: "Redirect observed 21 October 2026.",
}))

Object.assign(must("hourone"), apply(must("hourone"), {
  status: "sunset",
  summary: "Avatar video platform. The site no longer completes a TLS handshake.",
  description:
    "Hour One turned scripts into presenter videos. On 21 October 2026, hourone.ai failed during the TLS handshake, so the Visit link does not open. Independent write-ups say Wix acquired the company in 2025 and the standalone app was discontinued. This pass did not read a vendor shutdown notice.",
  pricing: {
    model: "paid",
    label: "Premium",
    verified: false,
    note: "No live pricing page. The previous Premium label was not rechecked.",
  },
  statusNote: "TLS handshake failed on 21 October 2026.",
}))

Object.assign(must("playht"), apply(must("playht"), {
  status: "sunset",
  summary: "Text-to-speech service whose domain no longer resolves.",
  description:
    "Play.ht was a text-to-speech product. On 21 October 2026, www.play.ht had no DNS address. A third-party shutdown list dates the closure to 31 December 2025. This pass did not open a vendor notice.",
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: false,
    note: "No live site, so the old price was not rechecked.",
  },
  statusNote: "DNS failure on 21 October 2026.",
}))

const deadDns = [
  ["myedit", "https://myedit.io"],
  ["codesquire", "https://codesquire.ai/"],
  ["sweep-ai", "https://sweep.dev/"],
  ["peech", "https://www.peech-ai.com"],
]
for (const [id] of deadDns) {
  if (!byId[id]) continue
  Object.assign(byId[id], apply(byId[id], {
    status: "sunset",
    statusNote: "The official URL did not resolve on 21 October 2026. A vendor shutdown notice was not found in this pass.",
    description: `${byId[id].summary}\n\nThe previous website did not resolve on 21 October 2026, so the card is marked closed until someone confirms a new URL.`,
  }))
}
if (byId["voicemyai"]) {
  Object.assign(byId["voicemyai"], apply(byId["voicemyai"], {
    status: "sunset",
    statusNote: "https://voicemy.ai returned 404 on 21 October 2026.",
  }))
}
if (byId["semrushwritingassistant"]) {
  Object.assign(byId["semrushwritingassistant"], apply(byId["semrushwritingassistant"], {
    status: "sunset",
    statusNote: "https://www.semrush.com/features/seowritingassistant/ returned 404 on 21 October 2026. Semrush itself was not checked beyond that URL.",
  }))
}

Object.assign(must("chatgpt"), apply(must("chatgpt"), {
  url: "https://chatgpt.com/",
  summary: "OpenAI’s general assistant for writing, coding, image, and research tasks.",
  description:
    "ChatGPT is OpenAI’s consumer assistant. chat.openai.com redirected to chatgpt.com on 21 October 2026 (the final request was blocked with HTTP 403, which is consistent with a bot wall, not a missing site). The previous catalog called the price Freemium. That label was not re-read on a pricing page in this pass.",
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: false,
    note: "Previous Freemium label kept. chatgpt.com blocked the automated fetch, so the current dollar price was not copied.",
  },
  sources: ["https://chatgpt.com/"],
}))

Object.assign(must("claude-3"), apply(must("claude-3"), {
  name: "Claude",
  url: "https://claude.ai",
  summary: "Anthropic’s assistant for chat, writing, files, and coding.",
  description:
    "Claude is Anthropic’s assistant, not a frozen “Claude 3” release. On the pricing page checked via search on 21 October 2026, Free is $0 and includes chat on the web, desktop, and mobile. Pro is $20 a month, or $17 a month when billed annually, and adds more usage plus Claude Code. Max starts at $100 a month.",
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: true,
    sourceUrl: "https://claude.com/pricing",
    note: "Free $0. Pro $20/month or $17/month billed annually. Max from $100/month.",
  },
  sources: ["https://claude.com/pricing", "https://claude.ai"],
}))

Object.assign(must("gemini-1-5-pro"), apply(must("gemini-1-5-pro"), {
  name: "Gemini",
  url: "https://gemini.google.com/",
  summary: "Google’s Gemini assistant for chat and multimodal tasks.",
  description:
    "The old card named Gemini 1.5 Pro. The public product at gemini.google.com is the current Gemini app. The page returned HTTP 200 on 21 October 2026 but no title or price in the HTML, so a dollar price is not stated here. The Gemini API docs, which are a separate developer product, list a free tier and paid token rates.",
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: false,
    sourceUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    note: "App price not read from gemini.google.com. The API docs show a free tier and paid rates; that is the developer API, not proof of the consumer plan price.",
  },
  sources: ["https://gemini.google.com/", "https://ai.google.dev/gemini-api/docs/pricing"],
}))

Object.assign(must("openai-codex"), apply(must("openai-codex"), {
  url: "https://openai.com/codex/",
  summary: "OpenAI’s coding agent for the editor, terminal, and cloud, included with ChatGPT plans.",
  description:
    "Codex is OpenAI’s coding agent. The product page describes it working in ChatGPT, the editor, and the terminal, with cloud tasks and pull-request review. It is not described there as the engine behind GitHub Copilot. The previous catalog showed 1,700,000,000 visits. That figure had no source and has been removed. Official pricing pages on 21 October 2026 say Codex is included in ChatGPT plans. One page lists Plus at $20/month, Pro from $100/month, and a limited free trial. A second developer page listed Pro at $200/month and Business at $30/user/month. Use the live pricing page for the number you will pay.",
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: true,
    sourceUrl: "https://openai.com/codex/",
    note: "Included with ChatGPT. Plus is listed at $20/month on openai.com/codex. Developer docs differed on Pro and Business. No visit count is published here.",
  },
  features: [
    "Coding agent in ChatGPT, the CLI, and an IDE extension.",
    "Cloud tasks that keep running after the laptop is closed.",
    "Pull-request review on paid ChatGPT plans.",
    "API-key use billed as model tokens, separate from the subscription.",
  ],
  howToUse: [
    {
      title: "Open the Codex page",
      description: "Start from OpenAI’s Codex page. Access is tied to a ChatGPT plan.",
      links: [{ label: "Codex", url: "https://openai.com/codex/" }],
    },
    {
      title: "Pick where you work",
      description: "OpenAI documents Codex in ChatGPT, the terminal, and an editor extension.",
    },
  ],
  sources: ["https://openai.com/codex/", "https://developers.openai.com/codex/pricing/", "https://chatgpt.com/codex/pricing/"],
}))

Object.assign(must("cursor"), apply(must("cursor"), {
  url: "https://cursor.com/",
  summary: "AI coding editor and agent. cursor.sh redirects here.",
  description:
    "Cursor is an AI coding product. Its homepage says agents turn ideas into code. cursor.sh redirected to cursor.com on 21 October 2026. The pricing page the same day listed Free at $0 with limited AI usage, Plus at $8/month, Premium at $30/month, Super at $100/month, Ultra at $200/month, and Teams from $30 per user each month. The page also mentions Grok models and says third-party model usage is billed separately. The old Free-only label is wrong.",
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: true,
    sourceUrl: "https://cursor.com/pricing",
    note: "Free $0, Plus $8, Premium $30, Super $100, Ultra $200 per month. Teams from $30/user/month. Third-party models billed separately.",
  },
  sources: ["https://cursor.com/", "https://cursor.com/pricing"],
}))

Object.assign(must("suno"), apply(must("suno"), {
  url: "https://suno.com/",
  summary: "AI music generator with a free daily credit plan and paid tiers.",
  description:
    "Suno generates original music from text. suno.ai redirected to suno.com. The pricing page on 21 October 2026 listed Free at $0 with 50 credits a day, Pro at $8/month when billed yearly, and Premier at $24/month when billed yearly. The previous Free-only label missed the paid plans.",
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: true,
    sourceUrl: "https://suno.com/pricing",
    note: "Free $0 (50 credits/day). Pro $8/month and Premier $24/month on the yearly prices shown.",
  },
  sources: ["https://suno.com/", "https://suno.com/pricing"],
}))

Object.assign(must("elevenlabs"), apply(must("elevenlabs"), {
  summary: "Voice AI for speech, dubbing, and sound, with a free tier and paid plans.",
  description:
    "ElevenLabs sells text to speech, voice cloning, and related audio tools. The pricing page on 21 October 2026 listed Free at $0, Starter at $6/month, Creator at $22/month (first month shown at $11), Pro at $99/month, Scale at $299/month, and Business at $990/month. The old Free-only label was wrong.",
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: true,
    sourceUrl: "https://elevenlabs.io/pricing",
    note: "Free $0, Starter $6, Creator $22, Pro $99, Scale $299, Business $990 per month.",
  },
  sources: ["https://elevenlabs.io/pricing"],
}))

Object.assign(must("grammarly"), apply(must("grammarly"), {
  summary: "Writing assistant with a free plan and paid plans.",
  description:
    "Grammarly checks and rewrites text in the browser and other apps. The homepage title on 21 October 2026 was “Grammarly: Free AI Writing Assistance”. The plans page is titled “Grammarly Prices and Plans”, so a paid tier exists, but the dollar amounts were not in the HTML that was fetched.",
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: true,
    sourceUrl: "https://www.grammarly.com/plans",
    note: "A free plan and paid plans are published. Dollar amounts were not readable in the fetched HTML.",
  },
  sources: ["https://www.grammarly.com/", "https://www.grammarly.com/plans"],
}))

if (byId["blackbox-ai"]) {
  Object.assign(byId["blackbox-ai"], apply(byId["blackbox-ai"], {
    url: "https://www.blackbox.ai/",
    summary: "Inference platform for dedicated open-weight models and a multi-model endpoint.",
    description:
      "The old URL useblackbox.io returned 404 on 21 October 2026. blackbox.ai answered 200. Its homepage describes a platform that runs an open-weight model you choose, or routes many models through one endpoint. It no longer matches the old “copy code from videos” blurb. No price was on that homepage.",
    pricing: {
      model: "freemium",
      label: "Freemium",
      verified: false,
      sourceUrl: "https://www.blackbox.ai/",
      note: "Price not published on the homepage fetched 21 October 2026. The previous Freemium label was not confirmed.",
    },
    sources: ["https://www.blackbox.ai/"],
    statusNote: "useblackbox.io returned 404. Official site is blackbox.ai.",
  }))
}

Object.assign(must("codeium"), apply(must("codeium"), {
  status: "renamed",
  successorId: "devin",
  url: "https://codeium.com",
  summary: "Codeium’s site now redirects to Devin Desktop.",
  description:
    "On 21 October 2026, codeium.com redirected to https://devin.ai/desktop. That page is titled “Devin Desktop” and describes managing local and cloud coding agents. The old Codeium autocomplete description is out of date. See the Devin card.",
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: false,
    note: "Codeium’s own price was not rechecked because the domain redirects to Devin.",
  },
  sources: ["https://codeium.com", "https://devin.ai/desktop"],
  statusNote: "Redirect observed 21 October 2026.",
}))

Object.assign(must("replit-ghostwriter"), apply(must("replit-ghostwriter"), {
  name: "Replit Agent",
  url: "https://replit.com/products/agent",
  summary: "Replit’s chat agent for building apps. Ghostwriter’s URL redirects here.",
  description:
    "replit.com/ghostwriter redirected to Replit Agent on 21 October 2026. The page says you describe an app and the agent writes it. The old Ghostwriter completion blurb is the previous product name.",
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: false,
    sourceUrl: "https://replit.com/products/agent",
    note: "Price was not on the product page text that was fetched.",
  },
  sources: ["https://replit.com/products/agent"],
  statusNote: "Formerly Replit Ghostwriter.",
}))

Object.assign(must("amazon-codewhisperer"), apply(must("amazon-codewhisperer"), {
  name: "Amazon Q Developer",
  url: "https://aws.amazon.com/q/developer/",
  summary: "Amazon’s AI coding assistant. The CodeWhisperer URL redirects here.",
  description:
    "aws.amazon.com/codewhisperer redirected to Amazon Q Developer on 21 October 2026. AWS describes it as a coding assistant that writes, debugs, and works inside the IDE. The price was not extracted from that page.",
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: false,
    sourceUrl: "https://aws.amazon.com/q/developer/",
    note: "AWS publishes a free tier and a Pro tier in other docs. The dollar price was not copied from this fetch.",
  },
  sources: ["https://aws.amazon.com/q/developer/"],
  statusNote: "Formerly Amazon CodeWhisperer.",
}))

Object.assign(must("magisto"), apply(must("magisto"), {
  status: "sunset",
  summary: "Magisto’s domain now redirects to Vimeo’s video editor.",
  description:
    "On 21 October 2026, magisto.com redirected to https://vimeo.com/features/video-editor with migration tracking parameters. Magisto is not a separate product at that URL.",
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: false,
    note: "No Magisto price. The redirect target is Vimeo.",
  },
  sources: ["https://www.magisto.com"],
  statusNote: "Redirect observed 21 October 2026.",
}))

if (byId["claracopilot"] || records.find((r) => /clara copilot/i.test(r.name))) {
  const clara = records.find((r) => /clara copilot/i.test(r.name))
  Object.assign(clara, apply(clara, {
    status: "sunset",
    summary: "The Clara Copilot domain now opens Odette Technologies.",
    description:
      "claracopilot.ai redirected to https://odettetechnologies.com/ on 21 October 2026. The destination does not present a product named Clara Copilot, so this card is closed.",
    statusNote: "Redirect observed 21 October 2026.",
    sources: ["https://claracopilot.ai/"],
  }))
}

const automl = records.find((r) => /automl/i.test(r.name) || /automl/i.test(r.url))
if (automl) {
  Object.assign(automl, apply(automl, {
    status: "renamed",
    summary: "Google’s old AutoML brand. Confirm the current product name before sending users.",
    description:
      `${automl.summary}\n\nThis card was not given a new official URL in this pass. Treat the old AutoML name as historical until the destination page is checked again.`,
    statusNote: "Name is historical. Destination was not re-fetched successfully in this pass.",
  }))
}

if (byId["otter"]) {
  const meta = checkById["otter"]
  if (meta?.description) {
    byId["otter"].summary = "Meeting agent for live transcription, summaries, and notes."
    byId["otter"].description =
      "Otter’s homepage title on 21 October 2026 was “Otter Meeting Agent - AI Notetaker, Transcription, Insights”. The meta description says it supports real-time transcription, live chat, automated summaries, and insights. The price was not on that text. The second card (otterai) is a duplicate of this URL."
    byId["otter"].sources = ["https://otter.ai"]
    byId["otter"].lastVerified = VERIFIED
    byId["otter"].pricing = {
      ...byId["otter"].pricing,
      verified: false,
      note: "Homepage fetched. No price in the meta description. Previous label kept and marked unverified.",
    }
  }
}

if (byId["ink"]) {
  Object.assign(byId["ink"], apply(byId["ink"], {
    status: "sunset",
    summary: "INK’s old site now redirects to an unrelated GitHub repository.",
    description:
      "On 21 October 2026, inkforall.com redirected to https://github.com/smythos/sre, the SmythOS Runtime Environment. That is not the INK writing product. The duplicate INK card points here and is also closed.",
    statusNote: "Redirect observed 21 October 2026.",
    sources: ["https://inkforall.com"],
  }))
}

if (byId["datarobot"]) {
  byId["datarobot"].summary = "Enterprise platform for AI applications and agents."
  byId["datarobot"].description =
    "DataRobot’s homepage on 21 October 2026 described a unified agent workforce platform for the enterprise. A second card, DataRobot Code, used the same URL and is marked as a duplicate."
  byId["datarobot"].sources = ["https://www.datarobot.com"]
  byId["datarobot"].lastVerified = VERIFIED
}

function add(entry) {
  if (byId[entry.id]) throw new Error(`id exists ${entry.id}`)
  const record = {
    affiliateUrl: "",
    logo: "",
    image: "",
    dateAdded: VERIFIED,
    lastVerified: VERIFIED,
    status: "active",
    ...entry,
  }
  records.push(record)
  byId[record.id] = record
}

add({
  id: "grok",
  name: "Grok",
  url: "https://grok.com/",
  summary: "Assistant from SpaceXSI for chat, images, code, and live answers from the web and X.",
  description:
    "Grok’s homepage on 21 October 2026 said: “Grok is an AI assistant built by SpaceXSI. Chat, create images, write code, and get real-time answers from the web and X.” grok.com/pricing returned 404 and x.ai/pricing returned 403, so no plan price is copied here.",
  categories: ["text", "coding"],
  tags: ["Assistant", "Chat", "Images", "Code"],
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: false,
    note: "No readable pricing page on 21 October 2026. Do not treat a missing price as free.",
  },
  sources: ["https://grok.com/"],
})

add({
  id: "deepseek",
  name: "DeepSeek",
  url: "https://www.deepseek.com/",
  summary: "Lab publishing open models such as DeepSeek-V4 and DeepSeek-R1, plus a chat app and an API.",
  description:
    "DeepSeek’s homepage meta description (Chinese, fetched 21 October 2026) says the lab researches general AI models, open-sources models including DeepSeek-V4 and DeepSeek-R1, offers a chat, and offers an API. No dollar price was in that sentence.",
  categories: ["text", "coding"],
  tags: ["Open weights", "Chat", "API"],
  pricing: {
    model: "open-source",
    label: "Open source",
    verified: true,
    sourceUrl: "https://www.deepseek.com/",
    note: "Homepage says the named models are open source and that an API exists. API rates were not copied.",
  },
  sources: ["https://www.deepseek.com/"],
})

add({
  id: "sora",
  name: "Sora",
  url: "https://openai.com/index/sora/",
  status: "sunset",
  summary: "OpenAI’s text-to-video product. The app was discontinued on 26 April 2026.",
  description:
    "OpenAI’s help center says the Sora web and app experiences were discontinued on 26 April 2026, and the Sora API on 24 September 2026. Both dates are before this catalog update. The announcement page says the product is no longer available and points people to image creation in ChatGPT. Do not list Sora as a tool you can open.",
  categories: ["video"],
  tags: ["Video", "Discontinued"],
  pricing: {
    model: "paid",
    label: "Premium",
    verified: true,
    sourceUrl: "https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation",
    note: "No current plan. The product is discontinued.",
  },
  statusNote: "Discontinued. Help center checked 21 October 2026.",
  sources: [
    "https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation",
    "https://openai.com/index/sora/",
  ],
})

add({
  id: "veo",
  name: "Veo",
  url: "https://deepmind.google/models/veo/",
  summary: "Google DeepMind video model. The model page responded, without a readable blurb.",
  description:
    "https://deepmind.google/models/veo/ returned HTTP 200 on 21 October 2026. The HTML contained no title and no meta description, so this card does not invent capabilities or a price. Check the page before citing a version number.",
  categories: ["video"],
  tags: ["Video", "Google"],
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: false,
    note: "No price in the fetched page.",
  },
  sources: ["https://deepmind.google/models/veo/"],
})

add({
  id: "kling",
  name: "Kling AI",
  url: "https://kling.ai/",
  summary: "Text, image, and reference-to-video studio.",
  description:
    "Kling’s homepage on 21 October 2026 was titled “Kling AI: Next-Gen AI Video & Image Generator” and said it turns text, images, and references into video and images. No plan price was in that text.",
  categories: ["video", "image"],
  tags: ["Video", "Image"],
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: false,
    sourceUrl: "https://kling.ai/",
    note: "Homepage fetched. Price not in the meta description.",
  },
  sources: ["https://kling.ai/"],
})

add({
  id: "lovable",
  name: "Lovable",
  url: "https://lovable.dev/",
  summary: "App builder at lovable.dev. The homepage blocked this fetch.",
  description:
    "Lovable is included because lovable.dev is the public product address. On 21 October 2026 an automated fetch received HTTP 403, so no slogan or price was copied from the page. Treat the description as unverified until someone reads the site in a browser.",
  categories: ["coding", "design"],
  tags: ["App builder", "Unverified copy"],
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: false,
    note: "Price not verified. Homepage returned 403.",
  },
  sources: ["https://lovable.dev/"],
  statusNote: "URL responds, but the HTML was blocked.",
})

add({
  id: "bolt",
  name: "Bolt",
  url: "https://bolt.new/",
  summary: "AI builder for websites, apps, and prototypes from a written prompt.",
  description:
    "bolt.new on 21 October 2026 was titled “Bolt AI builder: Websites, apps & prototypes”. The description says you build sites and apps from your words. No price was in that text.",
  categories: ["coding"],
  tags: ["App builder", "Prototypes"],
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: false,
    sourceUrl: "https://bolt.new/",
    note: "Homepage fetched. Price not in the meta description.",
  },
  sources: ["https://bolt.new/"],
})

add({
  id: "windsurf",
  name: "Windsurf",
  url: "https://windsurf.com/",
  status: "renamed",
  successorId: "devin",
  summary: "Windsurf’s domain now redirects to Devin Desktop.",
  description:
    "On 21 October 2026, windsurf.com redirected to https://devin.ai/desktop. That page describes Devin Desktop, not a separate Windsurf IDE. Use the Devin card for the current product.",
  categories: ["coding"],
  tags: ["Coding", "Renamed"],
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: false,
    note: "No Windsurf price. The domain redirects.",
  },
  statusNote: "Redirect observed 21 October 2026.",
  sources: ["https://windsurf.com/", "https://devin.ai/desktop"],
})

add({
  id: "devin",
  name: "Devin",
  url: "https://devin.ai/",
  summary: "Coding agent that runs parallel cloud agents and a desktop app.",
  description:
    "devin.ai on 21 October 2026 was titled “Devin: the autonomous software engineer” and described an AI coding agent with parallel cloud agents. devin.ai/desktop, which is where Codeium and Windsurf now redirect, describes a desktop surface for local and cloud agents. No price was in those meta descriptions.",
  categories: ["coding"],
  tags: ["Coding agent", "IDE"],
  pricing: {
    model: "paid",
    label: "Premium",
    verified: false,
    sourceUrl: "https://devin.ai/",
    note: "Price not in the homepage text.",
  },
  sources: ["https://devin.ai/", "https://devin.ai/desktop"],
})

add({
  id: "notebooklm",
  name: "Gemini Notebook",
  url: "https://notebook.google.com/",
  summary: "Google’s notebook for summaries and research grounded in sources you provide.",
  description:
    "notebooklm.google.com redirected to notebook.google.com on 21 October 2026. The page title was “Gemini Notebook”. The meta description says it summarizes and takes notes, and calls it a research assistant rooted in information you can trust. No price was in that text. The previous name NotebookLM was not on the title.",
  categories: ["productivity", "text"],
  tags: ["Research", "Notes"],
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: false,
    sourceUrl: "https://notebook.google.com/",
    note: "Price not in the fetched meta description.",
  },
  sources: ["https://notebook.google.com/"],
  statusNote: "notebooklm.google.com redirected here. Title on the page is Gemini Notebook.",
})

add({
  id: "manus",
  name: "Manus",
  url: "https://manus.im/",
  summary: "Agent that executes tasks and automates workflows, not only answers questions.",
  description:
    "manus.im on 21 October 2026 was titled “Manus: Hands On AI”. The description calls it an action engine that executes tasks, automates workflows, and extends your reach. No price was in that text.",
  categories: ["productivity"],
  tags: ["Agent", "Automation"],
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: false,
    sourceUrl: "https://manus.im/",
    note: "Homepage fetched. Price not in the meta description.",
  },
  sources: ["https://manus.im/"],
})

add({
  id: "mistral",
  name: "Mistral",
  url: "https://mistral.ai/",
  summary: "Open-weight frontier models with customization and deployment options.",
  description:
    "Mistral’s homepage on 21 October 2026 said it offers frontier open-weight models you own and control, customized with Forge, deployed with Studio, on-prem, in your VPC, or on Mistral’s cloud. No dollar price was in that sentence.",
  categories: ["text", "coding"],
  tags: ["Open weights", "API"],
  pricing: {
    model: "open-source",
    label: "Open source",
    verified: true,
    sourceUrl: "https://mistral.ai/",
    note: "Homepage says the models are open-weight. Cloud and Studio may be paid; those prices were not copied.",
  },
  sources: ["https://mistral.ai/"],
})

add({
  id: "llama",
  name: "Llama",
  url: "https://dev.meta.ai/",
  summary: "Meta model family. llama.com now opens Meta’s developer site.",
  description:
    "On 21 October 2026, www.llama.com and ai.meta.com/llama both redirected to https://dev.meta.ai/. That page is titled “Products & Solutions for AI Developers | Meta” and mentions Muse Spark, Muse Code, and the Meta Model API. It does not use the name Llama in the title or meta description. The open-weight history of Llama is not restated on that page, so this card does not claim a current license or price.",
  categories: ["text", "coding"],
  tags: ["Models", "Meta"],
  pricing: {
    model: "open-source",
    label: "Open source",
    verified: false,
    sourceUrl: "https://dev.meta.ai/",
    note: "Current license and price were not stated on the redirect target.",
  },
  sources: ["https://dev.meta.ai/"],
  statusNote: "llama.com redirected to dev.meta.ai on 21 October 2026. The page title does not say Llama.",
})

add({
  id: "deepl",
  name: "DeepL",
  url: "https://www.deepl.com/",
  summary: "Translation platform for text, speech, media, and an API.",
  description:
    "DeepL’s homepage on 21 October 2026 was titled “DeepL AI Platform: Translation, Voice & API” and said it translates speech, text, and media, or integrates via API. No plan price was in that text.",
  categories: ["text"],
  tags: ["Translation", "API"],
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: false,
    sourceUrl: "https://www.deepl.com/",
    note: "Homepage fetched. Price not in the meta description.",
  },
  sources: ["https://www.deepl.com/"],
})

add({
  id: "n8n",
  name: "n8n",
  url: "https://n8n.io/",
  summary: "Workflow automation that combines AI steps with business process flows.",
  description:
    "n8n’s homepage on 21 October 2026 called it a workflow automation platform that combines AI capabilities with business process automation, with code for technical teams and no-code speed. No price was in that text.",
  categories: ["productivity"],
  tags: ["Automation", "Workflows"],
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: false,
    sourceUrl: "https://n8n.io/",
    note: "Homepage fetched. Price not in the meta description.",
  },
  sources: ["https://n8n.io/"],
})

add({
  id: "pika",
  name: "Pika",
  url: "https://pika.art/",
  summary: "Creative AI tools. The homepage blurb is only one line.",
  description:
    "pika.art on 21 October 2026 was titled “Pika”. The meta description was “AI creative tools. Built for Creatives.” No feature list or price was in that text.",
  categories: ["video"],
  tags: ["Video", "Creative"],
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: false,
    sourceUrl: "https://pika.art/",
    note: "Price not in the meta description.",
  },
  sources: ["https://pika.art/"],
})

add({
  id: "google-ai-studio",
  name: "Google AI Studio",
  url: "https://aistudio.google.com/",
  summary: "Google’s prompt-to-production workspace for Gemini.",
  description:
    "aistudio.google.com on 21 October 2026 was titled “Google AI Studio” and described as the fastest path from prompt to production with Gemini. Separate Gemini API docs list a free token tier and paid rates. Those API rates are not a consumer subscription price.",
  categories: ["coding", "text"],
  tags: ["Gemini", "API", "Playground"],
  pricing: {
    model: "freemium",
    label: "Freemium",
    verified: true,
    sourceUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    note: "API docs list a free tier and paid token prices. Studio itself did not show a subscription price.",
  },
  sources: ["https://aistudio.google.com/", "https://ai.google.dev/gemini-api/docs/pricing"],
})

add({
  id: "fal",
  name: "fal",
  url: "https://fal.ai/",
  summary: "API platform for generative media models and serverless GPUs.",
  description:
    "fal.ai on 21 October 2026 described a generative media inference platform: call many models through one API, deploy your own on serverless GPUs, or train on GPU clusters. No dollar rate was in that text.",
  categories: ["image", "video"],
  tags: ["API", "Media", "GPU"],
  pricing: {
    model: "paid",
    label: "Premium",
    verified: false,
    sourceUrl: "https://fal.ai/",
    note: "Usage-based pricing is implied by the API product. Rates were not copied.",
  },
  sources: ["https://fal.ai/"],
})

// Logos from each site's favicon. Failures leave logo empty; the card falls back to the screenshot.
fs.mkdirSync(logoDir, { recursive: true })
fs.mkdirSync(outDir, { recursive: true })

async function downloadLogo(record) {
  let host = ""
  try {
    host = new URL(record.url).hostname
  } catch {
    return
  }
  const dest = path.join(logoDir, `${record.id}.png`)
  const endpoint = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`
  try {
    const res = await fetch(endpoint, { redirect: "follow" })
    if (!res.ok) return
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 80) return
    fs.writeFileSync(dest, buf)
    record.logo = `/logos/${record.id}.png`
  } catch {
    // leave logo empty
  }
}

const queue = records.slice()
async function worker() {
  while (queue.length) {
    const record = queue.pop()
    await downloadLogo(record)
  }
}
await Promise.all(Array.from({ length: 12 }, () => worker()))

for (const file of fs.readdirSync(outDir)) {
  if (file.endsWith(".json")) fs.unlinkSync(path.join(outDir, file))
}

for (const record of records) {
  fs.writeFileSync(path.join(outDir, `${record.id}.json`), JSON.stringify(record, null, 2) + "\n")
}

const imports = records
  .map((r) => `import ${r.id.replace(/-/g, "_")} from "./${r.id}.json"\n`)
  .join("")
const names = records.map((r) => r.id.replace(/-/g, "_")).join(", ")
const index = `// Generated by scripts/build-catalog.mjs and scripts/catalog-index.mjs. Do not edit by hand.\nimport { toolSchema } from "@/lib/tool-schema"\n${imports}\nconst rawTools = [${names}]\n\nexport const catalogTools = rawTools.map((tool) => toolSchema.parse(tool))\n`
fs.writeFileSync(path.join(outDir, "index.ts"), index)

const sunset = records.filter((r) => r.status === "sunset").map((r) => r.id)
const renamed = records.filter((r) => r.status === "renamed").map((r) => r.id)
const dupes = records.filter((r) => r.status === "duplicate-of").map((r) => `${r.id}->${r.successorId}`)
const verified = records.filter((r) => r.pricing.verified).map((r) => r.id)
console.log(JSON.stringify({
  total: records.length,
  sunset,
  renamed,
  dupes,
  verified,
  logos: records.filter((r) => r.logo).length,
}, null, 2))
