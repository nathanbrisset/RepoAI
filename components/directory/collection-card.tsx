"use client"

import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import type { DirectoryRecord } from "@/lib/directory/data"
import { useLocale } from "@/components/locale-provider"
import { directoryCopy } from "@/lib/i18n/directory-copy"
import { localizeHref } from "@/lib/i18n/paths"
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
        className="group flex min-h-[280px] w-full flex-col justify-between overflow-hidden rounded-3xl bg-foreground p-5 text-left text-background transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-accent px-2.5 py-1 text-xs font-semibold tracking-widest text-accent uppercase">{t.dojoPick}</span>
          <span className="text-xs text-background/70">{t.editorial}</span>
        </div>
        <div className="flex">
          {tools.slice(0, 4).map((tool, toolIndex) => (
            <span key={tool.id} className="-ml-3 first:ml-0" style={{ zIndex: 4 - toolIndex }}>
              <ToolLogo tool={tool} className="size-12 bg-card text-foreground ring-4 ring-foreground" />
            </span>
          ))}
        </div>
        <div>
          <h3 className="font-display text-xl leading-tight">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-background/70">{blurb}</p>
        </div>
        <span className="flex items-center gap-2 text-sm font-semibold">
          <span className="truncate">{tools.map((tool) => tool.name).join(" + ")}</span>
          <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </button>
    </article>
  )
}
