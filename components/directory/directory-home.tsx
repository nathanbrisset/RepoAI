"use client"

import { useCallback, useDeferredValue, useMemo } from "react"
import { categoryCatalog } from "@/lib/category-meta"
import { categoryArt } from "@/lib/directory/art"
import { wallTools } from "@/lib/directory/filter"
import { DOJO_PICKS } from "@/lib/directory/picks"
import { categoryCopy } from "@/lib/i18n/messages"
import { useLocale, useT } from "@/components/locale-provider"
import { CollectionCard } from "./collection-card"
import { useDirectory } from "./directory-context"
import { Hero } from "./hero"
import { Shuriken } from "./shuriken"
import { MemoToolCard } from "./tool-card"

export function DirectoryHome() {
  const t = useT()
  const locale = useLocale()
  const directory = useDirectory()
  const deferredQuery = useDeferredValue(directory.query)
  const visible = useMemo(
    () =>
      wallTools(directory.tools, {
        query: deferredQuery,
        category: directory.category,
        sort: directory.sort,
        collectionId: directory.collectionId,
        locale,
      }),
    [directory.tools, deferredQuery, directory.category, directory.sort, directory.collectionId, locale],
  )
  const showRails = directory.category === "all" && !deferredQuery.trim() && !directory.collectionId
  const activePick = DOJO_PICKS.find((pick) => pick.id === directory.collectionId)
  const filterByTag = useCallback((tag: string) => {
    directory.setQuery(tag)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [directory.setQuery])

  return (
    <>
      <Hero />
      <section aria-label={t("directory.wallLabel")} className="mx-auto max-w-[1600px] px-4 pb-16 md:px-6">
        <p className="sr-only" aria-live="polite">
          {t("directory.toolsShown", { count: visible.length })}
        </p>
        {activePick && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card px-4 py-3 ring-1 ring-border">
            <p className="font-semibold">{t(activePick.titleKey)}</p>
            <button type="button" onClick={directory.clearFilters} className="text-sm font-semibold text-primary hover:underline">
              {t("directory.clearCollection")}
            </button>
          </div>
        )}
        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-4xl bg-card px-6 py-20 text-center ring-1 ring-border">
            <Shuriken className="size-12 text-accent motion-safe:animate-[spin_4s_linear_infinite]" />
            <h2 className="font-display text-2xl text-balance">
              {deferredQuery ? t("directory.emptyTitle", { query: deferredQuery }) : t("directory.emptyCategory")}
            </h2>
            <p className="max-w-md leading-relaxed text-muted-foreground">{t("directory.emptyBody")}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button type="button" onClick={directory.clearFilters} className="h-11 rounded-full bg-foreground px-5 font-semibold text-background">
                {t("directory.clearFilters")}
              </button>
              <button
                type="button"
                onClick={() => {
                  const pool = directory.tools
                  const pick = pool[Math.floor(Math.random() * pool.length)]
                  if (pick) directory.openTool(pick.id)
                }}
                className="h-11 rounded-full bg-accent px-5 font-semibold text-accent-foreground"
              >
                {t("directory.randomTool")}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4 2xl:columns-5">
              {visible.map((tool, index) => (
                <div key={tool.id} className="mb-4 break-inside-avoid">
                  <MemoToolCard
                    tool={tool}
                    index={index}
                    illustrated={index % 4 === 0}
                    saved={directory.saved.includes(tool.id)}
                    comparing={directory.compare.includes(tool.id)}
                    onToggleSave={directory.toggleSave}
                    onToggleCompare={directory.toggleCompare}
                    onOpen={directory.openTool}
                    onTag={filterByTag}
                  />
                </div>
              ))}
            </div>
            {showRails && (
              <div className="mt-16 space-y-14">
                <section>
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold tracking-[0.2em] text-accent uppercase">{t("directory.missionEyebrow")}</p>
                      <h2 className="mt-1 font-display text-2xl">{t("directory.missionTitle")}</h2>
                    </div>
                    <span className="text-sm text-muted-foreground">{t("directory.missionScroll")}</span>
                  </div>
                  <div className="grid auto-cols-[150px] grid-flow-col gap-3 overflow-x-auto pb-2 md:auto-cols-[180px]">
                    {categoryCatalog.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          directory.setCategory(category.id)
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }}
                        className="group relative h-36 overflow-hidden rounded-2xl text-left ring-1 ring-border transition hover:-translate-y-1"
                      >
                        <img src={categoryArt(category.id)} alt="" className="absolute inset-0 size-full object-cover transition group-hover:scale-105" />
                        <span className="absolute inset-x-2 bottom-2 rounded-xl bg-cream px-3 py-2 font-display text-base leading-tight text-foreground">
                          {categoryCopy(locale, category.id)?.name || category.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
                <section>
                  <div className="mb-4">
                    <p className="text-xs font-bold tracking-[0.2em] text-accent uppercase">{t("directory.picksEyebrow")}</p>
                    <h2 className="mt-1 font-display text-2xl">{t("directory.picksTitle")}</h2>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {DOJO_PICKS.map((pick) => (
                      <CollectionCard
                        key={pick.id}
                        title={t(pick.titleKey)}
                        blurb={t(pick.blurbKey)}
                        tools={pick.slugs.map((id) => directory.byId.get(id)).filter((tool) => Boolean(tool)) as NonNullable<ReturnType<typeof directory.byId.get>>[]}
                        onSelect={() => directory.applyCollection(pick.id)}
                      />
                    ))}
                  </div>
                </section>
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}
