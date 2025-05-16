"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { categories } from "@/lib/data"

export default function CategoryFilter() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.id}`}
            className="rounded-full px-4 py-1.5 text-sm font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center"
          >
            {category.icon}
            <span className="ml-2">{category.name}</span>
          </Link>
        ))}
      </div>

      {activeCategory && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">{categories.find((c) => c.id === activeCategory)?.name} Tools</h3>
            <Link
              href={`/category/${activeCategory}`}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            >
              View all →
            </Link>
          </div>
          <p className="text-gray-600 text-sm">{categories.find((c) => c.id === activeCategory)?.description}</p>
        </div>
      )}
    </div>
  )
}
