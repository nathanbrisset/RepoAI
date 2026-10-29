"use client"

import { useState } from "react"
import LocaleLink from "@/components/locale-link"
import { useLocale } from "@/components/locale-provider"
import type { ResolvedCollection, ResolvedRecipe } from "@/lib/directory/data"
import { directoryCopy } from "@/lib/i18n/directory-copy"
import { ToolCard } from "./tool-card"

export function CollectionDetail({ collection, recipes = [] }: { collection: ResolvedCollection; recipes?: ResolvedRecipe[] }) {
  const t = directoryCopy(useLocale())
  const shortsTeaser = collection.slug === "kit-shorts-youtube"
  const editorial = recipes.length > 0

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <LocaleLink href="/collections" className="font-semibold text-primary">
        ← {t.collectionBack}
      </LocaleLink>
      <p className="mt-12 text-sm font-bold uppercase tracking-[0.2em] text-accent">{t.collectionsPageKicker}</p>
      <h1 className="mt-2 font-display text-5xl">{collection.title}</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{collection.blurb}</p>
      {editorial ? (
        <div className="mt-10 flex flex-col gap-4">
          {recipes.map((recipe) => (
            <article key={recipe.id} className="rounded-3xl bg-card p-6 text-card-foreground ring-1 ring-border md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{t.recipeLabel}</p>
              <h2 className="mt-3 font-display text-3xl">{recipe.title}</h2>
              <p className="mt-3 max-w-2xl text-lg">{recipe.intent}</p>
              <ol className="mt-6 flex flex-wrap items-center gap-3">
                {recipe.steps.map((step, index) => (
                  <li key={step.id} className="flex items-center gap-3">
                    {index > 0 ? <span aria-hidden="true" className="text-muted-foreground">→</span> : null}
                    <LocaleLink href={`/tool/${step.id}`} className="inline-flex items-center gap-2 rounded-full bg-background py-1 pr-3 pl-1 font-semibold ring-1 ring-border">
                      <StepMark name={step.label} logo={step.logo} />
                      {step.label}
                    </LocaleLink>
                  </li>
                ))}
              </ol>
              <LocaleLink href={`/tool/${recipe.steps[0].id}`} className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground">
                {t.recipeStart}
              </LocaleLink>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collection.tools.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} index={index} />
          ))}
        </div>
      )}
      {shortsTeaser && recipes.length === 0 ? (
        <section className="mt-16 rounded-3xl bg-foreground p-8 text-background">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">{t.recipesKicker}</p>
          <h2 className="mt-2 font-display text-3xl">{t.recipesTitle}</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <LocaleLink href="/collections/recettes-et-stacks" className="rounded-2xl bg-background/10 p-4 font-semibold">
              CapCut → ElevenLabs → Descript
            </LocaleLink>
            <LocaleLink href="/collections/recettes-et-stacks" className="rounded-2xl bg-background/10 p-4 font-semibold">
              Runway → HeyGen → Kling
            </LocaleLink>
          </div>
        </section>
      ) : null}
    </main>
  )
}

function StepMark({ name, logo }: { name: string; logo: string }) {
  const [failed, setFailed] = useState(false)
  if (!logo || failed) {
    return <span className="grid size-9 place-items-center rounded-full bg-foreground text-sm font-bold text-background">{name.charAt(0)}</span>
  }
  return <img src={logo} alt="" className="size-9 rounded-full bg-foreground object-contain p-1" onError={() => setFailed(true)} />
}
