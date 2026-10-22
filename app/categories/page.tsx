import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { categories, mockTools } from "@/lib/data"

export default function CategoriesPage() {
  return (
    <div className="container max-w-6xl py-6 lg:py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-left">Browse Categories</h1>
          <p className="text-xl text-gray-600 mb-0 text-left">Explore AI tools by category to find the perfect solution for your needs</p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-8 flex-shrink-0 w-full md:w-auto flex justify-start md:justify-end">
          <Link href="/tools" className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium shadow hover:bg-purple-700 transition w-full md:w-auto text-center">
            See all Tools
          </Link>
        </div>
      </div>
      <hr className="my-8" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const categoryTools = mockTools.filter((tool) => tool.categories.includes(category.id))
          return (
            <Link key={category.id} href={`/categories/${category.id}`}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                    <span className="text-purple-600">{category.icon}</span>
                  </div>
                  <CardTitle>{category.name}</CardTitle>
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
        })}
      </div>
    </div>
  )
}
