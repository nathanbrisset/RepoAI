import { ArrowRight } from "lucide-react"
import LocaleLink from "@/components/locale-link"
import { EDITORIAL_GUIDE_DEFS } from "@/lib/directory/editorial-guides"
import { getLocale } from "@/lib/i18n/get-locale"
import { directoryCopy } from "@/lib/i18n/directory-copy"
import { metadataFor } from "@/lib/i18n/metadata"

export function generateMetadata() {
  return metadataFor("/guides")
}

export default async function GuidesPage() {
  const locale = await getLocale()
  const t = directoryCopy(locale)

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <LocaleLink href="/" className="font-semibold text-primary">
        ← {t.backHome}
      </LocaleLink>
      <p className="mt-12 text-sm font-bold uppercase tracking-[0.2em] text-accent">{t.guidesKicker}</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">{t.guidesPageTitle}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t.guidesPageIntro}</p>
      <ul className="mt-10 flex flex-col gap-4">
        {EDITORIAL_GUIDE_DEFS.map((guide) => (
          <li key={guide.slug}>
            <LocaleLink
              href={`/guides/${guide.slug}`}
              className="flex items-center justify-between gap-4 rounded-3xl bg-card p-6 ring-1 ring-border transition hover:ring-primary/40"
            >
              <div className="min-w-0">
                <h2 className="font-display text-2xl">{guide.title[locale]}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{guide.description[locale]}</p>
              </div>
              <ArrowRight className="size-5 shrink-0 text-primary" />
            </LocaleLink>
          </li>
        ))}
      </ul>
    </main>
  )
}
