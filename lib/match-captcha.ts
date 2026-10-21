import { createHmac, randomBytes, randomInt, timingSafeEqual } from "crypto"

const CHALLENGE_TTL_MS = 10 * 60 * 1000

export function captchaSecret(): string | null {
  const secret = process.env.MATCH_CAPTCHA_SECRET
  if (secret && secret.length >= 16) return secret
  if (process.env.NODE_ENV !== "production") return "dev-match-captcha-secret"
  return null
}

type ChallengeOptions = {
  now?: number
  a?: number
  b?: number
  nonce?: string
}

export function issueChallenge(secret: string, options: ChallengeOptions = {}) {
  const now = options.now ?? Date.now()
  const a = options.a ?? randomInt(2, 10)
  const b = options.b ?? randomInt(2, 10)
  const nonce = options.nonce ?? randomBytes(9).toString("base64url")
  const exp = now + CHALLENGE_TTL_MS
  const payload = Buffer.from(JSON.stringify({ a, b, exp, nonce })).toString("base64url")
  const sig = createHmac("sha256", secret).update(payload).digest("base64url")
  return { token: `${payload}.${sig}`, question: `${a} + ${b}`, nonce, exp }
}

export function verifyChallenge(
  secret: string,
  token: string,
  answer: string,
  now = Date.now()
): { ok: true; nonce: string; ttlSec: number } | { ok: false } {
  if (typeof token !== "string" || token.length > 800 || typeof answer !== "string" || answer.length > 8) {
    return { ok: false }
  }
  const dot = token.indexOf(".")
  if (dot <= 0) return { ok: false }
  const payload = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expected = createHmac("sha256", secret).update(payload).digest("base64url")
  const given = Buffer.from(sig)
  const wanted = Buffer.from(expected)
  if (given.length !== wanted.length || !timingSafeEqual(given, wanted)) return { ok: false }
  let data: { a?: unknown; b?: unknown; exp?: unknown; nonce?: unknown }
  try {
    data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
  } catch {
    return { ok: false }
  }
  if (typeof data.a !== "number" || typeof data.b !== "number" || typeof data.exp !== "number") return { ok: false }
  if (typeof data.nonce !== "string" || data.nonce.length < 6) return { ok: false }
  if (data.exp < now) return { ok: false }
  const expectedAnswer = data.a + data.b
  if (!/^\d+$/.test(answer.trim()) || Number(answer.trim()) !== expectedAnswer) return { ok: false }
  const ttlSec = Math.max(30, Math.ceil((data.exp - now) / 1000))
  return { ok: true, nonce: data.nonce, ttlSec }
}
