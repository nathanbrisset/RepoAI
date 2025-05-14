import { ReactNode } from 'react'

export interface Category {
  name: string
  description: string
  icon: ReactNode
}

export interface Tool {
  name: string
  description: string
  url: string
  id: string
  image: string
  logo: string
  categories: string[]
  subcategory: string
  tags: string[]
  rating: number
  visits: number
  dateAdded: string
  isPremium: string
} 