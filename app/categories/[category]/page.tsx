import ToolCard from "@/components/tool-card"
import { mockTools, categories } from "@/lib/data"
import Link from "next/link"

const categoryDescriptions: Record<string, { title: string; text: string }> = {
  audio: {
    title: "About Audio & Speech AI Tools",
    text: `Audio & Speech AI tools leverage artificial intelligence to process, generate, and transform audio content, including speech synthesis and voice cloning. These innovative solutions are transforming how professionals and individuals approach their work in this domain.\n\nWhen choosing a audio & speech AI tool, consider factors like ease of use, output quality, customization options, and pricing. Many tools offer free trials or freemium models, allowing you to test their capabilities before committing to a paid plan.\n\nBrowse our curated selection of the best audio & speech AI tools to find the perfect solution for your specific needs and budget.`
  },
  coding: {
    title: "About Coding AI Tools",
    text: `Coding AI tools leverage artificial intelligence to assist with programming tasks, generate code snippets, debug issues, and optimize existing code. These innovative solutions are transforming how professionals and individuals approach their work in this domain.\n\nWhen choosing a coding AI tool, consider factors like ease of use, output quality, customization options, and pricing. Many tools offer free trials or freemium models, allowing you to test their capabilities before committing to a paid plan.\n\nBrowse our curated selection of the best coding AI tools to find the perfect solution for your specific needs and budget.`
  },
  "data-processing": {
    title: "About Data Processing AI Tools",
    text: `Data Processing AI tools leverage artificial intelligence to clean, transform, and structure data for various applications and analyses. These innovative solutions are transforming how professionals and individuals approach their work in this domain.\n\nWhen choosing a data processing AI tool, consider factors like ease of use, output quality, customization options, and pricing. Many tools offer free trials or freemium models, allowing you to test their capabilities before committing to a paid plan.\n\nBrowse our curated selection of the best data processing AI tools to find the perfect solution for your specific needs and budget.`
  },
  design: {
    title: "About Design AI Tools",
    text: `Design AI tools leverage artificial intelligence to streamline the design process, generate creative assets, and enhance visual projects. These innovative solutions are transforming how professionals and individuals approach their work in this domain.\n\nWhen choosing a design AI tool, consider factors like ease of use, output quality, customization options, and pricing. Many tools offer free trials or freemium models, allowing you to test their capabilities before committing to a paid plan.\n\nBrowse our curated selection of the best design AI tools to find the perfect solution for your specific needs and budget.`
  },
  image: {
    title: "About Image Generation AI Tools",
    text: `Image Generation AI tools leverage artificial intelligence to create stunning visuals, artwork, and designs from textual descriptions or other inputs. These innovative solutions are transforming how professionals and individuals approach their work in this domain.\n\nWhen choosing a image generation AI tool, consider factors like ease of use, output quality, customization options, and pricing. Many tools offer free trials or freemium models, allowing you to test their capabilities before committing to a paid plan.\n\nBrowse our curated selection of the best image generation AI tools to find the perfect solution for your specific needs and budget.`
  },
  marketing: {
    title: "About Marketing AI Tools",
    text: `Marketing AI tools leverage artificial intelligence to automate, optimize, and personalize marketing campaigns across channels. These innovative solutions are transforming how professionals and businesses reach and engage their audiences.\n\nWhen choosing a marketing AI tool, consider factors like ease of use, integration options, output quality, and pricing. Many tools offer free trials or freemium models, allowing you to test their capabilities before committing to a paid plan.\n\nBrowse our curated selection of the best marketing AI tools to find the perfect solution for your specific needs and goals.`
  },
  productivity: {
    title: "About Productivity AI Tools",
    text: `Productivity AI tools leverage artificial intelligence to automate repetitive tasks, organize information, and boost efficiency in various workflows. These innovative solutions are transforming how professionals and individuals approach their work in this domain.\n\nWhen choosing a productivity AI tool, consider factors like ease of use, output quality, customization options, and pricing. Many tools offer free trials or freemium models, allowing you to test their capabilities before committing to a paid plan.\n\nBrowse our curated selection of the best productivity AI tools to find the perfect solution for your specific needs and budget.`
  },
  text: {
    title: "About Text Generation AI Tools",
    text: `Text Generation AI tools leverage artificial intelligence to create high-quality written content for various purposes, from marketing copy to creative writing. These innovative solutions are transforming how professionals and individuals approach their work in this domain.\n\nWhen choosing a text generation AI tool, consider factors like ease of use, output quality, customization options, and pricing. Many tools offer free trials or freemium models, allowing you to test their capabilities before committing to a paid plan.\n\nBrowse our curated selection of the best text generation AI tools to find the perfect solution for your specific needs and budget.`
  },
  video: {
    title: "About Video AI Tools",
    text: `Video AI tools leverage artificial intelligence to create, edit, and enhance video content with minimal manual intervention. These innovative solutions are transforming how professionals and individuals approach their work in this domain.\n\nWhen choosing a video AI tool, consider factors like ease of use, output quality, customization options, and pricing. Many tools offer free trials or freemium models, allowing you to test their capabilities before committing to a paid plan.\n\nBrowse our curated selection of the best video AI tools to find the perfect solution for your specific needs and budget.`
  }
};

interface PageProps {
  params: {
    category: string;
  };
}

export default async function Page({ params }: any) {
  const resolvedParams = typeof params.then === "function" ? await params : params;
  const { category } = resolvedParams;
  
  // Normalize category handling
  const normalizedCategory = category.toLowerCase() === 'data' 
    ? 'data-processing' 
    : category.toLowerCase() === 'text' 
      ? 'text'  // Keep 'text' as is to avoid case sensitivity issues
      : category.toLowerCase();

  // Only show tools in this category (match both 'data' and 'data-processing' for 'data')
  const categoryTools = mockTools.filter(tool =>
    category.toLowerCase() === 'data'
      ? tool.categories.some(cat => ['data', 'data-processing'].includes(cat.toLowerCase()))
      : tool.categories.some(cat => cat.toLowerCase() === normalizedCategory)
  );

  // Find the current category details
  const currentCategory = categories.find(cat => cat.id.toLowerCase() === normalizedCategory);
  const description = categoryDescriptions[normalizedCategory];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* All Categories Link */}
      <div className="mb-4">
          <Link href="/categories" className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium">
          <span className="mr-2">←</span> All Categories
          </Link>
      </div>

      {/* Banner Section */}
      <div className="flex items-center gap-4 mb-2">
        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-purple-50">
          {currentCategory?.icon}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
            {currentCategory?.name || category.charAt(0).toUpperCase() + category.slice(1)}
          </h1>
          <p className="text-gray-600 text-base">
            {currentCategory?.description || `Explore the best AI tools in the ${category} category.`}
          </p>
        </div>
          </div>

      {/* Info Box (description) */}
      {description && (
        <div className="bg-purple-50 border border-purple-100 rounded-xl px-6 py-5 mb-8">
          <h2 className="font-bold text-lg text-gray-900 mb-2">{description.title}</h2>
          {description.text.split("\n\n").map((para, idx) => (
            <p key={idx} className="text-gray-700 text-base mb-2 last:mb-0">{para}</p>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
          <span className="font-semibold text-gray-900">{categoryTools.length} tools found</span>
          <div className="text-gray-500 text-sm">Browse all {currentCategory?.name?.toLowerCase() || category.toLowerCase()} tools</div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categoryTools.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
} 