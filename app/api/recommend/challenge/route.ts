import { NextResponse } from "next/server"
import { captchaSecret, issueChallenge } from "@/lib/match-captcha"
import { clientIp, rateHeaders, rateLimit, rateSubject } from "@/lib/match-guard"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(req: Request) {
  const ip = clientIp(req.headers)
  const limited = await rateLimit(ip, "challenge", 60, 3600)
  const headers = rateHeaders(limited)
  headers["X-RateLimit-Subject"] = rateSubject(ip)
  if (!limited.ok) {
    const code = limited.status === 503 ? "unavailable" : "rate_limited"
    return NextResponse.json({ code }, { status: limited.status, headers })
  }
  const secret = captchaSecret()
  if (!secret) {
    return NextResponse.json({ code: "unavailable" }, { status: 503, headers })
  }
  const challenge = issueChallenge(secret)
  return NextResponse.json({ token: challenge.token, question: challenge.question }, { headers })
}
