import LocaleLink from "@/components/locale-link"
import { RECIPE_DEFS } from "@/lib/directory/collections"
import { directoryRecords } from "@/lib/directory/data"
import { getLocale } from "@/lib/i18n/get-locale"
import { directoryCopy } from "@/lib/i18n/directory-copy"
import { metadataFor } from "@/lib/i18n/metadata"

export function generateMetadata() {
  return metadataFor("/automations")
}

export default async function AutomationsPage() {
  const locale = await getLocale()
  const t = directoryCopy(locale)
  const known = new Set(directoryRecords(locale).map((tool) => tool.id))
  const recipes = RECIPE_DEFS.map((recipe) => ({
    ...recipe,
    steps: recipe.steps.filter((step) => known.has(step.id)),
  })).filter((recipe) => recipe.steps.length > 0)

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <LocaleLink href="/" className="font-semibold text-primary">
        ← {t.backHome}
      </LocaleLink>
      <p className="mt-12 text-sm font-bold uppercase tracking-[0.2em] text-accent">{t.automationsKicker}</p>
      <h1 className="mt-2 font-display text-5xl">{t.automationsTitle}</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {recipes.map((recipe) => (
          <article key={recipe.id} className="rounded-3xl bg-card p-6 ring-1 ring-border">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{t.recipeLabel}</p>
            <h2 className="mt-3 font-display text-2xl">{recipe.title[locale]}</h2>
            <p className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-primary-foreground">
              {recipe.steps.map((step, index) => (
                <span key={step.id} className="inline-flex items-center gap-2">
                  {index > 0 ? <span aria-hidden="true">→</span> : null}
                  <LocaleLink href={`/tool/${step.id}`} className="underline decoration-primary-foreground/40 underline-offset-4">
                    {step.label[locale]}
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
    </main>
  )
}
