"use client"

import { Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Tool } from "@/lib/types"
import { categoryName } from "@/lib/category-meta"
import { categoryCopy, pricingLabel, statusLabel } from "@/lib/i18n/messages"
import { formatCatalogDate, localizeTool } from "@/lib/i18n/localize-tool"
import LocaleLink from "./locale-link"
import { useLocale, useT } from "./locale-provider"

interface ToolCardProps {
  tool: Tool
}

export default function ToolCard({ tool }: ToolCardProps) {
  const locale = useLocale()
  const t = useT()
  const localized = localizeTool(tool, locale)
  const visual = localized.image || localized.logo
  const status = localized.status && localized.status !== "active" ? statusLabel(locale, localized.status) : ""

  return (
    <Card className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all relative">
      <LocaleLink href={`/tool/${localized.id}`} className="block after:absolute after:inset-0 after:rounded-xl after:content-['']" aria-label={localized.name}>
        <div className="relative bg-gray-100 flex items-center justify-center" style={{ height: 160 }}>
          {visual ? (
            <img
              src={visual}
              alt={localized.name}
              className={cn(
                "absolute inset-0 h-full w-full",
                localized.image ? "object-cover" : "object-contain p-8",
              )}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <ImageIcon className="w-12 h-12 text-gray-300" />
          )}
        </div>
        <CardContent className="p-5 pb-2">
          <div className="flex justify-between items-center mb-1 gap-2">
            <h3 className="font-extrabold text-lg text-gray-900 truncate relative z-[1]">{localized.name}</h3>
            {status ? (
              <Badge variant="outline" className="text-xs shrink-0">
                {status}
              </Badge>
            ) : null}
          </div>
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">{localized.description}</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {localized.categories.map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {categoryCopy(locale, category)?.name || categoryName(category)}
              </Badge>
            ))}
          </div>
          {localized.tags && localized.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {localized.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs text-primary border-border">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {tool.isPremium && !tool.pricing?.uncertain && (
            <div className="mb-2">
              <Badge
                className={
                  tool.isPremium === "Premium" || tool.isPremium === "Enterprise" || tool.isPremium === "Usage-based" || tool.isPremium === "One-time"
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
                    : tool.isPremium === "Freemium"
                      ? "bg-gradient-to-r from-blue-500 to-green-400 text-white"
                      : "bg-gray-200 text-gray-800"
                }
              >
                {pricingLabel(locale, tool.isPremium)}
              </Badge>
            </div>
          )}
        </CardContent>
      </LocaleLink>
      <CardFooter className="px-5 pb-4 pt-0 flex justify-between text-xs text-gray-500">
        <span>{tool.dateAdded ? formatCatalogDate(tool.dateAdded, locale) : t("tool.dateNotRecorded")}</span>
        {tool.pricing?.verified === false && !tool.pricing?.uncertain && <span>{t("tool.priceNotRechecked")}</span>}
      </CardFooter>
    </Card>
  )
}
