import { notFound } from "next/navigation";
import { mockTools } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star, ThumbsUp, Users } from "lucide-react";
import Link from "next/link";
import { Tool } from "@/lib/types";

type Props = {
  params: { id: string }
  searchParams: {}
}

export default function ToolPage({ params }: any) {
  const { id } = params;
  const tool = mockTools.find((tool) => tool.id === id);

  if (!tool) {
    notFound();
  }

  // Find 3 recommended tools from the same category, excluding the current tool
  const recommendations = mockTools.filter(
    (t) => t.id !== tool.id && t.categories.some((cat) => tool.categories.includes(cat))
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/tools" className="text-blue-600 hover:text-blue-700">
            ← Back to Tools
          </Link>
        </div>

        {/* Tool Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Tool Image */}
            <div className="md:w-1/3 flex justify-center">
              <img
                src={tool.image || "/placeholder.svg"}
                alt={tool.name}
                className="w-full max-w-[300px] h-auto rounded-lg object-contain"
              />
            </div>

            {/* Tool Info */}
            <div className="md:w-2/3">
              <h1 className="text-4xl font-bold mb-4 text-gray-900">{tool.name}</h1>
              <p className="text-lg text-gray-600 mb-6">{tool.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="font-medium">Rating</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{tool.rating?.toFixed(1)}/5</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Visits</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{tool.visits?.toLocaleString()}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <ThumbsUp className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Likes</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{(tool as any).likes?.toLocaleString()}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <span className="font-medium">Category</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{tool.categories?.[0]}</div>
                </div>
              </div>

              {/* CTA Button */}
              <Button asChild className="w-full md:w-auto">
                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  Visit Website
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Tool Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Features */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Key Features</h2>
              <ul className="space-y-4">
                {tool.features?.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Description - more airy */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">About {tool.name}</h2>
              <div className="prose prose-lg max-w-none text-gray-700" style={{lineHeight: 1.8, paddingBottom: 16}}>
                <p style={{marginBottom: 24}}>{tool.description}</p>
                {(tool as any).longDescription && <p className="mt-4">{(tool as any).longDescription}</p>}
              </div>
            </div>

            {/* How To Use Section */}
            {tool.howToUse && tool.howToUse.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-8 border border-blue-100">
                <h2 className="text-2xl font-bold mb-6 text-blue-700">How To Use {tool.name}</h2>
                <ol className="list-decimal list-inside space-y-3 text-gray-800 text-lg">
                  {tool.howToUse.map((step, idx) => (
                    <li key={idx}>
                      <div className="font-medium">{step.title}</div>
                      <div className="text-gray-600">{step.description}</div>
                      {step.links && step.links.length > 0 && (
                        <div className="mt-2">
                          {step.links.map((link, linkIdx) => (
                            <a
                              key={linkIdx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-800 mr-4"
                            >
                              {link.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Sidebar - Recommendations and other info */}
          <div className="space-y-8">
            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
              <h3 className="font-semibold text-purple-800 mb-4">Recommended Tools</h3>
              <div className="flex flex-col gap-4">
                {recommendations.map((rec) => (
                  <Link key={rec.id} href={`/tool/${rec.id}`} className="flex items-center gap-3 hover:bg-purple-50 p-2 rounded-lg transition">
                    <img src={rec.logo || rec.image} alt={rec.name} className="w-10 h-10 rounded object-cover border" />
                    <div>
                      <div className="font-bold text-gray-900">{rec.name}</div>
                      <div className="text-xs text-gray-500 line-clamp-2">{rec.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {tool.categories?.map((category) => (
                  <Link
                    key={category}
                    href={`/categories/${category.toLowerCase()}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tool.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Pricing */}
            {tool.pricing && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Pricing</h3>
                <div className="space-y-3">
                  {tool.pricing.type === "paid" && tool.pricing.details && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Paid Plan</span>
                      <span className="font-semibold text-gray-900">{tool.pricing.details}</span>
                    </div>
                  )}
                  {tool.pricing.type === "freemium" && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Free Plan</span>
                        <span className="font-semibold text-gray-900">Free</span>
                      </div>
                      {tool.pricing.details && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Pro Plan</span>
                          <span className="font-semibold text-gray-900">{tool.pricing.details}</span>
                        </div>
                      )}
                    </>
                  )}
                  {tool.pricing.type === "free" && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Free Plan</span>
                      <span className="font-semibold text-gray-900">Free</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 