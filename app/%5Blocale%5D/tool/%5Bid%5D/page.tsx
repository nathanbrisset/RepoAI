import { mockTools } from "@/lib/data"
 
export default function ToolPage({ params }: { params: { id: string } }) {
  const tool = mockTools.find((t) => t.id === params.id)
  // ...rest of the component rendering logic...
} 