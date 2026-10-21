import React from 'react'
import {
  BarChart,
  BookOpen,
  Bot,
  Briefcase,
  CheckCircle,
  Code,
  Database,
  FileText,
  Heart,
  ImageIcon,
  Layout,
  LineChart,
  MessageSquare,
  MessagesSquare,
  Mic,
  Music,
  Palette,
  PenTool,
  Scale,
  Search,
  Shield,
  Users,
  Video,
  Zap,
} from "lucide-react"
import type { Category } from "./types"
import { categoryCatalog } from "./category-meta"
import { listedTools, getToolById as findTool, allTools } from "./catalog"

export { allTools }

const categoryIcons: Record<string, React.ReactNode> = {
  "llm-chatbots": <MessageSquare className="h-4 w-4" />,
  "ai-agents": <Bot className="h-4 w-4" />,
  automation: <Zap className="h-4 w-4" />,
  coding: <Code className="h-4 w-4" />,
  "no-code": <Layout className="h-4 w-4" />,
  writing: <PenTool className="h-4 w-4" />,
  image: <ImageIcon className="h-4 w-4" />,
  video: <Video className="h-4 w-4" />,
  voice: <Mic className="h-4 w-4" />,
  music: <Music className="h-4 w-4" />,
  design: <Palette className="h-4 w-4" />,
  meetings: <FileText className="h-4 w-4" />,
  productivity: <CheckCircle className="h-4 w-4" />,
  search: <Search className="h-4 w-4" />,
  data: <Database className="h-4 w-4" />,
  marketing: <BarChart className="h-4 w-4" />,
  sales: <Briefcase className="h-4 w-4" />,
  support: <MessagesSquare className="h-4 w-4" />,
  hr: <Users className="h-4 w-4" />,
  education: <BookOpen className="h-4 w-4" />,
  health: <Heart className="h-4 w-4" />,
  legal: <Scale className="h-4 w-4" />,
  finance: <LineChart className="h-4 w-4" />,
  security: <Shield className="h-4 w-4" />,
}

// The 24 categories from the taxonomy table. Copy is taken from that table.
export const categories: Category[] = categoryCatalog.map((category) => ({
  id: category.id,
  name: category.name,
  description: category.description,
  about: category.about,
  icon: categoryIcons[category.id] || <MessageSquare className="h-4 w-4" />,
}))

// The directory is loaded from content/tools/*.json.
// mockTools hides sunset, renamed, inactive, and duplicate-of cards. allTools still includes them.
export const mockTools = listedTools
export const tools = listedTools

export async function getToolById(id: string) {
  return findTool(id)
}
