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
  rating?: number
  visits?: number
  dateAdded: string
  dateAddedNote?: string
  isPremium?: 'Free' | 'Freemium' | 'Premium' | 'Open source' | 'Enterprise' | 'Usage-based' | 'One-time'
  features?: string[]
  howToUse?: {
    title: string;
    description: string;
    links?: { label: string; url: string }[];
  }[]
  longDescription?: string
  status?: 'active' | 'inactive' | 'renamed' | 'sunset' | 'duplicate-of'
  successorId?: string
  statusNote?: string
  summary_fr?: string
  shortDescription_fr?: string
  description_fr?: string
  tags_fr?: string[]
  features_fr?: string[]
  howToUse_fr?: Tool["howToUse"]
  statusNote_fr?: string
  dateAddedNote_fr?: string
  pricingNote_fr?: string
  lastVerified?: string | null
  sources?: string[]
  pricing?: {
    type: 'free' | 'paid' | 'freemium'
    model?: 'free' | 'freemium' | 'paid' | 'open-source' | 'enterprise' | 'usage-based' | 'one-time'
    label?: string
    details?: string
    verified?: boolean
    sourceUrl?: string
    uncertain?: boolean
  }
}

export interface Category {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  about?: string
}
