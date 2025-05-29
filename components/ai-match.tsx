'use client';

import { useState, useEffect } from 'react';
import { Tool } from '@/lib/types';
import { advancedSearch } from '@/lib/recommendation-engine';
import { useRouter } from 'next/navigation';
import { Sparkles, Search, ArrowRight, Star, TrendingUp, Clock, ExternalLink } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get recommendation');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error getting recommendation:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            Describe what you want to do
          </label>
          <textarea
            id="prompt"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={4}
            placeholder="e.g., I want to create a beautiful landing page for my startup"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Finding your match...
            </>
          ) : (
            'Find your AI MATCH!'
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-medium text-green-800">Your AI Match:</h3>
          <p className="mt-2 text-sm text-green-700">{result.recommendation}</p>
          {result.tool && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-green-800">Recommended Tool:</h4>
              <p className="mt-1 text-sm text-green-700">{result.tool.name}</p>
              <p className="mt-1 text-sm text-green-600">{result.tool.description}</p>
            </div>
          )}
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
  );
} 