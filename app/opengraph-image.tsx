import { ogContentType, ogSize, renderOgImage } from "@/lib/og-card"

export const alt = "AI Tools Ninja — directory of AI tools"
export const size = ogSize
export const contentType = ogContentType

export default function OpenGraphImage() {
  return renderOgImage()
}
