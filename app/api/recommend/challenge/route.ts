import { NextResponse } from "next/server"
import { captchaSecret, issueChallenge } from "@/lib/match-captcha"
import { clientIp, rateLimit } from "@/lib/match-guard"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(req: Request) {
  const ip = clientIp(req.headers)
  const limited = await rateLimit(ip, "challenge", 60, 3600)
  if (!limited.ok) {
    return NextResponse.json(
      { code: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter), "Cache-Control": "no-store" } }
    )
  }
  const secret = captchaSecret()
  if (!secret) {
    return NextResponse.json({ code: "unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } })
  }
  const challenge = issueChallenge(secret)
  return NextResponse.json(
    { token: challenge.token, question: challenge.question },
    { headers: { "Cache-Control": "no-store" } }
  )
}
