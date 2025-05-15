import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-xl">
          AI Tools Ninja
        </Link>

        <div className="flex items-center gap-6">
          <Link 
            href="/recommendation" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Find Your Perfect AI Tool
          </Link>
          <Link 
            href="/categories" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Categories
          </Link>
          <Link 
            href="/about" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            About
          </Link>
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
} 