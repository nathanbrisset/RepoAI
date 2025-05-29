"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ToolCard from "@/components/tool-card";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowLeft, Star, CheckCircle } from "lucide-react";
import Link from "next/link";
import { mockTools } from "@/lib/data";

export default function RecommendationPage() {
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    setSubmitted(true);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (Array.isArray(data?.recommendations) && data.recommendations.length > 0) {
        setResults(data.recommendations);
      } else {
        setError("No recommendations found");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Top 3 recommended tools
  const topTools = results.filter(r => r?.tool?.id).slice(0, 3);
  const mainTool = topTools[0]?.tool;
  const otherTools = topTools.slice(1);
  // Find 3 more tools in the same category as the main tool, excluding the top 3
  let moreCategoryTools: any[] = [];
  if (mainTool) {
    moreCategoryTools = mockTools
      .filter(tool =>
        tool.id !== mainTool.id &&
        !topTools.find(t => t.tool && t.tool.id === tool.id) &&
        tool.categories.some((cat: string) => mainTool.categories.includes(cat))
      )
      .slice(0, 3);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* AI Match Recommendation Section */}
        <section className="mb-16 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Left side - Image */}
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <img
                src="/ai-match-hero.jpg"
                alt="AI Match"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Right side - Text and Input */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-yellow-400" />
                Find your AI MATCH!
              </h2>
              <p className="text-lg text-gray-600 mb-6">Whatever you need, there's an AI for it!</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  placeholder="Describe what you're trying to accomplish..."
                  className="min-h-[150px] resize-none"
                  name="query"
                  required
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  disabled={loading}
                />
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading || !prompt}>
                  {loading ? "Finding your match..." : "Find my A-Match"}
                </Button>
              </form>
              {error && <div className="text-red-600 text-center mt-4">{error}</div>}
            </div>
          </div>
        </section>

        {/* Results Section */}
        {submitted && (
          <section className="w-full bg-gradient-to-br from-purple-100 via-white to-blue-100 rounded-3xl shadow-xl border border-purple-200 p-12 flex flex-col gap-12 items-stretch relative overflow-hidden mb-12">
            {loading && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600">Finding your perfect AI match...</p>
              </div>
            )}
            {!loading && !error && results.length > 0 && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Research</h2>
                  <div className="bg-white rounded-lg px-6 py-4 text-lg text-gray-700 shadow-sm border border-gray-100">{prompt}</div>
                </div>
                <div className="flex flex-col md:flex-row gap-12 md:gap-16">
                  {/* Left side - Top 3 recommendations as a clean list */}
                  <div className="md:w-1/2 flex flex-col gap-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Top Recommendations</h3>
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
                      {/* You can add more personalized reasons here if needed */}
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <p className="text-gray-700">This tool is highly recommended based on your query.</p>
                      </div>
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
              </>
            )}
            {!loading && !error && results.length === 0 && (
              <div className="text-center text-gray-600">No recommendations yet. Submit your query above!</div>
            )}
          </section>
        )}
      </div>
    </div>
  );
} 