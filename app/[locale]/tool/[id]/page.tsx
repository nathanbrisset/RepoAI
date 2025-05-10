import { ArrowLeft, ExternalLink, Star } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/tools" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          All Tools
        </Link>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="flex-shrink-0">
          <img
            src={tool.logo || tool.image}
            alt={tool.name}
            className="w-32 h-32 rounded-xl object-cover"
          />
        </div>
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{tool.name}</h1>
            {tool.isPremium && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Premium
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-medium">{tool.rating}</span>
            </div>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">{tool.visits.toLocaleString()} visits</span>
          </div>
          <p className="text-gray-600 mb-6">{tool.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {tool.categories.map((category) => (
              <Link key={category} href={`/categories/${category.toLowerCase().replace(/\s+/g, "-")}`}>
                <Badge variant="secondary" className="hover:bg-gray-100">
                  {category}
                </Badge>
              </Link>
            ))}
            {tool.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-gray-50">
                {tag}
              </Badge>
            ))}
          </div>
          <Button asChild>
            <a href={tool.url} target="_blank" rel="noopener noreferrer">
              Visit Website
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="mb-12">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">About {tool.name}</h2>
              <p className="text-gray-600 mb-4">
                {tool.name} is a powerful AI tool that helps users {getToolPurpose(tool.categories[0])}.
                With its advanced features and user-friendly interface, it's designed to streamline your workflow
                and enhance your productivity.
              </p>
              <p className="text-gray-600">
                Whether you're a professional looking to optimize your work or a beginner exploring AI tools,
                {tool.name} offers the perfect balance of power and ease of use.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Key Features</h2>
              <ul className="space-y-4">
                {getToolFeatures(tool.categories[0]).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-sm font-medium text-purple-600">{index + 1}</span>
                    </div>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Pricing Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-2">Free Plan</h3>
                  <p className="text-gray-600 mb-4">
                    Get started with basic features and limited usage. Perfect for trying out the tool.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center text-gray-600">
                      <span className="mr-2">✓</span>
                      Basic features
                    </li>
                    <li className="flex items-center text-gray-600">
                      <span className="mr-2">✓</span>
                      Limited usage
                    </li>
                    <li className="flex items-center text-gray-600">
                      <span className="mr-2">✓</span>
                      Community support
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">Get Started</Button>
                </div>
                <div className="border rounded-lg p-6 bg-purple-50">
                  <h3 className="font-bold text-lg mb-2">Premium Plan</h3>
                  <p className="text-gray-600 mb-4">
                    Unlock all features and get unlimited access. Perfect for professionals and teams.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center text-gray-600">
                      <span className="mr-2">✓</span>
                      All features
                    </li>
                    <li className="flex items-center text-gray-600">
                      <span className="mr-2">✓</span>
                      Unlimited usage
                    </li>
                    <li className="flex items-center text-gray-600">
                      <span className="mr-2">✓</span>
                      Priority support
                    </li>
                  </ul>
                  <Button className="w-full">Upgrade Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No reviews yet</h3>
                <p className="text-gray-600 mb-6">Be the first to review this tool!</p>
                <Button variant="outline">Write a Review</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function getToolPurpose(category: string): string {
  const purposes: Record<string, string> = {
    "Design": "create stunning visual designs and artwork",
    "Productivity": "boost productivity and streamline workflows",
    "Research": "conduct research and analyze data",
    "Video": "create and edit professional videos",
    "Analytics": "analyze data and generate insights",
    "Writing": "write and edit content",
    "Audio": "create and edit audio content",
    "Image": "create and edit images",
    "Code": "write and debug code",
    "Chat": "engage in natural conversations",
    "Education": "learn and teach effectively",
    "Business": "grow and manage your business",
    "Marketing": "create and execute marketing campaigns",
    "Social Media": "manage and optimize social media presence",
    "SEO": "improve search engine rankings",
    "Translation": "translate content between languages",
    "Voice": "create and edit voice content",
    "Music": "create and edit music",
    "3D": "create and edit 3D content",
    "Other": "accomplish various tasks"
  }
  return purposes[category] || "accomplish various tasks"
}

function getToolFeatures(category: string): string[] {
  const features: Record<string, string[]> = {
    "Design": [
      "AI-powered design generation",
      "Custom style customization",
      "Batch processing capabilities",
      "Export in multiple formats",
      "Collaboration tools"
    ],
    "Productivity": [
      "Task automation",
      "Smart scheduling",
      "Project management",
      "Team collaboration",
      "Progress tracking"
    ],
    "Research": [
      "Data analysis",
      "Literature review",
      "Citation management",
      "Research synthesis",
      "Report generation"
    ],
    "Video": [
      "AI video editing",
      "Auto-captioning",
      "Scene detection",
      "Video enhancement",
      "Format conversion"
    ],
    "Analytics": [
      "Data visualization",
      "Predictive analytics",
      "Custom reporting",
      "Real-time monitoring",
      "Trend analysis"
    ],
    "Writing": [
      "Content generation",
      "Grammar checking",
      "Style suggestions",
      "Plagiarism detection",
      "SEO optimization"
    ],
    "Audio": [
      "Audio enhancement",
      "Noise reduction",
      "Voice processing",
      "Music generation",
      "Audio transcription"
    ],
    "Image": [
      "Image generation",
      "Style transfer",
      "Object removal",
      "Background removal",
      "Image enhancement"
    ],
    "Code": [
      "Code generation",
      "Bug detection",
      "Code optimization",
      "Documentation generation",
      "Code review"
    ],
    "Chat": [
      "Natural language processing",
      "Context awareness",
      "Multi-language support",
      "Custom responses",
      "Integration capabilities"
    ],
    "Education": [
      "Personalized learning",
      "Content creation",
      "Assessment tools",
      "Progress tracking",
      "Interactive exercises"
    ],
    "Business": [
      "Market analysis",
      "Customer insights",
      "Process automation",
      "Performance tracking",
      "Decision support"
    ],
    "Marketing": [
      "Campaign optimization",
      "Content creation",
      "Audience targeting",
      "Performance analytics",
      "A/B testing"
    ],
    "Social Media": [
      "Content scheduling",
      "Engagement analytics",
      "Hashtag optimization",
      "Audience insights",
      "Competitor analysis"
    ],
    "SEO": [
      "Keyword research",
      "Content optimization",
      "Backlink analysis",
      "Rank tracking",
      "Technical SEO"
    ],
    "Translation": [
      "Multi-language support",
      "Context preservation",
      "Industry-specific terminology",
      "Quality assurance",
      "Batch processing"
    ],
    "Voice": [
      "Voice synthesis",
      "Voice cloning",
      "Emotion detection",
      "Accent modification",
      "Background noise removal"
    ],
    "Music": [
      "Music generation",
      "Style transfer",
      "Instrument separation",
      "Tempo adjustment",
      "Chord progression"
    ],
    "3D": [
      "3D model generation",
      "Texture creation",
      "Animation tools",
      "Scene composition",
      "Rendering optimization"
    ],
    "Other": [
      "Custom workflows",
      "API integration",
      "Data processing",
      "Automation tools",
      "Analytics dashboard"
    ]
  }
  return features[category] || features["Other"]
} 