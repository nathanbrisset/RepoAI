"use client"

import { useEffect, useId, useRef } from "react"
import { createPortal } from "react-dom"
import { ArrowUpRight, Bookmark, BookmarkCheck, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { categoryArt } from "@/lib/directory/art"
import { formatCatalogDay } from "@/lib/directory/tools"
import { categoryCopy } from "@/lib/i18n/messages"
import LocaleLink from "@/components/locale-link"
import { useLocale, useT } from "@/components/locale-provider"
import { ToolLogo } from "./tool-logo"
import { useDirectory } from "./directory-context"

export function ToolDialog() {
  const t = useT()
  const locale = useLocale()
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const { tools, activeTool: tool, detailOpen, setDetailOpen, saved, toggleSave, openTool, setQuery } = useDirectory()

  useEffect(() => {
    if (!detailOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDetailOpen(false)
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", onKey)
    }
  }, [detailOpen, setDetailOpen, tool?.id])

  if (!detailOpen || !tool || typeof document === "undefined") return null

  const primary = tool.categories[0]
  const label = primary ? categoryCopy(locale, primary)?.name || primary : ""
  const checked = formatCatalogDay(tool.lastVerified, locale)
  const meta = [label, tool.pricingLabel, checked ? t("directory.checked", { date: checked }) : ""].filter(Boolean).join(" · ")
  const similar = primary
    ? tools.filter((item) => item.id !== tool.id && item.categories[0] === primary).slice(0, 3)
    : []
  const isSaved = saved.includes(tool.id)

  return createPortal(
    <div className="fixed inset-0 z-[70]">
      <button type="button" className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" aria-label={t("directory.close")} onClick={() => setDetailOpen(false)} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-x-0 bottom-0 z-10 max-h-[92dvh] overflow-y-auto rounded-t-4xl bg-card text-card-foreground shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300 md:inset-x-auto md:top-1/2 md:bottom-auto md:left-1/2 md:w-full md:max-w-3xl md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-4xl"
      >
        <div className="grid md:grid-cols-[2fr_3fr]">
          <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-full">
            <img src={categoryArt(primary)} alt="" className="absolute inset-0 size-full scale-110 object-cover" />
          </div>
          <div className="flex flex-col gap-5 p-6 md:p-8">
            <div className="flex items-start gap-4">
              <ToolLogo tool={tool} className="size-14 text-2xl" />
              <div className="flex flex-1 flex-col gap-1">
                <h2 id={titleId} className="font-display text-3xl leading-tight">
                  {tool.name}
                </h2>
                {meta ? <p className="text-sm text-muted-foreground">{meta}</p> : null}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setDetailOpen(false)}
                className="grid size-10 shrink-0 place-items-center rounded-full bg-muted transition hover:bg-foreground hover:text-background"
                aria-label={t("directory.close")}
              >
                <X className="size-5" />
              </button>
            </div>

            {tool.tagline ? <p className="text-lg leading-relaxed font-medium text-pretty">{tool.tagline}</p> : null}
            {tool.description ? <p className="leading-relaxed text-muted-foreground">{tool.description}</p> : null}

            {tool.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label={t("directory.tags")}>
                {tool.tags.map((tag) => (
                  <li key={tag}>
                    <button
                      type="button"
                      onClick={() => {
                        setDetailOpen(false)
                        setQuery(tag)
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }}
                      className="rounded-full bg-background px-3 py-1 text-sm font-medium ring-1 ring-border transition hover:bg-foreground hover:text-background"
                    >
                      #{tag}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap gap-3">
              {tool.url ? (
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground transition hover:-translate-y-0.5"
                >
                  {t("directory.visit", { name: tool.name })}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              ) : null}
              <button
                type="button"
                onClick={() => toggleSave(tool.id)}
                aria-pressed={isSaved}
                className={cn(
                  "flex h-12 items-center gap-2 rounded-full px-6 font-semibold transition",
                  isSaved ? "bg-foreground text-background" : "bg-accent text-accent-foreground",
                )}
              >
                {isSaved ? <BookmarkCheck className="size-4" aria-hidden="true" /> : <Bookmark className="size-4" aria-hidden="true" />}
                {isSaved ? t("directory.inScroll") : t("directory.saveScroll")}
              </button>
              <LocaleLink
                href={`/tool/${tool.id}`}
                className="flex h-12 items-center rounded-full px-5 font-semibold ring-1 ring-border hover:bg-muted"
              >
                {t("directory.seePage")}
              </LocaleLink>
            </div>

            {similar.length > 0 && (
              <div className="flex flex-col gap-3 border-t pt-5">
                <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  {t("directory.alsoIn", { category: label })}
                </h3>
                <ul className="flex flex-col gap-1">
                  {similar.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => openTool(item.id)}
                        className="flex w-full items-center gap-3 rounded-2xl p-2 text-left transition hover:bg-muted"
                      >
                        <ToolLogo tool={item} className="size-9 text-base" />
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="font-semibold">{item.name}</span>
                          <span className="truncate text-sm text-muted-foreground">{item.tagline}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
