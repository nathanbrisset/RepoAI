"use client"

import { memo } from "react"
import { ArrowUpRight, Bookmark, GitCompareArrows } from "lucide-react"
import { cn } from "@/lib/utils"
import { categoryArt } from "@/lib/directory/art"
import { isRecentlyAdded, type DirectoryTool } from "@/lib/directory/tools"
import { categoryCopy } from "@/lib/i18n/messages"
import LocaleLink from "@/components/locale-link"
import { useLocale, useT } from "@/components/locale-provider"
import { ToolLogo } from "./tool-logo"

export function ToolCard({
  tool,
  index,
  illustrated,
  saved,
  comparing,
  onToggleSave,
  onToggleCompare,
  onOpen,
  onTag,
}: {
  tool: DirectoryTool
  index: number
  illustrated: boolean
  saved: boolean
  comparing: boolean
  onToggleSave: (id: string) => void
  onToggleCompare: (id: string) => void
  onOpen: (id: string) => void
  onTag: (tag: string) => void
}) {
  const t = useT()
  const locale = useLocale()
  const primary = tool.categories[0]
  const categoryName = primary ? categoryCopy(locale, primary)?.name || primary : ""
  const isNew = isRecentlyAdded(tool.dateAdded)

  return (
    <article className="group relative animate-rise" style={{ animationDelay: `${Math.min(index, 18) * 45}ms` }}>
      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-3xl p-4 ring-1 ring-border transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/10 motion-safe:hover:rotate-[0.35deg]",
          illustrated ? "min-h-[360px] bg-foreground text-background" : "min-h-[260px] bg-card",
        )}
      >
        {illustrated && (
          <div className="relative -mx-4 -mt-4 mb-4 h-48 shrink-0 overflow-hidden">
            <img src={categoryArt(primary)} alt="" className="pointer-events-none absolute inset-0 size-full object-cover" />
          </div>
        )}
        <LocaleLink
          href={`/tool/${tool.id}`}
          onClick={(event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
            event.preventDefault()
            onOpen(tool.id)
          }}
          className="absolute inset-0 z-10 rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span className="sr-only">{t("directory.viewDetails", { name: tool.name })}</span>
        </LocaleLink>
        <div className="pointer-events-none relative z-20 flex items-start justify-between gap-3">
          <ToolLogo tool={tool} />
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              title={saved ? t("directory.unsave") : t("directory.save")}
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                onToggleSave(tool.id)
              }}
              aria-pressed={saved}
              className={cn(
                "pointer-events-auto grid size-9 place-items-center rounded-full transition",
                saved || comparing ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100",
                saved ? "bg-foreground text-background" : "bg-muted text-foreground hover:bg-foreground hover:text-background",
              )}
            >
              <Bookmark className="size-4" aria-hidden="true" />
              <span className="sr-only">{saved ? t("directory.unsave") : t("directory.save")}</span>
            </button>
            <button
              type="button"
              title={comparing ? t("directory.removeCompare") : t("directory.addCompare")}
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                onToggleCompare(tool.id)
              }}
              aria-pressed={comparing}
              className={cn(
                "pointer-events-auto grid size-9 place-items-center rounded-full border transition",
                "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100",
                comparing ? "border-accent bg-accent text-accent-foreground opacity-100" : "border-border bg-card text-foreground hover:border-foreground",
              )}
            >
              <GitCompareArrows className="size-4" aria-hidden="true" />
              <span className="sr-only">{comparing ? t("directory.removeCompare") : t("directory.addCompare")}</span>
            </button>
          </div>
        </div>
        <div className={cn("pointer-events-none relative z-20 mt-4 flex flex-1 flex-col", illustrated ? "rounded-2xl bg-cream p-3 text-foreground" : "text-foreground")}>
          <div className="flex flex-wrap items-start gap-2">
            <h3 className="font-display text-lg leading-tight">{tool.name}</h3>
            {isNew && (
              <span className="-rotate-6 rounded-md border-2 border-accent px-1.5 text-[10px] font-bold leading-5 text-accent shadow-[2px_2px_0_oklch(0.65_0.2_35)]">
                {t("home.badgeNew")}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tool.tagline}</p>
          <div className="mt-auto flex items-end justify-between gap-3 pt-5">
            <div className="flex flex-wrap gap-1.5">
              {tool.tags.slice(0, 2).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    onTag(tag)
                  }}
                  className="pointer-events-auto rounded-full bg-background px-2.5 py-1 text-xs text-foreground ring-1 ring-border hover:bg-foreground hover:text-background"
                >
                  #{tag}
                </button>
              ))}
            </div>
            {tool.url ? (
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("directory.visitSite", { name: tool.name })}
                className="pointer-events-auto relative z-20 grid size-8 shrink-0 place-items-center rounded-full bg-muted text-foreground hover:bg-foreground hover:text-background"
              >
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            ) : null}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {[tool.pricingLabel, categoryName].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>
    </article>
  )
}

export const MemoToolCard = memo(ToolCard)
