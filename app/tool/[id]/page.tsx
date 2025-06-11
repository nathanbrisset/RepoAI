import { mockTools } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Star, ExternalLink } from "lucide-react"
import { notFound } from "next/navigation"

// Generate static paths for all tools
export async function generateStaticParams() {
  return mockTools.map((tool) => ({
    id: tool.id,
  }))
}

interface PageProps {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ToolPage(props: PageProps) {
  const { id } = props.params;
  
  const tool = mockTools.find((t) => t.id === id);
  
  if (!tool) {
    notFound();
  }

  return (
    <div className="container py-8 space-y-8">
      <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-700">
        ← Back to Home
      </Link>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={tool.image}
                  alt={tool.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    {tool.categories[0]}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-1 text-gray-600">{tool.rating}</span>
              </div>
              <Link
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Website
              </Link>
            </div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed">{tool.description}</p>
          </div>
          
          {tool.features && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Key Features</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {tool.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          
          {tool.pricing && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Pricing</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">{tool.pricing.type}</p>
                {tool.pricing.details && (
                  <p className="text-gray-600 mt-2">{tool.pricing.details}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
