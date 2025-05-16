'use client';

import { useState, useEffect } from 'react';
import { Tool } from '@/lib/types';
import { mockTools } from '@/lib/data';
import { advancedSearch } from '@/lib/recommendation-engine';
import type { FuseResultMatch } from 'fuse.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Helper function to explain why a tool was recommended using Fuse.js match data
function getMatchExplanation(match: FuseResultMatch[] | undefined, tool: Tool, query: string): string {
  if (!match || match.length === 0) {
    return 'Recommended based on overall relevance.';
  }
  const details: string[] = [];
  for (const m of match) {
    if (m.key && typeof m.value === 'string') {
      // Highlight the matched substring(s)
      const matchedFragments = m.indices.map(([start, end]) =>
        m.value?.substring(start, end + 1)
      );
      details.push(
        `${m.key}: ${matchedFragments.map(f => `"${f}"`).join(', ')}`
      );
    }
  }
  if (details.length) {
    return `Matched your search in ${details.join('; ')}.`;
  }
  return 'Recommended based on overall relevance.';
}

export default function AIMatch() {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState<{
    tool: Tool;
    match: FuseResultMatch[] | undefined;
    score: number;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const currentToolId = params?.id as string;

  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true);
      // Simulate API delay for better UX
      const timer = setTimeout(() => {
        const currentTool = currentToolId ? mockTools.find(t => t.id === currentToolId) : undefined;
        
        const results = advancedSearch(mockTools, query, {
          currentTool,
          excludedTools: currentToolId ? [currentToolId] : undefined,
        });
        
        setRecommendations(results);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setRecommendations([]);
    }
  }, [query, currentToolId]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Match</CardTitle>
        <CardDescription>
          Find the perfect AI tools for your needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            placeholder="Describe what you want to do..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {recommendations.length > 0 && (
          <div className="mt-4 space-y-4">
            {recommendations.map(({ tool, match, score }) => (
              <Link
                key={tool.id}
                href={`/tool/${tool.id}`}
                className="block p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex items-start gap-4">
                  {tool.logo && (
                    <img
                      src={tool.logo}
                      alt={tool.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                    <div className="mt-2 flex gap-2">
                      {tool.categories.map((category) => (
                        <span
                          key={category}
                          className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    {/* Why this tool explanation */}
                    <div className="mt-2 text-xs text-foreground/70 italic">
                      {getMatchExplanation(match, tool, query)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 