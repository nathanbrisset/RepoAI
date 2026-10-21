"use client"

import { Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Tool } from "@/lib/types"
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
    <Card className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      <LocaleLink href={`/tool/${localized.id}`} className="block">
        <div className="relative bg-gray-100 flex items-center justify-center" style={{ height: 160 }}>
          {visual ? (
            <Image
              src={visual}
              alt={localized.name}
              fill
              className={localized.image ? "object-cover" : "object-contain p-8"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={visual.endsWith(".svg")}
            />
          ) : (
            <ImageIcon className="w-12 h-12 text-gray-300" />
          )}
        </div>
        <CardContent className="p-5 pb-2">
          <div className="flex justify-between items-center mb-1 gap-2">
            <h3 className="font-extrabold text-lg text-gray-900 truncate">{localized.name}</h3>
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
                {categoryCopy(locale, category)?.name || category}
              </Badge>
            ))}
          </div>
          {localized.tags && localized.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {localized.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs text-purple-700 border-purple-300">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {tool.isPremium && (
            <div className="mb-2">
              <Badge
                className={
                  tool.isPremium === "Premium"
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
        {tool.pricing?.verified === false && <span>{t("tool.priceNotRechecked")}</span>}
      </CardFooter>
    </Card>
  )
}
