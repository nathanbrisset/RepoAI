import { createHash } from "crypto"

/**
 * Per-IP rate limit and one-time captcha nonces.
 * Reads UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN, or the Vercel KV
 * pair KV_REST_API_URL / KV_REST_API_TOKEN. REDIS_URL and the read-only token
 * are not used: the function talks to the REST API.
 * In production, a missing Redis/KV config refuses the request. Transient Redis
 * errors fall back to a per-instance in-memory counter so a short blip does not
 * take AI Match offline. Development always uses the in-memory counter.
 */

type Bucket = { count: number; reset: number }

export type RateBackend = "redis" | "none"

export type LimitResult = {
  ok: boolean
  status: 200 | 429 | 503
  retryAfter: number
  remaining: number
  backend: RateBackend
}

type RedisCall = { url: string; token: string }

type FetchLike = (input: string, init: RequestInit) => Promise<Response>

const buckets = new Map<string, Bucket>()
const nonces = new Map<string, number>()

function cleanEnv(name: string): string {
  return (process.env[name] || "").trim().replace(/^["']|["']$/g, "")
}

export function redisConfig(): RedisCall | null {
  const url = (cleanEnv("UPSTASH_REDIS_REST_URL") || cleanEnv("KV_REST_API_URL")).replace(/\/$/, "")
  const token = cleanEnv("UPSTASH_REDIS_REST_TOKEN") || cleanEnv("KV_REST_API_TOKEN")
  if (!url.startsWith("https://") || token.length < 8) return null
  return { url, token }
}

function requireSharedStore(override?: boolean): boolean {
  if (typeof override === "boolean") return override
  return process.env.NODE_ENV === "production"
}

function isPublicIp(ip: string): boolean {
  if (ip.includes(":")) {
    const value = ip.toLowerCase()
    if (value === "::1" || value.startsWith("fe80:") || value.startsWith("fc") || value.startsWith("fd")) return false
    return true
  }
  const [a, b] = ip.split(".").map((part) => Number(part))
  if (a === 0 || a === 10 || a === 127) return false
  if (a === 172 && b >= 16 && b <= 31) return false
  if (a === 192 && b === 168) return false
  if (a === 169 && b === 254) return false
  if (a === 100 && b >= 64 && b <= 127) return false
  return true
}

function publicIps(value: string | null): string[] {
  if (!value) return []
  const ips: string[] = []
  for (const part of value.split(",")) {
    const ip = normalizeIp(part)
    if (ip && isPublicIp(ip)) ips.push(ip)
  }
  return ips
}

function normalizeIp(value: string): string | null {
  let ip = value.trim().replace(/^\[|\]$/g, "")
  if (/^\d{1,3}(\.\d{1,3}){3}:\d+$/.test(ip)) ip = ip.slice(0, ip.lastIndexOf(":"))
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
    const parts = ip.split(".").map((part) => Number(part))
    if (parts.every((part) => part >= 0 && part <= 255)) return ip
    return null
  }
  if (ip.includes(":") && /^[0-9a-fA-F:]{3,64}$/.test(ip)) return ip.toLowerCase()
  return null
}

export function clientIp(headers: { get(name: string): string | null }): string {
  const forwarded = publicIps(headers.get("x-forwarded-for"))
  const vercel = publicIps(headers.get("x-vercel-forwarded-for"))
  const real = publicIps(headers.get("x-real-ip"))
  return forwarded[0] || vercel[0] || real[0] || "unknown"
}

export function rateSubject(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 12)
}

export function rateHeaders(result: LimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "Cache-Control": "no-store",
    "X-RateLimit-Backend": result.backend,
    "X-RateLimit-Remaining": String(result.remaining),
  }
  if (!result.ok && result.status === 429) headers["Retry-After"] = String(result.retryAfter)
  return headers
}

function logDecision(result: LimitResult) {
  console.info(`match-rate backend=${result.backend} remaining=${result.remaining} status=${result.status}`)
}

function unavailable(): LimitResult {
  const result: LimitResult = { ok: false, status: 503, retryAfter: 0, remaining: 0, backend: "none" }
  logDecision(result)
  return result
}

export function takeToken(
  ip: string,
  bucketName: string,
  limit: number,
  windowSec: number,
  now = Date.now(),
  store: Map<string, Bucket> = buckets
): LimitResult {
  if (store.size > 2000) {
    for (const [key, bucket] of store) {
      if (bucket.reset <= now) store.delete(key)
    }
  }
  const key = `${bucketName}:${ip}`
  const windowMs = windowSec * 1000
  const current = store.get(key)
  if (!current || current.reset <= now) {
    store.set(key, { count: 1, reset: now + windowMs })
    return { ok: true, status: 200, retryAfter: 0, remaining: Math.max(0, limit - 1), backend: "none" }
  }
  if (current.count >= limit) {
    return { ok: false, status: 429, retryAfter: Math.max(1, Math.ceil((current.reset - now) / 1000)), remaining: 0, backend: "none" }
  }
  current.count += 1
  return { ok: true, status: 200, retryAfter: 0, remaining: Math.max(0, limit - current.count), backend: "none" }
}

async function redisCommand(config: RedisCall, command: unknown, pipeline: boolean, fetchImpl: FetchLike): Promise<unknown> {
  const response = await fetchImpl(pipeline ? `${config.url}/pipeline` : config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(4000),
  })
  if (!response.ok) throw new Error(`http ${response.status}`)
  return response.json()
}

function asInt(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value)
  if (typeof value === "string" && /^-?\d+$/.test(value.trim())) return Number(value.trim())
  if (typeof value === "boolean") return value ? 1 : 0
  return null
}

type RedisRow = { result?: unknown; error?: string }

/** Short type fingerprint for logs — never includes secrets or token values. */
export function payloadFingerprint(payload: unknown, depth = 0): string {
  if (depth > 4) return "…"
  if (payload === null) return "null"
  if (payload === undefined) return "undef"
  const t = typeof payload
  if (t === "string") return `str(${payload.length})`
  if (t === "number" || t === "boolean") return t
  if (Array.isArray(payload)) {
    const inner = payload.slice(0, 4).map((item) => payloadFingerprint(item, depth + 1))
    return `arr[${payload.length}](${inner.join(",")})`
  }
  if (t === "object") {
    const keys = Object.keys(payload as object).slice(0, 6)
    const parts = keys.map((key) => `${key}:${payloadFingerprint((payload as Record<string, unknown>)[key], depth + 1)}`)
    return `obj{${parts.join(",")}}`
  }
  return t
}

function rowFromItem(item: unknown): RedisRow {
  if (Array.isArray(item)) {
    if (item.length >= 2 && (item[0] === null || typeof item[0] === "string")) {
      const err = item[0]
      return {
        result: item[1],
        error: typeof err === "string" ? err : undefined,
      }
    }
    if (item.length === 1) return rowFromItem(item[0])
    return { result: item }
  }
  if (item && typeof item === "object") {
    const row = item as { result?: unknown; error?: unknown }
    if ("error" in row && typeof row.error === "string") {
      return { result: row.result, error: row.error }
    }
    if ("result" in row || "error" in row) {
      return { result: row.result, error: typeof row.error === "string" ? row.error : undefined }
    }
  }
  return { result: item }
}

function unwrapTopLevel(payload: unknown): unknown {
  let value = payload
  for (let i = 0; i < 3; i++) {
    if (value && typeof value === "object" && !Array.isArray(value) && "result" in value) {
      const inner = (value as { result: unknown }).result
      if (inner !== value) {
        value = inner
        continue
      }
    }
    break
  }
  return value
}

export function rowsFrom(payload: unknown): RedisRow[] | null {
  const value = unwrapTopLevel(payload)
  if (!Array.isArray(value)) return null
  return value.map((item) => rowFromItem(item))
}

function commandResult(payload: unknown): { value: unknown; error?: string } {
  const rows = rowsFrom(payload)
  if (rows && rows.length === 1) {
    if (rows[0].error) return { value: null, error: rows[0].error }
    return { value: rows[0].result }
  }
  const unwrapped = unwrapTopLevel(payload)
  if (unwrapped && typeof unwrapped === "object" && !Array.isArray(unwrapped) && "error" in unwrapped) {
    const err = (unwrapped as { error: unknown }).error
    return { value: null, error: typeof err === "string" ? err : "error" }
  }
  if (Array.isArray(unwrapped) && unwrapped.length >= 2 && (unwrapped[0] === null || typeof unwrapped[0] === "string")) {
    const err = unwrapped[0]
    return {
      value: unwrapped[1],
      error: typeof err === "string" ? err : undefined,
    }
  }
  if (unwrapped && typeof unwrapped === "object" && !Array.isArray(unwrapped) && "result" in unwrapped) {
    const row = unwrapped as { result?: unknown; error?: string }
    return { value: row.result, error: row.error }
  }
  return { value: unwrapped }
}

export async function rateLimit(
  ip: string,
  bucketName: string,
  limit: number,
  windowSec: number,
  options?: { requireRedis?: boolean; fetchImpl?: FetchLike }
): Promise<LimitResult> {
  const key = `match:${bucketName}:${ip}`
  const shared = requireSharedStore(options?.requireRedis)
  const config = redisConfig()
  if (!config) {
    if (shared) {
      console.error("Match rate limit store failed", "missing")
      return unavailable()
    }
    const local = takeToken(ip, bucketName, limit, windowSec)
    logDecision(local)
    return local
  }
  try {
    const fetchImpl = options?.fetchImpl || fetch
    const payload = await redisCommand(config, [["INCR", key], ["TTL", key]], true, fetchImpl)
    const rows = rowsFrom(payload)
    const count = rows && rows.length >= 1 ? asInt(rows[0].result) : null
    if (!rows || rows[0]?.error || count === null || count < 1) {
      const detail = rows?.[0]?.error || payloadFingerprint(payload)
      throw new Error(`bad-payload ${detail}`)
    }
    let ttl = rows.length >= 2 ? asInt(rows[1].result) : null
    if (ttl === null || ttl < 0) {
      await redisCommand(config, ["EXPIRE", key, windowSec], false, fetchImpl)
      ttl = windowSec
    }
    if (count > limit) {
      const retryAfter = ttl !== null && ttl > 0 ? ttl : windowSec
      const blocked: LimitResult = { ok: false, status: 429, retryAfter, remaining: 0, backend: "redis" }
      logDecision(blocked)
      return blocked
    }
    const allowed: LimitResult = { ok: true, status: 200, retryAfter: 0, remaining: Math.max(0, limit - count), backend: "redis" }
    logDecision(allowed)
    return allowed
  } catch (error) {
    const reason = error instanceof Error ? error.message || error.name : "error"
    console.error("Match rate limit store failed", reason.slice(0, 80))
    const local = takeToken(ip, bucketName, limit, windowSec)
    local.backend = "none"
    console.warn(`match-rate redis-fallback subject=${ip.slice(0, 8)} bucket=${bucketName}`)
    logDecision(local)
    return local
  }
}

export function consumeNonceMemory(nonce: string, exp: number, now = Date.now(), store: Map<string, number> = nonces): boolean {
  if (store.size > 2000) {
    for (const [key, until] of store) {
      if (until <= now) store.delete(key)
    }
  }
  if (store.has(nonce)) return false
  store.set(nonce, exp)
  return true
}

export async function consumeNonce(
  nonce: string,
  ttlSec: number,
  options?: { requireRedis?: boolean; fetchImpl?: FetchLike }
): Promise<"fresh" | "replay" | "unavailable"> {
  const key = `match-nonce:${nonce}`
  const shared = requireSharedStore(options?.requireRedis)
  const config = redisConfig()
  if (!config) {
    if (shared) return "unavailable"
    return consumeNonceMemory(nonce, Date.now() + ttlSec * 1000) ? "fresh" : "replay"
  }
  try {
    const payload = await redisCommand(config, ["SET", key, "1", "EX", ttlSec, "NX"], false, options?.fetchImpl || fetch)
    const { value: result, error } = commandResult(payload)
    if (error) throw new Error(error.slice(0, 80))
    if (result === "OK" || result === true || result === 1) return "fresh"
    if (result === null || result === false) return "replay"
    throw new Error(`bad-payload ${payloadFingerprint(payload)}`)
  } catch (error) {
    console.error("Match captcha store failed", error instanceof Error ? (error.message || error.name).slice(0, 80) : "error")
    console.warn("match-captcha redis-fallback")
    return consumeNonceMemory(nonce, Date.now() + ttlSec * 1000) ? "fresh" : "replay"
  }
}

export function searchLimit(): { limit: number; windowSec: number } {
  return { limit: 40, windowSec: 1800 }
}
