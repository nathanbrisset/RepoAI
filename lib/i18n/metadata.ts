import type { Metadata } from "next"
import { categories } from "@/lib/data"
import { getToolById } from "@/lib/catalog"
import { SITE_URL, type Locale } from "./config"
import { getLocale } from "./get-locale"
import { absoluteUrl, languageAlternates, stripLocale } from "./paths"
import { COLLECTION_DEFS } from "@/lib/directory/collections"
import { categoryCopy, translate } from "./messages"
import { localizeTool } from "./localize-tool"

function pageCopy(locale: Locale, pathname: string): { title: string; description: string } {
  const path = stripLocale(pathname).replace(/\/$/, "") || "/"
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars)

  if (path === "/") return { title: t("meta.homeTitle"), description: t("meta.homeDescription") }
  if (path === "/about") return { title: t("meta.aboutTitle"), description: t("meta.aboutDescription") }
  if (path === "/contact") return { title: t("meta.contactTitle"), description: t("meta.contactDescription") }
  if (path === "/privacy") return { title: t("meta.privacyTitle"), description: t("meta.privacyDescription") }
  if (path === "/terms") return { title: t("meta.termsTitle"), description: t("meta.termsDescription") }
  if (path === "/legal") return { title: t("meta.legalTitle"), description: t("meta.legalDescription") }
  if (path === "/submit") return { title: t("meta.submitTitle"), description: t("meta.submitDescription") }
  if (path === "/recommendation") {
    return { title: t("meta.recommendationTitle"), description: t("meta.recommendationDescription") }
  }
  if (path === "/categories") return { title: t("meta.categoriesTitle"), description: t("meta.categoriesDescription") }
  if (path === "/tools") return { title: t("meta.toolsTitle"), description: t("meta.toolsDescription") }
  if (path === "/catalogue") return { title: t("meta.catalogueTitle"), description: t("meta.catalogueDescription") }
  if (path === "/collections") return { title: t("meta.collectionsTitle"), description: t("meta.collectionsDescription") }
  if (path === "/automations") return { title: t("meta.automationsTitle"), description: t("meta.automationsDescription") }
  if (path === "/compare") return { title: t("meta.compareTitle"), description: t("meta.compareDescription") }

  const collectionMatch = path.match(/^\/collections\/([^/]+)$/)
  if (collectionMatch) {
    const definition = COLLECTION_DEFS.find((collection) => collection.slug === decodeURIComponent(collectionMatch[1]))
    if (definition) {
      return {
        title: `${definition.title[locale]} | AITools.ninja`,
        description: definition.blurb[locale],
      }
    }
  }
  if (path === "/category/new") return { title: t("meta.newTitle"), description: t("meta.newDescription") }
  if (path === "/category/popular") return { title: t("meta.popularTitle"), description: t("meta.popularDescription") }
  if (path === "/category/top-rated") return { title: t("meta.topTitle"), description: t("meta.topDescription") }

  const categoryMatch = path.match(/^\/categories\/([^/]+)$/)
  if (categoryMatch) {
    const id = decodeURIComponent(categoryMatch[1])
    const known = categories.find((category) => category.id === id)
    if (known) {
      const copy = categoryCopy(locale, id)
      return {
        title: t("meta.categoryTitle", { name: copy?.name || known.name }),
        description: t("meta.categoryDescription", { description: copy?.description || known.description }),
      }
    }
  }

  const toolMatch = path.match(/^\/tool\/([^/]+)$/)
  if (toolMatch) {
    const tool = getToolById(decodeURIComponent(toolMatch[1]))
    if (tool) {
      const localized = localizeTool(tool, locale)
      return {
        title: t("meta.toolTitle", { name: tool.name }),
        description: localized.description,
      }
    }
  }

  return { title: t("meta.notFoundTitle"), description: t("meta.notFoundDescription") }
}

/** Per-page metadata: canonical plus hreflang en, fr and x-default. */
export async function metadataFor(pathname: string): Promise<Metadata> {
  const locale = await getLocale()
  return buildPageMetadata(locale, pathname)
}

export function buildPageMetadata(locale: Locale, pathname: string): Metadata {
  const { title, description } = pageCopy(locale, pathname)
  const canonical = absoluteUrl(locale, pathname)
  const languages = languageAlternates(pathname)

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "AITools.ninja",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      alternateLocale: locale === "fr" ? ["en_US"] : ["fr_FR"],
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: translate(locale, "meta.ogAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
      site: "@aitoolsninja",
    },
    icons: {
      icon: [{ url: "/icon.png", type: "image/png" }, { url: "/favicon.ico" }],
      apple: "/brand/aitools-ninja-mark.png",
    },
  }
}
