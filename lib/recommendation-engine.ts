import { Tool } from './types';
import Fuse, { FuseResultMatch } from 'fuse.js';
import type { IFuseOptions } from 'fuse.js';

interface RecommendationFactors {
  categoryMatch: number;
  tagMatch: number;
  ratingWeight: number;
  popularityWeight: number;
  recencyWeight: number;
  featureMatch: number;
  useCaseMatch: number;
}

const DEFAULT_FACTORS: RecommendationFactors = {
  categoryMatch: 0.25,    // Weight for category matching
  tagMatch: 0.15,         // Weight for tag matching
  ratingWeight: 0.10,     // Weight for tool rating
  popularityWeight: 0.10, // Weight for visit count
  recencyWeight: 0.10,    // Weight for how recent the tool was added
  featureMatch: 0.15,     // Weight for feature matching
  useCaseMatch: 0.15      // Weight for use case matching
};

// Enhanced Fuse.js options for semantic search
const fuseOptions: IFuseOptions<Tool> = {
  keys: [
    { name: 'name', weight: 0.3 },
    { name: 'description', weight: 0.2 },
    { name: 'categories', weight: 0.2 },
    { name: 'tags', weight: 0.2 },
    { name: 'features', weight: 0.1 }
  ],
  threshold: 0.4,
  includeMatches: true,
  minMatchCharLength: 2,
  useExtendedSearch: true,
  distance: 100,
  location: 0,
};

// Common use cases and their related keywords
const USE_CASES = {
  'content_creation': ['write', 'create', 'generate', 'content', 'blog', 'article', 'copy'],
  'image_generation': ['image', 'picture', 'photo', 'art', 'design', 'visual'],
  'video_editing': ['video', 'edit', 'create', 'produce', 'animation'],
  'audio_processing': ['audio', 'voice', 'sound', 'music', 'podcast'],
  'data_analysis': ['analyze', 'data', 'insights', 'metrics', 'analytics'],
  'coding_assistance': ['code', 'programming', 'development', 'debug', 'build'],
  'research': ['research', 'study', 'analyze', 'discover', 'investigate'],
  'marketing': ['marketing', 'campaign', 'promote', 'advertise', 'social'],
  'productivity': ['productivity', 'efficiency', 'automate', 'workflow', 'task'],
  'design': ['design', 'layout', 'ui', 'ux', 'graphic', 'visual']
};

export function calculateToolScore(tool: Tool, query: string, factors: RecommendationFactors = DEFAULT_FACTORS): number {
  let score = 0;
  const queryLower = query.toLowerCase();

  // Rating score (normalized to 0-1)
  const ratingScore = tool.rating / 5;
  score += ratingScore * factors.ratingWeight;

  // Popularity score (normalized using log scale)
  const maxVisits = 180000000;
  const popularityScore = Math.log(tool.visits + 1) / Math.log(maxVisits + 1);
  score += popularityScore * factors.popularityWeight;

  // Recency score with exponential decay
  const currentDate = new Date();
  const toolDate = new Date(tool.dateAdded);
  const daysOld = (currentDate.getTime() - toolDate.getTime()) / (1000 * 60 * 60 * 24);
  const recencyScore = Math.exp(-daysOld / 365);
  score += recencyScore * factors.recencyWeight;

  // Use case matching
  const useCaseScore = Object.entries(USE_CASES).reduce((maxScore, [useCase, keywords]) => {
    const matches = keywords.filter(keyword => queryLower.includes(keyword));
    return Math.max(maxScore, matches.length / keywords.length);
  }, 0);
  score += useCaseScore * factors.useCaseMatch;

  // Feature matching
  if (tool.features) {
    const featureMatches = tool.features.filter(feature => 
      queryLower.split(' ').some(word => 
        feature.toLowerCase().includes(word)
      )
    ).length;
    const featureScore = featureMatches / Math.max(tool.features.length, 1);
    score += featureScore * factors.featureMatch;
  }

  return score;
}

export function getRecommendations(
  tools: Tool[],
  query: string,
  limit: number = 5,
  factors: RecommendationFactors = DEFAULT_FACTORS
): { tool: Tool; match: FuseResultMatch[] | undefined; score: number; reasons: string[] }[] {
  const fuse = new Fuse(tools, fuseOptions);
  const fuseResults = fuse.search(query).slice(0, limit * 2);

  // Calculate a combined score with reasons
  const scoredResults = fuseResults.map(result => {
    const tool = result.item;
    const fuseScore = 1 - (result.score ?? 1);
    const baseScore = calculateToolScore(tool, query, factors);
    const totalScore = fuseScore * 0.6 + baseScore * 0.4;
    const match = result.matches ? Array.from(result.matches) : undefined;

    // Generate reasons for the match
    const reasons: string[] = [];
    if (match) {
      match.forEach(m => {
        if (m.key && typeof m.value === 'string') {
          const matchedFragments = m.indices.map(([start, end]) =>
            m.value?.substring(start, end + 1)
          );
          reasons.push(`Matched in ${m.key}: ${matchedFragments.map(f => `"${f}"`).join(', ')}`);
        }
      });
    }

    // Add use case matches
    Object.entries(USE_CASES).forEach(([useCase, keywords]) => {
      const matches = keywords.filter(keyword => query.toLowerCase().includes(keyword));
      if (matches.length > 0) {
        reasons.push(`Matches use case: ${useCase.replace('_', ' ')}`);
      }
    });

    return {
      tool,
      match,
      score: totalScore,
      reasons
    };
  });

  // Sort by combined score
  scoredResults.sort((a, b) => b.score - a.score);

  // Return top N with reasons
  return scoredResults.slice(0, limit);
}

export function advancedSearch(
  tools: Tool[],
  query: string,
  context?: {
    currentTool?: Tool;
    userPreferences?: string[];
    excludedTools?: string[];
    useCase?: string;
  }
): { tool: Tool; match: FuseResultMatch[] | undefined; score: number; reasons: string[] }[] {
  // Customize factors based on context
  const factors = { ...DEFAULT_FACTORS };
  
  if (context?.currentTool) {
    factors.categoryMatch *= 1.2;
    factors.featureMatch *= 1.3;
  }
  
  if (context?.userPreferences?.length) {
    factors.tagMatch *= 1.3;
    factors.useCaseMatch *= 1.2;
  }

  if (context?.useCase) {
    factors.useCaseMatch *= 1.5;
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
  const usedUseCases = new Set<string>();

  for (const rec of recommendations) {
    const isNewCategory = rec.tool.categories.some(cat => !usedCategories.has(cat));
    const isNewUseCase = rec.tool.tags?.some(tag => !usedUseCases.has(tag));
    
    if (isNewCategory || isNewUseCase || diverseResults.length < 3) {
      diverseResults.push(rec);
      rec.tool.categories.forEach(cat => usedCategories.add(cat));
      rec.tool.tags?.forEach(tag => usedUseCases.add(tag));
    }
    
    if (diverseResults.length >= 5) break;
  }

  return diverseResults;
} 