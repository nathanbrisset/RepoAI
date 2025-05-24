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

// Next.js App Router types
export interface PageProps {
  params: {
    [key: string]: string | string[]
  }
  searchParams?: {
    [key: string]: string | string[] | undefined
  }
} 