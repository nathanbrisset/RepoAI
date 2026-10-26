"use client"

import LocaleLink from "@/components/locale-link"
import { useLocale } from "@/components/locale-provider"
import type { ResolvedCollection, ResolvedRecipe } from "@/lib/directory/data"
import { directoryCopy } from "@/lib/i18n/directory-copy"
import { ToolCard } from "./tool-card"

export function CollectionDetail({ collection, recipes = [] }: { collection: ResolvedCollection; recipes?: ResolvedRecipe[] }) {
  const t = directoryCopy(useLocale())
  const shortsTeaser = collection.slug === "kit-shorts-youtube"

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <LocaleLink href="/collections" className="font-semibold text-primary">
        ← {t.collectionBack}
      </LocaleLink>
      <p className="mt-12 text-sm font-bold uppercase tracking-[0.2em] text-accent">{t.collectionsPageKicker}</p>
      <h1 className="mt-2 font-display text-5xl">{collection.title}</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{collection.blurb}</p>
      {recipes.length > 0 ? (
        <section className="mt-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">{t.recipesKicker}</p>
          <h2 className="mt-2 font-display text-3xl">{t.recipesTitle}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {recipes.map((recipe) => (
              <article key={recipe.id} className="rounded-3xl bg-card p-6 text-card-foreground ring-1 ring-border">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{t.recipeLabel}</p>
                <h3 className="mt-3 font-display text-2xl">{recipe.title}</h3>
                <p className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-primary-foreground">
                  {recipe.steps.map((step, index) => (
                    <span key={step.id} className="inline-flex items-center gap-2">
                      {index > 0 ? <span aria-hidden="true">→</span> : null}
                      <LocaleLink href={`/tool/${step.id}`} className="underline decoration-primary-foreground/40 underline-offset-4">
                        {step.label}
                      </LocaleLink>
                    </span>
                  ))}
                </p>
                <p className="mt-5 font-semibold">{t.howItWorks}</p>
                <ol className="mt-2 list-inside list-decimal space-y-1 text-muted-foreground">
                  {t.recipeSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </section>
      ) : null}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collection.tools.map((tool, index) => (
          <ToolCard key={tool.id} tool={tool} index={index} />
        ))}
      </div>
      {shortsTeaser ? (
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
