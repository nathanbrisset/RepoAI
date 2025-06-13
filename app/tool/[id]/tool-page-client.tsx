"use client";

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Star, ExternalLink, ThumbsUp, LogIn, FilePlus, User, ImageIcon, Upload, Globe, Zap, Eye, Download, HelpCircle } from "lucide-react"
import ToolCard from "@/components/tool-card"
import Head from "next/head"
import { Tool } from '@/lib/types'

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

interface ToolPageClientProps {
  tool: Tool;
  relatedTools: any[]; // Replace with your Tool[] type
}

// Icon mapping for steps
const stepIcons = [
  <LogIn key="login" className="w-8 h-8" />, // 1
  <FilePlus key="project" className="w-8 h-8" />, // 2
  <User key="avatar" className="w-8 h-8" />, // 3
  <ImageIcon key="background" className="w-8 h-8" />, // 4
  <Upload key="script" className="w-8 h-8" />, // 5
  <Globe key="voice" className="w-8 h-8" />, // 6
  <Zap key="media" className="w-8 h-8" />, // 7
  <Eye key="preview" className="w-8 h-8" />, // 8
  <Download key="export" className="w-8 h-8" />, // 9
  <HelpCircle key="faq" className="w-8 h-8" /> // FAQ
];

// Gradient color mapping for steps
const gradients = [
  "from-pink-50 to-pink-100",
  "from-blue-50 to-blue-100",
  "from-green-50 to-green-100",
  "from-yellow-50 to-yellow-100",
  "from-purple-50 to-purple-100",
  "from-indigo-50 to-indigo-100",
  "from-cyan-50 to-cyan-100",
  "from-orange-50 to-orange-100",
  "from-violet-50 to-violet-100",
  "from-gray-50 to-gray-100"
];

export default function ToolPageClient({ tool, relatedTools }: ToolPageClientProps) {
  const [tab, setTab] = useState<'overview' | 'features' | 'reviews'>('overview');
  const [activeStep, setActiveStep] = useState(0);
  const [howToOpen, setHowToOpen] = useState(false);

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
            <div className="mb-8 space-y-4">
              <h2 className="text-xl font-bold mb-4">About {tool.name}</h2>
              <p className="text-gray-700 mb-4">{tool.description}</p>
              <p className="text-gray-700 mb-4">
                <b>Categories:</b> {tool.categories.map(capitalizeWords).join(", ")}
              </p>
              {tool.tags && tool.tags.length > 0 && (
                <p className="text-gray-700 mb-4">
                  <b>Key Capabilities:</b> {tool.tags.map(capitalizeWords).join(", ")}
                </p>
              )}
              <p className="text-gray-700 mb-4">
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
          {/* How To Use Section (aligned with main content, collapsible) */}
          {tool.howToUse && Array.isArray(tool.howToUse) && tool.howToUse.length > 0 && (
            <div className="pt-10 pb-12">
              <div className="text-left mb-8 flex flex-col gap-2">
                <h2 className="text-3xl font-extrabold text-gray-900">How To Use {tool.name}</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-400 rounded-full" />
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-gray-500 text-lg m-0">Follow these simple steps to create amazing AI-powered videos in minutes!</p>
                  <button
                    className={`ml-2 flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 focus:outline-none cursor-pointer hover:bg-purple-50 ${howToOpen ? 'rotate-180' : ''}`}
                    aria-label={howToOpen ? 'Collapse steps' : 'Expand steps'}
                    onClick={() => setHowToOpen(v => !v)}
                  >
                    <svg className="w-7 h-7 text-purple-500 transition-colors duration-200 group-hover:text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="text-xs text-gray-600 font-medium select-none hidden sm:inline">{howToOpen ? 'Click to collapse' : 'Click to expand'}</span>
                  </button>
                </div>
              </div>
              {howToOpen && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {tool.howToUse.map((step, idx) => {
                      const isActive = idx === activeStep;
                      const isFAQ = step.title.toLowerCase().includes('faq');
                      return (
                        <button
                          key={idx}
                          className={`relative group text-left rounded-2xl p-4 transition-all duration-200 border outline-none focus:ring-2 focus:ring-purple-400 bg-gradient-to-br ${gradients[idx % gradients.length]} ${isActive ? 'border-purple-200 scale-105 shadow-lg z-10' : 'border-transparent shadow-sm hover:scale-105 hover:shadow-md'} ${isFAQ ? 'ring-2 ring-blue-100' : ''}`}
                          style={{ minHeight: 160 }}
                          onClick={() => setActiveStep(idx)}
                          tabIndex={0}
                        >
                          {/* Blended step number */}
                          <span className="absolute top-3 right-4 text-4xl font-extrabold text-gray-300/40 select-none pointer-events-none z-0">
                            {(idx + 1).toString().padStart(2, '0')}
                          </span>
                          {/* Icon */}
                          <span className="relative z-10 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 mb-3 shadow-sm border border-white/50">
                            {stepIcons[idx % stepIcons.length]}
                          </span>
                          {/* Title */}
                          <div className="relative z-10 font-bold text-base mb-1 text-gray-900">{step.title}</div>
                          {/* Description */}
                          <div className="relative z-10 text-gray-600 text-sm mb-1">
                            {step.description}
                          </div>
                          {/* FAQ button if present */}
                          {isFAQ && step.links && step.links.length > 0 && (
                            <a href={step.links[0].url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 mt-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-lg font-semibold shadow-sm hover:from-blue-500 hover:to-purple-500 transition ring-1 ring-blue-100 animate-glow text-sm">
                              Visit FAQ <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {/* Navigation and Progress Dots */}
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <button
                      onClick={() => setActiveStep(prev => (prev > 0 ? prev - 1 : tool.howToUse.length - 1))}
                      className="p-2 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                      aria-label="Previous step"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="flex gap-2">
                      {tool.howToUse.map((_, idx) => (
                        <button
                          key={idx}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${activeStep === idx ? 'bg-purple-400 scale-125 shadow-sm' : 'bg-gray-200 hover:bg-purple-200'}`}
                          onClick={() => setActiveStep(idx)}
                          aria-label={`Go to step ${idx + 1}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setActiveStep(prev => (prev < tool.howToUse.length - 1 ? prev + 1 : 0))}
                      className="p-2 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                      aria-label="Next step"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  {/* Fade-in animation keyframes */}
                  <style jsx>{`
                    .animate-glow { animation: glow 2s infinite alternate; }
                    @keyframes glow {
                      0% { box-shadow: 0 0 8px 2px #a5b4fc; }
                      50% { box-shadow: 0 0 24px 6px #818cf8; }
                      100% { box-shadow: 0 0 8px 2px #a5b4fc; }
                    }
                  `}</style>
                </>
              )}
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