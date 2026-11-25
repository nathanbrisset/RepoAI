"use client"

import { mockTools } from "@/lib/data"
import ToolCard from "@/components/tool-card"
import { useLocale } from "@/components/locale-provider"
import { translate } from "@/lib/i18n/messages"

type ListKind = "new" | "popular" | "top-rated"

export function CategoryListPage({ kind }: { kind: ListKind }) {
  const locale = useLocale()
  const titleKey = kind === "new" ? "lists.newTitle" : kind === "popular" ? "lists.popularTitle" : "lists.topTitle"
  const noteKey = kind === "popular" ? "lists.popularNote" : kind === "top-rated" ? "lists.topNote" : null

  let sortedTools = [...mockTools]
  if (kind === "new") {
    sortedTools.sort((a, b) => {
      const dateA = new Date(a.dateAdded || "1970-01-01")
      const dateB = new Date(b.dateAdded || "1970-01-01")
      return dateB.getTime() - dateA.getTime()
    })
  } else {
    sortedTools = sortedTools.filter((tool) => tool.status !== "sunset").sort((a, b) => a.name.localeCompare(b.name))
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-4">{translate(locale, titleKey)}</h1>
      {noteKey ? <p className="text-gray-600 mb-4 max-w-3xl">{translate(locale, noteKey)}</p> : null}
      <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  )
}
