"use client"

import LocaleLink from "@/components/locale-link"
import { useLocale } from "@/components/locale-provider"
import type { ResolvedCollection } from "@/lib/directory/data"
import { directoryCopy } from "@/lib/i18n/directory-copy"
import { ToolCard } from "./tool-card"

export function CollectionDetail({ collection }: { collection: ResolvedCollection }) {
  const t = directoryCopy(useLocale())
  const recipes = collection.slug === "kit-shorts-youtube"

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <LocaleLink href="/collections" className="font-semibold text-primary">
        ← {t.collectionBack}
      </LocaleLink>
      <p className="mt-12 text-sm font-bold uppercase tracking-[0.2em] text-accent">{t.collectionsPageKicker}</p>
      <h1 className="mt-2 font-display text-5xl">{collection.title}</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{collection.blurb}</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collection.tools.map((tool, index) => (
          <ToolCard key={tool.id} tool={tool} index={index} />
        ))}
      </div>
      {recipes ? (
        <section className="mt-16 rounded-3xl bg-foreground p-8 text-background">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">{t.recipesKicker}</p>
          <h2 className="mt-2 font-display text-3xl">{t.recipesTitle}</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <LocaleLink href="/automations" className="rounded-2xl bg-background/10 p-4 font-semibold">
              CapCut → ElevenLabs → Descript
            </LocaleLink>
            <LocaleLink href="/automations" className="rounded-2xl bg-background/10 p-4 font-semibold">
              Runway → HeyGen → Kling
            </LocaleLink>
          </div>
        </section>
      ) : null}
    </main>
  )
}
