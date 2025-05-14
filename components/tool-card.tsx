import { Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Tool } from "@/lib/types"

interface ToolCardProps {
  tool: Tool
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/tool/${tool.id}`}>
        <div className="aspect-video relative overflow-hidden bg-gray-100">
          <Image
            src={tool.image}
            alt={tool.name}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {tool.isPremium && (
            <Badge
              className={`absolute top-2 right-2 ${
                tool.isPremium === 'Premium'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                  : tool.isPremium === 'Freemium'
                  ? 'bg-gradient-to-r from-blue-500 to-green-400'
                  : 'bg-gradient-to-r from-gray-400 to-gray-200'
              }`}
            >
              {tool.isPremium}
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg line-clamp-1">{tool.name}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{tool.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{tool.description}</p>
          <div className="flex flex-wrap gap-1 mb-1">
            {tool.categories.slice(0, 3).map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category.toUpperCase()}
              </Badge>
            ))}
            {tool.categories.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tool.categories.length - 3}
              </Badge>
            )}
          </div>
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tool.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs text-purple-700 border-purple-300">
                  {tag}
                </Badge>
              ))}
              {tool.tags.length > 3 && (
                <Badge variant="outline" className="text-xs text-purple-700 border-purple-300">
                  +{tool.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 flex justify-between text-sm text-gray-500">
        <span>{new Date(tool.dateAdded).toLocaleDateString()}</span>
        <span>{tool.visits.toLocaleString()} visits</span>
      </CardFooter>
    </Card>
  )
}
