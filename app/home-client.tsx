"use client"

import HomeHero from "@/components/home-hero"
import ToolCard from "@/components/tool-card"
import type { Tool } from "@/lib/types"
import type { CatalogSearchRecord } from "@/lib/i18n/search-records"

export default function Home({ tools }: { tools: Tool[] }) {
  const records: CatalogSearchRecord[] = tools.map((tool) => ({
    id: tool.id,
    name: tool.name,
    description: tool.description,
    categories: tool.categories,
    tags: tool.tags,
    features: tool.features,
  }))

  return (
    <div>
      <HomeHero records={records} toolIds={tools.map((tool) => tool.id)} />
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  )
}
