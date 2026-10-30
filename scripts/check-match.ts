import assert from "node:assert/strict"
import {
  catalogMatch,
  detectLanguage,
  fallbackReason,
  isUselessReason,
  limitWords,
  mentionsForeignTool,
  messageForCode,
  namesMatch,
  presentCards,
  promptProblem,
  rankTools,
  relatedCards,
  textIncludesToken,
  foldMatchText,
  toMatchTool,
  validateModelPayload,
  resolveMatchLang,
  humanizeReason,
  type MatchTool,
} from "../lib/match-copy.ts"
import { issueChallenge, verifyChallenge } from "../lib/match-captcha.ts"
import {
  clientIp,
  consumeNonce,
  consumeNonceMemory,
  payloadFingerprint,
  rateHeaders,
  rateLimit,
  rowsFrom,
  takeToken,
} from "../lib/match-guard.ts"

const names = ["Synthesia", "Synthesys", "ChatGPT"]

function tool(partial: Partial<MatchTool> & Pick<MatchTool, "id" | "name">): MatchTool {
  return {
    url: `https://${partial.id}.example`,
    logo: "",
    image: "",
    price: "Freemium",
    priceUnchecked: false,
    categories: ["marketing"],
    tags: ["Video"],
    summary: `${partial.name} helps with video avatars and training.`,
    features: [],
    ...partial,
  }
}

const synthesia = tool({
  id: "synthesia",
  name: "Synthesia",
  categories: ["marketing"],
  tags: ["AI Video", "Training Videos"],
  summary: "Turn scripts into training videos with AI avatars.",
})
const synthesys = tool({
  id: "synthesys",
  name: "Synthesys",
  categories: ["marketing", "video"],
  tags: ["Video", "Audio"],
  summary: "Synthesys generates avatar videos and voiceovers.",
})
const chatgpt = tool({
  id: "chatgpt",
  name: "ChatGPT",
  categories: ["text"],
  tags: ["Writing"],
  summary: "ChatGPT writes and edits text.",
})
const mailer = tool({
  id: "mailer",
  name: "Mailer",
  categories: ["marketing"],
  tags: ["Email"],
  summary: "Mailer sends newsletters.",
})

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length
}

assert.equal(limitWords("one two three four", 2), "one two")
assert.equal(isUselessReason(".io"), true)
assert.equal(isUselessReason("synthesia.io"), true)
assert.equal(namesMatch("Synthesia", "Synthesys"), false)
assert.equal(namesMatch("Veed.io", "veed.io"), true)
assert.equal(mentionsForeignTool("Use Synthesia for this.", ["Synthesys"], names), true)
assert.equal(mentionsForeignTool("Synthesys covers voiceovers.", ["Synthesys"], names), false)
assert.equal(detectLanguage("Je veux créer une vidéo de formation"), "fr")
assert.equal(detectLanguage("I need a training video with an avatar"), "en")
assert.equal(promptProblem("  "), "empty")
assert.equal(promptProblem("x".repeat(501)), "too_long")
assert.equal(promptProblem("write a newsletter"), null)

const quota = messageForCode('{"error":{"code":"insufficient_quota","message":"https://platform.openai.com/account/billing"}}', "bonjour je veux une vidéo")
assert.equal(quota.toLowerCase().includes("quota"), false)
assert.equal(quota.includes("http"), false)
assert.equal(quota, messageForCode("nope", "bonjour je veux une vidéo"))
assert.equal(quota, "AI Match est indisponible pour le moment. Réessaie dans un instant.")
assert.equal(messageForCode("unavailable", "write a newsletter"), "AI Match is unavailable right now. Try again in a moment.")

const frenchReason = fallbackReason("fr", synthesys)
assert.ok(frenchReason.includes("Synthesys"))
assert.ok(!/synthesia/i.test(frenchReason))
assert.ok(wordCount(frenchReason) <= 25)
assert.notEqual(fallbackReason("fr", synthesys, 0), fallbackReason("fr", synthesys, 1))
assert.ok(wordCount(fallbackReason("en", tool({ id: "long", name: "Very Long Tool Name ".repeat(8).trim() }))) <= 25)

const validated = validateModelPayload(
  {
    intro: "Try Synthesia.",
    picks: [
      { id: "synthesys", name: "Synthesia", reason: "This card should be rejected." },
      { id: "synthesys", name: "Synthesys", reason: "Use Synthesia for a short avatar video today." },
      { id: "synthesys", name: "Synthesys", reason: "Duplicate row that must be ignored completely." },
    ],
  },
  [synthesys, synthesia],
  names,
  "en"
)
assert.ok(validated)
assert.equal(validated?.recommendations.length, 1)
assert.equal(validated?.recommendations[0].name, "Synthesys")
assert.equal(validated?.recommendations[0].id, "synthesys")
assert.ok(!/synthesia/i.test(validated?.recommendations[0].reason || ""))
assert.ok(!/synthesia/i.test(validated?.intro || ""))
assert.ok(wordCount(validated?.recommendations[0].reason || "") <= 25)
assert.equal("visits" in (validated?.recommendations[0] || {}), false)
assert.equal("rating" in (validated?.recommendations[0] || {}), false)
assert.equal("affiliateUrl" in (validated?.recommendations[0] || {}), false)

const dotReason = validateModelPayload(
  { intro: "A short intro for your video.", picks: [{ id: "synthesys", name: "Synthesys", reason: ".io" }] },
  [synthesys],
  names,
  "fr"
)
assert.ok(dotReason)
assert.notEqual(dotReason?.recommendations[0].reason, ".io")
assert.ok(dotReason?.recommendations[0].reason.includes("Synthesys"))

const hidden = toMatchTool({
  id: "old",
  name: "Old",
  url: "https://old.example",
  status: "sunset",
  description: "closed",
  visits: 10,
  rating: 5,
  affiliateUrl: "https://affiliate.example",
})
assert.equal(hidden, null)
const visible = toMatchTool({
  id: "live",
  name: "Live",
  url: "https://live.example",
  status: "active",
  description: "open",
  pricing: { label: "Free", verified: false },
  visits: 99,
  rating: 4,
  affiliateUrl: "https://affiliate.example/live",
})
assert.ok(visible)
assert.equal(visible?.price, "Free")
assert.equal(visible?.priceUnchecked, true)
assert.equal("visits" in (visible || {}), false)
assert.equal("rating" in (visible || {}), false)
assert.equal("affiliateUrl" in (visible || {}), false)

const query = "training video avatar"
const first = rankTools([synthesia, synthesys, chatgpt, mailer], query).map((row) => `${row.tool.id}:${row.score}`)
const second = rankTools([chatgpt, mailer, synthesys, synthesia], query).map((row) => `${row.tool.id}:${row.score}`)
assert.deepEqual(first, second)
assert.equal(first[0].startsWith("synthesia:") || first[0].startsWith("synthesys:"), true)
assert.equal(first.some((row) => row.startsWith("chatgpt:") && !row.endsWith(":0")), false)

const writer = tool({
  id: "writer",
  name: "Writer",
  categories: ["text"],
  tags: ["Writing"],
  summary: "Writer helps with writing and email campaigns.",
})
const newsletter = catalogMatch([writer, chatgpt, synthesia], "Rédiger une newsletter conviviale pour mes clients", ["Writer", "ChatGPT", "Synthesia"])
assert.ok(newsletter)
assert.equal(newsletter?.lang, "fr")
assert.equal(newsletter?.recommendations[0]?.id, "writer")
assert.ok(newsletter?.recommendations[0]?.reason.includes("Writer"))

assert.equal(textIncludesToken("Créez des vidéos en ligne", "videos"), true)
assert.equal(foldMatchText("vidéos"), "videos")

const frenchVideo = tool({
  id: "veed",
  name: "Veed",
  categories: ["video"],
  tags: ["Vidéo"],
  summary: "Créez des vidéos en ligne facilement.",
})
const frenchVideoMatch = catalogMatch([frenchVideo, chatgpt], "créer des vidéos", ["Veed", "ChatGPT"])
assert.ok(frenchVideoMatch)
assert.equal(frenchVideoMatch?.recommendations[0]?.id, "veed")

const drawPick = catalogMatch(
  [tool({ id: "mj", name: "Midjourney", categories: ["image"], tags: ["dessin"], summary: "Images et dessin par IA." }), chatgpt],
  "Je veux faire du dessin",
  ["Midjourney", "ChatGPT"],
)
assert.ok(drawPick)
assert.equal(drawPick?.recommendations[0]?.id, "mj")

const catalog = catalogMatch([synthesia, synthesys, chatgpt], "Je veux créer une vidéo avec un avatar", names)
assert.ok(catalog)
assert.equal(catalog?.lang, "fr")
assert.ok(catalog?.intro.includes("actifs"))
assert.ok(catalog?.recommendations.every((card) => card.id !== "chatgpt"))
assert.deepEqual(
  catalogMatch([synthesia, synthesys], query, names)?.recommendations.map((card) => card.id),
  catalogMatch([synthesys, synthesia], query, names)?.recommendations.map((card) => card.id)
)

const related = relatedCards([synthesia, synthesys, chatgpt, mailer], [{ ...synthesia, price: "Premium", priceUnchecked: false, reason: "A unique reason for the top pick only." }], query, names)
assert.ok(related.some((card) => card.id === "synthesys"))
assert.equal(related.some((card) => card.id === "chatgpt"), false)
assert.equal(related.some((card) => card.id === "mailer"), false)

const presented = presentCards([
  { id: "synthesys", name: "Synthesys", url: "https://synthesys.io", reason: "Fits.", visits: 12, rating: 5, affiliateUrl: "https://affiliate.example" },
  { id: "synthesys", name: "Synthesys", url: "https://synthesys.io", reason: "again" },
  { id: "bad", name: "Bad", url: "http://insecure.example", reason: "no" },
])
assert.equal(presented.length, 1)
assert.equal("visits" in presented[0], false)
assert.equal("rating" in presented[0], false)
assert.equal("affiliateUrl" in presented[0], false)

const secret = "test-secret-123456"
const issued = issueChallenge(secret, { now: 1_000_000, a: 4, b: 7, nonce: "nonce-123456" })
assert.equal(issued.question, "4 + 7")
const ok = verifyChallenge(secret, issued.token, "11", 1_000_000)
assert.equal(ok.ok, true)
assert.equal(verifyChallenge(secret, issued.token, "3", 1_000_000).ok, false)
assert.equal(verifyChallenge(secret, issued.token + "x", "11", 1_000_000).ok, false)
assert.equal(verifyChallenge(secret, issued.token, "11", 1_000_000 + 11 * 60 * 1000).ok, false)
const tampered = `${issued.token.slice(0, 8)}A${issued.token.slice(9)}`
assert.equal(verifyChallenge(secret, tampered, "11", 1_000_000).ok, false)

const nonceStore = new Map<string, number>()
assert.equal(consumeNonceMemory("nonce-123456", 2_000_000, 1_000_000, nonceStore), true)
assert.equal(consumeNonceMemory("nonce-123456", 2_000_000, 1_000_000, nonceStore), false)

const buckets = new Map()
assert.equal(takeToken("203.0.113.5", "search", 2, 60, 1_000, buckets).ok, true)
assert.equal(takeToken("203.0.113.5", "search", 2, 60, 1_000, buckets).ok, true)
const blocked = takeToken("203.0.113.5", "search", 2, 60, 1_000, buckets)
assert.equal(blocked.ok, false)
if (!blocked.ok) assert.ok(blocked.retryAfter > 0)
assert.equal(takeToken("203.0.113.6", "search", 2, 60, 1_000, buckets).ok, true)

assert.equal(clientIp(new Headers({ "x-real-ip": "10.1.2.3", "x-forwarded-for": "198.51.100.4, 10.0.0.1" })), "198.51.100.4")
assert.equal(clientIp(new Headers({ "x-forwarded-for": "198.51.100.4, 10.0.0.1" })), "198.51.100.4")
assert.equal(clientIp(new Headers({ "x-vercel-forwarded-for": "2001:db8::2" })), "2001:db8::2")
assert.equal(clientIp(new Headers({ "x-forwarded-for": "not-an-ip, 198.51.100.8" })), "198.51.100.8")
assert.equal(clientIp(new Headers()), "unknown")

const savedUrl = process.env.KV_REST_API_URL
const savedToken = process.env.KV_REST_API_TOKEN
const savedUpstashUrl = process.env.UPSTASH_REDIS_REST_URL
const savedUpstashToken = process.env.UPSTASH_REDIS_REST_TOKEN
delete process.env.KV_REST_API_URL
delete process.env.KV_REST_API_TOKEN
delete process.env.UPSTASH_REDIS_REST_URL
delete process.env.UPSTASH_REDIS_REST_TOKEN
const missing = await rateLimit("203.0.113.20", "search", 10, 1800, { requireRedis: true })
assert.equal(missing.ok, false)
if (!missing.ok) {
  assert.equal(missing.status, 503)
  assert.equal(missing.backend, "none")
  assert.equal(rateHeaders(missing)["X-RateLimit-Backend"], "none")
}

process.env.KV_REST_API_URL = "https://kv.example.test"
process.env.KV_REST_API_TOKEN = "kv-token-value"
const counts = new Map<string, number>()
const fetchImpl: typeof fetch = async (input, init) => {
  const url = String(input)
  const header = new Headers(init?.headers).get("authorization") || ""
  assert.equal(header.startsWith("Bearer "), true)
  const body = JSON.parse(String(init?.body))
  if (!Array.isArray(body[0])) {
    assert.equal(url, "https://kv.example.test")
    assert.equal(body[0], "EXPIRE")
    return Response.json({ result: 1 })
  }
  assert.equal(url, "https://kv.example.test/pipeline")
  assert.equal(body[0][0], "INCR")
  const key = body[0][1]
  const next = (counts.get(key) || 0) + 1
  counts.set(key, next)
  return Response.json([
    { result: String(next) },
    { result: next === 1 ? -1 : 1700 },
  ])
}
let last = null
for (let i = 0; i < 10; i += 1) {
  const allowed = await rateLimit("203.0.113.21", "search", 10, 1800, { requireRedis: true, fetchImpl })
  assert.equal(allowed.ok, true)
  if (allowed.ok) assert.equal(allowed.backend, "redis")
  last = allowed
}
assert.equal(last && last.ok && last.remaining, 0)
const eleventh = await rateLimit("203.0.113.21", "search", 10, 1800, { requireRedis: true, fetchImpl })
assert.equal(eleventh.ok, false)
if (!eleventh.ok) {
  assert.equal(eleventh.status, 429)
  assert.equal(eleventh.backend, "redis")
  assert.equal(rateHeaders(eleventh)["X-RateLimit-Remaining"], "0")
  assert.equal(rateHeaders(eleventh)["Retry-After"], "1700")
}
const otherIp = await rateLimit("203.0.113.22", "search", 10, 1800, { requireRedis: true, fetchImpl })
assert.equal(otherIp.ok, true)

process.env.UPSTASH_REDIS_REST_URL = "https://upstash.example.test"
process.env.UPSTASH_REDIS_REST_TOKEN = "upstash-token-value"
const upstashFetch: typeof fetch = async (input) => {
  assert.equal(String(input), "https://upstash.example.test/pipeline")
  return Response.json([{ result: 1 }, { result: 1800 }])
}
const preferred = await rateLimit("203.0.113.23", "search", 10, 1800, { requireRedis: true, fetchImpl: upstashFetch })
assert.equal(preferred.ok, true)
if (preferred.ok) assert.equal(preferred.remaining, 9)

const failingFetch: typeof fetch = async () => {
  throw new Error("http 401")
}
const redisErrorFallback = await rateLimit("203.0.113.24", "search", 10, 1800, { requireRedis: true, fetchImpl: failingFetch })
assert.equal(redisErrorFallback.ok, true)
if (redisErrorFallback.ok) {
  assert.equal(redisErrorFallback.backend, "none")
  assert.equal(redisErrorFallback.remaining, 9)
}

const timeoutFetch: typeof fetch = async () => {
  const err = new Error("The operation was aborted due to timeout")
  err.name = "TimeoutError"
  throw err
}
const timeoutFallback = await rateLimit("203.0.113.25", "search", 10, 1800, { requireRedis: true, fetchImpl: timeoutFetch })
assert.equal(timeoutFallback.ok, true)
if (timeoutFallback.ok) assert.equal(timeoutFallback.backend, "none")

assert.equal(rowsFrom([[null, 1], [null, -1]])?.map((r) => r.result).join(","), "1,-1")
assert.equal(rowsFrom({ result: [[null, "2"], [null, "1800"]] })?.map((r) => r.result).join(","), "2,1800")
assert.equal(rowsFrom({ result: [{ result: 3 }, { result: -1 }] })?.map((r) => r.result).join(","), "3,-1")
assert.equal(payloadFingerprint({ result: [{ result: 1 }, { error: "ERR x" }] }).includes("obj"), true)

process.env.KV_REST_API_URL = "https://kv-tuple.example.test"
process.env.KV_REST_API_TOKEN = "kv-token-value"
let tupleExpireCalls = 0
const tupleFetchWithExpire: typeof fetch = async (input, init) => {
  const url = String(input)
  const body = JSON.parse(String(init?.body))
  if (!Array.isArray(body[0])) {
    tupleExpireCalls += 1
    assert.equal(body[0], "EXPIRE")
    return Response.json({ result: 1 })
  }
  assert.equal(url.endsWith("/pipeline"), true)
  return Response.json([[null, 1], [null, -1]])
}
const tupleAllowed = await rateLimit("203.0.113.30", "search", 10, 1800, {
  requireRedis: true,
  fetchImpl: tupleFetchWithExpire,
})
assert.equal(tupleAllowed.ok, true)
if (tupleAllowed.ok) {
  assert.equal(tupleAllowed.backend, "redis")
  assert.equal(tupleAllowed.remaining, 9)
}
assert.equal(tupleExpireCalls, 1)

const wrappedFetch: typeof fetch = async () =>
  Response.json({ result: [{ result: "1" }, { result: "-1" }] })
const wrappedAllowed = await rateLimit("203.0.113.31", "search", 10, 1800, {
  requireRedis: true,
  fetchImpl: wrappedFetch,
})
assert.equal(wrappedAllowed.ok, true)
if (wrappedAllowed.ok) assert.equal(wrappedAllowed.backend, "redis")

const nonceTupleFetch: typeof fetch = async () => Response.json([null, "OK"])
assert.equal(
  await consumeNonce("nonce-tuple-shape", 120, { requireRedis: true, fetchImpl: nonceTupleFetch }),
  "fresh",
)
const nonceWrappedFetch: typeof fetch = async () => Response.json({ result: null })
assert.equal(
  await consumeNonce("nonce-replay-shape", 120, { requireRedis: true, fetchImpl: nonceWrappedFetch }),
  "replay",
)

assert.equal(resolveMatchLang("help me edit a podcast", "fr"), "en")
assert.equal(resolveMatchLang("montage video pour youtube", "fr"), "fr")
assert.ok(humanizeReason('Matched in tags: "training video avatars daily"').includes("training"))
assert.equal(humanizeReason("id: chatgpt slug: data-processing score: 12"), "")

if (savedUrl === undefined) delete process.env.KV_REST_API_URL
else process.env.KV_REST_API_URL = savedUrl
if (savedToken === undefined) delete process.env.KV_REST_API_TOKEN
else process.env.KV_REST_API_TOKEN = savedToken
if (savedUpstashUrl === undefined) delete process.env.UPSTASH_REDIS_REST_URL
else process.env.UPSTASH_REDIS_REST_URL = savedUpstashUrl
if (savedUpstashToken === undefined) delete process.env.UPSTASH_REDIS_REST_TOKEN
else process.env.UPSTASH_REDIS_REST_TOKEN = savedUpstashToken

console.log("match checks passed")
