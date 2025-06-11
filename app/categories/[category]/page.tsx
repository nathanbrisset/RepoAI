import { categories, mockTools } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Star, ExternalLink } from "lucide-react"
import ToolCard from "@/components/tool-card"
import BackButton from "./BackButton"
import { notFound } from "next/navigation"
import { useState } from "react"
import PricingToolsGrid from "./PricingToolsGrid"

// Generate static paths for all categories
export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.id,
  }))
}

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params;
  
  const categoryObj = categories.find((c) => c.id === category);
  
  if (!categoryObj) {
    notFound();
  }

  // Get tools in this category
  const tools = mockTools.filter(tool => tool.categories.includes(categoryObj.id));

  return (
    <div className="container py-8 space-y-8">
      <BackButton />
      <h1 className="text-4xl font-extrabold mb-4 text-purple-700 drop-shadow-sm">{categoryObj.name}</h1>
      <div className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-200 rounded-xl p-6 mb-8 shadow-md border border-gray-200">
        <p className="text-lg text-gray-800 leading-relaxed">
          <span className="font-semibold text-purple-700">{categoryObj.description}</span>
          {categoryObj.about && (
            <span> <span className="font-semibold text-gray-700">{categoryObj.about}</span></span>
          )}
        </p>
      </div>
      <PricingToolsGrid tools={tools} />
    </div>
  );
}