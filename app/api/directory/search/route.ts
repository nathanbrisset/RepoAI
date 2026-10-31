import { NextRequest, NextResponse } from "next/server"
import { rankCatalogSearch } from "@/lib/catalog-search"
import { directoryRecords } from "@/lib/directory/data"
import { getLocale } from "@/lib/i18n/get-locale"

const CACHE = "public, s-maxage=3600, stale-while-revalidate=86400"

export async function GET(request: NextRequest) {
  const locale = await getLocale()
  const q = (request.nextUrl.searchParams.get("q") || "").trim()
  const limitRaw = Number.parseInt(request.nextUrl.searchParams.get("limit") || "8", 10)
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 24) : 8

  if (q.length < 2) {
    return NextResponse.json([], { headers: { "Cache-Control": CACHE } })
  }

  const records = directoryRecords(locale)
  const results = rankCatalogSearch(records, q, locale)
    .slice(0, limit)
    .map((row) => row.record)

  return NextResponse.json(results, { headers: { "Cache-Control": CACHE } })
}
