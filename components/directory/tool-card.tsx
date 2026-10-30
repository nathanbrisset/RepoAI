"use client"

import { ArrowUpRight, Bookmark, GitCompareArrows } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DirectoryRecord } from "@/lib/directory/data"
import LocaleLink from "@/components/locale-link"
import { useLocale } from "@/components/locale-provider"
import { directoryCopy, fill, viewDetailsFor } from "@/lib/i18n/directory-copy"
import { useDirectory } from "./directory-provider"
import { isRecentAddition, ToolLogo } from "./tool-logo"

export function ToolCard({ tool, index = 0 }: { tool: DirectoryRecord; index?: number }) {
  const locale = useLocale()
  const t = directoryCopy(locale)
  const { isSaved, isComparing, toggleSave, toggleCompare, categoryLabel, today } = useDirectory()
  const saved = isSaved(tool.id)
  const comparing = isComparing(tool.id)
  const recent = isRecentAddition(tool.dateAdded, today)
  const category = categoryLabel(tool.categories[0] || "")
  const price = tool.pricingUncertain ? "" : tool.pricingLabel

  return (
    <article className="group relative animate-rise" style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}>
      <div className="relative flex h-full min-h-[250px] flex-col overflow-hidden rounded-3xl bg-card p-4 text-card-foreground ring-1 ring-border transition duration-300 hover:-translate-y-1 hover:shadow-xl">
        <LocaleLink
          href={`/tool/${tool.id}`}
          aria-label={viewDetailsFor(locale, tool.name)}
          className="absolute inset-0 z-0 rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span className="sr-only">{viewDetailsFor(locale, tool.name)}</span>
        </LocaleLink>
        <div className="pointer-events-none relative z-10 flex items-start justify-between gap-3">
          <ToolLogo tool={tool} />
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => toggleSave(tool.id)}
              aria-pressed={saved}
              title={saved ? t.removeFromScroll : t.saveToScroll}
              className={cn(
                "pointer-events-auto grid size-9 place-items-center rounded-full transition md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100",
                saved ? "bg-foreground text-background" : "bg-muted text-foreground hover:bg-foreground hover:text-background",
              )}
            >
              <Bookmark className="size-4" aria-hidden="true" />
              <span className="sr-only">{saved ? t.removeFromScroll : t.saveToScroll}</span>
            </button>
            <button
              type="button"
              onClick={() => toggleCompare(tool.id)}
              aria-pressed={comparing}
              title={comparing ? t.removeCompare : t.addCompare}
              className={cn(
                "pointer-events-auto grid size-9 place-items-center rounded-full border transition md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100",
                comparing ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card hover:border-foreground",
              )}
            >
              <GitCompareArrows className="size-4" aria-hidden="true" />
              <span className="sr-only">{comparing ? t.removeCompare : t.addCompare}</span>
            </button>
          </div>
        </div>
        <div className="pointer-events-none relative z-10 mt-4 flex flex-1 flex-col">
          <div className="flex flex-wrap items-start gap-2">
            <h3 className="font-display text-lg leading-tight">{tool.name}</h3>
            {recent ? (
              <span className="-rotate-6 rounded-md border-2 border-accent px-1.5 text-[10px] font-bold leading-5 text-accent">
                {t.newBadge}
              </span>
            ) : null}
          </div>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
          <div className="mt-auto flex items-end justify-between gap-3 pt-5">
            <div className="flex flex-wrap gap-1.5">
              {tool.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="rounded-full bg-background px-2.5 py-1 text-xs ring-1 ring-border">
                  #{tag}
                </span>
              ))}
            </div>
            {tool.url ? (
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={fill(t.visitSite, { name: tool.name })}
                className="pointer-events-auto relative z-10 grid size-8 shrink-0 place-items-center rounded-full bg-muted hover:bg-foreground hover:text-background"
              >
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            ) : null}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {[price, category].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>
    </article>
  )
}
