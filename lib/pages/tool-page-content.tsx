import { notFound } from "next/navigation"
import { allTools, mockTools } from "@/lib/data"
import { relatedToolsFor } from "@/lib/related-tools"
import ToolPageClient from "@/app/tool/[id]/tool-page-client"
import type { Locale } from "@/lib/i18n/config"
import { toolForLocale } from "@/lib/i18n/localize-tool"

type PageParams = Promise<{ id: string }>

export async function ToolPageContent({ locale, params }: { locale: Locale; params: PageParams }) {
  const { id } = await params
  const tool = allTools.find((item) => item.id === id)

  if (!tool) {
    notFound()
  }

  const relatedTools = relatedToolsFor(tool, mockTools)
  const successor = tool.successorId ? allTools.find((item) => item.id === tool.successorId) : null
  const localized = toolForLocale(tool, locale)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: localized.longDescription || localized.description,
    applicationCategory: tool.categories.join(", "),
    ...(tool.url ? { url: tool.url } : {}),
    image: tool.image,
    inLanguage: locale,
    ...(tool.pricing?.verified && tool.pricing.model === "free"
      ? { offers: { "@type": "Offer", price: 0, priceCurrency: "EUR" } }
      : {}),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolPageClient
        tool={localized}
        relatedTools={relatedTools.map((item) => toolForLocale(item, locale))}
        successorName={successor?.name}
      />
    </>
  )
}
