import { mockTools } from "@/lib/data"
import { getLocale } from "@/lib/i18n/get-locale"
import { toolForLocale } from "@/lib/i18n/localize-tool"
import { metadataFor } from "@/lib/i18n/metadata"
import HomePage from "./home-client"

export function generateMetadata() {
  return metadataFor("/")
}

export default async function Page() {
  const locale = await getLocale()
  const tools = mockTools.map((tool) => toolForLocale(tool, locale))
  return <HomePage tools={tools} />
}
