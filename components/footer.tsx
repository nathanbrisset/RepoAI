import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10 md:gap-0">
          {/* Brand/mission */}
          <div className="flex-1 mb-8 md:mb-0 md:mr-8">
            <h3 className="font-bold text-lg mb-4">AITools.ninja</h3>
            <p className="text-gray-600 mb-2">We help you find your perfect AI !</p>
          </div>

          {/* Categories */}
          <div className="flex-1 mb-8 md:mb-0 md:mr-8">
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/text" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Text Generation
                </Link>
              </li>
              <li>
                <Link href="/categories/image" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Image Generation
                </Link>
              </li>
              <li>
                <Link href="/categories/audio" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Audio & Speech
                </Link>
              </li>
              <li>
                <Link href="/categories/productivity" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Productivity
                </Link>
              </li>
              <li>
                <Link href="/categories/coding" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Coding
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Submit a Tool
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 flex flex-col items-center">
          <p className="text-gray-600 text-center">© 2025 AI Tools Ninja. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
