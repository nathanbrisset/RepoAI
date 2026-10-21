import { mockTools } from "@/lib/data"
import { metadataFor } from "@/lib/i18n/metadata"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

export async function generateMetadata(props: { params?: Promise<{ id: string }> | { id: string } }) {
  const params = props?.params
  const resolved = params && typeof (params as Promise<{ id: string }>).then === "function" ? await params : params
  const id = resolved && "id" in resolved ? resolved.id : ""
  return metadataFor(`/tools/${id}`)
}

export default async function Page(props: any) {
  let id;
  if (props?.params) {
    if (typeof props.params.then === "function") {
      // It's a Promise
      const resolved = await props.params;
      id = resolved.id;
    } else {
      // It's a plain object
      id = props.params.id;
    }
  }

  const tool = mockTools.find(t => t.id === id);

  if (!tool) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Tool Image */}
            <div className="w-full md:w-1/3">
              <div className="relative bg-gray-100 rounded-xl overflow-hidden" style={{height: 240}}>
                {tool.image ? (
                  <Image
                    src={tool.image}
                    alt={tool.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tool Info */}
            <div className="w-full md:w-2/3">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-4xl font-bold text-gray-900">{tool.name}</h1>
              </div>

              <p className="text-xl text-gray-600 mb-6">{tool.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {tool.categories.map((category) => (
                  <Badge key={category} variant="secondary" className="text-sm capitalize">
                    {category}
                  </Badge>
                ))}
              </div>

              {tool.isPremium && (
                <div className="mb-6">
                  <Badge className={
                    tool.isPremium === 'Premium'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'
                      : tool.isPremium === 'Freemium'
                      ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }>
                    {tool.isPremium}
                  </Badge>
                </div>
              )}

              <div className="flex gap-4">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Visit Website
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
                <Link href="/tools">
                  <Button variant="outline">Back to Tools</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {tool.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 