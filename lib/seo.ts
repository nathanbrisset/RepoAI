import type { Metadata } from "next"

export const SITE_URL = "https://www.aitools.ninja"
export const SITE_NAME = "AI Tools Ninja"
export const OG_IMAGE_PATH = "/opengraph-image"
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630
export const OG_IMAGE_ALT = "AI Tools Ninja — directory of AI tools"

const HOME_TITLE = "AI Tools Ninja — Find the Right AI Tool"
const HOME_DESCRIPTION =
  "Browse a directory of AI tools for writing, coding, images, video, audio, and everyday work. Open a listing and go to the official site."

/** Absolute production URL. A relative path is rewritten to the Vercel preview host for file-based OG images. */
const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`

const ogImage = {
  url: OG_IMAGE_URL,
  width: OG_IMAGE_WIDTH,
  height: OG_IMAGE_HEIGHT,
  alt: OG_IMAGE_ALT,
}

const TITLE_TEMPLATE = "%s | AI Tools Ninja"

export function absoluteUrl(path: string): string {
  if (path === "/" || path === "") return SITE_URL
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${SITE_URL}${normalized.replace(/\/+$/, "")}`
}

export function metaDescription(text: string | undefined, fallback: string): string {
  const clean = (text ?? "").replace(/\s+/g, " ").trim()
  if (!clean) return fallback
  if (clean.length <= 160) return clean
  const cut = clean.slice(0, 157)
  const boundary = cut.lastIndexOf(" ")
  return `${(boundary > 80 ? cut.slice(0, boundary) : cut).trimEnd()}…`
}

type PageSeo = {
  title: string
  description: string
  path: string
  /** Bypass the title template. Use for the home page. */
  absoluteTitle?: boolean
  noIndex?: boolean
  /** 404 has no stable URL, so it should not publish a canonical. */
  canonical?: boolean
}

export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  noIndex = false,
  canonical = true,
}: PageSeo): Metadata {
  const url = absoluteUrl(path)
  const socialTitle = absoluteTitle ? title : TITLE_TEMPLATE.replace("%s", title)
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: canonical ? { canonical: url } : undefined,
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [OG_IMAGE_URL],
    },
  }
}

export const rootMetadata: Metadata = {
  metadataBase: new URL("https://www.aitools.ninja"),
  title: {
    default: HOME_TITLE,
    template: TITLE_TEMPLATE,
  },
  description: HOME_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [OG_IMAGE_URL],
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export const homeMetadata: Metadata = pageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
})
