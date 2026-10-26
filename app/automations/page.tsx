import LocaleLink from "@/components/locale-link"
import { AutomationsGuide } from "@/components/directory/automations-guide"
import { automationCards } from "@/lib/directory/automation-guides"
import { getLocale } from "@/lib/i18n/get-locale"
import { directoryCopy, fill } from "@/lib/i18n/directory-copy"
import { metadataFor } from "@/lib/i18n/metadata"

export function generateMetadata() {
  return metadataFor("/automations")
}

export default async function AutomationsPage() {
  const locale = await getLocale()
  const t = directoryCopy(locale)
  const count = automationCards(locale).length

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <LocaleLink href="/" className="font-semibold text-primary">
        ← {t.backHome}
      </LocaleLink>
      <p className="mt-12 text-sm font-bold uppercase tracking-[0.2em] text-accent">{t.automationsKicker}</p>
      <h1 className="mt-2 max-w-4xl font-display text-5xl leading-tight md:text-6xl">{t.automationsTitle}</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{fill(t.automationsIntro, { count })}</p>
      <LocaleLink href="/collections/recettes-et-stacks" className="mt-4 inline-flex font-semibold text-primary">
        {t.automationsRecipesLink} →
      </LocaleLink>
      <AutomationsGuide />
    </main>
  )
}
