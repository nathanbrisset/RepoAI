import { ArrowLeft, ExternalLink, Share2, Star, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ToolCard from "@/components/tool-card"
import { mockTools } from "@/lib/data"

interface ToolPageProps {
  params: {
    id: string
  }
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = mockTools.find((t) => t.id === params.id)

  if (!tool) {
    notFound()
  }

  // Get related tools (same category, excluding current tool)
  const relatedTools = mockTools
    .filter((t) => t.id !== tool.id && t.categories.some((c) => tool.categories.includes(c)))
    .slice(0, 3)

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href={`/categories/${tool.categories[0]}`} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {tool.categories[0]}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tool Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold">{tool.name}</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button size="sm" asChild>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    Visit Website
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {tool.categories.map((category) => (
                <Link href={`/categories/${category}`} key={category}>
                  <Badge variant="secondary">{category}</Badge>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{tool.rating.toFixed(1)}</span>
                <span className="ml-1">({Math.floor(tool.visits / 100)} reviews)</span>
              </div>
              <div>{tool.visits.toLocaleString()} visits</div>
              <div>Added {new Date(tool.dateAdded).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Tool Image */}
          <div className="mb-8 rounded-lg overflow-hidden border">
            <img src={tool.image || "/placeholder.svg?height=400&width=800"} alt={tool.name} className="w-full" />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-4">
              <h2 className="text-xl font-bold mb-4">About {tool.name}</h2>
              <p className="mb-4">{tool.description}</p>
              <p className="mb-4">
                {tool.name} is a powerful AI tool that helps users {getToolPurpose(tool.categories[0])}. With its
                intuitive interface and advanced capabilities, it has quickly become one of the most popular tools in
                the {tool.categories[0]} category.
              </p>
              <p>
                Whether you're a professional looking to enhance your workflow or a beginner exploring the world of AI,{" "}
                {tool.name} offers a range of features to meet your needs.
              </p>
            </TabsContent>
            <TabsContent value="features" className="pt-4">
              <h2 className="text-xl font-bold mb-4">Key Features</h2>
              <ul className="space-y-4">
                {getToolFeatures(tool.categories[0]).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <ThumbsUp className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="reviews" className="pt-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">User Reviews</h2>
                <Button>Write a Review</Button>
              </div>

              <div className="space-y-6">
                {getToolReviews().map((review, index) => (
                  <div key={index} className="border-b pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                          <img
                            src={`/placeholder.svg?height=40&width=40&text=${review.author.charAt(0)}`}
                            alt={review.author}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{review.author}</h3>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-gray-600">{review.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.content}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Quick Info */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-4">Quick Info</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{tool.categories[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{tool.rating.toFixed(1)}/5</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pricing:</span>
                  <span className="font-medium">{tool.isPremium ? "Paid" : "Free / Freemium"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Added:</span>
                  <span>{new Date(tool.dateAdded).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="border-t my-4"></div>
              <Button className="w-full" asChild>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  Visit Website
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Related Tools */}
          <div>
            <h2 className="text-lg font-bold mb-4">Related Tools</h2>
            <div className="space-y-4">
              {relatedTools.map((relatedTool) => (
                <ToolCard key={relatedTool.id} tool={relatedTool} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions to generate content based on tool categories
function getToolPurpose(category: string): string {
  const purposes: Record<string, string> = {
    "text-generation": "generate high-quality written content",
    "image-generation": "create stunning visuals and artwork",
    coding: "write, debug, and optimize code",
    audio: "process and generate audio content",
    design: "create professional designs",
    productivity: "streamline workflows and boost efficiency",
    research: "gather and analyze information",
    video: "create and edit video content",
    analytics: "analyze data and extract insights",
    data: "process and transform data",
    marketing: "create marketing materials and campaigns",
  }
  return purposes[category] || "accomplish various AI-powered tasks"
}

function getToolFeatures(category: string) {
  const featuresByCategory: Record<string, Array<{ title: string; description: string }>> = {
    "text-generation": [
      {
        title: "Advanced Language Processing",
        description: "Utilizes state-of-the-art language models to generate human-like text for various purposes.",
      },
      {
        title: "Multiple Content Formats",
        description: "Create blog posts, social media content, emails, product descriptions, and more.",
      },
      {
        title: "Style Customization",
        description: "Adjust tone, style, and format to match your brand voice and target audience.",
      },
      {
        title: "Multilingual Support",
        description: "Generate content in multiple languages to reach global audiences.",
      },
    ],
    "image-generation": [
      {
        title: "Text-to-Image Generation",
        description: "Create images from textual descriptions with precise control over the output.",
      },
      {
        title: "Style Transfer",
        description: "Apply various artistic styles to your images for unique visual effects.",
      },
      {
        title: "High Resolution Output",
        description: "Generate high-quality images suitable for professional use and printing.",
      },
      {
        title: "Customization Options",
        description: "Fine-tune parameters to get exactly the image you're looking for.",
      },
    ],
    coding: [
      {
        title: "Code Completion",
        description: "Intelligent suggestions that help you write code faster and with fewer errors.",
      },
      {
        title: "Multiple Language Support",
        description: "Works with a wide range of programming languages and frameworks.",
      },
      {
        title: "Code Explanation",
        description: "Get plain-language explanations of complex code snippets.",
      },
      {
        title: "Bug Detection",
        description: "Identifies potential issues and suggests fixes before they cause problems.",
      },
    ],
  }

  // Default features if category not found
  const defaultFeatures = [
    {
      title: "User-Friendly Interface",
      description: "Intuitive design that makes it easy to get started and accomplish your tasks.",
    },
    {
      title: "Advanced AI Technology",
      description: "Powered by cutting-edge artificial intelligence to deliver high-quality results.",
    },
    {
      title: "Regular Updates",
      description: "Continuous improvements and new features to enhance your experience.",
    },
    {
      title: "Cross-Platform Compatibility",
      description: "Use on desktop, mobile, or web browsers for flexibility and convenience.",
    },
  ]

  return featuresByCategory[category] || defaultFeatures
}

function getToolPricing(isPremium = false) {
  if (isPremium) {
    return [
      {
        name: "Free Trial",
        price: 0,
        period: null,
        description: "Try basic features for free",
        features: ["Limited access to features", "5 uses per day", "Standard quality output", "Basic support"],
      },
      {
        name: "Pro",
        price: 29,
        period: "month",
        description: "Perfect for individuals and small teams",
        features: [
          "Full access to all features",
          "Unlimited uses",
          "High quality output",
          "Priority support",
          "API access",
        ],
      },
      {
        name: "Enterprise",
        price: 99,
        period: "month",
        description: "For businesses with advanced needs",
        features: [
          "Everything in Pro",
          "Dedicated account manager",
          "Custom integrations",
          "Advanced analytics",
          "99.9% uptime SLA",
        ],
      },
    ]
  } else {
    return [
      {
        name: "Free",
        price: 0,
        period: null,
        description: "Basic features for personal use",
        features: ["Core functionality", "Limited uses per day", "Standard quality output", "Community support"],
      },
      {
        name: "Plus",
        price: 9,
        period: "month",
        description: "Enhanced features for power users",
        features: ["All free features", "Increased usage limits", "Higher quality output", "Email support", "No ads"],
      },
      {
        name: "Pro",
        price: 19,
        period: "month",
        description: "Professional features for serious users",
        features: ["Unlimited usage", "Highest quality output", "Priority support", "Advanced settings", "API access"],
      },
    ]
  }
}

function getToolReviews() {
  return [
    {
      author: "Alex Johnson",
      rating: 5,
      date: "2 weeks ago",
      content:
        "This tool has completely transformed my workflow. The interface is intuitive, and the results are consistently impressive. I've tried many similar tools, but this one stands out for its accuracy and speed.",
    },
    {
      author: "Sarah Miller",
      rating: 4,
      date: "1 month ago",
      content:
        "Very good tool with powerful features. It saves me hours of work each week. The only reason I'm not giving 5 stars is that there are occasional glitches, but the support team is responsive and helpful.",
    },
    {
      author: "David Chen",
      rating: 5,
      date: "2 months ago",
      content:
        "Exceptional quality and value for money. I use this tool daily for my business, and it has paid for itself many times over. The recent updates have made it even better with new features that are genuinely useful.",
    },
  ]
}
