"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-6 text-black">About AI Tools Ninja</h1>
          <p className="text-xl text-gray-600">
            Your trusted guide in the world of AI tools
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              At AI Tools Ninja, we're on a mission to simplify the process of finding and selecting the right AI tools for your needs. In a rapidly evolving AI landscape, we curate and organize the best tools to help you make informed decisions.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Tool Discovery</h3>
                  <p className="text-gray-700">
                    The directory groups AI tools by category so you can scan what is listed and open the official website.
                  </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Smart Recommendations</h3>
                <p className="text-gray-700">
                  Our advanced recommendation system helps you find the perfect AI tools based on your specific needs and requirements.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Tool profiles</h3>
                <p className="text-gray-700">
                  Each listing shows a short description, categories, a pricing label, and a link to the official website.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Category Organization</h3>
                <p className="text-gray-700">
                  Tools are organized into clear categories, making it easy to find exactly what you're looking for.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Process</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Research</h3>
                  <p className="text-gray-700">
                    We actively monitor the AI tools landscape, identifying new and promising solutions.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Evaluation</h3>
                  <p className="text-gray-700">
                    We file publicly available details — category, pricing label, and a short description. We do not test each tool.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Curation</h3>
                  <p className="text-gray-700">
                    We carefully select and add tools to our directory, ensuring they meet our quality standards.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to Find Your AI Tools?</h2>
            <div className="space-x-4">
              <Link href="/tools">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Browse All Tools
                </Button>
              </Link>
              <Link href="/recommendation">
                <Button size="lg" variant="outline">
                  Get Personalized Recommendations
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 