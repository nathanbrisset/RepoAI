import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getLocale } from "@/lib/i18n/get-locale"
import { metadataFor } from "@/lib/i18n/metadata"
import { translate } from "@/lib/i18n/messages"
import { localizeHref } from "@/lib/i18n/paths"
import type { Tool } from "@/lib/types"
import { notFound } from "next/navigation"
import { MatchResultsList } from "@/components/match/match-results-list"
import { Shuriken } from "@/components/directory/shuriken"
import { messageForCode } from "@/lib/match-copy"

interface MatchResult {
  tool: Tool
  explanation: string
}

export function generateMetadata() {
  return metadataFor("/match-results")
}

export default async function MatchResultsPage(props: {
  searchParams?: Promise<{ query?: string }> | { query?: string }
}) {
  const resolved =
    props.searchParams && typeof (props.searchParams as Promise<unknown>).then === "function"
      ? await (props.searchParams as Promise<{ query?: string }>)
      : (props.searchParams as { query?: string } | undefined)
  const query = resolved?.query

  if (!query) {
    notFound()
  }

  const locale = await getLocale()
  const t = (key: string) => translate(locale, key)

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: query, locale }),
  })

  const data = await response.json().catch(() => ({}))
  const errorCode = typeof data?.code === "string" ? data.code : !response.ok ? "unavailable" : null

  if (errorCode) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl">{t("recommendation.noMatch")}</h1>
        <p className="mt-3 text-muted-foreground" role="alert">{messageForCode(errorCode, query)}</p>
        <Link href={localizeHref(locale, `/recommendation?query=${encodeURIComponent(query)}`)} className="mt-6 inline-block">
          <Button>{t("recommendation.runAgain")}</Button>
        </Link>
      </div>
    )
  }

  const results: MatchResult[] = data?.recommendations || []
  const intro = data?.intro || ""
  const topTools = results.filter((r) => r?.tool?.id).slice(0, 3)

  if (!topTools.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl">{t("recommendation.noMatch")}</h1>
        <p className="mt-3 text-muted-foreground" role="alert">{messageForCode("no_match", query)}</p>
        <Link href={localizeHref(locale, "/")}>
          <Button className="mt-6">
            <ArrowLeft className="mr-2 size-4" />
            {t("recommendation.backHome")}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href={localizeHref(locale, "/")} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        <ArrowLeft className="size-4" />
        {t("recommendation.backHome")}
      </Link>
      <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
        <Shuriken className="size-3.5 text-primary" />
        {t("recommendation.kicker")}
      </p>
      <h1 className="font-display text-3xl">{t("recommendation.resultsTitle")}</h1>
      <section className="mt-6 rounded-2xl bg-card p-4 ring-1 ring-border">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{t("recommendation.queryLabel")}</p>
        <p className="mt-2 text-base leading-relaxed">{query}</p>
      </section>
      {intro ? <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{intro}</p> : null}
      <div className="mt-8">
        <MatchResultsList locale={locale} rows={topTools} />
      </div>
      <Link href={localizeHref(locale, `/recommendation?query=${encodeURIComponent(query)}`)} className="mt-8 inline-block">
        <Button variant="secondary">{t("recommendation.runAgain")}</Button>
      </Link>
    </div>
  )
}

