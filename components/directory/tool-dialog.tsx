"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowUpRight, Bookmark, BookmarkCheck, X } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import LocaleLink from "@/components/locale-link"
import { useLocale } from "@/components/locale-provider"
import { directoryCopy, fill } from "@/lib/i18n/directory-copy"
import { formatCatalogDate } from "@/lib/i18n/localize-tool"
import { fetchDirectoryRecords } from "@/lib/directory/client-records"
import type { DirectoryRecord } from "@/lib/directory/data"
import { useDirectory } from "./directory-provider"
import { ToolLogo } from "./tool-logo"

export function ToolDialog() {
  const locale = useLocale()
  const t = directoryCopy(locale)
  const { openId, closeTool, recordById, isSaved, toggleSave, openTool, categoryLabel, ensureRecords } =
    useDirectory()
  const tool = openId ? recordById(openId) : undefined
  const [similar, setSimilar] = useState<DirectoryRecord[]>([])
  const categoryId = tool?.categories[0]
  const label = categoryId ? categoryLabel(categoryId) : ""
  const saved = tool ? isSaved(tool.id) : false
  const checked = tool?.lastVerified ? formatCatalogDate(tool.lastVerified, locale) : t.notChecked
  const price = tool && !tool.pricingUncertain ? tool.pricingLabel : ""

  useEffect(() => {
    if (!openId) {
      setSimilar([])
      return
    }
    void ensureRecords([openId])
    void fetchDirectoryRecords(`similarFor=${encodeURIComponent(openId)}&limit=3`).then(setSimilar)
  }, [openId, ensureRecords])

  return (
    <Dialog.Root open={Boolean(tool)} onOpenChange={(open) => { if (!open) closeTool() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-foreground/50 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-[80] w-full max-h-[92dvh] overflow-y-auto rounded-t-3xl bg-card text-card-foreground shadow-2xl outline-none",
            "md:inset-x-auto md:top-1/2 md:bottom-auto md:left-1/2 md:max-h-[min(90vh,720px)] md:w-full md:max-w-xl md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl",
          )}
        >
          {tool ? (
            <div className="flex flex-col gap-5 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <ToolLogo tool={tool} className="size-14 text-2xl" />
                <div className="min-w-0 flex-1">
                  <Dialog.Title className="break-words font-display text-2xl leading-tight md:text-3xl">{tool.name}</Dialog.Title>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {[label, price, checked].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <Dialog.Close
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-muted hover:bg-foreground hover:text-background"
                  aria-label={t.close}
                >
                  <X className="size-5" />
                </Dialog.Close>
              </div>
              <Dialog.Description className="break-words text-base font-medium leading-relaxed md:text-lg">{tool.description}</Dialog.Description>
              <div className="flex flex-wrap gap-3">
                <LocaleLink
                  href={`/tool/${tool.id}`}
                  onClick={closeTool}
                  className="flex h-12 min-w-0 items-center justify-center rounded-full bg-primary px-6 font-semibold text-primary-foreground hover:-translate-y-0.5"
                >
                  {t.fullPage}
                </LocaleLink>
                {tool.url ? (
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 items-center gap-2 rounded-full bg-muted px-5 font-semibold hover:bg-foreground hover:text-background"
                  >
                    {fill(t.visitName, { name: tool.name })}
                    <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => toggleSave(tool.id)}
                  aria-pressed={saved}
                  className={cn(
                    "flex h-12 items-center gap-2 rounded-full px-5 font-semibold",
                    saved ? "bg-foreground text-background" : "bg-accent text-accent-foreground",
                  )}
                >
                  {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                  {saved ? t.inScroll : t.saveScroll}
                </button>
              </div>
              {tool.features.length > 0 ? (
                <ul className="list-disc space-y-1 break-words pl-5 text-sm text-muted-foreground">
                  {tool.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              ) : null}
              {tool.tags.length > 0 ? (
                <ul className="flex flex-wrap gap-2" aria-label={t.rowCategories}>
                  {tool.tags.map((tag) => (
                    <li key={tag}>
                      <LocaleLink
                        href={`/catalogue?q=${encodeURIComponent(tag)}`}
                        onClick={closeTool}
                        className="inline-block rounded-full bg-background px-3 py-1 text-sm font-medium ring-1 ring-border hover:bg-foreground hover:text-background"
                      >
                        #{tag}
                      </LocaleLink>
                    </li>
                  ))}
                </ul>
              ) : null}
              {similar.length > 0 ? (
                <div className="border-t pt-5">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {fill(t.alsoIn, { category: label })}
                  </h4>
                  <ul className="mt-3 flex flex-col gap-1">
                    {similar.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => openTool(item.id)}
                          className="flex w-full min-w-0 items-center gap-3 rounded-2xl p-2 text-left hover:bg-muted"
                        >
                          <ToolLogo tool={item} className="size-9 text-base" />
                          <span className="min-w-0">
                            <span className="block font-semibold">{item.name}</span>
                            <span className="block truncate text-sm text-muted-foreground">{item.description}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : (
            <Dialog.Title className="sr-only">{t.close}</Dialog.Title>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
