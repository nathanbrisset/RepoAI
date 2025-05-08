import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">AI Directory</h3>
            <p className="text-gray-600 mb-4">Your comprehensive directory of AI tools for every use case.</p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/text-generation" className="text-gray-600 hover:text-gray-900">
                  Text Generation
                </Link>
              </li>
              <li>
                <Link href="/category/image-generation" className="text-gray-600 hover:text-gray-900">
                  Image Generation
                </Link>
              </li>
              <li>
                <Link href="/category/audio" className="text-gray-600 hover:text-gray-900">
                  Audio & Speech
                </Link>
              </li>
              <li>
                <Link href="/category/productivity" className="text-gray-600 hover:text-gray-900">
                  Productivity
                </Link>
              </li>
              <li>
                <Link href="/category/coding" className="text-gray-600 hover:text-gray-900">
                  Coding
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-gray-900">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-gray-600 hover:text-gray-900">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/newsletter" className="text-gray-600 hover:text-gray-900">
                  Newsletter
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-gray-600 hover:text-gray-900">
                  Submit a Tool
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 mb-4 md:mb-0">© {new Date().getFullYear()} AI Directory. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              Twitter
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              LinkedIn
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
