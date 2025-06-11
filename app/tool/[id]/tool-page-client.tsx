"use client";

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Star, ExternalLink, ThumbsUp } from "lucide-react"
import ToolCard from "@/components/tool-card"
import Head from "next/head"
import { Tool } from '@/types/tool'

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

interface ToolPageClientProps {
  tool: Tool;
  relatedTools: any[]; // Replace with your Tool[] type
}

export default function ToolPageClient({ tool, relatedTools }: ToolPageClientProps) {
  const [tab, setTab] = useState<'overview' | 'features' | 'reviews'>('overview');

  const canonicalUrl = `https://aitools.ninja/tool/${tool.id}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "description": tool.description,
    "applicationCategory": tool.categories.join(", "),
    "url": tool.url,
    "image": tool.image,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": tool.rating,
      "reviewCount": tool.visits
    },
    "offers": {
      "@type": "Offer",
      "price": tool.isPremium === 'Free' ? 0 : undefined,
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <Head>
        <title>{tool.name} | AITools.ninja</title>
        <meta name="description" content={tool.description} />
        <link rel="canonical" href={canonicalUrl} />
        {/* Open Graph */}
        <meta property="og:title" content={tool.name} />
        <meta property="og:description" content={tool.description} />
        <meta property="og:image" content={tool.image} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={tool.name} />
        <meta name="twitter:description" content={tool.description} />
        <meta name="twitter:image" content={tool.image} />
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <button onClick={() => window.history.back()} className="text-xs text-gray-500 hover:text-gray-700 mb-4 inline-block">← Back</button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <h1 className="text-3xl font-bold">{tool.name}</h1>
            <div className="flex gap-2">
              <Link href={tool.url} target="_blank" className="px-4 py-1 rounded bg-purple-500 text-white font-semibold hover:bg-purple-600 flex items-center gap-1 text-sm">
                Visit Website <ExternalLink className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {tool.categories.map((cat: string) => (
              <Badge key={cat} variant="secondary" className="capitalize text-xs">{cat}</Badge>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm mb-6">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-700">{tool.rating.toFixed(1)}</span>
            <span className="text-gray-400">({tool.visits.toLocaleString()} visits)</span>
            <span className="text-gray-400">Added {new Date(tool.dateAdded).toLocaleDateString()}</span>
            <span className="text-gray-400">Pricing: <span className="font-semibold text-gray-700">{tool.isPremium || 'Unknown'}</span></span>
          </div>
          <div className="w-full aspect-[4/3] bg-gray-100 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden" style={{ minHeight: 340 }}>
            <Image src={tool.image} alt={tool.name} fill className="object-contain" />
          </div>
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6 flex gap-2">
            <button onClick={() => setTab('overview')} className={`px-4 py-2 font-semibold ${tab === 'overview' ? 'border-b-2 border-purple-600 text-purple-700 bg-white' : 'text-gray-500'}`}>Overview</button>
            <button onClick={() => setTab('features')} className={`px-4 py-2 font-semibold ${tab === 'features' ? 'border-b-2 border-purple-600 text-purple-700 bg-white' : 'text-gray-500'}`}>Features</button>
            <button onClick={() => setTab('reviews')} className={`px-4 py-2 font-semibold ${tab === 'reviews' ? 'border-b-2 border-purple-600 text-purple-700 bg-white' : 'text-gray-500'}`}>Reviews</button>
          </div>
          {/* Tab Content */}
          {tab === 'overview' && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2">About {tool.name}</h2>
              <p className="text-gray-700 mb-2">{tool.description}</p>
              <p className="text-gray-700 mb-2">
                <b>Categories:</b> {tool.categories.map(capitalizeWords).join(", ")}
              </p>
              {tool.tags && tool.tags.length > 0 && (
                <p className="text-gray-700 mb-2">
                  <b>Key Capabilities:</b> {tool.tags.map(capitalizeWords).join(", ")}
                </p>
              )}
              <p className="text-gray-700">
                {tool.name} is designed to help users in the {tool.categories.map(capitalizeWords).join(", ")} space. Whether you're a professional or a beginner, this tool offers features like {tool.tags && tool.tags.length > 0 ? tool.tags.map(capitalizeWords).slice(0, 3).join(", ") : "advanced AI capabilities"} to streamline your workflow and boost productivity. Explore its unique features and see how it can fit your needs!
              </p>
            </div>
          )}
          {tab === 'features' && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Key Features</h2>
              {tool.features && tool.features.length > 0 ? (
                <ul className="space-y-4">
                  {tool.features.map((feature: string, idx: number) => {
                    const [title, ...descriptionParts] = feature.split(':');
                    const description = descriptionParts.join(':').trim();
                    return (
                      <li key={idx} className="flex items-start gap-3">
                        <ThumbsUp className="mt-1 text-purple-500" />
                        <div>
                          <div className="font-bold text-base text-gray-900">{title}</div>
                          <div className="text-gray-600 text-sm mt-1">{description}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-500">No features listed for this tool.</p>
              )}
            </div>
          )}
          {tab === 'reviews' && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2">Reviews</h2>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-center text-gray-500">
                No reviews yet. <br /> <span className="text-purple-600 font-medium cursor-pointer">Be the first to add a review!</span>
              </div>
            </div>
          )}
        </div>
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Info</h3>
            <div className="flex flex-col gap-3 text-sm mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Category:</span>
                <span className="font-medium">{tool.categories.map(capitalizeWords).join(", ")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Rating:</span>
                <span className="flex items-center gap-1 font-medium">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {tool.rating.toFixed(1)}/5
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Pricing:</span>
                <span className="font-medium">{tool.pricing?.type || tool.isPremium || 'Unknown'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Added:</span>
                <span>{new Date(tool.dateAdded).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Visits:</span>
                <span>{tool.visits.toLocaleString()}</span>
              </div>
              {tool.tags && tool.tags.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-gray-500">Key Features:</span>
                  <div className="flex flex-wrap gap-1">
                    {tool.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {capitalizeWords(tag)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link href={tool.url} target="_blank" className="block w-full bg-purple-600 text-white text-center py-2 rounded-lg font-semibold hover:bg-purple-700 transition">
              Visit Website <ExternalLink className="inline w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Related Tools</h3>
            <div className="flex flex-col gap-4">
              {relatedTools.length === 0 && <div className="text-gray-500 text-sm">No related tools found.</div>}
              {relatedTools.map((rel) => (
                <ToolCard key={rel.id} tool={rel} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
} 