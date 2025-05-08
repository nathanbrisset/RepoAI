"use client"

import Link from "next/link"
import { CheckCircle, ArrowRight, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"

function Copyright() {
  const [year, setYear] = useState("")
  useEffect(() => {
    setYear(new Date().getFullYear().toString())
  }, [])
  return <p className="text-gray-500 text-sm text-center mt-8">&copy; {year} AITools.ninja. All rights reserved.</p>
}

const faqs = [
  {
    q: "How do you select tools for the directory?",
    a: "We evaluate each tool based on its functionality, user experience, innovation, and value. We ensure it uses AI technology in a meaningful way and is publicly available."
  },
  {
    q: "Can I submit my own tool to the directory?",
    a: "We welcome submissions from tool creators and users. Simply use our submission form, and our team will review your entry."
  },
  {
    q: "Are the ratings and reviews biased?",
    a: "No, we strive for objectivity in our evaluations. Ratings are based on actual usage, user feedback, and our assessment criteria. We do not accept payment for favorable reviews."
  },
  {
    q: "How often is the directory updated?",
    a: "We update our directory regularly as new tools emerge and existing ones evolve. We also refresh information about features, pricing, and other details as they change."
  },
  {
    q: "Do you have affiliate relationships with the tools?",
    a: "Some links may be affiliate links, which means we earn a commission if you make a purchase. This helps support our work, but it never influences our evaluations or recommendations."
  },
  {
    q: "How can I contribute to the directory?",
    a: "You can contribute by submitting tools, writing reviews, reporting outdated information, and sharing our directory with others interested in AI tools."
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title and subtitle */}
        <h1 className="text-4xl font-bold text-center mb-4">About AI Directory</h1>
        <p className="text-xl text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Your comprehensive resource for discovering, comparing, and choosing the best AI tools for every use case.
        </p>
        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link href="/categories" className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded transition">
            Explore Categories <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link href="/submit" className="inline-flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 font-semibold px-6 py-3 rounded transition">
            Submit a Tool
          </Link>
        </div>
        {/* Mission and Features */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Mission */}
          <div className="flex-1 bg-white rounded-xl p-8 shadow">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              AI Directory was created to help people navigate the rapidly expanding landscape of artificial intelligence tools. With new AI solutions emerging daily, finding the right tool for your specific needs can be overwhelming.
            </p>
            <p className="text-gray-700 mb-4">
              Our mission is to simplify this process by providing a curated, comprehensive directory of AI tools across various categories. We thoroughly research and evaluate each tool to ensure it meets our quality standards before adding it to our directory.
            </p>
            <p className="text-gray-700">
              Whether you're a professional looking to enhance your workflow, a creator seeking AI-powered inspiration, or a business aiming to leverage AI for growth, we're here to help you discover the perfect tools for your needs.
            </p>
          </div>
          {/* Features */}
          <div className="flex-1 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-100 flex flex-col gap-4 justify-center">
            <div>
              <div className="flex items-center mb-1">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2" />
                <span className="font-bold">Comprehensive Research</span>
              </div>
              <p className="text-gray-700 text-sm ml-7">We thoroughly research each tool to provide accurate, up-to-date information.</p>
            </div>
            <div>
              <div className="flex items-center mb-1">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2" />
                <span className="font-bold">Unbiased Reviews</span>
              </div>
              <p className="text-gray-700 text-sm ml-7">Our evaluations are objective and based on actual usage and performance.</p>
            </div>
            <div>
              <div className="flex items-center mb-1">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2" />
                <span className="font-bold">Community-Driven</span>
              </div>
              <p className="text-gray-700 text-sm ml-7">We welcome user submissions and feedback to keep our directory relevant and valuable.</p>
            </div>
          </div>
        </div>
        {/* How It Works */}
        <div className="bg-white rounded-xl p-8 shadow mb-8">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-purple-50 rounded-lg p-6 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center mb-4 font-bold text-lg text-purple-700">1</div>
              <h3 className="font-bold text-lg mb-2">Discover</h3>
              <p className="text-gray-700 text-center text-sm">Browse our extensive collection of AI tools organized by category, rating, and popularity. Use filters to narrow down your search based on specific criteria.</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center mb-4 font-bold text-lg text-purple-700">2</div>
              <h3 className="font-bold text-lg mb-2">Compare</h3>
              <p className="text-gray-700 text-center text-sm">Read detailed descriptions, reviews, and ratings to compare different tools. Understand their features, pricing models, and use cases to make informed decisions.</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center mb-4 font-bold text-lg text-purple-700">3</div>
              <h3 className="font-bold text-lg mb-2">Choose</h3>
              <p className="text-gray-700 text-center text-sm">Select the perfect AI tool for your needs and visit their website directly from our directory. Many tools offer free trials or freemium models to get started.</p>
            </div>
          </div>
        </div>

        {/* Join Our Community */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-400 rounded-xl p-8 mb-12 flex flex-col md:flex-row gap-8 text-white">
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-2">Join Our Community</h2>
            <p className="mb-4">Connect with fellow AI enthusiasts, stay updated on the latest tools, and contribute to our growing directory. Together, we can build the most comprehensive resource for AI tools on the web.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="inline-flex items-center justify-center bg-white text-purple-700 font-semibold px-6 py-3 rounded border border-purple-200 shadow-sm text-base hover:bg-purple-50 transition mb-2 sm:mb-0">
                Subscribe to our newsletter
              </button>
              <input type="email" placeholder="Your email" className="px-4 py-2 rounded border border-white/30 bg-white/20 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/40" />
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center bg-gradient-to-br from-white/20 to-white/0 rounded-lg p-6">
            <h3 className="font-bold mb-3">Why Join?</h3>
            <ul className="space-y-2">
              <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-white/80" /> Early access to new features and tools</li>
              <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-white/80" /> Connect with AI developers and enthusiasts</li>
              <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-white/80" /> Share your experiences and learn from others</li>
              <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-white/80" /> Influence the future development of our platform</li>
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow border">
              <h3 className="font-bold mb-2">{faq.q}</h3>
              <p className="text-gray-700 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore AI Tools?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover the perfect AI solutions to enhance your productivity, creativity, and workflow.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/" className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded transition">
              Browse Directory <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 font-semibold px-6 py-3 rounded transition">
              Contact Us <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        <Copyright />
      </div>
    </div>
  )
}
