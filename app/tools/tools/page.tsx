import Link from "next/link"
import { categories, mockTools } from "@/lib/data"

export default function ToolsPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">AI Tools Directory</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Explore the catalog by the 24 categories. Each card links to the tools filed under that category.
        </p>
      </div>
      {categories.map((category) => {
        const tools = mockTools.filter((tool) => tool.categories.includes(category.id))
        return (
          <section key={category.id} className="mb-12">
            <h2 className="text-2xl font-bold mb-2">
              <Link href={`/categories/${category.id}`} className="hover:text-purple-700">{category.name}</Link>
            </h2>
            <p className="text-gray-600 mb-4">{category.description}</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {tools.map((tool) => (
                <li key={tool.id}>
                  <Link href={`/tool/${tool.id}`} className="text-gray-900 hover:text-purple-700">
                    {tool.name}
                  </Link>
                  <span className="text-gray-500"> — {tool.description}</span>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
