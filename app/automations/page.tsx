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
    <main className="mx-auto max-w-6xl px-4 pt-4 pb-10">
      <LocaleLink href="/" className="hidden text-sm font-semibold text-primary md:inline">
        ← {t.backHome}
      </LocaleLink>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent md:mt-3">{t.automationsKicker}</p>
      <h1 className="mt-1 max-w-4xl font-display text-xl leading-tight md:text-3xl">{t.automationsTitle}</h1>
      <p className="mt-1 line-clamp-1 max-w-2xl text-xs leading-4 text-muted-foreground md:line-clamp-none md:text-sm md:leading-5">{fill(t.automationsIntro, { count })}</p>
      <AutomationsGuide />
    </main>
  )
}
