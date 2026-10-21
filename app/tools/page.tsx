import { mockTools } from "@/lib/data"
import ToolsClient from "./ToolsClient"

export default function Page() {
  return <ToolsClient tools={mockTools} />
} 