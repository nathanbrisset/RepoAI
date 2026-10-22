import { createHash } from "crypto"

/**
 * Per-IP rate limit and one-time captcha nonces.
 * Reads UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN, or the Vercel KV
 * pair KV_REST_API_URL / KV_REST_API_TOKEN. REDIS_URL and the read-only token
 * are not used: the function talks to the REST API.
 * In production and on Vercel preview (NODE_ENV=production), a missing or
 * failing store refuses the request. Development keeps an in-memory counter.
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
  if (typeof value === "string" && /^-?\d+$/.test(value)) return Number(value)
  return null
}

type RedisRow = { result?: unknown; error?: string }

function rowsFrom(payload: unknown): RedisRow[] | null {
  let value = payload
  if (value && typeof value === "object" && "result" in value && Array.isArray((value as { result: unknown }).result)) {
    value = (value as { result: unknown[] }).result
  }
  if (!Array.isArray(value)) return null
  return value.map((item) => {
    if (item && typeof item === "object") {
      const row = item as { result?: unknown; error?: unknown }
      return { result: row.result, error: typeof row.error === "string" ? row.error : undefined }
    }
    return { result: item }
  })
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
      throw new Error("bad-payload")
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
    if (shared) return unavailable()
    const local = takeToken(ip, bucketName, limit, windowSec)
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
    const result = payload && typeof payload === "object" && "result" in payload ? (payload as { result: unknown }).result : payload
    if (result === "OK") return "fresh"
    if (result === null) return "replay"
    throw new Error("bad-payload")
  } catch (error) {
    console.error("Match captcha store failed", error instanceof Error ? (error.message || error.name).slice(0, 80) : "error")
    if (shared) return "unavailable"
    return consumeNonceMemory(nonce, Date.now() + ttlSec * 1000) ? "fresh" : "replay"
  }
}

export function searchLimit(): { limit: number; windowSec: number } {
  return { limit: 10, windowSec: 1800 }
}
