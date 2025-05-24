import { Star, Image as ImageIcon } from "lucide-react"
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
    <Card className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      <Link href={`/tool/${tool.id}`} className="block">
        <div className="relative bg-gray-100 flex items-center justify-center" style={{height: 160}}>
          {tool.image ? (
          <Image
            src={tool.image}
            alt={tool.name}
            fill
              className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          ) : (
            <ImageIcon className="w-12 h-12 text-gray-300" />
          )}
        </div>
        <CardContent className="p-5 pb-2">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-extrabold text-lg text-gray-900 truncate">{tool.name}</h3>
            <div className="flex items-center ml-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="text-sm font-semibold text-gray-700">{tool.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">{tool.description}</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {tool.categories.map((category) => (
              <Badge key={category} variant="secondary" className="text-xs capitalize">
                {category}
              </Badge>
            ))}
          </div>
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {tool.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs text-purple-700 border-purple-300">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {tool.isPremium && (
            <div className="mb-2">
              <Badge className={
                tool.isPremium === 'Premium'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'
                  : tool.isPremium === 'Freemium'
                  ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white'
                  : 'bg-gray-200 text-gray-800'
              }>
                {tool.isPremium}
                </Badge>
            </div>
          )}
        </CardContent>
      </Link>
      <CardFooter className="px-5 pb-4 pt-0 flex justify-between text-xs text-gray-500">
        <span>{new Date(tool.dateAdded).toLocaleDateString()}</span>
        <span>{tool.visits.toLocaleString()} visits</span>
      </CardFooter>
    </Card>
  )
}
