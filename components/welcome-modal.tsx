"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Show modal after a short delay when component mounts
    const timer = setTimeout(() => setIsOpen(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Encode the query for URL
      const encodedQuery = encodeURIComponent(query.trim())
      router.push(`/recommendation?q=${encodedQuery}`)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[800px] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <Image
              src="/ninja-logo.png"
              alt="AI Tools Ninja Logo"
              width={120}
              height={120}
              className="mb-4"
            />
          </div>
          <DialogTitle className="text-4xl text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
            What are you searching for today?
          </DialogTitle>
          <p className="text-center text-xl text-muted-foreground">
            Sure there is an AI for it!
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <textarea
            className="w-full min-h-[150px] p-6 rounded-xl border border-input bg-white/50 dark:bg-black/50 backdrop-blur-sm text-lg shadow-inner"
            placeholder="Describe what you're looking to do... (e.g., 'I need to create professional voiceovers for my videos' or 'I want to generate images from text descriptions')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex justify-center">
            <Button 
              type="submit" 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full transition-all duration-200 hover:scale-105"
            >
              Find the perfect AI tool
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 