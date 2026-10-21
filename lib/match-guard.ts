/**
 * Per-IP rate limit and one-time captcha nonces.
 * On Vercel, set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
 * (KV_REST_API_URL and KV_REST_API_TOKEN are accepted) so the counters
 * are shared across instances. Without them, each instance keeps its own.
 */

type Bucket = { count: number; reset: number }
type LimitResult = { ok: true; retryAfter: 0 } | { ok: false; retryAfter: number }

const buckets = new Map<string, Bucket>()
const nonces = new Map<string, number>()

function redisConfig() {
  const url = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "").replace(/\/$/, "")
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || ""
  if (!url || !token) return null
  return { url, token }
}

export function clientIp(headers: { get(name: string): string | null }): string {
  const real = headers.get("x-real-ip")
  const forwarded = headers.get("x-forwarded-for")
  const raw = (real || forwarded || "unknown").split(",")[0].trim()
  if (/^[a-fA-F0-9:.]{3,64}$/.test(raw)) return raw
  return "unknown"
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
    return { ok: true, retryAfter: 0 }
  }
  if (current.count >= limit) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((current.reset - now) / 1000)) }
  }
  current.count += 1
  return { ok: true, retryAfter: 0 }
}

async function redisCommand(command: unknown, pipeline = false): Promise<unknown> {
  const config = redisConfig()
  if (!config) return null
  const response = await fetch(pipeline ? `${config.url}/pipeline` : config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(2000),
  })
  if (!response.ok) throw new Error("redis")
  return response.json()
}

function pipelineValues(payload: unknown): unknown[] {
  if (payload && typeof payload === "object" && "result" in payload && Array.isArray((payload as { result: unknown }).result)) {
    return pipelineValues((payload as { result: unknown[] }).result)
  }
  if (!Array.isArray(payload)) return []
  return payload.map((item) => (item && typeof item === "object" && "result" in item ? (item as { result: unknown }).result : item))
}

export async function rateLimit(ip: string, bucketName: string, limit: number, windowSec: number): Promise<LimitResult> {
  const key = `match:${bucketName}:${ip}`
  if (redisConfig()) {
    try {
      const payload = await redisCommand(
        [
          ["INCR", key],
          ["EXPIRE", key, windowSec, "NX"],
          ["TTL", key],
        ],
        true
      )
      const [count, , ttl] = pipelineValues(payload)
      if (typeof count === "number") {
        if (count > limit) {
          const retryAfter = typeof ttl === "number" && ttl > 0 ? ttl : windowSec
          return { ok: false, retryAfter }
        }
        return { ok: true, retryAfter: 0 }
      }
    } catch (error) {
      console.error("Match rate limit store failed", error instanceof Error ? error.name : "error")
    }
  }
  return takeToken(ip, bucketName, limit, windowSec)
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

export async function consumeNonce(nonce: string, ttlSec: number): Promise<boolean> {
  const key = `match-nonce:${nonce}`
  if (redisConfig()) {
    try {
      const payload = await redisCommand(["SET", key, "1", "EX", ttlSec, "NX"])
      const result = payload && typeof payload === "object" && "result" in payload ? (payload as { result: unknown }).result : payload
      if (result === "OK") return true
      if (result === null) return false
    } catch (error) {
      console.error("Match captcha store failed", error instanceof Error ? error.name : "error")
    }
  }
  return consumeNonceMemory(nonce, Date.now() + ttlSec * 1000)
}

export function searchLimit(): { limit: number; windowSec: number } {
  return { limit: 10, windowSec: 1800 }
}
