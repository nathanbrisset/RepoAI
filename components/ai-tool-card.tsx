"use client"

import { AITool } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Star, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface AIToolCardProps {
  tool: AITool
}

export function AIToolCard({ tool }: AIToolCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <Link href={tool.url} target="_blank" rel="noopener noreferrer">
      <Card className="h-full transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              {!imageError ? (
                <Image
                  src={tool.logo}
                  alt={`${tool.name} logo`}
                  fill
                  className="object-contain p-2"
                  onError={() => setImageError(true)}
                />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {tool.name}
                {tool.isPremium && (
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                    Pro
                  </span>
                )}
              </CardTitle>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {tool.description}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-3">
            {tool.categories.map((category) => (
              <span
                key={category}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {category}
              </span>
            ))}
          </div>
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium">{tool.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({tool.visits.toLocaleString()} visits)
              </span>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 