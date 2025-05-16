import { Tool } from './types';
import Fuse, { FuseResultMatch } from 'fuse.js';
import type { IFuseOptions } from 'fuse.js';

interface RecommendationFactors {
  categoryMatch: number;
  tagMatch: number;
  ratingWeight: number;
  popularityWeight: number;
  recencyWeight: number;
}

const DEFAULT_FACTORS: RecommendationFactors = {
  categoryMatch: 0.7,    // Weight for category matching (70%)
  tagMatch: 0.15,        // Weight for tag matching (15%)
  ratingWeight: 0.05,    // Weight for tool rating (5%)
  popularityWeight: 0.05, // Weight for visit count (5%)
  recencyWeight: 0.05,   // Weight for how recent the tool was added (5%)
};

// Fuse.js options for semantic search
const fuseOptions: IFuseOptions<Tool> = {
  keys: [
    { name: 'name', weight: 0.3 },
    { name: 'description', weight: 0.2 },
    { name: 'categories', weight: 0.25 },
    { name: 'tags', weight: 0.25 },
  ],
  threshold: 0.4, // Lower is stricter, higher is fuzzier
  includeMatches: true,
  minMatchCharLength: 2,
};

export function calculateToolScore(tool: Tool, factors: RecommendationFactors = DEFAULT_FACTORS): number {
  let score = 0;

  // Rating score (normalized to 0-1)
  const ratingScore = tool.rating / 5;
  score += ratingScore * factors.ratingWeight;

  // Popularity score (normalized using log scale)
  const maxVisits = 180000000; // Based on ChatGPT's visit count
  const popularityScore = Math.log(tool.visits + 1) / Math.log(maxVisits + 1);
  score += popularityScore * factors.popularityWeight;

  // Recency score with exponential decay
  const currentDate = new Date();
  const toolDate = new Date(tool.dateAdded);
  const daysOld = (currentDate.getTime() - toolDate.getTime()) / (1000 * 60 * 60 * 24);
  const recencyScore = Math.exp(-daysOld / 365); // Exponential decay over a year
  score += recencyScore * factors.recencyWeight;

  return score;
}

export function getRecommendations(
  tools: Tool[],
  query: string,
  limit: number = 5,
  factors: RecommendationFactors = DEFAULT_FACTORS
): { tool: Tool; match: FuseResultMatch[] | undefined; score: number }[] {
  const fuse = new Fuse(tools, fuseOptions);
  const fuseResults = fuse.search(query).slice(0, limit * 2); // Get more for diversity

  // Calculate a combined score: Fuse.js score + our scoring
  const scoredResults = fuseResults.map(result => {
    const tool = result.item;
    // Lower Fuse.js score is better, so invert for our scoring
    const fuseScore = 1 - (result.score ?? 1);
    const baseScore = calculateToolScore(tool, factors);
    // Weighted sum: 80% semantic, 20% base
    const totalScore = fuseScore * 0.8 + baseScore * 0.2;
    // Convert readonly array to mutable array for match
    const match = result.matches ? Array.from(result.matches) : undefined;
    return {
      tool,
      match,
      score: totalScore,
    };
  });

  // Sort by combined score
  scoredResults.sort((a, b) => b.score - a.score);

  // Return top N
  return scoredResults.slice(0, limit);
}

// Advanced search function that considers context and relationships
export function advancedSearch(
  tools: Tool[],
  query: string,
  context?: {
    currentTool?: Tool;
    userPreferences?: string[];
    excludedTools?: string[];
  }
): { tool: Tool; match: FuseResultMatch[] | undefined; score: number }[] {
  // Customize factors based on context
  const factors = { ...DEFAULT_FACTORS };
  if (context?.currentTool) {
    factors.categoryMatch *= 1.2;
  }
  if (context?.userPreferences?.length) {
    factors.tagMatch *= 1.3;
  }

  // Get initial recommendations
  let recommendations = getRecommendations(tools, query, 10, factors);

  // Apply context-based filtering
  if (context?.excludedTools) {
    recommendations = recommendations.filter(
      r => !context.excludedTools?.includes(r.tool.id)
    );
  }

  // Apply diversity in results
  const diverseResults: typeof recommendations = [];
  const usedCategories = new Set<string>();
  for (const rec of recommendations) {
    const isNewCategory = rec.tool.categories.some(cat => !usedCategories.has(cat));
    if (isNewCategory || diverseResults.length < 3) {
      diverseResults.push(rec);
      rec.tool.categories.forEach(cat => usedCategories.add(cat));
    }
    if (diverseResults.length >= 5) break;
  }
  return diverseResults;
} 