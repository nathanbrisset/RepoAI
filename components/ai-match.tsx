'use client';

import { useState, useEffect } from 'react';
import { Tool } from '@/lib/types';
import { advancedSearch } from '@/lib/recommendation-engine';
import { useRouter } from 'next/navigation';
import { Sparkles, Search, ArrowRight, Star, TrendingUp, Clock } from 'lucide-react';

interface AIMatchProps {
  tools: Tool[];
}

export function AIMatch({ tools }: AIMatchProps) {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState<{
    tool: Tool;
    match: any;
    score: number;
    reasons: string[];
  }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        setIsLoading(true);
        const results = advancedSearch(tools, query, {
          useCase: query.toLowerCase().includes('create') ? 'content_creation' : undefined
        });
        setRecommendations(results);
        setIsLoading(false);
      } else {
        setRecommendations([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, tools]);

  const handleToolSelect = (toolId: string) => {
    router.push(`/tool/${toolId}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          Find your AI MATCH!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Describe what you need, and we'll find the perfect AI tool for you
        </p>
      </div>

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., I need to create engaging blog posts..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {isLoading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="mt-4 space-y-4">
            {recommendations.map(({ tool, reasons }) => (
              <div
                key={tool.id}
                onClick={() => handleToolSelect(tool.id)}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{tool.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>{tool.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{tool.visits.toLocaleString()} visits</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(tool.dateAdded).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
                
                {reasons.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Why this matches:
                    </h4>
                    <ul className="space-y-1">
                      {reasons.slice(0, 2).map((reason, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                          • {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {query && !isLoading && recommendations.length === 0 && (
          <div className="mt-4 text-center text-gray-500 dark:text-gray-400">
            No tools found matching your criteria. Try different keywords or be more specific.
          </div>
        )}
      </div>
    </div>
  );
} 