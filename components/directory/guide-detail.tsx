"use client"

import { ArrowRight, Sparkles } from "lucide-react"
import LocaleLink from "@/components/locale-link"
import { useLocale } from "@/components/locale-provider"
import type { ResolvedEditorialGuide } from "@/lib/directory/editorial-guides"
import { directoryCopy } from "@/lib/i18n/directory-copy"

export function GuideDetail({ guide }: { guide: ResolvedEditorialGuide }) {
  const t = directoryCopy(useLocale())

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <LocaleLink href="/guides" className="font-semibold text-primary">
        ← {t.guidesBack}
      </LocaleLink>
      <p className="mt-12 text-sm font-bold uppercase tracking-[0.2em] text-accent">{t.guidesKicker}</p>
      <h1 className="mt-2 font-display text-4xl leading-tight md:text-5xl">{guide.title}</h1>
      <p className="mt-5 text-lg text-muted-foreground">{guide.description}</p>

      <section className="mt-10 rounded-3xl bg-card p-6 ring-1 ring-border md:p-8">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{t.guideProblemLabel}</h2>
        <p className="mt-3 text-base leading-relaxed">{guide.problem}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{t.guideStackLabel}</h2>
        <p className="mt-3 text-base leading-relaxed">{guide.stackIntro}</p>
        <ol className="mt-6 flex flex-col gap-4">
          {guide.stackSteps.map((step, index) => (
            <li key={step.id} className="rounded-2xl bg-foreground p-4 text-background md:p-5">
              <div className="flex items-start gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <LocaleLink href={`/tool/${step.id}`} className="inline-flex items-center gap-2 font-display text-xl hover:underline">
                    {step.logo ? (
                      <img src={step.logo} alt="" className="size-8 rounded-full bg-background object-contain p-1" />
                    ) : null}
                    {step.name}
                  </LocaleLink>
                  <p className="mt-2 text-sm leading-relaxed text-background/85">{step.role}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <LocaleLink
          href={guide.recommendationHref}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/20"
        >
          <Sparkles className="size-4" />
          {t.guideAiMatchCta}
        </LocaleLink>
        <LocaleLink
          href={guide.collectionHref}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
        >
          {t.guideCollectionCta} {guide.collectionTitle}
          <ArrowRight className="size-4" />
        </LocaleLink>
      </section>
    </main>
  )
}
