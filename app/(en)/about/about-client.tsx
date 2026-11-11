"use client"

import { ArrowRight } from "lucide-react"
import LocaleLink from "@/components/locale-link"
import { useLocale, useT } from "@/components/locale-provider"
import { directoryCopy } from "@/lib/i18n/directory-copy"

export default function AboutPage() {
  const t = useT()
  const locale = useLocale()
  const nav = directoryCopy(locale)

  const sections = [
    { title: t("about.whatTitle"), body: t("about.whatBody") },
    { title: t("about.verifyTitle"), body: t("about.verifyBody") },
    { title: t("about.shortsTitle"), body: t("about.shortsBody") },
    { title: t("about.notTitle"), body: t("about.notBody") },
  ]

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-10 md:px-8 md:py-16">
      <LocaleLink href="/" className="font-semibold text-primary">
        ← {nav.backHome}
      </LocaleLink>
      <p className="mt-12 text-sm font-bold uppercase tracking-[0.2em] text-accent">{nav.brand}</p>
      <h1 className="mt-2 font-display text-5xl md:text-6xl">{t("about.title")}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t("about.lead")}</p>

      <div className="mt-12 space-y-10">
        {sections.map((section) => (
          <section key={section.title} className="max-w-3xl">
            <h2 className="font-display text-2xl md:text-3xl">{section.title}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <LocaleLink
          href="/catalogue"
          className="inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
        >
          {t("about.ctaBrowse")} <ArrowRight className="ml-1 size-4" />
        </LocaleLink>
        <LocaleLink
          href="/collections"
          className="inline-flex items-center rounded-full bg-card px-5 py-3 text-sm font-bold ring-1 ring-border"
        >
          {t("about.ctaCollections")} <ArrowRight className="ml-1 size-4" />
        </LocaleLink>
      </div>
    </main>
  )
}
