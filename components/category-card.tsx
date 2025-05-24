import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { tools } from "@/lib/data"
import type { Category } from "@/lib/types"

interface CategoryCardProps {
  category: Category
}

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const categoryTools = tools.filter(tool =>
    tool.categories.includes(category.id)
  )

  return (
    <Link href={`/categories/${category.id}`}>
      <Card className="h-full transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
            {category.icon}
          </div>
          <CardTitle>{capitalizeWords(category.name)}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {category.description}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {categoryTools.length} tools available
            </span>
            <span className="text-purple-600 text-sm font-medium">
              View tools →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 