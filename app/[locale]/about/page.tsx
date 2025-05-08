import { ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About AITools.ninja</h1>
        
        <div className="prose prose-lg mb-12">
          <p className="text-xl text-gray-600 mb-6">
            Welcome to AITools.ninja, your ultimate directory for discovering and exploring the best AI tools across various categories.
            Our mission is to help you navigate the rapidly evolving landscape of artificial intelligence tools and find the perfect solutions for your needs.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
          <p className="mb-6">
            We believe that AI tools should be accessible to everyone. Our platform curates and organizes the most useful AI tools,
            making it easy for you to find exactly what you need, whether you're a professional, student, or enthusiast.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">What We Offer</h2>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-purple-600 mr-2 flex-shrink-0" />
              <span>Comprehensive directory of AI tools across multiple categories</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-purple-600 mr-2 flex-shrink-0" />
              <span>Detailed information about each tool's features and capabilities</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-purple-600 mr-2 flex-shrink-0" />
              <span>User reviews and ratings to help you make informed decisions</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-purple-600 mr-2 flex-shrink-0" />
              <span>Regular updates with the latest AI tools and technologies</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Get Involved</h2>
          <p className="mb-6">
            We welcome contributions from the community! If you know of a great AI tool that isn't listed on our platform,
            you can submit it for review. Together, we can build the most comprehensive and useful AI tools directory.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/submit">
              <Button className="w-full sm:w-auto">
                Submit a Tool
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/tools">
              <Button variant="outline" className="w-full sm:w-auto">
                Browse Tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 