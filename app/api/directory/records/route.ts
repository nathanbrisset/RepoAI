import { NextRequest, NextResponse } from "next/server"
import { directoryRecords, type DirectoryRecord } from "@/lib/directory/data"
import { randomDirectoryRecord, similarDirectoryRecords } from "@/lib/directory/catalog-query"
import { getLocale } from "@/lib/i18n/get-locale"

const CACHE = "public, s-maxage=3600, stale-while-revalidate=86400"

function byIds(records: DirectoryRecord[], ids: string[]) {
  const map = new Map(records.map((record) => [record.id, record]))
  return ids.map((id) => map.get(id)).filter((record): record is DirectoryRecord => Boolean(record))
}

export async function GET(request: NextRequest) {
  const locale = await getLocale()
  const records = directoryRecords(locale)
  const params = request.nextUrl.searchParams

  if (params.get("random") === "1") {
    const pick = randomDirectoryRecord(locale)
    return NextResponse.json(pick ? [pick] : [], { headers: { "Cache-Control": "no-store" } })
  }

  const similarFor = params.get("similarFor")?.trim()
  if (similarFor) {
    const base = records.find((record) => record.id === similarFor)
    if (!base) {
      return NextResponse.json([], { headers: { "Cache-Control": CACHE } })
    }
    const limitRaw = Number.parseInt(params.get("limit") || "3", 10)
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 12) : 3
    return NextResponse.json(similarDirectoryRecords(locale, base, limit), {
      headers: { "Cache-Control": CACHE },
    })
  }

  if (params.get("all") === "1") {
    return NextResponse.json(records, { headers: { "Cache-Control": CACHE } })
  }

  const ids = (params.get("ids") || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
  if (ids.length === 0) {
    return NextResponse.json([], { status: 400 })
  }

  const unique = [...new Set(ids)].slice(0, 48)
  return NextResponse.json(byIds(records, unique), { headers: { "Cache-Control": CACHE } })
}
