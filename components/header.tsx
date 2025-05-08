"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import SearchBar from "./search-bar"

export default function Header() {
  const [language, setLanguage] = useState<"en" | "fr">("en")

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en")
  }

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/placeholder-logo.png" alt="AITools.ninja Logo" className="w-8 h-8 rounded-md" />
          <span className="font-bold text-xl">{language === 'fr' ? 'Votre Ninja AI' : 'Your AI Ninja'}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/categories" className="text-gray-600 hover:text-gray-900">
            Categories
          </Link>
          <Link href="/submit" className="text-gray-600 hover:text-gray-900">
            Submit Tool
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900">
            About
          </Link>
          <div className="flex items-center space-x-3">
            <SearchBar className="bg-transparent" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {language === "en" ? "EN" : "FR"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("fr")}>Français</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-3 md:hidden">
          <SearchBar className="bg-transparent" />
          <Button variant="outline" size="sm" onClick={toggleLanguage}>
            {language === "en" ? "EN" : "FR"}
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <Link href="/categories" className="text-lg font-medium">
                  Categories
                </Link>
                <Link href="/submit" className="text-lg font-medium">
                  Submit Tool
                </Link>
                <Link href="/about" className="text-lg font-medium">
                  About
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
