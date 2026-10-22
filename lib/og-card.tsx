import { ImageResponse } from "next/og"
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "@/lib/seo"

export const ogSize = { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT }
export const ogContentType = "image/png"

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #5b21b6 0%, #7c3aed 45%, #db2777 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 2, textTransform: "uppercase" }}>
          www.aitools.ninja
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05 }}>AI Tools Ninja</div>
          <div style={{ marginTop: 24, fontSize: 36, lineHeight: 1.3 }}>
            A directory of AI tools for writing, code, image, video, and more.
          </div>
        </div>
      </div>
    ),
    { ...ogSize }
  )
}
