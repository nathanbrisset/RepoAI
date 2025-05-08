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
} 