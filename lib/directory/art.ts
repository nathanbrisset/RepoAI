/** The eight riso illustrations from the v0 export, mapped onto the real taxonomy. */
const ART: Record<string, string> = {
  coding: "/art/coding.png",
  video: "/art/video.png",
  image: "/art/image.png",
  voice: "/art/music.png",
  music: "/art/music.png",
  writing: "/art/writing.png",
  "llm-chatbots": "/art/chat.png",
  "ai-agents": "/art/chat.png",
  search: "/art/research.png",
  sales: "/art/business.png",
  marketing: "/art/business.png",
  support: "/art/business.png",
  hr: "/art/business.png",
  finance: "/art/business.png",
  automation: "/art/coding.png",
  "no-code": "/art/coding.png",
  design: "/art/image.png",
  meetings: "/art/business.png",
  productivity: "/art/writing.png",
  data: "/art/research.png",
  education: "/art/writing.png",
  health: "/art/research.png",
  legal: "/art/writing.png",
  security: "/art/coding.png",
}

export function categoryArt(id: string | undefined) {
  if (!id) return "/art/coding.png"
  return ART[id] || "/art/coding.png"
}
