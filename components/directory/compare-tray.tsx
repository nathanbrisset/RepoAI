"use client"

import { ArrowRight, Plus, X } from "lucide-react"
import { useRouter } from "next/navigation"
import LocaleLink from "@/components/locale-link"
import { useLocale } from "@/components/locale-provider"
import { directoryCopy, fill } from "@/lib/i18n/directory-copy"
import { localizeHref } from "@/lib/i18n/paths"
import { useDirectory } from "./directory-provider"
import { ToolLogo } from "./tool-logo"

export function CompareSpacer() {
  const { compare } = useDirectory()
  if (compare.length === 0) return null
  return <div className="h-28" aria-hidden="true" />
}

export function CompareTray() {
  const locale = useLocale()
  const t = directoryCopy(locale)
  const router = useRouter()
  const { compare, recordById, removeCompare } = useDirectory()
  const selected = compare.map((id) => recordById(id)).filter((tool) => Boolean(tool))
  if (selected.length === 0) return null

  return (
    <aside
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-4xl rounded-3xl bg-foreground p-3 text-background shadow-2xl md:inset-x-6 md:p-4"
      aria-label={t.compareTray}
    >
      <div className="flex items-center gap-3 overflow-x-auto">
        <div className="flex shrink-0 items-center gap-2 text-sm font-semibold">
          <span className="grid size-7 place-items-center rounded-full bg-accent text-accent-foreground">{selected.length}</span>
          <span className="hidden sm:inline">{t.compare}</span>
        </div>
        {selected.map((tool) =>
          tool ? (
            <div key={tool.id} className="flex shrink-0 items-center gap-2 rounded-2xl bg-background/10 py-1.5 pr-2 pl-1.5">
              <ToolLogo tool={tool} className="size-8 rounded-lg bg-background text-sm text-foreground" />
              <span className="max-w-28 truncate text-xs font-semibold">{tool.name}</span>
              <button
                type="button"
                onClick={() => removeCompare(tool.id)}
                aria-label={fill(t.compareRemove, { name: tool.name })}
                className="grid size-6 place-items-center rounded-full hover:bg-background/20"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ) : null,
        )}
        {Array.from({ length: Math.max(0, 4 - selected.length) }).map((_, index) => (
          <span key={index} className="grid size-11 shrink-0 place-items-center rounded-2xl border border-dashed border-background/30" aria-label={t.emptySlot}>
            <Plus className="size-4 opacity-50" />
          </span>
        ))}
        <button
          type="button"
          disabled={selected.length < 2}
          onClick={() => router.push(localizeHref(locale, `/compare?tools=${compare.join(",")}`))}
          className="ml-auto flex h-11 shrink-0 items-center gap-2 rounded-full bg-accent px-4 text-sm font-semibold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t.compareNow}
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
      <LocaleLink href="/compare" className="sr-only">
        {t.compareTitle}
      </LocaleLink>
    </aside>
  )
}
