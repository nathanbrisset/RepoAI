"use client"

import { ArrowRight } from "lucide-react"
import LocaleLink from "@/components/locale-link"
import { useLocale } from "@/components/locale-provider"
import { directoryCopy, fill } from "@/lib/i18n/directory-copy"
import type { DirectoryRecord } from "@/lib/directory/data"
import { ToolLogo } from "@/components/directory/tool-logo"
import { useDirectory } from "@/components/directory/directory-provider"

type Props = {
  tools: DirectoryRecord[]
  onOpenStack: () => void
  onKeepSwiping: () => void
  onClose: () => void
}

export function SwipeStackScreen({ tools, onOpenStack, onKeepSwiping, onClose }: Props) {
  const locale = useLocale()
  const t = directoryCopy(locale)
  const { categoryLabel } = useDirectory()

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{t.swipeStackKicker}</p>
        <h2 className="mt-2 font-display text-2xl">{t.swipeStackTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {tools.length === 0
            ? t.swipeStackEmpty
            : tools.length === 1
              ? t.swipeStackCountOne
              : fill(t.swipeStackCountMany, { count: tools.length })}
        </p>

        <ul className="mt-6 space-y-3">
          {tools.map((tool) => {
            const category = categoryLabel(tool.categories[0] || "")
            const price = tool.pricingUncertain ? "" : tool.pricingLabel
            return (
              <li key={tool.id} className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3 ring-1 ring-border">
                <ToolLogo tool={tool} className="size-12 text-xl" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{tool.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{[category, price].filter(Boolean).join(" · ")}</p>
                </div>
              </li>
            )
          })}
        </ul>

        <LocaleLink
          href="/recommendation"
          onClick={onClose}
          className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-primary"
        >
          {t.swipePreferFullPage} <ArrowRight className="size-4" />
        </LocaleLink>
      </div>

      <div className="shrink-0 space-y-2 border-t border-border bg-card/95 px-4 py-3 backdrop-blur md:px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          disabled={tools.length === 0}
          onClick={onOpenStack}
          className="flex h-12 w-full items-center justify-center rounded-full bg-accent text-base font-bold text-accent-foreground disabled:opacity-40"
        >
          {t.swipeOpenStack}
        </button>
        <button
          type="button"
          onClick={onKeepSwiping}
          className="flex h-12 w-full items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground"
        >
          {t.swipeKeepSwiping}
        </button>
      </div>
    </div>
  )
}
