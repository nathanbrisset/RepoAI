import { HomeDirectory } from "@/components/directory/home-directory"
import { categoryCount, dailyPicks, directoryDoors, featuredStack, resolvedCollections } from "@/lib/directory/data"
import { getLocale } from "@/lib/i18n/get-locale"
import { metadataFor } from "@/lib/i18n/metadata"

export function generateMetadata() {
  return metadataFor("/")
}

export default async function Page() {
  const locale = await getLocale()
  return (
    <HomeDirectory
      picks={dailyPicks(locale)}
      collections={resolvedCollections(locale)}
      doors={directoryDoors(locale)}
      categoryTotal={categoryCount()}
      stack={featuredStack(locale)}
    />
  )
}
