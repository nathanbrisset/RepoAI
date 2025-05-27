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
  // Find all tool names mentioned in the explanation (case-insensitive, match mockTools)
  const mentioned: Tool[] = [];
  const toolNames = mockTools.map(t => t.name.toLowerCase());
  const regex = /\b([A-Za-z0-9\-.]+)\b/g;
  let match;
  while ((match = regex.exec(explanation)) !== null) {
    const idx = toolNames.indexOf(match[1].toLowerCase());
    if (idx !== -1) {
      const tool = mockTools[idx];
      if (tool.id !== mainTool.id && !mentioned.find(t => t.id === tool.id)) {
        mentioned.push(tool);
      }
    }
  }
  return mentioned;
}

// Add a function to extract the visitor's query from searchParams
function getVisitorQuery(searchParams: any): string {
  return searchParams.get('query') || '';
}

// Add a function to extract top 3 tools and reasons from the explanation
function extractTopToolsAndReasons(explanation: string): { tool: Tool, reason: string }[] {
  // This is a simple heuristic: look for tool names in the explanation and grab the sentence after
  const results: { tool: Tool, reason: string }[] = [];
  const toolNames = mockTools.map(t => t.name.toLowerCase());
  const sentences = explanation.split(/(?<=\.)\s+/);
  for (let i = 0; i < sentences.length; i++) {
    for (const tool of mockTools) {
      const regex = new RegExp(`\\b${tool.name}\\b`, 'i');
      if (regex.test(sentences[i]) && !results.find(r => r.tool.id === tool.id)) {
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

export default function MatchResultsPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);

  // Get related tools (same category, excluding the current tool)
  const relatedTools = result ? mockTools
    .filter(tool => 
      tool.id !== result.tool.id && 
      tool.categories.some(cat => result.tool.categories.includes(cat))
    )
    .slice(0, 3) : [];

  useEffect(() => {
    const query = searchParams.get('query');
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
        setResult(data);
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

  if (!result) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Match Found</h1>
          <p className="text-gray-600 mb-8">We couldn't find a perfect match for your needs. Try being more specific or try a different query.</p>
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

  // Get all mentioned tools in the explanation (excluding the main one)
  const mentionedTools = extractMentionedTools(result.explanation, result.tool);

  const visitorQuery = getVisitorQuery(searchParams);
  const topTools = extractTopToolsAndReasons(result.explanation);
  const topPick = topTools[0];
  const secondPick = topTools[1];
  const thirdPick = topTools[2];
  // Get 3 more tools from the same category, excluding the top 3
  const moreCategoryTools = result ? mockTools
    .filter(tool =>
      tool.id !== result.tool.id &&
      (!topTools.find(t => t.tool.id === tool.id)) &&
      tool.categories.some(cat => result.tool.categories.includes(cat))
    )
    .slice(0, 3) : [];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <Link href="/" className="inline-block mb-8 ml-8">
        <Button variant="ghost" className="text-gray-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>

      {/* Hero Section - Less Wide, Centered */}
      <div className="w-full bg-gradient-to-br from-purple-100 via-white to-blue-100 rounded-3xl shadow-xl border border-purple-200 p-12 flex flex-col md:flex-row gap-12 items-stretch relative overflow-hidden mb-12">
        {/* Left: Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Research</h2>
            <div className="bg-white rounded-lg px-6 py-4 text-lg text-gray-700 shadow-sm border border-gray-100">{visitorQuery}</div>
          </div>
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Based on your need, we recommend these tools:</h3>
            <ol className="space-y-4 list-decimal list-inside">
              {topTools.map((item, idx) => (
                <li key={item.tool.id} className="text-lg">
                  <span className="font-bold text-purple-700">{idx + 1}. {item.tool.name}</span> : <span className="text-gray-700">{getPersonalizedReason(item.tool, visitorQuery, idx)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          {topPick && (
            <div className="mb-8">
              <h3 className="text-2xl font-extrabold text-yellow-500 flex items-center gap-2 mb-2">
                Our AI NINJA Pick: <span className="text-purple-700">{topPick.tool.name}</span>
              </h3>
              <div className="text-gray-800 text-lg font-semibold">
                {getNinjaPickReason(topPick.tool)}
              </div>
            </div>
          )}
        </div>
        {/* Right: Top Pick Card */}
        <div className="flex-shrink-0 w-full md:w-[400px] flex flex-col items-center justify-center relative">
          <div className="absolute -top-4 -right-4 z-10">
            <img
              src="/top-pick.png"
              alt="Top Pick"
              className="w-24 h-24 rounded-full shadow-lg border-4 border-white object-cover"
            />
          </div>
          {topPick && <ToolCard tool={topPick.tool} />}
        </div>
      </div>

      {/* Under: 2 Big Cards for Choice 2 and 3 */}
      {(secondPick || thirdPick) && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 px-8">
          {secondPick && <ToolCard tool={secondPick.tool} />}
          {thirdPick && <ToolCard tool={thirdPick.tool} />}
        </div>
      )}

      {/* Under: 3 More Cards from Category */}
      {moreCategoryTools.length > 0 && (
        <div className="w-full px-8">
          <h2 className="text-xl font-semibold mb-4">Other Tools in this Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {moreCategoryTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 