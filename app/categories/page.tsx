import { ArrowRight } from "lucide-react"
import LocaleLink from "@/components/locale-link"
import { categoryCatalog } from "@/lib/category-meta"
import { directoryChips } from "@/lib/directory/data"
import { getLocale } from "@/lib/i18n/get-locale"
import { directoryCopy, fill } from "@/lib/i18n/directory-copy"
import { categoryCopy } from "@/lib/i18n/messages"
import { metadataFor } from "@/lib/i18n/metadata"

export function generateMetadata() {
  return metadataFor("/categories")
}

export default async function CategoriesPage() {
  const locale = await getLocale()
  const t = directoryCopy(locale)
  const counts = new Map(directoryChips(locale).map((chip) => [chip.id, chip.count]))

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-10 md:px-8">
      <LocaleLink href="/" className="font-semibold text-primary">
        ← {t.backHome}
      </LocaleLink>
      <p className="mt-12 text-sm font-bold uppercase tracking-[0.2em] text-accent">{t.categoriesPageKicker}</p>
      <h1 className="mt-2 font-display text-5xl">{t.categoriesPageTitle}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t.categoriesPageSubtitle}</p>
      <LocaleLink
        href="/catalogue"
        className="mt-6 inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
      >
        {t.categoriesOpenCatalogue} <ArrowRight className="ml-1 size-4" />
      </LocaleLink>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoryCatalog.map((category) => {
          const copy = categoryCopy(locale, category.id)
          const count = counts.get(category.id) ?? 0
          const countLabel = count === 1 ? t.categoryToolsOne : t.categoryToolsMany
          return (
            <LocaleLink
              key={category.id}
              href={`/categories/${category.id}`}
              className="group flex h-full flex-col justify-between rounded-3xl bg-card p-6 ring-1 ring-border transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <h2 className="font-display text-2xl leading-tight">{copy?.name || category.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy?.description || category.description}</p>
              </div>
              <div className="mt-6 flex items-center justify-between gap-3 text-sm font-semibold">
                <span className="text-muted-foreground">{fill(countLabel, { count })}</span>
                <span className="text-primary group-hover:underline">
                  {t.categoryViewTools} <ArrowRight className="inline size-4" />
                </span>
              </div>
            </LocaleLink>
          )
        })}
      </div>
    </main>
  )
}
