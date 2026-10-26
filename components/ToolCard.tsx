import { Tool } from '@/lib/types'
import { formatLabel } from '@/lib/format-label'
import Link from 'next/link'

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={tool.url} target="_blank" className="group">
      <div className="relative flex flex-col space-y-2 rounded-2xl border border-gray-200 bg-white p-4 hover:border-gray-300">
        <div className="flex items-center space-x-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl">
            <img
              src={tool.logo || tool.image}
              alt={tool.name}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{tool.name}</h3>
            {tool.subcategory && (
            <p className="text-sm text-gray-500">{tool.subcategory}</p>
            )}
          </div>
        </div>
        
        <p className="line-clamp-2 text-sm text-gray-600">{tool.description}</p>
        
        {tool.tags && tool.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
            >
              {formatLabel(tag)}
            </span>
          ))}
        </div>
        )}
        
        {tool.isPremium && (
        <div className="mt-auto flex items-center justify-end">
          <span className="text-sm text-gray-500">{tool.isPremium}</span>
        </div>
        )}
      </div>
    </Link>
  )
} 