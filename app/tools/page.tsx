import { mockTools } from "@/lib/data"
import { getLocale } from "@/lib/i18n/get-locale"
import { toolForLocale } from "@/lib/i18n/localize-tool"
import { metadataFor } from "@/lib/i18n/metadata"
import ToolsClient from "./ToolsClient"

export function generateMetadata() {
  return metadataFor("/tools")
}

type PageProps = {
  searchParams: Promise<{ category?: string | string[]; pricing?: string | string[] }>
}

export default async function Page({ searchParams }: PageProps) {
  const [params, locale] = await Promise.all([searchParams, getLocale()])
  const requested = Array.isArray(params.category) ? params.category[0] : params.category
  const pricing = Array.isArray(params.pricing) ? params.pricing[0] : params.pricing
  const tools = mockTools.map((tool) => toolForLocale(tool, locale))
  return <ToolsClient tools={tools} initialCategory={requested ?? null} initialPricing={pricing ?? null} />
} 