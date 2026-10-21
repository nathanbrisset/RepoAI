import React from 'react'
import {
  Code,
  ImageIcon,
  MessageSquare,
  Mic,
  PenTool,
  Briefcase,
  Brain,
  Video,
  LineChart,
  Database,
  BarChart,
  CheckCircle,
  Palette,
} from "lucide-react"
import type { Category } from "./types"
import { listedTools, getToolById as findTool, allTools } from "./catalog"

export { allTools }

// Categories with icons
export const categories: Category[] = [
  {
    id: "text",
    name: "Text Generation",
    description: "AI tools for generating, editing, and enhancing text content.",
    about: "Text Generation AI tools leverage advanced language models to assist with a wide range of writing tasks, from copywriting and content creation to summarization, translation, and grammar correction. These tools help users produce high-quality written material efficiently and creatively, making them invaluable for marketers, students, researchers, and businesses alike.",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    id: "image",
    name: "Image Generation",
    description: "AI tools for creating, editing, and enhancing images.",
    about: "Image Generation AI tools enable users to create, manipulate, and enhance images using artificial intelligence. These platforms can generate art from text prompts, upscale photos, remove backgrounds, and apply creative effects, making visual content creation accessible to everyone, regardless of design experience.",
    icon: <ImageIcon className="h-4 w-4" />,
  },
  {
    id: "audio",
    name: "Audio & Speech",
    description: "AI tools for audio processing, speech synthesis, and transcription.",
    about: "Audio & Speech AI tools leverage artificial intelligence to process, generate, and transform audio content, including speech synthesis and voice cloning. These innovative solutions are transforming how professionals and individuals approach their work in this domain, offering features like transcription, noise reduction, and voice generation for podcasts, videos, and more.",
    icon: <Mic className="h-4 w-4" />,
  },
  {
    id: "video",
    name: "Video Creation",
    description: "AI tools for generating, editing, and enhancing video content.",
    about: "Video Creation AI tools automate and enhance the video production process. They can generate videos from scripts, add effects, create subtitles, and enable creative storytelling. These tools make video creation faster, more accessible, and more engaging for content creators, marketers, and educators.",
    icon: <Video className="h-4 w-4" />,
  },
  {
    id: "coding",
    name: "Coding",
    description: "AI-powered coding assistants and developer tools.",
    about: "AI-powered coding assistants and developer tools help with code generation, debugging, code review, and learning new programming languages. These tools boost productivity, reduce errors, and support developers of all skill levels in building, testing, and maintaining software more efficiently.",
    icon: <Code className="h-4 w-4" />,
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "AI tools for marketing automation, content creation, and analytics.",
    about: "Marketing AI tools empower marketers to automate campaigns, personalize messaging, analyze data, and optimize content. These platforms help businesses reach their audience more effectively, improve ROI, and stay ahead in a competitive digital landscape.",
    icon: <BarChart className="h-4 w-4" />,
  },
  {
    id: "productivity",
    name: "Productivity",
    description: "AI tools for task automation, project management, and workflow optimization.",
    about: "Productivity AI tools streamline workflows, automate repetitive tasks, and enhance personal and team organization. From smart scheduling to automated note-taking, these solutions help users save time, stay organized, and focus on what matters most.",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  {
    id: "data-processing",
    name: "Data Processing",
    description: "AI tools for data cleaning, transformation, analysis, and visualization.",
    about: "Data Processing AI tools empower users to extract insights, automate data workflows, and make data-driven decisions. These platforms support data cleaning, transformation, analysis, and visualization, making them essential for business intelligence, research, and analytics across industries.",
    icon: <Database className="h-4 w-4" />,
  },
  {
    id: "design",
    name: "Design",
    description: "AI-powered design tools for graphic design, UI/UX, and branding.",
    about: "Design AI tools assist designers in creating stunning visuals, layouts, and prototypes quickly and efficiently. They offer features like automated layout suggestions, asset generation, and branding support, making high-quality design accessible to everyone.",
    icon: <Palette className="h-4 w-4" />,
  }
]

// The directory is loaded from content/tools/*.json.
// mockTools hides sunset and duplicate-of cards. allTools still includes them.
export const mockTools = listedTools
export const tools = listedTools

export async function getToolById(id: string) {
  return findTool(id)
}
