"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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