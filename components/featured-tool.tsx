import { ExternalLink, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AITool } from "@/lib/types"

interface FeaturedToolProps {
  tool: AITool
}

export default function FeaturedTool({ tool }: FeaturedToolProps) {
  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-video relative overflow-hidden bg-gray-100">
          <img
            src={tool.logo || tool.image || "/placeholder.svg"}
            alt={tool.name}
            className="object-cover w-full h-full"
          />
          {tool.isPremium && (
            <Badge className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-yellow-500">Premium</Badge>
          )}
        </div>
        <CardContent className="p-6 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{tool.rating.toFixed(1)}</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">{tool.name}</h3>
          <p className="text-gray-600 mb-4">{tool.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {tool.categories.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tool.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-purple-700 border-purple-300">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <Button asChild className="w-full md:w-auto">
            <a href={tool.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              Visit Website
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </div>
    </Card>
  )
}
