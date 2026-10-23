import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LocaleLink from "@/components/locale-link"
import { categories, mockTools } from "@/lib/data"
import { getLocale } from "@/lib/i18n/get-locale"
import { categoryCopy, translate } from "@/lib/i18n/messages"
import { metadataFor } from "@/lib/i18n/metadata"

export function generateMetadata() {
  return metadataFor("/categories")
}

export default async function CategoriesPage() {
  const locale = await getLocale()
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars)

  return (
    <div className="container max-w-6xl py-6 lg:py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-left">{t("categories.title")}</h1>
          <p className="text-xl text-gray-600 mb-0 text-left">{t("categories.subtitle")}</p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-8 flex-shrink-0 w-full md:w-auto flex justify-start md:justify-end">
          <LocaleLink
            href="/tools"
            className="w-full rounded-full bg-navy px-4 py-2 text-center font-medium text-navy-foreground shadow-soft transition hover:brightness-110 md:w-auto"
          >
            {t("categories.seeAll")}
          </LocaleLink>
        </div>
      </div>
      <hr className="my-8" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const copy = categoryCopy(locale, category.id)
          const count = mockTools.filter((tool) => tool.categories.includes(category.id)).length
          return (
            <LocaleLink key={category.id} href={`/categories/${category.id}`}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                    {category.icon}
                  </div>
                  <CardTitle>{copy?.name || category.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{copy?.description || category.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {count === 1 ? t("categories.toolsOne", { count }) : t("categories.toolsMany", { count })}
                    </span>
                    <span className="text-purple-600 text-sm font-medium">{t("categories.view")}</span>
                  </div>
                </CardContent>
              </Card>
            </LocaleLink>
          )
        })}
      </div>
    </div>
  )
}
