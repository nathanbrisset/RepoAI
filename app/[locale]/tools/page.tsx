import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Categories from the GitHub repository
const categories = [
  {
    id: "chat",
    name: "Chat",
    tools: [
      {
        name: "ChatGPT",
        description: "ChatGPT is a free-to-use AI system. It allows users to engage in conversations, gain insights, automate tasks, and witness the future of AI all in one place.",
        url: "https://chat.openai.com",
        isPremium: false
      },
      {
        name: "Gemini",
        description: "Gemini gives you direct access to Google AI. Get help with writing, planning, learning, and more.",
        url: "https://gemini.google.com",
        isPremium: false
      },
      {
        name: "Claude",
        description: "Claude is a family of foundational AI models that can be used in various applications. You can talk directly with Claude at claude.ai to brainstorm ideas, analyze images, and process long documents.",
        url: "https://claude.ai",
        isPremium: false
      }
    ]
  },
  {
    id: "images",
    name: "Images",
    tools: [
      {
        name: "Midjourney",
        description: "AI image generation",
        url: "https://www.midjourney.com",
        isPremium: true
      },
      {
        name: "DALL·E 3",
        description: "DALL·E 3 is an AI system that can create realistic images and art from a natural-language description.",
        url: "https://openai.com/dall-e-3",
        isPremium: true
      }
    ]
  },
  {
    id: "video",
    name: "Video",
    tools: [
      {
        name: "Sora",
        description: "Sora is a text-to-video AI model that can create realistic and imaginative scenes from text instructions.",
        url: "https://openai.com/sora",
        isPremium: true
      },
      {
        name: "Runway",
        description: "AI video generation",
        url: "https://runwayml.com",
        isPremium: true
      }
    ]
  },
  {
    id: "commercial",
    name: "Commercial Tools",
    tools: [
      {
        name: "Taskade",
        description: "Build, train, and deploy AI agents to automate tasks, research, and collaborate in real-time",
        url: "https://www.taskade.com",
        isPremium: true
      }
    ]
  }
]

export default function ToolsPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">AI Tools Directory</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Explore our comprehensive collection of AI tools, organized by category. Find the perfect AI solution for your needs.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <Input
          type="search"
          placeholder="Search tools..."
          className="max-w-sm"
        />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tools by Category */}
      {categories.map((category) => (
        <section key={category.id} className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{category.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.tools.map((tool) => (
              <div key={tool.name} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-xl mb-1">{tool.name}</h3>
                  </div>
                  {tool.isPremium && (
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{tool.description}</p>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center"
                >
                  Visit Website
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
} 