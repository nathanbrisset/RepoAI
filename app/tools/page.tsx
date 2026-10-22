import { mockTools } from "@/lib/data"
import { metadataFor } from "@/lib/i18n/metadata"
import ToolsClient from "./ToolsClient"

export function generateMetadata() {
  return metadataFor("/tools")
}

type PageProps = {
  searchParams: Promise<{ category?: string | string[] }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const requested = Array.isArray(params.category) ? params.category[0] : params.category
  return <ToolsClient tools={mockTools} initialCategory={requested ?? null} />
} 