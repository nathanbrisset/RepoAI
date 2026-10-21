import { mockTools } from "@/lib/data"
import { metadataFor } from "@/lib/i18n/metadata"
import ToolsClient from "./ToolsClient"

export function generateMetadata() {
  return metadataFor("/tools")
}

export default function Page() {
  return <ToolsClient tools={mockTools} />
} 