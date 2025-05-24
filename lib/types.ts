import type React from "react"

export interface Tool {
  id: string
  name: string
  description: string
  url: string
  image: string
  logo?: string
  categories: string[]
  subcategory?: string
  tags?: string[]
  rating: number
  visits: number
  dateAdded: string
  isPremium?: 'Free' | 'Freemium' | 'Premium'
  features?: string[]
  pricing?: {
    type: 'free' | 'paid' | 'freemium'
    details?: string
  }
}

export interface Category {
  id: string
  name: string
  description: string
  icon: React.ReactNode
}
