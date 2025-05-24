"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Star, Share2, ThumbsUp, MessageSquare, Bookmark, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tool } from "@/lib/types";

interface ToolPageClientProps {
  tool: Tool;
}

export default function ToolPageClient({ tool }: ToolPageClientProps) {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/tools" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          All Tools
        </Link>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="flex-shrink-0">
          <img
            src={tool.logo || tool.image}
            alt={tool.name}
            className="w-32 h-32 rounded-xl object-cover"
          />
        </div>
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{tool.name}</h1>
            {tool.isPremium && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Premium
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-medium">{tool.rating}</span>
            </div>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">{tool.visits.toLocaleString()} visits</span>
          </div>
          <p className="text-gray-600 mb-6">{tool.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {tool.categories.map((category) => (
              <Link key={category} href={`/categories/${category.toLowerCase().replace(/\s+/g, "-")}`}>
                <Badge variant="secondary" className="hover:bg-gray-100">
                  {category}
                </Badge>
              </Link>
            ))}
            {tool.tags && tool.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-gray-50">
                {tag}
              </Badge>
            ))}
          </div>
          <Button asChild>
            <a href={tool.url} target="_blank" rel="noopener noreferrer">
              Visit Website
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="mb-12">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">About {tool.name}</h2>
              <p className="text-gray-600 mb-4">
                {tool.name} is a powerful AI tool that helps users {getToolPurpose(tool.categories[0])}.
                With its advanced features and user-friendly interface, it's designed to streamline your workflow
                and enhance your productivity.
              </p>
              <p className="text-gray-600">
                Whether you're a professional looking to optimize your work or a beginner exploring AI tools,
                {tool.name} offers the perfect balance of power and ease of use.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Key Features</h2>
              <ul className="space-y-4">
                {getToolFeatures(tool.categories[0], tool.name).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-sm font-medium text-purple-600">{index + 1}</span>
                    </div>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-medium mb-4">Reviews</h3>
              <ReviewForm toolId={tool.id} onReviewSubmitted={() => {}} />
              <ReviewsList toolId={tool.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getToolPurpose(category: string): string {
  const purposes: Record<string, string> = {
    "Design": "create stunning visual designs and artwork",
    "Productivity": "boost productivity and streamline workflows",
    "Research": "conduct research and analyze data",
    "Video": "create and edit professional videos",
    "Analytics": "analyze data and generate insights",
    "Writing": "write and edit content",
    "Audio": "create and edit audio content",
    "Image": "create and edit images",
    "Code": "write and debug code",
    "Chat": "engage in natural conversations",
    "Education": "learn and teach effectively",
    "Business": "grow and manage your business",
    "Marketing": "create and execute marketing campaigns",
    "Social Media": "manage and optimize social media presence",
    "SEO": "improve search engine rankings",
    "Translation": "translate content between languages",
    "Voice": "create and edit voice content",
    "Music": "create and edit music",
    "3D": "create and edit 3D content",
    "Other": "accomplish various tasks"
  };
  return purposes[category] || "accomplish various tasks";
}

function getToolFeatures(category: string, toolName?: string): string[] {
  const features: Record<string, string[]> = {
    "Design": [
      "AI-powered design generation",
      "Custom style customization",
      "Batch processing capabilities",
      "Export in multiple formats",
      "Collaboration tools"
    ],
    "Productivity": [
      "Task automation",
      "Smart scheduling",
      "Project management",
      "Team collaboration",
      "Progress tracking"
    ],
    "Research": [
      "Data analysis",
      "Literature review",
      "Citation management",
      "Research synthesis",
      "Report generation"
    ],
    "Video": [
      "AI video editing",
      "Auto-captioning",
      "Scene detection",
      "Video enhancement",
      "Format conversion"
    ],
    "Analytics": [
      "Data visualization",
      "Predictive analytics",
      "Custom reporting",
      "Real-time monitoring",
      "Trend analysis"
    ],
    "Writing": [
      "Content generation",
      "Grammar checking",
      "Style suggestions",
      "Plagiarism detection",
      "SEO optimization"
    ],
    "Audio": [
      "Audio enhancement",
      "Noise reduction",
      "Voice processing",
      "Music generation",
      "Audio transcription"
    ],
    "Image": [
      "Image generation",
      "Style transfer",
      "Object removal",
      "Background removal",
      "Image enhancement"
    ],
    "Code": [
      "Code generation",
      "Bug detection",
      "Code optimization",
      "Documentation generation",
      "Code review"
    ],
    "Chat": [
      "Natural language processing",
      "Context awareness",
      "Multi-language support",
      "Custom responses",
      "Integration capabilities"
    ],
    "Education": [
      "Personalized learning",
      "Content creation",
      "Assessment tools",
      "Progress tracking",
      "Interactive exercises"
    ],
    "Business": [
      "Market analysis",
      "Customer insights",
      "Process automation",
      "Performance tracking",
      "Decision support"
    ],
    "Marketing": [
      "Campaign optimization",
      "Content creation",
      "Audience targeting",
      "Performance analytics",
      "A/B testing"
    ],
    "Social Media": [
      "Content scheduling",
      "Engagement analytics",
      "Hashtag optimization",
      "Audience insights",
      "Competitor analysis"
    ],
    "SEO": [
      "Keyword research",
      "Content optimization",
      "Backlink analysis",
      "Rank tracking",
      "Technical SEO"
    ],
    "Translation": [
      "Multi-language support",
      "Context preservation",
      "Industry-specific terminology",
      "Quality assurance",
      "Batch processing"
    ],
    "Voice": [
      "Voice synthesis",
      "Voice cloning",
      "Emotion detection",
      "Accent modification",
      "Background noise removal"
    ],
    "Music": [
      "Music generation",
      "Style transfer",
      "Instrument separation",
      "Tempo adjustment",
      "Chord progression"
    ],
    "3D": [
      "3D model generation",
      "Texture creation",
      "Animation tools",
      "Scene composition",
      "Rendering optimization"
    ],
    "Other": [
      "Custom workflows",
      "API integration",
      "Data processing",
      "Automation tools",
      "Analytics dashboard"
    ]
  };
  if (category === "Text") {
    switch (toolName) {
      case "Grammarly":
        return [
          "Real-Time Grammar and Spelling Checks: Instantly identifies and corrects grammatical errors and typos as you type.",
          "Writing Style Improvements: Offers suggestions to improve clarity, conciseness, and tone.",
          "Plagiarism Detection: Checks content against billions of web pages to ensure originality.",
          "Tone Detection: Analyzes the tone of your writing to ensure it matches your intended message."
        ];
      case "QuillBot":
        return [
          "Paraphrasing Tool: Rewrites sentences in multiple modes to suit different writing styles.",
          "Grammar Checker: Identifies and corrects grammatical errors to improve writing accuracy.",
          "Summarizer: Condenses articles, papers, or documents into key points.",
          "Citation Generator: Automatically creates citations in various formats like APA, MLA, and Chicago."
        ];
      case "ProWritingAid":
        return [
          "In-Depth Writing Reports: Provides over 20 detailed reports on aspects like overused words, sentence length, and readability.",
          "Style and Grammar Checks: Offers suggestions to enhance writing style and correct grammatical errors.",
          "Integration with Writing Platforms: Compatible with MS Word, Google Docs, Scrivener, and more.",
          "Thesaurus and Word Explorer: Helps diversify vocabulary and find the perfect word for your context."
        ];
      case "Hemingway App":
        return [
          "Readability Score: Assigns a grade level to your writing to gauge its readability.",
          "Highlighting Complex Sentences: Identifies hard-to-read sentences for simplification.",
          "Adverb and Passive Voice Detection: Flags overuse of adverbs and passive constructions.",
          "Formatting Tools: Allows basic formatting like bold, italics, headings, and lists."
        ];
      case "ChatGPT (GPT-4o)":
        return [
          "Conversational Abilities: Engages in coherent and context-aware dialogues.",
          "Multilingual Support: Understands and generates text in multiple languages.",
          "Creative Writing: Assists in composing poems, stories, and essays.",
          "Code Assistance: Helps in writing and debugging code snippets."
        ];
      case "Claude 3":
        return [
          "Constitutional AI: Adheres to a set of ethical principles to ensure safe interactions.",
          "Contextual Understanding: Maintains context over extended conversations.",
          "Summarization: Efficiently summarizes long documents or articles.",
          "Question Answering: Provides accurate answers to a wide range of queries."
        ];
      case "Gemini 1.5 Pro":
        return [
          "Multimodal Processing: Handles various data types, including text and images.",
          "Long Context Understanding: Maintains coherence over long pieces of content.",
          "Integration with Google Services: Seamlessly works with tools like Google Docs and Sheets.",
          "Advanced Reasoning: Capable of complex problem-solving and analytical tasks."
        ];
      case "Jasper AI":
        return [
          "Content Templates: Offers templates for blogs, ads, emails, and more.",
          "Brand Voice Customization: Maintains consistent tone and style across content.",
          "SEO Integration: Optimizes content for search engines.",
          "Team Collaboration: Enables multiple users to work on content simultaneously."
        ];
      case "Copy.ai":
        return [
          "Automated Copywriting: Generates engaging copy for various platforms.",
          "Multiple Language Support: Creates content in several languages.",
          "Tone Adjustment: Tailors the tone of the content to suit different audiences.",
          "Idea Generation: Provides creative ideas for content topics and angles."
        ];
      case "Writer.com":
        return [
          "Style Guide Enforcement: Ensures adherence to brand-specific writing guidelines.",
          "Terminology Management: Maintains consistent use of industry-specific terms.",
          "Real-Time Suggestions: Offers instant feedback to improve clarity and grammar.",
          "Analytics Dashboard: Tracks writing improvements and consistency over time."
        ];
      case "INK for All":
        return [
          "SEO Score: Provides real-time SEO scoring to optimize content.",
          "AI Writer: Generates content based on user input and keywords.",
          "Readability Enhancements: Suggests improvements for better audience engagement.",
          "Content Planning: Assists in strategizing content topics and calendars."
        ];
      case "Wordtune":
        return [
          "Sentence Rewriting: Offers alternative phrasings for better expression.",
          "Tone Adjustments: Modifies tone to be more formal, casual, or enthusiastic.",
          "Shortening and Expanding: Adjusts sentence length as needed.",
          "Multilingual Support: Provides suggestions in multiple languages."
        ];
      case "Sudowrite":
        return [
          "Story Engine: Helps in plotting and developing narratives.",
          "Character Generator: Assists in creating detailed character profiles.",
          "Sensory Descriptions: Enhances writing with vivid sensory details.",
          "Brainstorming Tools: Offers prompts and ideas to inspire creativity."
        ];
      case "Writesonic":
        return [
          "AI Article Writer: Produces long-form articles based on brief inputs.",
          "Landing Page Generator: Creates persuasive landing page content.",
          "Product Descriptions: Crafts compelling descriptions for e-commerce.",
          "Ad Copy Generator: Develops engaging advertisements for various platforms."
        ];
      case "Anyword":
        return [
          "Predictive Performance Score: Estimates how well content will perform.",
          "Audience Targeting: Tailors messages to specific demographics.",
          "A/B Testing: Compares different versions of copy to determine effectiveness.",
          "Content Personalization: Customizes content to resonate with various audience segments."
        ];
      case "Notion AI":
        return [
          "Content Summarization: Condenses long notes or documents into key points.",
          "Idea Generation: Helps brainstorm topics and outlines.",
          "Writing Assistance: Provides grammar and style suggestions.",
          "Task Automation: Automates repetitive tasks within the Notion workspace."
        ];
      case "Perplexity AI":
        return [
          "Natural Language Processing: Understands and responds to queries in everyday language.",
          "Concise Summaries: Delivers brief and relevant answers.",
          "Source Citations: Provides references for the information presented.",
          "Interactive Q&A: Engages in follow-up questions for deeper understanding."
        ];
      default:
        return [
          "AI-powered writing features.",
          "Grammar and style suggestions.",
          "Content generation.",
          "Productivity enhancements."
        ];
    }
  }
  return features[category] || features["Other"];
}

function ReviewForm({ toolId, onReviewSubmitted }: { toolId: string, onReviewSubmitted: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, rating, comment, toolId }),
      });
      if (!res.ok) throw new Error('Failed to submit review');
      setSuccess(true);
      setName('');
      setEmail('');
      setRating(5);
      setComment('');
      onReviewSubmitted();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Rating</label>
        <select value={rating} onChange={e => setRating(Number(e.target.value))} className="w-full border rounded px-3 py-2">
          {[5,4,3,2,1].map(star => <option key={star} value={star}>{star} Star{star > 1 ? 's' : ''}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Comment</label>
        <textarea value={comment} onChange={e => setComment(e.target.value)} required className="w-full border rounded px-3 py-2" />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">Thank you for your review!</div>}
      <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Submitting...' : 'Submit Review'}</button>
    </form>
  );
}

function ReviewsList({ toolId }: { toolId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/review?toolId=${toolId}`)
      .then(res => res.json())
      .then(data => {
        setReviews(data.reviews || []);
        setLoading(false);
      });
  }, [toolId]);

  if (loading) return <div>Loading reviews...</div>;
  if (!reviews.length) return <div>No reviews yet.</div>;
  return (
    <div className="space-y-4">
      {reviews.map((r, i) => (
        <div key={i} className="border rounded p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{r.name}</span>
            <span className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
          </div>
          <div className="text-sm text-gray-600 mb-1">{r.comment}</div>
          <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
} 