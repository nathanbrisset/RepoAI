"use client"

import { MatchResultCard } from "@/components/match/match-result-card"
import type { Locale } from "@/lib/i18n/config"
import type { Tool } from "@/lib/types"

export function MatchResultsList({
  locale,
  rows,
}: {
  locale: Locale
  rows: { tool: Tool; explanation: string }[]
}) {
  return (
    <ol className="flex flex-col gap-5">
      {rows.map((row, index) => (
        <li key={row.tool.id}>
          <MatchResultCard
            locale={locale}
            rank={index + 1}
            tool={row.tool}
            reason={row.explanation}
            featured={index === 0}
          />
        </li>
      ))}
    </ol>
  )
}
