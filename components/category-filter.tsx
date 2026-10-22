"use client"

import { categoryIcon } from "@/lib/category-icons"
import { categoryCatalog } from "@/lib/category-meta"
import { categoryCopy } from "@/lib/i18n/messages"
import LocaleLink from "./locale-link"
import { useLocale } from "./locale-provider"

export default function CategoryFilter() {
  const locale = useLocale()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categoryCatalog.map((category) => {
          const copy = categoryCopy(locale, category.id)
          return (
            <LocaleLink
              key={category.id}
              href={`/categories/${category.id}`}
              className="rounded-full px-4 py-1.5 text-sm font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center"
            >
              {categoryIcon(category.id)}
              <span className="ml-2">{copy?.name || category.name}</span>
            </LocaleLink>
          )
        })}
      </div>
    </div>
  )
}
