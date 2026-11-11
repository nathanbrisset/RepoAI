"use client"

import { CollectionCard } from "@/components/directory/collection-card"
import { resolvedCollections } from "@/lib/directory/data"
import { useLocale } from "@/components/locale-provider"
import { directoryCopy } from "@/lib/i18n/directory-copy"
import LocaleLink from "@/components/locale-link"

export function CollectionsListPage() {
  const locale = useLocale()
  const t = directoryCopy(locale)
  const collections = resolvedCollections(locale)

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <LocaleLink href="/" className="font-semibold text-primary">
        ← {t.backHome}
      </LocaleLink>
      <p className="mt-12 text-sm font-bold uppercase tracking-[0.2em] text-accent">{t.collectionsPageKicker}</p>
      <h1 className="mt-2 font-display text-5xl">{t.collectionsPageTitle}</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {collections.map((collection, index) => (
          <CollectionCard
            key={collection.slug}
            slug={collection.slug}
            title={collection.title}
            blurb={collection.blurb}
            tools={collection.tools}
            index={index}
          />
        ))}
      </div>
    </main>
  )
}
