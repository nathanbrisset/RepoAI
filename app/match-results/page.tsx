import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import ToolCard from "@/components/tool-card";
import { mockTools } from "@/lib/data";
import type { Tool } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";

interface MatchResult {
  tool: Tool;
  explanation: string;
}

type PageProps = {
  searchParams: { query?: string }
}

export default async function MatchResultsPage({ searchParams }: PageProps) {
  const query = searchParams?.query;
  
  if (!query) {
    notFound();
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/recommend`, {
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
  const results = data?.recommendations || [];
  const intro = data?.intro || "";

  if (!results.length) {
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

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-4">Your AI Match Results</h1>
        <p className="text-gray-600">{intro}</p>
      </div>

      {/* Main Tool */}
      {mainTool && (
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img
                src={mainTool.image}
                alt={mainTool.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-2">{mainTool.name}</h2>
              <p className="text-gray-600 mb-4">{mainTool.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {mainTool.categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1">{mainTool.rating}</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="ml-1">Popular</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="ml-1">Updated recently</span>
                </div>
              </div>
              <Link href={mainTool.url} target="_blank" rel="noopener noreferrer">
                <Button className="w-full md:w-auto">
                  Visit Website
                </Button>
              </Link>
            </div>
          </div>
          {mainExplanation && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Why this tool matches your needs:</h3>
              <p className="text-gray-600">{mainExplanation}</p>
            </div>
          )}
        </Card>
      )}

      {/* Other Recommended Tools */}
      {otherTools.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Other Great Matches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherTools.map((result) => (
              <ToolCard key={result.tool.id} tool={result.tool} />
            ))}
          </div>
        </div>
      )}

      {/* More Tools in Same Category */}
      {moreCategoryTools.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">More Tools in This Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {moreCategoryTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 