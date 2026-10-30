import { notFound } from "next/navigation";
import { allTools, mockTools } from "@/lib/data";
import { relatedToolsFor } from "@/lib/related-tools";
import ToolPageClient from "./tool-page-client";
import { getLocale } from "@/lib/i18n/get-locale";
import { toolForLocale } from "@/lib/i18n/localize-tool";
import { metadataFor } from "@/lib/i18n/metadata";

// Unknown ids are not rendered as empty shells. Next responds with the not-found page.
export const dynamicParams = false

// Generate static paths for all tools
export async function generateStaticParams() {
  return allTools.map((tool) => ({
    id: tool.id,
  }))
}

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string>>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  if (!allTools.some((tool) => tool.id === id)) notFound()
  return metadataFor(`/tool/${id}`)
}

export default async function ToolPage({ params }: PageProps) {
  const { id } = await params;
  const tool = allTools.find((tool) => tool.id === id);

  if (!tool) {
    notFound();
  }

  const relatedTools = relatedToolsFor(tool, mockTools);

  const successor = tool.successorId ? allTools.find((item) => item.id === tool.successorId) : null
  const locale = await getLocale()
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
  );
}
