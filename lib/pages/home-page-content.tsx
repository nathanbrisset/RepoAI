import { HomeDirectory } from "@/components/directory/home-directory"
import { categoryCount, dailyPicks, featuredStack, homeFeaturedCollections } from "@/lib/directory/data"
import { homeCountrySectionTools } from "@/lib/home-country-section"
import type { Locale } from "@/lib/i18n/config"

export function HomePageContent({ locale }: { locale: Locale }) {
  const countryTools = homeCountrySectionTools(locale)
  return (
    <HomeDirectory
      picks={dailyPicks(locale)}
      collections={homeFeaturedCollections(locale)}
      categoryTotal={categoryCount()}
      stack={featuredStack(locale)}
      countryTools={countryTools}
    />
  )
}
