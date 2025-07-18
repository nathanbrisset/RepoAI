'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import ToolCard from "@/components/tool-card";
import { mockTools } from "@/lib/data";
import type { Tool } from "@/lib/types";
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface MatchResult {
  tool: Tool;
  explanation: string;
}

// Utility to rewrite explanation in second person
function toSecondPerson(text: string): string {
  return text
    .replace(/\bthe user\b/gi, 'you')
    .replace(/\busers\b/gi, 'you')
    .replace(/\bthey\b/gi, 'you')
    .replace(/\btheir\b/gi, 'your')
    .replace(/\bthem\b/gi, 'you')
    .replace(/\byour needs\b/gi, 'you need')
    .replace(/\byourself\b/gi, 'yourself')
    .replace(/\byou\s+can\b/gi, 'you can')
    .replace(/\byou\s+will\b/gi, 'you will');
}

function formatExplanation(explanation: string, toolName: string): Array<React.ReactNode> {
  // Split into paragraphs by double line breaks or period+space
  return toSecondPerson(explanation)
    .split(/\n\n|(?<=\.)\s+(?=[A-Z])/)
    .filter(Boolean)
    .map((para, idx) => {
      // Find all tool names in the paragraph and wrap them in links
      const toolRegex = /\b([A-Za-z0-9-]+)\b/g;
      const withLinks = para.replace(toolRegex, (match) => {
        const tool = mockTools.find(t => t.name.toLowerCase() === match.toLowerCase());
        if (tool) {
          return `<a href="/tool/${tool.id}" class="font-bold text-purple-600 hover:text-purple-800">${match}</a>`;
        }
        return match;
      });
      return (
        <p key={idx} className="mb-3 text-gray-700" dangerouslySetInnerHTML={{ __html: withLinks }} />
      );
    });
}

function extractMentionedTools(explanation: string, mainTool: Tool): Tool[] {
  if (!explanation || !mainTool?.id) return [];
  
  // Find all tool names mentioned in the explanation (case-insensitive, match mockTools)
  const mentioned: Tool[] = [];
  const toolNames = mockTools.map(t => t.name.toLowerCase());
  const regex = /\b([A-Za-z0-9\-.]+)\b/g;
  let match;
  while ((match = regex.exec(explanation)) !== null) {
    const idx = toolNames.indexOf(match[1].toLowerCase());
    if (idx !== -1) {
      const tool = mockTools[idx];
      if (tool?.id && tool.id !== mainTool.id && !mentioned.find(t => t?.id === tool.id)) {
        mentioned.push(tool);
      }
    }
  }
  return mentioned;
}

// Add a function to extract the visitor's query from searchParams
function getVisitorQuery(searchParams: any): string {
  return searchParams?.get('query') || '';
}

// Add a function to extract top 3 tools and reasons from the explanation
function extractTopToolsAndReasons(explanation: string): { tool: Tool, reason: string }[] {
  if (!explanation) return [];
  
  // This is a simple heuristic: look for tool names in the explanation and grab the sentence after
  const results: { tool: Tool, reason: string }[] = [];
  const toolNames = mockTools.map(t => t.name.toLowerCase());
  const sentences = explanation.split(/(?<=\.)\s+/);
  for (let i = 0; i < sentences.length; i++) {
    for (const tool of mockTools) {
      if (!tool?.id) continue;
      const regex = new RegExp(`\\b${tool.name}\\b`, 'i');
      if (regex.test(sentences[i]) && !results.find(r => r?.tool?.id === tool.id)) {
        // Try to get the next sentence as the reason, or use the current one
        const reason = sentences[i + 1] ? sentences[i + 1].trim() : sentences[i].trim();
        results.push({ tool, reason });
        if (results.length === 3) return results;
      }
    }
  }
  return results;
}

const getPersonalizedReason = (tool: Tool, query: string, index: number = 0) => {
  const queryLower = query.toLowerCase();
  const features = tool.features || [];
  const tags = tool.tags || [];

  // Friendly, unique starters
  const starters = [
    `I'd suggest giving ${tool.name} a try`,
    `Another great option would be ${tool.name}`,
    `If you're looking for ${features[0]?.toLowerCase() || 'something awesome'}, ${tool.name} is worth considering`,
    `You might want to check out ${tool.name}`,
    `For your needs, ${tool.name} could be perfect`
  ];
  const selectedStarter = starters[index % starters.length];

  // Friendly, human highlights
  const highlights = [
    `Honestly, the way it handles ${features[1]?.toLowerCase() || 'your tasks'} is just so smooth—you'll wonder how you managed before`,
    `What I love is how it just gets things done without making you jump through hoops`,
    `Trust me, the ${features[2]?.toLowerCase() || 'workflow'} here is a total time-saver`,
    `If I were you, I'd use it for ${features[3]?.toLowerCase() || 'making life easier'}—it's that good`,
    `I've seen this work wonders for people who want ${features[4]?.toLowerCase() || 'results fast'}`
  ];
  // Pick a highlight based on index for variety
  const selectedHighlight = highlights[index % highlights.length];

  // Friendly, human closings
  const closings = [
    `You'll pick it up in no time, and if you get stuck, there's always someone online to help out.`,
    `Seriously, I'd recommend it to anyone—even my mom could use it.`,
    `If you try it, let me know what you think—I bet you'll be impressed.`,
    `It's one of those tools you end up telling your friends about.`,
    `Give it a shot, you won't regret it!`
  ];
  // Pick a closing based on index for variety
  const selectedClosing = closings[index % closings.length];

  return `${selectedStarter}. ${selectedHighlight}. ${selectedClosing}`;
};

// Short, punchy, unique sentence for the Ninja Pick
const getNinjaPickReason = (tool: Tool) => {
  const ninjaPhrases = [
    `This is the one I'd grab first, no question.`,
    `If you want my honest pick, go with this!`,
    `My top choice, hands down.`,
    `If I had to pick just one, it's this.`,
    `This is the real MVP here.`,
    `Trust me, this is the winner.`,
    `This one's a game changer.`,
    `If you want to play it smart, start here.`,
    `This is the tool I'd tell my best friend to use.`,
    `You can't go wrong with this one.`
  ];
  // Pick a phrase based on tool id hash for variety
  const idx = Math.abs(tool.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % ninjaPhrases.length;
  return ninjaPhrases[idx];
};

// Add a function to generate a personalized intro based on the query
function getPersonalizedIntro(query: string): string {
  if (!query) return "Here are the best tools we recommend for your project:";
  const q = query.toLowerCase();
  if (q.includes("newsletter")) {
    return "You want to build a newsletter. That's a fantastic way to engage your audience and share valuable content. Here are the best tools to help you get started:";
  }
  if (q.includes("website")) {
    return "You want to build a website. Creating a professional online presence is a great step for your business. Here are the top tools to help you succeed:";
  }
  if (q.includes("blog")) {
    return "You want to start a blog. Sharing your ideas online is a powerful way to connect with others. Here are the best tools to launch your blog:";
  }
  if (q.includes("marketing")) {
    return "You want to improve your marketing. Leveraging the right tools can help you reach more people and grow your brand. Here are our top recommendations:";
  }
  // Add more cases as needed
  return `You want to ${query}. Here are the best tools we recommend to help you in this journey:`;
}

function humanizePrompt(prompt: string): string {
  if (!prompt) return '';
  let p = prompt.trim();
  // Remove common leading phrases
  p = p.replace(/^i (would like to|want to|need to|wish to|plan to|am trying to|am looking to|am here to|would love to|hope to|aim to|intend to|am interested in|am seeking to|am planning to|am hoping to|am working to|am working on|am aiming to|am going to|am about to|am eager to|am excited to|am ready to|am set to|am here for|am here because|am here|would like|want|need|wish|plan|try|look|seek|hope|aim|intend|work|work on|aim|go|about|eager|excited|ready|set|here for|here because|here)\s+/i, '');
  // Capitalize first letter
  p = p.charAt(0).toUpperCase() + p.slice(1);
  // Remove trailing punctuation
  p = p.replace(/[.!?]+$/, '');
  return p;
}

function isGibberish(prompt: string): boolean {
  if (!prompt) return true;
  const p = prompt.trim();
  if (p.length < 3) return true;
  // No vowels or mostly non-alphabetic
  if (!/[aeiou]/i.test(p) || /[^a-zA-Z0-9\s]/.test(p) && p.replace(/[^a-zA-Z]/g, '').length < 3) return true;
  // Looks like random letters
  if (/^[a-z]{3,}$/i.test(p) && !/(the|and|for|you|with|that|this|from|have|are|was|were|has|had|not|but|all|any|can|her|his|its|our|out|use|who|how|man|new|now|one|see|two|way|may|day|get|make|like|time|no|just|him|know|take|into|year|your|good|some|could|them|other|than|then|these|so|would|about|up|will|what|which|their|if|do|said|each|she|which|do|their|if|will|up|other|about|out|many|then|them|these|so|some|her|would|make|like|him|into|time|has|look|two|more|write|go|see|number|way|could|people|my|than|first|water|been|call|who|oil|its|now|find|long|down|day|did|get|come|made|may|part)/i.test(p)) return true;
  return false;
}

// Add getTopWritingTools for gibberish fallback (same as in /recommendation)
const getTopWritingTools = () => {
  return [
    {
      tool: mockTools.find(tool => tool.id === 'grammarly'),
      explanation: `Grammarly is like having a writing coach by your side. It catches grammar and spelling mistakes instantly, so you can write with confidence. If you want your writing to sound polished and professional, this is a must-try!`
    },
    {
      tool: mockTools.find(tool => tool.id === 'quillbot'),
      explanation: `QuillBot is perfect if you ever get stuck rephrasing a sentence or want to say something in a new way. It helps you rewrite your ideas clearly and keeps your meaning intact. Give it a go when you want your words to really shine!`
    },
    {
      tool: mockTools.find(tool => tool.id === 'prowritingaid'),
      explanation: `ProWritingAid is your all-in-one writing buddy. It not only checks grammar but also gives you tips on style and readability. If you want to level up your writing and learn as you go, this tool is a fantastic companion!`
    }
  ];
};

export default function MatchResultsPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<MatchResult[]>([]);

  useEffect(() => {
    const query = searchParams?.get('query');
    if (!query) {
      setError('No query provided');
      setLoading(false);
      return;
    }

    const fetchRecommendation = async () => {
      try {
        const response = await fetch('/api/recommend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: query }),
        });

        if (!response.ok) {
          throw new Error('Failed to get recommendation');
        }

        const data = await response.json();
        if (Array.isArray(data?.recommendations) && data.recommendations.length > 0) {
          setResults(data.recommendations);
        } else {
          setError('No recommendations found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Finding your perfect AI match...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const visitorQuery = getVisitorQuery(searchParams);
  const gibberish = isGibberish(visitorQuery);

  // Top 3 recommended tools
  const topTools = results.filter(r => r?.tool?.id).slice(0, 3);
  const mainTool = topTools[0]?.tool;
  const mainExplanation = topTools[0]?.explanation;
  const otherTools = topTools.slice(1);

  // Find 3 more tools in the same category as the main tool, excluding the top 3
  let moreCategoryTools: Tool[] = [];
  if (mainTool) {
    moreCategoryTools = mockTools
      .filter(tool =>
        tool.id !== mainTool.id &&
        !topTools.find(t => t.tool && t.tool.id === tool.id) &&
        tool.categories.some(cat => mainTool.categories.includes(cat))
      )
      .slice(0, 3);
  }

  // If gibberish, show writing tools and message, hide main card/other sections
  if (gibberish) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col md:flex-row gap-4 mb-8 ml-8">
          <Link href="/" className="inline-block">
            <Button variant="ghost" className="text-gray-600">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/recommendation" className="inline-block ml-auto">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Make a New Research
            </Button>
          </Link>
        </div>
        <div className="w-full bg-gradient-to-br from-purple-100 via-white to-blue-100 rounded-3xl shadow-xl border border-purple-200 p-12 flex flex-col gap-12 items-stretch relative overflow-hidden mb-12">
          <div className="mb-0">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Research</h2>
            <div className="bg-white rounded-lg px-6 py-4 text-lg text-gray-700 shadow-sm border border-gray-100">{visitorQuery}</div>
          </div>
          <div className="mb-8">
            <p className="text-lg text-gray-700">
              <span className="text-purple-700 font-bold">Here are the top writing AI assistants that can help you craft better prompts:</span>
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-12 md:gap-16">
            <div className="md:w-1/2 flex flex-col gap-8">
              {getTopWritingTools().map((item, idx) => (
                item?.tool?.id && (
                  <div key={item.tool.id} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-base border border-purple-200">{idx + 1}</div>
                    <div>
                      <div className="font-semibold text-lg text-gray-900 mb-1">{item.tool.name}</div>
                      <p className="text-gray-600 text-base leading-relaxed">{item.explanation}</p>
                    </div>
                  </div>
                )
              ))}
            </div>
            <div className="md:w-1/2 flex flex-col justify-start"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No recommendations yet. Submit your query above!</h1>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <div className="flex flex-col md:flex-row gap-4 mb-8 ml-8">
        <Link href="/" className="inline-block">
          <Button variant="ghost" className="text-gray-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <Link href="/recommendation" className="inline-block ml-auto">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            Make a New Research
          </Button>
        </Link>
      </div>
      <div className="w-full bg-gradient-to-br from-purple-100 via-white to-blue-100 rounded-3xl shadow-xl border border-purple-200 p-12 flex flex-col gap-12 items-stretch relative overflow-hidden mb-12">
        <div className="mb-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Research</h2>
          <div className="bg-white rounded-lg px-6 py-4 text-lg text-gray-700 shadow-sm border border-gray-100">{visitorQuery}</div>
        </div>
        <div className="mb-8">
          <p className="text-lg text-gray-700">
            <span className="text-purple-700 font-bold">{`Your goal: ${humanizePrompt(visitorQuery)}.`}</span> With the right AI tools, you'll unlock new possibilities and make your work easier. <span className="text-blue-600 font-bold">Here are the top AI tools we recommend:</span>
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-12 md:gap-16">
          {/* Left side - Top 3 recommendations as a clean list */}
          <div className="md:w-1/2 flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              {topTools.map((item, idx) => (
                item?.tool?.id && (
                  <div key={item.tool.id} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-base border border-purple-200">{idx + 1}</div>
                    <div>
                      <div className="font-semibold text-lg text-gray-900 mb-1">{item.tool.name}</div>
                      <p className="text-gray-600 text-base leading-relaxed">{item.explanation}</p>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
          {/* Right side - Main recommendation minimal card */}
          <div className="md:w-1/2 flex flex-col justify-start">
            {mainTool && (
              <div className="bg-white rounded-2xl border border-purple-100 p-8 relative overflow-visible">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <h3 className="text-lg font-bold text-purple-700">Our Top Pick</h3>
                </div>
                {/* Top Pick badge image */}
                <img src="/top-pick.png" alt="Top Pick" className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 -mt-8 -mr-8 z-10 drop-shadow-lg rounded-full" />
                <ToolCard tool={mainTool} />
              </div>
            )}
          </div>
        </div>
        {/* Top recommendation and reasons */}
        {mainTool && (
          <div className="bg-white rounded-xl p-8 border border-gray-100 mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Why {mainTool.name} is Perfect for You</h3>
            <div className="space-y-4">
              {mainTool.features?.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">{feature}</p>
                </div>
              ))}
              {mainExplanation && (
                <div className="flex items-start gap-3 mt-4">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">{mainExplanation}</p>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Other two recommendations as cards */}
        {otherTools.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Great Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherTools.map(tool => (
                tool?.tool?.id && (
                  <div key={tool.tool.id} className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <ToolCard tool={tool.tool} />
                    <div className="mt-4">
                      <p className="text-gray-600">{tool.explanation}</p>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
        {/* More tools from the same category */}
        {moreCategoryTools.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">More in this Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {moreCategoryTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 