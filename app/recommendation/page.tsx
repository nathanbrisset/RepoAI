"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Metadata } from 'next'
import ToolCard from '@/components/tool-card'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { Tool } from '@/lib/types'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'AI Tool Recommendation | AI Tools Ninja',
  description: 'Get personalized AI tool recommendations based on your needs',
}

const categoryNames: Record<string, string> = {
  'audio': 'Audio Processing',
  'image': 'Image Generation',
  'text': 'Text Processing',
  'coding': 'Development',
  'video': 'Video Creation',
  'marketing': 'Marketing',
  'research': 'Research',
  'analytics': 'Analytics',
  'data': 'Data Processing',
  'design': 'Design'
}

function findBestMatch(query: string): { bestMatch: Tool, otherMatches: Tool[] } {
  // Convert query to lowercase for better matching
  const q = query.toLowerCase()
  
  // Define keywords and their corresponding categories/tags
  const keywordMap = {
    'voice': ['audio', 'voice-generation', 'text-to-speech'],
    'speech': ['audio', 'voice-generation', 'text-to-speech'],
    'image': ['image', 'art', 'design'],
    'picture': ['image', 'art', 'design'],
    'code': ['coding', 'development'],
    'programming': ['coding', 'development'],
    'video': ['video', 'animation'],
    'marketing': ['marketing', 'content'],
    'writing': ['text', 'content'],
    'analytics': ['analytics', 'data'],
  }

  // Score each tool based on query relevance
  const scoredTools = mockTools.map(tool => {
    let score = 0
    
    // Check tool name and description
    if (tool.name.toLowerCase().includes(q)) score += 5
    if (tool.description.toLowerCase().includes(q)) score += 3
    
    // Check categories and tags
    tool.categories.forEach(category => {
      if (category.toLowerCase().includes(q)) score += 4
    })
    if (tool.tags) {
      tool.tags.forEach(tag => {
        if (tag.toLowerCase().includes(q)) score += 2
      })
    }
    
    // Check against keyword map
    Object.entries(keywordMap).forEach(([keyword, relatedTerms]) => {
      if (q.includes(keyword)) {
        relatedTerms.forEach(term => {
          if (tool.categories.some(cat => cat.toLowerCase() === term) ||
              (tool.tags && tool.tags.some(tag => tag.toLowerCase() === term))) {
            score += 3
          }
        })
      }
    })
    
    return { tool, score }
  })

  // Sort by score
  scoredTools.sort((a, b) => b.score - a.score)
  
  // Return best match and other matches
  return {
    bestMatch: scoredTools[0].tool,
    otherMatches: scoredTools.slice(1, 7).map(st => st.tool)
  }
}

function getRecommendationReason(tool: Tool, query: string): string[] {
  const reasons: string[] = []
  
  if (tool.rating >= 4.5) {
    reasons.push(`Highly rated (${tool.rating}/5)`)
  }
  
  if (tool.visits > 1000000) {
    reasons.push('Popular among users')
  }
  
  tool.categories.forEach((category) => {
    const categoryName = categoryNames[category]
    if (categoryName) {
      reasons.push(`Specialized in ${categoryName}`)
    }
  })

  return reasons
}

function SearchForm() {
  return (
    <form action="/recommendation" className="w-full max-w-2xl mx-auto mb-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Find Your Perfect AI Tool
        </h1>
        <p className="text-center text-muted-foreground text-lg">
          Describe what you're looking to do, and we'll find the best AI tool for your needs
        </p>
        <textarea
          name="q"
          className="w-full min-h-[150px] p-6 rounded-xl border border-input bg-white/50 dark:bg-black/50 backdrop-blur-sm text-lg shadow-inner"
          placeholder="Describe what you're looking to do... (e.g., 'I need to create professional voiceovers for my videos' or 'I want to generate images from text descriptions')"
          required
        />
        <div className="flex justify-center">
          <button 
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full transition-all duration-200 hover:scale-105"
          >
            Find AI Tools
          </button>
        </div>
      </div>
    </form>
  )
}

export default function RecommendationPage() {
  const [prompt, setPrompt] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRecommendation("");
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setRecommendation(data.recommendation);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-6 text-center">AI Tool Recommendation Assistant</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">Describe what you want to do, and our AI assistant will recommend the best tool for you.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <Input
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="e.g. I want to generate images from text for my marketing team"
          required
          className="text-lg px-4 py-3"
        />
        <Button type="submit" className="w-full text-lg" disabled={loading || !prompt}>
          {loading ? "Thinking..." : "Get Recommendation"}
        </Button>
      </form>
      {error && <div className="text-red-600 text-center mb-4">{error}</div>}
      {recommendation && (
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100 text-lg">
          <h2 className="font-bold mb-2 text-purple-700">AI Assistant Recommendation:</h2>
          <div>{recommendation}</div>
        </div>
      )}
    </div>
  );
} 