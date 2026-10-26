"use client"

import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import type { DirectoryRecord } from "@/lib/directory/data"
import { useLocale } from "@/components/locale-provider"
import { directoryCopy } from "@/lib/i18n/directory-copy"
import { localizeHref } from "@/lib/i18n/paths"
import { cn } from "@/lib/utils"
import { ToolLogo } from "./tool-logo"

export function CollectionCard({
  slug,
  title,
  blurb,
  tools,
  index = 0,
}: {
  slug: string
  title: string
  blurb: string
  tools: DirectoryRecord[]
  index?: number
}) {
  const locale = useLocale()
  const t = directoryCopy(locale)
  const router = useRouter()
  return (
    <article className="animate-rise" style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}>
      <button
        type="button"
        onClick={() => router.push(localizeHref(locale, `/collections/${slug}`))}
        className="group flex w-full min-w-0 max-w-full flex-col gap-4 overflow-hidden rounded-3xl bg-foreground p-4 text-left text-background transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:min-h-[280px] sm:justify-between sm:gap-0 sm:p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="shrink-0 rounded-full border border-accent px-2 py-0.5 text-[10px] font-semibold tracking-widest text-accent uppercase sm:px-2.5 sm:py-1 sm:text-xs">
            {t.dojoPick}
          </span>
          <span className="text-right text-[10px] leading-snug text-background/70 sm:text-xs">{t.editorial}</span>
        </div>
        <div className="flex max-w-full flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-0 sm:overflow-hidden">
          {tools.slice(0, 4).map((tool, toolIndex) => (
            <span
              key={tool.id}
              className={cn("shrink-0", toolIndex > 0 && "sm:-ml-3")}
              style={{ zIndex: 4 - toolIndex }}
            >
              <ToolLogo
                tool={tool}
                className="size-10 bg-card text-foreground ring-2 ring-foreground sm:size-12 sm:ring-4"
              />
            </span>
          ))}
        </div>
        <div className="min-w-0 space-y-1.5">
          <h3 className="font-display text-lg leading-snug sm:text-xl">{title}</h3>
          <p className="text-sm leading-relaxed text-background/75 line-clamp-3 sm:line-clamp-none">{blurb}</p>
        </div>
        <span className="flex min-w-0 items-start gap-2 text-xs font-semibold leading-snug sm:items-center sm:text-sm">
          <span className="min-w-0 flex-1 line-clamp-2 sm:truncate">{tools.map((tool) => tool.name).join(" + ")}</span>
          <ArrowRight className="mt-0.5 size-4 shrink-0 transition-transform group-hover:translate-x-1 sm:mt-0" aria-hidden="true" />
        </span>
      </button>
    </article>
  )
}
