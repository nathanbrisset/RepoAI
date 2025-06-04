import { ReactNode } from 'react'

export interface AITool {
  id: string
  name: string
  description: string
  url: string
  categories: string[]
  tags: string[]
  rating: number
  visits: number
  isPremium: boolean
  logo: string
  image: string
  dateAdded: string
}

export interface Category {
  id: string
  name: string
  description: string
  icon: ReactNode
}

export interface Tool {
  id: string
  name: string
  description: string
  url: string
  image: string
  logo: string
  categories: string[]
  pricing: "Free" | "Freemium" | "Premium"
  rating: number
  visits: number
} 