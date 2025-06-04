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

export default async function Page({ params }: { params: { category: string } }) {
  const category = categories.find((c) => c.id === params.category);
  
  if (!category) {
    notFound();
  }

  // Get tools in this category
  const tools = mockTools.filter(tool => tool.categories.includes(category.id));

  return (
    <div className="container py-8 space-y-8">
      <BackButton />
      <h1 className="text-4xl font-bold">{category.name}</h1>
      <p className="text-muted-foreground">{category.description}</p>
      <PricingToolsGrid tools={tools} />
    </div>
  );
}